---
title: Post-setup health rollup (Step 10.5)
loaded_by: hd-setup
---

## Purpose

Step 10.5 render spec. Reuses Phase A's per-layer `harness-auditor` data (`{layer, health_score, overall_health, top_findings[]}`) — already computed, previously discarded. Surfaces the shape of the harness to the user at setup end; closes the "did setup work?" feedback loop.

**Non-blocking narration.** No new agent dispatches. Same data the `/hd:review audit` full-review uses, rendered compactly.

## Render format

```
Harness health (post-setup):

Layer              Bar          Score   State
─────────────────  ───────────  ──────  ─────────────────────────────
L1 Context         ████████░░    8.0    <overall_health summary, ≤40 chars>
L2 Skill Curation  █████████░    9.0    <summary>
L3 Orchestration   ██████░░░░    6.0    <summary>
L4 Rubric Setting  ██████████  10.0    <summary>
L5 Knowledge       ████████░░    8.0    <summary>

Top 3 priorities from setup:
  <Sev>  <Layer>  <one-line finding>                      <Effort>
  <Sev>  <Layer>  <one-line finding>                      <Effort>
  <Sev>  <Layer>  <one-line finding>                      <Effort>
```

## Rendering rules

### Bar glyphs
- `blocks_filled = round(health_score)` (health_score is 0–10)
- Filled block: `█` (U+2588)
- Empty block: `░` (U+2591)
- Bar width always 10 glyphs.

### State column
≤40 characters. Use Phase A `overall_health` (one of `healthy | healthy-with-drift | yellow | needs-work | red`) plus a ≤5-word qualifier pulled from the auditor's top finding. Examples:

| overall_health | State column render |
|---|---|
| healthy | "populated; no drift" |
| healthy-with-drift | "populated; minor drift" |
| yellow | "workflows scattered — scaffold recommended" |
| needs-work | "empty; needs seed questions" |
| red | "structural issue; see priorities" |

### Priorities table
Top 3 findings across all 5 layers, sorted by severity then impact. Columns:

- **Sev:** `P1` | `P2` | `P3` (from `top_findings[].severity`)
- **Layer:** `L1`–`L5` (which layer auditor surfaced it)
- **Finding:** one-line — truncate to ≤45 chars
- **Effort:** `XS` | `S` | `M` | `L` (from `top_findings[].effort` if present; infer `S` when absent)

If Phase A returned fewer than 3 total findings across all layers, render fewer rows. Never pad with placeholders.

## When Phase A data isn't available

If `/hd:setup` was invoked with `--reset-skips` or Phase A was skipped (non-Claude host without Task support), the rollup reads from the per-detection default table fallback:

- Layers with content present → default `health_score: 7.0` / `state: "populated (Phase A skipped)"`
- Layers marked in `skipped_layers[]` → `health_score: 0` / `state: "skipped by user"`
- Layers freshly created this run → `health_score: 6.0` / `state: "scaffolded; capture first lesson"`

Print a note under the table: *"Health shown from default heuristic — Phase A didn't run. Re-run `/hd:review audit` for ground truth."*

## Why Step 10.5 (not merged into Step 10 or /hd:review)

- **Distinct from Step 10** — Step 10 reports *what setup did* (decisions + budget + harnesses respected); Step 10.5 reports *what shape we're in now*. Decisions × shape = complete picture.
- **Distinct from `/hd:review audit`** — full review produces a comprehensive report (findings + cross-layer + staleness + proposed-revision). Step 10.5 is a compact 5-row rollup + 3-row priority table, rendered inline. Different artifact for a different moment.
- **Non-blocking** — setup proceeds to Step 11 (next-step suggestion) regardless. User can address priorities immediately via suggested follow-up commands or defer indefinitely.

## See also

- [phase-a-pre-analysis.md](phase-a-pre-analysis.md) — where per-layer `{health_score, overall_health, top_findings}` is computed
- [`../../hd-review/assets/review-report.md.template`](../../hd-review/assets/review-report.md.template) — full-review report using the same bar glyphs
