---
title: "v1.0.0 ship-gate smoke tests — plan-hash round-trip, audit-write collision, detect-mode.sh fragility"
date: 2026-04-17
tags: [smoke-test, plan-hash, audit, detect-mode, bash-fragility, ship-gate, v1]
graduation_candidate: no
---

# Lesson

**Context:** Ahead of the v1.0.0 release we ran deterministic smoke tests against the two mechanisms most likely to silently fail: the plan-hash proof-of-consent (hd-compound) and the single-file audit write (hd-review). Also ran `detect-mode.sh` across five scratch fixtures covering greenfield / scattered / localize / advanced-local_md / advanced-layers paths.

## What we verified

### Plan-hash round-trip (hd-compound)

Built a reference implementation of the canonical hash from [`skills/hd-compound/references/plan-hash-protocol.md`](../../../skills/hd-compound/references/plan-hash-protocol.md) § "Hash input format" and ran five assertions against a scratch repo with 3 same-topic lessons:

| # | Property | Expected | Observed |
|---|---|---|---|
| 1 | Determinism (same inputs → same hash) | equal | ✓ `e7cf29…1416` both runs |
| 2 | Lesson content tampered → hash changes | different | ✓ `cebd9555…` |
| 3 | After restore, hash returns to original | equal | ✓ `e7cf29…1416` |
| 4 | AGENTS.md tampered → hash changes | different | ✓ `ebb2d8f6…` |
| 5 | Rule-text substitution → hash changes | different | ✓ `703e096a…` |

All 5 held. The canonical 7-line format from the protocol produces a stable hash suitable for `graduate-apply --plan-hash <sha>` verification.

**Implementation note:** trailing-newline handling was initially a concern but `shasum -a 256 < FILE` with the protocol's file-content hash (no normalization) gave us byte-stable results. `sed -i.bak` for the restore step preserves the exact file bytes.

### Audit single-file write (hd-review)

Tested Step 9 of [`skills/hd-review/workflows/audit-parallel.md`](../../../skills/hd-review/workflows/audit-parallel.md) — the path-collision loop that suffixes `-001`, `-002`, etc. when multiple audits run the same day. 4 consecutive invocations:

```
harness-audit-2026-04-17.md
harness-audit-2026-04-17-001.md
harness-audit-2026-04-17-002.md
harness-audit-2026-04-17-003.md
```

No files landed outside `docs/knowledge/lessons/harness-audit-*.md`. The "write ONLY to that path" invariant held.

### budget-check.sh on current repo

Emits valid JSON (parsed clean with `python3 -m json.tool`). Current state: Tier 1 = 179/200 (pass), 4 SKILL.md files all under 200-line soft cap, 0 violations.

### detect-mode.sh across 5 fixtures

All 5 fixtures routed to the expected mode and priority:

| Fixture | Expected mode | Priority | Result |
|---|---|---|---|
| greenfield | greenfield | 6 | ✓ |
| scattered-bloat (600-line AGENTS.md) | scattered + bloat_overlay | 5 | ✓ |
| localize (3 placeholder files) | localize | 2 | ✓ |
| advanced-local_md | advanced | 1 | ✓ |
| advanced-layers | advanced | 3 | ✓ |

## What we fixed

**Fix 1 — `detect-mode.sh` line 65 — fragile bash syntax.** Original code:

```bash
{ "$single_file_bloat" = true || "$combined_bloat" = true ; } && has_bloat=true
```

This *worked* but only by accident: bash was executing `true` and `false` as actual commands (both real binaries that return 0 / 1 and ignore arguments). If someone ever swapped the convention to e.g. `"$flag" = "yes"`, the check would silently collapse — `yes = yes` invokes the `yes` binary which runs forever. Replaced with explicit `[ ... ]` form:

```bash
if [ "$single_file_bloat" = true ] || [ "$combined_bloat" = true ]; then
  has_bloat=true
fi
```

Re-ran the bloat fixture after the fix: `has_bloat: true`, `bloat_overlay: true` — unchanged behavior, now robust.

**Fix 2 — `detect-mode.sh` placeholder regex — false positive on our own repo.** Running the script on this repo flagged it as `localize` mode because our own plan files (`docs/plans/*-plan.md`) discuss the `{{PLACEHOLDER}}` pattern as a concept. Two problems compounded:

1. The regex was `"{{"` — too loose. Any prose mentioning `{{` syntax hit.
2. `--exclude-dir=docs/plans` didn't exclude anything — `grep`'s `--exclude-dir` matches basenames, not paths. Needed `--exclude-dir=plans`.

Fixes:
- Tightened regex to `{{[A-Z][A-Z0-9_]+}}` — matches real localization markers like `{{TEAM_NAME}}` but not prose that mentions `{{` syntax
- Added `--exclude-dir=plans` and `--exclude-dir=knowledge` (basenames) so our meta-harness docs don't contaminate detection

After both fixes: our repo → `advanced` (correct; `docs/context/` + `docs/knowledge/` exist), localize fixture still → `localize`, scattered-bloat still → `scattered`, greenfield still → `greenfield`. 4/4 routes correct.

**Lesson for future scripts:** any regex that runs on a user's entire repo must be tight enough that *meta-discussion of the pattern* doesn't trigger. If the pattern is common in technical writing, exclude doc dirs (`plans/`, `knowledge/`, `README.md` prose). Test the script against the plug-in's own repo as a fixture — if it false-positives on us, it'll false-positive on any team that documents their harness setup.

## Graduation-readiness

**No.** This is a one-off verification record, not a recurring pattern. The underlying rule ("don't rely on bash command-as-boolean tricks") is general Unix discipline, not design-harness-specific; no need to graduate to AGENTS.md.

## See also

- [`skills/hd-compound/references/plan-hash-protocol.md`](../../../skills/hd-compound/references/plan-hash-protocol.md) — spec tested here
- [`skills/hd-review/workflows/audit-parallel.md`](../../../skills/hd-review/workflows/audit-parallel.md) — Step 9 verified
- [`docs/plans/usability-test-protocol.md`](../../plans/usability-test-protocol.md) — n=5 designer protocol (next gate)
