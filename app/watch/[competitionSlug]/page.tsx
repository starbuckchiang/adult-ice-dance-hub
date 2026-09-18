import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WatchStudio } from "@/components/watch/WatchStudio";
import { getCompetition, getCompetitions, getSource } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import { getVideosByCompetition } from "@/lib/videos";

type WatchPageProps = {
  params: Promise<{ competitionSlug: string }>;
  searchParams: Promise<{ v?: string }>;
};

export function generateStaticParams() {
  return getCompetitions().map((competition) => ({
    competitionSlug: competition.slug,
  }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: WatchPageProps): Promise<Metadata> {
  const { competitionSlug } = await params;
  const competition = getCompetition(competitionSlug);

  if (!competition) {
    return createPageMetadata({
      title: "觀看比賽",
      description: "成人冰舞比賽直播與錄影觀看頁。",
      path: "/competitions",
    });
  }

  return createPageMetadata({
    title: `觀看｜${competition.nameZh}`,
    description: `${competition.nameZh} 官方直播或比賽錄影觀看頁。只嵌入已查證的官方影片，不自動播放。`,
    path: `/watch/${competition.slug}`,
  });
}

export default async function WatchPage({ params, searchParams }: WatchPageProps) {
  const { competitionSlug } = await params;
  const { v } = await searchParams;
  const competition = getCompetition(competitionSlug);

  if (!competition) {
    notFound();
  }

  const videos = getVideosByCompetition(competition.id);
  const sources = Object.fromEntries(
    videos.map((video) => [video.sourceId, getSource(video.sourceId)]),
  );

  return (
    <>
      <header className="page-header">
        <p className="kicker">WATCH</p>
        <h1>{competition.nameZh}</h1>
        <p>{competition.nameEn}</p>
        <div className="button-row">
          <Link className="button-secondary" href="/competitions">
            返回比賽頁
          </Link>
        </div>
      </header>
      <WatchStudio
        competition={competition}
        videos={videos}
        initialVideoId={v}
        sources={sources}
      />
    </>
  );
}
