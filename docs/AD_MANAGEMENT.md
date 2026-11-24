# 廣告上架

廣告由 `data/ads.ts` 管理，不使用後台、登入或資料庫。目前只接在首頁「第一次參賽計畫」下方既有的紫色廣告合作區塊，版位代碼是 `first-competition-plan`。沒有有效廣告時，這個位置仍顯示原本的紫色「讓更多滑冰愛好者看見你的品牌／洽詢廣告合作」卡片。

修改後請開 Pull Request，等 Preview 確認，再合併 `main`。不要直接改 `main`。

## 上傳圖片

1. 把原始橫幅放到 `public/ads/`。檔名用小寫與連字號，例如 `public/ads/claw-lucky-adult-ice-dance.jpg`。
2. 不要裁切、重繪或改圖上的文字。
3. 在 `data/ads.ts` 把 `imageSrc` 設成網站路徑，例如 `/ads/claw-lucky-adult-ice-dance.jpg`。
4. `width` 與 `height` 填圖片原始像素，讓版面在載入時就留好位置。

畫面上的圖片寬度與高度都是這個區塊的 70%，高度依比例自動計算，不裁切、不變形。手機版同樣是內容欄的 70%。

## 設定連結

`targetUrl` 填廣告主要開啟的完整網址，使用 `https://`。元件會自動加上：

- `utm_source=adult-ice-dance-hub`
- `utm_medium=banner`
- `utm_campaign`：該筆資料的 `utmCampaign`
- `utm_content`：該筆資料的 `placement`

不要把封閉測試頁填進來。路徑結尾是 `beta.html` 的網址會被視為無效，版位會回到紫色占位卡。

正式連結還沒確認時，保持 `active: false`，`targetUrl` 先留空。

## 設定起訖時間

`startsAt` 與 `endsAt` 使用含時區的時間，例如 `2026-10-08T00:00:00+08:00`。

- 現在時間早於 `startsAt`，或晚於 `endsAt`，廣告不會出現。
- 某一端留空字串 `""`，代表那一端不設限。

## 啟用與停用

- 上架：`active` 設為 `true`，並確認連結、圖片與日期都已填好。
- 暫停：`active` 設為 `false`。版位立刻回到紫色「廣告合作」卡片，不需要刪圖片。

同一 `placement` 若有多筆 `active: true` 且都在檔期內，會使用檔案中較前面的那一筆。

## 更換廣告

1. 新圖片放進 `public/ads/`。
2. 改同一筆的 `imageSrc`、`width`、`height`、`title`、`alt`、`advertiser`、`targetUrl`、`utmCampaign` 與日期。
3. 或新增一筆，並把舊的 `active` 設為 `false`。
4. 開 PR，在 Preview 確認圖片完整、連結與「合作推廣」標示後，再合併 `main`。
