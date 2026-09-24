import assert from "node:assert/strict";
import { getReplayDateLine } from "../lib/replay-date";

const verified = {
  startDate: "2026-04-08",
  endDate: "2026-04-11",
  status: "verified" as const,
};

const missing = getReplayDateLine(
  { scheduledStartAt: null, timezone: "America/New_York", eventDate: null, publishedAt: null },
  { startDate: null, endDate: null, status: "unverified" },
);
assert.equal(missing, null);

const invalid = getReplayDateLine(
  {
    scheduledStartAt: "not-a-date",
    timezone: "America/New_York",
    eventDate: "2026-13-40",
    publishedAt: "yesterday",
  },
  { startDate: "bad", endDate: "also-bad", status: "verified" },
);
assert.equal(invalid, null);

const normal = getReplayDateLine(
  {
    scheduledStartAt: "2026-05-17T09:30:00+02:00",
    timezone: "Europe/Berlin",
    publishedAt: "2026-05-18T01:00:00+02:00",
  },
  verified,
);
assert.equal(normal?.label, "賽事時間");
assert.match(normal?.text ?? "", /2026/);
assert.doesNotMatch(normal?.text ?? "", /07:21|19:21/);

const patternDance = getReplayDateLine(
  { scheduledStartAt: null, timezone: "America/New_York", publishedAt: null },
  verified,
);
assert.equal(patternDance?.label, "賽事日期");
assert.match(patternDance?.text ?? "", /4月8日/);
assert.match(patternDance?.text ?? "", /4月11日/);
assert.doesNotMatch(patternDance?.text ?? "", /07:21|下午/);

const publishOnly = getReplayDateLine(
  {
    scheduledStartAt: null,
    timezone: "America/New_York",
    publishedAt: "2026-04-10T07:21:00-04:00",
  },
  { startDate: null, endDate: null, status: "unverified" },
);
assert.equal(publishOnly?.label, "影片發布");
assert.match(publishOnly?.text ?? "", /07:21|7:21/);

console.log("replay date checks passed");
