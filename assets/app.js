(() => {
  'use strict';
  const M = window.MBA;
  const $app = document.getElementById('app');
  const DAY = 86400000;

  // ---------- 数据存储：服务器为准，内存缓存 + 批量同步 ----------
  // theme 是每台设备自己的偏好，只存在本机
  const local = {
    get(k, d) { try { const v = localStorage.getItem('mba:' + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem('mba:' + k, JSON.stringify(v)); } catch {} },
  };
  let state = {};
  const pending = { set: {}, del: new Set() };
  let flushTimer = null, flushing = false, syncState = 'ok';
  function setSync(s) {
    syncState = s;
    const el = document.getElementById('sync');
    if (el) el.textContent = { ok: '', saving: '保存中…', error: '⚠ 未保存，点此重试' }[s];
  }
  function schedule() { clearTimeout(flushTimer); setSync('saving'); flushTimer = setTimeout(flush, 400); }
  async function flush() {
    if (flushing) { schedule(); return; }
    const body = { set: pending.set, del: [...pending.del] };
    if (!Object.keys(body.set).length && !body.del.length) { setSync('ok'); return; }
    pending.set = {}; pending.del = new Set();
    flushing = true;
    try {
      const r = await api('/api/data', { method: 'POST', body });
      if (!r.ok) throw new Error(r.status);
      setSync(Object.keys(pending.set).length || pending.del.size ? 'saving' : 'ok');
    } catch {
      // 失败的改动放回队列（不覆盖期间的新改动）
      for (const [k, v] of Object.entries(body.set)) if (!(k in pending.set) && !pending.del.has(k)) pending.set[k] = v;
      for (const k of body.del) if (!(k in pending.set)) pending.del.add(k);
      setSync('error');
    } finally { flushing = false; }
  }
  const store = {
    get(k, d) { return k === 'theme' ? local.get(k, d) : (k in state ? state[k] : d); },
    set(k, v) {
      if (k === 'theme') return local.set(k, v);
      state[k] = v; pending.set[k] = v; pending.del.delete(k); schedule();
    },
    del(k) { delete state[k]; delete pending.set[k]; pending.del.add(k); schedule(); },
    keys() { return Object.keys(state); },
  };
  async function api(url, { method = 'GET', body } = {}) {
    const r = await fetch(url, { method, credentials: 'same-origin', headers: body ? { 'Content-Type': 'application/json' } : {}, body: body ? JSON.stringify(body) : undefined });
    if (r.status === 401) { location.replace('/login.html'); throw new Error('auth'); }
    return r;
  }
  async function loadState() {
    const r = await api('/api/data');
    if (!r.ok) throw new Error(r.status);
    state = (await r.json()).items || {};
  }
  // 第一版把数据存在浏览器里；服务器还没有数据时，自动上传本机旧数据
  function migrateLocal() {
    if (Object.keys(state).length || local.get('migrated', false)) return;
    local.set('migrated', true);
    try {
      const old = Object.keys(localStorage).filter(k => k.startsWith('mba:') && k !== 'mba:theme');
      if (!old.length) return;
      for (const k of old) { try { store.set(k.slice(4), JSON.parse(localStorage.getItem(k))); } catch {} }
      toast('已把本机原有的笔记和进度上传到服务器');
    } catch {}
  }

  // ---------- 工具函数 ----------
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const parseDate = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const today = () => { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); };
  const daysUntil = s => Math.round((parseDate(s) - today()) / DAY);
  const fmt = s => { const d = parseDate(s); return `${d.getMonth() + 1}月${d.getDate()}日`; };
  const wk = s => '周' + '日一二三四五六'[parseDate(s).getDay()];
  const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const dueLabel = n => n < 0 ? `已过 ${-n} 天` : n === 0 ? '今天' : n === 1 ? '明天' : `还有 ${n} 天`;
  const duePill = n => `<span class="pill ${n < 0 ? '' : n <= 3 ? 'danger' : n <= 14 ? 'warn' : 'accent'}">${dueLabel(n)}</span>`;
  const mod = id => M.modules.find(m => m.id === id);
  const lenLabel = a => a.length || `${a.words} 词`;
  // 我的完成目标：取官方截止日和本学期“最晚完成日期”中较早的一个
  const finishBy = t => store.get('finishBy:' + t.id, t.finishBy || '');
  const goal = (m, a) => { const f = finishBy(termOf(m.term)); return f && f < a.due ? f : a.due; };
  const goalNote = (m, a) => goal(m, a) < a.due ? `官方截止 ${fmt(a.due)}，我的目标 ${fmt(goal(m, a))}` : '';
  const asmt = (m, id) => m.assessments.find(a => a.id === id);
  const termOf = id => M.terms.find(t => t.id === id);
  const termStart = t => store.get('termStart:' + t.id, t.start);
  function currentWeek(t) {
    const n = Math.floor((today() - parseDate(termStart(t))) / DAY / 7) + 1;
    return n;
  }
  // 课表：第 n 次课 = 第 n 周。held = 已经上完（当天以下课时间为准）
  const sessEnd = x => { const m = /–(\d\d):(\d\d)/.exec(x.t || ''); const d = parseDate(x.d); if (m) d.setHours(+m[1], +m[2]); else d.setHours(23, 59); return d; };
  const held = x => sessEnd(x) <= new Date();
  const sessOf = (m, n) => (m.sessions || []).find(x => x.n === n);
  function moduleWeek(m) {
    if (!m.sessions) return currentWeek(termOf(m.term));
    return m.sessions.filter(x => x.d <= iso(today())).length;
  }
  const nextSession = m => (m.sessions || []).find(x => !held(x));
  const sessLabel = x => `${fmt(x.d)}（${wk(x.d)}）${x.t}`;
  function pendingRecordings() {
    return M.modules.flatMap(m => (m.sessions || []).filter(x => held(x) && !m.weeks.find(w => w.n === x.n)?.rec).map(x => ({ m, x, w: m.weeks.find(w => w.n === x.n) })))
      .sort((a, b) => (a.x.d + a.x.t).localeCompare(b.x.d + b.x.t));
  }
  function currentTerm() {
    const t0 = today();
    let cur = M.terms[0];
    for (const t of M.terms) if (parseDate(termStart(t)) <= t0) cur = t;
    return cur;
  }
  function toast(msg) {
    const el = document.createElement('div');
    el.className = 'toast'; el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2200);
  }
  async function copy(text) {
    try { await navigator.clipboard.writeText(text); toast('已复制'); }
    catch {
      const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); toast('已复制'); } catch { toast('复制失败，请手动选择文字'); }
      ta.remove();
    }
  }
  function download(name, text, type = 'text/plain') {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type: type + ';charset=utf-8' }));
    a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  // 勾选框：data-check="存储键"
  const checkbox = (key, label) =>
    `<label class="check"><input type="checkbox" data-check="${esc(key)}" ${store.get('chk:' + key, false) ? 'checked' : ''}><span>${label}</span></label>`;
  const progressOf = keys => { const done = keys.filter(k => store.get('chk:' + k, false)).length; return { done, total: keys.length, pct: keys.length ? Math.round(done / keys.length * 100) : 0 }; };

  // ---------- 汇总数据 ----------
  function allAssessments() {
    return M.modules.flatMap(m => m.assessments.map(a => ({ m, a })));
  }
  function allMilestones() {
    return M.modules.flatMap(m => m.assessments.flatMap(a => [
      ...a.milestones.map((x, i) => ({ d: x.d, t: x.t, m, a, key: `ms:${m.id}:${a.id}:${i}` })),
      { d: goal(m, a), t: `<b>${esc(a.zh)}${goal(m, a) < a.due ? '完成目标' : '截止'}</b>（${m.code}）`, m, a, key: `ms:${m.id}:${a.id}:due`, due: true },
    ])).sort((x, y) => x.d.localeCompare(y.d));
  }
  const weekTasks = (m, n) => m.weekTasks ? m.weekTasks.filter(x => !x.weeks || x.weeks.includes(n)).map(x => ({ k: `wk:${m.id}:${n}:${x.id}`, t: x.t.replace('{note}', `<a href="#/notes/new/${m.id}/${n}">写 tutorial 笔记</a>`) })) : [
    { k: `wk:${m.id}:${n}:pre`, t: '课前：把课件发给 Claude，读中文讲解和术语' },
    { k: `wk:${m.id}:${n}:lec`, t: '看录播课（1 小时），记下看不懂的时间点' },
    { k: `wk:${m.id}:${n}:tut`, t: '参加线下 tutorial（2 小时），扫码签到' },
    { k: `wk:${m.id}:${n}:note`, t: `<a href="#/notes/new/${m.id}/${n}">写 tutorial 笔记</a>（下课后 10 分钟内）` },
    { k: `wk:${m.id}:${n}:send`, t: '把录音文字稿和笔记发给 Claude' },
  ];

  // ---------- 页面 ----------
  const views = {};

  views.home = () => {
    const t = currentTerm();
    const w = currentWeek(t);
    const upcoming = allAssessments().filter(x => daysUntil(goal(x.m, x.a)) >= -2).sort((x, y) => goal(x.m, x.a).localeCompare(goal(y.m, y.a)));
    const next = upcoming[0];
    const ms = allMilestones().filter(x => daysUntil(x.d) >= -7 && !store.get('chk:' + x.key, false)).slice(0, 6);
    const termMods = M.modules.filter(m => m.term === t.id);
    const grades = store.get('grades', {});

    let h = '';
    if (next) {
      const nd = goal(next.m, next.a); const n = daysUntil(nd);
      h += `<a class="card hero" href="#/a/${next.m.id}/${next.a.id}">
        <div class="label">${nd < next.a.due ? '下一个完成目标' : '下一个截止'} · ${esc(next.m.code)}</div>
        <div style="display:flex;align-items:flex-end;gap:12px;margin:8px 0">
          <div class="big">${n < 0 ? '宽限期' : n}</div><div>${n < 0 ? `已过截止 ${-n} 天，宽限期内尽快提交` : '天'}</div>
        </div>
        <div><b>${esc(next.a.zh)}</b> ${esc(next.a.en)} · ${esc(lenLabel(next.a))} · 占 ${next.a.weight}%</div>
        <div class="label">${fmt(nd)}（${wk(nd)}）${nd < next.a.due ? ` · 官方截止 ${fmt(next.a.due)}` : ' · 建议提前一天提交'}</div>
      </a>`;
    }

    const pend = pendingRecordings();
    if (pend.length) {
      h += `<h2>要发给 Claude 的录音 <span class="pill warn">${pend.length} 节</span></h2><div class="card"><p class="small muted">这些课已经上完，还没收到录音文字稿。直接发过来就行，不用标注是哪一课，Claude 会按课表对应。</p><ul class="list">${pend.map(({ m, x, w }) => `<li><div class="date-badge"><b>${parseDate(x.d).getDate()}</b>${parseDate(x.d).getMonth() + 1}月</div>
        <div class="grow"><a href="#/w/${m.id}/${x.n}">${esc(m.code)} 第 ${x.n} 次课</a><div class="small muted">${esc(w?.zh || '')} · ${esc(x.t)}</div></div></li>`).join('')}</ul></div>`;
    }
    h += `<h2>接下来的课 <span class="pill accent">${esc(t.name)}</span></h2>`;
    const upcomingSess = termMods.map(m => ({ m, x: nextSession(m) })).filter(o => o.x).sort((a, b) => (a.x.d + a.x.t).localeCompare(b.x.d + b.x.t));
    if (upcomingSess.length) {
      for (const { m, x } of upcomingSess) {
        const wkData = m.weeks.find(w => w.n === x.n);
        const tasks = weekTasks(m, x.n);
        const p = progressOf(tasks.map(k => k.k));
        const isToday = x.d === iso(today());
        h += `<div class="card">
          <div class="card-title"><h3><a href="#/w/${m.id}/${x.n}">${esc(m.code)} · 第 ${x.n} 次课</a></h3>${isToday ? '<span class="pill danger">今天</span>' : `<span class="pill">${p.done}/${p.total}</span>`}</div>
          <p class="small" style="margin-bottom:4px">${esc(sessLabel(x))} · 教室 ${esc(x.room)}（或 Zoom）</p>
          <p>${esc(wkData?.zh || '')}<br><span class="en">${esc(wkData?.en || '')}</span></p>
          ${tasks.map(k => checkbox(k.k, k.t)).join('')}
        </div>`;
      }
      h += `<p class="small"><a href="#/schedule">查看完整课表 ›</a></p>`;
    } else if (termMods.length) {
      h += `<div class="card muted">本学期的课已经全部上完，专心完成作业。</div>`;
    }

    h += `<h2>接下来要做</h2><div class="card"><ul class="list">`;
    h += ms.length ? ms.map(x => {
      const n = daysUntil(x.d);
      return `<li><div class="date-badge"><b>${parseDate(x.d).getDate()}</b>${parseDate(x.d).getMonth() + 1}月</div>
        <div class="grow">${x.due ? x.t : esc(x.t)}<div class="small muted"><a href="#/a/${x.m.id}/${x.a.id}">${esc(x.m.code)} ${esc(x.a.zh)}</a></div></div>
        ${x.due ? duePill(n) : `<input type="checkbox" aria-label="完成" data-check="${esc(x.key)}" style="width:20px;height:20px;accent-color:var(--accent)">`}</li>`;
    }).join('') : '<li class="muted">没有待办事项</li>';
    h += `</ul></div>`;

    // 12 门课进度
    h += `<h2>毕业进度</h2><div class="card"><div class="grid12">`;
    for (const tt of M.terms) {
      const ms2 = M.modules.filter(m => m.term === tt.id);
      for (let i = 0; i < M.program.perTerm; i++) {
        const m = ms2[i];
        if (!m) { h += `<div class="slot">${esc(tt.name)}<br>待添加</div>`; continue; }
        const g = moduleGrade(m, grades);
        const cls = g == null ? (tt.id === t.id ? 'active' : '') : g >= 50 ? 'pass' : 'fail';
        h += `<a class="slot ${cls}" href="#/m/${m.id}"><b>${esc(m.code)}</b>${g == null ? esc(m.zh) : g.toFixed(0) + ' 分'}</a>`;
      }
    }
    const passed = M.modules.filter(m => (moduleGrade(m, grades) ?? 0) >= 50).length;
    h += `</div><p class="small muted" style="margin-top:10px">已通过 ${passed} / 12 门 · 在 <a href="#/grades">成绩计算</a> 录入分数后自动更新</p></div>`;
    return h;
  };

  views.schedule = () => {
    const all = M.modules.flatMap(m => (m.sessions || []).map(x => ({ m, x, w: m.weeks.find(w => w.n === x.n) }))).sort((a, b) => (a.x.d + a.x.t).localeCompare(b.x.d + b.x.t));
    if (!all.length) return `<h1>课表</h1><div class="card empty">还没有课表。</div>`;
    let h = `<h1>课表</h1><p class="small muted">来自 LSBF 学生门户。每门课 12 次课，第 n 次课对应手册里的第 n 周。时间是新加坡时间。</p>`;
    let month = '';
    for (const { m, x, w } of all) {
      const mo = parseDate(x.d).getMonth() + 1;
      if (mo + '' !== month) { if (month) h += '</ul></div>'; month = mo + ''; h += `<h2>${mo} 月</h2><div class="card"><ul class="list">`; }
      const st = held(x) ? (w?.rec ? '<span class="pill ok">录音已收到</span>' : '<span class="pill warn">待发录音</span>') : x.d === iso(today()) ? '<span class="pill danger">今天</span>' : '';
      h += `<li><div class="date-badge"><b>${parseDate(x.d).getDate()}</b>${wk(x.d)}</div><div class="grow"><a href="#/w/${m.id}/${x.n}">${esc(m.code)} 第 ${x.n} 次课</a> ${st}<div class="small muted">${esc(x.t)} · ${esc(w?.zh || '')}</div></div></li>`;
    }
    return h + '</ul></div>';
  };

  views.modules = () => {
    let h = `<h1>课程</h1><div class="chips"><a class="chip" href="#/schedule">完整课表</a></div>`;
    const ct = currentTerm();
    const termAs = allAssessments().filter(x => x.m.term === ct.id).sort((x, y) => goal(x.m, x.a).localeCompare(goal(y.m, y.a)));
    if (termAs.length) {
      const fb = finishBy(ct);
      h += `<div class="card"><h3>${esc(ct.name)}截止日期总览</h3>${fb ? `<p class="small muted">我的目标：所有作业 ${fmt(fb)} 前完成（<a href="#/settings">修改</a>）</p>` : ''}<ul class="list">${termAs.map(x => `<li><div class="date-badge"><b>${parseDate(goal(x.m, x.a)).getDate()}</b>${parseDate(goal(x.m, x.a)).getMonth() + 1}月</div>
        <div class="grow"><a href="#/a/${x.m.id}/${x.a.id}">${esc(x.m.code)} ${esc(x.a.zh)}</a><div class="small muted">${esc(lenLabel(x.a))} · 占 ${x.a.weight}%${x.a.tbc ? ' · <span style="color:var(--warn)">日期待确认</span>' : ''}${goal(x.m, x.a) < x.a.due ? ` · 官方截止 ${fmt(x.a.due)}` : ''}</div></div>${duePill(daysUntil(goal(x.m, x.a)))}</li>`).join('')}</ul></div>`;
    }
    for (const t of M.terms) {
      const ms = M.modules.filter(m => m.term === t.id);
      h += `<h2>${esc(t.name)} <span class="muted small">${esc(t.period)}</span></h2>`;
      for (const m of ms) {
        const keys = m.assessments.flatMap(a => a.checklist.map((_, i) => `cl:${m.id}:${a.id}:${i}`));
        const p = progressOf(keys);
        h += `<a class="card" href="#/m/${m.id}">
          <div class="card-title"><h3>${esc(m.code)} ${esc(m.zh)}</h3><span class="pill">${m.credits} 学分</span></div>
          <div class="en">${esc(m.name)}</div>
          <div class="small" style="margin-top:6px">${m.assessments.map(a => `${esc(a.zh)} ${a.weight}% · ${fmt(goal(m, a))}`).join('　')}</div>
          <div class="progress"><i style="width:${p.pct}%"></i></div><div class="small muted">作业清单完成 ${p.pct}%</div>
        </a>`;
      }
      for (let i = ms.length; i < M.program.perTerm; i++) {
        h += `<div class="card muted small">第 ${i + 1} 门课：待添加。把课程手册（Module Handbook）发给 Claude，就会出现在这里。</div>`;
      }
    }
    return h;
  };

  views.module = id => {
    const m = mod(id); if (!m) return notFound();
    const t = termOf(m.term); const cw = moduleWeek(m);
    let h = `<a class="back" href="#/modules">‹ 全部课程</a>
      <h1>${esc(m.code)} ${esc(m.zh)}</h1><p class="en">${esc(m.name)}</p>
      <div class="chips"><a class="chip" href="#sec-asm">作业</a><a class="chip" href="#sec-weeks">12 周</a><a class="chip" href="#sec-lo">学习目标</a><a class="chip" href="#sec-read">阅读</a><a class="chip" href="#sec-people">联系人</a></div>
      <div class="card"><dl class="kv"><dt>学期</dt><dd>${esc(t.name)}（${esc(t.period)}）</dd><dt>学分</dt><dd>${m.credits}</dd><dt>形式</dt><dd>${esc(m.format)}</dd><dt>及格</dt><dd>总分 ≥ 50</dd></dl></div>
      ${m.warning ? `<div class="callout">${esc(m.warning)}</div>` : ''}
      ${(m.alerts || []).map(x => `<div class="callout">${x}</div>`).join('')}
      <h2 id="sec-asm">作业</h2>`;
    for (const a of m.assessments) {
      const n = daysUntil(goal(m, a));
      const p = progressOf(a.checklist.map((_, i) => `cl:${m.id}:${a.id}:${i}`));
      h += `<a class="card" href="#/a/${m.id}/${a.id}">
        <div class="card-title"><h3>${esc(a.zh)} <span class="en">${esc(a.en)}</span></h3>${duePill(n)}</div>
        <div class="small">${goalNote(m, a) ? esc(goalNote(m, a)) : `${fmt(a.due)} 截止`} · ${esc(lenLabel(a))} · 占 <b>${a.weight}%</b> · LO ${a.lo.join(', ')}</div>
        <div class="progress"><i style="width:${p.pct}%"></i></div><div class="small muted">清单 ${p.done}/${p.total}</div></a>`;
    }
    h += `<h2 id="sec-weeks">12 周课程</h2><div class="card"><ul class="list">`;
    for (const w of m.weeks) {
      const p = progressOf(weekTasks(m, w.n).map(x => x.k));
      h += `<li><div class="date-badge"><b>${w.n}</b>周</div><div class="grow"><a href="#/w/${m.id}/${w.n}">${esc(w.zh)}</a><div class="en small">${esc(w.en)}</div>${sessOf(m, w.n) ? `<div class="small muted">${esc(sessLabel(sessOf(m, w.n)))}${held(sessOf(m, w.n)) ? (w.rec ? ' · 录音已收到' : ' · <span style="color:var(--warn)">待发录音</span>') : ''}</div>` : ''}
        <div class="small">${w.notes ? '<span class="pill ok">有课堂笔记</span> ' : ''}${w.n === cw ? '<span class="pill accent">本周</span> ' : ''}${(w.use || []).map(u => `<span class="pill">${esc(asmt(m, u)?.zh || u)}</span>`).join(' ')}</div></div>
        <span class="small muted">${p.done}/${p.total}</span></li>`;
    }
    h += `</ul></div>`;
    h += `<h2 id="sec-lo">学习目标</h2><div class="card"><ol>${m.outcomes.map(o => `<li>${esc(o.zh)}<div class="en small">${esc(o.en)}</div></li>`).join('')}</ol></div>`;
    const core = (m.readings || []).filter(r => r.core), more = (m.readings || []).filter(r => !r.core);
    h += `<h2 id="sec-read">阅读与资料</h2><div class="card">
      ${core.length ? `<h3>核心教材</h3><ul>${core.map(r => `<li><i>${esc(r.t)}</i> — ${esc(r.a)}，${esc(r.p)}</li>`).join('')}</ul>` : ''}
      ${more.length ? `<h3>${esc(m.moreReadingsTitle || '推荐论文')}</h3><ul>${more.map(r => `<li>${esc(r.a)} <i>${esc(r.t)}</i>. ${esc(r.p)}${r.zh ? `<div class="small muted">${esc(r.zh)}</div>` : ''}</li>`).join('')}</ul>` : ''}
      ${(m.websites || []).length ? `<h3>网站</h3><ul>${m.websites.map(s => `<li><a href="${esc(s.u)}" target="_blank" rel="noopener">${esc(s.n)}</a></li>`).join('')}</ul>` : ''}</div>`;
    h += `<h2 id="sec-people">联系人</h2><div class="card"><ul class="list">${m.people.map(p => `<li><div class="grow"><b>${esc(p.name)}</b> <span class="muted small">${esc(p.role)}</span><div><a href="mailto:${esc(p.email)}">${esc(p.email)}</a></div></div></li>`).join('')}</ul></div>`;
    return h;
  };

  views.week = async (id, nStr) => {
    const m = mod(id); const n = Number(nStr); const w = m?.weeks.find(x => x.n === n); if (!w) return notFound();
    const myNotes = store.get('notes', []).filter(x => x.m === id && Number(x.w) === n);
    let h = `<a class="back" href="#/m/${id}">‹ ${esc(m.code)}</a>
      <h1>第 ${n} 周 · ${esc(w.zh)}</h1><p class="en">${esc(w.en)}</p>
      ${sessOf(m, n) ? `<p class="small">上课时间：<b>${esc(sessLabel(sessOf(m, n)))}</b> · 教室 ${esc(sessOf(m, n).room)}（或 Zoom）</p>` : ''}
      <div class="chips">${n > 1 ? `<a class="chip" href="#/w/${id}/${n - 1}">‹ 第 ${n - 1} 周</a>` : ''}${n < m.weeks.length ? `<a class="chip" href="#/w/${id}/${n + 1}">第 ${n + 1} 周 ›</a>` : ''}</div>
      <div class="card"><h3>本周任务</h3>${weekTasks(m, n).map(x => checkbox(x.k, x.t)).join('')}</div>
      ${w.detail ? `<div class="card"><h3>本周安排</h3>${w.detail}</div>` : ''}
      ${(w.use || []).length ? `<div class="card"><h3>这周内容用在哪里</h3><ul>${w.use.map(u => { const a = asmt(m, u); return `<li><a href="#/a/${id}/${u}">${esc(a.zh)}</a>（${fmt(a.due)} 截止）</li>`; }).join('')}</ul></div>` : ''}
      <h2>课堂笔记</h2>`;
    if (w.notes) {
      const path = `content/${id}/week-${String(n).padStart(2, '0')}.md`;
      try {
        const r = await fetch(path, { cache: 'no-cache' });
        if (!r.ok) throw new Error(r.status);
        const md = await r.text();
        h += `<div class="card md">${window.marked ? window.marked.parse(md) : `<pre>${esc(md)}</pre>`}</div>`;
      } catch { h += `<div class="card muted">笔记加载失败（${esc(path)}），请检查网络后刷新。</div>`; }
    } else {
      h += `<div class="card empty">这一周还没有整理好的笔记。<br>${sessOf(m, n) && held(sessOf(m, n)) && !w.rec ? '<b>这节课已经上完，</b>' : ''}把这节课的<b>录音文字稿</b>发给 Claude，整理后会出现在这里：中文总结、重点概念、老师强调的内容、和作业的关系、可以在 tutorial 上用的英文句子。</div>`;
    }
    h += `<h2>我的 tutorial 笔记</h2>`;
    h += myNotes.length ? myNotes.map(noteCard).join('') : `<div class="card empty">还没有记录。</div>`;
    h += `<a class="btn" href="#/notes/new/${id}/${n}">写这一周的 tutorial 笔记</a>`;
    return h;
  };

  views.assessment = (mid, aid) => {
    const m = mod(mid); const a = m && asmt(m, aid); if (!a) return notFound();
    const n = daysUntil(goal(m, a));
    const keys = a.checklist.map((_, i) => `cl:${mid}:${aid}:${i}`);
    const p = progressOf(keys);
    let h = `<a class="back" href="#/m/${mid}">‹ ${esc(m.code)}</a>
      <h1>${esc(a.zh)} <span class="en">${esc(a.en)}</span></h1>
      <div class="card"><dl class="kv">${goal(m, a) < a.due ? `<dt>我的目标</dt><dd><b>${fmt(goal(m, a))}（${wk(goal(m, a))}）</b> ${duePill(n)}</dd><dt>官方截止</dt><dd>${fmt(a.due)}（${wk(a.due)}）</dd>` : `<dt>截止</dt><dd>${fmt(a.due)}（${wk(a.due)}）${duePill(n)}</dd>`}<dt>形式</dt><dd>${esc(lenLabel(a))}</dd><dt>权重</dt><dd>占课程总分 <b>${a.weight}%</b></dd><dt>及格</dt><dd>50 分</dd><dt>学习目标</dt><dd>LO ${a.lo.join(', ')}</dd></dl>
      <p class="small muted" style="margin-top:8px">具体截止时间以 Moodle 为准。截止后 2 天为宽限期；建议提前一天提交。</p></div>
      ${(a.notes || []).map(x => `<div class="callout">${x}</div>`).join('')}
      <div class="chips"><a class="chip" href="#s-brief">要求</a>${(a.sections || []).map((x, i) => `<a class="chip" href="#s-g${i}">${esc(x.chip || x.t)}</a>`).join('')}<a class="chip" href="#s-rubric">评分</a>${(a.outline || []).length ? '<a class="chip" href="#s-outline">结构</a>' : ''}<a class="chip" href="#s-pit">易错</a><a class="chip" href="#s-plan">计划</a><a class="chip" href="#s-check">清单</a></div>
      <h2 id="s-brief">作业要求</h2><div class="card"><ul>${a.brief.map(b => `<li>${b}</li>`).join('')}</ul>
      ${(a.questions || []).length ? `<h3>${esc(a.questionsTitle || '必须回答的问题')}</h3><ol>${a.questions.map(q => `<li>${esc(q)}</li>`).join('')}</ol>` : ''}</div>
      ${(a.sections || []).map((x, i) => `<h2 id="s-g${i}">${esc(x.t)}</h2><div class="card md">${x.html}</div>`).join('')}
      ${(a.options || []).length ? `<h2>${esc(a.optionsTitle || '题目选项')}</h2>${a.options.map(o => `<div class="card"><div class="card-title"><h3>${esc(o.k)}</h3>${o.tag ? `<span class="pill accent">${esc(o.tag)}</span>` : ''}</div><p>${esc(o.zh)}</p><p class="en small">${esc(o.en)}</p>${o.read ? `<div class="small"><b>必须用的阅读：</b>${o.read}</div>` : ''}${o.tip ? `<div class="small muted" style="margin-top:4px">${o.tip}</div>` : ''}</div>`).join('')}` : ''}
      <h2 id="s-rubric">评分标准</h2><div class="card">${(a.rubric || []).length ? a.rubric.map(r => `<div class="rubric-row"><div class="top"><span>${esc(r.zh)} <span class="en">${esc(r.en)}</span></span><span>${r.w}%</span></div>
        <div class="progress"><i style="width:${r.w / Math.max(...a.rubric.map(x => x.w)) * 100}%"></i></div><div class="small muted">${esc(r.d)}</div></div>`).join('') : `<p class="muted">${esc(a.rubricNote || '手册里没有评分细则，见 Moodle 上的 assessment brief 和 marking rubric。')}</p>`}</div>
      ${(a.outline || []).length ? `<h2 id="s-outline">${esc(a.outlineTitle || '建议结构与字数')}</h2><div class="card">
        ${a.outline.map(o => `<div class="outline-item"><div class="top"><span>${esc(o.s)}</span>${o.w ? `<span class="pill">≈${o.w} 词</span>` : ''}</div><div class="g">${o.g}</div></div>`).join('')}
        ${a.outline.every(o => o.w) ? `<p class="small muted" style="margin-top:8px">合计约 ${a.outline.reduce((s, o) => s + o.w, 0)} 词，按评分权重分配。参考文献通常不计入字数，以 Moodle 说明为准。</p>` : ''}
        ${a.template ? `<h3 style="margin-top:12px">手册给的反思句式 <button class="copy" data-copy="${esc(a.template)}">复制</button></h3><blockquote class="small" style="margin:0;padding:8px 12px;background:var(--surface-2);border-radius:8px">${esc(a.template)}</blockquote>` : ''}
      </div>` : ''}
      ${(a.theories || []).length ? `<h2>${esc(a.theoriesTitle || '可以用的理论')}</h2><div class="card"><div style="display:flex;flex-wrap:wrap;gap:6px">${a.theories.map(x => `<span class="pill accent">${esc(x)}</span>`).join('')}</div><p class="small muted" style="margin-top:8px">在 <a href="#/glossary">词汇</a> 里可以查到解释。</p></div>` : ''}
      <h2 id="s-pit">容易丢分的地方</h2>${a.pitfalls.map(x => `<div class="callout">${esc(x)}</div>`).join('')}
      <h2 id="s-plan">时间计划</h2><div class="card"><ul class="list">
        ${a.milestones.map((x, i) => `<li><div class="date-badge"><b>${parseDate(x.d).getDate()}</b>${parseDate(x.d).getMonth() + 1}月</div><div class="grow">${checkbox(`ms:${mid}:${aid}:${i}`, esc(x.t)).replace('class="check"', 'class="check" style="border:0;padding:0"')}<div class="small muted">${dueLabel(daysUntil(x.d))}</div></div></li>`).join('')}
      </ul></div>
      <h2 id="s-check">完成清单 <span class="pill">${p.done}/${p.total}</span></h2><div class="card"><div class="progress"><i style="width:${p.pct}%"></i></div>${a.checklist.map((c, i) => checkbox(keys[i], esc(c))).join('')}</div>
      <p class="small"><a href="#/writing">提交前检查 · Harvard 引用 · 常用句型 ›</a></p>`;
    return h;
  };

  // ---------- 笔记 ----------
  const NOTE_FIELDS = [
    { k: 'case', l: '今天讨论了什么案例 / 话题', h: '企业名、国家、老师提的问题' },
    { k: 'group', l: '我们组怎么分析的', h: '用了哪个理论？分歧在哪？最后怎么决定的？' },
    { k: 'me', l: '我说了什么 / 做了什么', h: '哪怕只说了一句，也写下来——这是反思的素材' },
    { k: 'learned', l: '我学到了什么', h: '原来以为……，后来发现……' },
    { k: 'confused', l: '没听懂 / 想问 Claude 的', h: '' },
    { k: 'link', l: '和作业的关系', h: '可以用在 A1 / A2 的哪个部分' },
  ];
  function noteCard(x) {
    const m = mod(x.m);
    return `<div class="card"><div class="card-title"><h3>${esc(m?.code || x.m)} · 第 ${esc(x.w)} 周</h3><span class="small muted">${esc(x.date)}</span></div>
      ${NOTE_FIELDS.filter(f => x[f.k]).map(f => `<p><b class="small">${esc(f.l)}</b><br>${esc(x[f.k]).replace(/\n/g, '<br>')}</p>`).join('')}
      <div class="btn-row" style="margin-top:4px"><a class="btn ghost" href="#/notes/edit/${esc(x.id)}">编辑</a><button class="btn ghost" data-copy-note="${esc(x.id)}">复制发给 Claude</button></div></div>`;
  }
  const noteToMd = x => {
    const m = mod(x.m);
    return `## ${m?.code || x.m} 第 ${x.w} 周 tutorial 笔记（${x.date}）\n\n` + NOTE_FIELDS.filter(f => x[f.k]).map(f => `**${f.l}**\n${x[f.k]}\n`).join('\n');
  };

  views.notes = () => {
    const notes = store.get('notes', []).slice().sort((a, b) => (b.date + b.w).localeCompare(a.date + a.w));
    let h = `<h1>Tutorial 笔记</h1>
      <div class="callout info">每次 tutorial 下课后 10 分钟内用中文记下来。两份作业都要求写你在 tutorial 里的真实经历，A2 的反思部分占 30%。</div>
      <div class="btn-row" style="margin:0 0 16px"><a class="btn" href="#/notes/new">新建笔记</a>${notes.length ? `<button class="btn ghost" id="copy-all">全部复制发给 Claude</button><button class="btn ghost" id="dl-all">下载 .md</button>` : ''}</div>`;
    h += notes.length ? notes.map(noteCard).join('') : `<div class="card empty">还没有笔记。</div>`;
    h += `<p class="small muted">笔记保存在服务器上，手机和电脑登录后都能看到。</p>`;
    return h;
  };
  views.noteForm = (mode, a, b) => {
    const notes = store.get('notes', []);
    let x;
    if (mode === 'edit') { x = notes.find(n => n.id === a); if (!x) return notFound(); }
    else {
      const t = currentTerm(); const mm = a || M.modules.find(m => m.term === t.id)?.id || M.modules[0].id;
      const cw = Math.min(12, Math.max(1, moduleWeek(mod(mm))));
      x = { id: '', m: mm, w: b || cw, date: iso(today()) };
    }
    return `<a class="back" href="#/notes">‹ 笔记</a><h1>${mode === 'edit' ? '编辑' : '新建'} tutorial 笔记</h1>
      <form id="note-form" class="card" data-id="${esc(x.id)}">
        <label>课程</label><select name="m">${M.modules.map(m => `<option value="${m.id}" ${m.id === x.m ? 'selected' : ''}>${esc(m.code)} ${esc(m.zh)}</option>`).join('')}</select>
        <div style="display:flex;gap:10px"><div style="flex:1"><label>第几周</label><input type="number" name="w" min="1" max="12" value="${esc(x.w)}"></div>
        <div style="flex:1.4"><label>日期</label><input type="date" name="date" value="${esc(x.date)}"></div></div>
        ${NOTE_FIELDS.map(f => `<label>${esc(f.l)} ${f.h ? `<span class="hint">${esc(f.h)}</span>` : ''}</label><textarea name="${f.k}">${esc(x[f.k] || '')}</textarea>`).join('')}
        <div class="btn-row"><button class="btn" type="submit">保存</button>${mode === 'edit' ? '<button class="btn danger" type="button" id="del-note">删除</button>' : ''}</div>
      </form>`;
  };

  // ---------- 词汇 ----------
  views.glossary = () => {
    const cats = [...new Set(M.glossary.map(g => g.c))];
    return `<h1>词汇表</h1>
      <input type="search" id="g-q" placeholder="搜索英文或中文…" autocomplete="off" style="margin-bottom:10px">
      <div class="chips" id="g-cats"><button class="chip on" data-cat="">全部</button>${cats.map(c => `<button class="chip" data-cat="${esc(c)}">${esc(c)}</button>`).join('')}</div>
      <div class="card" id="g-list"></div>`;
  };
  function renderGlossary() {
    const q = (document.getElementById('g-q')?.value || '').trim().toLowerCase();
    const cat = document.querySelector('#g-cats .chip.on')?.dataset.cat || '';
    const list = M.glossary.filter(g => (!cat || g.c === cat) && (!q || (g.en + g.zh + g.x).toLowerCase().includes(q)));
    document.getElementById('g-list').innerHTML = list.length ? list.map(g => `<div class="term"><div class="head"><b>${esc(g.en)}</b><span>${esc(g.zh)}</span><span class="pill">${esc(g.c)}</span></div>
      <div>${esc(g.x)}</div>${g.e ? `<div class="ex">${esc(g.e)}</div>` : ''}</div>`).join('') : '<div class="empty">没有找到</div>';
  }

  // ---------- 工具 ----------
  views.log = async () => {
    let h = `<a class="back" href="#/tools">‹ 工具</a>`;
    try {
      const r = await fetch('docs/progress.md', { cache: 'no-cache' });
      if (!r.ok) throw new Error(r.status);
      const md = await r.text();
      h += `<div class="card md">${window.marked ? window.marked.parse(md) : `<pre>${esc(md)}</pre>`}</div>`;
    } catch { h += `<div class="card muted">进度记录加载失败，请检查网络后刷新。</div>`; }
    return h;
  };

  views.tools = () => `<h1>工具</h1>
    <a class="card" href="#/log"><h3>学习进度记录</h3><p class="small muted">和 Claude 沟通的记录：下一步、待确认问题、已做决定、收到的材料</p></a>
    <a class="card" href="#/writing"><h3>写作助手</h3><p class="small muted">提交前检查清单、Harvard 引用格式、tutorial 发言和学术写作句型</p></a>
    <a class="card" href="#/grades"><h3>成绩计算</h3><p class="small muted">录入分数，算出及格还需要多少分、目前的学位等级</p></a>
    <a class="card" href="#/rules"><h3>学校规则</h3><p class="small muted">及格线、补考、宽限期、延期、查重、AI 使用</p></a>
    <a class="card" href="#/claude"><h3>怎么和 Claude 配合</h3><p class="small muted">每周发什么、怎么发、Claude 能做什么</p></a>
    <a class="card" href="#/settings"><h3>设置与备份</h3><p class="small muted">开学日期、导出/导入数据、深浅色</p></a>`;

  views.rules = () => `<a class="back" href="#/tools">‹ 工具</a><h1>学校规则</h1><p class="muted small">来自开学典礼录音和课程手册</p>
    <div class="card"><ul class="list">${M.rules.map(r => `<li><div class="grow"><b>${esc(r.k)}</b><div>${esc(r.v)}</div><div class="small muted">${esc(r.tip)}</div></div></li>`).join('')}</ul></div>
    <h2>图书馆数据库</h2><div class="card"><p>精通 2–3 个就够：</p><ul>${M.databases.map(d => `<li>${esc(d)}</li>`).join('')}</ul>
    <p class="small muted">搜索技巧：用很具体的关键词组合。例如单搜 “management accounting” 有约 15.9 万条结果，加上 “ethics” 和 “Singapore” 后只剩约 50 条。</p></div>
    <h2>联系人</h2><div class="card"><ul class="list">${M.contacts.map(c => `<li><div class="grow"><b>${esc(c.name)}</b> <span class="small muted">${esc(c.role)}</span><div><a href="mailto:${esc(c.email)}">${esc(c.email)}</a>${c.tel ? ` · <a href="tel:${esc(c.tel.replace(/\s/g, ''))}">${esc(c.tel)}</a>` : ''}</div></div></li>`).join('')}</ul></div>`;

  views.writing = () => `<a class="back" href="#/tools">‹ 工具</a><h1>写作助手</h1>
    <div class="chips"><a class="chip" href="#wr-check">提交前检查</a><a class="chip" href="#wr-harvard">Harvard</a>${M.phrases.map((g, i) => `<a class="chip" href="#wr-p${i}">${esc(g.g)}</a>`).join('')}</div>
    <h2 id="wr-check">提交前检查</h2><div class="card">${M.submitChecklist.map((c, i) => checkbox(`submit:${i}`, esc(c))).join('')}
      <div class="btn-row"><button class="btn ghost" id="reset-submit">清空勾选（下一份作业用）</button></div></div>
    <h2 id="wr-harvard">Harvard 引用</h2><div class="card"><div class="table-scroll"><table><thead><tr><th>类型</th><th>参考文献列表</th><th>文内引用</th></tr></thead><tbody>
      ${M.harvard.map(x => `<tr><td><b>${esc(x.t)}</b></td><td>${x.ref}</td><td>${esc(x.intext)}</td></tr>`).join('')}</tbody></table></div>
      <p class="small muted" style="margin-top:8px">以 <a href="https://www.gre.ac.uk/academicskills" target="_blank" rel="noopener">Greenwich Academic Skills</a> 的格式说明为准。</p></div>
    ${M.phrases.map((g, i) => `<h2 id="wr-p${i}">${esc(g.g)}</h2><div class="card">${g.items.map(p => `<div class="phrase"><button class="copy" data-copy="${esc(p.en)}">复制</button><div class="e">${esc(p.en)}</div><div class="small muted">${esc(p.zh)}</div></div>`).join('')}</div>`).join('')}`;

  function moduleGrade(m, grades) {
    const g = grades[m.id] || {};
    if (!m.assessments.every(a => g[a.id] !== undefined && g[a.id] !== '')) return null;
    return m.assessments.reduce((s, a) => s + Number(g[a.id]) * a.weight / 100, 0);
  }
  views.grades = () => {
    const grades = store.get('grades', {});
    let h = `<a class="back" href="#/tools">‹ 工具</a><h1>成绩计算</h1><p class="muted small">拿到分数后录入，自动计算课程总分、及格还需要多少分和学位等级。</p>`;
    for (const m of M.modules) {
      const g = grades[m.id] || {};
      h += `<div class="card"><h3>${esc(m.code)} ${esc(m.zh)}</h3>${m.assessments.map(a => `<label class="small" style="display:flex;align-items:center;gap:10px;margin:8px 0"><span style="flex:1">${esc(a.zh)}（${a.weight}%）</span>
        <input type="number" min="0" max="100" step="1" inputmode="numeric" style="width:96px" data-grade="${m.id}:${a.id}" value="${esc(g[a.id] ?? '')}" placeholder="分数"></label>`).join('')}
        <div class="small" data-grade-out="${m.id}"></div></div>`;
    }
    h += `<div class="card" id="overall"></div>`;
    return h;
  };
  function renderGrades() {
    const grades = store.get('grades', {});
    for (const m of M.modules) {
      const out = document.querySelector(`[data-grade-out="${m.id}"]`); if (!out) continue;
      const g = grades[m.id] || {};
      const known = m.assessments.filter(a => g[a.id] !== undefined && g[a.id] !== '');
      const unknown = m.assessments.filter(a => !known.includes(a));
      const got = known.reduce((s, a) => s + Number(g[a.id]) * a.weight / 100, 0);
      if (!unknown.length) {
        out.innerHTML = `课程总分 <b>${got.toFixed(1)}</b> ${got >= 50 ? '<span class="pill ok">及格</span>' : '<span class="pill danger">未及格，需要补考</span>'}`;
      } else if (unknown.length === 1 && known.length) {
        const a = unknown[0]; const need = (50 - got) / (a.weight / 100); const need60 = (60 - got) / (a.weight / 100); const need70 = (70 - got) / (a.weight / 100);
        const show = v => v <= 0 ? '已达到' : v > 100 ? '无法达到' : Math.ceil(v) + ' 分';
        out.innerHTML = `${esc(a.zh)}至少需要：及格 <b>${show(need)}</b> · Merit ${show(need60)} · Distinction ${show(need70)}`;
      } else {
        out.innerHTML = '<span class="muted">录入分数后显示计算结果</span>';
      }
    }
    const done = M.modules.map(m => moduleGrade(m, grades)).filter(v => v != null);
    const el = document.getElementById('overall');
    if (el) {
      if (!done.length) { el.innerHTML = '<h3>学位等级</h3><p class="muted small">至少完成一门课后显示。Distinction ≥ 70 · Merit 60–69 · Pass 50–59</p>'; return; }
      const avg = done.reduce((s, v) => s + v, 0) / done.length;
      const cls = avg >= 70 ? 'Distinction（卓越）' : avg >= 60 ? 'Merit（优秀）' : avg >= 50 ? 'Pass（通过）' : '未达到及格';
      el.innerHTML = `<h3>学位等级（按已完成 ${done.length} 门课估算）</h3><p>平均分 <b>${avg.toFixed(1)}</b> → <b>${cls}</b></p><p class="small muted">以学校最终规则为准。</p>`;
    }
  }

  views.claude = () => `<a class="back" href="#/tools">‹ 工具</a><h1>怎么和 Claude 配合</h1>
    <div class="card"><h3>每周固定发三样东西</h3><ol>
      <li><b>课前</b>：本周课件（PDF/PPT）→ 中文讲解、术语、tutorial 上能用的英文句子</li>
      <li><b>课后</b>：整堂课的录音文字稿 → 整理成这个网站上的“课堂笔记”</li>
      <li><b>课后</b>：你的 tutorial 笔记（笔记页“复制发给 Claude”）→ 英文要点，和作业的关联</li></ol>
      <p class="small muted">文字稿开头请写上：课程代码 + 第几周 + 是录播课还是 tutorial，例如“BUSI 1764 第 3 周 tutorial”。</p></div>
    <div class="card"><h3>写作业时</h3><ul>
      <li>先发 2–3 个选题想法，一起分析优缺点后再定</li>
      <li>你写初稿（中文、英文、中英混写都可以），Claude 逐段对照评分标准给反馈，并改进英文表达</li>
      <li>反思部分必须是你自己的经历，Claude 帮你组织和表达</li></ul></div>
    <div class="callout">Claude 不会代写整篇作业让你直接提交：直接复制 AI 生成的内容属于学术不端，也过不了 Turnitin 这一关。观点要你出，Claude 帮你表达好、对准评分标准。</div>
    <div class="card"><h3>新学期开始时</h3><p>把 4 门课的课程手册都发给 Claude，网站会加上新课程、截止日期和作业拆解。</p></div>`;

  views.settings = () => {
    const theme = store.get('theme', '');
    return `<a class="back" href="#/tools">‹ 工具</a><h1>设置与备份</h1>
    <div class="card"><h3>开学日期（第 1 周周一）</h3><p class="small muted">用来计算“本周”。默认值是推测的，请按学校课表修改。</p>
      ${M.terms.map(t => `<label>${esc(t.name)} <span class="hint">${esc(t.period)}</span></label><input type="date" data-term="${t.id}" value="${esc(termStart(t))}">`).join('')}
      <p class="small" style="margin-top:8px">今天是 ${esc(currentTerm().name)}第 <b>${currentWeek(currentTerm())}</b> 周</p></div>
    <div class="card"><h3>我的完成目标</h3><p class="small muted">每学期所有作业最晚在这一天前完成。官方截止日期更晚的作业，倒计时和提醒都按这个日期算。留空表示按官方截止日期。</p>
      ${M.terms.map(t => `<label>${esc(t.name)}</label><input type="date" data-finish="${t.id}" value="${esc(finishBy(t))}">`).join('')}</div>
    <div class="card"><h3>显示</h3><div class="chips" style="margin:0">${[['', '跟随系统'], ['light', '浅色'], ['dark', '深色']].map(([v, l]) => `<button class="chip ${theme === v ? 'on' : ''}" data-theme-set="${v}">${l}</button>`).join('')}</div></div>
    <div class="card"><h3>登录密码</h3>${defaultPw ? '<div class="callout">你还在用默认密码 123456，建议马上修改。</div>' : ''}
      <form id="pw-form"><label>当前密码</label><input type="password" name="current" autocomplete="current-password" required>
      <label>新密码 <span class="hint">至少 6 位</span></label><input type="password" name="next" autocomplete="new-password" minlength="6" required>
      <label>再输一次新密码</label><input type="password" name="again" autocomplete="new-password" minlength="6" required>
      <div class="btn-row"><button class="btn" type="submit">修改密码</button></div></form>
      <p class="small muted" style="margin-top:8px">修改后，其他已登录的浏览器需要用新密码重新登录。</p>
      <div class="btn-row"><button class="btn ghost" id="logout">退出登录</button></div></div>
    <div class="card"><h3>数据与备份</h3><p class="small muted">笔记、勾选和成绩保存在服务器上，换浏览器或换手机登录后都能看到。深浅色设置只对当前设备生效。建议每月导出一次备份。</p>
      <div class="btn-row"><button class="btn" id="export">导出备份</button><label class="btn ghost" style="margin:0">导入备份<input type="file" id="import" accept="application/json,.json" hidden></label></div>
      <div class="btn-row"><button class="btn danger" id="wipe">清除服务器上的所有数据</button></div></div>`;
  };

  const notFound = () => `<div class="empty">页面不存在。<br><a href="#/">回到首页</a></div>`;

  // ---------- 路由 ----------
  const routes = [
    [/^\/?$/, () => views.home(), 'home'],
    [/^\/modules$/, () => views.modules(), 'modules'],
    [/^\/schedule$/, () => views.schedule(), 'modules'],
    [/^\/m\/(\w+)$/, (id) => views.module(id), 'modules'],
    [/^\/w\/(\w+)\/(\d+)$/, (id, n) => views.week(id, n), 'modules'],
    [/^\/a\/(\w+)\/(\w+)$/, (m, a) => views.assessment(m, a), 'modules'],
    [/^\/notes$/, () => views.notes(), 'notes'],
    [/^\/notes\/new(?:\/(\w+)\/(\d+))?$/, (m, w) => views.noteForm('new', m, w), 'notes'],
    [/^\/notes\/edit\/([\w-]+)$/, (id) => views.noteForm('edit', id), 'notes'],
    [/^\/glossary$/, () => views.glossary(), 'glossary'],
    [/^\/tools$/, () => views.tools(), 'tools'],
    [/^\/log$/, () => views.log(), 'tools'],
    [/^\/rules$/, () => views.rules(), 'tools'],
    [/^\/writing$/, () => views.writing(), 'tools'],
    [/^\/grades$/, () => views.grades(), 'tools'],
    [/^\/claude$/, () => views.claude(), 'tools'],
    [/^\/settings$/, () => views.settings(), 'tools'],
  ];
  let renderSeq = 0;
  async function render() {
    const raw = location.hash.slice(1) || '/';
    // 页内锚点（#sec-xxx）不触发路由
    if (!raw.startsWith('/')) { document.getElementById(raw)?.scrollIntoView({ behavior: 'smooth' }); return; }
    const seq = ++renderSeq;
    let html = notFound(), tab = '';
    for (const [re, fn, t] of routes) {
      const mt = raw.match(re);
      if (mt) { html = await fn(...mt.slice(1)); tab = t; break; }
    }
    if (seq !== renderSeq) return;
    $app.innerHTML = html;
    document.querySelectorAll('.tabbar a').forEach(a => a.classList.toggle('on', a.dataset.tab === tab));
    lastRoute = raw;
    window.scrollTo(0, 0);
    if (document.getElementById('g-list')) renderGlossary();
    if (document.getElementById('overall')) renderGrades();
  }
  let lastRoute = '/';

  // 页内锚点：拦截点击，避免改动 hash 路由
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (a && !a.getAttribute('href').startsWith('#/')) {
      e.preventDefault();
      document.getElementById(a.getAttribute('href').slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  // ---------- 事件 ----------
  document.addEventListener('change', e => {
    const t = e.target;
    if (t.dataset.check) {
      store.set('chk:' + t.dataset.check, t.checked);
      if (t.closest('.list') && lastRoute === '/') setTimeout(render, 300);
    }
    if (t.dataset.finish !== undefined) { store.set('finishBy:' + t.dataset.finish, t.value); toast('已保存'); render(); }
    if (t.dataset.term) { if (t.value) { store.set('termStart:' + t.dataset.term, t.value); toast('已保存'); render(); } }
    if (t.id === 'import' && t.files[0]) {
      t.files[0].text().then(txt => {
        const data = JSON.parse(txt);
        if (!data || data.app !== 'mba-helper') throw new Error();
        for (const [k, v] of Object.entries(data.items)) if (k !== 'theme') store.set(k, v);
        toast('导入成功'); render();
      }).catch(() => toast('导入失败：文件格式不对'));
    }
  });
  document.addEventListener('input', e => {
    const t = e.target;
    if (t.id === 'g-q') renderGlossary();
    if (t.dataset.grade) {
      const [m, a] = t.dataset.grade.split(':');
      const grades = store.get('grades', {});
      grades[m] = grades[m] || {};
      if (t.value === '') delete grades[m][a]; else grades[m][a] = Math.max(0, Math.min(100, Number(t.value)));
      store.set('grades', grades); renderGrades();
    }
  });
  document.addEventListener('click', e => {
    const t = e.target.closest('button, [data-cat]');
    if (!t) return;
    if (t.dataset.cat !== undefined && t.closest('#g-cats')) {
      t.parentElement.querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === t)); renderGlossary();
    }
    if (t.dataset.copy) copy(t.dataset.copy);
    if (t.dataset.copyNote) { const n = store.get('notes', []).find(x => x.id === t.dataset.copyNote); if (n) copy(noteToMd(n)); }
    if (t.id === 'copy-all' || t.id === 'dl-all') {
      const md = '# Tutorial 笔记\n\n' + store.get('notes', []).slice().sort((a, b) => (a.m + String(a.w).padStart(2, '0')).localeCompare(b.m + String(b.w).padStart(2, '0'))).map(noteToMd).join('\n---\n\n');
      if (t.id === 'copy-all') copy(md); else download(`tutorial-notes-${iso(today())}.md`, md, 'text/markdown');
    }
    if (t.id === 'del-note' && confirm('确定删除这条笔记？')) {
      const id = document.getElementById('note-form').dataset.id;
      store.set('notes', store.get('notes', []).filter(n => n.id !== id)); toast('已删除'); location.hash = '#/notes';
    }
    if (t.id === 'reset-submit') { M.submitChecklist.forEach((_, i) => store.del(`chk:submit:${i}`)); render(); }
    if (t.dataset.themeSet !== undefined) { store.set('theme', t.dataset.themeSet); applyTheme(); render(); }
    if (t.id === 'export') {
      const items = { ...state };
      download(`mba-backup-${iso(today())}.json`, JSON.stringify({ app: 'mba-helper', exported: new Date().toISOString(), items }, null, 2), 'application/json');
    }
    if (t.id === 'wipe' && confirm('确定清除服务器上所有笔记、勾选和成绩？所有设备都会被清空，无法撤销。建议先导出备份。')) {
      clearTimeout(flushTimer); pending.set = {}; pending.del = new Set();
      api('/api/data', { method: 'DELETE' }).then(r => { if (!r.ok) throw 0; state = {}; toast('已清除'); render(); }).catch(() => toast('清除失败，请重试'));
    }
    if (t.id === 'logout') {
      flush().finally(() => fetch('/api/logout', { method: 'POST' }).finally(() => location.replace('/login.html')));
    }
    if (t.id === 'sync' && syncState === 'error') flush();
  });
  document.addEventListener('submit', async e => {
    if (e.target.id === 'pw-form') {
      e.preventDefault();
      const f = Object.fromEntries(new FormData(e.target).entries());
      if (f.next !== f.again) { toast('两次输入的新密码不一样'); return; }
      const r = await api('/api/password', { method: 'POST', body: { current: f.current, next: f.next } }).catch(() => null);
      const j = r ? await r.json().catch(() => ({})) : {};
      if (r && r.ok) { defaultPw = false; toast('密码已修改'); render(); } else toast(j.message || '修改失败，请重试');
      return;
    }
    if (e.target.id !== 'note-form') return;
    e.preventDefault();
    const f = new FormData(e.target);
    const x = Object.fromEntries(f.entries());
    x.w = Number(x.w) || 1;
    const notes = store.get('notes', []);
    const id = e.target.dataset.id;
    if (id) { const i = notes.findIndex(n => n.id === id); x.id = id; notes[i] = x; }
    else { x.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6); notes.push(x); }
    store.set('notes', notes); toast('已保存'); location.hash = '#/notes';
  });

  function applyTheme() {
    const t = store.get('theme', '');
    if (t) document.documentElement.dataset.theme = t; else delete document.documentElement.dataset.theme;
  }

  let defaultPw = false;
  async function start() {
    applyTheme();
    const d = today();
    document.getElementById('today').textContent = `${d.getMonth() + 1}月${d.getDate()}日 ${'周' + '日一二三四五六'[d.getDay()]}`;
    $app.innerHTML = '<div class="empty">加载中…</div>';
    try {
      const [, sess] = await Promise.all([loadState(), api('/api/session').then(r => r.json()).catch(() => ({}))]);
      defaultPw = Boolean(sess.defaultPassword);
    } catch (e) {
      if (e.message === 'auth') return;
      $app.innerHTML = '<div class="empty">无法连接服务器，请检查网络后<a href="javascript:location.reload()">刷新</a>。</div>';
      return;
    }
    migrateLocal();
    window.addEventListener('hashchange', render);
    render();
    if (defaultPw) toast('还在用默认密码，请到 工具 → 设置 修改');
    // 切回这个页面时，拉取其他设备的最新进度
    document.addEventListener('visibilitychange', async () => {
      if (document.visibilityState !== 'visible' || syncState !== 'ok') return;
      try {
        const before = JSON.stringify(state);
        await loadState();
        if (JSON.stringify(state) !== before && !document.activeElement?.matches('input, textarea, select')) render();
      } catch {}
    });
    window.addEventListener('pagehide', () => { if (Object.keys(pending.set).length || pending.del.size) navigator.sendBeacon?.('/api/data', new Blob([JSON.stringify({ set: pending.set, del: [...pending.del] })], { type: 'application/json' })); });
  }
  start();
})();
