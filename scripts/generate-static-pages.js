import fs from "fs";
import path from "path";
import matter from "gray-matter";

const DIST_DIR = path.resolve("dist");
const EVENTS_DIR = path.resolve("events");
const BASE_URL = "https://onlyfossorg.github.io";

if (!fs.existsSync(DIST_DIR)) {
  console.error("dist folder not found. Run vite build first.");
  process.exit(1);
}

const templateHtml = fs.readFileSync(path.join(DIST_DIR, "index.html"), "utf8");

// Define static routes with SEO metadata
const routes = [
  {
    path: "/projects",
    title: "Explore Open Source Projects | ONLY FOSS ORG",
    description:
      "Browse student-led open-source projects incubated by ONLY FOSS ORG. Filter by domain, difficulty, and tech stack to find issues and contribute today.",
    h1: "Explore Open Source Projects — ONLY FOSS ORG",
    lead: "Browse student-led open-source projects incubated by ONLY FOSS ORG. Filter by domain, difficulty, and tech stack to find issues and contribute today.",
  },
  {
    path: "/events",
    title: "Events & Hackathons | ONLY FOSS ORG",
    description:
      "Discover upcoming and past open-source events, hackathons, and community workshops hosted by ONLY FOSS ORG.",
    h1: "Events & Hackathons — ONLY FOSS ORG",
    lead: "Discover upcoming and past open-source events, hackathons, and community workshops hosted by ONLY FOSS ORG.",
  },
  {
    path: "/hackathons",
    title: "Hackathons | ONLY FOSS ORG",
    description:
      "Join online developer hackathons hosted by ONLY FOSS ORG. Win cash prizes, build real-world products, and collaborate with student builders.",
    h1: "Developer Hackathons — ONLY FOSS ORG",
    lead: "Join online developer hackathons hosted by ONLY FOSS ORG. Win cash prizes, build real-world products, and collaborate with student builders.",
  },
  {
    path: "/community",
    title: "Join the Community | ONLY FOSS ORG",
    description:
      "Connect with student developers, designers, and maintainers in ONLY FOSS ORG. Join our Discord, contribute on GitHub, and build together.",
    h1: "Join the Developer Community — ONLY FOSS ORG",
    lead: "Connect with student developers, designers, and maintainers in ONLY FOSS ORG. Join our Discord, contribute on GitHub, and build together.",
  },
  {
    path: "/about",
    title: "About Us | ONLY FOSS ORG",
    description:
      "Learn about ONLY FOSS ORG: an independent open-source organization rescuing and incubating college projects, running student hackathons, and fostering developer collaboration.",
    h1: "About ONLY FOSS ORG — Open Source Incubation",
    lead: "Learn about ONLY FOSS ORG: an independent open-source organization rescuing and incubating college projects, running student hackathons, and fostering developer collaboration.",
  },
  {
    path: "/documentation",
    title: "Documentation & Guides | ONLY FOSS ORG",
    description:
      "Guides, tutorials, and developer documentation for contributing to ONLY FOSS ORG projects, Git workflows, and open-source tooling.",
    h1: "Developer Documentation & Contributing Guides",
    lead: "Guides, tutorials, and developer documentation for contributing to ONLY FOSS ORG projects, Git workflows, and open-source tooling.",
  },
  {
    path: "/project-guidelines",
    title: "Project Guidelines | ONLY FOSS ORG",
    description:
      "Best practices, code standards, Git commit conventions, and submission rules for ONLY FOSS ORG open-source projects.",
    h1: "Open Source Project Guidelines & Best Practices",
    lead: "Best practices, code standards, Git commit conventions, and submission rules for ONLY FOSS ORG open-source projects.",
  },
  {
    path: "/code-of-conduct",
    title: "Code of Conduct | ONLY FOSS ORG",
    description:
      "Our pledge to foster an open, welcoming, diverse, inclusive, and harassment-free community for everyone in ONLY FOSS ORG.",
    h1: "ONLY FOSS ORG Code of Conduct",
    lead: "Our pledge to foster an open, welcoming, diverse, inclusive, and harassment-free community for everyone in ONLY FOSS ORG.",
  },
];

// Dynamically discover event pages from events/ directory
if (fs.existsSync(EVENTS_DIR)) {
  const eventDirs = fs.readdirSync(EVENTS_DIR, { withFileTypes: true });
  for (const dir of eventDirs) {
    if (dir.isDirectory() && !dir.name.startsWith("_")) {
      const eventMdPath = path.join(EVENTS_DIR, dir.name, "event.md");
      if (fs.existsSync(eventMdPath)) {
        try {
          const raw = fs.readFileSync(eventMdPath, "utf8");
          const { data } = matter(raw);
          if (data && data.title) {
            routes.push({
              path: `/events/${dir.name}`,
              title: `${data.title} | ONLY FOSS ORG`,
              description: data.summary || `${data.title} hosted by ONLY FOSS ORG.`,
              h1: data.title,
              lead: data.summary || `Event details and registration for ${data.title}.`,
            });
          }
        } catch (e) {
          console.warn(`Could not parse ${eventMdPath}:`, e.message);
        }
      }
    }
  }
}

console.log(`Generating pre-rendered static HTML routes for ${routes.length} pages...`);

function replaceMetaTag(html, attrName, attrValue, newContent) {
  const regex = new RegExp(`<meta\\s+[^>]*?${attrName}=["']${attrValue}["'][^>]*?>`, "gi");
  const newTag = `<meta ${attrName}="${attrValue}" content="${newContent.replace(/"/g, "&quot;")}" />`;
  if (regex.test(html)) {
    return html.replace(regex, newTag);
  }
  return html.replace("</head>", `  ${newTag}\n</head>`);
}

for (const route of routes) {
  const canonicalUrl = `${BASE_URL}${route.path}`;
  let html = templateHtml;

  // Replace Title
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${route.title}</title>`);
  html = replaceMetaTag(html, "name", "title", route.title);
  html = replaceMetaTag(html, "property", "og:title", route.title);
  html = replaceMetaTag(html, "name", "twitter:title", route.title);

  // Replace Description
  html = replaceMetaTag(html, "name", "description", route.description);
  html = replaceMetaTag(html, "property", "og:description", route.description);
  html = replaceMetaTag(html, "name", "twitter:description", route.description);

  // Replace Canonical & URL
  html = html.replace(
    /<link\s+[^>]*?rel=["']canonical["'][^>]*?>/i,
    `<link rel="canonical" href="${canonicalUrl}" />`
  );
  html = replaceMetaTag(html, "property", "og:url", canonicalUrl);
  html = replaceMetaTag(html, "name", "twitter:url", canonicalUrl);

  // Replace semantic crawlable fallback content inside <div id="root">
  const fallbackContent = `<div id="root"><main style="padding: 24px; font-family: sans-serif; max-width: 800px; margin: 0 auto;"><h1>${route.h1}</h1><p>${route.lead}</p><nav><a href="/">Home</a> · <a href="/projects">Projects</a> · <a href="/events">Events</a> · <a href="/hackathons">Hackathons</a> · <a href="/community">Community</a> · <a href="/about">About</a></nav></main></div>`;
  html = html.replace(/<div id="root">[\s\S]*?<\/div>/i, fallbackContent);

  // Determine target directory
  const relativeDir = route.path.replace(/^\//, "");
  const targetDir = path.join(DIST_DIR, relativeDir);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const targetFile = path.join(targetDir, "index.html");
  fs.writeFileSync(targetFile, html, "utf8");
  console.log(`  ✓ Generated ${route.path} -> ${path.relative(process.cwd(), targetFile)}`);
}

// Copy dist/index.html to dist/404.html to ensure SPA fallback works
fs.copyFileSync(path.join(DIST_DIR, "index.html"), path.join(DIST_DIR, "404.html"));
console.log("  ✓ Generated dist/404.html SPA fallback");
console.log("Static HTML pre-rendering complete!");
