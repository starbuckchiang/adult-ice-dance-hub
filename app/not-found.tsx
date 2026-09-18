import Link from "next/link";

export default function NotFound() {
  return (
    <header className="page-header">
      <p className="kicker">404</p>
      <h1>找不到這個頁面</h1>
      <p>這個網址不在第一版範圍內。請返回首頁或國家總覽繼續查詢成人冰舞資訊。</p>
      <div className="button-row">
        <Link className="button" href="/">
          返回首頁
        </Link>
        <Link className="button-secondary" href="/countries">
          國家總覽
        </Link>
      </div>
    </header>
  );
}
