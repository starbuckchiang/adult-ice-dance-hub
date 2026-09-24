import Link from "next/link";
import { DanceTypeBadge } from "@/components/DanceTypeBadge";
import { ExternalLink } from "@/components/ExternalLink";
import { SourceMeta } from "@/components/SourceMeta";
import { StatusBadge } from "@/components/StatusBadge";
import type { Competition, CompetitionVideo, Source } from "@/data/types";
import {
  competitionPhaseLabel,
  danceTypeShortLabel,
  formatDateParts,
  formatDateRange,
  formatZonedDateTime,
  getCompetitionPhase,
  videoDisciplineLabel,
  videoStatusLabel,
} from "@/lib/format";
import { getCompetitionWatchSummary, resolveVideoStatus } from "@/lib/videos";
import { ReplayThumbnail } from "@/components/watch/ReplayThumbnail";
import { resolveReplayThumbnail } from "@/lib/youtube";

export function LiveNowCard({
  video,
  competition,
  source,
}: {
  video: CompetitionVideo;
  competition?: Competition;
  source?: Source;
}) {
  const localTime = formatZonedDateTime(video.actualStartAt ?? video.scheduledStartAt, video.timezone);
  const taipeiTime = formatZonedDateTime(
    video.actualStartAt ?? video.scheduledStartAt,
    "Asia/Taipei",
  );

  return (
    <article className="card-dark live-card">
      <div className="badge-row">
        <span className="badge badge-live">LIVE 正在直播</span>
        <span className="badge badge-phase">{videoDisciplineLabel[video.discipline]}</span>
      </div>
      <h2>
        {competition?.nameZh ?? video.titleZh}
        <br />
        <span className="muted">{competition?.nameEn ?? video.titleEn}</span>
      </h2>
      <p>
        {video.countryName}
        {video.city ? `｜${video.city}` : ""}
      </p>
      {video.venueName ? <p>場館：{video.venueName}</p> : null}
      {localTime ? <p>當地時間：{localTime}</p> : null}
      {taipeiTime ? <p>台灣時間：{taipeiTime}</p> : null}
      <p>場次：{video.sessionName}</p>
      <p>官方直播來源：{source?.nameZh ?? "官方來源"}</p>
      <SourceMeta source={source} lastVerified={video.lastVerifiedAt} />
      <div className="button-row">
        <Link className="button" href={`/watch/${video.competitionSlug}?v=${video.id}`}>
          立即觀看
        </Link>
      </div>
    </article>
  );
}

export function UpcomingCompetitionCard({
  competition,
  source,
}: {
  competition: Competition;
  source?: Source;
}) {
  const phase = getCompetitionPhase(competition.startDate, competition.endDate);
  const summary = getCompetitionWatchSummary(competition.id);
  const scheduledTime = formatZonedDateTime(summary.nextScheduledAt, "Asia/Taipei");
  const parts = formatDateParts(competition.startDate);

  return (
    <article className={`list-card ${competition.status === "unverified" ? "is-unverified" : ""}`}>
      <div className={`date-block ${parts ? "" : "date-pending"}`}>
        {parts ? (
          <>
            <span className="date-month">{parts.month}</span>
            <span className="date-day">{parts.day}</span>
            <span className="date-year">{parts.year}</span>
          </>
        ) : (
          <>
            <span className="date-month">DATE</span>
            <span className="date-day">—</span>
            <span className="date-year">待查證</span>
          </>
        )}
      </div>
      <div>
        <div className="badge-row">
          <DanceTypeBadge type={competition.type} />
          <StatusBadge status={competition.status} />
          <span className="badge badge-phase">{competitionPhaseLabel[phase]}</span>
          {summary.livestream === "scheduled" ? (
            <span className="badge badge-scheduled">直播已排程</span>
          ) : null}
        </div>
        <h3>
          {competition.nameZh}
          <br />
          <span className="muted">{competition.nameEn}</span>
        </h3>
        <p>
          {competition.location}｜{formatDateRange(competition.startDate, competition.endDate)}
        </p>
        <p>項目：{danceTypeShortLabel[competition.type]}</p>
        {summary.livestream === "scheduled" && scheduledTime ? (
          <p>預定開始（台灣時間）：{scheduledTime}</p>
        ) : null}
        <SourceMeta source={source} lastVerified={competition.lastVerified} />
        <div className="button-row">
          <Link className="button" href={`/watch/${competition.slug}`}>
            查看詳情
          </Link>
          {competition.startDate ? (
            <a className="button-secondary" href={`/calendar/${competition.slug}`}>
              加入行事曆
            </a>
          ) : null}
          {summary.livestream === "scheduled" ? (
            <Link className="button-secondary" href={`/watch/${competition.slug}`}>
              前往 YouTube 設定提醒
            </Link>
          ) : (
            <ExternalLink className="button-secondary" href={competition.officialUrl}>
              官方賽事頁
            </ExternalLink>
          )}
        </div>
      </div>
    </article>
  );
}

export function ReplayEventCard({
  competition,
  source,
}: {
  competition: Competition;
  source?: Source;
}) {
  const summary = getCompetitionWatchSummary(competition.id);

  return (
    <article className={`card-dark ${competition.status === "unverified" ? "is-unverified" : ""}`}>
      <div className="badge-row">
        <DanceTypeBadge type={competition.type} />
        <StatusBadge status={competition.status} />
        {summary.hasFullReplay ? <span className="badge badge-verified">完整回放</span> : null}
        {summary.hasOfficialPlaylist ? <span className="badge badge-phase">官方 Playlist</span> : null}
      </div>
      <h3>
        {competition.nameZh}
        <br />
        <span className="muted">{competition.nameEn}</span>
      </h3>
      <p>
        {competition.location}｜{formatDateRange(competition.startDate, competition.endDate)}
      </p>
      <p>可觀看場次：{summary.sessionCount} 場</p>
      {summary.sessionCount === 0 ? <p>官方錄影待公布</p> : null}
      <SourceMeta source={source} lastVerified={competition.lastVerified} />
      <div className="button-row">
        <Link className="button" href={`/watch/${competition.slug}`}>
          觀看比賽錄影
        </Link>
        {summary.officialResultsUrl ? (
          <ExternalLink className="button-secondary" href={summary.officialResultsUrl}>
            官方成績入口
          </ExternalLink>
        ) : (
          <ExternalLink className="button-secondary" href={competition.officialUrl}>
            官方賽事頁
          </ExternalLink>
        )}
      </div>
    </article>
  );
}

export function VideoThumbCard({
  video,
  current,
}: {
  video: CompetitionVideo;
  current?: boolean;
}) {
  const status = resolveVideoStatus(video);

  return (
    <article className={`session-card ${current ? "is-current" : ""}`}>
      <span className="session-thumb">
        <ReplayThumbnail src={resolveReplayThumbnail(video)} alt={`${video.titleZh} 縮圖`} />
      </span>
      <span>
        <span className="badge-row">
          <span className={`badge badge-${status}`}>{videoStatusLabel[status]}</span>
          <span className="badge badge-phase">{videoDisciplineLabel[video.discipline]}</span>
          {video.containsMultipleEvents ? <span className="badge badge-both">完整場次</span> : null}
        </span>
        <strong>{video.sessionName}</strong>
        <span className="muted">{video.titleZh}</span>
        {video.durationLabel ? <span className="muted">{video.durationLabel}</span> : null}
      </span>
    </article>
  );
}
