"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SITE_NAME_EN, SITE_NAME_ZH } from "@/lib/site";
import styles from "./SiteHeader.module.css";

const navItems = [
  { href: "/", label: "首頁" },
  { href: "/learn", label: "學習中心" },
  { href: "/community", label: "交流" },
  { href: "/countries", label: "國家" },
  { href: "/clubs", label: "俱樂部" },
  { href: "/competitions", label: "比賽資訊" },
  { href: "/rules", label: "規則中心" },
  { href: "/about", label: "關於本站" },
];

function isCurrent(pathname: string, href: string) {
  return href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.bar}>
        <Link className={styles.brand} href="/">
          <span className={styles.brandEm}>{SITE_NAME_EN}</span>
          <span className={styles.brandZh}>{SITE_NAME_ZH}</span>
        </Link>
        <nav className={styles.desktopNav} aria-label="主要導覽">
          {navItems.map((item) => (
            <Link
              key={item.href}
              className={styles.link}
              href={item.href}
              aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
          <Link className="button" href="/countries">
            探索國家
          </Link>
        </nav>
        <button
          className={styles.toggle}
          type="button"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "關閉選單" : "選單"}
        </button>
      </div>
      <nav
        id="site-nav"
        className={`${styles.mobileNav} ${open ? styles.mobileOpen : ""}`}
        aria-label="手機導覽"
        hidden={!open}
      >
        {navItems.map((item) => (
          <Link
            key={item.href}
            className={styles.link}
            href={item.href}
            aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
          >
            {item.label}
          </Link>
        ))}
        <Link className="button" href="/countries">
          探索國家
        </Link>
      </nav>
    </header>
  );
}
