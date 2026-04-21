---
memory_type: temporal
domain: changelog
split_threshold: 50
---
<!-- Tier: 3 (harness changelog — audit trail for structural + rule-adoption events) -->
# Changelog

Harness-structural changes and rule-adoption events over time. Loaded infrequently; exists so `/hd:review audit` can trace when structural decisions were made.

NOT a changelog for the plug-in's shipped features — that's `CHANGELOG.md` at repo root. This file is specifically for changes to the HARNESS structure of THIS plug-in's meta-harness (`docs/`), plus the rule-adoption meta-log (which lessons were promoted into AGENTS.md rules, and when).

## Format

```markdown
## YYYY-MM-DD — <short-change-title>

**Changed:** <what part of the harness changed>
**Before:** <what it was>
**After:** <what it is now>
**Why:** <brief rationale>
**Source:** <link to lesson or plan, if applicable>
```

## Entries

<!-- Add new entries above this line, most recent first. -->

## 2026-04-21 — Phase 3n + 3 rule adoptions + rubric policy

**Changed:** Three rules adopted into `AGENTS.md § Rules` + 3-of-14 rubric-adoption policy for `docs/rubrics/` + Phase 3n external-source fill-path + advisor-not-installer principle codified.

**Rules adopted today:**
1. "Spec review and dry runs won't find what live testing does" — 4 confirmations (pilot matrix, sds re-pilot, 3k-3m, 3n).
2. "The plug-in is an advisor, not an installer."
3. "`docs/rubrics/` adopts 3 of 14 starters; 10 visual rubrics waived, component-budget duplicative, i18n-cjk deferred."

**Before:** 3 rules in `AGENTS.md § Rules` (2026-04-16 no-stubs, 2026-04-18 additive-only, 2026-04-20 review-default) but zero entries in this changelog despite self-declaration as the rule-adoption meta-log. Only `skill-quality.md` promoted into `docs/rubrics/`; no waiver documentation.

**After:** 6 rules total (3 new above + 3 prior). `docs/rubrics/` has 3 adopted rubrics + explicit waivers dated in rules. Changelog backfilled with prior rule adoptions (see entries below).

**Why:** 2026-04-21 harness review flagged the self-declared meta-log running empty despite 3 rule adoptions. Backfilled now + wired new adoptions into the same channel going forward.

**Source:** [docs/knowledge/reviews/2026-04-21-harness-review.md](reviews/2026-04-21-harness-review.md) + [docs/knowledge/lessons/2026-04-21-external-source-fill-path.md](lessons/2026-04-21-external-source-fill-path.md)

## 2026-04-20 — Rule adoption: `/hd:setup` review-default for existing harness

**Changed:** New rule in `AGENTS.md § Rules` governing `/hd:setup` default behavior when existing harness detected.
**Before:** 2026-04-18 additive-only rule defaulted to skip L1/L2/L3 when a foreign harness was present.
**After:** Review L1/L2/L3 (read-only) + scaffold L4/L5. Skip felt too blunt; review surfaces improvement suggestions.
**Why:** Live testing across 5 Codex repos (3l.4) surfaced that skip defaults frustrated users who came for suggestions.
**Source:** [docs/plans/2026-04-20-001-fix-phase-3l-review-unification-host-agnostic-plan.md](../plans/2026-04-20-001-fix-phase-3l-review-unification-host-agnostic-plan.md) (3l.4 revision) + [lessons/2026-04-18-parallel-pilots-3-6-consolidated.md](lessons/2026-04-18-parallel-pilots-3-6-consolidated.md)

## 2026-04-18 — Rule adoption: additive-only discipline + Phase 3e–3j shipped

**Changed:** New rule in `AGENTS.md § Rules` requiring `/hd:setup` to be additive-only when existing harness detected.
**Before:** No rule; `/hd:setup` could in principle modify existing user harness artifacts.
**After:** Never modify `CLAUDE.md`, `AGENTS.md`, `.agent/`, `.claude/`, `docs/context/`, `docs/knowledge/`, `docs/rubrics/`, or other-tool harness artifacts. New files only.
**Why:** 6-repo pilot matrix confirmed users expect their existing harness to be authority; modification = trust loss.
**Source:** [lessons/2026-04-18-parallel-pilots-3-6-consolidated.md](lessons/2026-04-18-parallel-pilots-3-6-consolidated.md) (6 confirmations)

## 2026-04-16 — Rule adoption: no future-version stubs

**Changed:** New rule in `AGENTS.md § Rules` banning future-version skill stubs with `disable-model-invocation: true`.
**Before:** Ambiguous — could ship stub skills with fake trigger text and disabled flag to "reserve" future names.
**After:** Don't ship future-version skill stubs at all. Author the skill when actually building it.
**Why:** Stub + disabled flag makes the skill surface actively worse than no skill at all (fake triggers pollute the skill-selection surface).
**Source:** [lessons/2026-04-16-no-future-version-stubs.md](lessons/2026-04-16-no-future-version-stubs.md)

## 2026-04-18 — Phase 3e–3j shipped

**Changed:** skill + agent + rubric roster reached v1.0.0 shape
**Before:** pre-3e hd-onboard / hd-compound naming; 3 agents; 3 rubrics
**After:** hd-learn / hd-maintain rename; 9 agents across 3 categories; 14 starter rubrics; 4 scripts
**Why:** verb-intent naming (learn/setup/maintain/review) aligns with memory-operation taxonomy; agent expansion supports 5-way parallel layer audit
**Source:** canonical record is repo-root [CHANGELOG.md](../../CHANGELOG.md) (Phases 3e–3j); pilot validation in [lessons/2026-04-18-parallel-pilots-3-6-consolidated.md](lessons/2026-04-18-parallel-pilots-3-6-consolidated.md)
