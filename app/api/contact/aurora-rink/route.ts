import { NextRequest, NextResponse } from "next/server";
import { allowRateLimit, hashAnonymousValue } from "@/lib/ads/store";
import { parseAuroraRinkInquiry, sendAuroraRinkInquiry } from "@/lib/contact/aurora-rink";

export const dynamic = "force-dynamic";

function clientKey(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const raw = forwarded || request.headers.get("x-real-ip") || "unknown";
  return `aurora-rink:${hashAnonymousValue(raw)}`;
}

function logContact(result: string) {
  console.info("contact_aurora_rink", { result });
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

  const { inquiry, honeypotFilled, errors } = parseAuroraRinkInquiry(body);

  if (honeypotFilled) {
    logContact("ignored");
    return NextResponse.json({ ok: false, status: "unavailable" }, { status: 400 });
  }

  if (Object.keys(errors).length > 0) {
    logContact("invalid");
    return NextResponse.json({ ok: false, status: "invalid", fields: errors }, { status: 400 });
  }

  if (!allowRateLimit(clientKey(request), 4, 10 * 60_000)) {
    logContact("rate_limited");
    return NextResponse.json({ ok: false, status: "unavailable" }, { status: 429 });
  }

  const result = await sendAuroraRinkInquiry(inquiry);
  if (result === "unconfigured") {
    logContact("unconfigured");
    return NextResponse.json({ ok: false, status: "unconfigured" }, { status: 503 });
  }
  if (result === "failed") {
    logContact("failed");
    return NextResponse.json({ ok: false, status: "unavailable" }, { status: 502 });
  }

  logContact("sent");
  return NextResponse.json({ ok: true, status: "sent" });
}

export async function GET() {
  return NextResponse.json({ ok: false, status: "unavailable" }, { status: 405 });
}
