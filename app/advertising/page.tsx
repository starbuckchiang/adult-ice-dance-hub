import type { Metadata } from "next";
import Link from "next/link";
import { AdvertisingContact } from "@/components/contact/AdvertisingContact";
import {
  ADVERTISING_CONTACT_PATH,
  CONTACT_DEPARTMENT,
  CONTACT_EMAIL,
  CONTACT_ORG,
  CONTACT_TEL_SCHEMA,
} from "@/lib/contact/config";
import { getSiteUrl, SITE_NAME_EN, SITE_NAME_ZH } from "@/lib/site";

const title = "廣告合作｜Adult Ice Dance Hub 成人冰舞資訊站";
const description =
  "洽詢Adult Ice Dance Hub成人冰舞資訊站廣告合作，接觸關注滑冰、訓練、賽事及相關服務的讀者。";
const pageUrl = new URL("/advertising", getSiteUrl()).toString();

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title,
    description,
    url: pageUrl,
    locale: "zh_TW",
    siteName: `${SITE_NAME_EN} ${SITE_NAME_ZH}`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: CONTACT_ORG,
  department: {
    "@type": "Organization",
    name: CONTACT_DEPARTMENT,
    parentOrganization: CONTACT_ORG,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "advertising inquiries",
      telephone: CONTACT_TEL_SCHEMA,
      email: CONTACT_EMAIL,
      availableLanguage: ["zh-Hant", "en"],
    },
  },
};

export default function AdvertisingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <header className="page-header">
        <p className="kicker">ADVERTISING</p>
        <h1>廣告合作</h1>
        <p>
          本站提供標示清楚的廣告版位，方便成人冰舞相關品牌與活動觸及讀者。廣告與編輯內容分開呈現。
        </p>
        <div className="button-row">
          <Link className="button" href={ADVERTISING_CONTACT_PATH}>
            洽詢廣告合作
          </Link>
        </div>
      </header>
      <article className="prose">
        <h2>廣告成效統計</h2>
        <p>
          本站可依廣告活動與版位統計曝光數、點擊數及點擊率，協助廣告主了解基本投放成效。
        </p>
        <p>
          正式廣告活動的統計期間、版位、素材及成效報告方式，將於投放前與廣告主確認。
        </p>
        <p>
          廣告合作與成效報告服務將配合網站正式投放時程開放。
        </p>
        <h2>標示原則</h2>
        <ul>
          <li>每個版位都會顯示「廣告合作」。</li>
          <li>廣告與編輯內容分開，不會偽裝成導覽按鈕。</li>
          <li>沒有自動播放音效、閃爍或跳出式廣告。</li>
          <li>沒有廣告時，版位會自動收合。</li>
        </ul>
        <p>
          2026 台灣成人參賽指南等站內內容卡不是付費廣告，不顯示 Sponsored，也不計入廣告成效報表。國內成人參賽支援見
          <Link href="/guides/taiwan-adult-competitions-2026">2026 台灣成人參賽指南</Link>
          ；品牌合作內容不會暗示品牌是賽事主辦、官方贊助或能影響比賽結果。
        </p>
        <p>
          隱私處理方式見 <Link href="/privacy">隱私說明</Link>。
        </p>
      </article>
      <AdvertisingContact />
    </>
  );
}
