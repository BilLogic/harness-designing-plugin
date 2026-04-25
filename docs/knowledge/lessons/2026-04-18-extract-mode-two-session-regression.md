---
title: "Extract-mode two-session regression — structural stability confirmed"
date: 2026-04-18
tags: [extract-mode, rubric-applicator, regression, phase-3g, two-session, synthetic-test]
graduation_candidate: no
importance: 4
---

# Lesson

**Context:** Phase 3f F2 (commit `7949621f`) closed 4 p1 gaps in `rubric-applicator mode: extract`. The same-turn regression ([`2026-04-18-extract-mode-regression-after-f2.md`](./2026-04-18-extract-mode-regression-after-f2.md)) showed 7/7 byte-stable axes — but both runs lived in one agent context, a weaker test than truly independent invocations.

Phase 3g G6 ran the same test **across two separately dispatched subagents** with fresh contexts. Each received an identical prompt to act as `rubric-applicator` mode: extract against `/tmp/hd-real-test/plus-uno/AGENTS.md` and emit the `extracted_candidates:` YAML.

## Input

`/tmp/hd-real-test/plus-uno/AGENTS.md` — the Forbidden Patterns section (lines 26–40 of that file), 15 rule-like statements.

## Results side-by-side

| Axis | Run A | Run B | Byte-stable? |
|---|---|---|---|
| Total candidates | 13 | 13 | ✅ |
| Severity distribution | p1:11, p2:2, p3:0 | p1:11, p2:2, p3:0 | ✅ |
| Phases followed | Scan→Classify→Structure→Dedupe→Materialize | same | ✅ |
| `applies_to` field on all | yes | yes | ✅ |
| `source_citation` field on all | yes | yes | ✅ |
| Fabricated examples | 0 | 0 | ✅ |
| `matches_starter` breakdown | design-system-compliance×4, component-budget×1, null×8 | design-system-compliance×4, component-budget×1, null×8 | ✅ |
| Severity rationale (matched keyword per candidate) | identical list | identical list | ✅ |
| One real `pass_example` extracted (no fabrication) | `fa-brands fa-notion` brand-icons example | same | ✅ |

**Structural-axes stability: 9/9 byte-identical.**

## Surface drift (both p2/p3, not ship-blocking)

### D1 — `candidate_id` phrasing variance (5 of 13 candidates)

| Candidate (by evidence) | Run A id | Run B id |
|---|---|---|
| Use PLUS components first | `prefer-plus-components` | `plus-components-first` |
| Figma implement-design workflow | `follow-figma-implement-design-workflow` | `follow-figma-implement-workflow` |
| No deep-import from design-system/src/ | `no-deep-imports-from-design-system` | `no-deep-imports` |
| No edit generated token files | `no-edit-generated-token-files` | `no-edit-generated-tokens` |
| No Font Awesome Pro | `no-font-awesome-pro-icons` | `no-font-awesome-pro` |

Spec says "kebab-case from rule intent, ≤40 chars". Both runs comply; they pick different valid paraphrases. Each ID is stable *within* its run.

### D2 — `source_citation` / `applies_to` path format

- Run A: `plus-uno/AGENTS.md:26-26` (relative, 2-level)
- Run B: `/tmp/hd-real-test/plus-uno/AGENTS.md:26-26` (absolute)

Spec says `<file-path>:<line-range>` without pinning absolute vs relative. Both interpretations valid.

### D3 — `rule_statement` punctuation wording

Run A uses semicolons between clauses ("Never hallucinate layouts; when building..."). Run B uses colons ("Never hallucinate layouts: when building..."). Evidence snippets verbatim identical. Low-signal drift.

## Per-gap verdict (from E5 first-fire)

- **G1 Phased procedure** — **closed.** Both runs explicitly followed Phase 1→2→3→4→5. Materialized under `output_shape: yaml`.
- **G2 Rule-detection heuristic** — **closed.** Both runs extracted 15 raw rules from `## Forbidden Patterns` only. Zero leakage from narrative sections. Dedupe collapsed to 13 identical candidates (by evidence).
- **G3 Severity assignment** — **closed.** Every rule got the same severity across runs. Keyword rationale cited on every candidate (`matched keyword: never`, `matched keyword: only`, `no keyword match — p2 fallback`).
- **G4 Anti-fabrication / attribution** — **closed.** Every candidate carries `source_citation: <path>:<line>` and `applies_to: <file> § <heading>`. Only one real `pass_example` extracted (from explicit positive in source); all other pass/fail fields use sentinel strings. Zero invented snippets.

## Ship verdict

**SHIP.** Two genuinely independent subagent invocations converge on identical structural output. The earlier same-turn verdict holds under stronger evidence.

Surface drift on IDs/paths/punctuation is real but cosmetic. A downstream consumer (e.g., `/hd:setup` Layer 4 critique+extract writing to `docs/rubrics/`) that cares about stable IDs across invocations would need an extra F2.5 pass to pin the derivation rule. For now, rubrics produced by extract mode are equivalent-in-content and need only light human editing (rename IDs for project consistency + add concrete examples where source lacks them) before landing as authoritative `docs/rubrics/*.md`.

## Residual variance worth parking for 3h (optional)

1. **Pin `candidate_id` derivation.** Spec rule: "first imperative-verb stem + first noun-object". Would collapse the 5-candidate phrasing variance.
2. **Pin path format** for `applies_to` and `source_citation`: always relative from repo root, never absolute. Collapses D2.
3. **Pin `rule_statement` punctuation** (colon vs semicolon) — lowest-value, ignore unless downstream consumers care.

None blocks ship. All three are purely cosmetic. File as 3h candidate lessons if anyone asks.

## See also

- [`2026-04-18-extract-mode-first-fire.md`](./2026-04-18-extract-mode-first-fire.md) — E5 gap-report that surfaced the 4 p1s
- [`2026-04-18-extract-mode-regression-after-f2.md`](./2026-04-18-extract-mode-regression-after-f2.md) — same-turn regression (7/7 structural)
- [`../plans/2026-04-18-003-refactor-phase-3g-remaining-backlog-plan.md`](../../plans/2026-04-18-003-refactor-phase-3g-remaining-backlog-plan.md) § G6
- `agents/review/rubric-applicator.md` — the agent spec (F2 landed commit `7949621f`)
