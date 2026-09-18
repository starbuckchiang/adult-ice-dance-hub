import { NextRequest, NextResponse } from "next/server";
import {
  REPORT_CSV_COLUMNS,
  buildAdReport,
  toCsv,
} from "@/lib/ads/report";
import { listAdEvents } from "@/lib/ads/store";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const token = process.env.ADS_REPORT_TOKEN;
  if (!token) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${token}`) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const start = searchParams.get("start") ?? new Date().toISOString().slice(0, 10);
  const end = searchParams.get("end") ?? start;
  const rows = buildAdReport(await listAdEvents(), {
    advertiserId: searchParams.get("advertiser") ?? undefined,
    campaignId: searchParams.get("campaign") ?? undefined,
    placementId: searchParams.get("placement") ?? undefined,
    start,
    end,
  });

  return new NextResponse(toCsv(rows, REPORT_CSV_COLUMNS), {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="ad-report-${start}-${end}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
