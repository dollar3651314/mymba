// Upstash Redis REST 客户端（无依赖）。兼容 Vercel Marketplace 注入的各种变量名。
function findEnv(suffixes) {
  for (const s of suffixes) if (process.env[s]) return process.env[s];
  for (const [k, v] of Object.entries(process.env)) if (v && suffixes.some(s => k.endsWith('_' + s))) return v;
  return '';
}
const URL_ = () => findEnv(['KV_REST_API_URL', 'UPSTASH_REDIS_REST_URL']).replace(/\/$/, '');
const TOKEN = () => findEnv(['KV_REST_API_TOKEN', 'UPSTASH_REDIS_REST_TOKEN']);

export const redisConfigured = () => Boolean(URL_() && TOKEN());

export async function redis(...cmd) {
  const r = await fetch(URL_(), {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmd),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || j.error) throw new Error('redis: ' + (j.error || r.status));
  return j.result;
}

export async function pipeline(cmds) {
  if (!cmds.length) return [];
  const r = await fetch(URL_() + '/pipeline', {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmds),
  });
  const j = await r.json().catch(() => null);
  if (!r.ok || !Array.isArray(j)) throw new Error('redis pipeline: ' + r.status);
  const err = j.find(x => x.error);
  if (err) throw new Error('redis: ' + err.error);
  return j.map(x => x.result);
}
