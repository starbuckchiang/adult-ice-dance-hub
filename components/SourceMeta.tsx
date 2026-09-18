import { ExternalLink } from "@/components/ExternalLink";
import type { Source } from "@/data/types";
import { formatDate } from "@/lib/format";

export function SourceMeta({
  source,
  lastVerified,
}: {
  source?: Source;
  lastVerified: string;
}) {
  return (
    <p className="source-meta">
      來源：
      {source ? (
        <ExternalLink href={source.url}>{source.nameZh}</ExternalLink>
      ) : (
        "來源將依官方公告持續更新"
      )}
      <br />
      最後查證日期：{formatDate(lastVerified)}
    </p>
  );
}
