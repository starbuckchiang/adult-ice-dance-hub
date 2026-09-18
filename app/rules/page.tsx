import type { Metadata } from "next";
import { ContentWithSidebar } from "@/components/ads/ContentWithSidebar";
import { RuleCard } from "@/components/RecordCards";
import { UpdateNotice } from "@/components/UpdateNotice";
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
          規則以各國協會與 ISU 最新官方文件為準。本站提供入口與摘要，不取代正式規則全文，也不把雙人冰舞與單人冰舞規則混為一談。
        </p>
      </header>
      <UpdateNotice />
      <ContentWithSidebar>
        <div className="grid">
          {rules.map((rule) => (
            <RuleCard key={rule.id} rule={rule} source={getSource(rule.sourceId)} />
          ))}
        </div>
      </ContentWithSidebar>
    </>
  );
}
