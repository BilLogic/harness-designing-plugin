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

Next step: <one concrete suggested command>
```

### Next-step suggestion (the actionable hand-off)

After the priorities table, append exactly one line: **`Next step: <command>`** that closes the disclosure → action loop. Pick by severity + layer of the top P1 (or top P2 if no P1):

| Top finding shape | Suggested next step |
|---|---|
| Top finding has `file_path` (concrete file) AND severity ≥ P2 | `/hd:review critique <file_path> --rubric <rubric_for_layer>` |
| Top finding is L1 / L2 / L3 / L5 with no specific file (structural drift) | `/hd:review critique skills/<top-layer-skill>/SKILL.md --rubric skill-quality` (or sister rubric matching the layer) |
| Top finding suggests capturing a lesson (e.g., recurring drift pattern) | `/hd:maintain capture` |
| All findings are P3 polish | `/hd:review audit` (run a full audit when convenient — current state is healthy) |
| No findings (ideal post-setup) | `/hd:maintain capture` to log first lesson; OR `/hd:review audit` to baseline |

Layer → rubric mapping (when no explicit `rubric:` field on the finding):

| Layer | Default rubric |
|---|---|
| L1 Context | `skill-quality` (for SKILL.md targets) or no rubric (for context docs — surface as "review docs/context/X manually") |
| L2 Skill Curation | `skill-quality` |
| L3 Orchestration | `agent-spec-quality` (for agent specs) |
| L4 Rubric Setting | `lesson-quality` (when finding is about a rubric's grounding evidence) — usually no auto-suggestion (rubrics are content; review them manually) |
| L5 Knowledge | `lesson-quality` (for lessons), `plan-quality` (for plans) |

**Discipline:** never suggest a destructive command (`/hd:setup` again with `--force`, etc.) as the next step. The hand-off must be a *review* / *capture* / *audit* — read-mostly. User decides whether to act on the review's findings.

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
- **Non-blocking** — setup proceeds to Step 11 (next-step suggestion) regardless. User can address priorities immediately via the suggested `Next step:` line or defer indefinitely.

## Phase 3t addition: actionable hand-off

The `Next step:` line is the closing of a feedback loop that v1.3.0 left open: setup rendered the bar but stopped there, leaving the user to decide which low-layer to address. v1.5.0+ Step 10.5 always renders one concrete suggested command — picked deterministically from the top finding's severity + layer (see "Next-step suggestion" table above).

Why one command, not a menu? Decision fatigue at setup-end is real; the user just walked 10 steps. A single suggested action (which they can accept, modify, or ignore) is lower-friction than "here are 5 things you could do."

## See also

- [phase-a-pre-analysis.md](phase-a-pre-analysis.md) — where per-layer `{health_score, overall_health, top_findings}` is computed
- [`../../hd-review/assets/review-report.md.template`](../../hd-review/assets/review-report.md.template) — full-review report using the same bar glyphs
