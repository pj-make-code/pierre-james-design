"use client";

import { Play } from "@phosphor-icons/react";
import { useState } from "react";
import styles from "./blocks.module.css";

type Props =
  | { src: string; youtube?: never; title?: string; poster?: string }
  | { youtube: string; src?: never; title: string; poster?: string };

/**
 * Self-hosted video, or a YouTube facade: just a poster and play button until
 * clicked, so YouTube's scripts never load for people who don't watch.
 */
export default function Video({ src, youtube, title, poster }: Props) {
  const [playing, setPlaying] = useState(false);

  if (src) {
    return (
      <video
        className={styles.video}
        src={src}
        poster={poster}
        controls
        playsInline
        preload="metadata"
        title={title}
      />
    );
  }

  const id = encodeURIComponent(youtube ?? "");
  if (playing) {
    return (
      <iframe
        className={styles.video}
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
        title={title}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    );
  }
  return (
    <a
      href={`https://www.youtube.com/watch?v=${id}`}
      className={styles.videoFacade}
      style={poster ? { backgroundImage: `url(${poster})` } : undefined}
      onClick={(e) => {
        e.preventDefault();
        setPlaying(true);
      }}
      aria-label={`Play video: ${title}`}
    >
      <span className={styles.videoPlay} aria-hidden="true">
        <Play size={24} weight="fill" />
      </span>
    </a>
  );
}
