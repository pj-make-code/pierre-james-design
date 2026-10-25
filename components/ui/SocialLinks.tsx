import {
  GithubLogo,
  InstagramLogo,
  LinkedinLogo,
} from "@phosphor-icons/react/ssr";
import { site, type SocialKey } from "@/content/site";
import styles from "./SocialLinks.module.css";

export const SOCIAL_ICONS: Record<SocialKey, typeof GithubLogo> = {
  linkedin: LinkedinLogo,
  instagram: InstagramLogo,
  github: GithubLogo,
};

/** Icon links with 44px hit targets: gray, white on hover. Used in the hero (24px icons) and footer (20px). */
export default function SocialLinks({
  className,
  iconSize = 20,
}: {
  className?: string;
  iconSize?: number;
}) {
  return (
    <ul className={`${styles.list} ${className ?? ""}`}>
      {site.socials.map(({ key, label, url }) => {
        const Icon = SOCIAL_ICONS[key];
        return (
          <li key={key}>
            <a
              href={url}
              className={styles.link}
              aria-label={label}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon size={iconSize} aria-hidden="true" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
