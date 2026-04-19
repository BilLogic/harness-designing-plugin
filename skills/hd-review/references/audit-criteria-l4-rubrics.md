---
title: Audit criteria — Layer 4 (Rubrics)
loaded_by: hd-review audit mode (via harness-auditor agent with layer: 4)
---

# Audit criteria: Layer 4 — Rubric Setting

## Purpose

Criteria for the Rubrics layer: `docs/rubrics/` flat structure, AGENTS.md Harness map inclusion, scope-and-grounding completeness, and usage. Loaded by `harness-auditor` with `layer: 4`.

**Grading.** 4-level `content_status`: `missing` · `present-but-stale` · `present-and-populated` · `healthy`.

**No `INDEX.md` checked.** Per 3k.13, AGENTS.md is the sole master index. Rubrics listed there.

## Criteria

### rubrics-folder-present

- **Check:** `docs/rubrics/` exists and contains ≥1 `.md` file
- **Default severity:** p2
- **Stale signal:** folder exists but empty

### rubrics-mapped-in-agents-md

- **Check:** `AGENTS.md` Harness map L4 section lists every rubric file with a one-line purpose
- **Default severity:** p2
- **Content checks:**
  - Every file in `docs/rubrics/*.md` appears as a bullet in AGENTS.md
  - No bullet references a file that doesn't exist (orphan pointer)

### scope-and-grounding-complete

- **Check:** each rubric has `## Scope & Grounding` section with all 4 sub-sections: personas, user stories, realistic scenarios, anti-scenarios
- **Default severity:** p2
- **Content checks:**
  - Section exists
  - All 4 sub-sections present, each with ≥1 concrete entry
  - No template placeholder residue

### starter-coverage

- **Check:** team has adopted or intentionally deferred each of the 14 starter rubrics
- **Default severity:** p2
- **Pass signal:** team's rubrics cover the critical starters (a11y, design-system, skill-quality) OR has a note in AGENTS.md explaining deferrals

### managed-ds-prefill

- **Check:** if repo uses a managed design system (antd, chakra, mui, mantine), DS-derived rubrics are pre-filled
- **Default severity:** p2
- **Stale signal:** `{{TOKEN_NAME}}` placeholders still present after 30 days

### criteria-are-measurable

- **Check:** each rubric's criteria are measurable (pass/fail bar, not vague "good" / "bad")
- **Default severity:** p2
- **Content checks:**
  - Every criterion has a clear trigger condition
  - No criterion uses only subjective language without examples
- **Stale signal:** rubric lists "use good typography" with no definition of "good"

### rubric-derived-rule-in-agents

- **Check:** `AGENTS.md` Rules section contains ≥1 rubric-derived rule
- **Default severity:** p2
- **Pass example:** "All UI PRs pass `a11y-wcag-aa.md` before merge" cites the rubric

### rubrics-actually-applied

- **Check:** rubrics defined are invoked (via `/hd:review critique`, PR templates, CI)
- **Default severity:** p3
- **Stale signal:** rubric exists >30 days, zero invocations in git log / CI logs

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

- Agent: `../../../agents/analysis/harness-auditor.md` (`layer: 4`)
- Starter rubrics: `../assets/starter-rubrics/`
- Authoring guide: `rubric-authoring-guide.md`
