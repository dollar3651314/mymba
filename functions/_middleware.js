// Cloudflare Pages：访问任何页面前先检查登录；未登录跳转到登录页。/api 由各接口自己校验。
// （对应 Vercel 版的 middleware.js）
import { isAuthed } from '../lib/auth.js';

const PUBLIC = /^\/(api\/|login(\.html)?$|assets\/style\.css$|icon|manifest\.webmanifest$|favicon)/;

export async function onRequest(context) {
  globalThis.__MBA_ENV = context.env;
  const { request } = context;
  const path = new URL(request.url).pathname;
  if (PUBLIC.test(path)) return context.next();
  let ok = false;
  try { ok = await isAuthed(request.headers.get('Cookie')); } catch (e) { console.error(e); }
  if (ok) {
    const res = await context.next();
    // 登录后才能看的内容不要被共享缓存
    const out = new Response(res.body, res);
    out.headers.set('Cache-Control', 'private, no-cache');
    return out;
  }
  const accept = request.headers.get('Accept') || '';
  if (accept.includes('text/html')) {
    return new Response(null, { status: 302, headers: { Location: '/login', 'Cache-Control': 'no-store' } });
  }
  return new Response('Unauthorized', { status: 401, headers: { 'Cache-Control': 'no-store' } });
}
