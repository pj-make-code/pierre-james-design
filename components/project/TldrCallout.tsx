import type { Project } from "@/lib/content/projects";
import styles from "./project.module.css";

/** The TL;DR box: summary paragraph plus headline stats. */
export default function TldrCallout({ project }: { project: Project }) {
  return (
    <section className={styles.tldr} aria-label="Summary">
      <div className={styles.tldrHead}>
        <span className={`mono ${styles.propLabel}`}>TL;DR</span>
        <p className={styles.tldrText}>{project.tldr}</p>
      </div>
      {project.stats.length > 0 && (
        <dl className={styles.tldrStats}>
          {project.stats.map((s, i) => (
            <div key={i} className={styles.tldrStat}>
              <dt className={styles.statLabel}>{s.label}</dt>
              <dd className={styles.statValue}>{s.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
