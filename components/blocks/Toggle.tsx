import { CaretRight } from "@phosphor-icons/react/ssr";
import styles from "./blocks.module.css";

/** Notion-style toggle. A native <details>, so it works by keyboard and without JavaScript. */
export default function Toggle({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <details className={styles.toggle}>
      <summary className={styles.toggleSummary}>
        <CaretRight
          size={12}
          weight="fill"
          className={styles.toggleChevron}
          aria-hidden="true"
        />
        {title}
      </summary>
      <div className={styles.toggleText}>{children}</div>
    </details>
  );
}
