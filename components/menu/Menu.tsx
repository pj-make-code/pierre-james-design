"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { homeSections, type HomeSectionId } from "@/content/site";
import { MENU_POSITION } from "@/lib/config";
import styles from "./Menu.module.css";

type Item = { key: "top" | HomeSectionId; label: string; href: string };

/** On "/", items jump to sections; elsewhere they open full pages (PLAN §3). */
function buildItems(onHome: boolean): { home: Item; sections: Item[] } {
  return {
    home: { key: "top", label: "Home", href: onHome ? "#top" : "/" },
    sections: homeSections.map((s) => ({
      key: s.id,
      label: s.menuLabel,
      href: onHome ? `#${s.id}` : (s.page ?? `/#${s.id}`),
    })),
  };
}

/** Which item is "current". On home it's the section in view; elsewhere it follows the route. */
function activeKey(pathname: string, inView: Item["key"]): Item["key"] | null {
  if (pathname === "/") return inView;
  const match = homeSections.find((s) => s.page && pathname.startsWith(s.page));
  return match?.id ?? null;
}

/**
 * Scroll-spy (PLAN §5.6): reports the home section crossing a thin band just
 * above the middle of the viewport. Between sections it keeps the last one.
 */
function useSectionInView(enabled: boolean): Item["key"] {
  const [inView, setInView] = useState<Item["key"]>("top");
  useEffect(() => {
    if (!enabled || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setInView(e.target.id as Item["key"]);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const id of ["top", ...homeSections.map((s) => s.id)]) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, [enabled]);
  return inView;
}

export default function Menu() {
  const pathname = usePathname();
  // Remember the route the menu was opened on, so navigating (e.g. Back) closes it
  // without needing a state update inside an effect.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;

  const pillRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);
  // Only hand focus back to the pill when the user closed the menu (Esc, Close,
  // click outside) — not after they chose a destination.
  const restoreFocus = useRef(false);

  const onHome = pathname === "/";
  const { home, sections } = buildItems(onHome);
  const current = activeKey(pathname, useSectionInView(onHome));

  const close = useCallback((restore: boolean) => {
    restoreFocus.current = restore;
    setOpenOn(null);
  }, []);

  // Move focus into the menu on open; return it to the pill on close.
  useEffect(() => {
    if (open) {
      navRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    } else if (restoreFocus.current) {
      restoreFocus.current = false;
      pillRef.current?.focus();
    }
  }, [open]);

  // Esc closes from anywhere while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  // Focus trap: Tab / Shift-Tab / ↑ / ↓ cycle through the items.
  const onNavKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key !== "Tab" && e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    const items = Array.from(
      navRef.current?.querySelectorAll<HTMLElement>("a, button") ?? [],
    );
    if (!items.length) return;
    e.preventDefault();
    const i = items.indexOf(document.activeElement as HTMLElement);
    const back = e.key === "ArrowUp" || (e.key === "Tab" && e.shiftKey);
    items[(i + (back ? -1 : 1) + items.length) % items.length].focus();
  };

  const itemProps = (item: Item) => ({
    href: item.href,
    className: styles.item,
    "aria-current": current === item.key ? ("location" as const) : undefined,
    onClick: () => close(false),
  });

  return (
    <div className={styles.root} data-position={MENU_POSITION}>
      {open && (
        <>
          {/* Invisible full-screen layer: a click outside the menu closes it. */}
          <button
            type="button"
            className={styles.scrim}
            aria-label="Close menu"
            tabIndex={-1}
            onClick={() => close(true)}
          />
          <nav
            id="site-menu"
            aria-label="Site"
            ref={navRef}
            className={styles.popover}
            onKeyDown={onNavKeyDown}
          >
            <Link {...itemProps(home)}>{home.label}</Link>
            <span className={styles.divider} aria-hidden="true" />
            {sections.map((item) => (
              <Link key={item.key} {...itemProps(item)}>
                {item.label}
              </Link>
            ))}
            <span className={styles.divider} aria-hidden="true" />
            <button
              type="button"
              className={`${styles.item} ${styles.close}`}
              onClick={() => close(true)}
            >
              Close
            </button>
          </nav>
        </>
      )}

      <button
        ref={pillRef}
        type="button"
        className={styles.pill}
        data-menu-pill
        aria-expanded={open}
        aria-controls="site-menu"
        onClick={() => setOpenOn(pathname)}
      >
        Menu
      </button>

      {/* Without JavaScript the pill can't open, so show the links as a plain, always-open list. */}
      <noscript>
        <style>{`[data-menu-pill]{display:none!important}`}</style>
        <nav aria-label="Site" className={`${styles.popover} ${styles.static}`}>
          <Link href="/" className={styles.item}>
            Home
          </Link>
          {homeSections.map((s) => (
            <Link
              key={s.id}
              href={s.page ?? `/#${s.id}`}
              className={styles.item}
            >
              {s.menuLabel}
            </Link>
          ))}
        </nav>
      </noscript>
    </div>
  );
}
