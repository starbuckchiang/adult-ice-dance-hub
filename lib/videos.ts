import videosData from "@/data/competition-videos.json";
import competitionsData from "@/data/competitions.json";
import type { Competition, CompetitionVideo } from "@/data/types";
import { getCompetitionPhase } from "@/lib/format";

const videos = videosData as CompetitionVideo[];
const competitions = competitionsData as Competition[];

export function getCompetitionVideos(): CompetitionVideo[] {
  return videos;
}

export function getVideosByCompetition(competitionId: string): CompetitionVideo[] {
  return videos
    .filter((video) => video.competitionId === competitionId)
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

export function getVideoById(id: string | undefined): CompetitionVideo | undefined {
  if (!id) {
    return undefined;
  }

  return videos.find((video) => video.id === id);
}

export function resolveVideoStatus(
  video: CompetitionVideo,
  now = new Date(),
): CompetitionVideo["status"] {
  if (video.status === "live") {
    if (video.scheduledStartAt && now < new Date(video.scheduledStartAt)) {
      return "scheduled";
    }

    if (video.endedAt && now > new Date(video.endedAt)) {
      return video.stillAvailable ? "replay" : "unavailable";
    }

    return "live";
  }

  return video.status;
}

export function isCurrentlyLive(video: CompetitionVideo, now = new Date()): boolean {
  return (
    video.isOfficial &&
    video.stillAvailable &&
    resolveVideoStatus(video, now) === "live"
  );
}

export function getLiveVideos(now = new Date()): CompetitionVideo[] {
  return videos
    .filter((video) => isCurrentlyLive(video, now))
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

export function getScheduledVideos(now = new Date()): CompetitionVideo[] {
  return videos.filter((video) => resolveVideoStatus(video, now) === "scheduled");
}

export function getReplayVideos(now = new Date()): CompetitionVideo[] {
  return videos.filter((video) => {
    const status = resolveVideoStatus(video, now);
    return video.stillAvailable && (status === "replay" || status === "highlights");
  });
}

export type CompetitionWatchSummary = {
  sessionCount: number;
  replayCount: number;
  hasFullReplay: boolean;
  hasOfficialPlaylist: boolean;
  livestream: "none" | "scheduled" | "live" | "replay";
  nextScheduledAt: string | null;
  officialResultsUrl: string | null;
};

export function getCompetitionWatchSummary(
  competitionId: string,
  now = new Date(),
): CompetitionWatchSummary {
  const items = getVideosByCompetition(competitionId);
  const statuses = items.map((video) => resolveVideoStatus(video, now));

  let livestream: CompetitionWatchSummary["livestream"] = "none";
  if (statuses.includes("live")) {
    livestream = "live";
  } else if (statuses.includes("scheduled")) {
    livestream = "scheduled";
  } else if (statuses.includes("replay") || statuses.includes("highlights")) {
    livestream = "replay";
  }

  const nextScheduled = items
    .filter((video) => resolveVideoStatus(video, now) === "scheduled" && video.scheduledStartAt)
    .sort((a, b) => (a.scheduledStartAt ?? "").localeCompare(b.scheduledStartAt ?? ""))[0];

  return {
    sessionCount: items.filter((video) => video.stillAvailable && video.status !== "unavailable").length,
    replayCount: items.filter((video) => {
      const status = resolveVideoStatus(video, now);
      return video.stillAvailable && (status === "replay" || status === "highlights");
    }).length,
    hasFullReplay: items.some(
      (video) => video.videoType === "full_replay" && video.stillAvailable,
    ),
    hasOfficialPlaylist: items.some((video) => Boolean(video.youtubePlaylistId)),
    livestream,
    nextScheduledAt: nextScheduled?.scheduledStartAt ?? null,
    officialResultsUrl: items.find((video) => video.officialResultsUrl)?.officialResultsUrl ?? null,
  };
}

function taipeiDate(now: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "numeric",
  }).format(now);
}

export function isEventInProgress(
  startDate: string | null,
  endDate: string | null,
  now = new Date(),
): boolean {
  if (!startDate || !endDate) return false;
  const today = taipeiDate(now);
  return today >= startDate && today <= endDate;
}

export function isLiveWatchEntry(video: CompetitionVideo, now = new Date()): boolean {
  if (video.liveWatch !== "channel" && video.liveWatch !== "broadcast") return false;
  if (!video.isOfficial || !video.officialWatchUrl) return false;
  const competition = competitions.find((item) => item.id === video.competitionId);
  if (!competition || competition.status !== "verified") return false;
  return isEventInProgress(competition.startDate, competition.endDate, now);
}

export function getCompetitionWatchPortal(competitionId: string): CompetitionVideo | undefined {
  return getVideosByCompetition(competitionId).find(
    (video) =>
      video.isOfficial &&
      Boolean(video.officialWatchUrl) &&
      (video.liveWatch === "channel" || video.liveWatch === "broadcast"),
  );
}

export function groupCompetitionsForWatch(now = new Date()) {
  const liveVideos = getLiveStreams(now);
  const liveCompetitionIds = new Set(liveVideos.map((video) => video.competitionId));

  const upcoming: Competition[] = [];
  const recent: Competition[] = [];
  const unscheduled: Competition[] = [];

  for (const competition of competitions) {
    const phase = getCompetitionPhase(competition.startDate, competition.endDate);
    if (phase === "upcoming" || (phase === "ongoing" && !liveCompetitionIds.has(competition.id))) {
      upcoming.push(competition);
    } else if (phase === "completed") {
      recent.push(competition);
    } else if (phase === "unscheduled") {
      unscheduled.push(competition);
    }
  }

  upcoming.sort((a, b) => (a.startDate ?? "").localeCompare(b.startDate ?? ""));
  recent.sort((a, b) => (b.endDate ?? "").localeCompare(a.endDate ?? ""));

  return { liveVideos, upcoming, recent, unscheduled };
}

export function getReplayLibrary(now = new Date()) {
  void now;
  const completed = competitions
    .filter((competition) => getCompetitionPhase(competition.startDate, competition.endDate) === "completed")
    .sort((a, b) => (b.endDate ?? "").localeCompare(a.endDate ?? ""));

  const years = new Map<number, Competition[]>();

  for (const competition of completed) {
    const year = Number((competition.endDate ?? competition.startDate ?? "").slice(0, 4));
    if (!Number.isFinite(year)) {
      continue;
    }

    const list = years.get(year) ?? [];
    list.push(competition);
    years.set(year, list);
  }

  return [...years.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, items]) => ({ year, competitions: items }));
}

export function getRecentReplayHighlights(limit = 3, now = new Date()): Competition[] {
  return getReplayLibrary(now)
    .flatMap((group) => group.competitions)
    .filter((competition) => getCompetitionWatchSummary(competition.id, now).replayCount > 0)
    .slice(0, limit);
}

export const sessionGroupOrder = [
  "partnered_ice_dance",
  "solo_dance",
  "pattern_dance",
  "rhythm_dance",
  "free_dance",
  "practice",
  "awards",
  "full_replay",
  "other",
] as const;

export function getSessionGroupKey(video: CompetitionVideo): (typeof sessionGroupOrder)[number] {
  if (video.videoType === "practice") {
    return "practice";
  }

  if (video.videoType === "awards") {
    return "awards";
  }

  if (video.videoType === "full_replay" || video.containsMultipleEvents) {
    return "full_replay";
  }

  if (
    video.discipline === "partnered_ice_dance" ||
    video.discipline === "solo_dance" ||
    video.discipline === "pattern_dance" ||
    video.discipline === "rhythm_dance" ||
    video.discipline === "free_dance"
  ) {
    return video.discipline;
  }

  return "other";
}

function videoSortTime(video: CompetitionVideo): number {
  const raw = video.endedAt ?? video.actualStartAt ?? video.scheduledStartAt;
  if (!raw) return Number.NaN;
  const time = new Date(raw).getTime();
  return Number.isNaN(time) ? Number.NaN : time;
}

export function getLiveStreams(now = new Date()): CompetitionVideo[] {
  return videos.filter((video) => isLiveWatchEntry(video, now));
}

export function getUpcomingStreams(now = new Date()): Competition[] {
  return groupCompetitionsForWatch(now).upcoming;
}

export function competitionHasAnnouncedStream(competitionId: string, now = new Date()): boolean {
  return getVideosByCompetition(competitionId).some((video) => {
    if (!video.isOfficial || !video.officialWatchUrl) return false;
    return resolveVideoStatus(video, now) === "scheduled";
  });
}

export function getAnnouncedStreamUrl(competitionId: string, now = new Date()): string | null {
  const video = getVideosByCompetition(competitionId).find((item) => {
    if (!item.isOfficial || !item.officialWatchUrl) return false;
    return resolveVideoStatus(item, now) === "scheduled";
  });
  return video?.officialWatchUrl ?? null;
}

export function getLatestReplays(now = new Date()): CompetitionVideo[] {
  return getReplayVideos(now)
    .filter((video) => video.isOfficial && Boolean(video.officialWatchUrl) && !video.liveWatch)
    .sort((a, b) => {
      const aTime = videoSortTime(a);
      const bTime = videoSortTime(b);
      if (Number.isNaN(aTime) && Number.isNaN(bTime)) return a.displayOrder - b.displayOrder;
      if (Number.isNaN(aTime)) return 1;
      if (Number.isNaN(bTime)) return -1;
      return bTime - aTime;
    });
}

export type TutorialTopic =
  | "基礎步伐"
  | "Pattern Dance"
  | "Edges／Crossovers／Three-turns"
  | "音樂與編舞"
  | "成人參賽準備";

export const tutorialTopics: TutorialTopic[] = [
  "基礎步伐",
  "Pattern Dance",
  "Edges／Crossovers／Three-turns",
  "音樂與編舞",
  "成人參賽準備",
];

export function getTutorialVideos(): CompetitionVideo[] {
  return [];
}

export function groupWatchSessions(items: CompetitionVideo[]) {
  const groups = new Map<(typeof sessionGroupOrder)[number], CompetitionVideo[]>();

  for (const video of items) {
    const key = getSessionGroupKey(video);
    const list = groups.get(key) ?? [];
    list.push(video);
    groups.set(key, list);
  }

  return sessionGroupOrder
    .filter((key) => groups.has(key))
    .map((key) => ({ key, videos: groups.get(key) ?? [] }));
}
