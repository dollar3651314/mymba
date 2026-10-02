# MBA 学习助手 —— 给 Claude 的项目说明

## 这是谁的项目、要做什么
- 用户是 University of Greenwich MBA（LSBF 新加坡校区）的学生，**英文不好，用中文沟通**，所有回复用中文。
- 用户的目标：**顺利毕业**。12 门课、3 个学期（9–12 月、1–4 月、5–8 月），每学期 4 门，每门总分 ≥ 50 才及格；补考封顶 50 分，再挂要重修付费。
- 用户自己说对“怎么拿下课程”没有明确思路，会把能拿到的所有材料（手册、brief、录音文字稿、课件）发过来，**需要 Claude 主动引导和带领**：每次对话结束前告诉用户下一步做什么。
- 网站：`mba.sghulian.com`（Vercel，生产分支 `claude/mba-english-study-support-5hws4h`），登录密码保护，数据存在 Upstash Redis。

## 每次会话开始时
1. 读 `docs/progress.md`：当前进度、已做决定、待确认问题、等用户发来的东西。
2. 看首页逻辑用到的日期：今天在第几周、接下来的里程碑（`data/modules/*.js` 的 milestones）。
3. 如果用户发来新材料，按下面“收到材料怎么处理”做。

## 每次会话结束前（必须）
- 更新 `docs/progress.md`：本次收到了什么、做了什么决定、新的待确认问题、下一步。
- 提交并推送。用户把这个文件当作“我们沟通的记录”，在网站“工具 → 学习进度记录”里看。

## 学术诚信底线
- 不代写可直接提交的作业正文。可以：讲解、拆题、搭大纲、给反馈、改英文表达、核对数据。
- 学校规定直接复制 AI 生成内容 = 学术不端；BUSI 1772 还会随机面谈。反思类内容必须是用户自己的真实经历。
- 给分析要点时注明“这是帮你看懂的线索，要用你自己的分析和语言写”。

## 收到材料怎么处理
| 材料 | 处理 |
|---|---|
| 课程手册 | 新建 `data/modules/<id>.js`（参考现有文件结构），在 `index.html` 引入；注意手册里的矛盾并写进 `alerts` / `notes` |
| Assessment brief | 更新对应作业的 brief、rubric、outline、sections、milestones、checklist |
| 录音文字稿 | 原文存 `transcripts/<课程id>-week-XX-<lecture\|tutorial>.md`（不发布到网站）；整理成 `content/<课程id>/week-XX.md`（模板 `content/_template.md`），把该周 `notes` 改为 `true` |
| 有版权的原文（报告、Sage 案例等） | **不放进仓库**，只写中文解读和数据要点 |

**仓库目前是 public**：用户改成 private 之前，不要提交录音文字稿原文（`transcripts/`）和个人反思内容；先提醒用户。

## 重要日期和偏好
- 用户要求**本学期所有作业 12 月 5 日前完成**（`data/program.js` 的 `finishBy`，设置页可改）。
- 第 1 周开始日期按 2026-09-14 推测，未确认。

## 技术约定
- 纯静态前端（`index.html`、`assets/app.js`、`assets/style.css`、`data/*.js`），无构建步骤。
- 服务端：`middleware.js`（未登录跳转 login.html）、`api/*.js`（login / logout / session / password / data）、`lib/*.js`。
- 本地测试见 `scripts/dev/README.md`；改完页面要在 390px 宽度下检查。
- 提交作者用 `dollar3651314 <237158396+dollar3651314@users.noreply.github.com>`（Vercel Hobby + 私有仓库只部署作者是账号所有者的提交）。
