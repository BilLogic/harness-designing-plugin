---
title: Rubric authoring guide
loaded_by: hd-review
---

# Rubric authoring guide

A rubric with criteria but no scope is a ruleset floating in a vacuum. Applied mechanically to the wrong target it produces false positives; applied cautiously it's just a checklist. The **Scope & Grounding** block anchors each rubric to the humans it serves, the situations it fits, and the failure modes it's designed to catch — so both the reader and the `rubric-applier` agent know when a criterion applies and when it should defer.

## Two layers per rubric

Every rubric splits content into two layers with distinct roles:

- **Frontmatter (YAML) — normative.** Criteria with `id`, `severity`, and an imperative `check` string. Machine-queryable; immune to prose refactors. The `rubric-applier` agent reads these deterministically — no markdown-table parsing.
- **Body (prose) — descriptive.** Scope & Grounding, section rationale, pass/fail examples. Human-authored narrative; layout can change freely without affecting audits.

The schema for the YAML layer is locked at [rubric-yaml-schema.md](rubric-yaml-schema.md); read it before authoring. The body conventions are this guide's domain.

`skill-quality.md` is the Phase 3q reference implementation of this two-layer pattern. Phase 3r will migrate `ux-writing.md` + `heuristic-evaluation.md` once the pattern proves out; until then, those two rubrics use legacy markdown-table criteria and `rubric-applier` handles both shapes.

## The 4-block schema

Every starter rubric in `skills/hd-review/assets/starter-rubrics/` ships with four sub-sections under `## Scope & Grounding`.

**Personas.** 2–4 users whose work or experience the rubric protects. Each has a one-sentence role description and one explicit pain point the rubric addresses. Personas anchor the "who is this for" question so a reader can tell at a glance whether their target matches. Do not invent speculative personas — each should be traceable to the rubric's source material or to a pilot / lesson in `docs/knowledge/`. If the source is thin, ship fewer sharper personas.

**User stories.** 3–5 stories in the shape "As a `<persona>`, I need `<behavior>` so that `<outcome>`." Each story maps at least one persona to at least one criterion below. Stories are the semantic bridge between "who this is for" and "what it checks". A criterion with no corresponding user story is a smell — either the criterion is gold-plating, or a persona is missing.

**Realistic scenarios.** 3–5 grounded situations where the rubric applies. Each names a real surface (a card, a form, a dashboard) and a one-sentence "why it matters" tying it to source material. Scenarios teach by example and give the `rubric-applier` positive anchors for severity calibration. A scenario that matches any well-built product is too generic — ground it in a specific pattern (Material 3 state pattern, impeccable line-length rule, lightning-pilot telemetry shape).

**Anti-scenarios.** 3–5 failure modes — the exact shapes the rubric's concern takes when it goes wrong. Each has a symptom the reader / agent can pattern-match against a review target. Anti-scenarios are the highest-signal block because they're what review actually finds. Prefer observable symptoms ("page visibly jumps", "halfwidth comma inside zh string") over abstract descriptions ("bad UX").

## Worked example: `typography.md`

The typography rubric's Scope & Grounding names four personas — long-form reader, scanning user, screen-reader user, data viewer — and none is interchangeable. The long-form reader anchors the line-height + line-length criteria (Butterick). The scanning user anchors weight-contrast-sufficient. The screen-reader user anchors heading-hierarchy-semantic (h1 > h2 > h3). The data viewer anchors opentype-features-used (tabular numerals). Swap out "data viewer" for "marketing-page visitor" and tabular numerals stops mattering.

The scenarios are similarly non-interchangeable: "article body at 65ch / line-height 1.5" anchors line-length-readable + line-height-semantic; "data table with `font-feature-settings: 'tnum'`" anchors OpenType. The anti-scenarios ("heading skips for styling", "weight ladder 400/450/500") are the patterns the `rubric-applier` searches for first because they're the shapes real violations take.

## How `rubric-applier` consumes this

The `rubric-applier` agent (authored in Phase 3i.4) reads Scope & Grounding **before** applying the criteria block. When a review target clearly matches a persona + scenario, it applies criteria at default severity. When the target doesn't match any persona or scenario, it raises `severity_rationale: persona-scope-mismatch` and either downgrades severity or skips the criterion — instead of forcing an English-centric typography rule onto a Chinese-primary UI, or a long-form-reader rule onto a data-dense admin panel. Anti-scenarios drive the agent's pattern-matching pass: it scans the target for the listed symptoms first, then walks the criteria.

## Authoring checklist for your own rubrics

- [ ] Frontmatter conforms to [rubric-yaml-schema.md](rubric-yaml-schema.md): `rubric`, `name`, `applies_to[]`, `version: 1`, `severity_defaults`, `source[]`, `sections`
- [ ] Each `sections.<slug>` declares `order`, `title`, and `criteria[]`; criterion ids are kebab-case and unique within their section
- [ ] Each criterion's `check` is an imperative one-liner (reads as "Subject verb object.")
- [ ] 2–4 personas in body; each has a one-sentence role + one pain point
- [ ] 3–5 user stories in "As a `<persona>`, I need `<behavior>` so that `<outcome>`" shape; each maps to ≥1 criterion in the YAML
- [ ] 3–5 realistic scenarios — grounded in sources you can cite (impeccable, Material 3, Nielsen, team pilots, etc.)
- [ ] 3–5 anti-scenarios — the failure modes the rubric is designed to catch, each with an observable symptom
- [ ] Source citation in `source:` field
- [ ] Section bodies hold rationale + pass/fail examples ONLY — no criterion tables (criteria live in the YAML; do not duplicate)
- [ ] If source material is thin, prefer fewer sharper entries over padding — 2 well-grounded personas beats 4 speculative ones

## Coexistence

Starter rubrics live in `skills/hd-review/assets/starter-rubrics/` and ship read-only inside the plug-in. Rubrics you author or extend live in `docs/rubrics/<name>.md` in your own repo. When you customize a starter, keep the `source:` frontmatter pointing at the original and append your team's citation (e.g., `source: starter-typography + <team>-customizations`). Never edit the plug-in's starter files directly — those ship to every consumer of the plug-in.

## Starter template

For authoring a fresh rubric, copy [`../assets/starter-rubrics/rubric-template.md`](../assets/starter-rubrics/rubric-template.md) into `docs/rubrics/<name>.md` and fill the `{{PLACEHOLDER}}` fields. Template ships the full 4-block Scope & Grounding skeleton, criteria shape, and coexistence notes — lower friction than copying an existing starter as implicit template.

## See also

- [rubric-yaml-schema.md](rubric-yaml-schema.md) — YAML frontmatter schema (Phase 3q)
- [rubric-application.md](rubric-application.md) — how the `rubric-applier` agent walks criteria (handles both YAML and legacy shapes)
- [targeted-review-format.md](targeted-review-format.md) — output shape for rubric-backed critiques
- [review-criteria-l4-rubrics.md](review-criteria-l4-rubrics.md) — rubrics are Layer 4; audit treats them as first-class artifacts
- [`../assets/starter-rubrics/rubric-template.md`](../assets/starter-rubrics/rubric-template.md) — explicit starter template with `{{placeholders}}` using the YAML schema
- [`../assets/starter-rubrics/skill-quality.md`](../assets/starter-rubrics/skill-quality.md) — Phase 3q reference implementation
