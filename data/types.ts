export type VerificationStatus = "verified" | "unverified";

export type DanceType = "partnered" | "solo" | "both" | "general";

export type CountrySlug = "usa" | "japan" | "canada" | "switzerland";

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
};

export type Club = {
  id: string;
  slug: string;
  nameZh: string;
  nameEn: string;
  country: CountrySlug;
  type: "directory" | "federation-list";
  danceType: DanceType;
  summary: string;
  officialUrl: string;
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
