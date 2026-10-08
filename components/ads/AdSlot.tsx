import Image from "next/image";
import { AdBanner } from "@/components/ads/AdBanner";
import slotStyles from "@/components/ads/AdBanner.module.css";
import imageStyles from "@/components/ads/AdSlotImage.module.css";
import { AdvertisingPartnershipBanner } from "@/components/ads/AdvertisingPartnershipBanner";
import { SkateGuidePromo } from "@/components/guides/SkateGuidePromo";
import { resolveLiveAd } from "@/data/ads";
import type { PlacementCode } from "@/data/ads/types";
import { getActiveCreative, getActivePaidCreative, isHouseCreative } from "@/lib/ads/catalog";

const PARTNERSHIP_HREF = "/advertising#contact";

type CatalogSlotProps = {
  placementCode: PlacementCode;
  placement?: undefined;
};

type ManagedSlotProps = {
  placement: string;
  placementCode?: undefined;
};

function CatalogAdSlot({ placementCode }: { placementCode: PlacementCode }) {
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

function PartnershipPlaceholder() {
  const creative = getActiveCreative("HOME_INLINE");
  if (creative && isHouseCreative(creative)) {
    return <AdBanner creative={creative} />;
  }

  return (
    <aside className={slotStyles.slot} data-placement="HOME_INLINE" aria-label="廣告合作">
      <a className={slotStyles.trigger} href={PARTNERSHIP_HREF} rel="noopener">
        <AdvertisingPartnershipBanner placementCode="HOME_INLINE" />
      </a>
    </aside>
  );
}

function ManagedAdSlot({ placement }: { placement: string }) {
  const ad = resolveLiveAd(placement);
  if (!ad) {
    return <PartnershipPlaceholder />;
  }

  return (
    <aside className={slotStyles.slot} aria-label="合作推廣" data-ad={ad.id} data-placement={ad.placement}>
      <div className={imageStyles.frame}>
        <p className={imageStyles.disclosure}>合作推廣</p>
        <a className={slotStyles.trigger} href={ad.href} target="_blank" rel="sponsored noopener noreferrer">
          <Image
            className={imageStyles.image}
            src={ad.imageSrc}
            alt={ad.alt}
            width={ad.width}
            height={ad.height}
            sizes="(max-width: 640px) 70vw, 784px"
            style={{ width: "100%", height: "auto" }}
          />
        </a>
      </div>
    </aside>
  );
}

function isManagedSlot(props: CatalogSlotProps | ManagedSlotProps): props is ManagedSlotProps {
  return Boolean(props.placement);
}

export function AdSlot(props: CatalogSlotProps | ManagedSlotProps) {
  if (isManagedSlot(props)) {
    return <ManagedAdSlot placement={props.placement} />;
  }

  return <CatalogAdSlot placementCode={props.placementCode} />;
}
