// Cloudflare Pages 构建：只把要发布的文件复制到 dist/（录音原文、说明文件、服务端代码都不发布）。
// Cloudflare 项目设置：Build command = node scripts/build-pages.mjs，Build output directory = dist
import { cpSync, mkdirSync, rmSync, readdirSync, writeFileSync } from 'node:fs';
import './build-practice.mjs'; // 先重新生成跟读练习数据

const OUT = 'dist';
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT);
const files = ['index.html', 'login.html', 'manifest.webmanifest', ...readdirSync('.').filter(f => /^icon/.test(f))];
for (const f of files) cpSync(f, `${OUT}/${f}`);
for (const d of ['assets', 'data', 'audio']) cpSync(d, `${OUT}/${d}`, { recursive: true });
cpSync('content', `${OUT}/content`, { recursive: true, filter: src => !/\/_[^/]*\.md$/.test(src) });
mkdirSync(`${OUT}/docs`);
cpSync('docs/progress.md', `${OUT}/docs/progress.md`);
// 录音文件名是内容哈希，可以长期缓存
writeFileSync(`${OUT}/_headers`, '/audio/*\n  Cache-Control: public, max-age=31536000, immutable\n');
console.log('built', OUT);
