import type { ReactNode } from "react";
import { FloatingCta } from "@/components/FloatingCta";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="page-shell">
      <a className="skip-link" href="#main">
        跳到主要內容
      </a>
      <SiteHeader />
      <main id="main" className="page-main">
        {children}
      </main>
      <SiteFooter />
      <FloatingCta />
    </div>
  );
}
