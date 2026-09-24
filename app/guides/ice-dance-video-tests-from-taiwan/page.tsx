import type { Metadata } from "next";
import { IceDanceVideoTestsFromTaiwan } from "@/components/guides/IceDanceVideoTestsFromTaiwan";
import { Breadcrumbs } from "@/components/nav/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  ICE_DANCE_VIDEO_TESTS_PATH,
  VERIFIED_ON,
  VIDEO_FAQ,
} from "@/lib/guides/ice-dance-tests-taiwan";
import { createPageMetadata } from "@/lib/metadata";
import { articleJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

const title = "人在台灣，可以用錄影方式取得冰舞檢定結果嗎？";
const description =
  "部分 ISIAsia 級別可能接受錄影審查，但不是自行上傳影片就能取得結果。考生須先確認會籍、級別、承辦機構、考官與送件資格。";

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  path: ICE_DANCE_VIDEO_TESTS_PATH,
  ogType: "article",
});

const crumbs = [
  { name: "首頁", path: "/" },
  { name: "學習中心", path: "/learn" },
  { name: title, path: ICE_DANCE_VIDEO_TESTS_PATH },
];

export default function IceDanceVideoTestsFromTaiwanPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd
        data={articleJsonLd({
          name: title,
          description,
          path: ICE_DANCE_VIDEO_TESTS_PATH,
          datePublished: VERIFIED_ON,
        })}
      />
      <JsonLd data={faqJsonLd(VIDEO_FAQ)} />
      <header className="page-header">
        <Breadcrumbs items={crumbs} />
      </header>
      <IceDanceVideoTestsFromTaiwan />
    </>
  );
}
