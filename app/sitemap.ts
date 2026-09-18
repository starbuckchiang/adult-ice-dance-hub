import type { MetadataRoute } from "next";
import { getCompetitions, getCountries } from "@/lib/content";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const lastModified = new Date("2026-09-19");

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: "/", changeFrequency: "weekly", priority: 1 },
    { url: "/countries", changeFrequency: "weekly", priority: 0.9 },
    { url: "/competitions", changeFrequency: "daily", priority: 0.9 },
    { url: "/clubs", changeFrequency: "weekly", priority: 0.8 },
    { url: "/rules", changeFrequency: "weekly", priority: 0.8 },
    { url: "/about", changeFrequency: "monthly", priority: 0.5 },
    { url: "/advertising", changeFrequency: "monthly", priority: 0.4 },
    { url: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  ];

  const countryRoutes: MetadataRoute.Sitemap = getCountries().map((country) => ({
    url: `/countries/${country.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const watchRoutes: MetadataRoute.Sitemap = getCompetitions().map((competition) => ({
    url: `/watch/${competition.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...countryRoutes, ...watchRoutes].map((route) => ({
    ...route,
    url: new URL(route.url, siteUrl).toString(),
    lastModified,
  }));
}
