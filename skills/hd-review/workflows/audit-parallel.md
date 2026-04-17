# Workflow — Audit (parallel mode, default)

**When to use:** `hd:review audit` invoked with ≤5 agents configured in `design-harnessing.local.md` `review_agents`. Default mode.
**Goal:** run review agents in parallel via Task tool; synthesize findings into dated audit report written to `docs/knowledge/lessons/harness-audit-YYYY-MM-DD.md`. **No file writes outside that report.**

## Progress checklist

```
Audit (Parallel) Progress:
- [ ] Step 1: Load agent list from design-harnessing.local.md
- [ ] Step 2: Count agents; auto-switch to serial if ≥6
- [ ] Step 3: Inventory the harness
- [ ] Step 4: Run budget-check.sh for deterministic data
- [ ] Step 5: Dispatch agents in parallel via Task tool
- [ ] Step 6: Collect + synthesize findings
- [ ] Step 7: Cross-check against <protected_artifacts>
- [ ] Step 8: Render report per template
- [ ] Step 9: Atomic write to docs/knowledge/lessons/
- [ ] Step 10: Summarize + suggest next
```

## Step 1 — Load agent list

Read `design-harnessing.local.md` YAML frontmatter field `review_agents`. Expected format:

```yaml
review_agents:
  - compound-engineering:research:learnings-researcher
  - compound-engineering:review:pattern-recognition-specialist
  - compound-engineering:review:code-simplicity-reviewer
  - compound-engineering:review:agent-native-reviewer
  - compound-engineering:workflow:spec-flow-analyzer
```

If `design-harnessing.local.md` missing or `review_agents` field absent, use defaults:

- `compound-engineering:research:learnings-researcher`
- `compound-engineering:review:pattern-recognition-specialist`
- `compound-engineering:review:code-simplicity-reviewer`

Defaults are the audit-critical trio. Users extend by adding more agents to the config file.

## Step 2 — Count + auto-switch

```bash
agent_count=$(yq '.review_agents | length' design-harnessing.local.md)
```

- **count ≤ 5** → continue this workflow (parallel)
- **count ≥ 6** → route to `audit-serial.md` with user notice:

  > "Running audit in serial mode (6+ agents configured). Use `--parallel` to override."

  (Compound CHANGELOG 2.39.0 lesson: 6+ parallel agents crash context.)

## Step 3 — Inventory harness

Build current-state table:

```
AGENTS.md: <line count> (Tier 1: <pass|fail>)
docs/context/: <file count>, <total lines>
docs/knowledge/lessons/: <count>, date spread <oldest>..<newest>
docs/knowledge/graduations.md: <entry count>
skills/: <user-skills count>, plug-in-shipped: <count>
design-harnessing.local.md: <schema valid|invalid>
compound-engineering coexistence: <detected|not detected>
```

This table is context for the agents and the opening section of the audit report.

## Step 4 — Run budget-check.sh

```bash
bash skills/hd-review/scripts/budget-check.sh > /tmp/hd-budget.json
```

Deterministic data. Agents reason about qualitative drift; `budget-check.sh` gives authoritative line counts. Merge both into findings.

## Step 5 — Dispatch in parallel

For each agent in the list, invoke via Task tool (fully-qualified names, compound 2.35.0 requirement). All agents receive same context: the inventory + budget-check output + reference files:

```
Task compound-engineering:research:learnings-researcher(
  "Audit the design-harness plug-in repo at <worktree-path>. Check for:
  - Past documented lessons (docs/knowledge/lessons/) that apply to current state
  - docs/solutions/ matches from compound-engineering
  - Graduation drought signals

  Inventory + budget-check data attached. Return findings with severity (p1/p2/p3)."
)
```

Similar prompt structure for the other agents, scoped to their specialty:

- `pattern-recognition-specialist` → convention compliance across skill files
- `code-simplicity-reviewer` → YAGNI on harness structure
- `agent-native-reviewer` → agent-accessibility of the plug-in
- `spec-flow-analyzer` → gap-hunt across shipped skills vs plans
- Others (user-configured) → whatever the user invokes

Dispatch all agents in a single parallel burst — one tool call per agent, all in the same response.

## Step 6 — Collect + synthesize

Each agent returns findings. Synthesize:

1. **Deduplicate** — same issue surfaced by multiple agents merges into one finding (the convergent signal is itself important — note "flagged by N agents")
2. **Categorize** — P1/P2/P3 per `audit-criteria.md` framework
3. **Source-attribute** — every finding tags which agent(s) flagged it

## Step 7 — Protected-artifacts cross-check

Our SKILL.md declares `<protected_artifacts>` listing hd-* output paths:

```
docs/design-solutions/**
docs/knowledge/**
docs/context/**
AGENTS.md
design-harnessing.local.md
skills/**
```

Discard any agent finding that recommends **deleting or gitignoring** any protected path. (Agents may legitimately flag content issues within protected paths — those stay.)

Pattern from compound's `ce-review/SKILL.md:54-61` protected-artifacts handling.

## Step 8 — Render report

Load [`../templates/audit-report.md.template`](../templates/audit-report.md.template). Fill placeholders:

- `{{DATE}}` — today's ISO date
- `{{TOP_3_PRIORITIES}}` — top P1 findings (or P2 if no P1 exists), for "read this if nothing else" section
- `{{INVENTORY_TABLE}}` — Step 3 output
- `{{P1_FINDINGS}}` / `{{P2_FINDINGS}}` / `{{P3_FINDINGS}}` — categorized findings
- `{{SUGGESTED_ACTIONS}}` — grouped by priority
- `{{AGENT_LIST}}` — which agents ran
- `{{EXECUTION_MODE}}` — `parallel` (this workflow)
- `{{AGENT_COUNT}}` — number from Step 2
- `{{DURATION_SECONDS}}` — wall-clock time if tracked

## Step 9 — Atomic write

Write single file: `docs/knowledge/lessons/harness-audit-YYYY-MM-DD.md`.

If another audit today, suffix `-001`, `-002`, etc.:

```bash
date_stem="docs/knowledge/lessons/harness-audit-$(date -u +%Y-%m-%d)"
seq=1
target="${date_stem}.md"
while [ -f "$target" ]; do
  target="${date_stem}-$(printf '%03d' $seq).md"
  seq=$((seq + 1))
done
```

Write atomically (temp + mv). Confirm post-write: `git status` shows only the new audit file. Any other write → rollback and abort.

## Step 10 — Summarize + suggest

Print:

```
Audit complete: <report-path>
  Findings: <N total> — <P1 count> P1, <P2 count> P2, <P3 count> P3
  Top 3 priorities:
    1. <finding 1>
    2. <finding 2>
    3. <finding 3>

Next step:
  1. Review the full report: <report-path>
  2. Address P1 findings before next ship
  3. (Optional) Capture any recurring pattern: /hd:compound capture
```

## Failure modes

- **F1 Agent dispatch error** — one agent fails; continue with remaining; note failed agent in report
- **F2 Budget-check.sh fails** — run without deterministic data; note in report
- **F3 Write to protected path attempted** — abort; treat as coexistence violation + P1 finding
- **F4 Context overflow during synthesis** — reduce agent count; route to serial; re-run
- **F5 `<protected_artifacts>` block missing from SKILL.md** — P1 finding against our own harness; fix immediately

## Coexistence rules

- ✅ Reads from our namespace (`docs/`, `AGENTS.md`, `design-harnessing.local.md`)
- ❌ Never writes to `docs/solutions/` (compound namespace)
- ❌ Writes ONLY to `docs/knowledge/lessons/harness-audit-*.md` — never anywhere else
- Task calls fully-qualified: `compound-engineering:<category>:<agent-name>`

## See also

- [audit-serial.md](audit-serial.md) — sibling workflow (≥6 agents)
- [../references/audit-criteria.md](../references/audit-criteria.md) — severity framework
- [../references/bloat-detection.md](../references/bloat-detection.md) — thresholds used
- [../references/drift-detection.md](../references/drift-detection.md) — drift signals
