# 伊利诺伊工伤手册 · 中文阅读版

以 IWCC [2024 年修订版手册](https://iwcc.illinois.gov/content/dam/soi/en/web/iwcc/documents/handbook/IWCC%20handbook%2006.06.24.pdf)为主要内容，结合用户提供的 2013 年手册目录，整理为 11 个章节、94 个知识点。每章是一页可从头读到尾的长文。2013 年版独有的两个立案问题已改写为当前电子立案指引。

每个知识点直接提供中文规则解释、对应人物情境、专属图解、横幅情境插画和精简出处；英文版直接呈现 2024 年手册相应答复。94 个图解按规则采用流程、时间线、对比、判断和公式等形式，悬停时按顺序突出关键步骤。94 张无文字 WebP 插画对应各条虚构教学情境，由 GPT Image API 离线生成，中英文站复用。第 9 章收录完整法定部位表。真实判例注明当事人、争议、裁判结果并链接至伊利诺伊州法院判决；一般人物情境标注为虚构。

左侧只列章节，选择后正文连续展示该章全部知识点。搜索可直达章内对应位置；旧 `#/lesson/<编号>` 链接仍可直达该位置。每条可单独标记学会，章末有两道可跳过的选择题和答案反馈。支持字号调节、进度保存、手机目录和减少动态效果。

## 本地运行

```bash
npm ci
npm run dev
npm run build
```

推送 `main` 后，GitHub Actions 发布 GitHub Pages。网站运行和部署无需 API key 或后端；插画已经离线生成并提交在 `public/illustrations/`。英文版在 [独立仓库](https://github.com/GMyoung/iwcc-handbook-en)。

本站是学习材料，个案结果须核对事实与现行法律。计算演示不计法定上下限。IWCC [手册发布页](https://iwcc.illinois.gov/about/handbook.html)于 2026-09-28 核对。
