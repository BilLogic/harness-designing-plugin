---
title: "Phase 3i — agent architecture, skill renames, memory-term rename, reference reorg, README rewrite"
type: refactor
status: completed
date: 2026-04-18
---

# Phase 3i — agent architecture + skill renames + memory-term rename + reference reorg + README rewrite

Origin: in-session design dialogue 2026-04-18 (6 alignment rounds between Bill and me). Key decisions: agent-category suffixes kept, 9-agent set instead of 15, parallel-only-for-analysis in /hd:setup, "rules" as memory term (not graduation/compound), hd-setup references consolidate 16→9, hd-review audit-criteria splits 1→7.

## Work units (11)

### 3i.0 — Repo pollution fix (URGENT, blocking)

**Problem:** `dh/main` currently contains `Desktop/`, `Vibe Coding/`, and other home-dir paths from the shared `~/.git` common-dir. Must strip before any further pushes.

**Approach:** `git filter-repo` (per Bill's Option A pick) to keep only plugin paths. Force-push `claude/elegant-euclid` as the new `dh/main` AND overwrite `dh/claude/elegant-euclid`.

**Paths to keep:**
```
AGENTS.md  CLAUDE.md  CHANGELOG.md  LICENSE  README.md
.claude-plugin/  .codex-plugin/  .cursor-plugin/  .cursor/
agents/  docs/  skills/
```

**Acceptance:**
- [ ] `git ls-tree -r --name-only dh/main | grep -E '^(Desktop|Vibe Coding|Documents|Pictures)'` returns empty
- [ ] All 32 commits preserved (SHAs change due to rewrite; that's expected)
- [ ] Local `claude/elegant-euclid` branch matches the new `dh/main` tip

**Risk:** history rewrite is destructive; safeguard with a pre-rewrite tag `backup/pre-3i-0-YYYYMMDD` before running filter-repo.

### 3i.1 — Skill renames (`/hd:onboard` → `/hd:learn`, `/hd:compound` → `/hd:maintain`)

**Breaking change**, zero external cost (unpublished).

**Directory renames:**
- `skills/hd-onboard/` → `skills/hd-learn/`
- `skills/hd-compound/` → `skills/hd-maintain/`

**Frontmatter:**
- `name: hd:onboard` → `name: hd:learn`
- `name: hd:compound` → `name: hd:maintain`

**Reference sweep:** update every occurrence across AGENTS.md, README.md, CHANGELOG.md, plan files, lesson files, 3 plugin.json manifests, cross-skill Task invocations.

**Acceptance:**
- [ ] `grep -rn 'hd:onboard\|hd-onboard' .` returns 0 hits outside historical plan/lesson files
- [ ] `grep -rn 'hd:compound\|hd-compound' .` returns 0 hits outside historical plan/lesson files
- [ ] All 3 manifests (`.claude-plugin/plugin.json`, `.codex-plugin/plugin.json`, `.cursor-plugin/plugin.json`) reference the new skill paths
- [ ] Historical plan files under `docs/plans/2026-04-*` are LEFT ALONE (preserve record)

### 3i.2 — Memory-term rename ("rules")

**Replace** `graduation` / `graduated` / `compound` / `compounding` (when referring to promoted lessons) with `rule` / `rules`.

**Specific touches:**
- `graduation_candidate` YAML field → `rule_candidate`
- `skills/hd-maintain/` modes: `graduate-propose` → `rule-propose`, `graduate-apply` → `rule-apply`
- `agents/analysis/graduation-candidate-scorer.md` → `agents/analysis/rule-candidate-scorer.md` (dir entry + frontmatter `name` + description)
- `AGENTS.md § Graduated rules` → `§ Rules`
- `docs/knowledge/graduations.md` → DELETE; future rule-adoption entries go to `docs/knowledge/changelog.md`
- Update references: `skills/hd-maintain/references/graduation-criteria.md` → `rule-adoption-criteria.md`
- Update references: `skills/hd-maintain/references/lesson-patterns.md` — replace graduation/compound language with rules language
- Update references: `skills/hd-maintain/references/plan-hash-protocol.md` — keep the safety mechanism; swap terminology

**Acceptance:**
- [ ] `grep -rn 'graduat\|compound-candidate\|compounding' skills/ agents/ AGENTS.md README.md CHANGELOG.md` returns 0 hits (historical docs/plans/ + docs/knowledge/lessons/ LEFT ALONE)
- [ ] `/hd:maintain` exposes only `capture`, `rule-propose`, `rule-apply` modes
- [ ] Lessons generated after 3i.2 use `rule_candidate:` not `graduation_candidate:`

### 3i.3 — Agent reorg part 1 (split + rename + drop)

**Split:** `agents/review/rubric-applicator.md` →
- `agents/review/rubric-applier.md` (pure apply-mode spec; inherits H1/H2/H3 pins from 3h)
- `agents/review/rubric-extractor.md` (pure extract-mode spec; inherits H1/H2/H3 pins; phased Phase 1–5 procedure)

**Rename:** `agents/analysis/graduation-candidate-scorer.md` → `agents/analysis/rule-candidate-scorer.md` (see 3i.2; this is the physical file rename)

**Delete:**
- `agents/workflow/harness-health-analyzer.md` (superseded by new `harness-auditor` in 3i.4)
- `agents/workflow/` folder (empty after above delete; remove the directory)

**Update AGENTS.md** "categories mirror compound's convention" paragraph: 3 categories only — `analysis/`, `research/`, `review/`.

**Acceptance:**
- [ ] 5 files in `agents/` after split+rename (down from 6; up by 1 from the split, down by 1 from scorer rename remains net neutral)
- [ ] `agents/workflow/` directory does not exist
- [ ] AGENTS.md category list shows 3 categories
- [ ] Descriptions on all split/renamed agents stay ≤180 chars

### 3i.4 — Agent reorg part 2 (3 new agents)

**New files** (all ≤180-char descriptions, YAML structured output, no nested Task invocations):

**`agents/analysis/harness-auditor.md`:**
- Takes `layer: 1|2|3|4|5` parameter (required)
- Reads ONLY its layer's `audit-criteria-l<N>-*.md` (from 3i.7) + layer-specific user artifacts (per map in design dialogue)
- Returns structured YAML: per-layer health score + top 3-5 findings + recommended actions
- Dispatched 5× parallel by `/hd:review audit` Batch 1 AND by `/hd:setup` Phase A
- Also supports aggregate mode for `/hd:review audit mode:quick` (scans detect.py + hd-config.md only, no deep reads)

**`agents/analysis/rubric-recommender.md`:**
- Reads `detect.py` JSON + starter-rubric INDEX + user `package.json` signals
- Returns ranked list: `[{rubric, why, confidence}]` for which of 14 starters to scaffold
- Called by `/hd:setup` L4 scaffold default + `/hd:review audit` gap-finding (Batch 2)

**`agents/analysis/coexistence-analyzer.md`:**
- Reads other-tool artifacts: `.agent/`, `.claude/`, `.codex/`, compound-engineering footprint (`docs/solutions/`, `compound-engineering.local.md`)
- Returns coexistence-coverage report: which namespaces detected, which protections in place, any collision risks
- Called conditionally by `/hd:review audit` Batch 2 when detect flagged `other_tool_harnesses_detected`

**Acceptance:**
- [ ] 3 new agent files at specified paths
- [ ] Each passes `budget-check.sh` description char check (≤180)
- [ ] Each documents its dispatch pattern (solo / parallel-member / batch-parallel) in frontmatter or body
- [ ] `harness-auditor` spec includes the layer-N artifact map verbatim from design dialogue

### 3i.5 — Rewire skills with parallel dispatch + context isolation

**`skills/hd-review/SKILL.md` audit mode** — 2-batch parallel dispatch:

```
Batch 1 (5 parallel):   harness-auditor × 5 (layers 1-5)
Batch 2 (2-3 parallel): rubric-recommender + lesson-retriever + [coexistence-analyzer if conditional]
Inline:                 parse budget-check.sh JSON
Synthesize:             dated audit lesson in docs/knowledge/lessons/
```

**`skills/hd-setup/SKILL.md` NEW Phase A (parallel pre-analysis)**:

```
Phase A (parallel, ~6s wall):
  ├─ harness-auditor × 5 (one per layer) — proposes per-layer default action
  └─ rubric-recommender (proposes L4 rubric subset)

Phase B (serial, interactive):
  Steps 3-8 walk user through layers with Phase-A pre-computed proposals in-hand
```

**`skills/hd-maintain/SKILL.md`:**
- `capture` mode: `lesson-retriever` solo (Phase 1 dedup/relation research)
- `rule-propose` mode: `rule-candidate-scorer` → [optional `rubric-extractor` if lesson has ≥4 imperatives]
- `rule-apply` mode: inline (re-run `compute-plan-hash.sh`, verify, write to AGENTS.md § Rules)

**`skills/hd-learn/SKILL.md`:**
- Q&A: `article-quote-finder` solo per question (graceful empty until corpus configured — no change)

**Parallel→serial safety:** implement auto-switch at 6+ agents per batch. Each batch stays ≤5 by design.

**Acceptance:**
- [ ] `/hd:review audit` documented dispatch matches the 2-batch plan exactly
- [ ] `/hd:setup` SKILL.md has a distinct "Phase A — parallel pre-analysis" section before Step 3
- [ ] All Task invocation names are fully qualified (`Task design-harnessing:<category>:<agent>`)
- [ ] No bare agent names anywhere

### 3i.6 — hd-setup reference reorg (16 → 9)

**Merge + delete:**
| Source(s) | Destination |
|---|---|
| `step-4-layer-1-context.md` + `good-agents-md-patterns.md` + `tier-budget-model.md` | `layer-1-context.md` (enriched) |
| `step-5-layer-2-skills.md` | `layer-2-skills.md` (enriched) |
| `step-6-layer-3-orchestration.md` | `layer-3-orchestration.md` (enriched) |
| `step-7-layer-4-rubrics.md` | `layer-4-rubrics.md` (enriched) |
| `step-8-layer-5-knowledge.md` | `layer-5-knowledge.md` (enriched, includes memory-type taxonomy addendum) |

**Keep as-is:** `per-layer-procedure.md`, `hd-config-schema.md`, `known-mcps.md`, `coexistence-checklist.md`

**Delete after merge:** all 5 `step-N-*.md` + `good-agents-md-patterns.md` + `tier-budget-model.md` (7 files)

**Update `skills/hd-setup/SKILL.md`** reference pointers: remove `step-N` references; use `layer-N` references directly.

**Acceptance:**
- [ ] `ls skills/hd-setup/references/ | wc -l` returns 9
- [ ] No `step-N-*.md` files remain
- [ ] `grep -rn 'step-4-layer\|step-5-layer\|step-6-layer\|step-7-layer\|step-8-layer\|good-agents-md-patterns\|tier-budget-model' skills/ agents/` returns 0 hits
- [ ] Each layer-N file has both concept AND procedure content (no information loss from merge)

### 3i.7 — hd-review audit-criteria split (1 → 7)

**Source:** current monolithic `skills/hd-review/references/audit-criteria.md`

**Split into:**
1. `audit-criteria-l1-context.md` (~50-80 lines)
2. `audit-criteria-l2-skills.md`
3. `audit-criteria-l3-orchestration.md`
4. `audit-criteria-l4-rubrics.md`
5. `audit-criteria-l5-knowledge.md`
6. `audit-criteria-coexistence.md` (for `coexistence-analyzer`)
7. `audit-criteria-budget.md` (thin — how to interpret `budget-check.sh` JSON inline)

**Delete** original monolithic `audit-criteria.md` after split.

**Purpose:** each `harness-auditor(layer: N)` dispatch loads ONLY its file → parallel context isolation win.

**Acceptance:**
- [ ] 7 `audit-criteria-*.md` files exist in `skills/hd-review/references/`
- [ ] Original `audit-criteria.md` deleted
- [ ] `harness-auditor` agent spec (from 3i.4) references the layer-specific file by path
- [ ] No content loss (every criterion from the monolith lives in exactly one of the 7 splits)

### 3i.8 — Rubric scope-and-grounding

**Structure** (add to YAML of each of the 14 starters at `skills/hd-review/assets/starter-rubrics/`):

```yaml
scope_and_grounding:
  personas:
    - name: <persona>
      pain_point: <one sentence>
  user_stories:
    - "As a <persona>, I need <behavior> so that <outcome>"
  realistic_scenarios:
    - scenario: <one sentence>
      why_it_matters: <one sentence>
  anti_scenarios:
    - scenario: <one sentence>
      symptom: <how it manifests>
```

**Populate** from source material (Impeccable for typography/color/spatial/motion/ux-writing/responsive; Nielsen for heuristic-evaluation; Material 3 + Fluent 2 where cited; lightning pilot for telemetry-display; caricature+lightning for i18n-cjk; skill-quality rubric for skill-quality; etc.).

**New file:** `skills/hd-review/references/rubric-authoring-guide.md` — documents the structure for users authoring custom rubrics. ~100 lines. Covers: the 4-block schema, how personas ground severity, how anti-scenarios drive fail-example selection.

**Update** `rubric-applier` agent (post-3i.3 split): at Phase 1 (scan), read the `scope_and_grounding` block first; use personas/scenarios as preamble context; surface persona/scenario mismatches as `severity_rationale: persona-scope-mismatch` in output.

**Acceptance:**
- [ ] All 14 rubrics have non-empty `scope_and_grounding:` blocks
- [ ] `rubric-authoring-guide.md` exists under hd-review references
- [ ] `rubric-applier.md` spec Phase 1 references the scope-and-grounding load step
- [ ] No existing rubric criterion was lost in the add

### 3i.9 — README rewrite (preserve thesis, add credits, match tone)

**Structure** (proposed, post-design-dialogue):

1. Hero — one-line tagline
2. Thesis — 5-layer memory-type table (preserved from current README, polished)
3. Components — count table
4. Four commands — table with one-line descriptions each
5. Nine agents — 3 category-tables (analysis/research/review)
6. 14 starter rubrics — 4 category-tables (quality/visual/communication/domain-specific)
7. Scripts — 3-row table
8. Coexistence with compound-engineering — 4-row mapping table + Task invocation rule
9. Installation — `claude /plugin install harness-designing` + local dev fallback
10. **Credits** (NEW) — hyperlinked attribution:
    - Substack article series — Bill Guo *(URL TBD, placeholder)*
    - [EveryInc/compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin) — @dhh / [@kieranklaassen](https://twitter.com/kieranklaassen)
    - Rubric sources:
      - [pbakaus/impeccable](https://github.com/pbakaus/impeccable) — [@paulbakaus](https://twitter.com/paulbakaus)
      - [Nielsen Norman Group](https://www.nngroup.com) — [Jakob Nielsen's 10 Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/)
      - [Material Design 3](https://m3.material.io) — Google
      - [Fluent 2](https://fluent2.microsoft.design) — Microsoft
    - Skill authoring references — [Anthropic skill best-practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices) + [Complete Guide to Building Skills for Claude](https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf)
11. Known Issues — article corpus TBD, user-level MCPs need opt-in flag
12. Version History — CHANGELOG link + current phase status
13. License — MIT

**New repo name:** Harness Designing Plugin (matches GitHub repo `harness-designing-plugin`).

**Internal namespaces stay:** Task invocation `design-harnessing:<cat>:<agent>`, plugin folder `design-harness` (changing these is Phase 3j+, out of scope).

**Acceptance:**
- [ ] Thesis block preserved (5-layer memory-type table intact)
- [ ] Credits section exists with all specified hyperlinks resolving
- [ ] Component counts match actual: 4 skills, 9 agents, 14 rubrics, 3 scripts
- [ ] "Harness Designing Plugin" appears as the project name in the hero
- [ ] Tone inspection: tables-first, one-line descriptions, no marketing-adjective bloat — passes qualitative compound-like feel test

### 3i.10 — `/every-style-editor` pass

Target files (5):
- `README.md`
- `AGENTS.md`
- `skills/hd-learn/SKILL.md`
- `skills/hd-setup/SKILL.md`
- `skills/hd-maintain/SKILL.md`
- `skills/hd-review/SKILL.md`

Accept all grammar/punctuation auto-fixes. Flag substantive style changes for Bill approval before applying. Commit style-editor changes as a final commit of the phase.

**Acceptance:**
- [ ] Each file run through compound-engineering:every-style-editor
- [ ] Zero p1 grammar/punctuation violations on final run
- [ ] Commit clearly labeled "style: 3i.10 every-style-editor pass across docs"

---

## Implementation order

1. **3i.0** — repo fix (blocking; must complete before any push)
2. **3i.1** → **3i.2** — renames (serial; touch same files; order matters to avoid cascading conflicts)
3. **3i.3** — agent reorg part 1 (can start in parallel with 3i.6)
4. **3i.6** + **3i.7** — reference reorgs (parallel; independent skills)
5. **3i.4** — new agents (depends on 3i.3 folder structure + 3i.7 audit-criteria files)
6. **3i.5** — rewire skills (depends on 3i.4 agents + 3i.6/3i.7 references)
7. **3i.8** — rubric scope-and-grounding (independent; can start any time after 3i.2 stabilizes)
8. **3i.9** — README (end of cycle; includes post-renames reality)
9. **3i.10** — style-editor pass (last)

## Files touched (estimate)

- **Rename + reference sweep:** ~90 files (skill dirs + plan/lesson back-refs + 3 manifests)
- **New files:** ~13 (3 new agents, 2 new rubric/reference files, 5 `audit-criteria-*` splits after monolith delete, 1 rubric-authoring-guide, 1 backfilled `scope_and_grounding` per rubric × 14)
- **Deleted files:** ~12 (`workflow/` dir content, `graduations.md`, 5 `step-N-*.md`, `good-agents-md-patterns.md`, `tier-budget-model.md`, `rubric-applicator.md`, `harness-health-analyzer.md`, `audit-criteria.md`)
- **Modified files:** ~35 (AGENTS.md, README.md, CHANGELOG.md, 4 SKILL.md, ~6 references in hd-maintain, ~3 references in hd-review, etc.)

Net: ~150 file operations across the phase.

## Verification (cross-cutting)

- [ ] `git ls-tree -r --name-only dh/main | grep -E '^(Desktop|Vibe Coding|Documents)'` returns empty
- [ ] Budget-check clean: all 4 SKILL.md ≤200 lines, Tier 1 ≤200, 0 violations
- [ ] No `grep -rn 'hd:onboard\|hd:compound\|graduation\|compound-candidate'` hits in living files (historical plan/lesson LEFT ALONE)
- [ ] `ls agents/` shows `analysis/ research/ review/` only (no `workflow/`)
- [ ] 9 agents total: 2 research + 4 analysis + 3 review
- [ ] All agent descriptions ≤180 chars
- [ ] `skills/hd-setup/references/` has 9 files
- [ ] `skills/hd-review/references/` has the new `audit-criteria-*` set (7 files) + pre-existing (`rubric-application.md`, `critique-format.md`, `audit-procedure.md`, `critique-procedure.md`, `rubric-authoring-guide.md`)
- [ ] README hero mentions "Harness Designing Plugin"; credits section resolves all hyperlinks
- [ ] No writes to `docs/solutions/`

## Constraints

- Additive-only to user repos during any pilot runs; breaking changes strictly internal to plugin.
- Every commit on `claude/elegant-euclid`; no direct writes to `main`.
- Commit per unit (or per sub-step within a unit) for bisect-ability.
- After 3i.0 completes, every subsequent unit pushes `claude/elegant-euclid` to `dh`.
- `/every-style-editor` changes reviewed before acceptance — don't auto-commit substantive rewrites.

## Sources

- In-session design dialogue 2026-04-18 (6 rounds of alignment — no separate requirements doc)
- Phase 3h plan (extract-mode cosmetic pins, cross-linked for context): [`2026-04-18-004-refactor-phase-3h-cosmetic-pins-plan.md`](./2026-04-18-004-refactor-phase-3h-cosmetic-pins-plan.md)
- Phase 3g deferred parking lot (now addressed by 3i.0–3i.5): [`2026-04-18-003-refactor-phase-3g-remaining-backlog-plan.md`](./2026-04-18-003-refactor-phase-3g-remaining-backlog-plan.md)
- Compound-engineering `/ce:review` parallel-dispatch pattern — `/Users/billguo/.claude/plugins/cache/compound-engineering-plugin/compound-engineering/2.42.0/skills/ce-review/SKILL.md`
- AGENTS.md conventions on agent creation threshold (≥2 invocation sites) + fully-qualified Task naming
