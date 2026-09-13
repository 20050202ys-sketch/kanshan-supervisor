#!/usr/bin/env bash
# =============================================================
# 看山督学局 · GitHub Issues 一键导入脚本
# 依赖：gh CLI（https://cli.github.com） + python3
# 用法：
#   1) 先登录你自己的 GitHub 账号：  gh auth login
#   2) 运行：  ./import-issues.sh <owner>/<repo>
#      例如： ./import-issues.sh yourname/kanshan-supervisor
#
# 行为（全部幂等，可重复运行）：
#   - 自动创建缺失的 label（含 P0/P1/P2、分工 A/B、模块标签等）
#   - 自动创建缺失的 milestone（Day0-地基 / Day1-主轴 / Day2-摄像头 / Day3-彩排 / P2-暂不做）
#   - 逐条创建 issue，跳过标题已存在的 issue（避免重复导入）
#
# 凭证全程只在你本地，通过 gh 使用，不经过任何第三方。
# =============================================================
set -euo pipefail

REPO="${1:-}"
CSV_FILE="$(cd "$(dirname "$0")" && pwd)/github-issues.csv"

if [[ -z "$REPO" ]]; then
  echo "用法: $0 <owner>/<repo>"
  echo "示例: $0 yourname/kanshan-supervisor"
  exit 1
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "❌ 未找到 gh CLI，请先安装：https://cli.github.com"
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "❌ gh 未登录，请先运行：gh auth login"
  exit 1
fi

if [[ ! -f "$CSV_FILE" ]]; then
  echo "❌ 找不到 CSV：$CSV_FILE"
  exit 1
fi

echo "==> 目标仓库：$REPO"
echo "==> 读取任务清单：$CSV_FILE"
echo

# ---------- 1. 创建 label（颜色映射） ----------
declare -A LABEL_COLOR=(
  [P0]="b60205" [P1]="fbca04" [P2]="c5def5"
  [infra]="5319e7" [frontend]="1d76db" [agent]="0e8a16"
  [camera]="d93f0b" [content]="0052cc" [state]="bfd4f2"
  [qa]="e99695" [setup]="cccccc" [deploy]="cccccc"
  [contract]="cccccc" [planning]="cccccc" [backlog]="ededed"
  [A]="fef2c0" [B]="c2e0c6"
)

echo "==> 创建 / 校验 labels ..."
# 从 CSV 抽取所有出现过的 label（第 3 列，| 分隔），去重
python3 - "$CSV_FILE" <<'PY' | sort -u | while read -r lb; do
import csv, sys
with open(sys.argv[1], encoding="utf-8-sig") as f:
    for row in csv.DictReader(f):
        for lb in (row.get("labels") or "").split("|"):
            lb = lb.strip()
            if lb:
                print(lb)
PY
  [[ -z "$lb" ]] && continue
  color="${LABEL_COLOR[$lb]:-ededed}"
  if gh label create "$lb" --repo "$REPO" --color "$color" >/dev/null 2>&1; then
    echo "   + label 新建: $lb"
  else
    echo "   = label 已存在: $lb"
  fi
done
echo

# ---------- 2. 创建 milestone（gh 无原生命令，用 API，幂等） ----------
echo "==> 创建 / 校验 milestones ..."
python3 - "$CSV_FILE" <<'PY' | sort -u | while read -r ms; do
import csv, sys
with open(sys.argv[1], encoding="utf-8-sig") as f:
    for row in csv.DictReader(f):
        ms = (row.get("milestone") or "").strip()
        if ms:
            print(ms)
PY
  [[ -z "$ms" ]] && continue
  # 已存在则跳过（open+closed 都查）
  exists=$(gh api "repos/$REPO/milestones?state=all" --jq ".[] | select(.title==\"$ms\") | .title" 2>/dev/null || true)
  if [[ -n "$exists" ]]; then
    echo "   = milestone 已存在: $ms"
  else
    gh api "repos/$REPO/milestones" -f title="$ms" >/dev/null 2>&1 \
      && echo "   + milestone 新建: $ms" \
      || echo "   ! milestone 创建失败（可能权限不足）: $ms"
  fi
done
echo

# ---------- 3. 逐条创建 issue（标题已存在则跳过） ----------
echo "==> 创建 issues ..."
# 预取已存在的 issue 标题，避免重复
EXISTING=$(gh issue list --repo "$REPO" --state all --limit 500 --json title --jq '.[].title' 2>/dev/null || true)

# 用 Python 把每条 issue 输出为 NUL 分隔的 title/body/labels/milestone，稳妥处理多行与中文
python3 - "$CSV_FILE" <<'PY' | while IFS= read -r -d $'\x1e' rec; do
import csv, sys
with open(sys.argv[1], encoding="utf-8-sig") as f:
    for row in csv.DictReader(f):
        title = (row.get("title") or "").strip()
        body = row.get("body") or ""
        labels = "|".join(x.strip() for x in (row.get("labels") or "").split("|") if x.strip())
        ms = (row.get("milestone") or "").strip()
        # 用 \x1f 分隔字段，\x1e 分隔记录
        sys.stdout.write("\x1f".join([title, body, labels, ms]) + "\x1e")
PY
  title="${rec%%$'\x1f'*}"; rest="${rec#*$'\x1f'}"
  body="${rest%%$'\x1f'*}"; rest="${rest#*$'\x1f'}"
  labels="${rest%%$'\x1f'*}"; ms="${rest#*$'\x1f'}"

  # 跳过已存在标题
  if grep -Fxq "$title" <<<"$EXISTING"; then
    echo "   = 跳过已存在: $title"
    continue
  fi

  args=(--repo "$REPO" --title "$title" --body "$body")
  [[ -n "$ms" ]] && args+=(--milestone "$ms")
  # labels 逐个追加
  IFS='|' read -ra LBS <<<"$labels"
  for l in "${LBS[@]}"; do [[ -n "$l" ]] && args+=(--label "$l"); done

  if url=$(gh issue create "${args[@]}" 2>/dev/null); then
    echo "   + 新建: $title  ->  $url"
  else
    echo "   ! 失败: $title（检查 label/milestone 是否创建成功、权限是否足够）"
  fi
done

echo
echo "✅ 导入流程结束。到 https://github.com/$REPO/issues 查看结果。"
