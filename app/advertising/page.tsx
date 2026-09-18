import type { Metadata } from "next";
import Link from "next/link";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "廣告說明",
  description:
    "Adult Ice Dance Hub 廣告示意版位說明。第一版僅提供中性 Demo Banner 與追蹤介面，尚未承接真實廣告主。",
  path: "/advertising",
});

export default function AdvertisingPage() {
  return (
    <>
      <header className="page-header">
        <p className="kicker">ADVERTISING</p>
        <h1>廣告說明</h1>
        <p>
          本站預留廣告版位與成效追蹤介面，方便日後投放。目前沒有真實廣告主，畫面上的 Banner 都是標示清楚的「廣告示意版位」。
        </p>
      </header>
      <article className="prose">
        <h2>目前狀態</h2>
        <ul>
          <li>內容網站可公開部署；廣告設定使用本機 JSON。</li>
          <li>曝光與點擊 API 已建立，但預設為 mock 模式，不代表正式成效數據。</li>
          <li>尚未串接獨立的 Supabase 專案，也沒有廣告主登入或線上付款。</li>
        </ul>
        <h2>標示原則</h2>
        <ul>
          <li>每個 Banner 都會顯示「廣告 / Sponsored」。</li>
          <li>廣告與編輯內容分開，不會偽裝成導覽按鈕。</li>
          <li>沒有自動播放音效、閃爍或跳出式廣告。</li>
          <li>沒有廣告時，版位會自動收合。</li>
        </ul>
        <p>
          隱私處理方式見 <Link href="/privacy">隱私說明</Link>。
        </p>
      </article>
    </>
  );
}
