export const SITE_NAME_EN = "Adult Ice Dance Hub";
export const SITE_NAME_ZH = "成人冰舞資訊站";
export const SITE_TAGLINE =
  "整理美國、日本、加拿大、瑞士、義大利與澳洲的成人雙人冰舞與成人單人冰舞官方入口。";

export const PRODUCTION_SITE_URL = "https://adult-ice-dance-hub.vercel.app";

export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (configured && !/localhost|127\.0\.0\.1/i.test(configured)) {
    return configured;
  }
  if (process.env.VERCEL) {
    return PRODUCTION_SITE_URL;
  }
  return configured || "http://localhost:3000";
}

export const DEFAULT_DESCRIPTION =
  "Adult Ice Dance Hub（成人冰舞資訊站）彙整成人雙人冰舞與成人單人冰舞的國家入口、俱樂部名錄、比賽資訊與規則來源，所有正式資訊均附官方連結與查證日期。";
