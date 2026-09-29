import type { Metadata } from "next";
import Link from "next/link";
import { ContentWithSidebar } from "@/components/ads/ContentWithSidebar";
import { ExternalLink } from "@/components/ExternalLink";
import { Breadcrumbs } from "@/components/nav/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { formatDate } from "@/lib/format";
import {
  FIGURE_SKATING_FAQ,
  FIGURE_SKATING_ICE_DANCE_PATH,
  ISU_COMM_2698_URL,
  ISU_COMM_2704_URL,
  ISU_COMM_2795_URL,
  OLYMPIC_RESULTS_URL,
  VERIFIED_ON,
} from "@/lib/guides/figure-skating-ice-dance";
import { createPageMetadata } from "@/lib/metadata";
import { articleJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

const title = "冰舞比賽術語、2026冬奧組合與服裝音樂規定";
const description =
  "說明花滑、花式滑冰與冰舞的差別，整理同步旋轉、圖形步法序列等比賽術語，介紹2026冬奧冰舞前段組合，以及服裝與音樂規定。成人學習與參賽從首頁開始。";

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  path: FIGURE_SKATING_ICE_DANCE_PATH,
  ogType: "article",
});

const crumbs = [
  { name: "首頁", path: "/" },
  { name: "學習中心", path: "/learn" },
  { name: "花滑與冰舞入門", path: FIGURE_SKATING_ICE_DANCE_PATH },
];

const podium = [
  {
    place: "金牌",
    score: "225.82",
    names: "Laurence Fournier Beaudry / Guillaume Cizeron",
    nation: "法國",
    detail:
      "節奏舞 90.18、自由舞 135.64。這是兩人搭檔的第一個賽季。Cizeron 在 2022 北京冬奧與前搭檔 Gabriella Papadakis 拿下冰舞金牌，是以不同搭檔連兩屆獲得奧運冰舞冠軍的選手。",
  },
  {
    place: "銀牌",
    score: "224.39",
    names: "Madison Chock / Evan Bates",
    nation: "美國",
    detail: "節奏舞 89.72、自由舞 134.67。與金牌分差 1.43 分，是該屆名次非常接近的一場。",
  },
  {
    place: "銅牌",
    score: "217.74",
    names: "Piper Gilles / Paul Poirier",
    nation: "加拿大",
    detail: "節奏舞 86.18、自由舞 131.56。",
  },
] as const;

const nextPlaces = [
  { place: "第 4", score: "209.58", names: "Charlène Guignard / Marco Fabbri", nation: "義大利" },
  { place: "第 5", score: "206.72", names: "Emilea Zingas / Vadym Kolesnik", nation: "美國" },
  { place: "第 6", score: "204.66", names: "Allison Reed / Saulius Ambrulevičius", nation: "立陶宛" },
  { place: "第 7", score: "204.32", names: "Lilah Fear / Lewis Gibson", nation: "英國" },
  { place: "第 8", score: "203.68", names: "Evgeniia Lopareva / Geoffrey Brissaud", nation: "法國" },
] as const;

export default function FigureSkatingIceDancePage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd
        data={articleJsonLd({
          name: title,
          description,
          path: FIGURE_SKATING_ICE_DANCE_PATH,
          datePublished: VERIFIED_ON,
        })}
      />
      <JsonLd data={faqJsonLd([...FIGURE_SKATING_FAQ])} />
      <header className="page-header">
        <Breadcrumbs items={crumbs} />
        <p className="kicker">FIGURE SKATING · ICE DANCE</p>
        <h1>花式滑冰裡的冰舞：術語、2026 冬奧組合、服裝與音樂</h1>
          <p>
            花滑是花式滑冰的常見簡稱。冰舞是花式滑冰的雙人項目。這頁用國際賽事的語言說明比賽在比什麼，再把成人想開始學的下一步放回<Link href="/">花式滑冰與冰舞首頁</Link>。
          </p>
        <p className="source-meta">查證日期：{formatDate(VERIFIED_ON)}。本頁整理官方文件，不取代 ISU 或各賽事規程。</p>
      </header>
      <ContentWithSidebar>
        <article className="card-dark learn-card" id="what">
          <h2>花滑、花式滑冰、冰舞差在哪</h2>
          <p>
            搜尋「花滑」或「花式滑冰」，找到的是整項運動。奧運花式滑冰的個人與雙人場次有男子單人、女子單人、雙人滑和冰舞。同步滑冰是另一個項目。
          </p>
          <p>
            冰舞由一對選手演出。節目沿音樂的拍子走步伐、換握持、做托舉和旋轉。跳躍不是主體，規則對跳躍也有限制。雙人滑則以拋跳、捻轉托舉和雙人旋轉為主要內容，兩者不要混成同一種比賽。
          </p>
          <p>
            成人也可以從步伐和規定舞開始，不必先會跳。程度、鞋子、檢定和第一場比賽，從<Link href="/">成人冰舞首頁</Link>選擇下一步。
          </p>
        </article>

        <article className="card-dark learn-card" id="terms">
          <h2>冰舞比賽常見技術術語</h2>
          <p>
            下面用 2026 冬奧當時的 2025/26 賽季，對照目前的 2026/27 賽季。成年國際賽、成人賽和單人冰舞的必選元素不同，報名前以該場文件為準。
          </p>

          <h3>節奏舞與自由舞</h3>
          <p>
            一場雙人冰舞通常有兩支節目。節奏舞（Rhythm Dance）要符合當季公布的節奏或主題。自由舞（Free Dance）由組合自己選音樂與風格，但仍要符合音樂、時間和元素規定。2026/27 青年組與成年組的節奏舞時間是 2 分 50 秒，上下各 10 秒；成年組自由舞是 4 分鐘，上下各 10 秒。
          </p>

          <h3>圖形步法序列</h3>
          <p>
            圖形步法序列的英文是 Pattern Dance Type Step Sequence，縮寫 PSt。它是沿著指定圖形滑行的一段步法，不是把整支規定舞原樣滑完。
          </p>
          <p>
            2026 冬奧使用的 Communication 2704 規定：成年組節奏舞要有一支圓形圖形步法序列，途中必須保持接觸（連接動作中的捻轉除外）。每位選手要從指定難度轉彎裡完成兩種不同轉彎，包含後退進入的 Rocker、Counter、後退進入的 Bracket，以及前進外刃 Mohawk。
          </p>
          <p>
            2026/27 的 Communication 2795 已改寫成年組節奏舞。當季必選改為規定舞元素（Pattern Dance Element，取 Golden Waltz 的一段）以及 Creative Dance Element，不再把上述圓形 PSt 列為必選。規定舞元素要照規定步序、拍子和關鍵點滑出。成人賽另外指定完整的規定舞序列，見
            <Link href="/learn/pattern-dance">Pattern Dance 導覽</Link>。
          </p>

          <h3>同步旋轉，規則名稱是舞蹈旋轉</h3>
          <p>
            轉播裡說的同步旋轉，對應自由舞的舞蹈旋轉（Dance Spin，縮寫 DSp）。Communication 2795 的定義是：兩人在握持中一起轉，繞共同軸心，以單腳在定點完成，一人或兩人都可以換腳。自由舞規定一次。
          </p>
          <p>
            它和同步捻轉（Synchronized Twizzles）不是同一個元素。同步捻轉在自由舞：兩人各自做捻轉，步數和方向要對得起來，人是在移動，不是定點轉。2025/26 成年組每人至少兩個捻轉，中間 2 到 4 步。2026/27 成年組改為每人至少三個捻轉，每個至少四圈；第一與第二個之間 2 到 4 步，第二與第三個之間最多 1 步。
          </p>
          <p>
            節奏舞另有連續捻轉（Sequential Twizzles）。2026/27 規定每人至少兩個捻轉，捻轉之間不得保持接觸，中間最多 1 步。
          </p>

          <h3>其他常聽到的元素</h3>
          <ul>
            <li>托舉（Dance Lift）：短托舉最長 8 秒。成年組自由舞可以是三個不同類型的短托舉，或一個短托舉加一個最長 13 秒的組合托舉。</li>
            <li>步法序列（Step Sequence）：沿直線或曲線走出的一段步伐。節奏舞的不接觸步法序列（Style B）在 2026/27 成年組限為順時針圓形。</li>
            <li>編舞元素（Choreographic Element）：例如滑行、捻轉、托舉或角色步法，用來把音樂做完整。確認方式與有等級的技術元素不同。</li>
          </ul>
          <p>
            步伐怎麼練，見<Link href="/learn/steps">基礎步伐</Link>。成人比賽實際要交哪些元素，見<Link href="/rules">規則中心</Link>。
          </p>
        </article>

        <article className="card-dark learn-card" id="olympics">
          <h2>2026 冬奧冰舞前段組合</h2>
          <p>
            2026 米蘭—科爾蒂納冬奧的冰舞於 2 月 9 日與 11 日在米蘭 Milano Ice Skating Arena 舉行。下列名次與分數來自
            <ExternalLink href={OLYMPIC_RESULTS_URL}>國際奧委會賽後報導</ExternalLink>
            ，只介紹該屆個人冰舞成績，不含後續賽季的排名變化。
          </p>
          <ol>
            {podium.map((team) => (
              <li key={team.place}>
                <strong>
                  {team.place} {team.nation} {team.names}
                </strong>
                ，總分 {team.score}。{team.detail}
              </li>
            ))}
          </ol>
          <h3>第 4 至第 8 名</h3>
          <ul>
            {nextPlaces.map((team) => (
              <li key={team.place}>
                {team.place} {team.nation} {team.names}，{team.score}
              </li>
            ))}
          </ul>
          <p>
            義大利的 Guignard / Fabbri 以主場組合排在獎牌之後。英國的 Fear / Gibson、立陶宛的 Reed / Ambrulevičius 也留在前段。想看比賽影片怎麼找，從
            <Link href="/">首頁</Link>
            進影音，或直接到<Link href="/watch#replays">重播列表</Link>。
          </p>
        </article>

        <article className="card-dark learn-card" id="costume-music">
          <h2>服裝與音樂規定</h2>
          <p>
            2026 冬奧套用的是 2025/26 賽季文件。今天國際賽已進入 2026/27。兩邊都寫在下面，成人賽若另訂時間、主題或服裝，以該場規程為準。
          </p>

          <h3>服裝</h3>
          <p>
            節奏舞和自由舞的技術文件都把服裝指向 ISU Rule 501，並寫明選手可以穿任何長度的長褲。服裝或道具不符合規定時，裁判與裁判員可對該支節目扣 1.0 分。
          </p>
          <p>
            Rule 501 的實務要求是：服裝端莊、適合運動競賽，不可過度暴露，也不可做成劇場式的華麗造型；可以呼應音樂裡的角色。不可使用道具。2025/26 的 Communication 2704 另寫明，用服裝的一部分去支撐托舉，也算道具違規；服裝或裝飾物掉到冰上，可另扣 1.0 分。2026/27 的完整扣分表以
            <ExternalLink href={ISU_COMM_2795_URL}>Communication 2795</ExternalLink>
            與當季競賽規則為準，不要只沿用冬奧賽季的每一條扣分。
          </p>

          <h3>2026 冬奧當季的音樂</h3>
          <p>
            2025/26 節奏舞主題是 1990 年代的音樂、舞蹈風格與氣氛，要高能量、能帶動觀眾。古典、當代、傳統民俗和比賽型國標舞不是該季節奏舞的風格。音樂可以有人聲，開頭最多 10 秒沒有節奏拍。歌詞不得有攻擊性或冒犯內容。
          </p>
          <p>
            同一賽季的自由舞，依
            <ExternalLink href={ISU_COMM_2698_URL}>Communication 2698</ExternalLink>
            ：音樂要有節奏拍，可以搭配旋律，也可以有人聲；開頭或結尾最多 10 秒、節目中間另最多 10 秒可以沒有節奏拍；至少一次速度、節奏或表情的變化。不符合音樂要求可扣 2.0 分。
          </p>

          <h3>2026/27 賽季的音樂</h3>
          <p>
            青年組與成年組節奏舞主題改為 Rhythm and Waltz。任何風格的華爾滋都可以，從傳統到現代詮釋。華爾滋段落必須是 3/4 或 6/8，還要再加入至少一種其他節奏、速度和舞蹈風格。重混、翻唱和 AI 音樂可以使用。節奏舞不應滑成自由舞的樣子。歌詞同樣不得有攻擊性或冒犯內容。
          </p>
          <p>
            Communication 2795 寫明：節奏舞只能使用有節奏拍的舞蹈音樂，開頭最多 5 秒可以沒有節奏拍。這和冬奧賽季的 10 秒不同。音樂要求不符，裁判與裁判員可扣 2.0 分。自由舞音樂指向 Rule 710，同樣有 2.0 分的音樂扣分；秒數與變化要求以 2026 競賽規則及 2795 原文為準。
          </p>
          <p>
            選曲和成人賽時間的檢查表在<Link href="/music">音樂與編舞</Link>。
          </p>
        </article>

        <article className="card-dark learn-card" id="next">
          <h2>看完比賽，回到自己的程度</h2>
          <p>
            國際賽術語是用來看懂節目的。成人要參加的檢定、規定舞和國內賽，元素與時間通常少一截，也不能直接套用奧運成年組清單。
          </p>
          <p>
            <Link className="button" href="/">
              回到花式滑冰與冰舞首頁
            </Link>
          </p>
          <ul>
            <li>
              <Link href="/learn">學習中心</Link>：步伐、規定舞、檢定與音樂入口
            </li>
            <li>
              <Link href="/guides/ice-dance-tests-in-taiwan">台灣冰舞檢定</Link>
            </li>
            <li>
              <Link href="/guides/taiwan-adult-competitions-2026">2026 台灣成人參賽</Link>
            </li>
            <li>
              <Link href="/rules">規則中心</Link>：各國與 ISU 成人技術文件
            </li>
          </ul>
        </article>

        <article className="card-dark learn-card" id="faq">
          <h2>常見問題</h2>
          {FIGURE_SKATING_FAQ.map((item) => (
            <section key={item.q}>
              <h3>{item.q}</h3>
              <p>{item.a}</p>
            </section>
          ))}
        </article>

        <article className="card-dark learn-card" id="sources">
          <h2>來源</h2>
          <ul>
            <li>
              <ExternalLink href={OLYMPIC_RESULTS_URL}>國際奧委會：2026 冬奧冰舞金牌與前八名分數</ExternalLink>
            </li>
            <li>
              <ExternalLink href={ISU_COMM_2795_URL}>ISU Communication 2795：2026/27 冰舞技術規格</ExternalLink>
            </li>
            <li>
              <ExternalLink href={ISU_COMM_2704_URL}>ISU Communication 2704：2025/26 冰舞技術要求（冬奧賽季）</ExternalLink>
            </li>
            <li>
              <ExternalLink href={ISU_COMM_2698_URL}>ISU Communication 2698：冰舞音樂要求修正</ExternalLink>
            </li>
          </ul>
          <p>最後查證日期：{formatDate(VERIFIED_ON)}。</p>
        </article>
      </ContentWithSidebar>
    </>
  );
}
