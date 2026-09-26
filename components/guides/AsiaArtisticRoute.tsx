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
import { Breadcrumbs } from "@/components/nav/Breadcrumbs";
import type { Crumb } from "@/lib/seo";
import styles from "./AsiaArtisticRoute.module.css";

const HELP_OPTIONS = ["確認章程與項目", "確認 ISI 級別", "找代表冰場", "確認動作限制", "找舞伴", "節目與音樂"];

const STEP_LINKS: Record<string, string> = {
  direction: "#route-check",
  gates: "#gates",
  event: "#candidate-events",
  program: "#details",
};

function StepMark({ id }: { id: string }) {
  if (id === "gates") {
    return (
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path fill="currentColor" d="M6.4 11.2 3.2 8l1.1-1.1 2.1 2.1 5.3-5.3L12.8 4.8z" />
      </svg>
    );
  }
  if (id === "event") {
    return (
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path fill="currentColor" d="M8 1.4a4.2 4.2 0 0 0-4.2 4.2c0 3.2 4.2 8.6 4.2 8.6s4.2-5.4 4.2-8.6A4.2 4.2 0 0 0 8 1.4Zm0 5.7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z" />
      </svg>
    );
  }
  if (id === "program") {
    return (
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path fill="currentColor" d="M4 2.2h6.2L13 5v8.8H4V2.2Zm5.4 1.2v2.2H11.6L9.4 3.4ZM5.6 8h4.8V6.8H5.6V8Zm0 2.2h4.8V9H5.6v1.2Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path fill="currentColor" d="M8 1.6 9.2 6h4.6L10.3 8.7l1.2 4.5L8 10.9 4.5 13.2l1.2-4.5L2.2 6h4.6L8 1.6Z" />
    </svg>
  );
}

function DirectionGlyph({ id }: { id: string }) {
  if (id === "character") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M8.2 4.2a3.2 3.2 0 0 0-3.1 4.4 6.4 6.4 0 0 0 1.2 7.1L4 19.6h7.2l-2.1-3.6a6.4 6.4 0 0 0 1.4-6.6 3.2 3.2 0 0 0-2.3-5.2Zm7.6 1.2a2.6 2.6 0 0 0-2.4 3.6 5.2 5.2 0 0 0 .8 5.6L13 18.2h6.2l-1.4-2.6a5.2 5.2 0 0 0 1-5.4 2.6 2.6 0 0 0-2-4.8Z" />
      </svg>
    );
  }
  if (id === "pairs") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M8 4.2a2.2 2.2 0 1 0 0 4.4 2.2 2.2 0 0 0 0-4.4Zm8 1.2a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM5.2 10.2 3 19.8h3.2l1.2-4.2 1.4 4.2h3.1l-2.4-9.6H5.2Zm7.2.6 1.6 4.4-1.5 4.6h3.2l2.2-5.2 2.1 5.2H23l-2.6-9H12.4Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M10 3.2v11.2a3.2 3.2 0 1 1-1.8-2.9V7.4l8-1.8v6.2a3.2 3.2 0 1 1-1.8-2.9V3.2L10 3.2Z" />
    </svg>
  );
}

function SummaryIcon({ kind, directionId }: { kind: "direction" | "focus" | "event" | "status"; directionId?: string }) {
  if (kind === "direction") {
    return directionId ? <DirectionGlyph id={directionId} /> : (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M12 2.4 13.8 9h6.9l-5.6 4.1 2.1 6.7L12 16.4 6.8 19.8l2.1-6.7L3.3 9h6.9L12 2.4Z" />
      </svg>
    );
  }
  if (kind === "focus") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M10.2 3.4a6.8 6.8 0 1 0 4.2 12.1l4.3 4.3 1.7-1.7-4.3-4.3A6.8 6.8 0 0 0 10.2 3.4Zm0 2.2a4.6 4.6 0 1 1 0 9.2 4.6 4.6 0 0 1 0-9.2Z" />
      </svg>
    );
  }
  if (kind === "event") return <PlacePin />;
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M9.2 16.6 4.6 12l1.8-1.8 2.8 2.8 7.4-7.4L18.4 7.4 9.2 16.6Z" />
    </svg>
  );
}

function PlacePin() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2.2a6.2 6.2 0 0 0-6.2 6.2c0 4.6 6.2 12.4 6.2 12.4s6.2-7.8 6.2-12.4A6.2 6.2 0 0 0 12 2.2Zm0 8.4a2.2 2.2 0 1 1 0-4.4 2.2 2.2 0 0 1 0 4.4Z"
      />
    </svg>
  );
}

function HelpGlyph({ item }: { item: string }) {
  if (item === "確認章程與項目") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M6 3.2h8.4L18 6.8V20.8H6V3.2Zm7.6 1.6v3.2H17L13.6 4.8ZM8.2 12h7.6v-1.6H8.2V12Zm0 3.2h7.6v-1.6H8.2v1.6Z" />
      </svg>
    );
  }
  if (item === "確認 ISI 級別") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M12 2.6 14.2 8l5.8.4-4.4 3.8 1.4 5.6L12 15.2 6.9 17.8l1.4-5.6L4 8.4 9.8 8 12 2.6Zm0 4.2-1 2.6-2.8.2 2.2 1.8-.7 2.8L12 12.6l2.3 1.6-.7-2.8 2.2-1.8-2.8-.2L12 6.8Z" />
      </svg>
    );
  }
  if (item === "找代表冰場") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M4 9.2 12 4l8 5.2V20H4V9.2Zm2.2 9.2h11.6v-8.2L12 6.4 6.2 10.2V18.4ZM8 14.2h8v-1.6H8v1.6Zm0 2.8h5.2V15.4H8v1.6Z" />
      </svg>
    );
  }
  if (item === "確認動作限制") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M12 3.2a8.8 8.8 0 1 0 0 17.6 8.8 8.8 0 0 0 0-17.6Zm0 2a6.8 6.8 0 0 1 5.2 11.2L7.6 6.8A6.7 6.7 0 0 1 12 5.2Zm-5.2 8.4 9.6 9.6A6.8 6.8 0 0 1 6.8 13.6Z" />
      </svg>
    );
  }
  if (item === "找舞伴") return <DirectionGlyph id="pairs" />;
  return <DirectionGlyph id="music" />;
}

function todayTaipei() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Taipei" }).format(new Date());
}

export function AsiaArtisticRoute({ crumbs }: { crumbs: Crumb[] }) {
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
        <div className={styles.banner} aria-hidden="true">
          <img src="/images/asia-2027-banner.jpg" alt="" />
        </div>
        <div className={styles.heroTop}>
          <Breadcrumbs items={crumbs} />
        </div>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>2027 ASIA ARTISTIC SKATING ROADMAP</p>
          <h1>
            不用先拚技術分，
            <br />
            也能規劃你的第一場<span className={styles.mark}>亞洲賽</span>
          </h1>
          <p className={styles.lede}>
            從表演方向、ISI 級別到代表冰場，先找出適合你的參賽路線。
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
            {progress.map((step) => (
              <li key={step.id} data-done={step.done ? "1" : "0"}>
                <a href={STEP_LINKS[step.id]}>
                  <span className={styles.progressMark}>
                    <StepMark id={step.id} />
                  </span>
                  <span className={styles.progressLabel}>{step.label}</span>
                </a>
              </li>
            ))}
          </ol>
        </aside>
      </section>

      <div className={styles.board}>
        <section className={styles.block} id="route-check">
          <span id="step-1" />
          <p className={styles.stepNo}>1</p>
          <h2>你想呈現什麼？</h2>
          <p>先選擇最接近你的表演方向，系統會提供優先研究的項目；這不是正式分組結果。</p>
          <div className={styles.choiceGrid}>
            {DIRECTIONS.map((item) => (
              <label key={item.id} className={answers.direction === item.id ? styles.selected : ""}>
                <span className={styles.choiceCopy}>
                  <strong>{item.title}</strong>
                  <span className={styles.choiceText}>
                    <DirectionGlyph id={item.id} />
                    {item.text}
                  </span>
                </span>
                <input
                  type="radio"
                  name="direction"
                  checked={answers.direction === item.id}
                  onChange={() => patch({ direction: item.id as DirectionId })}
                />
              </label>
            ))}
          </div>
        </section>

        <section className={`${styles.block} ${styles.eventColumn}`} id="candidate-events">
          <span id="step-2" />
          <p className={styles.stepNo}>2</p>
          <h2>先看兩場候選賽事</h2>
          <p>從亞洲區已公布的 ISIAsia 賽程裡，先看這兩場。</p>
          <div className={styles.eventGrid}>
            {asiaCatalog.events.map((event) => (
              <article key={event.id} className={answers.eventId === event.id ? styles.selectedEvent : ""}>
                <p className={styles.tags}>
                  <span>{event.dateStatusLabel}</span>
                </p>
                <h3>{event.city} {event.id === "hk-cpir-2027" ? "CPIR" : "Skate Asia"}</h3>
                <p className={styles.date}>{event.dateLabel}</p>
                <p className={styles.eventPlace}>
                  <PlacePin />
                  <span>{event.venue}</span>
                </p>
                <p className={styles.meta}>{event.programStatusLabel} · 查證 {asiaCatalog.verifiedAt}</p>
                <div className={styles.eventActions}>
                  <a href={asiaCatalog.sourceUrl} target="_blank" rel="noreferrer">
                    查看官方資訊
                  </a>
                  <button type="button" onClick={() => patch({ eventId: event.id as EventChoice })}>
                    加入路線規劃
                  </button>
                </div>
              </article>
            ))}
          </div>
          <div className={styles.columnScene} aria-hidden="true">
            <img src="/images/asia-2027-hk-skyline.jpg" alt="" />
          </div>
        </section>

        <section className={`${styles.block} ${styles.gateColumn}`} id="gates">
          <span id="step-3" />
          <p className={styles.stepNo}>3</p>
          <h2>報名前的 5 道資格閘門</h2>
          <p>先標出還沒確認的條件。勾選不是正式資格。</p>
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
        </section>
      </div>

      <section className={`${styles.block} ${styles.statusColumn}`} id="details">
        <p className={styles.stepNo}>4</p>
        <h2>個人現況補充說明</h2>
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
        <div className={styles.cardScene} aria-hidden="true">
          <img src="/images/asia-2027-route-card.jpg" alt="" />
        </div>
        <span id="step-4" />
        <div className={styles.cardHead}>
          <h2>我的第一份參賽路線卡</h2>
          <p className={styles.meta}>產生日期 {answers.createdOn || "—"}</p>
        </div>
        <div className={styles.cardBody}>
          <div>
            <h3>路線摘要</h3>
            <dl className={styles.chips}>
              <Summary label="表演方向" value={card.direction} pending={card.pending.direction} icon="direction" directionId={answers.direction} />
              <Summary label="優先研究" value={card.focus} pending={card.pending.focus} icon="focus" />
              <Summary label="首選" value={card.eventName} pending={card.pending.eventName} icon="event" />
              <Summary label="資格狀態" value={card.verdict} icon="status" />
            </dl>
            <dl>
              <Summary label="賽事資料狀態" value={card.eventStatus} pending={card.pending.eventStatus} />
              <Summary label="目前 ISI 級別" value={card.level} pending={card.pending.level} />
              <Summary label="教練狀態" value={card.coach} pending={card.pending.coach} />
              <Summary label="代表冰場／俱樂部" value={card.rink} pending={card.pending.rink} />
              <Summary label="節目狀態" value={card.program} pending={card.pending.program} />
              <Summary label="音樂狀態" value={card.music} pending={card.pending.music} />
              <Summary label="服裝／角色" value={card.costume} pending={card.pending.costume} />
              <Summary label="舞伴狀態" value={card.partner} pending={card.pending.partner} />
            </dl>
          </div>
          <div>
            <h3>本週先完成 3 件事</h3>
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
              {card.support.cta ? (
                <a href={card.support.href} {...(card.support.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}>
                  {card.support.cta}
                </a>
              ) : null}
            </div>
            {answers.help.length ? (
              <ul className={styles.helpList}>
                {HELP_OPTIONS.filter((item) => answers.help.includes(item)).map((item) => (
                  <li key={item}>
                    <HelpGlyph item={item} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
        <div className={styles.cardFoot}>
          <div>
            <p className={styles.disclaimer}>
              本工具提供規劃方向，不代表主辦單位正式資格審核。最終項目、級別、代表單位與報名資格，以該場章程、教練、冰場及主辦單位確認為準。
            </p>
            <p className={styles.meta}>
              來源 {asiaCatalog.sourceName} · 查證 {asiaCatalog.verifiedAt}
            </p>
          </div>
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

function Summary({
  label,
  value,
  pending,
  icon,
  directionId,
}: {
  label: string;
  value: string;
  pending?: boolean;
  icon?: "direction" | "focus" | "event" | "status";
  directionId?: string;
}) {
  return (
    <div className={pending ? styles.pending : undefined}>
      <dt>
        {icon ? <SummaryIcon kind={icon} directionId={directionId} /> : null}
        {label}
      </dt>
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
