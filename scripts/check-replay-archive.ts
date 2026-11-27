import assert from "node:assert/strict";
import {
  ALL_SEASONS_ID,
  buildReplayArchive,
  buildUpcomingArchive,
  collectReplayHrefs,
  filterReplayArchive,
  filterReplayArchiveWithFallback,
  formatCompactDateRange,
  skatingSeasonFromIso,
} from "../lib/replay-archive";
import { getLatestReplays, getUpcomingStreams } from "../lib/videos";

const replays = getLatestReplays();
const archive = buildReplayArchive(replays);
const hrefs = collectReplayHrefs(archive.events);

assert.equal(archive.totalVideos, replays.length);
assert.equal(hrefs.length, replays.length);
assert.equal(new Set(hrefs).size, hrefs.length);
assert.equal(new Set(replays.map((video) => video.officialWatchUrl)).size, hrefs.length);

for (const video of replays) {
  assert.ok(hrefs.includes(new URL(video.officialWatchUrl).toString()), `missing ${video.id}`);
}

assert.ok(archive.seasons.every((season) => season.videoCount > 0));
assert.ok(!archive.seasons.some((season) => season.id === "2024-25" && season.videoCount === 0));
assert.deepEqual(
  archive.seasons.map((season) => season.id).sort(),
  ["2025-26", "2026-27"],
);

const usAdult = archive.events.find((event) => event.id === "comp-us-adult-2026");
const gdansk = archive.events.find((event) => event.id === "comp-jgp-gdansk-2026");
const ljubljana = archive.events.find((event) => event.id === "comp-jgp-ljubljana-2026");
assert.equal(usAdult?.seasonId, "2025-26");
assert.equal(gdansk?.seasonId, "2026-27");
assert.equal(usAdult?.sessions.length, 6);
assert.equal(ljubljana?.sessions.length, 2);
assert.equal(gdansk?.nameZh.includes("Gdańsk") || gdansk?.nameZh.includes("Gdansk"), true);

const groupedIds = archive.events.map((event) => event.id).sort();
const sourceIds = [...new Set(replays.map((video) => video.competitionId))].sort();
assert.deepEqual(groupedIds, sourceIds);

const currentSeason = filterReplayArchive(archive, { seasonId: "2026-27", sort: "newest" });
assert.equal(currentSeason.events[0]?.id, "comp-jgp-gdansk-2026");
assert.ok((currentSeason.events[0]?.sortTime ?? 0) >= (currentSeason.events.at(-1)?.sortTime ?? 0));

const oldest = filterReplayArchive(archive, { seasonId: "2026-27", sort: "oldest" });
assert.equal(oldest.events.at(-1)?.id, "comp-jgp-gdansk-2026");

const citySearch = filterReplayArchive(archive, { query: "Gdańsk", seasonId: ALL_SEASONS_ID });
assert.equal(citySearch.events.length, 1);
assert.equal(citySearch.events[0]?.id, "comp-jgp-gdansk-2026");
assert.equal(citySearch.videoCount, 1);

const danceSearch = filterReplayArchive(archive, { query: "Rhythm Dance", seasonId: ALL_SEASONS_ID });
assert.ok(danceSearch.videoCount >= 6);
assert.ok(danceSearch.events.every((event) => event.sessions.every((session) => session.title.includes("Rhythm Dance") || session.discipline === "rhythm_dance")));

const freeDance = filterReplayArchive(archive, { discipline: "free_dance", seasonId: ALL_SEASONS_ID });
assert.ok(freeDance.videoCount > 0);
assert.ok(freeDance.events.every((event) => event.sessions.every((session) => session.discipline === "free_dance")));
assert.ok(freeDance.videoCount < archive.totalVideos);

const ljSessions = ljubljana?.sessions.map((session) => session.title) ?? [];
assert.deepEqual(ljSessions, ["Rhythm Dance", "Free Dance"]);

assert.equal(formatCompactDateRange("2026-10-07", "2026-10-10"), "2026.10.07-10.10");
assert.equal(skatingSeasonFromIso("2026-04-11")?.id, "2025-26");
assert.equal(skatingSeasonFromIso("2026-08-19")?.id, "2026-27");

const unfiltered = filterReplayArchive(archive, { seasonId: ALL_SEASONS_ID });
assert.equal(unfiltered.videoCount, archive.totalVideos);

const patternInCurrent = filterReplayArchive(archive, { discipline: "pattern_dance", seasonId: "2026-27" });
assert.equal(patternInCurrent.videoCount, 0);
const patternFallback = filterReplayArchiveWithFallback(archive, {
  discipline: "pattern_dance",
  seasonId: "2026-27",
});
assert.ok(patternFallback.videoCount > 0);
assert.equal(patternFallback.seasonId, ALL_SEASONS_ID);

const isuNames = archive.events.map((event) => event.nameZh);
assert.ok(isuNames.some((name) => name.includes("Gdańsk") || name.includes("Gdansk")));
assert.ok(isuNames.some((name) => name.includes("Ljubljana")));
assert.ok(isuNames.some((name) => name.includes("西安") || name.toLowerCase().includes("xi")));
assert.equal(
  replays.filter((video) => video.competitionSlug.startsWith("jgp-") && !video.liveWatch).length,
  13,
);

const upcoming = buildUpcomingArchive(getUpcomingStreams());
assert.ok(upcoming.events.length >= 3);
assert.equal(
  upcoming.events.length,
  getUpcomingStreams().length,
);
assert.ok(upcoming.events.every((event) => event.sessions.length > 0));
assert.ok(upcoming.events.every((event) => event.sessions.every((session) => session.href.startsWith("http"))));
assert.ok(!upcoming.events.some((event) => event.nameZh.includes("Finlandia")));
assert.ok(!upcoming.events.some((event) => event.nameZh.includes("NHK")));
const soonest = filterReplayArchive(upcoming, { seasonId: ALL_SEASONS_ID, sort: "oldest" });
assert.equal(soonest.events[0]?.id, "comp-gp-final-2026");
const finalEvent = upcoming.events.find((event) => event.id === "comp-gp-final-2026");
assert.ok(finalEvent?.sessions.some((session) => session.href.includes("youtube.com")));
assert.ok(finalEvent?.sessions.some((session) => session.title === "官方賽事頁"));
assert.ok(!upcoming.events.some((event) => event.nameZh.includes("Gdańsk") || event.nameZh.includes("Ljubljana")));

console.log(
  `replay archive checks passed (${archive.totalVideos} videos, ${archive.events.length} events; upcoming ${upcoming.events.length} events)`,
);
