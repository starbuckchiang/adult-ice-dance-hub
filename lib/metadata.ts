import type { Metadata } from "next";
import { DEFAULT_DESCRIPTION, getSiteUrl, SITE_NAME_EN, SITE_NAME_ZH } from "@/lib/site";

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
};

export function createPageMetadata({
  title,
  description,
  path,
}: PageMetaInput): Metadata {
  const url = new URL(path, getSiteUrl()).toString();
  const fullTitle = `${title}｜${SITE_NAME_ZH}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      locale: "zh_TW",
      siteName: `${SITE_NAME_EN} ${SITE_NAME_ZH}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}

export function getRootMetadata(): Metadata {
  return {
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: `${SITE_NAME_EN}｜${SITE_NAME_ZH}`,
      template: `%s｜${SITE_NAME_ZH}`,
    },
    description: DEFAULT_DESCRIPTION,
    openGraph: {
      title: `${SITE_NAME_EN}｜${SITE_NAME_ZH}`,
      description: DEFAULT_DESCRIPTION,
      locale: "zh_TW",
      siteName: `${SITE_NAME_EN} ${SITE_NAME_ZH}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${SITE_NAME_EN}｜${SITE_NAME_ZH}`,
      description: DEFAULT_DESCRIPTION,
    },
  };
}
