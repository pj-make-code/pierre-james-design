import StatusDot from "@/components/ui/StatusDot";
import TagChip from "@/components/ui/TagChip";
import type { Project } from "@/lib/content/projects";
import styles from "./project.module.css";

/** Notion-style properties block: mono labels on the left, values on the right. */
export default function Properties({ project }: { project: Project }) {
  return (
    <dl className={styles.properties}>
      <dt className={`mono ${styles.propLabel}`}>Role</dt>
      <dd>{project.role.join(", ")}</dd>

      <dt className={`mono ${styles.propLabel}`}>Timeline</dt>
      <dd>{project.timeline}</dd>

      {project.team && (
        <>
          <dt className={`mono ${styles.propLabel}`}>Team</dt>
          <dd>{project.team}</dd>
        </>
      )}

      <dt className={`mono ${styles.propLabel}`}>Type</dt>
      <dd>{project.type}</dd>

      <dt className={`mono ${styles.propLabel}`}>Tags</dt>
      <dd className={styles.chips}>
        {project.tags.map((t) => (
          <TagChip key={t} tag={t} />
        ))}
      </dd>

      {project.links.length > 0 && (
        <>
          <dt className={`mono ${styles.propLabel}`}>Links</dt>
          <dd className={styles.links}>
            {project.links.map((l) => (
              <a
                key={l.url + l.label}
                href={l.url}
                className={styles.bright}
                target="_blank"
                rel="noopener noreferrer"
              >
                {l.label} ↗
              </a>
            ))}
          </dd>
        </>
      )}

      <dt className={`mono ${styles.propLabel}`}>Status</dt>
      <dd>
        <StatusDot status={project.status} />
      </dd>
    </dl>
  );
}
