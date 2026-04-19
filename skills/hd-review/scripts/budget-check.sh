#!/usr/bin/env bash
# budget-check.sh — deterministic always-loaded + SKILL.md budget enforcement.
# Auto-detects user-repo skill locations + always-loaded contract.
# Dependencies: bash 4+, jq, awk, wc, grep, sed
# Emits JSON to stdout. Exit 0 if no violations and always-loaded within budget; exit 1 otherwise.
# Call from repo root.

set -euo pipefail

# ──────────────────────────────────────────────────────────────────────
# Thresholds
# ──────────────────────────────────────────────────────────────────────

ALWAYS_LOADED_BUDGET=200       # lines combined for always-loaded file set
SKILL_MD_SOFT=200              # lines (router target)
SKILL_MD_HARD=500              # lines (Anthropic hard cap)
DESC_SOFT=180                  # chars (description field target)
DESC_HARD=1024                 # chars (Anthropic hard cap)

# ──────────────────────────────────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────────────────────────────────

count_lines() {
  local f="$1"
  if [ -f "$f" ]; then
    wc -l < "$f" | tr -d ' '
  else
    echo 0
  fi
}

extract_frontmatter() {
  local f="$1"
  awk '/^---[[:space:]]*$/{n++; if (n==2) exit; next} n==1{print}' "$f"
}

extract_description() {
  local f="$1"
  extract_frontmatter "$f" \
    | awk '/^description:[[:space:]]*/{sub(/^description:[[:space:]]*/, ""); print; exit}' \
    | sed -E 's/^"(.*)"[[:space:]]*$/\1/; s/^'\''(.*)'\''[[:space:]]*$/\1/'
}

# ──────────────────────────────────────────────────────────────────────
# Detect skill directory — probe user-repo conventions
# ──────────────────────────────────────────────────────────────────────

detect_skill_dir() {
  # Priority order: .agent/skills/, .claude/skills/, skills/
  for candidate in ".agent/skills" ".claude/skills" "skills"; do
    if [ -d "$candidate" ]; then
      # Only report it if there's at least one SKILL.md inside
      if ls "$candidate"/*/SKILL.md >/dev/null 2>&1; then
        echo "$candidate"
        return 0
      fi
    fi
  done
  # No skill directory found
  echo ""
}

SKILL_DIR=$(detect_skill_dir)

# ──────────────────────────────────────────────────────────────────────
# Load always-loaded contract — read loading-order.md if present
# ──────────────────────────────────────────────────────────────────────

# Contract source determines which files count toward ALWAYS_LOADED_BUDGET.
# Priority: .agent/loading-order.md, loading-order.md, then fallback defaults.

load_always_loaded_contract() {
  local contract_file=""
  if [ -f ".agent/loading-order.md" ]; then
    contract_file=".agent/loading-order.md"
  elif [ -f "loading-order.md" ]; then
    contract_file="loading-order.md"
  fi

  if [ -n "$contract_file" ]; then
    # Parse `always-loaded:` or `tier 1:` bullet lists from the contract.
    # Extract .md paths that follow bullet markers.
    grep -Eio '[-*]\s*`?[^[:space:]`]+\.md`?' "$contract_file" 2>/dev/null \
      | sed -E 's/^[-*][[:space:]]*`?([^[:space:]`]+\.md)`?.*/\1/' \
      | sort -u
    echo "SOURCE=$contract_file"
  else
    # Default always-loaded set: AGENTS.md + product one-pager + design-system cheat-sheet
    echo "AGENTS.md"
    echo "docs/context/product/one-pager.md"
    echo "docs/context/design-system/components/cheat-sheet.md"
    echo "SOURCE=default"
  fi
}

# Capture contract output into a temp var
contract_output=$(load_always_loaded_contract)
contract_source=$(echo "$contract_output" | grep '^SOURCE=' | cut -d= -f2)
always_loaded_files=$(echo "$contract_output" | grep -v '^SOURCE=' || true)

# ──────────────────────────────────────────────────────────────────────
# Always-loaded line count
# ──────────────────────────────────────────────────────────────────────

always_loaded_total=0
always_loaded_breakdown='[]'

while IFS= read -r f; do
  [ -z "$f" ] && continue
  lines=$(count_lines "$f")
  always_loaded_total=$((always_loaded_total + lines))
  entry=$(jq -n --arg path "$f" --argjson lines "$lines" '{path:$path, lines:$lines}')
  always_loaded_breakdown=$(jq -n --argjson acc "$always_loaded_breakdown" --argjson v "$entry" '$acc + [$v]')
done <<< "$always_loaded_files"

always_loaded_ok=true
if [ "$always_loaded_total" -gt "$ALWAYS_LOADED_BUDGET" ]; then
  always_loaded_ok=false
fi

# ──────────────────────────────────────────────────────────────────────
# Collect skill data + violations
# ──────────────────────────────────────────────────────────────────────

skills_json='[]'
violations_json='[]'

if [ -n "$SKILL_DIR" ] && [ -d "$SKILL_DIR" ]; then
  for skill_md in "$SKILL_DIR"/*/SKILL.md; do
    [ -f "$skill_md" ] || continue

    lines=$(count_lines "$skill_md")
    desc=$(extract_description "$skill_md" || true)
    desc_len=${#desc}

    skill_violations='[]'

    if [ "$lines" -gt "$SKILL_MD_HARD" ]; then
      v=$(jq -n --arg file "$skill_md" --arg rule "skill_md_hard_cap_${SKILL_MD_HARD}" --argjson actual "$lines" --arg severity "error" '{file:$file, rule:$rule, actual:$actual, severity:$severity}')
      violations_json=$(jq -n --argjson acc "$violations_json" --argjson v "$v" '$acc + [$v]')
      skill_violations=$(jq -n --argjson acc "$skill_violations" --argjson v "$v" '$acc + [$v]')
    elif [ "$lines" -gt "$SKILL_MD_SOFT" ]; then
      v=$(jq -n --arg file "$skill_md" --arg rule "skill_md_soft_cap_${SKILL_MD_SOFT}" --argjson actual "$lines" --arg severity "warn" '{file:$file, rule:$rule, actual:$actual, severity:$severity}')
      violations_json=$(jq -n --argjson acc "$violations_json" --argjson v "$v" '$acc + [$v]')
      skill_violations=$(jq -n --argjson acc "$skill_violations" --argjson v "$v" '$acc + [$v]')
    fi

    if [ "$desc_len" -gt "$DESC_HARD" ]; then
      v=$(jq -n --arg file "$skill_md" --arg rule "description_hard_cap_${DESC_HARD}" --argjson actual "$desc_len" --arg severity "error" '{file:$file, rule:$rule, actual:$actual, severity:$severity}')
      violations_json=$(jq -n --argjson acc "$violations_json" --argjson v "$v" '$acc + [$v]')
      skill_violations=$(jq -n --argjson acc "$skill_violations" --argjson v "$v" '$acc + [$v]')
    elif [ "$desc_len" -gt "$DESC_SOFT" ]; then
      v=$(jq -n --arg file "$skill_md" --arg rule "description_soft_cap_${DESC_SOFT}" --argjson actual "$desc_len" --arg severity "warn" '{file:$file, rule:$rule, actual:$actual, severity:$severity}')
      violations_json=$(jq -n --argjson acc "$violations_json" --argjson v "$v" '$acc + [$v]')
      skill_violations=$(jq -n --argjson acc "$skill_violations" --argjson v "$v" '$acc + [$v]')
    fi

    skill_entry=$(jq -n --arg path "$skill_md" --argjson lines "$lines" --argjson description_chars "$desc_len" --argjson violations "$skill_violations" '{path:$path, lines:$lines, description_chars:$description_chars, violations:$violations}')

    skills_json=$(jq -n --argjson acc "$skills_json" --argjson s "$skill_entry" '$acc + [$s]')
  done
fi

# Always-loaded violation added to the global violations list.
if [ "$always_loaded_ok" = false ]; then
  paths_concat=$(echo "$always_loaded_files" | tr '\n' '+' | sed 's/+$//; s/+/ + /g')
  v=$(jq -n --arg file "$paths_concat" --arg rule "always_loaded_budget_${ALWAYS_LOADED_BUDGET}" --argjson actual "$always_loaded_total" --arg severity "error" '{file:$file, rule:$rule, actual:$actual, severity:$severity}')
  violations_json=$(jq -n --argjson acc "$violations_json" --argjson v "$v" '$acc + [$v]')
fi

# ──────────────────────────────────────────────────────────────────────
# Emit final JSON
# ──────────────────────────────────────────────────────────────────────

violations_count=$(jq 'length' <<<"$violations_json")
total_skills=$(jq 'length' <<<"$skills_json")
always_loaded_status="ok"
[ "$always_loaded_ok" = false ] && always_loaded_status="over_budget"

# Detection diagnostics
skill_dir_out="${SKILL_DIR:-none}"

jq -n \
  --argjson always_loaded_ok "$([ "$always_loaded_ok" = true ] && echo true || echo false)" \
  --argjson always_loaded_lines "$always_loaded_total" \
  --argjson always_loaded_budget "$ALWAYS_LOADED_BUDGET" \
  --argjson always_loaded_breakdown "$always_loaded_breakdown" \
  --arg always_loaded_contract_source "$contract_source" \
  --arg skill_dir_detected "$skill_dir_out" \
  --argjson skills "$skills_json" \
  --argjson violations "$violations_json" \
  --argjson total_skills "$total_skills" \
  --argjson violations_count "$violations_count" \
  --arg always_loaded_status "$always_loaded_status" \
  '{
     always_loaded_ok: $always_loaded_ok,
     always_loaded_lines: $always_loaded_lines,
     always_loaded_budget: $always_loaded_budget,
     always_loaded_breakdown: $always_loaded_breakdown,
     always_loaded_contract_source: $always_loaded_contract_source,
     skill_dir_detected: $skill_dir_detected,
     skills: $skills,
     violations: $violations,
     summary: {
       total_skills: $total_skills,
       violations_count: $violations_count,
       always_loaded_status: $always_loaded_status
     }
   }'

# Exit 1 if there are any violations OR always-loaded is over budget.
if [ "$violations_count" -gt 0 ] || [ "$always_loaded_ok" = false ]; then
  exit 1
fi
exit 0
