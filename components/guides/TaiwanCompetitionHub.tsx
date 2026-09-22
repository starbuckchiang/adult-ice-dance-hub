"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { ExternalLink } from "@/components/ExternalLink";
import { LazyYouTubePlayer } from "@/components/watch/LazyYouTubePlayer";
import {
  CONTACT_MAILTO,
  CONTACT_PHONE_DISPLAY,
  CONTACT_TEL_HREF,
} from "@/lib/contact/config";
import {
  parseCompetitionSupportInquiry,
  type CompetitionSupportFieldErrors,
} from "@/lib/contact/competition-support";
import {
  BUDGET_CATEGORIES,
  EMPTY_BUDGET,
  EMPTY_ELIGIBILITY,
  EMPTY_EVENT_DAY,
  EMPTY_PLAN,
  EMPTY_RESULTS,
  EMPTY_SUPPORT,
  EVENT_DAY_MILESTONES,
  FAQ_ITEMS,
  PREP_PHASES,
  STORAGE_KEYS,
  SUPPORT_SERVICES,
  TAIWAN_GUIDE_PATH,
  type BudgetState,
  type DisciplineChoice,
  type EligibilityState,
  type PlanState,
  type ResultRecord,
  type ResultsState,
  type SupportState,
  type TaiwanCompetition2026,
  buildBudgetSummary,
  buildResultSummary,
  buildSupportSummary,
  budgetTotals,
  confirmedAdultCount,
  confirmedFeeText,
  countdownLabel,
  eligibilityLabel,
  emptyResultRecord,
  evaluateEligibility,
  formatDateRange,
  formatZhDate,
  getTaiwanCompetitions2026,
  groupCompetitions,
  hasOfficialDate,
  latestVerifiedAt,
  nearestOpenDeadline,
  nextCompetition,
  outcomeLabel,
  parseTaipeiDate,
  readStorage,
  resolveRuntimeStatus,
  seedBudgetFromCompetition,
  statusLabel,
  twd,
  writeStorage,
  youtubeIdFromUrl,
} from "@/lib/guides/taiwan-competitions-2026";
import styles from "./TaiwanCompetitionHub.module.css";

type FormStatus = "idle" | "submitting" | "success" | "unconfigured" | "unavailable";

const YES_NO = [
  { value: "", label: "請選擇" },
  { value: "yes", label: "是" },
  { value: "no", label: "否" },
];

function copyText(value: string) {
  return navigator.clipboard.writeText(value);
}

function CompetitionCard({
  competition,
  selected,
  onAdd,
  onArchive,
  now,
}: {
  competition: TaiwanCompetition2026;
  selected: boolean;
  onAdd: () => void;
  onArchive: () => void;
  now: Date;
}) {
  const status = resolveRuntimeStatus(competition, now);
  const youtubeId = youtubeIdFromUrl(competition.livestreamUrl);
  const registrationCountdown = countdownLabel(competition.registrationDeadline, now);

  return (
    <article className={styles.card} id={competition.id}>
      <div className={styles.cardMeta}>
        <span className={`${styles.badge} ${status === "ongoing" ? styles.badgeLive : ""} ${status === "completed" ? styles.badgeDone : ""}`}>
          {statusLabel(status)}
        </span>
        <span className={styles.badge}>{eligibilityLabel(competition.adultEligibility)}</span>
      </div>
      <h3>{competition.nameZh}</h3>
      {competition.nameEn ? <p>{competition.nameEn}</p> : null}
      <dl className={styles.facts}>
        <div>
          <dt>日期</dt>
          <dd>{formatDateRange(competition.startDate, competition.endDate)}</dd>
        </div>
        <div>
          <dt>地點</dt>
          <dd>{competition.venue ? `${competition.city ?? ""} ${competition.venue}`.trim() : "等待公告"}</dd>
        </div>
        <div>
          <dt>成人組別</dt>
          <dd>{competition.adultDivisions?.join("、") || (competition.adultEligibility === "ask-organizer" ? "需要向主辦單位確認" : "未查得成人組")}</dd>
        </div>
        <div>
          <dt>可參加項目</dt>
          <dd>{competition.disciplines?.join("、") || "等待公告"}</dd>
        </div>
        <div>
          <dt>報名截止日</dt>
          <dd>
            {competition.registrationDeadline ? formatZhDate(competition.registrationDeadline, true) : "等待公告"}
            {status === "registration-open" && registrationCountdown ? `（${registrationCountdown}）` : ""}
          </dd>
        </div>
        <div>
          <dt>報名費</dt>
          <dd>{confirmedFeeText(competition)}</dd>
        </div>
        <div>
          <dt>主辦／承辦</dt>
          <dd>{competition.organizer}</dd>
        </div>
        <div>
          <dt>最後查證日期</dt>
          <dd>{formatZhDate(competition.verifiedAt)}</dd>
        </div>
      </dl>
      {competition.notes?.length ? (
        <ul>
          {competition.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      ) : null}
      {status === "ongoing" && competition.livestreamUrl ? (
        <div className={styles.liveBox}>
          <p>官方直播已公告。賽程時間請以官方賽程為準；目前項目以現場官方資訊為準，本頁不虛構進行中項目。</p>
          {youtubeId ? (
            <LazyYouTubePlayer
              videoId={youtubeId}
              playlistId={null}
              title={`${competition.nameZh} 官方直播`}
              officialWatchUrl={competition.livestreamUrl}
              embeddable
            />
          ) : null}
          <ExternalLink className="button-accent" href={competition.livestreamUrl}>
            觀看官方直播
          </ExternalLink>
        </div>
      ) : null}
      <div className={styles.actions}>
        {competition.officialNoticeUrl ? (
          <ExternalLink className="button-secondary" href={competition.officialNoticeUrl}>
            查看官方公告
          </ExternalLink>
        ) : null}
        {competition.rulesUrl ? (
          <ExternalLink className="button-secondary" href={competition.rulesUrl}>
            {status === "registration-open" ? "查看報名條件" : "查看競賽規程"}
          </ExternalLink>
        ) : null}
        {competition.registrationUrl && status !== "completed" ? (
          <ExternalLink className="button-secondary" href={competition.registrationUrl}>
            前往報名
          </ExternalLink>
        ) : null}
        {competition.scheduleUrl ? (
          <ExternalLink className="button-secondary" href={competition.scheduleUrl}>
            查看賽程
          </ExternalLink>
        ) : null}
        {competition.resultsUrl ? (
          <ExternalLink className="button-secondary" href={competition.resultsUrl}>
            查看成績
          </ExternalLink>
        ) : null}
        {competition.livestreamUrl && status !== "ongoing" ? (
          <ExternalLink className="button-secondary" href={competition.livestreamUrl}>
            觀看直播
          </ExternalLink>
        ) : null}
        {competition.recordings?.map((item) => (
          <ExternalLink key={item.url} className="button-secondary" href={item.url}>
            觀看錄影
          </ExternalLink>
        ))}
        {status === "completed" ? (
          <button className="button-secondary" type="button" onClick={onArchive}>
            建立我的賽後檔案
          </button>
        ) : null}
        <button className="button" type="button" onClick={onAdd}>
          {selected ? "已加入參賽計畫" : "加入我的參賽計畫"}
        </button>
      </div>
    </article>
  );
}

export function TaiwanCompetitionHub() {
  const competitions = useMemo(() => getTaiwanCompetitions2026(), []);
  const verifiedAt = latestVerifiedAt(competitions);
  const [now, setNow] = useState<Date | null>(null);
  const clock = now ?? parseTaipeiDate(verifiedAt || "2026-09-22") ?? new Date("2026-09-22T12:00:00+08:00");
  const [eligibility, setEligibility] = useState<EligibilityState>(EMPTY_ELIGIBILITY);
  const [plan, setPlan] = useState<PlanState>(EMPTY_PLAN);
  const [budget, setBudget] = useState<BudgetState>(EMPTY_BUDGET);
  const [support, setSupport] = useState<SupportState>(EMPTY_SUPPORT);
  const [results, setResults] = useState<ResultsState>(EMPTY_RESULTS);
  const [draftResult, setDraftResult] = useState<ResultRecord>(emptyResultRecord);
  const [hydrated, setHydrated] = useState(false);
  const [copied, setCopied] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    otherContact: "",
    birthYear: "",
    eventName: "",
    level: "",
    discipline: "",
    services: [] as string[],
    message: "",
    coach: "",
    partnerStatus: "",
    budget: "",
    contactWindow: "",
    consent: false,
    companyFax: "",
  });
  const [formErrors, setFormErrors] = useState<CompetitionSupportFieldErrors>({});
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");

  useEffect(() => {
    setNow(new Date());
    const storedPlan = readStorage(STORAGE_KEYS.plan, EMPTY_PLAN);
    setEligibility(readStorage(STORAGE_KEYS.eligibility, EMPTY_ELIGIBILITY));
    setPlan({
      selectedIds: Array.isArray(storedPlan.selectedIds) ? storedPlan.selectedIds : [],
      checks: storedPlan.checks && typeof storedPlan.checks === "object" ? storedPlan.checks : {},
      eventDay: storedPlan.eventDay && typeof storedPlan.eventDay === "object" ? storedPlan.eventDay : {},
    });
    const storedBudget = readStorage(STORAGE_KEYS.budget, EMPTY_BUDGET);
    setBudget({
      eventId: storedBudget.eventId ?? "",
      items: { ...EMPTY_BUDGET.items, ...(storedBudget.items ?? {}) },
    });
    setSupport({ ...EMPTY_SUPPORT, ...readStorage(STORAGE_KEYS.support, EMPTY_SUPPORT) });
    const storedResults = readStorage(STORAGE_KEYS.results, EMPTY_RESULTS);
    setResults({
      records: Array.isArray(storedResults.records) ? storedResults.records : [],
    });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    writeStorage(STORAGE_KEYS.eligibility, eligibility);
  }, [eligibility, hydrated]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    writeStorage(STORAGE_KEYS.plan, plan);
  }, [plan, hydrated]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    writeStorage(STORAGE_KEYS.budget, budget);
  }, [budget, hydrated]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    writeStorage(STORAGE_KEYS.support, support);
  }, [support, hydrated]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    writeStorage(STORAGE_KEYS.results, results);
  }, [results, hydrated]);

  const groups = groupCompetitions(competitions, clock);
  const nextEvent = nextCompetition(competitions, clock);
  const openDeadline = nearestOpenDeadline(competitions, clock);
  const adultConfirmed = confirmedAdultCount(competitions);
  const eligibilityResult = evaluateEligibility(eligibility, competitions);
  const selectedEvents = competitions.filter((item) => plan.selectedIds.includes(item.id));
  const activePlanEvent = selectedEvents[0];
  const planHasDate = Boolean(activePlanEvent && hasOfficialDate(activePlanEvent));
  const eventDay = plan.eventDay[activePlanEvent?.id ?? ""] ?? EMPTY_EVENT_DAY;
  const totals = budgetTotals(budget.items);
  const supportSummary = buildSupportSummary(support, competitions);
  const budgetSummary = buildBudgetSummary(budget, competitions);

  function markCopied(key: string) {
    setCopied(key);
    window.setTimeout(() => setCopied(""), 1600);
  }

  function addToPlan(id: string) {
    setPlan((current) => ({
      ...current,
      selectedIds: current.selectedIds.includes(id) ? current.selectedIds : [...current.selectedIds, id],
    }));
    const target = competitions.find((item) => item.id === id);
    if (target && !budget.eventId) {
      setBudget(seedBudgetFromCompetition(target));
    }
    if (target && !support.eventId) {
      setSupport((current) => ({ ...current, eventId: target.id }));
    }
    document.getElementById("my-plan")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function clearLocalData() {
    setEligibility(EMPTY_ELIGIBILITY);
    setPlan(EMPTY_PLAN);
    setBudget(EMPTY_BUDGET);
    setSupport(EMPTY_SUPPORT);
    setResults(EMPTY_RESULTS);
    setDraftResult(emptyResultRecord());
    Object.values(STORAGE_KEYS).forEach((key) => window.localStorage.removeItem(key));
  }

  function applySupportToForm() {
    const event = competitions.find((item) => item.id === support.eventId);
    setForm((current) => ({
      ...current,
      eventName: event?.nameZh ?? current.eventName,
      level: support.level || current.level,
      discipline: support.discipline || current.discipline,
      services: support.services.length ? support.services : current.services,
      coach: support.hasCoach === "yes" ? current.coach || "已有教練" : current.coach,
      partnerStatus: support.hasPartner,
      budget: support.budget || current.budget,
      contactWindow: support.helpPeriod || current.contactWindow,
      birthYear: eligibility.birthYear || current.birthYear,
      message: support.extra || supportSummary,
    }));
    document.getElementById("support-contact")?.scrollIntoView({ behavior: "smooth" });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormStatus("submitting");
    const parsed = parseCompetitionSupportInquiry({
      ...form,
      sourcePage: TAIWAN_GUIDE_PATH,
    });
    if (Object.keys(parsed.errors).length > 0) {
      setFormErrors(parsed.errors);
      setFormStatus("idle");
      return;
    }
    setFormErrors({});
    try {
      const response = await fetch("/api/contact/competition-support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, sourcePage: TAIWAN_GUIDE_PATH }),
      });
      const result = (await response.json()) as {
        ok?: boolean;
        status?: string;
        fields?: CompetitionSupportFieldErrors;
      };
      if (result.ok) {
        setFormStatus("success");
        setForm({
          name: "",
          email: "",
          phone: "",
          otherContact: "",
          birthYear: "",
          eventName: "",
          level: "",
          discipline: "",
          services: [],
          message: "",
          coach: "",
          partnerStatus: "",
          budget: "",
          contactWindow: "",
          consent: false,
          companyFax: "",
        });
        return;
      }
      if (result.status === "invalid" && result.fields) {
        setFormErrors(result.fields);
        setFormStatus("idle");
        return;
      }
      setFormStatus(result.status === "unconfigured" ? "unconfigured" : "unavailable");
    } catch {
      setFormStatus("unavailable");
    }
  }

  function exportResults() {
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "taiwan-competition-results.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  function importResults(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as ResultsState;
        if (!parsed || !Array.isArray(parsed.records)) {
          return;
        }
        setResults({ records: parsed.records.filter((item) => item && typeof item.id === "string") });
      } catch {
        return;
      }
    };
    reader.readAsText(file);
  }

  const fallbackButtons = (
    <div className={styles.actions}>
      <a className="button" href={CONTACT_MAILTO}>
        寄送Email
      </a>
      <a className="button-accent" href={CONTACT_TEL_HREF}>
        撥打電話 {CONTACT_PHONE_DISPLAY}
      </a>
    </div>
  );

  return (
    <div className={styles.wrap}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className="kicker">TAIWAN ADULT COMPETITION GUIDE 2026</p>
          <h1>第一次參加國內成人滑冰比賽，從這裡開始</h1>
          <p className={styles.lede}>
            找到適合的比賽、核對成人組資格，依序準備節目、報名、服裝、音樂、行程與賽後紀錄。
          </p>
          <div className="button-row">
            <a className="button" href="#events-2026">
              查看2026國內賽事
            </a>
            <a className="button-secondary" href="#my-plan">
              建立我的參賽計畫
            </a>
          </div>
        </div>
        <aside className={styles.heroCard} aria-label="賽事摘要">
          {competitions.length === 0 ? (
            <p>目前沒有已核對的 2026 國內花式滑冰賽事。</p>
          ) : (
            <dl className={styles.statGrid}>
              <div className={styles.stat}>
                <dt>已收錄賽事數</dt>
                <dd>{competitions.length}</dd>
              </div>
              <div className={styles.stat}>
                <dt>已確認成人可參加數</dt>
                <dd>{adultConfirmed}</dd>
              </div>
              <div className={styles.stat}>
                <dt>最近報名期限</dt>
                <dd>
                  {openDeadline
                    ? `${openDeadline.nameZh} ${formatZhDate(openDeadline.registrationDeadline, true)}`
                    : "目前沒有已公告且未截止的報名期限"}
                </dd>
              </div>
              <div className={styles.stat}>
                <dt>下一場比賽</dt>
                <dd>{nextEvent ? `${nextEvent.nameZh} ${formatDateRange(nextEvent.startDate, nextEvent.endDate)}` : "等待公告"}</dd>
              </div>
              <div className={styles.stat}>
                <dt>資料最後更新日</dt>
                <dd>{verifiedAt ? formatZhDate(verifiedAt) : "尚無資料"}</dd>
              </div>
            </dl>
          )}
        </aside>
      </section>

      <nav className="chip-row" aria-label="頁面章節">
        {[
          ["events-2026", "2026國內賽事"],
          ["eligibility", "資格檢查"],
          ["my-plan", "參賽計畫"],
          ["services", "參賽服務"],
          ["budget", "預算工具"],
          ["event-day", "比賽日模式"],
          ["archive", "賽後檔案"],
          ["support-contact", "洽詢支援"],
          ["faq", "FAQ"],
        ].map(([id, label]) => (
          <a key={id} className="text-chip" href={`#${id}`}>
            {label}
          </a>
        ))}
      </nav>

      <section className={styles.section} id="events-2026">
        <div className={styles.sectionHead}>
          <p className="kicker">2026 TAIWAN EVENTS</p>
          <h2>查看2026國內賽事</h2>
          <p>只收錄可追溯主辦單位與官方規程的花式滑冰冰上賽事。滑輪溜冰賽事不列入此表。</p>
        </div>
        <div className={styles.iceTrack} aria-hidden="true" />
        {competitions.length === 0 ? (
          <p className={styles.note}>目前沒有已核對的賽事資料。</p>
        ) : (
          ([
            ["正在進行", groups.ongoing],
            ["報名中", groups.registrationOpen],
            ["即將舉行", groups.upcoming],
            ["等待公告", groups.awaiting],
            ["已結束", groups.completed],
          ] as Array<[string, TaiwanCompetition2026[]]>).map(([title, items]) =>
            items.length ? (
              <div key={title} className={styles.cards}>
                <h3>{title}</h3>
                {items.map((competition) => (
                  <CompetitionCard
                    key={competition.id}
                    competition={competition}
                    selected={plan.selectedIds.includes(competition.id)}
                    now={clock}
                    onAdd={() => addToPlan(competition.id)}
                    onArchive={() => {
                      setDraftResult({
                        ...emptyResultRecord(),
                        eventId: competition.id,
                        date: competition.startDate ?? "",
                        resultsUrl: competition.resultsUrl ?? "",
                      });
                      document.getElementById("archive")?.scrollIntoView({ behavior: "smooth" });
                    }}
                  />
                ))}
              </div>
            ) : null,
          )
        )}
      </section>

      <section className={styles.section} id="eligibility">
        <div className={styles.sectionHead}>
          <p className="kicker">ELIGIBILITY</p>
          <h2>我適合參加哪一組？</h2>
        </div>
        <div className={styles.panel}>
          <form className={styles.formGrid} onSubmit={(event) => event.preventDefault()}>
            <label className={styles.field}>
              <span>出生年份</span>
              <input
                inputMode="numeric"
                value={eligibility.birthYear}
                onChange={(event) => setEligibility((current) => ({ ...current, birthYear: event.target.value }))}
              />
            </label>
            <label className={styles.field}>
              <span>目前年齡</span>
              <input
                inputMode="numeric"
                value={eligibility.age}
                onChange={(event) => setEligibility((current) => ({ ...current, age: event.target.value }))}
              />
            </label>
            <label className={styles.field}>
              <span>滑冰項目</span>
              <select
                value={eligibility.discipline}
                onChange={(event) =>
                  setEligibility((current) => ({ ...current, discipline: event.target.value as DisciplineChoice | "" }))
                }
              >
                <option value="">請選擇</option>
                <option value="singles">單人滑</option>
                <option value="solo-dance">Solo Dance</option>
                <option value="partnered-dance">Partnered Ice Dance</option>
                <option value="artistic">Showcase／Artistic</option>
              </select>
            </label>
            <label className={styles.field}>
              <span>目前檢定或測驗級別</span>
              <input
                value={eligibility.testingLevel}
                onChange={(event) => setEligibility((current) => ({ ...current, testingLevel: event.target.value }))}
              />
            </label>
            {([
              ["hasProgram", "是否已有節目"],
              ["hasCoach", "是否已有教練"],
              ["hasPartner", "是否已有舞伴"],
              ["isMember", "是否為協會或俱樂部會員"],
              ["hasCompeted", "過去是否參加過正式比賽"],
            ] as Array<[keyof EligibilityState, string]>).map(([key, label]) => (
              <label className={styles.field} key={key}>
                <span>{label}</span>
                <select
                  value={eligibility[key]}
                  onChange={(event) => setEligibility((current) => ({ ...current, [key]: event.target.value }))}
                >
                  {YES_NO.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </form>
          <div className={styles.resultBox}>
            <p>
              <strong>{outcomeLabel(eligibilityResult.outcome)}</strong>
            </p>
            <p>建議查看的賽事：{eligibilityResult.suggestedEvents.map((item) => item.nameZh).join("、") || "尚無對應賽事"}</p>
            <p>可能適合的組別：{eligibilityResult.possibleDivisions.join("、") || "目前未查得適合組別"}</p>
            <p>還缺少的資料：{eligibilityResult.missing.join("、") || "無"}</p>
            <ul>
              {eligibilityResult.nextSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
            <div className={styles.actions}>
              {eligibilityResult.ruleLinks.map((link) => (
                <ExternalLink key={link.href} className="button-secondary" href={link.href}>
                  {link.label}
                </ExternalLink>
              ))}
            </div>
            <p className={styles.note}>
              本工具協助整理公開規程，不代表主辦單位正式資格審核。最終組別及報名資格以各賽事公告為準。
            </p>
          </div>
        </div>
      </section>

      <section className={styles.section} id="my-plan">
        <div className={styles.sectionHead}>
          <p className="kicker">COUNTDOWN PLAN</p>
          <h2>建立我的參賽計畫</h2>
        </div>
        <div className={styles.panel}>
          {selectedEvents.length === 0 ? (
            <p>先從上方賽事卡片點選「加入我的參賽計畫」。沒有已公告日期時，會改用一般準備清單，不會產生假倒數日。</p>
          ) : (
            <>
              <p>已加入：{selectedEvents.map((item) => item.nameZh).join("、")}</p>
              {!planHasDate ? (
                <p className={styles.note}>所選賽事日期未完整公告，以下為一般準備清單，不是依比賽日倒數。</p>
              ) : (
                <p>
                  時間軸相對 {activePlanEvent?.nameZh}（{formatDateRange(activePlanEvent?.startDate, activePlanEvent?.endDate)}）。
                </p>
              )}
              <div className={styles.timeline}>
                {(planHasDate ? PREP_PHASES : PREP_PHASES.filter((phase) => phase.id !== "event-day")).map((phase) => (
                  <div className={styles.phase} key={phase.id}>
                    <h3>{phase.title}</h3>
                    <div className={styles.checkList}>
                      {phase.tasks.map((task) => {
                        const key = `${activePlanEvent?.id ?? "general"}:${task.id}`;
                        const checked = Boolean(plan.checks[activePlanEvent?.id ?? "general"]?.[task.id]);
                        return (
                          <label key={key}>
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(event) =>
                                setPlan((current) => ({
                                  ...current,
                                  checks: {
                                    ...current.checks,
                                    [activePlanEvent?.id ?? "general"]: {
                                      ...(current.checks[activePlanEvent?.id ?? "general"] ?? {}),
                                      [task.id]: event.target.checked,
                                    },
                                  },
                                }))
                              }
                            />
                            {task.label}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <section className={styles.section} id="services">
        <div className={styles.sectionHead}>
          <p className="kicker">SUPPORT MODULES</p>
          <h2>選擇參賽支援服務</h2>
          <p>服務可自由勾選，不強迫包套。費用標示為洽詢、依需求報價、由服務提供者確認。</p>
        </div>
        <div className={styles.routes}>
          <article className={styles.route}>
            <h3>自主參賽</h3>
            <p>適合已有教練及參賽經驗者。</p>
            <ul>
              <li>賽事資訊</li>
              <li>Checklist</li>
              <li>預算工具</li>
              <li>文件提醒</li>
            </ul>
            <p className={styles.price}>洽詢</p>
          </article>
          <article className={styles.route}>
            <h3>重點協助</h3>
            <p>適合第一次參賽但已有節目者。</p>
            <ul>
              <li>報名資料檢查</li>
              <li>音樂檔案檢查</li>
              <li>賽程與行程整合</li>
              <li>行前會議</li>
              <li>賽後資料整理</li>
            </ul>
            <p className={styles.price}>依需求報價</p>
          </article>
          <article className={styles.route}>
            <h3>全程陪跑</h3>
            <p>適合需要完整支援的新手。</p>
            <ul>
              <li>資格資料整理</li>
              <li>教練與服務者協調</li>
              <li>編舞及音樂安排</li>
              <li>服裝與妝髮安排</li>
              <li>報名行政</li>
              <li>比賽日行程管理</li>
              <li>現場陪伴</li>
              <li>合規攝錄影</li>
              <li>賽後歸檔</li>
            </ul>
            <p className={styles.price}>由服務提供者確認</p>
          </article>
        </div>
        <div className={styles.services}>
          {SUPPORT_SERVICES.map((item) => (
            <article className={styles.service} key={item.value}>
              <h3>{item.label}</h3>
              <p className={styles.price}>洽詢／依需求報價</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section} id="support-builder">
        <div className={styles.sectionHead}>
          <p className="kicker">SUPPORT BRIEF</p>
          <h2>服務需求產生器</h2>
        </div>
        <div className={styles.panel}>
          <form className={styles.formGrid} onSubmit={(event) => event.preventDefault()}>
            <label className={styles.field}>
              <span>目標賽事</span>
              <select
                value={support.eventId}
                onChange={(event) => setSupport((current) => ({ ...current, eventId: event.target.value }))}
              >
                <option value="">請選擇</option>
                {competitions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nameZh}
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.field}>
              <span>預計組別</span>
              <input value={support.division} onChange={(event) => setSupport((current) => ({ ...current, division: event.target.value }))} />
            </label>
            <label className={styles.field}>
              <span>參賽項目</span>
              <select
                value={support.discipline}
                onChange={(event) =>
                  setSupport((current) => ({ ...current, discipline: event.target.value as DisciplineChoice | "" }))
                }
              >
                <option value="">請選擇</option>
                <option value="singles">單人滑</option>
                <option value="solo-dance">Solo Dance</option>
                <option value="partnered-dance">Partnered Ice Dance</option>
                <option value="artistic">Showcase／Artistic</option>
              </select>
            </label>
            <label className={styles.field}>
              <span>目前程度</span>
              <input value={support.level} onChange={(event) => setSupport((current) => ({ ...current, level: event.target.value }))} />
            </label>
            <label className={styles.field}>
              <span>是否已有教練</span>
              <select value={support.hasCoach} onChange={(event) => setSupport((current) => ({ ...current, hasCoach: event.target.value as SupportState["hasCoach"] }))}>
                {YES_NO.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.field}>
              <span>是否已有舞伴</span>
              <select value={support.hasPartner} onChange={(event) => setSupport((current) => ({ ...current, hasPartner: event.target.value as SupportState["hasPartner"] }))}>
                {YES_NO.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.field}>
              <span>希望協助時間</span>
              <select value={support.helpPeriod} onChange={(event) => setSupport((current) => ({ ...current, helpPeriod: event.target.value }))}>
                <option value="">請選擇</option>
                <option value="asap">盡快</option>
                <option value="12-16w">賽前 12 至 16 週</option>
                <option value="8-12w">賽前 8 至 12 週</option>
                <option value="4-8w">賽前 4 至 8 週</option>
                <option value="2-4w">賽前 2 至 4 週</option>
                <option value="race-week">賽前一週</option>
                <option value="event-day">比賽當日</option>
                <option value="post">賽後</option>
              </select>
            </label>
            <label className={styles.field}>
              <span>預算範圍</span>
              <select value={support.budget} onChange={(event) => setSupport((current) => ({ ...current, budget: event.target.value }))}>
                <option value="">請選擇</option>
                <option value="undecided">尚未確定</option>
                <option value="under_10000">NT$10,000 以下</option>
                <option value="10000_30000">NT$10,000～30,000</option>
                <option value="30000_80000">NT$30,000～80,000</option>
                <option value="over_80000">NT$80,000 以上</option>
              </select>
            </label>
            <label className={`${styles.field}`} style={{ gridColumn: "1 / -1" }}>
              <span>補充需求</span>
              <textarea value={support.extra} onChange={(event) => setSupport((current) => ({ ...current, extra: event.target.value }))} />
            </label>
          </form>
          <div className={styles.checkList}>
            {SUPPORT_SERVICES.map((item) => (
              <label key={item.value}>
                <input
                  type="checkbox"
                  checked={support.services.includes(item.value)}
                  onChange={(event) =>
                    setSupport((current) => ({
                      ...current,
                      services: event.target.checked
                        ? [...current.services, item.value]
                        : current.services.filter((value) => value !== item.value),
                    }))
                  }
                />
                {item.label}
              </label>
            ))}
          </div>
          <div className={styles.summary}>
            <h3>我的國內參賽支援需求摘要</h3>
            <pre>{supportSummary}</pre>
            <div className={styles.actions}>
              <button
                className="button"
                type="button"
                onClick={() => {
                  void copyText(supportSummary).then(() => markCopied("support"));
                }}
              >
                {copied === "support" ? "已複製" : "複製摘要"}
              </button>
              <button className="button-secondary" type="button" onClick={() => setSupport(EMPTY_SUPPORT)}>
                清除
              </button>
              <button className="button-secondary" type="button" onClick={applySupportToForm}>
                帶入洽詢表單
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section} id="budget">
        <div className={styles.sectionHead}>
          <p className="kicker">BUDGET</p>
          <h2>國內參賽預算工具</h2>
        </div>
        <div className={styles.panel}>
          <label className={styles.field}>
            <span>目標賽事</span>
            <select
              value={budget.eventId}
              onChange={(event) => {
                const next = competitions.find((item) => item.id === event.target.value);
                setBudget(seedBudgetFromCompetition(next));
              }}
            >
              <option value="">請選擇</option>
              {competitions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nameZh}
                </option>
              ))}
            </select>
          </label>
          <p className={styles.note}>幣別以 TWD 為主。只預填已有官方來源的報名相關費用，其餘請自行填寫。</p>
          <div className={styles.budgetCards}>
            {BUDGET_CATEGORIES.map((category) => (
              <div className={styles.budgetRow} key={category.id}>
                <span>{category.label}</span>
                <input
                  inputMode="numeric"
                  aria-label={`${category.label}金額`}
                  value={budget.items[category.id]?.amount ?? ""}
                  onChange={(event) =>
                    setBudget((current) => ({
                      ...current,
                      items: {
                        ...current.items,
                        [category.id]: {
                          amount: event.target.value,
                          confirmed: current.items[category.id]?.confirmed ?? false,
                        },
                      },
                    }))
                  }
                />
                <label>
                  <input
                    type="checkbox"
                    checked={Boolean(budget.items[category.id]?.confirmed)}
                    onChange={(event) =>
                      setBudget((current) => ({
                        ...current,
                        items: {
                          ...current.items,
                          [category.id]: {
                            amount: current.items[category.id]?.amount ?? "",
                            confirmed: event.target.checked,
                          },
                        },
                      }))
                    }
                  />
                  已確認
                </label>
              </div>
            ))}
          </div>
          <div className={styles.totals}>
            <div className={styles.totalCard}>
              <span>已確認金額</span>
              <strong>{twd(totals.confirmed)}</strong>
            </div>
            <div className={styles.totalCard}>
              <span>尚未確認金額</span>
              <strong>{twd(totals.unconfirmed)}</strong>
            </div>
            <div className={styles.totalCard}>
              <span>預估總額</span>
              <strong>{twd(totals.total)}</strong>
            </div>
          </div>
          <div className={styles.actions}>
            <button
              className="button"
              type="button"
              onClick={() => {
                void copyText(budgetSummary).then(() => markCopied("budget"));
              }}
            >
              {copied === "budget" ? "已複製" : "複製預算摘要"}
            </button>
          </div>
        </div>
      </section>

      <section className={styles.section} id="event-day">
        <div className={styles.sectionHead}>
          <p className="kicker">EVENT DAY</p>
          <h2>比賽日控制台</h2>
        </div>
        <div className={styles.panel}>
          {!activePlanEvent ? (
            <p>先加入參賽計畫後，再進入比賽日模式。</p>
          ) : (
            <>
              <h3>{activePlanEvent.nameZh}</h3>
              <p>場館：{activePlanEvent.venue ? `${activePlanEvent.city ?? ""} ${activePlanEvent.venue}`.trim() : "等待公告"}</p>
              <p className={styles.note}>沒有正式賽程時，不顯示虛構時間，請自行輸入報到、練習與比賽時間。</p>
              <div className={styles.dayGrid}>
                {([
                  ["checkInTime", "報到時間"],
                  ["practiceTime", "練習時間"],
                  ["startTime", "比賽時間"],
                  ["meetingPoint", "集合地點"],
                  ["coachContact", "教練聯絡狀態"],
                  ["supportContact", "服務者聯絡狀態"],
                  ["costume", "服裝"],
                  ["musicBackup", "音樂備份"],
                  ["skates", "冰鞋與裝備"],
                ] as Array<[keyof typeof EMPTY_EVENT_DAY, string]>).map(([key, label]) => (
                  <label className={styles.field} key={key}>
                    <span>{label}</span>
                    <input
                      value={String(eventDay[key] ?? "")}
                      onChange={(event) =>
                        setPlan((current) => ({
                          ...current,
                          eventDay: {
                            ...current.eventDay,
                            [activePlanEvent.id]: {
                              ...EMPTY_EVENT_DAY,
                              ...(current.eventDay[activePlanEvent.id] ?? {}),
                              [key]: event.target.value,
                            },
                          },
                        }))
                      }
                    />
                  </label>
                ))}
              </div>
              <label className={styles.field}>
                <span>即時備忘錄</span>
                <textarea
                  className={styles.memo}
                  value={eventDay.notes}
                  onChange={(event) =>
                    setPlan((current) => ({
                      ...current,
                      eventDay: {
                        ...current.eventDay,
                        [activePlanEvent.id]: {
                          ...EMPTY_EVENT_DAY,
                          ...(current.eventDay[activePlanEvent.id] ?? {}),
                          notes: event.target.value,
                        },
                      },
                    }))
                  }
                />
              </label>
              <div className={styles.dayButtons}>
                {EVENT_DAY_MILESTONES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={Boolean(eventDay.milestones[item.id])}
                    onClick={() =>
                      setPlan((current) => ({
                        ...current,
                        eventDay: {
                          ...current.eventDay,
                          [activePlanEvent.id]: {
                            ...EMPTY_EVENT_DAY,
                            ...(current.eventDay[activePlanEvent.id] ?? {}),
                            milestones: {
                              ...EMPTY_EVENT_DAY.milestones,
                              ...(current.eventDay[activePlanEvent.id]?.milestones ?? {}),
                              [item.id]: !current.eventDay[activePlanEvent.id]?.milestones?.[item.id],
                            },
                          },
                        },
                      }))
                    }
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <section className={styles.section} id="archive">
        <div className={styles.sectionHead}>
          <p className="kicker">POST-EVENT ARCHIVE</p>
          <h2>賽後數位檔案</h2>
          <p>紀錄只保存在目前瀏覽器，本站不上傳個資或影片。</p>
        </div>
        <div className={styles.panel}>
          <form className={styles.formGrid} onSubmit={(event) => event.preventDefault()}>
            <label className={styles.field}>
              <span>賽事</span>
              <select value={draftResult.eventId} onChange={(event) => setDraftResult((current) => ({ ...current, eventId: event.target.value }))}>
                <option value="">自行輸入或其他賽事</option>
                {competitions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nameZh}
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.field}>
              <span>自行填寫賽事名稱</span>
              <input value={draftResult.customName} onChange={(event) => setDraftResult((current) => ({ ...current, customName: event.target.value }))} />
            </label>
            {([
              ["date", "日期"],
              ["division", "組別"],
              ["discipline", "項目"],
              ["placement", "名次"],
              ["total", "總分"],
              ["tes", "TES"],
              ["pcs", "PCS"],
              ["deductions", "扣分"],
              ["resultsUrl", "官方成績網址"],
              ["videoUrl", "影片網址"],
              ["photoUrl", "照片雲端網址"],
            ] as Array<[keyof ResultRecord, string]>).map(([key, label]) => (
              <label className={styles.field} key={key}>
                <span>{label}</span>
                <input value={String(draftResult[key] ?? "")} onChange={(event) => setDraftResult((current) => ({ ...current, [key]: event.target.value }))} />
              </label>
            ))}
            <label className={styles.field} style={{ gridColumn: "1 / -1" }}>
              <span>教練回饋</span>
              <textarea value={draftResult.coachNotes} onChange={(event) => setDraftResult((current) => ({ ...current, coachNotes: event.target.value }))} />
            </label>
            <label className={styles.field} style={{ gridColumn: "1 / -1" }}>
              <span>自我回顧</span>
              <textarea value={draftResult.selfReview} onChange={(event) => setDraftResult((current) => ({ ...current, selfReview: event.target.value }))} />
            </label>
            <label className={styles.field} style={{ gridColumn: "1 / -1" }}>
              <span>下次目標</span>
              <textarea value={draftResult.nextGoal} onChange={(event) => setDraftResult((current) => ({ ...current, nextGoal: event.target.value }))} />
            </label>
          </form>
          <div className={styles.actions}>
            <button
              className="button"
              type="button"
              onClick={() => {
                setResults((current) => {
                  const exists = current.records.some((item) => item.id === draftResult.id);
                  return {
                    records: exists
                      ? current.records.map((item) => (item.id === draftResult.id ? draftResult : item))
                      : [...current.records, draftResult],
                  };
                });
              }}
            >
              儲存
            </button>
            <button
              className="button-secondary"
              type="button"
              onClick={() => {
                void copyText(buildResultSummary(draftResult, competitions)).then(() => markCopied("result"));
              }}
            >
              {copied === "result" ? "已複製" : "複製摘要"}
            </button>
            <button className="button-secondary" type="button" onClick={exportResults}>
              匯出 JSON
            </button>
            <label className="button-secondary">
              匯入 JSON
              <input
                type="file"
                accept="application/json"
                hidden
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    importResults(file);
                  }
                }}
              />
            </label>
            <button className="button-secondary" type="button" onClick={() => setDraftResult(emptyResultRecord())}>
              新增一筆
            </button>
          </div>
          {results.records.length ? (
            <div className={styles.cards}>
              {results.records.map((record) => (
                <article className={styles.scorecard} key={record.id}>
                  <h3>{competitions.find((item) => item.id === record.eventId)?.nameZh || record.customName || "未命名紀錄"}</h3>
                  <p>
                    {record.date || "日期未填"} ｜ {record.division || "組別未填"} ｜ {record.placement || "名次未填"}
                  </p>
                  <div className={styles.actions}>
                    <button className="button-secondary" type="button" onClick={() => setDraftResult(record)}>
                      編輯
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className={styles.section} id="support-contact">
        <div className={styles.sectionHead}>
          <p className="kicker">INQUIRY</p>
          <h2>洽詢國內成人參賽支援</h2>
        </div>
        <div className={styles.formPanel}>
          {formStatus === "success" ? (
            <p className={styles.statusOk} role="status">
              已收到你的洽詢，我們將透過Email或電話與你聯繫。
            </p>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {formStatus === "unconfigured" ? (
                <p className={styles.statusWarn} role="status">
                  線上表單設定中，請直接寄信或來電洽詢。
                </p>
              ) : null}
              {formStatus === "unavailable" ? (
                <p className={styles.statusWarn} role="status">
                  訊息暫時無法送出，請直接寄信或來電洽詢。
                </p>
              ) : null}
              {formStatus === "unconfigured" || formStatus === "unavailable" ? fallbackButtons : null}
              <div className={styles.formGrid}>
                <label className={`${styles.field} ${formErrors.name ? styles.invalid : ""}`}>
                  <span>姓名</span>
                  <input value={form.name} autoComplete="name" aria-invalid={Boolean(formErrors.name)} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
                  {formErrors.name ? <p className={styles.error}>{formErrors.name}</p> : null}
                </label>
                <label className={`${styles.field} ${formErrors.email ? styles.invalid : ""}`}>
                  <span>Email</span>
                  <input type="email" value={form.email} autoComplete="email" aria-invalid={Boolean(formErrors.email)} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
                  {formErrors.email ? <p className={styles.error}>{formErrors.email}</p> : null}
                </label>
                <label className={styles.field}>
                  <span>電話（選填）</span>
                  <input value={form.phone} autoComplete="tel" onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} />
                </label>
                <label className={styles.field}>
                  <span>LINE或其他聯絡方式（選填）</span>
                  <input value={form.otherContact} onChange={(event) => setForm((current) => ({ ...current, otherContact: event.target.value }))} />
                </label>
                <label className={`${styles.field} ${formErrors.eventName ? styles.invalid : ""}`}>
                  <span>目標賽事</span>
                  <input value={form.eventName} aria-invalid={Boolean(formErrors.eventName)} onChange={(event) => setForm((current) => ({ ...current, eventName: event.target.value }))} />
                  {formErrors.eventName ? <p className={styles.error}>{formErrors.eventName}</p> : null}
                </label>
                <label className={styles.field}>
                  <span>出生年份（選填）</span>
                  <input inputMode="numeric" value={form.birthYear} onChange={(event) => setForm((current) => ({ ...current, birthYear: event.target.value }))} />
                </label>
                <label className={`${styles.field} ${formErrors.level ? styles.invalid : ""}`}>
                  <span>目前程度</span>
                  <input value={form.level} aria-invalid={Boolean(formErrors.level)} onChange={(event) => setForm((current) => ({ ...current, level: event.target.value }))} />
                  {formErrors.level ? <p className={styles.error}>{formErrors.level}</p> : null}
                </label>
                <label className={`${styles.field} ${formErrors.discipline ? styles.invalid : ""}`}>
                  <span>參賽項目</span>
                  <select value={form.discipline} aria-invalid={Boolean(formErrors.discipline)} onChange={(event) => setForm((current) => ({ ...current, discipline: event.target.value }))}>
                    <option value="">請選擇</option>
                    <option value="singles">單人滑</option>
                    <option value="solo-dance">Solo Dance</option>
                    <option value="partnered-dance">Partnered Ice Dance</option>
                    <option value="artistic">Showcase／Artistic</option>
                  </select>
                  {formErrors.discipline ? <p className={styles.error}>{formErrors.discipline}</p> : null}
                </label>
                <label className={styles.field}>
                  <span>教練（選填）</span>
                  <input value={form.coach} onChange={(event) => setForm((current) => ({ ...current, coach: event.target.value }))} />
                </label>
                <label className={styles.field}>
                  <span>舞伴狀態（選填）</span>
                  <select value={form.partnerStatus} onChange={(event) => setForm((current) => ({ ...current, partnerStatus: event.target.value }))}>
                    {YES_NO.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className={styles.field}>
                  <span>預算範圍（選填）</span>
                  <select value={form.budget} onChange={(event) => setForm((current) => ({ ...current, budget: event.target.value }))}>
                    <option value="">請選擇</option>
                    <option value="undecided">尚未確定</option>
                    <option value="under_10000">NT$10,000 以下</option>
                    <option value="10000_30000">NT$10,000～30,000</option>
                    <option value="30000_80000">NT$30,000～80,000</option>
                    <option value="over_80000">NT$80,000 以上</option>
                  </select>
                </label>
                <label className={styles.field}>
                  <span>可聯絡時間（選填）</span>
                  <input value={form.contactWindow} onChange={(event) => setForm((current) => ({ ...current, contactWindow: event.target.value }))} />
                </label>
              </div>
              <fieldset className={styles.field}>
                <legend>需要的服務</legend>
                <div className={styles.checkList}>
                  {SUPPORT_SERVICES.map((item) => (
                    <label key={item.value}>
                      <input
                        type="checkbox"
                        checked={form.services.includes(item.value)}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            services: event.target.checked
                              ? [...current.services, item.value]
                              : current.services.filter((value) => value !== item.value),
                          }))
                        }
                      />
                      {item.label}
                    </label>
                  ))}
                </div>
                {formErrors.services ? <p className={styles.error}>{formErrors.services}</p> : null}
              </fieldset>
              <label className={`${styles.field} ${formErrors.message ? styles.invalid : ""}`}>
                <span>合作需求</span>
                <textarea value={form.message} aria-invalid={Boolean(formErrors.message)} onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))} />
                {formErrors.message ? <p className={styles.error}>{formErrors.message}</p> : null}
              </label>
              <label className={styles.consent}>
                <input type="checkbox" checked={form.consent} onChange={(event) => setForm((current) => ({ ...current, consent: event.target.checked }))} />
                <span>
                  我同意本站依
                  <Link href="/privacy">隱私說明</Link>
                  處理此洽詢資料。規劃工具中的出生年份、程度、預算與成績不會送入廣告追蹤。
                </span>
              </label>
              {formErrors.consent ? <p className={styles.error}>{formErrors.consent}</p> : null}
              <div className={styles.honeypot}>
                <label>
                  公司傳真
                  <input value={form.companyFax} tabIndex={-1} autoComplete="off" onChange={(event) => setForm((current) => ({ ...current, companyFax: event.target.value }))} />
                </label>
              </div>
              <button className={styles.submit} disabled={formStatus === "submitting"} type="submit">
                {formStatus === "submitting" ? "送出中" : "送出洽詢"}
              </button>
            </form>
          )}
        </div>
      </section>

      <section className={styles.brand} id="brand">
        <p className="kicker">BRAND PARTNERSHIP</p>
        <h2>一起支持台灣成人選手站上冰面</h2>
        <p>可合作內容：成人選手備賽紀錄、裝備使用內容、服裝與妝髮企劃、比賽日短影音、選手故事、賽後成果報告、成人運動族群精準曝光。</p>
        <p>合作產業：滑冰用品、運動服飾、美妝、攝錄影、交通、住宿、餐飲、健身、復健與恢復、在地中小品牌。</p>
        <Link className="button" href="/advertising#contact">
          洽詢品牌合作
        </Link>
        <p className={styles.brandNote}>
          此區為品牌合作內容，不表示品牌是賽事主辦、官方贊助，也不能影響比賽結果。
        </p>
      </section>

      <section className={styles.section} id="faq">
        <div className={styles.sectionHead}>
          <p className="kicker">FAQ</p>
          <h2>常見問題</h2>
        </div>
        <div className={styles.faqList}>
          {FAQ_ITEMS.map((item) => (
            <article className={styles.faqItem} key={item.q}>
              <h3>{item.q}</h3>
              <p>{item.a}</p>
            </article>
          ))}
        </div>
        <p className={styles.privacy}>
          資格檢查、參賽計畫、預算、服務需求與賽後檔案只保存在目前瀏覽器，解析失敗時會安全恢復空白資料。
          本頁內容卡不是付費廣告，不會顯示 Sponsored，也不計入廣告成效報表。
        </p>
        <div className={styles.actions}>
          <button className="button-secondary" type="button" onClick={clearLocalData}>
            清除本機規劃資料
          </button>
          <Link className="button-secondary" href="/competitions">
            國際比賽資訊
          </Link>
          <Link className="button-secondary" href="/rules">
            規則中心
          </Link>
          <Link className="button-secondary" href="/countries">
            國家入口
          </Link>
        </div>
      </section>

      <div className={styles.sticky}>
        <a className="button" href="#my-plan">
          建立我的參賽計畫
        </a>
        <a className="button-accent" href="#support-contact">
          洽詢參賽支援
        </a>
      </div>
    </div>
  );
}
