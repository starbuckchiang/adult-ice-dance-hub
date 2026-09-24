import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/ads/AdSlot";
import styles from "@/components/home/HomeMagazine.module.css";
import { ReplayThumbnail } from "@/components/watch/ReplayThumbnail";
import { JsonLd } from "@/components/seo/JsonLd";
import type { Competition, Country } from "@/data/types";
import { getCompetitionPhase, formatDate, formatDateRange } from "@/lib/format";
import { VERIFIED_ON } from "@/lib/guides/ice-dance-tests-taiwan";
import { TAIWAN_GUIDE_PATH } from "@/lib/guides/taiwan-competitions-2026";
import { getCompetitions, getCountries } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import { getReplayDateLine } from "@/lib/replay-date";
import { getSiteUrl, SITE_NAME_EN, SITE_NAME_ZH } from "@/lib/site";
import { getLatestReplays } from "@/lib/videos";
import { resolveReplayThumbnail } from "@/lib/youtube";

const description =
  "成人冰舞的學習、裝備、檢定與參賽指南。依照你現在的程度，找到開始學、準備鞋子、完成檢定或走向第一場比賽的下一步。";

export const metadata: Metadata = createPageMetadata({
  title: `${SITE_NAME_EN}｜成人冰舞學習、裝備、檢定與參賽`,
  description,
  path: "/",
});

const paths = [
  {
    href: "/learn",
    title: "第一次接觸冰舞",
    text: "認識基本能力與學習順序",
  },
  {
    href: "/guides/buy-skates",
    title: "準備一雙合適的鞋",
    text: "從用途、尺寸與程度開始篩選",
  },
  {
    href: "/guides/ice-dance-tests-in-taiwan",
    title: "完成一次檢定",
    text: "了解台灣現場與錄影檢定路線",
  },
  {
    href: TAIWAN_GUIDE_PATH,
    title: "站上成人賽場",
    text: "先確認資格，再開始準備",
  },
] as const;

const features = [
  {
    href: TAIWAN_GUIDE_PATH,
    category: "參賽",
    title: "2026 台灣成人參賽指南",
    text: "先核對資格、報名期限與備賽步驟，再決定要不要報名。",
    cta: "閱讀參賽指南",
    verified: null,
  },
  {
    href: "/guides/ice-dance-tests-in-taiwan",
    category: "檢定",
    title: "在台灣能參加冰舞檢定嗎？",
    text: "整理 ISIAsia 現場檢定需要的冰場、教練與個人會籍條件。",
    cta: "查看檢定路線",
    verified: VERIFIED_ON,
  },
  {
    href: "/guides/buy-skates",
    category: "裝備",
    title: "滑冰鞋網路採購指南",
    text: "從用途、尺寸、庫存與退換貨條件開始比較，不替特定商店背書。",
    cta: "開始採購規劃",
    verified: null,
  },
] as const;

const countryNotes: Record<string, string> = {
  usa: "成人賽事與測驗制度",
  canada: "STAR 與成人測驗路線",
  japan: "成人賽事與冰場資源",
};

const planSteps = ["確認程度", "找到賽事", "核對資格", "建立準備計畫", "完成參賽"];

function plannableCompetition(): Competition | undefined {
  const upcoming = getCompetitions()
    .filter((item) => item.status === "verified" && item.startDate && getCompetitionPhase(item.startDate, item.endDate) === "upcoming")
    .sort((a, b) => (a.startDate ?? "").localeCompare(b.startDate ?? ""));
  return upcoming.find((item) => item.type !== "general") ?? upcoming[0];
}

function countryBySlug(countries: Country[], slug: string) {
  return countries.find((country) => country.slug === slug);
}

export default function HomePage() {
  const countries = getCountries();
  const competition = plannableCompetition();
  const replays = getLatestReplays().slice(0, 3);
  const latestReplay = replays[0];
  const competitions = getCompetitions();
  const siteUrl = getSiteUrl();
  const regional = ["switzerland", "italy", "australia"]
    .map((slug) => countryBySlug(countries, slug))
    .filter((country): country is Country => Boolean(country));

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME_EN,
    alternateName: SITE_NAME_ZH,
    url: siteUrl,
    description,
    inLanguage: "zh-Hant",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME_EN,
      alternateName: SITE_NAME_ZH,
      url: siteUrl,
    },
  };

  return (
    <div className={styles.page}>
      <JsonLd data={websiteJsonLd} />
      <div className={styles.inner}>
        <header className={styles.hero}>
          <div>
            <p className={styles.kicker}>ADULT ICE DANCE · TAIWAN</p>
            <h1>成人冰舞，從「想試試」開始。</h1>
            <p className={styles.lede}>
              不是只收藏規則與賽事，而是找到符合你現在程度的下一個行動：開始學、準備裝備、尋找檢定，或走向第一場比賽。
            </p>
            <div className={styles.actions}>
              <a className={styles.primary} href="#paths">
                選擇我的起點
              </a>
              <a className={styles.secondary} href="#featured">
                查看本月最新指南
              </a>
            </div>
          </div>
          <nav id="paths" aria-labelledby="paths-title">
            <h2 id="paths-title">今天，你想往哪裡前進？</h2>
            <ol className={styles.paths}>
              {paths.map((path) => (
                <li key={path.href}>
                  <Link className={styles.path} href={path.href}>
                    <strong>{path.title}</strong>
                    <span>{path.text}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        </header>

        <div className={styles.adBreak}>
          <AdSlot placementCode="HOME_HERO" />
        </div>

        <section className={styles.section} id="featured" aria-labelledby="featured-title">
          <div className={styles.sectionHead}>
            <h2 id="featured-title">本期精選</h2>
          </div>
          <div className={styles.featureGrid}>
            {features.map((feature) => (
              <article key={feature.href} className={styles.story}>
                <p className={styles.category}>{feature.category}</p>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
                {feature.verified ? <p className={styles.meta}>查證日期：{formatDate(feature.verified)}</p> : null}
                <Link className={styles.cardLink} href={feature.href}>
                  {feature.cta}
                </Link>
              </article>
            ))}
          </div>
          <p className={styles.next}>
            接著看{" "}
            <a className={styles.textLink} href="#plan">
              第一次參賽計畫
            </a>
          </p>
        </section>

        <section className={styles.section} id="plan" aria-labelledby="plan-title">
          <div className={styles.plan}>
            <div>
              <h2 id="plan-title">第一次參賽計畫</h2>
              <ol className={styles.steps}>
                {planSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <p className={styles.planCopy}>第一次參賽不必一次理解全部規則，先完成目前階段最重要的一步。</p>
            </div>
            <Link className={styles.primary} href={TAIWAN_GUIDE_PATH}>
              開始第一次參賽規劃
            </Link>
          </div>
        </section>

        <div className={styles.adBreak}>
          <AdSlot placementCode="HOME_INLINE" />
        </div>

        <section className={styles.section} aria-labelledby="latest-title">
          <div className={styles.sectionHead}>
            <h2 id="latest-title">近期與最新</h2>
          </div>
          <div className={styles.recentGrid}>
            {competition ? (
              <article className={styles.recentCard}>
                <p className={styles.category}>近期可規劃賽事</p>
                <h3>{competition.nameZh}</h3>
                <p>{formatDateRange(competition.startDate, competition.endDate)}</p>
                <Link className={styles.cardLink} href="/competitions#upcoming">
                  查看賽事
                </Link>
              </article>
            ) : null}
            {latestReplay ? (
              <ReplayCard videoId={latestReplay.id} competitions={competitions} />
            ) : null}
            <article className={styles.recentCard}>
              <p className={styles.category}>最近更新的指南</p>
              <h3>在台灣能參加冰舞檢定嗎？</h3>
              <p className={styles.meta}>查證日期：{formatDate(VERIFIED_ON)}</p>
              <Link className={styles.cardLink} href="/guides/ice-dance-tests-in-taiwan">
                閱讀指南
              </Link>
            </article>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="countries-title">
          <div className={styles.sectionHead}>
            <h2 id="countries-title">跨國資源</h2>
          </div>
          <div className={styles.countryGrid}>
            {(["usa", "canada", "japan"] as const).map((slug) => {
              const country = countryBySlug(countries, slug);
              if (!country) return null;
              return (
                <article key={country.id} className={styles.countryCard}>
                  <h3>{country.nameZh}</h3>
                  <p>{countryNotes[slug]}</p>
                  <Link className={styles.cardLink} href={`/countries/${country.slug}`}>
                    查看{country.nameZh}
                  </Link>
                </article>
              );
            })}
            {regional.length > 0 ? (
              <article className={styles.countryCard}>
                <h3>歐洲／澳洲</h3>
                <p>國際成人賽事資訊：{regional.map((country) => country.nameZh).join("、")}</p>
                <Link className={styles.cardLink} href="/countries">
                  查看國家總覽
                </Link>
              </article>
            ) : null}
          </div>
        </section>

        {replays.length > 0 ? (
          <section className={styles.section} aria-labelledby="watch-title">
            <div className={styles.sectionHead}>
              <h2 id="watch-title">從別人的比賽，看見自己的可能</h2>
            </div>
            <div className={styles.videoGrid}>
              {replays.map((video) => {
                const event = competitions.find((item) => item.id === video.competitionId);
                const dateLine = getReplayDateLine(video, event);
                return (
                  <article key={video.id} className={styles.videoCard}>
                    <div className={styles.thumb}>
                      <ReplayThumbnail src={resolveReplayThumbnail(video)} alt="" />
                    </div>
                    <h3>{event?.nameZh || video.titleZh}</h3>
                    {video.sessionName ? <p>{video.sessionName}</p> : null}
                    {dateLine ? (
                      <p className={styles.meta}>
                        {dateLine.label}：{dateLine.text}
                      </p>
                    ) : null}
                  </article>
                );
              })}
            </div>
            <p className={styles.next}>
              <Link className={styles.primary} href="/watch#replays">
                查看最新重播
              </Link>
            </p>
          </section>
        ) : null}

        <section className={styles.service} aria-labelledby="service-title">
          <div>
            <h2 id="service-title">參賽服務</h2>
            <p className={styles.planCopy}>
              第一次參賽不知道如何安排？我們協助把規則、報名、節目、行程與現場需求整理成可以執行的計畫。
            </p>
          </div>
          <Link className={styles.primary} href={`${TAIWAN_GUIDE_PATH}#services`}>
            了解參賽支援
          </Link>
        </section>
      </div>
    </div>
  );
}

function ReplayCard({
  videoId,
  competitions,
}: {
  videoId: string;
  competitions: Competition[];
}) {
  const video = getLatestReplays().find((item) => item.id === videoId);
  if (!video) return null;
  const event = competitions.find((item) => item.id === video.competitionId);
  const dateLine = getReplayDateLine(video, event);
  return (
    <article className={styles.recentCard}>
      <p className={styles.category}>最新重播</p>
      <h3>{event?.nameZh || video.titleZh}</h3>
      {dateLine ? (
        <p className={styles.meta}>
          {dateLine.label}：{dateLine.text}
        </p>
      ) : null}
      <Link className={styles.cardLink} href="/watch#replays">
        觀看重播
      </Link>
    </article>
  );
}
