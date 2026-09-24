export type VerificationStatus = "verified" | "unverified";

export type DanceType = "partnered" | "solo" | "both" | "general";

export type CountrySlug = "usa" | "japan" | "canada" | "switzerland" | "italy" | "australia";

export type AdultProgramEvidence = "official" | "not-stated" | "unverified";

export type Source = {
  id: string;
  slug: string;
  nameZh: string;
  nameEn: string;
  publisher: string;
  url: string;
  lastVerified: string;
  status: VerificationStatus;
  summary: string;
};

export type Country = {
  id: string;
  slug: CountrySlug;
  nameZh: string;
  nameEn: string;
  country: CountrySlug;
  type: DanceType;
  federationZh: string;
  federationEn: string;
  officialUrl: string;
  summary: string;
  lastVerified: string;
  status: VerificationStatus;
  sourceId: string;
  notes: string;
  disciplineNotes?: string;
};

export type Club = {
  id: string;
  slug: string;
  nameZh: string;
  nameEn: string;
  country: CountrySlug;
  type: "directory" | "federation-list";
  danceType: DanceType;
  city: string;
  officialUrl: string;
  contactUrl: string;
  adultProgramEvidence: AdultProgramEvidence;
  summary: string;
  lastVerified: string;
  status: VerificationStatus;
  sourceId: string;
};

export type Competition = {
  id: string;
  slug: string;
  nameZh: string;
  nameEn: string;
  country: CountrySlug | "international";
  type: DanceType;
  location: string;
  startDate: string | null;
  endDate: string | null;
  summary: string;
  officialUrl: string;
  lastVerified: string;
  status: VerificationStatus;
  sourceId: string;
};

export type Rule = {
  id: string;
  slug: string;
  nameZh: string;
  nameEn: string;
  country: CountrySlug | "isu";
  type: DanceType;
  summary: string;
  officialUrl: string;
  lastVerified: string;
  status: VerificationStatus;
  sourceId: string;
};

export type VideoStatus =
  | "scheduled"
  | "live"
  | "replay"
  | "highlights"
  | "unavailable"
  | "unverified";

export type VideoType =
  | "livestream"
  | "full_replay"
  | "session"
  | "performance"
  | "highlights"
  | "practice"
  | "awards";

export type VideoDiscipline =
  | "partnered_ice_dance"
  | "solo_dance"
  | "pattern_dance"
  | "rhythm_dance"
  | "free_dance"
  | "mixed"
  | "other";

export type CompetitionVideo = {
  id: string;
  competitionId: string;
  competitionSlug: string;
  titleZh: string;
  titleEn: string;
  sessionName: string;
  videoType: VideoType;
  discipline: VideoDiscipline;
  youtubeVideoId: string | null;
  youtubePlaylistId: string | null;
  thumbnailUrl?: string | null;
  youtubeChannelUrl: string | null;
  officialWatchUrl: string;
  officialSourceUrl: string;
  officialResultsUrl: string | null;
  scheduledStartAt: string | null;
  actualStartAt: string | null;
  endedAt: string | null;
  eventDate?: string | null;
  publishedAt?: string | null;
  timezone: string;
  status: VideoStatus;
  isOfficial: boolean;
  embeddable: boolean;
  stillAvailable: boolean;
  containsMultipleEvents: boolean;
  venueName: string | null;
  city: string | null;
  countryName: string | null;
  durationLabel: string | null;
  skaterInfo: string | null;
  displayOrder: number;
  lastVerifiedAt: string;
  sourceId: string;
  liveWatch?: "channel" | "broadcast" | null;
};

export type LearnStep = {
  id: string;
  slug: string;
  nameZh: string;
  nameEn: string;
  purpose: string;
  entryEdge: string;
  exitEdge: string;
  prerequisites: string[];
  breakdown: string[];
  commonErrors: string[];
  safetyNotes: string[];
  lastVerified: string;
  status: VerificationStatus;
  sourceId: string;
  season: string;
};

export type PatternDanceRecord = {
  id: string;
  slug: string;
  nameZh: string;
  nameEn: string;
  isuNumber: string | null;
  rhythm: string;
  timeSignature: string;
  suggestedLevel: string;
  danceType: DanceType;
  overview: string;
  keySteps: string[];
  officialRuleUrl: string;
  demoVideoUrl: string | null;
  season: string;
  lastVerified: string;
  status: VerificationStatus;
  sourceId: string;
};

export type TestingProgram = {
  id: string;
  slug: "usa" | "japan" | "canada" | "switzerland" | "italy" | "australia" | "isu";
  nameZh: string;
  nameEn: string;
  federationZh: string;
  federationEn: string;
  hasFormalAdultDanceTests: "yes" | "no" | "not-stated";
  partneredSystem: string;
  soloSystem: string;
  pathway: string[];
  eligibility: string;
  officialRuleUrl: string;
  applicationUrl: string;
  season: string;
  lastVerified: string;
  status: VerificationStatus;
  sourceId: string;
  notes: string;
};

export type MusicGuide = {
  id: string;
  titleZh: string;
  titleEn: string;
  body: string;
  season: string;
  lastVerified: string;
  status: VerificationStatus;
  sourceId: string;
};

export type MusicLink = {
  id: string;
  nameZh: string;
  nameEn: string;
  url: string;
  kind: "official-rule" | "licensed-platform" | "official-video";
  lastVerified: string;
  sourceId: string;
};

export type ListingKind = "partner" | "coach";

export type PublishedPartnerListing = {
  id: string;
  displayName: string;
  country: CountrySlug;
  city: string;
  danceType: DanceType;
  level: string;
  ageGroup: string;
  heightRange: string;
  practiceFrequency: string;
  competitionIntent: string;
  languages: string[];
  meetingType: "in-person" | "online" | "both";
  lastVerified: string;
  status: VerificationStatus;
};

export type PublishedCoachListing = {
  id: string;
  name: string;
  country: CountrySlug;
  city: string;
  languages: string[];
  specialties: string[];
  adultExperience: string;
  danceType: DanceType;
  meetingType: "in-person" | "online" | "both";
  publicWebsite: string;
  publicContactPage: string;
  consentConfirmed: boolean;
  lastVerified: string;
  status: VerificationStatus;
  sourceId: string;
};
