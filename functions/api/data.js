// 学习数据：Redis 哈希 mba:data，字段名 = 前端存储键，值 = JSON 字符串（对应 Vercel 版的 api/data.js）
import { redis, pipeline } from '../../lib/redis.js';
import { isAuthed } from '../../lib/auth.js';
import { json, readJson } from '../../lib/cf.js';

const KEY = 'mba:data';
const KEY_RE = /^[\w:.-]{1,200}$/;

export async function onRequest({ request }) {
  try {
    if (!(await isAuthed(request.headers.get('Cookie')))) return json(401, { error: 'auth' });

    if (request.method === 'GET') {
      const flat = (await redis('HGETALL', KEY)) || [];
      const items = {};
      for (let i = 0; i < flat.length; i += 2) {
        try { items[flat[i]] = JSON.parse(flat[i + 1]); } catch { /* 跳过损坏的值 */ }
      }
      return json(200, { items });
    }

    if (request.method === 'POST') {
      const { set = {}, del = [] } = await readJson(request);
      const keys = [...Object.keys(set), ...del];
      if (keys.some(k => !KEY_RE.test(k))) return json(400, { error: 'key' });
      const cmds = [];
      const pairs = Object.entries(set).flatMap(([k, v]) => [k, JSON.stringify(v)]);
      if (pairs.length) cmds.push(['HSET', KEY, ...pairs]);
      if (del.length) cmds.push(['HDEL', KEY, ...del]);
      await pipeline(cmds);
      return json(200, { ok: true });
    }

    if (request.method === 'DELETE') {
      await redis('DEL', KEY);
      return json(200, { ok: true });
    }

    return json(405, { error: 'method' });
  } catch (e) {
    console.error(e);
    return json(e.status || 500, { error: 'server' });
  }
}
