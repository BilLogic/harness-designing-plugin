---
title: Audit criteria — Layer 5 (Knowledge)
loaded_by: hd-review audit mode (via harness-auditor agent with layer: 5)
---

# Audit criteria: Layer 5 — Knowledge Compounding

## Purpose

Criteria for auditing the Knowledge layer: memory-type distribution across the
5 type files, INDEX sync, lesson hygiene, compound-readiness backlog, and
rule-adoption cadence. Loaded by `harness-auditor` with `layer: 5`.

## Criteria

### lesson-time-spread
- **Check:** `docs/knowledge/lessons/*.md` has entries spread across time (not front-loaded)
- **Default severity:** p2
- **Pass example:** lessons span multiple months with consistent trickle
- **Fail example:** all lessons dated within a single week (burst capture; no ongoing discipline)
- **Scope:** this layer only

### lesson-hygiene
- **Check:** every lesson has a date and at least one tag
- **Default severity:** p2
- **Pass example:** every file follows `YYYY-MM-DD-slug.md` naming and has `tags:` in frontmatter
- **Fail example:** lessons without dates or tags, or inconsistent tag vocabulary
- **Scope:** this layer only

### memory-type-distribution
- **Check:** memory types distributed across the 5 type files (not everything pooled in `lessons/`)
- **Default severity:** p2
- **Pass example:** procedural-memory, episodic-memory, semantic-memory, etc. each populated appropriately
- **Fail example:** all knowledge in one bucket; type split not respected
- **Scope:** this layer only

### knowledge-index-sync
- **Check:** `docs/knowledge/INDEX.md` (or equivalent) reflects the actual file set
- **Default severity:** p2
- **Pass example:** INDEX matches files on disk; no orphans, no broken links
- **Fail example:** INDEX references deleted lessons; new lessons absent from INDEX
- **Scope:** this layer only

### rule-adoption-cadence
- **Check:** rule-adoption cadence ~1 per 10 lessons is healthy; at least one rule visible in git history via `docs/knowledge/changelog.md`
- **Default severity:** p2
- **Pass example:** 23 lessons, 2-3 graduated rules recorded in changelog
- **Fail example:** 40+ lessons, 0 rule graduations recorded
- **Scope:** this layer only

### rule-adoption-drought
- **Check:** 10+ lessons with same tag and 0 rule adoptions → drought
- **Default severity:** p2
- **Pass example:** repeated-tag clusters eventually produce a graduation
- **Fail example:** 15 lessons tagged `#handoff-friction`, no rule adopted — pattern is being re-learned, not codified
- **Scope:** this layer only

### compound-readiness-backlog
- **Check:** lessons with `rule_candidate: yes` that haven't been adopted are tracked as a backlog
- **Default severity:** p2
- **Pass example:** 3 candidates flagged; the next `/hd:compound` run has a queue
- **Fail example:** 12 candidates flagged over 6 months, none processed
- **Scope:** this layer only

### changelog-placeholders
- **Check:** `changelog.md` has no `{{PLACEHOLDER}}` left unfilled
- **Default severity:** p2
- **Pass example:** every entry has a real date, rule, and source-lesson link
- **Fail example:** entries with `{{DATE}}` or `{{RULE}}` still in the file
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
- Agent that loads this: `../../../agents/analysis/harness-auditor.md` (invoked with `layer: 5`)
- Drift heuristics: `drift-detection.md`
