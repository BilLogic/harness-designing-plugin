---
title: Audit criteria — Layer 1 (Context)
loaded_by: hd-review audit mode (via harness-auditor agent with layer: 1)
---

# Audit criteria: Layer 1 — Context Engineering

## Purpose

Criteria for auditing the Context layer: `docs/context/` structure, Tier-1 budget
health, coverage of product/conventions/design-system, and bloat detection.
Loaded by the `harness-auditor` sub-agent when dispatched with `layer: 1`.

## Criteria

### context-coverage
- **Check:** `docs/context/` exists with 4+ populated sub-paths (product, design-system, conventions, agent-persona)
- **Default severity:** p2
- **Pass example:** all four sub-paths exist, each has at least one non-placeholder file
- **Fail example:** only `product/` exists; `agent-persona.md` is template-placeholder-only
- **Scope:** this layer only

### tier1-budget
- **Check:** Tier 1 budget ≤200 lines (AGENTS.md + product/one-pager.md combined)
- **Default severity:** p1
- **Pass example:** `AGENTS.md` 120 lines + `one-pager.md` 60 lines = 180 total
- **Fail example:** combined 340 lines — `scripts/budget-check.sh` reports violation
- **Scope:** this layer only (enforcement via cross-cutting budget check)

### freshness
- **Check:** files edited within the last 6 months OR explicitly marked stable
- **Default severity:** p2
- **Pass example:** `design-system/cheat-sheet.md` updated 3 months ago; `conventions/naming.md` has `stable: true` frontmatter
- **Fail example:** `product/one-pager.md` last touched 14 months ago, no stable marker
- **Scope:** this layer only

### bloat-detection
- **Check:** no single file >500 lines (split candidate)
- **Default severity:** p2
- **Pass example:** largest context file is 340 lines
- **Fail example:** `design-system/tokens.md` at 880 lines — split into color/spacing/type
- **Scope:** this layer only

### agent-persona-populated
- **Check:** `agent-persona.md` is not empty or template-placeholder-only
- **Default severity:** p2
- **Pass example:** file describes team's AI operating persona in 30+ lines of real content
- **Fail example:** file contains only `{{TEAM_NAME}}` and `TODO: fill in` markers
- **Scope:** this layer only

### post-pivot-freshness
- **Check:** design-system cheat-sheet updated after any product pivot
- **Default severity:** p2
- **Pass example:** product pivot 2 months ago; cheat-sheet updated within that window
- **Fail example:** pivot changed primary use case but cheat-sheet still references old flows
- **Scope:** this layer only

## Output shape

Each check produces:
```yaml
- check: <name>
  status: pass | warn | fail
  severity: p1 | p2 | p3
  evidence: "<what was observed>"
  recommendation: "<what to do if fail>"
```

## See also

- Parent skill: `../SKILL.md`
- Agent that loads this: `../../../agents/analysis/harness-auditor.md` (invoked with `layer: 1`)
- Cross-cutting budget interpretation: `audit-criteria-budget.md`
- Bloat thresholds: `bloat-detection.md`
