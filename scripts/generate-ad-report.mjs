import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

function calculateCtr(clicks, impressions) {
  if (impressions <= 0) {
    return 0;
  }
  return (clicks / impressions) * 100;
}

function formatCtr(clicks, impressions) {
  return calculateCtr(clicks, impressions).toFixed(2);
}

assert.equal(formatCtr(1, 0), "0.00");
assert.equal(formatCtr(0, 0), "0.00");
assert.equal(formatCtr(1, 4), "25.00");
assert.equal(formatCtr(2, 8), "25.00");

function argValue(name, fallback = "") {
  const index = process.argv.indexOf(name);
  if (index === -1 || !process.argv[index + 1]) {
    return fallback;
  }
  return process.argv[index + 1];
}

function csvEscape(value) {
  const text = String(value ?? "");
  if (text.includes(",") || text.includes("\"") || text.includes("\n")) {
    return `"${text.replaceAll("\"", "\"\"")}"`;
  }
  return text;
}

function toCsv(rows, columns) {
  return [
    columns.join(","),
    ...rows.map((row) => columns.map((column) => csvEscape(row[column])).join(",")),
  ].join("\n");
}

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const start = argValue("--start", "2026-09-01");
const end = argValue("--end", "2026-09-30");
const advertiserFilter = argValue("--advertiser");
const campaignFilter = argValue("--campaign");
const placementFilter = argValue("--placement");

const advertisers = JSON.parse(readFileSync(join(root, "data/ads/advertisers.json"), "utf8"));
const campaigns = JSON.parse(readFileSync(join(root, "data/ads/ad_campaigns.json"), "utf8"));
const placements = JSON.parse(readFileSync(join(root, "data/ads/ad_placements.json"), "utf8"));

let events = [];
try {
  events = JSON.parse(readFileSync(join(root, ".data/ad-events.json"), "utf8"));
} catch {
  events = [];
}

const grouped = new Map();
const daily = new Map();

for (const event of events) {
  if (event.occurred_at < start || event.occurred_at > `${end}T23:59:59.999Z`) {
    continue;
  }
  const campaign = campaigns.find((item) => item.id === event.campaign_id);
  if (advertiserFilter && campaign?.advertiser_id !== advertiserFilter) {
    continue;
  }
  if (campaignFilter && event.campaign_id !== campaignFilter) {
    continue;
  }
  if (placementFilter && event.placement_id !== placementFilter) {
    continue;
  }

  const key = `${event.campaign_id}::${event.placement_id}`;
  const bucket = grouped.get(key) ?? {
    impressions: 0,
    clicks: 0,
    desktop_impressions: 0,
    mobile_impressions: 0,
  };
  if (event.event_type === "impression") {
    bucket.impressions += 1;
    if (event.device_type === "desktop") {
      bucket.desktop_impressions += 1;
    }
    if (event.device_type === "mobile") {
      bucket.mobile_impressions += 1;
    }
  }
  if (event.event_type === "click") {
    bucket.clicks += 1;
  }
  grouped.set(key, bucket);

  const dayKey = `${key}::${event.occurred_at.slice(0, 10)}`;
  const dayBucket = daily.get(dayKey) ?? { impressions: 0, clicks: 0 };
  if (event.event_type === "impression") {
    dayBucket.impressions += 1;
  }
  if (event.event_type === "click") {
    dayBucket.clicks += 1;
  }
  daily.set(dayKey, dayBucket);
}

const generatedAt = new Date().toISOString();
const columns = [
  "advertiser_name",
  "campaign_name",
  "placement_code",
  "report_start",
  "report_end",
  "impressions",
  "clicks",
  "ctr",
  "desktop_impressions",
  "mobile_impressions",
  "generated_at",
];

const rows = [...grouped.entries()].map(([key, counts]) => {
  const [campaignId, placementId] = key.split("::");
  const campaign = campaigns.find((item) => item.id === campaignId);
  const advertiser = advertisers.find((item) => item.id === campaign?.advertiser_id);
  const placement = placements.find((item) => item.id === placementId);
  return {
    advertiser_name: advertiser?.name ?? campaignId,
    campaign_name: campaign?.name ?? campaignId,
    placement_code: placement?.code ?? placementId,
    report_start: start,
    report_end: end,
    impressions: counts.impressions,
    clicks: counts.clicks,
    ctr: formatCtr(counts.clicks, counts.impressions),
    desktop_impressions: counts.desktop_impressions,
    mobile_impressions: counts.mobile_impressions,
    generated_at: generatedAt,
  };
});

const dailyRows = [...daily.entries()].map(([key, counts]) => {
  const [campaignId, placementId, date] = key.split("::");
  const campaign = campaigns.find((item) => item.id === campaignId);
  const advertiser = advertisers.find((item) => item.id === campaign?.advertiser_id);
  const placement = placements.find((item) => item.id === placementId);
  return {
    advertiser_name: advertiser?.name ?? campaignId,
    campaign_name: campaign?.name ?? campaignId,
    placement_code: placement?.code ?? placementId,
    report_start: start,
    report_end: end,
    date,
    daily_impressions: counts.impressions,
    daily_clicks: counts.clicks,
    impressions: counts.impressions,
    clicks: counts.clicks,
    ctr: formatCtr(counts.clicks, counts.impressions),
    desktop_impressions: "",
    mobile_impressions: "",
    generated_at: generatedAt,
  };
});

const reportsDir = join(root, "reports");
mkdirSync(reportsDir, { recursive: true });
const summaryPath = join(reportsDir, `ad-report-${start}-${end}.csv`);
const dailyPath = join(reportsDir, `ad-report-daily-${start}-${end}.csv`);
writeFileSync(summaryPath, `${toCsv(rows, columns)}\n`);
writeFileSync(
  dailyPath,
  `${toCsv(dailyRows, ["date", "daily_impressions", "daily_clicks", ...columns])}\n`,
);

console.log(`Mock ad report written:\n- ${summaryPath}\n- ${dailyPath}`);
console.log(`Rows: ${rows.length}. Events read: ${events.length}. CTR self-check passed.`);
if (rows.length === 0) {
  console.log("No mock events in range. This is not fabricated performance data.");
}
