import type { Metadata } from "next";
import Link from "next/link";
import styles from "@/components/about/AboutPage.module.css";
import { createPageMetadata } from "@/lib/metadata";
import { SITE_NAME_EN, SITE_NAME_ZH } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "關於本站",
  description:
    "了解 Adult Ice Dance Hub 成人冰舞資訊站的定位與資料原則：優先收錄具公開來源的成人冰舞資訊。",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <article className={styles.inner}>
        <header>
          <p className={styles.kicker}>ABOUT</p>
          <h1>關於本站</h1>
          <p className={styles.lede}>
            {SITE_NAME_EN}（{SITE_NAME_ZH}）是成人冰舞的公開資訊入口，主語言為繁體中文，並保留官方英文名稱。
          </p>
        </header>
        <section className={styles.section}>
          <h2>本站做什麼</h2>
          <p>
            本站協助成人舞者、教練與關心這項運動的人，快速找到官方協會、俱樂部名錄、比賽公告、規則文件，以及學習與交流入口。網站分開標示成人雙人冰舞（Partnered Ice Dance）與成人單人冰舞（Adult Solo Dance）。
          </p>
          <p>目前可瀏覽美國、日本、加拿大、瑞士、義大利及澳洲的相關資訊。</p>
        </section>
        <section className={styles.section}>
          <h2>網站功能</h2>
          <ul>
            <li>提供公開資訊瀏覽，無需登入或註冊。</li>
            <li>學習中心整理基礎步伐、Pattern Dance 導覽、檢定路線與音樂原則；網站教學不能取代現場教練。</li>
            <li>交流頁提供舞伴與教練申請刊登，審核通過前不會公開。</li>
            <li>網站內容將依公開來源持續整理與更新。</li>
            <li>正式資訊附上來源連結與最後查證日期。</li>
            <li>來源不足的項目會標示為待查證。</li>
          </ul>
        </section>
        <section className={styles.section}>
          <h2 id="data-policy">資料來源與查證原則</h2>
          <p>
            本站優先收錄具公開來源的成人冰舞資訊。來源不足的項目會標示為待查證；歷史規則會注明適用賽季，現行要求請參閱最新官方規則。
          </p>
        </section>
        <section className={styles.section}>
          <h2>廣告</h2>
          <p>
            本站設有標示清楚的廣告版位，並可依活動與版位統計曝光、點擊及點擊率。正式投放前，統計期間、版位、素材及報告方式會與廣告主確認。詳見{" "}
            <Link href="/advertising#contact">廣告合作</Link> 與 <Link href="/privacy">隱私說明</Link>。
          </p>
        </section>
      </article>
    </div>
  );
}
