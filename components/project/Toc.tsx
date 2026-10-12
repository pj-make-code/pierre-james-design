"use client";

import { useEffect, useState } from "react";
import styles from "./Toc.module.css";

type Heading = { id: string; text: string };

/**
 * Right-rail table of contents (≥1180px): short gray lines that reveal heading
 * labels on hover or focus. Reads the H2s already rendered in the document, so
 * case studies don't need to list their headings anywhere else.
 */
export default function Toc({ scope }: { scope: string }) {
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    const els = document.querySelectorAll<HTMLHeadingElement>(
      `${scope} h2[id]`,
    );
    // Reading the DOM after mount is the point of this component.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHeadings(
      Array.from(els, (el) => ({ id: el.id, text: el.textContent ?? "" })),
    );
  }, [scope]);

  if (headings.length < 2) return null;

  return (
    <nav className={styles.toc} aria-label="On this page">
      {headings.map((h) => (
        <a key={h.id} href={`#${h.id}`} className={styles.link}>
          <span className={styles.label}>{h.text}</span>
          <span className={styles.line} aria-hidden="true" />
        </a>
      ))}
    </nav>
  );
}
