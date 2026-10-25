import { notFound } from "next/navigation";
import ProjectDocument from "@/components/project/ProjectDocument";
import { getNeighbors, getProject } from "@/lib/content/projects";

/** The case study inside the peek. A refresh or shared link renders app/work/[slug] instead. */
export default async function PeekPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const { prev, next } = getNeighbors(slug);
  return (
    <ProjectDocument project={project} prev={prev} next={next} variant="peek" />
  );
}
