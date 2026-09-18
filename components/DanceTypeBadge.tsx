import type { DanceType } from "@/data/types";
import { danceTypeShortLabel } from "@/lib/format";

export function DanceTypeBadge({ type }: { type: DanceType }) {
  return <span className={`badge badge-${type}`}>{danceTypeShortLabel[type]}</span>;
}
