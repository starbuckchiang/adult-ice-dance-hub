export const CONTACT_PERSON = "漁仁婕小姐";
export const CONTACT_ORG = "神奇蝸牛有限公司";
export const CONTACT_DEPARTMENT = "午夜冰舞部門";
export const CONTACT_PHONE_DISPLAY = "0968-250060";
export const CONTACT_TEL_HREF = "tel:+886968250060";
export const CONTACT_TEL_SCHEMA = "+886-968-250060";
export const CONTACT_EMAIL = "sabrina114114@gmail.com";
export const CONTACT_MAILTO = "mailto:sabrina114114@gmail.com";
export const ADVERTISING_CONTACT_PATH = "/advertising#contact";

export const PLACEMENT_OPTIONS = [
  { value: "home_hero", label: "首頁主要橫幅" },
  { value: "home_inline", label: "首頁內容橫幅" },
  { value: "list", label: "俱樂部／比賽列表" },
  { value: "sidebar", label: "規則／國家／影片側欄" },
  { value: "undecided", label: "尚未確定，希望協助建議" },
] as const;

export const BUDGET_OPTIONS = [
  { value: "undecided", label: "尚未確定" },
  { value: "under_3000", label: "NT$3,000以下" },
  { value: "3000_10000", label: "NT$3,000～10,000" },
  { value: "10000_30000", label: "NT$10,000～30,000" },
  { value: "over_30000", label: "NT$30,000以上" },
] as const;

export const FIELD_LIMITS = {
  company: 120,
  name: 80,
  email: 120,
  phone: 40,
  website: 200,
  period: 80,
  message: 2000,
  honeypot: 200,
  sourcePage: 80,
} as const;

export type PlacementValue = (typeof PLACEMENT_OPTIONS)[number]["value"];
export type BudgetValue = (typeof BUDGET_OPTIONS)[number]["value"];

export function placementLabel(value: string): string {
  return PLACEMENT_OPTIONS.find((item) => item.value === value)?.label ?? value;
}

export function budgetLabel(value: string): string {
  return BUDGET_OPTIONS.find((item) => item.value === value)?.label ?? value;
}

export function getContactRecipientEmail(): string {
  const fromEnv = process.env.CONTACT_RECIPIENT_EMAIL?.trim();
  return fromEnv || CONTACT_EMAIL;
}
