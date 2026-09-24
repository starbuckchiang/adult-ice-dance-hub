import type { Metadata } from "next";
import { IceDanceTestsInTaiwan } from "@/components/guides/IceDanceTestsInTaiwan";
import { Breadcrumbs } from "@/components/nav/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  ICE_DANCE_TESTS_PATH,
  TESTS_FAQ,
  VERIFIED_ON,
} from "@/lib/guides/ice-dance-tests-taiwan";
import { createPageMetadata } from "@/lib/metadata";
import { articleJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

const title = "在台灣有機會參加冰舞檢定嗎？";
const description =
  "台灣成人可透過 ISIAsia 有效行政會員冰場、合格專業會員與個人會籍，依序參加 Ice Dance 1–10。有機會不代表已可直接報名。";

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  path: ICE_DANCE_TESTS_PATH,
  ogType: "article",
});

const crumbs = [
  { name: "首頁", path: "/" },
  { name: "學習中心", path: "/learn" },
  { name: title, path: ICE_DANCE_TESTS_PATH },
];

export default function IceDanceTestsInTaiwanPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd
        data={articleJsonLd({
          name: title,
          description,
          path: ICE_DANCE_TESTS_PATH,
          datePublished: VERIFIED_ON,
        })}
      />
      <JsonLd data={faqJsonLd(TESTS_FAQ)} />
      <header className="page-header">
        <Breadcrumbs items={crumbs} />
      </header>
      <IceDanceTestsInTaiwan />
    </>
  );
}
