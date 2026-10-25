import styles from "./blocks.module.css";

type Props = {
  /** Image path. Until real assets exist, omit it and pass `label` for a placeholder. */
  src?: string;
  alt?: string;
  /** Placeholder text shown when there's no `src` (e.g. "[Key screens]"). */
  label?: string;
  caption?: string;
};

/** 16:9 figure with an italic caption. */
export default function Figure({ src, alt, label, caption }: Props) {
  return (
    <figure className={styles.figure}>
      {src ? (
        // TODO(PJ): switch to next/image once the Cloudflare Images binding is enabled (wrangler.jsonc).
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt ?? ""}
          className={styles.figureMedia}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div
          className={`mono ${styles.figurePlaceholder}`}
          role="img"
          aria-label={label ?? alt ?? "Image placeholder"}
        >
          {label}
        </div>
      )}
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
