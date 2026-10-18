// 生成跟读练习数据 data/practice.js：从各预习包里抽出
//   “可以在课上说的英文”“想问老师的问题”（格式：- "English" —— 中文）和“必会术语（中英）”表格。
// 预习包改动后运行：node scripts/build-practice.mjs（build-pages.mjs 也会自动运行）
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';

const items = [];
for (const mod of readdirSync('content').filter(d => !d.startsWith('_') && !d.includes('.')).sort()) {
  for (const f of readdirSync(`content/${mod}`).filter(f => /^week-\d+-pre\.md$/.test(f)).sort()) {
    const w = Number(f.match(/\d+/)[0]);
    let sec = '';
    for (const line of readFileSync(`content/${mod}/${f}`, 'utf8').split('\n')) {
      if (line.startsWith('## ')) {
        sec = line.startsWith('## 可以在课上说的英文') ? 'say' : line.startsWith('## 想问老师的问题') ? 'ask' : line.startsWith('## 必会术语') ? 'term' : '';
        continue;
      }
      if ((sec === 'say' || sec === 'ask') && line.startsWith('- ')) {
        const cut = line.search(/["”]\s*——\s/);
        const left = cut < 0 ? line : line.slice(0, cut + 1), zh = cut < 0 ? '' : line.slice(cut + 1).replace(/^\s*——\s*/, '');
        const mt = left.match(/^- (.*?)["“]([^"“”]+)["”]\s*$/);
        if (!mt) continue;
        items.push({ m: mod, w, k: sec, en: mt[2].trim(), zh: zh.trim(), x: mt[1].replace(/\*\*/g, '').trim() });
      }
      if (sec === 'term' && line.startsWith('|') && !/^\|\s*(英文|---)/.test(line)) {
        const c = line.split('|').slice(1, -1).map(s => s.trim().replace(/\*\*/g, ''));
        if (c.length >= 2 && /[A-Za-z]/.test(c[0])) items.push({ m: mod, w, k: 'term', en: c[0], zh: c[1], x: c[2] || '' });
      }
    }
  }
}
writeFileSync('data/practice.js', `// 自动生成（scripts/build-practice.mjs），不要手改\nMBA.practice = ${JSON.stringify(items)};\n`);
console.log('practice items', items.length, Object.fromEntries(['say', 'ask', 'term'].map(k => [k, items.filter(i => i.k === k).length])), 'missing zh', items.filter(i => !i.zh).length);
