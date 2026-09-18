import { createHash, randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { AdEvent } from "@/data/ads/types";

const memoryEvents: AdEvent[] = [];
const rateLimitHits = new Map<string, number[]>();

function eventsFilePath(): string {
  return path.join(process.cwd(), ".data", "ad-events.json");
}

export function hashAnonymousValue(value: string): string {
  const salt = process.env.ADS_SESSION_SALT ?? "mock-local-only-salt";
  return createHash("sha256").update(`${salt}:${value}`).digest("hex");
}

export function createEventId(): string {
  return randomUUID();
}

export function isMockAdsMode(): boolean {
  return process.env.ADS_BACKEND !== "supabase";
}

async function readPersistedEvents(): Promise<AdEvent[]> {
  try {
    const raw = await readFile(eventsFilePath(), "utf8");
    const parsed = JSON.parse(raw) as AdEvent[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return memoryEvents;
  }
}

export async function listAdEvents(): Promise<AdEvent[]> {
  const persisted = await readPersistedEvents();
  if (persisted.length > 0) {
    return persisted;
  }
  return [...memoryEvents];
}

export async function appendAdEvent(event: AdEvent): Promise<"recorded" | "duplicate"> {
  const existing = await listAdEvents();

  if (event.event_type === "impression") {
    const duplicate = existing.some(
      (item) =>
        item.event_type === "impression" &&
        item.campaign_id === event.campaign_id &&
        item.placement_id === event.placement_id &&
        item.anonymous_session_hash === event.anonymous_session_hash,
    );
    if (duplicate) {
      return "duplicate";
    }
  }

  if (event.event_type === "click") {
    const recentClick = existing
      .filter(
        (item) =>
          item.event_type === "click" &&
          item.campaign_id === event.campaign_id &&
          item.placement_id === event.placement_id &&
          item.anonymous_session_hash === event.anonymous_session_hash,
      )
      .sort((a, b) => b.occurred_at.localeCompare(a.occurred_at))[0];
    if (recentClick) {
      const delta = Date.parse(event.occurred_at) - Date.parse(recentClick.occurred_at);
      if (Number.isFinite(delta) && delta >= 0 && delta < 2000) {
        return "duplicate";
      }
    }
  }

  const next = [...existing, event];
  memoryEvents.splice(0, memoryEvents.length, ...next);

  try {
    await mkdir(path.dirname(eventsFilePath()), { recursive: true });
    await writeFile(eventsFilePath(), `${JSON.stringify(next, null, 2)}\n`, "utf8");
  } catch {
    // Vercel and other read-only environments keep events in memory only.
  }

  return "recorded";
}

export function allowRateLimit(key: string, limit = 30, windowMs = 60_000): boolean {
  const now = Date.now();
  const recent = (rateLimitHits.get(key) ?? []).filter((stamp) => now - stamp < windowMs);
  if (recent.length >= limit) {
    rateLimitHits.set(key, recent);
    return false;
  }
  recent.push(now);
  rateLimitHits.set(key, recent);
  return true;
}
