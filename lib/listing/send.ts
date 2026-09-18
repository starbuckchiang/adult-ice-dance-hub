import { danceLabel, getListingRecipientEmail, meetingLabel } from "@/lib/listing/config";
import type { ListingInquiry } from "@/lib/listing/validate";

export type SendListingResult = "sent" | "unconfigured" | "failed";

function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY?.trim() && process.env.CONTACT_FROM_EMAIL?.trim());
}

export function buildListingEmail(inquiry: ListingInquiry) {
  const kindLabel = inquiry.kind === "coach" ? "教練刊登申請" : "舞伴刊登申請";
  const subject = `[午夜冰舞] ${kindLabel}－${inquiry.kind === "coach" ? inquiry.name : inquiry.displayName}`;
  const text =
    inquiry.kind === "coach"
      ? [
          "教練刊登申請（待審核，不可直接公開）",
          "",
          `姓名：${inquiry.name}`,
          `Email（僅供審核）：${inquiry.email}`,
          `國家：${inquiry.country}`,
          `所在地：${inquiry.city}`,
          `專長：${inquiry.specialties}`,
          `成人教學經驗：${inquiry.adultExperience}`,
          `公開網站：${inquiry.website || "未填寫"}`,
          `公開聯絡方式：${inquiry.publicContact || "未填寫"}`,
          `本人刊登同意：${inquiry.coachConsent ? "是" : "否"}`,
        ].join("\n")
      : [
          "舞伴刊登申請（待審核，不可直接公開）",
          "",
          `顯示名稱：${inquiry.displayName}`,
          `Email（僅供審核）：${inquiry.email}`,
          `已滿18歲：${inquiry.adultConfirmed ? "是" : "否"}`,
          `國家／城市：${inquiry.country}／${inquiry.city}`,
          `冰舞類型：${danceLabel(inquiry.danceType)}`,
          `程度：${inquiry.level}`,
          `年齡組別：${inquiry.ageGroup}`,
          `身高區間：${inquiry.heightRange}`,
          `練習頻率：${inquiry.practiceFrequency}`,
          `比賽意願：${inquiry.competitionIntent}`,
          `語言：${inquiry.languages}`,
          `線上／實體：${meetingLabel(inquiry.meetingType)}`,
          "",
          "練習與比賽目標：",
          inquiry.goals,
        ].join("\n");

  return { subject, text };
}

export async function sendListingInquiry(inquiry: ListingInquiry): Promise<SendListingResult> {
  if (!isEmailConfigured()) {
    return "unconfigured";
  }

  const { subject, text } = buildListingEmail(inquiry);

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY?.trim() ?? ""}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL?.trim(),
        to: [getListingRecipientEmail()],
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
