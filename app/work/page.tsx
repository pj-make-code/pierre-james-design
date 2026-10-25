import type { Metadata } from "next";
import ProjectCard from "@/components/work/ProjectCard";
import {
  EmptyState,
  Filters,
  ViewAndSort,
} from "@/components/work/WorkControls";
import WorkTable from "@/components/work/WorkTable";
import { site } from "@/content/site";
import type { Project } from "@/lib/content/projects";
import { getProjects } from "@/lib/content/projects";
import { applyFilters, parseFilters, toSearch } from "@/lib/work/filters";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: `Work — ${site.name}`,
  description: `Case studies by ${site.name}: product design, ventures, and concepts.`,
};

/**
 * Projects database (PLAN §4.3). Rendered on the server from the URL, so filters
 * survive a reload and work without JavaScript.
 */
export default async function WorkPage({ searchParams }: PageProps<"/work">) {
  const filters = parseFilters(await searchParams);
  const all = getProjects();
  const list = applyFilters(all, filters);
  // Project links carry the filters (always with sort) so the peek can step
  // through this exact list, and Close returns to it.
  const search = toSearch(filters, { keepSort: true });
  const hrefFor = (p: Project) => `/work/${p.slug}${search}`;

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>
        Work{" "}
        <span className={styles.count}>
          {list.length === all.length
            ? all.length
            : `${list.length} of ${all.length}`}
        </span>
      </h1>
      <ViewAndSort filters={filters} />
      <Filters filters={filters} />

      {list.length === 0 ? (
        <EmptyState filters={filters} />
      ) : filters.view === "table" ? (
        <WorkTable projects={list} hrefFor={hrefFor} />
      ) : (
        <div className={styles.gallery}>
          {list.map((p) => (
            <ProjectCard key={p.slug} project={p} href={hrefFor(p)} />
          ))}
        </div>
      )}
    </main>
  );
}
