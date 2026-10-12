import { TAGS, type TagKey } from "@/content/tags";
import styles from "./TagChip.module.css";

/** Colored tag chip. Colors come from content/tags.ts via CSS variables. */
export default function TagChip({ tag }: { tag: TagKey }) {
  const t = TAGS[tag];
  return (
    <span
      className={styles.chip}
      style={{ "--chip-bg": t.bg, "--chip-fg": t.fg } as React.CSSProperties}
    >
      {t.label}
    </span>
  );
}
