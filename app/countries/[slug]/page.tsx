import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentWithSidebar } from "@/components/ads/ContentWithSidebar";
import { ClubCard, CompetitionCard, RuleCard } from "@/components/RecordCards";
import { DanceTypeBadge } from "@/components/DanceTypeBadge";
import { ExternalLink } from "@/components/ExternalLink";
import { SourceMeta } from "@/components/SourceMeta";
import { StatusBadge } from "@/components/StatusBadge";
import { UpdateNotice } from "@/components/UpdateNotice";
import {
  getClubsByCountry,
  getCompetitionsByCountry,
  getCountries,
  getCountry,
  getRulesByCountry,
  getSource,
} from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";

type CountryPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getCountries().map((country) => ({ slug: country.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: CountryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const country = getCountry(slug);

  if (!country) {
    return createPageMetadata({
      title: "國家頁面",
      description: "成人冰舞國家入口。",
      path: "/countries",
    });
  }

  return createPageMetadata({
    title: `${country.nameZh} ${country.nameEn}`,
    description: country.summary,
    path: `/countries/${country.slug}`,
  });
}

export default async function CountryPage({ params }: CountryPageProps) {
  const { slug } = await params;
  const country = getCountry(slug);

  if (!country) {
    notFound();
  }

  const source = getSource(country.sourceId);
  const clubs = getClubsByCountry(country.slug);
  const competitions = getCompetitionsByCountry(country.slug);
  const rules = getRulesByCountry(country.slug);

  return (
    <>
      <header className="page-header">
        <p className="kicker">{country.nameEn.toUpperCase()}</p>
        <h1>
          {country.nameZh} {country.nameEn}
        </h1>
        <div className="badge-row">
          <DanceTypeBadge type={country.type} />
          <StatusBadge status={country.status} />
        </div>
        <p>{country.summary}</p>
      </header>
      <UpdateNotice />
      <ContentWithSidebar>
      <section className="panel">
        <h2>主管團體</h2>
        <p>
          {country.federationZh} / {country.federationEn}
        </p>
        <p>{country.notes}</p>
        <SourceMeta source={source} lastVerified={country.lastVerified} />
        <div className="button-row">
          <ExternalLink href={country.officialUrl}>開啟官方來源</ExternalLink>
        </div>
      </section>
      <section className="section">
        <h2>俱樂部入口</h2>
        <div className="grid">
          {clubs.map((club) => (
            <ClubCard key={club.id} club={club} source={getSource(club.sourceId)} />
          ))}
        </div>
      </section>
      <section className="section">
        <h2>比賽資訊</h2>
        <div className="grid">
          {competitions.map((competition) => (
            <CompetitionCard
              key={competition.id}
              competition={competition}
              source={getSource(competition.sourceId)}
            />
          ))}
        </div>
      </section>
      <section className="section">
        <h2>規則來源</h2>
        <div className="grid">
          {rules.map((rule) => (
            <RuleCard key={rule.id} rule={rule} source={getSource(rule.sourceId)} />
          ))}
        </div>
      </section>
      </ContentWithSidebar>
    </>
  );
}
