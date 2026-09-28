# 工伤手册 · 逐条学

伊利诺伊州工伤委员会 2013 年《Handbook on Workers’ Compensation and Occupational Diseases》的中文互动学习版。原手册 11 章、94 个问答全部有对应的学习条目、原 PDF 页码和 2024 年官方修订版链接。页面一次只显示一个问题；进度存在本机浏览器中。

## 学习功能

- 11 章、94 条中英文对照数据，搜索、顺序阅读、标记已掌握、字体大小调节。
- 每条的三步微演示；章节实验室包括通知时间线、CompFile 流程、医疗机构选择、TTD/TPD 计算、PPD 四种路径和完整身体部位周数查询等。
- 3 个具名真实判例：Bryon Kawa、Jeff Urban、Craig Kolin。每个判例附法院原文链接和裁判结果。
- 适配桌面与手机，并尊重系统“减少动态效果”设置。

## 来源与时间

- 用户提供的 `handbook.pdf` 与 [IWCC 2013 官方 PDF](https://iwcc.illinois.gov/content/dam/soi/en/web/iwcc/about/handbook/documents/handbook.pdf) 的 SHA-256 一致。
- [IWCC 手册发布页](https://iwcc.illinois.gov/about/handbook.html)列出的修订版为 2024-06-06；本项目在 2026-09-28 核对。页面链接到该修订版的相应 PDF 页。
- 2013 年纸质立案步骤已被 CompFile 电子立案取代；旧网址、部分金额与程序不能直接照做。
- 判例摘要来自伊利诺伊州法院发布的判决。普通教学示意并非真实个案裁决。

这个网站用于学习手册，具体案件要依当前法律、日期和事实核对。计算器只演示公式，不包括法定最高及最低金额。

## 运行与发布

```bash
npm ci
npm run dev
npm run build
```

推送到 `main` 后，`.github/workflows/pages.yml` 自动构建并部署到 GitHub Pages。无需 API key 或后端服务，GPT API 费用为 $0。英文版独立仓库为 [iwcc-handbook-en](https://github.com/GMyoung/iwcc-handbook-en)。
