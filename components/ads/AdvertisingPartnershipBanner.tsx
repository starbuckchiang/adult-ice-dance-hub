import type { PlacementCode } from "@/data/ads/types";
import styles from "./AdvertisingPartnershipBanner.module.css";

const COPY = {
  default: {
    title: "讓更多滑冰愛好者看見你的品牌",
    body: "在成人冰舞資訊、賽事與影片內容中，精準接觸滑冰族群。",
    cta: "洽詢廣告合作",
  },
  compact: {
    title: "你的品牌，也能站上冰舞舞台",
    body: "接觸關注滑冰、賽事與訓練的讀者。",
    cta: "了解廣告合作",
  },
} as const;

export function AdvertisingPartnershipBanner({
  placementCode,
}: {
  placementCode: PlacementCode;
}) {
  const compact = placementCode === "SIDEBAR";
  const copy = compact ? COPY.compact : COPY.default;

  return (
    <div className={`${styles.banner} ${compact ? styles.compact : ""}`}>
      <span className={styles.deco} aria-hidden="true" />
      <p className={styles.label}>廣告合作</p>
      <p className={styles.title}>{copy.title}</p>
      <p className={styles.body}>{copy.body}</p>
      <span className={styles.cta}>{copy.cta}</span>
    </div>
  );
}
