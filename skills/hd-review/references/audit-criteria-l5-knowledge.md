---
title: Audit criteria — Layer 5 (Knowledge)
loaded_by: hd-review audit mode (via harness-auditor agent with layer: 5)
---

# Audit criteria: Layer 5 — Knowledge Compounding

## Purpose

Criteria for the Knowledge layer: `docs/knowledge/` structure, lesson hygiene, rule-adoption cadence, and drought detection. Loaded by `harness-auditor` with `layer: 5`.

**Grading.** 4-level `content_status`: `missing` · `present-but-stale` · `present-and-populated` · `healthy`.

**No `INDEX.md` checked.** Per 3k.13, AGENTS.md Harness map lists the L5 files.

## Criteria

### knowledge-folder-present

- **Check:** `docs/knowledge/` exists with the canonical file set
- **Default severity:** p2
- **Canonical files:** `changelog.md`, `decisions.md`, `ideations.md`, `preferences.md`, `lessons/` directory
- **Content checks:** each file non-empty OR scaffolded with meaningful headers (not just `# TODO`)

### lessons-directory-active

- **Check:** `docs/knowledge/lessons/` exists and has ≥1 dated lesson
- **Default severity:** p2
- **Stale signal:** folder exists but empty after 30 days of harness use

### lesson-time-spread

- **Check:** lessons spread across time, not front-loaded
- **Default severity:** p2
- **Stale signal:** all lessons dated within a single week (burst capture, no ongoing discipline)

### lesson-hygiene

- **Check:** every lesson follows `YYYY-MM-DD-slug.md` naming + has valid frontmatter (date, tags)
- **Default severity:** p2
- **Content checks:**
  - Filename matches pattern
  - Frontmatter parses
  - ≥1 tag present
  - Body has ≥3 lines of real content (not just frontmatter)

### changelog-populated

- **Check:** `changelog.md` records structural events and rule adoptions
- **Default severity:** p2
- **Content checks:**
  - File has ≥1 dated entry
  - No `{{PLACEHOLDER}}` residue
  - Entries have dates in `YYYY-MM-DD` format

### rule-adoption-cadence

- **Check:** ~1 rule adoption per 10 lessons is healthy
- **Default severity:** p2
- **Pass example:** 23 lessons, 2–3 rules adopted in `AGENTS.md` with source-lesson citations
- **Stale signal:** 40+ lessons, 0 rule adoptions

### rule-adoption-drought

- **Check:** ≥10 lessons with same tag + 0 rule adoptions → drought
- **Default severity:** p2
- **Content check:** cluster lessons by tag; any cluster ≥10 with no corresponding rule in AGENTS.md is a drought signal

### rule-candidate-backlog

- **Check:** lessons with `rule_candidate: yes` are tracked and processed
- **Default severity:** p2
- **Stale signal:** 12+ candidates flagged over 6 months, none processed via `/hd:maintain rule-propose`

### knowledge-mapped-in-agents-md

- **Check:** AGENTS.md Harness map L5 section lists the knowledge files + lessons/ folder
- **Default severity:** p2
- **Stale signal:** AGENTS.md doesn't reflect the L5 file set on disk

### decisions-and-ideations-captured

- **Check:** `decisions.md` + `ideations.md` + `preferences.md` have real content (not just scaffolded placeholders)
- **Default severity:** p3
- **Content checks:**
  - Each has ≥1 non-placeholder entry
  - No `{{TEMPLATE}}` residue

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

- Agent: `../../../agents/analysis/harness-auditor.md` (`layer: 5`)
- Drift heuristics: `drift-detection.md`
- Lesson patterns: `../../hd-maintain/references/lesson-patterns.md`
