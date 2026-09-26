import type { Metadata } from "next";
import { AsiaArtisticRoute } from "@/components/guides/AsiaArtisticRoute.legacy";
import { Breadcrumbs } from "@/components/nav/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ASIA_FAQS, ASIA_GUIDE_PATH } from "@/lib/guides/asia-artistic-2027";
import { createPageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, faqJsonLd, howToJsonLd } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "2027 亞洲藝術類成人滑冰賽規劃｜香港、深圳與 ISIAsia 參賽路線",
  description:
    "從台灣規劃參加2027年香港或深圳ISIAsia成人滑冰賽：選擇Artistic Solo、Solo Spotlight或雙人表演方向，確認ISI級別、代表冰場與報名準備。",
  path: ASIA_GUIDE_PATH,
});

const crumbs = [
  { name: "首頁", path: "/" },
  { name: "參賽與檢定", path: "/competitions" },
  { name: "2027 亞洲藝術類成人賽規劃", path: ASIA_GUIDE_PATH },
];

export default function AsiaArtisticSkating2027Page() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd
        data={howToJsonLd({
          name: "規劃 2027 亞洲藝術類成人滑冰賽路線",
          description: "從表演方向、候選賽事與資格閘門，整理成可交給教練或冰場確認的第一份參賽路線卡。",
          path: ASIA_GUIDE_PATH,
          steps: [
            { name: "選擇表演方向", text: "在音樂與滑行、角色與故事、雙人演出中選最接近的方向，取得優先研究項目。" },
            { name: "比較候選賽事", text: "對照香港 CPIR 與深圳 Skate Asia 的日期狀態，再決定要加入哪一場路線。" },
            { name: "通過資格閘門", text: "逐項標記項目、ISI 級別、代表單位、動作限制與報名期限，不把勾選當成正式資格。" },
            { name: "產生第一份參賽路線卡", text: "查看路線摘要、本週三件事，以及一項下一步支援。" },
            { name: "預覽或列印", text: "用整頁預覽或瀏覽器列印另存 PDF，交給教練、冰場或主辦單位確認。" },
          ],
        })}
      />
      <JsonLd data={faqJsonLd(ASIA_FAQS)} />
      <header className="page-header">
        <Breadcrumbs items={crumbs} />
      </header>
      <AsiaArtisticRoute />
    </>
  );
}
