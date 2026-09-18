import { Children, type ReactNode } from "react";
import { AdSlot } from "@/components/ads/AdSlot";

export function AdList({
  children,
  className = "grid",
}: {
  children: ReactNode;
  className?: string;
}) {
  const items = Children.toArray(children);
  const midpoint = Math.floor(items.length / 2);

  return (
    <div className={className}>
      {items.slice(0, midpoint)}
      <AdSlot placementCode="LIST_INLINE" />
      {items.slice(midpoint)}
    </div>
  );
}
