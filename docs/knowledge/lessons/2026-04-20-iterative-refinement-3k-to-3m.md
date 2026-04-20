---
title: "Iterative refinement 3k → 3l → 3m: live testing surfaces what spec-writing misses"
date: 2026-04-20
tags: [iteration, live-testing, dogfood, compounding, process]
memory_type: episodic
importance: 5
rule_candidate: true
rule_ref: null
---

# Lesson

## Context

After shipping v1.0.0 (Phase 3j — marketplace submission with full polished feature set), we ran the plugin **live** against 10 real repos over two days (2026-04-19 and 2026-04-20). Every phase after v1.0.0 (3k, 3l, 3m) was triggered by concrete gaps that **only surfaced during live execution** — none were predicted from the v1.0.0 spec reviews.

Across ~25 fixes across three phases, the iteration followed a consistent pattern: **spec looked complete; live output disagreed**.

## Decision / Observation

Live testing found gaps in five categories that review-only would have missed:

### 1. False positives from surface-level detection
- `.claude/worktrees/` (Claude Code metadata) treated as meta-harness (3m.1)
- `budget-check.sh` hardcoded to our own plugin layout, returning `skills: 0` on every user repo (3k.2)
- `detect.py` reporting `layers_present: []` on Oracle Chat despite real L1 content scattered across `docs/PRD_*.md`, `docs/TECH_STACK.md` (3l.3)
- `compound-engineering` detected on Dawnova just from `compound-engineering.local.md` existing even when the harness was greenfield

**Pattern:** every presence-check that treated "file/folder exists" as "harness exists" was wrong in at least one real repo.

### 2. Tone-deaf defaults
- Guardrail auto-skipped L1/L2/L3 when existing harness detected — blunt and unhelpful when user came for suggestions (3l.4)
- Then review-by-default became tone-deaf in the opposite direction when guardrail fires on nominal-only signals (Dawnova's `.claude/worktrees/` alone produces no content to review — 3m.2)

**Pattern:** single-rule defaults fail at edges. Defaults need to read content substance, not just structural signals.

### 3. Vocabulary confusion
- "audit" vs "critique" modal prompt on `/hd:review` had no grounding in user mental model — what they wanted was "all layers or one layer?" (3l.7)
- "tier 1" meant nothing to users who hadn't read the plan files; "always-loaded" was the plain-language substitute (3k.9)

**Pattern:** plugin-internal terminology leaked into user-facing prose and made the UX feel foreign. Took a full terminology sweep (52 files) to clean up.

### 4. Orphan findings
- Review produced useful findings but never connected them to the scaffold pipeline — users saw "add `docs/rubrics/skill-quality.md`" but then had to manually create it or re-run `/hd:setup` (3m.3)
- `/hd:setup --from-review` closed the loop: review → concrete write proposals → preview gate → execute

**Pattern:** findings without an action path decay into ignored noise. The plugin needs to guide users from insight to fix.

### 5. Memory vs accountability
- Users ran reviews but had no signal that they'd seen the same findings before (3m.5)
- Staleness block surfaces git-log activity since the last review + overlap % — "you saw this 2 weeks ago, 8 commits since, 0 lessons captured"

**Pattern:** review needs to remember. Compounding requires "did you act on the last one?" signal.

## Result

- **3k → 3l → 3m landed 25 fixes** in ~36 hours of live iteration
- **All 5 original pilot repos + 5 additional test repos** produce coherent reviews now
- **v1.1.0 release** rolls up the iteration visibly (CHANGELOG gains ~180 lines covering every fix)
- **First dogfood review** surfaced real drift in the plug-in repo itself (retired INDEX.md + README.md still on disk, `docs/rubrics/` without rubrics). Fixed inline — compound/compound'd.

Per-phase time:
- Phase 3k (audit accuracy + UX polish + canonical standard) — 13 units
- Phase 3l (review unification + file-first + host-agnostic) — 7 units
- Phase 3m (setup accuracy + review actionability) — 5 units

## Graduation-readiness

**Candidate rule:** *"Spec review and dry runs won't find what live testing does. Budget at least one live run per repo-type before calling a feature done."*

Too strong to adopt as a team rule from one lesson — but this is the third time in the project's short life (pilot matrix, sds re-pilot, and now 3k-3m iteration) that live testing has surfaced issues a spec review missed. If it happens a fourth time, promote via `/hd:maintain rule-propose`.

**Secondary candidate:** *"Dogfood first. A plugin's own repo is the cheapest test bed."* — the first self-review landed today found real drift from our own 3k.13 cleanup (`docs/knowledge/INDEX.md` + `README.md` retired but still on disk). We shipped 3k.13 without self-checking.

## Next

Watch whether a v1.1.0 follow-up review in 2 weeks exercises the Staleness path (should find fewer overlapping findings since we acted on the P2s immediately). If Staleness overlap stays high across multiple teams, that's a signal that the review → action loop needs an even stronger nudge (perhaps a scheduled reminder or a gated prompt in `/hd:maintain`).
