import { NextRequest, NextResponse } from "next/server";
import { allowRateLimit, hashAnonymousValue } from "@/lib/ads/store";
import {
  parseCompetitionSupportInquiry,
  sendCompetitionSupportInquiry,
} from "@/lib/contact/competition-support";

export const dynamic = "force-dynamic";

function clientKey(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const raw = forwarded || request.headers.get("x-real-ip") || "unknown";
  return `competition-support:${hashAnonymousValue(raw)}`;
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown> = {};
  try {
    const parsed = (await request.json()) as unknown;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      body = parsed as Record<string, unknown>;
    }
  } catch {
    return NextResponse.json({ ok: false, status: "invalid" }, { status: 400 });
  }

  const { inquiry, honeypotFilled, errors } = parseCompetitionSupportInquiry(body);

  if (honeypotFilled) {
    return NextResponse.json({ ok: false, status: "unavailable" }, { status: 400 });
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, status: "invalid", fields: errors }, { status: 400 });
  }

  if (!allowRateLimit(clientKey(request), 4, 10 * 60_000)) {
    return NextResponse.json({ ok: false, status: "unavailable" }, { status: 429 });
  }

  const result = await sendCompetitionSupportInquiry(inquiry);
  if (result === "unconfigured") {
    return NextResponse.json({ ok: false, status: "unconfigured" }, { status: 503 });
  }
  if (result === "failed") {
    return NextResponse.json({ ok: false, status: "unavailable" }, { status: 502 });
  }
  return NextResponse.json({ ok: true, status: "sent" });
}

export async function GET() {
  return NextResponse.json({ ok: false, status: "unavailable" }, { status: 405 });
}
