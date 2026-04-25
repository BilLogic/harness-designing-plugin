---
title: v1 Implementation Plan — hd-review (audit + critique)
type: feat
status: active
date: 2026-04-16
origin: docs/plans/2026-04-16-006-feat-hd-compound-v0-5-plan.md
---

# v1 Implementation Plan — `hd-review` (audit + critique)

## Overview

Builds the **IMPROVE** skill — the final of four in the design-harness plug-in. Ships with Substack article #5 (Rubric Setting) + series finale. One skill, two modes:

- **Audit** — orchestrator-style harness health check. Loads agents from `design-harnessing.local.md`; runs them parallel (≤5) or serial (≥6 auto-switch per compound 2.39.0); emits a dated TODO-list report written as a Layer 5 lesson (meta-pattern: the audit IS a lesson).
- **Critique** — applies Layer 4 rubric(s) to a specific work item (design file, Figma frame, PR diff). Emits structured severity list + prose. Read-only in repo; optionally suggests `hd:compound capture` to turn the critique into a lesson.

14 files total: SKILL.md + 5 references + 3 workflows + 3 templates + 3 starter rubrics + 1 script.

**Origin chain:** 005 (v0.MVP) → 006 (v0.5 hd-compound) → 007 (this). Architectural locks from those plans carry forward unchanged — `/hd:` prefix, SKILL.md router ≤200 lines, atomic references, `docs/design-solutions/` namespace reserved but inactive through v1, fully-qualified cross-plug-in Task calls.

## Problem Statement

Layer 4 (Rubric Setting) of the five-layer framework is **distributed behavior, not a folder** — definitions in Layer 1 context, execution in a skill, enforcement via AGENTS.md gates. Without `hd-review`:

1. Layer 4 execution doesn't exist — rubrics are aspirational, never machine-checked
2. Layer 5 (Knowledge) accumulates lessons but no one audits whether the harness itself is bloating, drifting, or missing layers
3. `/ce:review` exists for engineering audit but has no design-domain counterpart; our plug-in runs beside it without a parallel audit primitive
4. Protected-artifacts pattern (from compound's ce-review) isn't declared — /ce:review could modify our outputs during cross-plug-in runs

`hd-review` closes all four. It's the final primitive that makes the full five-layer harness operational.

## Proposed Solution

Two-mode skill parallel to `hd-compound`'s structure (one skill, two modes — same verb family). Mirrors compound-engineering's `ce-review` orchestrator pattern, with domain swapped to design.

| Mode | Detection | Writes? | Protected? |
|---|---|---|---|
| `audit` | "audit my harness" / "check harness health" / `/hd:review audit` | 1 file: `docs/knowledge/lessons/harness-audit-YYYY-MM-DD.md` | Read-only audit; writes only the report |
| `critique` | "review this design" / `/hd:review critique <path-or-url>` | Nothing (inline response) | Read-only |

Neither mode needs plan-hash protection — both are read-mostly. Audit writes a dated lesson (Layer 5 append), not a Tier 1 mutation.

## Technical Approach

### Router dispatch

SKILL.md detects mode from prompt + `argument-hint`:

- User says "audit harness" / "health check" / `/hd:review audit` → `workflows/audit-parallel.md` (or `audit-serial.md` if ≥6 agents configured)
- User says "review this design" / `/hd:review critique <path>` → `workflows/critique.md`

### Audit orchestration pattern

Reads agent list from `design-harnessing.local.md` (YAML frontmatter field `review_agents`; spec matches compound's `compound-engineering.local.md` pattern but distinct config file):

```yaml
review_agents:
  - compound-engineering:research:learnings-researcher
  - compound-engineering:review:pattern-recognition-specialist
  - compound-engineering:review:code-simplicity-reviewer
  - compound-engineering:review:agent-native-reviewer
  - compound-engineering:workflow:spec-flow-analyzer
  # user-added agents here...
```

At audit invocation:

1. Count agents in list
2. **Count ≤ 5** → dispatch via `audit-parallel.md` (Task-tool parallel)
3. **Count ≥ 6** → auto-switch to `audit-serial.md` with user notice: "Running audit in serial mode (6+ agents configured). Use `--parallel` to override." (compound 2.39.0 lesson — 6+ parallel agents crash context)
4. Always-run (regardless of config): `compound-engineering:research:learnings-researcher` — surfaces past solutions from both our `docs/knowledge/lessons/` and compound's `docs/solutions/`
5. Synthesize findings into prioritized TODO list (P1/P2/P3); write to `docs/knowledge/lessons/harness-audit-YYYY-MM-DD.md`

### Critique orchestration pattern

Reads rubric(s) to apply from argument OR `design-harnessing.local.md` field `critique_rubrics`:

```yaml
critique_rubrics:
  - starter-rubrics/accessibility-wcag-aa
  - starter-rubrics/design-system-compliance
  - docs/context/design-system/team-specific-rubric.md  # user-authored
```

Applies each rubric to the work item (path or URL); emits structured response inline; does not write to disk unless user explicitly invokes `hd:compound capture` afterward.

### Protected-artifacts block (new primitive)

`hd-review/SKILL.md` frontmatter declares:

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

Pattern from compound's `ce-review/SKILL.md:54-61`. Prevents any review tool (including compound's own `/ce:review`) from flagging these paths for modification. Coexistence-preserving.

### `docs/design-solutions/` — still reserved, still inactive

v1 does not activate `docs/design-solutions/`. hd-review writes audit reports to `docs/knowledge/lessons/` (they're episodic lessons about the harness, not distilled pattern-solutions). `docs/design-solutions/` remains the reserved namespace for post-v1 distillation features.

## Per-File Specification

### `skills/hd-review/SKILL.md`

**Frontmatter:**

```yaml
---
name: hd:review
description: Audits harness health or applies team rubrics to a work item. Use for harness health checks or single-item design critique.
argument-hint: "audit | critique <file-path-or-url> [--rubric <name>]"
---
```

Char count: 148 (≤180 ✓). Plus `<protected_artifacts>` YAML block in SKILL.md body.

**Target length:** ≤200 lines.

**Sections:**

1. Interaction Method preamble (AskUserQuestion fallback)
2. Single-job statement (audit OR critique; one skill, two modes)
3. Mode routing table
4. `<protected_artifacts>` declaration block
5. Workflow checklist (copy-into-response)
6. Step 1: Identify mode
7. Step 2: Route to matching workflow
8. Step 3: For audit — load agent list, count, dispatch parallel or serial; for critique — load rubric(s), apply
9. Step 4: Synthesize + emit output (audit: write report; critique: inline response)
10. Step 5: Suggest next action (audit → commit or hd:compound to graduate findings; critique → hd:compound capture if learning emerged)
11. What this skill does NOT do (no writes to docs/solutions/; no modifications to source work items; no modifications to rubric definitions)
12. Coexistence rules + compact-safe mode
13. Reference + workflow + template + script index

### `references/audit-criteria.md`

**Purpose:** five-layer health criteria the audit checks against.
**Target length:** 100-150 lines.

**Sections:**

- Per-layer criteria (Layer 1-5): what "healthy" looks like, common drift signals
- Cross-cutting checks (Tier 1 budget, coexistence compliance, naming discipline, `<protected_artifacts>` integrity)
- Priority framework (P1 structural / P2 drift / P3 polish) with examples of each
- What's out of scope (performance, security — compound's agents handle those)

### `references/bloat-detection.md`

**Purpose:** concrete thresholds + grep/wc commands for bloat detection.
**Target length:** 60-100 lines.

**Sections:**

- Tier 1 budget (≤200 lines combined `AGENTS.md` + `docs/context/product/one-pager.md`)
- Per-file line thresholds (SKILL.md ≤200 router, ≤500 Anthropic hard; references 40-200; workflows 60-250)
- Combined-folder size heuristics
- `docs/knowledge/lessons/` growth rate — N lessons per quarter is healthy, excessive growth suggests missing graduation
- How `budget-check.sh` complements the reference (deterministic line counts; script is authoritative)

### `references/drift-detection.md`

**Purpose:** stale-file heuristics + graduation-drought signals.
**Target length:** 60-100 lines.

**Sections:**

- File-age analysis (Context files not edited 6+ months — suggest review)
- Graduation drought (≥10 lessons tagged with same topic + 0 graduations in 3 months — strong signal to propose)
- Tag-consistency drift (new lessons use variant tags — suggest canonicalization)
- Coexistence drift (writes detected in `docs/solutions/` or `compound-engineering.local.md` — structural violation)
- Skill count drift (0 user skills after 6 months of setup — not wrong, but worth surfacing)

### `references/critique-format.md`

**Purpose:** structured output shape for critique mode.
**Target length:** 80-120 lines.

**Sections:**

- Severity scale (P1 / P2 / P3) with concrete examples per rubric type
- YAML top matter for parseable critique (downstream tools can filter by severity)
- Prose sections (summary, per-severity findings, suggested fixes)
- Rubric attribution (every finding tags which rubric(s) it violates)
- Optional handoff suggestion (if learning emerged, suggest `hd:compound capture`)

### `references/rubric-application.md`

**Purpose:** how to apply a Layer 4 rubric to a specific work item.
**Target length:** 100-150 lines.

**Sections:**

- Rubric schema (what fields each rubric file must have)
- Work-item types supported (local file path, Figma frame URL, PR diff, pasted markdown)
- Application loop (for each rubric criterion, check the work item; record pass/fail/warning)
- Aggregation (merge findings across multiple rubrics; dedupe duplicate criteria; sort by severity)
- Cross-references to starter-rubrics as canonical schema examples

### `workflows/audit-parallel.md`

**Purpose:** default audit flow; runs ≤5 agents in parallel.
**Target length:** 100-150 lines.

**Steps:**

1. Read `design-harnessing.local.md` → parse `review_agents` list
2. Count agents; if ≥6 → route to `audit-serial.md` with notice
3. Inventory harness (AGENTS.md + docs/context/ + docs/knowledge/ + skills/ + config); produce current-state summary
4. Dispatch agents in parallel via Task tool, passing inventory + full plug-in context
5. Always include `compound-engineering:research:learnings-researcher` (even if not in user's list)
6. Collect findings; merge duplicates; categorize by severity (P1 / P2 / P3)
7. Cross-reference against `<protected_artifacts>` — any agent flagging protected paths for modification = discard that finding
8. Render findings per `templates/audit-report.md.template`
9. Write single file: `docs/knowledge/lessons/harness-audit-YYYY-MM-DD.md` (suffix `-NNN` if another audit today)
10. **No writes outside that report**; `git status` clean except the new audit file

### `workflows/audit-serial.md`

**Purpose:** fallback audit flow when ≥6 agents configured; runs serially.
**Target length:** 80-120 lines.

**Steps:** same as `audit-parallel.md` except agents dispatched one at a time in sequence. Document: compound 2.39.0 lesson (6+ parallel agents crash context); explicit user notice on mode switch.

### `workflows/critique.md`

**Purpose:** apply rubric(s) to a specific work item.
**Target length:** 100-150 lines.

**Steps:**

1. Parse argument: work-item path/URL + optional `--rubric <name>` filter
2. Determine rubric(s) to apply: from `--rubric` flag OR `design-harnessing.local.md` `critique_rubrics` field OR default (all starter rubrics)
3. Load work item (read file OR fetch URL)
4. Load rubric file(s); validate schema
5. For each rubric criterion, check work item; record findings
6. Aggregate + deduplicate
7. Render per `templates/critique-response.md.template` (YAML severity list + prose)
8. Emit inline (no file write)
9. If a genuine learning emerged from the critique, suggest: "Capture this? Run `/hd:compound capture`"

### `templates/audit-report.md.template`

**Purpose:** YAML TODO list + prose summary structure; meta-lesson format.
**Target length:** ~40 lines.

**Structure:**

```markdown
---
title: "Harness audit — {{DATE}}"
date: {{DATE}}
tags: [audit, layer-audit, harness-health]
graduation_candidate: false
---

# Harness audit — {{DATE}}

## Current state

{{INVENTORY_TABLE}}

## Findings

### P1 — structural

{{P1_FINDINGS}}

### P2 — drift

{{P2_FINDINGS}}

### P3 — polish

{{P3_FINDINGS}}

## Suggested actions

{{SUGGESTED_ACTIONS}}

## Agents used

{{AGENT_LIST}}
```

### `templates/critique-response.md.template`

**Purpose:** structured inline critique response.
**Target length:** ~30 lines.

**Structure:**

```markdown
## Critique: {{WORK_ITEM_NAME}}

### Summary

{{ONE_PARAGRAPH_SUMMARY}}

### Findings

```yaml
- severity: p1 | p2 | p3
  rubric: {{RUBRIC_NAME}}
  criterion: {{CRITERION_NAME}}
  finding: {{FINDING_TEXT}}
  suggested_fix: {{FIX_TEXT}}
- severity: ...
```

### Prose

{{PROSE_EXPLANATION}}

### Next step

{{SUGGESTED_NEXT}}
```

### `templates/starter-rubrics/accessibility-wcag-aa.md`

**Purpose:** WCAG 2.1 AA accessibility rubric. Users extend or replace.
**Target length:** 60-100 lines.

**Criteria covered:**

- Contrast (4.5:1 text / 3:1 large text / 3:1 non-text)
- Tap targets ≥44pt
- Keyboard navigation (all interactive elements reachable + visible focus state)
- Screen-reader support (semantic HTML, aria-labels)
- Form accessibility (labels, error messaging, fieldset grouping)

### `templates/starter-rubrics/design-system-compliance.md`

**Purpose:** design-system adherence rubric.
**Target length:** 50-80 lines.

**Criteria:**

- Only approved color tokens (no one-off hex codes)
- Only approved typography (scale + family from cheat-sheet)
- Only approved spacing (from token scale)
- Variant constraints (button variants within allowed set, etc.)
- Component budget (no new primitives without RFC)

### `templates/starter-rubrics/component-budget.md`

**Purpose:** component-budget-specific rubric.
**Target length:** 40-60 lines.

**Criteria:**

- New primitive components require RFC linked in `docs/knowledge/decisions/`
- Extensions of existing components via composition preferred over new primitives
- Proposed new component must describe why existing components are insufficient

### `scripts/budget-check.sh`

**Purpose:** deterministic Tier 1 line-count enforcement; emit JSON.
**Target length:** ~50 lines bash.

**Behavior:**

```json
{
  "tier_1": {
    "files": ["AGENTS.md", "docs/context/product/one-pager.md"],
    "lines": 179,
    "budget": 200,
    "status": "pass"
  },
  "file_sizes": {
    "AGENTS.md": 150,
    "docs/context/product/one-pager.md": 27
  },
  "skill_md_lines": {
    "skills/hd-onboard/SKILL.md": 124,
    "skills/hd-setup/SKILL.md": 148,
    "skills/hd-compound/SKILL.md": 122,
    "skills/hd-review/SKILL.md": 180
  },
  "violations": [],
  "checked_at": "2026-04-16T00:00:00Z"
}
```

Exit 0 on success (even if budget violated — emit JSON with `status: "fail"` and `violations` populated). Exit non-zero only on script error (file missing, malformed).

Parallel primitive to `detect-mode.sh` from hd-setup — same JSON-emission pattern.

## Execution Order

```
Phase 1 (references + templates + script):
  P1.1 references/audit-criteria.md
  P1.2 references/bloat-detection.md
  P1.3 references/drift-detection.md
  P1.4 references/critique-format.md
  P1.5 references/rubric-application.md
  P1.6 templates/audit-report.md.template
  P1.7 templates/critique-response.md.template
  P1.8 templates/starter-rubrics/accessibility-wcag-aa.md
  P1.9 templates/starter-rubrics/design-system-compliance.md
  P1.10 templates/starter-rubrics/component-budget.md
  P1.11 scripts/budget-check.sh

Phase 2 (workflows):
  P2.1 workflows/audit-parallel.md
  P2.2 workflows/audit-serial.md
  P2.3 workflows/critique.md

Phase 3 (SKILL.md last — all link targets exist):
  P3.1 SKILL.md

Phase 4:
  P4.1 Verification (grep, script syntax, no-writes-during-audit smoke)
  P4.2 Commit
```

No mid-phase commits. Single commit: `feat(hd-review): implement v1 improve skill (audit + critique)`.

## Verification Steps

### Standard compliance (same suite as v0.MVP + v0.5)

- SKILL.md ≤200 lines, description ≤180 chars
- `argument-hint` YAML-quoted
- Reference files atomic (one topic each)
- All reference links one-level-deep
- No bare-backtick references (except script paths per convention)
- Markdown lint (closed fences, forward slashes)

### New for v1

- **`<protected_artifacts>` block** present in SKILL.md; paths match the glob list specified in origin 005 Appendix E
- **`budget-check.sh`** executable; `bash -n` syntax clean; emits valid JSON on our own repo (smoke test)
- **No-writes-during-audit smoke test** — invoke `hd:review audit` on a scratch repo; verify only `docs/knowledge/lessons/harness-audit-YYYY-MM-DD.md` is created (not touched elsewhere)
- **Cross-plug-in Task calls** fully-qualified in both audit workflows

### Acceptance sub-tests

- Audit with 3 agents → parallel mode (< 5 threshold)
- Audit with 7 agents → auto-switches to serial with user notice
- Critique on a scratch file with `--rubric starter-rubrics/accessibility-wcag-aa` → emits structured response; no disk writes
- Starter-rubric schema validation: each starter file parseable; extends cleanly via user-added rubric files

## Acceptance Criteria

### Functional (both modes)

- [ ] **Audit mode:** writes exactly 1 file (`docs/knowledge/lessons/harness-audit-YYYY-MM-DD.md`); `git status` shows only that file; report has YAML frontmatter + P1/P2/P3 findings per template; every finding attributes its source agent
- [ ] **Critique mode:** emits inline structured response; **zero file writes**; at least one rubric applied; each finding tags severity + rubric + criterion
- [ ] **Parallel/serial auto-switch:** agent count ≤5 → parallel; ≥6 → serial with explicit user notice matching compound 2.39.0 pattern

### Structural

- [ ] `<protected_artifacts>` block present in SKILL.md declaring all hd-* output paths (docs/design-solutions/**, docs/knowledge/**, docs/context/**, AGENTS.md, design-harnessing.local.md, skills/**)
- [ ] `budget-check.sh` executable, syntax-clean, emits valid JSON matching spec
- [ ] Three starter rubrics ship with consistent schema (YAML frontmatter + criteria body + examples)

### Coexistence

- [ ] Zero writes to `docs/solutions/` (compound namespace) across all modes
- [ ] Every compound agent invocation uses fully-qualified Task name (no bare names)
- [ ] `<protected_artifacts>` block matches the paths specified in origin 005 Appendix E

### Read-only discipline

- [ ] Critique mode writes zero files
- [ ] Audit mode writes only the dated audit report
- [ ] Source work items in critique mode byte-identical post-run
- [ ] Rubric files byte-identical post-run (both modes)

## Risks & Mitigations

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R1 | Parallel/serial switch surprises user — "why is audit slow today?" | Med | Low | Explicit user notice on switch; `--parallel` override documented |
| R2 | Rubric schema drift — user-authored rubrics fail to load | Med | Med | `rubric-application.md` has schema validator; clear error message ("rubric missing field X"); starter rubrics act as canonical examples |
| R3 | Audit-as-lesson meta-pattern confuses users — is the audit report really a lesson? | Low | Low | SKILL.md explains: "Audit reports are episodic (dated, append-only) → belong in Layer 5. Not a rule; not context. A snapshot of harness health at one point in time." |
| R4 | `<protected_artifacts>` edge cases — compound's `/ce:review` doesn't honor the block | Low | Med | Test in Bill's own setup (both plug-ins installed); verify `/ce:review` respects our block; if not, file bug upstream. Mitigation: audit report includes "Protected-artifact integrity check" as a P1 finding if violations detected |
| R5 | Starter rubrics are too generic — users don't extend | Med | Low | Each starter rubric has explicit extension instructions + reference to `rubric-application.md` schema; v1 doesn't over-promise rubric coverage (users expected to author domain-specific rubrics) |
| R6 | Agent-count threshold (5 vs 6) is arbitrary | Low | Low | Document as compound's empirically-derived threshold (2.39.0 lesson); allow `--parallel` override for users who know their context budget |
| R7 | Audit finds so many P1 issues it's overwhelming | Med | Low | Audit report includes "Top 3 P1 priorities" summary at top — user acts on those first; rest is backlog |

## Dependencies

### Hard dependencies (must be met before v1 build)

- [x] v0.MVP ship-ready (commits `6d7a5e16`, `d361bb2e`, `b4387dd2`, `712222aa`)
- [x] v0.5 hd-compound complete (commit `540a1b45`)
- [x] Three other skills already implement `<protected_artifacts>`-adjacent discipline: they write only to expected paths, making hd-review's declaration meaningful

### Soft dependencies

- `hd:compound` handoff — critique mode suggests `/hd:compound capture` when a critique surfaces a lesson-worthy learning. Not blocking (suggestion, not invocation), but more powerful if hd-compound exists
- Bill's own repo has ≥5 lessons + 1 graduation from v0.5 build session — audit has real data to work with in dogfood

### External

- SHA-256 available (for plan-hash parity if future modes add destructive writes) — macOS/Linux baseline ✓
- Task tool available for compound agent dispatch — Claude Code + Codex CLI ✓

## Time Estimate

8.5 hours total:

| Phase | Scope | Time |
|---|---|---|
| Phase 1 | 5 references + 3 templates + 3 starter rubrics + `budget-check.sh` | 4.5h |
| Phase 2 | 3 workflows (audit-parallel, audit-serial, critique) | 2.5h |
| Phase 3 | SKILL.md router with `<protected_artifacts>` block | 1h |
| Phase 4 | Verification + audit smoke test + commit | 0.5h |

Single commit at end of Phase 4: `feat(hd-review): implement v1 improve skill (audit + critique)`.

## Alternative Approaches Considered

**Alternative A — Split into `hd:audit` + `hd:critique`.** Rejected: same reasoning as v0.5's hd-graduate rejection. Audit and critique are same verb family (IMPROVE); different modes of the same skill. Splitting doubles surface area without improving discipline.

**Alternative B — Plan-hash on audit writes (like hd-compound graduate).** Rejected: audit writes to `docs/knowledge/lessons/` (append-only Layer 5), not to AGENTS.md (Tier 1). The risk profile is lower — an incorrect audit report can be corrected with a counter-lesson. Plan-hash is overkill for this write surface.

**Alternative C — Ship without starter rubrics; force users to author their own.** Rejected: starter rubrics lower the activation energy for Layer 4 adoption. Users can replace/extend — starters aren't prescriptive, they're seed content.

**Alternative D — Integrate critique into hd:setup advanced-mode audit.** Rejected: hd:setup is structural (scaffolding); hd:review is behavioral (health checks + critique). Different verbs, different scope. Mixing violates single-job principle.

## Sources & References

### Origin chain

- **Origin document:** [docs/plans/2026-04-16-006-feat-hd-compound-v0-5-plan.md](./2026-04-16-006-feat-hd-compound-v0-5-plan.md) — v0.5 plan establishes the capture + graduate precedent (one skill, two modes) that hd-review parallels with audit + critique
- **Upstream origin:** [docs/plans/2026-04-16-005-feat-v0-mvp-implementation-plan.md](./2026-04-16-005-feat-v0-mvp-implementation-plan.md) § Appendix E — full hd-review file spec locked there

### Internal

- Parent skill pattern: compound-engineering's `skills/ce-review/SKILL.md` (orchestrator; loads agents from `.local.md` config; parallel/serial auto-switch)
- `<protected_artifacts>` pattern: `~/.claude/plugins/cache/compound-engineering-plugin/compound-engineering/2.42.0/skills/ce-review/SKILL.md:54-61`
- Script-emission pattern: `skills/hd-setup/scripts/detect-mode.sh` (parallel to this plan's `budget-check.sh`)
- Coexistence: [repo AGENTS.md § Coexistence](../../AGENTS.md#coexistence-with-compound-engineering)
- Layer 4 distributed-behavior argument: [docs/rubrics/INDEX.md](../rubrics/INDEX.md)

### External

- compound CHANGELOG 2.39.0 — parallel → serial auto-switch at 6+ agents
- Anthropic [Skill best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
- Article §4d — Rubric Setting (why rubrics are distributed, not a folder)
- Article §5 — ships with v1 (rubric-focused article)

## Execution Ready

All locks in place. Origin chain 005 → 006 → 007 maintained. Next command: `/ce:work docs/plans/2026-04-16-007-feat-hd-review-v1-plan.md` starts Phase 1 immediately.

Plan written to `docs/plans/2026-04-16-007-feat-hd-review-v1-plan.md`.
