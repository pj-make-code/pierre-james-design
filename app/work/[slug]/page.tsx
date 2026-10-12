import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectDocument from "@/components/project/ProjectDocument";
import Toc from "@/components/project/Toc";
import CopyLinkButton from "@/components/ui/CopyLinkButton";
import { getNeighbors, getProject, getProjects } from "@/lib/content/projects";
import styles from "./page.module.css";

// Every project page is pre-rendered at build time; unknown slugs 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.title} — Pierre James Beigh`,
    description: project.summary,
  };
}

/** Full-page shell for a case study (PLAN §4.2). Phase 4 adds the peek shell. */
export default async function ProjectPage({
  params,
}: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const { prev, next } = getNeighbors(slug);

  return (
    <main className={styles.page}>
      <div className={styles.bar}>
        <Link href="/work" className={styles.back}>
          ← All work
        </Link>
        <CopyLinkButton />
      </div>
      <ProjectDocument
        project={project}
        prev={prev}
        next={next}
        variant="full"
      />
      <Toc scope="[data-doc]" />
    </main>
  );
}
