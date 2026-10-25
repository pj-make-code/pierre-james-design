import Link from "next/link";
import type { Project } from "@/lib/content/projects";
import styles from "./project.module.css";

/** Previous / next project cards at the end of a case study. */
export default function PrevNext({
  prev,
  next,
  inPeek = false,
}: {
  prev: Project;
  next: Project;
  inPeek?: boolean;
}) {
  const cards = [
    { project: prev, label: "← Previous", className: styles.pnCard },
    {
      project: next,
      label: "Next →",
      className: `${styles.pnCard} ${styles.pnNext}`,
    },
  ];
  return (
    <nav aria-label="More projects" className={styles.prevNext}>
      {cards.map(({ project, label, className }) => {
        const href = `/work/${project.slug}`;
        const content = (
          <>
            <span className={styles.pnLabel}>{label}</span>
            <span className={styles.pnTitle}>{project.title}</span>
          </>
        );
        // In the peek: a <Link> that replaces history, so Close still returns to the
        // page underneath. On the full page: a plain <a>, because any <Link> to a
        // project is intercepted into a peek, which would stack over this page.
        return inPeek ? (
          <Link key={href} href={href} replace className={className}>
            {content}
          </Link>
        ) : (
          <a key={href} href={href} className={className}>
            {content}
          </a>
        );
      })}
    </nav>
  );
}
