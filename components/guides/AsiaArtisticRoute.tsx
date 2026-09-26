"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ASIA_FAQS,
  DIRECTIONS,
  EMPTY_ASIA,
  GATES,
  asiaCatalog,
  buildAsiaRoute,
  clearAsiaAnswers,
  loadAsiaAnswers,
  progressOf,
  saveAsiaAnswers,
  type AsiaAnswers,
  type DirectionId,
  type EventChoice,
  type GateId,
  type GateState,
  type LevelState,
  type PartnerState,
  type PrepState,
  type TriState,
} from "@/lib/guides/asia-artistic-2027";
import styles from "./AsiaArtisticRoute.module.css";

const HELP_OPTIONS = ["確認章程與項目", "確認 ISI 級別", "找代表冰場", "確認動作限制", "找舞伴", "節目與音樂"];

function todayTaipei() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Taipei" }).format(new Date());
}

export function AsiaArtisticRoute() {
  const [answers, setAnswers] = useState<AsiaAnswers>(EMPTY_ASIA);
  const [ready, setReady] = useState(false);
  const [preview, setPreview] = useState(false);
  const card = useMemo(() => buildAsiaRoute(answers), [answers]);
  const progress = useMemo(() => progressOf(answers), [answers]);

  useEffect(() => {
    const stored = loadAsiaAnswers();
    if (stored) setAnswers(stored);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveAsiaAnswers({ ...answers, createdOn: answers.createdOn || todayTaipei() });
  }, [answers, ready]);

  useEffect(() => {
    document.documentElement.dataset.asiaPreview = preview ? "1" : "";
    return () => {
      delete document.documentElement.dataset.asiaPreview;
    };
  }, [preview]);

  function patch(partial: Partial<AsiaAnswers>) {
    setAnswers((current) => ({ ...current, ...partial, createdOn: current.createdOn || todayTaipei() }));
  }

  function setGate(id: GateId, value: GateState) {
    setAnswers((current) => ({
      ...current,
      createdOn: current.createdOn || todayTaipei(),
      gates: { ...current.gates, [id]: value },
    }));
  }

  function toggleHelp(item: string) {
    setAnswers((current) => ({
      ...current,
      createdOn: current.createdOn || todayTaipei(),
      help: current.help.includes(item) ? current.help.filter((value) => value !== item) : [...current.help, item],
    }));
  }

  function clearLocal() {
    clearAsiaAnswers();
    setAnswers(EMPTY_ASIA);
    setPreview(false);
  }

  return (
    <div className={`${styles.page} ${preview ? styles.preview : ""}`}>
      <section className={styles.hero}>
        <div>
          <p className={styles.kicker}>2027 ASIA ARTISTIC SKATING ROADMAP</p>
          <h1>不用先拚技術分，也能規劃你的第一場亞洲賽</h1>
          <p className={styles.lede}>
            從表演方向、ISI 級別到代表冰場，先找出適合你的參賽路線，再交由教練、冰場或主辦單位確認。
          </p>
          <div className={styles.heroActions}>
            <a className={styles.primary} href="#route-check">
              開始路線檢查
            </a>
            <a className={styles.secondary} href="#candidate-events">
              查看候選賽事
            </a>
          </div>
        </div>
        <aside className={styles.progressCard} aria-label="我的亞洲參賽路線">
          <p className={styles.progressTitle}>我的亞洲參賽路線</p>
          <ol>
            {progress.map((step, index) => (
              <li key={step.id} data-done={step.done ? "1" : "0"}>
                <span>{index + 1}</span>
                {step.label}
              </li>
            ))}
          </ol>
          <p className={styles.stamp}>Same ice. More possibilities.</p>
        </aside>
        <div className={styles.ice} aria-hidden="true" />
      </section>

      <section className={styles.block} id="route-check">
        <span id="step-1" />
        <p className={styles.stepNo}>1</p>
        <h2>你想呈現什麼？</h2>
        <p>先選擇最接近你的表演方向，系統會提供優先研究的項目；這不是正式分組結果。</p>
        <div className={styles.choiceGrid}>
          {DIRECTIONS.map((item) => (
            <label key={item.id} className={answers.direction === item.id ? styles.selected : ""}>
              <input
                type="radio"
                name="direction"
                checked={answers.direction === item.id}
                onChange={() => patch({ direction: item.id as DirectionId })}
              />
              <strong>{item.title}</strong>
              <span>{item.text}</span>
              <em>優先研究方向 {item.focus}</em>
            </label>
          ))}
        </div>
      </section>

      <section className={styles.block} id="candidate-events">
        <span id="step-2" />
        <p className={styles.stepNo}>2</p>
        <h2>先看兩場候選賽事</h2>
        <div className={styles.eventGrid}>
          {asiaCatalog.events.map((event) => (
            <article key={event.id} className={answers.eventId === event.id ? styles.selectedEvent : ""}>
              <p className={styles.city}>{event.city}</p>
              <h3>{event.nameEn}</h3>
              <p>{event.venue}</p>
              <p className={styles.date}>{event.dateLabel}</p>
              <p className={styles.tags}>
                <span>{event.dateStatusLabel}</span>
                <span>{event.programStatusLabel}</span>
              </p>
              <p className={styles.meta}>
                查證 {asiaCatalog.verifiedAt} · {asiaCatalog.sourceName}
              </p>
              <div className={styles.eventActions}>
                <a href={asiaCatalog.sourceUrl} target="_blank" rel="noreferrer">
                  查看官方資訊
                </a>
                <button type="button" onClick={() => patch({ eventId: event.id as EventChoice })}>
                  加入我的路線
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.block} id="gates">
        <span id="step-3" />
        <p className={styles.stepNo}>3</p>
        <h2>報名前的 5 道資格閘門</h2>
        <ol className={styles.gates}>
          {GATES.map((gate, index) => (
            <li key={gate.id}>
              <p>
                <span>{index + 1}</span>
                {gate.label}
              </p>
              <div>
                {(
                  [
                    ["confirmed", "已確認"],
                    ["unconfirmed", "尚未確認"],
                    ["need-help", "需要協助"],
                  ] as const
                ).map(([value, label]) => (
                  <label key={value}>
                    <input
                      type="radio"
                      name={gate.id}
                      checked={answers.gates[gate.id] === value}
                      onChange={() => setGate(gate.id, value as GateState)}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </li>
          ))}
        </ol>
        <p className={styles.disclaimer}>
          本工具提供規劃方向，不代表主辦單位正式資格審核。最終項目、級別、代表單位與報名資格，以該場章程、教練、冰場及主辦單位確認為準。
        </p>
      </section>

      <section className={styles.block} id="details">
        <h2>補上路線卡需要的現況</h2>
        <p>這些答案只存在這台瀏覽器，不會送進追蹤或紀錄。</p>
        <div className={styles.formGrid}>
          <label>
            目前 ISI／ISIAsia 測試級別
            <select value={answers.level} onChange={(event) => patch({ level: event.target.value as LevelState })}>
              <option value="">請選擇</option>
              <option value="unknown">尚未確認</option>
              <option value="basic">基本級（Pre-Alpha 至 Delta）</option>
              <option value="fs-1-4">Freestyle 1–4</option>
              <option value="fs-5-10">Freestyle 5–10</option>
              <option value="other">其他，需向教練確認</option>
            </select>
          </label>
          <Choice name="coach" legend="是否已有教練" value={answers.coach} onChange={(coach) => patch({ coach: coach as TriState })} options={[["yes", "已有"], ["no", "尚未"], ["unsure", "尚不確定"]]} />
          <Choice name="rink" legend="是否已有可代表報名的冰場或俱樂部" value={answers.rink} onChange={(rink) => patch({ rink: rink as TriState })} options={[["yes", "已有"], ["no", "尚未"], ["unsure", "尚不確定"]]} />
          <Choice name="program" legend="是否已有節目" value={answers.program} onChange={(program) => patch({ program: program as PrepState })} options={[["none", "尚未"], ["drafting", "編排中"], ["ready", "已有初稿"]]} />
          <Choice name="music" legend="是否已有比賽音樂" value={answers.music} onChange={(music) => patch({ music: music as PrepState })} options={[["none", "尚未"], ["drafting", "選曲中"], ["ready", "已剪好"]]} />
          <Choice name="costume" legend="是否已有服裝／角色設定" value={answers.costume} onChange={(costume) => patch({ costume: costume as PrepState })} options={[["none", "尚未"], ["drafting", "構思中"], ["ready", "已有方向"]]} />
          <Choice name="partner" legend="是否已有舞伴" value={answers.partner} onChange={(partner) => patch({ partner: partner as PartnerState })} options={[["have", "已有"], ["none", "尚未"], ["not-needed", "這次不需要"], ["unsure", "尚不確定"]]} />
          <Choice name="event-pref" legend="希望參加哪一場" value={answers.eventId} onChange={(eventId) => patch({ eventId: eventId as EventChoice })} options={[["hk-cpir-2027", "香港"], ["sz-skate-asia-2027", "深圳"], ["undecided", "尚未決定"]]} />
        </div>
        <fieldset className={styles.help}>
          <legend>哪些事項需要協助</legend>
          {HELP_OPTIONS.map((item) => (
            <label key={item}>
              <input type="checkbox" checked={answers.help.includes(item)} onChange={() => toggleHelp(item)} />
              {item}
            </label>
          ))}
        </fieldset>
      </section>

      <article className={styles.card} id="asia-route-card" data-cta-hide="">
        <span id="step-4" />
        <p className={styles.kicker}>ROUTE CARD</p>
        <h2>我的第一份參賽路線卡</h2>
        <p className={styles.meta}>產生日期 {answers.createdOn || "—"}</p>
        <h3>路線摘要</h3>
        <dl>
          <Summary label="表演方向" value={card.direction} pending={card.pending.direction} />
          <Summary label="優先研究項目" value={card.focus} pending={card.pending.focus} />
          <Summary label="首選候選賽事" value={card.eventName} pending={card.pending.eventName} />
          <Summary label="賽事資料狀態" value={card.eventStatus} pending={card.pending.eventStatus} />
          <Summary label="目前 ISI 級別" value={card.level} pending={card.pending.level} />
          <Summary label="教練狀態" value={card.coach} pending={card.pending.coach} />
          <Summary label="代表冰場／俱樂部" value={card.rink} pending={card.pending.rink} />
          <Summary label="節目狀態" value={card.program} pending={card.pending.program} />
          <Summary label="音樂狀態" value={card.music} pending={card.pending.music} />
          <Summary label="服裝／角色" value={card.costume} pending={card.pending.costume} />
          <Summary label="舞伴狀態" value={card.partner} pending={card.pending.partner} />
          <div>
            <dt>資格確認狀態</dt>
            <dd>{card.verdict}</dd>
          </div>
        </dl>
        <h3>本週先完成三件事</h3>
        <ol className={styles.tasks}>
          {card.tasks.map((task) => (
            <li key={task.title}>
              <strong>{task.title}</strong>
              <span>{task.detail}</span>
            </li>
          ))}
        </ol>
        <div className={styles.support}>
          <p>NEXT</p>
          <h3>{card.support.title}</h3>
          <span>{card.support.detail}</span>
          <a href={card.support.href} {...(card.support.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}>
            {card.support.cta}
          </a>
        </div>
        <p className={styles.disclaimer}>本工具提供規劃方向，不代表主辦單位正式資格審核。</p>
        <p className={styles.meta}>
          來源 {asiaCatalog.sourceName} · 查證 {asiaCatalog.verifiedAt}
        </p>
        <div className={styles.actions} id="step-5">
          {preview ? null : (
            <button className={styles.secondary} type="button" onClick={() => setPreview(true)}>
              整頁預覽
            </button>
          )}
          <button className={styles.primary} type="button" onClick={() => window.print()}>
            列印／另存 PDF
          </button>
        </div>
      </article>

      {preview ? (
        <button className={styles.exit} type="button" onClick={() => setPreview(false)}>
          返回編輯
        </button>
      ) : null}

      <div className={styles.more}>
        {ASIA_FAQS.map((item) => (
          <details key={item.q}>
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
        <details>
          <summary>常見問題</summary>
          <p>這張路線卡不能代替報名，也不保證資格。項目未寫進該場章程之前，狀態維持待章程確認。</p>
        </details>
        <details>
          <summary>官方資料來源</summary>
          <p>
            <a href={asiaCatalog.sourceUrl} target="_blank" rel="noreferrer">
              {asiaCatalog.sourceName}
            </a>
            ，查證 {asiaCatalog.verifiedAt}。Artistic Solo、Solo Spotlight、Couple Spotlight 是否開辦，兩場都還沒有章程。
          </p>
        </details>
      </div>

      <p className={styles.localNote}>
        路線資料只儲存在目前瀏覽器。
        <button type="button" onClick={clearLocal}>
          清除本機資料
        </button>
      </p>
    </div>
  );
}

function Summary({ label, value, pending }: { label: string; value: string; pending?: boolean }) {
  return (
    <div className={pending ? styles.pending : undefined}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function Choice({
  name,
  legend,
  value,
  options,
  onChange,
}: {
  name: string;
  legend: string;
  value: string;
  options: readonly (readonly [string, string])[];
  onChange: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend>{legend}</legend>
      {options.map(([option, label]) => (
        <label key={option}>
          <input type="radio" name={name} checked={value === option} onChange={() => onChange(option)} />
          {label}
        </label>
      ))}
    </fieldset>
  );
}
