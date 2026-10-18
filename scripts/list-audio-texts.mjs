// 列出跟读练习要朗读的所有英文（去重），给 scripts/build-audio.py 用
import vm from 'node:vm'; import { readFileSync } from 'node:fs';
const ctx = { MBA: {} }; vm.createContext(ctx);
for (const f of ['data/glossary.js', 'data/practice.js']) vm.runInContext(readFileSync(f, 'utf8'), ctx);
const M = ctx.MBA, set = new Set();
(M.practice || []).forEach(x => set.add(x.en));
(M.glossary || []).forEach(g => set.add(g.en));
(M.phrases || []).forEach(g => g.items.forEach(p => set.add(p.en)));
process.stdout.write(JSON.stringify([...set]));
