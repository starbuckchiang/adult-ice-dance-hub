export const SKATE_GUIDE_STORAGE_KEY = "aidh_skate_buy_guide_v1";
export const COMPARE_ITEM_LIMIT = 12;

export const TAIWAN_CHECKS = [
  "結帳頁能否選 Taiwan",
  "運送方式是否有追蹤",
  "運費是否到結帳最後一步才顯示",
  "是否限制特定品牌跨國銷售",
  "收件人中英文姓名是否正確",
  "地址與郵遞區號是否完整",
  "是否可能產生進口稅費",
  "是否需要實名認證或報關程序",
] as const;

export const PAYMENT_CHECKS = [
  "型號正確",
  "尺寸正確",
  "寬度正確",
  "顏色正確",
  "鞋靴與冰刀是否分售",
  "是否現貨",
  "預估出貨日",
  "是否能取消訂單",
  "退換貨條件",
  "保固方式",
  "海外刷卡手續費",
  "收件地址",
  "訂單確認信與付款紀錄已保存",
] as const;

export const CURRENCIES = ["TWD", "USD", "EUR", "GBP", "CAD", "JPY"] as const;
export type CurrencyCode = (typeof CURRENCIES)[number];

export const DEFAULT_RATES: Record<CurrencyCode, number> = {
  TWD: 1,
  USD: 32,
  EUR: 36,
  GBP: 42,
  CAD: 23,
  JPY: 0.22,
};

export type StockStatus = "in-stock" | "not-in-stock" | "unknown";
export type ReturnPayer = "shop" | "buyer" | "unknown";

export type CompareItem = {
  id: string;
  shopName: string;
  productUrl: string;
  price: number;
  currency: CurrencyCode;
  shipping: number;
  discount: number;
  excludeVat: boolean;
  vatAmount: number;
  tariffTwd: number;
  cardFeeTwd: number;
  stock: StockStatus;
  dispatchEstimate: string;
  returnDays: string;
  returnPayer: ReturnPayer;
  notes: string;
};

export type NeedsWorksheet = {
  useCase: string;
  level: string;
  brandModel: string;
  size: string;
  width: string;
  color: string;
  bootOnly: string;
  specialOrder: string;
  neededBy: string;
  budget: string;
};

export type GuideStore = {
  needs: NeedsWorksheet;
  rates: Record<CurrencyCode, number>;
  items: CompareItem[];
  taiwanChecks: Record<string, boolean>;
  paymentChecks: Record<string, boolean>;
};

export const EMPTY_NEEDS: NeedsWorksheet = {
  useCase: "",
  level: "",
  brandModel: "",
  size: "",
  width: "",
  color: "",
  bootOnly: "",
  specialOrder: "",
  neededBy: "",
  budget: "",
};

export const EMPTY_ITEM: Omit<CompareItem, "id"> = {
  shopName: "",
  productUrl: "",
  price: 0,
  currency: "USD",
  shipping: 0,
  discount: 0,
  excludeVat: false,
  vatAmount: 0,
  tariffTwd: 0,
  cardFeeTwd: 0,
  stock: "unknown",
  dispatchEstimate: "",
  returnDays: "",
  returnPayer: "unknown",
  notes: "",
};

export type CompareResult = CompareItem & {
  convertedProduct: number;
  landedTotal: number;
  riskLabel: string;
  riskLevel: "low" | "medium" | "high";
};

function asNumber(value: unknown, fallback = 0): number {
  const next = typeof value === "number" ? value : Number(value);
  return Number.isFinite(next) ? next : fallback;
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asCurrency(value: unknown): CurrencyCode {
  return CURRENCIES.includes(value as CurrencyCode) ? (value as CurrencyCode) : "USD";
}

function asStock(value: unknown): StockStatus {
  if (value === "in-stock" || value === "not-in-stock" || value === "unknown") {
    return value;
  }
  return "unknown";
}

function asReturnPayer(value: unknown): ReturnPayer {
  if (value === "shop" || value === "buyer" || value === "unknown") {
    return value;
  }
  return "unknown";
}

function asCheckMap(value: unknown, keys: readonly string[]): Record<string, boolean> {
  const source = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  return Object.fromEntries(keys.map((key) => [key, source[key] === true]));
}

export function emptyGuideStore(): GuideStore {
  return {
    needs: { ...EMPTY_NEEDS },
    rates: { ...DEFAULT_RATES },
    items: [],
    taiwanChecks: asCheckMap(null, TAIWAN_CHECKS),
    paymentChecks: asCheckMap(null, PAYMENT_CHECKS),
  };
}

export function createItemId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `item-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function parseGuideStore(raw: string | null): GuideStore {
  const fallback = emptyGuideStore();
  if (!raw) {
    return fallback;
  }
  try {
    const parsed = JSON.parse(raw) as Partial<GuideStore>;
    if (!parsed || typeof parsed !== "object") {
      return fallback;
    }
    const rates = { ...DEFAULT_RATES };
    if (parsed.rates && typeof parsed.rates === "object") {
      for (const code of CURRENCIES) {
        rates[code] = Math.max(0, asNumber(parsed.rates[code], DEFAULT_RATES[code]));
      }
    }
    const needs = { ...EMPTY_NEEDS };
    if (parsed.needs && typeof parsed.needs === "object") {
      for (const key of Object.keys(EMPTY_NEEDS) as Array<keyof NeedsWorksheet>) {
        needs[key] = asString(parsed.needs[key]).slice(0, 120);
      }
    }
    const items = Array.isArray(parsed.items)
      ? parsed.items
          .map((item) => {
            if (!item || typeof item !== "object") {
              return null;
            }
            const record = item as Partial<CompareItem>;
            return {
              id: asString(record.id) || createItemId(),
              shopName: asString(record.shopName).slice(0, 80),
              productUrl: asString(record.productUrl).slice(0, 400),
              price: Math.max(0, asNumber(record.price)),
              currency: asCurrency(record.currency),
              shipping: Math.max(0, asNumber(record.shipping)),
              discount: Math.max(0, asNumber(record.discount)),
              excludeVat: record.excludeVat === true,
              vatAmount: Math.max(0, asNumber(record.vatAmount)),
              tariffTwd: Math.max(0, asNumber(record.tariffTwd)),
              cardFeeTwd: Math.max(0, asNumber(record.cardFeeTwd)),
              stock: asStock(record.stock),
              dispatchEstimate: asString(record.dispatchEstimate).slice(0, 80),
              returnDays: asString(record.returnDays).slice(0, 40),
              returnPayer: asReturnPayer(record.returnPayer),
              notes: asString(record.notes).slice(0, 400),
            } satisfies CompareItem;
          })
          .filter((item): item is CompareItem => Boolean(item))
          .slice(0, COMPARE_ITEM_LIMIT)
      : [];
    return {
      needs,
      rates,
      items,
      taiwanChecks: asCheckMap(parsed.taiwanChecks, TAIWAN_CHECKS),
      paymentChecks: asCheckMap(parsed.paymentChecks, PAYMENT_CHECKS),
    };
  } catch {
    return fallback;
  }
}

export function loadGuideStore(): GuideStore {
  if (typeof window === "undefined") {
    return parseGuideStore(null);
  }
  try {
    return parseGuideStore(window.localStorage.getItem(SKATE_GUIDE_STORAGE_KEY));
  } catch {
    return parseGuideStore(null);
  }
}

export function saveGuideStore(store: GuideStore) {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(SKATE_GUIDE_STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Storage may be unavailable; keep the in-memory worksheet usable.
  }
}

export function rateFor(currency: CurrencyCode, rates: Record<CurrencyCode, number>): number {
  const rate = rates[currency];
  return Number.isFinite(rate) && rate > 0 ? rate : DEFAULT_RATES[currency];
}

export function convertedProduct(item: CompareItem, rates: Record<CurrencyCode, number>): number {
  const vat = item.excludeVat ? item.vatAmount : 0;
  const net = Math.max(0, item.price - item.discount - vat);
  return net * rateFor(item.currency, rates);
}

export function landedTotal(item: CompareItem, rates: Record<CurrencyCode, number>): number {
  return (
    convertedProduct(item, rates) +
    item.shipping * rateFor(item.currency, rates) +
    item.tariffTwd +
    item.cardFeeTwd
  );
}

export function returnRisk(item: CompareItem): { level: "low" | "medium" | "high"; label: string } {
  const days = Number.parseInt(item.returnDays, 10);
  const shortWindow = Number.isFinite(days) && days > 0 && days < 7;
  const noWindow = item.returnDays.trim() === "" || days === 0;
  if (item.stock !== "in-stock" && (item.returnPayer === "buyer" || noWindow || shortWindow)) {
    return { level: "high", label: "較高：非現貨且退換條件較緊" };
  }
  if (item.returnPayer === "buyer" || shortWindow || noWindow) {
    return { level: "medium", label: "中等：需自行承擔退貨成本或期限较短" };
  }
  if (item.stock === "in-stock" && item.returnPayer === "shop") {
    return { level: "low", label: "較低：現貨且商店負擔退貨運費" };
  }
  return { level: "medium", label: "中等：條件未完全確認" };
}

export function rankItems(items: CompareItem[], rates: Record<CurrencyCode, number>): CompareResult[] {
  return items
    .map((item) => {
      const risk = returnRisk(item);
      return {
        ...item,
        convertedProduct: convertedProduct(item, rates),
        landedTotal: landedTotal(item, rates),
        riskLabel: risk.label,
        riskLevel: risk.level,
      };
    })
    .sort((a, b) => a.landedTotal - b.landedTotal);
}

export function formatMoney(value: number): string {
  return new Intl.NumberFormat("zh-TW", {
    style: "currency",
    currency: "TWD",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}

export function stockLabel(status: StockStatus): string {
  if (status === "in-stock") return "現貨";
  if (status === "not-in-stock") return "非現貨";
  return "不明";
}

export function returnPayerLabel(value: ReturnPayer): string {
  if (value === "shop") return "商店負擔";
  if (value === "buyer") return "買方負擔";
  return "不明";
}

export function safeHref(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

const SKIP_NEED_VALUES = new Set(["", "尚未選擇", "尚未決定"]);

function needPart(value: string): string {
  const text = value.trim();
  return SKIP_NEED_VALUES.has(text) ? "" : text;
}

export const NEED_SEARCH_FIELDS: Array<{ key: keyof NeedsWorksheet; label: string }> = [
  { key: "useCase", label: "用途" },
  { key: "level", label: "程度" },
  { key: "brandModel", label: "品牌與型號" },
  { key: "size", label: "尺寸" },
  { key: "width", label: "寬度" },
  { key: "color", label: "鞋色" },
  { key: "bootOnly", label: "鞋靴／冰刀" },
  { key: "specialOrder", label: "現貨／特訂" },
  { key: "neededBy", label: "預計使用日期" },
  { key: "budget", label: "預算上限" },
];

export const SEARCH_FORMULA = NEED_SEARCH_FIELDS.map((field) => field.label).join(" + ");
export const CHATGPT_SEARCH_ASK = "這雙鞋幫我搜尋最便宜的網站";
export const SEARCH_FORMULA_EXAMPLE = [
  "用途：花式滑冰",
  "程度：一周跳",
  "品牌與型號：Edea Chorus",
  "尺寸：245",
  "寬度：D",
  "鞋色：Ivory",
  "鞋靴／冰刀：只買鞋靴",
  "現貨／特訂：只接受現貨",
  "預計使用日期：2026-11-01",
  "預算上限：35000 TWD",
  CHATGPT_SEARCH_ASK,
].join("\n");

export function buildSearchQuery(needs: NeedsWorksheet = EMPTY_NEEDS): string {
  return NEED_SEARCH_FIELDS.map((field) => needPart(needs[field.key])).filter(Boolean).join(" ");
}

export function buildChatGptPrompt(needs: NeedsWorksheet = EMPTY_NEEDS): string {
  const lines = NEED_SEARCH_FIELDS.flatMap((field) => {
    const part = needPart(needs[field.key]);
    return part ? [`${field.label}：${part}`] : [];
  });
  if (lines.length === 0) {
    return "";
  }
  lines.push(CHATGPT_SEARCH_ASK);
  return lines.join("\n");
}

export function buildSummary(results: CompareResult[]): string {
  if (results.length === 0) {
    return "尚未新增比較項目。";
  }
  return results
    .map((item, index) => {
      const lowest = index === 0 ? "（預估總價較低）" : "";
      return [
        `${index + 1}. ${item.shopName || "未命名商店"}${lowest}`,
        `商品折算：${formatMoney(item.convertedProduct)}`,
        `預估到手總價：${formatMoney(item.landedTotal)}`,
        `現貨：${stockLabel(item.stock)}`,
        `出貨：${item.dispatchEstimate || "未填"}`,
        `退換貨風險：${item.riskLabel}`,
      ].join("\n");
    })
    .join("\n\n");
}
