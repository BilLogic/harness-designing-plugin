---
title: "Split machine-consumed rubrics into normative YAML criteria + descriptive prose body"
date: 2026-04-21
memory_type: episodic
importance: 4
tags: [architecture, rubrics, schema, agent-authored-agent-consumed, rule-candidate]

# Machine-extractable — for agent cross-reference (3p.3 schema)
applies_to_layers: [l4]
related_rules: [R_2026_04_21_detection_enumeration]
related_lessons:
  - 2026-04-21-sed-vocabulary-rename-mishap
  - 2026-04-21-detect-inspect-integrate
decision_summary: "Rubric criteria belong in YAML frontmatter (machine-queryable, refactor-immune); rationale + pass/fail examples belong in prose body. Agents query frontmatter deterministically; humans read body for the why; neither couples to the other's layout."
result_summary: "Phase 3q ships skill-quality.md as the reference implementation. skill-quality-auditor reads sections.*.criteria[] from YAML; rubric-applier handles both YAML and legacy prose-table shapes during the 3q→3r transition."
next_watch: "Phase 3r migration of ux-writing.md + heuristic-evaluation.md is the second confirmation. If propagation is mechanical and the auditor parse logic stays simple, graduate the candidate rule to AGENTS.md § Rules."
rule_candidate: true
rule_ref: null
supersedes: null
superseded_by: null
---

# Lesson

## Context

`skill-quality.md` is our most machine-consumed rubric. The auditor parsed criteria via markdown-table regex anchored to section headings — structurally fragile. The 3l.7 vocab-unification sed pass mangled 16 tokens inside table cells without disturbing the regex anchors; the audit ran clean while the rubric was semantically corrupted (caught only by 2026-04-21 dogfood; see `2026-04-21-sed-vocabulary-rename-mishap.md`).

## Decision

Split machine-consumed rubrics into two layers:

- **Frontmatter (YAML) — normative.** All criteria as `{id, severity, check}` records inside `sections.<slug>.criteria[]`. Agents iterate deterministically.
- **Body (prose) — descriptive.** Scope & Grounding, rationale, pass/fail examples. Layout can change freely without affecting audits.

Same DESIGN.md discipline (YAML normative, prose descriptive) we observed earlier the same day, applied to our own agent-authored, agent-consumed artifacts.

## Result

Phase 3q migrated `skill-quality.md` (both copies); rewrote `skill-quality-auditor` to read YAML deterministically; updated `rubric-applier` for dual-shape backward compat (1 vs legacy); shipped `rubric-yaml-schema.md` + updated template + authoring guide. Auditor parse logic became deterministic; the 3l.7-style sed incident is now structurally prevented; criterion diffs show up cleanly in git.

## Graduation-readiness

**Candidate rule:** *"When an artifact is both machine-consumed (by an agent) and prose-bearing (by a human), split layers structurally — normative data in YAML frontmatter, descriptive narrative in body. Agents query frontmatter deterministically; humans read body; neither couples to the other's layout."*

1st standalone confirmation. **Threshold:** 2nd confirmation = Phase 3r migrating `ux-writing.md` + `heuristic-evaluation.md` cleanly using the same pattern. At that point promote to `AGENTS.md § Rules`.

## Prevention going forward

Before authoring a new agent-consumed artifact: does an agent parse it for structured records? Will humans edit prose around those records? Is the parse anchored to layout? If yes to all three, split layers.
