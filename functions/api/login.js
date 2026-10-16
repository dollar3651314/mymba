import { redis, redisConfigured } from '../../lib/redis.js';
import { getAuthState, checkPassword, makeToken, sessionCookie, savePassword } from '../../lib/auth.js';
import { errHint, json, readJson, clientIp } from '../../lib/cf.js';

const MAX_FAILS = 10;     // 15 分钟内同一 IP 最多失败 10 次
const WINDOW = 15 * 60;

export async function onRequestPost({ request }) {
  if (!redisConfigured()) return json(503, { error: 'storage', message: '服务器存储还没配置：请在 Cloudflare Pages 项目里添加 KV_REST_API_URL 和 KV_REST_API_TOKEN 并重新部署。' });
  try {
    const failKey = 'mba:fail:' + clientIp(request);
    const fails = Number(await redis('GET', failKey)) || 0;
    if (fails >= MAX_FAILS) return json(429, { error: 'locked', message: '尝试次数过多，请 15 分钟后再试。' });

    const { password } = await readJson(request);
    let { secret, auth } = await getAuthState(true);
    if (!checkPassword(String(password || ''), auth)) {
      await redis('INCR', failKey);
      await redis('EXPIRE', failKey, WINDOW);
      return json(401, { error: 'wrong', message: '密码不对' });
    }
    await redis('DEL', failKey);
    // 旧版 scrypt 哈希：登录成功后换成 PBKDF2（版本号不变，其他设备不用重新登录）
    if (auth && auth.alg !== 'pbkdf2') auth = await savePassword(String(password), true);
    return json(200, { ok: true, defaultPassword: !auth }, { 'Set-Cookie': sessionCookie(makeToken(secret, auth?.ver || 0)) });
  } catch (e) {
    console.error(e);
    return json(e.status || 500, { error: 'server', message: '服务器出错，请稍后再试。', hint: errHint(e) });
  }
}
