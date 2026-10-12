import { z } from "zod";
import { PROJECT_TYPES, STATUSES, TAG_KEYS } from "@/content/tags";

/**
 * Project frontmatter (PLAN §7). Parsed when the content registry loads, so a typo
 * in any index.mdx fails `npm run build` instead of shipping a broken page.
 */
export const projectSchema = z.object({
  title: z.string().min(1),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "lowercase letters, numbers and dashes only"),
  icon: z.string().min(1).max(4),
  summary: z
    .string()
    .min(1)
    .max(140, "card one-liner must be ≤ 140 characters"),
  role: z.array(z.string().min(1)).min(1),
  team: z.string().optional(),
  tags: z.array(z.enum(TAG_KEYS)).min(1),
  type: z.enum(PROJECT_TYPES),
  timeline: z.string(),
  year: z.string(),
  sortDate: z.iso.date("sortDate must be YYYY-MM-DD"),
  status: z.enum(STATUSES),
  // Optional until real covers exist; coverTag supplies placeholder colors meanwhile.
  cover: z.string().optional(),
  coverTag: z.enum(TAG_KEYS).optional(),
  links: z
    .array(z.object({ label: z.string().min(1), url: z.url() }))
    .default([]),
  tldr: z.string().min(1),
  stats: z
    .array(z.object({ value: z.string(), label: z.string() }))
    .default([]),
  featured: z.boolean().default(false),
  order: z.number().int(),
  draft: z.boolean().optional(),
});

export type ProjectMeta = z.infer<typeof projectSchema>;
