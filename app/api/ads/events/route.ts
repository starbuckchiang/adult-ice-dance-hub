import { NextRequest, NextResponse } from "next/server";
import type { AdEventType } from "@/data/ads/types";
import { parseJsonBody, recordTrackedEvent } from "@/lib/ads/track-request";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = await parseJsonBody(request);
  const eventType = body.eventType === "click" ? "click" : "impression";
  if (!["impression", "click"].includes(eventType)) {
    return NextResponse.json({ ok: false, error: "invalid_event_type" }, { status: 400 });
  }
  return recordTrackedEvent(request, body, eventType as AdEventType);
}
