import type { Metadata } from "next";
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
      </header>
      <TaiwanCompetitionHub />
    </>
  );
}
