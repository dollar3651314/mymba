// COMP 1913 International Data Analytics — 内容来自 2026-27 课程手册；2026-10-02 按 Moodle 资料（第 1–2 周课件、tutorial 练习、阅读）更新
MBA.addModule({
  id: 'comp1913',
  code: 'COMP 1913',
  name: 'International Data Analytics',
  zh: '国际数据分析',
  term: 't1',
  credits: 15,
  format: '每周线上讲座 + tutorial 练习（第 11–12 周是小组展示）',
  alerts: [
    '两份作业的 assessment brief 已整理进作业页。报告评估的是 <b>Bain & Company《Innovation Report 2025》</b>；小组展示用的是 Sage 案例 <b>American Egg: Strategic Growth and International Expansion</b>。',
    '原始 PDF 有版权（Sage 案例只允许在格林威治大学内部使用），所以网站上只放中文解读和数据要点，不放原文。',
    '<b>第 1 次课老师说</b>：课件和官方通知都在 <b>Canvas</b>（一定要订阅通知）；作业通过 Turnitin 提交；上课<b>带个人笔记本电脑</b>（公司电脑可能连不上 Google 协作工具）；这是最技术性的一门课，<b>课前先读课件</b>。',
    '课程要求提交一份 <b>AI 使用报告</b>（Moodle 上的手册和两份 brief 都没提到，可能在 Canvas，10/6 问老师）。',
    '<b>第 1 周 tutorial 课件提醒：个人报告要用的内容在第 2、3 周的讲座里讲</b>（认知偏差、数字为什么会说谎）。这两周的笔记要记好——报告第 4 部分“数据完整性与认知偏差”就靠它们。',
    'Moodle 上第 1 周的课件和 tutorial 课件是英国 2024-25 / 4 月批次的版本，里面写的截止日期（6 月、7 月）<b>不适用</b>，以我们的课表和老师说的为准。',
    '<b>tutorial 要用 Excel 做表和图</b>（必须用公式，不能手填总数）。上课带装了 Excel 的个人电脑。',
  ],
  todos: [
    { d: '2026-10-03', t: '订阅 Canvas 通知；确认能下载课件' },
    { d: '2026-10-06', t: '课后把录音、你的小组名单发给 Claude；问老师 AI 使用报告的要求' },
    { d: '2026-10-06', t: '课上问清：小组 4 人还是 5 人？你们组 11/24 还是 11/28 展示？' },
  ],
  people: [
    { role: '课程负责人（英国）', name: 'Rhonda A. Best', email: 'r.a.best@greenwich.ac.uk' },
    { role: '讲师', name: 'Dr. Brian Seow', email: 'bseow@lsbf.edu.sg' },
    { role: '讲师', name: 'Mr. Zhou Zhihao', email: 'zzhihao@lsbf.edu.sg' },
  ],
  weekTasks: [
    { id: 'lec', t: '看线上讲座', weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
    { id: 'tut', t: '参加 tutorial，完成课堂练习，扫码签到' },
    { id: 'note', t: '{note}' },
    { id: 'send', t: '把录音文字稿、课件和练习发给 Claude' },
  ],
  aim: '在商业和组织框架下介绍统计概念和数据分析工具，让学生掌握有效汇总和呈现数据以支持决策的分析工具和技能，能借助计算机软件运用统计和数学概念解决实际问题，并熟悉大数据分析的思路、术语、方法和工具。',
  outcomes: [
    { en: 'Develop decision-making ability in the fast-paced world by understanding data driven models.', zh: '理解数据驱动模型，提升在快节奏环境中的决策能力' },
    { en: 'Apply basic quantitative/qualitative methods in the analysis of problems arising in a business management context.', zh: '运用基本的定量 / 定性方法分析商业管理问题' },
    { en: 'Use and evaluate quantitative techniques to carry out an investigation into a business problem put in form of a case study.', zh: '使用并评估定量技术，对案例形式的商业问题开展调查' },
    { en: 'Identify appropriate computer packages to support completion of the data, decision making tasks.', zh: '选择合适的软件完成数据和决策任务' },
    { en: 'Critically evaluate and execute research on a case study to write an effective report.', zh: '对案例进行批判性评估和研究，写出有效的报告' },
  ],
  // 课表（LSBF 学生门户 Calendar，2026-10-02 截图）：第 n 次课 = 第 n 周
  sessions: [
    { n: 1, d: '2026-09-29', t: '19:00–22:00', room: '18-3' },
    { n: 2, d: '2026-10-06', t: '19:00–22:00', room: '18-3' },
    { n: 3, d: '2026-10-10', t: '12:00–15:00', room: '23-3' },
    { n: 4, d: '2026-10-17', t: '15:30–18:30', room: '23-3' },
    { n: 5, d: '2026-10-20', t: '19:00–22:00', room: '18-3' },
    { n: 6, d: '2026-10-24', t: '12:00–15:00', room: '23-3' },
    { n: 7, d: '2026-10-31', t: '15:30–18:30', room: '23-3' },
    { n: 8, d: '2026-11-10', t: '19:00–22:00', room: '18-3' },
    { n: 9, d: '2026-11-14', t: '15:30–18:30', room: '23-3' },
    { n: 10, d: '2026-11-21', t: '15:30–18:30', room: '23-3' },
    { n: 11, d: '2026-11-24', t: '19:00–22:00', room: '18-3' },
    { n: 12, d: '2026-11-28', t: '15:30–18:30', room: '23-3' },
  ],
  weeks: [
    { n: 1, en: 'Introduction to International Data Analytics', zh: '国际数据分析导论', rec: true, notes: true, detail: '<p>Tutorial：评估你的起点水平；练习：雕塑家画廊 vs. 自己卖的 Excel 对比。</p><p>阅读：James Bell Associates (2018) 数据驱动决策指南；van Es (2022) Netflix 与大数据。</p>' },
    { n: 2, en: 'Data-driven decisions and cognitive biases (Guest Lecture)', zh: '数据驱动决策与认知偏差（客座讲座）', use: ['a'], pre: true, rec: true, notes: true, detail: '<p>Tutorial：认知偏差如何影响决策。练习：Maya 咖啡车 Excel 建模 + “偏差大战”说服游戏 + 200–250 词小报告。</p><p>阅读：Hammond et al. (1998) 决策中的隐藏陷阱；Soll et al. (2015) 战胜自己的偏差；Soll et al. (2013) 去偏差指南；Lovallo, Kahneman et al. (2020) 你的公司太规避风险。</p>' },
    { n: 3, en: 'Critical Thinking and Why Numbers Can Lie (Guest Lecture)', zh: '批判性思维：数字为什么会说谎（客座讲座）', use: ['a'], pre: true, detail: '<p>Tutorial：提升批判性思维。<b>和报告直接相关</b>：如何识别有误导性的数据和图表。</p><p><b>Moodle 本周放了往届个人报告样例（评估 McKinsey 报告，72 分）和老师反馈</b>，拆解见个人报告素材库。必读：De Veaux & Hand (2005) How to Lie with Bad Data。</p>' },
    { n: 4, en: 'Evaluating Reports', zh: '评估报告', use: ['a'], pre: true, detail: '<p>Tutorial：解读报告以支持决策；报告写作辅导。<b>这一周就是报告作业的方法课</b>（课件每部分都标着 Important for Assessment 1），练习评估 BCG 报告的图表。</p><p>讲座：McKinsey (2018) 多元化与财务表现（文件名写 Lecture 6，Moodle 放在第 4 周）；Excel 练习：50 家公司数据的描述统计、散点图、相关系数。必读：教材第 7 章 Visualising Data Effectively。</p>' },
    { n: 5, en: 'Visualizing Data: Simple descriptive statistics', zh: '数据可视化：简单描述统计', use: ['a', 'b'], detail: '<p>Tutorial：应用描述统计；报告写作辅导</p>' },
    { n: 6, en: 'Analysing Surveys results to test hypotheses', zh: '分析调查结果以检验假设', use: ['a', 'b'], detail: '<p>Tutorial：应用假设检验；报告写作辅导</p>' },
    { n: 7, en: 'Simple regression modelling', zh: '简单回归模型', use: ['a', 'b'], detail: '<p>Tutorial：应用简单回归；报告写作辅导</p>' },
    { n: 8, en: 'Time series Analysis', zh: '时间序列分析', use: ['a', 'b'], detail: '<p>Tutorial：应用时间序列；报告写作辅导</p>' },
    { n: 9, en: 'Emerging Trends in International Data Analytics', zh: '国际数据分析的新趋势', use: ['b'], detail: '<p>Tutorial：分析新趋势；展示辅导</p>' },
    { n: 10, en: 'Simple Mathematical Calculations', zh: '简单数学计算', use: ['b'], detail: '<p>Tutorial：应用简单数学；展示辅导</p>' },
    { n: 11, en: 'Presentations (no lecture)', zh: '小组展示（无讲座）', use: ['b'] },
    { n: 12, en: 'Presentations (no lecture)', zh: '小组展示（无讲座）', use: ['b'] },
  ],
  assessments: [
    {
      id: 'b',
      en: 'Group Presentation',
      zh: '小组展示',
      due: '2026-11-27',
      weight: 50,
      length: '15–20 页幻灯片 · 15–20 分钟 · 个人答问',
      lo: [1, 2],
      notes: [
        '<b>小组人数有冲突</b>：assessment brief 写每组 <b>5 人</b>，老师第 1 次课说 <b>4 人</b>，Sage 案例写 3–4 人。<b>以老师最终说的为准</b>。',
        '<b>PPT 提交（老师说的）</b>：不管哪天展示，<b>所有组都要在 11 月 27 日前提交幻灯片</b>，而且<b>每个组员都要各自上传同一份 PPT</b>。幻灯片相同，但按每个人的讲解单独评分。第一天 3 个组展示，第二天其余的组。',
        '<b>没有小组分</b>：每个人单独评分，按分工和个人表现给分，现场会单独提问。',
        '展示是必须参加的：不参加可能 0 分；无正当理由、未提前通知缺席扣 10%。展示后（或截止日前）在 Moodle 提交 PPT。',
        '展示在第 11–12 次课：<b>11 月 24 日（周二晚）或 11 月 28 日（周六下午）</b>，截止日写 11 月 27 日。请问清你们组是哪一天。',
      ],
      brief: [
        '分析 Moodle 上的 Sage 商业案例 <b>American Egg</b>：找出核心商业问题，用<b>定量和定性方法</b>分析数据，做一个小组展示。',
        '用图表、表格清楚呈现发现，说明这些发现如何<b>支持决策</b>。',
        '15–20 页幻灯片，展示 15–20 分钟；小组和日期由 tutor 确认。',
      ],
      sections: [
        { t: '案例速读（中文）', chip: '案例', html: `
<p><b>公司</b>：American Egg（AmEgg），美国第三代家族蛋品企业，年收入 <b>23.37 亿美元</b>（商品蛋 17.61 亿 + 特色蛋 5.76 亿），利润率 14.7%（商品蛋 12.4%、特色蛋 20%）。业务在美国和加拿大西部。前一年收入曾下跌 48%，之后蛋价翻倍才回升。你的角色是新晋业务发展经理。</p>
<p><b>董事会的三个目标</b>：</p>
<ol><li>三年内年收入超过 <b>35 亿美元</b></li><li>三年内美国业务中<b>特色蛋 ≥30%</b>、商品蛋 ≤70%（现在约 24% / 76%）</li><li>七年内成为<b>全球化公司</b></li></ol>
<p><b>可用的工具</b>：</p>
<ul>
<li>资金：战略储备 3 亿美元 + 可借 5 亿美元（10 年期，年利率 3%）</li>
<li>营销：多花总收入的 0.25% 做特色蛋营销 → 特色蛋有“额外 6% 的上升空间”（这句有歧义：是增长 6%，还是占比多 6 个百分点？展示时要说明你们怎么理解）</li>
<li>特色蛋市场不做营销每年也增长 2.5%</li>
<li>笼养改散养：每投 100 万美元 → 约 500 万美元商品蛋收入<b>转为</b>特色蛋收入（利润 15%）</li>
<li>新建蛋制品加工厂：投 2500 万美元 → 新增 5000 万美元特色蛋收入（利润 20%）</li>
<li>国际化：表 2–6 列出北美、欧洲、拉美、亚洲共 20 家蛋企的规模、收购价区间、EBITA、是否可合资、合资投资额和合资年收益</li>
</ul>
<p><b>案例要求的交付</b>：每个目标至少 2 个<b>数据支撑的</b>子目标；每个子目标列出 2 个有数据支撑的风险和应对措施；最后给出推荐方案。</p>` },
        { t: '先算清楚的几个数', chip: '算数', html: `
<table><thead><tr><th>问题</th><th>算法</th><th>结果</th></tr></thead><tbody>
<tr><td>目标 1 收入缺口</td><td>3,500 − 2,337</td><td>约 11.6 亿美元</td></tr>
<tr><td>需要的年均增长率（CAGR）</td><td>(3,500 ÷ 2,337)<sup>1/3</sup> − 1</td><td>约 14.4% / 年</td></tr>
<tr><td>目标 2：特色蛋需达到</td><td>2,337 × 30%（若美国收入不变）</td><td>约 7.01 亿，需 +1.25 亿</td></tr>
<tr><td>特色蛋自然增长</td><td>576 × 1.025<sup>3</sup></td><td>约 6.20 亿（不够）</td></tr>
<tr><td>额外营销费用</td><td>2,337 × 0.25%</td><td>约 580 万美元 / 年</td></tr>
<tr><td>合资回报率示例</td><td>合资年收益 ÷ 合资投资额</td><td>Cultivos Orgánicos Ahora（墨西哥）：40 ÷ 200 = 20%</td></tr>
<tr><td>收购倍数示例</td><td>收购价 ÷ EBITA</td><td>Cultivos：600–750 ÷ 50 = 12–15 倍</td></tr>
</tbody></table>
<p class="small">建议：把 20 家公司的“收购价区间、EBITA、合资投资、合资年收益”整理成 Excel，算出每家的合资回报率和收购倍数，再按地区比较。这一步就是“定量方法”评分项（15%）的核心。整理完可以发给 Claude 核对。</p>
<p><b>最大的风险：蛋价</b>。现在的收入建立在高蛋价上（图 1 显示过去一年从约 1 美元涨到约 2 美元一打），案例最后又写“温和蛋价约 0.95 美元一打”。如果价格回落，商品蛋收入可能大幅下降，目标 1 会更难。建议做<b>情景分析</b>（高价 / 中价 / 低价）。</p>` },
        { t: '定量 + 定性方法怎么用', chip: '方法', html: `
<p><b>定量（Precision，15%）</b>：缺口分析、CAGR、比率分析（合资回报率、收购倍数、利润率）、情景分析（蛋价）、描述统计（图 1 价格序列的均值、最高最低、波动）。第 8 周时间序列也可以用在蛋价趋势上。</p>
<p><b>定性（Depth，15%）</b>：对表 3–6 的 “Key News”“In-country risk”“Economy” 三列做<b>主题归纳</b>，例如禽流感、战争（乌克兰）、操纵价格调查（美国、孟加拉）、垄断（墨西哥）、高壁垒（日本）、内战（叙利亚）。可以按地区做 PESTLE 或风险热力图。</p>
<p><b>案例数据本身也有问题，可以在展示里指出</b>（体现批判性思维）：</p>
<ul>
<li>摘要说“五年内”收入超 35 亿，正文说“三年内”</li>
<li>案例最后写“Current revenue USD 2.34 million”，应为 billion</li>
<li>表 2 的乌克兰公司名（Novi vesnyani zemli、Mayetok Northwind）和表 4（River Hallow Farms、Northwind Estate）对不上</li>
<li>墨西哥被归在 “South America”</li>
<li>图 1 的横轴只有季度标签，没有具体年份</li>
</ul>` },
        { t: '15–20 页幻灯片怎么分（5 人）', chip: '分工', html: `
<table><thead><tr><th>部分</th><th>页数</th><th>负责</th></tr></thead><tbody>
<tr><td>开场：公司现状 + 三个目标 + 核心问题</td><td>2–3</td><td>成员 A</td></tr>
<tr><td>目标 1：收入增长（缺口、CAGR、蛋价情景）</td><td>3–4</td><td>成员 B</td></tr>
<tr><td>目标 2：特色蛋占比（营销、散养改造、加工厂的组合与投资回报）</td><td>3–4</td><td>成员 C</td></tr>
<tr><td>目标 3：国际化（地区比较、收购 vs 合资、资金约束 8 亿美元）</td><td>3–4</td><td>成员 D</td></tr>
<tr><td>风险与应对 + 推荐方案 + 时间线</td><td>3–4</td><td>成员 E</td></tr>
</tbody></table>
<p class="small">每人负责的部分都要同时有<b>定量和定性</b>内容，因为是按个人评分。</p>` },
      ],
      rubric: [
        { en: 'Focus: Identification of the business problem', zh: '聚焦：识别商业问题', w: 15, d: '是否清楚定义了商业问题？问题陈述是否具体？关键问题和挑战是否都指出了？' },
        { en: 'Insight: Relevance to decision making', zh: '洞察：与决策的关联', w: 20, d: '是否把数据和决策联系起来？洞察是否相关、可执行？发现能否用于做出明智决策？' },
        { en: 'Precision: Use of quantitative methods', zh: '精确：定量方法', w: 15, d: '定量方法是否准确有效？数值分析是否透彻？统计方法是否用得当？' },
        { en: 'Depth: Use of qualitative methods', zh: '深度：定性方法', w: 15, d: '是否用定性方法加深理解？是否识别并解释了主题和规律？' },
        { en: 'Clarity: Visual Clarity', zh: '清晰：视觉呈现', w: 15, d: '图表和幻灯片是否清楚易懂、专业有条理？是否支撑展示的叙事？' },
        { en: 'Engagement: Communication', zh: '吸引力：沟通', w: 10, d: '展示是否吸引人？表达是否清楚？是否容易跟上？' },
        { en: 'Skill: Technical Proficiency', zh: '技能：技术熟练度', w: 10, d: '是否熟练使用数据可视化工具？图表是否准确无误？' },
      ],
      theoriesTitle: '会用到的课程内容',
      theories: ['描述统计（第 5 周）', '时间序列（第 8 周）', '简单数学计算（第 10 周）', '认知偏差（第 2 周）', '数据可视化', '市场进入模式：收购 vs 合资'],
      pitfalls: [
        '只罗列数据，没有说明“所以应该怎么决策”——“洞察”占 20%，是最大的一项。',
        '只有定量没有定性（或反过来）——两项各占 15%。',
        '图表是从案例截图——自己用 Excel / Power BI 重新做图，“技术熟练度”才有分。',
        '只懂自己那部分——个人单独提问，可能问到整体方案。',
        '忘了在 Moodle 提交 PPT。',
      ],
      milestones: [
        { d: '2026-10-06', t: '第 2 次课上确认 5 人小组并把名单交给老师；问清展示日期' },
        { d: '2026-10-16', t: '全组读完 American Egg 案例；按目标分工' },
        { d: '2026-10-30', t: '20 家公司数据整理成 Excel，算出合资回报率和收购倍数' },
        { d: '2026-11-06', t: '各自完成定量 + 定性分析，确定推荐方案' },
        { d: '2026-11-18', t: '幻灯片初稿（15–20 页），组内排练' },
        { d: '2026-11-22', t: '定稿；和 Claude 用英文练个人答问（最早 11/24 展示）' },
      ],
      checklist: [
        '已确认小组（5 人）和展示日期',
        '清楚定义了商业问题和三个目标',
        '每个目标至少 2 个数据支撑的子目标',
        '每个子目标有 2 个风险 + 应对措施',
        '做了缺口分析 / CAGR / 比率分析',
        '做了蛋价情景分析',
        '对表 3–6 的风险信息做了主题归纳（定性）',
        '图表是自己做的，清楚、无误导',
        '有明确的推荐方案和时间线',
        '幻灯片 15–20 页，时间 15–20 分钟',
        '我负责的部分能脱稿讲，并准备好答问',
        '11/27 前我自己上传了全组同一份 PPT',
      ],
    },
    {
      id: 'a',
      en: 'Individual Report',
      zh: '个人报告',
      due: '2026-12-04',
      weight: 50,
      words: 2000,
      length: '2000 词（不含参考文献）',
      lo: [3, 4, 5],
      materials: 'content/comp1913/a-materials.md',
      notes: [
        '<b>Moodle 第 3 周有一份往届个人报告样例</b>（评估 McKinsey《Women in the Workplace 2024》，总分 72，Evaluation / Clarity / Presentation / Focus 各 79）和老师反馈。结构：执行摘要 → 背景 → 评估（4 个主题）→ 建议 → 参考文献。<b>拆解和老师的改进意见见素材库</b>。',
        '老师反馈的三条改进：执行摘要要精炼；<b>用统计数字</b>（例如说明每个主题有几张图）；建议要写给<b>“原本只会依赖这份报告的咨询服务买家”</b>。',
      ],
      brief: [
        '以“桌面案例研究”的方式，批判性评估 <b>Bain & Company《Innovation Report 2025》</b>。',
        '<b>1 商业问题与背景</b>：报告要解决什么商业问题、目的、目标读者、对管理决策的意义。',
        '<b>2 定量证据和可视化</b>：评估图表的清晰度、准确性、是否合适，能否支撑论点；必要时提出更好的图表形式。',
        '<b>3 分析工具</b>：推测这些图可能用什么工具做的（如 BI 或分析软件），评价这些工具是否适合支持决策，并提出改进。',
        '<b>4 数据完整性与认知偏差</b>：数据或呈现方式是否可能导致误读、过度简化或有偏的结论；读者可能受哪些认知偏差影响（如框架效应、确认偏误）。',
        '<b>5 建议</b>：给决策者有证据支撑的建议：应如何解读这些发现，数据和可视化可以怎样改进。',
      ],
      sections: [
        { t: '报告速读（中文）', chip: '速读', html: `
<p><b>来源</b>：Bain 对 <i>Fast Company</i> 2025 年“最具创新力 50 家公司”中的 <b>20 家</b>做了问卷和访谈。作者是 Bain 创新与业务构建的全球负责人及其团队。共四篇文章：</p>
<ol>
<li><b>Built to Reinvent（创新战略）</b>：榜单上 10 家上市满三年的公司中 8 家的三年股东总回报高于行业；94% 计划进入新行业或市场；88% 把创新列为前三大战略重点；约一半研发支出不高于同行；资源分配 39% 持续性、37% 变革性、24% 颠覆性创新。</li>
<li><b>Innovation Rewired（创新与 AI）</b>：AI 在创新各阶段的使用率（现在 vs 五年后）；31% 过去三年把从设计到上市的时间缩短 20% 以上，82% 预计未来五年会做到；88% 说 AI 提高了创新成功率；只有 8% 靠削减研发来投入 AI。</li>
<li><b>Human Insights at Speed（客户洞察）</b>：89% 优先分析客户需求；72% 整合直接用户反馈；68% 依靠客户需求分析；讨论“合成用户画像”的好处和风险。</li>
<li><b>Built to Be Bold（两套创新系统）</b>：用 Tversky & Kahneman 的实验说明人对风险的态度；大企业想要 70/20/10 的创新组合，实际接近 100/0/0；79% 为不同类型创新设置不同运营模式；56% 认为创新组织会更集中化。</li>
</ol>` },
        { t: '图表清单（逐张评估用）', chip: '图表', html: `
<p>报告里的定量图表<b>几乎全是环形图（donut）</b>，页码为报告页脚页码：</p>
<table><thead><tr><th>页</th><th>图表</th><th>可以检查的问题</th></tr></thead><tbody>
<tr><td>4</td><td>94% 计划进入新行业 / 市场</td><td>只有一个数字，用环形图有必要吗？基数是多少？</td></tr>
<tr><td>5</td><td>研发支出 vs 同行：更高 54%、更低 33%、相同 13%</td><td>标题是“创新者不靠多花钱”，但图上<b>多数（54%）花得更多</b>；“更低”和“相同”用醒目的红色，多数的“更高”用浅色。这是不是框架效应？</td></tr>
<tr><td>6</td><td>资源分配：持续性 39%、变革性 37%、颠覆性 24%</td><td>正文说“绝大多数公司把 60% 以上研发投入变革 / 颠覆性创新”，但图只给了<b>整体平均</b>，无法证明“绝大多数”；三类创新也没有定义。</td></tr>
<tr><td>9</td><td>12 个小环形图：AI 在 6 个阶段的使用率，现在 vs 五年后</td><td>“现在 vs 五年后”分在上下两组，很难对比；用分组柱状图或哑铃图会更清楚。五年后是<b>预期</b>，却和实际数据用同样的样式。</td></tr>
<tr><td>10</td><td>31%（过去三年）vs 82%（未来五年）</td><td>把实际结果和预期并排放；两个时间窗口长度不同（3 年 vs 5 年）。</td></tr>
<tr><td>11</td><td>88% 说 AI 提高了创新成功率</td><td>自我报告；“成功率”没有定义，也没有对照组。</td></tr>
<tr><td>14</td><td>89% 优先分析客户需求；72% 整合用户反馈</td><td>问题原文和选项没有给出。</td></tr>
<tr><td>15</td><td>68% 依靠客户需求分析</td><td>正文提到好几种方法（竞争分析、监管趋势、众包等），图上只给了一个数字；用排序柱状图展示全部方法会更有信息量。</td></tr>
<tr><td>19</td><td>79% 按创新类型区分模式；69% 创新深植于文化</td><td>同上。</td></tr>
<tr><td>20</td><td>更集中 56%、更分散 25%、差不多 19%</td><td>问的是“你所在行业”，回答的却是榜单公司的看法。</td></tr>
</tbody></table>
<p><b>一个可以自己验算的发现</b>：所有图表都<b>没有标注样本量</b>。第 9 页的百分比全都能用 16 个回答者解释（10/16 = 62.5% ≈ 63%，7/16 = 43.75% ≈ 44%，16/16 = 100%）；其他图表的数字又对应约 18、19 或 24 个回答者。也就是说，每个问题的样本基数不同，而且始终没有披露。样本这么小，误差很大：n = 16 时，88% 的 95% 置信区间大约是 ±16 个百分点（粗略估计）。这一点可以和第 6 周的假设检验联系起来。</p>` },
        { t: '可以分析的认知偏差', chip: '偏差', html: `
<ul>
<li><b>幸存者偏差 / 选择偏差</b>：只调查了上榜的“赢家”，看不到失败的公司；20 家里由谁回答也不清楚。</li>
<li><b>相关 ≠ 因果</b>：“8/10 的上市公司回报高于行业”只能说明相关，而且样本只有 10 家。</li>
<li><b>框架效应</b>：第 5 页“创新者不靠多花钱”的说法与 54% 花得更多的数据。</li>
<li><b>确认偏误 / 利益冲突</b>：Bain 自己销售创新咨询服务，报告也在推广自己的 “Engine 2” 框架。</li>
<li><b>权威偏差 / 光环效应</b>：Bain 和 Fast Company 的品牌，以及大号红字的高管引语，会让读者更容易相信。</li>
<li><b>锚定 / 显著性</b>：大号百分比数字容易成为读者记住的唯一信息。</li>
<li><b>从众效应</b>：“五年后 100% 会使用 AI”可能让决策者觉得必须跟上。</li>
<li><b>自我报告偏差</b>：全部数据来自受访者自述，例如“AI 提高了成功率”。</li>
</ul>
<p class="small">有意思的是，报告第 17 页自己引用了 Tversky & Kahneman 的框架效应实验，可以拿来对照它自己的呈现方式。</p>` },
        { t: '分析工具怎么写', chip: '工具', html: `
<p>报告没有说明用什么工具做图，所以这部分要写成<b>有依据的推测</b>。可以讨论：</p>
<ul>
<li>图表风格统一、品牌色强，更像是用设计或排版软件（或从 Excel / PowerPoint 导出后再设计）做成的<b>静态</b>图，而不是 BI 工具的交互式仪表盘。</li>
<li>静态 PDF 的局限：看不到原始数据、样本量、问题原文，不能按行业或公司规模筛选。</li>
<li>改进建议：附数据表和方法说明；用 Power BI / Tableau 做可筛选的交互式版本；标注 n 和置信区间；选择合适的图表类型（比较用柱状图，前后变化用哑铃图或斜率图）。</li>
</ul>` },
      ],
      outlineTitle: '建议结构与字数（按 brief 的结构）',
      outline: [
        { s: '1 Executive Summary 执行摘要', w: 150, g: '案例概况、主要发现、主要建议。<b>最后写</b>。' },
        { s: '2 Background 背景', w: 250, g: 'Bain 报告是什么、要解决的商业问题、目的、目标读者、对管理决策的意义。' },
        { s: '3a Evaluation：可视化', w: 750, g: '挑 4–5 张关键图表逐一评估：优点、缺点、信息缺口、可能的误读；给出替代图表（可以自己画改进版）。<b>占 40% 分数，篇幅最多。</b>' },
        { s: '3b Evaluation：分析工具', w: 200, g: '可能用的工具及其局限，适合 / 不适合支持决策的原因。' },
        { s: '3c Evaluation：数据完整性与认知偏差', w: 350, g: '样本、方法缺失；读者可能受到的认知偏差，每个都要联系到具体图表或文字。' },
        { s: '4 Recommendations 建议', w: 300, g: '给决策者的具体建议：怎么解读这份报告、数据和可视化怎么改进。“Focus”一项要求结尾有明确建议。' },
        { s: '5 References 参考文献', g: '学术和业界来源（如可视化原则、认知偏差的学术文献），Harvard 格式，不计字数。' },
      ],
      rubric: [
        { en: 'Depth of critical evaluation', zh: '批判性评估的深度', w: 30, d: '严谨评估内容：优点、缺点、信息缺口、潜在偏差，以及它们如何影响决策和数据解读。' },
        { en: 'Quality and clarity of visualisations', zh: '可视化的质量与清晰度', w: 40, d: '评估图表的有效性、清晰度和适当性；能否准确呈现数据、传达信息；考虑替代的可视化方式。' },
        { en: 'Structure, coherence, and presentation', zh: '结构、连贯性与呈现', w: 20, d: '结构清晰、分节合理、论证连贯、格式专业。' },
        { en: 'Focus', zh: '聚焦', w: 10, d: '紧扣可视化和偏差，关注清晰度、数据完整性、与研究目标和受众的相关性；结尾有明确建议。' },
      ],
      theoriesTitle: '会用到的课程内容',
      theories: ['认知偏差（第 2 周）', '数字为什么会说谎（第 3 周）', '评估报告（第 4 周）', '描述统计与可视化（第 5 周）', '假设检验与样本量（第 6 周）'],
      pitfalls: [
        '只描述图表，不评价——“可视化”占 40%，每张图都要讲优点、缺点和改进。',
        '只批评不给替代方案——brief 明确要求考虑替代的可视化方法。',
        '漏了“分析工具”部分——brief 第 3 点要求写，结构里没单列，放在 Evaluation 里。',
        '偏差讲得太空——每个偏差都要对应到报告里的具体图表或句子。',
        '结尾没有明确建议——“Focus”评分要求。',
        '照抄 Claude 给的要点——这些是帮你看懂报告的线索，要用你自己的分析和语言写。',
      ],
      milestones: [
        { d: '2026-10-16', t: '读完 Bain 报告和网站上的中文速读、图表清单' },
        { d: '2026-10-30', t: '自己挑 4–5 张图写评估笔记（中文即可），发给 Claude 讨论' },
        { d: '2026-11-13', t: '报告大纲 + 每节要点；找 3–5 篇可视化和认知偏差的学术文献' },
        { d: '2026-11-29', t: '报告初稿完成（含自己画的改进图）' },
        { d: '2026-12-02', t: 'Studiosity + Turnitin 预提交' },
        { d: '2026-12-03', t: '报告正式提交（提前一天）' },
      ],
      checklist: [
        '执行摘要：概况 + 发现 + 建议',
        '背景：商业问题、目的、受众、对决策的意义',
        '逐张评估了 4–5 张关键图表（优点 / 缺点 / 缺口 / 误读）',
        '提出了替代的可视化方式（最好附改进图）',
        '评估了可能使用的分析工具及改进',
        '讨论了数据完整性（样本量、方法缺失）',
        '分析了认知偏差，并对应到具体图表',
        '结尾有清晰、有证据的建议',
        '有学术和业界参考文献，Harvard 格式',
        '字数约 2000（不含参考文献）',
        '文件里只有学号，没有名字',
        'Studiosity + Turnitin 预提交',
        '转成 PDF 并提交',
      ],
    },
  ],
  readings: [
    { a: 'Marzoni, F.', t: 'Data Analytics Made Easy: Analyse and present data to make informed decisions without writing any code', p: 'Packt Publishing', core: true },
    { a: 'Mayer-Schönberger, V. and Cukier, K.', t: 'Big Data: A Revolution That Will Transform How We Live, Work, and Think', p: 'Houghton Mifflin Harcourt', core: true },
    { a: 'Maheshwari, A.', t: 'Data Analytics Made Accessible', p: 'Business Expert Press', core: true },
  ],
  websites: [
    { n: 'LibrarySearch（查书和文章）', u: 'https://librarysearch.gre.ac.uk' },
  ],
});
