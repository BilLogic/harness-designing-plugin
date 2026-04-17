---
title: "Self-audit — 10-scenario detect-mode sweep + skill-quality rubric applied to our own 4 skills"
date: 2026-04-17
tags: [self-audit, audit, skill-quality, detect-mode, scenario-coverage, ship-gate, v1]
graduation_candidate: no
---

# Lesson

**Context:** Before kicking off an agent-driven n=12 scenario test (see [`docs/plans/2026-04-17-008-self-run-test-plan.md`](../../plans/2026-04-17-008-self-run-test-plan.md)), ran every deterministic check available without a live Claude Code agent. Goal: surface any structural bug the agent-driven tests would waste cycles rediscovering.

## Part 1 — Scenario-mode sweep (deterministic half of the 12 tests)

Built one scratch fixture per scenario under `/tmp/hd-full-test/s*/`. Ran `skills/hd-setup/scripts/detect-mode.sh` against each. Compared against the `Mode:` field declared in [`docs/plans/hd-setup-scenarios.md`](../../plans/hd-setup-scenarios.md).

| Scenario | Expected mode | Observed mode | Priority | Signals set | Status |
|---|---|---|---|---|---|
| S1 greenfield | greenfield | greenfield | 6 | — | ✓ |
| S2 single-file (AGENTS.md) | scattered | scattered | 4 | has_ai_docs | ✓ |
| S3 awesome-design-md | scattered | scattered | 4 | has_ai_docs | ✓ |
| S4 multi-platform pointers | scattered | scattered | 4 | has_ai_docs | ✓ |
| S5 advanced (full layer tree) | advanced | advanced | 3 | has_layer_folders, has_ai_docs | ✓ |
| S6 bloated (550-line CLAUDE.md) | scattered + overlay | scattered | 5 | has_ai_docs, has_bloat | ✓ |
| S7 coexistence (compound installed) | any + CE overlay | scattered + CE | 4 | has_ai_docs | ✓ |
| S8 plug-in installed, empty repo | greenfield | greenfield | 6 | — | ✓ |
| S9 re-run (local.md exists) | advanced | advanced | 1 | has_local_md | ✓ |
| S10 forked template (placeholders) | localize | localize | 2 | has_placeholders | ✓ |

**Result: 10/10 route correctly.** This closes the deterministic half of the 12 v0.MVP acceptance tests (T-S1, T-S2, T-S7, T-S8, T-S9, T-S10 — the 6 that are file-presence-detectable). T-T1, T-T2, T-W2, T-W5, T-W7, T-F4, T-F6 are the 7 agent-driven tests covered by the self-run test plan.

Two pre-existing bugs were caught + fixed during this sweep (documented in [`2026-04-17-v1-smoke-tests.md`](./2026-04-17-v1-smoke-tests.md)): fragile bash command-as-boolean syntax and placeholder regex false-positive on our own repo.

## Part 2 — Coexistence + lint pass

### `docs/solutions/` write guard

Grep for `docs/solutions/` across our skills: 10 hits, all in DOCS (telling the reader "don't write here") or in prompt strings asking compound agents to check their namespace. Zero actual writes. ✓

### Fully-qualified Task calls

Grep for `Task compound-engineering:`: 8 hits, all correctly prefixed. Zero bare `Task learnings-researcher(...)` hits except one intentional example in `skills/hd-setup/references/coexistence-checklist.md:47` that shows the wrong form for teaching purposes. ✓

### Bare `/ce:*` references in our skill bodies

Zero hits. Our skills never invoke compound's slash-commands directly (which would be wrong — cross-plug-in communication goes through Task calls, not slash commands). ✓

### Reference link depth

Every `(references/...)` link in all 4 SKILL.md is one-level-deep. No `references/sub/nested.md` violations. ✓

### `docs/` five-layer structure

```
docs/
├── context/{conventions, design-system, product}
├── knowledge/lessons
├── plans
└── rubrics
```

All 5 layers present in our own meta-harness. ✓

## Part 3 — Skill-quality rubric applied to our own 4 skills

Walked the 9-section [`skills/hd-review/templates/starter-rubrics/skill-quality.md`](../../../skills/hd-review/templates/starter-rubrics/skill-quality.md) against every `skills/*/SKILL.md` in this repo. Findings below, one row per (skill × section) that warrants a note. Sections not listed = passed with no note.

### hd:onboard (124 lines, desc 141 chars, no argument-hint, no disable-model-invocation)

| § | Criterion | Finding | Severity |
|---|---|---|---|
| 1 | Description — one-job + triggers | "Answers questions about the five-layer design harness framework. Use when learning concepts, asking about a layer, or orienting before setup." — one-job clear, 2 triggers, third person, ≤ 180 chars. | pass |
| 2 | Scope — single task | Read-only Q&A only. Does NOT scaffold, critique, or capture. Explicit "What this skill does NOT do" section. | pass |
| 5 | Context design | 124 lines, well under 200 soft cap. 10 atomic references (one per layer + taxonomy + glossary + faq + coexistence). Progressive loading via routing table. | pass |
| 7 | Trigger mapping | No overlap with other `hd:*` skills — onboarding is the only Q&A-only surface. | pass |
| 9 | Failure handling | "Does not answer non-harness questions → politely decline" line present. | pass |

**Overall: clean. Zero findings.**

### hd:setup (148 lines, desc 127 chars, argument-hint quoted, no disable-model-invocation)

| § | Criterion | Finding | Severity |
|---|---|---|---|
| 1 | Description | Clear one-job (scaffold), specific trigger (repo starting state). | pass |
| 2 | Scope | Single task: scaffold + emit `design-harnessing.local.md`. Not capture, not critique, not graduate. | pass |
| 3 | Instructions | 6-step workflow checklist, imperative verbs throughout ("Detect", "Confirm", "Route", "Execute", "Write", "Summarize"). | pass |
| 4 | Output structure | Template file at `templates/design-harnessing.local.md.template` declared; `detect-mode.sh` emits LOCKED JSON shape. | pass |
| 5 | Context design | 148 lines, under soft cap. 9 references (5 layer guides + 4 shared), 3 workflows, 9 templates, 1 script. | pass |
| 7 | Trigger mapping | Clean — scaffold-only surface. `argument-hint` quoted. | pass |
| 8 | Scalability | Deterministic script for mode detection; reference layer guides extensible. | pass |
| 9 | Failure handling | "F4 — never destructive without confirmation" called out up top. | pass |

**Overall: clean. Zero findings.**

### hd:compound (122 lines, desc 136 chars, argument-hint quoted, no disable-model-invocation)

| § | Criterion | Finding | Severity |
|---|---|---|---|
| 1 | Description | "Captures design lessons and proposes graduations from narrative to rule. Use when capturing a decision or promoting a recurring pattern." — two-job (capture + graduate) in one skill is intentional per the PRD v0.4 decision (same verb family, one skill surface). Acceptable per § 2 ("same verb family" exception). | pass (note the two-mode intent below) |
| 2 | Scope | Two modes (capture, graduate-propose, graduate-apply) all in the MAINTAIN verb family. Alternative would be three separate skills (`hd:capture` + `hd:propose` + `hd:apply`) — PRD explicitly rejected that. Monitor: if post-v1 usage shows users routinely invoke one mode and never the other, consider splitting. | pass with monitoring note |
| 3 | Instructions | 5-step outer checklist + per-workflow checklists. Imperative throughout. | pass |
| 4 | Output structure | Two template files declared (lesson, graduation-entry). Plan-hash output format locked in `references/plan-hash-protocol.md`. | pass |
| 5 | Context design | 122 lines. 3 references, 3 workflows, 2 templates — tight. | pass |
| 7 | Trigger mapping | Clean split with hd:onboard and hd:setup. Internal mode-detection table at top resolves capture-vs-graduate ambiguity before routing. | pass |
| 8 | Scalability | Plan-hash protocol is extensible (7-line canonical format) — future fields can be appended without breaking backward-compat if version bumped. | pass |
| 9 | Failure handling | "Does not apply graduations without a verified plan-hash — refusal is structural, not advisory" — strongest failure declaration of the four skills. | pass |

**Overall: clean. Two-mode design is intentional; monitor for post-v1 split signal.**

### hd:review (154 lines, desc 123 chars, argument-hint quoted, no disable-model-invocation)

| § | Criterion | Finding | Severity |
|---|---|---|---|
| 1 | Description | "Audits harness health or applies team rubrics to a work item. Use for harness health checks or single-item design critique." — two-job statement, 123 chars, third person. Same two-mode structure as hd:compound; intentional. | pass |
| 2 | Scope | Audit + critique, same verb family (IMPROVE). Same monitoring note as hd:compound. | pass with monitoring note |
| 3 | Instructions | 6-step outer + per-workflow checklists. | pass |
| 4 | Output structure | Two template files (audit-report, critique-response). Four starter rubrics (incl. the skill-quality rubric this audit is using — fully dogfooded). | pass |
| 5 | Context design | 154 lines, under soft cap. 5 references + 3 workflows + 2 templates + 3 rubric files + 1 script. | pass |
| 7 | Trigger mapping | Clean. Explicit "ambiguous → ask" rule for audit-vs-critique routing. | pass |
| 8 | Scalability | `<protected_artifacts>` block declared. Parallel → serial auto-switch at 6+ agents (compound 2.39.0 lesson baked in). Agent list reads from `design-harnessing.local.md` — user-extensible without code changes. | pass |
| 9 | Failure handling | F1-F5 failure modes documented in `workflows/audit-parallel.md`. | pass |

**Overall: clean. The skill successfully audits itself via the skill-quality rubric without circular-reference issues — a pleasant property.**

## Aggregate findings

**Zero P1 violations. Zero P2 violations. Two P3 monitoring notes** (hd:compound and hd:review two-mode designs — intentional; watch for split signal post-v1).

All four skills pass the 9-section skill-quality rubric. The rubric itself is a new starter, first applied here — this audit is the first empirical validation that the rubric produces useful, non-spurious findings when applied to skills designed by humans (not by the rubric itself).

## Part 4 — Budget check (deterministic)

```json
{
  "tier_1": { "combined_lines": 179, "budget": 200, "status": "pass" },
  "skill_md": {
    "hd-compound/SKILL.md": { "lines": 122, "description_chars": 136 },
    "hd-onboard/SKILL.md":  { "lines": 124, "description_chars": 141 },
    "hd-review/SKILL.md":   { "lines": 154, "description_chars": 123 },
    "hd-setup/SKILL.md":    { "lines": 148, "description_chars": 127 }
  },
  "violations": []
}
```

Headroom: Tier 1 has 21 lines of budget remaining; all four SKILL.md routers are 46–78 lines under the 200-line soft cap.

## What we did NOT check (requires live Claude Code agent)

The following 7 of the 12 v0.MVP acceptance tests can't be validated without a live agent run — they're covered by [`docs/plans/2026-04-17-008-self-run-test-plan.md`](../../plans/2026-04-17-008-self-run-test-plan.md):

- T-T1 — solo designer flow (depends on skill's interactive branching)
- T-T2 — team flow (same)
- T-W2 — skip-layer respected on re-run (depends on skill writing + reading `design-harnessing.local.md` correctly)
- T-W5 — no-vendor file-only mode (depends on agent output text)
- T-W7 — article citation (depends on agent output text — presence of `§N` tokens)
- T-F4 — overwrite confirm (depends on agent's destructive-action behavior)
- T-F6 — no-rivalry language (depends on agent output)

These each need (a) a fresh scratch repo, (b) a Claude Code session invoking `/hd:setup`, and (c) a grep/diff pass on the results. The self-run test plan scripts the setup and specifies the evidence to capture.

## See also

- [2026-04-17-v1-smoke-tests.md](./2026-04-17-v1-smoke-tests.md) — plan-hash round-trip + audit-write + detect-mode findings from earlier today
- [docs/plans/2026-04-17-008-self-run-test-plan.md](../../plans/2026-04-17-008-self-run-test-plan.md) — the agent-driven test plan this audit precedes
- [skills/hd-review/templates/starter-rubrics/skill-quality.md](../../../skills/hd-review/templates/starter-rubrics/skill-quality.md) — rubric applied above
- [docs/plans/hd-setup-success-criteria.md](../../plans/hd-setup-success-criteria.md) — pass bars this audit partially satisfies
