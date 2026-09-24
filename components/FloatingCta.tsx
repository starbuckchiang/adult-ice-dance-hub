"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  COMPETITION_PLAN_HREF,
  COMPETITION_PLAN_LABEL,
  COMPETITION_PLAN_LABEL_MOBILE,
} from "@/lib/navigation";
import styles from "./FloatingCta.module.css";

export function FloatingCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => {
      if (document.documentElement.hasAttribute("data-nav-open")) {
        setVisible(false);
        return;
      }
      const hero = document.querySelector(".band-hero, .page-hero, .page-header");
      const pastHero = hero ? hero.getBoundingClientRect().bottom < 72 : window.scrollY > 120;
      const blockers = document.querySelectorAll("[data-cta-hide], footer");
      const blocked = Array.from(blockers).some((node) => {
        const rect = node.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > window.innerHeight * 0.45;
      });
      setVisible(pastHero && !blocked);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    document.documentElement.toggleAttribute("data-plan-cta", visible);
    return () => document.documentElement.removeAttribute("data-plan-cta");
  }, [visible]);

  return (
    <Link
      className={styles.cta}
      href={COMPETITION_PLAN_HREF}
      aria-label={COMPETITION_PLAN_LABEL}
      hidden={!visible}
    >
      <span className={styles.desktopLabel}>{COMPETITION_PLAN_LABEL}</span>
      <span className={styles.mobileLabel}>
        {COMPETITION_PLAN_LABEL_MOBILE}
        <span aria-hidden="true"> →</span>
      </span>
      <span className={styles.arrow} aria-hidden="true">
        →
      </span>
    </Link>
  );
}
