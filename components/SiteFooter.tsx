import Link from "next/link";
import { getCountries } from "@/lib/content";
import { SITE_NAME_EN, SITE_NAME_ZH } from "@/lib/site";

export function SiteFooter() {
  const countries = getCountries();

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <strong>{SITE_NAME_EN}</strong>
          <span>{SITE_NAME_ZH}</span>
          <p className="muted">
            成人冰舞資訊入口：整理俱樂部名錄、賽事公告與規則來源，雙人冰舞與單人冰舞分開標示。
          </p>
        </div>
        <div className="footer-col">
          <h2>國家入口</h2>
          <p>
            <Link href="/countries">國家總覽</Link>
          </p>
          {countries.map((country) => (
            <p key={country.slug}>
              <Link href={`/countries/${country.slug}`}>{country.nameZh}</Link>
            </p>
          ))}
        </div>
        <div className="footer-col">
          <h2>資料</h2>
          <p>
            <Link href="/learn">學習中心</Link>
          </p>
          <p>
            <Link href="/guides/buy-skates">滑冰鞋採購指南</Link>
          </p>
          <p>
            <Link href="/guides/taiwan-adult-competitions-2026">2026台灣成人參賽指南</Link>
          </p>
          <p>
            <Link href="/guides/ice-dance-tests-in-taiwan">台灣冰舞檢定</Link>
          </p>
          <p>
            <Link href="/guides/ice-dance-video-tests-from-taiwan">錄影檢定</Link>
          </p>
          <p>
            <Link href="/testing">成人檢定</Link>
          </p>
          <p>
            <Link href="/music">音樂與編舞</Link>
          </p>
          <p>
            <Link href="/community">交流</Link>
          </p>
          <p>
            <Link href="/competitions">比賽資訊</Link>
          </p>
          <p>
            <Link href="/rules">規則中心</Link>
          </p>
          <p>
            <Link href="/clubs">俱樂部</Link>
          </p>
        </div>
        <div className="footer-col">
          <h2>本站</h2>
          <p>
            <Link href="/about">關於本站</Link>
          </p>
          <p>
            <Link href="/advertising#contact">廣告合作</Link>
          </p>
          <p>
            <Link href="/privacy">隱私說明</Link>
          </p>
        </div>
        <p className="footer-note">
          <Link href="/about#data-policy">資料來源與更新政策</Link>
        </p>
      </div>
    </footer>
  );
}
