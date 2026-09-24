export const ICE_DANCE_TESTS_PATH = "/guides/ice-dance-tests-in-taiwan";
export const ICE_DANCE_VIDEO_TESTS_PATH = "/guides/ice-dance-video-tests-from-taiwan";
export const VERIFIED_ON = "2026-09-22";
export const VERIFIED_ON_ZH = "2026年9月22日";

export const AURORA_EMAIL = "info@auroraicerink.com.tw";
export const AURORA_ACADEMY_EMAIL = "asa@auroraicerink.com.tw";
export const AURORA_SITE = "https://www.auroraicerink.com.tw/faq";
export const ISIASIA_EMAIL = "info@isiasia.org";

export const GUIDE_SOURCES = [
  {
    id: "testing-requirements",
    name: "ISIAsia Testing Requirements",
    href: "https://isiasia.org/isi-test/isi-testing-requirements/",
  },
  {
    id: "test-registration",
    name: "ISIAsia Test Registration",
    href: "https://isiasia.org/isi-test/test-registration/",
  },
  {
    id: "admin-list",
    name: "ISIAsia Administrative Member List",
    href: "https://isiasia.org/membership-index/registered-member/administrative_member_list/",
  },
  {
    id: "isi-test-registration",
    name: "ISI Test Registration",
    href: "https://skateisi.org/programs/test-registration/",
  },
  {
    id: "aurora-contact",
    name: "極光冰場聯絡資訊",
    href: "https://www.auroraicerink.com.tw/faq",
  },
  {
    id: "hksu-june-2026",
    name: "HKSU Level Test (On-Ice) June 2026",
    href: "https://hksu.org/application-level-test-on-ice-june-2026/",
  },
] as const;

export const ICE_DANCE_LEVELS = [
  {
    id: "1",
    title: "Ice Dance 1",
    dances: ["Chasse Sequence", "Progressive Sequence"],
    group: "foundation",
  },
  {
    id: "2",
    title: "Ice Dance 2",
    dances: ["Swing Rolls", "Dutch Waltz"],
    group: "foundation",
  },
  {
    id: "3",
    title: "Ice Dance 3",
    dances: ["Canasta Tango", "Rhythm Blues"],
    group: "foundation",
  },
  {
    id: "4",
    title: "Ice Dance 4",
    dances: ["Swing Dance", "Cha Cha", "Fiesta Tango"],
    group: "later",
  },
  {
    id: "5",
    title: "Ice Dance 5",
    dances: ["Willow Waltz", "Hickory Hoedown", "Ten Fox"],
    group: "later",
  },
  {
    id: "6",
    title: "Ice Dance 6",
    dances: ["Fourteen Step", "Foxtrot", "European Waltz"],
    group: "later",
  },
  {
    id: "7",
    title: "Ice Dance 7",
    dances: ["Rocker Foxtrot", "Tango", "American Waltz"],
    group: "later",
  },
  {
    id: "8",
    title: "Ice Dance 8",
    dances: ["Blues", "Killian"],
    group: "later",
  },
  {
    id: "9",
    title: "Ice Dance 9",
    dances: ["Paso Doble", "Quickstep", "Starlight Waltz"],
    group: "later",
  },
  {
    id: "10",
    title: "Ice Dance 10",
    dances: ["Westminster Waltz", "Argentine Tango", "Viennese Waltz"],
    group: "later",
  },
] as const;

export const REQUIREMENTS = [
  {
    title: "有效行政會員機構",
    text: "檢定須在目前有效的 ISI／ISIAsia Administrative Member 冰場或機構進行。",
  },
  {
    title: "有效專業會員評分",
    text: "須由目前有效的 ISI／ISIAsia Professional Member 評分。",
  },
  {
    title: "考生個人會籍",
    text: "考生須具有目前有效的 ISI／ISIAsia Individual 或 Professional Member 資格。",
  },
  {
    title: "依序通過",
    text: "各級須依難度順序參加並通過，不能自行跳級。",
  },
] as const;

export const TAIWAN_ADMIN_MEMBERS = [
  {
    id: "aurora",
    membershipNo: "23-AD254",
    nameZh: "極光冰場",
    nameEn: "Aurora Ice Rink",
    region: "Taiwan",
    status: "Valid",
    expiry: "2027-04-30",
    statusTone: "confirmed" as const,
    statusLabel: "已確認行政會員資格",
    note: "查證當日未找到已公告的 Ice Dance 1–10 課程或檢定場次。行政會員資格不代表目前有開課、合格冰舞考官或可報名日期。",
  },
] as const;

export const COMPARISON_ROWS = [
  {
    system: "ISIAsia Ice Dance Test",
    publicStatus: "官方公布 Ice Dance 1–10 級制度與登錄條件。",
    feasibility: "有機會，但須透過有效行政會員機構、合格專業會員與個人會籍，並依序參加。不是已可直接向總部報名。",
    tone: "opportunity" as const,
    toneLabel: "有機會",
  },
  {
    system: "香港 HKSU Level Test",
    publicStatus: "中國香港滑冰聯盟有花樣滑冰綜合等級測試。2026 年 6 月已公告的是 Level 9 至 Master 現場考核，不是冰舞專場。",
    feasibility: "尚未找到目前已公告的冰舞專場。",
    tone: "none" as const,
    toneLabel: "尚未找到公開場次",
  },
  {
    system: "Singapore SISA Test",
    publicStatus: "新加坡有檢定制度。查證當日未找到新的 2026 冰舞檢定日期。",
    feasibility: "對台灣成人而言，目前沒有可核對的 2026 冰舞檢定場次。",
    tone: "none" as const,
    toneLabel: "尚未找到公開場次",
  },
  {
    system: "Japan JSF Badge Test",
    publicStatus: "日本徽章測驗制度須有有效的日本滑冰連盟選手註冊。",
    feasibility: "外國短期訪客較不實際。",
    tone: "limited" as const,
    toneLabel: "較不實際",
  },
] as const;

export const ASK_CHECKLIST = [
  "是否有熟悉 ISI Ice Dance syllabus 的教練",
  "是否接受成人初學者",
  "Pattern Dance 能否單人測驗，或必須準備舞伴",
  "檢定費是否包含會籍、冰時、教練與 ISIAsia 登錄費",
  "目前有沒有合格冰舞考官，以及下一步如何取得正式送件指示",
] as const;

export const VIDEO_STEPS = [
  {
    title: "確認檢定制度",
    text: "先確認要以 ISIAsia Ice Dance 參加，不要把美國 ISI、香港綜合等級測試或其他協會制度混用。",
  },
  {
    title: "個人會籍",
    text: "考生須具有目前有效的 ISI／ISIAsia Individual 或 Professional Member 資格。",
  },
  {
    title: "前級是否通過",
    text: "各級須依序通過。申請高階評審前，官方要求先確認前級已登錄。",
  },
  {
    title: "台灣承辦機構",
    text: "一般檢定須在有效行政會員冰場或機構進行。錄影送件也不能跳過會籍與承辦資格。",
  },
  {
    title: "該級別能否錄影",
    text: "不是每一級都可用錄影代替現場。須先核對該級的評審方式，再向冰場或 ISIAsia 取得書面指示。",
  },
  {
    title: "取得正式送件指示",
    text: "在拍攝與上傳前，先取得承辦機構或 ISIAsia 的表格、連結設定與送件信箱。YouTube 連結本身不是報名。",
  },
] as const;

export const VIDEO_LEVELS = [
  {
    id: "dance-1-4",
    levels: "Ice Dance 1–4",
    category: "live" as const,
    categoryLabel: "一般現場評分",
    detail:
      "ISIAsia 將 Ice Dance 1–4 列於一般 Dance 測驗內容。四項基本條件適用：有效行政會員機構、有效專業會員評分、考生個人會籍、依序通過。官方高階錄影規定未把 Ice Dance 1–4 寫成須送 ISIAsia 辦公室評審的級別。",
  },
  {
    id: "dance-5-6",
    levels: "Ice Dance 5–6",
    category: "live" as const,
    categoryLabel: "一般現場評分",
    detail:
      "官方 High Level 規定：Level 5、Level 6（Pair 6 除外）須由一名已通過同級或以上、或具 Silver Judge 資格的考官評分。教練不得評自己的學生。該段錄影備援文字寫的是 Freestyle 5–7 與 Open Freestyle，因此 Ice Dance 5–6 是否可改送錄影，須向 ISIAsia 確認，本頁不自行推論。",
  },
  {
    id: "dance-7",
    levels: "Ice Dance 7",
    category: "panel" as const,
    categoryLabel: "須高階評審團",
    detail:
      "官方規定 Level 7 須由三名已通過同級或以上、或具 Gold Judge 資格的考官評分。Ice Dance 7 是否適用 Freestyle 的錄影備援，官方頁未單獨寫明，須向 ISIAsia 確認。",
  },
  {
    id: "dance-8-9",
    levels: "Ice Dance 8–9",
    category: "video" as const,
    categoryLabel: "特定條件可錄影",
    detail:
      "官方規定 Level 8、Level 9 應將未剪輯影片送 ISIAsia 辦公室由高階評審團評分。若事先取得 ISIAsia 核准，且能安排三名 High Level Judges，也可以改為現場。",
  },
  {
    id: "dance-10",
    levels: "Ice Dance 10",
    category: "live-only" as const,
    categoryLabel: "僅限現場",
    detail:
      "官方寫明 All ISI Level 10 tests 僅在 Skate Asia Competitions 與 ISI World Competitions 現場進行。本頁不把 Ice Dance 10 寫成可在台灣自行錄影送件。",
  },
] as const;

export const VIDEO_PREP = [
  "使用單機位拍攝。",
  "影片須完整連續、未剪輯；各段須一次拍完，不能拆成多段再拼接。",
  "清楚拍到滑行路線與應考動作。",
  "片頭由考生在鏡頭前自報姓名、所屬冰場與送審級別。",
  "若提供 YouTube 連結，須設為非公開或不公開列出，只有拿到連結的人能觀看。",
  "也可上傳至雲端供 ISIAsia 下載。送出前先自行檢查是否符合官方要求。",
] as const;

export const VIDEO_PROCESS = [
  "先詢問台灣有效行政會員冰場，或寫信至 ISIAsia。",
  "確認會籍、前級登錄，以及該級別的評審方式。",
  "取得表格、考官安排或錄影送件指示後，再安排錄影。",
  "依指定管道送件，例如 info@isiasia.org，並依指示繳費。",
  "等待正式結果。官方寫高階錄影結果通常約 2–3 週；若要趕上比賽報名，請至少預留 30 日。",
] as const;

export const MISCONCEPTIONS = [
  {
    title: "YouTube 影片不等於正式報名",
    text: "官方可用雲端檔或 YouTube 連結收件，但連結須依指示設定，並連同 Test Judging Application 與繳費證明送出。自行上傳公開影片不是報名。",
  },
  {
    title: "錄影檢定不一定適用每個級別",
    text: "Ice Dance 8–9 官方寫應送未剪輯影片；Ice Dance 10 僅限指定賽會現場。較低級別以現場評分為原則，不能假設每一級都能錄影。",
  },
  {
    title: "海外制度允許影片，不代表台灣考生能跳過會員與承辦機構",
    text: "考生仍須先有有效會籍，並透過有效行政會員機構或 ISIAsia 指定流程送件。中國地區 Level 4 以上另有須送錄影的規定，不自動適用於台灣。",
  },
  {
    title: "美國 ISI「International Ice Dance Tests」不是全球投稿入口",
    text: "美國 ISI 寫明 International Ice Dance Tests 可將影片送美國全國辦公室。這是美國 ISI 的送件路徑，不能理解成任何人、任何地區都能直接投稿，也不能用來取代 ISIAsia 會籍與亞洲區承辦條件。",
  },
] as const;

export const TESTS_FAQ = [
  {
    q: "冰舞檢定有另外的成人組嗎？",
    a: "沒有。冰舞檢定通常依技術級別區分，不另外設成人組。成人指的是比賽年齡組別，不是檢定分組。",
  },
  {
    q: "人在台灣可以直接向 ISIAsia 總部約考嗎？",
    a: "不行。官方四項條件是：在有效行政會員機構進行、由有效專業會員評分、考生具個人會籍，並依序通過。有機會不代表已可直接報名。",
  },
  {
    q: "極光冰場現在有冰舞檢定場次嗎？",
    a: "極光冰場在官方行政會員名單為 Valid，會員編號 23-AD254，有效至 2027 年 4 月 30 日。查證當日未找到已公告的 Ice Dance 課程或檢定日期，須直接詢問冰場。",
  },
  {
    q: "Ice Dance 登錄費是多少？",
    a: "ISIAsia 列 Dance 測驗登錄費為每級 USD 6／HKD 50，不含教練、冰時、場地與高階評審費。實際總費用以冰場與 ISIAsia 當次通知為準。",
  },
];

export const VIDEO_FAQ = [
  {
    q: "把影片放到 YouTube 就算完成報名嗎？",
    a: "不算。官方可用未列出的 YouTube 連結或雲端檔收件，但仍須先確認資格、填寫申請表、依指定管道送件並完成繳費。",
  },
  {
    q: "每個 Ice Dance 級別都可以錄影嗎？",
    a: "不可以。官方將 Level 8–9 寫成應送未剪輯影片；Level 10 僅限指定賽會現場。較低級別以現場評分為原則，是否可改送錄影須向 ISIAsia 確認。",
  },
  {
    q: "美國 ISI 接受 International Ice Dance Tests 錄影，台灣考生能直接投稿嗎？",
    a: "不能把該路徑當成全球投稿入口。台灣考生仍須確認 ISIAsia 會籍、前級、承辦機構與該級評審方式。",
  },
  {
    q: "還沒有個人會籍可以先錄影嗎？",
    a: "官方要求考生具有效個人會籍，並在申請高階評審前已登錄前級。先拍攝再補資格，不是官方流程。",
  },
];

export const RINK_INQUIRY_ZH = `主旨：詢問 ISIAsia Ice Dance 檢定（成人）

您好，我是成人滑冰學習者，想了解貴場目前是否協助 ISIAsia Ice Dance 1–10 檢定。

想確認的事項：
1. 是否有熟悉 ISI Ice Dance syllabus 的教練，以及是否接受成人初學者
2. Pattern Dance 能否單人測驗，或必須準備舞伴
3. 目前是否有合格冰舞考官，以及近期有沒有可參加的場次
4. 檢定費是否包含會籍、冰時、教練與 ISIAsia 登錄費
5. 若該級別可考慮錄影送件，正式流程與指定管道為何

謝謝。`;

export const RINK_INQUIRY_EN = `Subject: Inquiry about ISIAsia Ice Dance tests (adult skater)

Hello,

I am an adult figure skater in Taiwan. I would like to ask whether your rink currently supports ISIAsia Ice Dance 1–10 tests.

Please could you confirm:
1. Whether you have a coach familiar with the ISI Ice Dance syllabus, and whether adult beginners are accepted
2. Whether Pattern Dance tests may be taken solo, or a partner is required
3. Whether a qualified ice dance test judge is currently available, and whether any test session is scheduled
4. Whether the quoted fee includes membership, ice time, coaching, and the ISIAsia test registration fee
5. If video submission is possible for a given level, what the official process and submission channel are

Thank you.`;

export type RinkInquiryLanguage = "zh" | "en";

export function rinkInquirySubject(kind: RinkInquiryLanguage): string {
  return kind === "zh" ? "詢問 ISIAsia Ice Dance 檢定（成人）" : "Inquiry about ISIAsia Ice Dance tests (adult skater)";
}

export function rinkInquiryBody(kind: RinkInquiryLanguage): string {
  return kind === "zh" ? RINK_INQUIRY_ZH.replace(/^主旨：.+\n\n/, "") : RINK_INQUIRY_EN.replace(/^Subject: .+\n\n/, "");
}

export function auroraMailto(kind: RinkInquiryLanguage): string {
  return `mailto:${AURORA_EMAIL}?subject=${encodeURIComponent(rinkInquirySubject(kind))}&body=${encodeURIComponent(rinkInquiryBody(kind))}`;
}
