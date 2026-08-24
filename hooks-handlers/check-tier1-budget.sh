#!/usr/bin/env bash
# check-tier1-budget.sh — PostToolUse hook (Edit|Write matcher)
#
# Watches Tier-1 file edits and warns if combined size exceeds the 200-line
# budget. Tier-1 = AGENTS.md + docs/context/product/app.md (or one-pager.md).
#
# Reads the Edit/Write event JSON from stdin to know which file changed.
# Silent unless the budget is exceeded.

set -euo pipefail

CWD="${CLAUDE_PROJECT_DIR:-$(pwd)}"
TIER1_BUDGET=200

# Parse the event from stdin to know if a Tier-1 file was just touched
EVENT=$(cat)
TOOL_INPUT_PATH=$(echo "$EVENT" | grep -oE '"file_path"\s*:\s*"[^"]+"' | head -1 | sed -E 's/.*"file_path"\s*:\s*"([^"]+)".*/\1/' || echo "")

# Only fire when the touched file is a Tier-1 candidate
case "$TOOL_INPUT_PATH" in
  *AGENTS.md|*docs/context/product/app.md|*docs/context/product/one-pager.md)
    ;;
  *)
    exit 0
    ;;
esac

# Compute combined Tier-1 line count
AGENTS_MD="$CWD/AGENTS.md"
APP_MD="$CWD/docs/context/product/app.md"
ONEPAGER_MD="$CWD/docs/context/product/one-pager.md"

TOTAL=0
[ -f "$AGENTS_MD" ] && TOTAL=$((TOTAL + $(wc -l < "$AGENTS_MD" | tr -d ' ')))
[ -f "$APP_MD" ] && TOTAL=$((TOTAL + $(wc -l < "$APP_MD" | tr -d ' ')))
[ -f "$ONEPAGER_MD" ] && TOTAL=$((TOTAL + $(wc -l < "$ONEPAGER_MD" | tr -d ' ')))

if [ "$TOTAL" -gt "$TIER1_BUDGET" ]; then
  cat <<EOF >&2
⚠ Tier-1 budget exceeded: $TOTAL lines (cap: $TIER1_BUDGET)
  AGENTS.md + docs/context/product/{app,one-pager}.md combined.
  Consider promoting non-essential rules to docs/context/conventions/* (Tier 2).
  Run /hd:review l1 for a structured audit.
EOF
fi

exit 0
