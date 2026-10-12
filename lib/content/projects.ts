import type { MDXContent } from "mdx/types";
import { z } from "zod";
import { projectModules } from "@/content/projects/index.generated";
import { projectSchema, type ProjectMeta } from "./schema";

export type Project = ProjectMeta & { Body: MDXContent };

// Validate every project once, when this module first loads (at build time).
// MDX is compiled into the bundle, so nothing reads the file system at runtime —
// required on Cloudflare Workers.
const all: Project[] = Object.entries(projectModules).map(([folder, mod]) => {
  const parsed = projectSchema.safeParse(mod.frontmatter);
  if (!parsed.success) {
    throw new Error(
      `content/projects/${folder}/index.mdx has invalid frontmatter:\n${z.prettifyError(parsed.error)}`,
    );
  }
  if (parsed.data.slug !== folder) {
    throw new Error(
      `content/projects/${folder}/index.mdx: slug "${parsed.data.slug}" must match its folder name`,
    );
  }
  return { ...parsed.data, Body: mod.default };
});

/** Published projects in display order (`order` ascending). Drafts are excluded. */
const published = all.filter((p) => !p.draft).sort((a, b) => a.order - b.order);

export function getProjects(): Project[] {
  return published;
}

export function getProject(slug: string): Project | undefined {
  return published.find((p) => p.slug === slug);
}

/** Previous/next with wrap-around, as in the prototype. Pass a filtered list to step through it. */
export function getNeighbors(
  slug: string,
  list: Project[] = published,
): { prev: Project; next: Project } {
  const i = Math.max(
    0,
    list.findIndex((p) => p.slug === slug),
  );
  return {
    prev: list[(i - 1 + list.length) % list.length],
    next: list[(i + 1) % list.length],
  };
}
