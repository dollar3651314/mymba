// 登录与会话：密码加盐哈希保存在 Redis（新密码用 PBKDF2，旧的 scrypt 仍可验证）；会话 cookie 用 HMAC 签名。
// 同时运行在 Vercel（Node）和 Cloudflare Pages Functions（nodejs_compat）。
import crypto from 'node:crypto';
import { Buffer } from 'node:buffer';
import { redis, pipeline, redisConfigured } from './redis.js';

export const DEFAULT_PASSWORD = '123456';
export const COOKIE = 'mba_session';
const K_AUTH = 'mba:auth';
const K_SECRET = 'mba:secret';
const SESSION_DAYS = 30;

const b64url = buf => Buffer.from(buf).toString('base64url');
const sign = (secret, payload) => b64url(crypto.createHmac('sha256', secret).update(payload).digest());

// 读取签名密钥和当前密码版本；首次使用时生成密钥
let cache = { at: 0, secret: '', auth: null };
export async function getAuthState(fresh = false) {
  if (!fresh && Date.now() - cache.at < 30000 && cache.secret) return cache;
  let [secret, auth] = await pipeline([['GET', K_SECRET], ['GET', K_AUTH]]);
  if (!secret) {
    await redis('SET', K_SECRET, crypto.randomBytes(32).toString('hex'), 'NX');
    secret = await redis('GET', K_SECRET);
  }
  cache = { at: Date.now(), secret, auth: auth ? JSON.parse(auth) : null };
  return cache;
}

// Cloudflare 免费版每次请求只有约 10 ms CPU，scrypt 太重，所以新密码改用 PBKDF2（迭代次数适中）。
const PBKDF2_ITER = 20000;
export function hashPassword(pw, salt = crypto.randomBytes(16).toString('hex')) {
  return { alg: 'pbkdf2', iter: PBKDF2_ITER, salt, hash: crypto.pbkdf2Sync(pw, salt, PBKDF2_ITER, 32, 'sha256').toString('hex') };
}

export function checkPassword(pw, auth) {
  if (!auth) return pw === DEFAULT_PASSWORD;
  const h = auth.alg === 'pbkdf2'
    ? crypto.pbkdf2Sync(String(pw), auth.salt, auth.iter || PBKDF2_ITER, 32, 'sha256')
    : crypto.scryptSync(String(pw), auth.salt, 32);
  const expected = Buffer.from(auth.hash, 'hex');
  return h.length === expected.length && crypto.timingSafeEqual(h, expected);
}

export function makeToken(secret, ver) {
  const exp = Date.now() + SESSION_DAYS * 86400000;
  const payload = `${ver}.${exp}`;
  return `${payload}.${sign(secret, payload)}`;
}

export function verifyToken(token, secret, ver) {
  if (!token || !secret) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const [v, exp, sig] = parts;
  if (Number(v) !== ver || Number(exp) < Date.now()) return false;
  const a = Buffer.from(sig), b = Buffer.from(sign(secret, `${v}.${exp}`));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function readCookie(header, name = COOKIE) {
  for (const part of String(header || '').split(/;\s*/)) {
    const i = part.indexOf('=');
    if (i > 0 && part.slice(0, i) === name) return decodeURIComponent(part.slice(i + 1));
  }
  return '';
}

export function sessionCookie(token) {
  return `${COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_DAYS * 86400}`;
}
export const clearCookie = () => `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;

export async function isAuthed(cookieHeader) {
  if (!redisConfigured()) return false;
  const { secret, auth } = await getAuthState();
  return verifyToken(readCookie(cookieHeader), secret, auth?.ver || 0);
}

export async function savePassword(pw, keepVersion = false) {
  const { auth } = await getAuthState(true);
  const next = { ...hashPassword(pw), ver: keepVersion ? (auth?.ver || 0) : (auth?.ver || 0) + 1 };
  await redis('SET', K_AUTH, JSON.stringify(next));
  cache.at = 0;
  return next;
}
