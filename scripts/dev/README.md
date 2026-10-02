# 本地测试

模拟 Vercel（middleware + /api 函数 + 静态文件）和 Upstash Redis，不需要联网和 Vercel 账号。

```bash
node scripts/dev/fakeredis.mjs &                     # 端口 8790，内存数据，重启即清空
KV_REST_API_URL=http://localhost:8790 KV_REST_API_TOKEN=tok \
  node scripts/dev/devserver.mjs "$PWD" &            # http://localhost:8765，默认密码 123456
```

用 Playwright（`NODE_PATH=$(npm root -g)`）以 390×844 手机尺寸检查页面：无 pageerror、`document.documentElement.scrollWidth` 不超过 390、页面文字里没有 undefined / NaN。
