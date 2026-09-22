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

export const HOUSE_CAMPAIGN_ID = "house-ad-advertising-partnership-2026";

export function isHouseCreative(creative: Pick<AdCreative, "campaignId" | "campaignType">): boolean {
  return creative.campaignType === "house" || creative.campaignId === HOUSE_CAMPAIGN_ID;
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

function assignmentPaidRank(campaignId: string): number {
  return getCampaign(campaignId)?.campaign_type === "paid" ? 1 : 0;
}

function creativeFromAssignment(
  assignment: AdAssignment,
  placement: AdPlacement,
  now: Date,
  paidOnly: boolean,
): AdCreative | null {
  if (assignment.status !== "active") {
    return null;
  }
  if (!isWithinWindow(assignment.starts_at, assignment.ends_at, now)) {
    return null;
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
    return null;
  }
  if (paidOnly && campaign.campaign_type !== "paid") {
    return null;
  }

  const destinationUrl = campaign.destination_url;
  if (!resolveDestinationUrl(destinationUrl)) {
    return null;
  }

  return {
    campaignId: campaign.id,
    campaignName: campaign.name,
    campaignType: campaign.campaign_type,
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

function listPlacementCreatives(
  placementCode: PlacementCode,
  now: Date,
  paidOnly: boolean,
): AdCreative[] {
  const placement = getPlacementByCode(placementCode);
  if (!placement || placement.status !== "active") {
    return [];
  }

  return assignments
    .filter((assignment) => assignment.placement_id === placement.id)
    .sort((a, b) => {
      const paidDiff = assignmentPaidRank(b.campaign_id) - assignmentPaidRank(a.campaign_id);
      if (paidDiff !== 0) {
        return paidDiff;
      }
      return b.priority - a.priority;
    })
    .map((assignment) => creativeFromAssignment(assignment, placement, now, paidOnly))
    .filter((creative): creative is AdCreative => Boolean(creative));
}

export function getActiveCreative(
  placementCode: PlacementCode,
  now = new Date(),
): AdCreative | null {
  return listPlacementCreatives(placementCode, now, false)[0] ?? null;
}

export function getActivePaidCreative(
  placementCode: PlacementCode,
  now = new Date(),
): AdCreative | null {
  return listPlacementCreatives(placementCode, now, true)[0] ?? null;
}

export function resolveHomeHeroSlot(
  now = new Date(),
): { mode: "paid"; creative: AdCreative } | { mode: "guide"; creative: null } {
  const paid = getActivePaidCreative("HOME_HERO", now);
  if (paid) {
    return { mode: "paid", creative: paid };
  }
  return { mode: "guide", creative: null };
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
  const paid = getActivePaidCreative(placement.code, now);
  if (paid && paid.campaignId === campaignId) {
    return paid;
  }
  const creative = getActiveCreative(placement.code, now);
  if (!creative || creative.campaignId !== campaignId) {
    return null;
  }
  return creative;
}
