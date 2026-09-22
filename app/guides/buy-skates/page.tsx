import type { Metadata } from "next";
import Link from "next/link";
import { ContentWithSidebar } from "@/components/ads/ContentWithSidebar";
import { SkatePlanner } from "@/components/guides/SkatePlanner";
import { Breadcrumbs } from "@/components/nav/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, howToJsonLd } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "花式滑冰鞋網路採購指南",
  description: "從尺寸、寬度、庫存、運費、稅費到退換貨，逐步比較海外花式滑冰鞋的採購條件。",
  path: "/guides/buy-skates",
});

const crumbs = [
  { name: "首頁", path: "/" },
  { name: "學習中心", path: "/learn" },
  { name: "花式滑冰鞋網路採購指南", path: "/guides/buy-skates" },
];

const howToSteps = [
  {
    name: "確認自己需要什麼",
    text: "先記錄用途、程度、品牌與型號、尺寸、寬度、鞋色、是否含冰刀、特訂或預購、預計使用日期與預算。不同品牌尺寸不能只按一般鞋號換算。",
  },
  {
    name: "建立精準搜尋字串",
    text: "用第一步已填的用途、程度、品牌與型號、尺寸、寬度、鞋色、鞋靴／冰刀、現貨／特訂、預計使用日期與預算上限組成提問，再請 ChatGPT 搜尋最便宜的網站。運送條件可自行加上 ships to Taiwan 或 return policy。範例只示範搜尋方式，不是商品推薦。",
  },
  {
    name: "先判斷是否真的有貨",
    text: "付款前確認指定尺寸與寬度的庫存狀態，分辨 In stock、Available to order、Special order、Backorder、Pre-order 與 Estimated dispatch。",
  },
  {
    name: "比較到手總成本",
    text: "自行輸入價格、運費、折扣、VAT、關稅與海外交易費，用估算匯率比較商品折算金額與預估到手總價，並同時查看現貨與退換貨風險。",
  },
  {
    name: "檢查是否寄送台灣",
    text: "確認結帳頁能否選 Taiwan、運費顯示時機、運送追蹤、進口稅費與收件資料是否完整。",
  },
  {
    name: "付款前最後確認",
    text: "核對型號、尺寸、寬度、顏色、鞋靴與冰刀是否分售、現貨、出貨日、取消與退換貨條件、保固、手續費、地址與付款紀錄。",
  },
  {
    name: "收到商品後",
    text: "錄影開箱，核對鞋盒與鞋內標示，未確認合腳前不要磨刀或熱塑，並保留包裝與客服往來紀錄。",
  },
];

export default function BuySkatesGuidePage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd
        data={howToJsonLd({
          name: "花式滑冰鞋網路採購指南",
          description: "先確認需求、尺寸與總成本，再決定向哪個通路購買。",
          path: "/guides/buy-skates",
          steps: howToSteps,
        })}
      />
      <header className="page-header">
        <Breadcrumbs items={crumbs} />
        <p className="kicker">GUIDE</p>
        <h1>花式滑冰鞋網路採購指南</h1>
        <p>先確認需求、尺寸與總成本，再決定向哪個通路購買。</p>
        <p className="disclaimer">
          這是協助你自行比較與判斷的中立工具，不代表本站替任何商店或品牌背書，也不是鞋店推薦、排行榜或商品廣告。
        </p>
      </header>
      <ContentWithSidebar>
        <p className="disclaimer">
          本站提供採購流程與比較工具，不銷售滑冰鞋，也不代替專業 fitting。價格、庫存、匯率、運費、稅費與退換貨條件均以交易當下的商店及相關單位資訊為準。
        </p>
        <nav className="chip-row" aria-label="採購步驟">
          {["確認需求", "搜尋字串", "判斷有貨", "比較總成本", "寄送台灣", "付款確認", "到貨驗收"].map((label, index) => (
            <a key={label} className="text-chip" href={`#step-${index + 1}`}>
              {index + 1}. {label}
            </a>
          ))}
        </nav>

        <SkatePlanner />

        <div className="button-row">
          <Link className="button-secondary" href="/learn">
            返回學習中心
          </Link>
          <Link className="button-secondary" href="/community/coaches">
            尋找已審核教練
          </Link>
        </div>
      </ContentWithSidebar>
    </>
  );
}
