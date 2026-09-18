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
