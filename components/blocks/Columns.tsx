import styles from "./blocks.module.css";

export function Columns({ children }: { children: React.ReactNode }) {
  return <div className={styles.columns}>{children}</div>;
}

/** Bordered card with an uppercase kicker, a title, and body text. */
export function Column({
  kicker,
  title,
  children,
}: {
  kicker?: string;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.column}>
      {kicker && <span className={styles.kicker}>{kicker}</span>}
      {title && <span className={styles.columnTitle}>{title}</span>}
      <div className={styles.columnText}>{children}</div>
    </div>
  );
}
