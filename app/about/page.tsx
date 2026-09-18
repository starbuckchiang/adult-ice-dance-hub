import type { Metadata } from "next";
import Link from "next/link";
import { createPageMetadata } from "@/lib/metadata";
import { SITE_NAME_EN, SITE_NAME_ZH } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "關於本站",
  description:
    "了解 Adult Ice Dance Hub 成人冰舞資訊站的定位、資料原則與第一版範圍：只收錄可追溯來源的公開資訊。",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <header className="page-header">
        <p className="kicker">ABOUT</p>
        <h1>關於本站</h1>
        <p>
          {SITE_NAME_EN}（{SITE_NAME_ZH}）是成人冰舞的公開資訊入口，主語言為繁體中文，並保留官方英文名稱。
        </p>
      </header>
      <article className="prose">
        <h2>本站做什麼</h2>
        <p>
          第一版協助成人舞者、教練與關心這項運動的人，快速找到美國、日本、加拿大與瑞士的官方協會、俱樂部名錄、比賽公告與規則文件。網站分開標示成人雙人冰舞（Partnered Ice Dance）與成人單人冰舞（Adult Solo Dance）。
        </p>
        <h2>本站不做什麼</h2>
        <ul>
          <li>不提供登入、會員或管理後台。</li>
          <li>網站內容使用本機 JSON；廣告追蹤預設為 mock，尚未接上獨立資料庫或付款功能。</li>
          <li>不編造俱樂部、教練、舞者、聯絡方式、賽程或比賽結果。</li>
          <li>不宣稱某一俱樂部或國家參與人數最多。</li>
        </ul>
        <h2 id="data-policy">資料來源與查證原則</h2>
        <p>
          本站優先收錄可追溯的官方協會、賽事與俱樂部資料。尚未取得足夠來源的項目會標示為待查證；歷史規則則會注明適用賽季，避免與現行規則混淆。
        </p>
        <h2>廣告與追蹤</h2>
        <p>
          第一版已預留廣告版位，但尚未承接真實廣告主。畫面上的 Banner 是中性「廣告示意版位」。曝光與點擊 API 預設為 mock 模式，不能當作正式成效數據。詳見{" "}
          <Link href="/advertising">廣告說明</Link> 與 <Link href="/privacy">隱私說明</Link>。
        </p>
        <h2>部署說明</h2>
        <p>
          本站以 Next.js App Router 與本機 JSON 資料建置，可部署至 Vercel。正式網址請在部署時設定{" "}
          <code>NEXT_PUBLIC_SITE_URL</code>，以便 sitemap、robots 與 Open Graph 使用正確網域。
        </p>
      </article>
    </>
  );
}
