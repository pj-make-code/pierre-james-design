import { TAGS } from "@/content/tags";
import type { Project } from "@/lib/content/projects";
import PrevNext from "./PrevNext";
import Properties from "./Properties";
import TldrCallout from "./TldrCallout";
import styles from "./project.module.css";

type Props = {
  project: Project;
  prev: Project;
  next: Project;
  /** "full" = standalone page; "peek" = inside the modal. Changes sizing and how prev/next navigate. */
  variant: "full" | "peek";
  /** Query string to keep on prev/next links (the peek's database filters). */
  search?: string;
};

/** One case study, rendered the same way in both shells (PLAN §4.2). */
export default function ProjectDocument({
  project,
  prev,
  next,
  variant,
  search = "",
}: Props) {
  const { Body } = project;
  // Placeholder cover colors come from a tag until real cover images exist.
  const tone = TAGS[project.coverTag ?? project.tags[0]];
  const toneVars = {
    "--tone-bg": tone.bg,
    "--tone-fg": tone.fg,
  } as React.CSSProperties;

  return (
    <div className={styles.document} data-variant={variant} style={toneVars}>
      <div className={styles.cover}>
        {project.cover ? (
          // TODO(PJ): next/image once covers exist and the Images binding is on.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={project.cover} alt="" className={styles.coverImg} />
        ) : (
          <span className={`mono ${styles.coverPlaceholder}`}>
            [COVER IMAGE — {project.title}]
          </span>
        )}
      </div>

      <article className={styles.doc} data-doc>
        <div className={styles.iconTile} aria-hidden="true">
          {project.icon}
        </div>
        <h1 className={styles.title}>{project.title}</h1>
        <Properties project={project} />
        <TldrCallout project={project} />
        <div className={styles.body}>
          <Body />
        </div>
        <PrevNext
          prev={prev}
          next={next}
          inPeek={variant === "peek"}
          search={search}
        />
      </article>
    </div>
  );
}
