---
title: Audit criteria — Layer 2 (Skills)
loaded_by: hd-review audit mode (via harness-auditor agent with layer: 2)
---

# Audit criteria: Layer 2 — Skill Curation

## Purpose

Criteria for auditing the Skills layer: SKILL.md compliance (frontmatter,
description length, line caps), progressive disclosure, Task wiring, and
custom-skill count drift. Loaded by `harness-auditor` with `layer: 2`.

## Criteria

### custom-skill-count
- **Check:** 1-5 custom skills (beyond what the plug-in ships) after 3+ months of use
- **Default severity:** p2
- **Pass example:** 3 team-authored skills after 5 months
- **Fail example:** 0 custom skills after 6 months of use (suggests underused harness); or 12 skills with overlapping triggers (proliferation)
- **Scope:** this layer only

### skill-md-compliance
- **Check:** each skill has `SKILL.md` ≤200 lines with proper YAML frontmatter (`name`, `description`, etc.)
- **Default severity:** p1
- **Pass example:** all `skills/*/SKILL.md` files pass frontmatter validation and are ≤200 lines
- **Fail example:** skill missing `description:` key or body is 340 lines
- **Scope:** this layer only

### description-char-budget
- **Check:** each skill's `description:` ≤180 chars
- **Default severity:** p2
- **Pass example:** description is 140 chars, trigger-oriented
- **Fail example:** description is 240 chars with rambling prose
- **Scope:** this layer only

### skill-prefix-convention
- **Check:** all skills use the team's `<prefix>-*` convention (e.g. `hd-*`)
- **Default severity:** p2
- **Pass example:** every custom skill dir matches the declared prefix
- **Fail example:** a skill named `design-tokens` lives alongside `hd-review` — no prefix
- **Scope:** this layer only (naming-discipline also checks `name:` frontmatter form)

### skill-quality-rubric-pass
- **Check:** each skill passes the 9-point `skill-quality` rubric (see `../assets/starter-rubrics/skill-quality.md`)
- **Default severity:** p1 (if ≥2 sections fail at p1)
- **Pass example:** skill passes all 9 sections or has only minor (p3) gaps
- **Fail example:** skill fails sections 3 (progressive disclosure) and 7 (Task wiring) at p1
- **Scope:** this layer only
- **Audit action:** for every `skills/*/SKILL.md`, run the `skill-quality` rubric; cite failing-section numbers (1–9) in the report.

### tagging-and-categorization
- **Check:** skills have tags / categorization where the convention applies
- **Default severity:** p3
- **Pass example:** every skill has a `tags:` or category hint
- **Fail example:** untagged skills mixed with tagged ones — inconsistent
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
- Agent that loads this: `../../../agents/analysis/harness-auditor.md` (invoked with `layer: 2`)
- Skill-quality rubric itself: `../assets/starter-rubrics/skill-quality.md`
- Naming discipline (cross-cutting): handled by the `coexistence-analyzer` agent (`agents/analysis/coexistence-analyzer.md`)
