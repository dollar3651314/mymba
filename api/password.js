import { isAuthed, getAuthState, checkPassword, savePassword, makeToken, sessionCookie } from '../lib/auth.js';
import { send, readBody } from '../lib/http.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'method' });
  try {
    if (!(await isAuthed(req.headers.cookie))) return send(res, 401, { error: 'auth' });
    const { current, next } = await readBody(req);
    const { auth } = await getAuthState(true);
    if (!checkPassword(String(current || ''), auth)) return send(res, 400, { error: 'wrong', message: '当前密码不对' });
    if (typeof next !== 'string' || next.length < 6) return send(res, 400, { error: 'short', message: '新密码至少 6 位' });
    const saved = await savePassword(next);
    const { secret } = await getAuthState(true);
    // 版本号 +1：其他设备的登录失效，当前设备换发新 cookie
    return send(res, 200, { ok: true }, { 'Set-Cookie': sessionCookie(makeToken(secret, saved.ver)) });
  } catch (e) {
    console.error(e);
    return send(res, e.status || 500, { error: 'server', message: '服务器出错，请稍后再试。' });
  }
}
