export type ManagedAd = {
  id: string;
  placement: string;
  advertiser: string;
  title: string;
  imageSrc: string;
  targetUrl: string;
  alt: string;
  active: boolean;
  /** 空字串代表不限制開始時間。 */
  startsAt: string;
  /** 空字串代表不限制結束時間。 */
  endsAt: string;
  utmCampaign: string;
  width: number;
  height: number;
};

export const FIRST_COMPETITION_PLAN_PLACEMENT = "first-competition-plan";

/**
 * 廣告清單。正式連結確認前，Claw Lucky 必須維持 active: false。
 * 不可把封閉測試頁（路徑結尾為 beta.html）填進 targetUrl。
 */
export const ads: ManagedAd[] = [
  {
    id: "claw-lucky-2026-q4",
    placement: FIRST_COMPETITION_PLAN_PLACEMENT,
    advertiser: "Claw Lucky",
    title: "Claw Lucky Wallpaper × Adult Ice Dance",
    imageSrc: "/ads/claw-lucky-adult-ice-dance.jpg",
    // TODO: 正式連結確認後再填入 targetUrl，並將 active 改為 true。
    targetUrl: "",
    alt: "Claw Lucky Wallpaper 與 Adult Ice Dance 合作推廣",
    active: false,
    startsAt: "2026-10-08T00:00:00+08:00",
    endsAt: "2026-12-31T23:59:59+08:00",
    utmCampaign: "claw_lucky_2026_q4",
    width: 2752,
    height: 1536,
  },
];

export type LiveAd = ManagedAd & { href: string };

function isClosedBetaUrl(url: URL): boolean {
  return url.pathname === "/beta.html" || url.pathname.endsWith("/beta.html");
}

export function buildTrackedUrl(ad: ManagedAd): string | null {
  let url: URL;
  try {
    url = new URL(ad.targetUrl);
  } catch {
    return null;
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    return null;
  }

  if (isClosedBetaUrl(url)) {
    return null;
  }

  url.searchParams.set("utm_source", "adult-ice-dance-hub");
  url.searchParams.set("utm_medium", "banner");
  url.searchParams.set("utm_campaign", ad.utmCampaign);
  url.searchParams.set("utm_content", ad.placement);
  return url.toString();
}

export function isWithinSchedule(ad: ManagedAd, now: Date): boolean {
  if (ad.startsAt) {
    const start = Date.parse(ad.startsAt);
    if (!Number.isFinite(start) || now.getTime() < start) {
      return false;
    }
  }

  if (ad.endsAt) {
    const end = Date.parse(ad.endsAt);
    if (!Number.isFinite(end) || now.getTime() > end) {
      return false;
    }
  }

  return true;
}

export function resolveLiveAd(placement: string, now = new Date()): LiveAd | null {
  const ad = ads.find((item) => item.placement === placement && item.active);
  if (!ad || !isWithinSchedule(ad, now)) {
    return null;
  }

  if (!ad.imageSrc.startsWith("/ads/") || ad.width < 1 || ad.height < 1) {
    return null;
  }

  const href = buildTrackedUrl(ad);
  if (!href) {
    return null;
  }

  return { ...ad, href };
}
