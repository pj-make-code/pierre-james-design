import styles from "./blocks.module.css";

/** Pull quote with a 1px white rule on the left. */
export default function Quote({
  cite,
  children,
}: {
  cite?: string;
  children: React.ReactNode;
}) {
  return (
    <figure className={styles.quote}>
      <blockquote className={styles.quoteBlock}>
        <div className={styles.quoteText}>{children}</div>
      </blockquote>
      {cite && <figcaption className={styles.cite}>{cite}</figcaption>}
    </figure>
  );
}
