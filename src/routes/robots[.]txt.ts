import { createFileRoute } from "@tanstack/react-router";

import { siteUrl } from "@/lib/shared";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async () => {
        const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml`;

        return new Response(robots, {
          headers: {
            "Content-Type": "text/plain",
          },
        });
      },
    },
  },
});
