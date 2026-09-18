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

export function groupCompetitionsForWatch(now = new Date()) {
  const liveVideos = getLiveVideos(now);
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
