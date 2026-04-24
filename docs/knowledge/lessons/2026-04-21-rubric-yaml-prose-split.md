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

`docs/rubrics/skill-quality.md` is our most machine-consumed rubric — `review:skill-quality-auditor` reads it to audit every SKILL.md in the plug-in (4 skills today, more downstream). The rubric pre-3q mixed two layers in a single document:

- **Structured data** — 9 sections × ~4 criteria each (35-37 total), each criterion being `{name, severity}`. Identical shape every time. Machine-readable.
- **Prose** — section rationale, pass/fail examples, scope grounding. Human-authored narrative.

The auditor parsed criteria via markdown-table regex anchored to section headings. Two failure modes were observable today:

1. **Prose refactor moves tables.** A well-meaning edit (e.g., reordering a paragraph) can push the table past the regex anchor. Audit silently runs against fewer criteria.
2. **Sed-style bulk edit.** The 3l.7 vocab-unification sed pass mangled 16 tokens inside `skill-quality.md` table cells without disturbing the audit's regex anchors. The audit ran clean while the rubric was semantically corrupted. Caught only by the 2026-04-21 dogfood (see `2026-04-21-sed-vocabulary-rename-mishap.md`).

Neither failure was prevented by any structural guarantee. The auditor was structurally fragile to its own rubric's prose layout.

## Decision / Observation

**Pattern:** split machine-consumed rubrics into two layers with distinct roles.

- **Frontmatter (YAML) — normative.** All criteria as `{id, severity, check}` records inside `sections.<slug>.criteria[]`. Machine-queryable; immune to prose refactors. Agents iterate the structured records deterministically — no markdown-table parsing.
- **Body (prose) — descriptive.** Scope & Grounding, section rationale, pass/fail examples. Human-authored narrative; layout can change freely without affecting audits.

The pattern is not new — it's the same DESIGN.md discipline (YAML normative, prose descriptive) we observed earlier today and found compelling. What's new is *applying it to our own agent-authored, agent-consumed artifacts*.

### Why this matters specifically for skill-quality.md

- It's the most-consumed rubric (the only one with a dedicated agent — `skill-quality-auditor`).
- It's the rubric that already bit us once (the 3l.7 sed incident).
- Migrating it first concentrates the payoff while keeping scope tight (one rubric + one agent + the template + applier backward-compat).

`ux-writing` and `heuristic-evaluation` are consumed by the generic `rubric-applier`; migrating them in Phase 3r is mechanical once the pattern proves out.

### What this principle does NOT say

- Don't put rationale in YAML. Rationale is descriptive, not structured — it belongs in prose.
- Don't migrate every rubric immediately. The 11 unadopted starter rubrics ship as reference material; they migrate when adopted.
- Don't formalize the schema with a CLI validator yet. Phase 3q keeps the YAML shape loose; Phase 3r formalizes if the pattern holds.

What it DOES say: when an artifact is *both* machine-consumed *and* prose-bearing, split the layers structurally. Agents read the structured layer; humans read the prose; neither has a hidden dependency on the other's layout.

## Result

Phase 3q shipped 6 units embodying the discipline:

- **3q.1** — `skills/hd-review/references/rubric-yaml-schema.md` documents the YAML schema (`version: 1`, additive bumps).
- **3q.2** — `skill-quality.md` migrated in both copies (`docs/rubrics/` + `skills/hd-review/assets/starter-rubrics/`). 37 criteria in YAML frontmatter; section rationale + pass/fail examples in prose body. Severity counts preserved exactly (10 p1, 24 p2, 3 p3).
- **3q.3** — `skill-quality-auditor` rewritten to read `sections.*.criteria[]` deterministically; legacy markdown-table parsing removed (clean cut — auditor only consumes skill-quality.md, which IS migrated).
- **3q.4** — `rubric-template.md` and `rubric-authoring-guide.md` updated; future authors ship in the YAML-criteria shape by default.
- **3q.5** — `rubric-applier` handles both shapes (YAML-criteria for skill-quality; legacy prose-table for ux-writing + heuristic-evaluation until Phase 3r). Emits `schema_version: 1` or `schema_version: legacy` in output so callers can distinguish.
- **3q.6** — this lesson.

Auditor parse logic became deterministic; criterion diffs now show up cleanly in git; cross-rubric aggregation via grep on `severity: p1` is reliable.

## Graduation-readiness

**Candidate rule:** *"When an artifact is both machine-consumed (by an agent) and prose-bearing (by a human), split the layers structurally — normative data in YAML frontmatter, descriptive narrative in body. Agents query frontmatter deterministically; humans read body for the rationale; neither couples to the other's layout."*

**Strength of evidence so far:**
1. Phase 3q skill-quality.md migration — concrete payoff visible (auditor simplified, parse fragility removed, 3l.7-style sed incident now structurally prevented).

This lesson is the 1st standalone confirmation. Adjacent confirmations exist but aren't identical:
- `R_2026_04_21_detection_enumeration` (graduated 2026-04-21) is about detection scaling — same anti-pattern shape (linear ecosystem coupling), but different artifact type.
- DESIGN.md discipline observation (also 2026-04-21) inspired the pattern but isn't a confirmation of our applying it.

**Graduation threshold:** second confirmation — i.e., Phase 3r migrates `ux-writing.md` + `heuristic-evaluation.md` cleanly using the same pattern, and the migration costs stay low while the auditor / applier code stays simple. At that point promote to `AGENTS.md § Rules` with both lessons cited.

## Prevention pattern going forward

Before authoring a new rubric or other agent-consumed artifact, ask:

- *Does an agent parse this artifact for structured records?*
- *Will those records be touched by humans through prose edits?*
- *Is the parse anchored to layout (regex on tables, line numbers, etc.)?*

If yes to all three, split layers structurally. Otherwise, plain prose is fine.

When migrating an existing artifact, the verification bar is:
- Pre/post criterion counts match exactly per severity (no silent loss)
- Agent findings against a known target match pre/post (no parse drift)
- Both copies (where the artifact has dogfood + starter copies) stay diff-clean

## Next

- Phase 3r: migrate `ux-writing.md` + `heuristic-evaluation.md`. If the pattern holds (mechanical migration, simpler applier code), graduate the candidate rule.
- Watch for prose-vs-data tension in other artifacts: `audit-report.md.template`, finding schemas in agent specs, lesson templates. The split may apply.
- If a downstream user customizes `skill-quality.md` and accidentally drifts the YAML and prose out of sync (e.g., adds a criterion to YAML but forgets the rationale paragraph), surface that as an audit finding under L4 review-criteria.
