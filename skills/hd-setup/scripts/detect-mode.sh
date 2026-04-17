#!/usr/bin/env bash
# detect-mode.sh — deterministic mode detection for hd:setup
#
# Emits JSON to stdout matching the LOCKED shape in
# skills/hd-setup/references/local-md-schema.md + local-md-schema spec.
#
# Exit 0 on success. Non-zero on JSON-generation error only
# (never on "no mode found" — that's greenfield).
#
# Requires: bash 3.2+ (macOS/Linux default).
# Call from user's repo root.

set -eu

# ──────────────────────────────────────────────────────────────────────
# Signal detection
# ──────────────────────────────────────────────────────────────────────

has_local_md=false
has_placeholders=false
has_layer_folders=false
has_ai_docs=false
has_bloat=false
compound_installed=false

[ -f "design-harnessing.local.md" ] && has_local_md=true

# Count placeholder hits — 3+ triggers localize mode.
# Pattern: {{UPPER_SNAKE_CASE}} only — matches real localization markers
# like {{TEAM_NAME}}, {{YOUR_PRODUCT}}. Avoids false positives from prose
# that mentions the `{{` syntax in examples or docs.
placeholder_count=0
if command -v grep >/dev/null 2>&1; then
  placeholder_count=$(grep -rlE '\{\{[A-Z][A-Z0-9_]+\}\}' . 2>/dev/null \
    --exclude-dir=.git \
    --exclude-dir=node_modules \
    --exclude-dir=skills \
    --exclude-dir=plans \
    --exclude-dir=knowledge \
    --exclude="*.template" \
    | wc -l | tr -d ' ')
fi
[ "$placeholder_count" -ge 3 ] && has_placeholders=true

# Layer folder presence
if [ -d "docs/context" ] && [ -d "docs/knowledge" ]; then
  has_layer_folders=true
fi

# AI doc presence
for f in AGENTS.md CLAUDE.md .cursor/rules .windsurf/rules .github/copilot-instructions.md DESIGN.md; do
  if [ -e "$f" ]; then
    has_ai_docs=true
    break
  fi
done

# Bloat check — single file >500 lines OR combined AI-docs >200 lines
single_file_bloat=false
combined_bloat=false
combined_lines=0
for f in AGENTS.md CLAUDE.md DESIGN.md; do
  if [ -f "$f" ]; then
    lines=$(wc -l < "$f" | tr -d ' ')
    [ "$lines" -gt 500 ] && single_file_bloat=true
    combined_lines=$((combined_lines + lines))
  fi
done
[ "$combined_lines" -gt 200 ] && combined_bloat=true
if [ "$single_file_bloat" = true ] || [ "$combined_bloat" = true ]; then
  has_bloat=true
fi

# Coexistence overlay
if [ -d "$HOME/.claude/plugins/cache/compound-engineering-plugin" ]; then
  compound_installed=true
fi

# ──────────────────────────────────────────────────────────────────────
# Mode determination (priority order; first match wins)
# ──────────────────────────────────────────────────────────────────────

mode="greenfield"
priority_matched=6

if [ "$has_local_md" = true ]; then
  mode="advanced"
  priority_matched=1
elif [ "$has_placeholders" = true ]; then
  mode="localize"
  priority_matched=2
elif [ "$has_layer_folders" = true ]; then
  mode="advanced"
  priority_matched=3
elif [ "$has_ai_docs" = true ]; then
  mode="scattered"
  priority_matched=4
  [ "$has_bloat" = true ] && priority_matched=5
fi

# bloat_overlay flag
bloat_overlay=false
[ "$has_bloat" = true ] && [ "$mode" = "scattered" ] && bloat_overlay=true

# ──────────────────────────────────────────────────────────────────────
# Emit JSON (LOCKED shape per local-md-schema.md)
# ──────────────────────────────────────────────────────────────────────

detected_at=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

cat <<EOF
{
  "schema_version": "1",
  "mode": "$mode",
  "priority_matched": $priority_matched,
  "signals": {
    "has_local_md": $has_local_md,
    "has_placeholders": $has_placeholders,
    "has_layer_folders": $has_layer_folders,
    "has_ai_docs": $has_ai_docs,
    "has_bloat": $has_bloat
  },
  "coexistence": {
    "compound_engineering": $compound_installed
  },
  "bloat_overlay": $bloat_overlay,
  "detected_at": "$detected_at"
}
EOF
