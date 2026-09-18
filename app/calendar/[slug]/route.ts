import { getCompetition } from "@/lib/content";
import { buildCompetitionIcs } from "@/lib/ics";

type CalendarRouteProps = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, { params }: CalendarRouteProps) {
  const { slug } = await params;
  const competition = getCompetition(slug);

  if (!competition || !competition.startDate) {
    return new Response("Calendar not available", { status: 404 });
  }

  return new Response(buildCompetitionIcs(competition), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${competition.slug}.ics"`,
    },
  });
}
