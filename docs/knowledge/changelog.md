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

## 2026-04-25 — AGENTS.md distillation + Agent role section + inconsistency sweep

**Changed:** AGENTS.md § Rules + new § Agent role + § Repo-level contributor rules consolidation; cross-doc cleanup of phantom paths and stale counts.

**Before:** § Rules carried 10 timestamped `R_2026_*` entries with multi-paragraph adoption stories — heavy phase archeology (3w/3y/3l/etc.) for readers who only need active rules. AGENTS.md had no statement of agent role/voice/boundaries. Several internal inconsistencies: phantom `docs/design-solutions/` directory referenced 3x (never existed); phantom `templates/` directory in semantic-split vocabulary; "AGENTS.md is the master index per 3k.13" leaked phase reference; "§ Rules" pointer stale after rename; `hd-review/SKILL.md:179` said "14 shipped rubrics"; `agent-persona.md:38` referenced `skills/hd-setup/templates/` (same phantom-path bug class).

**After:** AGENTS.md gains § Agent role (responsibilities, voice, boundaries) right after the intro. § Rules → § Operating rules: 11 plain-language bullets, each parenthetically tagged with its `R_2026_*` ID for traceability back to changelog + lessons. Repo-level contributor rules slimmed to file-naming conventions only (overlapping namespace + docs/solutions rules absorbed into Operating rules). Phantom-path drift eliminated (AGENTS.md + agent-persona.md). `hd-review/SKILL.md:179` count corrected to "17 shipped rubrics + 1 template". `docs/rubrics/INDEX.md` § Adopted rubrics expanded from 3 to 6 entries (catches up with 2026-04-24 Phase 3s adoptions).

**Why:** Operating rules surface should be readable in one screen and oriented around active behavior, not adoption history. Source linkage preserved via `R_*` IDs and changelog/lessons backlink. Phantom-path drift was the same bug class twice — sweep both files together to close it. Stale counts in two places (SKILL.md + INDEX.md) were independent drifts caught only by post-distillation review.

**Source:** Commits `3e8d43ce` (distill operating rules), `7efd8c17` (fix internal inconsistencies), and post-distillation `/hd:review full` report at [`reviews/2026-04-25-harness-review-post-distillation.md`](reviews/2026-04-25-harness-review-post-distillation.md).

## 2026-04-24 — Phase 3s rubric adoptions (plan-quality + lesson-quality + agent-spec-quality)

**Changed:** `docs/rubrics/` adopted set grew from 3 to 6.

**Before:** 3 rubrics adopted to plug-in's own dogfood (`skill-quality`, `ux-writing`, `heuristic-evaluation`). 14 starter rubrics waived or untouched.

**After:** 3 additional rubrics adopted, each scoped to a distinct meta-harness artifact class:
- `plan-quality` — applied to `docs/plans/*.md` (the 21 plan files driving each phase)
- `lesson-quality` — applied to `docs/knowledge/lessons/*.md` (the 22 dated lesson files)
- `agent-spec-quality` — applied to `agents/*/*.md` (the 10 sub-agent specs)

These are the three artifact classes that already exist in the meta-harness with enough volume + variation to warrant a rubric. Visual/UI starters remain waived (no runtime UI in this repo). `R_2026_04_21_rubric_policy` updated from "3 of 17" to "6 of 17".

**Why:** Phase 3s gap-finding identified that the meta-harness was producing plans, lessons, and agent specs without consistent quality bars. Adopting starters here catches drift before it propagates to user-repo scaffolding via `/hd:setup`.

**Source:** Phase 3s plan + 2026-04-21 L4 audit ([`reviews/2026-04-21-harness-review.md`](reviews/2026-04-21-harness-review.md)). Backfilled 2026-04-25 during post-distillation review — the original adoption was not logged in this changelog at the time.

## 2026-04-25 — Phase 3v + 3w + 2 rule adoptions (namespace alignment + schema SSOT)

**Changed:** L3 namespace + L1 schema-SSOT mechanism + AGENTS.md § Rules

**Before:** Three names coexisted: plug-in slug `design-harness`, Task namespace `design-harnessing:`, marketplace/GitHub slug `harness-designing`. Schema for hd-config.md encoded in 3 places (detect.py emitting v5; hd-config-schema.md saying v3; template saying v5) — drift caught by 2026-04-21 audit.

**After:** Task namespace + prose mentions aligned on `harness-designing:` (matches marketplace + GitHub slug). 31 live files migrated; 73 → 0 occurrences of old; 84 of new. Plug-in slug `design-harness` untouched (different identifier). Schema authoritative in `skills/hd-setup/scripts/schema.json`; detect.py imports `SCHEMA_VERSION` at module init with graceful fallback; hd-config-schema.md gains "if drift, schema.json wins" pointer; stale v3 reference corrected to v5.

**Why:** Both decisions came from "deferred until trigger" ideations that had accumulated audit drift weight; both executions were mechanical; both patterns generalize. Two rules graduated same day: `R_2026_04_25_namespace_alignment` (shipping artifact name wins) + `R_2026_04_25_schema_ssot` (designate one authoritative encoding). Both 1st-confirmation graduations on the fast-track basis (general pattern + mechanical execution + cost-of-not-codifying).

**Source:** [`docs/knowledge/lessons/2026-04-25-namespace-rename.md`](lessons/2026-04-25-namespace-rename.md) + [`docs/knowledge/lessons/2026-04-25-schema-ssot.md`](lessons/2026-04-25-schema-ssot.md)

This is a breaking change for any external consumer that pinned to `Task design-harnessing:*`. Versioned as v2.0.0 per semver.

## 2026-04-24 — Phase 3r + rule adoption (rubric-YAML-split graduates)

**Changed:** L4 rubric corpus + L3 `rubric-applier` agent + AGENTS.md § Rules
**Before:** 3 adopted rubrics in mixed shapes — `skill-quality.md` on YAML-criteria (Phase 3q POC), `ux-writing.md` + `heuristic-evaluation.md` still on prose-table legacy. `rubric-applier` carried dual-shape backward-compat detection.
**After:** All 3 adopted rubrics on YAML-criteria (`version: 1`). `rubric-applier` legacy parser removed (clean cut). New rule `R_2026_04_24_rubric_yaml_split` graduated based on the 2-confirmation pattern: 3q POC + 3r mechanical propagation.
**Why:** Pattern proved out — 2nd migration was mechanical (10+10 criteria moved in a single pass without breaking parse logic). Removes prose-layout-fragility class; auditor + applier can now query criteria deterministically across the entire adopted corpus.
**Source:** [`docs/knowledge/lessons/2026-04-21-rubric-yaml-prose-split.md`](lessons/2026-04-21-rubric-yaml-prose-split.md) (graduated)

Also resolved post-graduation drift: 3 lessons whose rule had already graduated (`R_2026_04_21_detection_enumeration` ×2, `R_2026_04_21_advisor` ×1) had `rule_candidate: true` flags reset to `false` with `rule_ref` populated.

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
