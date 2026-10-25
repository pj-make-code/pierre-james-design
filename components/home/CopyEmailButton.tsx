"use client";

import { Copy } from "@phosphor-icons/react";
import { useCopy } from "@/lib/hooks/useCopy";
import styles from "./ContactBlock.module.css";

type Props = { email: string; label: string; copiedLabel: string };

/** White pill that copies the email and confirms for 1.6s. Without JS, a mailto link takes its place. */
export default function CopyEmailButton({ email, label, copiedLabel }: Props) {
  const { copied, copy } = useCopy();
  return (
    <>
      <button
        type="button"
        className={styles.pill}
        data-copy-email
        onClick={() => copy(email)}
      >
        <Copy size={16} aria-hidden="true" />
        <span aria-live="polite">{copied ? copiedLabel : label}</span>
      </button>
      <noscript>
        <style>{`[data-copy-email]{display:none!important}`}</style>
        <a href={`mailto:${email}`} className={styles.pill}>
          {email}
        </a>
      </noscript>
    </>
  );
}
