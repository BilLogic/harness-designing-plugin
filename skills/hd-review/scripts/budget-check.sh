#!/usr/bin/env bash
# budget-check.sh — deterministic Tier 1 line-count + SKILL.md budget enforcement.
# Emits JSON to stdout. Exit 0 on success (even if budget violated — status in JSON).
# Non-zero exit only on script error (file missing, malformed).
#
# Requires: bash 3.2+ (macOS/Linux default).
# Call from user's repo root.

set -eu

# ──────────────────────────────────────────────────────────────────────
# Thresholds (match references/bloat-detection.md)
# ──────────────────────────────────────────────────────────────────────

TIER_1_BUDGET=200              # lines combined (AGENTS.md + product/one-pager.md)
SKILL_MD_SOFT=200              # lines (router target)
SKILL_MD_HARD=500              # lines (Anthropic hard cap)
DESC_SOFT=180                  # chars (description field target)
DESC_HARD=1024                 # chars (Anthropic hard cap)

# ──────────────────────────────────────────────────────────────────────
# Tier 1 check
# ──────────────────────────────────────────────────────────────────────

agents_md_lines=0
one_pager_lines=0
tier1_files_json='[]'

if [ -f "AGENTS.md" ]; then
  agents_md_lines=$(wc -l < AGENTS.md | tr -d ' ')
fi

if [ -f "docs/context/product/one-pager.md" ]; then
  one_pager_lines=$(wc -l < docs/context/product/one-pager.md | tr -d ' ')
fi

tier1_total=$((agents_md_lines + one_pager_lines))
tier1_status="pass"
[ "$tier1_total" -gt "$TIER_1_BUDGET" ] && tier1_status="fail"

# ──────────────────────────────────────────────────────────────────────
# SKILL.md scan
# ──────────────────────────────────────────────────────────────────────

skill_md_json="{}"
violations_json="[]"
violations_count=0

if [ -d "skills" ]; then
  first_skill=true
  skill_md_json="{"
  for skill_md in skills/*/SKILL.md; do
    [ -f "$skill_md" ] || continue

    lines=$(wc -l < "$skill_md" | tr -d ' ')

    # Extract description field (crude but deterministic)
    desc=$(awk '/^description:/{sub(/^description: /, ""); print; exit}' "$skill_md" | sed 's/^"//;s/"$//')
    desc_len=${#desc}

    # JSON field for this skill
    $first_skill || skill_md_json="$skill_md_json,"
    first_skill=false
    skill_md_json="$skill_md_json
    \"$skill_md\": { \"lines\": $lines, \"description_chars\": $desc_len }"

    # Check thresholds
    if [ "$lines" -gt "$SKILL_MD_HARD" ]; then
      violations_count=$((violations_count + 1))
      [ "$violations_count" -gt 1 ] && violations_json="${violations_json%]},"
      violations_json="${violations_json%]}[\"$skill_md: $lines lines (>$SKILL_MD_HARD hard)\"]"
    elif [ "$lines" -gt "$SKILL_MD_SOFT" ]; then
      # Soft violation — warn only, still counted
      violations_count=$((violations_count + 1))
    fi

    if [ "$desc_len" -gt "$DESC_HARD" ]; then
      violations_count=$((violations_count + 1))
    fi
  done
  skill_md_json="$skill_md_json
  }"
fi

# ──────────────────────────────────────────────────────────────────────
# Per-skill violations detail (simplified format for v0; iterate later)
# ──────────────────────────────────────────────────────────────────────

violations_detail='[]'
if [ -d "skills" ]; then
  first_v=true
  violations_detail="["
  for skill_md in skills/*/SKILL.md; do
    [ -f "$skill_md" ] || continue
    lines=$(wc -l < "$skill_md" | tr -d ' ')
    desc=$(awk '/^description:/{sub(/^description: /, ""); print; exit}' "$skill_md" | sed 's/^"//;s/"$//')
    desc_len=${#desc}

    if [ "$lines" -gt "$SKILL_MD_HARD" ]; then
      $first_v || violations_detail="$violations_detail,"
      first_v=false
      violations_detail="$violations_detail
    {\"file\": \"$skill_md\", \"type\": \"skill_md_over_hard_cap\", \"value\": $lines, \"threshold\": $SKILL_MD_HARD, \"severity\": \"p1\"}"
    fi

    if [ "$desc_len" -gt "$DESC_HARD" ]; then
      $first_v || violations_detail="$violations_detail,"
      first_v=false
      violations_detail="$violations_detail
    {\"file\": \"$skill_md\", \"type\": \"description_over_hard_cap\", \"value\": $desc_len, \"threshold\": $DESC_HARD, \"severity\": \"p1\"}"
    fi
  done

  # Tier 1 violation
  if [ "$tier1_status" = "fail" ]; then
    $first_v || violations_detail="$violations_detail,"
    first_v=false
    violations_detail="$violations_detail
    {\"file\": \"AGENTS.md + docs/context/product/one-pager.md\", \"type\": \"tier_1_over_budget\", \"value\": $tier1_total, \"threshold\": $TIER_1_BUDGET, \"severity\": \"p1\"}"
  fi

  violations_detail="$violations_detail
  ]"
fi

checked_at=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# ──────────────────────────────────────────────────────────────────────
# Emit JSON
# ──────────────────────────────────────────────────────────────────────

cat <<EOF
{
  "schema_version": "1",
  "tier_1": {
    "files": ["AGENTS.md", "docs/context/product/one-pager.md"],
    "agents_md_lines": $agents_md_lines,
    "one_pager_lines": $one_pager_lines,
    "combined_lines": $tier1_total,
    "budget": $TIER_1_BUDGET,
    "status": "$tier1_status"
  },
  "skill_md": $skill_md_json,
  "thresholds": {
    "skill_md_soft_lines": $SKILL_MD_SOFT,
    "skill_md_hard_lines": $SKILL_MD_HARD,
    "description_soft_chars": $DESC_SOFT,
    "description_hard_chars": $DESC_HARD
  },
  "violations": $violations_detail,
  "checked_at": "$checked_at"
}
EOF
