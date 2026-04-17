---
name: hd:review
description: Audits harness health or applies team rubrics to a work item. Use for harness health checks or single-item design critique.
argument-hint: "audit | critique <file-path-or-url> [--rubric <name>]"
---

# hd:review — improve your harness (audit + critique)

## Interaction method

Default: dispatch via Task tool for audit mode; inline response for critique mode. If `AskUserQuestion` is unavailable (non-Claude hosts — Codex, Gemini, Copilot), fall back to numbered-list prompts. **Read-only by design** — audit writes exactly one dated lesson file; critique writes nothing.

## Single job

Audit harness health (audit mode) OR apply Layer 4 rubric(s) to a specific work item (critique mode). One skill, two modes — same verb family (IMPROVE). Parallels `hd-compound`'s capture + graduate mode split.

## Protected artifacts

This skill respects and declares the coexistence contract. Our output paths are protected from modification by other review tools (e.g., `/ce:review` from compound-engineering):

```yaml
<protected_artifacts>
- docs/design-solutions/**
- docs/knowledge/**
- docs/context/**
- AGENTS.md
- design-harnessing.local.md
- skills/**
</protected_artifacts>
```

Pattern from compound's `ce-review/SKILL.md:54-61`. Both plug-ins can audit the same repo without modifying each other's outputs.

## Mode detection

| User says… / invokes… | Mode | Workflow |
|---|---|---|
| "Audit my harness" / "Check harness health" / `/hd:review audit` | **audit** | [workflows/audit-parallel.md](workflows/audit-parallel.md) (default) or [audit-serial.md](workflows/audit-serial.md) (≥6 agents) |
| "Review this design" / "Critique this" / `/hd:review critique <path-or-url>` | **critique** | [workflows/critique.md](workflows/critique.md) |

Never auto-dispatch across modes. Ambiguous invocation → ask:

> "Audit the harness itself, or critique a specific work item?"

## Workflow checklist

```
hd:review Progress:
- [ ] Step 1: Identify mode (audit / critique)
- [ ] Step 2: Route to matching workflow
- [ ] Step 3: For audit — load agent list, count, dispatch parallel or serial
       For critique — load rubric(s), apply to work item
- [ ] Step 4: Synthesize findings + render per template
- [ ] Step 5: Audit mode — atomic write to docs/knowledge/lessons/
       Critique mode — emit inline, no writes
- [ ] Step 6: Summarize + suggest next
```

## Step 1 — Identify mode

Parse user prompt + `argument-hint`. When unclear, ASK.

## Step 2 — Route

Load exactly one workflow. Don't cross-contaminate.

## Step 3 — Execute workflow

### Audit mode

1. Read `design-harnessing.local.md` → parse `review_agents` list (default: learnings-researcher + pattern-recognition + code-simplicity)
2. Count agents
3. **≤ 5** → [workflows/audit-parallel.md](workflows/audit-parallel.md) — dispatch in parallel
4. **≥ 6** → [workflows/audit-serial.md](workflows/audit-serial.md) — dispatch sequentially (compound 2.39.0 lesson: 6+ parallel crashes context)
5. Always-run: `compound-engineering:research:learnings-researcher` (regardless of config)
6. Run [`scripts/budget-check.sh`](scripts/budget-check.sh) for deterministic line-count data
7. Collect findings; synthesize per [references/audit-criteria.md](references/audit-criteria.md) priority framework

### Critique mode

1. Parse work item (path / URL / pasted content) + optional `--rubric` filter
2. Load rubric(s) per resolution order (see [workflows/critique.md](workflows/critique.md) Step 3)
3. Apply per [references/rubric-application.md](references/rubric-application.md) loop
4. Aggregate findings per [references/critique-format.md](references/critique-format.md)

## Step 4 — Synthesize + render

- **Audit:** fill [templates/audit-report.md.template](templates/audit-report.md.template); severity-grouped findings; top-3 priorities surfaced up top
- **Critique:** fill [templates/critique-response.md.template](templates/critique-response.md.template); YAML severity list + prose + next-step suggestion

## Step 5 — Output

- **Audit:** atomic write to `docs/knowledge/lessons/harness-audit-YYYY-MM-DD.md` (suffix `-NNN` for repeat audits same day). Writes ONE file only.
- **Critique:** emit inline to conversation. **Zero file writes.**

## Step 6 — Summarize

- **Audit summary:** file path + finding counts (P1/P2/P3) + top-3 priorities + next step ("address P1 before ship" or "capture patterns via `/hd:compound`")
- **Critique summary:** top-level verdict + finding count + concrete next step

## What this skill does NOT do

- **Does not scaffold harness** → hand off to `/hd:setup`
- **Does not answer concept questions** → `/hd:onboard`
- **Does not capture lessons** → `/hd:compound capture` (suggestion, not invocation)
- **Does not modify source work items** during critique (read-only)
- **Does not modify rubric files** (both modes — rubrics are team-owned, this skill just reads them)
- **Does not write to `docs/solutions/`** (compound's namespace) — ever

## Coexistence rules

- ✅ Reads our namespace + rubric files + user-specified work items
- ✅ Writes ONLY to `docs/knowledge/lessons/harness-audit-*.md` (audit mode) — nothing else
- ❌ Never writes to compound's namespace
- ❌ Never modifies compound's config files
- `<protected_artifacts>` block (declared above) protects our outputs from `/ce:review`
- Cross-plug-in Task calls fully-qualified: `Task compound-engineering:research:learnings-researcher(...)`

## Compact-safe mode

When context budget is tight:

- Audit: auto-switch to serial regardless of agent count (≥ 3 agents → serial in compact mode)
- Critique: apply fewer rubrics (skip ones with criteria requiring deep file reads)
- Hash mechanisms: N/A (hd-review doesn't use plan-hash; read-mostly design)

## Reference files

- [references/audit-criteria.md](references/audit-criteria.md) — five-layer health criteria + severity framework
- [references/bloat-detection.md](references/bloat-detection.md) — concrete thresholds + scripts
- [references/drift-detection.md](references/drift-detection.md) — stale-file + graduation-drought signals
- [references/critique-format.md](references/critique-format.md) — critique output shape
- [references/rubric-application.md](references/rubric-application.md) — how to apply a rubric to a work item

## Workflows

- [workflows/audit-parallel.md](workflows/audit-parallel.md) — ≤5 agents (default)
- [workflows/audit-serial.md](workflows/audit-serial.md) — ≥6 agents (auto-switch)
- [workflows/critique.md](workflows/critique.md) — single work-item rubric application

## Templates

- [templates/audit-report.md.template](templates/audit-report.md.template) — audit output format
- [templates/critique-response.md.template](templates/critique-response.md.template) — critique output format
- [templates/starter-rubrics/](templates/starter-rubrics/) — 4 shipped rubrics:
  - `accessibility-wcag-aa.md` — a11y (applies to design-file, html, css)
  - `design-system-compliance.md` — token + variant adherence (applies to design-file, css, token-json)
  - `component-budget.md` — new-primitive-component RFC gate
  - `skill-quality.md` — 9-point Layer 2 skill health check (applies to skill-md); audit mode runs this over every `skills/*/SKILL.md`
  - Users extend by authoring new rubrics in `docs/context/design-system/` or `docs/rubrics/`

## Scripts

- `scripts/budget-check.sh` — deterministic Tier 1 budget enforcement; emits JSON; called by audit workflows for objective line-count data
