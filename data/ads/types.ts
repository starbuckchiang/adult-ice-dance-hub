export type AdStatus = "active" | "inactive";

export type PlacementCode = "HOME_HERO" | "HOME_INLINE" | "LIST_INLINE" | "SIDEBAR";

export type AdEventType = "impression" | "click";

export type DeviceType = "desktop" | "mobile" | "tablet" | "unknown";

export type Advertiser = {
  id: string;
  name: string;
  contact_name: string;
  contact_email: string;
  status: AdStatus;
  created_at: string;
  updated_at: string;
};

export type AdCampaign = {
  id: string;
  advertiser_id: string;
  name: string;
  destination_url: string;
  desktop_image_url: string;
  mobile_image_url: string;
  alt_text: string;
  starts_at: string;
  ends_at: string;
  status: AdStatus;
  is_demo: boolean;
  created_at: string;
  updated_at: string;
};

export type AdPlacement = {
  id: string;
  code: PlacementCode;
  name: string;
  page_type: string;
  status: AdStatus;
};

export type AdAssignment = {
  id: string;
  campaign_id: string;
  placement_id: string;
  starts_at: string;
  ends_at: string;
  priority: number;
  status: AdStatus;
};

export type AdEvent = {
  id: string;
  campaign_id: string;
  placement_id: string;
  event_type: AdEventType;
  occurred_at: string;
  page_path: string;
  device_type: DeviceType;
  anonymous_session_hash: string;
  user_agent_category: DeviceType;
};

export type AdCreative = {
  campaignId: string;
  campaignName: string;
  advertiserId: string;
  advertiserName: string;
  placementId: string;
  placementCode: PlacementCode;
  desktopImageUrl: string;
  mobileImageUrl: string;
  altText: string;
  destinationUrl: string;
  startsAt: string;
  endsAt: string;
  status: AdStatus;
  isDemo: boolean;
  sponsored: true;
};
