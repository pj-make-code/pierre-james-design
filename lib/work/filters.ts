// Work database state (PLAN §4.3). It lives entirely in the URL —
// ?tag=ux-design,startups&type=product&view=table&sort=oldest — so a reload or a
// shared link restores it, and the server can render the filtered list with no JS.
// Pure functions only: the /work page (server) and the peek (client) both use them.

import {
  PROJECT_TYPES,
  TAG_KEYS,
  type ProjectType,
  type TagKey,
} from "@/content/tags";

export type WorkView = "gallery" | "table";
export type WorkSort = "newest" | "oldest";

export type WorkFilters = {
  tags: TagKey[];
  type: ProjectType | null;
  view: WorkView;
  sort: WorkSort;
};

/** The minimum a project needs to be filtered and sorted. */
type Filterable = {
  tags: readonly TagKey[];
  type: ProjectType;
  sortDate: string;
};

type Params =
  URLSearchParams | Record<string, string | string[] | undefined> | null;

function get(params: Params, key: string): string | undefined {
  if (!params) return undefined;
  if (params instanceof URLSearchParams) return params.get(key) ?? undefined;
  const v = params[key];
  return Array.isArray(v) ? v[0] : v;
}

/** Reads filters from a URL, ignoring anything unrecognized rather than failing. */
export function parseFilters(params: Params): WorkFilters {
  const tagParam = get(params, "tag")?.split(",") ?? [];
  const typeParam = get(params, "type")?.toLowerCase();
  return {
    // Canonical tag order keeps one URL per selection.
    tags: TAG_KEYS.filter((t) => tagParam.includes(t)),
    type: PROJECT_TYPES.find((t) => t.toLowerCase() === typeParam) ?? null,
    view: get(params, "view") === "table" ? "table" : "gallery",
    sort: get(params, "sort") === "oldest" ? "oldest" : "newest",
  };
}

/**
 * Builds "?…" for a filter state, leaving defaults out so the plain /work URL
 * stays clean. `keepSort` always writes sort; peek links use it as the signal
 * that they came from the database (see `peekList`).
 */
export function toSearch(
  f: WorkFilters,
  { keepSort = false }: { keepSort?: boolean } = {},
): string {
  const q = new URLSearchParams();
  // Canonical tag order, so one selection always produces one URL.
  const tags = TAG_KEYS.filter((t) => f.tags.includes(t));
  if (tags.length) q.set("tag", tags.join(","));
  if (f.type) q.set("type", f.type.toLowerCase());
  if (f.view !== "gallery") q.set("view", f.view);
  if (keepSort || f.sort !== "newest") q.set("sort", f.sort);
  const s = q.toString().replace(/%2C/g, ",");
  return s ? `?${s}` : "";
}

export function isFiltered(f: WorkFilters): boolean {
  return f.tags.length > 0 || f.type !== null;
}

/** Any selected tag matches (OR), and the type must match, as in the prototype. */
export function applyFilters<T extends Filterable>(
  list: readonly T[],
  f: WorkFilters,
): T[] {
  return list
    .filter(
      (p) =>
        (f.tags.length === 0 || p.tags.some((t) => f.tags.includes(t))) &&
        (f.type === null || p.type === f.type),
    )
    .sort((a, b) =>
      f.sort === "newest"
        ? b.sortDate.localeCompare(a.sortDate)
        : a.sortDate.localeCompare(b.sortDate),
    );
}

/**
 * The list the peek steps through: the database's filtered order when the link
 * came from /work (it carries `sort`), otherwise the site's display order.
 */
export function peekList<T extends Filterable>(
  displayOrder: readonly T[],
  params: Params,
): T[] {
  return get(params, "sort")
    ? applyFilters(displayOrder, parseFilters(params))
    : [...displayOrder];
}
