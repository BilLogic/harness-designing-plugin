#!/usr/bin/env bash
# release.sh — version bump + tag + push for design-harness plug-in
# Phase 3u (2026-04-24). Replaces the manual ritual: bump 3 plugin.json
# manifests + marketplace.json, close [Unreleased] in CHANGELOG.md,
# commit, tag, push tag.
#
# Usage:
#   scripts/release.sh <new-version>          # e.g. 1.5.0
#   scripts/release.sh <new-version> --dry    # show what would change, don't execute
#
# Preconditions:
#   - Working tree clean
#   - Currently on a feature/release branch (NOT main)
#   - All 4 manifests + marketplace agree on the current version
#   - CHANGELOG.md has an [Unreleased] section with content
#
# Postconditions:
#   - 4 manifest files bumped to new version
#   - CHANGELOG.md [Unreleased] → [<new-version>] — <today>
#   - One commit: "release: v<new-version>"
#   - Annotated tag v<new-version> pointing at the release commit
#   - Branch pushed to origin (BUT NOT the tag — push the tag manually
#     after verifying the commit, per release safety convention)
#
# What this does NOT do:
#   - Push the tag (do it yourself: `git push <remote> v<new-version>`)
#   - Run `gh release create` (do it yourself with release notes)
#   - Modify code or docs other than versions + CHANGELOG header
#   - Force-push, amend, or otherwise alter history

set -euo pipefail

# --- arg parsing ---

if [[ $# -lt 1 ]]; then
  echo "usage: $0 <new-version> [--dry]" >&2
  exit 1
fi

NEW_VERSION="$1"
DRY_RUN="false"
if [[ "${2:-}" == "--dry" ]]; then
  DRY_RUN="true"
fi

# Validate semver shape (loose: N.N.N with optional -prerelease)
if ! [[ "$NEW_VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[a-zA-Z0-9.]+)?$ ]]; then
  echo "error: <new-version> must be semver (e.g. 1.5.0 or 1.5.0-rc1); got: $NEW_VERSION" >&2
  exit 1
fi

# --- locate repo root + cd ---

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

# --- preflight ---

CURRENT_BRANCH="$(git branch --show-current)"
if [[ "$CURRENT_BRANCH" == "main" || "$CURRENT_BRANCH" == "master" ]]; then
  echo "error: refusing to release directly from $CURRENT_BRANCH; use a release branch" >&2
  exit 1
fi

if [[ -n "$(git status --porcelain)" ]]; then
  echo "error: working tree not clean. Commit or stash first:" >&2
  git status --short >&2
  exit 1
fi

MANIFESTS=(
  ".claude-plugin/plugin.json"
  ".codex-plugin/plugin.json"
  ".cursor-plugin/plugin.json"
  ".claude-plugin/marketplace.json"
)

for f in "${MANIFESTS[@]}"; do
  if [[ ! -f "$f" ]]; then
    echo "error: manifest not found: $f" >&2
    exit 1
  fi
done

# Extract current version from .claude-plugin/plugin.json (canonical)
CURRENT_VERSION="$(python3 -c "import json; print(json.load(open('.claude-plugin/plugin.json'))['version'])")"

# Verify all 4 manifests agree
for f in "${MANIFESTS[@]}"; do
  v="$(python3 -c "import json; d=json.load(open('$f')); print(d.get('version') or d['plugins'][0]['version'])" 2>/dev/null || echo "")"
  if [[ -z "$v" ]]; then
    echo "error: could not extract version from $f" >&2
    exit 1
  fi
  if [[ "$v" != "$CURRENT_VERSION" ]]; then
    echo "error: manifest version drift — $f shows $v but .claude-plugin/plugin.json shows $CURRENT_VERSION" >&2
    exit 1
  fi
done

if [[ "$NEW_VERSION" == "$CURRENT_VERSION" ]]; then
  echo "error: new version equals current version ($CURRENT_VERSION). Did you forget to bump?" >&2
  exit 1
fi

# Check CHANGELOG.md has [Unreleased] section with content
if ! grep -q "^## \[Unreleased\]" CHANGELOG.md; then
  echo "error: CHANGELOG.md has no [Unreleased] section. Add release notes there first." >&2
  exit 1
fi

# Crude check: there's at least one non-blank line between [Unreleased] and the next ## heading
UNRELEASED_BODY="$(awk '/^## \[Unreleased\]/{flag=1; next} /^## \[/{flag=0} flag' CHANGELOG.md | grep -c '[^[:space:]]' || true)"
if [[ "$UNRELEASED_BODY" -eq 0 ]]; then
  echo "error: CHANGELOG.md [Unreleased] section is empty. Add release notes before tagging." >&2
  exit 1
fi

TODAY="$(date +%Y-%m-%d)"

# --- show plan ---

echo "release plan: $CURRENT_VERSION → $NEW_VERSION (dated $TODAY)"
echo "branch: $CURRENT_BRANCH"
echo "manifests to bump:"
for f in "${MANIFESTS[@]}"; do echo "  - $f"; done
echo "CHANGELOG.md: rewrite '## [Unreleased]' → '## [$NEW_VERSION] — $TODAY'"
echo "commit: 'release: v$NEW_VERSION'"
echo "tag: 'v$NEW_VERSION'"
echo

if [[ "$DRY_RUN" == "true" ]]; then
  echo "[dry-run] no changes made. Re-run without --dry to apply."
  exit 0
fi

# --- execute ---

# Bump manifests (sed replace; same pattern used by manual workflow)
for f in "${MANIFESTS[@]}"; do
  sed -i.bak "s/\"version\": \"$CURRENT_VERSION\"/\"version\": \"$NEW_VERSION\"/g" "$f"
  rm "${f}.bak"
done

# Validate JSON still parses
for f in "${MANIFESTS[@]}"; do
  if ! python3 -c "import json; json.load(open('$f'))" 2>/dev/null; then
    echo "error: $f no longer parses as JSON after bump. Reverting." >&2
    git checkout -- "${MANIFESTS[@]}"
    exit 1
  fi
done

# Rewrite CHANGELOG [Unreleased] header
sed -i.bak "s/^## \[Unreleased\]/## [$NEW_VERSION] — $TODAY/" CHANGELOG.md
rm CHANGELOG.md.bak

# Stage + commit
git add "${MANIFESTS[@]}" CHANGELOG.md
git commit -m "release: v$NEW_VERSION"

# Annotated tag pointing at the release commit
git tag -a "v$NEW_VERSION" -m "v$NEW_VERSION"

# Push the branch (NOT the tag — operator pushes the tag manually after verification)
REMOTE="$(git remote | head -1)"
if [[ -n "$REMOTE" ]]; then
  git push "$REMOTE" "$CURRENT_BRANCH"
fi

echo
echo "✓ release commit landed + tag v$NEW_VERSION created locally"
echo
echo "next steps (manual):"
echo "  1. verify: git log -1 --oneline; git show v$NEW_VERSION --stat"
echo "  2. push the tag: git push <remote> v$NEW_VERSION"
echo "  3. (optional) gh release create v$NEW_VERSION --notes-from-tag"
