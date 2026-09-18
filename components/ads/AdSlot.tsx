import { AdBanner } from "@/components/ads/AdBanner";
import type { PlacementCode } from "@/data/ads/types";
import { getActiveCreative } from "@/lib/ads/catalog";

export function AdSlot({ placementCode }: { placementCode: PlacementCode }) {
  const creative = getActiveCreative(placementCode);
  if (!creative) {
    return null;
  }

  return <AdBanner creative={creative} />;
}
