#!/usr/bin/env bash
# compute-plan-hash.sh — deterministic SHA-256 plan-hash for /hd:maintain graduations.
#
# Reference implementation for the plan-hash protocol. This is the single source
# of truth for the canonical-string format; no other process (including Claude
# "in its head") should attempt to compute the hash.
#
# Inputs (JSON on stdin preferred; flags accepted as fallback):
#   {"title": "...", "paths": ["..."], "date": "YYYY-MM-DD",
#    "author": "...", "diff_summary": "..."}
#
# Flags: --title, --paths (comma-separated), --date, --author, --diff-summary
#        --print-canonical   print canonical string instead of hash (debug)
#
# Canonical-string format (LF-only, no trailing newline, strict order):
#   title\ndate\nauthor\nsorted_paths_joined_with_|\ndiff_summary
#
# Normalization: strip CR, strip leading/trailing whitespace on each field,
#                sort paths via `LC_ALL=C sort` (byte order, locale-independent).
#
# Output: 64-char lowercase hex SHA-256 + newline on stdout. Errors → stderr, exit≠0.

set -euo pipefail

PRINT_CANONICAL=0
TITLE=""
PATHS_CSV=""
DATE=""
AUTHOR=""
DIFF_SUMMARY=""
USE_STDIN=1

# --- arg parse ---
while [ $# -gt 0 ]; do
  case "$1" in
    --title)         TITLE="$2";         USE_STDIN=0; shift 2 ;;
    --paths)         PATHS_CSV="$2";     USE_STDIN=0; shift 2 ;;
    --date)          DATE="$2";          USE_STDIN=0; shift 2 ;;
    --author)        AUTHOR="$2";        USE_STDIN=0; shift 2 ;;
    --diff-summary)  DIFF_SUMMARY="$2";  USE_STDIN=0; shift 2 ;;
    --print-canonical) PRINT_CANONICAL=1; shift ;;
    -h|--help)
      sed -n '2,22p' "$0" | sed 's/^# \{0,1\}//'
      exit 0 ;;
    *) echo "compute-plan-hash: unknown arg: $1" >&2; exit 2 ;;
  esac
done

# --- stdin JSON parse (preferred) ---
if [ "$USE_STDIN" = "1" ]; then
  if [ -t 0 ]; then
    echo "compute-plan-hash: no input on stdin and no flags given. See --help." >&2
    exit 2
  fi
  command -v jq >/dev/null 2>&1 || { echo "compute-plan-hash: jq required for stdin JSON input" >&2; exit 2; }
  JSON="$(cat)"
  if ! echo "$JSON" | jq -e . >/dev/null 2>&1; then
    echo "compute-plan-hash: malformed JSON on stdin" >&2; exit 2
  fi
  TITLE="$(echo "$JSON" | jq -r '.title // ""')"
  DATE="$(echo "$JSON" | jq -r '.date // ""')"
  AUTHOR="$(echo "$JSON" | jq -r '.author // ""')"
  DIFF_SUMMARY="$(echo "$JSON" | jq -r '.diff_summary // ""')"
  # paths → newline-joined for sorting
  PATHS_NL="$(echo "$JSON" | jq -r '.paths // [] | .[]')"
else
  # convert CSV → newline-joined
  PATHS_NL="$(printf '%s' "$PATHS_CSV" | tr ',' '\n')"
fi

# --- normalize: strip CR, strip leading/trailing whitespace on every field ---
strip() {
  # strip CR, then leading/trailing whitespace (spaces + tabs + newlines)
  printf '%s' "$1" | tr -d '\r' | awk 'BEGIN{RS="\0"} {
    sub(/^[ \t\n]+/, ""); sub(/[ \t\n]+$/, ""); printf "%s", $0
  }'
}

TITLE="$(strip "$TITLE")"
DATE="$(strip "$DATE")"
AUTHOR="$(strip "$AUTHOR")"
DIFF_SUMMARY="$(strip "$DIFF_SUMMARY")"

# --- required-field validation ---
for pair in "title:$TITLE" "date:$DATE" "author:$AUTHOR" "diff_summary:$DIFF_SUMMARY"; do
  name="${pair%%:*}"; val="${pair#*:}"
  if [ -z "$val" ]; then
    echo "compute-plan-hash: missing required field: $name" >&2; exit 2
  fi
done

# --- sort paths: strip CR, strip per-line whitespace, drop empties, LC_ALL=C sort, join with | ---
if [ -z "${PATHS_NL:-}" ]; then
  echo "compute-plan-hash: missing required field: paths (non-empty list required)" >&2; exit 2
fi
SORTED_PATHS="$(printf '%s' "$PATHS_NL" \
  | tr -d '\r' \
  | awk '{sub(/^[ \t]+/,""); sub(/[ \t]+$/,""); if (length($0)>0) print}' \
  | LC_ALL=C sort \
  | awk 'BEGIN{first=1} {if(first){printf "%s",$0; first=0} else {printf "|%s",$0}}')"

if [ -z "$SORTED_PATHS" ]; then
  echo "compute-plan-hash: paths list empty after normalization" >&2; exit 2
fi

# --- canonical string: fixed order, \n separators, no trailing newline ---
CANONICAL="$(printf '%s\n%s\n%s\n%s\n%s' "$TITLE" "$DATE" "$AUTHOR" "$SORTED_PATHS" "$DIFF_SUMMARY")"

if [ "$PRINT_CANONICAL" = "1" ]; then
  printf '%s\n' "$CANONICAL"
  exit 0
fi

# --- hash: prefer shasum -a 256 (macOS), fall back to sha256sum (Linux) ---
if command -v shasum >/dev/null 2>&1; then
  HASH="$(printf '%s' "$CANONICAL" | shasum -a 256 | cut -d' ' -f1)"
elif command -v sha256sum >/dev/null 2>&1; then
  HASH="$(printf '%s' "$CANONICAL" | sha256sum | cut -d' ' -f1)"
else
  echo "compute-plan-hash: neither shasum nor sha256sum found on PATH" >&2; exit 2
fi

printf '%s\n' "$HASH"
