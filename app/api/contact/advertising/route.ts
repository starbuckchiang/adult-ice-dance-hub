import { NextRequest, NextResponse } from "next/server";
import { hashAnonymousValue, allowRateLimit } from "@/lib/ads/store";
import { sendAdvertisingInquiry } from "@/lib/contact/send";
import { parseContactInquiry } from "@/lib/contact/validate";

export const dynamic = "force-dynamic";

function clientKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const raw = forwarded || request.headers.get("x-real-ip") || "unknown";
  return `contact:${hashAnonymousValue(raw)}`;
}

function logContact(result: string) {
  console.info("contact_advertising", { result });
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

  const { inquiry, honeypotFilled, errors } = parseContactInquiry(body);

  if (honeypotFilled) {
    logContact("ignored");
    return NextResponse.json({ ok: false, status: "unavailable" }, { status: 400 });
  }

  if (Object.keys(errors).length > 0) {
    logContact("invalid");
    return NextResponse.json({ ok: false, status: "invalid", fields: errors }, { status: 400 });
  }

  if (!allowRateLimit(clientKey(request), 5, 10 * 60_000)) {
    logContact("rate_limited");
    return NextResponse.json({ ok: false, status: "unavailable" }, { status: 429 });
  }

  const result = await sendAdvertisingInquiry(inquiry);

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
