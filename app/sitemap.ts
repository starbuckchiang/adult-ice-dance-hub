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
    { url: "/learn", changeFrequency: "weekly", priority: 0.85 },
    { url: "/guides/buy-skates", changeFrequency: "monthly", priority: 0.7 },
    { url: "/guides/taiwan-adult-competitions-2026", changeFrequency: "weekly", priority: 0.8 },
    { url: "/guides/ice-dance-tests-in-taiwan", changeFrequency: "monthly", priority: 0.75 },
    { url: "/guides/ice-dance-video-tests-from-taiwan", changeFrequency: "monthly", priority: 0.75 },
    { url: "/learn/steps", changeFrequency: "weekly", priority: 0.8 },
    { url: "/learn/pattern-dance", changeFrequency: "weekly", priority: 0.8 },
    { url: "/testing", changeFrequency: "weekly", priority: 0.8 },
    { url: "/music", changeFrequency: "weekly", priority: 0.75 },
    { url: "/community", changeFrequency: "weekly", priority: 0.7 },
    { url: "/community/partners", changeFrequency: "weekly", priority: 0.65 },
    { url: "/community/coaches", changeFrequency: "weekly", priority: 0.65 },
    { url: "/community/off-ice", changeFrequency: "monthly", priority: 0.5 },
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
