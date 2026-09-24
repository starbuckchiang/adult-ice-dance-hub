import { FIELD_LIMITS } from "@/lib/contact/config";
import {
  AURORA_EMAIL,
  ICE_DANCE_TESTS_PATH,
  ICE_DANCE_VIDEO_TESTS_PATH,
  rinkInquirySubject,
  type RinkInquiryLanguage,
} from "@/lib/guides/ice-dance-tests-taiwan";

export const AURORA_RINK_FIELD_LIMITS = {
  ...FIELD_LIMITS,
  message: 2500,
} as const;

export const AURORA_RINK_SOURCE_PAGES = [ICE_DANCE_TESTS_PATH, ICE_DANCE_VIDEO_TESTS_PATH] as const;

export type AuroraRinkInquiry = {
  name: string;
  email: string;
  phone: string;
  language: RinkInquiryLanguage;
  message: string;
  consent: boolean;
  sourcePage: string;
};

export type AuroraRinkFieldErrors = Partial<Record<"name" | "email" | "phone" | "message" | "consent", string>>;

export type SendAuroraRinkResult = "sent" | "unconfigured" | "failed";

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

function isSafeSourcePage(value: string): value is (typeof AURORA_RINK_SOURCE_PAGES)[number] {
  return AURORA_RINK_SOURCE_PAGES.includes(value as (typeof AURORA_RINK_SOURCE_PAGES)[number]);
}

function parseLanguage(value: unknown): RinkInquiryLanguage {
  return stripUnsafe(value) === "en" ? "en" : "zh";
}

export function parseAuroraRinkInquiry(body: Record<string, unknown>): {
  inquiry: AuroraRinkInquiry;
  honeypotFilled: boolean;
  errors: AuroraRinkFieldErrors;
} {
  const name = stripUnsafe(body.name);
  const email = stripUnsafe(body.email).toLowerCase();
  const phone = stripUnsafe(body.phone);
  const message = stripUnsafe(body.message);
  const honeypot = stripUnsafe(body.companyFax ?? body.honeypot);
  const language = parseLanguage(body.language);
  const rawSource = stripUnsafe(body.sourcePage);
  const consent = body.consent === true || body.consent === "true" || body.consent === "on";
  const errors: AuroraRinkFieldErrors = {};

  if (!name) {
    errors.name = "請填寫姓名";
  } else if (tooLong(name, AURORA_RINK_FIELD_LIMITS.name)) {
    errors.name = "姓名過長，請精簡後再送出";
  }

  if (!email || !EMAIL_PATTERN.test(email) || tooLong(email, AURORA_RINK_FIELD_LIMITS.email)) {
    errors.email = "請輸入有效的Email";
  }

  if (tooLong(phone, AURORA_RINK_FIELD_LIMITS.phone)) {
    errors.phone = "聯絡電話過長，請精簡後再送出";
  }

  if (!message) {
    errors.message = "請填寫詢問內容";
  } else if (tooLong(message, AURORA_RINK_FIELD_LIMITS.message)) {
    errors.message = "詢問內容過長，請精簡後再送出";
  }

  if (!consent) {
    errors.consent = "請確認隱私同意";
  }

  return {
    inquiry: {
      name,
      email,
      phone,
      language,
      message,
      consent,
      sourcePage: isSafeSourcePage(rawSource) ? rawSource : ICE_DANCE_TESTS_PATH,
    },
    honeypotFilled: honeypot.length > 0,
    errors,
  };
}

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

export function buildAuroraRinkEmail(inquiry: AuroraRinkInquiry, submittedAt = new Date()) {
  const subject = `[Adult Ice Dance Hub] ${rinkInquirySubject(inquiry.language)}－${inquiry.name}`;
  const text = [
    "此信件由 Adult Ice Dance Hub 表單代為轉寄，請直接回覆詢問者的 Email。",
    "",
    `姓名：${inquiry.name}`,
    `Email：${inquiry.email}`,
    `電話：${inquiry.phone || "未填寫"}`,
    `語言：${inquiry.language === "en" ? "English" : "中文"}`,
    "",
    "詢問內容：",
    inquiry.message,
    "",
    `送出時間：${formatSubmittedAt(submittedAt)}（台北時間）`,
    `來源頁面：${inquiry.sourcePage}`,
  ].join("\n");

  return { subject, text };
}

export async function sendAuroraRinkInquiry(inquiry: AuroraRinkInquiry): Promise<SendAuroraRinkResult> {
  if (!isEmailConfigured()) {
    return "unconfigured";
  }

  const apiKey = process.env.RESEND_API_KEY?.trim() ?? "";
  const from = process.env.CONTACT_FROM_EMAIL?.trim() ?? "";
  const { subject, text } = buildAuroraRinkEmail(inquiry);

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [AURORA_EMAIL],
        reply_to: inquiry.email,
        subject,
        text,
      }),
    });

    return response.ok ? "sent" : "failed";
  } catch {
    return "failed";
  }
}
