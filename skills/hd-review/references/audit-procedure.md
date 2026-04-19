---
title: Audit-mode procedure
loaded_by: hd-review
---

# Audit mode — full procedure

## Purpose

Step-by-step procedure for `/hd:review audit`: parallel-dispatch isolated sub-agents across the five layers and cross-cutting concerns in two batches, synthesize findings cross-checked against protected artifacts, and write a single dated harness-audit lesson. Invoked by the audit-mode workflow checklist in `../SKILL.md`.

## Inputs

- `mode` — `"full"` (default) | `"quick"`. Parsed from the `/hd:review audit mode:<value>` invocation. If unspecified, defaults to `"full"`.

If `mode: "quick"`, jump to [§ Mode: quick](#mode-quick) below; otherwise continue with the full procedure.

## Parallel→serial auto-switch

Each batch below contains ≤5 agents. 6+ parallel Task dispatches strain context. We stay safe by splitting audit into two batches (5 + 2–3) rather than fanning out a single 7-agent burst.

If a user adds extra `review_agents` to `hd-config.md` that would push a batch to ≥6, auto-switch that batch to serial and surface:

> "Running Batch N in serial mode (6+ agents configured). Use `--parallel` to override."

## Steps

**Step 1 — Preflight.** Read `hd-config.md` frontmatter (`review_agents`, `other_tool_harnesses_detected[]`). Run:

```bash
bash skills/hd-review/scripts/budget-check.sh > /tmp/hd-budget.json
```

JSON is authoritative for bloat findings; parsed inline in Step 4. Also load `scripts/detect.py` JSON from a prior `/hd:setup` run (or rerun `python skills/hd-setup/scripts/detect.py > /tmp/hd-detect.json` if stale).

**Step 2 — BATCH 1 (parallel, 5 agents): per-layer `harness-auditor`.**

Dispatch 5 isolated-context sub-agents in a single parallel burst (one Task call per agent, all in the same response):

```
Task design-harnessing:analysis:harness-auditor(
  repo_root: ".",
  layer: 1,
  scenario: "audit",
  detect_json: <contents of /tmp/hd-detect.json>,
  budget_json: <contents of /tmp/hd-budget.json>
)

Task design-harnessing:analysis:harness-auditor(layer: 2, scenario: "audit", ...)
Task design-harnessing:analysis:harness-auditor(layer: 3, scenario: "audit", ...)
Task design-harnessing:analysis:harness-auditor(layer: 4, scenario: "audit", ...)
Task design-harnessing:analysis:harness-auditor(layer: 5, scenario: "audit", ...)
```

Each layer-auditor uses its own `audit-criteria-l<N>-*.md` reference (per-scope criteria from Phase 3i.7 split). Each returns severity-tagged findings (P1/P2/P3) scoped to its layer.

**Step 3 — BATCH 2 (parallel, 2–3 agents): cross-cutting.**

After Batch 1 completes, dispatch the second batch in parallel:

```
Task design-harnessing:analysis:rubric-recommender(
  repo_root: ".",
  scenario: "audit-gap-finding",
  detect_json: <contents of /tmp/hd-detect.json>
)

Task design-harnessing:research:lesson-retriever(
  lessons_root: "docs/knowledge/lessons/",
  rules_log: "docs/knowledge/changelog.md",
  scenario: "audit-drift-scan"
)
```

Conditional third dispatch (same batch) — only when `other_tool_harnesses_detected` is non-empty:

```
Task design-harnessing:analysis:coexistence-analyzer(
  repo_root: ".",
  detect_json: <contents of /tmp/hd-detect.json>
)
```

Cross-plug-in review agents (if any in `hd-config.md:review_agents`) also join Batch 2 as long as the batch stays ≤5. Dispatched with fully-qualified Task names.

**Step 4 — Inline: parse `budget-check.sh` JSON.** Extract tier-1 line counts, per-skill SKILL.md sizes, violations. These become deterministic P1 findings (no agent required).

**Step 5 — Synthesize + cross-check.**

1. **Deduplicate** — same issue from multiple agents merges into one finding (note "flagged by N agents")
2. **Categorize** — P1/P2/P3 per the appropriate `audit-criteria-<scope>.md`
3. **Source-attribute** — every finding tags which agent(s) flagged it (e.g., `layer-3-auditor + rubric-recommender`)
4. **Protected-artifacts cross-check** — discard any finding recommending deletion/gitignore of a protected path (see `<protected_artifacts>` in SKILL.md).

**Step 6 — Render report.** Load [`../assets/audit-report.md.template`](../assets/audit-report.md.template). Fill placeholders:
- `{{DATE}}`, `{{TOP_3_PRIORITIES}}`, `{{INVENTORY_TABLE}}`
- `{{P1_FINDINGS}}` / `{{P2_FINDINGS}}` / `{{P3_FINDINGS}}`
- `{{LAYER_N_FINDINGS}}` × 5 (from Batch 1)
- `{{RUBRIC_GAPS}}` (from rubric-recommender), `{{LESSON_DRIFT}}` (from lesson-retriever), `{{COEXISTENCE_FINDINGS}}` (if dispatched)
- `{{BUDGET_VIOLATIONS}}` (from Step 4), `{{SUGGESTED_ACTIONS}}`, `{{AGENT_LIST}}`, `{{EXECUTION_MODE}}`

**Step 7 — Atomic write.** Single file: `docs/knowledge/lessons/$(date -u +%Y-%m-%d)-harness-audit.md`.

Collision handling (multiple audits same day):

```bash
date_stem="docs/knowledge/lessons/$(date -u +%Y-%m-%d)-harness-audit"
seq=1
target="${date_stem}.md"
while [ -f "$target" ]; do
  target="${date_stem}-$(printf '%03d' $seq).md"
  seq=$((seq + 1))
done
```

Atomic: temp file + `mv`. Post-write: `git status` must show only the new audit file. Any other diff → rollback + abort.

**Step 8 — Summarize.**

```
Audit complete: <report-path>
  Findings: <N total> — <P1> P1, <P2> P2, <P3> P3
  Top 3 priorities: [...]
  Dispatch: Batch 1 (5 layer-auditors) + Batch 2 (rubric-recommender + lesson-retriever [+ coexistence-analyzer])

Next step:
  1. Review: <report-path>
  2. Address P1 before next ship
  3. (Optional) Capture recurring pattern: /hd:maintain capture
```

→ Return to [../SKILL.md § audit-mode](../SKILL.md#audit-mode)

## Mode: quick

A ~30s preflight scan. Single `harness-auditor` call in aggregate mode — reads `detect.py` JSON + `hd-config.md` frontmatter only. No deep file reads; no per-layer fan-out; no file writes. Useful as a pre-flight before a full audit, or as a CI check.

**Steps (quick mode):**

1. **Run `detect.py`** — capture JSON output:

   ```bash
   python skills/hd-setup/scripts/detect.py > /tmp/hd-detect.json
   ```

2. **Read `hd-config.md`** — frontmatter only (no body drill-down).

3. **Dispatch `harness-auditor` in aggregate mode** — with a smaller budget:

   ```
   Task design-harnessing:analysis:harness-auditor(
     repo_root: ".",
     layer: "aggregate",
     scenario: "audit-quick",
     detect_json: <contents of /tmp/hd-detect.json>
   )
   ```

   Agent returns the YAML summary + cross-cutting observations only (no per-layer deep reads).

4. **Abbreviated report** — emit inline (no file write). Format:

   ```
   Quick audit — <repo_name>
     Overall: <healthy | developing | needs_attention>
     Layer 1: <top concern 1> / <top 2> / <top 3>
     Layer 2: <top 3>
     Layer 3: <top 3>
     Layer 4: <top 3>
     Layer 5: <top 3>
     Cross-cutting: <one-line>

   For full audit: /hd:review audit
   ```

   Top 3 per layer; skip narrative paragraphs. Zero file writes — quick mode is read-only and does not produce a dated lesson.

Target: ~30s wall time. If the auditor reports it had to read layer files (i.e., quick-mode budget was insufficient), surface that as a hint to run a full audit instead.
