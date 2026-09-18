import {
  BUDGET_OPTIONS,
  FIELD_LIMITS,
  PLACEMENT_OPTIONS,
  type BudgetValue,
  type PlacementValue,
} from "@/lib/contact/config";

export type ContactInquiry = {
  company: string;
  name: string;
  email: string;
  phone: string;
  website: string;
  placement: PlacementValue | "";
  period: string;
  budget: BudgetValue | "";
  message: string;
  consent: boolean;
  sourcePage: string;
};

export type ContactFieldErrors = Partial<
  Record<"company" | "name" | "email" | "phone" | "website" | "message" | "consent", string>
>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

function stripUnsafe(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .replace(CONTROL_CHARS, "")
    .replace(/\u00a0/g, " ")
    .trim();
}

function tooLong(value: string, max: number): boolean {
  return value.length > max;
}

function isAllowedPlacement(value: string): value is PlacementValue {
  return PLACEMENT_OPTIONS.some((item) => item.value === value);
}

function isAllowedBudget(value: string): value is BudgetValue {
  return BUDGET_OPTIONS.some((item) => item.value === value);
}

function isSafeWebsite(value: string): boolean {
  if (!value) {
    return true;
  }

  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

function isSafeSourcePage(value: string): boolean {
  return value.startsWith("/") && !value.startsWith("//") && !value.includes("?") && !value.includes("@");
}

export function parseContactInquiry(body: Record<string, unknown>): {
  inquiry: ContactInquiry;
  honeypotFilled: boolean;
  errors: ContactFieldErrors;
} {
  const company = stripUnsafe(body.company);
  const name = stripUnsafe(body.name);
  const email = stripUnsafe(body.email).toLowerCase();
  const phone = stripUnsafe(body.phone);
  const website = stripUnsafe(body.website);
  const period = stripUnsafe(body.period);
  const message = stripUnsafe(body.message);
  const honeypot = stripUnsafe(body.companyFax ?? body.honeypot);
  const rawPlacement = stripUnsafe(body.placement);
  const rawBudget = stripUnsafe(body.budget);
  const rawSource = stripUnsafe(body.sourcePage) || "/advertising";
  const consent = body.consent === true || body.consent === "true" || body.consent === "on";

  const errors: ContactFieldErrors = {};

  if (!company) {
    errors.company = "請填寫公司或品牌名稱";
  } else if (tooLong(company, FIELD_LIMITS.company)) {
    errors.company = "公司或品牌名稱過長，請精簡後再送出";
  }

  if (!name) {
    errors.name = "請填寫聯絡人姓名";
  } else if (tooLong(name, FIELD_LIMITS.name)) {
    errors.name = "聯絡人姓名過長，請精簡後再送出";
  }

  if (!email || !EMAIL_PATTERN.test(email)) {
    errors.email = "請輸入有效的Email";
  } else if (tooLong(email, FIELD_LIMITS.email)) {
    errors.email = "請輸入有效的Email";
  }

  if (tooLong(phone, FIELD_LIMITS.phone)) {
    errors.phone = "聯絡電話過長，請精簡後再送出";
  }

  if (tooLong(website, FIELD_LIMITS.website) || !isSafeWebsite(website)) {
    errors.website = "請輸入有效的網站網址，或以空白略過";
  }

  if (!message) {
    errors.message = "請簡單說明合作需求";
  } else if (tooLong(message, FIELD_LIMITS.message)) {
    errors.message = "合作需求內容過長，請精簡後再送出";
  }

  if (!consent) {
    errors.consent = "請確認隱私同意";
  }

  const placement = isAllowedPlacement(rawPlacement) ? rawPlacement : "";
  const budget = isAllowedBudget(rawBudget) ? rawBudget : "";
  const sourcePage = isSafeSourcePage(rawSource) ? rawSource.slice(0, FIELD_LIMITS.sourcePage) : "/advertising";

  return {
    inquiry: {
      company,
      name,
      email,
      phone,
      website,
      placement,
      period: tooLong(period, FIELD_LIMITS.period) ? period.slice(0, FIELD_LIMITS.period) : period,
      budget,
      message,
      consent,
      sourcePage,
    },
    honeypotFilled: honeypot.length > 0,
    errors,
  };
}
