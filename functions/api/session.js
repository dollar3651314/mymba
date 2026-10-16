import { redisConfigured } from '../../lib/redis.js';
import { isAuthed, getAuthState } from '../../lib/auth.js';
import { errHint, json } from '../../lib/cf.js';

export async function onRequestGet({ request }) {
  if (!redisConfigured()) return json(503, { error: 'storage', message: '服务器存储还没配置' });
  try {
    if (!(await isAuthed(request.headers.get('Cookie')))) return json(401, { error: 'auth' });
    const { auth } = await getAuthState();
    return json(200, { ok: true, defaultPassword: !auth });
  } catch (e) {
    console.error(e);
    return json(500, { error: 'server', hint: errHint(e) });
  }
}
