# MBA 学习助手

University of Greenwich MBA（LSBF 新加坡校区）的中文学习引导网站。纯静态网页，手机和电脑都能用，可部署到 Vercel。

## 功能

- **首页**：下一个截止日期倒计时、本周任务勾选、近期待办、12 门课毕业进度
- **课程**：每门课的作业、12 周课程表、学习目标、阅读资料、联系人
- **作业拆解**：要求、评分标准、建议结构和字数、易错点、时间计划、完成清单
- **每周页面**：本周任务、整理好的课堂笔记（由录音文字稿整理）、我的 tutorial 笔记
- **笔记**：tutorial 笔记记录，可一键复制发给 Claude、下载 .md
- **词汇**：中英术语表，可搜索、按分类筛选
- **工具**：写作助手（提交前检查、Harvard 引用、常用句型）、成绩计算、学校规则、设置与备份

笔记、勾选和成绩保存在服务器（Upstash Redis），不同浏览器和设备登录后共享进度。打开网站需要输入密码，默认 `123456`，可在“工具 → 设置”里修改。

## 部署到 Vercel

1. 在 Vercel 中 Import 这个 GitHub 仓库
2. Framework Preset 选 **Other**，Build Command 和 Output Directory 留空
3. **添加数据库**：项目页 → Storage → Create Database → 选 **Upstash for Redis**（免费档即可）→ 连接到本项目（Production、Preview、Development 都勾上）
4. 到 Deployments 里对最新部署点 **Redeploy**，让环境变量生效
5. 打开网站，用默认密码 `123456` 登录，然后马上在设置里改密码

没配置数据库时，登录页会提示“服务器存储还没配置”。

### 私有仓库注意

Vercel Hobby（免费）计划下，私有仓库只部署**作者是 Vercel 账号所有者**的提交。这个仓库的提交作者设为 `dollar3651314`（GitHub noreply 邮箱），所以设为私有后仍能自动部署。

手机上打开后，可以“添加到主屏幕”，像 App 一样使用。

## 目录结构

| 路径 | 内容 |
|---|---|
| `index.html`、`login.html`、`assets/` | 网页和程序 |
| `middleware.js` | 访问任何页面前检查登录 |
| `api/` | 服务器接口：登录、退出、改密码、读写学习数据 |
| `lib/` | Redis 客户端、密码和会话签名 |
| `data/program.js` | 学期、学校规则、联系人 |
| `data/modules/*.js` | 每门课的数据（新课程在这里添加，并在 `index.html` 引入） |
| `data/glossary.js` | 术语表、常用句型、Harvard 示例、提交清单 |
| `content/<课程>/week-XX.md` | 每周课堂笔记（由录音文字稿整理） |
| `transcripts/` | 原始录音文字稿（不发布到网站） |

## 每周流程

1. 课前把课件发给 Claude → 中文讲解
2. 课后把整堂课的录音文字稿发给 Claude → 整理成 `content/` 下的课堂笔记，网站自动更新
3. 在网站“笔记”页记录 tutorial 经历，复制发给 Claude
