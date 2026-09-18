export function calculateCtr(clicks: number, impressions: number): number {
  if (impressions <= 0) {
    return 0;
  }

  return (clicks / impressions) * 100;
}

export function formatCtr(clicks: number, impressions: number): string {
  return calculateCtr(clicks, impressions).toFixed(2);
}

export function isSafePagePath(path: string): boolean {
  return path.startsWith("/") && !path.startsWith("//") && !path.includes("://");
}

export function categorizeUserAgent(userAgent: string | null): "desktop" | "mobile" | "tablet" | "unknown" {
  if (!userAgent) {
    return "unknown";
  }

  if (/iPad|Tablet/i.test(userAgent)) {
    return "tablet";
  }

  if (/Mobile|Android|iPhone/i.test(userAgent)) {
    return "mobile";
  }

  return "desktop";
}
