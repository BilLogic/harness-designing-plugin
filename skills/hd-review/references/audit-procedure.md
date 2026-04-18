---
title: Audit-mode procedure
loaded_by: hd-review
---

# Audit mode — full procedure

## Purpose

Step-by-step procedure for `/hd:review audit`: load agent list from `hd-config.md`, dispatch review sub-agents (parallel or serial), synthesize findings cross-checked against protected artifacts, and write a single dated harness-audit lesson. Invoked by the audit-mode workflow checklist in `../SKILL.md`.

## Inputs

- `mode` — `"full"` (default) | `"quick"`. Parsed from the `/hd:review audit mode:<value>` invocation. If unspecified, defaults to `"full"`.

If `mode: "quick"`, jump to [§ Mode: quick](#mode-quick) below; otherwise continue with the full procedure.

## Steps

**Step 1 — Load agent list.** Read `hd-config.md` YAML frontmatter field `review_agents`. Expected format:

```yaml
review_agents:
  - compound-engineering:research:learnings-researcher
  - compound-engineering:review:pattern-recognition-specialist
  - compound-engineering:review:code-simplicity-reviewer
  - compound-engineering:review:agent-native-reviewer
```

If missing, use defaults (audit-critical trio):
- `compound-engineering:research:learnings-researcher`
- `compound-engineering:review:pattern-recognition-specialist`
- `compound-engineering:review:code-simplicity-reviewer`

Users extend by adding more agents to the config.

**Step 2 — Count + auto-switch.**

```bash
agent_count=$(yq '.review_agents | length' hd-config.md)
```

- **count ≤ 5** → parallel dispatch
- **count ≥ 6** → serial dispatch; surface notice:

  > "Running audit in serial mode (6+ agents configured). Use `--parallel` to override."

Compound CHANGELOG 2.39.0: 6+ parallel agents crash context.

**Step 3 — Run harness-health-analyzer.** Opens the audit report with a narrative 5-layer health assessment:

```
Task design-harnessing:workflow:harness-health-analyzer(
  repo_root: ".",
  detect_json: <output from hd:setup's scripts/detect.py>,
  mode: "full"
)
```

**Step 4 — Per-skill health (L2 check).** For each `skills/*/SKILL.md`:

```
Task design-harnessing:review:skill-quality-auditor(
  skill_md_path: "<path>/SKILL.md"
)
```

Aggregate per-skill findings into the audit report's Layer 2 section. Each finding cites the rubric section number (1–9).

**Step 5 — Graduation drift (L5 check).**

```
Task design-harnessing:analysis:graduation-candidate-scorer(
  lessons_root: "docs/knowledge/lessons/",
  graduated_log: "docs/knowledge/graduations.md"
)
```

Ready-to-graduate clusters become drift findings — "10 lessons on X topic, 0 graduated — drought signal."

**Step 6 — Deterministic data.** Run:

```bash
bash skills/hd-review/scripts/budget-check.sh > /tmp/hd-budget.json
```

Output tier-1 line counts, per-skill SKILL.md sizes, violations. Authoritative for bloat findings.

**Step 7 — Dispatch review agents.**

### Parallel (count ≤ 5)

For each agent in `review_agents`, invoke via Task tool (fully-qualified names per compound 2.35.0 requirement). All agents receive the same context: harness-health-analyzer output + budget-check.sh output + the inventory table from detect.py:

```
Task compound-engineering:research:learnings-researcher(
  "Audit the design-harness setup at <worktree-path>. Check for past
   documented lessons relevant to current state, docs/solutions/ matches
   from compound, graduation drought signals. Inventory + budget data
   attached. Return findings with severity (p1/p2/p3)."
)

Task compound-engineering:review:pattern-recognition-specialist("...")
Task compound-engineering:review:code-simplicity-reviewer("...")
[...additional configured agents]
```

Dispatch ALL in a single parallel burst (one tool call per agent, all in the same response).

### Serial (count ≥ 6)

Same agents as parallel, but one at a time. Wait for each to complete before starting the next. Use this when 6+ agents are configured (context safety).

**Step 8 — Synthesize + cross-check.**

1. **Deduplicate** — same issue from multiple agents merges into one finding (note "flagged by N agents")
2. **Categorize** — P1/P2/P3 per [`audit-criteria.md`](audit-criteria.md)
3. **Source-attribute** — every finding tags which agent(s) flagged it
4. **Protected-artifacts cross-check** — discard any finding recommending deletion/gitignore of a protected path. Pattern from compound's `ce-review/SKILL.md`.

**Step 9 — Render report.** Load [`../assets/audit-report.md.template`](../assets/audit-report.md.template). Fill placeholders:
- `{{DATE}}`, `{{TOP_3_PRIORITIES}}`, `{{INVENTORY_TABLE}}`
- `{{P1_FINDINGS}}` / `{{P2_FINDINGS}}` / `{{P3_FINDINGS}}`
- `{{LAYER_2_SKILL_QUALITY_FINDINGS}}` (from Step 4)
- `{{LAYER_5_DRIFT_FINDINGS}}` (from Step 5)
- `{{SUGGESTED_ACTIONS}}`, `{{AGENT_LIST}}`, `{{EXECUTION_MODE}}`

**Step 10 — Atomic write.** Single file: `docs/knowledge/lessons/harness-audit-YYYY-MM-DD.md`.

Collision handling (multiple audits same day):

```bash
date_stem="docs/knowledge/lessons/harness-audit-$(date -u +%Y-%m-%d)"
seq=1
target="${date_stem}.md"
while [ -f "$target" ]; do
  target="${date_stem}-$(printf '%03d' $seq).md"
  seq=$((seq + 1))
done
```

Atomic: temp file + `mv`. Post-write: `git status` must show only the new audit file. Any other diff → rollback + abort.

**Step 11 — Summarize.**

```
Audit complete: <report-path>
  Findings: <N total> — <P1> P1, <P2> P2, <P3> P3
  Top 3 priorities: [...]

Next step:
  1. Review: <report-path>
  2. Address P1 before next ship
  3. (Optional) Capture recurring pattern: /hd:compound capture
```

→ Return to [../SKILL.md § audit-mode](../SKILL.md#audit-mode)

## Mode: quick

A ~30s preflight scan. Only signals from `detect.py` JSON and `hd-config.md` contents — no deep file reads (no walking SKILL.md bodies, no full lesson-corpus scan, no per-skill rubric dispatch). Useful as a pre-flight before a full audit, or as a CI check.

**Steps (quick mode):**

1. **Run `detect.py`** — capture JSON output:

   ```bash
   python skills/hd-setup/scripts/detect.py > /tmp/hd-detect.json
   ```

2. **Read `hd-config.md`** — frontmatter only (no body drill-down).

3. **Dispatch harness-health-analyzer in quick mode** — with a smaller budget:

   ```
   Task design-harnessing:workflow:harness-health-analyzer(
     repo_root: ".",
     detect_json: <contents of /tmp/hd-detect.json>,
     mode: "quick"
   )
   ```

   Agent skips Phase 2 per-layer reads and returns the YAML summary + cross-cutting observations only.

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

Target: ~30s wall time. If the analyzer reports it had to read layer files (i.e., quick-mode budget was insufficient), surface that as a hint to run a full audit instead.
