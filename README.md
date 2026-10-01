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

笔记、勾选和成绩保存在浏览器本地（localStorage），不会上传；换设备前请在“设置”页导出备份。

## 部署到 Vercel

1. 在 Vercel 中 Import 这个 GitHub 仓库
2. Framework Preset 选 **Other**，Build Command 和 Output Directory 留空
3. Deploy。之后每次推送到生产分支都会自动更新

手机上打开后，可以“添加到主屏幕”，像 App 一样使用。

## 目录结构

| 路径 | 内容 |
|---|---|
| `index.html`、`assets/` | 网页和程序 |
| `data/program.js` | 学期、学校规则、联系人 |
| `data/modules/*.js` | 每门课的数据（新课程在这里添加，并在 `index.html` 引入） |
| `data/glossary.js` | 术语表、常用句型、Harvard 示例、提交清单 |
| `content/<课程>/week-XX.md` | 每周课堂笔记（由录音文字稿整理） |
| `transcripts/` | 原始录音文字稿（不发布到网站） |

## 每周流程

1. 课前把课件发给 Claude → 中文讲解
2. 课后把整堂课的录音文字稿发给 Claude → 整理成 `content/` 下的课堂笔记，网站自动更新
3. 在网站“笔记”页记录 tutorial 经历，复制发给 Claude
