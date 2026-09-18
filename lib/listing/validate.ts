import {
  AGE_GROUPS,
  COMPETITION_OPTIONS,
  DANCE_OPTIONS,
  FIELD_LIMITS,
  HEIGHT_RANGES,
  MEETING_OPTIONS,
  PARTNER_LEVELS,
  PRACTICE_OPTIONS,
} from "@/lib/listing/config";

export type ListingKind = "partner" | "coach";

export type ListingInquiry = {
  kind: ListingKind;
  displayName: string;
  name: string;
  email: string;
  country: string;
  city: string;
  danceType: string;
  level: string;
  ageGroup: string;
  heightRange: string;
  practiceFrequency: string;
  competitionIntent: string;
  languages: string;
  meetingType: string;
  goals: string;
  specialties: string;
  adultExperience: string;
  website: string;
  publicContact: string;
  adultConfirmed: boolean;
  privacyConsent: boolean;
  coachConsent: boolean;
  sourcePage: string;
};

export type ListingFieldErrors = Partial<Record<keyof ListingInquiry, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const COUNTRIES = ["usa", "japan", "canada", "switzerland", "italy", "australia"];
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

function stripUnsafe(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }
  return value
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/javascript:/gi, "")
    .replace(CONTROL_CHARS, "")
    .trim();
}

function tooLong(value: string, max: number) {
  return value.length > max;
}

function isSafeWebsite(value: string) {
  if (!value) return true;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

export function parseListingInquiry(body: Record<string, unknown>): {
  inquiry: ListingInquiry;
  honeypotFilled: boolean;
  errors: ListingFieldErrors;
} {
  const kind = stripUnsafe(body.kind) === "coach" ? "coach" : "partner";
  const displayName = stripUnsafe(body.displayName);
  const name = stripUnsafe(body.name);
  const email = stripUnsafe(body.email).toLowerCase();
  const country = stripUnsafe(body.country);
  const city = stripUnsafe(body.city);
  const danceType = stripUnsafe(body.danceType);
  const level = stripUnsafe(body.level);
  const ageGroup = stripUnsafe(body.ageGroup);
  const heightRange = stripUnsafe(body.heightRange) || "未填寫";
  const practiceFrequency = stripUnsafe(body.practiceFrequency);
  const competitionIntent = stripUnsafe(body.competitionIntent);
  const languages = stripUnsafe(body.languages);
  const meetingType = stripUnsafe(body.meetingType);
  const goals = stripUnsafe(body.goals);
  const specialties = stripUnsafe(body.specialties);
  const adultExperience = stripUnsafe(body.adultExperience);
  const website = stripUnsafe(body.website);
  const publicContact = stripUnsafe(body.publicContact);
  const honeypot = stripUnsafe(body.companyFax ?? body.honeypot);
  const adultConfirmed = body.adultConfirmed === true || body.adultConfirmed === "true";
  const privacyConsent = body.privacyConsent === true || body.privacyConsent === "true";
  const coachConsent = body.coachConsent === true || body.coachConsent === "true";

  const errors: ListingFieldErrors = {};

  if (kind === "partner") {
    if (!displayName || tooLong(displayName, FIELD_LIMITS.displayName)) errors.displayName = "請填寫40字以內的顯示名稱";
    if (!adultConfirmed) errors.adultConfirmed = "請確認你已滿18歲";
    if (!COUNTRIES.includes(country)) errors.country = "請選擇國家";
    if (!city || tooLong(city, FIELD_LIMITS.city)) errors.city = "請填寫城市或地區，不要填寫完整住址";
    if (!DANCE_OPTIONS.includes(danceType as (typeof DANCE_OPTIONS)[number])) errors.danceType = "請選擇冰舞類型";
    if (!PARTNER_LEVELS.includes(level as (typeof PARTNER_LEVELS)[number])) errors.level = "請選擇程度";
    if (!AGE_GROUPS.includes(ageGroup as (typeof AGE_GROUPS)[number])) errors.ageGroup = "請選擇年齡組別";
    if (!HEIGHT_RANGES.includes(heightRange as (typeof HEIGHT_RANGES)[number])) errors.heightRange = "請選擇身高區間或未填寫";
    if (!PRACTICE_OPTIONS.includes(practiceFrequency as (typeof PRACTICE_OPTIONS)[number])) {
      errors.practiceFrequency = "請選擇練習頻率";
    }
    if (!COMPETITION_OPTIONS.includes(competitionIntent as (typeof COMPETITION_OPTIONS)[number])) {
      errors.competitionIntent = "請選擇比賽意願";
    }
    if (!languages || tooLong(languages, FIELD_LIMITS.languages)) errors.languages = "請填寫語言";
    if (!MEETING_OPTIONS.includes(meetingType as (typeof MEETING_OPTIONS)[number])) errors.meetingType = "請選擇線上或實體";
    if (!goals || tooLong(goals, FIELD_LIMITS.goals)) errors.goals = "請簡述練習與比賽目標";
    if (!privacyConsent) errors.privacyConsent = "請同意隱私說明";
  } else {
    if (!name || tooLong(name, FIELD_LIMITS.name)) errors.name = "請填寫姓名";
    if (!COUNTRIES.includes(country)) errors.country = "請選擇國家";
    if (!city || tooLong(city, FIELD_LIMITS.city)) errors.city = "請填寫所在地，不要填寫住址";
    if (!specialties || tooLong(specialties, FIELD_LIMITS.specialties)) errors.specialties = "請填寫教學專長";
    if (!adultExperience || tooLong(adultExperience, FIELD_LIMITS.adultExperience)) {
      errors.adultExperience = "請說明成人教學經驗";
    }
    if (!isSafeWebsite(website) || tooLong(website, FIELD_LIMITS.website)) errors.website = "請輸入有效的公開網站，或留空";
    if (tooLong(publicContact, FIELD_LIMITS.publicContact)) errors.publicContact = "公開聯絡方式過長";
    if (!website && !publicContact) errors.website = "請提供公開網站或公開聯絡頁";
    if (!coachConsent) errors.coachConsent = "請確認本人同意刊登";
    if (!privacyConsent) errors.privacyConsent = "請同意隱私說明";
  }

  if (!email || !EMAIL_PATTERN.test(email) || tooLong(email, FIELD_LIMITS.email)) {
    errors.email = "請輸入有效的Email，僅供管理者審核";
  }

  return {
    inquiry: {
      kind,
      displayName,
      name,
      email,
      country,
      city,
      danceType,
      level,
      ageGroup,
      heightRange,
      practiceFrequency,
      competitionIntent,
      languages,
      meetingType,
      goals,
      specialties,
      adultExperience,
      website,
      publicContact,
      adultConfirmed,
      privacyConsent,
      coachConsent,
      sourcePage: "/submit-listing",
    },
    honeypotFilled: honeypot.length > 0,
    errors,
  };
}
