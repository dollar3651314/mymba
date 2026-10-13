> ⏱ 预习约 40 分钟（有 Excel 练习）。先读“一句话”和“要点”，再看术语；上课时带着“想问的问题”。
> 第 10 次课：**11 月 21 日（周六）15:30–18:30，23-3 教室**。资料来源：Tutorial 课件《10 Tutorial – Simple Mathematical Calculations》（PDF）、《Cloudy Drizzle Instructions》（PDF）、《Activity 5 – Data for Problem Solving》（Word）、两份 Masala Brews 数据（Excel），10/13 从 Moodle 下载。**没有讲座课件**，只有两段录像。

## ⚠️ 先看这四点
- **这是展示前的最后一次普通课**：11/24（周二）就是第 11 次课（展示），**11/27 前每个组员都要上传同一份 PPT**。按网站计划，11/18 已经有幻灯片初稿、11/22 定稿——所以这节课的 Excel 技巧要**用在定稿前**。
- **Cloudy Drizzle 练习和 American Egg 几乎是同一道题**：“自己建（借钱）还是收购”、贷款利息、机会成本、风险打分——**AmEgg 案例也能借 5 亿美元（10 年、年利率 3%），也要比较收购和合资**。课前先做一遍，课上就能直接搬到展示里。
- **Cloudy Drizzle 说明里没有写案例背景**（公司是谁、两个选项具体是什么），只有 Excel 步骤。背景可能在讲座录像里，**看录像时留意**。
- 第 2 段录像在 Moodle 上的文件名是 “Lecture7_Part 2_LO2”，名字和这一讲对不上，**打开后确认内容是不是这一讲**；不是的话课上问老师。

## 这节课一句话
**用简单的数学（平均数、比例、增长率、贷款公式、机会成本、加权打分）帮管理层做决定。**两个练习：Masala Brews 咖啡馆**丢了第四季度的每日销售记录**，怎么用前 9 个月的数据估算回来；Cloudy Drizzle **自建工厂还是收购对手**，用 Excel 的 `PMT`、`FV` 算贷款利息和机会成本，再比风险。

## 课前必做
- [ ] 看 Moodle 第 10 周的两段**讲座录像**（Part 1 – LO1、Part 2 – LO2，需要登录）；Moodle 上还有一段 **Tesco 配送中心**的 YouTube 视频
- [ ] 下载 `Tutorial 10 - Masala Brews Dataset.xlsx`（带数据透视表的那份），按下面“练习 1”看一遍
- [ ] 新建一个 Excel，按下面“练习 2：Cloudy Drizzle”做一遍，**和 Claude 算的答案核对**
- [ ] 想一想 Activity 5 的三个问题（见下面）
- [ ] 带上你负责的 American Egg 那几页，课上和组员一起改

## 要点（中文讲解，按课件顺序）

**课件只有 4 页内容**：活动 1、活动 2、“今天学到了”。真正的内容在两个练习文件里。

**活动 1：数据调查挑战（第 2 页，15 分钟，按展示小组）**
- 打开 Masala Brews 销售数据（Moodle 第 10 周资源里的 Excel）。
- 建一个表格，放你们被要求收集的数据（课件没写具体收集什么，**课上听老师说**）；简单讨论对数据的观察。

**活动 2：决策挑战（第 3 页）**
- Masala Brews 咖啡馆因为收银系统（POS）故障，**10、11、12 月没有每日销售记录**，而第四季度是全年**收入最高**的几个月。数据分析怎样帮管理层解决这个问题？
- 小组要：**提出一个合适的假设**；用学过的概念解决问题；**准备一个带图的展示**。

**Activity 5（Word 文件）——同一个问题，多了一个数字**
- Masala Brews **2024 年全年营业额 £264,600**。讨论：
  1. 哪些**数学概念**能帮管理层估算缺失期间**每种产品的每日收入**？
  2. 要补全每日销售，企业可能需要**哪些步骤**？
  3. 管理层可能需要回答**哪些问题**？

**今天学到了（第 4 页）**：提出**可检验的假设**能帮你解决商业问题；**描述性和预测性**分析思维能帮你理解问题；数据驱动的方案能支持管理决策。

## 练习 1：Masala Brews 数据（Claude 打开文件看到的情况）

**文件结构**（两份文件前 13 个工作表完全一样；“Tutorial 10” 那份多了两张表）

| 工作表 | 内容 |
|---|---|
| Total Sales | 2024 年 **1–12 月每月**、8 种产品的收入（£），每行用 `=SUM` 求月合计；下面有产品说明 |
| January … September | 每天 8 种产品的收入，最后一行 Total |
| October / November / December | 只写着 **“Missing data”** |
| Pivot Table（只在 Tutorial 10 那份） | 数据透视表：每月 Regular（普通咖啡）和 Decaf（低咖啡因）的合计 |
| Regular & Decaf Coffee（只在 Tutorial 10 那份） | 用公式从每日表引用的日期、Regular、Decaf 三列，是透视表的数据源 |

8 种产品：**Filter Kaapi**（南印度滤泡咖啡）、**Bella Kaapi**（加棕榈糖 / 粗糖的咖啡，产自印度 Coorg）、**Regular / Decaf Brew**（普通 / 低咖啡因现煮咖啡）、**Samosa**（咖喱角）、**Gulab Jamun**（糖浆甜点）、**Iced Masala Coffee**（冰香料咖啡）、**Mango Lassi**（芒果酸奶饮料）。

**Claude 算出来的几个关键数字**（你自己在 Excel 里算一遍核对）

| 问题 | 结果 |
|---|---|
| Total Sales 表 12 个月加起来 | **£264,600**——正好等于 Activity 5 说的全年营业额 |
| 1–9 月合计 | £177,200（每日表加起来也是这个数） |
| **10、11、12 月**（Total Sales 表里**有**） | **£27,100、£29,300、£31,000**，第四季度合计 **£87,400**，占全年 **33%** |
| 每天平均收入 | 1 月约 £403 → 7 月约 £826（最高）→ 9 月约 £780；1–9 月单日最高 £931（8/18）、最低 £295（1/12） |
| 第四季度平均每天 | 10 月约 £874、11 月约 £977、**12 月 £1,000**——**12 月的日平均比前 9 个月任何一天都高** |
| 一周里哪天卖得多 | 以当月日平均为 1：周一 0.97、周二 0.93、周三 0.93、周四 0.96、**周五 1.04、周六 1.08、周日 1.11**——周末比当月平均高约 9%，平日低约 4% |

**最重要的发现：缺的不是“每月多少钱”，而是“每天多少钱”。**Total Sales 表里 10–12 月**每种产品的月收入都在**，所以问题其实是：**怎样把已知的月合计分配到每一天**。

**一个思路**（这是帮你看懂的线索，要用你们组自己的分析）：
1. **描述**：用 1–9 月的每日数据算出“星期几系数”（上表），看有没有其他规律（月初月末、某些特殊日子）。
2. **假设**：例如 “H₀：周末的日收入和平日没有差别；H₁：周末更高”——可以用第 4 次课的方法检验（例如 t 检验，或者先画箱形图比较）。
3. **估算**：某天某产品的收入 ≈ 该产品当月收入 × 这一天的星期几系数 ÷ 当月所有天的系数之和。
4. **检查**：估算的每日数加起来要等于月合计；和前 9 个月比是否合理。
5. **说明局限**：12 月日平均超过以往任何一天，是在**外推**；圣诞、新年等节日的影响前 9 个月里看不到（第 7 次课：未来不一定像过去）。

**⚠️ 数据本身有矛盾（可以在课上说出来）**
- **每日表加起来的月合计**和 **Total Sales 表**完全一致，但**分到每种产品就对不上**。例如 4 月 Regular：每日表加起来只有 **£325**，Total Sales 表是 **£2,100**；7 月 Mango Lassi：每日表 £2,365，Total Sales 表 £4,000。Tutorial 10 的数据透视表用的是每日表的数（1 月 Regular £1,165），和 Total Sales 表的 £1,500 也对不上。
- 4 月每日表里 Regular 和 Decaf 每天只有 £4–£19，而且两者月合计正好相同（£325）——看起来是**编出来的练习数据**。
- 所以：**估算第四季度每种产品的每日收入时，用哪张表的产品比例？**这本身就是一个“数据完整性”问题，值得问老师，也能用到个人报告里（见下面）。

## 练习 2：Cloudy Drizzle——自建还是收购（Excel 步骤 + 答案核对）

**选项 1 – 自建（Build）**：借 **£1,000 万**建生产工厂，年利率 **5%**，**10 年**，每月还款。
**选项 2 – 收购（Acquire）**：花 **£800 万**收购一家较小的竞争对手；机会成本按“这笔钱拿去以 **3%** 年利率投资 10 年”算。

| 部分 | 怎么做 | 要点 |
|---|---|---|
| A 评估表 | B1 “Option 1 – Build”，C1 “Option 2 – Acquire”；A2–A5：Initial Investment、Interest over 10 years、Opportunity Cost、Risk；B5 `=(0.6*0.15)+(0.3*0.1)+(0.1*0.05)`，C5 `=(0.4*0.25)+(0.4*0.15)+(0.2*0.05)` | 风险分是**加权求和**：每项 = 权重 × 数值 |
| B 选项 1 还款表 | 新工作表：B1 贷款 10000000，B2 0.05，B3 10，B4 12；B5 月供 `=PMT(B2/B4, B3*B4, -B1)`；B6 总利息 | ⚠️ 说明里 B6 的公式印成了 `=(B5B3B4)-B1`，**少了乘号**，应该是 `=(B5*B3*B4)-B1` |
| B 续：逐月还款表 | 第 8 行表头：Payment Number、Payment、Principal、Interest、Balance；第 9 行：A9 `1`，B9 `=$B$5`，C9 `=B9-D9`，D9 `=B1*$B$2/$B$4`，E9 `=$B$1-SUM($C$9:C9)`；复制到第 10 行，把 D10 改成 `=E9*$B$2/$B$4`；再把第 10 行往下复制到第 128 行 | 第 128 行（第 120 期）的余额 E128 应该是 **0**。⚠️ 说明没提 A 列编号：直接复制会一直是 1，建议 A10 输入 `=A9+1` 再往下拖（Claude 补充） |
| C 选项 2 机会成本 | 新工作表：B1 8000000，B2 0.03，B3 10；B4 终值 `=FV(B2, B3, 0, -B1)`；B5 机会成本 `=B4-B1` | 意思是：如果不收购、把钱拿去投资，10 年后能多赚多少 |
| D 汇总 | 评估表 B2 链接到还款表 B1，C2 链接到机会成本表 B1，B3 链接到还款表 B6，C4 链接到机会成本表 B5 | 用 `=` 再点另一张表的格子，就是**跨表引用** |

**做完核对**（Claude 用同样公式算的）

| 项目 | 选项 1 自建 | 选项 2 收购 |
|---|---|---|
| 初始投资 | £10,000,000 | £8,000,000 |
| 月供 | **约 £106,065.52** | — |
| 10 年总利息 | **约 £2,727,862** | — |
| 第 1 期：利息 / 本金 | 约 £41,667 / 约 £64,399 | — |
| 10 年后终值 | — | **约 £10,751,331** |
| 机会成本 | — | **约 £2,751,331** |
| 风险分 | **0.125** | **0.17** |

**怎么读这个结果**（Claude 的理解，课上以老师为准）
- 两个选项的“额外成本”**差不多**：自建多付约 £273 万利息，收购放弃约 £275 万投资收益。所以**光看钱分不出高下**，要看风险和其他因素。
- 风险分 0.125 vs. 0.17：说明里**没写**这些权重和数值代表什么（可能是“概率 × 影响”，也可能是别的打分），**分数高是风险大还是小，要听录像或问老师**。
- 这两个“成本”算的东西不一样：利息是**真金白银付出去的钱**，机会成本是**没赚到的钱**，而且一个用 5%、一个用 3%。直接比较之前，最好说明这个差别——这就是课程一直强调的批判性思维。

## 必会术语（中英）
| 英文 | 中文 | 一句话 |
|---|---|---|
| Missing data | 缺失数据 | 该有却没有的数据 |
| Imputation / estimation | 插补 / 估算 | 用已有数据合理地填补缺失值 |
| Hypothesis (H₀ / H₁) | 假设（原假设 / 备择假设） | 可以用数据检验的说法 |
| Descriptive analytics | 描述性分析 | 发生了什么（平均数、合计、图） |
| Predictive analytics | 预测性分析 | 将来 / 缺失的会是什么 |
| Proportion / weight | 比例 / 权重 | 部分占整体的多少 |
| Seasonality / day-of-week effect | 季节性 / 星期效应 | 固定周期的规律 |
| Extrapolation | 外推 | 推到数据范围以外 |
| Pivot table | 数据透视表 | Excel 快速分组汇总的工具 |
| Loan / interest rate / term | 贷款 / 利率 / 期限 | 借钱的三个基本要素 |
| PMT | 每期还款额函数 | `=PMT(利率, 期数, 本金)` |
| Amortisation schedule | 分期还款表 | 每期还多少本金、多少利息、还剩多少 |
| Principal | 本金 | 借来的钱 |
| FV (future value) | 终值函数 | 一笔钱按利率滚到将来值多少 |
| Opportunity cost | 机会成本 | 选了这个就放弃的另一个选项的收益 |
| Weighted score | 加权分 | 各项 × 权重再相加 |
| Build vs. acquire | 自建 vs. 收购 | 自己从零做，还是买现成的 |

## 这节课和作业的关系
> 这是帮你看懂的线索，要用你自己的分析和语言写。

**小组展示（American Egg，PPT 11/27 前提交）——这节课最直接有用**
- **目标 3（国际化）收购 vs. 合资** ≈ Cloudy Drizzle 的“自建 vs. 收购”：每个候选公司可以算**收购倍数**（收购价 ÷ EBITA）、**合资回报率**（合资年收益 ÷ 合资投资），再加一个**风险加权分**（例如把表 3–6 的国家风险、禽流感、价格调查等打分加权）。
- **借钱的成本**：案例说可以借 **5 亿美元、10 年、年利率 3%**。照 Cloudy Drizzle 的 B 部分，`=PMT(3%/12, 120, -500000000)` 约 **482.8 万美元 / 月**，10 年总利息约 **7,936 万美元**（Claude 按每月还款计算；案例没说怎么还款，按年还款会略多，约 8,615 万）。这能回答“借钱扩张值不值”，展示里要说明你们的还款假设。
- **战略储备 3 亿美元的机会成本**：照 C 部分用 `FV` 算“如果不用于扩张能赚多少”——但案例没给储备的收益率，**利率要你们自己假设并说明**。
- **Masala Brews 的“补缺失数据”思路** → AmEgg 图 1 蛋价只有大约一年、没有年份，数据不完整：展示里说明“数据缺什么、我们怎样做合理假设、结论有多可靠”，能拿“定量方法”（15%）和“洞察”（20%）的分。
- **活动 2 要求“提出假设 + 带图展示”**——就是正式展示的缩小版：先说清楚问题和假设，再用图支持结论。

**个人报告（Bain《Innovation Report 2025》，12/4）**
- **第 4 部分（数据完整性）**：Masala Brews 两张表的产品数据对不上，就是“同一份报告里数字前后不一致”的例子。读 Bain 时也检查：同一个指标在不同页是否一致、**每个百分比的样本量是多少**（素材库里已经发现 Bain 不同图表的样本基数不同、而且没披露）。
- **第 4 部分（外推）**：Masala Brews 12 月的日平均超过以往任何一天；Bain 用“五年后”的预期——都要提醒读者“超出数据范围的推断不可靠”。
- **第 5 部分（建议）**：可以建议 Bain 公开原始数据和计算方法，就像 Cloudy Drizzle 的每一步都能在 Excel 里复核。

## 课上可能讨论的问题（先想好你的看法）
1. 第四季度的月合计已经有了，为什么还要每日数据？（排班、进货、看哪天促销有效）
2. 用“星期几系数”分配月合计，有什么假设？圣诞节前后这个假设还成立吗？
3. 每日表和 Total Sales 表的产品数对不上，你会相信哪一个？为什么？
4. Cloudy Drizzle：利息和机会成本差不多，你选自建还是收购？还要知道什么信息？
5. 收购竞争对手还有哪些数字算不出来的好处和风险（客户、员工、整合）？

## 可以在课上说的英文
- "The monthly totals for October to December are in the Total Sales sheet, so we only need to estimate the daily figures."
- "Our hypothesis is that daily sales are higher at weekends than on weekdays."
- "We can split each monthly total by day-of-week weights based on January to September."
- "December's average daily sales are higher than any day in the first nine months, so this is an extrapolation."
- "The product totals in the daily sheets do not match the Total Sales sheet. Which one should we trust?"
- "The total interest on the loan is about 2.73 million pounds, and the opportunity cost of the acquisition is about 2.75 million, so the costs are very similar."
- "We need more information about the risks before choosing between building and acquiring."

## 想问老师的问题
- "In Activity 1, what data are we asked to collect from the Masala Brews workbook?"
- "The monthly figures for October to December are already in the Total Sales sheet. Should we only estimate the daily figures?"
- "The product totals in the daily sheets do not match the Total Sales sheet, for example Regular coffee in April. Which data should we use?"
- "In the Cloudy Drizzle exercise, what do the numbers in the risk formula mean? Is a higher score more risky?"
- "In Part B, step 8, should the formula be =(B5*B3*B4)-B1? The multiplication signs seem to be missing."
- "The Part 2 recording is named 'Lecture7_Part 2_LO2'. Is it the correct recording for this week?"
- "For the American Egg presentation, can we use a loan amortisation schedule like Cloudy Drizzle to show the cost of borrowing?"
