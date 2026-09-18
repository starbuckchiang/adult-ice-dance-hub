import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/ads/AdSlot";
import { Band } from "@/components/Band";
import { HeroVisual } from "@/components/HeroVisual";
import { ClubCard, CompetitionCard, CountryCard } from "@/components/RecordCards";
import {
  getClubs,
  getCountries,
  getFeaturedCompetitions,
  getSource,
} from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import { SITE_NAME_EN } from "@/lib/site";

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

  return (
    <>
      <Band tone="hero" as="header">
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="kicker">GLOBAL ADULT ICE DANCE DIRECTORY</p>
            <h1>找到你的下一段冰舞旅程</h1>
            <p className="hero-en">Adult Ice Dance Hub</p>
            <p className="lede">
              整合成人冰舞俱樂部、賽事、規則與跨國參賽資訊。
            </p>
            <div className="button-row">
              <Link className="button" href="/countries">
                探索國家
              </Link>
              <Link className="button-secondary" href="/competitions">
                查看近期比賽
              </Link>
            </div>
          </div>
          <HeroVisual />
        </div>
      </Band>

      <Band tone="dark" className="band-ad">
        <AdSlot placementCode="HOME_HERO" />
      </Band>

      <Band tone="warm">
        <div className="section-head">
          <p className="kicker">DISCIPLINES</p>
          <h2>兩種成人冰舞，分開標示</h2>
        </div>
        <div className="grid grid-2">
          <article className="card-warm">
            <p className="kicker">PARTNERED ICE DANCE</p>
            <h3>成人雙人冰舞</h3>
            <p>
              Partnered Ice Dance / Couples Ice Dance 由一對舞者共同比賽，國際成人賽技術公告將其分為規定舞、韻律舞與自由舞。本站不以單人冰舞資料替代雙人冰舞資訊。
            </p>
          </article>
          <article className="card-warm">
            <p className="kicker">ADULT SOLO DANCE</p>
            <h3>成人單人冰舞</h3>
            <p>
              Adult Solo Dance 由單一選手完成冰舞項目。美國、加拿大與瑞士均有可追溯的單人冰舞規則或系列入口；國際成人賽中，單人冰舞在 2026–27 技術公告裡被列為北美賽額外項目。
            </p>
          </article>
        </div>
        <div className="section-head" style={{ marginTop: 48 }}>
          <p className="kicker">COUNTRIES</p>
          <h2>四國入口</h2>
        </div>
        <div className="grid grid-2">
          {countries.map((country) => (
            <CountryCard
              key={country.id}
              country={country}
              source={getSource(country.sourceId)}
              href={`/countries/${country.slug}`}
              tone="warm"
            />
          ))}
        </div>
      </Band>

      <Band tone="warm" className="band-ad">
        <AdSlot placementCode="HOME_INLINE" />
      </Band>

      <Band tone="plum">
        <div className="section-head">
          <p className="kicker">COMPETITIONS</p>
          <h2>近期比賽</h2>
        </div>
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
      </Band>

      <Band tone="dark">
        <div className="section-head">
          <p className="kicker">CLUBS</p>
          <h2>俱樂部入口</h2>
          <p className="muted">
            第一版只放官方俱樂部搜尋工具或協會名錄，不列出未經查證的個別俱樂部、教練或聯絡方式。
          </p>
        </div>
        <div className="grid grid-2">
          {clubs.map((club) => (
            <ClubCard key={club.id} club={club} source={getSource(club.sourceId)} tone="dark" />
          ))}
        </div>
        <div className="button-row">
          <Link className="button-secondary" href="/clubs">
            進入俱樂部頁
          </Link>
          <Link className="button-secondary" href="/rules">
            進入規則中心
          </Link>
        </div>
        <p className="home-footnote">
          本站資料皆附來源與查證日期，內容持續補充中。
        </p>
      </Band>
    </>
  );
}
