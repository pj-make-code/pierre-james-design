import { SOCIAL_ICONS } from "@/components/ui/SocialLinks";
import { site } from "@/content/site";
import CopyEmailButton from "./CopyEmailButton";
import styles from "./ContactBlock.module.css";

/** Statement, "Copy my email" pill, and text links for socials + resume (PLAN §4.1, 04 Contact). */
export default function ContactBlock() {
  const { statement, copyLabel, copiedLabel } = site.contact;
  return (
    <>
      <p className={styles.statement}>{statement}</p>
      <div className={`ui ${styles.actions}`}>
        <CopyEmailButton
          email={site.email}
          label={copyLabel}
          copiedLabel={copiedLabel}
        />
        {site.socials.map(({ key, label, url }) => {
          const Icon = SOCIAL_ICONS[key];
          return (
            <a
              key={key}
              href={url}
              className={styles.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon size={20} aria-hidden="true" />
              {label}
            </a>
          );
        })}
        <a
          href={site.resume}
          className={styles.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          Resume
        </a>
      </div>
    </>
  );
}
