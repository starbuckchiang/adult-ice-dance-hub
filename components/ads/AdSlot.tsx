import { AdBanner } from "@/components/ads/AdBanner";
import { SkateGuidePromo } from "@/components/guides/SkateGuidePromo";
import type { PlacementCode } from "@/data/ads/types";
import { getActiveCreative, getActivePaidCreative } from "@/lib/ads/catalog";

export function AdSlot({ placementCode }: { placementCode: PlacementCode }) {
  // Paid campaigns occupy HOME_HERO first. The skate guide is in-site content, not an ad event.
  if (placementCode === "HOME_HERO") {
    const paid = getActivePaidCreative(placementCode);
    if (paid) {
      return <AdBanner creative={paid} />;
    }
    return <SkateGuidePromo />;
  }

  const creative = getActiveCreative(placementCode);
  if (!creative) {
    return null;
  }

  return <AdBanner creative={creative} />;
}
