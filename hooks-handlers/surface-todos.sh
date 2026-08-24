#!/usr/bin/env bash
# surface-todos.sh — SessionStart hook
#
# Surfaces unfilled <!-- TODO --> markers across docs/context/**/*.md{x} at
# session start. Read-only — never modifies files. Output goes to stdout
# wrapped in `additionalContext` so Claude sees it.
#
# Activates only when the cwd has a populated docs/context/ tree. Silent
# otherwise.

set -euo pipefail

CWD="${CLAUDE_PROJECT_DIR:-$(pwd)}"
CONTEXT_DIR="$CWD/docs/context"

if [ ! -d "$CONTEXT_DIR" ]; then
  exit 0
fi

# Cap walk to keep hook fast (<1s)
TODO_COUNT=$(grep -rohE '<!--\s*TODO[^>]*-->' "$CONTEXT_DIR" 2>/dev/null | wc -l | tr -d ' ')

if [ "$TODO_COUNT" -eq 0 ]; then
  exit 0
fi

# Sample up to 5 TODO occurrences (path:line: snippet)
SAMPLE=$(grep -rnE '<!--\s*TODO[^>]*-->' "$CONTEXT_DIR" 2>/dev/null | head -5 | sed "s|$CWD/||")

# Emit as additionalContext via JSON output
cat <<EOF
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "📋 Harness has $TODO_COUNT unfilled TODO marker(s) under docs/context/. Sample:\n$SAMPLE\n\nRun /hd:design-system tracker for the full Tracker.mdx, or /hd:design-system establish --resume to continue scaffolding."
  }
}
EOF
