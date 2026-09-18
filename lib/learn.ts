import stepsData from "@/data/learn-steps.json";
import musicGuidesData from "@/data/music-guides.json";
import musicLinksData from "@/data/music-links.json";
import patternData from "@/data/pattern-dances.json";
import testingData from "@/data/testing-programs.json";
import coachData from "@/data/coach-listings.json";
import partnerData from "@/data/partner-listings.json";
import type {
  LearnStep,
  MusicGuide,
  MusicLink,
  PatternDanceRecord,
  PublishedCoachListing,
  PublishedPartnerListing,
  TestingProgram,
} from "@/data/types";

const steps = stepsData as LearnStep[];
const patterns = patternData as PatternDanceRecord[];
const testing = testingData as TestingProgram[];
const musicGuides = musicGuidesData as MusicGuide[];
const musicLinks = musicLinksData as MusicLink[];
const partners = partnerData as PublishedPartnerListing[];
const coaches = coachData as PublishedCoachListing[];

export function getLearnSteps(): LearnStep[] {
  return steps.filter((item) => item.status === "verified");
}

export function getPatternDances(): PatternDanceRecord[] {
  return patterns.filter((item) => item.status === "verified");
}

export function getTestingPrograms(): TestingProgram[] {
  return testing;
}

export function getTestingProgram(slug: string): TestingProgram | undefined {
  return testing.find((item) => item.slug === slug);
}

export function getMusicGuides(): MusicGuide[] {
  return musicGuides.filter((item) => item.status === "verified");
}

export function getMusicLinks(): MusicLink[] {
  return musicLinks;
}

export function getPublishedPartners(): PublishedPartnerListing[] {
  return partners.filter((item) => item.status === "verified");
}

export function getPublishedCoaches(): PublishedCoachListing[] {
  return coaches.filter((item) => item.status === "verified" && item.consentConfirmed);
}
