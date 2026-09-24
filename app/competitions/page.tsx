import type { Metadata } from "next";
import Link from "next/link";
import { AdList } from "@/components/ads/AdList";
import { ContentWithSidebar } from "@/components/ads/ContentWithSidebar";
import { EmptyState } from "@/components/EmptyState";
import { ReplayEventCard, UpcomingCompetitionCard } from "@/components/watch/WatchCards";
import { getSource } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import { groupCompetitionsForWatch } from "@/lib/videos";

export const metadata: Metadata = createPageMetadata({
  title: "比賽資訊",
  description:
    "成人冰舞比賽資訊與觀看入口：正在直播、即將舉行、最近結束與官方賽事錄影庫。只收錄已查證的官方直播與回放。",
  path: "/competitions",
});

export default function CompetitionsPage() {
  const { upcoming, recent, unscheduled } = groupCompetitionsForWatch();

  return (
    <>
      <header className="page-header" id="start">
        <p className="kicker">COMPETITIONS</p>
        <h1>比賽資訊</h1>
        <p>
          先看正在直播，再看即將舉行與官方錄影。這裡只列出官方公告可核對的賽名、日期與影片；雙人冰舞與單人冰舞會分開標示。
        </p>
      </header>
      <ContentWithSidebar>
        <section className="section">
          <article className="card-dark">
            <p className="kicker">TAIWAN 2026</p>
            <h2>2026 台灣成人參賽指南</h2>
            <p>
              國內花式滑冰與冰舞賽事、成人組資格、報名期限與備賽工具另見專頁。美國成人賽與其他國際賽資訊仍整理於本頁。
            </p>
            <Link className="button" href="/guides/taiwan-adult-competitions-2026">
              進入台灣成人參賽指南
            </Link>
          </article>
        </section>
        <section className="section" id="live-now">
          <article className="card-dark">
            <p className="kicker">WATCH</p>
            <h2>影音直播</h2>
            <p>現正直播、即將直播與最新重播集中在影音頁，這裡只保留賽事資訊。</p>
            <Link className="button" href="/watch">
              前往影音直播
            </Link>
          </article>
          <span id="replay-library" />
        </section>

        <section className="section" id="upcoming">
          <div className="section-head">
            <p className="kicker">UPCOMING</p>
            <h2>即將舉行</h2>
          </div>
          {upcoming.length > 0 ? (
            <AdList className="list">
              {upcoming.map((competition) => (
                <UpcomingCompetitionCard
                  key={competition.id}
                  competition={competition}
                  source={getSource(competition.sourceId)}
                />
              ))}
            </AdList>
          ) : (
            <EmptyState title="目前沒有即將舉行的賽事" text="已核對的賽事會顯示在這裡。進行中的比賽會標示進行中。" />
          )}
        </section>

        <section className="section" id="recent">
          <div className="section-head">
            <p className="kicker">RECENTLY FINISHED</p>
            <h2>最近結束</h2>
          </div>
          {recent.length > 0 ? (
            <div className="grid">
              {recent.map((competition) => (
                <ReplayEventCard
                  key={competition.id}
                  competition={competition}
                  source={getSource(competition.sourceId)}
                />
              ))}
            </div>
          ) : (
            <EmptyState title="最近結束的賽事" text="已結束的賽事會整理在這裡。" />
          )}
        </section>

        {unscheduled.length > 0 ? (
          <section className="section">
            <div className="section-head">
              <p className="kicker">TO VERIFY</p>
              <h2>賽期待查證</h2>
            </div>
            <div className="grid">
              {unscheduled.map((competition) => (
                <UpcomingCompetitionCard
                  key={competition.id}
                  competition={competition}
                  source={getSource(competition.sourceId)}
                />
              ))}
            </div>
          </section>
        ) : null}
      </ContentWithSidebar>
    </>
  );
}
