import { Buffer } from "buffer";
import matter from "gray-matter";

// gray-matter expects Node's Buffer in the browser
(globalThis as unknown as { Buffer: typeof Buffer }).Buffer = Buffer;

export type EventStatus = "upcoming" | "live" | "past";
export type EventType = "event" | "hackathon";

export interface EventHost {
  name: string;
  logo?: string;
}

export interface EventRegister {
  label: string;
  url: string;
}

export interface EventTimelineItem {
  label: string;
  date: string;
  description?: string;
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
  type: EventType;
  prizes?: string;
  hosts: EventHost[];
  cover?: string;
  banner?: string;
  register?: EventRegister;
  timeline?: EventTimelineItem[];
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
  "how it works",
  "how the design hackathon works",
  "timeline",
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

/**
 * Parses a date string taking timezone into account.
 * Handles ISO strings with offsets (e.g. 2026-11-06T00:00:00-08:00 or Z),
 * or date-only YYYY-MM-DD or date-time strings without offset interpreted in `timeZone`.
 */
export function parseDateTimeInZone(
  dateStr: string | undefined,
  isEndOfDay = false,
  timeZone = "UTC",
): Date | null {
  if (!dateStr) return null;
  const trimmed = dateStr.trim();
  if (!trimmed) return null;

  // Already has explicit offset or Z: e.g. 2026-11-06T00:00:00-08:00 or 2026-11-06T00:00:00Z
  if (/T.*\d(Z|[+-]\d{2}(?::?\d{2})?)$/i.test(trimmed)) {
    const t = Date.parse(trimmed);
    return Number.isNaN(t) ? null : new Date(t);
  }

  // Parse YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss
  const match = trimmed.match(
    /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?/,
  );
  if (!match) {
    const t = Date.parse(trimmed);
    return Number.isNaN(t) ? null : new Date(t);
  }

  const [, y, m, d, hh, mm, ss] = match;
  const hours = hh !== undefined ? parseInt(hh, 10) : isEndOfDay ? 23 : 0;
  const minutes = mm !== undefined ? parseInt(mm, 10) : isEndOfDay ? 59 : 0;
  const seconds = ss !== undefined ? parseInt(ss, 10) : isEndOfDay ? 59 : 0;
  const ms = isEndOfDay ? 999 : 0;

  const targetUtc = Date.UTC(+y, +m - 1, +d, hours, minutes, seconds, ms);
  try {
    const dtf = new Intl.DateTimeFormat("en-US", {
      timeZone: timeZone || "UTC",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hourCycle: "h23",
    });

    const getZoneUtc = (date: Date) => {
      const parts = dtf.formatToParts(date);
      const getVal = (type: string) =>
        parseInt(parts.find((p) => p.type === type)?.value ?? "0", 10);
      return Date.UTC(
        getVal("year"),
        getVal("month") - 1,
        getVal("day"),
        getVal("hour"),
        getVal("minute"),
        getVal("second"),
        ms,
      );
    };

    let guess = targetUtc;
    for (let i = 0; i < 2; i++) {
      const offset = getZoneUtc(new Date(guess)) - targetUtc;
      guess -= offset;
    }
    return new Date(guess);
  } catch {
    return new Date(targetUtc);
  }
}

/**
 * Computes dynamic event status ("upcoming" | "live" | "past") based on
 * start, end, timezone, and current time.
 */
export function getEventStatus(
  meta: Pick<EventMeta, "start" | "end" | "timezone"> & { status?: EventStatus },
  atTime: Date = new Date(),
): EventStatus {
  const startDate = parseDateTimeInZone(meta.start, false, meta.timezone);
  if (!startDate) return meta.status ?? "upcoming";

  const endDate = meta.end
    ? parseDateTimeInZone(meta.end, true, meta.timezone)
    : parseDateTimeInZone(meta.start, true, meta.timezone);

  const nowMs = atTime.getTime();
  const startMs = startDate.getTime();
  const endMs = endDate ? endDate.getTime() : startMs + 24 * 60 * 60 * 1000;

  if (nowMs < startMs) {
    return "upcoming";
  }
  if (nowMs <= endMs) {
    return "live";
  }
  return "past";
}

/**
 * Get user's detected browser timezone or fallback to UTC
 */
export function getUserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

/**
 * Get formatted GMT offset string for a timezone, e.g. "GMT+5:30" or "GMT-8"
 */
export function formatTimezoneOffset(
  timeZone: string,
  date: Date = new Date(),
): string {
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "shortOffset",
    });
    const parts = formatter.formatToParts(date);
    const tzPart = parts.find((p) => p.type === "timeZoneName");
    return tzPart ? tzPart.value : "";
  } catch {
    try {
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone,
        timeZoneName: "short",
      });
      const parts = formatter.formatToParts(date);
      const tzPart = parts.find((p) => p.type === "timeZoneName");
      return tzPart ? tzPart.value : "";
    } catch {
      return "";
    }
  }
}

/**
 * Format milestone date for a specific timezone
 */
export function formatEventMilestone(
  date: Date | string,
  timeZone: string,
): { formatted: string; offset: string; full: string } {
  const parsed =
    typeof date === "string"
      ? parseDateTimeInZone(date, false, timeZone)
      : date;
  if (!parsed) return { formatted: "", offset: "", full: "" };

  const formatted = parsed.toLocaleString("en-US", {
    timeZone,
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const offset = formatTimezoneOffset(timeZone, parsed);
  const full = offset ? `${formatted} ${offset}` : formatted;
  return { formatted, offset, full };
}

/**
 * Format dynamic countdown / state string
 */
export function formatEventCountdown(
  meta: Pick<EventMeta, "start" | "end" | "timezone" | "status">,
  now: Date = new Date(),
): { status: EventStatus; label: string; text: string } {
  const startDate = parseDateTimeInZone(meta.start, false, meta.timezone);
  const endDate = meta.end
    ? parseDateTimeInZone(meta.end, true, meta.timezone)
    : parseDateTimeInZone(meta.start, true, meta.timezone);

  if (!startDate) {
    const status = meta.status ?? "upcoming";
    return {
      status,
      label: status.toUpperCase(),
      text:
        status === "live"
          ? "Live now"
          : status === "past"
            ? "Concluded"
            : "Upcoming",
    };
  }

  const nowMs = now.getTime();
  const startMs = startDate.getTime();
  const endMs = endDate ? endDate.getTime() : startMs + 24 * 60 * 60 * 1000;

  const formatDiff = (diffMs: number): string => {
    const totalSecs = Math.max(0, Math.floor(diffMs / 1000));
    const days = Math.floor(totalSecs / 86400);
    const hours = Math.floor((totalSecs % 86400) / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);

    if (days > 0) {
      return `${days}d ${hours}h ${mins}m`;
    }
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (nowMs < startMs) {
    return {
      status: "upcoming",
      label: "UPCOMING",
      text: `Starts in ${formatDiff(startMs - nowMs)}`,
    };
  }
  if (nowMs <= endMs) {
    return {
      status: "live",
      label: "LIVE NOW",
      text: `Live · Submissions close in ${formatDiff(endMs - nowMs)}`,
    };
  }
  return {
    status: "past",
    label: "PAST",
    text: "Event concluded",
  };
}

function parseEvent(slug: string, raw: string): EventData | null {
  try {
    const { data, content } = matter(raw);
    const title = asString(data.title) ?? slug;
    const summary = asString(data.summary) ?? "";
    const start = asString(data.start) ?? "";
    const end = asString(data.end);
    const timezone = asString(data.timezone);
    const statusRaw = asString(data.status) ?? "upcoming";
    const statusInitial: EventStatus =
      statusRaw === "live" || statusRaw === "past" || statusRaw === "upcoming"
        ? statusRaw
        : "upcoming";

    // Dynamic status calculation based on start, end, and timezone
    const status = getEventStatus(
      { start, end, timezone, status: statusInitial },
      new Date(),
    );

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

    const timelineRaw = data.timeline;
    let timeline: EventTimelineItem[] | undefined;
    if (Array.isArray(timelineRaw)) {
      const items: EventTimelineItem[] = [];
      for (const item of timelineRaw) {
        if (!item || typeof item !== "object") continue;
        const obj = item as Record<string, unknown>;
        const label = asString(obj.label);
        const date = asString(obj.date);
        const description = asString(obj.description);
        if (label && date) {
          items.push({ label, date, description });
        }
      }
      if (items.length > 0) timeline = items;
    }

    const typeRaw = asString(data.type)?.toLowerCase();
    const type: EventType = typeRaw === "hackathon" ? "hackathon" : "event";

    const meta: EventMeta = {
      slug,
      title,
      summary,
      status,
      start,
      end,
      timezone,
      format: asString(data.format),
      location: asString(data.location),
      type,
      prizes: asString(data.prizes),
      hosts: normalizeHosts(slug, data.hosts),
      cover: (() => {
        const cover = asString(data.cover);
        return cover ? resolveAssetUrl(slug, cover) : undefined;
      })(),
      banner: (() => {
        const banner = asString(data.banner);
        if (banner) return resolveAssetUrl(slug, banner);
        const cover = asString(data.cover);
        return cover ? resolveAssetUrl(slug, cover) : undefined;
      })(),
      register,
      timeline,
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

export function getAllEvents(atTime: Date = new Date()): EventData[] {
  return [...allEvents]
    .map((event) => ({
      ...event,
      meta: {
        ...event.meta,
        status: getEventStatus(event.meta, atTime),
      },
    }))
    .sort((a, b) => {
      const order = { live: 0, upcoming: 1, past: 2 };
      const statusDiff = order[a.meta.status] - order[b.meta.status];
      if (statusDiff !== 0) return statusDiff;
      return (b.meta.start || "").localeCompare(a.meta.start || "");
    });
}

export function getEventBySlug(
  slug: string,
  atTime: Date = new Date(),
): EventData | undefined {
  const event = allEvents.find((e) => e.meta.slug === slug);
  if (!event) return undefined;
  return {
    ...event,
    meta: {
      ...event.meta,
      status: getEventStatus(event.meta, atTime),
    },
  };
}

export function isSameTimezone(tz1?: string, tz2?: string): boolean {
  if (!tz1 || !tz2) return false;
  if (tz1.toLowerCase() === tz2.toLowerCase()) return true;
  try {
    const c1 = Intl.DateTimeFormat(undefined, {
      timeZone: tz1,
    }).resolvedOptions().timeZone;
    const c2 = Intl.DateTimeFormat(undefined, {
      timeZone: tz2,
    }).resolvedOptions().timeZone;
    return c1.toLowerCase() === c2.toLowerCase();
  } catch {
    return false;
  }
}

export function formatEventDateRange(
  start: string,
  end?: string,
  timezone?: string,
  targetTimezone?: string,
  includeTime = true,
): string {
  if (!start) return "";
  const tz = targetTimezone || timezone || undefined;
  const startDate = parseDateTimeInZone(start, false, timezone);
  if (!startDate) return start;

  const endDate = end ? parseDateTimeInZone(end, true, timezone) : undefined;
  const hasTime = includeTime && (start.includes("T") || start.includes(":"));

  const opts: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: tz,
    ...(hasTime
      ? {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }
      : {}),
  };
  try {
    const startStr = startDate.toLocaleDateString("en-US", opts);
    if (!endDate) return startStr;
    const endStr = endDate.toLocaleDateString("en-US", opts);
    return startStr === endStr ? startStr : `${startStr} – ${endStr}`;
  } catch {
    return end ? `${start} – ${end}` : start;
  }
}
