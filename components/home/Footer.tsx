import SocialLinks from "@/components/ui/SocialLinks";
import { site } from "@/content/site";
import styles from "./Footer.module.css";

/** Mono colophon on the left; socials and "Back to top" on the right (PLAN §4.1). */
export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span className={`mono ${styles.colophon}`}>{site.colophon}</span>
      <div className={styles.right}>
        <SocialLinks />
        <a href="#top" className={`mono ${styles.top}`}>
          BACK TO TOP ↑
        </a>
      </div>
    </footer>
  );
}
