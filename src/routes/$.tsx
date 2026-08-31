import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { createServerFn } from "@tanstack/react-start";
import { docs, source } from "@/lib/source";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from "fumadocs-ui/layouts/docs/page";
import { baseOptions } from "@/lib/layout.shared";
import {
  absoluteUrl,
  appName,
  encodeMarkdownUrl,
  gitConfig,
  siteUrl,
} from "@/lib/shared";
import { staticFunctionMiddleware } from "@tanstack/start-static-server-functions";
import { useFumadocsLoader } from "fumadocs-core/source/client";
import { Suspense, use } from "react";
import { useMDXComponents } from "@/components/mdx";

export const Route = createFileRoute("/$")({
  component: Page,
  loader: async ({ params }) => {
    const slugs = params._splat?.split("/") ?? [];

    try {
      const data = await loader({ data: slugs });
      await docs.getPage(data.path)?.preload();
      return data;
    } catch {
      throw notFound();
    }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};

    const pageTitle = loaderData.title;
    const title = `${pageTitle} - ${appName}`;
    const description = loaderData.description;
    const pageUrl = absoluteUrl(loaderData.url);

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: pageUrl },
        { property: "og:image:alt", content: title },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image:alt", content: title },
      ],
      links: [
        { rel: "canonical", href: pageUrl },
        {
          rel: "alternate",
          type: "text/markdown",
          href: absoluteUrl(loaderData.markdownUrl),
        },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebPage",
                "@id": `${pageUrl}#webpage`,
                url: pageUrl,
                name: pageTitle,
                description,
                isPartOf: {
                  "@id": `${siteUrl}/#website`,
                },
              },
              {
                "@type": ["Article", "TechArticle"],
                "@id": `${pageUrl}#article`,
                headline: pageTitle,
                name: pageTitle,
                description,
                url: pageUrl,
                mainEntityOfPage: {
                  "@id": `${pageUrl}#webpage`,
                },
                publisher: {
                  "@id": `${siteUrl}/#organization`,
                },
                isPartOf: {
                  "@id": `${siteUrl}/#website`,
                },
              },
            ],
          }),
        },
      ],
    };
  },
});

const loader = createServerFn({
  method: "GET",
})
  .validator((slugs: string[]) => slugs)
  .middleware([staticFunctionMiddleware])
  .handler(async ({ data: slugs }) => {
    const page = source.getPage(slugs);
    if (!page) throw notFound();

    return {
      path: page.path,
      url: page.url,
      title: page.data.title,
      description: page.data.description!,
      markdownUrl: encodeMarkdownUrl(page.slugs, page.locale),
      pageTree: await source.serializePageTree(source.getPageTree()),
    };
  });

function Content({ path, markdownUrl }: { path: string; markdownUrl: string }) {
  const page = docs.getPage(path);
  if (!page) throw new Error(`unknown page: ${path}`);

  const { toc } = use(page.load());
  const MDX = page.body;

  return (
    <DocsPage toc={toc}>
      <DocsTitle>{page.title}</DocsTitle>
      <DocsDescription>{page.description}</DocsDescription>
      <div className="flex flex-row gap-2 items-center border-b -mt-4 pb-6">
        <MarkdownCopyButton markdownUrl={markdownUrl} />
        <ViewOptionsPopover
          markdownUrl={markdownUrl}
          githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/docs/${path}`}
        />
      </div>
      <DocsBody>
        <MDX components={useMDXComponents()} />
      </DocsBody>
    </DocsPage>
  );
}

function Page() {
  const { pageTree, path, markdownUrl } = useFumadocsLoader(
    Route.useLoaderData(),
  );

  return (
    <DocsLayout {...baseOptions()} tree={pageTree}>
      <Link to={markdownUrl} hidden />
      <Suspense>
        <Content path={path} markdownUrl={markdownUrl} />
      </Suspense>
    </DocsLayout>
  );
}
