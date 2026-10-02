// 项目通用信息：学期、规则、课程位次。新课程在 data/modules/*.js 里通过 MBA.addModule() 注册。
window.MBA = {
  program: {
    name: 'University of Greenwich MBA',
    campus: 'London School of Business & Finance · 新加坡校区',
    totalModules: 12,
    perTerm: 4,
  },
  // start：第 1 周周一（推测值，可在“设置”页修改）；finishBy：我的完成目标，所有作业最晚这天前完成
  terms: [
    { id: 't1', name: '学期 1', period: '2026 年 9 月 – 12 月', start: '2026-09-14', finishBy: '2026-12-05' },
    { id: 't2', name: '学期 2', period: '2027 年 1 月 – 4 月', start: '2027-01-11' },
    { id: 't3', name: '学期 3', period: '2027 年 5 月 – 8 月', start: '2027-05-10' },
  ],
  modules: [],
  addModule(m) { this.modules.push(m); },

  rules: [
    { k: '及格线', v: '每门课总分 ≥ 50 分', tip: '12 门课都要及格才能毕业。' },
    { k: '学位等级', v: 'Distinction ≥ 70 · Merit 60–69 · Pass 50–59', tip: '按所有课程的平均分计算。' },
    { k: '补考', v: '第一次不及格可补考，成绩封顶 50 分', tip: '补考要在作业开头加一段（最多 200 词）说明根据反馈改了什么。' },
    { k: '重修', v: '补考仍不及格 → 重修整门课，需再次付费', tip: '所以每门课都要争取第一次就过。' },
    { k: '宽限期', v: '截止后 2 天内提交，不扣分、不用申请', tip: '这是安全网，不要把它当成正常截止日。' },
    { k: '延期（EC）', v: '超过 2 天需在线填表自证，最长 7 天', tip: '每年最多 3 次；用满 7 天提交时要注明是在“特殊情况”下提交。' },
    { k: '提交格式', v: 'PDF 文件，通过 Moodle 提交', tip: 'Word 转 PDF，防止排版错乱。' },
    { k: '匿名评分', v: '不写名字，只写学号', tip: '封面、页眉、文件名都只用学号。' },
    { k: '查重', v: 'Turnitin，截止前可多次提交看报告', tip: '报告生成可能要 10 分钟到 4 小时；至少提前一天提交第一次。' },
    { k: '相似度', v: '看来源和性质，不是看某个固定百分比', tip: '连续两句以上和网上原文一致就必须改写并标注出处。' },
    { k: '引用格式', v: 'Harvard', tip: '掌握三件事：直接引用、转述、参考文献列表。' },
    { k: 'AI 使用', v: '学校推荐 Copilot 辅助理解文献', tip: '直接复制粘贴 AI 生成的内容 = 学术不端。' },
    { k: '语言检查', v: 'Studiosity（用 Google 账号登录）', tip: '先 Studiosity 润色，再交 Turnitin 查重。' },
    { k: '成绩反馈', v: '录音说 5 周内；BUSI 1764 手册写 15 个工作日', tip: '两者不一致，以学校通知为准。' },
    { k: '考勤', v: '二维码签到，迟到记 late', tip: '手册明确写：缺勤与挂科直接相关。' },
    { k: '存储', v: '学校免费提供 Office 365 和 OneDrive', tip: '作业一律存在 OneDrive，防止电脑丢失或中毒。' },
    { k: 'IT 问题', v: '提交工单（raise a ticket）', tip: '同一问题在原工单下回复，不要重复开新单。' },
  ],

  databases: ['Business Source Premier (EBSCO)', 'SAGE', 'Taylor & Francis', 'Emerald', 'JSTOR', 'LSEG（金融数据）'],

  contacts: [
    { role: '课程事务（Programme Executive）', name: 'Ms Jocelyn Tan', email: 'yfjtan@lsbf.edu.sg', tel: '+65 6580 7579' },
    { role: '学术经理（Academic Manager）', name: 'Mr Keith Soh', email: 'ksoh@lsbf.edu.sg' },
  ],
};
