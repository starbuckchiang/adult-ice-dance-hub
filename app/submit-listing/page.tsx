import type { Metadata } from "next";
import { ContentWithSidebar } from "@/components/ads/ContentWithSidebar";
import { ListingForm } from "@/components/listing/ListingForm";
import { Breadcrumbs } from "@/components/nav/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { LISTING_EMAIL } from "@/lib/listing/config";
import { createPageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, noIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "申請刊登",
    description: "申請刊登成人冰舞舞伴或教練資料。所有申請先審核，不直接公開。",
    path: "/submit-listing",
  }),
  ...noIndexMetadata(),
};

const crumbs = [
  { name: "首頁", path: "/" },
  { name: "交流", path: "/community" },
  { name: "申請刊登", path: "/submit-listing" },
];

export default function SubmitListingPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <header className="page-header">
        <Breadcrumbs items={crumbs} />
        <p className="kicker">SUBMIT</p>
        <h1>申請刊登</h1>
        <p>
          舞伴與教練申請都會先進入審核。未設定寄信服務時，系統不會顯示假的送出成功，請改寄 {LISTING_EMAIL}。
        </p>
      </header>
      <ContentWithSidebar>
        <ListingForm />
      </ContentWithSidebar>
    </>
  );
}
