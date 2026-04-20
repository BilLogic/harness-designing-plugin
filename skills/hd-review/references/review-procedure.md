---
title: Full-review procedure
loaded_by: hd-review
---

# Full review — procedure

## Purpose

Step-by-step procedure for `/hd:review` (or `/hd:review full`). Evaluates every layer + cross-layer consistency + budgets, writes the full report to a dated file, and emits a rich chat summary. Host-agnostic: inline serial is the baseline, parallel dispatch is an optional speed-up.

## Inputs

- `mode` — `"full"` (default) | `"snapshot"`. Snapshot skips file write and deep layer reads. See [§ Mode: snapshot](#mode-snapshot) below.

## Host-agnostic execution model

**Baseline (every host):** inline serial evaluation. For each layer 1–5, read `review-criteria-l<N>.md`, gather evidence per check (file reads + regex heuristics), emit YAML findings. Cross-layer consistency runs inline. File write works on every host that supports writing files.

**Optional speed-up:** when the host exposes a parallel dispatch mechanism (Claude `Task`, Codex `/agent` + MCP, Cursor subagents API), fan out the same per-layer evaluation across sub-agents. Findings + output file + chat summary are identical — only wall time changes.

**Each dispatch batch stays ≤5 agents.** 6+ parallel strains context. Full review splits into 2 batches (5 + 2–3) on capable hosts.

## Steps

**Step 1 — Preflight.** Read `hd-config.md` frontmatter (`review_agents`, `other_tool_harnesses_detected[]`). Run:

```bash
bash skills/hd-review/scripts/budget-check.sh > /tmp/hd-budget.json
python skills/hd-setup/scripts/detect.py > /tmp/hd-detect.json
```

**Narrate:** *"Running preflight — budget check + fresh detect.py scan. This lets us see what's really in the repo right now vs what hd-config.md recorded."*

Also diff `/tmp/hd-detect.json` vs `hd-config.md` contents. Compare fields: `other_tool_harnesses_detected[]`, `skipped_layers`, `team_tooling`, `skills_by_platform`. Any mismatch queues a `hd-config-stale` finding (p2) for synthesis.

**Step 2 — Per-layer evaluation.**

**Narrate:** *"Evaluating all 5 layers against the review criteria. On this host I'll run [inline serial | parallel via <dispatch-mechanism>]."*

**On hosts with parallel dispatch (Claude Code, Codex with agents SDK, Cursor IDE):** dispatch 5 isolated sub-agents in one parallel burst:

```
Task design-harnessing:analysis:harness-auditor(
  repo_root: ".",
  layer: 1,
  scenario: "full-review",
  detect_json: <contents of /tmp/hd-detect.json>,
  budget_json: <contents of /tmp/hd-budget.json>
)

Task design-harnessing:analysis:harness-auditor(layer: 2, scenario: "full-review", ...)
Task design-harnessing:analysis:harness-auditor(layer: 3, scenario: "full-review", ...)
Task design-harnessing:analysis:harness-auditor(layer: 4, scenario: "full-review", ...)
Task design-harnessing:analysis:harness-auditor(layer: 5, scenario: "full-review", ...)
```

**On hosts without parallel dispatch (Cursor CLI, Windsurf, plain terminal):** loop through layers 1–5 inline. For each, read the matching `review-criteria-l<N>.md`, apply Phase 3 grading (presence → content → drift per 3k.1), emit findings YAML. Same output shape as the agent returns.

Each layer-auditor (parallel) or inline pass uses its own `review-criteria-l<N>.md` reference. Each returns severity-tagged findings (P1/P2/P3).

**Step 3 — Cross-cutting checks.**

**Narrate:** *"Looking for rubric gaps, lesson drift, and other-tool coexistence."*

**With parallel dispatch:** Batch 2 in parallel (2–3 agents):

```
Task design-harnessing:analysis:rubric-recommender(
  repo_root: ".",
  scenario: "review-gap-finding",
  detect_json: <contents of /tmp/hd-detect.json>
)

Task design-harnessing:research:lesson-retriever(
  lessons_root: "docs/knowledge/lessons/",
  rules_log: "docs/knowledge/changelog.md",
  scenario: "review-drift-scan"
)
```

Conditional third dispatch — only when `other_tool_harnesses_detected` is non-empty:

```
Task design-harnessing:analysis:coexistence-analyzer(
  repo_root: ".",
  detect_json: <contents of /tmp/hd-detect.json>
)
```

**Without parallel dispatch:** run the same logic inline, serial. Same findings.

Cross-plug-in review agents (if any in `hd-config.md:review_agents`) also join this batch as long as it stays ≤5. Fully-qualified Task names.

**Step 3.5 — Cross-layer consistency pass.**

Read `review-criteria-consistency.md`. For each criterion (duplicate rules, contradictions, orphan pointers, overlapping skills, stale lesson citations, hd-config drift), evaluate against the evidence already gathered. Inline — no dispatch. Findings feed synthesis with `affected_layers: [...]` tags.

**Narrate:** *"Cross-checking consistency — looking for duplicated rules across AGENTS.md and rubrics, orphan pointers, and redundant content across layers."*

**Step 4 — Inline: parse `budget-check.sh` JSON.** Extract `always_loaded_lines`, per-skill SKILL.md sizes, violations, `skill_dir_detected`, `always_loaded_contract_source`. Deterministic findings (no agent required).

**Step 5 — Synthesize + cross-check.**

1. **Deduplicate** — same issue from multiple sources merges (note "flagged by N sources")
2. **Categorize** — P1/P2/P3 per the appropriate `review-criteria-<scope>.md`
3. **Source-attribute** — every finding tags its source (e.g., `layer-3 + rubric-recommender`)
4. **Protected-artifacts cross-check** — discard any finding recommending deletion/gitignore of a protected path (see `<protected_artifacts>` in SKILL.md)
5. **Compute overall health** — average of per-layer health_scores, weighted by severity of unresolved findings

**Step 6 — Render report file.** Load [`../assets/review-report.md.template`](../assets/review-report.md.template). Fill placeholders:

- `{{HEALTH_BARS}}` — ASCII layer-health visualization (see [§ Rendering health bars](#rendering-health-bars) below)
- `{{DATE}}`, `{{OVERALL_SCORE}}`, `{{OVERALL_STATE}}`, `{{TOP_PRIORITIES_TABLE}}`, `{{INVENTORY_TABLE}}`
- `{{P1_FINDINGS}}` / `{{P2_FINDINGS}}` / `{{P3_FINDINGS}}`
- `{{LAYER_N_FINDINGS}}` × 5
- `{{CONSISTENCY_FINDINGS}}` (from Step 3.5)
- `{{RUBRIC_GAPS}}`, `{{LESSON_DRIFT}}`, `{{COEXISTENCE_FINDINGS}}` (if dispatched/evaluated)
- `{{BUDGET_VIOLATIONS}}` (from Step 4), `{{HD_CONFIG_DRIFT}}` (from Step 1), `{{SUGGESTED_ACTIONS}}`, `{{AGENT_LIST}}`, `{{EXECUTION_MODE}}`

**Step 7 — Atomic write.** Single file: `docs/knowledge/reviews/$(date -u +%Y-%m-%d)-harness-review.md`.

Collision handling (multiple reviews same day):

```bash
mkdir -p docs/knowledge/reviews
date_stem="docs/knowledge/reviews/$(date -u +%Y-%m-%d)-harness-review"
seq=1
target="${date_stem}.md"
while [ -f "$target" ]; do
  target="${date_stem}-$(printf '%03d' $seq).md"
  seq=$((seq + 1))
done
```

Atomic: temp file + `mv`. Post-write: `git status` must show only the new review file. Any other diff in our namespace → rollback + abort. (Pre-existing untracked files outside `docs/knowledge/` are ignored.)

**Step 8 — Emit chat summary.**

Render the rich summary with Unicode box-drawing tables:

```
Review complete · Full report: docs/knowledge/reviews/<date>-harness-review.md

═══════════════════════════════════════════════════════════════════

Harness health — <score> / 10 (<state>)

Layer              Bar          Score   State
─────────────────  ───────────  ──────  ───────────────────────────
L1 Context         ████████░░    8.0    <one-line summary>
L2 Skill Curation  ██░░░░░░░░    2.0    <one-line summary>
L3 Orchestration   ██████░░░░    6.0    <one-line summary>
L4 Rubric Setting  ████░░░░░░    4.0    <one-line summary>
L5 Knowledge       █████░░░░░    5.0    <one-line summary>

═══════════════════════════════════════════════════════════════════

Top priorities

Sev  #    Layer    Finding                                      Effort
───  ───  ───────  ───────────────────────────────────────────  ──────
P1   1    L2       <one-line>                                   S
P1   2    L1       <one-line>                                   S
P2   3    L4       <one-line>                                   M

═══════════════════════════════════════════════════════════════════

Cross-layer signals

Signal           Status    Evidence
───────────────  ────────  ─────────────────────────────────────
hd-config.md     <status>  <evidence>
Consistency      <n>       <evidence>

═══════════════════════════════════════════════════════════════════

Next · address P1s before ship · full findings + evidence in file
```

**Rules:** ASCII bars mandatory. Tables preferred over bullets. Box-drawing `═` for section dividers, `─` inside tables. No emoji, no color codes. Summary has no fixed line cap — length serves clarity.

→ Return to [../SKILL.md](../SKILL.md)

### Rendering health bars

For each layer 1–5, extract `health_score` (0–10). Render:

```
L<N> <layer-name-padded-17ch>  <bar>  <score>  <one-line summary>
```

**Bar rule:** `blocks_filled = round(health_score)` (0–10 → 0–10 blocks). Filled = `█`, empty = `░`.

## Mode: snapshot

~30s preflight-only pass. Emits the bars-only summary table + overall score. No deep layer reads. No file write.

**Steps (snapshot):**

1. **Run `detect.py`** — capture JSON output (no `budget-check.sh` required for snapshot)
2. **Read `hd-config.md`** — frontmatter only
3. **Evaluate presence signals only** — no content heuristics, no drift pass. Each layer gets a quick 0–10 score derived from detect.py's signals:
   - Layer presence on disk
   - Always-loaded budget status (from hd-config.md)
   - File counts
4. **Emit bars-only output:**

```
═══════════════════════════════════════════════════════════════════

Harness health — <score> / 10 (<state>)

Layer              Bar          Score   State
─────────────────  ───────────  ──────  ───────────────────────────
L1 Context         ████░░░░░░    4.0    <one-line from signals>
L2 Skill Curation  █████████░    9.0    <one-line from signals>
L3 Orchestration   ██████░░░░    6.0    <one-line from signals>
L4 Rubric Setting  ░░░░░░░░░░    0.0    <one-line from signals>
L5 Knowledge       ██░░░░░░░░    2.0    <one-line from signals>

═══════════════════════════════════════════════════════════════════

Run /hd:review for full findings + evidence
```

Zero file writes. Snapshot is read-only.
