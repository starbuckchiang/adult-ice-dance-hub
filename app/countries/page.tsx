import type { Metadata } from "next";
import { CountryCard } from "@/components/RecordCards";
import { UpdateNotice } from "@/components/UpdateNotice";
import { getCountries, getSource } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "國家總覽",
  description:
    "美國、日本、加拿大與瑞士的成人冰舞國家入口，包含主管團體、官方來源與查證狀態。",
  path: "/countries",
});

export default function CountriesPage() {
  const countries = getCountries();

  return (
    <>
      <header className="page-header">
        <p className="kicker">COUNTRIES</p>
        <h1>國家總覽</h1>
        <p>
          第一版先建立四個國家入口。國家頁只彙整可追溯的協會、俱樂部名錄、比賽與規則來源，不會比較哪一國參與人數最多。
        </p>
      </header>
      <UpdateNotice />
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
    </>
  );
}
