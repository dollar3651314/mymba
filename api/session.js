import { redisConfigured } from '../lib/redis.js';
import { isAuthed, getAuthState } from '../lib/auth.js';
import { send } from '../lib/http.js';

export default async function handler(req, res) {
  if (!redisConfigured()) return send(res, 503, { error: 'storage', message: '服务器存储还没配置' });
  try {
    if (!(await isAuthed(req.headers.cookie))) return send(res, 401, { error: 'auth' });
    const { auth } = await getAuthState();
    return send(res, 200, { ok: true, defaultPassword: !auth });
  } catch (e) {
    console.error(e);
    return send(res, 500, { error: 'server' });
  }
}
