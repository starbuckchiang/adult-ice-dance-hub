import type { DanceType, VerificationStatus } from "@/data/types";

export const danceTypeLabel: Record<DanceType, string> = {
  partnered: "成人雙人冰舞 Partnered Ice Dance",
  solo: "成人單人冰舞 Adult Solo Dance",
  both: "雙人與單人冰舞",
  general: "一般滑冰入口",
};

export const danceTypeShortLabel: Record<DanceType, string> = {
  partnered: "雙人冰舞",
  solo: "單人冰舞",
  both: "雙人／單人",
  general: "一般入口",
};

export const statusLabel: Record<VerificationStatus, string> = {
  verified: "已查證",
  unverified: "待查證",
};

export function formatDate(value: string | null): string {
  if (!value) {
    return "日期待查證";
  }

  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("zh-Hant", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatDateParts(
  value: string | null,
): { month: string; day: string; year: string } | null {
  if (!value) {
    return null;
  }

  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return {
    month: new Intl.DateTimeFormat("en-US", {
      month: "short",
      timeZone: "UTC",
    })
      .format(date)
      .toUpperCase(),
    day: new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      timeZone: "UTC",
    }).format(date),
    year: String(date.getUTCFullYear()),
  };
}

export function formatDateRange(start: string | null, end: string | null): string {
  if (!start && !end) {
    return "賽期待查證";
  }

  if (start && end && start !== end) {
    return `${formatDate(start)} 至 ${formatDate(end)}`;
  }

  return formatDate(start ?? end);
}

export function getCompetitionPhase(
  startDate: string | null,
  endDate: string | null,
): "upcoming" | "ongoing" | "completed" | "unscheduled" {
  if (!startDate || !endDate) {
    return "unscheduled";
  }

  const today = new Date();
  const todayStamp = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const startStamp = Date.parse(`${startDate}T00:00:00Z`);
  const endStamp = Date.parse(`${endDate}T00:00:00Z`);

  if (todayStamp < startStamp) {
    return "upcoming";
  }

  if (todayStamp > endStamp) {
    return "completed";
  }

  return "ongoing";
}

export const competitionPhaseLabel: Record<
  ReturnType<typeof getCompetitionPhase>,
  string
> = {
  upcoming: "即將舉行",
  ongoing: "進行中",
  completed: "已結束",
  unscheduled: "賽期待查證",
};
