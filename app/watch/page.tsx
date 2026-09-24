import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/nav/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { WatchHub } from "@/components/watch/WatchHub";
import { getCompetition, getSource } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd } from "@/lib/seo";
import { getLatestReplays, getLiveStreams } from "@/lib/videos";
import { getYouTubeThumbnailUrl, isYouTubeVideoId } from "@/lib/youtube";

const crumbs = [
  { name: "首頁", path: "/" },
  { name: "影音直播", path: "/watch" },
];

export const metadata: Metadata = createPageMetadata({
  title: "成人冰舞直播與重播｜近期賽事影音",
  description: "集中整理成人冰舞現正直播、即將直播與最新賽事重播，快速找到可觀看的官方影音來源。",
  path: "/watch",
});

function videoObjects() {
  const visible = [...getLiveStreams(), ...getLatestReplays()];
  return visible.flatMap((video) => {
    if (!video.officialWatchUrl || !isYouTubeVideoId(video.youtubeVideoId)) return [];
    const published = video.endedAt ?? video.actualStartAt ?? video.scheduledStartAt;
    if (!published || Number.isNaN(new Date(published).getTime())) return [];
    let url: string;
    try {
      url = new URL(video.officialWatchUrl).toString();
    } catch {
      return [];
    }
    return [
      {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: video.titleZh,
        description: video.sessionName || video.titleZh,
        thumbnailUrl: getYouTubeThumbnailUrl(video.youtubeVideoId),
        uploadDate: published,
        url,
        embedUrl: `https://www.youtube-nocookie.com/embed/${video.youtubeVideoId}`,
      },
    ];
  });
}

export default function WatchPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      {videoObjects().map((item) => (
        <JsonLd key={item.url} data={item} />
      ))}
      <header className="page-header watch-hero">
        <Breadcrumbs items={crumbs} />
        <p className="kicker">WATCH ICE DANCE</p>
        <h1>觀看成人冰舞直播、重播與教學</h1>
        <p>
          集中整理現正直播、即將直播與最新重播，讓使用者不必在多個賽事頁面尋找觀看入口。
        </p>
      </header>
      <div className="container">
        <WatchHub getCompetition={getCompetition} getSource={getSource} />
      </div>
    </>
  );
}
