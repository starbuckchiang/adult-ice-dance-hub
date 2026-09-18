import type { Metadata } from "next";
import Link from "next/link";
import { ContentWithSidebar } from "@/components/ads/ContentWithSidebar";
import { Breadcrumbs } from "@/components/nav/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "交流中心",
  description: "成人冰舞交流：尋找舞伴、尋找教練與 Off-ice Training 入口。未審核資料不會公開。",
  path: "/community",
});

const crumbs = [
  { name: "首頁", path: "/" },
  { name: "交流", path: "/community" },
];

const entries = [
  { href: "/community/partners", title: "尋找舞伴", text: "以審核後的公開卡片配對。現階段先申請刊登，不製造假會員。" },
  { href: "/community/coaches", title: "尋找教練", text: "只刊登本人同意且可核對來源的教練。目前沒有未同意的人物介紹。" },
  { href: "/community/off-ice", title: "Off-ice Training", text: "陸地面訓練原則與安全提醒，不是個人教練課表。" },
];

export default function CommunityPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <header className="page-header">
        <Breadcrumbs items={crumbs} />
        <p className="kicker">COMMUNITY</p>
        <h1>交流中心</h1>
        <p>公開卡片不會顯示私人電話、私人 Email、精確生日、住址或未成年人可識別資訊。</p>
      </header>
      <ContentWithSidebar>
        <div className="grid grid-2">
          {entries.map((item) => (
            <article key={item.href} className="card-dark">
              <h2>{item.title}</h2>
              <p>{item.text}</p>
              <Link className="button" href={item.href}>
                進入
              </Link>
            </article>
          ))}
        </div>
      </ContentWithSidebar>
    </>
  );
}
