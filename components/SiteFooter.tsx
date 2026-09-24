"use client";

import Link from "next/link";
import { useState } from "react";
import { footerColumns } from "@/lib/navigation";
import { SITE_NAME_EN, SITE_NAME_ZH } from "@/lib/site";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <footer className={`site-footer ${styles.footer}`} data-cta-hide>
      <div className={styles.footerInner}>
        <div className={styles.footerColumn}>
          <strong className={styles.brandName}>{SITE_NAME_EN}</strong>
          <span className={styles.brandZh}>{SITE_NAME_ZH}</span>
          <p className={styles.footerDescription}>成人冰舞的學習、裝備、參賽與官方來源入口。</p>
        </div>
        {footerColumns.map((column) => (
          <div className={styles.footerColumn} key={column.id}>
            <h2 className={styles.desktopTitle}>{column.title}</h2>
            <button
              className={styles.summary}
              type="button"
              aria-expanded={openId === column.id}
              aria-controls={`footer-${column.id}`}
              onClick={() => setOpenId((current) => (current === column.id ? null : column.id))}
            >
              {column.title}
            </button>
            <div id={`footer-${column.id}`} className={`${styles.links} ${openId === column.id ? styles.linksOpen : ""}`}>
              {column.links.map((link) => (
                <p key={`${column.id}-${link.href}-${link.label}`}>
                  <Link href={link.href}>{link.label}</Link>
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className={styles.footerBottom}>
        © {SITE_NAME_EN}
        <span aria-hidden="true">｜</span>
        MAGIC-SNAIL CO.,LTD.
        <span aria-hidden="true">｜</span>
        <Link href="/privacy">隱私權</Link>
        <span aria-hidden="true">｜</span>
        <Link href="/terms">服務條款</Link>
      </p>
    </footer>
  );
}
