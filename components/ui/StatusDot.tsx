import { STATUS_DOT, type ProjectStatus } from "@/content/tags";
import styles from "./StatusDot.module.css";

export default function StatusDot({ status }: { status: ProjectStatus }) {
  return (
    <span className={styles.status}>
      <span
        className={styles.dot}
        style={{ "--dot": STATUS_DOT[status] } as React.CSSProperties}
        aria-hidden="true"
      />
      {status}
    </span>
  );
}
