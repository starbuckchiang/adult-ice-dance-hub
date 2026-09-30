import { ExternalLink } from "@/components/ExternalLink";
import { SourceMeta } from "@/components/SourceMeta";
import type { Competition, CompetitionVideo, Source } from "@/data/types";
import { formatDateRange, formatZonedDateTime, videoDisciplineLabel } from "@/lib/format";
import { getReplayDateLine } from "@/lib/replay-date";
import {
  getCompetitionWatchPortal,
  getLatestReplays,
  getLiveStreams,
  getUpcomingStreams,
  getVideosByCompetition,
} from "@/lib/videos";
import { ReplayThumbnail } from "@/components/watch/ReplayThumbnail";
import { resolveReplayThumbnail } from "@/lib/youtube";
import styles from "./WatchHub.module.css";

function platformLabel(url: string | null | undefined): string {
  if (!url) return "官方平台";
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    if (host.includes("youtube") || host === "youtu.be") return "YouTube";
    return host;
  } catch {
    return "官方平台";
  }
}

function watchUrl(video: CompetitionVideo): string | null {
  if (!video.officialWatchUrl) return null;
  try {
    return new URL(video.officialWatchUrl).toString();
  } catch {
    return null;
  }
}

function channelButton(video: CompetitionVideo | undefined) {
  const href = video ? watchUrl(video) : null;
  if (!href || video?.liveWatch !== "channel") return null;
  return (
    <ExternalLink className="button" href={href}>
      前往官方直播頻道
    </ExternalLink>
  );
}

function sessionMode(video: CompetitionVideo, now = new Date()): "live" | "scheduled" | "replay" | "unavailable" {
  if (!video.stillAvailable || video.status === "unavailable") return "unavailable";
  const startIso = video.actualStartAt ?? video.scheduledStartAt;
  const start = startIso ? new Date(startIso).getTime() : Number.NaN;
  const ended = video.endedAt ? new Date(video.endedAt).getTime() : Number.NaN;
  if (Number.isFinite(ended) && now.getTime() > ended) return "replay";
  if (Number.isFinite(start) && start > now.getTime()) return "scheduled";
  if (video.status === "scheduled" && !Number.isFinite(start)) return "scheduled";
  if (video.status === "live" || video.status === "scheduled") return "live";
  return "replay";
}

function SessionCard({
  video,
  sourceName,
}: {
  video: CompetitionVideo;
  sourceName: Source | undefined;
}) {
  const mode = sessionMode(video);
  const href = mode === "unavailable" ? null : watchUrl(video);
  const ago = startedAgo(video.actualStartAt ?? video.scheduledStartAt);
  const localTime = formatZonedDateTime(video.actualStartAt ?? video.scheduledStartAt, video.timezone);
  const buttonLabel = mode === "live" ? "立即觀看" : mode === "scheduled" ? "查看預定直播" : "觀看重播";

  return (
    <article className={styles.card}>
      {mode === "live" ? <p className={styles.live}>LIVE 正在直播</p> : null}
      {mode === "scheduled" ? <p className={styles.live}>預定直播</p> : null}
      {video.youtubeVideoId && mode !== "unavailable" ? (
        <div className={styles.thumb}>
          <ReplayThumbnail src={resolveReplayThumbnail(video)} alt="" />
        </div>
      ) : null}
      <h3>{video.titleZh}</h3>
      <p>{video.titleEn}</p>
      <p>{video.sessionName}</p>
      {mode === "live" && ago ? <p>開始直播時間：{ago}</p> : null}
      {mode === "unavailable" ? <p>這段重播目前無法播放。YouTube 顯示因音樂版權主張而封鎖。</p> : null}
      {localTime ? (
        <p>
          {mode === "live" ? "當地開播" : mode === "scheduled" ? "預定開播" : "當地時間"}：{localTime}
        </p>
      ) : null}
      {video.durationLabel ? <p>長度：{video.durationLabel}</p> : null}
      <SourceMeta source={sourceName} lastVerified={video.lastVerifiedAt} />
      {href ? (
        <ExternalLink className="button" href={href}>
          {buttonLabel}
        </ExternalLink>
      ) : mode === "unavailable" ? null : (
        <p>直播連結待官方發布</p>
      )}
    </article>
  );
}

function startedAgo(iso: string | null, now = new Date()): string | null {
  if (!iso) return null;
  const start = new Date(iso).getTime();
  if (Number.isNaN(start)) return null;
  const minutes = Math.floor((now.getTime() - start) / 60000);
  if (minutes < 1) return "剛剛";
  if (minutes < 60) return `${minutes} 分鐘前`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours < 24) {
    return rest > 0 ? `${hours} 小時 ${rest} 分鐘前` : `${hours} 小時前`;
  }
  return `${Math.floor(hours / 24)} 天前`;
}

export function WatchHub({
  getCompetition,
  getSource,
}: {
  getCompetition: (slug: string) => Competition | undefined;
  getSource: (id: string) => Source | undefined;
}) {
  const live = getLiveStreams();
  const liveCompetitionIds = new Set(live.map((video) => video.competitionId));
  const replays = getLatestReplays().filter((video) => !liveCompetitionIds.has(video.competitionId));
  const upcoming = getUpcomingStreams();
  const channel = getSource("src-isu-skating-youtube");

  return (
    <div className={styles.hub}>
      <nav className={styles.jumps} aria-label="影音區段">
        <a href="#live-now">現正直播</a>
        <a href="#replays">最新重播</a>
        <a href="#upcoming">即將直播</a>
      </nav>

      <section className={styles.section} id="live-now">
        <div className="section-head">
          <p className="kicker">LIVE NOW</p>
          <h2>現正直播</h2>
        </div>
        {live.length > 0 ? (
          <div className={styles.grid}>
            {live.map((video) => {
              const competition = getCompetition(video.competitionSlug);
              const sessions = getVideosByCompetition(video.competitionId);
              const grouped = video.liveWatch === "broadcast" && sessions.length > 1;
              if (!grouped) {
                const source = getSource(video.sourceId);
                return (
                  <article className={styles.card} key={video.id}>
                    <h3>{competition?.nameZh ?? video.titleZh}</h3>
                    <p>台灣時間：{formatDateRange(competition?.startDate ?? null, competition?.endDate ?? null)}</p>
                    <p>目前提供官方頻道入口，不是單一場次的播放確認。</p>
                    <SourceMeta source={source} lastVerified={video.lastVerifiedAt} />
                    {channelButton(video) ?? <p>直播連結待官方發布</p>}
                  </article>
                );
              }

              return (
                <div className={styles.event} key={video.competitionId}>
                  <div>
                    <h3>{competition?.nameZh ?? video.titleZh}</h3>
                    <p>Western Australian Figure Skating Club (WAFSC)</p>
                    <p>
                      合併 Swan Trophy International 與年度 Interclub，賽期 9 月 27 日至 30 日。以下依 Day 1 到 Day 4 排列。Day 3 Part 2 的重播目前無法播放。
                    </p>
                  </div>
                  <div className={styles.grid}>
                    {sessions.map((session) => (
                      <SessionCard
                        key={session.id}
                        video={session}
                        sourceName={getSource(session.sourceId)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.liveNote} role="status">
            <p>目前沒有已確認正在播出的賽事，可先查看最新重播或即將直播。</p>
            <a className="button" href="#replays">
              查看最新重播
            </a>
            {channel?.url ? (
              <ExternalLink className="button-secondary" href={channel.url}>
                查看官方直播頻道
              </ExternalLink>
            ) : null}
          </div>
        )}
      </section>

      <section className={styles.section} id="replays">
        <div className="section-head">
          <p className="kicker">REPLAYS</p>
          <h2>最新重播</h2>
        </div>
        {replays.length > 0 ? (
          <div className={styles.grid}>
            {replays.map((video) => {
              const competition = getCompetition(video.competitionSlug);
              const href = watchUrl(video);
              const thumb = resolveReplayThumbnail(video);
              const when = getReplayDateLine(video, competition);
              return (
                <article className={styles.card} key={video.id}>
                  <div className={styles.thumb}>
                    <ReplayThumbnail key={thumb} src={thumb} />
                  </div>
                  <h3>{competition?.nameZh ?? video.titleZh}</h3>
                  <p>{videoDisciplineLabel[video.discipline] ?? video.sessionName}</p>
                  {when ? (
                    <p>
                      {when.label}：{when.text}
                    </p>
                  ) : null}
                  <p>
                    {video.isOfficial ? "官方重播" : "來源待查證"} · {platformLabel(href)}
                  </p>
                  {href ? (
                    <ExternalLink className="button" href={href}>
                      觀看重播
                    </ExternalLink>
                  ) : null}
                </article>
              );
            })}
          </div>
        ) : (
          <p className={styles.empty} role="status">
            目前沒有可播放的官方重播。
          </p>
        )}
      </section>

      <section className={styles.section} id="upcoming">
        <div className="section-head">
          <p className="kicker">UPCOMING</p>
          <h2>即將直播</h2>
        </div>
        {upcoming.length > 0 ? (
          <div className={styles.grid}>
            {upcoming.map((competition) => {
              const portal = getCompetitionWatchPortal(competition.id);
              const source = getSource(competition.sourceId);
              return (
                <article className={styles.card} key={competition.id}>
                  <h3>{competition.nameZh}</h3>
                  <p>台灣時間：{formatDateRange(competition.startDate, competition.endDate)}</p>
                  <SourceMeta source={source} lastVerified={competition.lastVerified} />
                  <div className={styles.actions}>
                    <ExternalLink className="button-secondary" href={competition.officialUrl}>
                      官方賽事頁
                    </ExternalLink>
                    {channelButton(portal) ?? <p>直播連結待官方發布</p>}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <p className={styles.empty} role="status">
            目前沒有即將開始、且日期已核對的賽事。
          </p>
        )}
      </section>
    </div>
  );
}
