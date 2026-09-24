"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import ad from "@/components/contact/AdvertisingContact.module.css";
import { parseAuroraRinkInquiry, type AuroraRinkFieldErrors } from "@/lib/contact/aurora-rink";
import {
  AURORA_ACADEMY_EMAIL,
  AURORA_EMAIL,
  AURORA_SITE,
  auroraMailto,
  rinkInquiryBody,
  type RinkInquiryLanguage,
} from "@/lib/guides/ice-dance-tests-taiwan";
import styles from "./AuroraRinkInquiry.module.css";

type FormStatus = "idle" | "submitting" | "success" | "unconfigured" | "unavailable";

function initialValues(language: RinkInquiryLanguage) {
  return {
    name: "",
    email: "",
    phone: "",
    language,
    message: rinkInquiryBody(language),
    consent: false,
    companyFax: "",
  };
}

export function AuroraRinkInquiry({
  sourcePage,
  defaultLanguage = "zh",
}: {
  sourcePage: string;
  defaultLanguage?: RinkInquiryLanguage;
}) {
  const [values, setValues] = useState(() => initialValues(defaultLanguage));
  const [errors, setErrors] = useState<AuroraRinkFieldErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");

  const fallbackButtons = useMemo(
    () => (
      <div className={ad.fallbackActions}>
        <a className="button" href={auroraMailto(values.language)}>
          改用郵件程式寄出
        </a>
      </div>
    ),
    [values.language],
  );

  function update<K extends keyof ReturnType<typeof initialValues>>(key: K, value: ReturnType<typeof initialValues>[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function changeLanguage(next: RinkInquiryLanguage) {
    setValues((current) => {
      const previousDefault = rinkInquiryBody(current.language);
      const shouldReplace = current.message.trim() === previousDefault.trim();
      return {
        ...current,
        language: next,
        message: shouldReplace ? rinkInquiryBody(next) : current.message,
      };
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const parsed = parseAuroraRinkInquiry({
      name: values.name,
      email: values.email,
      phone: values.phone,
      language: values.language,
      message: values.message,
      consent: values.consent,
      companyFax: values.companyFax,
      sourcePage,
    });

    if (Object.keys(parsed.errors).length > 0) {
      setErrors(parsed.errors);
      setStatus("idle");
      return;
    }

    setErrors({});

    try {
      const response = await fetch("/api/contact/aurora-rink", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          phone: values.phone,
          language: values.language,
          message: values.message,
          consent: values.consent,
          companyFax: values.companyFax,
          sourcePage,
        }),
      });
      const result = (await response.json()) as {
        ok?: boolean;
        status?: string;
        fields?: AuroraRinkFieldErrors;
      };

      if (result.ok) {
        setStatus("success");
        setValues(initialValues(values.language));
        setErrors({});
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
    <section className={styles.wrap} id="aurora-contact">
      <p className={ad.kicker}>AURORA ICE RINK</p>
      <h2 className={styles.heading}>寫信給極光冰場客服</h2>
      <p className={ad.intro}>
        詢問內容已預填可編輯的範本。送出後由本站轉寄至極光冰場官方客服信箱，不代表目前已有開課、合格考官或已公告場次。
      </p>
      <div className={ad.grid}>
        <div className={ad.formPanel}>
          {status === "success" ? (
            <div role="status">
              <h3 className={ad.formTitle}>已轉寄詢問</h3>
              <p className={`${ad.status} ${ad.success}`}>
                已將詢問轉寄至極光冰場客服。若冰場回覆，會寄到你留下的 Email。本站無法保證回覆時間。
              </p>
              <button className="button" type="button" onClick={() => setStatus("idle")}>
                再寫一封
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <h3 className={ad.formTitle}>冰舞檢定詢問表單</h3>
              {status === "unconfigured" ? (
                <p className={`${ad.status} ${ad.unconfigured}`} role="status">
                  線上表單設定中，請改用郵件程式寄出。
                </p>
              ) : null}
              {status === "unavailable" ? (
                <p className={`${ad.status} ${ad.fail}`} role="status">
                  訊息暫時無法送出，請改用郵件程式寄出。
                </p>
              ) : null}
              {status === "unconfigured" || status === "unavailable" ? fallbackButtons : null}

              <div className={`${ad.field} ${errors.name ? ad.invalid : ""}`}>
                <label htmlFor="aurora-name">姓名</label>
                <input
                  id="aurora-name"
                  className={ad.input}
                  name="name"
                  value={values.name}
                  onChange={(event) => update("name", event.target.value)}
                  autoComplete="name"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "aurora-name-error" : undefined}
                />
                {errors.name ? (
                  <p className={ad.error} id="aurora-name-error">
                    {errors.name}
                  </p>
                ) : null}
              </div>

              <div className={`${ad.field} ${errors.email ? ad.invalid : ""}`}>
                <label htmlFor="aurora-email">Email</label>
                <input
                  id="aurora-email"
                  className={ad.input}
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={(event) => update("email", event.target.value)}
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "aurora-email-error" : undefined}
                />
                {errors.email ? (
                  <p className={ad.error} id="aurora-email-error">
                    {errors.email}
                  </p>
                ) : null}
              </div>

              <div className={`${ad.field} ${errors.phone ? ad.invalid : ""}`}>
                <label htmlFor="aurora-phone">
                  聯絡電話<span className={ad.optional}>選填</span>
                </label>
                <input
                  id="aurora-phone"
                  className={ad.input}
                  name="phone"
                  type="tel"
                  value={values.phone}
                  onChange={(event) => update("phone", event.target.value)}
                  autoComplete="tel"
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? "aurora-phone-error" : undefined}
                />
                {errors.phone ? (
                  <p className={ad.error} id="aurora-phone-error">
                    {errors.phone}
                  </p>
                ) : null}
              </div>

              <fieldset className={ad.field}>
                <legend>詢問範本語言</legend>
                <div className={styles.langRow} role="radiogroup" aria-label="詢問範本語言">
                  <label className={styles.langOption}>
                    <input
                      type="radio"
                      name="language"
                      value="zh"
                      checked={values.language === "zh"}
                      onChange={() => changeLanguage("zh")}
                    />
                    中文
                  </label>
                  <label className={styles.langOption}>
                    <input
                      type="radio"
                      name="language"
                      value="en"
                      checked={values.language === "en"}
                      onChange={() => changeLanguage("en")}
                    />
                    English
                  </label>
                </div>
              </fieldset>

              <div className={`${ad.field} ${errors.message ? ad.invalid : ""}`}>
                <label htmlFor="aurora-message">詢問內容</label>
                <textarea
                  id="aurora-message"
                  className={`${ad.textarea} ${styles.letter}`}
                  name="message"
                  value={values.message}
                  onChange={(event) => update("message", event.target.value)}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? "aurora-message-error" : "aurora-message-hint"}
                />
                <p className={styles.hint} id="aurora-message-hint">
                  可依你的程度與需求修改後再送出。
                </p>
                {errors.message ? (
                  <p className={ad.error} id="aurora-message-error">
                    {errors.message}
                  </p>
                ) : null}
              </div>

              <label className={ad.honeypot} htmlFor="aurora-fax" aria-hidden="true">
                公司傳真
                <input
                  id="aurora-fax"
                  name="companyFax"
                  value={values.companyFax}
                  onChange={(event) => update("companyFax", event.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </label>

              <div className={`${ad.consent} ${errors.consent ? ad.invalid : ""}`}>
                <input
                  id="aurora-consent"
                  className={ad.checkbox}
                  name="consent"
                  type="checkbox"
                  checked={values.consent}
                  onChange={(event) => update("consent", event.target.checked)}
                  aria-invalid={Boolean(errors.consent)}
                  aria-describedby={errors.consent ? "aurora-consent-error" : undefined}
                />
                <label className={ad.consentLabel} htmlFor="aurora-consent">
                  我同意本站將姓名、Email 及詢問內容轉寄至極光冰場客服，以便回覆本次冰舞檢定詢問。{" "}
                  <Link href="/privacy">隱私說明</Link>
                </label>
              </div>
              {errors.consent ? (
                <p className={ad.error} id="aurora-consent-error">
                  {errors.consent}
                </p>
              ) : null}

              <button className={ad.submit} type="submit" disabled={status === "submitting"}>
                {status === "submitting" ? "送出中…" : "送出詢問"}
              </button>
            </form>
          )}
        </div>

        <aside className={ad.side}>
          <div className={ad.card}>
            <p className={ad.kicker}>CONTACT</p>
            <h3 className={ad.cardTitle}>極光冰場客服</h3>
            <p className={ad.detail}>
              <span className={ad.detailLabel}>客服 Email</span>
              <a href={`mailto:${AURORA_EMAIL}`}>{AURORA_EMAIL}</a>
            </p>
            <p className={ad.detail}>
              <span className={ad.detailLabel}>滑冰學院</span>
              <a href={`mailto:${AURORA_ACADEMY_EMAIL}`}>{AURORA_ACADEMY_EMAIL}</a>
            </p>
            <div className={ad.actions}>
              <a className="button" href={AURORA_SITE} rel="noopener noreferrer" target="_blank">
                查看極光官網
              </a>
              <a className="button-accent" href={auroraMailto(values.language)}>
                改用郵件程式
              </a>
            </div>
          </div>
          <div className={ad.process}>
            <h3 className={ad.processTitle}>寄送方式</h3>
            <ol className={ad.processList}>
              <li>在表單中修改預填範本，並留下可回覆的 Email。</li>
              <li>本站透過 Resend 轉寄至極光冰場客服信箱。</li>
              <li>冰場若回覆，會直接寄到你留下的信箱。</li>
            </ol>
          </div>
        </aside>
      </div>
    </section>
  );
}
