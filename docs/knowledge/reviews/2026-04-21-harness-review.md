---
title: "Harness review — 2026-04-21"
date: 2026-04-21
tags: [review, layer-review, harness-health, self-dogfood, post-3n]
memory_type: episodic
rule_candidate: false
---

# Harness review — 2026-04-21

Second self-review of the plug-in repo, immediately after Phase 3n ships (external-source fill-path + `ai-integration-scout` + schema v5 + advisor-not-installer). Dogfood run — 5 parallel `harness-auditor` + 1 `rubric-recommender` + 1 `lesson-retriever` + 1 `coexistence-analyzer`. First review with a prior baseline, so Staleness block is populated.

## Harness health

**Overall:** 7.2 / 10 (healthy-but-drift — new drift surface since 3l/3n changes)

```
Layer              Bar          Score   State
─────────────────  ───────────  ──────  ─────────────────────────────────
L1 Context         ██████░░░░    6.2    always-loaded contract path-drift (P1)
L2 Skill Curation  ████████░░    7.8    3 stale `schema v3` mentions in hd-setup
L3 Orchestration   ████████░░    8.4    scout wired in but prose-only at L1/L5
L4 Rubric Setting  █████░░░░░    5.2    skill-quality.md has 16 broken tokens (P1)
L5 Knowledge       ████████░░    8.2    live-testing rule at graduation threshold
```

## Top priorities

| Sev | # | Layer | Finding | Effort |
|-----|---|-------|---------|--------|
| P1 | 1 | L4 | `skill-quality.md` (both copies) has 16 instances of botched sed from `audit→full review` / `critique→targeted review` — `"full reviewor"`, broken file paths with spaces | S |
| P1 | 2 | L1 | `budget-check.sh` reports 193/200 but points at nonexistent `docs/context/design-system/components/cheat-sheet.md` — real path is `docs/context/design-system/cheat-sheet.md` (62 lines). Real budget would be 255/200. | XS |
| P2 | 3 | L2 | `hd-setup/SKILL.md` lines 38/56/122 still say `schema v3` — should be `v5` (3n.7 shipped today) | XS |
| P2 | 4 | L5 | "Live testing surfaces what spec review misses" candidate rule at **4 confirmations** — ready for `/hd:maintain rule-propose` → `AGENTS.md § Rules` | S |
| P2 | 5 | L5 | `docs/knowledge/changelog.md` self-declares as rule-adoption meta-log but lists 0 of 3 existing rules | S |
| P2 | 6 | L3 | `ai-integration-scout` description is 191 chars (over 180 soft cap); prose references in `layer-1-context.md` + `layer-5-knowledge.md` lack concrete `Task` code-fences | S |
| P2 | 7 | Cross | `<protected_artifacts>` in `hd-review/SKILL.md` missing `agents/**` and `docs/plans/**` — today's new scout agent + 3n plan file unprotected | XS |
| P2 | 8 | L4 | Only 1 of 14 starter rubrics adopted in `docs/rubrics/`. Recommender says: adopt `ux-writing` + `heuristic-evaluation`, waive 10 UI rubrics with AGENTS.md rationale, defer `i18n-cjk`, waive `component-budget` (duplicative with script) | M |
| P3 | 9 | L3 | `agents/research/article-quote-finder-corpus.md` is a data file, not an agent — relocate to `references/` | S |
| P3 | 10 | L4 | `agents/analysis/harness-auditor.md` spec references `audit-criteria-l*.md` but actual files are `review-criteria-l*.md` (all 5) | S |

## Current state

| Area | Observed state |
|------|----------------|
| Always-loaded budget | **Reports** 193/200 but path drift — real would be 255/200 if fixed (see P1 #2) |
| Skill dir | `skills/` detected, 4 skills, 0 violations, all ≤200 lines (learn 128, maintain 129, review 197, setup 198) |
| Agents | 10 total — 4 analysis, 3+1 research (scout new today), 3 review |
| Schema | detect.py emits v5 (3n.7 shipped — `cli[]` + `data_api[]` categories working) |
| Layers present | L1, L4, L5 canonical; L3 via `agents/` + inline orchestration in SKILL.md |
| Other-tool harnesses | compound-engineering (external plugin cache only; no repo residue) |
| L5 cadence | 14 lessons between 2026-04-16 and 2026-04-21 (today's `2026-04-21-external-source-fill-path.md` with `rule_candidate: true`) |
| Prior review | 2026-04-20 — 4 P2/P3 findings; 2 resolved, 1 partially resolved, 1 unresolved |

## Findings

### P1 — structural (ship-blocking)

- **[L4] `skill-quality.md` vocabulary mangled by prior sed** — 16 broken tokens across both copies (`docs/rubrics/skill-quality.md` + `skills/hd-review/assets/starter-rubrics/skill-quality.md`). Examples: line 23 `"full reviewor"` (was `auditor`), line 98 `"templates/full review-report.md.template"` (space in file path), line 140 `"hd:full review-harness"` (broken slash-command), lines 201/205/206 `"full review-criteria.md"` and `"targeted review-format.md"` (should be `review-criteria.md` / `critique-format.md`). Root cause: 3l.7 vocab unification sed pass ran across literal word boundaries. **Fix manually, in both copies.** `detected_by: harness-auditor L4`.

- **[L1] Always-loaded budget contract path drift** — `skills/hd-review/scripts/budget-check.sh` reads loading-order contract that points at `docs/context/design-system/components/cheat-sheet.md` (0 lines — doesn't exist). Actual file is `docs/context/design-system/cheat-sheet.md` (62 lines). Budget falsely passes at 193/200. Real budget would be 167 + 26 + 62 = **255/200 — 55 lines over cap**. Decision: (a) move file into `components/` sub-folder + trim, or (b) update loading-order contract to point at the real path and demote cheat-sheet out of Tier 1. `detected_by: harness-auditor L1`.

### P2 — drift (should fix)

- **[L2] `hd-setup/SKILL.md` has 3 stale `schema v3` mentions** — lines 38, 56, 122. Should be `v5` per detect.py (`scripts/detect.py:958`), schema doc (`references/hd-config-schema.md:11`), and template (`assets/hd-config.md.template:2`). Single-token fix. `detected_by: harness-auditor L2`.

- **[L5] Live-testing rule ready to graduate** — candidate rule *"Spec review and dry runs won't find what live testing does; budget at least one live run per repo-type before calling a feature done"* now has **4 confirmations**: pilot matrix (2026-04-17), sds re-pilot (2026-04-17), 3k–3m iteration (2026-04-20), 3n external-source (2026-04-21). The 2026-04-20 lesson explicitly said "promote on the 4th confirmation." Action: run `/hd:maintain rule-propose` on `2026-04-21-external-source-fill-path.md`; promote to `AGENTS.md § Rules`. `detected_by: lesson-retriever + harness-auditor L5`.

- **[L5] `docs/knowledge/changelog.md` missing 3 rule-adoption events** — file self-declares as "the rule-adoption meta-log" but has only 1 entry (2026-04-18 Phase 3e–3j). All 3 existing `AGENTS.md § Rules` entries (2026-04-16 no-stubs, 2026-04-18 additive-only, 2026-04-20 review-default) are absent. Backfill required. `detected_by: harness-auditor L5`.

- **[L3] `ai-integration-scout` description 191 chars (over 180 cap)** — `agents/research/ai-integration-scout.md:3`. Budget-check was run before agent was added; future runs will flag. Tighten to ≈165 chars. `detected_by: harness-auditor L3`.

- **[L3] Scout invocation is prose-only at L1/L5** — `layer-1-context.md` + `layer-5-knowledge.md` name the scout in the Fill-path prose but don't include a concrete `Task design-harnessing:research:ai-integration-scout(...)` code-fence. Contrast with `rule-candidate-scorer` block at `layer-5-knowledge.md:89-94` which shows the invocation. Prose-only refs weaken host-agnostic templating per the 2026-04-20 lesson. `detected_by: harness-auditor L3`.

- **[Cross-layer] `<protected_artifacts>` block missing two namespaces** — `hd-review/SKILL.md:26-33` covers `docs/knowledge/**`, `docs/context/**`, `skills/**`, etc., but NOT `agents/**` or `docs/plans/**`. Today's new scout agent (`agents/research/ai-integration-scout.md`) and 3n plan file are unprotected from external cleanup tools. Append both globs. `detected_by: coexistence-analyzer`.

- **[L4] Only 1 of 14 starter rubrics adopted in `docs/rubrics/`** — rubric-recommender's recommendation: (1) adopt `ux-writing.md` (SKILL.md prose + agent descriptions + command text are all UX copy) + `heuristic-evaluation.md` (applies to `/hd:*` command interaction flows), (2) waive 10 visual rubrics (`accessibility-wcag-aa`, `design-system-compliance`, `interaction-states`, `typography`, `color-and-contrast`, `spatial-design`, `motion-design`, `responsive-design`, `telemetry-display`, `component-budget`) with dated rationale in `AGENTS.md § Rules`, (3) defer `i18n-cjk` until localization lands. **Most of "under-population" is actually correct decisions that were never documented** — two real gaps, ten explicit waivers. `detected_by: rubric-recommender`.

### P3 — polish (nice-to-have)

- **[L3] `agents/research/article-quote-finder-corpus.md` is a data file, not an agent** — frontmatter has no `name` / `description` fields. AGENTS.md:46 already calls it out as "data ref, not an agent". Relocate to `skills/hd-learn/references/` or `agents/research/references/` so `agents/` contains only invokable agents.

- **[L4] `agents/analysis/harness-auditor.md` spec references old criteria filenames** — the agent's Phase 1 loader bullets point at `audit-criteria-l*.md` but actual files are `review-criteria-l*.md` (all 5 layer files were renamed during 3l.7 vocab unification). Multiple auditors in this review noted the mismatch — falls back to sibling discovery which worked but should be fixed. `detected_by: harness-auditor L4 + L5`.

- **[L5] `decisions.md` and `ideations.md` under-populated for Phase 3k–3n content** — single 2026-04-18 entry each; no ADR for advisor-vs-installer reframe, no ideation entries for the deferred 14-of-14 rubric adoption decisions. Lift from today's lesson.

- **[L1] No `## Harness map` / `## Agent persona` section in `AGENTS.md`** — review criteria expect both. Content exists (persona at `docs/context/agent-persona.md`, layer-to-path mapping implicit in `## Repo layout`), just not named per criteria. Either rename `## Repo layout` → `## Harness map` with explicit per-layer tagging, or note the waiver.

## Cross-layer consistency

- **Schema version consistency** — 3 writes stale (hd-setup/SKILL.md), 3 writes current (detect.py / schema doc / template). P2 #3 above.
- **Criteria filename consistency** — 5 auditor references call `audit-criteria-l*.md`; actual files are `review-criteria-l*.md`. P3 above.
- **Scout wiring consistency** — named in 8 places, shown as concrete `Task(...)` block in 1 (per-layer-procedure.md:72). Prose-only at layer-1 and layer-5. P2 #6 above.
- **Vocabulary consistency** — post-vocab-rename (`link→scaffold`, `scaffold→create`) is clean across live files. Earlier `audit→full review` / `critique→targeted review` sed broke `skill-quality.md` irreversibly. Vocab-rename clusters have **0 prior lessons** — worth capturing a new lesson from today's P1 finding to prevent recurrence. `detected_by: lesson-retriever + harness-auditor L4`.

## hd-config drift

`hd-config.md` absent at repo root (carry-over from 2026-04-20 review P2 #3 — unresolved). This plug-in repo is the meta-harness; we've never run `/hd:setup` on ourselves to scaffold our own config. detect.py signals we would populate: `setup_mode: advanced`, `team_tooling: { analytics: ["metabase"] }` (false positive — probably a README reference), `other_tool_harnesses_detected: []`, `schema_version: "5"`. Author by hand or run `/hd:setup --discover-tools`.

## Staleness

**Prior review:** `docs/knowledge/reviews/2026-04-20-harness-review.md` (1 day ago; 4 findings).

**Overlap with prior:** ≈ 15% Jaccard on `{category, check, file}` triples. Below the 70% threshold → **fresh review**, distinct drift surface.

**Prior-findings resolution status:**
| Prior | Status | Evidence |
|-------|--------|----------|
| P2 #1 Retired INDEX.md + README.md still on disk | ✅ RESOLVED | Both files removed |
| P2 #2 docs/rubrics/ empty except INDEX.md | 🟡 PARTIAL | skill-quality.md adopted; 13 others still under-adopted — but today's recommender clarifies ONLY 2 should actually be adopted (10 waive, 1 defer) |
| P2 #3 hd-config.md missing | 🔴 UNRESOLVED | Still absent |
| P3 #4 Empty ideations.md | 🟡 PARTIAL | 1 entry added 2026-04-18; Phase 3k–3n content still missing |

**Git activity since 2026-04-20:** 5 commits (3n iteration — schema v5, scout agent, known-mcps reframe, Step 3 collapse, per-layer fill path, CHANGELOG rollup).

**Lessons captured since 2026-04-20:** 1 new (`2026-04-21-external-source-fill-path.md` — the 4th confirmation that moves live-testing rule to graduation threshold).

**Staleness verdict:** *"Fresh review — 11 new findings since 2026-04-20. Prior-review 50% fully/partially resolved. Continue acting on drift — next review in ~1 week should find further reduction if P1 + P2 addressed."*

## Proposed revision

```diff
  docs/
  ├── context/
  │   └── design-system/
- │       └── cheat-sheet.md                  # 62 lines, wrong path per loading-order
+ │       └── components/
+ │           └── cheat-sheet.md              # move into components/ OR update loading-order
  ├── knowledge/
  │   ├── changelog.md                         # ~ backfill 3 rule-adoption events + 3n
  │   ├── decisions.md                         # ~ ADR for advisor-vs-installer
  │   ├── ideations.md                         # ~ 14-rubric decision entries
  │   └── reviews/
  │       └── 2026-04-21-harness-review.md    # + this file
+ ├── rubrics/
+ │   ├── ux-writing.md                       # promote from starter-rubrics/
+ │   └── heuristic-evaluation.md             # promote from starter-rubrics/
~ docs/rubrics/skill-quality.md                # fix 16 broken-vocab tokens
~ skills/hd-review/assets/starter-rubrics/skill-quality.md  # same
~ skills/hd-setup/SKILL.md                     # schema v3 → v5 (3 sites)
~ skills/hd-review/SKILL.md                    # <protected_artifacts> += agents/** + docs/plans/**
~ agents/research/ai-integration-scout.md      # trim description 191 → ~165 chars
~ agents/analysis/harness-auditor.md           # audit-criteria-* → review-criteria-*
~ skills/hd-setup/references/layer-1-context.md       # add concrete Task code-fence for scout
~ skills/hd-setup/references/layer-5-knowledge.md     # add concrete Task code-fence for scout
~ AGENTS.md                                    # add 2026-04-21 rule (live testing); add rubric-waiver rule; add Harness map
- agents/research/article-quote-finder-corpus.md  # move out of agents/
+ skills/hd-learn/references/article-quote-finder-corpus.md  # or agents/research/references/
```

Apply via: `/hd:setup --from-review docs/knowledge/reviews/2026-04-21-harness-review.md`

## Suggested actions

**Immediate (P1 — before next ship):**
1. Fix `skill-quality.md` vocabulary in both copies (audit→full review sed aftermath)
2. Fix always-loaded contract path drift (either move file or fix loading-order)

**Next iteration (P2):**
3. Update `schema v3` → `v5` in `hd-setup/SKILL.md` (3 sites)
4. Run `/hd:maintain rule-propose` on 2026-04-21 lesson (graduation threshold reached)
5. Backfill `changelog.md` with 3 existing rule adoptions + 3n
6. Add `agents/**` + `docs/plans/**` to `<protected_artifacts>`
7. Tighten `ai-integration-scout` description to ≤180 chars
8. Add concrete `Task` code-fences in L1/L5 fill-path prose
9. Promote `ux-writing.md` + `heuristic-evaluation.md` into `docs/rubrics/`
10. Add AGENTS.md `## Rules` entry waiving 10 visual rubrics + 1 duplicative rubric with rationale

**Polish (P3):**
11. Relocate `article-quote-finder-corpus.md` out of `agents/`
12. Rename `audit-criteria-*` references → `review-criteria-*` in `harness-auditor.md` spec
13. Lift Phase 3k–3n content into `decisions.md` + `ideations.md`
14. Add `## Harness map` section to `AGENTS.md`

**Capture-worthy lesson (from today):**
- New episodic lesson: *"Sed-based vocabulary renames need surgical precision or an always-manual review pass — `audit→full review` over-ran into file paths and `auditor→full reviewor`. Cluster had 0 prior lessons; today's `skill-quality.md` is the first confirmation."* Capture with `/hd:maintain capture` — n=1, park as candidate; graduate if it recurs.

## Agents used

- `design-harnessing:analysis:harness-auditor` ×5 (one per layer 1–5, scenario: audit)
- `design-harnessing:analysis:rubric-recommender` (scenario: audit-gap-finding)
- `design-harnessing:research:lesson-retriever` (topic: harness-health-audit-2026-04-21)
- `design-harnessing:analysis:coexistence-analyzer` (conditional; dispatched because external compound-engineering cache detected — though no repo residue)

## Meta

- Execution mode: parallel (2-batch ≤5 each)
- Agents invoked: 8 (5 + 3)
- Duration: ~300s (99 + 113 + 87 + 97 + 111 across Batch 1 max; Batch 2 parallel ~75s)
- Report version: 3m.4

---

**Note:** This review report is dated and append-only; history is sacred. Don't edit or delete this file; author a new dated review if findings need revising.
