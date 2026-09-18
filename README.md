# Adult Ice Dance Hub

成人冰舞資訊站。第一版是可公開部署的靜態資訊入口，使用 Next.js、TypeScript 與 App Router，內容資料放在本機 JSON。

## 本機啟動

```bash
npm install
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000)。

```bash
npm run build
npm start
```

## 第一版範圍

- 繁體中文為主，保留官方英文名稱
- 內容頁使用靜態 JSON，不登入、不接付款
- 成人雙人冰舞與成人單人冰舞分開標示
- 正式資訊顯示官方來源與最後查證日期
- 廣告為中性 Demo Banner 與 mock 追蹤，不是真實廣告主成效

## 廣告 mock 模式

目前沒有新的 Supabase 專案。廣告設定在 `data/ads/`，事件寫入 gitignore 的 `.data/ad-events.json`（若檔案系統不可寫則只留在記憶體）。

本機產出 CSV 月報（不公開）：

```bash
npm run ads:report -- --start 2026-09-01 --end 2026-09-30
```

`GET /api/ads/report` 在未設定 `ADS_REPORT_TOKEN` 時回傳 404，避免未授權存取。

## 廣告合作聯絡表單

公開聯絡窗口在 `/advertising#contact`。表單送到 `POST /api/contact/advertising`，收件人由伺服器端 `CONTACT_RECIPIENT_EMAIL` 決定，預設為 `sabrina114114@gmail.com`。

實際寄信需在伺服器設定：

- `RESEND_API_KEY`
- `CONTACT_FROM_EMAIL`（須為 Resend 已驗證網域）
- `CONTACT_RECIPIENT_EMAIL`

未設定時，頁面會請訪客改用電話或 Email，不會顯示假的送出成功。不要把 API Key 放到前端或 Git。

## Vercel 部署前

1. 將 GitHub repository 匯入 Vercel
2. Framework Preset 選擇 Next.js
3. 設定 `NEXT_PUBLIC_SITE_URL` 為正式網域
4. 若要啟用廣告合作表單寄信，設定 `RESEND_API_KEY`、`CONTACT_FROM_EMAIL` 與 `CONTACT_RECIPIENT_EMAIL`
5. 廣告統計若要上正式後端，需另開新的 Supabase 專案，不要重用其他專案或把 service role key 放到前端
6. 重新部署，讓 sitemap、robots 與 Open Graph 使用正確網址
