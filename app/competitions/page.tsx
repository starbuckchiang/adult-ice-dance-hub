import type { Metadata } from "next";
import { AdList } from "@/components/ads/AdList";
import { ContentWithSidebar } from "@/components/ads/ContentWithSidebar";
import { EmptyState } from "@/components/EmptyState";
import {
  LiveNowCard,
  ReplayEventCard,
  UpcomingCompetitionCard,
} from "@/components/watch/WatchCards";
import { getCompetition, getSource } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import { getReplayLibrary, groupCompetitionsForWatch } from "@/lib/videos";

export const metadata: Metadata = createPageMetadata({
  title: "比賽資訊",
  description:
    "成人冰舞比賽資訊與觀看入口：正在直播、即將舉行、最近結束與官方賽事錄影庫。只收錄已查證的官方直播與回放。",
  path: "/competitions",
});

export default function CompetitionsPage() {
  const { liveVideos, upcoming, recent, unscheduled } = groupCompetitionsForWatch();
  const library = getReplayLibrary();

  return (
    <>
      <header className="page-header">
        <p className="kicker">COMPETITIONS</p>
        <h1>比賽資訊</h1>
        <p>
          先看正在直播，再看即將舉行與官方錄影。這裡只列出官方公告可核對的賽名、日期與影片；雙人冰舞與單人冰舞會分開標示。
        </p>
      </header>
      <ContentWithSidebar>
        {liveVideos.length > 0 ? (
          <section className="section" id="live-now">
            <div className="section-head">
              <p className="kicker">LIVE NOW</p>
              <h2>正在直播</h2>
            </div>
            <div className="grid">
              {liveVideos.map((video) => (
                <LiveNowCard
                  key={video.id}
                  video={video}
                  competition={getCompetition(video.competitionSlug)}
                  source={getSource(video.sourceId)}
                />
              ))}
            </div>
          </section>
        ) : null}

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

        <section className="section" id="replay-library">
          <div className="section-head">
            <p className="kicker">REPLAY LIBRARY</p>
            <h2>賽事錄影庫</h2>
          </div>
          {library.length > 0 ? (
            library.map((group) => (
              <div key={group.year} className="year-block">
                <h3>{group.year}</h3>
                <div className="grid">
                  {group.competitions.map((competition) => (
                    <ReplayEventCard
                      key={competition.id}
                      competition={competition}
                      source={getSource(competition.sourceId)}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <EmptyState title="賽事錄影庫" text="官方回放會依年份整理於此。" />
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
