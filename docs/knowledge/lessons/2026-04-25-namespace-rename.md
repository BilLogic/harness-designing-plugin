---
title: "Namespace alignment: the shipping artifact name wins when slugs diverge"
date: 2026-04-25
memory_type: episodic
importance: 4
tags: [naming, refactor, rename, coexistence, breaking-change]

applies_to_layers: [l3]
related_rules: [R_2026_04_25_namespace_alignment]
related_lessons:
  - 2026-04-21-sed-vocabulary-rename-mishap
decision_summary: "When product slug, repo URL, marketplace listing, and Task namespace disagree, align code on the most-public name (here: marketplace + GitHub slug). One-time pain compounds zero; alternatives (keep both / migrate later / third name) compound."
result_summary: "Phase 3v executed 2026-04-25: 31 live files migrated design-harnessing → harness-designing (73 → 0 occurrences old; 84 occurrences new). Historical plans, lessons, reviews, CHANGELOG entries preserved verbatim. Plug-in slug `design-harness` (different concern) untouched."
next_watch: "Any future name disagreement (skill prefix vs marketplace listing, rule_id naming vs file slug) — apply the same shipping-artifact-wins principle."
rule_candidate: false
rule_ref: R_2026_04_25_namespace_alignment  # graduated 2026-04-25 same day (1st confirmation; rule promoted on the basis that ideation parked since 2026-04-18 + 2 days of audit hits made the trigger explicit + execution was mechanical)
supersedes: null
superseded_by: null
---

# Lesson

## Context

Three related names had drifted across the plug-in by 2026-04-25:

- **Plug-in slug** in `plugin.json`: `design-harness` (a noun phrase)
- **Task namespace** in agent specs + skill dispatches: `design-harnessing:<cat>:<name>` (gerund)
- **Marketplace + GitHub slug**: `harness-designing-plugin` (gerund, swapped)

The three coexisted for ~7 days. Audit reports surfaced the inconsistency at every L3 review. Ideation entry parked 2026-04-18 noted the question; deferred to "Phase 3k+" without a hard trigger gate.

The cost of doing nothing: every audit re-flags the inconsistency; every new contributor has to learn three names; cross-references in lessons/plans accumulate the drift.

## Decision

**Align Task namespace on the marketplace slug.** When code, docs, and shipping artifacts diverge, the most-public name (the one users see) wins. Code can be sed-migrated; marketplace listings and GitHub URLs cannot easily be renamed without breaking external links.

Targeted scope of change:
- Replace `design-harnessing:` → `harness-designing:` (Task namespace prefix) globally in live files
- Replace `design-harnessing` (prose mentions) → `harness-designing`
- Preserve verbatim: `docs/plans/*`, `docs/knowledge/lessons/*` (other than this file), `docs/knowledge/reviews/*`, CHANGELOG.md historical entries (history is sacred per AGENTS.md repo-level contributor rules)
- Untouched: `design-harness` (no -ing) plug-in slug — different identifier; renaming would break installation paths

## Result

Phase 3v executed via single sed pass across 31 live files. Verification: pre-rename `grep -c 'design-harnessing'` totaled 73 occurrences across target files; post-rename 0 occurrences in those files; new `harness-designing` references 84 (the +11 reflects shorter form coverage where the rename collapsed multiple match contexts). Historical files preserved: `CHANGELOG.md` retains 7 occurrences in `[1.x.x]` historical sections (correct); `docs/plans/`, `docs/knowledge/lessons/`, `docs/knowledge/reviews/` retain their original references.

`AGENTS.md` updated: `## Coexistence with other plug-ins`, `## Repo-level contributor rules`, harness-map L3 row, all reference `harness-designing:<cat>:<name>` consistently. Rule `R_2026_04_25_namespace_alignment` graduated same day on the basis: ideation parked 7 days, 2 days of audit hits had cited the inconsistency, execution was mechanical, principle generalizes (next time another name drifts, apply this).

## Why graduate on 1 confirmation

Standard graduation threshold is 2 confirmations. Exceptions allowed when:
1. The decision pattern is general (not specific to this artifact)
2. The execution mechanics are mechanical (no judgment calls)
3. The cost of NOT codifying is repeated audit drift

All three apply here. Sister rule `R_2026_04_21_advisor` also graduated on 1 confirmation on 2026-04-21 (same fast-track basis).

## Prevention pattern going forward

Before introducing a new name (skill prefix, rule_id namespace, agent category, file slug), ask:
- Does this name exist elsewhere already?
- If yes, are they meant to be the same identifier or different concerns?
- If they're meant to be the same, align them now (don't ship the divergence)
- If they're different concerns, document the distinction in AGENTS.md so future readers don't conflate them

## Next

- Watch for the inverse temptation: introducing a fourth name to "abstract" the existing three. Don't. Pick one and propagate.
- If a future contributor proposes splitting the namespace again ("let's have `harness-designing:scaffold:*` and `harness-designing:review:*` use different prefixes"), cite this lesson + the parked ideation about why we resisted that pattern.
