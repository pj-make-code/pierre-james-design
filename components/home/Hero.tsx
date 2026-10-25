import Link from "next/link";
import SocialLinks from "@/components/ui/SocialLinks";
import { site, type Inline } from "@/content/site";
import styles from "./Hero.module.css";

/** Renders one hero paragraph's runs: text, line breaks, and brand-colored links. */
function Runs({ runs }: { runs: readonly Inline[] }) {
  return runs.map((run, i) => {
    if (typeof run === "string") return run;
    if ("br" in run) return <br key={i} />;
    const props = {
      href: run.href,
      className: styles.brandLink,
      "data-brand": run.brand,
    };
    // Internal links use <Link> so Phase 4 can intercept /work/hale into the peek.
    return run.external ? (
      <a key={i} {...props} target="_blank" rel="noopener noreferrer">
        {run.text}
      </a>
    ) : (
      <Link key={i} {...props}>
        {run.text}
      </Link>
    );
  });
}

/** Portrait left, name + intro + socials right; stacks below 760px (PLAN §4.1). */
export default function Hero() {
  const { portrait, intro } = site.hero;
  return (
    <section id="top" className={styles.hero}>
      {/* TODO(PJ): next/image once the Cloudflare Images binding is enabled. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={portrait.src}
        alt={portrait.alt}
        width={portrait.width}
        height={portrait.height}
        className={styles.portrait}
        fetchPriority="high"
      />
      <div className={styles.text}>
        <h1 className={styles.name}>{site.name}</h1>
        <div className={styles.intro}>
          {intro.map((runs, i) => (
            <p key={i}>
              <Runs runs={runs} />
            </p>
          ))}
        </div>
        <nav aria-label="Social">
          <SocialLinks iconSize={24} className={styles.socials} />
        </nav>
      </div>
    </section>
  );
}
