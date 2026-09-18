"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SITE_NAME_EN, SITE_NAME_ZH } from "@/lib/site";
import styles from "./SiteHeader.module.css";

const navItems = [
  { href: "/", label: "首頁" },
  { href: "/countries", label: "國家" },
  { href: "/clubs", label: "俱樂部" },
  { href: "/competitions", label: "比賽資訊" },
  { href: "/rules", label: "規則中心" },
  { href: "/about", label: "關於本站" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link className={styles.brand} href="/">
          <span className={styles.brandEm}>{SITE_NAME_EN}</span>
          <span className={styles.brandZh}>{SITE_NAME_ZH}</span>
        </Link>
        <button
          className={styles.toggle}
          type="button"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "關閉選單" : "選單"}
        </button>
        <nav
          id="site-nav"
          className={`${styles.nav} ${open ? styles.navOpen : ""}`}
          aria-label="主要導覽"
        >
          {navItems.map((item) => {
            const current =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                className={styles.link}
                href={item.href}
                aria-current={current ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
