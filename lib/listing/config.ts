import { CONTACT_EMAIL, getContactRecipientEmail } from "@/lib/contact/config";

export const LISTING_PATH = "/submit-listing";
export const LISTING_EMAIL = CONTACT_EMAIL;

export const PARTNER_LEVELS = [
  "初學",
  "可滑規定舞入門",
  "可滑規定舞中階",
  "可滑自由舞／Rhythm Dance",
  "比賽取向",
] as const;

export const AGE_GROUPS = ["18–29", "30–39", "40–49", "50–59", "60+", "不公開"] as const;
export const HEIGHT_RANGES = ["未填寫", "150cm 以下", "150–159", "160–169", "170–179", "180cm 以上"] as const;
export const PRACTICE_OPTIONS = ["每週1次以下", "每週1–2次", "每週3次以上", "不固定"] as const;
export const COMPETITION_OPTIONS = ["目前不比賽", "想嘗試成人賽", "已在比賽", "待討論"] as const;
export const MEETING_OPTIONS = ["in-person", "online", "both"] as const;
export const DANCE_OPTIONS = ["partnered", "solo", "both"] as const;

export const FIELD_LIMITS = {
  displayName: 40,
  name: 80,
  city: 40,
  languages: 80,
  goals: 1200,
  specialties: 200,
  adultExperience: 400,
  website: 200,
  publicContact: 200,
  email: 120,
  sourcePage: 80,
} as const;

export function getListingRecipientEmail(): string {
  return getContactRecipientEmail();
}

export function meetingLabel(value: string): string {
  if (value === "in-person") return "實體";
  if (value === "online") return "線上";
  if (value === "both") return "線上／實體";
  return value;
}

export function danceLabel(value: string): string {
  if (value === "partnered") return "雙人冰舞";
  if (value === "solo") return "單人冰舞交流";
  if (value === "both") return "雙人與單人";
  return value;
}
