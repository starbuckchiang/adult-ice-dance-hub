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

export function noIndexMetadata(): Pick<Metadata, "robots"> {
  return {
    robots: {
      index: false,
      follow: false,
    },
  };
}
