import Link from "next/link";
import { SITE_NAME_EN, SITE_NAME_ZH } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <p>
          {SITE_NAME_EN} {SITE_NAME_ZH}｜第一版僅提供公開資訊入口，不含登入、後台或付款功能。
        </p>
        <p>
          正式資訊均附官方來源與最後查證日期。尚未核對的內容會標示「待查證」，本站不編造俱樂部、教練、賽程或比賽結果。
        </p>
        <p>
          <Link href="/about">關於本站</Link>
          {" · "}
          <Link href="/rules">規則中心</Link>
          {" · "}
          <Link href="/competitions">比賽資訊</Link>
          {" · "}
          <Link href="/advertising">廣告說明</Link>
          {" · "}
          <Link href="/privacy">隱私說明</Link>
        </p>
      </div>
    </footer>
  );
}
