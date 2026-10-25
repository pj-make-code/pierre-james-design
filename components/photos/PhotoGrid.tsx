import type { Photo } from "@/content/photos";
import styles from "./PhotoGrid.module.css";

/**
 * Masonry of photos with mono film-stock captions. Static for now.
 * TODO(PJ): Phase 6 makes each tile a button that opens the lightbox.
 */
export default function PhotoGrid({ photos }: { photos: Photo[] }) {
  return (
    <div className={styles.grid}>
      {photos.map((photo, i) => (
        <figure key={i} className={styles.figure}>
          {photo.src ? (
            // TODO(PJ): next/image once the Images binding is on.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo.src}
              alt={photo.alt}
              loading="lazy"
              className={styles.tile}
              style={{ aspectRatio: photo.ratio }}
            />
          ) : (
            <div
              role="img"
              aria-label={photo.alt}
              className={styles.tile}
              style={
                {
                  aspectRatio: photo.ratio,
                  "--tone": photo.tone,
                } as React.CSSProperties
              }
            />
          )}
          <figcaption className={`mono ${styles.caption}`}>
            {photo.stock}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
