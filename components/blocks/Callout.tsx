import { Lightbulb } from "@phosphor-icons/react/ssr";
import styles from "./blocks.module.css";

/** Gray box with a purple lightbulb tile and italic text. */
export default function Callout({
  label,
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <aside className={styles.callout}>
      <span className={styles.calloutTile} aria-hidden="true">
        <Lightbulb size={14} weight="fill" />
      </span>
      <div className={styles.calloutBody}>
        {label && <span className={styles.calloutLabel}>{label}</span>}
        <p className={styles.calloutText}>{children}</p>
      </div>
    </aside>
  );
}
