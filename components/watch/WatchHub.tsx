import { ExternalLink } from "@/components/ExternalLink";
import { SourceMeta } from "@/components/SourceMeta";
import type { Competition, CompetitionVideo, Source } from "@/data/types";
import { formatDateRange, videoDisciplineLabel } from "@/lib/format";
import { getReplayDateLine } from "@/lib/replay-date";
import {
  getCompetitionWatchPortal,
  getLatestReplays,
  getLiveStreams,
  getUpcomingStreams,
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

export function WatchHub({
  getCompetition,
  getSource,
}: {
  getCompetition: (slug: string) => Competition | undefined;
  getSource: (id: string) => Source | undefined;
}) {
  const replays = getLatestReplays();
  const live = getLiveStreams();
  const upcoming = getUpcomingStreams();
  const channel = getSource("src-isu-skating-youtube");

  return (
    <div className={styles.hub}>
      <nav className={styles.jumps} aria-label="影音區段">
        <a href="#replays">最新重播</a>
        <a href="#live-now">現正直播</a>
        <a href="#upcoming">即將直播</a>
      </nav>

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

      <section className={styles.section} id="live-now">
        <div className="section-head">
          <p className="kicker">LIVE NOW</p>
          <h2>現正直播</h2>
        </div>
        {live.length > 0 ? (
          <div className={styles.grid}>
            {live.map((video) => {
              const competition = getCompetition(video.competitionSlug);
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
