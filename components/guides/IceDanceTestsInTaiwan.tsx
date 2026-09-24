import Link from "next/link";
import { AuroraRinkInquiry } from "@/components/contact/AuroraRinkInquiry";
import { ExternalLink } from "@/components/ExternalLink";
import {
  ASK_CHECKLIST,
  COMPARISON_ROWS,
  GUIDE_SOURCES,
  ICE_DANCE_LEVELS,
  ICE_DANCE_TESTS_PATH,
  ICE_DANCE_VIDEO_TESTS_PATH,
  REQUIREMENTS,
  TAIWAN_ADMIN_MEMBERS,
  TESTS_FAQ,
  VERIFIED_ON_ZH,
} from "@/lib/guides/ice-dance-tests-taiwan";
import styles from "./IceDanceTestGuide.module.css";

const featuredMember = TAIWAN_ADMIN_MEMBERS[0];

export function IceDanceTestsInTaiwan() {
  return (
    <div className={styles.wrap}>
      <section className={styles.hero}>
        <h1>在台灣有機會參加冰舞檢定嗎？</h1>
        <p className={styles.answer}>
          有機會，但目前較明確的路徑是透過 ISIAsia 有效行政會員冰場、合格專業會員教練及個人需註冊 ISIAsia 會籍，且必須依序參加 Ice Dance 1–10。
        </p>
        <div className={styles.actions}>
          <Link className="button" href={ICE_DANCE_VIDEO_TESTS_PATH}>
            了解錄影檢定
          </Link>
        </div>
      </section>

      <section className={styles.section} id="overview">
        <h2>30 秒看懂</h2>
        <p className={styles.lede}>
          冰舞檢定通常依技術級別區分，不另外設成人組。成人指的是參加比賽的年齡組別，不是檢定分組。這套制度不以成人身分排除參加者，適合作為台灣成人學習者的第一個明確里程碑。
        </p>
      </section>

      <section className={styles.section} id="levels">
        <h2>ISIAsia Ice Dance 1–10</h2>
        <p className={styles.lede}>初級先完成 Ice Dance 1–3 的基礎步伐與規定舞，之後才進入 Swing Dance、Cha Cha、Fiesta Tango 等後續舞型。</p>
        <div className={styles.timeline}>
          {ICE_DANCE_LEVELS.map((level) => (
            <article className={styles.level} key={level.id}>
              <h3>
                {level.title}
                {level.group === "foundation" ? "｜入門" : ""}
              </h3>
              <p>{level.dances.join("、")}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section} id="requirements">
        <h2>參加條件</h2>
        <p className={styles.lede}>不能直接向 ISIAsia 總部自行約考。官方測驗登錄頁列出四項基本條件。</p>
        <div className={styles.reqGrid}>
          {REQUIREMENTS.map((item) => (
            <article className={styles.req} key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
        <p className={styles.note}>
          Dance 測驗登錄費目前列為每級 USD 6／HKD 50，不含教練、冰時、場地費，也不含高階評審費。實際總費用以冰場與 ISIAsia 當次通知為準。
        </p>
      </section>

      <section className={styles.section} id="rinks">
        <h2>台灣目前可詢問的有效行政會員</h2>
        {featuredMember ? (
          <article className={styles.member}>
            <span className={`${styles.badge} ${styles[featuredMember.statusTone]}`}>{featuredMember.statusLabel}</span>
            <h3>
              {featuredMember.nameEn}／{featuredMember.nameZh}
            </h3>
            <p>
              會員編號 {featuredMember.membershipNo}｜地區 {featuredMember.region}｜會籍狀態 {featuredMember.status}｜有效期限{" "}
              {featuredMember.expiry.replaceAll("-", "/")}
            </p>
            <p>{featuredMember.note}</p>
          </article>
        ) : null}
      </section>

      <section className={styles.section} id="compare">
        <h2>制度比較</h2>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>制度</th>
                <th>目前公開狀態</th>
                <th>台灣成人可行性</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.system}>
                  <td>{row.system}</td>
                  <td>{row.publicStatus}</td>
                  <td>
                    <span className={`${styles.badge} ${styles[row.tone]}`}>{row.toneLabel}</span>
                    <p>{row.feasibility}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.mobileCards}>
            {COMPARISON_ROWS.map((row) => (
              <article className={styles.card} key={row.system}>
                <span className={`${styles.badge} ${styles[row.tone]}`}>{row.toneLabel}</span>
                <h3>{row.system}</h3>
                <p>目前公開狀態：{row.publicStatus}</p>
                <p>台灣成人可行性：{row.feasibility}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section} id="ask">
        <h2>詢問冰場前先確認</h2>
        <ul className={styles.checkList}>
          {ASK_CHECKLIST.map((item) => (
            <li key={item}>
              <span className={styles.checkMark} aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <AuroraRinkInquiry sourcePage={ICE_DANCE_TESTS_PATH} />
      </section>

      <section className={styles.section} id="faq">
        <h2>常見問題</h2>
        <div className={styles.faqList}>
          {TESTS_FAQ.map((item) => (
            <article className={styles.faqItem} key={item.q}>
              <h3>{item.q}</h3>
              <p>{item.a}</p>
            </article>
          ))}
        </div>
        <div className={styles.actions}>
          <Link className="button" href={ICE_DANCE_VIDEO_TESTS_PATH}>
            前往了解錄影檢定
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
