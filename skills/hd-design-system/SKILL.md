---
name: hd:design-system
description: "Design-system depth work — establishes / evolves / inspects the docs/context/design-system/ harness + .storybook/ rendering surface. Single .mdx per topic serves both coding agents (read as markdown) and humans (rendered in Storybook). Use after /hd:setup when teams want to take their DS docs to the next level. Modes: establish | evolve | tracker | validate."
argument-hint: "establish | evolve | tracker | validate [--folder <name>] [--resume]"
---

# hd:design-system — depth work for design-system harness

## Single job

Build and maintain the design-system documentation surface that both coding agents and human designers rely on. Walk the user through their DS folder-by-folder, extract real content from Figma/code/baselines, write `.mdx` files that Storybook reads directly, and surface discrepancies through an auto-generated Audit page.

**Audience split is dropped.** One `.mdx` per topic — agent reads markdown, humans see rendered Storybook. Storybook config (`stories: ['../docs/context/design-system/**/*.mdx']`) reads the harness MDX directly; no `.storybook/` mirror.

## Interaction method

Use `AskUserQuestion` for branching decisions (per-folder approve / edit / skip; existing-Storybook adopt / preserve). If unavailable, fall back to numbered-list prompts. **Never take destructive action without explicit confirmation.** **Diff preview before every multi-file write.**

## Modes

| Mode | When | What it writes |
|---|---|---|
| **`establish`** | First-time DS scaffold (or after `/hd:setup` suggested it) | `.storybook/*` config + decorators + 14 harness-blocks (once); per-folder `.mdx` files (folder-by-folder with user gates); seeds `Tracker.mdx` + `Audit.mdx` |
| **`evolve`** | DS changed since last scaffold (new components, renamed tokens) | Re-runs extractors → diffs vs current `.mdx` → user approves per-file → writes; updates Tracker + Audit |
| **`tracker`** | Quick status check or after manual edits | Regenerates `0-welcome/Tracker.mdx` + `0-welcome/Audit.mdx`; read-only otherwise |
| **`validate`** | Pre-commit / pre-merge check | Read-only rules check; exits non-zero on high-severity drift |

## Pre-conditions

1. `/hd:setup` has run (or `hd-config.md` exists at repo root). If not, point the user there first.
2. `index-manifest.json` exists at `docs/context/design-system/` after first `establish`. Skill error-exits in non-establish modes if missing.
3. For `establish`: detect.py output (or live re-run) provides `design_system_scenario` + `voice_docs_found` + `storybook_present` + `dataviz_lib_detected`.

## Mode router

Read mode arg. Default to `establish` if `index-manifest.json` is absent; else default to `evolve`. Then dispatch:

- `establish` → see [`references/establish-flow.md`](references/establish-flow.md)
- `evolve` → see [`references/evolve-flow.md`](references/evolve-flow.md)
- `tracker` → see [`references/tracker-format.md`](references/tracker-format.md); run [`scripts/generate-tracker.mjs`](scripts/generate-tracker.mjs) + [`scripts/generate-audit.mjs`](scripts/generate-audit.mjs)
- `validate` → see [`references/validate-rules.md`](references/validate-rules.md); run [`scripts/validate.mjs`](scripts/validate.mjs)

## Establish — high-level walk (full detail in establish-flow.md)

```
Step 0  — Detect: scenario classification (starter | figma-only | code-and-figma | code-only)
Step 1  — Roadmap: present folder list + Storybook plan; user confirms
Step 2  — Storybook foundation FIRST (.storybook/main.js + preview.js + decorators + 15 harness-blocks
          + harness-styles.css). Subsequent .mdx writes appear immediately in Storybook.
Step 3  — Folder 1 (foundations/): preview each .mdx → user edits Decisions/Rationale → approve → write
Step 4  — Folder 2 (styles/): same, with <SwatchRow>/<TypeRow>/<HierarchyDiagram>/<ElevationDemo> blocks
Step 5  — Folder 3 (assets/): binary; ask paths
Step 6  — Folder 4 (components/): per-component extract → preview → approve → write; stub stories.tsx
          unless figma-only scenario
Step 7+ — Optional folders (5-patterns/, 6-data-viz/, 7-specs/) per questionnaire answers
Step 10 — Hand off to hd-setup voice authoring step (Voice / Use case / Forbidden moves → AGENTS.md)
Step 11 — Generate Tracker.mdx + Audit.mdx
Step 12 — Final summary; Stop hook fires (post-setup-summary.sh)
```

State persists in `index-manifest.json:scaffold_progress`. User can pause/resume per folder via `--resume`.

## Sub-agent dispatch

Per scenario:

| Scenario | Sub-agents |
|---|---|
| `starter` | `analysis:design-system-starter-recommender` (1) |
| `figma-only` | `research:figma-extractor` (1) |
| `code-only` | `research:code-introspector` (1) |
| `code-and-figma` | `research:figma-extractor` ‖ `research:code-introspector` (parallel) → inline diff procedure |

Dispatch syntax:
```
Task harness-designing:research:figma-extractor(file_url: "...", scope: "full", context: "establish")
Task harness-designing:research:code-introspector(scope: "full", context: "establish")
Task harness-designing:analysis:design-system-starter-recommender(answers: {...})
```

## Evolve — high-level walk (full detail in evolve-flow.md)

```
Step 0  — Re-detect scenario (may have changed since establish)
Step 1  — Re-run sub-agents per scenario
Step 2  — Diff new extraction vs current .mdx (per folder)
Step 3  — Folder-by-folder: present diff → user approves per file → write
Step 4  — Regenerate Tracker.mdx + Audit.mdx
```

## Tracker mode

Run [`scripts/generate-tracker.mjs`](scripts/generate-tracker.mjs) → writes `0-welcome/Tracker.mdx`. Then [`scripts/generate-audit.mjs`](scripts/generate-audit.mjs) → writes `0-welcome/Audit.mdx`. Both read `index-manifest.json` + every `.mdx` frontmatter + `components-index.json`. Quick mode — no user prompts.

## Validate mode

Run [`scripts/validate.mjs`](scripts/validate.mjs). Checks:

1. Every `.mdx` has valid status frontmatter (status / last_filled / todos)
2. Every entry in `components-index.json` has a matching `<name>.mdx` (no orphans)
3. Every `.mdx` parses as valid MDX (no broken JSX islands)
4. IA sync rule — `<Meta title="<N>-<folder>/<File>">` matches the directory
5. Every component has non-empty `tokens_consumed[]` (per components-index schema)

Exit code: 0 = pass, non-zero = high-severity drift. Findings reported to stdout.

## What this skill does NOT do

- Voice authoring — that's [`hd-setup` Layer-1 step](../hd-setup/SKILL.md). This skill assumes voice docs exist or will be authored in parallel.
- L2-L5 layer scaffolding (use `/hd:setup` for that)
- Implementing actual code components (this is documentation, not code generation)
- Writing back to Figma (read-only extraction only)
- Modifying user's tokens.json / SCSS / Tailwind config files
- Running tests or linters
- Calling into other plug-ins' Task namespaces

## Coexistence

- All commands `/hd:*` only — never invoke another plug-in's namespace
- Sub-agent dispatch always fully-qualified (`Task harness-designing:research:...`)
- Output paths only `docs/context/design-system/**` (or `.storybook/**` when Storybook opt-in)
- Never writes to `docs/solutions/` (reserved for other tools)

## Reference files

- [`references/establish-flow.md`](references/establish-flow.md) — progressive folder-by-folder + scenario classifier + Storybook Step 2 + 4 sub-flow branches
- [`references/evolve-flow.md`](references/evolve-flow.md) — diff-and-update procedure
- [`references/storybook-wiring.md`](references/storybook-wiring.md) — generic config + decorators + doc renderers + IA sync rule + existing-Storybook 3-way branch
- [`references/page-templates.md`](references/page-templates.md) — 9 MDX template shapes + variant-combo rule + custom layout extension
- [`references/harness-blocks.md`](references/harness-blocks.md) — 15 custom blocks catalog
- [`references/baselines.md`](references/baselines.md) — M3 + Fluent 2 + awesome-design-md seeds (greenfield path)
- [`references/tracker-format.md`](references/tracker-format.md) — Tracker.mdx generation algo
- [`references/audit-format.md`](references/audit-format.md) — Audit.mdx generation + finding types + suggested-action vocabulary
- [`references/validate-rules.md`](references/validate-rules.md) — validation criteria
- (shared) [`../hd-setup/references/status-frontmatter.md`](../hd-setup/references/status-frontmatter.md) — schema + transitions

## Scripts

- [`scripts/scaffold-storybook.mjs`](scripts/scaffold-storybook.mjs) — writes `.storybook/*` (called by establish Step 2)
- [`scripts/generate-tracker.mjs`](scripts/generate-tracker.mjs) — Tracker.mdx renderer
- [`scripts/generate-audit.mjs`](scripts/generate-audit.mjs) — Audit.mdx renderer (consumes sub-agent `audit_findings`)
- [`scripts/validate.mjs`](scripts/validate.mjs) — validation runner

## Sub-agents invoked

- [`harness-designing:research:figma-extractor`](../../agents/research/figma-extractor.md) — establish (figma-only, code-and-figma) + evolve
- [`harness-designing:research:code-introspector`](../../agents/research/code-introspector.md) — establish (code-only, code-and-figma) + evolve
- [`harness-designing:analysis:design-system-starter-recommender`](../../agents/analysis/design-system-starter-recommender.md) — establish (starter)
