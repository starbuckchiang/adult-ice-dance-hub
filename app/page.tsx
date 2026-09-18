import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/ads/AdSlot";
import { ClubCard, CompetitionCard, CountryCard, RuleCard } from "@/components/RecordCards";
import { UpdateNotice } from "@/components/UpdateNotice";
import {
  getClubs,
  getCountries,
  getFeaturedCompetitions,
  getRules,
  getSource,
} from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import { SITE_NAME_EN, SITE_NAME_ZH, SITE_TAGLINE } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: `${SITE_NAME_EN}｜成人冰舞官方資訊入口`,
  description:
    "Adult Ice Dance Hub 成人冰舞資訊站：分開標示成人雙人冰舞與成人單人冰舞，並提供美國、日本、加拿大、瑞士的官方入口、比賽資訊與規則來源。",
  path: "/",
});

export default function HomePage() {
  const countries = getCountries();
  const competitions = getFeaturedCompetitions();
  const clubs = getClubs().filter((club) => club.status === "verified");
  const rules = getRules().filter((rule) => rule.country === "isu").slice(0, 2);

  return (
    <>
      <header className="hero">
        <div>
          <p className="kicker">PUBLIC INFORMATION HUB</p>
          <h1>
            {SITE_NAME_EN}
            <br />
            {SITE_NAME_ZH}
          </h1>
          <p className="lede">{SITE_TAGLINE}</p>
        </div>
      </header>

      <AdSlot placementCode="HOME_HERO" />

      <UpdateNotice />

      <section className="section">
        <h2>兩種成人冰舞，分開標示</h2>
        <div className="grid grid-2">
          <article className="panel">
            <p className="kicker">PARTNERED ICE DANCE</p>
            <h3>成人雙人冰舞</h3>
            <p>
              Partnered Ice Dance / Couples Ice Dance 由一對舞者共同比賽，國際成人賽技術公告將其分為規定舞、韻律舞與自由舞。本站不以單人冰舞資料替代雙人冰舞資訊。
            </p>
          </article>
          <article className="panel">
            <p className="kicker">ADULT SOLO DANCE</p>
            <h3>成人單人冰舞</h3>
            <p>
              Adult Solo Dance 由單一選手完成冰舞項目。美國、加拿大與瑞士均有可追溯的單人冰舞規則或系列入口；國際成人賽中，單人冰舞在 2026–27 技術公告裡被列為北美賽額外項目。
            </p>
          </article>
        </div>
      </section>

      <section className="section">
        <h2>四國入口</h2>
        <div className="grid grid-2">
          {countries.map((country) => (
            <CountryCard
              key={country.id}
              country={country}
              source={getSource(country.sourceId)}
              href={`/countries/${country.slug}`}
            />
          ))}
        </div>
      </section>

      <AdSlot placementCode="HOME_INLINE" />

      <section className="section">
        <h2>最新比賽資訊</h2>
        <ul className="list">
          {competitions.map((competition) => (
            <li key={competition.id}>
              <CompetitionCard
                competition={competition}
                source={getSource(competition.sourceId)}
              />
            </li>
          ))}
        </ul>
        <div className="button-row">
          <Link className="button" href="/competitions">
            查看全部比賽資訊
          </Link>
        </div>
      </section>

      <section className="section">
        <h2>俱樂部資訊</h2>
        <p className="muted">
          第一版只放官方俱樂部搜尋工具或協會名錄，不列出未經查證的個別俱樂部、教練或聯絡方式。
        </p>
        <div className="grid grid-2">
          {clubs.map((club) => (
            <ClubCard key={club.id} club={club} source={getSource(club.sourceId)} />
          ))}
        </div>
        <div className="button-row">
          <Link className="button-secondary" href="/clubs">
            進入俱樂部頁
          </Link>
        </div>
      </section>

      <section className="section">
        <h2>比賽規則入口</h2>
        <div className="grid grid-2">
          {rules.map((rule) => (
            <RuleCard key={rule.id} rule={rule} source={getSource(rule.sourceId)} />
          ))}
        </div>
        <div className="button-row">
          <Link className="button" href="/rules">
            進入規則中心
          </Link>
        </div>
      </section>
    </>
  );
}
