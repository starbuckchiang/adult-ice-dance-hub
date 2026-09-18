import type { Metadata } from "next";
import { ContentWithSidebar } from "@/components/ads/ContentWithSidebar";
import { ExternalLink } from "@/components/ExternalLink";
import { Breadcrumbs } from "@/components/nav/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { SourceMeta } from "@/components/SourceMeta";
import { getSource } from "@/lib/content";
import { getMusicGuides, getMusicLinks } from "@/lib/learn";
import { createPageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "音樂與編舞",
  description: "成人冰舞 Rhythm Dance 與 Solo Free Dance 音樂原則、檢查表與合法來源。不提供未授權下載。",
  path: "/music",
});

const crumbs = [
  { name: "首頁", path: "/" },
  { name: "學習中心", path: "/learn" },
  { name: "音樂與編舞", path: "/music" },
];

const checklist = [
  "核對自己報名的比賽文件，不要混用 Junior／Senior 與成人時長。",
  "Rhythm Dance 2026–27 主題是 Rhythm and Waltz；華爾滋段落須 3/4 或 6/8。",
  "再加入至少一種其他節奏與舞蹈風格。",
  "歌詞須符合 ISU 倫理要求，不含攻擊性或冒犯內容。",
  "規定舞速度在指定 sequences 中保持穩定。",
  "剪輯長度預留進場與結束 pose 的時間。",
];

const choreo = [
  "告訴編舞老師比賽名稱、程度與當季技術文件連結。",
  "分開標示雙人冰舞或單人冰舞。",
  "確認 Pattern Dance Element、步序風格與 Hold 限制。",
  "音樂授權由使用者自行取得，本站不提供音檔。",
];

export default function MusicPage() {
  const guides = getMusicGuides();
  const links = getMusicLinks();

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <header className="page-header">
        <Breadcrumbs items={crumbs} />
        <p className="kicker">MUSIC</p>
        <h1>音樂與編舞</h1>
        <p>本站不提供未授權音樂下載，也不把非正式網站列為冰舞規則來源。</p>
      </header>
      <ContentWithSidebar>
        {guides.map((guide) => (
          <article key={guide.id} className="card-dark learn-card">
            <h2>
              {guide.titleZh}
              <span className="muted"> {guide.titleEn}</span>
            </h2>
            <p>{guide.body}</p>
            <SourceMeta source={getSource(guide.sourceId)} lastVerified={guide.lastVerified} />
          </article>
        ))}
        <article className="card-dark learn-card">
          <h2>音樂挑選檢查表</h2>
          <ul>
            {checklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="card-dark learn-card">
          <h2>編舞溝通清單</h2>
          <ul>
            {choreo.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="card-dark learn-card">
          <h2>合法來源與延伸觀看</h2>
          <ul>
            {links.map((link) => (
              <li key={link.id}>
                <ExternalLink href={link.url}>{link.nameZh}</ExternalLink>
                <span className="muted"> {link.nameEn}</span>
              </li>
            ))}
          </ul>
        </article>
      </ContentWithSidebar>
    </>
  );
}
