"use client";

import { useState } from "react";
import { getExternalWatchLabel, getYouTubeEmbedSrc, getYouTubeThumbnailUrl } from "@/lib/youtube";

export function LazyYouTubePlayer({
  videoId,
  playlistId,
  title,
  officialWatchUrl,
  embeddable,
}: {
  videoId: string | null;
  playlistId: string | null;
  title: string;
  officialWatchUrl: string;
  embeddable: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  const embedSrc = embeddable ? getYouTubeEmbedSrc(videoId, playlistId) : null;
  const thumbnailId = videoId ?? "";

  if (!embedSrc) {
    return (
      <div className="player-fallback" role="status">
        <div className="empty-shape" aria-hidden="true" />
        <h2>請至官方平台觀看</h2>
        <p>請使用官方觀看按鈕前往完整影片。</p>
        <a className="button" href={officialWatchUrl} target="_blank" rel="noopener noreferrer">
          {getExternalWatchLabel(officialWatchUrl)}
          <span className="ext-icon" aria-hidden="true">
            ↗
          </span>
        </a>
      </div>
    );
  }

  return (
    <div className="player-frame">
      {loaded ? (
        <iframe
          title={title}
          src={embedSrc}
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <button
          className="player-poster"
          type="button"
          onClick={() => setLoaded(true)}
          aria-label={`播放：${title}`}
        >
          {thumbnailId ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={getYouTubeThumbnailUrl(thumbnailId)} alt={`${title} 縮圖`} />
          ) : (
            <span className="player-poster-fill" />
          )}
          <span className="player-play">播放</span>
        </button>
      )}
    </div>
  );
}
