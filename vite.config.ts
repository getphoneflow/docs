import react from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { fumadocsMdx } from "fumadocs-mdx/vite";
import { siteUrl } from "./src/lib/shared.ts";

export default defineConfig(({ command }) => ({
  server: {
    port: 3000,
  },
  plugins: [
    fumadocsMdx(),
    tailwindcss(),
    tanstackStart({
      prerender: {
        enabled: true,
        crawlLinks: true,
        onSuccess: ({ page }) => {
          if (page.path.endsWith(".md")) {
            return { sitemap: { exclude: true } };
          }
        },
      },
      spa: {
        enabled: command === "build",
        maskPath: "/404",
        prerender: { outputPath: "/404" },
      },

      sitemap: {
        enabled: true,
        host: siteUrl,
      },

      pages: [
        {
          path: "/",
        },
        {
          path: "/api/search",
          sitemap: { exclude: true },
        },
        {
          path: "llms-full.txt",
          sitemap: { exclude: true },
        },
        {
          path: "llms.txt",
          sitemap: { exclude: true },
        },
        {
          path: "/robots.txt",
          sitemap: { exclude: true },
        },
      ],
    }),
    react(),
  ],
  optimizeDeps: {
    include: [
      "use-sync-external-store/shim",
      "use-sync-external-store/shim/with-selector",
    ],
  },
  resolve: {
    tsconfigPaths: true,
    alias: {
      tslib: "tslib/tslib.es6.js",
    },
  },
}));
