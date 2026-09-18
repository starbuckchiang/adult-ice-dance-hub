"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ExternalLink } from "@/components/ExternalLink";
import { SourceMeta } from "@/components/SourceMeta";
import { LazyYouTubePlayer } from "@/components/watch/LazyYouTubePlayer";
import { VideoThumbCard } from "@/components/watch/WatchCards";
import type { Competition, CompetitionVideo, Source } from "@/data/types";
import { sessionGroupLabel, videoDisciplineLabel, videoStatusLabel } from "@/lib/format";
import { groupWatchSessions, resolveVideoStatus } from "@/lib/videos";
import { getExternalWatchLabel } from "@/lib/youtube";

export function WatchStudio({
  competition,
  videos,
  initialVideoId,
  sources,
}: {
  competition: Competition;
  videos: CompetitionVideo[];
  initialVideoId?: string;
  sources: Record<string, Source | undefined>;
}) {
  const available = videos.filter((video) => video.stillAvailable || video.status === "unavailable");
  const start = available.find((video) => video.id === initialVideoId) ?? available[0];
  const [currentId, setCurrentId] = useState(start?.id);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const current = available.find((video) => video.id === currentId) ?? start;
  const groups = groupWatchSessions(available);
  const currentIndex = available.findIndex((video) => video.id === current?.id);
  const previous = currentIndex > 0 ? available[currentIndex - 1] : undefined;
  const next = currentIndex >= 0 ? available[currentIndex + 1] : undefined;

  useEffect(() => {
    titleRef.current?.focus();
  }, [currentId]);

  if (!current) {
    return (
      <div className="empty-state">
        <div className="empty-shape" aria-hidden="true" />
        <h2>官方錄影待公布</h2>
        <p>官方直播或回放公布後，會整理在此頁。</p>
        <ExternalLink className="button-secondary" href={competition.officialUrl}>
          官方賽事頁
        </ExternalLink>
      </div>
    );
  }

  const status = resolveVideoStatus(current);
  const source = sources[current.sourceId];
  const watchLabel = getExternalWatchLabel(current.officialWatchUrl);

  return (
    <div className="watch-layout">
      <section className="watch-stage" aria-live="polite">
        <p className="kicker">WATCH</p>
        <h1 id="watch-title" ref={titleRef} tabIndex={-1}>
          {current.sessionName}
        </h1>
        <p className="muted">
          {competition.nameZh}｜{competition.nameEn}
        </p>
        <div className="badge-row">
          <span className={`badge badge-${status}`}>{videoStatusLabel[status]}</span>
          <span className="badge badge-phase">{videoDisciplineLabel[current.discipline]}</span>
          {current.containsMultipleEvents ? <span className="badge badge-both">完整場次</span> : null}
        </div>
        <p>{current.titleZh}</p>
        {current.skaterInfo ? <p>選手／組別：{current.skaterInfo}</p> : null}
        <LazyYouTubePlayer
          key={current.id}
          videoId={current.youtubeVideoId}
          playlistId={current.youtubePlaylistId}
          title={`${current.sessionName}｜${competition.nameZh}`}
          officialWatchUrl={current.officialWatchUrl}
          embeddable={current.embeddable && current.stillAvailable && status !== "unavailable"}
        />
        {status === "unavailable" || !current.stillAvailable ? (
          <p className="notice-inline">官方錄影待公布。請改以官方觀看入口查看最新場次。</p>
        ) : null}
        <div className="button-row">
          {previous ? (
            <button className="button-secondary" type="button" onClick={() => setCurrentId(previous.id)}>
              上一場
            </button>
          ) : null}
          {next ? (
            <button className="button-secondary" type="button" onClick={() => setCurrentId(next.id)}>
              下一場
            </button>
          ) : null}
          <a className="button" href={current.officialWatchUrl} target="_blank" rel="noopener noreferrer">
            {watchLabel}
            <span className="ext-icon" aria-hidden="true">
              ↗
            </span>
          </a>
        </div>
        <SourceMeta source={source} lastVerified={current.lastVerifiedAt} />
        <div className="button-row">
          {current.officialResultsUrl ? (
            <ExternalLink className="button-secondary" href={current.officialResultsUrl}>
              官方結果
            </ExternalLink>
          ) : null}
          <ExternalLink className="button-secondary" href={competition.officialUrl}>
            官方賽事頁
          </ExternalLink>
          <Link className="button-secondary" href="/competitions">
            返回比賽頁
          </Link>
        </div>
      </section>
      <aside className="watch-sessions" aria-label="場次清單">
        {groups.map((group) => (
          <section key={group.key}>
            <h2>{sessionGroupLabel[group.key]}</h2>
            <div className="session-list">
              {group.videos.map((video) => (
                <button
                  key={video.id}
                  className={`session-select ${video.id === current.id ? "is-current" : ""}`}
                  type="button"
                  onClick={() => setCurrentId(video.id)}
                  aria-current={video.id === current.id ? "true" : undefined}
                >
                  <VideoThumbCard video={video} current={video.id === current.id} />
                </button>
              ))}
            </div>
          </section>
        ))}
      </aside>
    </div>
  );
}
