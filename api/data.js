// 学习数据：Redis 哈希 mba:data，字段名 = 前端存储键，值 = JSON 字符串
import { redis, pipeline } from '../lib/redis.js';
import { isAuthed } from '../lib/auth.js';
import { send, readBody } from '../lib/http.js';

const KEY = 'mba:data';
const KEY_RE = /^[\w:.-]{1,200}$/;

export default async function handler(req, res) {
  try {
    if (!(await isAuthed(req.headers.cookie))) return send(res, 401, { error: 'auth' });

    if (req.method === 'GET') {
      const flat = (await redis('HGETALL', KEY)) || [];
      const items = {};
      for (let i = 0; i < flat.length; i += 2) {
        try { items[flat[i]] = JSON.parse(flat[i + 1]); } catch { /* 跳过损坏的值 */ }
      }
      return send(res, 200, { items });
    }

    if (req.method === 'POST') {
      const { set = {}, del = [] } = await readBody(req);
      const keys = [...Object.keys(set), ...del];
      if (keys.some(k => !KEY_RE.test(k))) return send(res, 400, { error: 'key' });
      const cmds = [];
      const pairs = Object.entries(set).flatMap(([k, v]) => [k, JSON.stringify(v)]);
      if (pairs.length) cmds.push(['HSET', KEY, ...pairs]);
      if (del.length) cmds.push(['HDEL', KEY, ...del]);
      await pipeline(cmds);
      return send(res, 200, { ok: true });
    }

    if (req.method === 'DELETE') {
      await redis('DEL', KEY);
      return send(res, 200, { ok: true });
    }

    return send(res, 405, { error: 'method' });
  } catch (e) {
    console.error(e);
    return send(res, e.status || 500, { error: 'server' });
  }
}
