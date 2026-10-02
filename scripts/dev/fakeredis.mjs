// 最小 Upstash REST 模拟
import http from 'node:http';
const kv = new Map(), hashes = new Map();
function run([c, ...a]) {
  c = c.toUpperCase();
  switch (c) {
    case 'GET': return kv.get(a[0]) ?? null;
    case 'SET': if (a[2] === 'NX' && kv.has(a[0])) return null; kv.set(a[0], a[1]); return 'OK';
    case 'DEL': { let n = 0; for (const k of a) { n += kv.delete(k) | hashes.delete(k); } return n; }
    case 'INCR': { const v = Number(kv.get(a[0]) || 0) + 1; kv.set(a[0], String(v)); return v; }
    case 'EXPIRE': return 1;
    case 'HSET': { const h = hashes.get(a[0]) || new Map(); for (let i = 1; i < a.length; i += 2) h.set(a[i], a[i + 1]); hashes.set(a[0], h); return 1; }
    case 'HDEL': { const h = hashes.get(a[0]); let n = 0; for (const k of a.slice(1)) n += h?.delete(k) ? 1 : 0; return n; }
    case 'HGETALL': return [...(hashes.get(a[0]) || new Map())].flat();
    default: throw new Error('unsupported ' + c);
  }
}
http.createServer((req, res) => {
  let b = ''; req.on('data', d => b += d); req.on('end', () => {
    if (req.headers.authorization !== 'Bearer tok') { res.statusCode = 401; return res.end('{"error":"unauthorized"}'); }
    const body = JSON.parse(b);
    try {
      const out = req.url === '/pipeline' ? body.map(c => ({ result: run(c) })) : { result: run(body) };
      res.end(JSON.stringify(out));
    } catch (e) { res.statusCode = 400; res.end(JSON.stringify({ error: e.message })); }
  });
}).listen(8790);
