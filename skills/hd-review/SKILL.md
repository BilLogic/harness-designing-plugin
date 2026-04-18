---
name: hd:review
description: Audits harness health or applies team rubrics to a work item. Use for harness health checks or single-item design critique.
argument-hint: "audit | critique <file-path-or-url> [--rubric <name>]"
---

# hd:review — improve your harness (audit + critique)

## Interaction method

Default: dispatch via Task tool for audit mode; inline response for critique mode. If `AskUserQuestion` is unavailable (non-Claude hosts), fall back to numbered-list prompts. **Read-only by design** — audit writes exactly one dated lesson file; critique writes nothing.

## Single job

Audit harness health (audit mode) OR apply Layer 4 rubric(s) to a work item (critique mode). One skill, two verbs of the IMPROVE family.

## Protected artifacts

This skill respects and declares the coexistence contract. Our output paths are protected from modification by other review tools (e.g., `/ce:review` from compound-engineering):

```yaml
<protected_artifacts>
- docs/design-solutions/**
- docs/knowledge/**
- docs/context/**
- AGENTS.md
- hd-config.md
- skills/**
</protected_artifacts>
```

Pattern from compound's `ce-review/SKILL.md` protected-artifacts. Both plug-ins can audit the same repo without modifying each other's outputs.

## Mode detection

| User says… / invokes… | Mode |
|---|---|
| "Audit my harness" / `/hd:review audit` | **audit** |
| "Review this design" / `/hd:review critique <path> [--rubric <name>]` | **critique** |

Ambiguous → ask: *"Audit the harness itself, or critique a specific work item?"*

## Workflow checklist (per mode)

### Audit mode

```
hd:review audit Progress:
- [ ] Step 1: Load agent list from hd-config.md
- [ ] Step 2: Count agents; auto-switch to serial if ≥6
- [ ] Step 3: Run harness-health-analyzer sub-agent (opens the report)
- [ ] Step 4: Run skill-quality-auditor per skill (L2 health check)
- [ ] Step 5: Run graduation-candidate-scorer (L5 drift check)
- [ ] Step 6: Run budget-check.sh for deterministic budget data
- [ ] Step 7: Dispatch review agents (parallel or serial)
- [ ] Step 8: Synthesize findings + cross-check against <protected_artifacts>
- [ ] Step 9: Render report per template
- [ ] Step 10: Atomic write to docs/knowledge/lessons/harness-audit-YYYY-MM-DD.md
- [ ] Step 11: Summarize + suggest next
```

### Critique mode

```
hd:review critique Progress:
- [ ] Step 1: Parse target work item + optional --rubric
- [ ] Step 2: Resolve rubric path (starter / user-defined)
- [ ] Step 3: Dispatch appropriate applicator (skill-quality-auditor OR rubric-applicator)
- [ ] Step 4: Aggregate findings per critique-format.md
- [ ] Step 5: Emit inline; zero file writes
```

## Audit mode — procedure

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
2. **Categorize** — P1/P2/P3 per [`references/audit-criteria.md`](references/audit-criteria.md)
3. **Source-attribute** — every finding tags which agent(s) flagged it
4. **Protected-artifacts cross-check** — discard any finding recommending deletion/gitignore of a protected path. Pattern from compound's `ce-review/SKILL.md`.

**Step 9 — Render report.** Load [`assets/audit-report.md.template`](assets/audit-report.md.template). Fill placeholders:
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

## Critique mode — procedure

**Step 1 — Parse target.** From `/hd:review critique <path-or-url> [--rubric <name>]`. If target missing → ask: *"Which work item? Give me a path or URL."*

**Step 2 — Resolve rubric.**

Resolution order:
1. `--rubric <name>` explicit → look in `docs/context/design-system/<name>.md`, then `docs/rubrics/<name>.md`, then `skills/hd-review/assets/starter-rubrics/<name>.md`
2. No explicit → infer from work item type (see [`references/rubric-application.md`](references/rubric-application.md)):
   - `.tsx` / `.jsx` / `.html` / `.css` → `design-system-compliance`
   - `SKILL.md` → `skill-quality`
   - Figma file URL → `accessibility-wcag-aa` + `design-system-compliance`

If ambiguous, ask: *"Which rubric? Available: [list]"*

**Step 3 — Dispatch.** Specialized handling for SKILL.md targets; generic for everything else:

### Target is a SKILL.md + rubric is skill-quality

```
Task design-harnessing:review:skill-quality-auditor(
  skill_md_path: <path>
)
```

### Any other target

```
Task design-harnessing:review:rubric-applicator(
  work_item_path: <path>,
  rubric_path: <rubric file>
)
```

**Step 4 — Aggregate per [`references/critique-format.md`](references/critique-format.md).**

Output format:
```markdown
## Critique — <work-item>
**Rubric:** <name> · **Composite:** healthy | degraded | critical_fail

### P1 findings (fix before merge)
- [criterion: <name>] <evidence> → <suggested_fix>

### P2 findings (should fix)
...

### P3 findings (polish)
...

### Recommendation
<one-sentence verdict + next step>
```

**Step 5 — Emit inline. Zero file writes.** `git status` after critique must be clean.

## What this skill does NOT do

- **Scaffold harness** → `/hd:setup`
- **Concept Q&A** → `/hd:onboard`
- **Capture lessons** → `/hd:compound capture` (suggestion, not invocation)
- **Modify source work items** during critique (read-only)
- **Modify rubric files** (both modes — rubrics are team-owned)
- **Write to `docs/solutions/`** (compound's namespace)

## Coexistence

- ✅ Reads our namespace + rubric files + user-specified work items
- ✅ Writes ONLY to `docs/knowledge/lessons/harness-audit-*.md` (audit mode)
- ❌ Never writes to compound's namespace
- ❌ Never modifies compound's config files
- `<protected_artifacts>` block (above) protects our outputs from `/ce:review`
- Cross-plug-in Task calls fully-qualified

## Compact-safe mode

When context budget is tight:
- Audit → auto-switch to serial (≥ 3 agents → serial in compact mode)
- Critique → apply fewer rubrics (skip ones requiring deep file reads)
- Hash mechanisms: N/A (hd-review doesn't use plan-hash; read-mostly)

## Reference files

- [references/audit-criteria.md](references/audit-criteria.md) — five-layer health criteria + severity framework
- [references/bloat-detection.md](references/bloat-detection.md) — concrete thresholds + scripts
- [references/drift-detection.md](references/drift-detection.md) — stale-file + graduation-drought signals
- [references/critique-format.md](references/critique-format.md) — critique output shape
- [references/rubric-application.md](references/rubric-application.md) — rubric → work-item mapping + resolution order

## Assets

- [assets/audit-report.md.template](assets/audit-report.md.template) — audit output format
- [assets/critique-response.md.template](assets/critique-response.md.template) — critique output format
- [assets/starter-rubrics/](assets/starter-rubrics/) — 5 shipped rubrics:
  - `accessibility-wcag-aa.md` — a11y (applies to design-file, html, css)
  - `design-system-compliance.md` — token + variant adherence
  - `component-budget.md` — new-primitive RFC gate
  - `skill-quality.md` — 9-point Layer 2 skill health check
  - `interaction-states.md` — loading / empty / error / success state coverage
  - Users extend by authoring new rubrics in `docs/context/design-system/` or `docs/rubrics/`

## Scripts

- `scripts/budget-check.sh` — deterministic Tier 1 + SKILL.md budget enforcement; emits JSON

## Sub-agents invoked

- `design-harnessing:workflow:harness-health-analyzer` — narrative 5-layer health (audit Step 3)
- `design-harnessing:review:skill-quality-auditor` — per-skill rubric (audit Step 4 + critique on SKILL.md)
- `design-harnessing:analysis:graduation-candidate-scorer` — L5 drift detection (audit Step 5)
- `design-harnessing:review:rubric-applicator` — generic rubric → work item (critique default)
- `compound-engineering:research:learnings-researcher` — always-run during audit (Step 7)
- Other `compound-engineering:review:*` agents per user config (Step 7)
