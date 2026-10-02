// Node (req, res) 小工具：不依赖 Vercel 的 res.json 等扩展
export function send(res, status, data, headers = {}) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  for (const [k, v] of Object.entries(headers)) res.setHeader(k, v);
  res.end(JSON.stringify(data));
}

export async function readBody(req, limit = 2_000_000) {
  if (req.body !== undefined && req.body !== null && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) return req.body;
  let raw = '';
  if (typeof req.body === 'string') raw = req.body;
  else if (Buffer.isBuffer(req.body)) raw = req.body.toString('utf8');
  else {
    for await (const chunk of req) { raw += chunk; if (raw.length > limit) throw Object.assign(new Error('too large'), { status: 413 }); }
  }
  if (raw.length > limit) throw Object.assign(new Error('too large'), { status: 413 });
  try { return raw ? JSON.parse(raw) : {}; } catch { throw Object.assign(new Error('bad json'), { status: 400 }); }
}

export const clientIp = req => String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
