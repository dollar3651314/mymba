// Upstash Redis REST 客户端（无依赖）
// 连接同一个数据库到多个项目时，Vercel 可能加自定义前缀（如 MBA_REST_API_URL），
// 所以找任何以 REST_API_URL / REDIS_REST_URL 结尾的变量，再取同前缀的 TOKEN。
function findCreds() {
  const env = process.env;
  const fixed = [['KV_REST_API_URL', 'KV_REST_API_TOKEN'], ['UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN']];
  for (const [u, t] of fixed) if (env[u] && env[t]) return { url: env[u], token: env[t] };
  for (const k of Object.keys(env)) {
    const m = k.match(/^(.*)(REST_API_URL|REDIS_REST_URL)$/);
    if (!m || !env[k]) continue;
    const t = env[m[1] + m[2].replace('URL', 'TOKEN')];
    if (t) return { url: env[k], token: t };
  }
  return { url: '', token: '' };
}
const URL_ = () => findCreds().url.replace(/\/$/, '');
const TOKEN = () => findCreds().token;

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
