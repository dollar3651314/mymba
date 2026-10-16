// Cloudflare Pages Functions 用的小工具（Request / Response 风格），对应 Vercel 版的 lib/http.js。
export function json(status, data, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers },
  });
}

export async function readJson(request, limit = 2_000_000) {
  const raw = await request.text();
  if (raw.length > limit) throw Object.assign(new Error('too large'), { status: 413 });
  try { return raw ? JSON.parse(raw) : {}; } catch { throw Object.assign(new Error('bad json'), { status: 400 }); }
}

export const clientIp = request => request.headers.get('CF-Connecting-IP') || (request.headers.get('X-Forwarded-For') || 'unknown').split(',')[0].trim();

// 出错时给一个不含密钥的简短原因，方便排查（网址和长字符串都打码）
export const errHint = e => String(e && e.message || e).replace(/[a-z]+:\/\/\S+/gi, '<url>').replace(/[A-Za-z0-9_\-]{24,}/g, '<…>').slice(0, 160);
