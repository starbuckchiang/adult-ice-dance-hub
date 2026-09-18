import Link from "next/link";
import { DanceTypeBadge } from "@/components/DanceTypeBadge";
import { ExternalLink } from "@/components/ExternalLink";
import { SourceMeta } from "@/components/SourceMeta";
import { StatusBadge } from "@/components/StatusBadge";
import type { Club, Competition, Country, Rule, Source } from "@/data/types";
import {
  competitionPhaseLabel,
  danceTypeLabel,
  formatDateParts,
  formatDateRange,
  getCompetitionPhase,
} from "@/lib/format";

type CardTone = "dark" | "warm";

export function CountryCard({
  country,
  source,
  href,
  tone = "warm",
}: {
  country: Country;
  source?: Source;
  href: string;
  tone?: CardTone;
}) {
  return (
    <article className={`card-${tone} ${country.status === "unverified" ? "is-unverified" : ""}`}>
      <p className="kicker">{country.nameEn}</p>
      <div className="badge-row">
        <DanceTypeBadge type={country.type} />
        <StatusBadge status={country.status} />
      </div>
      <h2>
        {country.nameZh}
        <span className="muted"> {country.nameEn}</span>
      </h2>
      <p>{country.federationZh}</p>
      <p>{country.summary}</p>
      <SourceMeta source={source} lastVerified={country.lastVerified} />
      <div className="button-row">
        <Link className="button" href={href}>
          查看國家頁
        </Link>
      </div>
    </article>
  );
}

export function ClubCard({
  club,
  source,
  tone = "dark",
}: {
  club: Club;
  source?: Source;
  tone?: CardTone;
}) {
  return (
    <article className={`card-${tone} ${club.status === "unverified" ? "is-unverified" : ""}`}>
      <div className="badge-row">
        <DanceTypeBadge type={club.danceType} />
        <StatusBadge status={club.status} />
      </div>
      <h3>
        {club.nameZh}
        <br />
        <span className="muted">{club.nameEn}</span>
      </h3>
      <p>{club.summary}</p>
      <SourceMeta source={source} lastVerified={club.lastVerified} />
      <div className="button-row">
        <ExternalLink className="button-secondary" href={club.officialUrl}>
          開啟官方來源
        </ExternalLink>
      </div>
    </article>
  );
}

export function CompetitionCard({
  competition,
  source,
}: {
  competition: Competition;
  source?: Source;
}) {
  const phase = getCompetitionPhase(competition.startDate, competition.endDate);
  const parts = formatDateParts(competition.startDate);

  return (
    <article
      className={`list-card ${competition.status === "unverified" ? "is-unverified" : ""}`}
    >
      <div className={`date-block ${parts ? "" : "date-pending"}`}>
        {parts ? (
          <>
            <span className="date-month">{parts.month}</span>
            <span className="date-day">{parts.day}</span>
            <span className="date-year">{parts.year}</span>
          </>
        ) : (
          <>
            <span className="date-month">DATE</span>
            <span className="date-day">—</span>
            <span className="date-year">待查證</span>
          </>
        )}
      </div>
      <div>
        <div className="badge-row">
          <DanceTypeBadge type={competition.type} />
          <StatusBadge status={competition.status} />
          <span className="badge badge-phase">{competitionPhaseLabel[phase]}</span>
        </div>
        <h3>
          {competition.nameZh}
          <br />
          <span className="muted">{competition.nameEn}</span>
        </h3>
        <p>
          {competition.location}｜{formatDateRange(competition.startDate, competition.endDate)}
        </p>
        <p>{competition.summary}</p>
        <p>類型標示：{danceTypeLabel[competition.type]}</p>
        <SourceMeta source={source} lastVerified={competition.lastVerified} />
        <div className="button-row">
          <ExternalLink className="button-secondary" href={competition.officialUrl}>
            開啟官方來源
          </ExternalLink>
        </div>
      </div>
    </article>
  );
}

export function RuleCard({
  rule,
  source,
  tone = "dark",
}: {
  rule: Rule;
  source?: Source;
  tone?: CardTone;
}) {
  return (
    <article className={`card-${tone} ${rule.status === "unverified" ? "is-unverified" : ""}`}>
      <div className="badge-row">
        <DanceTypeBadge type={rule.type} />
        <StatusBadge status={rule.status} />
      </div>
      <h3>
        {rule.nameZh}
        <br />
        <span className="muted">{rule.nameEn}</span>
      </h3>
      <p>{rule.summary}</p>
      <SourceMeta source={source} lastVerified={rule.lastVerified} />
      <div className="button-row">
        <ExternalLink className="button-secondary" href={rule.officialUrl}>
          開啟官方來源
        </ExternalLink>
      </div>
    </article>
  );
}
