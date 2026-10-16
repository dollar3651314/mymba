import { clearCookie } from '../../lib/auth.js';
import { json } from '../../lib/cf.js';

export const onRequestPost = () => json(200, { ok: true }, { 'Set-Cookie': clearCookie() });
