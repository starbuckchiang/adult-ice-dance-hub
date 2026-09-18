import type { Metadata } from "next";
import { AdList } from "@/components/ads/AdList";
import { ContentWithSidebar } from "@/components/ads/ContentWithSidebar";
import { Breadcrumbs } from "@/components/nav/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { SourceMeta } from "@/components/SourceMeta";
import { StatusBadge } from "@/components/StatusBadge";
import { getSource } from "@/lib/content";
import { getLearnSteps } from "@/lib/learn";
import { createPageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "冰舞基礎步伐",
  description: "成人冰舞基礎步伐：內外刃、交叉步、三字轉、Mohawk、Choctaw 與 Twizzle。不能取代現場教練。",
  path: "/learn/steps",
});

const crumbs = [
  { name: "首頁", path: "/" },
  { name: "學習中心", path: "/learn" },
  { name: "基礎步伐", path: "/learn/steps" },
];

export default function LearnStepsPage() {
  const steps = getLearnSteps();

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <header className="page-header">
        <Breadcrumbs items={crumbs} />
        <p className="kicker">STEPS</p>
        <h1>冰舞基礎步伐</h1>
        <p className="disclaimer">本站教學是公開輔助資料，不能取代現場教練、保護與個別課表。</p>
      </header>
      <ContentWithSidebar>
        <AdList className="stack">
          {steps.map((step) => (
            <article key={step.id} className="card-dark learn-card" id={step.slug}>
              <div className="badge-row">
                <StatusBadge status={step.status} />
                <span className="badge badge-phase">{step.season}</span>
              </div>
              <h2>
                {step.nameZh}
                <span className="muted"> {step.nameEn}</span>
              </h2>
              <p>{step.purpose}</p>
              <p>進入刃：{step.entryEdge}</p>
              <p>離開刃：{step.exitEdge}</p>
              <h3>練習前置能力</h3>
              <ul>
                {step.prerequisites.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <h3>分解步驟</h3>
              <ol>
                {step.breakdown.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
              <h3>常見錯誤</h3>
              <ul>
                {step.commonErrors.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <h3>安全提醒</h3>
              <ul>
                {step.safetyNotes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <SourceMeta source={getSource(step.sourceId)} lastVerified={step.lastVerified} />
            </article>
          ))}
        </AdList>
      </ContentWithSidebar>
    </>
  );
}
