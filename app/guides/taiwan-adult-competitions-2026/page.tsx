import type { Metadata } from "next";
import { TaiwanGuideFlow } from "@/components/guides/TaiwanGuideFlow";
import { Breadcrumbs } from "@/components/nav/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { TAIWAN_GUIDE_PATH } from "@/lib/guides/taiwan-competitions-2026";
import { createPageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "2026台灣成人花式滑冰參賽指南｜資格確認與參賽路線",
  description: "先確認可報名組別、檢定與教練簽署，再整理準備狀態，產生可與教練討論的第一份參賽路線卡。",
  path: TAIWAN_GUIDE_PATH,
});

const crumbs = [
  { name: "首頁", path: "/" },
  { name: "學習中心", path: "/learn" },
  { name: "2026台灣成人花式滑冰參賽指南", path: TAIWAN_GUIDE_PATH },
];

export default function TaiwanAdultCompetitions2026Page() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <header className="page-header">
        <Breadcrumbs items={crumbs} />
      </header>
      <TaiwanGuideFlow />
    </>
  );
}
