import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { Banner } from "fumadocs-ui/components/banner";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { File, Files, Folder } from "fumadocs-ui/components/files";
import { GithubInfo } from "fumadocs-ui/components/github-info";
import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import { InlineTOC } from "fumadocs-ui/components/inline-toc";
import { Step, Steps } from "fumadocs-ui/components/steps";
import * as TabsComponents from "fumadocs-ui/components/tabs";
import { TypeTable } from "fumadocs-ui/components/type-table";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import type { ComponentProps } from "react";

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    ...TabsComponents,
    Accordion,
    Accordions,
    Banner,
    File,
    Files,
    Folder,
    GithubInfo,
    InlineTOC,
    Step,
    Steps,
    TypeTable,
    DynamicCodeBlock,
    img: (props: ComponentProps<typeof ImageZoom>) => <ImageZoom {...props} />,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
