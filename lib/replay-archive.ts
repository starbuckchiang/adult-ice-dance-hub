import type { Competition, CompetitionVideo, VideoDiscipline } from "@/data/types";
import { getCompetition, getCompetitionById } from "@/lib/content";
import { videoDisciplineLabel } from "@/lib/format";
import { getVideosByCompetition } from "@/lib/videos";
import { isYouTubeVideoId, parseYouTubeVideoId, resolveReplayThumbnail } from "@/lib/youtube";

export const ALL_SEASONS_ID = "all";
export const UNKNOWN_SEASON_ID = "unscheduled";

export type ReplaySort = "newest" | "oldest";

export type ReplaySessionView = {
  id: string;
  title: string;
  href: string;
  thumbnail: string;
  hasRemoteThumb: boolean;
  isOfficial: boolean;
  platform: string;
  sessionDateLabel: string | null;
  discipline: VideoDiscipline;
  disciplineLabel: string;
  displayOrder: number;
  sortTime: number;
  searchText: string;
  buttonLabel: string;
  statusLabel: string;
};

export type ReplayEventView = {
  id: string;
  slug: string;
  nameZh: string;
  nameEn: string;
  locationLine: string;
  dateLine: string;
  seasonId: string;
  seasonLabel: string;
  sortTime: number;
  searchText: string;
  sessions: ReplaySessionView[];
};

export type ReplaySeasonSummary = {
  id: string;
  label: string;
  startYear: number;
  videoCount: number;
  eventCount: number;
};

export type ReplayDisciplineOption = {
  id: VideoDiscipline;
  label: string;
  count: number;
};

export type ReplayArchiveData = {
  seasons: ReplaySeasonSummary[];
  events: ReplayEventView[];
  disciplines: ReplayDisciplineOption[];
  totalVideos: number;
};

export type ReplayArchiveFilter = {
  query?: string;
  discipline?: VideoDiscipline | "all";
  seasonId?: string;
  sort?: ReplaySort;
};

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

export function skatingSeasonFromIso(value: string | null | undefined): {
  id: string;
  label: string;
  startYear: number;
} | null {
  const date = parseDate(value);
  if (!date) return null;
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const startYear = month >= 6 ? year : year - 1;
  const id = `${startYear}-${String(startYear + 1).slice(-2)}`;
  return { id, label: `${id} 賽季`, startYear };
}

export function formatCompactDateRange(start: string | null | undefined, end: string | null | undefined): string {
  const first = parseDateParts(start);
  const last = parseDateParts(end) ?? first;
  if (!first) return "賽期待查證";
  if (!last || start === end || !end) {
    return `${first.year}.${first.month}.${first.day}`;
  }
  if (first.year === last.year) {
    return `${first.year}.${first.month}.${first.day}-${last.month}.${last.day}`;
  }
  return `${first.year}.${first.month}.${first.day}-${last.year}.${last.month}.${last.day}`;
}

export function platformLabel(url: string | null | undefined): string {
  if (!url) return "官方平台";
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    if (host.includes("youtube") || host === "youtu.be") return "YouTube";
    if (host.includes("sporteurope")) return "SportEurope";
    if (host.includes("828studios")) return "828 Studios";
    if (host.includes("skatecanada") || host.includes("abovetherestproductions")) return "Skate Canada";
    return host;
  } catch {
    return "官方平台";
  }
}

export function watchUrl(video: Pick<CompetitionVideo, "officialWatchUrl">): string | null {
  if (!video.officialWatchUrl) return null;
  try {
    return new URL(video.officialWatchUrl).toString();
  } catch {
    return null;
  }
}

function resolveCompetition(video: CompetitionVideo): Competition | undefined {
  return (
    (video.competitionSlug ? getCompetition(video.competitionSlug) : undefined) ??
    (video.competitionId ? getCompetitionById(video.competitionId) : undefined)
  );
}

export function buildReplayArchive(videos: CompetitionVideo[]): ReplayArchiveData {
  const groups = new Map<string, { competition?: Competition; videos: CompetitionVideo[] }>();

  for (const video of videos) {
    const href = watchUrl(video);
    if (!href) continue;
    const groupId = video.competitionId?.trim() || `video:${video.id}`;
    const group = groups.get(groupId) ?? {
      competition: resolveCompetition(video),
      videos: [],
    };
    if (!group.competition) {
      group.competition = resolveCompetition(video);
    }
    group.videos.push(video);
    groups.set(groupId, group);
  }

  const events: ReplayEventView[] = [...groups.entries()].map(([id, group]) => {
    const competition = group.competition;
    const sessions = sortSessions(group.videos.map((video) => toSessionView(video)));
    const seasonDate =
      competition?.endDate ??
      competition?.startDate ??
      group.videos[0]?.eventDate ??
      group.videos[0]?.endedAt ??
      group.videos[0]?.actualStartAt ??
      group.videos[0]?.scheduledStartAt ??
      null;
    const season = skatingSeasonFromIso(seasonDate);
    const first = group.videos[0];
    const nameZh = competition?.nameZh ?? first?.titleZh ?? "官方回放";
    const nameEn = competition?.nameEn ?? first?.titleEn ?? "";
    const locationLine = eventLocationLine(first, competition);
    const dateLine = formatCompactDateRange(competition?.startDate, competition?.endDate);
    const searchText = normalizeSearch(
      [nameZh, nameEn, locationLine, competition?.location, first?.city, first?.countryName, first?.venueName]
        .filter(Boolean)
        .join(" "),
    );

    return {
      id,
      slug: competition?.slug ?? first?.competitionSlug ?? id,
      nameZh,
      nameEn,
      locationLine,
      dateLine,
      seasonId: season?.id ?? UNKNOWN_SEASON_ID,
      seasonLabel: season?.label ?? "賽期待查證",
      sortTime: eventSortTime(competition, sessions),
      searchText,
      sessions,
    };
  });

  return finalizeArchive(events);
}

export function buildUpcomingArchive(competitions: Competition[]): ReplayArchiveData {
  const events: ReplayEventView[] = competitions.map((competition) => {
    const portal = getVideosByCompetition(competition.id).find(
      (video) =>
        video.isOfficial &&
        Boolean(video.officialWatchUrl) &&
        (video.liveWatch === "channel" || video.liveWatch === "broadcast"),
    );
    const sessions = [
      portal ? upcomingChannelSession(portal, competition) : null,
      officialPageSession(competition),
    ].filter((session): session is ReplaySessionView => Boolean(session));
    const season = skatingSeasonFromIso(competition.startDate ?? competition.endDate);
    const locationLine = eventLocationLine(portal, competition);
    const nameZh = competition.nameZh;
    const nameEn = competition.nameEn;

    return {
      id: competition.id,
      slug: competition.slug,
      nameZh,
      nameEn,
      locationLine,
      dateLine: formatCompactDateRange(competition.startDate, competition.endDate),
      seasonId: season?.id ?? UNKNOWN_SEASON_ID,
      seasonLabel: season?.label ?? "賽期待查證",
      sortTime: eventSortTime(competition, sessions),
      searchText: normalizeSearch(
        [nameZh, nameEn, locationLine, competition.location, portal?.city, portal?.countryName, portal?.venueName]
          .filter(Boolean)
          .join(" "),
      ),
      sessions,
    };
  });

  return finalizeArchive(events);
}

export function filterReplayArchive(
  archive: ReplayArchiveData,
  {
    query = "",
    discipline = "all",
    seasonId = ALL_SEASONS_ID,
    sort = "newest",
  }: ReplayArchiveFilter = {},
): { events: ReplayEventView[]; videoCount: number; season: ReplaySeasonSummary | null } {
  const needle = normalizeSearch(query);
  const events: ReplayEventView[] = [];

  for (const event of archive.events) {
    if (seasonId !== ALL_SEASONS_ID && event.seasonId !== seasonId) continue;

    let sessions = event.sessions;
    if (discipline !== "all") {
      sessions = sessions.filter((session) => session.discipline === discipline);
    }

    if (needle) {
      const eventHit = event.searchText.includes(needle);
      if (!eventHit) {
        sessions = sessions.filter((session) => session.searchText.includes(needle));
      }
    }

    if (sessions.length === 0) continue;
    events.push({ ...event, sessions: sortSessions(sessions) });
  }

  events.sort((a, b) => compareEvents(a, b, sort));

  const videoCount = events.reduce((sum, event) => sum + event.sessions.length, 0);
  const season = archive.seasons.find((item) => item.id === seasonId) ?? null;
  return { events, videoCount, season };
}

export function filterReplayArchiveWithFallback(
  archive: ReplayArchiveData,
  options: ReplayArchiveFilter = {},
): { events: ReplayEventView[]; videoCount: number; season: ReplaySeasonSummary | null; seasonId: string } {
  const seasonId = options.seasonId ?? ALL_SEASONS_ID;
  const scoped = filterReplayArchive(archive, options);
  const hasActiveFilter = Boolean(options.query?.trim()) || (options.discipline && options.discipline !== "all");
  if (scoped.videoCount > 0 || !hasActiveFilter || seasonId === ALL_SEASONS_ID) {
    return { ...scoped, seasonId };
  }

  const expanded = filterReplayArchive(archive, { ...options, seasonId: ALL_SEASONS_ID });
  return { ...expanded, seasonId: ALL_SEASONS_ID };
}

export function collectReplayHrefs(events: ReplayEventView[]): string[] {
  return events.flatMap((event) => event.sessions.map((session) => session.href));
}

function toSessionView(video: CompetitionVideo): ReplaySessionView {
  const href = watchUrl(video) ?? video.officialWatchUrl;
  const disciplineLabel = videoDisciplineLabel[video.discipline];
  const title = sessionTitle(video, disciplineLabel);
  const sessionDateLabel = formatSessionDay(
    video.eventDate ?? video.endedAt ?? video.actualStartAt ?? video.scheduledStartAt,
    video.timezone,
  );
  const youtubeId = isYouTubeVideoId(video.youtubeVideoId)
    ? video.youtubeVideoId
    : parseYouTubeVideoId(video.officialWatchUrl);
  const thumbnail = resolveReplayThumbnail(video);

  return {
    id: video.id,
    title,
    href,
    thumbnail,
    hasRemoteThumb: Boolean(youtubeId),
    isOfficial: video.isOfficial,
    platform: platformLabel(href),
    sessionDateLabel,
    discipline: video.discipline,
    disciplineLabel,
    displayOrder: video.displayOrder,
    sortTime: videoSortTime(video),
    buttonLabel: "觀看回放",
    statusLabel: video.isOfficial ? "賽事回放" : "來源待查證",
    searchText: normalizeSearch(
      [
        title,
        video.sessionName,
        video.titleZh,
        video.titleEn,
        disciplineLabel,
        video.city,
        video.countryName,
        video.venueName,
        platformLabel(href),
      ]
        .filter(Boolean)
        .join(" "),
    ),
  };
}

function sessionTitle(video: CompetitionVideo, disciplineLabel: string): string {
  const sessionName = video.sessionName?.trim();
  if (sessionName && sessionName !== "Official Replay" && sessionName !== "Official Playlist") {
    return sessionName;
  }
  return disciplineLabel;
}

function eventLocationLine(
  video: CompetitionVideo | undefined,
  competition: Competition | undefined,
): string {
  const city = video?.city?.trim();
  const country = video?.countryName?.trim();
  if (city && country && !includesIgnoreCase(country, city) && !includesIgnoreCase(city, country)) {
    return `${country} · ${city}`;
  }
  if (competition?.location?.trim()) return competition.location.trim();
  return city || country || video?.venueName || "";
}

function eventSortTime(competition: Competition | undefined, sessions: ReplaySessionView[]): number {
  const fromCompetition = parseDate(competition?.startDate ?? competition?.endDate);
  if (fromCompetition) return fromCompetition.getTime();
  const times = sessions.map((session) => session.sortTime).filter((time) => !Number.isNaN(time));
  return times.length > 0 ? Math.max(...times) : Number.NaN;
}

function finalizeArchive(events: ReplayEventView[]): ReplayArchiveData {
  const seasonCounts = new Map<string, ReplaySeasonSummary>();
  for (const event of events) {
    const current = seasonCounts.get(event.seasonId);
    const startYear =
      event.seasonId === UNKNOWN_SEASON_ID
        ? Number.NEGATIVE_INFINITY
        : Number(event.seasonId.slice(0, 4)) || Number.NEGATIVE_INFINITY;
    seasonCounts.set(event.seasonId, {
      id: event.seasonId,
      label: event.seasonLabel,
      startYear: current?.startYear ?? startYear,
      videoCount: (current?.videoCount ?? 0) + event.sessions.length,
      eventCount: (current?.eventCount ?? 0) + 1,
    });
  }

  const seasons = [...seasonCounts.values()].sort((a, b) => b.startYear - a.startYear);
  const disciplineCounts = new Map<VideoDiscipline, number>();
  for (const event of events) {
    for (const session of event.sessions) {
      disciplineCounts.set(session.discipline, (disciplineCounts.get(session.discipline) ?? 0) + 1);
    }
  }

  const disciplines = [...disciplineCounts.entries()]
    .map(([id, count]) => ({
      id,
      label: videoDisciplineLabel[id],
      count,
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, "zh-Hant"));

  return {
    seasons,
    events,
    disciplines,
    totalVideos: events.reduce((sum, event) => sum + event.sessions.length, 0),
  };
}

function upcomingChannelSession(video: CompetitionVideo, competition: Competition): ReplaySessionView {
  const session = toSessionView(video);
  return {
    ...session,
    title: video.liveWatch === "channel" ? "官方直播頻道" : session.title,
    sessionDateLabel:
      session.sessionDateLabel ?? formatSessionDay(competition.startDate, video.timezone || "UTC"),
    buttonLabel: video.liveWatch === "channel" ? "前往官方直播頻道" : "查看預定直播",
    statusLabel: "即將直播",
    displayOrder: 1,
    sortTime: parseDate(competition.startDate)?.getTime() ?? session.sortTime,
  };
}

function officialPageSession(competition: Competition): ReplaySessionView | null {
  const href = watchUrl({ officialWatchUrl: competition.officialUrl });
  if (!href) return null;
  return {
    id: `${competition.id}-official-page`,
    title: "官方賽事頁",
    href,
    thumbnail: "",
    hasRemoteThumb: false,
    isOfficial: competition.status === "verified",
    platform: platformLabel(href),
    sessionDateLabel: formatSessionDay(competition.startDate, "UTC"),
    discipline: "other",
    disciplineLabel: videoDisciplineLabel.other,
    displayOrder: 20,
    sortTime: parseDate(competition.startDate)?.getTime() ?? Number.NaN,
    buttonLabel: "官方賽事頁",
    statusLabel: "賽事資訊",
    searchText: normalizeSearch([competition.nameZh, competition.nameEn, "官方賽事頁"].join(" ")),
  };
}

function sortSessions(sessions: ReplaySessionView[]): ReplaySessionView[] {
  return [...sessions].sort((a, b) => {
    if (!Number.isNaN(a.sortTime) && !Number.isNaN(b.sortTime) && a.sortTime !== b.sortTime) {
      return a.sortTime - b.sortTime;
    }
    if (Number.isNaN(a.sortTime) !== Number.isNaN(b.sortTime)) {
      return Number.isNaN(a.sortTime) ? 1 : -1;
    }
    return a.displayOrder - b.displayOrder;
  });
}

function compareEvents(a: ReplayEventView, b: ReplayEventView, sort: ReplaySort): number {
  const dir = sort === "newest" ? -1 : 1;
  if (!Number.isNaN(a.sortTime) && !Number.isNaN(b.sortTime) && a.sortTime !== b.sortTime) {
    return (a.sortTime - b.sortTime) * dir;
  }
  if (Number.isNaN(a.sortTime) !== Number.isNaN(b.sortTime)) {
    return Number.isNaN(a.sortTime) ? 1 : -1;
  }
  return a.nameZh.localeCompare(b.nameZh, "zh-Hant");
}

function videoSortTime(video: CompetitionVideo): number {
  return parseDate(video.eventDate ?? video.endedAt ?? video.actualStartAt ?? video.scheduledStartAt)?.getTime() ?? Number.NaN;
}

function parseDate(value: string | null | undefined): Date | null {
  if (!value?.trim()) return null;
  const raw = value.trim();
  const date = new Date(DATE_ONLY.test(raw) ? `${raw}T00:00:00Z` : raw);
  return Number.isNaN(date.getTime()) ? null : date;
}

function parseDateParts(value: string | null | undefined): { year: string; month: string; day: string } | null {
  const match = value?.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  return { year: match[1], month: match[2], day: match[3] };
}

function formatSessionDay(value: string | null | undefined, timeZone: string): string | null {
  const date = parseDate(value);
  if (!date || !value) return null;
  const raw = value.trim();
  return new Intl.DateTimeFormat("zh-Hant", {
    month: "numeric",
    day: "numeric",
    timeZone: DATE_ONLY.test(raw) ? "UTC" : timeZone || "UTC",
  }).format(date);
}

function normalizeSearch(value: string): string {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

function includesIgnoreCase(haystack: string, needle: string): boolean {
  return haystack.toLowerCase().includes(needle.toLowerCase());
}
