import competitionsData from "@/data/taiwan-competitions-2026.json";

export type CompetitionStatus =
  | "registration-open"
  | "upcoming"
  | "ongoing"
  | "completed"
  | "awaiting-announcement";

export type AdultEligibility = "confirmed" | "not-confirmed" | "not-available" | "ask-organizer";

export type TaiwanCompetitionFee = {
  label: string;
  amount?: number;
  currency: "TWD";
  status: "confirmed" | "awaiting-announcement";
};

export type TaiwanCompetitionRecording = {
  title: string;
  url: string;
  source: string;
};

export type TaiwanCompetition2026 = {
  id: string;
  slug: string;
  nameZh: string;
  nameEn?: string;
  organizer: string;
  venue?: string;
  city?: string;
  startDate?: string;
  endDate?: string;
  registrationOpen?: string;
  registrationDeadline?: string;
  status: CompetitionStatus;
  adultEligibility: AdultEligibility;
  adultDivisions?: string[];
  disciplines?: string[];
  fees?: TaiwanCompetitionFee[];
  officialNoticeUrl?: string;
  rulesUrl?: string;
  registrationUrl?: string;
  scheduleUrl?: string;
  resultsUrl?: string;
  livestreamUrl?: string;
  recordings?: TaiwanCompetitionRecording[];
  sourceUrls: string[];
  verifiedAt: string;
  notes?: string[];
};

export const TAIWAN_GUIDE_PATH = "/guides/taiwan-adult-competitions-2026";

export const STORAGE_KEYS = {
  eligibility: "aidh:tw-competitions-2026:eligibility:v1",
  routeFlow: "aidh:tw-competitions-2026:route-flow:v1",
  plan: "aidh:tw-competitions-2026:plan:v1",
  budget: "aidh:tw-competitions-2026:budget:v1",
  support: "aidh:tw-competitions-2026:support:v1",
  results: "aidh:tw-competitions-2026:results:v1",
} as const;

export const SUPPORT_SERVICES = [
  { value: "costume", label: "服裝" },
  { value: "hair-makeup", label: "化妝／髮型" },
  { value: "choreography", label: "編舞" },
  { value: "music-edit", label: "音樂剪輯" },
  { value: "registration-admin", label: "報名行政與行程管理" },
  { value: "companion-video", label: "參賽陪伴／攝錄影" },
  { value: "transport-safety", label: "交通／駕駛／安全支援" },
  { value: "mentor", label: "Mentor" },
  { value: "archive", label: "賽後資料整理與保存" },
] as const;

export const BUDGET_CATEGORIES = [
  { id: "entry-fee", label: "報名費" },
  { id: "membership", label: "協會／俱樂部費用" },
  { id: "coach", label: "教練費" },
  { id: "choreography", label: "編舞費" },
  { id: "music", label: "音樂剪輯" },
  { id: "ice-practice", label: "冰場練習" },
  { id: "costume", label: "服裝" },
  { id: "hair-makeup", label: "妝髮" },
  { id: "skate-maintenance", label: "冰鞋及冰刀維護" },
  { id: "transport", label: "交通" },
  { id: "lodging", label: "住宿" },
  { id: "meals", label: "餐食" },
  { id: "companion", label: "陪同服務" },
  { id: "video", label: "攝錄影" },
  { id: "archive", label: "賽後資料整理" },
  { id: "emergency", label: "緊急預備金" },
] as const;

export const PREP_PHASES = [
  {
    id: "12-16w",
    title: "賽前 12 至 16 週",
    tasks: [
      { id: "confirm-eligibility", label: "確認參賽資格" },
      { id: "choose-division", label: "選擇組別" },
      { id: "confirm-coach", label: "確認教練" },
      { id: "program-music-direction", label: "決定節目及音樂方向" },
      { id: "estimate-budget", label: "估算預算" },
      { id: "training-plan", label: "建立訓練計畫" },
    ],
  },
  {
    id: "8-12w",
    title: "賽前 8 至 12 週",
    tasks: [
      { id: "music-edit", label: "完成音樂剪輯" },
      { id: "full-choreography", label: "開始完整編舞" },
      { id: "prepare-docs", label: "準備報名資料" },
      { id: "choose-costume", label: "選擇服裝" },
      { id: "partner-practice", label: "確認舞伴及練習安排" },
      { id: "track-deadline", label: "追蹤報名截止日" },
    ],
  },
  {
    id: "4-8w",
    title: "賽前 4 至 8 週",
    tasks: [
      { id: "complete-program", label: "完成整套節目" },
      { id: "mock-comp", label: "進行第一次模擬比賽" },
      { id: "costume-test", label: "測試服裝" },
      { id: "skate-check", label: "檢查冰鞋與冰刀" },
      { id: "music-format", label: "確認音樂格式" },
      { id: "register-pay", label: "完成報名及繳費" },
    ],
  },
  {
    id: "2-4w",
    title: "賽前 2 至 4 週",
    tasks: [
      { id: "full-run-training", label: "增加完整節目訓練" },
      { id: "video-tech-check", label: "進行影片技術檢查" },
      { id: "confirm-schedule", label: "確認賽程、報到及練習時間" },
      { id: "travel-video", label: "安排交通、陪同及攝錄影" },
      { id: "emergency-contacts", label: "建立緊急聯絡資訊" },
    ],
  },
  {
    id: "1w",
    title: "賽前一週",
    tasks: [
      { id: "injury-risk", label: "降低受傷風險" },
      { id: "music-backup", label: "最終確認音樂備份" },
      { id: "pack-costume", label: "整理服裝與裝備" },
      { id: "id-docs", label: "確認證件" },
      { id: "confirm-travel", label: "確認交通" },
      { id: "makeup-test", label: "完成妝髮測試" },
      { id: "meeting-point", label: "確認集合及聯絡方式" },
    ],
  },
  {
    id: "event-day",
    title: "比賽當日",
    tasks: [
      { id: "check-in", label: "報到" },
      { id: "venue-flow", label: "熟悉場館動線" },
      { id: "warm-up", label: "暖身" },
      { id: "skates-ready", label: "整理冰鞋與冰刀" },
      { id: "music-confirm", label: "音樂確認" },
      { id: "waiting", label: "候場" },
      { id: "compete", label: "比賽" },
      { id: "save-results", label: "成績與影片保存" },
    ],
  },
  {
    id: "post-week",
    title: "賽後一週",
    tasks: [
      { id: "keep-scores", label: "保存成績" },
      { id: "download-protocols", label: "下載裁判資料" },
      { id: "sort-media", label: "整理照片與影片" },
      { id: "coach-review", label: "與教練檢討" },
      { id: "next-goals", label: "建立下一階段訓練目標" },
      { id: "thank-you", label: "感謝服務者及合作品牌" },
    ],
  },
] as const;

export const EVENT_DAY_MILESTONES = [
  { id: "arrived", label: "已報到" },
  { id: "music-submitted", label: "已交音樂" },
  { id: "warmed-up", label: "完成暖身" },
  { id: "holding", label: "準備候場" },
  { id: "finished", label: "比賽完成" },
  { id: "score-saved", label: "保存成績" },
  { id: "video-saved", label: "保存影片" },
] as const;

export const GENERAL_PREP_PHASES = PREP_PHASES.filter((phase) => phase.id !== "event-day");

export type DisciplineChoice = "singles" | "solo-dance" | "partnered-dance" | "artistic" | "unspecified";
export type EligibilityOutcome = "preliminary-match" | "need-more-info" | "ask-organizer" | "no-division-found";

export type EligibilityState = {
  birthYear: string;
  age: string;
  discipline: DisciplineChoice | "";
  testingLevel: string;
  hasProgram: "" | "yes" | "no";
  hasCoach: "" | "yes" | "no";
  hasPartner: "" | "yes" | "no";
  isMember: "" | "yes" | "no";
  hasCompeted: "" | "yes" | "no";
};

export type PlanState = {
  selectedIds: string[];
  checks: Record<string, Record<string, boolean>>;
  eventDay: Record<
    string,
    {
      checkInTime: string;
      practiceTime: string;
      startTime: string;
      meetingPoint: string;
      coachContact: string;
      supportContact: string;
      costume: string;
      musicBackup: string;
      skates: string;
      notes: string;
      milestones: Record<string, boolean>;
    }
  >;
};

export type BudgetItem = { amount: string; confirmed: boolean };
export type BudgetState = {
  eventId: string;
  items: Record<string, BudgetItem>;
};

export type SupportState = {
  eventId: string;
  division: string;
  discipline: DisciplineChoice | "";
  level: string;
  hasCoach: "" | "yes" | "no";
  hasPartner: "" | "yes" | "no";
  services: string[];
  helpPeriod: string;
  budget: string;
  extra: string;
};

export type ResultRecord = {
  id: string;
  eventId: string;
  customName: string;
  date: string;
  division: string;
  discipline: string;
  placement: string;
  total: string;
  tes: string;
  pcs: string;
  deductions: string;
  resultsUrl: string;
  videoUrl: string;
  photoUrl: string;
  coachNotes: string;
  selfReview: string;
  nextGoal: string;
};

export type ResultsState = {
  records: ResultRecord[];
};

export const EMPTY_ELIGIBILITY: EligibilityState = {
  birthYear: "",
  age: "",
  discipline: "",
  testingLevel: "",
  hasProgram: "",
  hasCoach: "",
  hasPartner: "",
  isMember: "",
  hasCompeted: "",
};

export const EMPTY_PLAN: PlanState = {
  selectedIds: [],
  checks: {},
  eventDay: {},
};

export const EMPTY_BUDGET: BudgetState = {
  eventId: "",
  items: Object.fromEntries(BUDGET_CATEGORIES.map((item) => [item.id, { amount: "", confirmed: false }])),
};

export const EMPTY_SUPPORT: SupportState = {
  eventId: "",
  division: "",
  discipline: "",
  level: "",
  hasCoach: "",
  hasPartner: "",
  services: [],
  helpPeriod: "",
  budget: "",
  extra: "",
};

export const EMPTY_RESULTS: ResultsState = { records: [] };

export const EMPTY_EVENT_DAY = {
  checkInTime: "",
  practiceTime: "",
  startTime: "",
  meetingPoint: "",
  coachContact: "",
  supportContact: "",
  costume: "",
  musicBackup: "",
  skates: "",
  notes: "",
  milestones: Object.fromEntries(EVENT_DAY_MILESTONES.map((item) => [item.id, false])),
};

export const FAQ_ITEMS = [
  {
    q: "成人可以參加哪些國內花式滑冰比賽？",
    a: "以中華民國滑冰協會及各賽事主辦單位已公布的規程為準。查證至 2026 年 9 月 22 日，已確認列出成人相關組別的冰上賽事為 2026全國花式滑冰菁英錦標賽（成年組單人滑，賽事已結束）與 115年臺中市市長盃滑冰錦標賽—花式滑冰（公開菁英組成年組、菁英青年／成人組）。115學年度全國花式滑冰錦標賽已公告改期，但成人組是否開放仍等待規程。115學年度第48屆中正盃全國溜冰錦標賽由中華民國滑輪溜冰協會主辦，場地為竹北國民運動中心，屬滑輪溜冰賽事，不是花式滑冰冰上賽事。",
  },
  {
    q: "沒有檢定級別可以報名嗎？",
    a: "各賽事規定不同。2026全國花式滑冰菁英錦標賽規程要求參賽者為協會註冊選手，並依組別列出技術條件；115年臺中市市長盃分公開組與菁英組，是否免檢定以該賽規程及報名欄為準。115學年度全國錦標賽尚未公布規程，不能用前一年規定代替。最終以各賽事公告為準。",
  },
  {
    q: "年齡如何分組？",
    a: "年齡計算日與組別名稱依各賽規程。菁英錦標賽成年組須至少年滿 17 週歲，出生於 2009 年 7 月 1 日之前。市長盃列出公開菁英組滑冰含成年組，以及菁英青年／成人組，細部分齡以該賽規程為準。全國錦標賽 115 學年度分齡尚未公告。",
  },
  {
    q: "沒有舞伴可以參加冰舞嗎？",
    a: "Partnered Ice Dance 需要舞伴。Solo Dance 由單一選手完成。查證當日，菁英錦標賽規程未列出冰舞項目；市長盃規程另列個人冰舞與雙人冰舞為增加表演項目，分組細節需向承辦單位確認；全國錦標賽冰舞項目等待公告。",
  },
  {
    q: "Solo Dance 與 Partnered Dance 有何不同？",
    a: "Solo Dance 由單一選手完成冰舞節目。Partnered Ice Dance 由一對舞者共同比賽。台灣 2026 已查證的冰上賽事中，尚未見到與國際成人賽相同、已完整公告的 Solo Dance 組別表。市長盃列有個人冰舞與雙人冰舞表演項目，但仍需向主辦單位確認組別與計分方式。",
  },
  {
    q: "一定要有教練才能報名嗎？",
    a: "不一定，依各賽規程。菁英錦標賽針對協會註冊選手，教練相關欄位以該賽報名表為準。市長盃與全國錦標賽是否強制填寫教練，以各賽報名簡章為準。本站建議第一次參賽者有現場教練，但不把建議寫成報名條件。",
  },
  {
    q: "音樂檔案需要什麼格式？",
    a: "菁英錦標賽規程載明音樂限 MP3，並須繳交音樂授權費。市長盃與全國錦標賽的音樂規格在查證當日未見獨立、可核對的完整公告，需以各賽簡章為準。在主辦單位公告前，不要自行假設格式相同。",
  },
  {
    q: "報名後可以更改音樂或組別嗎？",
    a: "更改期限與能否改組均依各賽簡章。查證當日，三場已收錄賽事都沒有一份可直接套用到所有比賽的「一律可改／一律不可改」官方聲明。請以該賽報名截止後公告及主辦單位回覆為準。",
  },
  {
    q: "第一次參賽需要準備多少預算？",
    a: "沒有全台統一官方總價。已確認的單項費用例如：菁英錦標賽成年組報名費 6,500 元、協會年度註冊費 500 元、每首音樂授權費 300 元；市長盃菁英青年／成人組長曲或短曲 3,500 元起。教練、服裝、練習冰、交通與住宿需自行估算。請用本頁預算工具記錄已確認金額與尚未確認金額，不要把未公告數字當成官方報價。",
  },
  {
    q: "比賽當天需要提前多久到場？",
    a: "以各賽官方賽程表的報到、練習與比賽時間為準。菁英錦標賽已公布比賽時間表；市長盃與全國錦標賽在查證當日未見可核對的完整當日動線表。沒有官方時間時，請自行向主辦單位確認，不要使用虛構到場時間。",
  },
  {
    q: "官方成績與影片在哪裡查看？",
    a: "菁英錦標賽官方成績頁為中華民國滑冰協會 records／2026ElitesCup。市長盃與全國錦標賽成績頁、直播與錄影在查證當日未見獨立官方連結。本頁只顯示已查證的官方按鈕，不列出未確認網址。",
  },
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function asStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }
  const items = value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  return items.length > 0 ? items : undefined;
}

function parseCompetition(value: unknown): TaiwanCompetition2026 | null {
  if (!isRecord(value)) {
    return null;
  }
  const id = asString(value.id);
  const slug = asString(value.slug);
  const nameZh = asString(value.nameZh);
  const organizer = asString(value.organizer);
  const status = asString(value.status) as CompetitionStatus | undefined;
  const adultEligibility = asString(value.adultEligibility) as AdultEligibility | undefined;
  const verifiedAt = asString(value.verifiedAt);
  const sourceUrls = asStringArray(value.sourceUrls);
  if (!id || !slug || !nameZh || !organizer || !status || !adultEligibility || !verifiedAt || !sourceUrls) {
    return null;
  }
  return {
    id,
    slug,
    nameZh,
    nameEn: asString(value.nameEn),
    organizer,
    venue: asString(value.venue),
    city: asString(value.city),
    startDate: asString(value.startDate),
    endDate: asString(value.endDate),
    registrationOpen: asString(value.registrationOpen),
    registrationDeadline: asString(value.registrationDeadline),
    status,
    adultEligibility,
    adultDivisions: asStringArray(value.adultDivisions),
    disciplines: asStringArray(value.disciplines),
    fees: Array.isArray(value.fees)
      ? value.fees.flatMap((fee) => {
          if (!isRecord(fee) || typeof fee.label !== "string") {
            return [];
          }
          return [
            {
              label: fee.label,
              amount: typeof fee.amount === "number" ? fee.amount : undefined,
              currency: "TWD" as const,
              status: fee.status === "confirmed" ? "confirmed" : "awaiting-announcement",
            },
          ];
        })
      : undefined,
    officialNoticeUrl: asString(value.officialNoticeUrl),
    rulesUrl: asString(value.rulesUrl),
    registrationUrl: asString(value.registrationUrl),
    scheduleUrl: asString(value.scheduleUrl),
    resultsUrl: asString(value.resultsUrl),
    livestreamUrl: asString(value.livestreamUrl),
    recordings: Array.isArray(value.recordings)
      ? value.recordings.flatMap((item) => {
          if (!isRecord(item)) {
            return [];
          }
          const title = asString(item.title);
          const url = asString(item.url);
          const source = asString(item.source);
          return title && url && source ? [{ title, url, source }] : [];
        })
      : undefined,
    sourceUrls,
    verifiedAt,
    notes: asStringArray(value.notes),
  };
}

export function getTaiwanCompetitions2026(): TaiwanCompetition2026[] {
  if (!Array.isArray(competitionsData)) {
    return [];
  }
  return competitionsData.map(parseCompetition).filter((item): item is TaiwanCompetition2026 => Boolean(item));
}

export function getCompetitionById(id: string): TaiwanCompetition2026 | undefined {
  return getTaiwanCompetitions2026().find((item) => item.id === id);
}

export function parseTaipeiDate(value?: string): Date | null {
  if (!value) {
    return null;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const parsed = new Date(`${value}T00:00:00+08:00`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function endOfTaipeiDay(value: string): Date | null {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const parsed = new Date(`${value}T23:59:59+08:00`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  return parseTaipeiDate(value);
}

export function formatZhDate(value?: string, withTime = false): string {
  if (!value) {
    return "等待公告";
  }
  const dayMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (dayMatch && (!withTime || !value.includes("T"))) {
    return `${dayMatch[1]}/${dayMatch[2]}/${dayMatch[3]}`;
  }
  const parsed = parseTaipeiDate(value);
  if (!parsed) {
    return "等待公告";
  }
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(parsed);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "";
  const date = `${get("year")}/${get("month")}/${get("day")}`;
  if (!withTime || !value.includes("T")) {
    return date;
  }
  return `${date} ${get("hour")}:${get("minute")}`;
}

export function formatDateRange(start?: string, end?: string): string {
  if (!start && !end) {
    return "等待公告";
  }
  if (start && end && start !== end) {
    return `${formatZhDate(start)}－${formatZhDate(end)}`;
  }
  return formatZhDate(start || end);
}

export function resolveRuntimeStatus(competition: TaiwanCompetition2026, now = new Date()): CompetitionStatus {
  const start = parseTaipeiDate(competition.startDate);
  const end = competition.endDate
    ? endOfTaipeiDay(competition.endDate)
    : competition.startDate
      ? endOfTaipeiDay(competition.startDate)
      : null;
  if (start && end) {
    if (now >= start && now <= end) {
      return "ongoing";
    }
    if (now > end) {
      return "completed";
    }
  }
  const open = parseTaipeiDate(competition.registrationOpen);
  const deadline = parseTaipeiDate(competition.registrationDeadline);
  if (deadline && now <= deadline && (!open || now >= open) && !(end && now > end)) {
    return "registration-open";
  }
  if (!competition.startDate && (competition.status === "awaiting-announcement" || !start)) {
    return "awaiting-announcement";
  }
  if (start && now < start) {
    return "upcoming";
  }
  return competition.status;
}

export function statusLabel(status: CompetitionStatus): string {
  switch (status) {
    case "ongoing":
      return "正在進行";
    case "registration-open":
      return "報名中";
    case "upcoming":
      return "即將舉行";
    case "awaiting-announcement":
      return "等待公告";
    case "completed":
      return "已結束";
  }
}

export function eligibilityLabel(value: AdultEligibility): string {
  switch (value) {
    case "confirmed":
      return "已確認成人可參加";
    case "not-confirmed":
      return "未查得成人組";
    case "not-available":
      return "不適用";
    case "ask-organizer":
      return "需要向主辦單位確認";
  }
}

export function groupCompetitions(competitions: TaiwanCompetition2026[], now = new Date()) {
  const withStatus = competitions.map((item) => ({ item, status: resolveRuntimeStatus(item, now) }));
  const pick = (status: CompetitionStatus) =>
    withStatus.filter((entry) => entry.status === status).map((entry) => entry.item);
  const upcoming = pick("upcoming").sort((a, b) => {
    const aTime = parseTaipeiDate(a.startDate)?.getTime() ?? Number.POSITIVE_INFINITY;
    const bTime = parseTaipeiDate(b.startDate)?.getTime() ?? Number.POSITIVE_INFINITY;
    return aTime - bTime;
  });
  const completed = pick("completed").sort((a, b) => {
    const aTime = parseTaipeiDate(a.endDate || a.startDate)?.getTime() ?? 0;
    const bTime = parseTaipeiDate(b.endDate || b.startDate)?.getTime() ?? 0;
    return bTime - aTime;
  });
  return {
    ongoing: pick("ongoing"),
    registrationOpen: pick("registration-open"),
    upcoming,
    awaiting: pick("awaiting-announcement"),
    completed,
  };
}

export type GuideLane =
  | "ongoing"
  | "registration-open"
  | "opening-soon"
  | "awaiting-brief"
  | "closed-upcoming"
  | "completed";

export function resolveGuideLane(competition: TaiwanCompetition2026, now = new Date()): GuideLane {
  const status = resolveRuntimeStatus(competition, now);
  if (status === "ongoing") {
    return "ongoing";
  }
  if (status === "completed") {
    return "completed";
  }
  if (status === "registration-open") {
    return "registration-open";
  }
  if (status === "awaiting-announcement") {
    return "awaiting-brief";
  }
  const deadline = parseTaipeiDate(competition.registrationDeadline);
  if (deadline && now > deadline) {
    return "closed-upcoming";
  }
  return "opening-soon";
}

export function laneLabel(lane: GuideLane): string {
  switch (lane) {
    case "ongoing":
      return "正在進行";
    case "registration-open":
      return "報名中";
    case "opening-soon":
      return "即將開放";
    case "awaiting-brief":
      return "等待簡章";
    case "closed-upcoming":
      return "尚未比賽，報名已截止";
    case "completed":
      return "已結束";
  }
}

function byStartDate(a: TaiwanCompetition2026, b: TaiwanCompetition2026) {
  const aTime = parseTaipeiDate(a.startDate)?.getTime() ?? Number.POSITIVE_INFINITY;
  const bTime = parseTaipeiDate(b.startDate)?.getTime() ?? Number.POSITIVE_INFINITY;
  return aTime - bTime;
}

export function groupGuideLanes(competitions: TaiwanCompetition2026[], now = new Date()) {
  const buckets: Record<GuideLane, TaiwanCompetition2026[]> = {
    ongoing: [],
    "registration-open": [],
    "opening-soon": [],
    "awaiting-brief": [],
    "closed-upcoming": [],
    completed: [],
  };
  competitions.forEach((item) => {
    buckets[resolveGuideLane(item, now)].push(item);
  });
  buckets["opening-soon"].sort(byStartDate);
  buckets["closed-upcoming"].sort(byStartDate);
  buckets.completed.sort((a, b) => {
    const aTime = parseTaipeiDate(a.endDate || a.startDate)?.getTime() ?? 0;
    const bTime = parseTaipeiDate(b.endDate || b.startDate)?.getTime() ?? 0;
    return bTime - aTime;
  });
  return buckets;
}

export function featuredActionableEvent(
  competitions: TaiwanCompetition2026[],
  now = new Date(),
): TaiwanCompetition2026 | null {
  const lanes = groupGuideLanes(competitions, now);
  return lanes.ongoing[0] || lanes["registration-open"][0] || lanes["opening-soon"][0] || lanes["awaiting-brief"][0] || null;
}

export const SUPPORT_GROUPS = [
  {
    id: "on-ice-prep",
    title: "上場準備",
    values: ["costume", "hair-makeup", "choreography", "music-edit"],
  },
  {
    id: "admin-day",
    title: "報名與比賽日",
    values: ["registration-admin", "companion-video", "transport-safety"],
  },
  {
    id: "growth",
    title: "成長與保存",
    values: ["mentor", "archive"],
  },
] as const;

export function countdownLabel(target?: string, now = new Date()): string | null {
  const parsed = parseTaipeiDate(target);
  if (!parsed) {
    return null;
  }
  const diff = parsed.getTime() - now.getTime();
  if (diff < 0) {
    return "期限已過";
  }
  const days = Math.ceil(diff / 86_400_000);
  if (days === 0) {
    return "今日截止";
  }
  return `尚餘 ${days} 天`;
}

export function latestVerifiedAt(competitions: TaiwanCompetition2026[]): string | null {
  const dates = competitions.map((item) => item.verifiedAt).filter(Boolean).sort();
  return dates.at(-1) ?? null;
}

export function nextCompetition(competitions: TaiwanCompetition2026[], now = new Date()): TaiwanCompetition2026 | null {
  return competitions
    .filter((item) => {
      const start = parseTaipeiDate(item.startDate);
      return start && start.getTime() >= now.getTime() && resolveRuntimeStatus(item, now) !== "completed";
    })
    .sort((a, b) => (parseTaipeiDate(a.startDate)?.getTime() ?? 0) - (parseTaipeiDate(b.startDate)?.getTime() ?? 0))[0] ?? null;
}

export function nearestOpenDeadline(competitions: TaiwanCompetition2026[], now = new Date()): TaiwanCompetition2026 | null {
  return competitions
    .filter((item) => {
      const deadline = parseTaipeiDate(item.registrationDeadline);
      return deadline && deadline.getTime() >= now.getTime() && resolveRuntimeStatus(item, now) === "registration-open";
    })
    .sort(
      (a, b) =>
        (parseTaipeiDate(a.registrationDeadline)?.getTime() ?? 0) - (parseTaipeiDate(b.registrationDeadline)?.getTime() ?? 0),
    )[0] ?? null;
}

export function confirmedAdultCount(competitions: TaiwanCompetition2026[]): number {
  return competitions.filter((item) => item.adultEligibility === "confirmed").length;
}

export function confirmedFeeText(competition: TaiwanCompetition2026): string {
  const confirmed = competition.fees?.filter((fee) => fee.status === "confirmed" && typeof fee.amount === "number");
  if (!confirmed || confirmed.length === 0) {
    return "洽詢／等待公告";
  }
  const first = confirmed[0];
  return `NT$${first.amount?.toLocaleString("zh-Hant")} 起`;
}

export function hasOfficialDate(competition: TaiwanCompetition2026): boolean {
  return Boolean(competition.startDate);
}

export function youtubeIdFromUrl(url?: string): string | null {
  if (!url) {
    return null;
  }
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.replace("/", "") || null;
    }
    if (parsed.hostname.includes("youtube.com")) {
      return parsed.searchParams.get("v");
    }
  } catch {
    return null;
  }
  return null;
}

export function outcomeLabel(value: EligibilityOutcome): string {
  switch (value) {
    case "preliminary-match":
      return "初步符合";
    case "need-more-info":
      return "需要補充資料";
    case "ask-organizer":
      return "需要向主辦單位確認";
    case "no-division-found":
      return "目前未查得適合組別";
  }
}

export type EligibilityResult = {
  outcome: EligibilityOutcome;
  suggestedEvents: TaiwanCompetition2026[];
  possibleDivisions: string[];
  missing: string[];
  nextSteps: string[];
  ruleLinks: Array<{ label: string; href: string }>;
};

export function evaluateEligibility(
  state: EligibilityState,
  competitions: TaiwanCompetition2026[],
): EligibilityResult {
  const missing: string[] = [];
  if (!state.birthYear && !state.age) {
    missing.push("出生年份或目前年齡");
  }
  if (!state.discipline) {
    missing.push("滑冰項目（單人／Solo Dance／Partnered Dance）");
  }
  if (!state.testingLevel) {
    missing.push("目前檢定或測驗級別");
  }
  if (!state.hasProgram) {
    missing.push("是否已有節目");
  }
  if (!state.hasCoach) {
    missing.push("是否已有教練");
  }
  if (!state.isMember) {
    missing.push("是否為協會或俱樂部會員");
  }
  if (state.discipline === "partnered-dance" && state.hasPartner !== "yes") {
    missing.push("舞伴狀態（Partnered Ice Dance 需要舞伴）");
  }

  const birthYear = Number.parseInt(state.birthYear, 10);
  const age = Number.parseInt(state.age, 10);
  const hasAge = Number.isFinite(birthYear) || Number.isFinite(age);
  const elite = competitions.find((item) => item.id === "tw-2026-elites-cup");
  const taichung = competitions.find((item) => item.id === "tw-2026-taichung-mayor-cup");
  const nationals = competitions.find((item) => item.id === "tw-2026-national-championships");
  const suggested: TaiwanCompetition2026[] = [];
  const possibleDivisions: string[] = [];
  const ruleLinks: Array<{ label: string; href: string }> = [];
  const nextSteps: string[] = [];

  const addRules = (competition?: TaiwanCompetition2026) => {
    if (!competition) {
      return;
    }
    if (competition.rulesUrl) {
      ruleLinks.push({ label: `${competition.nameZh}競賽規程`, href: competition.rulesUrl });
    } else if (competition.officialNoticeUrl) {
      ruleLinks.push({ label: `${competition.nameZh}官方公告`, href: competition.officialNoticeUrl });
    }
  };

  if (!state.discipline || !hasAge) {
    return {
      outcome: "need-more-info",
      suggestedEvents: [],
      possibleDivisions: [],
      missing,
      nextSteps: ["先補齊年齡與項目，再對照各賽已公布規程。", "不要在資料不足時假設可以報名。"],
      ruleLinks: competitions.flatMap((item) =>
        item.rulesUrl ? [{ label: `${item.nameZh}競賽規程`, href: item.rulesUrl }] : item.officialNoticeUrl ? [{ label: `${item.nameZh}官方公告`, href: item.officialNoticeUrl }] : [],
      ),
    };
  }

  const lookLikeAdult =
    (Number.isFinite(age) && age >= 18) || (Number.isFinite(birthYear) && birthYear <= 2008);
  const maybeBorderline2009 = Number.isFinite(birthYear) && birthYear === 2009;
  const tooYoungForEliteAdult =
    (Number.isFinite(birthYear) && birthYear > 2009) || (Number.isFinite(age) && age < 17);

  if (state.discipline === "singles" || state.discipline === "artistic") {
    if (taichung) {
      suggested.push(taichung);
      possibleDivisions.push(...(taichung.adultDivisions ?? []));
      addRules(taichung);
    }
    if (elite && !tooYoungForEliteAdult) {
      suggested.push(elite);
      if (lookLikeAdult || maybeBorderline2009) {
        possibleDivisions.push(...(elite.adultDivisions ?? []));
      }
      addRules(elite);
    }
    if (nationals) {
      suggested.push(nationals);
      addRules(nationals);
    }
  }

  if (state.discipline === "solo-dance" || state.discipline === "partnered-dance") {
    if (taichung) {
      suggested.push(taichung);
      possibleDivisions.push("個人冰舞（表演項目）", "雙人冰舞（表演項目）");
      addRules(taichung);
    }
    if (nationals) {
      suggested.push(nationals);
      addRules(nationals);
    }
  }

  if (state.discipline === "solo-dance" || state.discipline === "partnered-dance") {
    nextSteps.push("冰舞組別以各賽規程為準；菁英錦標賽規程未列出冰舞項目。");
    nextSteps.push("市長盃列有個人冰舞／雙人冰舞表演項目，分組細節需向承辦單位確認。");
    nextSteps.push("全國錦標賽 115 學年度冰舞項目等待公告。");
    return {
      outcome: "ask-organizer",
      suggestedEvents: suggested,
      possibleDivisions,
      missing,
      nextSteps,
      ruleLinks,
    };
  }

  if (state.discipline === "artistic") {
    nextSteps.push("市長盃規程列有藝術滑冰／道具秀滑冰等項目，是否對應你的節目需向承辦單位確認。");
    nextSteps.push("菁英錦標賽與全國錦標賽在查證當日未列出相同的 Showcase 組別。");
    return {
      outcome: "ask-organizer",
      suggestedEvents: suggested,
      possibleDivisions,
      missing,
      nextSteps,
      ruleLinks,
    };
  }

  if (missing.length >= 3) {
    nextSteps.push("先補齊檢定級別、節目、教練與會員狀態，再對照官方規程。");
    return {
      outcome: "need-more-info",
      suggestedEvents: suggested,
      possibleDivisions,
      missing,
      nextSteps,
      ruleLinks,
    };
  }

  if (nationals && suggested.some((item) => item.id === nationals.id)) {
    nextSteps.push("全國錦標賽成人組仍需等待 115 學年度規程，或直接向協會確認。");
  }
  if (elite && tooYoungForEliteAdult) {
    nextSteps.push("菁英錦標賽成年組年齡條件為出生於 2009 年 7 月 1 日之前；以目前填寫資料，未查得符合該成年組的條件。");
  } else if (elite && maybeBorderline2009) {
    nextSteps.push("出生年為 2009 時，需以 2009 年 7 月 1 日為界向主辦單位確認是否符合成年組。");
  }
  if (taichung) {
    nextSteps.push("市長盃已列出成人相關組別；報名截止日在查證當日已過，是否仍受理需向承辦單位確認。");
  }
  nextSteps.push("本工具只整理公開規程，最終組別及報名資格以各賽事公告為準。");

  if (tooYoungForEliteAdult && !taichung) {
    return {
      outcome: "no-division-found",
      suggestedEvents: suggested,
      possibleDivisions,
      missing,
      nextSteps,
      ruleLinks,
    };
  }

  if (maybeBorderline2009 || nationals) {
    return {
      outcome: lookLikeAdult ? "preliminary-match" : "ask-organizer",
      suggestedEvents: suggested,
      possibleDivisions,
      missing,
      nextSteps,
      ruleLinks,
    };
  }

  if (lookLikeAdult && (taichung || elite)) {
    return {
      outcome: missing.length > 0 ? "need-more-info" : "preliminary-match",
      suggestedEvents: suggested,
      possibleDivisions,
      missing,
      nextSteps,
      ruleLinks,
    };
  }

  return {
    outcome: "ask-organizer",
    suggestedEvents: suggested,
    possibleDivisions,
    missing,
    nextSteps,
    ruleLinks,
  };
}

export function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }
    const parsed = JSON.parse(raw) as unknown;
    return parsed && typeof parsed === "object" ? ({ ...fallback, ...(parsed as object) } as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage(key: string, value: unknown) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function clearStorageKeys(keys: string[]) {
  if (typeof window === "undefined") {
    return;
  }
  keys.forEach((key) => window.localStorage.removeItem(key));
}

export function twd(value: number): string {
  return `NT$${value.toLocaleString("zh-Hant")}`;
}

export function parseAmount(value: string): number {
  const parsed = Number.parseInt(value.replace(/[^\d-]/g, ""), 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function budgetTotals(items: Record<string, BudgetItem>) {
  return Object.values(items).reduce(
    (acc, item) => {
      const amount = parseAmount(item.amount);
      if (amount <= 0) {
        return acc;
      }
      if (item.confirmed) {
        acc.confirmed += amount;
      } else {
        acc.unconfirmed += amount;
      }
      acc.total += amount;
      return acc;
    },
    { confirmed: 0, unconfirmed: 0, total: 0 },
  );
}

export function supportBudgetLabel(value: string): string {
  switch (value) {
    case "undecided":
      return "尚未確定";
    case "under_10000":
      return "NT$10,000 以下";
    case "10000_30000":
      return "NT$10,000～30,000";
    case "30000_80000":
      return "NT$30,000～80,000";
    case "over_80000":
      return "NT$80,000 以上";
    default:
      return value || "未填寫";
  }
}

export function helpPeriodLabel(value: string): string {
  switch (value) {
    case "asap":
      return "盡快";
    case "12-16w":
      return "賽前 12 至 16 週";
    case "8-12w":
      return "賽前 8 至 12 週";
    case "4-8w":
      return "賽前 4 至 8 週";
    case "2-4w":
      return "賽前 2 至 4 週";
    case "race-week":
      return "賽前一週";
    case "event-day":
      return "比賽當日";
    case "post":
      return "賽後";
    default:
      return value || "未填寫";
  }
}

export function disciplineLabel(value: string): string {
  switch (value) {
    case "singles":
      return "單人滑";
    case "solo-dance":
      return "Solo Dance";
    case "partnered-dance":
      return "Partnered Ice Dance";
    case "artistic":
      return "Showcase／Artistic";
    default:
      return "未指定";
  }
}

export function yesNoLabel(value: string): string {
  if (value === "yes") {
    return "是";
  }
  if (value === "no") {
    return "否";
  }
  return "未填寫";
}

export function buildSupportSummary(
  support: SupportState,
  competitions: TaiwanCompetition2026[],
): string {
  const event = competitions.find((item) => item.id === support.eventId);
  const services = SUPPORT_SERVICES.filter((item) => support.services.includes(item.value)).map((item) => item.label);
  return [
    "我的國內參賽支援需求摘要",
    "",
    `目標賽事：${event?.nameZh ?? "未選擇"}`,
    `預計組別：${support.division || "未填寫"}`,
    `參賽項目：${disciplineLabel(support.discipline)}`,
    `目前程度：${support.level || "未填寫"}`,
    `是否已有教練：${yesNoLabel(support.hasCoach)}`,
    `是否已有舞伴：${yesNoLabel(support.hasPartner)}`,
    `需要的服務：${services.length ? services.join("、") : "未選擇"}`,
    `希望協助時間：${helpPeriodLabel(support.helpPeriod)}`,
    `預算範圍：${supportBudgetLabel(support.budget)}`,
    "",
    "補充需求：",
    support.extra || "未填寫",
    "",
    "費用標示為洽詢／依需求報價／由服務提供者確認，不代表已核准的固定價格。",
  ].join("\n");
}

export function buildBudgetSummary(budget: BudgetState, competitions: TaiwanCompetition2026[]): string {
  const event = competitions.find((item) => item.id === budget.eventId);
  const totals = budgetTotals(budget.items);
  const lines = BUDGET_CATEGORIES.map((category) => {
    const item = budget.items[category.id];
    const amount = parseAmount(item?.amount ?? "");
    if (amount <= 0) {
      return `${category.label}：尚未填寫`;
    }
    return `${category.label}：${twd(amount)}（${item?.confirmed ? "已確認" : "尚未確認"}）`;
  });
  return [
    "國內參賽預算摘要",
    `賽事：${event?.nameZh ?? "未選擇"}`,
    `幣別：TWD`,
    "",
    ...lines,
    "",
    `已確認金額：${twd(totals.confirmed)}`,
    `尚未確認金額：${twd(totals.unconfirmed)}`,
    `預估總額：${twd(totals.total)}`,
    "",
    "未填寫項目不代表官方價格為零。",
  ].join("\n");
}

export function buildResultSummary(record: ResultRecord, competitions: TaiwanCompetition2026[]): string {
  const event = competitions.find((item) => item.id === record.eventId);
  return [
    "賽後紀錄摘要",
    `賽事：${event?.nameZh || record.customName || "未填寫"}`,
    `日期：${record.date || "未填寫"}`,
    `組別：${record.division || "未填寫"}`,
    `項目：${record.discipline || "未填寫"}`,
    `名次：${record.placement || "未填寫"}`,
    `總分：${record.total || "未填寫"}`,
    `TES：${record.tes || "未填寫"}`,
    `PCS：${record.pcs || "未填寫"}`,
    `扣分：${record.deductions || "未填寫"}`,
    `官方成績：${record.resultsUrl || "未填寫"}`,
    `影片：${record.videoUrl || "未填寫"}`,
    `照片：${record.photoUrl || "未填寫"}`,
    "",
    "教練回饋：",
    record.coachNotes || "未填寫",
    "",
    "自我回顧：",
    record.selfReview || "未填寫",
    "",
    "下次目標：",
    record.nextGoal || "未填寫",
  ].join("\n");
}

export function emptyResultRecord(): ResultRecord {
  return {
    id: `result-${Date.now()}`,
    eventId: "",
    customName: "",
    date: "",
    division: "",
    discipline: "",
    placement: "",
    total: "",
    tes: "",
    pcs: "",
    deductions: "",
    resultsUrl: "",
    videoUrl: "",
    photoUrl: "",
    coachNotes: "",
    selfReview: "",
    nextGoal: "",
  };
}

export function seedBudgetFromCompetition(competition?: TaiwanCompetition2026): BudgetState {
  const items = { ...EMPTY_BUDGET.items };
  if (competition?.fees) {
    const confirmedFees = competition.fees.filter((fee) => fee.status === "confirmed" && typeof fee.amount === "number");
    const entry = confirmedFees.find((fee) => fee.label.includes("報名") || fee.label.includes("成人") || fee.label.includes("長曲"));
    const membership = confirmedFees.find((fee) => fee.label.includes("註冊") || fee.label.includes("協會"));
    if (entry?.amount) {
      items["entry-fee"] = { amount: String(entry.amount), confirmed: true };
    }
    if (membership?.amount) {
      items.membership = { amount: String(membership.amount), confirmed: true };
    }
  }
  return { eventId: competition?.id ?? "", items };
}

export type GateEventFit = "" | "listed" | "not-listed" | "unknown";
export type GateLevel = "" | "meets" | "short" | "unknown";
export type GateCoach = "" | "has-coach" | "no-regular" | "unsure";
export type GateSignature = "" | "required" | "unsure" | "not-required";

export type GateDiscipline = "" | "adult-singles" | "solo-dance" | "partnered-dance" | "unsure";

export type GateAnswers = {
  eventFit: GateEventFit;
  level: GateLevel;
  coach: GateCoach;
  signature: GateSignature;
  discipline?: GateDiscipline;
};

export const EMPTY_GATE: GateAnswers = {
  eventFit: "",
  level: "",
  coach: "",
  signature: "",
};

export type GateVerdict = "preliminary-match" | "need-more-info" | "ask-organizer" | "may-not-qualify";

export type GateResult = {
  verdict: GateVerdict;
  title: string;
  detail: string;
  nextSteps: string[];
};

export function gateVerdictLabel(verdict: GateVerdict): string {
  switch (verdict) {
    case "preliminary-match":
      return "初步符合";
    case "need-more-info":
      return "需要補充資料";
    case "ask-organizer":
      return "需要向主辦單位確認";
    case "may-not-qualify":
      return "目前條件可能不符合";
  }
}

const ORGANIZER_STEPS = [
  "確認目標比賽與成人項目",
  "附上報名表或截圖詢問主辦單位",
  "確認能否以自主選手報名",
  "確認簽名者是否須具備特定教練資格",
  "若必須簽署，安排一次性參賽評估",
];

export function evaluateGate(answers: GateAnswers): GateResult | null {
  if (!answers.eventFit && !answers.level && !answers.coach && !answers.signature) {
    return null;
  }
  if (!answers.eventFit || !answers.level || !answers.coach || !answers.signature) {
    return {
      verdict: "need-more-info",
      title: "先補齊四關的答案",
      detail: "項目、檢定、教練現況與簽名欄還沒有全部填完。這不是報名結論。",
      nextSteps: ["依序完成四關選擇", "對照該場規程列出的項目與檢定條件", "沒有寫在規程裡的事項，向主辦單位確認"],
    };
  }
  if (answers.eventFit === "not-listed") {
    return {
      verdict: "may-not-qualify",
      title: "這場賽事沒有列出你要的成人項目",
      detail: "名稱含有「成人」不代表花式、Solo Dance 與 Partnered Dance 都有開放。請改看規程實際列出的項目。",
      nextSteps: ["對照該場規程的項目表", "若規程沒有你的項目，不要先做節目或繳註冊費", "仍有疑問時，向主辦單位確認"],
    };
  }
  if (answers.level === "short") {
    return {
      verdict: "may-not-qualify",
      title: "先安排檢定，不是先報名",
      detail: "級別不足時，下一步是安排檢定。不要先製作節目或完成報名。",
      nextSteps: ["對照該項目的正式檢定要求", "安排可參加的檢定", "檢定結果出來後，再回到資格檢查"],
    };
  }
  if (answers.coach === "no-regular" && answers.signature === "required") {
    return {
      verdict: "ask-organizer",
      title: "先處理教練簽署，不是先繳註冊費",
      detail: "你目前沒有固定教練，而報名表出現教練簽名欄。先確認能否以自主選手報名，以及簽名者需要具備哪些資格。",
      nextSteps: ORGANIZER_STEPS,
    };
  }
  if (answers.eventFit === "unknown" || answers.signature === "unsure" || answers.coach === "unsure" || answers.level === "unknown") {
    return {
      verdict: "ask-organizer",
      title: "規程沒有寫清楚的部分，先問主辦單位",
      detail: "頁面不能把未公布的項目、檢定或簽名規則補成結論。",
      nextSteps: ORGANIZER_STEPS.slice(0, 4),
    };
  }
  return {
    verdict: "preliminary-match",
    title: "前三關目前看可行，接著才處理註冊",
    detail: "這是初步整理，不是主辦單位的錄取或報名核准。前一年度的選手註冊不會自動延續。",
    nextSteps: ["完成協會當年度選手註冊與繳費", "再依該場簡章正式報名", "報名截止與組別仍以主辦單位最新公告為準"],
  };
}
