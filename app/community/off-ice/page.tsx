import type { Metadata } from "next";
import Link from "next/link";
import { ContentWithSidebar } from "@/components/ads/ContentWithSidebar";
import { Breadcrumbs } from "@/components/nav/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Off-ice Training",
  description: "成人冰舞陸地面訓練原則與安全提醒。不是個人教練課表，也不能取代現場指導。",
  path: "/community/off-ice",
});

const crumbs = [
  { name: "首頁", path: "/" },
  { name: "交流", path: "/community" },
  { name: "Off-ice Training", path: "/community/off-ice" },
];

export default function OffIcePage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <header className="page-header">
        <Breadcrumbs items={crumbs} />
        <p className="kicker">OFF-ICE</p>
        <h1>Off-ice Training</h1>
        <p className="disclaimer">陸地面練習可輔助平衡、節奏與肌力，但不能取代冰上教練課。本站不公開未同意的訓練師名單。</p>
      </header>
      <ContentWithSidebar>
        <article className="prose">
          <h2>可與教練討論的方向</h2>
          <ul>
            <li>單足平衡與踝穩定，對應冰上走刃。</li>
            <li>旋轉軸與核心控制，對應 Twizzle 準備。</li>
            <li>節奏與拍號練習，對應 Waltz 與 Foxtrot。</li>
            <li>落地緩衝與髖膝對齊，降低摔倒後的負擔。</li>
          </ul>
          <h2>安全</h2>
          <ul>
            <li>有舊傷或暈眩先問醫師與教練。</li>
            <li>不要在狹窄空間模仿高風險旋轉。</li>
            <li>Facebook 社團與一般影片只能當延伸閱讀，不是規則依據。</li>
          </ul>
          <div className="button-row">
            <Link className="button" href="/community/coaches">
              尋找已審核教練
            </Link>
            <Link className="button-secondary" href="/learn/steps">
              回到基礎步伐
            </Link>
          </div>
        </article>
      </ContentWithSidebar>
    </>
  );
}
