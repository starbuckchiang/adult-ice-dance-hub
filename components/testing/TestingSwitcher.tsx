"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { TestingProgram } from "@/data/types";
import { StatusBadge } from "@/components/StatusBadge";
import { ExternalLink } from "@/components/ExternalLink";
import { SourceMeta } from "@/components/SourceMeta";
import { getSource } from "@/lib/content";

export function TestingSwitcher({ programs }: { programs: TestingProgram[] }) {
  const [slug, setSlug] = useState(programs[0]?.slug ?? "usa");
  const current = useMemo(() => programs.find((item) => item.slug === slug) ?? programs[0], [programs, slug]);
  if (!current) return null;
  const source = getSource(current.sourceId);

  return (
    <div>
      <div className="chip-row" role="tablist" aria-label="國家與 ISU">
        {programs.map((item) => (
          <button
            key={item.slug}
            type="button"
            className={`text-chip ${item.slug === current.slug ? "is-active" : ""}`}
            onClick={() => setSlug(item.slug)}
          >
            {item.nameZh}
          </button>
        ))}
      </div>
      <article className="card-dark testing-card">
        <div className="badge-row">
          <StatusBadge status={current.status} />
          <span className="badge badge-phase">{current.season}</span>
        </div>
        <h2>
          {current.nameZh}
          <span className="muted"> {current.nameEn}</span>
        </h2>
        <p>管理協會：{current.federationZh}（{current.federationEn}）</p>
        <p>
          成人冰舞正式檢定：
          {current.hasFormalAdultDanceTests === "yes"
            ? "有公開可核對的測驗或評核制度"
            : current.hasFormalAdultDanceTests === "no"
              ? "不是全球／跨國統一檢定制度"
              : "公開資料尚不足以確認"}
        </p>
        <h3>雙人冰舞制度</h3>
        <p>{current.partneredSystem}</p>
        <h3>單人冰舞制度</h3>
        <p>{current.soloSystem}</p>
        <h3>等級路線</h3>
        <ul>
          {current.pathway.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <h3>報名資格</h3>
        <p>{current.eligibility}</p>
        <p>{current.notes}</p>
        <SourceMeta source={source} lastVerified={current.lastVerified} />
        <div className="button-row">
          <ExternalLink className="button" href={current.officialRuleUrl}>
            官方規則
          </ExternalLink>
          <ExternalLink className="button-secondary" href={current.applicationUrl}>
            申請或協會入口
          </ExternalLink>
          <Link className="button-secondary" href="/learn">
            返回學習中心
          </Link>
        </div>
      </article>
    </div>
  );
}
