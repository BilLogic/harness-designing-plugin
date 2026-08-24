#!/usr/bin/env bash
# post-setup-summary.sh — Stop hook
#
# Emits a scenario-aware post-setup summary when /hd:setup or
# /hd:design-system establish/evolve completes. Detects completion by
# looking for a freshly-modified hd-config.md or index-manifest.json.
#
# Silent when no hd-* skill ran this turn.

set -euo pipefail

CWD="${CLAUDE_PROJECT_DIR:-$(pwd)}"
HD_CONFIG="$CWD/hd-config.md"
DS_MANIFEST="$CWD/docs/context/design-system/index-manifest.json"

# Skip if neither file exists or was touched recently (< 60s ago)
NOW=$(date +%s)
RECENT=0

if [ -f "$HD_CONFIG" ]; then
  MTIME=$(stat -f %m "$HD_CONFIG" 2>/dev/null || stat -c %Y "$HD_CONFIG" 2>/dev/null || echo 0)
  if [ "$((NOW - MTIME))" -lt 60 ]; then
    RECENT=1
  fi
fi

if [ -f "$DS_MANIFEST" ]; then
  MTIME=$(stat -f %m "$DS_MANIFEST" 2>/dev/null || stat -c %Y "$DS_MANIFEST" 2>/dev/null || echo 0)
  if [ "$((NOW - MTIME))" -lt 60 ]; then
    RECENT=1
  fi
fi

if [ "$RECENT" -eq 0 ]; then
  exit 0
fi

# Compose summary
SCENARIO="(unknown)"
TODO_COUNT=0

if [ -f "$DS_MANIFEST" ]; then
  SCENARIO=$(grep -oE '"scenario"\s*:\s*"[^"]+"' "$DS_MANIFEST" | head -1 | sed -E 's/.*"scenario"\s*:\s*"([^"]+)".*/\1/' || echo "(unknown)")
fi

if [ -d "$CWD/docs/context" ]; then
  TODO_COUNT=$(grep -rohE '<!--\s*TODO[^>]*-->' "$CWD/docs/context" 2>/dev/null | wc -l | tr -d ' ')
fi

cat <<EOF >&2

✓ harness-designing run complete
  scenario:        $SCENARIO
  TODOs in docs:   $TODO_COUNT
  next:            /hd:design-system tracker  # see Tracker.mdx
                   /hd:design-system validate # check for drift
                   /hd:review l1              # full L1 audit
EOF

exit 0
