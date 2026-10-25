import Link from "next/link";
import type { Project } from "@/lib/content/projects";
import styles from "./project.module.css";

/** Previous / next project cards at the end of a case study. */
export default function PrevNext({
  prev,
  next,
}: {
  prev: Project;
  next: Project;
}) {
  return (
    <nav aria-label="More projects" className={styles.prevNext}>
      <Link href={`/work/${prev.slug}`} className={styles.pnCard}>
        <span className={styles.pnLabel}>← Previous</span>
        <span className={styles.pnTitle}>{prev.title}</span>
      </Link>
      <Link
        href={`/work/${next.slug}`}
        className={`${styles.pnCard} ${styles.pnNext}`}
      >
        <span className={styles.pnLabel}>Next →</span>
        <span className={styles.pnTitle}>{next.title}</span>
      </Link>
    </nav>
  );
}
