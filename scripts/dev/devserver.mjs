// 模拟 Vercel：先跑 middleware，/api/* 交给函数，其余静态文件
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root = process.argv[2];
process.chdir(root);
const mw = (await import(path.join(root, 'middleware.js')));
const re = new RegExp('^' + mw.config.matcher[0].replace('/((?!', '/(?!').replace(').*)', ').*') + '$');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.md': 'text/markdown', '.webmanifest': 'application/manifest+json', '.json': 'application/json' };
http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://localhost:8765');
  if (re.test(u.pathname)) {
    const r = await mw.default(new Request(u, { headers: req.headers }));
    if (r.headers.get('x-middleware-next') !== '1') {
      res.writeHead(r.status, Object.fromEntries(r.headers)); return res.end(await r.text());
    }
  }
  if (u.pathname.startsWith('/api/')) {
    const mod = await import(path.join(root, u.pathname + '.js'));
    return mod.default(req, res);
  }
  let f = path.join(root, u.pathname === '/' ? 'index.html' : u.pathname);
  if (!fs.existsSync(f)) { res.statusCode = 404; return res.end('nf'); }
  res.setHeader('Content-Type', types[path.extname(f)] || 'application/octet-stream');
  res.end(fs.readFileSync(f));
}).listen(8765);
console.log('matcher', re);
