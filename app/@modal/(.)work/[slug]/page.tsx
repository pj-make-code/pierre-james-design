import { notFound } from "next/navigation";
import ProjectDocument from "@/components/project/ProjectDocument";
import { getNeighbors, getProject, getProjects } from "@/lib/content/projects";
import { peekList } from "@/lib/work/filters";

/** Re-serializes the incoming query so prev/next links keep it. */
function toSearchString(query: Record<string, string | string[] | undefined>) {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (typeof v === "string") q.set(k, v);
  }
  const s = q.toString().replace(/%2C/g, ",");
  return s ? `?${s}` : "";
}

/** The case study inside the peek. A refresh or shared link renders app/work/[slug] instead. */
export default async function PeekPage({
  params,
  searchParams,
}: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  // Opened from /work, the link carries its filters: step through that list.
  const query = await searchParams;
  const { prev, next } = getNeighbors(slug, peekList(getProjects(), query));
  return (
    <ProjectDocument
      project={project}
      prev={prev}
      next={next}
      variant="peek"
      search={toSearchString(query)}
    />
  );
}
