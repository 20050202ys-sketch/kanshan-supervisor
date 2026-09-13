# 看山督学局 · 1 天版 MVP 骨架

黑客松参赛作品：**3 天速成 AI 产品经理入门**，由「刘看山」担任督学官，核心亮点是
**摄像头本地检测分心 → 分级提醒 → 看山铁拳** 的督学闭环。

> 本仓库是「1 天冲刺版」骨架：只保留支撑 3 分钟演示主轴的功能，纯前端、零后端、
> 可一键部署到 GitHub Pages。两人拉下来即可分工填内容。

## 快速开始

```bash
npm install
cp .env.example .env.local   # 填入 LLM key（可留空，留空则走兜底演示）
npm run dev                  # 本地开发
npm run build                # 构建，产物在 dist/
```

> 没有配置 LLM key 也能跑：评估会走内置兜底结果，配合右侧「演示模式」按钮，
> 足以完整彩排 3 分钟演示，不依赖网络。

## 两人分工（按接口契约并行）

先冻结 `src/types.ts` 两个契约类型，双方各自 mock 对方数据即可并行：

| | 负责人 | 范围 |
|---|---|---|
| A | 前端 / IP / 摄像头 | 页面与三栏布局、刘看山形象、看山铁拳动画、`src/camera/detector.ts`（接 MediaPipe） |
| B | Agent / 内容 / 数据 | `src/agent/evaluate.ts`（LLM+JSON 容错）、`src/data/content.ts`（知识卡/题库）、`src/store` |

## 目录结构

```
src/
  types.ts                 # ⭐ 接口契约（CameraEvent / MasteryResult），先冻结
  App.tsx                  # 极简状态路由：home / learn / finish
  data/content.ts          # 知识节点、知乎知识卡、摸底题（TODO: 补齐内容）
  store/useStore.ts        # 学习状态 + localStorage（PRD 第十一章）
  agent/
    evaluate.ts            # 评估Agent：LLM 调用 + JSON 强制解析兜底（PRD F06）
    useSupervisor.ts       # 督学Agent：分级提醒规则（PRD F10）
  camera/detector.ts       # 本地摄像头检测骨架（TODO: 接 MediaPipe）
  components/
    LiuKanshan.tsx         # 刘看山形象（TODO: 换正式 IP 素材）
    KnowledgeMap.tsx       # 知识地图，节点按状态变色（PRD F12）
    KanshanPunch.tsx       # 看山铁拳动画（≤3s、可关、无暴力）（PRD F11）
    CameraPanel.tsx        # 摄像头授权/状态/关闭/纠正（PRD F08/F09）
  pages/
    Home.tsx  Learn.tsx  Finish.tsx
```

## 3 分钟演示脚本（PRD 第十五章）

1. **0:00–0:30** 首页介绍 → 点「开始学习」
2. **0:30–1:00** （摸底可跳过）直接进入学习页
3. **1:00–1:30** 阅读左侧「大语言模型的能力与边界」知识卡
4. **1:30–2:00** 演示分心：**开摄像头离开画面** 或点「演示模式 → 触发看山铁拳」→ 点「我回来了」
5. **2:00–2:30** 在中间输入复述，**故意漏掉「模型可能产生事实错误」**
6. **2:30–2:50** 评估返回缺口，掌握度显示「待巩固」
7. **2:50–3:00** 补充后再答，节点变绿，展示知识地图

> **保命提示**：现场摄像头可能抽风，务必用右侧「演示模式」按钮手动触发铁拳兜底。

## 部署到 GitHub Pages

1. 仓库 Settings → Pages → Source 选 **GitHub Actions**。
2. push 到 `main` 会自动 build 并部署（见 `.github/workflows/deploy.yml`）。
3. Actions 里 base 自动设为 `/<仓库名>/`，无需手改。
4. 用 Vercel / 自定义域名时，把 `vite.config.ts` 的 base 改回 `/`。

## 导入任务到 GitHub Issues

已附带任务清单 `github-issues.csv`（26 条，含 P0/P1/P2、分工 A/B、milestone）。

一键导入脚本 `import-issues.sh`（基于 gh CLI，凭证只在你本地）：

```bash
gh auth login                                  # 先登录你自己的 GitHub
./import-issues.sh <owner>/kanshan-supervisor  # 自动建 label + milestone + issue
```

脚本幂等：会自动创建缺失的 label 和 milestone，标题已存在的 issue 会跳过，可重复运行。

## 剩余 TODO（按优先级）

- [ ] B：补齐 6 个节点的知乎知识卡与题库（`data/content.ts`），只放片段+作者+链接
- [ ] A：`camera/detector.ts` 接入 MediaPipe FaceLandmarker，实现在席/转头/低头判断
- [ ] A：替换刘看山 emoji 为正式 IP 素材（注意赛事授权边界）
- [ ] 联调：摄像头事件 → 督学反应 → 铁拳动画全链路真机测试
- [ ] 演示前把演示话术的 LLM 输出提前跑通（PRD 第十七章）

## 隐私与合规（PRD 第十三章）

摄像头默认关闭、需单独授权、画面仅本地分析、不上传/不录像/不保存、不做人脸识别、
可随时撤回；知乎内容保留标题/作者/来源链接，AI 总结与原文明确区分。
