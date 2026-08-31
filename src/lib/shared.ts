export const appName = "PhoneFlow Docs";
export const siteUrl = "https://docs.getphoneflow.com";
export const siteDescription = "PhoneFlow Docs";
export const docsRoute = "/";

export const logoPath = "/favicon.svg";
export const ogImagePath = "/og.png";
export const ogImageWidth = 1200;
export const ogImageHeight = 630;
export const ogLocale = "en_US";

export const gitConfig = {
  user: "getphoneflow",
  repo: "docs",
  branch: "main",
};

export function absoluteUrl(path: string) {
  return new URL(path, siteUrl).href;
}

export function encodeMarkdownUrl(slugs: string[], locale?: string) {
  const segments = [...slugs];
  if (segments.length === 0) {
    segments.push("index.md");
  } else {
    segments[segments.length - 1] += ".md";
  }

  return (
    "/" +
    [locale, ...docsRoute.split("/"), ...segments].filter(Boolean).join("/")
  );
}

/** @returns page slugs */
export function decodeMarkdownUrl(segments: string[]) {
  if (segments.length === 0) return [];

  const out = [...segments];
  out[out.length - 1] = out[out.length - 1].replace(/\.md$/, "");
  if (out.length === 1 && out[0] === "index") out.pop();
  return out;
}
