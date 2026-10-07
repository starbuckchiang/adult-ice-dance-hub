# Release Agent

本文件說明如何在 **僅限** [`starbuckchiang/adult-ice-dance-hub`](https://github.com/starbuckchiang/adult-ice-dance-hub) 使用 Cursor Release Agent 更新網站。

正式發布路徑：

Cursor 修改程式 → 品質檢查與 build → GitHub 保存原始碼 → push 工作分支 → 建立 Pull Request → Vercel 自動 Preview → 回報 PR 與 Preview → **使用者確認後** 合併 `main` → Vercel 自動發布正式站。

Agent **不得**執行 `vercel --prod`。Vercel 部署繼續使用既有 GitHub Integration。

## 平常如何叫 Agent 更新

在 Cursor 對這個 repository 下達任務即可，例如：

- 「依照 Release Agent 流程，更新即將直播影片。」
- 「修手機版賽事卡被擋住的問題，走 Preview → 等我確認再合併。」

Agent 應：

1. 只操作本 repository，先 `git fetch origin` 並以最新 `origin/main` 開獨立分支。
2. 若有未提交修改，先報告，不得覆蓋。
3. 改完後執行 `npm ci`、`npm run lint`、`npm run typecheck`、`npm test`、`npm run build`。
4. 測試失敗則停止，不得 push、不得發布。
5. 測試成功後 commit、push 工作分支，開 PR 到 `main`。
6. 回報 commit、branch、PR、測試結果，以及 Vercel Preview 網址。
7. 沒有你的明確確認，不得合併 `main`。

規則寫在 `.cursor/rules/release-agent.mdc`。

## Preview

PR 推到 GitHub 後，Vercel Git Integration 會自動建立 Preview。

- GitHub 的 Checks／Deployments 會出現 `Vercel` 與 Preview URL。
- Preview 網址型態通常是 `https://adult-ice-dance-<hash>-starbuckchiang.vercel.app`。
- 正式站目前是 `https://adult-ice-dance-hub.vercel.app`。
- Production branch 是 `main`。

請在 Preview 上看過變更再決定是否合併。

## 確認、合併 main、正式發布

1. 在 Preview 確認內容與版面。
2. 對 Agent 或在 GitHub 明確說「合併 main」或「可以發布正式站」。
3. 合併進 `main` 之後，Vercel 會自動部署 Production。
4. 不要在本機或 Agent 跑 `vercel --prod`。

`main` 目前沒有強制 status check。若要讓失敗的 CI 擋住合併，需在 GitHub 自行設定 branch protection。

## Build failure 時不得發布

下列任一情況都**不得**合併 `main`、不得當正式發布：

- `npm run lint`、`npm run typecheck`、`npm test` 或 `npm run build` 失敗
- GitHub Actions `CI` workflow 失敗
- Vercel Preview／Production build 失敗
- diff 含 `.env`、token、金鑰或憑證

先修程式與測試，再開新的 commit／PR。不要 force push `main`。

## Rollback

不要 `git push --force` 到 `main`。

1. **Git：** 對有問題的 merge 開 revert PR，走同樣的 Preview → 確認 → 合併。
2. **Vercel Dashboard：** 在 Production 部署列表 Rollback 到上一個成功的 deployment。

環境變數（如 `NEXT_PUBLIC_SITE_URL`、`RESEND_API_KEY`）只存在 Vercel／主機設定，不要寫進 Git。

## 本機品質檢查

套件管理是 npm（`package-lock.json`）。

```bash
npm ci
npm run check:release
```

等價於 lint → typecheck → test → build。
---
