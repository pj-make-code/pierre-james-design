"use client";

import { ArrowsOut, CaretDown, CaretUp, X } from "@phosphor-icons/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import CopyLinkButton from "@/components/ui/CopyLinkButton";
import type { ProjectType, TagKey } from "@/content/tags";
import { peekList } from "@/lib/work/filters";
import styles from "./PeekShell.module.css";

type Props = {
  /** Every project in display order; ↑/↓ step through them (or the /work filtered list). */
  projects: {
    slug: string;
    title: string;
    tags: TagKey[];
    type: ProjectType;
    sortDate: string;
  }[];
  children: React.ReactNode;
};

/**
 * Notion-style center peek (PLAN §4.2, §5.2). A native modal <dialog> gives us
 * the top layer (above the Menu), an inert page behind it, and Esc for free.
 */
export default function PeekShell({ projects, children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.size ? `?${searchParams.toString()}` : "";
  const list = peekList(projects, searchParams);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  // Guards against closing twice (e.g. Esc then a stray click) and against
  // acting after unmount, either of which would step back through history twice.
  const dismissed = useRef(false);
  const alive = useRef(false);

  const slug = pathname.split("/").pop();
  const i = Math.max(
    0,
    list.findIndex((p) => p.slug === slug),
  );
  const current = list[i];
  const prev = list[(i - 1 + list.length) % list.length];
  const next = list[(i + 1) % list.length];

  // The peek only exists after an in-site click, so there's always a page to go back to.
  const dismiss = useCallback(() => {
    if (dismissed.current || !alive.current) return;
    dismissed.current = true;
    router.back();
  }, [router]);

  // Replace, not push: stepping through projects shouldn't stack history,
  // so one Back (or Close) still returns to the page underneath.
  const step = (slug: string) =>
    router.replace(`/work/${slug}${search}`, { scroll: false });

  // Open as a modal, lock page scroll, and hand focus back to the card on close.
  useEffect(() => {
    alive.current = true;
    const dialog = dialogRef.current;
    if (!dialog) return;
    // Safari doesn't focus links on click, so fall back to the card for this project.
    const opener =
      document.activeElement && document.activeElement !== document.body
        ? (document.activeElement as HTMLElement)
        : document.querySelector<HTMLElement>(
            // Links from /work carry their filters, so match the full URL.
            `main a[href="${window.location.pathname}${window.location.search}"]`,
          );
    if (!dialog.open) dialog.showModal();
    panelRef.current?.focus();

    const html = document.documentElement;
    const previousOverflow = html.style.overflow;
    html.style.overflow = "hidden";

    return () => {
      alive.current = false;
      html.style.overflow = previousOverflow;
      // Close before refocusing: while the dialog is modal the page behind it is
      // inert and can't take focus.
      if (dialog.open) dialog.close();
      opener?.focus({ preventScroll: true });
    };
  }, []);

  // Each project starts at the top.
  useEffect(() => {
    panelRef.current?.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-label={current?.title}
      // Esc: route-driven close instead of the browser's, so the URL follows.
      onCancel={(e) => {
        e.preventDefault();
        dismiss();
      }}
      // Browsers can still force-close a dialog (repeated Esc); keep the URL in sync.
      // `open` is checked because the event arrives late: by then a dev-mode effect
      // re-run may have reopened the dialog, and our own cleanup close isn't a dismissal.
      onClose={() => {
        if (!dialogRef.current?.open) dismiss();
      }}
      // The dialog fills the viewport; a click that lands on it, not the panel, is outside.
      onClick={(e) => {
        if (e.target === e.currentTarget) dismiss();
      }}
    >
      <div ref={panelRef} className={styles.panel} tabIndex={-1}>
        <div className={`ui ${styles.bar}`}>
          <div className={styles.group}>
            {/* A hard navigation: a client-side push to the same URL would stay intercepted. */}
            <button
              type="button"
              className={styles.ghost}
              onClick={() => window.location.assign(pathname)}
            >
              <ArrowsOut size={15} aria-hidden="true" />
              Open as full page
            </button>
            <CopyLinkButton labelClassName={styles.hideSm} />
          </div>
          <div className={styles.group}>
            <button
              type="button"
              className={`${styles.ghost} ${styles.icon}`}
              aria-label={`Previous project: ${prev.title}`}
              onClick={() => step(prev.slug)}
            >
              <CaretUp size={16} aria-hidden="true" />
            </button>
            <button
              type="button"
              className={`${styles.ghost} ${styles.icon}`}
              aria-label={`Next project: ${next.title}`}
              onClick={() => step(next.slug)}
            >
              <CaretDown size={16} aria-hidden="true" />
            </button>
            <button
              type="button"
              className={`${styles.ghost} ${styles.icon}`}
              aria-label="Close"
              onClick={dismiss}
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
        {children}
      </div>
    </dialog>
  );
}
