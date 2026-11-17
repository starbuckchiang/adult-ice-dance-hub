"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ExternalLink } from "@/components/ExternalLink";
import { ReplayThumbnail } from "@/components/watch/ReplayThumbnail";
import type { VideoDiscipline } from "@/data/types";
import {
  ALL_SEASONS_ID,
  filterReplayArchive,
  filterReplayArchiveWithFallback,
  type ReplayArchiveData,
  type ReplayEventView,
  type ReplaySessionView,
  type ReplaySort,
} from "@/lib/replay-archive";
import styles from "./WatchHub.module.css";

export type WatchArchiveVariant = "replay" | "upcoming";

const COPY = {
  replay: {
    searchHint: "搜尋賽事、城市或舞蹈項目",
    quickSearch: "依賽事名稱搜尋",
    empty: "沒有符合條件的官方回放。",
    sidebarTitle: "按賽季瀏覽",
    sidebarLead: "像賽事資料庫一樣分季排檔",
    chipsTitle: "常見項目",
    defaultSort: "newest" as ReplaySort,
    sortOptions: [
      { value: "newest" as const, label: "最新優先" },
      { value: "oldest" as const, label: "最早優先" },
    ],
    sortLine: {
      newest: "依賽事日期由新到舊",
      oldest: "依賽事日期由舊到新",
    },
  },
  upcoming: {
    searchHint: "搜尋賽事、城市或觀看入口",
    quickSearch: "依賽事名稱搜尋",
    empty: "沒有符合條件的即將直播賽事。",
    sidebarTitle: "按賽季瀏覽",
    sidebarLead: "像賽事資料庫一樣分季排檔",
    chipsTitle: "常見項目",
    defaultSort: "oldest" as ReplaySort,
    sortOptions: [
      { value: "oldest" as const, label: "即將優先" },
      { value: "newest" as const, label: "最晚優先" },
    ],
    sortLine: {
      newest: "依開賽日期由遠到近",
      oldest: "依開賽日期由近到遠",
    },
  },
} as const;

export function ReplayArchive({
  archive,
  variant = "replay",
}: {
  archive: ReplayArchiveData;
  variant?: WatchArchiveVariant;
}) {
  const copy = COPY[variant];
  const searchId = useId();
  const quickSearchId = useId();
  const [query, setQuery] = useState("");
  const [discipline, setDiscipline] = useState<"all" | VideoDiscipline>("all");
  const [seasonId, setSeasonId] = useState(archive.seasons[0]?.id ?? ALL_SEASONS_ID);
  const [sort, setSort] = useState<ReplaySort>(copy.defaultSort);

  const filtered = useMemo(
    () => filterReplayArchiveWithFallback(archive, { query, discipline, seasonId, sort }),
    [archive, query, discipline, seasonId, sort],
  );
  const activeSeasonId = filtered.seasonId;

  useEffect(() => {
    if (activeSeasonId !== seasonId) setSeasonId(activeSeasonId);
  }, [activeSeasonId, seasonId]);

  const currentSeason = archive.seasons.find((item) => item.id === activeSeasonId);
  const heading =
    activeSeasonId === ALL_SEASONS_ID
      ? "全部賽季"
      : (currentSeason?.label ?? filtered.season?.label ?? (variant === "upcoming" ? "即將直播" : "官方回放"));
  const sortLine = copy.sortLine[sort];
  const countLine =
    variant === "upcoming" ? `共 ${filtered.events.length} 場賽事` : `共 ${filtered.videoCount} 部回放`;
  const eventCountLabel = variant === "upcoming" ? "個入口" : "部影片";
  const featured = archive.seasons.slice(0, 2);
  const older = archive.seasons.slice(2);
  const disciplineOptions = [
    { value: "all" as const, label: "全部項目" },
    ...archive.disciplines.map((item) => ({
      value: item.id,
      label: `${item.label}（${item.count}）`,
    })),
  ];

  function applyQuery(next: string) {
    setQuery(next);
    const result = filterReplayArchive(archive, { query: next, discipline, seasonId, sort });
    if (next.trim() && result.videoCount === 0 && seasonId !== ALL_SEASONS_ID) {
      setSeasonId(ALL_SEASONS_ID);
    }
  }

  function applyDiscipline(next: "all" | VideoDiscipline) {
    setDiscipline(next);
    const result = filterReplayArchive(archive, { query, discipline: next, seasonId, sort });
    if (next !== "all" && result.videoCount === 0 && seasonId !== ALL_SEASONS_ID) {
      setSeasonId(ALL_SEASONS_ID);
    }
  }

  return (
    <div className={styles.archive}>
      <div className={styles.archiveMain}>
        <div className={styles.seasonHead}>
          <div>
            <h3 className={styles.seasonTitle}>{heading}</h3>
            <p className={styles.seasonMeta}>
              {countLine}
              <span aria-hidden="true"> · </span>
              {sortLine}
            </p>
          </div>
          <div className={styles.controls}>
            <div className={styles.searchField}>
              <label className={styles.srOnly} htmlFor={searchId}>
                {copy.searchHint}
              </label>
              <span className={styles.searchIcon} aria-hidden="true">
                <SearchIcon />
              </span>
              <input
                id={searchId}
                type="search"
                value={query}
                onChange={(event) => applyQuery(event.target.value)}
                placeholder={copy.searchHint}
                autoComplete="off"
              />
            </div>
            <div className={styles.controlPair}>
              <FilterMenu
                label="舞蹈項目"
                value={discipline}
                options={disciplineOptions}
                onChange={applyDiscipline}
              />
              <FilterMenu
                label="排序"
                value={sort}
                options={[...copy.sortOptions]}
                onChange={setSort}
              />
            </div>
          </div>
        </div>

        {filtered.events.length > 0 ? (
          <div className={styles.eventList}>
            {filtered.events.map((event) => (
              <EventCard key={event.id} event={event} countLabel={eventCountLabel} />
            ))}
          </div>
        ) : (
          <p className={styles.empty} role="status">
            {copy.empty}
          </p>
        )}
      </div>

      <aside className={styles.sidebar}>
        <section className={styles.sideCard} aria-label="按賽季瀏覽">
          <h3>{copy.sidebarTitle}</h3>
          <p>{copy.sidebarLead}</p>
          <div className={styles.seasonList}>
            {featured.map((season) => {
              const selected = season.id === activeSeasonId;
              return (
                <button
                  key={season.id}
                  className={`${styles.seasonItem} ${selected ? styles.seasonItemActive : ""}`}
                  type="button"
                  onClick={() => setSeasonId(season.id)}
                  aria-pressed={selected}
                >
                  <span>{season.label}</span>
                  {selected ? (
                    <span className={styles.seasonCount}>
                      {variant === "upcoming" ? season.eventCount : season.videoCount}
                      <span className={styles.srOnly}>{variant === "upcoming" ? " 場賽事" : " 部回放"}</span>
                    </span>
                  ) : (
                    <span className={styles.seasonView}>查看</span>
                  )}
                </button>
              );
            })}
          </div>
          {older.length > 0 || archive.seasons.length > 1 ? (
            <div className={styles.olderSeasons}>
              {older.length > 0 ? <span>較早賽季</span> : null}
              {older.map((season) => (
                <button key={season.id} type="button" onClick={() => setSeasonId(season.id)}>
                  {season.id.replace("-", "–")}
                </button>
              ))}
              <button
                type="button"
                className={activeSeasonId === ALL_SEASONS_ID ? styles.linkActive : undefined}
                onClick={() => setSeasonId(ALL_SEASONS_ID)}
              >
                全部賽季
              </button>
            </div>
          ) : null}
        </section>

        <section className={styles.sideCard} aria-label="快速找到回放">
          <h3>快速找到回放</h3>
          <div className={styles.searchField}>
            <label className={styles.srOnly} htmlFor={quickSearchId}>
              依賽事名稱搜尋
            </label>
            <span className={styles.searchIcon} aria-hidden="true">
              <SearchIcon />
            </span>
            <input
              id={quickSearchId}
              type="search"
              value={query}
              onChange={(event) => applyQuery(event.target.value)}
              placeholder={copy.quickSearch}
              autoComplete="off"
            />
          </div>
          {archive.disciplines.length > 0 ? (
            <div className={styles.chips}>
                  <p>{copy.chipsTitle}</p>
              <div>
                {archive.disciplines.map((item) => {
                  const pressed = discipline === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`${styles.chip} ${pressed ? styles.chipActive : ""}`}
                      aria-pressed={pressed}
                      onClick={() => applyDiscipline(pressed ? "all" : item.id)}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </section>
      </aside>
    </div>
  );
}

function FilterMenu<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const current = options.find((option) => option.value === value)?.label ?? label;

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className={styles.menu} ref={rootRef}>
      <span className={styles.srOnly}>{label}</span>
      <button
        type="button"
        className={styles.menuButton}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((currentOpen) => !currentOpen)}
      >
        {current}
      </button>
      {open ? (
        <ul className={styles.menuList} role="listbox" aria-label={label}>
          {options.map((option) => (
            <li key={option.value} role="none">
              <button
                type="button"
                className={`${styles.menuOption} ${option.value === value ? styles.menuOptionActive : ""}`}
                role="option"
                aria-selected={option.value === value}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function EventCard({ event, countLabel }: { event: ReplayEventView; countLabel: string }) {
  return (
    <article className={styles.eventCard}>
      <header className={styles.eventHead}>
        <div>
          <h4 className={styles.eventTitle}>{event.nameZh}</h4>
          <p className={styles.eventMeta}>
            {event.locationLine ? <span>{event.locationLine}</span> : null}
            {event.locationLine && event.dateLine ? <span aria-hidden="true"> ｜ </span> : null}
            <span>{event.dateLine}</span>
          </p>
        </div>
        <p className={styles.videoCount}>
          {event.sessions.length} {countLabel}
        </p>
      </header>
      <ul className={styles.sessionList}>
        {event.sessions.map((session) => (
          <li key={session.id}>
            <SessionRow session={session} />
          </li>
        ))}
      </ul>
    </article>
  );
}

function SessionRow({ session }: { session: ReplaySessionView }) {
  return (
    <div className={styles.sessionRow}>
      <div className={styles.sessionThumb} aria-hidden={session.hasRemoteThumb ? undefined : true}>
        {session.hasRemoteThumb ? (
          <ReplayThumbnail src={session.thumbnail} alt="" sizes="112px" />
        ) : (
          <span className={styles.thumbFallback} />
        )}
        {session.isOfficial ? <span className={styles.officialMark}>OFFICIAL</span> : null}
      </div>
      <div className={styles.sessionCopy}>
        <h5 className={styles.sessionTitle}>{session.title}</h5>
        <p>
          {session.statusLabel}
          <span aria-hidden="true"> · </span>
          {session.platform}
          {session.sessionDateLabel ? (
            <>
              <span aria-hidden="true"> · </span>
              {session.sessionDateLabel}
            </>
          ) : null}
        </p>
      </div>
      <ExternalLink className={`button ${styles.watchButton}`} href={session.href}>
        {session.buttonLabel}
      </ExternalLink>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 16.5 20 20.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
