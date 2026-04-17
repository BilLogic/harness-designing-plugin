#!/usr/bin/env bash
# detect-mode.sh — shim for backward compat. The canonical detector is
# scripts/detect.py (emits schema v2 JSON). This shim exists so any
# workflow or doc that still references detect-mode.sh keeps working.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec python3 "$SCRIPT_DIR/detect.py" "$@"
