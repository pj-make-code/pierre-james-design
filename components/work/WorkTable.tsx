import Link from "next/link";
import StatusDot from "@/components/ui/StatusDot";
import TagChip from "@/components/ui/TagChip";
import { TAGS } from "@/content/tags";
import type { Project } from "@/lib/content/projects";
import styles from "./WorkTable.module.css";

/**
 * Table view: Name, Role, Year, Tags, Status. The name link stretches over the
 * whole row, so any cell opens the project. Scrolls sideways on small screens.
 */
export default function WorkTable({
  projects,
  hrefFor,
}: {
  projects: Project[];
  hrefFor: (p: Project) => string;
}) {
  return (
    <div className={`ui ${styles.wrap}`}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Role</th>
            <th scope="col">Year</th>
            <th scope="col">Tags</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => {
            const tone = TAGS[p.coverTag ?? p.tags[0]];
            return (
              <tr key={p.slug} className={styles.row}>
                <td>
                  <Link href={hrefFor(p)} className={styles.name}>
                    <span
                      className={styles.icon}
                      style={
                        {
                          "--tone-bg": tone.bg,
                          "--tone-fg": tone.fg,
                        } as React.CSSProperties
                      }
                      aria-hidden="true"
                    >
                      {p.icon}
                    </span>
                    {p.title}
                  </Link>
                </td>
                <td className={styles.dim}>{p.role.join(", ")}</td>
                <td className={`mono ${styles.dim} ${styles.year}`}>
                  {p.year}
                </td>
                <td>
                  <div className={styles.chips}>
                    {p.tags.map((t) => (
                      <TagChip key={t} tag={t} />
                    ))}
                  </div>
                </td>
                <td className={styles.dim}>
                  <StatusDot status={p.status} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
