import { site } from "@/content/site";
import styles from "./AboutPreview.module.css";

/** Statement, two short paragraphs, and a small portrait (PLAN §4.1, 02 About Me). */
export default function AboutPreview() {
  const { statement, paragraphs, portrait } = site.about;
  return (
    <div className={styles.row}>
      <div className={styles.text}>
        <p className={styles.statement}>{statement}</p>
        {paragraphs.map((p) => (
          <p key={p} className={styles.body}>
            {p}
          </p>
        ))}
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={portrait.src}
        alt={portrait.alt}
        width={portrait.width}
        height={portrait.height}
        loading="lazy"
        className={styles.portrait}
      />
    </div>
  );
}
