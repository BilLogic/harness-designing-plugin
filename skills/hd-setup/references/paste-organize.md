---
title: Paste-organize helper
loaded_by: hd-setup
---

## Purpose

The second of three equal paths in the per-layer EXECUTE fill-path sub-routine (see [`per-layer-procedure.md § Fill path`](per-layer-procedure.md)). When a user pastes raw content — markdown, text, bullets, URLs — into chat during setup, this procedure structures it into the target layer's sub-folders.

**Parallel to `ai-integration-scout`:** scout researches how to wire up live data sources; paste-organize handles the opposite case — user already has content and just wants it filed in the right place.

## When to invoke

- User pastes content in response to *"Or drop the raw content here and I'll organize it into `<layer>/`"*
- User drops file paths (local) and asks to incorporate
- User shares URLs they want fetched (only with explicit permission — see Guardrails)
- Follows `create` or `scaffold` decision at any layer

## Inputs

- `content` — free-form text, markdown, bullet list, pasted export, or path list (required)
- `layer` — target layer (1–5, required)
- `sub_folder_hint` — optional user hint like "product facts" or "design-system tokens"

## Procedure

### Phase 1 — classify

Scan the content against the target layer's sub-folder skeleton:

| Layer | Sub-folders + classification keywords |
|---|---|
| L1 Context | `product/` (one-pager, users, journeys, pillars, metrics), `engineering/` (stack, API, data, deployment), `design-system/` (tokens, foundations, components), `conventions/` (repo-map, team norms) |
| L2 Skills | `<skill-name>/SKILL.md` (one file per repeatable job — name by verb) |
| L3 Orchestration | `workflows/` (handoff sequences), `playbooks/` (multi-step procedures) |
| L4 Rubrics | `docs/rubrics/<name>.md` (one file per judgment dimension) |
| L5 Knowledge | `lessons/<date>-<slug>.md` (episodic), `decisions/<date>-<slug>.md` (chosen approaches), `changelog.md`, `preferences.md`, `ideations/<slug>.md` |

Keyword hints used for classification:

- `"roadmap" / "priorities" / "strategy"` → L1 `product/`
- `"tech stack" / "framework" / "API"` → L1 `engineering/`
- `"tokens" / "colors" / "spacing" / "component"` → L1 `design-system/` or L4 `design-system-compliance.md`
- `"retro" / "post-mortem" / "incident"` → L5 `lessons/`
- `"decision" / "rationale" / "ADR"` → L5 `decisions/`
- `"heuristic" / "rubric" / "criteria"` → L4

### Phase 2 — structure proposal

Break the content into one file per detected sub-category. Each file gets:
- YAML frontmatter (title, date, tags from layer skeleton)
- H1 matching the sub-category
- Content organized under H2 sub-sections if the source has natural breaks

**Residue policy:** content that doesn't classify cleanly lands in `<layer-folder>/unsorted.md` with a header note: *"Drop from paste-organize on `<date>`; needs manual classification."* Never drop user content silently.

### Phase 3 — preview + confirm

Render a proposed-files table using the Step 8.5 preview format ([per-layer-procedure.md § Preview table format](per-layer-procedure.md#preview-table-format-step-85)):

```
Layer  Action          Files to write
─────  ──────────────  ──────────────────────────────────────────────
L1     paste-organize  docs/context/product/pillars.md          (from paste, 42 lines)
L1     paste-organize  docs/context/engineering/tech-stack.md   (from paste, 18 lines)
L1     paste-organize  docs/context/unsorted.md                 (residue, 7 lines)
```

Ask for explicit confirmation: *"Write these files? (y / revise / cancel)"*

Only an explicit `y` writes. `revise` returns with the content intact for re-classification. `cancel` drops the paste without writing.

### Phase 4 — write

Atomic per-file write (temp + rename). Update `hd-config.md:files_written` to include the new paths.

Report back: *"Organized into `<N>` files. Residue of `<M>` lines at `<path>` — review when convenient."*

## Guardrails

- **Never fetch URLs without explicit permission.** If the user pastes links and wants us to fetch content: ask *"Should I fetch `<URL>` and include its content?"* before navigating. Respect suspicious-link checks (default to asking when unfamiliar).
- **Never write secrets.** If paste contains `.env`-shaped lines, auth tokens, API keys, passwords, or anything matching secret patterns: skip those lines, render a redacted version, flag in the preview: *"Skipped `<N>` lines that looked like secrets — re-paste cleaned content if those should be included."*
- **Never overwrite existing files.** If a target path already has content: append to it under a new H2 *"Added via paste-organize on `<date>`"*, or offer `unsorted.md` fallback if append doesn't make sense.
- **Preserve original wording.** Classification + structure only — don't rewrite, summarize, or edit the user's content.
- **No user-level filesystem scans.** Only operate on content the user directly provides in the session.
- **Respect additive-only discipline.** Even in `scaffold` mode, paste-organize writes new files; it does not modify other-tool harnesses or existing user content.

## Degraded mode

If the paste is too short or unclassifiable (e.g. a single sentence, an image link without description):
- Write the raw paste to `<layer-folder>/unsorted.md` with a timestamp header
- Note: *"Content was too short to auto-classify. Saved to `unsorted.md` — move or re-paste when you have more context."*

## What this helper does NOT do

- Fabricate content the user didn't provide
- Summarize or editorialize pasted content
- Install packages, wire up MCPs, fetch remote content without permission
- Modify other-tool harnesses (`.agent/`, `.claude/`, `.cursor/skills/`, `.windsurf/`)
- Write outside the target layer's folder

## Reference

- [`per-layer-procedure.md § Fill path`](per-layer-procedure.md) — where this is invoked from
- [`standard-harness-structure.md`](standard-harness-structure.md) — canonical layer sub-folder layout
- Phase 3n plan: [`../../../docs/plans/2026-04-21-001-feat-phase-3n-external-source-fill-path-plan.md`](../../../docs/plans/2026-04-21-001-feat-phase-3n-external-source-fill-path-plan.md) Unit 6
