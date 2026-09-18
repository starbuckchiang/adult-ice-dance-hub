"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import {
  ADVERTISING_CONTACT_PATH,
  BUDGET_OPTIONS,
  CONTACT_DEPARTMENT,
  CONTACT_EMAIL,
  CONTACT_MAILTO,
  CONTACT_ORG,
  CONTACT_PERSON,
  CONTACT_PHONE_DISPLAY,
  CONTACT_TEL_HREF,
  PLACEMENT_OPTIONS,
} from "@/lib/contact/config";
import { parseContactInquiry, type ContactFieldErrors } from "@/lib/contact/validate";
import styles from "./AdvertisingContact.module.css";

type FormStatus = "idle" | "submitting" | "success" | "unconfigured" | "unavailable";

const INITIAL = {
  company: "",
  name: "",
  email: "",
  phone: "",
  website: "",
  placement: "",
  period: "",
  budget: "",
  message: "",
  consent: false,
  companyFax: "",
};

export function AdvertisingContact() {
  const [values, setValues] = useState(INITIAL);
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");

  const fallbackButtons = useMemo(
    () => (
      <div className={styles.fallbackActions}>
        <a className="button" href={CONTACT_MAILTO}>
          寄送Email
        </a>
        <a className="button-accent" href={CONTACT_TEL_HREF}>
          撥打電話
        </a>
      </div>
    ),
    [],
  );

  function update<K extends keyof typeof INITIAL>(key: K, value: (typeof INITIAL)[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const parsed = parseContactInquiry({
      ...values,
      consent: values.consent,
      sourcePage: ADVERTISING_CONTACT_PATH.replace(/#.*$/, ""),
    });

    if (Object.keys(parsed.errors).length > 0) {
      setErrors(parsed.errors);
      setStatus("idle");
      return;
    }

    setErrors({});

    try {
      const response = await fetch("/api/contact/advertising", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: values.company,
          name: values.name,
          email: values.email,
          phone: values.phone,
          website: values.website,
          placement: values.placement,
          period: values.period,
          budget: values.budget,
          message: values.message,
          consent: values.consent,
          companyFax: values.companyFax,
          sourcePage: "/advertising",
        }),
      });
      const result = (await response.json()) as {
        ok?: boolean;
        status?: string;
        fields?: ContactFieldErrors;
      };

      if (result.ok) {
        setStatus("success");
        setValues(INITIAL);
        return;
      }

      if (result.status === "invalid" && result.fields) {
        setErrors(result.fields);
        setStatus("idle");
        return;
      }

      if (result.status === "unconfigured") {
        setStatus("unconfigured");
        return;
      }

      setStatus("unavailable");
    } catch {
      setStatus("unavailable");
    }
  }

  return (
    <section className={styles.section} id="contact">
      <p className={styles.kicker}>ADVERTISING INQUIRY</p>
      <h2 className={styles.heading}>洽詢廣告合作</h2>
      <p className={styles.intro}>
        歡迎滑冰用品品牌、冰場、俱樂部、教練、賽事主辦單位及相關服務業者洽詢廣告合作。
      </p>
      <div className={styles.grid}>
        <div className={styles.formPanel}>
          {status === "success" ? (
            <div role="status">
              <h3 className={styles.formTitle}>已收到合作需求</h3>
              <p className={`${styles.status} ${styles.success}`}>
                已收到你的合作需求，我們將透過Email或電話與你聯繫。
              </p>
              <Link className="button" href="/advertising">
                返回廣告合作說明
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <h3 className={styles.formTitle}>廣告合作聯絡表單</h3>
              {status === "unconfigured" ? (
                <p className={`${styles.status} ${styles.unconfigured}`} role="status">
                  線上表單設定中，請直接寄信或來電洽詢。
                </p>
              ) : null}
              {status === "unavailable" ? (
                <p className={`${styles.status} ${styles.fail}`} role="status">
                  訊息暫時無法送出，請直接寄信或來電洽詢。
                </p>
              ) : null}
              {status === "unconfigured" || status === "unavailable" ? fallbackButtons : null}

              <div className={`${styles.field} ${errors.company ? styles.invalid : ""}`}>
                <label htmlFor="ad-company">公司／品牌名稱</label>
                <input
                  id="ad-company"
                  className={styles.input}
                  name="company"
                  value={values.company}
                  onChange={(event) => update("company", event.target.value)}
                  autoComplete="organization"
                  aria-invalid={Boolean(errors.company)}
                  aria-describedby={errors.company ? "ad-company-error" : undefined}
                />
                {errors.company ? (
                  <p className={styles.error} id="ad-company-error">
                    {errors.company}
                  </p>
                ) : null}
              </div>

              <div className={`${styles.field} ${errors.name ? styles.invalid : ""}`}>
                <label htmlFor="ad-name">聯絡人姓名</label>
                <input
                  id="ad-name"
                  className={styles.input}
                  name="name"
                  value={values.name}
                  onChange={(event) => update("name", event.target.value)}
                  autoComplete="name"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "ad-name-error" : undefined}
                />
                {errors.name ? (
                  <p className={styles.error} id="ad-name-error">
                    {errors.name}
                  </p>
                ) : null}
              </div>

              <div className={`${styles.field} ${errors.email ? styles.invalid : ""}`}>
                <label htmlFor="ad-email">Email</label>
                <input
                  id="ad-email"
                  className={styles.input}
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={(event) => update("email", event.target.value)}
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "ad-email-error" : undefined}
                />
                {errors.email ? (
                  <p className={styles.error} id="ad-email-error">
                    {errors.email}
                  </p>
                ) : null}
              </div>

              <div className={`${styles.field} ${errors.phone ? styles.invalid : ""}`}>
                <label htmlFor="ad-phone">
                  聯絡電話<span className={styles.optional}>選填</span>
                </label>
                <input
                  id="ad-phone"
                  className={styles.input}
                  name="phone"
                  type="tel"
                  value={values.phone}
                  onChange={(event) => update("phone", event.target.value)}
                  autoComplete="tel"
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? "ad-phone-error" : undefined}
                />
                {errors.phone ? (
                  <p className={styles.error} id="ad-phone-error">
                    {errors.phone}
                  </p>
                ) : null}
              </div>

              <div className={`${styles.field} ${errors.website ? styles.invalid : ""}`}>
                <label htmlFor="ad-website">
                  品牌或網站網址<span className={styles.optional}>選填</span>
                </label>
                <input
                  id="ad-website"
                  className={styles.input}
                  name="website"
                  type="url"
                  value={values.website}
                  onChange={(event) => update("website", event.target.value)}
                  autoComplete="url"
                  placeholder="https://"
                  aria-invalid={Boolean(errors.website)}
                  aria-describedby={errors.website ? "ad-website-error" : undefined}
                />
                {errors.website ? (
                  <p className={styles.error} id="ad-website-error">
                    {errors.website}
                  </p>
                ) : null}
              </div>

              <div className={styles.field}>
                <label htmlFor="ad-placement">
                  希望投放的版位<span className={styles.optional}>選填</span>
                </label>
                <select
                  id="ad-placement"
                  className={styles.select}
                  name="placement"
                  value={values.placement}
                  onChange={(event) => update("placement", event.target.value)}
                >
                  <option value="">請選擇</option>
                  {PLACEMENT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label htmlFor="ad-period">
                  預計投放期間<span className={styles.optional}>選填</span>
                </label>
                <input
                  id="ad-period"
                  className={styles.input}
                  name="period"
                  value={values.period}
                  onChange={(event) => update("period", event.target.value)}
                  placeholder="例如 2026 年 10 月至 12 月"
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="ad-budget">
                  預算範圍<span className={styles.optional}>選填</span>
                </label>
                <select
                  id="ad-budget"
                  className={styles.select}
                  name="budget"
                  value={values.budget}
                  onChange={(event) => update("budget", event.target.value)}
                >
                  <option value="">請選擇</option>
                  {BUDGET_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={`${styles.field} ${errors.message ? styles.invalid : ""}`}>
                <label htmlFor="ad-message">合作需求</label>
                <textarea
                  id="ad-message"
                  className={styles.textarea}
                  name="message"
                  value={values.message}
                  onChange={(event) => update("message", event.target.value)}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? "ad-message-error" : undefined}
                />
                {errors.message ? (
                  <p className={styles.error} id="ad-message-error">
                    {errors.message}
                  </p>
                ) : null}
              </div>

              <label className={styles.honeypot} htmlFor="ad-fax" aria-hidden="true">
                公司傳真
                <input
                  id="ad-fax"
                  name="companyFax"
                  value={values.companyFax}
                  onChange={(event) => update("companyFax", event.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </label>

              <div className={`${styles.consent} ${errors.consent ? styles.invalid : ""}`}>
                <input
                  id="ad-consent"
                  className={styles.checkbox}
                  name="consent"
                  type="checkbox"
                  checked={values.consent}
                  onChange={(event) => update("consent", event.target.checked)}
                  aria-invalid={Boolean(errors.consent)}
                  aria-describedby={errors.consent ? "ad-consent-error" : undefined}
                />
                <label className={styles.consentLabel} htmlFor="ad-consent">
                  我同意本站使用上述資料回覆本次廣告合作需求。{" "}
                  <Link href="/privacy">隱私說明</Link>
                </label>
              </div>
              {errors.consent ? (
                <p className={styles.error} id="ad-consent-error">
                  {errors.consent}
                </p>
              ) : null}

              <button className={styles.submit} type="submit" disabled={status === "submitting"}>
                {status === "submitting" ? "送出中…" : "送出合作需求"}
              </button>
            </form>
          )}
        </div>

        <aside className={styles.side}>
          <div className={styles.card}>
            <p className={styles.kicker}>CONTACT</p>
            <h3 className={styles.cardTitle}>聯絡窗口</h3>
            <p className={styles.person}>{CONTACT_PERSON}</p>
            <p className={styles.org}>{CONTACT_ORG}</p>
            <p className={styles.dept}>{CONTACT_DEPARTMENT}</p>
            <p className={styles.detail}>
              <span className={styles.detailLabel}>電話</span>
              <a href={CONTACT_TEL_HREF}>{CONTACT_PHONE_DISPLAY}</a>
            </p>
            <p className={styles.detail}>
              <span className={styles.detailLabel}>Email</span>
              <a href={CONTACT_MAILTO}>{CONTACT_EMAIL}</a>
            </p>
            <div className={styles.actions}>
              <a className="button" href={CONTACT_TEL_HREF}>
                撥打電話
              </a>
              <a className="button-accent" href={CONTACT_MAILTO}>
                寄送Email
              </a>
            </div>
          </div>
          <div className={styles.process}>
            <h3 className={styles.processTitle}>合作流程</h3>
            <ol className={styles.processList}>
              <li>填寫表單，或直接來電、來信說明需求。</li>
              <li>確認版位、素材、投放期間與標示方式。</li>
              <li>正式投放前，再與廣告主確認成效報告方式。</li>
            </ol>
          </div>
        </aside>
      </div>
    </section>
  );
}
