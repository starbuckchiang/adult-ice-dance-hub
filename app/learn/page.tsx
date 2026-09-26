import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/ads/AdSlot";
import { ContentWithSidebar } from "@/components/ads/ContentWithSidebar";
import { Breadcrumbs } from "@/components/nav/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "學習中心",
  description: "成人冰舞學習中心：基礎步伐、Pattern Dance、成人檢定路線與音樂編舞入口。教學不能取代現場教練。",
  path: "/learn",
});

const crumbs = [
  { name: "首頁", path: "/" },
  { name: "學習中心", path: "/learn" },
];

const entries = [
  { href: "/learn/steps", kicker: "STEPS", title: "冰舞基礎步伐", text: "內外刃、交叉步、三字轉、Mohawk、Choctaw 與 Twizzle 入門。" },
  { href: "/learn/pattern-dance", kicker: "PATTERN DANCE", title: "Pattern Dance", text: "只列出已查證的 2026–27 成人規定舞導覽，不含未核對步序圖。" },
  { href: "/testing", kicker: "TESTING", title: "成人檢定路線", text: "六國協會與 ISU 國際成人賽資格入口，不把 ISU 寫成全球統一檢定。" },
  { href: "/music", kicker: "MUSIC", title: "音樂與編舞", text: "Rhythm Dance 與自由舞選曲原則、檢查表與合法音樂來源。" },
  { href: "/guides/buy-skates", kicker: "GUIDE", title: "花式滑冰鞋網路採購指南", text: "先確認尺寸與寬度，再比較庫存、運費、稅費與退換貨。中立工具，不替商店背書。" },
  { href: "/guides/taiwan-adult-competitions-2026", kicker: "TAIWAN 2026", title: "2026 台灣成人參賽指南", text: "查詢2026國內花式滑冰與冰舞賽事、成人組資格、報名期限、備賽計畫與參賽支援。" },
  { href: "/guides/asia-artistic-skating-2027", kicker: "ASIA 2027", title: "2027 亞洲藝術類成人賽規劃", text: "從表演方向整理香港 CPIR 或深圳 Skate Asia 的第一份參賽路線，不代表已可報名。" },
  { href: "/guides/ice-dance-tests-in-taiwan", kicker: "ISIAsia", title: "在台灣參加冰舞檢定", text: "有機會，但須透過有效行政會員冰場、合格專業會員與個人會籍，並依序參加 Ice Dance 1–10。" },
  { href: "/guides/ice-dance-video-tests-from-taiwan", kicker: "VIDEO TEST", title: "從台灣送件錄影檢定", text: "部分級別可能接受錄影審查，但不能自行上傳影片就取得結果。先確認會籍、承辦機構與送件資格。" },
];

export default function LearnPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <header className="page-header">
        <Breadcrumbs items={crumbs} />
        <p className="kicker">LEARN</p>
        <h1>學習中心</h1>
        <p>
          這裡整理成人冰舞可公開核對的學習入口。網站教學是輔助資料，不能取代現場教練、保護與個別糾正。
        </p>
      </header>
      <ContentWithSidebar>
        <div className="grid grid-2">
          {entries.map((item) => (
            <article key={item.href} className="card-dark">
              <p className="kicker">{item.kicker}</p>
              <h2>{item.title}</h2>
              <p>{item.text}</p>
              <Link className="button" href={item.href}>
                進入
              </Link>
            </article>
          ))}
        </div>
      </ContentWithSidebar>
      <div className="band band-ad">
        <div className="container">
          <AdSlot placementCode="HOME_INLINE" />
        </div>
      </div>
    </>
  );
}
