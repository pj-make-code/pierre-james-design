"use client";

import { LinkSimple } from "@phosphor-icons/react";
import { useCopy } from "@/lib/hooks/useCopy";
import styles from "./CopyLinkButton.module.css";

/** Copies the current page URL. The label change is announced to screen readers. */
export default function CopyLinkButton({
  className,
  labelClassName,
}: {
  className?: string;
  /** Lets the peek hide the label on phones while keeping the icon. */
  labelClassName?: string;
}) {
  const { copied, copy } = useCopy();
  return (
    <button
      type="button"
      className={`${styles.button} ${className ?? ""}`}
      // Origin + path only: a peek opened from /work carries filters that don't belong in a shared link.
      onClick={() => copy(window.location.origin + window.location.pathname)}
    >
      <LinkSimple size={15} aria-hidden="true" />
      <span aria-live="polite" className={labelClassName}>
        {copied ? "Copied" : "Copy link"}
      </span>
    </button>
  );
}
