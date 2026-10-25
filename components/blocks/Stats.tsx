import styles from "./blocks.module.css";

export type StatItem = { value: string; label: string };

/** Tiles with a large number and a small label. A <dl> so screen readers pair them. */
export default function Stats({ items }: { items: StatItem[] }) {
  return (
    <dl className={styles.stats}>
      {items.map((s, i) => (
        <div key={i} className={styles.stat}>
          <dt className={styles.statLabel}>{s.label}</dt>
          <dd className={styles.statValue}>{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}
