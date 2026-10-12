import Link from "next/link";
import styles from "./SectionHeader.module.css";

type Props = {
  /** Mono section number, e.g. "01". */
  number: string;
  title: string;
  /** Optional right-aligned "More" link to the long-form page. */
  more?: { href: string; label: string } | null;
};

/** Mono number + serif title over a 1px white rule, with "More" on the right (PLAN §2). */
export default function SectionHeader({ number, title, more }: Props) {
  return (
    <div className={styles.header}>
      <h2 className={styles.title}>
        <span className={`mono ${styles.number}`}>{number}</span>
        {title}
      </h2>
      {more && (
        <Link href={more.href} className={styles.more} aria-label={more.label}>
          More
        </Link>
      )}
    </div>
  );
}
