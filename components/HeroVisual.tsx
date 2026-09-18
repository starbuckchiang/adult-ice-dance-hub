import Link from "next/link";
import type { Country } from "@/data/types";

const countryCodes: Record<Country["slug"], string> = {
  usa: "USA",
  japan: "JPN",
  canada: "CAN",
  switzerland: "SUI",
  italy: "ITA",
  australia: "AUS",
};

export function HeroVisual({ countries }: { countries: Country[] }) {
  return (
    <div className="hero-visual">
      <div className="hero-decoration" aria-hidden="true">
        <div className="hero-arc" />
        <div className="hero-dot hero-dot-a" />
        <div className="hero-dot hero-dot-b" />
      </div>
      <article className="hero-feature-card">
        <p className="hero-feature-eyebrow">GLOBAL ICE DANCE GUIDE</p>
        <h2 className="hero-feature-title">跨國成人冰舞入口</h2>
        <p className="hero-feature-desc">官方協會、賽事公告與規則來源，雙人與單人分開標示。</p>
        <div className="hero-discipline-list">
          <span className="badge badge-partnered">Partnered Dance</span>
          <span className="badge badge-solo">Solo Dance</span>
        </div>
      </article>
      <ul className="hero-country-grid">
        {countries.map((country) => (
          <li key={country.slug}>
            <Link className="hero-country-chip" href={`/countries/${country.slug}`}>
              {countryCodes[country.slug]} · {country.nameEn}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
