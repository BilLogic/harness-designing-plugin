---
title: "refactor: Phase 3d — plus-uno template alignment + rubric library expansion"
type: refactor
status: active
date: 2026-04-17
origin: conversation (plus-uno docs/context/ + docs/knowledge/ structure reviewed; pbakaus/impeccable inspected)
---

# refactor: Phase 3d — plus-uno template alignment + rubric library expansion

Our `/hd:setup` scaffolding templates produce the wrong shape vs Bill's own reference implementation at [github.com/BilLogic/plus-uno](https://github.com/BilLogic/plus-uno). Layer 1 (`docs/context/`) is too thin (single `one-pager.md` / `cheat-sheet.md` / `how-we-work.md` per topic; should be multi-file per topic with foundations/styles/components triad under design-system). Layer 5 (`docs/knowledge/`) is too narrow (lessons + graduations only; should include decisions / ideations / preferences / changelog with explicit memory-type labels + domain-grouped lesson files instead of per-date). The starter-rubrics library is too small (5 files; should expand to 12 distilled from [pbakaus/impeccable](https://github.com/pbakaus/impeccable) + Nielsen heuristic evaluation + Material 3 + Fluent 2). And the setup-config file name is awkward (`design-harnessing.local.md` mirrors compound but doesn't need to).

Fix all six concerns in one phase, one commit per part, before re-running the plus-marketing-website pilot.

## Part A — Layer 1 context-skeleton template alignment

**Current (wrong):** single file per topic under `skills/hd-setup/assets/context-skeleton/`.
- `product/one-pager.md.template`
- `conventions/how-we-work.md.template`
- `design-system/cheat-sheet.md.template`
- `agent-persona.md.template` (drop per Bill)

**Target (plus-uno baseline):** multi-file per topic + foundations/styles/components triad.
- `product/` — `features.md.template`, `flows.md.template`, `users.md.template`, `app.md.template`, `pillars.md.template`
- `conventions/` — `coding.md.template`, `integrations.md.template`, `tech-stack.md.template`, `terminology.md.template`
- `design-system/foundations/` — `accessibility.md.template`, `content-voice.md.template`, `layout.md.template`, `principles.md.template`, `tokens.md.template`
- `design-system/styles/` — `color.md.template`, `elevation.md.template`, `iconography.md.template`, `spacing.md.template`, `typography.md.template`
- `design-system/components/` — `cheat-sheet.md.template`, `inventory.md.template`, `layout-cheat-sheet.md.template`, `patterns.md.template`, `components-index.json.template`
- `design-system/index-manifest.json.template` — federated-index manifest (empty template with well-known fields; user populates)

Each `.md.template` has `{{PLACEHOLDER}}` prompts guiding the user to fill real content.

**Design principle — this is a BASELINE, not a mandate.** `hd:setup` Step 4 offers the plus-uno shape as default; users can decline and get a lighter scaffold (preserve the existing thin 1-file-per-topic as "simple mode").

**Files created** (~20): listed above.
**Files deleted** (4):
- `agent-persona.md.template`
- `product/one-pager.md.template`
- `conventions/how-we-work.md.template`
- `design-system/cheat-sheet.md.template`

**Acceptance:**
- [ ] `skills/hd-setup/assets/context-skeleton/` reproduces plus-uno's shape 1:1
- [ ] Each template has 5–15 lines of `{{PLACEHOLDER}}` prompts + a 1-line intro
- [ ] `skills/hd-setup/references/layer-1-context.md` describes the shape + escape hatch for "simple mode"
- [ ] `skills/hd-setup/SKILL.md` Step 4 "Execute — scaffold" flow updated to ask "full plus-uno baseline vs simple mode?"

## Part B — Layer 5 knowledge-skeleton template alignment

**Current (wrong):** 3 files — thin `INDEX.md`, `graduations.md`, empty `lessons/`. Per-date lesson naming.

**Target (plus-uno + 5-memory-type model):**
- `INDEX.md` — table: Domain | Memory Type | File | Entries | Last Updated | Top Tags
- `changelog.md` — `memory_type: temporal`
- `decisions.md` — `memory_type: procedural-chosen` (ADR-style)
- `ideations.md` — `memory_type: speculative`
- `preferences.md` — `memory_type: semantic-taste`
- `lessons/<domain>.md` — `memory_type: episodic` (domain-grouped, not per-date; split threshold ~15 entries)
- `graduations.md` — `memory_type: meta-log` (deferred scaffold: created on first graduation, not at setup time)
- `README.md` — memory-type taxonomy explainer with article § citations (~20 lines)

**Memory-type labels in 3 places:**
1. YAML frontmatter `memory_type:` on every file
2. `INDEX.md` has Memory Type column
3. `README.md` explains the taxonomy

**`/hd:compound capture` semantics change:** lessons are APPENDED to `lessons/<domain>.md` (not created as new `YYYY-MM-DD-<slug>.md` files). Domain chosen by user at capture OR auto-inferred from tags. Split threshold enforced: when a domain file exceeds 15 entries, offer to split.

**Files created** (~6): `INDEX.md.template`, `changelog.md.template`, `decisions.md.template`, `ideations.md.template`, `preferences.md.template`, `README.md.template`.
**Files modified:** `skills/hd-compound/SKILL.md` (capture mode change), `skills/hd-compound/references/lesson-patterns.md` (new convention).
**Files deleted:** old `graduations.md.template` (deferred scaffold now — not created at setup time).

**Acceptance:**
- [ ] `skills/hd-setup/assets/knowledge-skeleton/` reproduces plus-uno's shape + 5-memory-type model
- [ ] Every knowledge template has `memory_type:` YAML frontmatter
- [ ] `INDEX.md.template` has Memory Type column
- [ ] `README.md.template` has article § citations for each memory type
- [ ] `hd:compound capture` appends to `lessons/<domain>.md` when domain file exists; creates when it doesn't
- [ ] Split threshold (~15 entries) surfaced to user before file exceeds
- [ ] `graduations.md` NOT created at setup time (deferred to first graduation)

## Part C — Rubric library expansion (5 → 12 starters)

**Current (5):** `accessibility-wcag-aa.md`, `design-system-compliance.md`, `component-budget.md`, `skill-quality.md`, `interaction-states.md`.

**Add 7 new starter rubrics:**

| # | File | Source material |
|---|---|---|
| 6 | `heuristic-evaluation.md` | Nielsen's 10 usability heuristics |
| 7 | `typography.md` | `pbakaus/impeccable/source/skills/impeccable/reference/typography.md` + Material 3 type scales |
| 8 | `color-and-contrast.md` | `pbakaus/impeccable/source/skills/impeccable/reference/color-and-contrast.md` (OKLCH, tinted neutrals, dark mode) |
| 9 | `spatial-design.md` | `pbakaus/impeccable/source/skills/impeccable/reference/spatial-design.md` + Material spacing |
| 10 | `motion-design.md` | `pbakaus/impeccable/source/skills/impeccable/reference/motion-design.md` + Material motion |
| 11 | `ux-writing.md` | `pbakaus/impeccable/source/skills/impeccable/reference/ux-writing.md` + Fluent content |
| 12 | `responsive-design.md` | `pbakaus/impeccable/source/skills/impeccable/reference/responsive-design.md` |

**Each new rubric must:**
- Match the shape of existing starters (YAML frontmatter with `rubric`, `name`, `applies_to`, `severity_defaults`)
- Include new frontmatter field `source:` citing the derivation (e.g., `source: [pbakaus/impeccable typography.md, Material Design 3 type scales]`)
- Have 5–10 criteria, each with default severity + pass/fail examples
- Include "Extending this rubric" + "What this rubric does NOT check" sections
- Target 80–150 lines

**Refine existing rubrics** (no file creation, just content update):
- `accessibility-wcag-aa.md` — add Material 3 a11y + Fluent 2 baselines as source citations; cross-reference `color-and-contrast` + `heuristic-evaluation`
- `interaction-states.md` — already references Material 3 + Fluent 2; verify + deepen cross-refs

**Acceptance:**
- [ ] 12 total `.md` files in `skills/hd-review/assets/starter-rubrics/`
- [ ] Each new rubric has a `source:` frontmatter field
- [ ] `skills/hd-review/SKILL.md` "Assets" section lists all 12 with one-line descriptions
- [ ] `skills/hd-setup/references/layer-4-rubrics.md` enumerates all 12 in the starters table
- [ ] `README.md` "starter rubric count" bumped 5 → 12

## Part D — Rubrics folder location correction

**Current (wrong per Phase 3a):** hd-setup Step 7 default "scaffold" wrote rubric files into `docs/context/design-system/`.

**Correct (per plus-uno precedent + architectural coherence):** rubrics live at `docs/rubrics/<name>.md`. Design-system/ holds the source-of-truth CONTENT; rubrics are CHECKS against that content. Separate concerns.

**Files modified:**
- `skills/hd-setup/SKILL.md` Step 7 "Execute — scaffold" → write copies from `assets/starter-rubrics/` to `docs/rubrics/<name>.md` (not `docs/context/design-system/`)
- `skills/hd-setup/SKILL.md` Step 7 "Execute — critique + extract" → promote extracted candidates to `docs/rubrics/<name>.md`
- `skills/hd-setup/references/layer-4-rubrics.md` → correct location + description
- `skills/hd-setup/assets/rubrics-index.md.template` → reflect `docs/rubrics/` location

**Acceptance:**
- [ ] Zero references in `skills/hd-setup/**` to "`docs/context/design-system/`" as a rubric scaffold target
- [ ] All rubric scaffold paths point at `docs/rubrics/`
- [ ] `docs/rubrics/INDEX.md` continues to be written (distributed-pattern explainer)

## Part E — Config file rename

**Rename** `design-harnessing.local.md` → `hd-config.md` across the codebase (22 living-file occurrences).

**Rationale** (to document in AGENTS.md):
- 12-char filename vs 26
- Matches `/hd:*` command prefix
- Drops awkward `.local.md` (compound-mirror pattern we don't need)
- Coexistence intact: compound has `compound-engineering.local.md` (their file); we have `hd-config.md` (ours). Functionally equivalent; namespaces don't collide.

**Renames:**
- `skills/hd-setup/assets/design-harnessing.local.md.template` → `hd-config.md.template`
- `skills/hd-setup/references/local-md-schema.md` → `hd-config-schema.md`

**Files modified** (search + replace `design-harnessing.local.md` → `hd-config.md`):
- `skills/hd-setup/SKILL.md`
- `skills/hd-setup/references/*.md` (all that mention it)
- `skills/hd-compound/**` (all files)
- `skills/hd-review/**` (all files)
- `agents/**` (all files)
- `AGENTS.md`
- `README.md` (if it mentions the filename)
- `CHANGELOG.md` (Unreleased section — document the rename)

**Preserved** (historical record, not modified):
- `docs/plans/*.md` historical plan files (mention the old name in context)
- `docs/knowledge/lessons/*.md` historical lesson files

**Acceptance:**
- [ ] `grep -rln "design-harnessing.local.md" skills/ agents/ AGENTS.md README.md` returns 0 hits
- [ ] `grep -rln "hd-config.md" skills/ agents/ AGENTS.md` returns ≥ 5 hits (new references in place)
- [ ] `skills/hd-setup/references/hd-config-schema.md` exists; `local-md-schema.md` does not
- [ ] AGENTS.md coexistence table notes the rename
- [ ] Compound's `compound-engineering.local.md` references preserved (never ours to rename)

## Part F — Layer reference updates

Update reference files to reflect Parts A–E:

- `skills/hd-setup/references/layer-1-context.md` — describe plus-uno baseline + multi-file topology + "simple mode" escape hatch
- `skills/hd-setup/references/layer-4-rubrics.md` — correct `docs/rubrics/` location + enumerate 12 starters + source citations
- `skills/hd-setup/references/layer-5-knowledge.md` — domain-grouped lessons + 5-memory-type taxonomy + INDEX pattern + graduations-deferred-scaffold rule
- `skills/hd-setup/references/hd-config-schema.md` (renamed) — schema v2 with the new filename, no other content changes
- `skills/hd-setup/references/coexistence-checklist.md` — update the compound-vs-ours table for renamed config
- `skills/hd-setup/references/good-agents-md-patterns.md` — no change needed
- `skills/hd-setup/references/tier-budget-model.md` — no change needed
- `skills/hd-setup/references/known-mcps.md` — no change needed

**Acceptance:**
- [ ] Each affected reference file accurately describes the new shape
- [ ] No contradictions between SKILL.md and references
- [ ] Article § citations preserved where already present

## Implementation order (one commit per part)

1. **Part E** (config rename) — global search-replace; lowest risk if done first; all subsequent work uses new name. ~15 min.
2. **Part A** (L1 template alignment) — 20 new template files + 4 deletes. ~45 min.
3. **Part B** (L5 template alignment + hd:compound capture mode update) — 6 new templates + 2 SKILL/reference edits. ~40 min.
4. **Part C** (7 new starter rubrics + refine 2 existing) — 7 new files, ~100 lines each. ~60 min.
5. **Part D** (rubrics location correction) — SKILL.md + reference edits. ~10 min.
6. **Part F** (reference file alignment) — updates to 3 reference files. ~15 min.
7. **Re-regression:** `detect.py` across 6 real repos + budget check + skill-quality rubric against our own 4 skills. ~15 min.
8. **Re-run plus-marketing-website pilot** with corrected templates + expanded rubrics. Capture as new lesson. ~30 min.

**Total: ~3 hours.** Each part is independently committable; natural pause points between parts.

## Acceptance (aggregate)

- [ ] All 6 parts land; one commit per part; Part E first
- [ ] Tier 1 budget ≤ 200 lines after all changes
- [ ] All 4 `SKILL.md` files ≤ 500 line hard cap
- [ ] 6-repo regression: all still route correctly
- [ ] `skill-quality` rubric applied to own 4 skills: 0 P1 / 0 P2 findings (or documented exceptions)
- [ ] Plus-marketing-website pilot re-runs cleanly; new lesson captured
- [ ] No references to old filename `design-harnessing.local.md` in living code
- [ ] 12 starter rubrics shipped in `skills/hd-review/assets/starter-rubrics/`

## Risks + mitigations

| Risk | Mitigation |
|---|---|
| Context-skeleton bloat pushes asset count too high for clean scaffolding UX | Keep each template file small (5–15 lines); use `{{PLACEHOLDER}}` consistently; group by topic |
| 7 new rubrics at ~100 lines each = ~700 new lines; might overwhelm browsing | All 12 cross-referenced from a single enumerated table in `layer-4-rubrics.md`; users scan table first, drill into specific rubric |
| hd:compound capture mode change is breaking for any in-flight usage | v1.0 had no shipped users (branch unpushed); no migration needed. Document in CHANGELOG [Unreleased]. |
| SKILL.md line budget blown by Layer 4 Step 7 elaboration (12 starters instead of 5) | Don't enumerate all 12 inline; reference `layer-4-rubrics.md`. SKILL.md stays under 500. |
| Part C rubric content drift from source (Impeccable may update after distillation) | `source:` frontmatter field pins the derivation date + source file; refresh is an explicit future action |

## Sources

- **Reference shape (plus-uno):**
  - [github.com/BilLogic/plus-uno/tree/main/docs/context](https://github.com/BilLogic/plus-uno/tree/main/docs/context)
  - [github.com/BilLogic/plus-uno/tree/main/docs/context/design-system](https://github.com/BilLogic/plus-uno/tree/main/docs/context/design-system)
  - [github.com/BilLogic/plus-uno/tree/main/docs/knowledge](https://github.com/BilLogic/plus-uno/tree/main/docs/knowledge)
- **Impeccable (rubric source):** [github.com/pbakaus/impeccable](https://github.com/pbakaus/impeccable) — 7 reference files under `source/skills/impeccable/reference/`
- **Nielsen 10 heuristics:** well-known; no single URL but Nielsen Norman Group canonical article
- **Material 3:** [m3.material.io/foundations](https://m3.material.io/foundations)
- **Fluent 2:** [fluent2.microsoft.design/accessibility](https://fluent2.microsoft.design/accessibility)
- **Preceding plan:** [`docs/plans/2026-04-17-010-fix-sds-pilot-gap-iteration-plan.md`](2026-04-17-010-fix-sds-pilot-gap-iteration-plan.md) (Phase 3a/3b/3c — completed)
- **Preceding pilot lesson:** [`docs/knowledge/lessons/2026-04-17-sds-re-pilot-after-phase-3a.md`](../knowledge/lessons/2026-04-17-sds-re-pilot-after-phase-3a.md)
- **Current SKILL.md:** [`skills/hd-setup/SKILL.md`](../../skills/hd-setup/SKILL.md)
