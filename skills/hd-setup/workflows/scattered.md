# Workflow — Scattered reorg

**When to use:** mode `scattered` from `detect-mode.sh` (scenarios S2, S3, S4, S6).
**Goal:** classify existing AI docs into the five layers and propose a reorganization diff — **never destroy**, always preview.

## Progress checklist

```
Scattered Reorg Progress:
- [ ] Step 1: Inventory existing AI docs
- [ ] Step 2: Classify content by layer
- [ ] Step 3: Check coexistence overlay (compound-engineering)
- [ ] Step 4: Show diff preview
- [ ] Step 5: Wait for explicit user approval
- [ ] Step 6: Apply changes (if approved)
- [ ] Step 7: Write design-harnessing.local.md
- [ ] Step 8: Summarize
```

## Step 1 — Inventory

Use `Grep`/`Read` to find all AI-related files at repo root and common locations:

- `AGENTS.md` at root
- `CLAUDE.md` at root (if exists, check if it's Anthropic-style single-line pointer or a full doc)
- `.cursor/rules/*.mdc`
- `.windsurf/rules/*.md`
- `.github/copilot-instructions.md`
- `DESIGN.md` or similar single-purpose design files
- Any `docs/ai/`, `.agent/`, `prompt/` directories

For each file found, capture: path, line count, section headings. Share with user as inventory table before proceeding.

## Step 2 — Classify

For each file's sections, classify against the five layers using these heuristics:

- **"Rules" / "DO / DON'T" / procedural commitments** → `AGENTS.md` (rules stay here; small doc so this is low-cost)
- **"About the product" / "What we build" / team thesis** → Layer 1 `docs/context/product/`
- **"Design system" / "Components" / "Tokens"** → Layer 1 `docs/context/design-system/`
- **"How to review" / "Review checklist" / rubric criteria** → Layer 4 (gets distributed across Layer 1 context + Layer 2 skill) — for v0.MVP, just reference from AGENTS.md as quality gate
- **"Past decisions" / "What we tried" / dated narratives** → Layer 5 `docs/knowledge/lessons/` (preserve date if present; if no date, use file mtime)
- **"Workflow" / "Process" / "Steps"** → Layer 3 (skip at v0.MVP; inform user Layer 3 comes v0.5)
- **Conventions (commits, naming, reviews)** → Layer 1 `docs/context/conventions/`

Ambiguous content: surface to user with the options, let them choose. Example:

> This section has both a rule ("never use X") and a story ("we tried X in Feb 2026 and reverted"). Options: (1) rule to AGENTS.md + story to a Layer 5 lesson, (2) keep as-is in source file, (3) skip this section. Which?

## Step 3 — Coexistence overlay

If `coexistence.compound_engineering: true`, apply [coexistence-checklist.md](../references/coexistence-checklist.md):

- Never write to `docs/solutions/` (compound's namespace) even if user has content that looks like it belongs there — write to `docs/design-solutions/` instead
- If `compound-engineering.local.md` is in the inventory, leave it untouched
- Surface the coexistence note once (mild, informational — not adversarial)

## Step 4 — Diff preview

Show the proposed reorganization in this LOCKED format (structured markdown, not unified diff — Anthropic "clear concrete instructions" rule):

```markdown
## Proposed reorganization

### Will create
- `docs/context/product/one-pager.md`  ← from `AGENTS.md` lines 12-24
- `docs/context/conventions/how-we-work.md`  ← from `AGENTS.md` lines 50-80
- `docs/knowledge/lessons/2026-02-14-fourth-button-variant-reverted.md`  ← from `AGENTS.md` lines 85-110

### Will modify
- `AGENTS.md` (currently 120 lines → proposed 80 lines; content moved to files above; ≤200-line Tier 1 budget maintained)

### Will preserve verbatim
- `AGENTS.md` lines 1-11 (heading + philosophy — stays in root AGENTS.md)
- `AGENTS.md` lines 30-49 (command naming + coexistence — stays in root AGENTS.md)

### Will back up
- `AGENTS.md` → `AGENTS.md.bak-YYYYMMDD` before any modification

### Unchanged
- All other files in the repo
```

**Never run this step and Step 6 back-to-back without explicit user approval in between.**

## Step 5 — Wait for explicit approval

Require explicit yes/no per section OR a blanket "approve all." No defaults. No hedging. If the user says "maybe" or "most of it," ASK SPECIFICS until each section has a clear verdict:

- **accept** — apply the proposed move
- **modify** — user edits the classification ("keep that in AGENTS.md, don't move")
- **skip** — leave that section where it is
- **abort** — cancel the entire reorg

## Step 6 — Apply (if approved)

Execute writes in this order (atomic, reversible):

1. **Create new layer files** (additive; no existing files touched yet)
2. **Write backup of each file about to be modified** — `AGENTS.md` → `AGENTS.md.bak-YYYYMMDD`
3. **Rewrite the modified files** with the approved content
4. **Confirm success** with a post-apply diff summary

**Never `rm` anything.** Never overwrite without backup. If any write fails, halt and report.

## Step 7 — Write design-harnessing.local.md

From [`../templates/design-harnessing.local.md.template`](../templates/design-harnessing.local.md.template). Fill per [local-md-schema.md](../references/local-md-schema.md):

```yaml
schema_version: "1"
setup_mode: scattered
setup_date: 2026-04-16
team_size: <from user>
skipped_layers: <from reorg — layers user chose not to populate>
coexistence:
  compound_engineering: <true/false>
article_read: <from user>
```

Prose section: note the reorg — "Reorganized N files, moved M sections across K layers. Backups at `*.bak-YYYYMMDD`."

## Step 8 — Summarize

Report: N files classified, M files created, K lines moved, backup count. List backup file paths explicitly so user can roll back manually if needed. Suggest next step:

- **Verify reorg looks right?** → "Compare `AGENTS.md` vs `AGENTS.md.bak-YYYYMMDD`"
- **Continue building the harness?** → "Populate placeholder `{{TODO}}` fields"
- **Ongoing maintenance?** → "Run `/hd:compound`"

## Failure modes

- **F4 Overwrite safety** — always backup + confirm per Step 4/5
- **F6 Coexistence** — if CLAUDE.md is `@AGENTS.md` only (compound's pattern), note but don't classify as user content
- **F7 Conflicting rules** — if user's AGENTS.md says "never use markdown" and we're proposing markdown layer files, surface conflict + ask how to resolve

## Success criteria

Passes [C-S2 single-file criteria](../../../docs/plans/hd-setup-success-criteria.md#c-s2--single-file-pass-criteria) when:

- Original file byte-identical unless user explicitly approved a diff
- Diff preview shown before any write to existing file
- Classified content lands in correct layer folder
- No content lost from original
- All backups present at `*.bak-YYYYMMDD`
