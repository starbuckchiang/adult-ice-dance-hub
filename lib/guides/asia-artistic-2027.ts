import eventsFile from "@/data/asia-artistic-2027.json";

export const ASIA_GUIDE_PATH = "/guides/asia-artistic-skating-2027";
export const ASIA_STORAGE_KEY = "asia-artistic-route-2027-v1";

export type DirectionId = "" | "music" | "character" | "pairs";
export type EventChoice = "" | "hk-cpir-2027" | "sz-skate-asia-2027" | "undecided";
export type GateState = "" | "confirmed" | "unconfirmed" | "need-help";
export type TriState = "" | "yes" | "no" | "unsure";
export type PrepState = "" | "none" | "drafting" | "ready";
export type PartnerState = "" | "have" | "none" | "not-needed" | "unsure";
export type LevelState = "" | "unknown" | "basic" | "fs-1-4" | "fs-5-10" | "other";

export type AsiaEvent = {
  id: Exclude<EventChoice, "" | "undecided">;
  nameEn: string;
  nameZh: string;
  city: string;
  venue: string;
  dateLabel: string;
  startDate: string;
  endDate: string;
  dateStatus: "confirmed" | "tentative";
  dateStatusLabel: string;
  programStatus: "awaiting-rules";
  programStatusLabel: string;
};

export type AsiaCatalog = {
  verifiedAt: string;
  sourceName: string;
  sourceUrl: string;
  events: AsiaEvent[];
};

export const asiaCatalog = eventsFile as AsiaCatalog;

export const DIRECTIONS = [
  {
    id: "music" as const,
    title: "音樂與滑行",
    text: "以用刃、滑行流暢度、編舞與音樂詮釋呈現個人風格。",
    focus: "Artistic Solo",
  },
  {
    id: "character" as const,
    title: "角色與故事",
    text: "透過角色設定、情節、服裝或道具，呈現戲劇性或娛樂效果。",
    focus: "Solo Spotlight",
  },
  {
    id: "pairs" as const,
    title: "雙人演出",
    text: "與舞伴共同創作角色、互動與整體表現。",
    focus: "Couple Spotlight",
  },
];

export const GATES = [
  { id: "event-open", label: "該場賽事是否確定開辦目標項目" },
  { id: "isi-level", label: "是否具有適用的 ISIAsia 測試級別" },
  { id: "representative", label: "是否有可代表報名的冰場、俱樂部或教練" },
  { id: "restrictions", label: "節目動作、道具、服裝與音樂是否符合級別限制" },
  { id: "deadline", label: "能否在報名期限前完成測試、節目、音樂與文件" },
] as const;

export type GateId = (typeof GATES)[number]["id"];

export type AsiaAnswers = {
  direction: DirectionId;
  eventId: EventChoice;
  gates: Record<GateId, GateState>;
  level: LevelState;
  coach: TriState;
  rink: TriState;
  program: PrepState;
  music: PrepState;
  costume: PrepState;
  partner: PartnerState;
  help: string[];
  createdOn: string;
};

export const EMPTY_ASIA: AsiaAnswers = {
  direction: "",
  eventId: "",
  gates: {
    "event-open": "",
    "isi-level": "",
    representative: "",
    restrictions: "",
    deadline: "",
  },
  level: "",
  coach: "",
  rink: "",
  program: "",
  music: "",
  costume: "",
  partner: "",
  help: [],
  createdOn: "",
};

const LEVEL_LABEL: Record<LevelState, string> = {
  "": "待確認",
  unknown: "尚未確認",
  basic: "基本級（Pre-Alpha 至 Delta）",
  "fs-1-4": "Freestyle 1–4",
  "fs-5-10": "Freestyle 5–10",
  other: "其他，需向教練確認",
};

const TRI_LABEL: Record<TriState, string> = {
  "": "待確認",
  yes: "已有",
  no: "尚未",
  unsure: "尚不確定",
};

const PREP_LABEL: Record<PrepState, string> = {
  "": "待確認",
  none: "尚未開始",
  drafting: "準備中",
  ready: "已有初稿",
};

const PARTNER_LABEL: Record<PartnerState, string> = {
  "": "待確認",
  have: "已有舞伴",
  none: "尚未找到",
  "not-needed": "這次不需要",
  unsure: "尚不確定",
};

export type RouteTask = { title: string; detail: string };

export type AsiaRouteCard = {
  direction: string;
  focus: string;
  eventName: string;
  eventStatus: string;
  level: string;
  coach: string;
  rink: string;
  program: string;
  music: string;
  costume: string;
  partner: string;
  verdict: "初步資料較完整" | "尚需補充資料" | "需要教練／冰場確認" | "需要向主辦單位確認";
  tasks: RouteTask[];
  support: { title: string; detail: string; href: string; cta: string };
  pending: Record<string, boolean>;
};

function directionMeta(id: DirectionId) {
  return DIRECTIONS.find((item) => item.id === id);
}

function eventMeta(id: EventChoice) {
  if (id === "undecided") return { name: "尚未決定", status: "需要本人確認" };
  const event = asiaCatalog.events.find((item) => item.id === id);
  if (!event) return { name: "待確認", status: "待確認" };
  return { name: `${event.city} · ${event.nameEn}`, status: event.dateStatus === "tentative" ? "暫定" : "已確認" };
}

export function buildAsiaRoute(answers: AsiaAnswers): AsiaRouteCard {
  const direction = directionMeta(answers.direction);
  const event = eventMeta(answers.eventId);
  const gateValues = GATES.map((gate) => answers.gates[gate.id]);
  const gatesComplete = gateValues.every(Boolean);
  const anyNeedHelp = gateValues.some((value) => value === "need-help");
  const organizerOpen =
    answers.gates["event-open"] === "unconfirmed" ||
    answers.gates["event-open"] === "need-help" ||
    answers.gates.deadline === "need-help" ||
    answers.eventId === "undecided";
  const coachOrRinkGap =
    answers.coach === "no" ||
    answers.coach === "unsure" ||
    answers.rink === "no" ||
    answers.rink === "unsure" ||
    answers.gates["isi-level"] === "need-help" ||
    answers.gates.representative === "need-help" ||
    answers.gates.restrictions === "need-help";
  const coreReady = Boolean(answers.direction && answers.eventId && gatesComplete && answers.level && answers.coach && answers.rink);

  let verdict: AsiaRouteCard["verdict"] = "尚需補充資料";
  if (organizerOpen || (anyNeedHelp && (answers.gates["event-open"] === "need-help" || answers.gates.deadline === "need-help"))) {
    verdict = "需要向主辦單位確認";
  } else if (coachOrRinkGap) {
    verdict = "需要教練／冰場確認";
  } else if (
    coreReady &&
    gateValues.every((value) => value === "confirmed") &&
    answers.level !== "unknown" &&
    answers.coach === "yes" &&
    answers.rink === "yes"
  ) {
    verdict = "初步資料較完整";
  } else if (anyNeedHelp) {
    verdict = "需要向主辦單位確認";
  }

  const tasks: RouteTask[] = [];
  const push = (title: string, detail: string) => {
    if (tasks.some((task) => task.title === title) || tasks.length >= 3) return;
    tasks.push({ title, detail });
  };

  if (!answers.level || answers.level === "unknown" || answers.gates["isi-level"] !== "confirmed") {
    push("查詢或確認目前 ISI 測試級別", "先核對可研究的項目範圍。");
  }
  if (answers.direction === "pairs" && answers.partner !== "have" && answers.partner !== "not-needed") {
    push("確認舞伴及 Couple Spotlight 可行性", "雙人項目須先有可一起練習的組合。");
  }
  if (answers.coach !== "yes" || answers.gates.restrictions !== "confirmed") {
    push("請教練確認項目與動作限制", "與教練討論你想參加的項目，確認動作是否符合規定。");
  }
  if (answers.rink !== "yes" || answers.gates.representative !== "confirmed") {
    push("聯絡可代表報名的冰場或俱樂部", "聯絡熟悉的冰場或俱樂部，確認是否可代表參賽。");
  }
  if (!answers.eventId || answers.eventId === "undecided" || answers.gates["event-open"] !== "confirmed") {
    push("追蹤目標賽事正式章程", "Artistic、Spotlight 是否開辦，仍待該場章程。");
  }
  if (answers.program !== "ready" || answers.music !== "ready") {
    push("建立節目概念與音樂方向", "先定表演方向，再選曲與編排。");
  }
  if (!tasks.length) {
    push("保留目前路線，等待章程更新", "資料較完整，仍須等主辦章程才能報名。");
  }

  const support = pickSupport(answers);

  return {
    direction: direction?.title ?? "待確認",
    focus: direction?.focus ?? "待確認",
    eventName: event.name,
    eventStatus: event.status,
    level: LEVEL_LABEL[answers.level],
    coach: TRI_LABEL[answers.coach],
    rink: TRI_LABEL[answers.rink],
    program: PREP_LABEL[answers.program],
    music: PREP_LABEL[answers.music],
    costume: PREP_LABEL[answers.costume],
    partner: PARTNER_LABEL[answers.partner],
    verdict,
    tasks: tasks.slice(0, 3),
    support,
    pending: {
      direction: !direction,
      focus: !direction,
      eventName: !answers.eventId,
      eventStatus: !answers.eventId,
      level: !answers.level,
      coach: !answers.coach,
      rink: !answers.rink,
      program: !answers.program,
      music: !answers.music,
      costume: !answers.costume,
      partner: !answers.partner,
    },
  };
}

function pickSupport(answers: AsiaAnswers): AsiaRouteCard["support"] {
  if (!answers.eventId || answers.eventId === "undecided" || answers.gates["event-open"] !== "confirmed") {
    return {
      title: "資格與章程確認",
      detail: "先對照 ISIAsia 賽程，等該場章程列出目標項目。",
      href: asiaCatalog.sourceUrl,
      cta: "查看官方賽程",
    };
  }
  if (answers.direction === "pairs" && answers.partner !== "have") {
    return {
      title: "舞伴與雙人節目規劃",
      detail: "Couple Spotlight 需要可一起練習與報名的組合。",
      href: "/community/partners",
      cta: "查看舞伴交流",
    };
  }
  if (answers.coach !== "yes" || answers.gates.restrictions !== "confirmed") {
    return {
      title: "教練／Mentor 協調",
      detail: "請教練看表演方向、級別與動作是否適合這條路線。",
      href: "/community/coaches",
      cta: "",
    };
  }
  if (answers.rink !== "yes" || answers.gates.representative !== "confirmed") {
    return {
      title: "冰場／俱樂部報名協調",
      detail: "確認有哪一座冰場或俱樂部可以代表報名。",
      href: "/clubs",
      cta: "查看俱樂部名錄",
    };
  }
  if (answers.program !== "ready" || answers.music !== "ready") {
    return {
      title: "音樂與節目企劃",
      detail: "方向定了之後，再收斂音樂長度與節目概念。",
      href: "/music",
      cta: "查看音樂與編舞",
    };
  }
  return {
    title: answers.eventId === "hk-cpir-2027" ? "香港參賽行政規劃" : "深圳參賽行政規劃",
    detail: "章程公布後，再排測試、文件與行程。目前不是報名。",
    href: asiaCatalog.sourceUrl,
    cta: "查看官方賽程",
  };
}

export function progressOf(answers: AsiaAnswers) {
  const gatesDone = GATES.every((gate) => answers.gates[gate.id]);
  return [
    { id: "direction", label: "表演方向", done: Boolean(answers.direction) },
    { id: "gates", label: "資格確認", done: gatesDone },
    { id: "event", label: "賽事選擇", done: Boolean(answers.eventId) },
    { id: "program", label: "節目準備", done: answers.program === "ready" && answers.music === "ready" },
  ];
}

export function loadAsiaAnswers(): AsiaAnswers | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(ASIA_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AsiaAnswers>;
    if (!parsed || typeof parsed !== "object") return null;
    return {
      ...EMPTY_ASIA,
      ...parsed,
      gates: { ...EMPTY_ASIA.gates, ...(parsed.gates ?? {}) },
      help: Array.isArray(parsed.help) ? parsed.help.filter((item) => typeof item === "string") : [],
    };
  } catch {
    return null;
  }
}

export function saveAsiaAnswers(answers: AsiaAnswers) {
  window.localStorage.setItem(ASIA_STORAGE_KEY, JSON.stringify(answers));
}

export function clearAsiaAnswers() {
  window.localStorage.removeItem(ASIA_STORAGE_KEY);
}

export const ASIA_FAQS = [
  {
    q: "Artistic Solo 是什麼？",
    a: "它是以滑行、編舞與音樂詮釋為主的表演方向。2027 香港 CPIR 與深圳 Skate Asia 是否開辦此項目，官方賽程尚未列出，須等該場報名章程確認。",
  },
  {
    q: "Solo Spotlight 是什麼？",
    a: "它偏向角色、情節、服裝或道具的單人表演。本頁只把它列為優先研究方向，不代表你已經被分到這個項目。",
  },
  {
    q: "Couple Spotlight 是什麼？",
    a: "它是與舞伴共同完成的雙人表演方向。是否開辦、是否接受成人組合，都要等該場章程、教練與可代表報名的單位確認。",
  },
  {
    q: "ISI 級別與動作限制怎麼看？",
    a: "測試級別與動作、道具、服裝、音樂限制以該場章程為準。本頁不推測截止日、費用或動作上限。級別尚未確認時，先向教練或 ISIAsia 行政會員冰場核對。",
  },
  {
    q: "如何向教練或冰場提出確認？",
    a: "帶著表演方向、想研究的項目、目前級別與候選賽事，請教練或冰場確認能否代表報名，以及動作是否符合級別。這不是正式資格審核。",
  },
  {
    q: "香港與深圳行程可以先排嗎？",
    a: "香港 CPIR 的日期與地點已在 ISIAsia 賽程公布。深圳 Skate Asia 2027 的日期在官方賽程標為待定。交通、住宿與報名費用都還沒有第一方章程，先不要當成確定行程。",
  },
];
