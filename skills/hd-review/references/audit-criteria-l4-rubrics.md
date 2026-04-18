---
title: Audit criteria — Layer 4 (Rubrics)
loaded_by: hd-review audit mode (via harness-auditor agent with layer: 4)
---

# Audit criteria: Layer 4 — Rubric Setting

## Purpose

Criteria for auditing the Rubrics layer: coverage vs the starter library,
`INDEX.md` sync, managed-design-system pre-fill completeness, and
scope-and-grounding presence on each rubric. Loaded by `harness-auditor` with
`layer: 4`.

## Criteria

### rubrics-index-present
- **Check:** `docs/rubrics/INDEX.md` exists as distributed-pattern pointer
- **Default severity:** p2
- **Pass example:** INDEX lists each rubric with a one-line purpose and canonical path
- **Fail example:** `docs/rubrics/` directory missing or empty
- **Scope:** this layer only

### rubric-definitions-located
- **Check:** rubric criteria files live where the team's convention puts them (e.g., `docs/context/design-system/` or `docs/rubrics/`)
- **Default severity:** p2
- **Pass example:** `docs/context/design-system/a11y-criteria.md` exists and INDEX.md points to it
- **Fail example:** INDEX lists rubrics that don't exist, or criteria files exist but aren't indexed
- **Scope:** this layer only

### index-sync
- **Check:** every rubric criteria file is reachable from `INDEX.md`, and every entry in INDEX.md resolves to a real file
- **Default severity:** p2
- **Pass example:** bidirectional match
- **Fail example:** INDEX references `spacing-compliance.md` but file was renamed to `spacing-tokens.md`
- **Scope:** this layer only

### starter-coverage
- **Check:** coverage of the starter library (a11y, design-system, component-budget, skill-quality, interaction-states)
- **Default severity:** p2
- **Pass example:** team has adopted or intentionally deferred each starter with a note
- **Fail example:** none of the starters adopted AND no team-authored equivalents
- **Scope:** this layer only

### managed-ds-prefill
- **Check:** if the repo uses a managed design system, the DS-derived rubrics are pre-filled (tokens, components, budgets)
- **Default severity:** p2
- **Pass example:** `token-compliance.md` lists real token names from the DS
- **Fail example:** rubric still has `{{TOKEN_NAME}}` placeholders after 30 days
- **Scope:** this layer only

### scope-and-grounding-presence
- **Check:** each rubric has a `scope` and `grounding` section (per 3i.8)
- **Default severity:** p2
- **Pass example:** every rubric states what it covers, what it doesn't, and which authoritative source grounds each criterion
- **Fail example:** rubric lists criteria with no link to the DS spec or a11y standard that justifies them
- **Scope:** this layer only

### rubric-derived-rule-in-agents
- **Check:** `AGENTS.md` § Rules contains at least one rubric-derived rule
- **Default severity:** p2
- **Pass example:** a rule like "All UI PRs pass `a11y-criteria.md` before merge" is present
- **Fail example:** AGENTS.md has no rules grounded in rubrics — rubrics exist but don't bind behavior
- **Scope:** this layer only

### rubrics-applied
- **Check:** rubrics defined are actually applied (hd:review invoked, or referenced in PR checks)
- **Default severity:** p2
- **Pass example:** git history shows `/hd:review critique` invocations citing rubrics
- **Fail example:** rubrics exist but never invoked since creation
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
- Agent that loads this: `../../../agents/analysis/harness-auditor.md` (invoked with `layer: 4`)
- Starter rubrics: `../assets/starter-rubrics/`
