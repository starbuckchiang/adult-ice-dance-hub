"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  COMPARE_ITEM_LIMIT,
  CURRENCIES,
  EMPTY_ITEM,
  PAYMENT_CHECKS,
  SKATE_GUIDE_STORAGE_KEY,
  TAIWAN_CHECKS,
  buildSearchQuery,
  buildSummary,
  createItemId,
  emptyGuideStore,
  formatMoney,
  loadGuideStore,
  rankItems,
  returnPayerLabel,
  safeHref,
  saveGuideStore,
  stockLabel,
  type CompareItem,
  type CurrencyCode,
  type NeedsWorksheet,
  type ReturnPayer,
  type StockStatus,
} from "@/lib/guides/skate-compare";
import styles from "./SkatePlanner.module.css";

function SearchFormula({ query }: { query: string }) {
  const [copied, setCopied] = useState("");

  async function copy(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
    } catch {
      setCopied("無法複製，請手動選取");
    }
  }

  return (
    <div className={styles.panel}>
      <p>
        搜尋公式：<code>品牌 + 型號 + 顏色 + 尺寸 + 寬度</code>
      </p>
      <div className={styles.searchBox}>
        <strong>依你的備忘組成的字串</strong>
        <code>{query || "先在上一步填入品牌、型號、顏色、尺寸與寬度"}</code>
        <button className="button" type="button" onClick={() => copy(query, "已複製搜尋字串")} disabled={!query}>
          複製搜尋字串
        </button>
      </div>
      <p>
        教學範例：<code>Edea Chorus Ivory 245 D</code>
        。這只示範如何組成關鍵字，不是商品或商店推薦。
      </p>
      <p>可再自行加上：</p>
      <div className={styles.chips}>
        {["in stock", "ships to Taiwan", "international shipping", "return policy", "special order", "VAT excluded"].map(
          (chip) => (
            <button key={chip} className={styles.chip} type="button" onClick={() => copy(chip, `已複製 ${chip}`)}>
              {chip}
            </button>
          ),
        )}
      </div>
      {copied ? <p className={styles.status}>{copied}</p> : null}
    </div>
  );
}

function ItemForm({
  draft,
  onChange,
  onSubmit,
  onCancel,
  submitLabel,
}: {
  draft: CompareItem;
  onChange: (next: CompareItem) => void;
  onSubmit: (event: FormEvent) => void;
  onCancel?: () => void;
  submitLabel: string;
}) {
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <div className={styles.grid}>
        <label>
          商店代稱
          <input
            value={draft.shopName}
            onChange={(event) => onChange({ ...draft, shopName: event.target.value })}
            required
            maxLength={80}
          />
        </label>
        <label>
          商品網址
          <input
            value={draft.productUrl}
            onChange={(event) => onChange({ ...draft, productUrl: event.target.value })}
            inputMode="url"
            placeholder="https://"
            maxLength={400}
          />
        </label>
        <label>
          商品價格
          <input
            type="number"
            min={0}
            step="0.01"
            value={draft.price}
            onChange={(event) => onChange({ ...draft, price: Number(event.target.value) })}
            required
          />
        </label>
        <label>
          幣別
          <select
            value={draft.currency}
            onChange={(event) => onChange({ ...draft, currency: event.target.value as CurrencyCode })}
          >
            {CURRENCIES.map((code) => (
              <option key={code}>{code}</option>
            ))}
          </select>
        </label>
        <label>
          運費（與商品相同幣別）
          <input
            type="number"
            min={0}
            step="0.01"
            value={draft.shipping}
            onChange={(event) => onChange({ ...draft, shipping: Number(event.target.value) })}
          />
        </label>
        <label>
          折扣（與商品相同幣別）
          <input
            type="number"
            min={0}
            step="0.01"
            value={draft.discount}
            onChange={(event) => onChange({ ...draft, discount: Number(event.target.value) })}
          />
        </label>
        <label className={styles.check}>
          <input
            type="checkbox"
            checked={draft.excludeVat}
            onChange={(event) => onChange({ ...draft, excludeVat: event.target.checked })}
          />
          是否退除當地 VAT
        </label>
        <label>
          退除 VAT 金額
          <input
            type="number"
            min={0}
            step="0.01"
            value={draft.vatAmount}
            onChange={(event) => onChange({ ...draft, vatAmount: Number(event.target.value) })}
            disabled={!draft.excludeVat}
          />
        </label>
        <label>
          預估關稅／營業稅（TWD）
          <input
            type="number"
            min={0}
            step="1"
            value={draft.tariffTwd}
            onChange={(event) => onChange({ ...draft, tariffTwd: Number(event.target.value) })}
          />
        </label>
        <label>
          信用卡海外交易費（TWD）
          <input
            type="number"
            min={0}
            step="1"
            value={draft.cardFeeTwd}
            onChange={(event) => onChange({ ...draft, cardFeeTwd: Number(event.target.value) })}
          />
        </label>
        <label>
          是否現貨
          <select
            value={draft.stock}
            onChange={(event) => onChange({ ...draft, stock: event.target.value as StockStatus })}
          >
            <option value="unknown">不明</option>
            <option value="in-stock">現貨</option>
            <option value="not-in-stock">非現貨</option>
          </select>
        </label>
        <label>
          預計出貨時間
          <input
            value={draft.dispatchEstimate}
            onChange={(event) => onChange({ ...draft, dispatchEstimate: event.target.value })}
            maxLength={80}
          />
        </label>
        <label>
          退換貨期限
          <input
            value={draft.returnDays}
            onChange={(event) => onChange({ ...draft, returnDays: event.target.value })}
            placeholder="例如 14 天"
            maxLength={40}
          />
        </label>
        <label>
          退貨運費由誰負擔
          <select
            value={draft.returnPayer}
            onChange={(event) => onChange({ ...draft, returnPayer: event.target.value as ReturnPayer })}
          >
            <option value="unknown">不明</option>
            <option value="shop">商店負擔</option>
            <option value="buyer">買方負擔</option>
          </select>
        </label>
      </div>
      <label>
        備註
        <textarea
          rows={3}
          value={draft.notes}
          onChange={(event) => onChange({ ...draft, notes: event.target.value })}
          maxLength={400}
        />
      </label>
      <div className={styles.actions}>
        <button className="button" type="submit">
          {submitLabel}
        </button>
        {onCancel ? (
          <button className="button-secondary" type="button" onClick={onCancel}>
            取消編輯
          </button>
        ) : null}
      </div>
    </form>
  );
}

function CheckList({
  items,
  values,
  onToggle,
}: {
  items: readonly string[];
  values: Record<string, boolean>;
  onToggle: (item: string) => void;
}) {
  return (
    <ul className={styles.checks}>
      {items.map((item) => (
        <li key={item}>
          <label className={styles.check}>
            <input type="checkbox" checked={Boolean(values[item])} onChange={() => onToggle(item)} />
            {item}
          </label>
        </li>
      ))}
    </ul>
  );
}

export function SkatePlanner() {
  const [store, setStore] = useState(emptyGuideStore);
  const [hydrated, setHydrated] = useState(false);
  const [draft, setDraft] = useState<CompareItem>({ ...EMPTY_ITEM, id: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setStore(loadGuideStore());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    saveGuideStore(store);
  }, [hydrated, store]);

  const query = useMemo(() => buildSearchQuery(store.needs), [store.needs]);
  const ranked = useMemo(() => rankItems(store.items, store.rates), [store.items, store.rates]);

  function updateNeeds(key: keyof NeedsWorksheet, value: string) {
    setStore((current) => ({
      ...current,
      needs: { ...current.needs, [key]: value },
    }));
  }

  function saveItem(event: FormEvent) {
    event.preventDefault();
    if (!draft.shopName.trim()) {
      setMessage("請填商店代稱。");
      return;
    }
    setStore((current) => {
      if (current.items.length >= COMPARE_ITEM_LIMIT && !editingId) {
        setMessage("最多比較 12 筆。");
        return current;
      }
      if (editingId) {
        return {
          ...current,
          items: current.items.map((item) => (item.id === editingId ? { ...draft, id: editingId } : item)),
        };
      }
      return {
        ...current,
        items: [...current.items, { ...draft, id: createItemId() }],
      };
    });
    setDraft({ ...EMPTY_ITEM, id: "" });
    setEditingId(null);
    setMessage(editingId ? "已更新比較項目。" : "已新增比較項目。");
  }

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(buildSummary(ranked));
      setMessage("已複製比較摘要。");
    } catch {
      setMessage("無法複製，請手動選取摘要。");
    }
  }

  function toggleCheck(group: "taiwanChecks" | "paymentChecks", key: string) {
    setStore((current) => ({
      ...current,
      [group]: { ...current[group], [key]: !current[group][key] },
    }));
  }

  return (
    <div className={styles.panel}>
      <article className="card-dark learn-card" id="step-1">
        <p className="kicker">STEP 1</p>
        <h2>確認自己需要什麼</h2>
        <p>先把規格寫下來。不同品牌的尺寸不能只按一般鞋號換算；相同長度但不同寬度，穿著感受可能差很多。</p>
        <form className={styles.form} onSubmit={(event) => event.preventDefault()}>
          <div className={styles.grid}>
            <label>
              用途
              <select value={store.needs.useCase} onChange={(event) => updateNeeds("useCase", event.target.value)}>
                <option value="">尚未選擇</option>
                <option>休閒滑冰</option>
                <option>花式滑冰</option>
                <option>成人冰舞</option>
                <option>比賽</option>
              </select>
            </label>
            <label>
              程度
              <select value={store.needs.level} onChange={(event) => updateNeeds("level", event.target.value)}>
                <option value="">尚未選擇</option>
                <option>初學</option>
                <option>單跳</option>
                <option>一周跳</option>
                <option>雙跳</option>
                <option>冰舞</option>
              </select>
            </label>
            <label>
              品牌與型號
              <input value={store.needs.brandModel} onChange={(event) => updateNeeds("brandModel", event.target.value)} />
            </label>
            <label>
              尺寸
              <input value={store.needs.size} onChange={(event) => updateNeeds("size", event.target.value)} />
            </label>
            <label>
              寬度
              <input
                value={store.needs.width}
                onChange={(event) => updateNeeds("width", event.target.value)}
                placeholder="例如 Standard、C、D、Wide"
              />
            </label>
            <label>
              鞋色
              <input value={store.needs.color} onChange={(event) => updateNeeds("color", event.target.value)} />
            </label>
            <label>
              只買鞋靴，還是鞋靴加冰刀
              <select value={store.needs.bootOnly} onChange={(event) => updateNeeds("bootOnly", event.target.value)}>
                <option value="">尚未選擇</option>
                <option>只買鞋靴</option>
                <option>鞋靴加冰刀</option>
                <option>尚未決定</option>
              </select>
            </label>
            <label>
              是否接受特訂、預購或展示品
              <select
                value={store.needs.specialOrder}
                onChange={(event) => updateNeeds("specialOrder", event.target.value)}
              >
                <option value="">尚未選擇</option>
                <option>只接受現貨</option>
                <option>可接受特訂</option>
                <option>可接受預購</option>
                <option>可接受展示品</option>
              </select>
            </label>
            <label>
              預計使用日期
              <input
                type="date"
                value={store.needs.neededBy}
                onChange={(event) => updateNeeds("neededBy", event.target.value)}
              />
            </label>
            <label>
              預算上限
              <input value={store.needs.budget} onChange={(event) => updateNeeds("budget", event.target.value)} />
            </label>
          </div>
        </form>
        <ul>
          <li>尺寸不確定時，應先找專業 fitting，或依品牌官方量測方式確認。</li>
          <li>進階程度、體重、訓練頻率與跳躍內容都會影響鞋靴支撐需求。</li>
          <li>鞋靴過硬或過軟都可能造成使用問題。</li>
        </ul>
      </article>

      <article className="card-dark learn-card" id="step-2">
        <p className="kicker">STEP 2</p>
        <h2>建立精準搜尋字串</h2>
        <SearchFormula query={query} />
      </article>

      <article className="card-dark learn-card" id="step-3">
        <p className="kicker">STEP 3</p>
        <h2>先判斷是否真的有貨</h2>
        <p>商品頁可以點「購買」，不代表你要的尺寸與寬度現在就在倉庫。付款前請同時核對指定尺寸與指定寬度。</p>
        <ul>
          <li>In stock：現貨。</li>
          <li>Available to order：可以下單，但不一定有現貨。</li>
          <li>Special order：向供應商調貨。</li>
          <li>Backorder：缺貨等待補貨。</li>
          <li>Pre-order：預購。</li>
          <li>Estimated dispatch：預估出貨時間。</li>
        </ul>
      </article>

      <article className="card-dark learn-card" id="step-4">
        <p className="kicker">STEP 4</p>
        <h2>比較到手總成本</h2>
        <p>
          所有數字由你自行輸入，資料只存在這個瀏覽器的 <code>{SKATE_GUIDE_STORAGE_KEY}</code>
          。匯率與稅費都是估算值，不是即時匯率，也不是最終報關金額。
        </p>
        <div className={styles.rates}>
          {CURRENCIES.map((code) => (
            <label key={code}>
              {code} → TWD（估算值）
              <input
                type="number"
                min={0}
                step="0.01"
                value={store.rates[code]}
                onChange={(event) =>
                  setStore((current) => ({
                    ...current,
                    rates: { ...current.rates, [code]: Number(event.target.value) },
                  }))
                }
              />
            </label>
          ))}
        </div>
        <ItemForm
          draft={draft}
          onChange={setDraft}
          onSubmit={saveItem}
          submitLabel={editingId ? "更新這筆比較" : "新增比較項目"}
          onCancel={
            editingId
              ? () => {
                  setDraft({ ...EMPTY_ITEM, id: "" });
                  setEditingId(null);
                  setMessage("已取消編輯。");
                }
              : undefined
          }
        />
        {ranked.length > 0 ? (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>商店</th>
                  <th>商品折算</th>
                  <th>預估到手總價</th>
                  <th>現貨</th>
                  <th>退換貨風險</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {ranked.map((item, index) => {
                  const href = safeHref(item.productUrl);
                  return (
                    <tr key={item.id}>
                      <td>
                        {item.shopName}
                        {index === 0 ? <span className={styles.mark}>預估總價較低</span> : null}
                        <div>{item.dispatchEstimate || "出貨時間未填"}</div>
                        <div>退貨運費：{returnPayerLabel(item.returnPayer)}</div>
                      </td>
                      <td>{formatMoney(item.convertedProduct)}</td>
                      <td>{formatMoney(item.landedTotal)}</td>
                      <td>{stockLabel(item.stock)}</td>
                      <td className={styles[item.riskLevel]}>{item.riskLabel}</td>
                      <td>
                        <div className={styles.actions}>
                          {href ? (
                            <a className="button-secondary" href={href} target="_blank" rel="noopener noreferrer">
                              開啟網址
                            </a>
                          ) : null}
                          <button
                            className="button-secondary"
                            type="button"
                            onClick={() => {
                              setDraft(item);
                              setEditingId(item.id);
                            }}
                          >
                            編輯
                          </button>
                          <button
                            className="button-secondary"
                            type="button"
                            onClick={() =>
                              setStore((current) => ({
                                ...current,
                                items: current.items.filter((entry) => entry.id !== item.id),
                              }))
                            }
                          >
                            刪除
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p>還沒有比較項目。本站不抓取商店資料，也不會替你選出唯一推薦商店。</p>
        )}
        <div className={styles.summary}>
          <strong>比較摘要</strong>
          <pre>{buildSummary(ranked)}</pre>
        </div>
        <div className={styles.actions}>
          <button className="button" type="button" onClick={() => void copySummary()}>
            複製比較摘要
          </button>
          <button
            className="button-secondary"
            type="button"
            onClick={() => {
              setStore((current) => ({ ...current, items: [] }));
              setDraft({ ...EMPTY_ITEM, id: "" });
              setEditingId(null);
              setMessage("已清除全部比較項目。需求備忘仍保留。");
            }}
          >
            清除全部比較
          </button>
        </div>
        {message ? <p className={styles.status}>{message}</p> : null}
        <p>綜合提醒：預估總價較低不代表最合適。請同時看現貨、出貨時間與退換貨風險，並以結帳頁為準。</p>
      </article>

      <article className="card-dark learn-card" id="step-5">
        <p className="kicker">STEP 5</p>
        <h2>檢查是否寄送台灣</h2>
        <p>勾選你已經核對過的項目。這份清單只存在這個瀏覽器，不會送到伺服器。</p>
        <CheckList
          items={TAIWAN_CHECKS}
          values={store.taiwanChecks}
          onToggle={(item) => toggleCheck("taiwanChecks", item)}
        />
      </article>

      <article className={`card-dark learn-card ${styles.confirm}`} id="step-6">
        <p className="kicker">STEP 6</p>
        <h2>付款前最後確認</h2>
        <p>把訂單頁再對一次。全部勾完也不代表本站替這筆交易背書，只是幫你降低看漏欄位的機會。</p>
        <CheckList
          items={PAYMENT_CHECKS}
          values={store.paymentChecks}
          onToggle={(item) => toggleCheck("paymentChecks", item)}
        />
      </article>

      <article className="card-dark learn-card" id="step-7">
        <p className="kicker">STEP 7</p>
        <h2>收到商品後</h2>
        <ul>
          <li>全程錄影開箱</li>
          <li>核對鞋盒、鞋舌與鞋內尺寸標示</li>
          <li>檢查左右腳型號、尺寸及寬度</li>
          <li>未確認合腳前不要磨刀、熱塑或安裝不可逆配件</li>
          <li>保留鞋盒、標籤、包裝與付款文件</li>
          <li>發現錯誤立即拍照並聯絡商店</li>
          <li>保存訂單、付款、物流與客服往來紀錄</li>
        </ul>
      </article>
    </div>
  );
}
