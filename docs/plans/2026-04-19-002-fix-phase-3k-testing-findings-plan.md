---
title: "Phase 3k — fix accuracy + UX issues from 5-repo testing + lock canonical harness standard"
type: fix
status: active
date: 2026-04-19
---

# Phase 3k — fix accuracy + UX + lock canonical standard

Post-v1.0.0 iteration surfaced by hands-on testing across 5 real repos on 2026-04-19: plus-vibe-coding-starting-kit, oracle-chat, caricature, dawnova/lightning, cornerstone.

## Problem summary

**P1 — audit accuracy is broken.** The harness-auditor grades on path presence, not content quality. Caricature passed L1–L3 because paths existed, though content was stale and mismatched. Budget-check.sh is hardcoded to our own plugin's layout; it misses skills in user repos that live under `.agent/skills/` or `.claude/skills/`.

**P2 — UX is too silent, too terse, and too jargon-heavy.** Users got files written before they could evaluate the structure. Audit output is a YAML wall-of-text with no at-a-glance health signal. `/hd:review` asks "audit or critique?" instead of defaulting. `hd-config.md` goes stale immediately. Terms like "tier 1" are meaningless to non-plugin authors.

**P3 — no canonical standard.** The plugin scaffolds layers but never committed to a single reference structure. Users either adopt our layout blind or get an audit that doesn't understand their layout. Need one locked standard + additive-only default for existing harnesses.

## Acceptance criteria

### P1 — audit credibility (ship-gate)

- [ ] **3k.1** `harness-auditor` grades on content quality, not path presence. Output gains `content_status: missing | present-but-stale | present-and-populated | healthy`. Empty indexes, stub files, and broken pointers fail instead of passing.
- [ ] **3k.2** `budget-check.sh` auto-detects user-repo skill locations. Probes `.agent/skills/`, `.claude/skills/`, `skills/` in priority order. Reads `loading-order.md` (or `.agent/loading-order.md`) for the real always-loaded file set when present. Emits `skill_dir_detected` + `always_loaded_contract_source` fields.
- [ ] **3k.10** Audit reads actual file content, not just structure. Checks: product one-pager references code paths that exist; design-system tokens are non-empty; rubric files have non-trivial criteria; lesson frontmatter parses; changelog entries are dated.

### P2 — UX polish

- [ ] **3k.3** `/hd:setup` Phase B shows a proposed-files table before any write. Asks "proceed?" explicitly (y / revise / cancel).
- [ ] **3k.4** `/hd:review audit` renders ASCII layer-health bars at top of report. Block chars + percentages, terminal-friendly.
- [ ] **3k.5** `/hd:review` defaults to `audit` when invoked bare. Only asks when a file path is passed without a verb.
- [ ] **3k.6** `/hd:review audit` re-runs `detect.py` and flags drift vs `hd-config.md` as a `hd-config-stale` (p2) finding.
- [ ] **3k.7** New audit check: inconsistency + redundancy detection. Flags duplicate rules across AGENTS.md vs rubrics, same concept stated two ways, contradicting rubric + rule pairs, orphan pointers (link exists, target missing), and overlapping skills.
- [ ] **3k.8** Narrated execution. `/hd:setup` + `/hd:review` explain rationale inline ("skipping L1 because `.agent/` harness owns it") instead of producing silent outputs.
- [ ] **3k.9** Plain-language copy-edit pass across all user-facing outputs + reference docs. Retire jargon including "tier 1" → "always-loaded"; "scaffold" stays but gets an inline gloss on first use; "episodic/semantic/procedural" retained but each always paired with a plain-English example.

### P3 — canonical standard

- [ ] **3k.11** `/hd:setup` offers two scaffold modes at the top of Phase B:
  - **Additive** (default when existing harness detected) — layer on top of user's layout, never move files
  - **Use standard** — scaffold the canonical structure below; diff preview before any write
- [ ] **3k.12** Lock canonical structure at `skills/hd-setup/references/standard-harness-structure.md`. One reference file defines the full tree across all 5 layers.
- [ ] **3k.13** `AGENTS.md` is the sole master index. Per-layer `INDEX.md` files retired. Template gains "Harness map" section (all 5 layers) + "Agent persona" section (role + responsibility).

### Regression bar

- [ ] All 6 original pilot repos still produce coherent audits (sds, plus-marketing-website, caricature, oracle-chat, lightning, plus-uno).
- [ ] 5 new testing repos now produce accurate audits (cornerstone reports `always_loaded_lines: 252`, not 0; caricature L1 grades `present-but-stale`; oracle-chat emits `hd-config-stale`).
- [ ] `docs/plans/hd-setup-success-criteria.md` 12/12 still pass.

---

## Canonical harness structure (3k.12 reference content)

Locked at `skills/hd-setup/references/standard-harness-structure.md`:

```
<repo-root>/
├── AGENTS.md                               # always-loaded: rules + harness map + agent persona
├── hd-config.md                            # harness config (machine-parseable)
│
├── docs/
│   ├── context/                            # ────── L1 semantic
│   │   ├── product/
│   │   │   ├── one-pager.md                # always-loaded
│   │   │   ├── users-and-personas.md
│   │   │   ├── user-journeys.md
│   │   │   ├── capability-map.md
│   │   │   ├── success-metrics.md
│   │   │   └── glossary.md
│   │   │
│   │   ├── engineering/                    # (replaces "architecture")
│   │   │   ├── system-overview.md
│   │   │   ├── tech-stack.md
│   │   │   ├── data-model.md
│   │   │   ├── api-surface.md
│   │   │   ├── deployment.md
│   │   │   ├── dev-environment.md
│   │   │   └── security-and-privacy.md
│   │   │
│   │   ├── design-system/
│   │   │   ├── index-manifest.json
│   │   │   ├── styles/
│   │   │   │   ├── color.md
│   │   │   │   ├── typography.md
│   │   │   │   ├── spacing.md
│   │   │   │   ├── iconography.md
│   │   │   │   ├── elevation.md
│   │   │   │   └── motion.md
│   │   │   ├── foundations/
│   │   │   │   ├── principles.md
│   │   │   │   ├── tokens.md
│   │   │   │   ├── accessibility.md
│   │   │   │   ├── layout.md
│   │   │   │   ├── content-voice.md
│   │   │   │   └── interaction.md
│   │   │   └── components/
│   │   │       ├── cheat-sheet.md          # always-loaded
│   │   │       ├── inventory.md
│   │   │       ├── layout-cheat-sheet.md
│   │   │       ├── patterns.md
│   │   │       └── components-index.json
│   │   │
│   │   └── conventions/
│   │       └── repo-map.md
│   │
│   ├── rubrics/                            # ────── L4 evaluation (flat; indexed in AGENTS.md)
│   │   └── <rubric-name>.md
│   │
│   └── knowledge/                          # ────── L5 episodic
│       ├── changelog.md
│       ├── decisions.md
│       ├── ideations.md
│       ├── preferences.md
│       └── lessons/
│           └── YYYY-MM-DD-slug.md
│
├── skills/                                 # ────── L2 repeatable jobs
│   └── <skill-name>/
│       ├── SKILL.md
│       ├── references/
│       ├── assets/
│       └── scripts/
│
└── agents/                                 # ────── L3 emerges from skills ↔ agents dispatch
    └── <category>/
        └── <agent-name>.md
```

**No per-layer `INDEX.md`.** AGENTS.md is the always-loaded master index for every layer. Retired per 3k.13.

**No `docs/orchestration/`.** L3 emerges from the dispatch graph between `skills/` (triggered by users) and `agents/` (invoked by skills). No separate workflow docs needed.

**Design-system coverage** derived from plus-uno + Material 3 + Fluent 2. Styles (atoms) + Foundations (rules) + Components (building blocks).

### Standard agent categories — `research / planning / generation / review / compound`

Locked at `skills/hd-setup/references/standard-agent-categories.md`:

| Category | Purpose | Examples |
|---|---|---|
| `research/` | Retrieve, cite, pattern-mine | `competitor-analyzer`, `pattern-retriever`, `user-research-synthesizer` |
| `planning/` | Structure + decompose work | `project-planner`, `roadmap-structurer`, `scope-analyzer` |
| `generation/` | Create artifacts | `copy-generator`, `component-spec-drafter`, `token-proposer` |
| `review/` | Apply rubrics, surface findings | `rubric-applier`, `design-system-auditor`, `a11y-checker` |
| `compound/` | Lesson capture + rule promotion | `lesson-clusterer`, `rule-candidate-scorer`, `drift-detector` |

**Non-enforced standard.** Users can rename, merge, add categories. Audit checks agents have valid frontmatter; does NOT check category names match this set.

---

## AGENTS.md structure (3k.13)

Retires per-layer `INDEX.md`. Template at `skills/hd-setup/assets/context-skeleton/AGENTS.md.template`:

```markdown
# <repo-name>

One-paragraph thesis.

## Agent persona

**Role.** You are an AI teammate for <role: design engineer / design-ops lead / …>.
**Responsibility.** Produce <what>: <how it's evaluated>. Defer to team rubrics in `docs/rubrics/`.
**Boundary.** Read-mostly; write only within `docs/knowledge/lessons/` or as explicitly invoked by `/hd:*` skills.

## Harness map

### L1 Context — what's always true
- `docs/context/product/` — vision, users, journeys, capabilities, metrics, glossary
- `docs/context/engineering/` — stack, data, API, deployment, dev env, security
- `docs/context/design-system/` — styles · foundations · components
- `docs/context/conventions/` — repo map + team norms

### L2 Skills — repeatable jobs
- `skills/<skill-name>/` — one-line purpose per skill

### L3 Agents — sub-agents invoked by skills
- `agents/<category>/<agent-name>` — one-line purpose per agent

### L4 Rubrics — how we judge "good"
- `docs/rubrics/<rubric-name>.md` — one-line purpose per rubric

### L5 Knowledge — what happened
- `docs/knowledge/changelog.md` · `decisions.md` · `ideations.md` · `preferences.md` · `lessons/`

## Always-loaded files (beyond AGENTS.md)
- `docs/context/product/one-pager.md`
- `docs/context/design-system/components/cheat-sheet.md`

## Rules
<!-- Promoted from lessons. Format: [YYYY-MM-DD] Rule. Source: path/to/lesson.md -->

## Pre-commit checklist
<!-- Repo-specific gates -->
```

---

## Per-issue fix notes

### 3k.1 + 3k.10 — Content-quality grading

**Files:**
- `agents/analysis/harness-auditor.md` — add `content_status` field to output shape; Phase 3 grades 4 levels, not binary
- `skills/hd-review/references/audit-criteria-l1-context.md` — add `content_checks:` per check with grep-able heuristics (e.g., "product one-pager references ≥2 code paths that exist")
- `skills/hd-review/references/audit-criteria-l2-skills.md` through `-l5-knowledge.md` — same pattern
- `skills/hd-review/references/audit-criteria-budget.md` — unchanged (already numerical)

**Gradient:** `missing` (absent) → `present-but-stale` (paths exist, content fails heuristics) → `present-and-populated` (heuristics pass) → `healthy` (populated + zero drift signals).

### 3k.2 — budget-check.sh path detection

**Files:**
- `skills/hd-review/scripts/budget-check.sh` — add `detect_skill_dir()` (probe `.agent/skills/`, `.claude/skills/`, `skills/`) and `load_always_loaded_contract()` (parse `loading-order.md` if present)
- Output JSON gains `skill_dir_detected`, `always_loaded_contract_source`, `always_loaded_lines` (renamed from `tier_1_lines`)

**Check:** cornerstone reports `always_loaded_lines: 252` + `total_skills: 6`.

### 3k.3 — Proposed-files preview

**Files:**
- `skills/hd-setup/SKILL.md` — add Step 8.5 before file writes: render proposal table, ask AskUserQuestion (fallback: numbered list)
- `skills/hd-setup/references/per-layer-procedure.md` — document the proposal-table shape

### 3k.4 — ASCII layer-health bars

**Files:**
- `skills/hd-review/assets/audit-report.md.template` — new `## Harness health` block at top
- `skills/hd-review/references/audit-procedure.md` — Step 6 renders bars; rule: `blocks_filled = round(health_score)` (0–10 → 10 blocks), filled `█`, empty `░`

### 3k.5 — audit as default

**Files:**
- `skills/hd-review/SKILL.md` — update mode-detection table. Bare → audit. Only ask when file path passed without verb.

### 3k.6 — Stale hd-config.md detection

**Files:**
- `skills/hd-review/references/audit-procedure.md` — Step 1 adds "run `detect.py`; diff against `hd-config.md`"
- `skills/hd-review/references/audit-criteria-budget.md` — add `hd-config-stale` check

### 3k.7 — Inconsistency + redundancy detection

**Files:**
- `skills/hd-review/references/audit-criteria-consistency.md` — **new** reference file
- `agents/analysis/harness-auditor.md` — add layer-agnostic check: run the consistency criteria across all layers after per-layer checks complete

**Checks:**
- Duplicate rule statement (same imperative in AGENTS.md rules + a rubric file)
- Contradicting rule + rubric (AGENTS.md says X, rubric says not-X)
- Orphan pointer (link in AGENTS.md / INDEX → target file absent)
- Overlapping skill scope (two SKILL.md files with ≥70% description overlap)
- Stale cross-reference (file A references file B; file B was moved/deleted)

### 3k.8 — Narrated execution

**Files:**
- `skills/hd-setup/SKILL.md` — each phase gains a "narration" line ("Running Phase A: pre-analysis across all 5 layers in parallel — this gives us proposals before we walk through them together")
- `skills/hd-review/SKILL.md` — audit + critique gain per-step narration
- `skills/hd-setup/references/per-layer-procedure.md` — per-layer rationale (why we're offering link vs scaffold vs skip) surfaces in the layer's step, not after the fact

### 3k.9 — Plain-language copy-edit pass

**Files (user-facing surfaces only):**
- `skills/hd-learn/references/*.md`
- `skills/hd-setup/references/*.md`, `skills/hd-setup/SKILL.md`, `skills/hd-setup/assets/context-skeleton/AGENTS.md.template`, `skills/hd-setup/assets/hd-config.md.template`
- `skills/hd-maintain/references/*.md`, `skills/hd-maintain/SKILL.md`
- `skills/hd-review/references/*.md`, `skills/hd-review/SKILL.md`, `skills/hd-review/assets/audit-report.md.template`, `skills/hd-review/assets/critique-response.md.template`

**Substitutions:**
- "tier 1" → "always-loaded"
- "tier 2" / "tier 3" → "lazy-loaded" / "archived"
- "scaffold" stays but add inline gloss on first use per file: *scaffold (write new files with starter content)*
- memory types (episodic / semantic / procedural / working) retained, always followed by plain-English gloss on first use

### 3k.11 — Setup scaffold mode choice

**Files:**
- `skills/hd-setup/SKILL.md` — add mode branch at start of Phase B: **Additive** (default when existing harness detected) vs **Use standard** (propose canonical tree, diff preview, explicit confirm)
- `skills/hd-setup/references/per-layer-procedure.md` — document both modes' paths

### 3k.12 — Canonical standard reference

**New file:** `skills/hd-setup/references/standard-harness-structure.md` with the tree above + rationale for each layer's contents + explicit statement that user deviation is allowed (not enforced by audit).

**New file:** `skills/hd-setup/references/standard-agent-categories.md` with the 5 categories (`research / planning / generation / review / compound`) + examples + flexibility note.

### 3k.13 — AGENTS.md master index

**Files:**
- `skills/hd-setup/assets/context-skeleton/AGENTS.md.template` — rewrite to include Agent persona + Harness map + Always-loaded files + Rules + Pre-commit (see structure above)
- `skills/hd-setup/references/per-layer-procedure.md` — Layer 1 step now writes into AGENTS.md "Harness map" section, not a separate `docs/context/INDEX.md`
- Audit criteria updated: `INDEX.md` checks removed; replaced by "AGENTS.md has Harness map section covering all 5 layers"

---

## Implementation order

1. **3k.5** (30 min) — `/hd:review` default mode; SKILL.md copy edit
2. **3k.12** (1 hr) — lock canonical structure + agent categories references (needed by later items)
3. **3k.13** (1 hr) — AGENTS.md template + retire per-layer INDEX.md (informs 3k.1 audit checks)
4. **3k.2** (2–3 hrs) — budget-check.sh path detection
5. **3k.1 + 3k.10** (half day) — 4-level content-quality grading + content reads
6. **3k.6** (1 hr) — stale hd-config.md detection
7. **3k.7** (2 hrs) — inconsistency + redundancy check
8. **3k.4** (1 hr) — ASCII layer-health bars
9. **3k.3** (1 hr) — proposed-files preview
10. **3k.11** (1 hr) — scaffold mode branch
11. **3k.8** (1 hr) — narrated execution pass
12. **3k.9** (half day) — plain-language copy-edit pass (run last so we don't copy-edit words we're about to rewrite)
13. **Regression pass** — audits on all 11 repos (6 original + 5 new)

## Verification

- [ ] Cornerstone: `always_loaded_lines: 252`, `total_skills: 6`, `skill_dir_detected: .agent/skills/`
- [ ] Caricature L1: `content_status: present-but-stale` (README references files that don't exist)
- [ ] Oracle-chat audit: emits `hd-config-stale` finding
- [ ] Bare `/hd:review`: runs audit immediately, no fork question
- [ ] `/hd:setup` in greenfield: shows proposal table before writing
- [ ] Audit on plus-uno: starts with 5-row ASCII health-bar block
- [ ] `AGENTS.md` generated by `/hd:setup` includes Agent persona section + Harness map covering all 5 layers
- [ ] No `INDEX.md` written by `/hd:setup` (retired)
- [ ] Grep across shipped prose: zero `"tier 1"` references outside historical CHANGELOG/lesson entries
- [ ] All 6 original pilot repos still produce coherent audits (regression bar)

## Out of scope

- Writing the plugin's own `docs/context/` scaffold (our repo already has AGENTS.md; not rewriting it here)
- Adding a sixth layer or renaming existing layers (Layer names stay: Context / Skill Curation / Workflow Orchestration / Rubric Setting / Knowledge Compounding)
- Auto-fixing audit findings (read-only invariant preserved)
- Figma/design-deliverable critique (remains out of plugin scope)
