"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  AGE_GROUPS,
  COMPETITION_OPTIONS,
  HEIGHT_RANGES,
  LISTING_EMAIL,
  PARTNER_LEVELS,
  PRACTICE_OPTIONS,
} from "@/lib/listing/config";
import { parseListingInquiry, type ListingFieldErrors, type ListingKind } from "@/lib/listing/validate";
import styles from "./ListingForm.module.css";

type Status = "idle" | "submitting" | "sent" | "unconfigured" | "unavailable";

const INITIAL = {
  displayName: "",
  name: "",
  email: "",
  country: "usa",
  city: "",
  danceType: "partnered",
  level: "初學",
  ageGroup: "30–39",
  heightRange: "未填寫",
  practiceFrequency: "每週1–2次",
  competitionIntent: "待討論",
  languages: "",
  meetingType: "both",
  goals: "",
  specialties: "",
  adultExperience: "",
  website: "",
  publicContact: "",
  adultConfirmed: false,
  privacyConsent: false,
  coachConsent: false,
  companyFax: "",
};

export function ListingForm() {
  const [kind, setKind] = useState<ListingKind>("partner");
  const [values, setValues] = useState(INITIAL);
  const [errors, setErrors] = useState<ListingFieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  const mailto = useMemo(() => `mailto:${LISTING_EMAIL}`, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    const parsed = parseListingInquiry({ ...values, kind });
    if (Object.keys(parsed.errors).length > 0) {
      setErrors(parsed.errors);
      setStatus("idle");
      return;
    }
    setErrors({});
    try {
      const response = await fetch("/api/contact/listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, kind }),
      });
      const payload = (await response.json()) as { status?: Status | "invalid"; fields?: ListingFieldErrors };
      if (payload.status === "sent") {
        setStatus("sent");
        return;
      }
      if (payload.status === "unconfigured") {
        setStatus("unconfigured");
        return;
      }
      if (payload.status === "invalid") {
        setErrors(payload.fields ?? {});
        setStatus("idle");
        return;
      }
      setStatus("unavailable");
    } catch {
      setStatus("unavailable");
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.tabs} role="tablist" aria-label="申請類型">
        <button type="button" className={kind === "partner" ? styles.active : ""} onClick={() => setKind("partner")}>
          申請刊登舞伴
        </button>
        <button type="button" className={kind === "coach" ? styles.active : ""} onClick={() => setKind("coach")}>
          申請刊登教練
        </button>
      </div>
      <p className={styles.note}>所有申請先進入審核，不會直接公開。Email 只給管理者，不會出現在卡片上。</p>

      {kind === "partner" ? (
        <>
          <label>
            顯示名稱
            <input value={values.displayName} onChange={(e) => setValues({ ...values, displayName: e.target.value })} />
            {errors.displayName ? <span className={styles.error}>{errors.displayName}</span> : null}
          </label>
          <label className={styles.check}>
            <input
              type="checkbox"
              checked={values.adultConfirmed}
              onChange={(e) => setValues({ ...values, adultConfirmed: e.target.checked })}
            />
            我確認自己已滿 18 歲
          </label>
          {errors.adultConfirmed ? <span className={styles.error}>{errors.adultConfirmed}</span> : null}
          <label>
            國家
            <select value={values.country} onChange={(e) => setValues({ ...values, country: e.target.value })}>
              <option value="usa">美國</option>
              <option value="japan">日本</option>
              <option value="canada">加拿大</option>
              <option value="switzerland">瑞士</option>
              <option value="italy">義大利</option>
              <option value="australia">澳洲</option>
            </select>
          </label>
          <label>
            城市或地區（不要填住址）
            <input value={values.city} onChange={(e) => setValues({ ...values, city: e.target.value })} />
            {errors.city ? <span className={styles.error}>{errors.city}</span> : null}
          </label>
          <label>
            冰舞類型
            <select value={values.danceType} onChange={(e) => setValues({ ...values, danceType: e.target.value })}>
              <option value="partnered">雙人冰舞</option>
              <option value="solo">單人冰舞交流</option>
              <option value="both">雙人與單人</option>
            </select>
          </label>
          <label>
            程度
            <select value={values.level} onChange={(e) => setValues({ ...values, level: e.target.value })}>
              {PARTNER_LEVELS.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            年齡組別
            <select value={values.ageGroup} onChange={(e) => setValues({ ...values, ageGroup: e.target.value })}>
              {AGE_GROUPS.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            身高區間（選填）
            <select value={values.heightRange} onChange={(e) => setValues({ ...values, heightRange: e.target.value })}>
              {HEIGHT_RANGES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            練習頻率
            <select
              value={values.practiceFrequency}
              onChange={(e) => setValues({ ...values, practiceFrequency: e.target.value })}
            >
              {PRACTICE_OPTIONS.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            比賽意願
            <select
              value={values.competitionIntent}
              onChange={(e) => setValues({ ...values, competitionIntent: e.target.value })}
            >
              {COMPETITION_OPTIONS.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            語言
            <input value={values.languages} onChange={(e) => setValues({ ...values, languages: e.target.value })} />
            {errors.languages ? <span className={styles.error}>{errors.languages}</span> : null}
          </label>
          <label>
            線上／實體
            <select value={values.meetingType} onChange={(e) => setValues({ ...values, meetingType: e.target.value })}>
              <option value="in-person">實體</option>
              <option value="online">線上</option>
              <option value="both">線上／實體</option>
            </select>
          </label>
          <label>
            練習與比賽目標
            <textarea value={values.goals} onChange={(e) => setValues({ ...values, goals: e.target.value })} rows={5} />
            {errors.goals ? <span className={styles.error}>{errors.goals}</span> : null}
          </label>
        </>
      ) : (
        <>
          <label>
            姓名
            <input value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} />
            {errors.name ? <span className={styles.error}>{errors.name}</span> : null}
          </label>
          <label>
            國家
            <select value={values.country} onChange={(e) => setValues({ ...values, country: e.target.value })}>
              <option value="usa">美國</option>
              <option value="japan">日本</option>
              <option value="canada">加拿大</option>
              <option value="switzerland">瑞士</option>
              <option value="italy">義大利</option>
              <option value="australia">澳洲</option>
            </select>
          </label>
          <label>
            所在地
            <input value={values.city} onChange={(e) => setValues({ ...values, city: e.target.value })} />
            {errors.city ? <span className={styles.error}>{errors.city}</span> : null}
          </label>
          <label>
            教學專長
            <input value={values.specialties} onChange={(e) => setValues({ ...values, specialties: e.target.value })} />
            {errors.specialties ? <span className={styles.error}>{errors.specialties}</span> : null}
          </label>
          <label>
            成人教學經驗
            <textarea
              value={values.adultExperience}
              onChange={(e) => setValues({ ...values, adultExperience: e.target.value })}
              rows={4}
            />
            {errors.adultExperience ? <span className={styles.error}>{errors.adultExperience}</span> : null}
          </label>
          <label>
            公開網站
            <input value={values.website} onChange={(e) => setValues({ ...values, website: e.target.value })} />
            {errors.website ? <span className={styles.error}>{errors.website}</span> : null}
          </label>
          <label>
            公開聯絡方式（官網表單或公開頁，不要填私人電話）
            <input value={values.publicContact} onChange={(e) => setValues({ ...values, publicContact: e.target.value })} />
          </label>
          <label className={styles.check}>
            <input
              type="checkbox"
              checked={values.coachConsent}
              onChange={(e) => setValues({ ...values, coachConsent: e.target.checked })}
            />
            我是本人，並同意審核後刊登公開資料
          </label>
          {errors.coachConsent ? <span className={styles.error}>{errors.coachConsent}</span> : null}
        </>
      )}

      <label>
        聯絡 Email（只供管理者審核）
        <input type="email" value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })} />
        {errors.email ? <span className={styles.error}>{errors.email}</span> : null}
      </label>
      <label className={styles.check}>
        <input
          type="checkbox"
          checked={values.privacyConsent}
          onChange={(e) => setValues({ ...values, privacyConsent: e.target.checked })}
        />
        我同意依隱私說明處理這份申請，且不公開私人聯絡方式
      </label>
      {errors.privacyConsent ? <span className={styles.error}>{errors.privacyConsent}</span> : null}

      <div className={styles.honeypot} aria-hidden="true">
        <label>
          公司傳真
          <input tabIndex={-1} autoComplete="off" value={values.companyFax} onChange={(e) => setValues({ ...values, companyFax: e.target.value })} />
        </label>
      </div>

      <button className="button" type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "送出中…" : "送出審核申請"}
      </button>

      {status === "sent" ? <p className={styles.ok}>已送出，管理者審核後才會公開。</p> : null}
      {status === "unconfigured" ? (
        <p className={styles.warn}>
          線上寄信尚未啟用，請改寄 {LISTING_EMAIL}。
          <a className={styles.mail} href={mailto}>
            改寄管理者 Email
          </a>
        </p>
      ) : null}
      {status === "unavailable" ? (
        <p className={styles.warn}>
          目前無法送出表單，請改寄 {LISTING_EMAIL}。
          <a className={styles.mail} href={mailto}>
            改寄管理者 Email
          </a>
        </p>
      ) : null}
    </form>
  );
}
