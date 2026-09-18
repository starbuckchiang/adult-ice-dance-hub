import type { ReactNode } from "react";
import { AdBanner } from "@/components/ads/AdBanner";
import { getActiveCreative } from "@/lib/ads/catalog";

export function ContentWithSidebar({ children }: { children: ReactNode }) {
  const creative = getActiveCreative("SIDEBAR");

  if (!creative) {
    return <>{children}</>;
  }

  return (
    <div className="page-with-sidebar">
      <div className="page-content">{children}</div>
      <aside className="page-sidebar" aria-label="贊助資訊">
        <AdBanner creative={creative} />
      </aside>
    </div>
  );
}
