# Workflow — Audit (serial mode, auto-switch)

**When to use:** `hd:review audit` invoked with ≥6 agents configured in `design-harnessing.local.md` `review_agents`, OR user explicitly passes `--serial` flag.
**Goal:** identical to [audit-parallel.md](audit-parallel.md) — produce dated audit report — but dispatch agents one at a time to avoid context overflow (compound 2.39.0 lesson: 6+ parallel agents crash context).

## Progress checklist

Same as audit-parallel but with serial dispatch:

```
Audit (Serial) Progress:
- [ ] Step 1: Confirm serial mode (auto-switched or --serial flag)
- [ ] Step 2: Load agent list from design-harnessing.local.md
- [ ] Step 3: Inventory the harness
- [ ] Step 4: Run budget-check.sh
- [ ] Step 5: Loop — dispatch ONE agent at a time, collect findings
- [ ] Step 6: Synthesize findings after all agents complete
- [ ] Step 7: Protected-artifacts cross-check
- [ ] Step 8: Render report per template
- [ ] Step 9: Atomic write
- [ ] Step 10: Summarize
```

## Step 1 — Confirm serial mode

Print user notice on entry:

> "Running audit in serial mode (N agents configured; threshold is 6+ → auto-serial per compound 2.39.0 context-budget lesson). This will take longer than parallel. Use `--parallel` to override (at context-overflow risk)."

Proceed only on implicit confirmation (no user objection) or explicit `--serial` flag already present.

## Steps 2-4 — Same as audit-parallel.md

Load agent list, inventory, run budget-check.sh. Identical to [audit-parallel.md](audit-parallel.md) steps 1, 3, 4.

## Step 5 — Serial dispatch loop

**Key difference from parallel:** one agent at a time, waiting for each to complete before dispatching the next:

```
For each agent in review_agents:
  1. Dispatch via Task tool with inventory + budget-check context
  2. Wait for completion
  3. Collect agent's findings into session state
  4. If context budget remaining < threshold, abort + report partial findings
  5. Move to next agent
```

### Context budget guardrail

After each agent completes, check remaining context budget. If <15% remaining → abort serial loop; note in report: "Audit truncated at agent N of M; <reason>. Re-run with `--parallel` on a fresh session to complete."

This prevents the 11th agent from running into an exhausted context and producing garbage findings.

### Always-run agent

Whether serial or parallel, `compound-engineering:research:learnings-researcher` is always-run. In serial mode, run it FIRST so its findings are available as context for later agents.

## Steps 6-10 — Same as audit-parallel.md

Synthesize, protected-artifacts cross-check, render, atomic write, summarize. Report template receives `{{EXECUTION_MODE}} = serial` instead of `parallel`.

## Why serial at 6+ agents

Compound-engineering's CHANGELOG 2.39.0 documented this threshold empirically. Running 6+ reviewer agents in parallel consumes context at a rate that crashes Claude Code sessions (each agent reads the full plan + inventory → 6 × ~20K = 120K tokens just for inputs). Serial dispatch spreads the load temporally.

The threshold is conservative. Users with bigger context budgets (future extended-thinking modes) can override via `--parallel`.

## Failure modes specific to serial mode

- **F1 Mid-loop agent failure** — continue with remaining agents; note in report
- **F2 Context exhausted mid-loop** — truncate; report partial findings + suggestion to re-run with parallel
- **F3 Loop timeout** — no hard timeout but serial is slow; user can ctrl+C; aborted audits get no report
- **F4 Same as audit-parallel (F3-F5)** — protected-path violations, missing `<protected_artifacts>` block

## When to force parallel override

`--parallel` flag (user explicit) overrides auto-switch. Use when:

- User has confidence in their context budget
- Running on an extended-thinking session with larger context
- Time-pressed and willing to risk context crash for speed

Document the override in report `{{EXECUTION_MODE}}` field: `parallel-forced` (distinguishable from auto-parallel).

## Coexistence rules

Same as audit-parallel.md:

- ✅ Reads our namespace
- ❌ Never writes to `docs/solutions/`
- ❌ Writes ONLY to `docs/knowledge/lessons/harness-audit-*.md`
- Task calls fully-qualified

## See also

- [audit-parallel.md](audit-parallel.md) — default mode; this workflow is the auto-switch fallback
- Compound CHANGELOG 2.39.0 — the empirical basis for the 6-agent threshold
- [../references/audit-criteria.md](../references/audit-criteria.md) — severity framework
