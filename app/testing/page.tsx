import type { Metadata } from "next";
import Link from "next/link";
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
        <article className="card-dark">
          <p className="kicker">TAIWAN</p>
          <h2>台灣冰舞檢定路徑</h2>
          <p>ISIAsia Ice Dance 1–10 是目前較明確的台灣成人路徑。有機會不代表已可直接報名；錄影送件也不能跳過會籍與承辦機構。</p>
          <div className="button-row">
            <Link className="button-secondary" href="/guides/ice-dance-tests-in-taiwan">
              台灣冰舞檢定
            </Link>
            <Link className="button-secondary" href="/guides/ice-dance-video-tests-from-taiwan">
              錄影檢定
            </Link>
          </div>
        </article>
        <TestingSwitcher programs={getTestingPrograms()} />
      </ContentWithSidebar>
    </>
  );
}
