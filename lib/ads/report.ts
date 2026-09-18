import type { AdEvent, DeviceType } from "@/data/ads/types";
import { getAdvertiser, getCampaign, getPlacement } from "@/lib/ads/catalog";
import { formatCtr } from "@/lib/ads/metrics";

export type AdReportRow = {
  advertiser_name: string;
  campaign_name: string;
  placement_code: string;
  report_start: string;
  report_end: string;
  impressions: number;
  clicks: number;
  ctr: string;
  desktop_impressions: number;
  mobile_impressions: number;
  generated_at: string;
};

export type DailyAdReportRow = AdReportRow & {
  date: string;
  daily_impressions: number;
  daily_clicks: number;
};

type ReportFilters = {
  advertiserId?: string;
  campaignId?: string;
  placementId?: string;
  start: string;
  end: string;
};

function inRange(occurredAt: string, start: string, end: string): boolean {
  return occurredAt >= start && occurredAt <= `${end}T23:59:59.999Z`;
}

function keyFor(event: AdEvent): string {
  return `${event.campaign_id}::${event.placement_id}`;
}

function emptyCounts() {
  return {
    impressions: 0,
    clicks: 0,
    desktop_impressions: 0,
    mobile_impressions: 0,
  };
}

function impressionDevice(device: DeviceType): "desktop" | "mobile" | "other" {
  if (device === "desktop") {
    return "desktop";
  }
  if (device === "mobile") {
    return "mobile";
  }
  return "other";
}

export function buildAdReport(events: AdEvent[], filters: ReportFilters): AdReportRow[] {
  const generatedAt = new Date().toISOString();
  const grouped = new Map<string, ReturnType<typeof emptyCounts>>();

  for (const event of events) {
    if (!inRange(event.occurred_at, filters.start, filters.end)) {
      continue;
    }
    if (filters.advertiserId) {
      const campaign = getCampaign(event.campaign_id);
      if (campaign?.advertiser_id !== filters.advertiserId) {
        continue;
      }
    }
    if (filters.campaignId && event.campaign_id !== filters.campaignId) {
      continue;
    }
    if (filters.placementId && event.placement_id !== filters.placementId) {
      continue;
    }

    const bucket = grouped.get(keyFor(event)) ?? emptyCounts();
    if (event.event_type === "impression") {
      bucket.impressions += 1;
      const device = impressionDevice(event.device_type);
      if (device === "desktop") {
        bucket.desktop_impressions += 1;
      }
      if (device === "mobile") {
        bucket.mobile_impressions += 1;
      }
    }
    if (event.event_type === "click") {
      bucket.clicks += 1;
    }
    grouped.set(keyFor(event), bucket);
  }

  return [...grouped.entries()].map(([key, counts]) => {
    const [campaignId, placementId] = key.split("::");
    const campaign = getCampaign(campaignId);
    const advertiser = campaign ? getAdvertiser(campaign.advertiser_id) : undefined;
    const placement = getPlacement(placementId);

    return {
      advertiser_name: advertiser?.name ?? campaignId,
      campaign_name: campaign?.name ?? campaignId,
      placement_code: placement?.code ?? placementId,
      report_start: filters.start,
      report_end: filters.end,
      impressions: counts.impressions,
      clicks: counts.clicks,
      ctr: formatCtr(counts.clicks, counts.impressions),
      desktop_impressions: counts.desktop_impressions,
      mobile_impressions: counts.mobile_impressions,
      generated_at: generatedAt,
    };
  });
}

export function buildDailyAdReport(
  events: AdEvent[],
  filters: ReportFilters,
): DailyAdReportRow[] {
  const generatedAt = new Date().toISOString();
  const grouped = new Map<string, { impressions: number; clicks: number }>();

  for (const event of events) {
    if (!inRange(event.occurred_at, filters.start, filters.end)) {
      continue;
    }
    if (filters.campaignId && event.campaign_id !== filters.campaignId) {
      continue;
    }
    if (filters.placementId && event.placement_id !== filters.placementId) {
      continue;
    }
    if (filters.advertiserId) {
      const campaign = getCampaign(event.campaign_id);
      if (campaign?.advertiser_id !== filters.advertiserId) {
        continue;
      }
    }

    const day = event.occurred_at.slice(0, 10);
    const mapKey = `${event.campaign_id}::${event.placement_id}::${day}`;
    const bucket = grouped.get(mapKey) ?? { impressions: 0, clicks: 0 };
    if (event.event_type === "impression") {
      bucket.impressions += 1;
    }
    if (event.event_type === "click") {
      bucket.clicks += 1;
    }
    grouped.set(mapKey, bucket);
  }

  return [...grouped.entries()].map(([key, counts]) => {
    const [campaignId, placementId, date] = key.split("::");
    const campaign = getCampaign(campaignId);
    const advertiser = campaign ? getAdvertiser(campaign.advertiser_id) : undefined;
    const placement = getPlacement(placementId);

    return {
      advertiser_name: advertiser?.name ?? campaignId,
      campaign_name: campaign?.name ?? campaignId,
      placement_code: placement?.code ?? placementId,
      report_start: filters.start,
      report_end: filters.end,
      date,
      daily_impressions: counts.impressions,
      daily_clicks: counts.clicks,
      impressions: counts.impressions,
      clicks: counts.clicks,
      ctr: formatCtr(counts.clicks, counts.impressions),
      desktop_impressions: 0,
      mobile_impressions: 0,
      generated_at: generatedAt,
    };
  });
}

export function toCsv<T extends Record<string, string | number>>(
  rows: T[],
  columns: Array<keyof T>,
): string {
  const header = columns.join(",");
  const body = rows.map((row) =>
    columns
      .map((column) => {
        const value = String(row[column] ?? "");
        if (value.includes(",") || value.includes("\"") || value.includes("\n")) {
          return `"${value.replaceAll("\"", "\"\"")}"`;
        }
        return value;
      })
      .join(","),
  );
  return [header, ...body].join("\n");
}

export const REPORT_CSV_COLUMNS: Array<keyof AdReportRow> = [
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
