import Footer from "@/components/home/Footer";
import SectionHeader from "@/components/home/SectionHeader";
import { homeSections, site } from "@/content/site";
import styles from "./page.module.css";

// Phase 1 shell preview: real section headers, anchors, and footer, with empty
// bodies so the Menu has somewhere to scroll. Phase 3 fills in the home page.
export default function Home() {
  return (
    <main className={styles.main}>
      <section id="top" className={styles.hero}>
        <h1 className={styles.name}>{site.name}</h1>
        {/* TODO(PJ): Phase 3 replaces this with the hero (portrait, intro, socials). */}
        <p className={styles.note}>{site.domain} — coming soon</p>
      </section>

      {homeSections.map((s) => (
        <section key={s.id} id={s.id} className={styles.section}>
          <SectionHeader
            number={s.number}
            title={s.title}
            more={
              s.page && s.moreLabel
                ? { href: s.page, label: s.moreLabel }
                : null
            }
          />
          <p className={`mono ${styles.placeholder}`}>
            SECTION CONTENT ARRIVES IN PHASE 3
          </p>
        </section>
      ))}

      <Footer />
    </main>
  );
}
