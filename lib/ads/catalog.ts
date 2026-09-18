import type {
  AdAssignment,
  AdCampaign,
  AdCreative,
  Advertiser,
  AdPlacement,
  PlacementCode,
} from "@/data/ads/types";
import advertisersData from "@/data/ads/advertisers.json";
import assignmentsData from "@/data/ads/ad_assignments.json";
import campaignsData from "@/data/ads/ad_campaigns.json";
import placementsData from "@/data/ads/ad_placements.json";
import { getSiteUrl } from "@/lib/site";

const advertisers = advertisersData as Advertiser[];
const campaigns = campaignsData as AdCampaign[];
const placements = placementsData as AdPlacement[];
const assignments = assignmentsData as AdAssignment[];

export function getAdvertisers(): Advertiser[] {
  return advertisers;
}

export function getAdvertiser(id: string): Advertiser | undefined {
  return advertisers.find((item) => item.id === id);
}

export function getCampaigns(): AdCampaign[] {
  return campaigns;
}

export function getCampaign(id: string): AdCampaign | undefined {
  return campaigns.find((item) => item.id === id);
}

export function getPlacements(): AdPlacement[] {
  return placements;
}

export function getPlacement(id: string): AdPlacement | undefined {
  return placements.find((item) => item.id === id);
}

export function getPlacementByCode(code: PlacementCode): AdPlacement | undefined {
  return placements.find((item) => item.code === code);
}

function isWithinWindow(startsAt: string, endsAt: string, now: Date): boolean {
  const start = Date.parse(startsAt);
  const end = Date.parse(endsAt);
  const stamp = now.getTime();
  return Number.isFinite(start) && Number.isFinite(end) && stamp >= start && stamp <= end;
}

export function resolveDestinationUrl(
  destinationUrl: string,
  origin = getSiteUrl(),
): string | null {
  if (destinationUrl.startsWith("/") && !destinationUrl.startsWith("//")) {
    return new URL(destinationUrl, origin).toString();
  }

  try {
    const parsed = new URL(destinationUrl);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

export function getActiveCreative(
  placementCode: PlacementCode,
  now = new Date(),
): AdCreative | null {
  const placement = getPlacementByCode(placementCode);
  if (!placement || placement.status !== "active") {
    return null;
  }

  const candidates = assignments
    .filter((assignment) => assignment.placement_id === placement.id)
    .sort((a, b) => b.priority - a.priority);

  for (const assignment of candidates) {
    if (assignment.status !== "active") {
      continue;
    }
    if (!isWithinWindow(assignment.starts_at, assignment.ends_at, now)) {
      continue;
    }

    const campaign = getCampaign(assignment.campaign_id);
    const advertiser = campaign ? getAdvertiser(campaign.advertiser_id) : undefined;
    if (
      !campaign ||
      !advertiser ||
      campaign.status !== "active" ||
      advertiser.status !== "active" ||
      !isWithinWindow(campaign.starts_at, campaign.ends_at, now)
    ) {
      continue;
    }

    const destinationUrl = campaign.destination_url;
    if (!resolveDestinationUrl(destinationUrl)) {
      continue;
    }

    return {
      campaignId: campaign.id,
      campaignName: campaign.name,
      advertiserId: advertiser.id,
      advertiserName: advertiser.name,
      placementId: placement.id,
      placementCode: placement.code,
      desktopImageUrl: campaign.desktop_image_url,
      mobileImageUrl: campaign.mobile_image_url,
      altText: campaign.alt_text,
      destinationUrl,
      startsAt: campaign.starts_at,
      endsAt: campaign.ends_at,
      status: campaign.status,
      isDemo: campaign.is_demo,
      sponsored: true,
    };
  }

  return null;
}

export function isRegisteredClickTarget(
  campaignId: string,
  placementId: string,
  now = new Date(),
): AdCreative | null {
  const placement = getPlacement(placementId);
  if (!placement) {
    return null;
  }
  const creative = getActiveCreative(placement.code, now);
  if (!creative || creative.campaignId !== campaignId) {
    return null;
  }
  return creative;
}
