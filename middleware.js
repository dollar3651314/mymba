// 访问网站任何页面前先检查登录；未登录跳转到登录页。/api 由各接口自己校验。
import { next } from '@vercel/functions';
import { isAuthed } from './lib/auth.js';

export const config = {
  runtime: 'nodejs',
  matcher: ['/((?!api/|login\\.html|assets/style\\.css|icon|manifest\\.webmanifest|favicon).*)'],
};

export default async function middleware(request) {
  let ok = false;
  try { ok = await isAuthed(request.headers.get('cookie')); } catch (e) { console.error(e); }
  if (ok) return next();
  const accept = request.headers.get('accept') || '';
  if (accept.includes('text/html')) {
    return new Response(null, { status: 302, headers: { Location: '/login.html', 'Cache-Control': 'no-store' } });
  }
  return new Response('Unauthorized', { status: 401, headers: { 'Cache-Control': 'no-store' } });
}
