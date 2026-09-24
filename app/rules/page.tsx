import type { Metadata } from "next";
import Link from "next/link";
import { ContentWithSidebar } from "@/components/ads/ContentWithSidebar";
import { RuleCard } from "@/components/RecordCards";
import { getRules, getSource } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "規則中心",
  description:
    "成人冰舞規則中心：彙整 ISU 國際成人技術公告、美國、加拿大、瑞士官方規則入口，並標示日本成人專用規則的待查證狀態。",
  path: "/rules",
});

export default function RulesPage() {
  const rules = getRules();

  return (
    <>
      <header className="page-header">
        <p className="kicker">RULES</p>
        <h1>規則中心</h1>
        <p>
          規則以各國協會與 ISU 最新官方文件為準。本站提供入口與摘要，並將雙人冰舞與單人冰舞分開標示。
        </p>
      </header>
      <ContentWithSidebar>
        <article className="card-dark">
          <p className="kicker">TAIWAN 2026</p>
          <h2>國內賽事規程入口</h2>
          <p>2026 台灣成人花式滑冰與冰舞參賽指南整理協會及主辦單位已公布的規程與報名資料，不取代官方文件。</p>
          <Link className="button-secondary" href="/guides/taiwan-adult-competitions-2026">
            查看台灣成人參賽指南
          </Link>
        </article>
        <article className="card-dark">
          <p className="kicker">TAIWAN TESTING</p>
          <h2>台灣冰舞檢定</h2>
          <p>ISIAsia Ice Dance 1–10 為目前較明確的台灣成人路徑。有機會不代表已可直接報名。</p>
          <Link className="button-secondary" href="/guides/ice-dance-tests-in-taiwan">
            查看冰舞檢定指南
          </Link>
        </article>
        <div className="grid">
          {rules.map((rule) => (
            <RuleCard key={rule.id} rule={rule} source={getSource(rule.sourceId)} />
          ))}
        </div>
      </ContentWithSidebar>
    </>
  );
}
