export const SITE_NAME_EN = "Adult Ice Dance Hub";
export const SITE_NAME_ZH = "成人冰舞資訊站";
export const SITE_TAGLINE =
  "整理美國、日本、加拿大與瑞士的成人雙人冰舞與成人單人冰舞官方入口。";

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export const DEFAULT_DESCRIPTION =
  "Adult Ice Dance Hub（成人冰舞資訊站）彙整成人雙人冰舞與成人單人冰舞的國家入口、俱樂部名錄、比賽資訊與規則來源，所有正式資訊均附官方連結與查證日期。";
