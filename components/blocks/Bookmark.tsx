import styles from "./blocks.module.css";

type Props = { title: string; outlet?: string; url: string; image?: string };

/** Press/link card with a thumbnail on the right. */
export default function Bookmark({ title, outlet, url, image }: Props) {
  return (
    <a
      href={url}
      className={styles.bookmark}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className={styles.bookmarkText}>
        <span className={styles.bookmarkTitle}>{title}</span>
        {outlet && <span className={styles.bookmarkOutlet}>{outlet}</span>}
      </span>
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt=""
          className={styles.bookmarkThumb}
          loading="lazy"
        />
      ) : (
        // TODO(PJ): press thumbnail image.
        <span className={styles.bookmarkThumb} aria-hidden="true" />
      )}
    </a>
  );
}
