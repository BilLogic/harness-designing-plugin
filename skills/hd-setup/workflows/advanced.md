# Workflow — Advanced mode (light audit)

**When to use:** mode `advanced` from `detect-mode.sh` (scenario S5 / S9 — full layer structure exists OR prior-run marker present).
**Goal:** audit existing harness structure against the five-layer rubric; produce a prioritized TODO report. **Read-mostly** — no writes outside the audit report file.

## Progress checklist

```
Advanced Audit Progress:
- [ ] Step 1: Confirm advanced mode with user
- [ ] Step 2: Inventory existing harness structure
- [ ] Step 3: Run layer-by-layer checks
- [ ] Step 4: Run cross-cutting checks (Tier 1 budget, coexistence, naming)
- [ ] Step 5: Synthesize findings into prioritized TODOs
- [ ] Step 6: Write audit report to docs/knowledge/lessons/
- [ ] Step 7: Summarize — no other file writes
```

## v0.MVP scope limit

This is a **light audit**, not the full multi-agent audit that ships with `hd:review` at v1. v0.MVP advanced mode:

- Checks structural presence of each layer
- Checks Tier 1 budget
- Checks coexistence (if compound-engineering detected)
- Identifies graduation drought (lessons without graduations)

v0.MVP does NOT:

- Run multi-agent analysis (deferred to `hd:review` v1)
- Apply rubrics to work items (deferred to `hd:review` v1 critique mode)
- Propose fixes automatically (user applies TODOs manually or waits for v1)

## Step 1 — Confirm mode

Surface detection:

> This repo has a populated harness structure — `docs/context/`, `docs/knowledge/`, possibly prior `design-harnessing.local.md`. I'll run a light audit and report TODOs. No writes outside the audit report. OK to proceed?

If user wanted to rescaffold instead, route back to greenfield (rare; re-running on populated repo almost always means audit).

## Step 2 — Inventory

Scan the harness:

- `AGENTS.md` — exists? Line count? Sections?
- `docs/context/*` — which subdirs populated? File counts + line counts
- `docs/knowledge/lessons/*` — lesson count, date range, tag coverage
- `docs/knowledge/graduations.md` — entries count
- `docs/rubrics/INDEX.md` — exists? Points somewhere?
- `skills/*` — any custom skills (outside what this plug-in ships)?
- `design-harnessing.local.md` — exists? Schema valid?

Report inventory table as the audit's "current state" section.

## Step 3 — Layer-by-layer checks

For each layer, apply its reference's audit criteria:

**Layer 1 (Context)** — per [layer-1-context.md](../references/layer-1-context.md) + [tier-budget-model.md](../references/tier-budget-model.md):
- Tier 1 budget: `wc -l AGENTS.md docs/context/product/one-pager.md | tail -1` — flag if >200
- Stale files: any file not touched in 6+ months? Flag for review
- Missing sub-dirs: product/, design-system/, conventions/ — flag gaps

**Layer 2 (Skills)** — per [layer-2-skills.md](../references/layer-2-skills.md):
- If `skills/` has 0 custom skills AND `docs/knowledge/lessons/` has ≥10 entries → flag "consider first skill"
- If `skills/` has >5 custom skills AND `docs/context/` is thin → flag "skills outpacing context"

**Layer 3 (Orchestration)** — per [layer-3-orchestration.md](../references/layer-3-orchestration.md):
- If `skills/` has ≥3 AND no `docs/orchestration/` → flag "skills orphaned, workflows worth defining"
- v0.MVP: inform but don't scaffold (deferred to v0.5+)

**Layer 4 (Rubrics)** — per [layer-4-rubrics.md](../references/layer-4-rubrics.md):
- `docs/rubrics/INDEX.md` present? Flag if missing
- Rubric criteria in `docs/context/design-system/*`? Count them; flag if zero after 3+ months of harness use

**Layer 5 (Knowledge)** — per [layer-5-knowledge.md](../references/layer-5-knowledge.md):
- Graduation drought: ≥10 lessons, 0 graduations → flag "time to graduate something"
- Tag coverage: lessons without tags → hard to identify patterns
- Date spread: all lessons from the same week → team front-loaded, not ongoing

## Step 4 — Cross-cutting checks

- **Tier 1 budget** — already checked in Layer 1
- **Coexistence** — if compound-engineering detected, verify no writes to `docs/solutions/`; verify we have `design-harnessing.local.md` (not `compound-engineering.local.md` as ours)
- **Naming discipline** — any `hd-*` typos? Any bare command names in skill frontmatter (not `hd:verb`)?
- **Local.md schema** — if `design-harnessing.local.md` exists, validate against [local-md-schema.md](../references/local-md-schema.md). Report schema violations.

## Step 5 — Synthesize

Group findings by priority:

- **P1 — structural** — Tier 1 budget violation; missing required layer; schema invalid
- **P2 — drift** — stale files, graduation drought, skills outpacing context
- **P3 — polish** — tag coverage, naming consistency

Each finding has: severity (p1/p2/p3), category (layer-1 / layer-5 / cross-cutting), file path, suggested action.

## Step 6 — Write audit report

Write ONE file: `docs/knowledge/lessons/harness-audit-YYYY-MM-DD.md` (today's date, `-NNN` suffix if another audit already ran today).

Report is itself a lesson — meta-pattern: audit is a thing that happened; it's episodic; it belongs in Layer 5. The report includes:

```markdown
---
title: "Harness audit — YYYY-MM-DD"
date: 2026-04-16
tags: [audit, layer-audit, harness-health]
graduation_candidate: false
---

# Harness audit — YYYY-MM-DD

## Current state

[Inventory table from Step 2]

## Findings

### P1 — structural
- [list]

### P2 — drift
- [list]

### P3 — polish
- [list]

## Suggested actions

[For each P1/P2, a concrete next step. P3 = optional polish.]
```

**No other file writes.** If the audit surfaces a quick win (like a typo in AGENTS.md), LIST it as a TODO — don't fix it automatically. Separation of concerns: audit reports, user applies.

## Step 7 — Summarize

Report: N findings total, X P1 / Y P2 / Z P3. Top 3 by severity. Point user at the audit report file. Do NOT propose applying fixes (that's manual or deferred to `hd:review` v1 which has remediation).

## Failure modes

- **F5 Confused state** — if inventory detects contradictory signals (for example: Layer 1 + Layer 5 populated but no `design-harnessing.local.md`), report the inconsistency as a P1 finding; user decides
- **F6 Coexistence drift** — if writes to `docs/solutions/` detected (violates coexistence), P1 finding: user accidentally bypassed namespace isolation

## Success criteria

Passes [C-S5 advanced audit criteria](../../../docs/plans/hd-setup-success-criteria.md#c-s5--advanced-audit-criteria) when:

- `docs/knowledge/lessons/harness-audit-YYYY-MM-DD.md` produced
- Report has specific, prioritized TODOs (not generic advice)
- **No files outside that report modified**
- `git status` shows only the new audit file
