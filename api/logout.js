import { clearCookie } from '../lib/auth.js';
import { send } from '../lib/http.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'method' });
  return send(res, 200, { ok: true }, { 'Set-Cookie': clearCookie() });
}
