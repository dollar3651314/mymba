> ⏱ 预习约 30 分钟（想练 Power BI 的话再加 1 小时）。先读“一句话”和“要点”，再看术语；上课时带着“想问的问题”。
> 第 12 次课：**11 月 28 日（周六）15:30–18:30，23-3 教室**。资料来源：Moodle “Lecture 12: No lecture recording – Revision & Presentation Prep” 一节里的两个文件：Power BI 报告 `Latest Developments PBI.pbix`（Moodle 名 “PowerBI report – Consultancy Trends”）和 `Sample data.xlsx`（Power BI Action Learning Session 用的数据），10/13 下载。**这一周没有课件，也没有录像。**

## ⚠️ 先看这三点：这节课在展示截止日之后
- **时间顺序**：11/24（周二）第 11 次课 = 展示 → **11/27 每个组员都要上传同一份 PPT（截止）** → **11/28（周六）第 12 次课**。所以第 12 次课**在 PPT 截止之后**，Moodle 上写的“展示准备（Presentation Prep）”对我们来说**来不及用**。
- 老师说展示分两天，第一天 3 个组、第二天其余的组（网站作业页记的是 11/24 或 11/28）。**如果你们组排在 11/28 展示**，这节课就是你们的展示日：PPT 11/27 已经交了，**当天不能再改幻灯片**，只能练讲解和答问。**你们组是哪一天，还没确认**——请问老师或组长，告诉 Claude。
- 想在展示里用 **Power BI** 做图（“技术熟练度”占 10%），就要**在 11/22 定稿前自己练**，不能等这节课。没时间就用 Excel 做图，一样可以。这节课的 Power BI 内容**更适合用在个人报告（12/4）**的“分析工具”部分。

## 这节课一句话
**复习 + Power BI 实操（Action Learning）**：用一份“十大咨询公司”的样例数据，在 Power BI 里做一页交互式报告（柱状图、环形图、筛选器、数字卡片）。对你来说，最大的用处是**个人报告第 3 部分“分析工具”**：亲手用过 BI 工具，才能有根据地评价 Bain 报告的静态图表、提出改进。

## 课前必做
- [ ] 在 Moodle 第 12 周下载 `Latest Developments PBI.pbix` 和 `Sample data.xlsx`
- [ ] 确认能不能用 **Power BI Desktop**（Claude 的了解：免费，但**只有 Windows 版**；Mac 要用学校电脑或网页版 Power BI，网页版要学校账号有权限——**不确定学校是否开通，问老师**）
- [ ] 打开 `Sample data.xlsx` 看一遍（下面有说明），找出数据里的问题
- [ ] 想练的话：在 Power BI 里“获取数据 → Excel → 选 Firms Data 表”，照下面“这份 Power BI 报告里有什么”做一个柱状图和一个筛选器
- [ ] 带上个人报告的大纲 / 草稿，课上有复习时间就问老师
- [ ] 如果你们组 11/28 展示：带上讲稿，提前到

## 要点（Claude 看到的两个文件）

### 1. Sample data.xlsx（一张表 “Firms Data”，10 家公司）
列：排名、公司名、是否合并 / 拆分而来、总部、模式（Traditional / Modernising）、合作大学、成立年份、主要服务、年收入（**同一个数写了三遍**：数字、“$10,000,000,000” 文字、“$10 billion” 文字）、Top theme（数字代码 + 文字）、Priority 1–3、Technology / Innovation / Societal change（比例，用 `=1/3` 这类公式）、其他备注。

| 排名 | 公司 | 年收入（表里写的） | Top theme | Technology / Innovation / Societal change |
|---|---|---|---|---|
| 1 | McKinsey & Company | $10 billion | Equal spread（平均分布） | 1/3、1/3、1/3 |
| 2 | Boston Consulting Group | $11.0 billion | Innovation | 1/3、2/3、0 |
| 3 | **Bain & Company** | **$4.5 billion** | **Innovation** | 1/3、2/3、0 |
| 4 | Kearney | $1.3 billion | Technology | 2/3、1/3、0 |
| 5 | Accenture | $61.6 billion | Technology | 2/3、1/3、0 |
| 6 | Oliver Wyman | $1.8 billion | Societal change | 1/3、0、2/3 |
| 7 | Booz Allen Hamilton | $9.06 billion | Technology | 1、0、0 |
| 8 | Deloitte | $27.9 billion | Societal change | 1/3、0、2/3 |
| 9 | PwC | $43.0 billion | Technology | 2/3、1/3、0 |
| 10 | Ernst & Young | $45.0 billion | Societal change | 0、1/3、2/3 |

- 三个比例是从 Priority 1–3 算出来的：Claude 推测代码 **1 = Technology、2 = Innovation、3 = Societal change**，三个优先事项里各占几个就是几分之几（例：BCG 的优先事项是 2、1、2 → Innovation 2/3、Technology 1/3）。表里没写这个规则，是 Claude 从数据反推的。
- 10 家年收入加起来约 **$2,151.6 亿**（Claude 算的）。
- 备注里有几条投资新闻：Accenture 2023 年 6 月宣布三年投 30 亿美元做数据和 AI；Booz Allen 2022 年 7 月成立风投部门（首期 1 亿美元）；PwC 2021 年 6 月宣布 5 年投 4,000 万英镑建研发中心；EY 2021 年 9 月宣布三年投 25 亿美元做技术。

**⚠️ 这份数据的问题（正好练“数据完整性”）**
- **“Top 10” 按什么排名没有说**：不是按收入（Accenture 收入最高却排第 5，Bain 排第 3 但收入倒数第三）。
- **收入是哪一年、是全公司还是只算咨询业务，都没写**。Deloitte、PwC、EY 有审计和税务业务，Accenture 有大量技术外包——和 Bain 这种纯战略咨询公司直接比收入，**不是同类比较**。
- **同一个数存三遍**（数字 + 两种文字格式），文字格式的不能直接求和；“Merger or Acquisition” 一列有的是 0，有的是文字；“None” 写成文字——在 Power BI 里要先**清理数据类型**。
- 来源：Power BI 报告里写的是 **“Rhonda A. Best, August 2023 (primary research)”**——课程负责人自己整理的；“优先事项”是怎么判断出来的，没有说明方法。

### 2. Latest Developments PBI.pbix（Claude 没法用 Power BI 打开，只读了文件里的版面设置）
一页报告，大标题 **“The latest developments according to the Top 10 Firms in 2023”**，包括：
- **柱状图**：每家公司的 Societal change、Technology、Innovation 三个比例
- **环形图（donut）**：三个主题各占的总比例
- **筛选器（slicer）**：按 Top theme 筛选——点一下就只看某一类公司
- **两个数字卡片**：年收入合计；一个叫 “Groupings” 的字段（Excel 里没有这一列，可能是在 Power BI 里新建的，Claude 不确定）
- **文字框** “Key Influencing Factors”：客户想要什么、可用的技术、工作模式（远程、混合）、社会优先事项
- 来源说明：Rhonda A. Best, August 2023 (primary research)

## 必会术语（中英）
| 英文 | 中文 | 一句话 |
|---|---|---|
| Business intelligence (BI) tool | 商业智能工具 | Power BI、Tableau 这类做交互式报告的软件 |
| Power BI Desktop / .pbix | Power BI 桌面版 / 报告文件 | 微软的 BI 工具和它的文件格式 |
| Dashboard / report page | 仪表盘 / 报告页 | 一页放多张互相联动的图 |
| Slicer | 筛选器 | 点选后整页图表只显示选中的部分 |
| Card visual | 数字卡片 | 只显示一个关键数字 |
| Clustered column chart | 簇状柱形图 | 每个类别几根柱子并排比较 |
| Donut chart | 环形图 | 饼图中间挖空；类别多时很难比较 |
| Data cleaning | 数据清理 | 统一格式、修正类型、去掉重复 |
| Data type | 数据类型 | 数字、文字、日期——文字格式的数字不能计算 |
| Primary research | 一手研究 | 自己收集的数据 |
| Interactive vs. static visualisation | 交互式 vs. 静态可视化 | 能筛选、钻取 vs. 只能看 |
| Revision | 复习 | 课程最后一周 |

## 这节课和作业的关系
> 这是帮你看懂的线索，要用你自己的分析和语言写。

**个人报告（Bain《Innovation Report 2025》，12/4）——最有用**
- **第 3 部分“分析工具”**：brief 要求推测 Bain 用什么工具做图、评价是否适合支持决策、提出改进。亲手用过 Power BI 后可以写得具体：**静态 PDF 不能筛选**（例如按行业、公司规模看），**交互式报告可以加筛选器、显示样本量、点开看原始数据**。也要写 BI 工具的缺点：需要原始数据、读者要会用、设计不好一样会误导。
- **第 2 部分“可视化”**：老师自己的 Power BI 样例也用了**环形图**——Bain 报告几乎全是环形图。可以讨论什么时候环形图合适（2–3 个部分、看占比），什么时候柱状图更好（比较多个类别，例如 10 家公司 × 3 个主题）。
- **第 1 部分“背景”**：样例数据里 Bain 的“主题”是 **Innovation**，正好和《Innovation Report》对上——**Bain 自己卖创新咨询服务**，这和素材库里“利益冲突 / 确认偏误”的观点有关。但这份数据来源不明、收入年份不明，**报告里要引用就找官方或可靠来源**，不要直接用这张表的数字。
- **第 4 部分“数据完整性”**：这份样例数据的问题（排名标准不明、不同类型公司放在一起比、格式不统一、方法没说明）和 Bain 报告的问题（样本量不披露、问题原文没给）是同一类，可以在笔记里对照。

**小组展示（American Egg，PPT 11/27 前提交）**
- 这节课在截止日之后，**对展示没有直接帮助**。想用 Power BI 给 20 家蛋企做一页“地区 / 收购价 / 合资回报”的交互图，要**11/22 前**自己做；做不出来就用 Excel，图清楚、数字准确更重要。
- 如果你们 11/28 展示：老师会单独提问，准备好**你负责那部分的数字是怎么算的**（例如 CAGR 14.4%、合资回报率、借款利息）。可以先和 Claude 用英文练答问。

## 课上可能讨论的问题（先想好你的看法）
1. 这份 “Top 10” 是按什么排的？把 Deloitte、PwC 和 Bain 放在一起比收入公平吗？
2. 用环形图显示三个主题的占比，和用柱状图比较 10 家公司，哪个更能说明问题？
3. 交互式报告比静态 PDF 好在哪？对一个只想看结论的高管，交互式一定更好吗？
4. 如果你要用这份数据写报告，第一步要清理哪些问题？

## 可以在课上说的英文
- "The ranking is not based on revenue, because Accenture has the highest revenue but is ranked fifth." —— 排名不是按收入排的，因为 Accenture 收入最高，却排在第五。
- "The revenue is stored as both numbers and text, so we need to clean the data types first." —— 收入数据有的存成数字、有的存成文本，所以我们要先清理数据类型。
- "It is not a fair comparison, because Deloitte and PwC also have audit and tax services." —— 这不是公平的比较，因为 Deloitte 和 PwC 还有审计和税务业务。
- "A slicer lets users filter the whole report page, which a static PDF cannot do." —— 切片器能让用户筛选整个报告页面，这是静态 PDF 做不到的。
- "A donut chart is fine for two or three parts, but a column chart is better for comparing ten firms." —— 环形图适合两三个部分，但要比较十家公司，柱形图更好。
- "In my report, I will argue that Bain's charts would be more useful if readers could filter by industry and see the sample size." —— 在我的报告里，我会论证：如果读者能按行业筛选、并看到样本量，Bain 的图表会更有用。

## 想问老师的问题
- "The group presentation slides are due on 27 November, but this session is on 28 November. Is our group presenting today, or on 24 November?" —— 小组展示课件 11 月 27 日截止，但这次课是 11 月 28 日。我们小组是今天展示，还是 11 月 24 日？
- "Can we use Power BI on the campus computers? Is Power BI available with our university account?" —— 我们可以在学校电脑上用 Power BI 吗？用我们的大学账号能使用 Power BI 吗？
- "How was the Top 10 ranking in the sample data decided, and which year is the revenue from?" —— 样本数据里的前 10 名排名是怎么定的？收入是哪一年的？
- "In the report, is it enough to suggest that Bain could use an interactive BI dashboard, or should we include an example chart we made ourselves?" —— 在报告里，只建议 Bain 可以使用交互式 BI 仪表板就够了吗，还是应该附上一张我们自己做的示例图表？
- "Is there an AI use report that we need to submit with the individual report?" —— 个人报告需要同时提交一份 AI 使用报告吗？
