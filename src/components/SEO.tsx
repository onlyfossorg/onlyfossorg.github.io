import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: "website" | "article";
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
}

const DEFAULT_TITLE = "ONLY FOSS ORG — Open Source Student Developer Community & Hackathons";
const DEFAULT_DESCRIPTION =
  "ONLY FOSS ORG is an independent community that open-sources and incubates student college projects, organizes developer hackathons like FOSStober and Founding Dev Design Hackathon, and empowers builders worldwide.";
const SITE_URL = "https://onlyfossorg.github.io";
const DEFAULT_IMAGE = `${SITE_URL}/pwa-512.png`;

function setMetaTag(selector: string, attribute: string, value: string) {
  let element = document.querySelector(selector) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement("meta");
    const [attrName, attrVal] = selector
      .replace(/^meta\[/, "")
      .replace(/\]$/, "")
      .split("=");
    if (attrName && attrVal) {
      element.setAttribute(attrName, attrVal.replace(/['"]/g, ""));
      document.head.appendChild(element);
    }
  }
  element.setAttribute(attribute, value);
}

function setCanonicalUrl(url: string) {
  let element = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", "canonical");
    document.head.appendChild(element);
  }
  element.setAttribute("href", url);
}

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical,
  image = DEFAULT_IMAGE,
  type = "website",
  jsonLd,
}: SEOProps) {
  const location = useLocation();

  useEffect(() => {
    // Page Title
    const formattedTitle = title
      ? `${title} | ONLY FOSS ORG`
      : DEFAULT_TITLE;
    document.title = formattedTitle;

    // Canonical URL
    const canonicalUrl = canonical || `${SITE_URL}${location.pathname}`;
    setCanonicalUrl(canonicalUrl);

    // Meta descriptions
    setMetaTag("meta[name='description']", "content", description);
    setMetaTag("meta[name='title']", "content", formattedTitle);

    // Open Graph
    setMetaTag("meta[property='og:title']", "content", formattedTitle);
    setMetaTag("meta[property='og:description']", "content", description);
    setMetaTag("meta[property='og:url']", "content", canonicalUrl);
    setMetaTag("meta[property='og:image']", "content", image);
    setMetaTag("meta[property='og:type']", "content", type);

    // Twitter
    setMetaTag("meta[name='twitter:title']", "content", formattedTitle);
    setMetaTag("meta[name='twitter:description']", "content", description);
    setMetaTag("meta[name='twitter:url']", "content", canonicalUrl);
    setMetaTag("meta[name='twitter:image']", "content", image);

    // Dynamic JSON-LD (if specified)
    let jsonLdScript: HTMLScriptElement | null = null;
    if (jsonLd) {
      jsonLdScript = document.createElement("script");
      jsonLdScript.type = "application/ld+json";
      jsonLdScript.id = "page-specific-jsonld";
      jsonLdScript.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(jsonLdScript);
    }

    return () => {
      if (jsonLdScript && jsonLdScript.parentNode) {
        jsonLdScript.parentNode.removeChild(jsonLdScript);
      }
    };
  }, [title, description, canonical, image, type, jsonLd, location.pathname]);

  return null;
}
