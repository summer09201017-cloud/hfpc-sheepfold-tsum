# sheepfold-tsum

零相依、零美術檔、可離線(PWA)。語音重烤 `node scripts/gen-tts.mjs`。

## 部署(Cloudflare Workers 靜態資產)

```bash
npx wrangler deploy --name hfpc-sheepfold-tsum --compatibility-date 2026-07-01 --assets .
```

線上:https://hfpc-sheepfold-tsum.summer09201017.workers.dev —— 改版時 `sw.js` 的 `CACHE_NAME` +1。

⚠ SW 快取名單**不可**放 `./index.html`(2026-09-14 全艦隊修,v20):Cloudflare 把 `/index.html` 308 轉到 `/`,
快取到的是 redirected 回應,裝成 App 打開會 ERR_FAILED。名單只留 `./`、fetch 尾巴加了「導覽離線退回 `./`」;每次 bump 都別再加回去。
補丁來源:skills repo `static-pwa-ship/patches/patch-sw-index.mjs`(`--cf --write`)。
