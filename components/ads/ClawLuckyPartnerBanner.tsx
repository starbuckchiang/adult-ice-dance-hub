import { ClawLuckyBanner } from "@/components/ads/ClawLuckyBanner";
import { getActivePaidCreative } from "@/lib/ads/catalog";

export function ClawLuckyPartnerBanner() {
  const creative = getActivePaidCreative("HOME_PARTNER");
  if (!creative?.desktopImageUrl.startsWith("/")) {
    return null;
  }
  return <ClawLuckyBanner creative={creative} />;
}
