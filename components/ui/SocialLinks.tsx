import {
  GithubLogo,
  InstagramLogo,
  LinkedinLogo,
} from "@phosphor-icons/react/ssr";
import { site, type SocialKey } from "@/content/site";
import styles from "./SocialLinks.module.css";

const ICONS: Record<SocialKey, typeof GithubLogo> = {
  linkedin: LinkedinLogo,
  instagram: InstagramLogo,
  github: GithubLogo,
};

/** Icon links with 44px hit targets: gray, white on hover. Used in the hero and footer. */
export default function SocialLinks({ className }: { className?: string }) {
  return (
    <ul className={`${styles.list} ${className ?? ""}`}>
      {site.socials.map(({ key, label, url }) => {
        const Icon = ICONS[key];
        return (
          <li key={key}>
            <a
              href={url}
              className={styles.link}
              aria-label={label}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon size={20} aria-hidden="true" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
