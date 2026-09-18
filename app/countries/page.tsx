import type { Metadata } from "next";
import { CountryCard } from "@/components/RecordCards";
import { getCountries, getSource } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "國家總覽",
  description:
    "美國、日本、加拿大、瑞士、義大利與澳洲的成人冰舞國家入口，包含主管團體、官方來源與查證狀態。",
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
          目前可瀏覽美國、日本、加拿大、瑞士、義大利及澳洲的相關資訊。國家頁彙整協會、俱樂部名錄、比賽與規則來源。
        </p>
      </header>
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
