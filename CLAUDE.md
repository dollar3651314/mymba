# MBA 学习助手 —— 给 Claude 的项目说明

## 这是谁的项目、要做什么
- 用户是 University of Greenwich MBA（LSBF 新加坡校区）的学生，**英文不好，用中文沟通**，所有回复用中文。
- **最高优先级（用户 2026-10-02 明确）：完成作业、通过课程、拿到证书。** 一切工作围绕这个目标；网站功能只做对完成作业有直接帮助的，不做锦上添花的东西。
- 用户的目标：**顺利毕业**。12 门课、3 个学期（9–12 月、1–4 月、5–8 月），每学期 4 门，每门总分 ≥ 50 才及格；补考封顶 50 分，再挂要重修付费。
- 用户自己说对“怎么拿下课程”没有明确思路，会把能拿到的所有材料（手册、brief、录音文字稿、课件）发过来，**需要 Claude 主动引导和带领**：每次对话结束前告诉用户下一步做什么。
- 网站：`mba.sghulian.com`，登录密码保护，数据存在 Upstash Redis。**2026-10-16 起从 Vercel 搬到 Cloudflare Pages**（Vercel 免费版因同账号其他项目用完 CPU 额度被暂停）；生产分支仍是 `claude/mba-english-study-support-5hws4h`。

## 每次会话开始时（每日更新流程，用户 2026-10-02 明确要求）
用户会**每天**来找 Claude 更新网站，并持续补充资料。不管用户这次说了什么，都先按教学时间表做一遍下面的更新，不用等用户交代：
1. 读 `docs/progress.md`：当前进度、已做决定、待确认问题、等用户发来的东西。
2. 运行 `node scripts/status.mjs`（按新加坡时间列出：已上完未收录音的课、7 天内没有预习包的课、8–14 天后的课、过期待办、14 天内的待办 / 里程碑 / 截止）。
3. 按结果更新网站：
   - 用户发来的新材料先处理（见下面“收到材料怎么处理”）。
   - **已经过去的课**：录音没到就提醒用户；课上要问的问题（todos）过了日期，问用户老师怎么答的，据此更新作业日期、规则，删掉或改掉过期待办。
   - **过期的待办和里程碑**：问用户是否完成；没完成的往后排，并检查对后面计划和 12/5 完成目标的影响。
   - **7 天内的课**：缺预习包就列出要下载的课件；8–14 天的课可以提前让用户下载（需要时给本地 Claude Code 写下载提示词，**直接贴在回复里，不要放在 md 文件里**）。
   - 更新 `docs/progress.md` 的“下一步”，让它反映今天的日期。
4. **评估作业准备度（用户 2026-10-06 要求）**：每次收到录音 / 课件，都要想一想积攒的信息够不够做每份作业——够了就告诉用户“可以开始了”并带着开始做；不够就说清楚还差多少、差什么、等谁、哪天能齐。更新 `data/readiness.js`（status / pct / have / missing / next，改 `readinessUpdated`；**已经开始写的作业加 `done`（完成度 %）和 `steps`**，网站就显示“写作中 · 完成 X%”，用户 2026-10-19 要求）和 `docs/progress.md` 的准备度表。
5. 回复用户时给一份**今日简报**：今天 / 明天的课和课前要做的事、欠的录音和课件、快到期的作业节点、需要用户回答的问题。

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
| 录音文字稿 | 原文存 `transcripts/<课程id>-week-XX.md`（不发布到网站）；整理成 `content/<课程id>/week-XX.md`（模板 `content/_template.md`），把该周 `rec` 和 `notes` 改为 `true` |
| **下一节课的课件（预习）** | 写**预习包** `content/<课程id>/week-XX-pre.md`（模板 `content/_preview_template.md`），把该周 `pre` 设为 `true`；“可以在课上说的英文”“想问老师的问题”每条写成 `- "English" —— 中文`，“必会术语”用表格（英文 | 中文 | 一句话），改完运行 `node scripts/build-practice.mjs` 更新跟读练习数据，再运行 `TTS_CA=/root/.ccr/ca-bundle.crt python3 scripts/build-audio.py` 生成新句子的真人风格录音（`audio/`，微软 Edge 神经网络语音 en-GB-SoniaNeural，已有的跳过；用户嫌手机自带朗读太机械）；课件内容同时整理进 `week-XX.md` 的“课件补充”和作业素材库 |
| 录音 / 课件里对作业有用的内容 | 追加到该作业的**素材库** `content/<课程id>/<作业id>-materials.md`（按评分标准分区，注明出自第几次课；作业数据里用 `materials` 字段引用）。目前有 BUSI 1764 的 A1、A2；其他作业有了足够素材后新建 |
| 正在写的作业（资料卡、大纲、参考稿、参考文献、用户的草稿） | 放进该作业的**写作区** `content/<课程id>/<作业id>-workspace.md`（作业数据 `workspace` 字段），显示在作业页最上面、首页“正在写的作业”；按“现在要用的”排在前面 |
| 用户自己做的文件（PPT、Word 演讲稿等），要在网站上查看 / 下载 | 存到 `content/<课程id>/files/`（英文文件名），在写作区顶部用 `<a class="btn" href="/content/..." download>` 放下载按钮；新版本覆盖旧文件 |
| 演讲稿（要跟读练习的） | 按页、按句写成 `content/<课程id>/speech-<作业id>.md`（`## 第 N 页 · 标题` 下每句 `- "English" —— 中文`），运行 `node scripts/build-practice.mjs` 和 `build-audio.py`；跟读页“演讲稿”类型显示，直达链接 `#/practice/<课程id>/speech`。演讲稿改了要同步改这个文件 |
| 有版权的原文（报告、Sage 案例等） | **不放进仓库**，只写中文解读和数据要点 |

仓库已于 2026-10-02 设为 **private**，可以提交录音文字稿原文。不要在仓库里写用户的真实姓名和学号。

## 重要日期和偏好
- 用户要求**本学期所有作业 12 月 5 日前完成**（`data/program.js` 的 `finishBy`，设置页可改）。
- **课表**：每门课 12 次课，写在 `data/modules/<id>.js` 的 `sessions`；**第 n 次课 = 手册第 n 周**（不是按日历周）。学期 1 第一次课 9/24。
- **录音不用用户标注**：用户发来录音文字稿时，按内容和课表日期判断是哪门课第几次课；收到后把该周 `rec` 设为 `true`（首页“要发给 Claude 的录音”会自动去掉）。拿不准时问用户日期。
- 首页会列出“已上完但还没发录音”的课，这就是对用户的提醒；每次对话也要主动提醒还欠哪些录音。
- **课前预习也是固定流程**：首页“要预习的课”列出 7 天内要上、但还没有预习包的课。每次对话都要主动提醒用户下载哪几节课的课件（Canvas / Moodle 上的 tutorial slides 和 mini-lecture），收到后做预习包。
- 停本地测试服务器用 `pkill -f "scripts/dev/[d]evserver"`（带方括号），而且**要单独一条命令执行**，不要和启动服务器的命令放在同一个 shell 里（否则会匹配到自己把 shell 杀掉）。
- **录音转写（2026-10-03 起）**：手机转写软件对老师的英文识别很差，不能用。用户把录音（mp4 / m4a）切成约 30 分钟一段发来，Claude 用 `faster-whisper` 的 **large-v3** 模型转写（`pip install faster-whisper`；ffmpeg 转 16kHz 单声道 wav；`language='en'`、`vad_filter=True`、`condition_on_previous_text=False`；在 4 核 CPU 上每 30 分钟录音约 20 分钟）。多段排队依次转写。**不要用 `initial_prompt` 放关键词列表**，模型会在静音处把提示词原样重复出来。笔记只写听清了的内容，注明录音时间；听不清的不写、不猜。
- 用户发来的“录音文字稿”实际是 AI 生成的课堂笔记，术语常被转错（如“卮言主义”= 后果主义）。整理时纠正并注明；用户说他会忽略临时安排、老师要求和课程技巧，**这些要专门提取出来**，写进课程的 `alerts` / `todos` / 作业 `notes` / milestones，并列出录音里提到但缺少的资料。

## 技术约定
- 纯静态前端（`index.html`、`assets/app.js`、`assets/style.css`、`data/*.js`），无构建步骤。
- 服务端（两套并存，共用 `lib/auth.js`、`lib/redis.js`）：
  - **Cloudflare Pages（现用）**：`functions/_middleware.js`（未登录跳转 /login）、`functions/api/*.js`、`lib/cf.js`；构建 `node scripts/build-pages.mjs` → `dist/`（只发布网页、data、content、docs/progress.md，录音原文等不发布）；`wrangler.toml` 开 `nodejs_compat`。环境变量 `KV_REST_API_URL`、`KV_REST_API_TOKEN` 在 Cloudflare 项目设置里。
  - Vercel（旧）：`middleware.js`、`api/*.js`、`lib/http.js`。
  - Cloudflare 免费版每次请求约 10 ms CPU：密码哈希用 PBKDF2（2 万次迭代），旧的 scrypt 哈希在登录成功时自动换掉。
- 本地测试见 `scripts/dev/README.md`；改完页面要在 390px 宽度下检查。
- `scripts/status.mjs`：每日更新用的状态清单，可传日期参数模拟某一天（`node scripts/status.mjs 2026-10-10`）。
- 提交作者用 `dollar3651314 <237158396+dollar3651314@users.noreply.github.com>`（Vercel Hobby + 私有仓库只部署作者是账号所有者的提交；Cloudflare 没有这个限制，照旧即可）。
