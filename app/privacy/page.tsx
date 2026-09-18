import type { Metadata } from "next";
import Link from "next/link";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "隱私說明",
  description:
    "Adult Ice Dance Hub 隱私說明：本站提供公開的成人冰舞資訊，並以不直接識別個人身分的方式了解網站使用情況及廣告成效。",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <header className="page-header">
        <p className="kicker">PRIVACY</p>
        <h1>隱私說明</h1>
        <p>
          本站提供公開的成人冰舞資訊。為了解網站使用情況及廣告成效，系統會以不直接識別個人身分的方式，記錄頁面瀏覽、廣告曝光、廣告點擊及裝置類別等基本資訊。
        </p>
      </header>
      <article className="prose">
        <h2>我們如何使用資料</h2>
        <p>
          本站不會透過廣告成效統計收集訪客的姓名、電話、電子郵件或完整IP位址。
        </p>
        <p>
          相關資料僅用於網站營運、內容改善、安全維護及廣告成效分析。
        </p>
        <p>
          系統可能使用隨機產生的匿名識別碼，避免同一瀏覽工作階段被重複計算。
        </p>
        <h2>廣告曝光與點擊</h2>
        <p>
          廣告進入畫面一半以上並停留約一秒後，系統會記錄一次曝光。點擊後會先記錄成效，再前往已登記的目的網址。
        </p>
        <h2>廣告合作洽詢</h2>
        <p>
          若你透過廣告合作表單留下聯絡資料，我們只會用來回覆該次合作需求。
        </p>
        <p>
          廣告版位與合作洽詢見 <Link href="/advertising#contact">廣告合作</Link>。
        </p>
      </article>
    </>
  );
}
