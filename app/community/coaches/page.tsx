import type { Metadata } from "next";
import Link from "next/link";
import { ContentWithSidebar } from "@/components/ads/ContentWithSidebar";
import { DanceTypeBadge } from "@/components/DanceTypeBadge";
import { EmptyState } from "@/components/EmptyState";
import { ExternalLink } from "@/components/ExternalLink";
import { Breadcrumbs } from "@/components/nav/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { SourceMeta } from "@/components/SourceMeta";
import { getSource } from "@/lib/content";
import { getPublishedCoaches } from "@/lib/learn";
import { createPageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "尋找教練",
  description: "成人冰舞教練公開名錄。未取得本人同意不建立人物介紹或複製照片。",
  path: "/community/coaches",
});

const crumbs = [
  { name: "首頁", path: "/" },
  { name: "交流", path: "/community" },
  { name: "尋找教練", path: "/community/coaches" },
];

export default function CoachesPage() {
  const coaches = getPublishedCoaches();

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <header className="page-header">
        <Breadcrumbs items={crumbs} />
        <p className="kicker">COACHES</p>
        <h1>尋找教練</h1>
        <p>只刊登本人同意、可核對公開來源的教練資料。沒有同意書就不建立人物介紹，也不複製照片。</p>
      </header>
      <ContentWithSidebar>
        {coaches.length === 0 ? (
          <EmptyState
            title="目前沒有已同意刊登的教練"
            text="請先申請刊登。審核通過前，本站不會公開任何教練個人介紹。"
          />
        ) : (
          <div className="grid">
            {coaches.map((coach) => (
              <article key={coach.id} className="card-dark">
                <div className="badge-row">
                  <DanceTypeBadge type={coach.danceType} />
                  <span className="badge badge-phase">{coach.meetingType === "both" ? "線上／實體" : coach.meetingType === "online" ? "線上" : "實體"}</span>
                </div>
                <h2>{coach.name}</h2>
                <p>
                  {coach.city}｜{coach.languages.join("、")}
                </p>
                <p>專長：{coach.specialties.join("、")}</p>
                <p>成人教學經驗：{coach.adultExperience}</p>
                <p>本人同意狀態：已確認同意刊登</p>
                <SourceMeta source={getSource(coach.sourceId)} lastVerified={coach.lastVerified} />
                <div className="button-row">
                  <ExternalLink className="button-secondary" href={coach.publicWebsite}>
                    官方網站
                  </ExternalLink>
                  <ExternalLink className="button-secondary" href={coach.publicContactPage}>
                    公開聯絡頁
                  </ExternalLink>
                </div>
              </article>
            ))}
          </div>
        )}
        <div className="button-row">
          <Link className="button" href="/submit-listing">
            申請刊登教練
          </Link>
        </div>
      </ContentWithSidebar>
    </>
  );
}
