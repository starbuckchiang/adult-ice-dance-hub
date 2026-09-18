import type { Metadata } from "next";
import { ContentWithSidebar } from "@/components/ads/ContentWithSidebar";
import { PartnerBoard } from "@/components/community/PartnerBoard";
import { Breadcrumbs } from "@/components/nav/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPublishedPartners } from "@/lib/learn";
import { createPageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "尋找舞伴",
  description: "成人冰舞舞伴刊登與篩選。未審核資料不公開，聯絡改為提出聯絡請求。",
  path: "/community/partners",
});

const crumbs = [
  { name: "首頁", path: "/" },
  { name: "交流", path: "/community" },
  { name: "尋找舞伴", path: "/community/partners" },
];

export default function PartnersPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <header className="page-header">
        <Breadcrumbs items={crumbs} />
        <p className="kicker">PARTNERS</p>
        <h1>尋找舞伴</h1>
        <p>可依國家、冰舞類型與線上／實體篩選。通過審核的卡片才顯示；聯絡請走站內申請，不公開私人聯絡方式。</p>
      </header>
      <ContentWithSidebar>
        <PartnerBoard listings={getPublishedPartners()} />
      </ContentWithSidebar>
    </>
  );
}
