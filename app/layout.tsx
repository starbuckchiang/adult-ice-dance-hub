import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { PageShell } from "@/components/PageShell";
import { getRootMetadata } from "@/lib/metadata";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const notoStylesheet =
  "https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;800&family=Noto+Serif+TC:wght@600;700&display=swap";

export const metadata: Metadata = getRootMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body className={inter.variable}>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={notoStylesheet} rel="stylesheet" />
        <PageShell>{children}</PageShell>
      </body>
    </html>
  );
}
