import type { Competition, CompetitionVideo } from "@/data/types";
import { formatDate, formatDateRange, formatZonedDateTime } from "@/lib/format";

export type ReplayDateLine = {
  label: "賽事日期" | "賽事時間" | "影片發布";
  text: string;
};

function isDateOnly(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isValidInstant(value: string | null | undefined): value is string {
  if (!value?.trim()) return false;
  const raw = value.trim();
  const date = new Date(isDateOnly(raw) ? `${raw}T00:00:00Z` : raw);
  return !Number.isNaN(date.getTime());
}

function eventLine(value: string, timeZone: string): ReplayDateLine | null {
  if (isDateOnly(value)) {
    const text = formatDate(value);
    return text === "日期待查證" ? null : { label: "賽事日期", text };
  }
  const text = formatZonedDateTime(value, timeZone);
  return text ? { label: "賽事時間", text } : null;
}

export function getReplayDateLine(
  video: Pick<CompetitionVideo, "scheduledStartAt" | "timezone"> & {
    eventDate?: string | null;
    publishedAt?: string | null;
  },
  competition?: Pick<Competition, "startDate" | "endDate" | "status"> | null,
): ReplayDateLine | null {
  const timeZone = video.timezone || "UTC";
  const eventDate = video.eventDate?.trim();
  if (eventDate && isValidInstant(eventDate)) {
    const line = eventLine(eventDate, timeZone);
    if (line) return line;
  }

  const scheduled = video.scheduledStartAt?.trim();
  if (scheduled && isValidInstant(scheduled)) {
    const line = eventLine(scheduled, timeZone);
    if (line) return line;
  }

  if (competition?.status === "verified") {
    const start = competition.startDate?.trim() ?? "";
    const end = competition.endDate?.trim() ?? "";
    if (isDateOnly(start) && isValidInstant(start) && (!end || (isDateOnly(end) && isValidInstant(end)))) {
      return { label: "賽事日期", text: formatDateRange(start, end || start) };
    }
  }

  const published = video.publishedAt?.trim();
  if (published && isValidInstant(published)) {
    const text = formatZonedDateTime(published, timeZone);
    if (text) return { label: "影片發布", text };
  }

  return null;
}
