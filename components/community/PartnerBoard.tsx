"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { PublishedPartnerListing } from "@/data/types";
import {
  AGE_GROUPS,
  COMPETITION_OPTIONS,
  HEIGHT_RANGES,
  PARTNER_LEVELS,
  PRACTICE_OPTIONS,
  danceLabel,
  meetingLabel,
} from "@/lib/listing/config";

export function PartnerBoard({ listings }: { listings: PublishedPartnerListing[] }) {
  const [country, setCountry] = useState("all");
  const [city, setCity] = useState("");
  const [danceType, setDanceType] = useState("all");
  const [level, setLevel] = useState("all");
  const [ageGroup, setAgeGroup] = useState("all");
  const [heightRange, setHeightRange] = useState("all");
  const [practiceFrequency, setPracticeFrequency] = useState("all");
  const [competitionIntent, setCompetitionIntent] = useState("all");
  const [language, setLanguage] = useState("");
  const [meetingType, setMeetingType] = useState("all");

  const filtered = useMemo(
    () =>
      listings.filter((item) => {
        if (country !== "all" && item.country !== country) return false;
        if (city.trim() && !item.city.toLowerCase().includes(city.trim().toLowerCase())) return false;
        if (danceType !== "all" && item.danceType !== danceType && item.danceType !== "both") return false;
        if (level !== "all" && item.level !== level) return false;
        if (ageGroup !== "all" && item.ageGroup !== ageGroup) return false;
        if (heightRange !== "all" && item.heightRange !== heightRange) return false;
        if (practiceFrequency !== "all" && item.practiceFrequency !== practiceFrequency) return false;
        if (competitionIntent !== "all" && item.competitionIntent !== competitionIntent) return false;
        if (
          language.trim() &&
          !item.languages.some((value) => value.toLowerCase().includes(language.trim().toLowerCase()))
        ) {
          return false;
        }
        if (meetingType !== "all" && item.meetingType !== meetingType && item.meetingType !== "both") return false;
        return true;
      }),
    [
      listings,
      country,
      city,
      danceType,
      level,
      ageGroup,
      heightRange,
      practiceFrequency,
      competitionIntent,
      language,
      meetingType,
    ],
  );

  return (
    <>
      <form className="filter-bar" onSubmit={(event) => event.preventDefault()}>
        <label>
          國家
          <select value={country} onChange={(event) => setCountry(event.target.value)}>
            <option value="all">全部</option>
            <option value="usa">美國</option>
            <option value="japan">日本</option>
            <option value="canada">加拿大</option>
            <option value="switzerland">瑞士</option>
            <option value="italy">義大利</option>
            <option value="australia">澳洲</option>
          </select>
        </label>
        <label>
          城市
          <input value={city} onChange={(event) => setCity(event.target.value)} placeholder="城市或地區" />
        </label>
        <label>
          冰舞類型
          <select value={danceType} onChange={(event) => setDanceType(event.target.value)}>
            <option value="all">全部</option>
            <option value="partnered">雙人冰舞</option>
            <option value="solo">單人冰舞交流</option>
          </select>
        </label>
        <label>
          程度
          <select value={level} onChange={(event) => setLevel(event.target.value)}>
            <option value="all">全部</option>
            {PARTNER_LEVELS.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          年齡組別
          <select value={ageGroup} onChange={(event) => setAgeGroup(event.target.value)}>
            <option value="all">全部</option>
            {AGE_GROUPS.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          身高區間
          <select value={heightRange} onChange={(event) => setHeightRange(event.target.value)}>
            <option value="all">全部</option>
            {HEIGHT_RANGES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          練習頻率
          <select value={practiceFrequency} onChange={(event) => setPracticeFrequency(event.target.value)}>
            <option value="all">全部</option>
            {PRACTICE_OPTIONS.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          比賽意願
          <select value={competitionIntent} onChange={(event) => setCompetitionIntent(event.target.value)}>
            <option value="all">全部</option>
            {COMPETITION_OPTIONS.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          語言
          <input value={language} onChange={(event) => setLanguage(event.target.value)} placeholder="例如 中文" />
        </label>
        <label>
          線上／實體
          <select value={meetingType} onChange={(event) => setMeetingType(event.target.value)}>
            <option value="all">全部</option>
            <option value="in-person">實體</option>
            <option value="online">線上</option>
          </select>
        </label>
      </form>
      {filtered.length === 0 ? (
        <div className="empty-state" role="status">
          <div className="empty-shape" aria-hidden="true" />
          <h2>{listings.length === 0 ? "目前沒有已審核的舞伴刊登" : "沒有符合條件的刊登"}</h2>
          <p>
            {listings.length === 0
              ? "本站不製造假會員。通過審核的卡片才會出現，且不會顯示私人電話、Email、生日或住址。"
              : "請調整篩選條件，或申請刊登等待審核。"}
          </p>
          <Link className="button" href="/submit-listing">
            申請刊登
          </Link>
        </div>
      ) : (
        <div className="grid">
          {filtered.map((item) => (
            <article key={item.id} className="card-dark">
              <h2>{item.displayName}</h2>
              <p>
                {item.city}｜{danceLabel(item.danceType)}｜{item.level}
              </p>
              <p>
                {item.ageGroup}｜{item.heightRange}｜{item.practiceFrequency}
              </p>
              <p>
                {item.competitionIntent}｜{item.languages.join("、")}｜{meetingLabel(item.meetingType)}
              </p>
              <Link className="button" href="/submit-listing">
                提出聯絡請求
              </Link>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
