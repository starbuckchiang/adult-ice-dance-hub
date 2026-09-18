import type { Competition } from "@/data/types";

function icsDate(value: string): string {
  return value.replaceAll("-", "");
}

function icsText(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

export function buildCompetitionIcs(competition: Competition): string {
  const start = competition.startDate ? icsDate(competition.startDate) : null;
  const endExclusive = competition.endDate
    ? icsDate(
        new Date(`${competition.endDate}T00:00:00Z`).toISOString().slice(0, 10) === competition.endDate
          ? new Date(Date.parse(`${competition.endDate}T00:00:00Z`) + 86400000).toISOString().slice(0, 10)
          : competition.endDate,
      )
    : start;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Adult Ice Dance Hub//Competitions//ZH",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${competition.id}@adult-ice-dance-hub`,
    `SUMMARY:${icsText(`${competition.nameZh} ${competition.nameEn}`)}`,
    `DESCRIPTION:${icsText(competition.summary)}`,
    `LOCATION:${icsText(competition.location)}`,
    start ? `DTSTART;VALUE=DATE:${start}` : undefined,
    endExclusive ? `DTEND;VALUE=DATE:${endExclusive}` : undefined,
    `URL:${competition.officialUrl}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);

  return `${lines.join("\r\n")}\r\n`;
}
