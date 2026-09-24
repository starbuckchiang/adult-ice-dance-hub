"use client";

import { useEffect, useState } from "react";
import {
  buildRouteCard,
  type CoachHelp,
  type PrepAnswers,
} from "@/lib/guides/taiwan-route-check";
import type { GateAnswers, TaiwanCompetition2026 } from "@/lib/guides/taiwan-competitions-2026";
import styles from "./TaiwanRouteCheck.module.css";

const COACH_OPTIONS: Array<{ value: CoachHelp; label: string }> = [
  { value: "assessment", label: "需要程度評估" },
  { value: "confirm-event", label: "需要確認參賽項目" },
  { value: "test-plan", label: "需要檢定規劃" },
  { value: "signature", label: "需要報名表簽名確認" },
  { value: "has-coach", label: "已有教練" },
  { value: "none", label: "暫不需要" },
];

export function TaiwanRouteCheck({
  competitions,
  eventId,
  gate,
  prep,
  onPrep,
  onClear,
  createdOn,
}: {
  competitions: TaiwanCompetition2026[];
  eventId: string;
  gate: GateAnswers;
  prep: PrepAnswers;
  onPrep: (next: PrepAnswers) => void;
  onClear: () => void;
  createdOn: string;
}) {
  const [preview, setPreview] = useState(false);
  const event = competitions.find((item) => item.id === eventId);
  const card = buildRouteCard(event, gate, prep);

  useEffect(() => {
    if (preview) document.documentElement.dataset.routePreview = "1";
    else delete document.documentElement.dataset.routePreview;
    return () => {
      delete document.documentElement.dataset.routePreview;
    };
  }, [preview]);

  function choose<K extends keyof PrepAnswers>(key: K, value: PrepAnswers[K]) {
    onPrep({ ...prep, [key]: value });
  }

  function toggleCoach(value: CoachHelp) {
    const has = prep.coachHelp.includes(value);
    onPrep({ ...prep, coachHelp: has ? prep.coachHelp.filter((item) => item !== value) : [...prep.coachHelp, value] });
  }

  return (
    <section className={preview ? `${styles.wrap} ${styles.preview}` : styles.wrap} id="route-check" data-cta-hide="">
      <header className={styles.intro}>
        <p className={styles.kicker}>Route Check</p>
        <h2>把目前程度與想參加的項目交給教練確認</h2>
      </header>

      <div className={styles.grid}>
        <form className={styles.questions} id="route-questions" onSubmit={(event) => event.preventDefault()}>
          <h2>你現在的準備狀態</h2>
          <p className={styles.note}>依目前狀況選擇，不需要等所有項目都準備好。</p>
          <fieldset>
            <legend>1. 是否已有節目？</legend>
            {(["none", "drafting", "complete"] as const).map((value) => (
              <label key={value}>
                <input type="radio" name="program" checked={prep.program === value} onChange={() => choose("program", value)} />
                {value === "none" ? "尚未" : value === "drafting" ? "編排中" : "已有完整節目"}
              </label>
            ))}
          </fieldset>
          <fieldset>
            <legend>2. 是否有比賽音樂？</legend>
            {(["none", "choosing", "edited"] as const).map((value) => (
              <label key={value}>
                <input type="radio" name="music" checked={prep.music === value} onChange={() => choose("music", value)} />
                {value === "none" ? "尚未" : value === "choosing" ? "選曲中" : "已剪輯完成"}
              </label>
            ))}
          </fieldset>
          <fieldset>
            <legend>3. 是否有找到舞伴？</legend>
            {(
              [
                ["have", "已有舞伴"],
                ["none", "尚未找到"],
                ["solo", "想參加Solo Dance"],
                ["unsure", "尚不確定項目"],
              ] as const
            ).map(([value, label]) => (
              <label key={value}>
                <input type="radio" name="partner" checked={prep.partner === value} onChange={() => choose("partner", value)} />
                {label}
              </label>
            ))}
          </fieldset>
          <fieldset>
            <legend>4. 是否需要在報名期限前完成檢定？</legend>
            {(
              [
                ["need", "需要"],
                ["no", "不需要"],
                ["unsure", "尚待確認"],
              ] as const
            ).map(([value, label]) => (
              <label key={value}>
                <input type="radio" name="test" checked={prep.test === value} onChange={() => choose("test", value)} />
                {label}
              </label>
            ))}
          </fieldset>
          <fieldset>
            <legend>5. 是否需要教練協助？</legend>
            {COACH_OPTIONS.map((item) => (
              <label key={item.value}>
                <input type="checkbox" checked={prep.coachHelp.includes(item.value)} onChange={() => toggleCoach(item.value)} />
                {item.label}
              </label>
            ))}
          </fieldset>
          <p className={styles.live}>每完成一題，參賽路線卡會同步調整答案摘要、本週任務與下一步支援。</p>
        </form>

        <div className={styles.rail}>
        <article className={styles.card} id="route-card" aria-live="polite">
          <p className={styles.kicker}>我的第一份參賽路線卡</p>
          <h2>可與教練討論的第一步</h2>
          <p className={styles.note}>產生日期 {createdOn || "—"}</p>
          <h3>我的答案摘要</h3>
          <dl>
            <div><dt>目標賽事</dt><dd>{card.eventName}</dd></div>
            <div><dt>想參加的項目</dt><dd>{card.discipline}</dd></div>
            <div><dt>目前程度</dt><dd>{card.level}</dd></div>
            <div><dt>節目狀態</dt><dd>{card.program}</dd></div>
            <div><dt>音樂狀態</dt><dd>{card.music}</dd></div>
            <div><dt>舞伴狀態</dt><dd>{card.partner}</dd></div>
            <div><dt>檢定狀態</dt><dd>{card.test}</dd></div>
            <div><dt>教練協助需求</dt><dd>{card.coachHelp}</dd></div>
          </dl>
          <h3>本週可先完成的三件事</h3>
          {card.tasks.length ? (
            <ol className={styles.steps}>
              {card.tasks.map((task) => (
                <li key={task.title}>
                  <strong>{task.title}</strong>
                  <span>{task.detail}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p>尚待回答</p>
          )}
          <div className={styles.actions}>
            {preview ? null : (
              <button className={styles.secondary} type="button" onClick={() => setPreview(true)}>
                整頁預覽
              </button>
            )}
            <button className={styles.primary} type="button" onClick={() => window.print()}>
              列印／另存PDF
            </button>
          </div>
          <p className={styles.disclaimer}>本卡為參賽規劃摘要，不代表主辦單位或教練的正式資格核定。</p>
        </article>
        <section className={styles.nextPanel} aria-label="Next Experience Support">
          <div className={styles.parts}>
            <div>
              <p>NEXT</p>
              <h3>仍可規劃的賽事</h3>
              <span>只顯示尚可準備或待正式公告的機會。</span>
            </div>
            <div>
              <p>EXPERIENCE</p>
              <h3>別人的第一次參賽</h3>
              <span>從真實準備經驗理解時間與工作量。</span>
            </div>
            <div>
              <p>SUPPORT</p>
              <h3>需要人協助判斷？</h3>
              <span>整理規則、報名與參賽準備需求。</span>
            </div>
          </div>
        </section>
        </div>
      </div>

      {preview ? (
        <button className={styles.exit} type="button" onClick={() => setPreview(false)}>
          返回編輯
        </button>
      ) : null}

      <div className={styles.sources} id="official-sources">
        <h2>官方來源</h2>
        <ul>
          {competitions.map((item) => (
            <li key={item.id}>
              {item.nameZh}
              {item.officialNoticeUrl ? (
                <a href={item.officialNoticeUrl} target="_blank" rel="noreferrer">
                  公告
                </a>
              ) : null}
              <span>查證 {item.verifiedAt}</span>
            </li>
          ))}
        </ul>
        <p>項目是否開放、檢定條件與教練簽名資格，以中華民國滑冰協會及該場主辦單位公告為準。</p>
        <button className={styles.secondary} type="button" onClick={onClear}>
          清除並重新填寫
        </button>
      </div>
    </section>
  );
}
