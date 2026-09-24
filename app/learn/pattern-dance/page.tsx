import type { Metadata } from "next";
import { AdList } from "@/components/ads/AdList";
import { ContentWithSidebar } from "@/components/ads/ContentWithSidebar";
import { DanceTypeBadge } from "@/components/DanceTypeBadge";
import { ExternalLink } from "@/components/ExternalLink";
import { IceRinkSchematic } from "@/components/learn/IceRinkSchematic";
import { Breadcrumbs } from "@/components/nav/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { SourceMeta } from "@/components/SourceMeta";
import { StatusBadge } from "@/components/StatusBadge";
import { getSource } from "@/lib/content";
import { getPatternDances } from "@/lib/learn";
import { createPageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Pattern Dance 導覽",
  description: "已查證的 2026–27 成人 Pattern Dance 導覽：節奏、拍號、程度與官方規則連結。不含未核對步序圖。",
  path: "/learn/pattern-dance",
});

const crumbs = [
  { name: "首頁", path: "/" },
  { name: "學習中心", path: "/learn" },
  { name: "Pattern Dance", path: "/learn/pattern-dance" },
];

export default function PatternDancePage() {
  const dances = getPatternDances();

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <header className="page-header">
        <Breadcrumbs items={crumbs} />
        <p className="kicker">PATTERN DANCE</p>
        <h1>Pattern Dance</h1>
        <p>
          只公開已核對的 2026–27 國際成人賽與加拿大成人比賽資料。
        </p>
        <IceRinkSchematic label="本站原創冰場示意：長軸、短軸與練習方向。非正式 Pattern 步序。" />
      </header>
      <ContentWithSidebar>
        <AdList className="stack">
          {dances.map((dance) => (
            <article key={dance.id} className="card-dark learn-card">
              <div className="badge-row">
                <DanceTypeBadge type={dance.danceType} />
                <StatusBadge status={dance.status} />
                <span className="badge badge-phase">{dance.season}</span>
              </div>
              <h2>
                {dance.isuNumber ? `${dance.isuNumber} ` : ""}
                {dance.nameZh}
                <span className="muted"> {dance.nameEn}</span>
              </h2>
              <p>節奏：{dance.rhythm}</p>
              <p>拍號：{dance.timeSignature}</p>
              <p>建議程度：{dance.suggestedLevel}</p>
              <h3>Pattern 概述</h3>
              <p>{dance.overview}</p>
              <h3>關鍵步伐</h3>
              <ul>
                {dance.keySteps.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p>示範影片：{dance.demoVideoUrl ? "見官方連結" : "尚無本站核可的官方示範嵌入，請以規則文件為準。"}</p>
              <SourceMeta source={getSource(dance.sourceId)} lastVerified={dance.lastVerified} />
              <ExternalLink className="button-secondary" href={dance.officialRuleUrl}>
                官方規則連結
              </ExternalLink>
            </article>
          ))}
        </AdList>
      </ContentWithSidebar>
    </>
  );
}
