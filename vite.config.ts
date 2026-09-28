import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["of-logo.png"],
      manifest: {
        name: "ONLY FOSS ORG",
        short_name: "ONLY FOSS ORG",
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#000000",
        theme_color: "#00ff7f",
        icons: [
          {
            src: "pwa-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-192-black.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512-black.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        navigateFallback: "index.html",
      },
    }),
  ],
  base: "/",
  build: {
    // Keep event covers / mid-content images as files so markdown <img src> is not a data: URL
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (
            id.includes("react-dom") ||
            id.includes("/react/") ||
            id.includes("react-router")
          ) {
            return "vendor-react";
          }
          if (
            id.includes("react-markdown") ||
            id.includes("remark-gfm") ||
            id.includes("mdast") ||
            id.includes("micromark") ||
            id.includes("unist") ||
            id.includes("hast") ||
            id.includes("vfile") ||
            id.includes("property-information") ||
            id.includes("space-separated-tokens") ||
            id.includes("comma-separated-tokens") ||
            id.includes("devlop") ||
            id.includes("trim-lines") ||
            id.includes("style-to-") ||
            id.includes("inline-style-parser") ||
            id.includes("decode-named-character-reference") ||
            id.includes("character-entities") ||
            id.includes("ccount") ||
            id.includes("escape-string-regexp") ||
            id.includes("markdown-table") ||
            id.includes("longest-streak") ||
            id.includes("zwitch") ||
            id.includes("trough")
          ) {
            return "vendor-markdown";
          }
          if (
            id.includes("gray-matter") ||
            id.includes("/buffer/") ||
            id.includes("js-yaml") ||
            id.includes("argparse") ||
            id.includes("esprima") ||
            id.includes("section-matter") ||
            id.includes("strip-bom-string")
          ) {
            return "vendor-matter";
          }
          if (id.includes("lucide-react")) {
            return "vendor-icons";
          }
        },
      },
    },
  },
});
