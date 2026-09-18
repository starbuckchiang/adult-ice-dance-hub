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
  youtubeChannelUrl: string | null;
  officialWatchUrl: string;
  officialSourceUrl: string;
  officialResultsUrl: string | null;
  scheduledStartAt: string | null;
  actualStartAt: string | null;
  endedAt: string | null;
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
};
