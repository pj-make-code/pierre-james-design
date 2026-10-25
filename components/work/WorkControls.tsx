import { SquaresFour, Table } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { PROJECT_TYPES, TAG_KEYS, TAGS } from "@/content/tags";
import { isFiltered, toSearch, type WorkFilters } from "@/lib/work/filters";
import styles from "./WorkControls.module.css";

// Every control is a link to the next URL state, so it works without JavaScript
// and the server renders the result. `replace` keeps filter fiddling out of the
// Back button; `scroll={false}` keeps the page where it is.
function StateLink({
  to,
  current,
  className,
  style,
  children,
}: {
  to: WorkFilters;
  current: boolean;
  className: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={`/work${toSearch(to)}`}
      replace
      scroll={false}
      className={className}
      style={style}
      aria-current={current ? "true" : undefined}
    >
      {children}
    </Link>
  );
}

/** View tabs + sort, over a white rule (PLAN §4.3). */
export function ViewAndSort({ filters: f }: { filters: WorkFilters }) {
  return (
    <div className={`ui ${styles.bar}`}>
      <div role="group" aria-label="View" className={styles.group}>
        <StateLink
          to={{ ...f, view: "gallery" }}
          current={f.view === "gallery"}
          className={styles.toggle}
        >
          <SquaresFour size={15} aria-hidden="true" />
          Gallery
        </StateLink>
        <StateLink
          to={{ ...f, view: "table" }}
          current={f.view === "table"}
          className={styles.toggle}
        >
          <Table size={15} aria-hidden="true" />
          Table
        </StateLink>
      </div>
      <div role="group" aria-label="Sort" className={styles.group}>
        <span className={styles.groupLabel} aria-hidden="true">
          Sort
        </span>
        <StateLink
          to={{ ...f, sort: "newest" }}
          current={f.sort === "newest"}
          className={styles.toggle}
        >
          Newest
        </StateLink>
        <StateLink
          to={{ ...f, sort: "oldest" }}
          current={f.sort === "oldest"}
          className={styles.toggle}
        >
          Oldest
        </StateLink>
      </div>
    </div>
  );
}

/** Multi-select tag chips (light up in the tag's colors) and single-select type. */
export function Filters({ filters: f }: { filters: WorkFilters }) {
  const cleared = { ...f, tags: [], type: null };
  return (
    <div className={`ui ${styles.filters}`}>
      <div role="group" aria-label="Filter by tag" className={styles.row}>
        <span className={styles.rowLabel} aria-hidden="true">
          Tags
        </span>
        {TAG_KEYS.map((key) => {
          const on = f.tags.includes(key);
          const tags = on ? f.tags.filter((t) => t !== key) : [...f.tags, key];
          return (
            <StateLink
              key={key}
              to={{ ...f, tags }}
              current={on}
              className={styles.chip}
              style={
                {
                  "--chip-bg": TAGS[key].bg,
                  "--chip-fg": TAGS[key].fg,
                } as React.CSSProperties
              }
            >
              {TAGS[key].label}
            </StateLink>
          );
        })}
      </div>
      <div role="group" aria-label="Filter by type" className={styles.row}>
        <span className={styles.rowLabel} aria-hidden="true">
          Type
        </span>
        {[null, ...PROJECT_TYPES].map((type) => (
          <StateLink
            key={type ?? "all"}
            to={{ ...f, type }}
            current={f.type === type}
            className={`${styles.chip} ${styles.typeChip}`}
          >
            {type ?? "All"}
          </StateLink>
        ))}
        {isFiltered(f) && (
          <Link
            href={`/work${toSearch(cleared)}`}
            replace
            scroll={false}
            className={styles.reset}
          >
            Reset
          </Link>
        )}
      </div>
    </div>
  );
}

/** Dashed box shown when nothing matches. */
export function EmptyState({ filters: f }: { filters: WorkFilters }) {
  return (
    <div className={`ui ${styles.empty}`}>
      <p>No projects match these filters.</p>
      <Link
        href={`/work${toSearch({ ...f, tags: [], type: null })}`}
        replace
        scroll={false}
        className={styles.emptyReset}
      >
        Reset filters
      </Link>
    </div>
  );
}
