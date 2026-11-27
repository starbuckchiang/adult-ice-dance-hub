"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { AdCreative } from "@/data/ads/types";
import styles from "./ClawLuckyBanner.module.css";

const SESSION_KEY = "aidh_anon_session";
const BANNER_WIDTH = 2752;
const BANNER_HEIGHT = 1536;

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

function postAdEvent(creative: AdCreative, eventType: "impression" | "click") {
  const path = eventType === "click" ? "/api/ads/click" : "/api/ads/events";
  void fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    keepalive: true,
    body: JSON.stringify({
      campaignId: creative.campaignId,
      placementId: creative.placementId,
      eventType,
      pagePath: window.location.pathname,
      deviceType: getDeviceType(),
      sessionId: getSessionId(),
    }),
  });
}

export function ClawLuckyBanner({ creative }: { creative: AdCreative }) {
  const slotRef = useRef<HTMLElement | null>(null);
  const recordedRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const imageSrc = creative.desktopImageUrl.startsWith("/") ? creative.desktopImageUrl : "";

  useEffect(() => {
    const node = slotRef.current;
    if (!node || recordedRef.current || !imageSrc) {
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
            postAdEvent(creative, "impression");
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
  }, [creative, imageSrc]);

  if (!imageSrc) {
    return null;
  }

  return (
    <aside ref={slotRef} className={styles.promo} aria-label="合作推廣" data-campaign={creative.campaignId}>
      <p className={styles.label}>合作推廣</p>
      <a
        className={styles.link}
        href={creative.destinationUrl}
        target="_blank"
        rel="sponsored noopener noreferrer"
        onClick={() => postAdEvent(creative, "click")}
      >
        <Image
          className={styles.image}
          src={imageSrc}
          alt={creative.altText}
          width={BANNER_WIDTH}
          height={BANNER_HEIGHT}
          sizes="(max-width: 640px) 100vw, 1120px"
        />
      </a>
    </aside>
  );
}
