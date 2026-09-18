import Link from "next/link";
import { DanceTypeBadge } from "@/components/DanceTypeBadge";
import { ExternalLink } from "@/components/ExternalLink";
import { SourceMeta } from "@/components/SourceMeta";
import { StatusBadge } from "@/components/StatusBadge";
import type { Club, Competition, Country, Rule, Source } from "@/data/types";
import {
  competitionPhaseLabel,
  danceTypeLabel,
  formatDateRange,
  getCompetitionPhase,
} from "@/lib/format";

export function CountryCard({
  country,
  source,
  href,
}: {
  country: Country;
  source?: Source;
  href: string;
}) {
  return (
    <article className="card">
      <div className="badge-row">
        <DanceTypeBadge type={country.type} />
        <StatusBadge status={country.status} />
      </div>
      <h2>
        {country.nameZh} {country.nameEn}
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

export function ClubCard({ club, source }: { club: Club; source?: Source }) {
  return (
    <article className="card">
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
        <ExternalLink href={club.officialUrl}>開啟官方來源</ExternalLink>
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

  return (
    <article className="card">
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
      <p>
        類型標示：{danceTypeLabel[competition.type]}
      </p>
      <SourceMeta source={source} lastVerified={competition.lastVerified} />
      <div className="button-row">
        <ExternalLink href={competition.officialUrl}>開啟官方來源</ExternalLink>
      </div>
    </article>
  );
}

export function RuleCard({ rule, source }: { rule: Rule; source?: Source }) {
  return (
    <article className="card">
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
        <ExternalLink href={rule.officialUrl}>開啟官方來源</ExternalLink>
      </div>
    </article>
  );
}
