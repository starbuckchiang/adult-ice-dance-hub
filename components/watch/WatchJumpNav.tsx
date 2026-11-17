"use client";

import { useEffect, useState } from "react";
import styles from "./WatchHub.module.css";

const ITEMS = [
  { href: "#live-now", label: "現正直播" },
  { href: "#replays", label: "最新重播" },
  { href: "#upcoming", label: "即將直播" },
] as const;

export function WatchJumpNav() {
  const [hash, setHash] = useState("#replays");

  useEffect(() => {
    const sync = () => setHash(window.location.hash || "#replays");
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  return (
    <nav className={styles.jumps} aria-label="影音區段">
      {ITEMS.map((item) => {
        const current = hash === item.href;
        return (
          <a key={item.href} href={item.href} aria-current={current ? "true" : undefined}>
            {item.label}
            {current ? <span className={styles.jumpDot} aria-hidden="true" /> : null}
          </a>
        );
      })}
    </nav>
  );
}
