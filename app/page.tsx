import AboutPreview from "@/components/home/AboutPreview";
import ContactBlock from "@/components/home/ContactBlock";
import Footer from "@/components/home/Footer";
import Hero from "@/components/home/Hero";
import SectionHeader from "@/components/home/SectionHeader";
import PhotoGrid from "@/components/photos/PhotoGrid";
import ProjectCard from "@/components/work/ProjectCard";
import { photos } from "@/content/photos";
import { homeSections, type HomeSectionId } from "@/content/site";
import { getProjects } from "@/lib/content/projects";
import styles from "./page.module.css";

// The body of each numbered home section, keyed by its anchor id.
const bodies: Record<HomeSectionId, () => React.ReactNode> = {
  work: () => (
    <div className={styles.cards}>
      {getProjects()
        .filter((p) => p.featured)
        .map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
    </div>
  ),
  about: () => <AboutPreview />,
  photos: () => <PhotoGrid photos={photos.filter((p) => p.featuredOnHome)} />,
  contact: () => <ContactBlock />,
};

export default function Home() {
  return (
    <main className={styles.main}>
      <Hero />

      {homeSections.map((s) => (
        <section
          key={s.id}
          id={s.id}
          className={styles.section}
          data-section={s.id}
        >
          <SectionHeader
            number={s.number}
            title={s.title}
            more={
              s.page && s.moreLabel
                ? { href: s.page, label: s.moreLabel }
                : null
            }
          />
          {bodies[s.id]()}
        </section>
      ))}

      {/* TODO(PJ): Phase 7 adds the arcade (#play) here. */}
      <Footer />
    </main>
  );
}
