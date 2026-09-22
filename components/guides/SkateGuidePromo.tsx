import Link from "next/link";
import styles from "./SkateGuidePromo.module.css";

export function SkateGuidePromo() {
  return (
    <aside className={styles.slot} aria-label="站內採購工具">
      <Link className={styles.trigger} href="/guides/buy-skates">
        <div className={styles.banner}>
          <span className={styles.deco} aria-hidden="true" />
          <span className={styles.blade} aria-hidden="true" />
          <p className={styles.label}>站內採購工具</p>
          <p className={styles.title}>
            找對尺寸，
            <br />
            再找價格
          </p>
          <p className={styles.body}>
            從尺寸、寬度、庫存、國際運費到退換貨，一步一步比較適合自己的花式滑冰鞋。
          </p>
          <span className={styles.cta}>開始採購規劃</span>
          <p className={styles.note}>中立比較，不替特定商店背書</p>
        </div>
      </Link>
    </aside>
  );
}
