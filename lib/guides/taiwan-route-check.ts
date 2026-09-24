import type { GateAnswers, GateDiscipline, TaiwanCompetition2026 } from "@/lib/guides/taiwan-competitions-2026";

export type ProgramStatus = "" | "none" | "drafting" | "complete";
export type MusicStatus = "" | "none" | "choosing" | "edited";
export type PartnerStatus = "" | "have" | "none" | "solo" | "unsure";
export type TestNeed = "" | "need" | "no" | "unsure";
export type CoachHelp =
  | "assessment"
  | "confirm-event"
  | "test-plan"
  | "signature"
  | "has-coach"
  | "none";

export type PrepAnswers = {
  program: ProgramStatus;
  music: MusicStatus;
  partner: PartnerStatus;
  test: TestNeed;
  coachHelp: CoachHelp[];
};

export const EMPTY_PREP: PrepAnswers = {
  program: "",
  music: "",
  partner: "",
  test: "",
  coachHelp: [],
};

const PROGRAM_LABEL: Record<ProgramStatus, string> = {
  "": "尚待回答",
  none: "尚未",
  drafting: "編排中",
  complete: "已有完整節目",
};

const MUSIC_LABEL: Record<MusicStatus, string> = {
  "": "尚待回答",
  none: "尚未",
  choosing: "選曲中",
  edited: "已剪輯完成",
};

const PARTNER_LABEL: Record<PartnerStatus, string> = {
  "": "尚待回答",
  have: "已有舞伴",
  none: "尚未找到",
  solo: "想參加 Solo Dance",
  unsure: "尚不確定項目",
};

const TEST_LABEL: Record<TestNeed, string> = {
  "": "尚待回答",
  need: "需要",
  no: "不需要",
  unsure: "尚待確認",
};

const COACH_LABEL: Record<CoachHelp, string> = {
  assessment: "需要程度評估",
  "confirm-event": "需要確認參賽項目",
  "test-plan": "需要檢定規劃",
  signature: "需要報名表簽名確認",
  "has-coach": "已有教練",
  none: "暫不需要",
};

const DISCIPLINE_LABEL: Record<GateDiscipline, string> = {
  "": "尚待回答",
  "adult-singles": "成人花式",
  "solo-dance": "Solo Dance",
  "partnered-dance": "Partnered Dance",
  unsure: "尚待教練確認",
};

export type RouteSupport = {
  name: string;
  why: string;
  materials: string;
};

export type RouteCardModel = {
  eventName: string;
  discipline: string;
  level: string;
  program: string;
  music: string;
  partner: string;
  test: string;
  coachHelp: string;
  tasks: Array<{ title: string; detail: string }>;
  support: RouteSupport | null;
  complete: boolean;
};

export function disciplineLabel(value: GateDiscipline | undefined): string {
  return DISCIPLINE_LABEL[value ?? ""];
}

export function levelLabel(level: GateAnswers["level"]): string {
  if (level === "meets") return "已對照規程，自評符合";
  if (level === "short") return "自評級別不足";
  if (level === "unknown") return "尚待教練確認";
  return "尚待回答";
}

export function prepComplete(prep: PrepAnswers): boolean {
  return Boolean(prep.program && prep.music && prep.partner && prep.test && prep.coachHelp.length);
}

export function buildRouteCard(
  event: TaiwanCompetition2026 | undefined,
  gate: GateAnswers,
  prep: PrepAnswers,
): RouteCardModel {
  const tasks: Array<{ title: string; detail: string }> = [];
  const coachGap = prep.coachHelp.some((item) => item === "assessment" || item === "signature" || item === "confirm-event");
  if (prep.test === "need") tasks.push({ title: "報名前需要檢定", detail: "先排出可完成的檢定場次。" });
  if (prep.partner === "none") tasks.push({ title: "尚未找到舞伴", detail: "可改走 Solo Dance，或開始找舞伴。" });
  if (prep.partner === "solo" || gate.discipline === "solo-dance") tasks.push({ title: "想參加 Solo Dance", detail: "依單人項目準備，不必先找舞伴。" });
  if (prep.partner === "unsure" || gate.discipline === "unsure") tasks.push({ title: "項目尚未確定", detail: "先決定花式、Solo 或雙人。" });
  if (prep.partner === "have") tasks.push({ title: "已有舞伴", detail: "確認雙人練習與報名組合。" });
  if (prep.program === "none") tasks.push({ title: "節目尚未開始", detail: "項目定下來再排動作。" });
  if (prep.program === "drafting") tasks.push({ title: "節目編排中", detail: "先把現有段落練完整。" });
  if (prep.program === "complete") tasks.push({ title: "已有完整節目", detail: "保留節目，核對是否符合項目。" });
  if (prep.music === "none") tasks.push({ title: "比賽音樂尚未準備", detail: "項目確定後再選曲。" });
  if (prep.music === "choosing") tasks.push({ title: "音樂選曲中", detail: "先確定長度再剪輯。" });
  if (prep.music === "edited") tasks.push({ title: "音樂已剪輯完成", detail: "核對長度是否符合項目。" });
  if (prep.test !== "need" && prep.coachHelp.includes("test-plan")) tasks.push({ title: "報名前需要檢定", detail: "先排出可完成的檢定場次。" });
  if (prep.test === "unsure") tasks.push({ title: "檢定尚未確認", detail: "對照規程後再決定要不要考。" });
  if (prep.test === "no") tasks.push({ title: "目前不需加考檢定", detail: "依現有級別繼續準備。" });
  if (prep.coachHelp.includes("assessment")) tasks.push({ title: "需要程度評估", detail: "帶練習現況與目標項目討論。" });
  if (prep.coachHelp.includes("confirm-event")) tasks.push({ title: "需要確認參賽項目", detail: "請教練看花式、Solo 或雙人。" });
  if (prep.coachHelp.includes("signature")) tasks.push({ title: "需要簽名確認", detail: "先問主辦能否自主報名。" });
  if (prep.coachHelp.includes("has-coach")) tasks.push({ title: "已有教練", detail: "把這份路線卡交給教練看。" });
  if (prep.coachHelp.includes("none")) tasks.push({ title: "暫不需要教練協助", detail: "先依公告核對項目與期限。" });
  const unique = tasks.filter((item, index) => tasks.findIndex((task) => task.title === item.title) === index).slice(0, 3);

  let support: RouteSupport | null = null;
  if (coachGap || prep.coachHelp.includes("assessment") || gate.level === "short" || gate.level === "unknown") {
    support = {
      name: "安排第一次參賽評估",
      why: "程度、目標項目或簽名資格還沒有教練結論，先評估再投入節目與報名。",
      materials: "練習影片、想參加的項目，以及該場規程或報名表。",
    };
  } else if (prep.test === "need" || prep.test === "unsure" || prep.coachHelp.includes("test-plan")) {
    support = {
      name: "確認檢定與報名時程",
      why: "要先知道檢定是否來得及，再決定這次能不能正式報名。",
      materials: "目標比賽日期、目前檢定紀錄，以及規程裡的資格條件。",
    };
  } else if (prep.partner === "none" || prep.partner === "solo" || gate.discipline === "solo-dance") {
    support = {
      name: "尋找舞伴或 Solo Dance 路線",
      why: "舞伴還沒有定案時，先決定走 Solo Dance 還是雙人項目。",
      materials: "想參加的項目，以及是否已有可配合的練習對象。",
    };
  } else if (prep.program === "none" || prep.program === "drafting" || prep.music === "none" || prep.music === "choosing") {
    support = {
      name: "進入音樂與節目準備",
      why: "項目與級別方向已較清楚，可以開始選曲與編排。",
      materials: "教練確認過的項目、音樂長度限制，以及現有練習片段。",
    };
  } else if (prep.coachHelp.includes("signature") || prepComplete(prep)) {
    support = {
      name: "整理報名資料",
      why: "準備狀態已齊，下一步是把報名需要的文件與簽名問題整理給教練。",
      materials: "報名表、音樂檔與當年度選手註冊狀態。",
    };
  }

  if (!prep.program && !prep.music && !prep.partner && !prep.test && prep.coachHelp.length === 0) {
    support = null;
  }

  return {
    eventName: event?.nameZh || "尚待回答",
    discipline: disciplineLabel(gate.discipline),
    level: levelLabel(gate.level),
    program: PROGRAM_LABEL[prep.program],
    music: MUSIC_LABEL[prep.music],
    partner: PARTNER_LABEL[prep.partner],
    test: TEST_LABEL[prep.test],
    coachHelp: prep.coachHelp.length ? prep.coachHelp.map((item) => COACH_LABEL[item]).join("、") : "尚待回答",
    tasks: unique,
    support,
    complete: prepComplete(prep),
  };
}
