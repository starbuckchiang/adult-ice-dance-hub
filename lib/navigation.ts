export type NavLink = {
  href: string;
  label: string;
  description?: string;
};

export type NavCategory = {
  id: string;
  label: string;
  children?: NavLink[];
  overviewHref?: string;
};

export function isDropdownCategory(category: NavCategory): boolean {
  return Boolean(category.children?.length);
}

/**
 * Future planner lives at this path. Until that page exists, the floating CTA
 * uses COMPETITION_PLAN_HREF.
 */
export const COMPETITION_PLAN_PATH = "/plan-my-first-competition";

export const COMPETITION_PLAN_HREF = "/competitions#start";

export const COMPETITION_PLAN_LABEL = "開始第一次參賽規劃";

export const COMPETITION_PLAN_LABEL_MOBILE = "開始參賽規劃";

export const navCategories: NavCategory[] = [
  {
    id: "learn",
    label: "學習冰舞",
    children: [
      { href: "/learn/steps", label: "基礎步伐" },
      { href: "/learn/pattern-dance", label: "Pattern Dance" },
      { href: "/music", label: "音樂與編舞" },
      { href: "/rules", label: "規則入門" },
    ],
  },
  {
    id: "gear",
    label: "裝備指南",
    overviewHref: "/guides/buy-skates",
  },
  {
    id: "compete",
    label: "參賽與檢定",
    children: [
      { href: "/guides/taiwan-adult-competitions-2026", label: "台灣成人賽" },
      { href: "/competitions", label: "海外與近期賽事" },
      { href: "/guides/ice-dance-tests-in-taiwan", label: "台灣冰舞檢定" },
      { href: "/guides/ice-dance-video-tests-from-taiwan", label: "錄影檢定" },
      { href: "/testing", label: "檢定入口" },
    ],
  },
  {
    id: "global",
    label: "跨國資源",
    children: [
      { href: "/countries", label: "國家資源總覽" },
      { href: "/clubs", label: "俱樂部與協會名錄" },
      { href: "/community", label: "交流" },
    ],
  },
  {
    id: "live",
    label: "影音直播",
    children: [
      { href: "/watch#replays", label: "最新重播" },
      { href: "/watch#live-now", label: "現正直播" },
      { href: "/watch#upcoming", label: "即將直播" },
    ],
  },
  {
    id: "services",
    label: "參賽服務",
    children: [
      {
        href: "/guides/taiwan-adult-competitions-2026#services",
        label: "支援服務",
      },
      {
        href: "/guides/taiwan-adult-competitions-2026#support-contact",
        label: "服務洽詢",
      },
    ],
  },
];

export const footerColumns: { id: string; title: string; links: NavLink[] }[] = [
  {
    id: "explore",
    title: "探索",
    links: [
      { href: "/learn", label: "學習冰舞" },
      { href: "/guides/buy-skates", label: "裝備指南" },
      { href: "/competitions", label: "參賽與檢定" },
      { href: "/countries", label: "跨國資源" },
      { href: "/competitions#live-now", label: "影音直播" },
    ],
  },
  {
    id: "shortcuts",
    title: "實用入口",
    links: [
      { href: "/competitions#upcoming", label: "近期賽事" },
      { href: "/testing", label: "冰舞檢定入口" },
      { href: "/guides/buy-skates", label: "滑冰鞋採購指南" },
      { href: "/countries", label: "國家總覽" },
    ],
  },
  {
    id: "services",
    title: "服務與本站",
    links: [
      { href: "/guides/taiwan-adult-competitions-2026#services", label: "參賽服務" },
      { href: "/advertising", label: "廣告合作" },
      { href: "/about", label: "聯絡本站" },
      { href: "/about", label: "關於本站" },
      { href: "/about#data-policy", label: "資料來源" },
      { href: "/privacy", label: "隱私權" },
      { href: "/terms", label: "服務條款" },
    ],
  },
];

export const searchIndex: NavLink[] = [
  ...navCategories.flatMap((category) => [
    ...(category.overviewHref ? [{ href: category.overviewHref, label: category.label }] : []),
    ...(category.children ?? []),
  ]),
  ...footerColumns.flatMap((column) => column.links),
  { href: "/community/partners", label: "舞伴交流" },
  { href: "/community/coaches", label: "教練交流" },
  { href: "/community/off-ice", label: "陸地訓練" },
  { href: "/submit-listing", label: "申請刊登" },
  { href: "/learn", label: "學習中心" },
].filter((link, index, all) => all.findIndex((item) => item.href === link.href && item.label === link.label) === index);
