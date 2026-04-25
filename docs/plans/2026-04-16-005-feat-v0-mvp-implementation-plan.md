---
title: v0.MVP Implementation Plan — Four-Skill Design Harness Plug-in
type: feat
status: active
date: 2026-04-16
origin: docs/plans/2026-04-16-003-design-harness-plugin-v0.4-four-skills.md
---

# v0.MVP Implementation Plan — Four-Skill Design Harness Plug-in

## Overview

Canonical, buildable-today implementation plan for the v0.MVP release of the `design-harness` Claude Code plug-in. Four-skill taxonomy and flat single-plug-in file structure are **LOCKED** per session decisions 2026-04-16 (see origin: `docs/plans/2026-04-16-003-design-harness-plugin-v0.4-four-skills.md` + session supersessions).

v0.MVP ships **two fully-built skills** — `hd:onboard` (learn) and `hd:setup` (setup). Two further skills (`hd:compound`, `hd:review`) are reserved in the taxonomy but NOT scaffolded on disk at v0.MVP — stubs would be worse than absent (`/ce:review` 2026-04-16 finding).

This plan supersedes `2026-04-16-004-feat-skill-taxonomy-design-plan.md` which had a rejected 6-skill split (`hd:graduate`, `hd:critique` were over-splits; both fold back into parent skills).

## Problem Statement

Four concrete constraints collide:

1. **Structural.** The current scaffold uses a nested `plugins/design-harness/` layout suited to a multi-plug-in marketplace repo. We ship one plug-in. The nesting is marketplace-shape ceremony — flatten to repo root.
2. **Distribution.** Plug-in must submit to three marketplaces simultaneously: Claude Code, Codex CLI, Cursor. Requires three sibling manifests at the same plug-in root. Current scaffold has only `.claude-plugin/` + `.cursor-plugin/`.
3. **Skill structure.** Current `hd-onboard/references/` has 9 files with aggressive consolidation that kills progressive disclosure. Current `hd-setup/references/` has 3 files that conflate concept-and-action. Both violate Anthropic's "atomic topical knowledge, one concept per file" rule.
4. **Dogfood.** Plug-in claims to advocate five-layer harnesses, but repo has no harness on itself. Need `docs/context/`, `docs/knowledge/`, `docs/rubrics/` at repo root as meta-harness running the plug-in's own advocacy.

Plan addresses all four in one coordinated pass to avoid partial-state inconsistency.

## Proposed Solution

Three phases, ~14 hours total:

| Phase | Scope | Time | Outcome |
|---|---|---|---|
| **Phase 1** | Structural refactor: flatten repo + add Codex manifest + Cursor IDE rules + delete stubs + delete superseded PRDs | ~2h | Target tree shape; no skill content changes |
| **Phase 2** | Skill content build: `hd-onboard` (11 files) + `hd-setup` (24 files) per spec | ~10h | Two shippable v0.MVP skills with atomic references, actionable workflows, working scripts |
| **Phase 3** | Meta-harness `docs/` scaffold + verification + README + CHANGELOG finalize | ~2h | Dogfood evidence, compliance clean, ship-ready |

### Guiding principles (LOCKED)

1. **Single job per skill.** Anthropic rule. `hd:onboard` answers questions (no writes). `hd:setup` scaffolds (writes templates).
2. **Atomic references.** One topic per reference file. Loaded on demand via contextual links in SKILL.md. No bottom "Reference Files" dump.
3. **Third-person descriptions ≤180 chars.** Every SKILL.md frontmatter. No `I` or `you`.
4. **SKILL.md ≤200 lines.** Router pattern. Overflow to references/workflows.
5. **One-level reference links.** `[foo.md](references/foo.md)` only. No nested paths. No bare backticks.
6. **Fully-qualified cross-plug-in Task calls.** Never bare. `compound-engineering:review:pattern-recognition-specialist`.
7. **No `disable-model-invocation: true`** unless genuinely manual-only. Let descriptions constrain triggers.
8. **`hd:` prefix on every slash command.** Always namespaced.
9. **`docs/design-solutions/` reserved for future hd-compound output** (v0.5+). Never writes to `docs/solutions/` (compound's namespace).
10. **AskUserQuestion fallback preamble** in every SKILL.md — 5 lines explaining numbered-list fallback for non-Claude hosts.

## Technical Approach

### Target architecture

```
design-harnessing-plugin/                          # repo root = plug-in payload (FLAT)
├── .claude-plugin/plugin.json                    # Claude Code marketplace
├── .codex-plugin/plugin.json                     # Codex CLI (NEW)
├── .cursor-plugin/plugin.json                    # Cursor marketplace
├── .cursor/rules/AGENTS.mdc                      # Cursor IDE redirect → AGENTS.md (NEW)
├── AGENTS.md                                     # universal source; Codex/Windsurf/Copilot/Cursor-CLI read natively
├── CLAUDE.md                                     # @AGENTS.md (1 line)
├── CHANGELOG.md                                  # keep-a-changelog
├── LICENSE                                       # MIT
├── README.md                                     # public-facing: thesis + install + tree + article link
│
├── docs/                                         # META-HARNESS for this plug-in (dogfood)
│   ├── context/
│   │   ├── agent-persona.md
│   │   ├── product/one-pager.md
│   │   ├── design-system/cheat-sheet.md
│   │   └── conventions/how-we-work.md
│   ├── knowledge/
│   │   ├── INDEX.md
│   │   ├── graduations.md
│   │   └── lessons/
│   │       ├── 2026-04-16-every-plugin-teardown.md
│   │       ├── 2026-04-16-anthropic-skill-guide-takeaways.md
│   │       └── 2026-04-16-button-variants-escape-hatch.md
│   ├── rubrics/INDEX.md
│   └── plans/ (kept: 003, 005, three scenario docs)
│
└── skills/
    ├── hd-onboard/                               # v0.MVP — LEARN
    │   ├── SKILL.md
    │   └── references/ (10 atomic files)
    │
    └── hd-setup/                                 # v0.MVP — SETUP
        ├── SKILL.md
        ├── references/ (5 layer-specific + 4 shared = 9 files)
        ├── workflows/ (greenfield.md, scattered.md, advanced.md)
        ├── templates/
        │   ├── AGENTS.md.template
        │   ├── design-harnessing.local.md.template
        │   ├── context-skeleton/ (4 .template files)
        │   └── knowledge-skeleton/ (3 files)
        └── scripts/detect-mode.sh
```

**NOT PRESENT at v0.MVP** (no stubs):
- `skills/hd-compound/` (v0.5)
- `skills/hd-review/` (v1)
- `agents/` (empty — zero sub-agents shipped)
- `CONTRIBUTING.md` (single-author repo; no contribution pipeline)
- `.claude-plugin/marketplace.json` (single plug-in, not marketplace-shape)

### Implementation Phases

#### Phase 1 — Structural refactor (~2h)

**Goal:** repo structure matches target tree. No skill content changes. No new reference content yet.

Sub-tasks in execution order (numbered `P1.N`):

**P1.1 — Move plug-in payload to repo root (~30 min)**

```bash
# From worktree root
mv plugins/design-harness/.claude-plugin .
mv plugins/design-harness/.cursor-plugin .
mv plugins/design-harness/AGENTS.md ./plugin-AGENTS.md.tmp   # stash; will merge
mv plugins/design-harness/CLAUDE.md .
mv plugins/design-harness/CHANGELOG.md .
mv plugins/design-harness/LICENSE .
mv plugins/design-harness/README.md ./plugin-README.md.tmp   # stash; will merge
mv plugins/design-harness/skills .
rm -rf plugins/
```

**P1.2 — Merge and rewrite root-level AGENTS.md + README.md (~30 min)**

- Delete old repo-root `AGENTS.md`. Replace with merged plug-in-level content from `plugin-AGENTS.md.tmp`. Update all paths from `plugins/design-harness/skills/...` → `skills/...`. Remove the "These instructions apply when working under `plugins/design-harness/`" preamble (flat now).
- Delete old repo-root `README.md` (has "cursor" stub + separately my rewrite). Replace with merged content from `plugin-README.md.tmp`. Strip the "Install from the root of the repository" section (root IS the plug-in now).
- Delete both `.tmp` files.

**P1.3 — Delete superseded/empty artifacts (~10 min)**

```bash
rm -rf skills/hd-compound/   # v0.5 stub — worse than absent
rm -rf skills/hd-review/     # v1 stub — worse than absent
rm -f docs/plans/2026-04-16-001-design-harness-plugin-v0.2-baseline.md
rm -f docs/plans/2026-04-16-002-design-harness-plugin-v0.3-deepened.md
rm -f docs/plans/2026-04-16-004-feat-skill-taxonomy-design-plan.md
rm -f .claude-plugin/marketplace.json   # single-plug-in; not marketplace-shape
```

**P1.4 — Delete current skill content (will rebuild in Phase 2) (~10 min)**

```bash
# hd-onboard — rebuild references with 10 atomic files
rm -f skills/hd-onboard/SKILL.md
rm -rf skills/hd-onboard/references/

# hd-setup — rebuild references (9 files) + workflows + templates
rm -f skills/hd-setup/SKILL.md
rm -rf skills/hd-setup/references/
rm -rf skills/hd-setup/workflows/
rm -rf skills/hd-setup/templates/
rm -rf skills/hd-setup/scripts/
```

**P1.5 — Create new manifest files (~20 min)**

- `.codex-plugin/plugin.json` — Codex CLI manifest (NEW; see spec in [Per-File Specification](#per-file-specification))
- `.cursor/rules/AGENTS.mdc` — Cursor IDE thin redirect with YAML frontmatter + body reference to AGENTS.md (NEW)
- Update `.claude-plugin/plugin.json` — remove marketplace-specific fields if any; align version `0.1.0`; confirm description ≤180 chars
- Update `.cursor-plugin/plugin.json` — align with Claude + Codex descriptions; add `displayName: "Design Harness"`

**P1.6 — Skeleton directory scaffolding (~10 min)**

```bash
# Skill dirs + subdirs (empty ready for Phase 2)
mkdir -p skills/hd-onboard/references
mkdir -p skills/hd-setup/{references,workflows,templates/{context-skeleton/product,context-skeleton/design-system,context-skeleton/conventions,knowledge-skeleton/lessons},scripts}

# Meta-harness docs (Phase 3 populates)
mkdir -p docs/context/{product,design-system,conventions}
mkdir -p docs/knowledge/lessons
mkdir -p docs/rubrics
```

**P1.7 — Update CHANGELOG (~10 min)**

Append `[Unreleased]` entries:
```markdown
### Changed
- Flattened plug-in structure from `plugins/design-harness/*` to repo root (single-plug-in repo; no marketplace-shape nesting).
- Deleted `hd-compound` and `hd-review` v0.5/v1 stubs; will author for their respective releases.

### Added
- `.codex-plugin/plugin.json` sibling manifest (Codex CLI submission).
- `.cursor/rules/AGENTS.mdc` thin redirect for Cursor IDE.

### Removed
- Nested `plugins/design-harness/` directory.
- `.claude-plugin/marketplace.json` (single plug-in; not marketplace).
- Superseded PRD drafts (v0.2 baseline, v0.3 deepened, 004 taxonomy — preserved in git history).
```

**Phase 1 acceptance:**
- [ ] `find . -type d -name "plugins" -not -path "./.git/*"` → empty
- [ ] Three manifest files at repo root: `.claude-plugin/plugin.json`, `.codex-plugin/plugin.json`, `.cursor-plugin/plugin.json`
- [ ] `AGENTS.md`, `CLAUDE.md`, `CHANGELOG.md`, `LICENSE`, `README.md` at repo root
- [ ] `skills/` contains only `hd-onboard/` and `hd-setup/` (empty SKILL.md and subdirs)
- [ ] `docs/plans/` contains 5 files (003 origin, 005 this plan, 3 scenario docs)
- [ ] `docs/context/`, `docs/knowledge/`, `docs/rubrics/` dirs exist (empty ready)

#### Phase 2 — Skill content build (~10h)

**Goal:** two fully-implemented v0.MVP skills per spec with atomic references, actionable workflows, shippable templates.

##### Phase 2a — `hd-onboard` (~4h, 11 files)

Build order (references first so SKILL.md router can link to them accurately):

**P2a.1 — `references/concept-overview.md` (~30 min)**
- Purpose: "What is a design harness?" high-level answer
- Source content: article §2 (five-layer frame) + §3 (why this matters)
- ~80 lines
- Self-contained; no external loads

**P2a.2 — `references/memory-taxonomy.md` (~20 min)**
- Purpose: explain procedural / semantic / episodic / working memory mapping to layers
- Source: article §2.5
- ~60 lines
- Table of 4 memory types × example + article § anchor

**P2a.3 through P2a.7 — Layer explainers (~20 min each × 5 = ~100 min)**
- `references/layer-1-context.md` — Context layer deep (§4a)
- `references/layer-2-skills.md` — Skills layer deep (§4b)
- `references/layer-3-orchestration.md` — Orchestration deep (§4c)
- `references/layer-4-rubrics.md` — Rubrics deep (§4d; distributed pattern)
- `references/layer-5-knowledge.md` — Knowledge deep (§4e)
- Each: what the layer IS, examples, what BELONGS vs what DOESN'T, article § anchor, ~50-70 lines

**P2a.8 — `references/glossary.md` (~20 min)**
- Purpose: term lookups — harness, rubric, graduation, procedural/semantic/episodic/working memory, tier-1/2/3, skill curation
- Table format
- ~40 lines

**P2a.9 — `references/faq.md` (~30 min)**
- Purpose: 10 canonical questions with article-§-cited answers
- Sourced from "open tensions" (article §6) + anticipated reader confusion
- ~120 lines (10 Q&A × ~12 lines avg)

**P2a.10 — `references/coexistence-with-compound.md` (~20 min)**
- Purpose: how hd-* differs from ce-*; why both can coexist
- Include the one-paragraph positioning: "Every built the engineering version. We're building the design version. Same move, different domain."
- ~40 lines

**P2a.11 — `SKILL.md` router (~30 min)**
- Purpose: entry point; YAML frontmatter + concise body that links to references contextually (not bottom-dump)
- Body ≤150 lines
- Structure:
  - Interaction Method (AskUserQuestion fallback preamble) — 5 lines
  - Workflow (5-step identify → load → answer → cite → close) — 20 lines
  - Example interactions — 2 examples with expected reference loads — 30 lines
  - What this skill does NOT do + handoffs to `/hd:setup` — 15 lines
  - Links to references appear INLINE in relevant sections, not in a closing dump
  - Single closing Sources section — 10 lines
- Frontmatter:
  ```yaml
  ---
  name: hd:onboard
  description: Answers questions about the five-layer design harness framework. Use when learning concepts, asking about a layer, or orienting before setup.
  ---
  ```
  (157 chars — ≤180 ✓; no `disable-model-invocation: true` per locked principle 7)

**Phase 2a acceptance:**
- [ ] 11 files total under `skills/hd-onboard/`
- [ ] Every reference file is atomic (one topic, 40-120 lines)
- [ ] SKILL.md ≤150 lines
- [ ] Every frontmatter field compliant (name, description ≤180 chars, no reserved names)
- [ ] No bare-backtick references
- [ ] No nested reference paths
- [ ] `grep -r "§" skills/hd-onboard/` returns ≥20 hits (citations across files)

##### Phase 2b — `hd-setup` (~6h, 24 files)

Build order:

**P2b.1 through P2b.5 — Layer-specific references (~20 min each × 5 = ~100 min)**

Each layer reference answers: how do I SCAFFOLD this layer? (action-oriented, NOT concept-oriented; conceptual explanation lives in `hd-onboard/references/layer-N-*.md`).

- `references/layer-1-context.md` — scaffolding guide for Context: what files, what budget, what goes where
- `references/layer-2-skills.md` — patterns for scaffolding Skills layer (relevant for advanced-mode audit; v0.MVP workflows don't actively write this)
- `references/layer-3-orchestration.md` — Orchestration patterns
- `references/layer-4-rubrics.md` — distributed-pattern scaffolding (INDEX.md pointer + rubric execution target)
- `references/layer-5-knowledge.md` — Knowledge scaffolding (lessons/, graduations.md, INDEX.md)
- Each ~60-100 lines
- Explicitly cross-references `hd-onboard/references/layer-N-*.md` for concept explanation via inline note (avoids duplication)

**P2b.6 — `references/tier-budget-model.md` (~20 min)**
- Purpose: three-tier context loading model + Tier 1 ≤200 lines rule
- Concrete check: `wc -l AGENTS.md` + `wc -l docs/context/product/one-pager.md`
- ~80 lines

**P2b.7 — `references/good-agents-md-patterns.md` (~30 min)**
- Purpose: what a healthy AGENTS.md looks like + 3 anti-patterns
- Example excerpts (good + bad)
- ~100 lines

**P2b.8 — `references/coexistence-checklist.md` (~20 min)**
- Purpose: compound-engineering collision rules applied during setup
- Checklist format: detect `~/.claude/plugins/cache/compound-engineering-plugin/` → if present, apply rules (namespace isolation, fully-qualified Task calls, etc.)
- ~60 lines

**P2b.9 — `references/local-md-schema.md` (~20 min)**
- Purpose: `design-harnessing.local.md` YAML frontmatter spec (machine-parseable by every hd-* skill, present and future)
- ~50 lines
- **Full schema (LOCKED — downstream skills depend on stability):**
  ```yaml
  ---
  # Required
  schema_version: "1"                                # semver major; bump on breaking changes
  setup_mode: greenfield | scattered | advanced | localize
  setup_date: 2026-04-16                             # ISO date; last mutation
  team_size: solo | small | medium | large           # <2 | 2-5 | 5-20 | 20+
  # Optional — omit field if unknown
  skipped_layers: [1, 2, 3, 4, 5]                    # int list; which layers user declined to scaffold
  coexistence:
    compound_engineering: true | false               # detected at setup time
  article_read: true | false                         # self-reported; never blocking
  # Free-form section (consumed by humans, not skills)
  notes: |
    Any human prose about this harness.
  ---

  # design-harnessing — local config

  Prose section for humans. Skills only read the YAML frontmatter above.
  ```
- **Validation rules (enforced by any skill that reads this file):**
  - YAML parses
  - `schema_version` present and string-typed
  - `setup_mode` is one of the 4 enum values
  - `setup_date` matches `YYYY-MM-DD`
  - `team_size` is one of the 4 enum values
  - Missing optional fields default to: `skipped_layers: []`, `coexistence.compound_engineering: false`, `article_read: false`
- **Breaking changes require bumping `schema_version`** and providing a migration path; keep v0.MVP on `schema_version: "1"`.

**P2b.10 through P2b.12 — Workflows (~30 min each × 3 = ~90 min)**

- `workflows/greenfield.md` — 8-step scaffold from zero (checklist format; references template paths explicitly)
- `workflows/scattered.md` — 7-step inventory → classify → diff-preview → apply (always backup-before-modify; no silent overwrites)
- `workflows/advanced.md` — 6-step light audit (emits report to `docs/knowledge/lessons/harness-audit-YYYY-MM-DD.md`; no writes elsewhere)
- Each ~100-150 lines

**P2b.13 through P2b.17 — Templates (~15 min each × 5 = ~75 min)**

- `templates/AGENTS.md.template` — scaffolded at user's repo root; `{{TEAM_NAME}}`, `{{PRODUCT_ONE_LINER}}`, `{{DATE}}` placeholders
- `templates/design-harnessing.local.md.template` — YAML frontmatter + body; machine-parseable by subsequent skills
- `templates/context-skeleton/agent-persona.md.template`
- `templates/context-skeleton/product/one-pager.md.template`
- `templates/context-skeleton/design-system/cheat-sheet.md.template`
- `templates/context-skeleton/conventions/how-we-work.md.template`
- `templates/knowledge-skeleton/INDEX.md.template`
- `templates/knowledge-skeleton/graduations.md.template`
- `templates/knowledge-skeleton/lessons/.gitkeep` (empty marker)

Each template 20-50 lines; placeholders documented; human-friendly defaults.

**P2b.18 — `scripts/detect-mode.sh` (~45 min)**
- Purpose: deterministic mode detection; emits parseable JSON to stdout
- ~80 lines bash
- Exit code 0 on success; non-zero on JSON-generation error (never on "no mode found" — that's `greenfield`)
- **Portability note:** requires bash 3.2+ (macOS/Linux default). If Codex CLI environments lack bash, router in SKILL.md falls back to prose instructions (documented in `references/modes.md`).
- **Detection priority (first match wins):**
  1. `design-harnessing.local.md` exists at repo root → `advanced`
  2. `grep -r "{{" .` ≥3 hits → `localize`
  3. Full layer folders present (`docs/context/` + `docs/knowledge/`) → `advanced`
  4. Any AI doc present (`AGENTS.md`, `CLAUDE.md`, `.cursor/rules/`, `.windsurf/rules/`, `.github/copilot-instructions.md`, `DESIGN.md`) → `scattered`
  5. Single file >500 lines OR combined AI-docs total >200 lines → `scattered` (sets `bloat_overlay: true`)
  6. None of the above → `greenfield`
- **Coexistence overlay (independent of primary mode):** presence of `~/.claude/plugins/cache/compound-engineering-plugin/` sets `coexistence.compound_engineering: true`
- **LOCKED JSON output shape** (router parses this exactly — do not change without bumping router):
  ```json
  {
    "schema_version": "1",
    "mode": "greenfield",
    "priority_matched": 6,
    "signals": {
      "has_local_md": false,
      "has_placeholders": false,
      "has_layer_folders": false,
      "has_ai_docs": false,
      "has_bloat": false
    },
    "coexistence": {
      "compound_engineering": false
    },
    "bloat_overlay": false,
    "detected_at": "2026-04-16T00:00:00Z"
  }
  ```
- All fields REQUIRED in output (router assumes presence). `mode` values: one of the 4 enum values matching `local-md-schema.md` `setup_mode`. `priority_matched` is the 1–6 rule that fired.

**P2b.19 — `SKILL.md` router (~45 min)**
- Purpose: entry point; mode detection → workflow dispatch
- Body ≤200 lines
- Structure:
  - Interaction Method preamble — 5 lines
  - What this skill does (overview) — 15 lines
  - Workflow checklist (6-step with copy-into-response pattern) — 30 lines
  - Step details: detect mode → confirm → route → walk layers → write local.md → summarize — 80 lines (with inline links to references/workflows/templates/scripts)
  - What this skill does NOT do + handoffs — 20 lines
  - Coexistence rules reminder — 15 lines
  - Closing Reference/Workflow/Template/Script index — 15 lines
- Frontmatter:
  ```yaml
  ---
  name: hd:setup
  description: Scaffolds a five-layer design harness in the current repo. Adapts to greenfield, scattered, or existing-harness starting state.
  argument-hint: "[greenfield | scattered | advanced | auto]"
  ---
  ```
  (141 chars ✓; `argument-hint` quoted — YAML special char safety per compound 2.36.0)

**Phase 2b acceptance:**
- [ ] 24 files total under `skills/hd-setup/` (1 SKILL.md + 9 references + 3 workflows + ~10 templates + 1 script)
- [ ] `detect-mode.sh` is executable (`chmod +x`) and emits valid JSON on all 6 scenarios
- [ ] Each workflow ≤150 lines
- [ ] Each template has documented placeholders
- [ ] SKILL.md ≤200 lines; all reference/workflow/template/script paths one-level-deep
- [ ] `bash -n skills/hd-setup/scripts/detect-mode.sh` passes (no syntax errors)
- [ ] Contextual (not bottom-dumped) links to references

#### Phase 3 — Meta-harness + verification (~2h)

**Goal:** repo dogfoods the plug-in's own advocacy; verifications pass; README + CHANGELOG ship-ready.

**P3.1 — `docs/context/*` meta-harness (Layer 1) (~20 min)**

- `docs/context/agent-persona.md` — how AI should behave when coding on this plug-in (concise, voice, defaults)
- `docs/context/product/one-pager.md` — what design-harness is, for whom, core thesis
- `docs/context/design-system/cheat-sheet.md` — file naming, frontmatter discipline, reference-link rules
- `docs/context/conventions/how-we-work.md` — commit style, branch discipline, PR flow (even if solo, documented)

Each ~30-50 lines; Tier 1 budget total ≤200 lines combined.

**P3.2 — `docs/knowledge/*` meta-harness (Layer 5) (~30 min)**

- `docs/knowledge/INDEX.md` — 1 paragraph explainer + links
- `docs/knowledge/graduations.md` — meta-log; one seeded entry (button-variant example below)
- `docs/knowledge/lessons/2026-04-16-every-plugin-teardown.md` — lesson from reading compound's installed cache
- `docs/knowledge/lessons/2026-04-16-anthropic-skill-guide-takeaways.md` — lesson from Anthropic best-practices docs
- `docs/knowledge/lessons/2026-04-16-button-variants-escape-hatch.md` — canonical graduation example (P0.4 requirement)

Each lesson ~30-60 lines following the template from `hd-setup/templates/knowledge-skeleton/`.

**P3.3 — `docs/rubrics/INDEX.md` (~10 min)**

Thin pointer (~15 lines):
```markdown
# Rubrics Index

Rubrics are a **behavior of the system**, not a folder. They live distributed across the harness:
- **Definitions** → `docs/context/design-system/` (what "good" looks like)
- **Execution** → `skills/hd-review/` (v1 — audit + critique applies them)
- **Enforcement** → `AGENTS.md` as quality gates

See article §4d for the reasoning.
```

**P3.4 — Graduation example as Layer 5 proof (~20 min)**

The button-variant-escape-hatch lesson graduates. Produce the paired artifacts:
- Lesson: `docs/knowledge/lessons/2026-04-16-button-variants-escape-hatch.md` (the narrative)
- Rule: one line in `AGENTS.md` "Graduated rules" section: `- [2026-04-16] Button variants limited to approved set; new variants require RFC. Source: docs/knowledge/lessons/2026-04-16-button-variants-escape-hatch.md`
- Meta-entry: one line in `docs/knowledge/graduations.md` with date + link to lesson + link to rule

This is the plug-in's dogfood proof — the lifecycle visible in repo itself.

**P3.5 — README update (~20 min)**

Replace current README with 4-section version per PRD v0.4 P0.7′:
1. One-sentence thesis
2. Annotated file tree
3. `git clone` install (explicit: path to plug-in = repo root)
4. Link to article (placeholder TBD URL)

Target 120-250 lines per 2026 plug-in README norm.

**P3.6 — Verification + CHANGELOG finalize (~40 min)**

Run compliance grep suite + manifest validation + tree diff vs spec (see [Verification Steps](#verification-steps)). Then move `[Unreleased]` CHANGELOG entries to `[0.1.0] - pending v0.MVP ship`.

**Phase 3 acceptance:**
- [ ] `docs/context/` has 4 files, combined ≤200 lines (Tier 1 compliance)
- [ ] `docs/knowledge/lessons/` has ≥3 dated lesson files
- [ ] `docs/knowledge/graduations.md` has ≥1 entry
- [ ] `AGENTS.md` "Graduated rules" section has ≥1 rule traceable to a lesson
- [ ] `docs/rubrics/INDEX.md` exists as thin pointer
- [ ] README.md is 4 sections, 120-250 lines
- [ ] All compliance grep checks pass (see Verification)
- [ ] Tree on disk matches spec byte-identical

## Per-File Specification

Detailed spec for every file created in Phases 1-3. Grouped by directory.

### Manifest files

#### `.claude-plugin/plugin.json`
Purpose: Claude Code marketplace manifest.
```json
{
  "name": "design-harness",
  "version": "0.1.0",
  "description": "Design-focused AI harness. 2 skills for learning and setting up a five-layer design harness (Context, Skills, Orchestration, Rubrics, Knowledge).",
  "author": { "name": "Bill Guo", "url": "https://github.com/BilLogic" },
  "homepage": "https://github.com/BilLogic/design-harnessing-plugin",
  "repository": "https://github.com/BilLogic/design-harnessing-plugin",
  "license": "MIT",
  "keywords": ["design", "design-harness", "design-systems", "context-engineering", "knowledge-management", "compound-engineering", "ai-workflows"]
}
```
Description char count: 172 (≤180 ✓ — matches hd-onboard+hd-setup skills shipped at v0.MVP).

#### `.codex-plugin/plugin.json` (NEW)
Purpose: Codex CLI directory submission. Same SKILL.md tree serves both Claude + Codex.
```json
{
  "name": "design-harness",
  "version": "0.1.0",
  "displayName": "Design Harness",
  "description": "Design-focused AI harness. 2 skills for learning and setting up a five-layer design harness.",
  "developerName": "Bill Guo",
  "license": "MIT",
  "skills": "./skills",
  "category": "design",
  "capabilities": ["scaffold", "explain", "audit"]
}
```
Exact schema depends on Codex CLI directory spec at submission time; above is placeholder matching earlier research (Codex CLI plug-in format).

#### `.cursor-plugin/plugin.json`
Purpose: Cursor marketplace manifest.
```json
{
  "name": "design-harness",
  "version": "0.1.0",
  "displayName": "Design Harness",
  "description": "Design-focused AI harness. 2 skills for learning and setting up a five-layer design harness.",
  "author": { "name": "Bill Guo" },
  "license": "MIT"
}
```
Description aligned with Claude + Codex siblings.

### Cursor IDE rules

#### `.cursor/rules/AGENTS.mdc`
Purpose: thin redirect for Cursor IDE extension (not CLI; CLI reads AGENTS.md natively).
```markdown
---
description: Design Harness plug-in conventions. See AGENTS.md at repo root.
globs: "**/*"
alwaysApply: true
---

# Design Harness Conventions

All conventions for this plug-in live in [AGENTS.md](../../AGENTS.md) at the repo root. Load that file for skill authoring rules, coexistence discipline with compound-engineering, and reference-link syntax.

This file exists so Cursor IDE (which reads `.cursor/rules/*.mdc` natively) picks up the conventions. Cursor CLI, Claude Code, Codex CLI, Windsurf, and GitHub Copilot all read `AGENTS.md` natively and don't need this redirect.
```
~15 lines.

### Root-level documentation

#### `AGENTS.md`
Purpose: universal source of truth for plug-in conventions + contributor rules. Read natively by Claude Code, Codex CLI, Cursor CLI, Windsurf, GitHub Copilot.
Content structure (~180-200 lines):
- Philosophy (1 paragraph)
- Directory structure (tree)
- Command naming convention (`hd:` prefix rule + secondary read "harness design" / "high-definition design")
- Coexistence with compound-engineering (table of namespace rules)
- Skill compliance checklist (frontmatter, reference links, line budget, style, markdown lint)
- Skill authoring references (pointers to Anthropic docs + compound's `create-agent-skills/`)
- Semantic split vocabulary (references=READ, workflows=FOLLOW, templates=COPY+FILL, scripts=EXECUTE)
- Pre-commit checklist (version-bump rules, count accuracy, markdown lint, coexistence checks)
- Graduated rules section (for P3.4 dogfood graduation)

#### `CLAUDE.md`
Purpose: Claude Code reads this first; forward to AGENTS.md.
```
@AGENTS.md
```
1 line. Exact compound pattern.

#### `CHANGELOG.md`
Purpose: keep-a-changelog format; release notes.
- `[Unreleased]` section during Phases 1-3
- `[0.1.0] - pending v0.MVP ship` at end of Phase 3

#### `LICENSE`
Purpose: MIT license.
Standard MIT boilerplate with `Copyright (c) 2026 Bill Guo`.

#### `README.md`
Purpose: public-facing marketing + install. 4 sections.
Structure:
1. **Thesis** (3-5 sentences) — what the plug-in does + philosophical cousin to compound
2. **File tree** — annotated tree (simplified from full spec; ~20 lines)
3. **Install** — `git clone` (v0.MVP) + marketplace command (v1; marked as "coming soon")
4. **Link back to article** — CTA to Substack article series

~180 lines.

### skills/hd-onboard/ — 11 files

#### `SKILL.md`
- ≤150 lines
- Frontmatter: `name: hd:onboard`, description 157 chars
- Sections: Interaction Method, Workflow, Example interactions, What-NOT-to-do, Closing Sources

#### `references/concept-overview.md`
- ~80 lines
- "What is a design harness?" — distilled from article §2 + §3
- No external loads (self-contained)

#### `references/memory-taxonomy.md`
- ~60 lines
- Procedural / semantic / episodic / working memory
- Table + article §2.5 anchor

#### `references/layer-1-context.md` through `references/layer-5-knowledge.md`
- ~50-70 lines each
- Per-layer deep explainer
- Format: What it IS / What BELONGS here / What DOESN'T / How layered with others / Article § anchor

#### `references/glossary.md`
- ~40 lines
- Term → definition table (harness, rubric, graduation, 4 memory types, tier-1/2/3, skill curation, orchestration, handoff, gate, progressive disclosure, meta-harness)

#### `references/faq.md`
- ~120 lines
- 10 canonical questions with article-§-cited answers
- Sourced from article §6 "open tensions" + anticipated reader confusion

#### `references/coexistence-with-compound.md`
- ~40 lines
- How hd-* differs from ce-*
- Namespace isolation rules (summary; detailed rules in `AGENTS.md`)

### skills/hd-setup/ — 24 files

#### `SKILL.md`
- ≤200 lines
- Frontmatter: `name: hd:setup`, description 141 chars, `argument-hint: "[greenfield | scattered | advanced | auto]"` (YAML-quoted)
- Sections: Interaction Method, What this does, Workflow checklist (copy-into-response), Step details with inline refs, What-NOT-to-do + handoffs, Coexistence rules reminder, Reference/Workflow/Template/Script index

#### `references/` — 9 files

**Layer-specific (5):**
- `references/layer-1-context.md` — scaffolding guide for Context (~60-80 lines, action-oriented)
- `references/layer-2-skills.md` — Skills scaffolding patterns (~60 lines)
- `references/layer-3-orchestration.md` — Orchestration patterns (~60 lines)
- `references/layer-4-rubrics.md` — distributed-pattern scaffolding (~60 lines)
- `references/layer-5-knowledge.md` — Knowledge scaffolding (~70 lines)

Each cross-references `hd-onboard/references/layer-N-*.md` for conceptual explainer.

**Shared (4):**
- `references/tier-budget-model.md` — three-tier loading + ≤200 line Tier 1 rule (~80 lines)
- `references/good-agents-md-patterns.md` — healthy AGENTS.md example + 3 anti-patterns (~100 lines)
- `references/coexistence-checklist.md` — compound-engineering collision rules (~60 lines)
- `references/local-md-schema.md` — `design-harnessing.local.md` YAML schema (~50 lines)

#### `workflows/` — 3 files
- `workflows/greenfield.md` — 8 steps; copy-into-response checklist; references templates (~120 lines)
- `workflows/scattered.md` — 7 steps; always backup-before-modify; diff-preview (~130 lines). **Diff-preview format (LOCKED):** structured markdown block listing `Will create:` / `Will modify:` / `Will preserve verbatim:` / `Unchanged:` sections with file paths and line ranges (not unified diff — user-readable format per Anthropic's "clear, concrete instructions" rule). Example in scattered.md.
- `workflows/advanced.md` — 6 steps; audit-only; writes only the report file (~100 lines)

#### `templates/` — 10 files

Root templates (2):
- `templates/AGENTS.md.template` — placeholders `{{TEAM_NAME}}`, `{{PRODUCT_ONE_LINER}}`, `{{DESIGN_SYSTEM_LOCATION}}`, `{{DATE}}`
- `templates/design-harnessing.local.md.template` — YAML frontmatter + markdown body; schema per P2b.9

Context skeleton (4):
- `templates/context-skeleton/agent-persona.md.template`
- `templates/context-skeleton/product/one-pager.md.template`
- `templates/context-skeleton/design-system/cheat-sheet.md.template`
- `templates/context-skeleton/conventions/how-we-work.md.template`

Knowledge skeleton (3):
- `templates/knowledge-skeleton/INDEX.md.template`
- `templates/knowledge-skeleton/graduations.md.template`
- `templates/knowledge-skeleton/lessons/.gitkeep`

#### `scripts/detect-mode.sh`
- ~80 lines bash
- Reads repo root; emits JSON `{ "mode": "...", "signals": [...], "priority_matched": N }`
- Detection priority order per scenarios matrix
- Exit code 0 on success
- `chmod +x` after creation

### docs/ meta-harness — 11 files

#### `docs/context/`
- `agent-persona.md` (~40 lines)
- `product/one-pager.md` (~30 lines)
- `design-system/cheat-sheet.md` (~60 lines — our own plug-in conventions)
- `conventions/how-we-work.md` (~50 lines — commit/branch/PR style for this repo)
Combined: ~180 lines (Tier 1 compliant).

#### `docs/knowledge/`
- `INDEX.md` (~20 lines)
- `graduations.md` (~20 lines with 1 seeded entry)
- `lessons/2026-04-16-every-plugin-teardown.md` (~40 lines — what we learned reading compound)
- `lessons/2026-04-16-anthropic-skill-guide-takeaways.md` (~50 lines — distilled Anthropic guide)
- `lessons/2026-04-16-button-variants-escape-hatch.md` (~40 lines — canonical graduation example)

#### `docs/rubrics/`
- `INDEX.md` (~15 lines — thin pointer)

## Execution Order

Strict sequence for Phase 1; Phase 2 can parallelize within sub-phases; Phase 3 is serial.

```
Phase 1 (serial — all moves/deletions before new creates):
  P1.1  →  P1.2  →  P1.3  →  P1.4  →  P1.5  →  P1.6  →  P1.7

Phase 2a (references first so SKILL.md router can link accurately):
  P2a.1 → P2a.2 (foundation refs, serial)
  → P2a.3 → P2a.4 → P2a.5 → P2a.6 → P2a.7 (5 layer explainers — write in any order; sequential edits to same repo but each edits a distinct file)
  → P2a.8 → P2a.9 → P2a.10 (remaining refs, serial)
  → P2a.11 (SKILL.md last — all link targets exist)

Phase 2b (refs + templates + script before SKILL.md):
  P2b.1 → ... → P2b.5 (5 layer-specific refs, sequential file-by-file)
  → P2b.6 → ... → P2b.9 (4 shared refs, sequential)
  → P2b.10 → ... → P2b.12 (3 workflows, sequential)
  → P2b.13 → ... → P2b.17 (templates, sequential; each template is 20-50 lines)
  → P2b.18 (detect-mode.sh)
  → P2b.19 (SKILL.md last — after all link targets exist)

Phase 3 (serial):
  P3.1  →  P3.2  →  P3.3  →  P3.4  →  P3.5  →  P3.6
```

**"Parallelizable" = order within a group doesn't matter for correctness** (each sub-task edits a distinct file), but for solo execution via `/ce:work` they run sequentially file-by-file. No actual concurrency attempted; the notation is freedom-of-order only.

Total ordered actions: ~50 file creates/modifies. All within the worktree branch `claude/elegant-euclid`; no commits mid-build (commit only at end of each phase).

## Verification Steps

Run at end of each phase + final.

### Compliance grep suite

```bash
# 1. No bare-backtick references in SKILL.md (compound convention)
grep -rn --include="SKILL.md" -E '`(references|assets|scripts|workflows|templates)/[^`]+`' skills/ \
  && echo "FAIL: bare backtick references" || echo "PASS"

# 2. No Windows paths in markdown
grep -rn --include="*.md" $'\\\\' skills/ docs/ AGENTS.md README.md CLAUDE.md 2>/dev/null \
  | grep -v '\\\\$' \
  && echo "FAIL: Windows paths" || echo "PASS"

# 3. Every SKILL.md has required frontmatter
for f in skills/*/SKILL.md; do
  head -5 "$f" | grep -q "^name:" && head -5 "$f" | grep -q "^description:" \
    || echo "FAIL: missing frontmatter in $f"
done

# 4. SKILL.md body length ≤200 router / ≤500 Anthropic hard
for f in skills/*/SKILL.md; do
  lines=$(wc -l < "$f")
  [ "$lines" -gt 500 ] && echo "FAIL: $f is $lines lines (>500)" \
    || { [ "$lines" -gt 200 ] && echo "WARN: $f is $lines lines (>200)"; }
done

# 5. Description ≤180 chars preferred (≤1024 hard)
for f in skills/*/SKILL.md; do
  desc=$(awk '/^description:/{print; exit}' "$f" | sed 's/^description: //')
  len=${#desc}
  [ "$len" -gt 1024 ] && echo "FAIL: $f description $len chars (>1024)" \
    || { [ "$len" -gt 180 ] && echo "WARN: $f description $len chars (>180)"; }
done

# 6. No writes to compound's namespace (docs/solutions/)
find docs/solutions/ 2>/dev/null \
  && echo "FAIL: docs/solutions/ exists (compound namespace)" || echo "PASS"

# 7. No reference links nested more than one level
grep -rn --include="SKILL.md" -E '\[.*\]\(\.*/[^)]*/[^)]*\)' skills/ \
  | grep -vE '\[.*\]\(\.\./\.\./\.\./[^)]*\)' \
  && echo "WARN: check reference link depth" || echo "PASS"

# 8. No unclosed code fences
for f in skills/*/SKILL.md skills/*/references/*.md docs/**/*.md; do
  open=$(grep -c '^```' "$f" 2>/dev/null)
  [ $((open % 2)) -ne 0 ] && echo "FAIL: unclosed fence in $f"
done
```

### Manifest validation

```bash
# All three manifests parse as valid JSON
for m in .claude-plugin/plugin.json .codex-plugin/plugin.json .cursor-plugin/plugin.json; do
  python3 -c "import json; json.load(open('$m'))" \
    && echo "PASS: $m" || echo "FAIL: $m invalid JSON"
done

# Names match across manifests
claude_name=$(python3 -c "import json; print(json.load(open('.claude-plugin/plugin.json'))['name'])")
codex_name=$(python3 -c "import json; print(json.load(open('.codex-plugin/plugin.json'))['name'])")
cursor_name=$(python3 -c "import json; print(json.load(open('.cursor-plugin/plugin.json'))['name'])")
[ "$claude_name" = "$codex_name" ] && [ "$codex_name" = "$cursor_name" ] \
  && echo "PASS: names aligned" || echo "FAIL: manifest names drift"

# Versions match
claude_ver=$(python3 -c "import json; print(json.load(open('.claude-plugin/plugin.json'))['version'])")
codex_ver=$(python3 -c "import json; print(json.load(open('.codex-plugin/plugin.json'))['version'])")
cursor_ver=$(python3 -c "import json; print(json.load(open('.cursor-plugin/plugin.json'))['version'])")
[ "$claude_ver" = "$codex_ver" ] && [ "$codex_ver" = "$cursor_ver" ] \
  && echo "PASS: versions aligned" || echo "FAIL: version drift"
```

### Tree diff vs spec

```bash
# Expected tree at v0.MVP
cat > /tmp/expected-tree.txt <<'EOF'
./.claude-plugin/plugin.json
./.codex-plugin/plugin.json
./.cursor-plugin/plugin.json
./.cursor/rules/AGENTS.mdc
./AGENTS.md
./CHANGELOG.md
./CLAUDE.md
./LICENSE
./README.md
./docs/context/agent-persona.md
./docs/context/conventions/how-we-work.md
./docs/context/design-system/cheat-sheet.md
./docs/context/product/one-pager.md
./docs/knowledge/INDEX.md
./docs/knowledge/graduations.md
./docs/knowledge/lessons/2026-04-16-anthropic-skill-guide-takeaways.md
./docs/knowledge/lessons/2026-04-16-button-variants-escape-hatch.md
./docs/knowledge/lessons/2026-04-16-every-plugin-teardown.md
./docs/plans/2026-04-16-003-design-harness-plugin-v0.4-four-skills.md
./docs/plans/2026-04-16-005-feat-v0-mvp-implementation-plan.md
./docs/plans/hd-setup-scenarios.md
./docs/plans/hd-setup-success-criteria.md
./docs/plans/hd-setup-test-cases.md
./docs/rubrics/INDEX.md
./skills/hd-onboard/SKILL.md
./skills/hd-onboard/references/concept-overview.md
./skills/hd-onboard/references/coexistence-with-compound.md
./skills/hd-onboard/references/faq.md
./skills/hd-onboard/references/glossary.md
./skills/hd-onboard/references/layer-1-context.md
./skills/hd-onboard/references/layer-2-skills.md
./skills/hd-onboard/references/layer-3-orchestration.md
./skills/hd-onboard/references/layer-4-rubrics.md
./skills/hd-onboard/references/layer-5-knowledge.md
./skills/hd-onboard/references/memory-taxonomy.md
./skills/hd-setup/SKILL.md
./skills/hd-setup/references/coexistence-checklist.md
./skills/hd-setup/references/good-agents-md-patterns.md
./skills/hd-setup/references/layer-1-context.md
./skills/hd-setup/references/layer-2-skills.md
./skills/hd-setup/references/layer-3-orchestration.md
./skills/hd-setup/references/layer-4-rubrics.md
./skills/hd-setup/references/layer-5-knowledge.md
./skills/hd-setup/references/local-md-schema.md
./skills/hd-setup/references/tier-budget-model.md
./skills/hd-setup/scripts/detect-mode.sh
./skills/hd-setup/templates/AGENTS.md.template
./skills/hd-setup/templates/context-skeleton/agent-persona.md.template
./skills/hd-setup/templates/context-skeleton/conventions/how-we-work.md.template
./skills/hd-setup/templates/context-skeleton/design-system/cheat-sheet.md.template
./skills/hd-setup/templates/context-skeleton/product/one-pager.md.template
./skills/hd-setup/templates/design-harnessing.local.md.template
./skills/hd-setup/templates/knowledge-skeleton/INDEX.md.template
./skills/hd-setup/templates/knowledge-skeleton/graduations.md.template
./skills/hd-setup/templates/knowledge-skeleton/lessons/.gitkeep
./skills/hd-setup/workflows/advanced.md
./skills/hd-setup/workflows/greenfield.md
./skills/hd-setup/workflows/scattered.md
EOF

# Actual tree
find . -type f -not -path "./.git/*" -not -path "./Desktop/*" | sort > /tmp/actual-tree.txt

# Diff
diff /tmp/expected-tree.txt /tmp/actual-tree.txt \
  && echo "PASS: tree matches spec" || echo "FAIL: tree diff above"
```

Expected: 55 files total at v0.MVP (exactly matches spec).

### Script behavior check

```bash
# detect-mode.sh runs without error on an empty dir
mkdir /tmp/hd-test-empty && cd /tmp/hd-test-empty && git init
bash /path/to/skills/hd-setup/scripts/detect-mode.sh | python3 -m json.tool \
  && echo "PASS: greenfield detection valid JSON"
rm -rf /tmp/hd-test-empty
```

## Acceptance Criteria

### Per-phase (pass before moving to next)

**Phase 1 pass criteria:**
- [ ] No `plugins/` directory anywhere in repo
- [ ] Three manifest files at `./` (not nested)
- [ ] Root-level `AGENTS.md`, `CLAUDE.md`, `CHANGELOG.md`, `LICENSE`, `README.md`
- [ ] `skills/` contains exactly 2 dirs: `hd-onboard/` and `hd-setup/` (empty subtrees)
- [ ] `docs/plans/` contains 5 files (003 origin, 005 this plan, 3 scenario docs; 001, 002, 004 deleted)
- [ ] `docs/{context,knowledge,rubrics}/` dirs exist (empty, ready for Phase 3)
- [ ] All JSON manifests parse valid
- [ ] CHANGELOG has `[Unreleased]` entries documenting refactor

**Phase 2a pass criteria (hd-onboard):**
- [ ] 11 files under `skills/hd-onboard/`
- [ ] `SKILL.md` ≤150 lines; frontmatter compliant (name=`hd:onboard`, description 157 chars)
- [ ] Every reference 40-120 lines, atomic, one-topic-per-file
- [ ] `grep -r "§" skills/hd-onboard/` returns ≥20 hits (article citations)
- [ ] No bare-backtick references
- [ ] Reference links in SKILL.md appear contextually (not bottom-dumped)

**Phase 2b pass criteria (hd-setup):**
- [ ] 24 files under `skills/hd-setup/` (1 + 9 + 3 + 10 + 1)
- [ ] `SKILL.md` ≤200 lines; frontmatter compliant; `argument-hint` YAML-quoted
- [ ] `detect-mode.sh` executable; `bash -n` passes; emits valid JSON on greenfield test
- [ ] Every workflow ≤150 lines; copy-into-response checklist format
- [ ] Every template has documented placeholders
- [ ] All reference/workflow/template/script paths in SKILL.md one-level-deep

**Phase 3 pass criteria (meta-harness + verification):**
- [ ] `docs/context/` combined ≤200 lines (Tier 1 compliant)
- [ ] `docs/knowledge/lessons/` has ≥3 dated files
- [ ] `AGENTS.md` has ≥1 "Graduated rules" entry traceable to a lesson
- [ ] README.md 4 sections, 120-250 lines
- [ ] All compliance grep checks return PASS
- [ ] Tree diff vs spec is empty (byte-identical match)
- [ ] CHANGELOG moved to `[0.1.0] - pending v0.MVP ship`

### Overall v0.MVP ship acceptance

**Functional:**
- [ ] `/hd:onboard "What is a design harness?"` routes to `references/concept-overview.md`; output cites ≥1 article §
- [ ] `/hd:onboard "Explain Layer 3"` routes to `references/layer-3-orchestration.md` only (not all 5 layers)
- [ ] `/hd:setup` on empty repo detects `greenfield` mode; scaffolds `docs/context/` + `docs/knowledge/` + `AGENTS.md` + `design-harnessing.local.md`
- [ ] `/hd:setup` on repo with existing AGENTS.md detects `scattered`; shows diff preview BEFORE any write; original AGENTS.md byte-identical if user declines
- [ ] 12/12 v0.MVP scenarios pass per `docs/plans/hd-setup-success-criteria.md`
- [ ] n=5 manual usability tests: median TTFUI ≤30 min; median "articulate value" ≤5 min

**Structural:**
- [ ] All SKILL.md ≤200 lines
- [ ] All descriptions ≤180 chars, third person
- [ ] All reference links one-level-deep
- [ ] No `disable-model-invocation: true` (no stubs; descriptions constrain triggers)
- [ ] Every SKILL.md has AskUserQuestion fallback preamble

**Coexistence:**
- [ ] 0 writes to `docs/solutions/`
- [ ] `/ce:plan` + `/ce:review` work unchanged after plug-in install
- [ ] No `ce-*` files written to `docs/design-solutions/` (and vice versa)

**Cross-platform:**
- [ ] `.claude-plugin/plugin.json` validates
- [ ] `.codex-plugin/plugin.json` validates (schema per Codex submission spec)
- [ ] `.cursor-plugin/plugin.json` validates
- [ ] `.cursor/rules/AGENTS.mdc` valid MDC frontmatter

## Success Metrics

v0.MVP ships when **12/12 scenario tests pass** per [`hd-setup-success-criteria.md`](./hd-setup-success-criteria.md) AND n=5 manual usability tests return median TTFUI ≤30 min. All other metrics (installs, conversion, stars) are tracked per origin PRD v0.4 "Success Metrics" section; no duplication here.

## Dependencies & Prerequisites

### Hard dependencies (must be true before execute)

- [x] User approved LOCKED 4-skill taxonomy (session 2026-04-16)
- [x] User approved flat repo structure (session 2026-04-16 Point 1)
- [x] User approved 3-file cross-platform pointer strategy (session 2026-04-16 Point 3)
- [x] User approved `docs/` as meta-harness (session 2026-04-16)
- [x] User approved 10-atomic hd-onboard references + 9-file hd-setup references (session 2026-04-16)
- [x] Anthropic skill best-practices fetched (session research pass)
- [x] Compound's CHANGELOG lessons captured (session /ce:review)

### Soft dependencies (resolvable during execute)

- Codex CLI plug-in manifest schema — research findings identified `.codex-plugin/plugin.json` format; if submission schema drifts, adjust in `.codex-plugin/plugin.json` at submission time
- Article URL — "Link TBD" placeholder in README; filled in before article #1 publishes

### No blocking external dependencies

All tools required (bash, python3, git, grep, find, wc) ship in macOS 14+ baseline. No npm/pip installs needed for v0.MVP.

## Risk Analysis & Mitigation

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R1 | Flatten (P1.1) leaves files in inconsistent state | Low | High | All changes in git worktree (untracked); `git clean -fd` rolls back instantly. Execute moves in single bash block per section. |
| R2 | Codex manifest schema drifts from current placeholder at actual submission time | Low | Low | Ship placeholder (per P1.5); adjust at Codex submission time against then-current schema. No fallback — Codex submission is a v0.MVP commitment. |
| R3 | SKILL.md blows line budget | Med | Low | Enforce at P2a.11 / P2b.19 build time; split to references if over. |
| R4 | Layer references overlap / feel redundant | Med | Low | hd-onboard refs are CONCEPT (explainer); hd-setup refs are ACTION (scaffold guide). Cross-reference by inline link, don't duplicate content. |
| R5 | `detect-mode.sh` false positives on edge cases | Med | Med | Test against 6 scenario signals (F9 partial detection handled by explicit user ask). |
| R6 | docs/context/ combined exceeds Tier 1 budget | Low | Low | Build to target 180 lines (20-line buffer); enforce at P3.1. |
| R7 | Meta-harness dogfood conflicts with readers' expectations | Low | Low | Explicit note in AGENTS.md: "`docs/` is meta-harness for THIS plug-in. User's harness (scaffolded by hd:setup) is different." |
| R8 | Compound-engineering CHANGELOG lesson missed | Low | Med | P3.6 verification cross-checks captured gotchas (description length, hyphen names, YAML-quoted argument-hint, fully-qualified Task calls). |
| R9 | README too long / too short | Med | Low | Target 180 lines; 120-250 acceptable per 2026 plug-in README norm. Review at P3.5. |
| R10 | Article references (`§2`, `§4a`, etc.) drift at article-ship time | Low | Med | Article is the stable source; if sections renumber, update `hd-onboard/references/article-link-map.md` (to be added if issue arises; v0.MVP assumes article section numbers are stable). |

### Rollback points

- End of Phase 1 → commit `refactor: flatten repo to single-plug-in structure`. Safe checkpoint.
- End of Phase 2a → commit `feat(hd-onboard): implement v0.MVP learn skill`. Shippable partial.
- End of Phase 2b → commit `feat(hd-setup): implement v0.MVP setup skill`. v0.MVP code-complete.
- End of Phase 3 → commit `docs: meta-harness + README + CHANGELOG for v0.MVP`. v0.MVP ready.
- Final → tag `v0.1.0-alpha`.

If any phase fails: `git reset --hard HEAD~1` returns to previous checkpoint. No mid-phase commits.

## Future Considerations

v0.5 (+ hd-compound) and v1 (+ hd-review) scopes are specified in origin PRD v0.4 §"Must-Have for v0.5 full-P0" and §"Future Considerations (P2)". This plan does not duplicate that detail — it's stable in the PRD. Key forward commitment:

- v0.5 activates `docs/design-solutions/` namespace (hd-compound writes here)
- v1 adds `<protected_artifacts>` block to hd-review/SKILL.md declaring all our output paths so `/ce:review` never modifies them
- `schema_version: "1"` in `design-harnessing.local.md` is the compatibility contract for v0.5 → v1 skill reads

## Sources & References

### Origin

- **Origin document:** [docs/plans/2026-04-16-003-design-harness-plugin-v0.4-four-skills.md](./2026-04-16-003-design-harness-plugin-v0.4-four-skills.md)
  - Key decisions carried forward: `/hd:` prefix; four-skill taxonomy; flat single-plug-in repo; MIT license; `docs/design-solutions/` namespace (v0.5+); fully-qualified Task names for cross-plug-in; SKILL.md authoring discipline.
  - Decisions revised: number of v0.MVP skills (from 2 implied → 2 confirmed); hd-onboard reference count (from 9 consolidated → 10 atomic); hd-setup reference structure (from confused → 5 layer-specific + 4 shared); docs/ restored as meta-harness (was stripped in intermediate 004 plan).

### Internal

- Scenario matrix: [docs/plans/hd-setup-scenarios.md](./hd-setup-scenarios.md)
- Test cases: [docs/plans/hd-setup-test-cases.md](./hd-setup-test-cases.md)
- Success criteria: [docs/plans/hd-setup-success-criteria.md](./hd-setup-success-criteria.md)
- Superseded: [docs/plans/2026-04-16-004-feat-skill-taxonomy-design-plan.md](./2026-04-16-004-feat-skill-taxonomy-design-plan.md) — rejected 6-skill split; deleted in P1.3.

### External — compound-engineering

- Convention doc: `/Users/billguo/.claude/plugins/cache/compound-engineering-plugin/compound-engineering/2.42.0/AGENTS.md`
- create-agent-skills meta-skill: same cache `skills/create-agent-skills/` — the canonical router pattern for hd-setup
- ce-plan skill: same cache `skills/ce-plan/SKILL.md` — namespaced-command skill pattern
- CHANGELOG lessons (2.31.0 → 2.39.0): same cache `CHANGELOG.md`

### External — Anthropic

- Skill best practices: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices (fetched 2026-04-16)
- Complete Guide to Building Skills for Claude: https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf

### External — standards

- agents.md convention: https://agents.md/
- Cross-platform native AGENTS.md readers in 2026: Claude Code, Codex CLI, Cursor CLI, Windsurf, GitHub Copilot coding agent
- MIT license: https://opensource.org/license/mit

### Related session artifacts

- `/ce:review` findings (session 2026-04-16): pattern-recognition, code-simplicity, agent-native, spec-flow-analyzer, learnings-researcher — all applied as corrections to current scaffold during phases 1-3.
- `/deepen-plan` findings from v0.3 build: Anthropic skill guide distilled; compound coexistence rules; cross-platform publishing matrix.

---

## Execution Ready

All decisions locked. All dependencies met. All verifications specified. No open questions blocking execution.

Next command: `/ce:work` on this plan file starts Phase 1 (structural refactor) immediately, serial through to end of Phase 3.

Plan written to `docs/plans/2026-04-16-005-feat-v0-mvp-implementation-plan.md`.
