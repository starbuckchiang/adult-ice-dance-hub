import { NextRequest, NextResponse } from "next/server";
import { parseJsonBody, recordTrackedEvent } from "@/lib/ads/track-request";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = await parseJsonBody(request);
  return recordTrackedEvent(request, body, "click");
}

export async function GET() {
  return NextResponse.json(
    { ok: false, error: "method_not_allowed" },
    { status: 405 },
  );
}
