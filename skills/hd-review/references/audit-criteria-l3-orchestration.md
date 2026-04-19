---
title: Audit criteria — Layer 3 (Orchestration)
loaded_by: hd-review audit mode (via harness-auditor agent with layer: 3)
---

# Audit criteria: Layer 3 — Workflow Orchestration

## Purpose

Criteria for auditing the Orchestration layer: skill-to-skill chains, workflow
artifacts, handoff clarity, and gate declarations. Loaded by `harness-auditor`
with `layer: 3`.

## Criteria

### orchestration-presence
- **Check:** `docs/orchestration/` exists if team has ≥3 Layer 2 skills
- **Default severity:** p2
- **Pass example:** team has 4 skills and `docs/orchestration/intake-to-handoff.md` exists
- **Fail example:** team has 5 skills and no orchestration dir → skills are orphaned
- **Scope:** this layer only

### workflow-naming-and-refs
- **Check:** workflows are named and referenced in handoffs (not just ambient)
- **Default severity:** p2
- **Pass example:** `docs/orchestration/design-review-flow.md` named and cited from 2 skills
- **Fail example:** workflow exists as a file but no skill/handoff links to it
- **Scope:** this layer only

### gates-declared
- **Check:** gates declared (which rubrics apply where)
- **Default severity:** p2
- **Pass example:** workflow says "before handoff: run `a11y` + `token-compliance` rubrics"
- **Fail example:** workflow describes steps but never says which rubrics gate progression
- **Scope:** this layer only

### workflow-freshness
- **Check:** workflow files not stale (touched within 6 months or marked stable)
- **Default severity:** p2
- **Pass example:** most-recent workflow edit 2 months ago
- **Fail example:** all workflow files last edited 9+ months ago, no stable markers
- **Scope:** this layer only

### handoffs-as-artifacts
- **Check:** handoffs happen as artifacts (not in Slack / ephemeral chat)
- **Default severity:** p2
- **Pass example:** PR template or handoff doc references a rubric + a source-of-truth file
- **Fail example:** team reports handoffs happen verbally in Slack, no artifact trail
- **Scope:** this layer only (observational — confirm via team interview if uncertain)

### other-tool-coexistence-at-l3
- **Check:** orchestration doesn't step on another plug-in's workflow namespace
- **Default severity:** p1
- **Pass example:** `hd:*` workflows and any external workflows have distinct entry points
- **Fail example:** a workflow file invokes an external slash command as a gate without namespace-qualifying it, or silently renames an external step
- **Scope:** cross-layer (deeper coexistence checks are handled by the `coexistence-analyzer` agent)

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
- Agent that loads this: `../../../agents/analysis/harness-auditor.md` (invoked with `layer: 3`)
- Coexistence deep-dive: handled by the `coexistence-analyzer` agent (`agents/analysis/coexistence-analyzer.md`)
