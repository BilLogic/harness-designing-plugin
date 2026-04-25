---
date: 2026-04-25
type: full-harness-review
score: 8.4
state: healthy-with-traceability-gaps
trigger: post AGENTS.md distillation refactor (commits 3e8d43ce + 7efd8c17 + 95a72811 merge)
---

# Harness Review — 2026-04-25 (post-distillation)

## Overall

**Score: 8.4 / 10 — healthy.** Plug-in is in strong shape across all 5 layers post-distillation. One P1 (meta-log gap on the very file that exists to record meta-changes), three P2s (rubric count drift, adoption-traceability gap, phantom path in agent-persona), and a handful of P3s.

## Health bars

```
Layer              Bar          Score   State
─────────────────  ───────────  ──────  ───────────────────────────
L1 Context         ████████░░    8.4    Phantom path + minor count drift
L2 Skill Curation  █████████░    9.4    All 4 skills compliant
L3 Orchestration   █████████░    9.1    Dispatch graph clean
L4 Evaluation      ████████░░    7.8    Stale count + INDEX undercount
L5 Knowledge       ███████░░░    7.2    Changelog out of date today
```

## Preflight

- Always-loaded budget: **174 / 200** (AGENTS.md 148 + one-pager.md 26) — pass
- All 4 SKILL.md under 200-line cap — pass
- `budget-check.sh` returned `violations_count: 0`
- `detect.py` schema v5, mode `advanced`, L1+L4+L5 present (L3 scattered, L2 absent — expected for meta-harness)

## Per-layer findings

### L1 — Context Engineering (8.4)

- **P2 — Phantom path in agent-persona.md.** `docs/context/agent-persona.md:38` references `skills/hd-setup/templates/` — directory does not exist (only `assets/`, `references/`, `scripts/`). Same bug class the AGENTS.md sweep fixed today, missed in this neighbor file. **Fix:** replace with `skills/hd-setup/assets/context-skeleton/`.
- **P3 — Starter rubric count math conflict.** `AGENTS.md:47` says "17 starters available"; `AGENTS.md:138` says "6 adopted + 11 other starters" (= 17); `ls starter-rubrics/` returns 18 entries (17 starters + `rubric-template.md`). The math reconciles when you exclude the template, but the source of truth is split across three lines. **Fix:** pin the count in one place and reference it.
- **P3 — Voice rules duplicated.** AGENTS.md "Agent role" §Voice and `agent-persona.md` §Voice are two sources of truth. **Fix:** decide canonical home — terse pointer in AGENTS.md or absorb persona content into AGENTS.md.

### L2 — Skill Curation (9.4)

- **P2 — `hd-setup/SKILL.md` at 194/200 lines.** Largest of the four; references/ already heavy (5 layer files + schema + known-mcps). **Fix on next edit:** if it crosses 200, extract the four-choice (scaffold/review/create/skip) decision matrix into `references/decision-matrix.md`.
- **P3 — `hd-maintain` is a two-verb skill** (capture + graduate). Acceptable as a verb-family skill, but document the boundary explicitly so a third verb forces a split.
- **P3 — `hd-review` description trigger surface.** Could add "audit"/"health check" synonyms (still under 180-char soft cap).

### L3 — Workflow Orchestration (9.1)

- **P3 — `agents/research/article-quote-finder.md` claims hd:learn use but has 0 concrete dispatch sites** in `skills/hd-learn/`. **Fix:** either add the dispatch site or document as deferred.
- **P3 — `agents/review/rubric-applier.md` has only 1 invocation site** (`targeted-review-procedure.md:49`). **Fix:** either add a 2nd consumer or add an explicit "solo dispatch — single-purpose wrapper" note in the spec like `coexistence-analyzer.md` does.
- **P3 — Multiple agents lack explicit "why isolated context" rationale** in their spec body (rubric-extractor, lesson-retriever, harness-auditor). **Fix:** one-line rationale per agent (corpus scan / parallel fan-out / token isolation).

### L4 — Evaluation Design (7.8)

- **P2 — Stale rubric count in `hd-review/SKILL.md:179`** says "14 shipped rubrics"; AGENTS.md, `review-criteria-l4-rubrics.md:43`, and the filesystem all say 17. **Fix:** single-line edit to "17 shipped rubrics + 1 template".
- **P2 — 11 legacy starters lack YAML schema v1** (`sections:` block + `version: 1`). Newer rubrics (skill-quality, ux-writing, heuristic-evaluation, plan-quality, lesson-quality, agent-spec-quality) follow the YAML/prose split rule; the 11 visual/UI starters carry criteria in prose only — breaks machine-queryability via `rubric-applier`. Acceptable since these are waived for the plug-in's own use, but should be tracked as a phased migration before downstream users hit it.
- **P3 — `docs/rubrics/INDEX.md` § Adopted rubrics lists only 3 of 6.** Missing `plan-quality`, `lesson-quality`, `agent-spec-quality`. AGENTS.md:47 + :138 says 6 are adopted. Source-of-truth drift between INDEX.md narrative and filesystem.

### L5 — Knowledge Compounding (7.2)

- **P1 — Changelog gap on today's distillation refactor.** `docs/knowledge/changelog.md` newest entry is the 2026-04-25 namespace+schema-SSOT entry; today's commits `3e8d43ce` (distill operating rules) and `7efd8c17` (fix internal inconsistencies) restructured AGENTS.md §Operating rules from timestamped `R_YYYY_MM_DD` entries into 11 plain-language bullets, but no changelog entry records this structural change. Meta-log drift on the very file that exists to log meta-changes. **Fix:** append a 2026-04-25 entry citing both commits as Source.
- **P2 — 3 rubric adoptions not in changelog.** `plan-quality`, `lesson-quality`, `agent-spec-quality` were promoted to `docs/rubrics/` but no changelog entry or sourcing lessons exist. **Fix:** backfill 3 entries (or one consolidated entry).
- **P2 — `rule_id` traceability broken in AGENTS.md.** Distilled bullets at AGENTS.md:131-141 dropped the `R_2026_*` IDs that previously linked back to changelog and lessons. Line 125 still claims "Each is sourced to a lesson" but the bullets carry no IDs or links. **Fix:** append `(R_2026_04_21_advisor)` style parentheticals OR add a comment-block crosswalk above the bullets.

Lessons + reviews + naming hygiene all pass — exemplary.

## Cross-layer consistency

| Signal | Status | Evidence |
|---|---|---|
| Rubric count | ⚠ drift | SKILL.md:179 says 14; AGENTS.md + review-criteria + filesystem say 17 |
| Adopted rubric set | ⚠ drift | AGENTS.md says 6 adopted; INDEX.md § Adopted rubrics lists 3 |
| Phantom-path bug class | ⚠ partial fix | AGENTS.md cleaned today; agent-persona.md still references `skills/hd-setup/templates/` |
| `rule_id` traceability | ⚠ broken | AGENTS.md distillation dropped IDs that link to changelog/lessons |
| Namespace discipline | ✓ clean | All Task calls fully-qualified `harness-designing:<cat>:<name>` |
| Protected artifacts | ✓ clean | No findings recommend writes to other plug-ins' namespaces |

## Top priorities

| Sev | # | Layer | Finding | Effort |
|---|---|---|---|---|
| P1 | 1 | L5 | Add changelog entry for today's AGENTS.md distillation refactor | S |
| P2 | 2 | L1 | Fix phantom `skills/hd-setup/templates/` in agent-persona.md:38 | S |
| P2 | 3 | L4 | Update SKILL.md:179 "14 shipped rubrics" → "17 + 1 template" | S |
| P2 | 4 | L4 | INDEX.md § Adopted rubrics: add 3 missing entries | S |
| P2 | 5 | L5 | Restore `rule_id` traceability in AGENTS.md operating rules | S |
| P2 | 6 | L5 | Backfill 3 rubric-adoption changelog entries | S |
| P2 | 7 | L4 | Migrate 11 legacy starters to schema v1 (`sections:` YAML) | M |
| P3 | 8 | L1 | Resolve voice-rules duplication (AGENTS.md vs agent-persona.md) | S |
| P3 | 9 | L3 | Document `article-quote-finder` invocation site or remove claim | S |

## Meta

- Auditors dispatched: 5× `harness-designing:analysis:harness-auditor` (one per layer, parallel)
- Skipped (out of scope): rubric-recommender, lesson-retriever, coexistence-analyzer (no other-tool harnesses detected)
- Trigger: post-distillation health check after today's AGENTS.md refactor
- Compound-safe mode: not engaged
