import { TAGS, type TagKey } from "@/content/tags";
import styles from "./TagChip.module.css";

/** Colored tag chip. Colors come from content/tags.ts via CSS variables. */
export default function TagChip({
  tag,
  size = "md",
}: {
  tag: TagKey;
  /** "sm" is the compact chip on project cards. */
  size?: "sm" | "md";
}) {
  const t = TAGS[tag];
  return (
    <span
      className={styles.chip}
      data-size={size}
      style={{ "--chip-bg": t.bg, "--chip-fg": t.fg } as React.CSSProperties}
    >
      {t.label}
    </span>
  );
}
