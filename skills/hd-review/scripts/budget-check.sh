#!/usr/bin/env bash
# budget-check.sh — deterministic Tier 1 line-count + SKILL.md budget enforcement.
# Dependencies: bash 4+, jq, awk, wc, grep, sed
# Emits JSON to stdout. Exit 0 if no violations and Tier 1 within budget; exit 1 otherwise.
# Call from repo root.

set -euo pipefail

# ──────────────────────────────────────────────────────────────────────
# Thresholds (match references/bloat-detection.md)
# ──────────────────────────────────────────────────────────────────────

TIER_1_BUDGET=200              # lines combined (AGENTS.md + product/one-pager.md)
SKILL_MD_SOFT=200              # lines (router target)
SKILL_MD_HARD=500              # lines (Anthropic hard cap)
DESC_SOFT=180                  # chars (description field target)
DESC_HARD=1024                 # chars (Anthropic hard cap)

# ──────────────────────────────────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────────────────────────────────

count_lines() {
  # Count lines; 0 if file missing.
  local f="$1"
  if [ -f "$f" ]; then
    wc -l < "$f" | tr -d ' '
  else
    echo 0
  fi
}

extract_frontmatter() {
  # Extract YAML frontmatter between the first pair of `---` fences.
  local f="$1"
  awk '/^---[[:space:]]*$/{n++; if (n==2) exit; next} n==1{print}' "$f"
}

extract_description() {
  # Extract description field value from frontmatter. Handles:
  #   description: value
  #   description: "value"
  #   description: 'value'
  # Does NOT handle multi-line YAML block scalars (>, |); returns first-line only.
  local f="$1"
  extract_frontmatter "$f" \
    | awk '/^description:[[:space:]]*/{sub(/^description:[[:space:]]*/, ""); print; exit}' \
    | sed -E 's/^"(.*)"[[:space:]]*$/\1/; s/^'\''(.*)'\''[[:space:]]*$/\1/'
}

# ──────────────────────────────────────────────────────────────────────
# Tier 1 check
# ──────────────────────────────────────────────────────────────────────

agents_md_lines=$(count_lines "AGENTS.md")
one_pager_lines=$(count_lines "docs/context/product/one-pager.md")
tier1_total=$((agents_md_lines + one_pager_lines))

tier_1_ok=true
if [ "$tier1_total" -gt "$TIER_1_BUDGET" ]; then
  tier_1_ok=false
fi

# ──────────────────────────────────────────────────────────────────────
# Collect skill data + violations
# ──────────────────────────────────────────────────────────────────────

# Build arrays via a portable temp-file approach to avoid subshell scoping.
skills_json='[]'
violations_json='[]'

if [ -d "skills" ]; then
  for skill_md in skills/*/SKILL.md; do
    [ -f "$skill_md" ] || continue

    lines=$(count_lines "$skill_md")
    desc=$(extract_description "$skill_md" || true)
    desc_len=${#desc}

    # Per-skill violation list (strings for this skill only).
    skill_violations='[]'

    if [ "$lines" -gt "$SKILL_MD_HARD" ]; then
      v=$(jq -n \
        --arg file "$skill_md" \
        --arg rule "skill_md_hard_cap_${SKILL_MD_HARD}" \
        --argjson actual "$lines" \
        --arg severity "error" \
        '{file:$file, rule:$rule, actual:$actual, severity:$severity}')
      violations_json=$(jq -n --argjson acc "$violations_json" --argjson v "$v" '$acc + [$v]')
      skill_violations=$(jq -n --argjson acc "$skill_violations" --argjson v "$v" '$acc + [$v]')
    elif [ "$lines" -gt "$SKILL_MD_SOFT" ]; then
      v=$(jq -n \
        --arg file "$skill_md" \
        --arg rule "skill_md_soft_cap_${SKILL_MD_SOFT}" \
        --argjson actual "$lines" \
        --arg severity "warn" \
        '{file:$file, rule:$rule, actual:$actual, severity:$severity}')
      violations_json=$(jq -n --argjson acc "$violations_json" --argjson v "$v" '$acc + [$v]')
      skill_violations=$(jq -n --argjson acc "$skill_violations" --argjson v "$v" '$acc + [$v]')
    fi

    if [ "$desc_len" -gt "$DESC_HARD" ]; then
      v=$(jq -n \
        --arg file "$skill_md" \
        --arg rule "description_hard_cap_${DESC_HARD}" \
        --argjson actual "$desc_len" \
        --arg severity "error" \
        '{file:$file, rule:$rule, actual:$actual, severity:$severity}')
      violations_json=$(jq -n --argjson acc "$violations_json" --argjson v "$v" '$acc + [$v]')
      skill_violations=$(jq -n --argjson acc "$skill_violations" --argjson v "$v" '$acc + [$v]')
    elif [ "$desc_len" -gt "$DESC_SOFT" ]; then
      v=$(jq -n \
        --arg file "$skill_md" \
        --arg rule "description_soft_cap_${DESC_SOFT}" \
        --argjson actual "$desc_len" \
        --arg severity "warn" \
        '{file:$file, rule:$rule, actual:$actual, severity:$severity}')
      violations_json=$(jq -n --argjson acc "$violations_json" --argjson v "$v" '$acc + [$v]')
      skill_violations=$(jq -n --argjson acc "$skill_violations" --argjson v "$v" '$acc + [$v]')
    fi

    skill_entry=$(jq -n \
      --arg path "$skill_md" \
      --argjson lines "$lines" \
      --argjson description_chars "$desc_len" \
      --argjson violations "$skill_violations" \
      '{path:$path, lines:$lines, description_chars:$description_chars, violations:$violations}')

    skills_json=$(jq -n --argjson acc "$skills_json" --argjson s "$skill_entry" '$acc + [$s]')
  done
fi

# Tier 1 violation added to the global violations list.
if [ "$tier_1_ok" = false ]; then
  v=$(jq -n \
    --arg file "AGENTS.md + docs/context/product/one-pager.md" \
    --arg rule "tier_1_budget_${TIER_1_BUDGET}" \
    --argjson actual "$tier1_total" \
    --arg severity "error" \
    '{file:$file, rule:$rule, actual:$actual, severity:$severity}')
  violations_json=$(jq -n --argjson acc "$violations_json" --argjson v "$v" '$acc + [$v]')
fi

# ──────────────────────────────────────────────────────────────────────
# Emit final JSON
# ──────────────────────────────────────────────────────────────────────

violations_count=$(jq 'length' <<<"$violations_json")
total_skills=$(jq 'length' <<<"$skills_json")
tier_1_status="ok"
[ "$tier_1_ok" = false ] && tier_1_status="over_budget"

jq -n \
  --argjson tier_1_ok "$([ "$tier_1_ok" = true ] && echo true || echo false)" \
  --argjson tier_1_lines "$tier1_total" \
  --argjson skills "$skills_json" \
  --argjson violations "$violations_json" \
  --argjson total_skills "$total_skills" \
  --argjson violations_count "$violations_count" \
  --arg tier_1_status "$tier_1_status" \
  '{
     tier_1_ok: $tier_1_ok,
     tier_1_lines: $tier_1_lines,
     skills: $skills,
     violations: $violations,
     summary: {
       total_skills: $total_skills,
       violations_count: $violations_count,
       tier_1_status: $tier_1_status
     }
   }'

# Exit 1 if there are any violations OR tier 1 is over budget.
if [ "$violations_count" -gt 0 ] || [ "$tier_1_ok" = false ]; then
  exit 1
fi
exit 0
