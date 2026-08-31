import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import appCss from "@/styles/app.css?url";
import { RootProvider } from "fumadocs-ui/provider/tanstack";
import SearchDialog from "@/components/search";
import { NotFound } from "@/components/not-found";
import {
  absoluteUrl,
  appName,
  gitConfig,
  logoPath,
  ogImageHeight,
  ogImagePath,
  ogImageWidth,
  ogLocale,
  siteDescription,
  siteUrl,
} from "@/lib/shared";

const title = appName;
const description = siteDescription;
const ogImage = absoluteUrl(ogImagePath);
const logo = absoluteUrl(logoPath);

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow" },
      { property: "og:site_name", content: appName },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: siteUrl },
      { property: "og:locale", content: ogLocale },
      { property: "og:image", content: ogImage },
      { property: "og:image:width", content: String(ogImageWidth) },
      { property: "og:image:height", content: String(ogImageHeight) },
      { property: "og:image:alt", content: appName },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage },
      { name: "twitter:image:alt", content: appName },
      { name: "twitter:image:width", content: String(ogImageWidth) },
      { name: "twitter:image:height", content: String(ogImageHeight) },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": `${siteUrl}/#organization`,
              name: appName,
              url: siteUrl,
              logo: {
                "@type": "ImageObject",
                url: logo,
              },
              image: ogImage,
              description,
              sameAs: [
                `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
              ],
            },
            {
              "@type": "WebSite",
              "@id": `${siteUrl}/#website`,
              url: siteUrl,
              name: appName,
              description,
              publisher: {
                "@id": `${siteUrl}/#organization`,
              },
              inLanguage: "en-US",
            },
          ],
        }),
      },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFound,
});

function RootComponent() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="flex flex-col min-h-screen" suppressHydrationWarning>
        <RootProvider search={{ SearchDialog }}>
          <Outlet />
        </RootProvider>
        <Scripts />
      </body>
    </html>
  );
}
