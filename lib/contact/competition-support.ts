import { CONTACT_EMAIL, FIELD_LIMITS, getContactRecipientEmail } from "@/lib/contact/config";
import {
  SUPPORT_SERVICES,
  disciplineLabel,
  helpPeriodLabel,
  supportBudgetLabel,
  yesNoLabel,
} from "@/lib/guides/taiwan-competitions-2026";

export const COMPETITION_SUPPORT_FIELD_LIMITS = {
  ...FIELD_LIMITS,
  otherContact: 80,
  birthYear: 4,
  coach: 80,
  division: 80,
  level: 80,
  eventName: 160,
} as const;

export const COMPETITION_SUPPORT_BUDGETS = [
  { value: "undecided", label: "尚未確定" },
  { value: "under_10000", label: "NT$10,000 以下" },
  { value: "10000_30000", label: "NT$10,000～30,000" },
  { value: "30000_80000", label: "NT$30,000～80,000" },
  { value: "over_80000", label: "NT$80,000 以上" },
] as const;

export type CompetitionSupportInquiry = {
  name: string;
  email: string;
  phone: string;
  otherContact: string;
  birthYear: string;
  eventName: string;
  level: string;
  discipline: string;
  services: string[];
  message: string;
  coach: string;
  partnerStatus: string;
  budget: string;
  contactWindow: string;
  consent: boolean;
  sourcePage: string;
};

export type CompetitionSupportFieldErrors = Partial<
  Record<"name" | "email" | "phone" | "eventName" | "level" | "discipline" | "services" | "message" | "consent", string>
>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const SERVICE_VALUES = SUPPORT_SERVICES.map((item) => item.value);

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

function isSafeSourcePage(value: string): boolean {
  return value.startsWith("/") && !value.startsWith("//") && !value.includes("?") && !value.includes("@");
}

function parseServices(value: unknown): string[] {
  const list = Array.isArray(value) ? value : typeof value === "string" ? value.split(",") : [];
  return list
    .map((item) => stripUnsafe(item))
    .filter((item) => SERVICE_VALUES.includes(item as (typeof SERVICE_VALUES)[number]));
}

export function parseCompetitionSupportInquiry(body: Record<string, unknown>): {
  inquiry: CompetitionSupportInquiry;
  honeypotFilled: boolean;
  errors: CompetitionSupportFieldErrors;
} {
  const name = stripUnsafe(body.name);
  const email = stripUnsafe(body.email).toLowerCase();
  const phone = stripUnsafe(body.phone);
  const otherContact = stripUnsafe(body.otherContact);
  const birthYear = stripUnsafe(body.birthYear);
  const eventName = stripUnsafe(body.eventName);
  const level = stripUnsafe(body.level);
  const discipline = stripUnsafe(body.discipline);
  const message = stripUnsafe(body.message);
  const coach = stripUnsafe(body.coach);
  const partnerStatus = stripUnsafe(body.partnerStatus);
  const budget = stripUnsafe(body.budget);
  const contactWindow = stripUnsafe(body.contactWindow);
  const honeypot = stripUnsafe(body.companyFax ?? body.honeypot);
  const rawSource = stripUnsafe(body.sourcePage) || "/guides/taiwan-adult-competitions-2026";
  const consent = body.consent === true || body.consent === "true" || body.consent === "on";
  const services = parseServices(body.services);
  const errors: CompetitionSupportFieldErrors = {};

  if (!name) {
    errors.name = "請填寫姓名";
  } else if (tooLong(name, COMPETITION_SUPPORT_FIELD_LIMITS.name)) {
    errors.name = "姓名過長，請精簡後再送出";
  }

  if (!email || !EMAIL_PATTERN.test(email) || tooLong(email, COMPETITION_SUPPORT_FIELD_LIMITS.email)) {
    errors.email = "請輸入有效的Email";
  }

  if (tooLong(phone, COMPETITION_SUPPORT_FIELD_LIMITS.phone)) {
    errors.phone = "電話過長，請精簡後再送出";
  }

  if (!eventName) {
    errors.eventName = "請填寫目標賽事";
  } else if (tooLong(eventName, COMPETITION_SUPPORT_FIELD_LIMITS.eventName)) {
    errors.eventName = "目標賽事名稱過長，請精簡後再送出";
  }

  if (!level) {
    errors.level = "請填寫目前程度";
  } else if (tooLong(level, COMPETITION_SUPPORT_FIELD_LIMITS.level)) {
    errors.level = "目前程度過長，請精簡後再送出";
  }

  if (!discipline) {
    errors.discipline = "請填寫參賽項目";
  }

  if (services.length === 0) {
    errors.services = "請至少選擇一項需要的服務";
  }

  if (!message) {
    errors.message = "請說明合作需求";
  } else if (tooLong(message, COMPETITION_SUPPORT_FIELD_LIMITS.message)) {
    errors.message = "合作需求內容過長，請精簡後再送出";
  }

  if (!consent) {
    errors.consent = "請確認隱私同意";
  }

  return {
    inquiry: {
      name,
      email,
      phone,
      otherContact: tooLong(otherContact, COMPETITION_SUPPORT_FIELD_LIMITS.otherContact)
        ? otherContact.slice(0, COMPETITION_SUPPORT_FIELD_LIMITS.otherContact)
        : otherContact,
      birthYear: tooLong(birthYear, COMPETITION_SUPPORT_FIELD_LIMITS.birthYear)
        ? birthYear.slice(0, COMPETITION_SUPPORT_FIELD_LIMITS.birthYear)
        : birthYear,
      eventName,
      level,
      discipline,
      services,
      message,
      coach: tooLong(coach, COMPETITION_SUPPORT_FIELD_LIMITS.coach)
        ? coach.slice(0, COMPETITION_SUPPORT_FIELD_LIMITS.coach)
        : coach,
      partnerStatus: tooLong(partnerStatus, 40) ? partnerStatus.slice(0, 40) : partnerStatus,
      budget,
      contactWindow: tooLong(contactWindow, COMPETITION_SUPPORT_FIELD_LIMITS.period)
        ? contactWindow.slice(0, COMPETITION_SUPPORT_FIELD_LIMITS.period)
        : contactWindow,
      consent,
      sourcePage: isSafeSourcePage(rawSource)
        ? rawSource.slice(0, COMPETITION_SUPPORT_FIELD_LIMITS.sourcePage)
        : "/guides/taiwan-adult-competitions-2026",
    },
    honeypotFilled: honeypot.length > 0,
    errors,
  };
}

export type SendCompetitionSupportResult = "sent" | "unconfigured" | "failed";

function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim() && process.env.CONTACT_FROM_EMAIL?.trim());
}

function formatSubmittedAt(value: Date): string {
  return new Intl.DateTimeFormat("zh-Hant", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(value);
}

function serviceLabels(values: string[]): string {
  return values
    .map((value) => SUPPORT_SERVICES.find((item) => item.value === value)?.label ?? value)
    .join("、");
}

export function buildCompetitionSupportEmail(inquiry: CompetitionSupportInquiry, submittedAt = new Date()) {
  const subject = `[午夜冰舞] 國內成人參賽服務洽詢－${inquiry.name}－${inquiry.eventName}`;
  const text = [
    "午夜冰舞國內成人參賽服務洽詢",
    "",
    `姓名：${inquiry.name}`,
    `Email：${inquiry.email}`,
    `電話：${inquiry.phone || "未填寫"}`,
    `LINE或其他聯絡方式：${inquiry.otherContact || "未填寫"}`,
    `出生年份：${inquiry.birthYear || "未填寫"}`,
    `目標賽事：${inquiry.eventName}`,
    `目前程度：${inquiry.level}`,
    `參賽項目：${disciplineLabel(inquiry.discipline) === "未指定" ? inquiry.discipline : disciplineLabel(inquiry.discipline)}`,
    `需要的服務：${serviceLabels(inquiry.services)}`,
    `教練：${inquiry.coach || "未填寫"}`,
    `舞伴狀態：${yesNoLabel(inquiry.partnerStatus) === "未填寫" ? inquiry.partnerStatus || "未填寫" : yesNoLabel(inquiry.partnerStatus)}`,
    `預算範圍：${supportBudgetLabel(inquiry.budget)}`,
    `可聯絡時間：${helpPeriodLabel(inquiry.contactWindow) === inquiry.contactWindow ? inquiry.contactWindow || "未填寫" : helpPeriodLabel(inquiry.contactWindow)}`,
    "",
    "合作需求：",
    inquiry.message,
    "",
    `送出時間：${formatSubmittedAt(submittedAt)}（台北時間）`,
    `來源頁面：${inquiry.sourcePage}`,
  ].join("\n");

  return { subject, text };
}

export async function sendCompetitionSupportInquiry(
  inquiry: CompetitionSupportInquiry,
): Promise<SendCompetitionSupportResult> {
  if (!isEmailConfigured()) {
    return "unconfigured";
  }

  const apiKey = process.env.RESEND_API_KEY?.trim() ?? "";
  const from = process.env.CONTACT_FROM_EMAIL?.trim() ?? "";
  const to = getContactRecipientEmail() || CONTACT_EMAIL;
  const { subject, text } = buildCompetitionSupportEmail(inquiry);

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: inquiry.email,
        subject,
        text,
      }),
    });
    if (!response.ok) {
      return "failed";
    }
    return "sent";
  } catch {
    return "failed";
  }
}
