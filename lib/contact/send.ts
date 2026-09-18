import {
  budgetLabel,
  getContactRecipientEmail,
  placementLabel,
} from "@/lib/contact/config";
import type { ContactInquiry } from "@/lib/contact/validate";

export type SendContactResult = "sent" | "unconfigured" | "failed";

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

export function buildContactEmail(inquiry: ContactInquiry, submittedAt = new Date()) {
  const subject = `[午夜冰舞] 廣告合作詢問－${inquiry.company}`;
  const text = [
    "午夜冰舞廣告合作詢問",
    "",
    `公司／品牌名稱：${inquiry.company}`,
    `聯絡人：${inquiry.name}`,
    `Email：${inquiry.email}`,
    `電話：${inquiry.phone || "未填寫"}`,
    `網站：${inquiry.website || "未填寫"}`,
    `希望版位：${inquiry.placement ? placementLabel(inquiry.placement) : "未填寫"}`,
    `投放期間：${inquiry.period || "未填寫"}`,
    `預算範圍：${inquiry.budget ? budgetLabel(inquiry.budget) : "未填寫"}`,
    "",
    "合作需求：",
    inquiry.message,
    "",
    `送出時間：${formatSubmittedAt(submittedAt)}（台北時間）`,
    `來源頁面：${inquiry.sourcePage}`,
  ].join("\n");

  return { subject, text };
}

export async function sendAdvertisingInquiry(inquiry: ContactInquiry): Promise<SendContactResult> {
  if (!isEmailConfigured()) {
    return "unconfigured";
  }

  const apiKey = process.env.RESEND_API_KEY?.trim() ?? "";
  const from = process.env.CONTACT_FROM_EMAIL?.trim() ?? "";
  const to = getContactRecipientEmail();
  const { subject, text } = buildContactEmail(inquiry);

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
