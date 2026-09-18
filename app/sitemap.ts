import type { MetadataRoute } from "next";
import { getCountries } from "@/lib/content";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const lastModified = new Date("2026-09-18");
  const staticPaths = [
    "/",
    "/countries",
    "/clubs",
    "/competitions",
    "/rules",
    "/about",
    "/advertising",
    "/privacy",
  ];
  const countryPaths = getCountries().map((country) => `/countries/${country.slug}`);

  return [...staticPaths, ...countryPaths].map((path) => ({
    url: new URL(path, siteUrl).toString(),
    lastModified,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
