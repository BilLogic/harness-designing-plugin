---
title: Review criteria — Layer 2 (Skills)
loaded_by: hd-review review mode (via harness-auditor agent with layer: 2)
---

# Review criteria: Layer 2 — Skill Curation

## Purpose

Criteria for the Skills layer: SKILL.md compliance, progressive disclosure, budget hygiene, and content quality. Loaded by `harness-auditor` with `layer: 2`.

**Grading.** 4-level `content_status`: `missing` · `present-but-stale` · `present-and-populated` · `healthy`. Presence of a file is necessary but not sufficient — each check verifies the content actually does its job.

## Criteria

### skill-dir-detected

- **Check:** one of `.agent/skills/`, `.claude/skills/`, `skills/` exists with ≥1 SKILL.md
- **Default severity:** p1
- **Source of truth:** `budget-check.sh` → `skill_dir_detected` field
- **Content check:** `skill_dir_detected != "none"` in the JSON output. If none, the L2 review score is capped at 3.0 regardless of other findings.

### custom-skill-count

- **Check:** 1–5 custom skills after 3+ months of use
- **Default severity:** p2
- **Stale signal:** 0 custom skills after 6 months (underused harness); 12+ with overlapping triggers (proliferation)

### skill-md-compliance

- **Check:** each SKILL.md ≤200 lines + valid YAML frontmatter (`name`, `description`)
- **Default severity:** p1
- **Content checks:**
  - Frontmatter parses
  - `name` matches the team's prefix convention
  - `description` is non-empty, ≤180 chars (soft) / ≤1024 (hard)
  - Body has ≥1 "Procedure" or "Workflow" section

### description-char-budget

- **Check:** each skill's `description:` ≤180 chars (soft), ≤1024 hard
- **Default severity:** p2
- **Source of truth:** `budget-check.sh` → `skills[].description_chars`

### skill-prefix-convention

- **Check:** all custom skills share a `<prefix>-*` convention
- **Default severity:** p2
- **Stale signal:** mixed prefixes indicate accidental proliferation

### skill-quality-rubric-pass

- **Check:** each skill passes the 9-section `skill-quality` rubric
- **Default severity:** p1 (if ≥2 sections fail at p1)
- **Review action:** for every SKILL.md, run `skill-quality` rubric via `skill-quality-auditor`; cite failing section numbers
- **Content check:** fails if SKILL.md has only placeholder content (`{{STEP_1}}`, `TODO:`, etc.)

### references-exist-and-parse

- **Check:** every `references/*.md` referenced from SKILL.md exists on disk and is non-empty
- **Default severity:** p2
- **Stale signal:** SKILL.md links to `references/foo.md` that was deleted or renamed

### task-dispatch-wiring

- **Check:** if skill dispatches Task invocations, they use fully-qualified names (`<namespace>:<category>:<agent>`)
- **Default severity:** p1 (coexistence collision risk)
- **Stale signal:** bare Task names (no namespace prefix) — liable to re-prefix wrong

## Output shape

```yaml
- check: <name>
  status: pass | warn | fail
  content_status: missing | present-but-stale | present-and-populated | healthy
  severity: p1 | p2 | p3
  evidence: "<observation>"
  recommendation: "<action>"
```

## See also

- Agent: `../../../agents/analysis/harness-auditor.md` (`layer: 2`)
- Budget script: `../scripts/budget-check.sh`
- Skill-quality rubric: `../assets/starter-rubrics/skill-quality.md`
- Consistency check: `review-criteria-consistency.md`
