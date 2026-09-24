"use client";

import { useState } from "react";
import {
  EMPTY_GATE,
  evaluateGate,
  gateVerdictLabel,
  type GateAnswers,
  type TaiwanCompetition2026,
} from "@/lib/guides/taiwan-competitions-2026";
import styles from "./TaiwanGateScreen.module.css";

const DEMO = {
  title: "先處理教練簽署，不是先繳註冊費",
  verdict: "需要向主辦單位確認",
  detail: "你目前沒有固定教練，而報名表出現教練簽名欄。先確認能否以自主選手報名，以及簽名者需要具備哪些資格。",
  nextSteps: [
    "確認目標比賽與成人項目",
    "附上報名表或截圖詢問主辦單位",
    "確認能否以自主選手報名",
    "確認簽名者是否須具備特定教練資格",
    "若必須簽署，安排一次性參賽評估",
  ],
};

function isClosed(item: TaiwanCompetition2026, now: Date) {
  if (item.status === "completed") return true;
  if (!item.registrationDeadline) return false;
  const deadline = new Date(item.registrationDeadline);
  return !Number.isNaN(deadline.getTime()) && deadline.getTime() < now.getTime();
}

export function TaiwanGateScreen({
  competitions,
  now,
  answers: answersProp,
  eventId: eventIdProp,
  onAnswers,
  onEventId,
  sectionId = "eligibility",
  flow = false,
}: {
  competitions: TaiwanCompetition2026[];
  now: Date;
  answers?: GateAnswers;
  eventId?: string;
  onAnswers?: (next: GateAnswers) => void;
  onEventId?: (next: string) => void;
  sectionId?: string;
  flow?: boolean;
}) {
  const [localAnswers, setLocalAnswers] = useState<GateAnswers>(EMPTY_GATE);
  const [localEventId, setLocalEventId] = useState(competitions[2]?.id ?? competitions[0]?.id ?? "");
  const answers = answersProp ?? localAnswers;
  const eventId = eventIdProp ?? localEventId;
  const result = evaluateGate(answers);
  const selected = competitions.find((item) => item.id === eventId) ?? competitions[0];
  const card = result
    ? { title: result.title, verdict: gateVerdictLabel(result.verdict), detail: result.detail, nextSteps: result.nextSteps }
    : DEMO;
  const sourceHref = selected?.rulesUrl || selected?.officialNoticeUrl;

  function patch(partial: Partial<GateAnswers>) {
    const next = { ...answers, ...partial };
    if (onAnswers) onAnswers(next);
    else setLocalAnswers(next);
  }

  function changeEvent(next: string) {
    if (onEventId) onEventId(next);
    else setLocalEventId(next);
  }

  return (
    <div className={styles.screen} id={sectionId}>
      <header className={styles.intro}>
        <p className={styles.kicker}>Taiwan Adult Competition Roadmap</p>
        <h1>想站上成人賽場，先確認你有沒有可報名的組別</h1>
        <p className={styles.lede}>
          台灣成人參賽機會不一定以「成人冰舞賽」命名，也可能出現在公開賽、成人組、單人冰舞或其他適用組別中，不用先讀完全部規章，先依序確認參賽項目、檢定及技術門檻與是否需教練簽署；三關均通過後，再完成協會年度選手註冊與正式報名。
        </p>
      </header>

      <div className={styles.columns}>
        <section className={styles.gates} aria-labelledby="gate-heading">
          <h2 id="gate-heading">你的參賽資格，先看這 4 關</h2>
          <p className={styles.hint}>年度選手註冊是必要行政門檻，但不是第一個要解決的問題。</p>

          <article className={styles.gate} id="gate-event">
            <div className={styles.gateHead}>
              <span className={styles.index}>1</span>
              <div>
                <h3>比賽有適合你的成人項目嗎？</h3>
                <p>成人花式、Solo Dance 與 Partnered Dance 的開放狀況不同。</p>
              </div>
              <span className={styles.tag}>先判斷</span>
            </div>
            <label>
              目標比賽
              <select value={eventId} onChange={(event) => changeEvent(event.target.value)}>
                {competitions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nameZh}
                    {isClosed(item, now) ? "（已截止，參考）" : ""}
                  </option>
                ))}
              </select>
            </label>
            {selected ? (
              <p className={styles.source}>
                {isClosed(selected, now) ? "報名已截止，以下只作參考。" : "報名狀態仍以主辦最新公告為準。"}
                已列出項目：{selected.disciplines?.join("、") || "規程尚未列出成人項目"}。
                {sourceHref ? (
                  <a href={sourceHref} target="_blank" rel="noreferrer">
                    官方來源
                  </a>
                ) : null}
                <span>查證 {selected.verifiedAt}</span>
              </p>
            ) : null}
            {flow ? (
              <label>
                想參加的項目
                <select
                  value={answers.discipline ?? ""}
                  onChange={(event) => patch({ discipline: event.target.value as GateAnswers["discipline"] })}
                >
                  <option value="">請選擇</option>
                  <option value="adult-singles">成人花式</option>
                  <option value="solo-dance">Solo Dance</option>
                  <option value="partnered-dance">Partnered Dance</option>
                  <option value="unsure">尚不確定項目</option>
                </select>
              </label>
            ) : null}
            <label>
              你要報的項目是否寫在這場規程裡？
              <select value={answers.eventFit} onChange={(event) => patch({ eventFit: event.target.value as GateAnswers["eventFit"] })}>
                <option value="">請選擇</option>
                <option value="listed">規程有列出</option>
                <option value="not-listed">規程沒有列出</option>
                <option value="unknown">規程尚未公布，需要向主辦單位確認</option>
              </select>
            </label>
          </article>

          <article className={styles.gate}>
            <div className={styles.gateHead}>
              <span className={styles.index}>2</span>
              <div>
                <h3>你的檢定級別符合嗎？</h3>
                <p>級別不足，先安排最近可完成的檢定。</p>
              </div>
              <span className={styles.tag}>技術門檻</span>
            </div>
            <label>
              對照該項目的正式資格
              <select value={answers.level} onChange={(event) => patch({ level: event.target.value as GateAnswers["level"] })}>
                <option value="">請選擇</option>
                <option value="meets">已對照規程，級別符合</option>
                <option value="short">級別不足</option>
                <option value="unknown">規程沒有寫檢定條件</option>
              </select>
            </label>
            <p className={styles.source}>
              這是檢定門檻，與教練簽名、年度註冊分開。來源與第 1 關相同，查證 {selected?.verifiedAt ?? "2026-09-22"}。
            </p>
          </article>

          <article className={styles.gate}>
            <div className={styles.gateHead}>
              <span className={styles.index}>3</span>
              <div>
                <h3>沒有教練，報名表由誰確認？</h3>
                <p>必要時向主辦單位確認，或安排一次性參賽評估。</p>
              </div>
              <span className={styles.tag}>你的現況</span>
            </div>
            <label>
              教練現況
              <select value={answers.coach} onChange={(event) => patch({ coach: event.target.value as GateAnswers["coach"] })}>
                <option value="">請選擇</option>
                <option value="has-coach">已有教練</option>
                <option value="no-regular">沒有固定教練</option>
                <option value="unsure">尚不確定</option>
              </select>
            </label>
            <label>
              報名表的教練簽名欄
              <select value={answers.signature} onChange={(event) => patch({ signature: event.target.value as GateAnswers["signature"] })}>
                <option value="">請選擇</option>
                <option value="required">報名表要求教練簽名</option>
                <option value="unsure">尚不確定是否必須簽名</option>
                <option value="not-required">已向主辦確認可不簽名</option>
              </select>
            </label>
            <p className={styles.source}>
              公開規程沒有寫成「沒有教練就不能參賽」。不要自行簽名，也不要找不具資格的人代簽。這項需向主辦單位確認。查證 {selected?.verifiedAt ?? "2026-09-22"}。
            </p>
          </article>

          <article className={styles.gate}>
            <div className={styles.gateHead}>
              <span className={styles.index}>4</span>
              <div>
                <h3>完成當年度選手註冊</h3>
                <p>前三關可行後，再完成協會年度註冊、繳費與正式報名。</p>
              </div>
              <span className={styles.tag}>硬性行政門檻</span>
            </div>
            <p className={styles.source}>
              2026 全國花式滑冰菁英錦標賽規程寫明參賽者須為協會註冊選手，並另列年度註冊費。該場已結束，費用只供對照，不代表本季其他賽事。前一年註冊不會自動延續。
              <a href="https://ctsu.com.tw/2026/2026-ct-finger-skating-elites-cup/" target="_blank" rel="noreferrer">
                協會公告
              </a>
              <span>查證 2026-09-22</span>
            </p>
          </article>
        </section>

        <aside className={styles.result} aria-live="polite">
          <p className={styles.kicker}>{result ? "依你目前的選擇" : "依你目前提供的狀況"}</p>
          <h2>{card.title}</h2>
          <p className={styles.verdict}>{card.verdict}</p>
          <p>{card.detail}</p>
          <ol>
            {card.nextSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <a className={styles.primary} href="#gate-event">
            開始資格檢查
          </a>
          <a className={styles.secondary} href="#organizer-contacts">
            查看主辦單位聯絡方式
          </a>
          {flow ? (
            <div className={styles.previewContacts}>
              <h3>主辦單位聯絡方式</h3>
              <ul>
                {competitions.map((item) => (
                  <li key={item.id}>
                    <strong>{item.nameZh}</strong>
                    {isClosed(item, now) ? "（已截止，參考資料）" : ""}
                    {item.officialNoticeUrl ? (
                      <a href={item.officialNoticeUrl} target="_blank" rel="noreferrer">
                        官方公告
                      </a>
                    ) : null}
                    <span>查證 {item.verifiedAt}</span>
                  </li>
                ))}
              </ul>
              <p>臺中市長盃承辦信箱見該場公告頁：tcfscrm@c-tek.com.tw。全國賽請用中華民國滑冰協會公告上的聯絡方式。</p>
            </div>
          ) : null}
        </aside>
      </div>

      {flow ? null : (
      <>
      <div className={styles.after} id="after-gates">
        <div>
          <h2>通過資格閘門之後</h2>
          <p>接著才展開備賽時間軸、預算、節目準備與參賽支援，避免先投入大量時間，最後才發現無法報名。</p>
        </div>
        <a className={styles.primary} href="#prep-steps">
          建立備賽計畫
        </a>
      </div>

      <section className={styles.contacts} id="organizer-contacts">
        <h2>主辦單位聯絡方式</h2>
        <ul>
          {competitions.map((item) => (
            <li key={item.id}>
              <strong>{item.nameZh}</strong>
              {isClosed(item, now) ? "（已截止，參考資料）" : ""}
              {item.officialNoticeUrl ? (
                <a href={item.officialNoticeUrl} target="_blank" rel="noreferrer">
                  官方公告
                </a>
              ) : null}
              <span>查證 {item.verifiedAt}</span>
            </li>
          ))}
        </ul>
        <p>臺中市長盃承辦信箱見該場公告頁：tcfscrm@c-tek.com.tw。全國賽請用中華民國滑冰協會公告上的聯絡方式。</p>
      </section>
      </>
      )}
    </div>
  );
}
