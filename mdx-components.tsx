import type { MDXComponents } from "mdx/types";
import { isValidElement } from "react";
import * as blocks from "@/components/blocks";
import styles from "@/components/blocks/blocks.module.css";

/** Plain text of a heading's children, for building its anchor id. */
function textOf(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement<{ children?: React.ReactNode }>(node))
    return textOf(node.props.children);
  return "";
}

/** "What I’d do differently" → "what-id-do-differently". Used by the TOC and deep links. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Maps Markdown elements and block components used in content/**/*.mdx.
// Required by @next/mdx in the App Router.
const components: MDXComponents = {
  h2: ({ children }) => (
    <h2 id={slugify(textOf(children))} className={styles.h2}>
      {children}
    </h2>
  ),
  p: ({ children }) => <p className={styles.p}>{children}</p>,
  a: ({ href, children }) => (
    <a href={href} className={styles.a}>
      {children}
    </a>
  ),
  ...blocks,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
