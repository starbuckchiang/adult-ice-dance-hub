"use client";

import { useEffect, useRef, useState } from "react";
import type { AdCreative } from "@/data/ads/types";
import styles from "./AdBanner.module.css";

const SESSION_KEY = "aidh_anon_session";

function getSessionId(): string {
  const existing = window.sessionStorage.getItem(SESSION_KEY);
  if (existing) {
    return existing;
  }
  const created = crypto.randomUUID();
  window.sessionStorage.setItem(SESSION_KEY, created);
  return created;
}

function impressionStorageKey(creative: AdCreative): string {
  return `aidh_ad_imp:${creative.campaignId}:${creative.placementId}`;
}

function getDeviceType(): "desktop" | "mobile" | "tablet" {
  if (window.matchMedia("(max-width: 720px)").matches) {
    return "mobile";
  }
  if (window.matchMedia("(max-width: 1024px)").matches) {
    return "tablet";
  }
  return "desktop";
}

async function postAdEvent(
  path: string,
  creative: AdCreative,
  eventType: "impression" | "click",
) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      campaignId: creative.campaignId,
      placementId: creative.placementId,
      eventType,
      pagePath: window.location.pathname,
      deviceType: getDeviceType(),
      sessionId: getSessionId(),
    }),
  });
  return response.json() as Promise<{
    ok: boolean;
    destinationUrl?: string;
    duplicate?: boolean;
  }>;
}

export function AdBanner({ creative }: { creative: AdCreative }) {
  const slotRef = useRef<HTMLElement | null>(null);
  const recordedRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const node = slotRef.current;
    if (!node || recordedRef.current) {
      return undefined;
    }

    if (window.sessionStorage.getItem(impressionStorageKey(creative))) {
      recordedRef.current = true;
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) {
          return;
        }

        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          if (timerRef.current !== null || recordedRef.current) {
            return;
          }
          timerRef.current = window.setTimeout(() => {
            if (recordedRef.current) {
              return;
            }
            recordedRef.current = true;
            window.sessionStorage.setItem(impressionStorageKey(creative), "1");
            void postAdEvent("/api/ads/events", creative, "impression");
          }, 1000);
          return;
        }

        if (timerRef.current !== null) {
          window.clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      },
      { threshold: [0.5] },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [creative]);

  if (hidden) {
    return null;
  }

  async function handleClick() {
    try {
      const result = await postAdEvent("/api/ads/click", creative, "click");
      if (!result.ok || !result.destinationUrl) {
        return;
      }
      window.open(result.destinationUrl, "_blank", "noopener,noreferrer");
    } catch {
      // Keep the user on-page if tracking or the registered destination fails.
    }
  }

  return (
    <aside
      ref={slotRef}
      className={styles.slot}
      data-placement={creative.placementCode}
      aria-label="廣告"
    >
      <div className={styles.frame}>
        <p className={styles.label}>廣告 · Sponsored{creative.isDemo ? " · 廣告示意版位" : ""}</p>
        <a
          className={styles.trigger}
          href={creative.destinationUrl}
          target="_blank"
          rel="sponsored noopener noreferrer"
          onClick={(event) => {
            event.preventDefault();
            void handleClick();
          }}
        >
          <picture className={styles.picture}>
            <source media="(max-width: 720px)" srcSet={creative.mobileImageUrl} />
            <img
              className={styles.image}
              src={creative.desktopImageUrl}
              alt={creative.altText}
              onError={() => setHidden(true)}
            />
          </picture>
        </a>
        {creative.isDemo ? (
          <p className={styles.note}>此為開發與展示用中性示意，不是真實廣告主或品牌商標。</p>
        ) : null}
      </div>
    </aside>
  );
}
