import Link from "next/link";
import TagChip from "@/components/ui/TagChip";
import { TAGS } from "@/content/tags";
import type { Project } from "@/lib/content/projects";
import styles from "./ProjectCard.module.css";

/**
 * Gallery card: cover, icon + title, summary, tags. A real <Link>, so
 * Cmd/Ctrl-click opens a new tab and Phase 4 can intercept it into the peek.
 */
export default function ProjectCard({ project }: { project: Project }) {
  // Placeholder cover colors come from a tag until real cover images exist.
  const tone = TAGS[project.coverTag ?? project.tags[0]];
  const toneVars = {
    "--tone-bg": tone.bg,
    "--tone-fg": tone.fg,
  } as React.CSSProperties;

  return (
    <Link
      href={`/work/${project.slug}`}
      className={`ui ${styles.card}`}
      style={toneVars}
    >
      <div className={styles.cover}>
        <div className={styles.coverInner}>
          {project.cover ? (
            // TODO(PJ): next/image once covers exist and the Images binding is on.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={project.cover} alt="" className={styles.coverImg} />
          ) : (
            <span className={`mono ${styles.coverPlaceholder}`}>
              [COVER IMAGE]
            </span>
          )}
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.titleRow}>
          <span className={styles.icon} aria-hidden="true">
            {project.icon}
          </span>
          <h3 className={styles.title}>{project.title}</h3>
        </div>
        <p className={styles.summary}>{project.summary}</p>
        <div className={styles.chips}>
          {project.tags.map((tag) => (
            <TagChip key={tag} tag={tag} size="sm" />
          ))}
        </div>
      </div>
    </Link>
  );
}
