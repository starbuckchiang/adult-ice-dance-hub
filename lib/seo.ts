import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site";

export type Crumb = {
  name: string;
  path: string;
};

export function breadcrumbJsonLd(items: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.path, getSiteUrl()).toString(),
    })),
  };
}

export function howToJsonLd(input: {
  name: string;
  description: string;
  path: string;
  steps: Array<{ name: string; text: string }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: input.name,
    description: input.description,
    url: new URL(input.path, getSiteUrl()).toString(),
    step: input.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
      url: new URL(`${input.path}#step-${index + 1}`, getSiteUrl()).toString(),
    })),
  };
}

export function articleJsonLd(input: {
  name: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
}) {
  const url = new URL(input.path, getSiteUrl()).toString();
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.name,
    description: input.description,
    inLanguage: "zh-Hant",
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    mainEntityOfPage: url,
    url,
    author: {
      "@type": "Organization",
      name: "Adult Ice Dance Hub",
    },
    publisher: {
      "@type": "Organization",
      name: "Adult Ice Dance Hub",
    },
  };
}

export function faqJsonLd(items: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function itemListJsonLd(input: {
  name: string;
  description: string;
  path: string;
  items: Array<{ name: string; path?: string; url?: string }>;
}) {
  const pageUrl = new URL(input.path, getSiteUrl()).toString();
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: input.name,
    description: input.description,
    url: pageUrl,
    numberOfItems: input.items.length,
    itemListElement: input.items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url || (item.path ? new URL(item.path, getSiteUrl()).toString() : pageUrl),
    })),
  };
}

export function sportsEventJsonLd(input: {
  name: string;
  startDate: string;
  endDate?: string;
  locationName: string;
  city?: string;
  url: string;
  organizer?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: input.name,
    startDate: input.startDate,
    ...(input.endDate ? { endDate: input.endDate } : {}),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: input.locationName,
      ...(input.city
        ? {
            address: {
              "@type": "PostalAddress",
              addressLocality: input.city,
              addressCountry: "TW",
            },
          }
        : {}),
    },
    url: input.url,
    ...(input.organizer
      ? {
          organizer: {
            "@type": "Organization",
            name: input.organizer,
          },
        }
      : {}),
    sport: "Figure skating",
  };
}

export function noIndexMetadata(): Pick<Metadata, "robots"> {
  return {
    robots: {
      index: false,
      follow: false,
    },
  };
}
