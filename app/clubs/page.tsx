import type { Metadata } from "next";
import { AdList } from "@/components/ads/AdList";
import { ClubCard } from "@/components/RecordCards";
import { getClubs, getSource } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "俱樂部",
  description:
    "成人冰舞俱樂部入口：整理美國、日本、加拿大與瑞士的官方名錄或加盟團體一覽。來源不足的個別俱樂部會標示待查證。",
  path: "/clubs",
});

export default function ClubsPage() {
  const clubs = getClubs();

  return (
    <>
      <header className="page-header">
        <p className="kicker">CLUBS</p>
        <h1>俱樂部</h1>
        <p>
          本頁整理協會官方搜尋工具或公開名錄。個別俱樂部是否開設成人雙人冰舞或成人單人冰舞課程，若沒有可追溯來源，會標示待查證。
        </p>
      </header>
      <AdList>
        {clubs.map((club) => (
          <ClubCard key={club.id} club={club} source={getSource(club.sourceId)} />
        ))}
      </AdList>
    </>
  );
}
