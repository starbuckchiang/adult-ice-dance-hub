const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;
const PLAYLIST_ID_PATTERN = /^[A-Za-z0-9_-]+$/;

export function isYouTubeVideoId(value: string | null | undefined): value is string {
  return Boolean(value && YOUTUBE_ID_PATTERN.test(value));
}

export function isYouTubePlaylistId(value: string | null | undefined): value is string {
  return Boolean(value && PLAYLIST_ID_PATTERN.test(value));
}

export function getYouTubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export function getYouTubePlaylistUrl(playlistId: string): string {
  return `https://www.youtube.com/playlist?list=${playlistId}`;
}

export function getYouTubeReminderUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export function getYouTubeThumbnailUrl(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

export function parseYouTubeVideoId(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return isYouTubeVideoId(id) ? id : null;
    }
    if (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "music.youtube.com" ||
      host === "youtube-nocookie.com"
    ) {
      const fromQuery = parsed.searchParams.get("v");
      if (isYouTubeVideoId(fromQuery)) return fromQuery;
      const parts = parsed.pathname.split("/").filter(Boolean);
      const marker = parts.findIndex((part) => part === "embed" || part === "shorts" || part === "live");
      const id = marker >= 0 ? parts[marker + 1] : undefined;
      return isYouTubeVideoId(id) ? id : null;
    }
  } catch {
    return null;
  }
  return null;
}

export const REPLAY_FALLBACK_SRC = "/images/replay-fallback.png";

export function resolveReplayThumbnail(video: {
  thumbnailUrl?: string | null;
  youtubeVideoId?: string | null;
  officialWatchUrl?: string | null;
}): string {
  const custom = video.thumbnailUrl?.trim();
  if (custom?.startsWith("/") && !custom.startsWith("//")) return custom;
  if (custom) {
    try {
      if (new URL(custom).hostname === "i.ytimg.com") return custom;
    } catch {
      return REPLAY_FALLBACK_SRC;
    }
  }
  const id = isYouTubeVideoId(video.youtubeVideoId)
    ? video.youtubeVideoId
    : parseYouTubeVideoId(video.officialWatchUrl);
  return id ? getYouTubeThumbnailUrl(id) : REPLAY_FALLBACK_SRC;
}

export function getYouTubeEmbedSrc(videoId?: string | null, playlistId?: string | null): string | null {
  if (isYouTubeVideoId(videoId)) {
    return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`;
  }

  if (isYouTubePlaylistId(playlistId)) {
    return `https://www.youtube-nocookie.com/embed/videoseries?list=${playlistId}&rel=0&modestbranding=1`;
  }

  return null;
}

export function getExternalWatchLabel(url: string): string {
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    return "前往 YouTube 觀看";
  }

  return "前往官方轉播觀看";
}
