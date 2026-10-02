// 每日更新用：按课表列出今天要处理的事。用法：node scripts/status.mjs [YYYY-MM-DD]
// 时间按新加坡时间（UTC+8）判断；不传日期就用当前时间。
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import vm from 'node:vm';

const root = new URL('..', import.meta.url).pathname;
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(readFileSync(root + 'data/program.js', 'utf8'), ctx);
ctx.MBA = ctx.window.MBA;
for (const f of readdirSync(root + 'data/modules').filter(f => f.endsWith('.js')).sort())
  vm.runInContext(readFileSync(root + 'data/modules/' + f, 'utf8'), ctx);
const M = ctx.MBA;

const arg = process.argv[2];
const now = arg ? new Date(arg + 'T23:59:00+08:00') : new Date();
const sg = d => new Date(d.getTime() + 8 * 3600e3).toISOString().slice(0, 10);
const today = sg(now);
const at = (d, hm) => new Date(`${d}T${hm}:00+08:00`);
const endOf = x => at(x.d, (x.t.split('–')[1] || '23:59').trim());
const addDays = (d, n) => sg(new Date(at(d, '12:00').getTime() + n * 864e5));
const wk = d => '日一二三四五六'[at(d, '12:00').getUTCDay()];
const pad = n => String(n).padStart(2, '0');

const all = M.modules.flatMap(m => (m.sessions || []).map(x => ({ m, x, w: m.weeks.find(w => w.n === x.n) || {} })))
  .sort((a, b) => (a.x.d + a.x.t).localeCompare(b.x.d + b.x.t));
const line = ({ m, x, w }) => `  ${x.d}(${wk(x.d)}) ${x.t}  ${m.code} 第${x.n}次 ${w.zh || ''}`;

console.log(`今天 ${today}（周${wk(today)}）\n`);

const held = all.filter(o => endOf(o.x) <= now);
const rec = held.filter(o => !o.w.rec);
console.log(`① 已上完、还没收到录音（${rec.length}）`); rec.forEach(o => console.log(line(o)));

const notes = held.filter(o => o.w.rec && !existsSync(`${root}content/${o.m.id}/week-${pad(o.x.n)}.md`));
console.log(`\n② 收到录音但还没写笔记（${notes.length}）`); notes.forEach(o => console.log(line(o)));

const soon = all.filter(o => endOf(o.x) > now && o.x.d <= addDays(today, 7));
const noPre = soon.filter(o => !o.w.pre);
console.log(`\n③ 7 天内要上、还没有预习包（${noPre.length}）——提醒用户下载课件`); noPre.forEach(o => console.log(line(o)));
console.log(`\n   7 天内全部课程（${soon.length}）`); soon.forEach(o => console.log(line(o) + (o.w.pre ? '  ✓预习包' : '')));

const nextWeek = all.filter(o => o.x.d > addDays(today, 7) && o.x.d <= addDays(today, 14) && !o.w.pre);
console.log(`\n④ 8–14 天后的课（可以提前让用户下载）（${nextWeek.length}）`); nextWeek.forEach(o => console.log(line(o)));

const items = M.modules.flatMap(m => [
  ...(m.todos || []).map(t => ({ d: t.d, t: `[待办] ${m.code}：${t.t}` })),
  ...(m.assessments || []).flatMap(a => [
    ...(a.milestones || []).map(t => ({ d: t.d, t: `[里程碑] ${m.code} ${a.zh}：${t.t}` })),
    { d: a.due, t: `[截止${a.tbc ? '·待确认' : ''}] ${m.code} ${a.zh}（${a.weight}%）` },
  ]),
]).sort((a, b) => a.d.localeCompare(b.d));
const overdue = items.filter(i => i.d < today && i.t.startsWith('[待办]'));
console.log(`\n⑤ 已过期的待办（${overdue.length}）——问用户是否完成，完成的删掉或改日期`); overdue.forEach(i => console.log(`  ${i.d} ${i.t}`));
const upcoming = items.filter(i => i.d >= today && i.d <= addDays(today, 14));
console.log(`\n⑥ 14 天内的待办 / 里程碑 / 截止（${upcoming.length}）`); upcoming.forEach(i => console.log(`  ${i.d}(${wk(i.d)}) ${i.t}`));
