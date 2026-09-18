import type { VerificationStatus } from "@/data/types";
import { statusLabel } from "@/lib/format";

export function StatusBadge({ status }: { status: VerificationStatus }) {
  return (
    <span className={`badge badge-${status}`}>
      {status === "unverified" ? "待查證" : statusLabel[status]}
    </span>
  );
}
