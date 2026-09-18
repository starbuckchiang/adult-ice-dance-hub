import type { Metadata } from "next";
import { AdList } from "@/components/ads/AdList";
import { ClubCard } from "@/components/RecordCards";
import { UpdateNotice } from "@/components/UpdateNotice";
import { getClubs, getSource } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "俱樂部",
  description:
    "成人冰舞俱樂部入口：第一版提供美國、加拿大、瑞士與日本的官方名錄或加盟團體一覽，不列出未經查證的個別俱樂部。",
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
          本頁只放協會官方搜尋工具或公開名錄。個別俱樂部是否開設成人雙人冰舞或成人單人冰舞課程，若沒有可追溯來源，一律標示待查證。
        </p>
      </header>
      <UpdateNotice />
      <AdList>
        {clubs.map((club) => (
          <ClubCard key={club.id} club={club} source={getSource(club.sourceId)} />
        ))}
      </AdList>
    </>
  );
}
