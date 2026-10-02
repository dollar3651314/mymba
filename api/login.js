import { redis, redisConfigured } from '../lib/redis.js';
import { getAuthState, checkPassword, makeToken, sessionCookie } from '../lib/auth.js';
import { send, readBody, clientIp } from '../lib/http.js';

const MAX_FAILS = 10;     // 15 分钟内同一 IP 最多失败 10 次
const WINDOW = 15 * 60;

export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'method' });
  if (!redisConfigured()) return send(res, 503, { error: 'storage', message: '服务器存储还没配置：请在 Vercel 项目里添加 Upstash Redis 并重新部署。' });
  try {
    const failKey = 'mba:fail:' + clientIp(req);
    const fails = Number(await redis('GET', failKey)) || 0;
    if (fails >= MAX_FAILS) return send(res, 429, { error: 'locked', message: '尝试次数过多，请 15 分钟后再试。' });

    const { password } = await readBody(req);
    const { secret, auth } = await getAuthState(true);
    if (!checkPassword(String(password || ''), auth)) {
      await redis('INCR', failKey);
      await redis('EXPIRE', failKey, WINDOW);
      return send(res, 401, { error: 'wrong', message: '密码不对' });
    }
    await redis('DEL', failKey);
    return send(res, 200, { ok: true, defaultPassword: !auth }, { 'Set-Cookie': sessionCookie(makeToken(secret, auth?.ver || 0)) });
  } catch (e) {
    console.error(e);
    return send(res, e.status || 500, { error: 'server', message: '服务器出错，请稍后再试。' });
  }
}
