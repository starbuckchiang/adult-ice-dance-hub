import type { Metadata } from "next";
import Link from "next/link";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "隱私說明",
  description:
    "Adult Ice Dance Hub 隱私說明：第一版不登入、不保存完整 IP，廣告事件只使用匿名工作階段雜湊做基本去重。",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <header className="page-header">
        <p className="kicker">PRIVACY</p>
        <h1>隱私說明</h1>
        <p>
          本頁是第一版預留的隱私說明入口。網站內容為公開資訊；廣告追蹤只記錄匿名工作階段雜湊與裝置類別。
        </p>
      </header>
      <article className="prose">
        <h2>我們不收集什麼</h2>
        <ul>
          <li>不保存完整 IP 地址。</li>
          <li>不保存使用者姓名、Email 或其他不必要個資。</li>
          <li>第一版沒有登入，因此也沒有會員資料。</li>
        </ul>
        <h2>廣告事件</h2>
        <p>
          若 Banner 進入可視範圍 50% 以上並持續至少 1 秒，站內 API 可能記錄一次曝光。點擊會先寫入追蹤事件，再前往已登記的目的網址。匿名識別只用於同一工作階段的去重與基本成效統計。
        </p>
        <p>
          目前追蹤預設為 mock 模式，事件可能只存在本機或伺服器記憶體，不能當作正式營運報表。
        </p>
        <p>
          廣告版位說明見 <Link href="/advertising">廣告說明</Link>。
        </p>
      </article>
    </>
  );
}
