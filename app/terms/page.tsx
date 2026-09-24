import type { Metadata } from "next";
import Link from "next/link";
import { createPageMetadata } from "@/lib/metadata";
import { SITE_NAME_EN, SITE_NAME_ZH } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "服務條款",
  description: "Adult Ice Dance Hub 服務條款：本站提供公開的成人冰舞資訊整理，正式規定以官方來源為準。",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <header className="page-header">
        <p className="kicker">TERMS</p>
        <h1>服務條款</h1>
        <p>
          {SITE_NAME_EN}（{SITE_NAME_ZH}）提供公開資訊整理，協助成人舞者查找學習、裝備、賽事、檢定與官方來源。
        </p>
      </header>
      <article className="prose">
        <h2>資訊性質</h2>
        <p>
          站上指南、時程與資格整理不能取代協會公告、報名系統或現場教練判斷。參賽、檢定與旅行前，請以主辦單位及官方文件的最新版本為準。
        </p>
        <h2>使用方式</h2>
        <p>
          可免費瀏覽公開頁面。透過表單或刊登申請提供的聯絡資料，只用於回覆該次洽詢，不另作其他用途。
        </p>
        <p>
          個人資料的處理方式見<Link href="/privacy">隱私權說明</Link>。
        </p>
      </article>
    </>
  );
}
