import type { Metadata } from "next";
import { ContentWithSidebar } from "@/components/ads/ContentWithSidebar";
import { Breadcrumbs } from "@/components/nav/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { TestingSwitcher } from "@/components/testing/TestingSwitcher";
import { getTestingPrograms } from "@/lib/learn";
import { createPageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "成人檢定路線",
  description: "美國、日本、加拿大、瑞士、義大利、澳洲與 ISU 國際成人賽的成人冰舞測驗或比賽資格入口。ISU 不是全球統一檢定。",
  path: "/testing",
});

const crumbs = [
  { name: "首頁", path: "/" },
  { name: "學習中心", path: "/learn" },
  { name: "成人檢定路線", path: "/testing" },
];

export default function TestingPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <header className="page-header">
        <Breadcrumbs items={crumbs} />
        <p className="kicker">TESTING</p>
        <h1>成人檢定路線</h1>
        <p>
          各國測驗由各國協會管理。ISU 國際成人賽只描述比賽資格與技術文件，不是全球統一檢定制度。
        </p>
      </header>
      <ContentWithSidebar>
        <TestingSwitcher programs={getTestingPrograms()} />
      </ContentWithSidebar>
    </>
  );
}
