# 本地测试

模拟 Vercel（middleware + /api 函数 + 静态文件）和 Upstash Redis，不需要联网和 Vercel 账号。

```bash
node scripts/dev/fakeredis.mjs &                     # 端口 8790，内存数据，重启即清空
KV_REST_API_URL=http://localhost:8790 KV_REST_API_TOKEN=tok \
  node scripts/dev/devserver.mjs "$PWD" &            # http://localhost:8765，默认密码 123456
```

用 Playwright（`NODE_PATH=$(npm root -g)`）以 390×844 手机尺寸检查页面：无 pageerror、`document.documentElement.scrollWidth` 不超过 390、页面文字里没有 undefined / NaN。

**注意：测试环境连不上 jsdelivr**，页面里的 marked（Markdown 渲染）加载不了，预习包、笔记会退化成 `<pre>` 纯文本，表格问题就看不出来。测试 Markdown 页面时先下载 marked，再用 Playwright 拦截 CDN 请求换成本地文件：

```bash
cd /tmp && npm pack marked@12.0.2 && tar xzf marked-12.0.2.tgz   # 得到 /tmp/package/marked.min.js
```
```js
await page.route('**/marked.min.js', r => r.fulfill({ body: fs.readFileSync('/tmp/package/marked.min.js'), contentType: 'application/javascript' }));
```
检查时另外看一下 `.md td` 有没有宽度小于 80px 的格子（表格被挤扁）。

## Cloudflare Pages 本地测试（2026-10-16 起现用）

```bash
npm i wrangler@4            # 装在 scratchpad 里即可
node scripts/build-pages.mjs
node scripts/dev/fakeredis.mjs &
CI=1 npx wrangler pages dev dist --port 8788 \
  --binding KV_REST_API_URL=http://127.0.0.1:8790 --binding KV_REST_API_TOKEN=tok &
```
登录页是 `/login`（Cloudflare 会把 `/login.html` 跳转到 `/login`）。停服务：`pkill -f "[w]rangler pages dev"; pkill -f "[w]orkerd"`（单独一条命令）。测完删掉 `dist/` 和 `.wrangler/`。
