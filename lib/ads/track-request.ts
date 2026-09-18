import { NextRequest, NextResponse } from "next/server";
import type { AdEventType, DeviceType } from "@/data/ads/types";
import { isRegisteredClickTarget, resolveDestinationUrl } from "@/lib/ads/catalog";
import { categorizeUserAgent, isSafePagePath } from "@/lib/ads/metrics";
import {
  allowRateLimit,
  appendAdEvent,
  createEventId,
  hashAnonymousValue,
  isMockAdsMode,
} from "@/lib/ads/store";

const EVENT_TYPES: AdEventType[] = ["impression", "click"];
const DEVICE_TYPES: DeviceType[] = ["desktop", "mobile", "tablet", "unknown"];

type AdEventPayload = {
  campaignId?: string;
  placementId?: string;
  eventType?: string;
  pagePath?: string;
  deviceType?: string;
  sessionId?: string;
};

function readClientKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const raw = forwarded || request.headers.get("x-real-ip") || "unknown";
  return hashAnonymousValue(raw);
}

export async function recordTrackedEvent(
  request: NextRequest,
  payload: AdEventPayload,
  eventType: AdEventType,
) {
  if (!allowRateLimit(readClientKey(request))) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  const campaignId = payload.campaignId?.trim();
  const placementId = payload.placementId?.trim();
  const sessionId = payload.sessionId?.trim();
  const pagePath = payload.pagePath?.trim() || "/";
  const requestedDevice = DEVICE_TYPES.includes(payload.deviceType as DeviceType)
    ? (payload.deviceType as DeviceType)
    : "unknown";

  if (!campaignId || !placementId || !sessionId) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  if (!EVENT_TYPES.includes(eventType)) {
    return NextResponse.json({ ok: false, error: "invalid_event_type" }, { status: 400 });
  }

  if (!isSafePagePath(pagePath)) {
    return NextResponse.json({ ok: false, error: "invalid_page_path" }, { status: 400 });
  }

  const creative = isRegisteredClickTarget(campaignId, placementId);
  if (!creative) {
    return NextResponse.json({ ok: false, error: "inactive_campaign" }, { status: 404 });
  }

  const destinationUrl =
    eventType === "click"
      ? resolveDestinationUrl(creative.destinationUrl, request.nextUrl.origin)
      : undefined;

  if (eventType === "click" && !destinationUrl) {
    return NextResponse.json({ ok: false, error: "invalid_destination" }, { status: 400 });
  }

  const result = await appendAdEvent({
    id: createEventId(),
    campaign_id: campaignId,
    placement_id: placementId,
    event_type: eventType,
    occurred_at: new Date().toISOString(),
    page_path: pagePath,
    device_type: requestedDevice,
    anonymous_session_hash: hashAnonymousValue(sessionId),
    user_agent_category: categorizeUserAgent(request.headers.get("user-agent")),
  });

  return NextResponse.json({
    ok: true,
    mode: isMockAdsMode() ? "mock" : "live",
    duplicate: result === "duplicate",
    destinationUrl: eventType === "click" ? destinationUrl : undefined,
  });
}

export async function parseJsonBody(request: NextRequest): Promise<AdEventPayload> {
  try {
    return (await request.json()) as AdEventPayload;
  } catch {
    return {};
  }
}
