// remark-mdx-frontmatter exports each file's YAML frontmatter as `frontmatter`.
// It's validated with Zod in lib/content/projects.ts, so it's typed loosely here.
declare module "*.mdx" {
  export const frontmatter: unknown;
}
