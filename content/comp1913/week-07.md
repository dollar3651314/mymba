# Session 7 · Simple Linear Regression (Simple regression modelling)

> **One-line summary:** Simple regression uses a straight line, **Y = intercept + slope × X**, to describe "when one factor X changes, how the outcome Y changes on average". It can be used for prediction and scenario analysis, but it only **supports judgement**: it is **not a crystal ball** and **does not prove causation**.
> 10/31 (Sat) 15:30, about 1 hr 38 min. The lecture took about 1 hour (00:03–59:43), then a break, then individual Excel exercises in class. The recording transcription is poor, so these notes only cover what is clear, with recording times noted.
> ⚠️ The teacher covered **Lecture 8 (regression)** today, not time series, so the site has swapped weeks 7 and 8. Time series will most likely be on **11/10**.

## Key points of this session

**1. What regression is for (02:47–10:12)**
- It is the most basic analysis for **forecasting**: it examines whether **one factor affects another**.
  - Example: if marketing spend goes up, do sales go up?
  - You can first state this as a **hypothesis**, then test it with regression.
- With the relationship known, you can **predict from known inputs**.
  - Example: estimate next year's revenue from the advertising budget.
  - Example: run "what if" **scenario analysis**, such as "what if I increase the marketing budget?"
- The teacher stressed repeatedly: **regression is decision support, not absolute truth.**
  - "We're not god … we can only forecast … to a certain confidence level."
  - It does not replace judgement; you still have to interpret it alongside the business context.

**2. The equation (11:13–14:52): Y = intercept + slope × X + error**
- **Y (outcome / dependent variable):** what you want to predict, such as sales or customer satisfaction.
- **X (driver / independent variable):** data you already have, such as price, marketing budget or service capacity.
- **Intercept:** the baseline, i.e. the value of Y when X = 0. It isn't always realistic in practice, but it "anchors" the line.
- **Slope:** **the most important part for decision-making.** It is how much Y changes when X increases by 1.
  - A larger slope means a steeper line, so a stronger effect.
  - Positive means the two move in the same direction; negative means they move in opposite directions.
- **Error:** real-world data can never be predicted exactly, and other factors outside the model always have an influence.

**3. Four assumptions (14:52–18:41; "you don't need to memorise them, just know they exist")**
1. The relationship is roughly a **straight line**, not a curve or a random scatter. If not, the model will still produce numbers, but they will be misleading.
2. The **errors are evenly spread** across the range of X; they don't get bigger as X gets bigger.
3. **Each observation is independent**; one data point doesn't affect another.
4. The **errors are roughly normally distributed**: most points sit near the line, with only a few far from it.

**4. Steps to build a model (18:41–26:54)**
1. **Identify the variables first.** Be clear what the outcome is and which factor you believe affects it.
   - "A well-chosen question often matters more than the sophistication of the analysis."
   - In practice, test with one variable first, then add more. With several variables it becomes **multiple (multivariate) regression**, and the slope can change.
2. **Draw a scatter plot first** to check whether the pattern looks like a straight line and whether there are **outliers**.
   - If the scatter is a mess with no pattern, there is no point carrying on, and calculating would waste time.
3. Calculate the regression line (in Excel).
4. **Evaluate the model.** "All models have to be evaluated, not fire and forget."
5. If the model is useful enough, use it for prediction.

**5. Evaluating the model (29:02–31:30)**
- **R²:** how much of the variation in Y the line explains. Higher means a stronger relationship.
  - But a high R² **does not mean the model is good, or that the story is complete.**
- **Residuals:** how far each prediction is from the actual value, i.e. where the model overestimates or underestimates.
- **Standard error:** typical prediction accuracy. **The smaller it is, the more accurate the predictions.**

**6. Worked example: study hours → test score (31:30–47:24)**
- 1 hour → 50 marks, 2 hours → 55 marks, and so on. Hypothesis: more study time gives higher marks.
- Calculation steps:
  1. Add up each column: Σx, Σy, Σxy, Σx².
  2. Put these into the formulas to get the slope.
  3. Then get the intercept.
- Result: **slope = 5** (each extra hour of study adds an average of 5 marks); **intercept = 45**. The equation is **y = 45 + 5x**.
- Prediction: 6 hours of study → **75 marks**.
- The teacher also said this is not realistic: studying more doesn't guarantee higher marks, because distraction, ability and other factors also matter.
- A classmate spotted an error on one formula slide: Σx² was confused with (Σx)². The teacher accepted it, so **take care with these two when you check against the slides.**
- You **don't need to memorise or calculate the formulas by hand**; Excel does it. But know there is a transparent calculation behind it, so you understand what Excel is doing.
- The more data you have, the more accurate the line. Machine learning works on the same principle.

**7. Where it is used (48:02–51:25)**
- **Business:** using advertising and price to estimate sales and demand, so decisions move "from gut feel to evidence".
- **Healthcare:** for example, recommended weight/BMI ranges by age and height.
- **Education:** study time and performance.
- **Environmental science:** temperature changes over time.

**8. Limitations (51:25–56:00; useful for critique in the assignments)**
1. **It only captures straight-line relationships.** Many real-world phenomena are more complex, so it can oversimplify.
2. **It is sensitive to outliers.** For example, in 1, 2, 3, 4, 5, if the last value becomes 100, the whole line changes completely.
3. **It only looks at one factor** and ignores the others, which can lead to incomplete or wrong interpretations.
4. **It cannot prove causation.** It only shows that two variables move together, i.e. correlation. Acting on correlation alone can lead to poor decisions.

## Key concepts and terms

| English | Chinese | One-line explanation |
|---|---|---|
| Simple linear regression | 简单线性回归 | Describes the relationship between one X and Y with a straight line |
| Dependent variable / outcome (Y) | 因变量 / 结果 | What you want to explain or predict |
| Independent variable / driver (X) | 自变量 / 驱动因素 | The factor used for the explanation |
| Intercept | 截距 | The baseline value of Y when X = 0 |
| Slope | 斜率 | How much Y changes when X increases by 1 |
| Error term / residual | 误差项 / 残差 | The gap between the predicted and actual values |
| Scatter plot | 散点图 | Check whether it looks like a straight line, and look for outliers, before calculating |
| Outlier | 离群值 | A point far from the overall pattern; it can distort the line |
| R-squared (R²) | 判定系数 | The share of Y's variation that the line explains |
| Standard error | 标准误 | Typical prediction error; the smaller, the more accurate |
| p-value | p 值 | Shown in the Excel output table; whether the relationship is significant (see the Session 4 hypothesis-testing notes) |
| Multiple regression | 多元回归 | Several X variables used together to explain Y |
| Correlation ≠ causation | 相关不等于因果 | Moving together doesn't mean one causes the other |

## What the teacher stressed (things you might skip — they matter)
- **⭐ Assignment feedback (00:44–02:47):**
  - Some classmates have already **sent their assignment to the teacher, and he has given feedback.**
  - He only gives a **"general direction"**: whether you are heading the right way and roughly what is missing. He doesn't go into detail, because that would "defeat the purpose of the assignment".
  - Once you are confident, you can submit.
  - → **Once your draft is written, you can send it to the teacher for a direction check too** (the site has a to-do for this).
- **⭐ Similarity below 20%:**
  - Moodle runs your submission through Turnitin automatically, so **keep it under 20%.**
  - The teacher said matches on the **template and references are fine**, as long as the content itself isn't over 20%.
- **No class next week; the next class is 11/10** (Tue, 19:00).
- **Midpoint feedback:** today is Session 7, the midpoint of the module. The teacher asked whether students understand, feel lost, or find it too technical, so he can adjust the remaining sessions.
- In-class exercise (01:17–01:37):
  - Download the **instructions document and Excel data** from the Session 7 folder on Canvas.
  - Task 1: create a folder.
  - Task 2: run the regression with Excel's Data Analysis tool. The output table includes the coefficients, standard error, R² and p-value.
  - Make a chart, then interpret the results.
  - **Post screenshots of the table and chart to the discussion forum.** Once you've posted, you can see and download your classmates' work.
  - Finish by 17:30.

## How this links to the assignments
- **Individual report (A, 12/4):**
  - When evaluating the Bain report: if it says "A is associated with / affects B", ask whether it is just correlation or regression, which cannot prove causation.
  - Is there only one factor? Could outliers be distorting it? Does it report R² and the sample size?
  - These limitations can go straight into your "critical evaluation" paragraph.
  - Also, **you can send your draft to the teacher for direction feedback**, and keep similarity under 20%.
- **Group presentation (B, AmEgg, 11/24):**
  - If you make predictions (e.g. price vs sales, costs vs output), you can use simple regression.
  - In the presentation, say that "the regression only supports judgement and cannot prove causation". Following the teacher's line will earn marks.
- These are clues to help you understand; write it in your own analysis and your own words.

## English you can use in the tutorial
- "The slope is 5, so each extra hour of study is linked to about 5 more marks." —— 斜率是 5，所以每多学习一小时，分数平均多约 5 分。
- "The R-squared is high, but that does not prove that X causes Y." —— R² 很高，但这不能证明 X 导致 Y。
- "I checked the scatter plot first to see if a straight line makes sense." —— 我先看了散点图，判断用直线合不合理。
- "There is one outlier, so the regression line may be misleading." —— 有一个离群值，所以回归线可能有误导。
- "Could I send you my draft for some general feedback on the direction?" —— 我可以把草稿发给您，请您给一点方向上的意见吗？

## Not understood / to confirm
- **Did you finish the in-class exercise and post the screenshots to the discussion forum?** If not, do it before 11/10 (it isn't graded, but it's good practice and both assignments use it).
- **Which assignment were classmates sending to the teacher for feedback?** The recording doesn't say whether it's the individual report or the presentation; ask on 11/10.
- The Stata question for the time series tutorial on 11/10 is still open (see the Session 8 preview).
- The rest of the recording (the break and the exercise time) is mostly classmates talking quietly and isn't clear enough to transcribe.
