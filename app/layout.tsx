import type { Metadata } from "next";
import { Inter, Noto_Sans_TC } from "next/font/google";
import { PageShell } from "@/components/PageShell";
import { getRootMetadata } from "@/lib/metadata";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const notoSansTc = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
  variable: "--font-noto",
});

export const metadata: Metadata = getRootMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body className={`${inter.variable} ${notoSansTc.variable} ${notoSansTc.className}`}>
        <PageShell>{children}</PageShell>
      </body>
    </html>
  );
}
