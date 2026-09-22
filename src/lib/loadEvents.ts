import { Buffer } from "buffer";
import matter from "gray-matter";

// gray-matter expects Node's Buffer in the browser
(globalThis as unknown as { Buffer: typeof Buffer }).Buffer = Buffer;

export type EventStatus = "upcoming" | "live" | "past";

export interface EventHost {
  name: string;
  logo?: string;
}

export interface EventRegister {
  label: string;
  url: string;
}

export interface EventMeta {
  slug: string;
  title: string;
  summary: string;
  status: EventStatus;
  start: string;
  end?: string;
  timezone?: string;
  format?: string;
  location?: string;
  hosts: EventHost[];
  cover?: string;
  register?: EventRegister;
}

export type EventSectionKind = "markdown" | "cards" | "faq" | "generic";

export interface EventCardItem {
  title: string;
  body: string;
}

export interface EventFaqItem {
  question: string;
  answer: string;
}

export interface EventSection {
  id: string;
  title: string;
  kind: EventSectionKind;
  /** Raw markdown body for markdown/generic sections */
  body?: string;
  cards?: EventCardItem[];
  faq?: EventFaqItem[];
}

export interface EventData {
  meta: EventMeta;
  sections: EventSection[];
}

const MARKDOWN_HEADINGS = new Set([
  "about",
  "schedule",
  "rules",
  "important notes",
  "contact",
]);

const CARD_HEADINGS = new Set(["prizes", "rewards", "judges"]);

const FAQ_HEADINGS = new Set(["faq"]);

const eventModules = import.meta.glob("/events/**/event.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const assetModules = import.meta.glob("/events/**/assets/*", {
  eager: true,
  query: "?url&no-inline",
  import: "default",
}) as Record<string, string>;

function slugFromEventPath(path: string): string | null {
  const normalized = path.replace(/\\/g, "/");
  const match = normalized.match(/events\/([^/]+)\/event\.md$/);
  if (!match) return null;
  const slug = match[1];
  if (slug.startsWith("_")) return null;
  return slug;
}

function slugFromAssetPath(
  path: string,
): { slug: string; file: string } | null {
  const normalized = path.replace(/\\/g, "/");
  const match = normalized.match(/events\/([^/]+)\/assets\/(.+)$/);
  if (!match) return null;
  return { slug: match[1], file: match[2] };
}

const assetsBySlug = (() => {
  const map = new Map<string, Map<string, string>>();
  for (const [path, url] of Object.entries(assetModules)) {
    const parsed = slugFromAssetPath(path);
    if (!parsed || parsed.slug.startsWith("_")) continue;
    let files = map.get(parsed.slug);
    if (!files) {
      files = new Map();
      map.set(parsed.slug, files);
    }
    files.set(parsed.file, url);
  }
  return map;
})();

function resolveAssetUrl(slug: string, ref: string | undefined): string | undefined {
  if (!ref) return undefined;
  const cleaned = ref.replace(/^\.\//, "").replace(/^assets\//, "");
  const url = assetsBySlug.get(slug)?.get(cleaned);
  return url ?? (ref.startsWith("http") || ref.startsWith("/") ? ref : undefined);
}

function rewriteAssetPaths(slug: string, markdown: string): string {
  return markdown.replace(
    /(!?\[[^\]]*\]\()(\.\/)?assets\/([^)\s]+)(\))/g,
    (_full, prefix: string, _dot: string, file: string, suffix: string) => {
      const url = assetsBySlug.get(slug)?.get(file);
      return `${prefix}${url ?? `./assets/${file}`}${suffix}`;
    },
  );
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** True when section body has no meaningful content (whitespace / empty headings only). */
function isSectionBlank(body: string): boolean {
  const trimmed = body.trim();
  if (!trimmed) return true;
  const text = trimmed
    .replace(/^#{1,6}\s+.*$/gm, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/[*_`~>|-]/g, "")
    .trim();
  return text.length === 0;
}

function sectionKind(title: string): EventSectionKind {
  const key = title.trim().toLowerCase();
  if (MARKDOWN_HEADINGS.has(key)) return "markdown";
  if (CARD_HEADINGS.has(key)) return "cards";
  if (FAQ_HEADINGS.has(key)) return "faq";
  return "generic";
}

function parseSubHeadings(body: string): { title: string; body: string }[] {
  const trimmed = body.trim();
  if (!trimmed) return [];

  const parts = trimmed.split(/^###\s+/m);
  const items: { title: string; body: string }[] = [];

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i].trim();
    if (!part) continue;
    // Content before the first ### is ignored for card/faq layouts
    if (i === 0 && !trimmed.startsWith("###")) {
      continue;
    }
    const nl = part.indexOf("\n");
    const title = (nl === -1 ? part : part.slice(0, nl)).trim();
    const itemBody = nl === -1 ? "" : part.slice(nl + 1).trim();
    if (!title) continue;
    items.push({ title, body: itemBody });
  }
  return items;
}

function parseSections(slug: string, content: string): EventSection[] {
  const rewritten = rewriteAssetPaths(slug, content);
  const chunks = rewritten.split(/^##\s+/m);
  const sections: EventSection[] = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i].trim();
    if (!chunk) continue;
    // Leading content before first ## is ignored
    if (i === 0 && !rewritten.trimStart().startsWith("##")) {
      continue;
    }

    const nl = chunk.indexOf("\n");
    const title = (nl === -1 ? chunk : chunk.slice(0, nl)).trim();
    const body = nl === -1 ? "" : chunk.slice(nl + 1);
    if (!title || isSectionBlank(body)) continue;

    const kind = sectionKind(title);
    const id = slugify(title);

    if (kind === "cards") {
      const cards = parseSubHeadings(body)
        .filter((c) => !isSectionBlank(c.body) || c.title)
        .map((c) => ({
          title: c.title,
          body: rewriteAssetPaths(slug, c.body),
        }));
      if (cards.length === 0) continue;
      sections.push({ id, title, kind, cards });
      continue;
    }

    if (kind === "faq") {
      const faq = parseSubHeadings(body).map((c) => ({
        question: c.title,
        answer: rewriteAssetPaths(slug, c.body),
      }));
      if (faq.length === 0) continue;
      sections.push({ id, title, kind, faq });
      continue;
    }

    sections.push({
      id,
      title,
      kind,
      body: body.trim(),
    });
  }

  return sections;
}

function normalizeHosts(slug: string, raw: unknown): EventHost[] {
  if (!Array.isArray(raw)) return [];
  const hosts: EventHost[] = [];
  for (const h of raw) {
    if (!h || typeof h !== "object") continue;
    const obj = h as Record<string, unknown>;
    const name = typeof obj.name === "string" ? obj.name : "";
    if (!name) continue;
    const host: EventHost = { name };
    if (typeof obj.logo === "string") {
      const logo = resolveAssetUrl(slug, obj.logo);
      if (logo) host.logo = logo;
    }
    hosts.push(host);
  }
  return hosts;
}

function asString(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return undefined;
}

function parseEvent(slug: string, raw: string): EventData | null {
  try {
    const { data, content } = matter(raw);
    const title = asString(data.title) ?? slug;
    const summary = asString(data.summary) ?? "";
    const statusRaw = asString(data.status) ?? "upcoming";
    const status: EventStatus =
      statusRaw === "live" || statusRaw === "past" || statusRaw === "upcoming"
        ? statusRaw
        : "upcoming";

    const registerRaw = data.register;
    let register: EventRegister | undefined;
    if (registerRaw && typeof registerRaw === "object") {
      const r = registerRaw as Record<string, unknown>;
      const label = asString(r.label);
      const url = asString(r.url);
      if (label && url) {
        register = { label, url };
      }
    }

    const meta: EventMeta = {
      slug,
      title,
      summary,
      status,
      start: asString(data.start) ?? "",
      end: asString(data.end),
      timezone: asString(data.timezone),
      format: asString(data.format),
      location: asString(data.location),
      hosts: normalizeHosts(slug, data.hosts),
      cover: (() => {
        const cover = asString(data.cover);
        return cover ? resolveAssetUrl(slug, cover) : undefined;
      })(),
      register,
    };

    return {
      meta,
      sections: parseSections(slug, content),
    };
  } catch {
    console.warn(`[loadEvents] Failed to parse event: ${slug}`);
    return null;
  }
}

const allEvents: EventData[] = Object.entries(eventModules)
  .map(([path, raw]) => {
    const slug = slugFromEventPath(path);
    if (!slug) return null;
    return parseEvent(slug, raw);
  })
  .filter((e): e is EventData => e !== null)
  .sort((a, b) => {
    const order = { live: 0, upcoming: 1, past: 2 };
    const statusDiff = order[a.meta.status] - order[b.meta.status];
    if (statusDiff !== 0) return statusDiff;
    return (b.meta.start || "").localeCompare(a.meta.start || "");
  });

export function getAllEvents(): EventData[] {
  return allEvents;
}

export function getEventBySlug(slug: string): EventData | undefined {
  return allEvents.find((e) => e.meta.slug === slug);
}

export function formatEventDateRange(
  start: string,
  end?: string,
  timezone?: string,
): string {
  if (!start) return "";
  const opts: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: timezone || undefined,
  };
  try {
    const startDate = new Date(start);
    if (Number.isNaN(startDate.getTime())) return start;
    const startStr = startDate.toLocaleDateString("en-US", opts);
    if (!end) return startStr;
    const endDate = new Date(end);
    if (Number.isNaN(endDate.getTime())) return startStr;
    const endStr = endDate.toLocaleDateString("en-US", opts);
    return startStr === endStr ? startStr : `${startStr} – ${endStr}`;
  } catch {
    return end ? `${start} – ${end}` : start;
  }
}
