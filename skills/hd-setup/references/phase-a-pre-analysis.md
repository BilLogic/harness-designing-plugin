---
title: Phase A — parallel pre-analysis (dispatch detail)
loaded_by: hd-setup
---

# Phase A — parallel pre-analysis

## Purpose

Runs AFTER Step 2 and BEFORE Step 3. Pre-computes per-layer proposals (link / critique / scaffold / skip) and a rubric-gap recommendation so Steps 4–8 (Phase B) feel informed rather than interrogative. Every layer default in Phase B comes from this phase's output.

Loaded when the host supports Task dispatch. Non-Claude hosts (or any host where `Task` is unavailable) run Phase A **inline serial** — evaluate each layer against `review-criteria-l<N>.md` one at a time. Same output shape; same health snapshot at the end.

## Parallel→serial auto-switch

Each batch stays ≤5 agents. Compound v2.39.0 documents that 6+ parallel Task dispatches crash context. Phase A splits into two batches to stay safe. If user config pushes a batch to ≥6, auto-switch that batch to serial and surface a notice.

## Batch 1 (parallel, 5 agents): per-layer `harness-auditor`

Dispatch in a single response, one Task call per layer — all fully-qualified:

```
Task design-harnessing:analysis:harness-auditor(
  repo_root: ".",
  layer: 1,
  scenario: "setup-pre-analysis",
  detect_json: <output from Step 1>
)

Task design-harnessing:analysis:harness-auditor(layer: 2, scenario: "setup-pre-analysis", ...)
Task design-harnessing:analysis:harness-auditor(layer: 3, scenario: "setup-pre-analysis", ...)
Task design-harnessing:analysis:harness-auditor(layer: 4, scenario: "setup-pre-analysis", ...)
Task design-harnessing:analysis:harness-auditor(layer: 5, scenario: "setup-pre-analysis", ...)
```

Each layer-auditor returns: `default_action: link|critique|scaffold|skip`, `why: <one-sentence>`, `signals: [...]`.

## Batch 2 (parallel, 1 agent): `rubric-recommender`

Dispatched after Batch 1 (separate batch keeps total ≤5 per burst and preserves an ordering tail in case Batch 2 grows with user-configured extras):

```
Task design-harnessing:analysis:rubric-recommender(
  repo_root: ".",
  scenario: "setup-pre-analysis",
  detect_json: <output from Step 1>
)
```

Returns: rubric-gap ranking, recommended starter trio, any `has_ai_docs: true` signal triggering **critique + extract** default for Layer 4.

## Synthesis

Merge the 6 agent outputs into a single proposal table held in working memory:

| Layer | Default | Why | Evidence signals |
|---|---|---|---|
| L1 | (from harness-auditor layer=1) | ... | ... |
| L2 | ... | ... | ... |
| L3 | ... | ... | ... |
| L4 | (from harness-auditor layer=4, cross-ref rubric-recommender) | ... | ... |
| L5 | (from harness-auditor layer=5) | ... | ... |

Steps 4–8 (Phase B) use this table as the PROPOSE step of the FRAME → SHOW → PROPOSE → ASK → EXECUTE cycle. User can override any default; Phase A never executes actions on its own.

## Render health snapshot (3l.6)

After synthesis completes, emit a 5-row ASCII layer-health snapshot to the chat before moving to Step 3 (tool discovery). Format matches the `/hd:review` summary style:

```
═══════════════════════════════════════════════════════════════════

Phase A complete — layer snapshot

Layer              Bar          Score   State
─────────────────  ───────────  ──────  ───────────────────────────
L1 Context         ████░░░░░░    4.0    scattered, no canonical tree
L2 Skill Curation  █████████░    9.0    .agent/skills/ with 7 skills
L3 Orchestration   ██████░░░░    6.0    workflow docs, no gate map
L4 Rubric Setting  ░░░░░░░░░░    0.0    absent
L5 Knowledge       ██░░░░░░░░    2.0    docs/solutions/ only

═══════════════════════════════════════════════════════════════════

Proposed per-layer action (override any row to change)

Layer  Action     Rationale
─────  ─────────  ─────────────────────────────────────────────
L1     critique   scattered content — review + suggest canonical map
L2     critique   existing skills — surface skill-quality findings
L3     critique   workflows implicit — propose explicit gates
L4     scaffold   absent — starter trio + scope-and-grounding
L5     scaffold   thin — full knowledge structure
```

Bar rule: `blocks_filled = round(health_score)`, filled = `█`, empty = `░`. Each row: Layer name (17 chars) · bar · score · state summary. Snapshot is summary-only — never written to any file at Phase A; Step 8.5 preview gates any writes.

**Narrate:** *"Phase A pre-analysis complete. Here's how each layer looks right now. We'll walk through each one next so you can confirm or override."*

## Guardrail interaction

If the Guardrail (additive-only mode, § SKILL.md) already fired before Phase A:
- L1/L2/L3 `harness-auditor` dispatches still run; their `default_action` is set to **critique** in the synthesis table (3l.4 — was `skip`).
- L4/L5 auditor output + `rubric-recommender` output still drive defaults normally.
- The Guardrail's default now defaults to critique (review + suggest) rather than skip.

## See also

- [per-layer-procedure.md](per-layer-procedure.md) — Phase B cycle that consumes Phase A's synthesis table
- [layer-4-rubrics.md](layer-4-rubrics.md) — Step 7 critique+extract branch using `rubric-extractor`
- [layer-5-knowledge.md](layer-5-knowledge.md) — Step 8 critique branch using `rule-candidate-scorer`
