import Link from "next/link";
import { AuroraRinkInquiry } from "@/components/contact/AuroraRinkInquiry";
import { ExternalLink } from "@/components/ExternalLink";
import {
  GUIDE_SOURCES,
  ICE_DANCE_TESTS_PATH,
  ICE_DANCE_VIDEO_TESTS_PATH,
  MISCONCEPTIONS,
  VERIFIED_ON_ZH,
  VIDEO_FAQ,
  VIDEO_LEVELS,
  VIDEO_PREP,
  VIDEO_PROCESS,
  VIDEO_STEPS,
} from "@/lib/guides/ice-dance-tests-taiwan";
import styles from "./IceDanceTestGuide.module.css";

const categoryClass = {
  live: styles.live,
  panel: styles.panel,
  video: styles.video,
  "live-only": styles.liveOnly,
} as const;

export function IceDanceVideoTestsFromTaiwan() {
  return (
    <div className={styles.wrap}>
      <section className={styles.hero}>
        <h1>人在台灣，可以用錄影方式取得冰舞檢定結果嗎？</h1>
        <p className={styles.answer}>
          部分制度與級別可能接受錄影審查，但不是自行拍攝、上傳影片就能取得檢定結果。考生仍須先確認會員、級別、承辦機構、考官與送件資格。
        </p>
        <div className={styles.actions}>
          <Link className="button" href={ICE_DANCE_TESTS_PATH}>
            先確認台灣實體路徑
          </Link>
        </div>
      </section>

      <section className={styles.section} id="flow">
        <h2>資格判斷流程</h2>
        <ol className={styles.steps}>
          {VIDEO_STEPS.map((item) => (
            <li key={item.title}>
              <strong>{item.title}</strong>
              ：{item.text}
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.section} id="levels">
        <h2>級別與評審方式</h2>
        <div className={styles.callout}>
          <p>
            下列分類只寫 ISIAsia Test Registration 已載明的規定。教練不得評自己的學生。中國地區 Level 4
            以上另有須送錄影的規定，不自動適用於台灣考生。
          </p>
        </div>
        <div className={styles.cardGrid}>
          {VIDEO_LEVELS.map((item) => (
            <article className={styles.card} key={item.id}>
              <span className={`${styles.badge} ${categoryClass[item.category]}`}>{item.categoryLabel}</span>
              <h3>{item.levels}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section} id="prep">
        <h2>錄影準備</h2>
        <p className={styles.lede}>官方 TEST VIDEO REQUIREMENTS 適用高階錄影。拍攝前仍須先取得該級別可以錄影的確認。</p>
        <ul className={styles.checkList}>
          {VIDEO_PREP.map((item) => (
            <li key={item}>
              <span className={styles.checkMark} aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section} id="process">
        <h2>申請流程</h2>
        <ol className={styles.steps}>
          {VIDEO_PROCESS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </section>

      <section className={styles.section} id="myths">
        <h2>常見誤解</h2>
        <div className={styles.cardGrid}>
          {MISCONCEPTIONS.map((item) => (
            <article className={styles.card} key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section} id="inquiry">
        <AuroraRinkInquiry sourcePage={ICE_DANCE_VIDEO_TESTS_PATH} />
      </section>

      <section className={styles.section} id="faq">
        <h2>常見問題</h2>
        <div className={styles.faqList}>
          {VIDEO_FAQ.map((item) => (
            <article className={styles.faqItem} key={item.q}>
              <h3>{item.q}</h3>
              <p>{item.a}</p>
            </article>
          ))}
        </div>
        <div className={styles.actions}>
          <Link className="button" href={ICE_DANCE_TESTS_PATH}>
            返回台灣實體路徑
          </Link>
        </div>
      </section>

      <section className={styles.section} id="sources">
        <h2>資料來源與查詢日期</h2>
        <p className={styles.verified}>資料查詢日期：{VERIFIED_ON_ZH}</p>
        <ul className={styles.sourceList}>
          {GUIDE_SOURCES.map((item) => (
            <li key={item.id}>
              <ExternalLink href={item.href}>{item.name}</ExternalLink>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
