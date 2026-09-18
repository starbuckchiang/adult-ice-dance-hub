import type { ReactNode } from "react";

type BandTone = "dark" | "secondary" | "plum" | "warm" | "hero";

export function Band({
  tone,
  children,
  className = "",
  as: Tag = "section",
}: {
  tone: BandTone;
  children: ReactNode;
  className?: string;
  as?: "section" | "div" | "header";
}) {
  return (
    <Tag className={`band band-${tone} ${className}`.trim()}>
      <div className="container">{children}</div>
    </Tag>
  );
}
