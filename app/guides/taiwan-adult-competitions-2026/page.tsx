import type { Metadata } from "next";
import Link from "next/link";
import { ContentWithSidebar } from "@/components/ads/ContentWithSidebar";
import { TaiwanCompetitionHub } from "@/components/guides/TaiwanCompetitionHub";
import { Breadcrumbs } from "@/components/nav/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  FAQ_ITEMS,
  TAIWAN_GUIDE_PATH,
  getTaiwanCompetitions2026,
} from "@/lib/guides/taiwan-competitions-2026";
import { createPageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, faqJsonLd, itemListJsonLd, sportsEventJsonLd } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "2026台灣成人花式滑冰參賽指南｜賽事、報名與備賽服務",
  description:
    "整理2026年台灣成人花式滑冰與冰舞賽事，協助新手查詢資格、組別、報名期限、備賽計畫、參賽預算與現場支援。",
  path: TAIWAN_GUIDE_PATH,
});

const crumbs = [
  { name: "首頁", path: "/" },
  { name: "學習中心", path: "/learn" },
  { name: "2026台灣成人花式滑冰參賽指南", path: TAIWAN_GUIDE_PATH },
];

export default function TaiwanAdultCompetitions2026Page() {
  const competitions = getTaiwanCompetitions2026();
  const datedEvents = competitions.filter(
    (item) => item.startDate && (item.officialNoticeUrl || item.rulesUrl) && (item.venue || item.city),
  );

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={faqJsonLd(FAQ_ITEMS)} />
      <JsonLd
        data={itemListJsonLd({
          name: "2026台灣國內花式滑冰賽事",
          description: "已查證的2026年台灣國內花式滑冰冰上賽事，供成人選手核對資格與官方來源。",
          path: TAIWAN_GUIDE_PATH,
          items: competitions.map((item) => ({
            name: item.nameZh,
            url: item.officialNoticeUrl || item.rulesUrl,
            path: `${TAIWAN_GUIDE_PATH}#${item.id}`,
          })),
        })}
      />
      {datedEvents.map((item) => (
        <JsonLd
          key={item.id}
          data={sportsEventJsonLd({
            name: item.nameEn ? `${item.nameZh} ${item.nameEn}` : item.nameZh,
            startDate: item.startDate as string,
            endDate: item.endDate,
            locationName: item.venue || item.city || "台灣",
            city: item.city,
            url: item.officialNoticeUrl || item.rulesUrl || `${TAIWAN_GUIDE_PATH}#${item.id}`,
            organizer: item.organizer,
          })}
        />
      ))}
      <header className="page-header">
        <Breadcrumbs items={crumbs} />
        <p className="disclaimer">
          台灣成人花式滑冰比賽、台灣成人冰舞比賽、中正盃花式滑冰、全國花式滑冰錦標賽、成人滑冰參賽、花式滑冰比賽報名、成人冰舞參賽服務與2026滑冰比賽資料，均以官方規程與協會公告為準。中正盃全國溜冰錦標賽屬滑輪溜冰賽事，不列入本頁冰上賽事表。
        </p>
        <p>
          延伸閱讀：
          <Link href="/competitions">比賽資訊</Link>、
          <Link href="/countries">國家入口</Link>、
          <Link href="/rules">規則中心</Link>、
          <Link href="/advertising#contact">參賽服務與品牌合作</Link>。
        </p>
      </header>
      <ContentWithSidebar>
        <TaiwanCompetitionHub />
      </ContentWithSidebar>
    </>
  );
}
