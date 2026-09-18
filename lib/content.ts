import clubsData from "@/data/clubs.json";
import competitionsData from "@/data/competitions.json";
import countriesData from "@/data/countries.json";
import rulesData from "@/data/rules.json";
import sourcesData from "@/data/sources.json";
import type {
  Club,
  Competition,
  Country,
  CountrySlug,
  Rule,
  Source,
} from "@/data/types";
import { getCompetitionPhase } from "@/lib/format";

const sources = sourcesData as Source[];
const countries = countriesData as Country[];
const clubs = clubsData as Club[];
const competitions = competitionsData as Competition[];
const rules = rulesData as Rule[];

export function getSources(): Source[] {
  return sources;
}

export function getSource(id: string): Source | undefined {
  return sources.find((source) => source.id === id);
}

export function getCountries(): Country[] {
  return countries;
}

export function getCountry(slug: string): Country | undefined {
  return countries.find((country) => country.slug === slug);
}

export function getClubs(): Club[] {
  return clubs;
}

export function getClubsByCountry(country: CountrySlug): Club[] {
  return clubs.filter((club) => club.country === country);
}

export function getCompetitions(): Competition[] {
  return competitions;
}

export function getCompetitionsByCountry(country: CountrySlug): Competition[] {
  return competitions.filter((competition) => competition.country === country);
}

export function getRules(): Rule[] {
  return rules;
}

export function getRulesByCountry(country: CountrySlug): Rule[] {
  return rules.filter((rule) => rule.country === country || rule.country === "isu");
}

export function getFeaturedCompetitions(): Competition[] {
  const phaseOrder = {
    ongoing: 0,
    upcoming: 1,
    completed: 2,
    unscheduled: 3,
  } as const;

  return [...competitions]
    .filter((competition) => competition.status === "verified" && competition.startDate)
    .sort((a, b) => {
      const phaseA = getCompetitionPhase(a.startDate, a.endDate);
      const phaseB = getCompetitionPhase(b.startDate, b.endDate);
      if (phaseOrder[phaseA] !== phaseOrder[phaseB]) {
        return phaseOrder[phaseA] - phaseOrder[phaseB];
      }
      return (a.startDate ?? "").localeCompare(b.startDate ?? "");
    })
    .slice(0, 4);
}
