import type { Metadata } from "next";
import { AdList } from "@/components/ads/AdList";
import { ContentWithSidebar } from "@/components/ads/ContentWithSidebar";
import { CompetitionCard } from "@/components/RecordCards";
import { UpdateNotice } from "@/components/UpdateNotice";
import { getCompetitions, getSource } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "比賽資訊",
  description:
    "成人冰舞比賽資訊：收錄已核對的美國成人錦標賽與 ISU 支持的國際成人賽，並標示尚未查證的日本與瑞士賽曆。",
  path: "/competitions",
});

export default function CompetitionsPage() {
  const competitions = getCompetitions();

  return (
    <>
      <header className="page-header">
        <p className="kicker">COMPETITIONS</p>
        <h1>比賽資訊</h1>
        <p>
          這裡只列出官方公告可核對的賽名、日期與地點。雙人冰舞與單人冰舞會分開標示；本站不刊登比賽結果，也不補寫尚未公布的成績。
        </p>
      </header>
      <UpdateNotice />
      <ContentWithSidebar>
        <AdList>
          {competitions.map((competition) => (
            <CompetitionCard
              key={competition.id}
              competition={competition}
              source={getSource(competition.sourceId)}
            />
          ))}
        </AdList>
      </ContentWithSidebar>
    </>
  );
}
