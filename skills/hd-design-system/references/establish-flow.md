# establish-flow — progressive folder-by-folder DS scaffold

**Loaded by:** `SKILL.md` mode router when `mode == "establish"`. Owns: scenario classifier (inline), folder progression, per-folder user gates, the 4 starting-state sub-flows, and the Storybook config Step 2.

## Pre-conditions

- `hd-config.md` present at repo root
- `detect.py` output available with `signals.design_system_scenario` + `signals.voice_docs_found` + `signals.storybook_present` + `signals.dataviz_lib_detected`
- Repo writable (Edit/Write tools available)

## Step 0 — Detect scenario

Read `signals.design_system_scenario` from detect.py output (one of `starter | figma-only | code-and-figma | code-only`). Echo to user; allow override:

> *"Detected scenario: **<S>**. Want to override? (y/N)"*

If override: ask which scenario instead. The scenario picks which sub-flow runs in Steps 3+.

## Step 1 — Roadmap

Present folder list + Storybook plan:

> *"I'll walk you through these folders:*
> *  1-foundations/, 2-styles/, 3-assets/, 4-components/, [optional: 5-patterns/, 6-data-viz/, 7-specs/]*
>
> *Storybook handling: <one of>*
> *- existing `.storybook/` not detected → I'll scaffold it*
> *- existing `.storybook/` detected → adopt our pattern (overwrite with diff preview), preserve as-is, or skip Storybook entirely?*
>
> *I'll write Storybook config FIRST so subsequent .mdx writes appear immediately. Per folder, you'll see a preview, edit Decisions/Rationale, approve before write. You can pause anytime — state lives in `index-manifest.json`."*

Use `AskUserQuestion` for the existing-Storybook 3-way branch when applicable.

## Step 2 — Storybook foundation (FIRST)

Skip if user opted to preserve existing Storybook OR existing-Storybook is detected and user picks `preserve`.

Otherwise, run `scripts/scaffold-storybook.mjs` with framework detected from `signals.storybook_framework`:

```bash
node scripts/scaffold-storybook.mjs \
  --repo "$REPO_ROOT" \
  --framework "$STORYBOOK_FRAMEWORK" \   # e.g., @storybook/sveltekit, @storybook/vue3-vite, @storybook/react-vite
  --modes "light,dark" \
  --brands "default"
```

If `signals.storybook_framework` is null but `storybook_present` is true, ask the user which framework before scaffolding (we will not guess for the user). If `storybook_present` is false (no-existing path) and framework cannot be inferred from project deps, default to `@storybook/react-vite` only after asking user to confirm.

The script writes:

```
.storybook/
├── main.js                  ← stories glob → docs/context/design-system/**/*.mdx
├── preview.js               ← 4 globals (theme/brand/direction/strictMode) + 4 decorators + parameters
├── decorators/
│   ├── with-theme-brand.tsx
│   ├── with-direction.tsx
│   ├── with-aria-live.tsx
│   ├── with-react-strict-mode.tsx
│   ├── harness-docs-container.tsx
│   └── harness-docs-page.tsx
└── harness-blocks/         ← 15 custom MDX components (Panel, SwatchRow, TypeRow, ...)
    └── harness-styles.css
```

After write: announce *"✅ Storybook wired. Every `.mdx` I write next appears in your Storybook. You can run `npm run storybook` now and refresh as we go."*

See [`storybook-wiring.md`](storybook-wiring.md) for full file specs + the existing-Storybook 3-way branch logic.

## Step 3 — Folder 1: foundations/

Per-folder loop (used in Steps 3-9):

```
3.1  Sub-agent dispatch (per scenario — see § Sub-flow branches below)
3.2  Compose proposed file list (foundations/principles.mdx, accessibility.mdx, content-voice.mdx, layout.mdx, tokens.mdx)
3.3  For each proposed file:
       3.3.a  Render preview using template + extracted content
       3.3.b  Show diff (if file already exists)
       3.3.c  Ask: approve | edit Decisions/Rationale | skip
       3.3.d  On approve: write file with status frontmatter (placeholder if many TODOs, else in-progress)
3.4  Update index-manifest.json:scaffold_progress.completed += ["1-foundations"]
3.5  Announce: "Refresh Storybook to see them under '1-foundations' in the sidebar"
```

## Step 4 — Folder 2: styles/

Same loop. Files: `color.mdx`, `typography.mdx`, `spacing.mdx`, `elevation.mdx`, `iconography.mdx`. Templates use `<SwatchRow>` (color), `<TypeRow>` (typography), `<HierarchyDiagram>` + `<SpacingScale>` + `<SpacingDemo>` (spacing), `<ElevationDemo>` (elevation), gallery (iconography).

## Step 5 — Folder 3: assets/

Different — these are binary. Ask the user:

> *"Where do your assets live? Provide paths for: logos, illustrations, icons (if not loaded from icon font), placeholders. Skip any you don't have."*

For each provided path, copy a thin .mdx from `asset-gallery.mdx.template` referencing the `dir`. The `<AssetGallery>` block reads files at render time.

## Step 6 — Folder 4: components/

Per-component sub-loop (within the folder loop):

```
6.1  For each component in extractor output:
       6.1.a  Render preview using component.mdx.template + extracted variants/states/tokens
       6.1.b  Show diff (if file exists)
       6.1.c  Ask: approve | edit Decisions/Rationale | skip
       6.1.d  On approve: write components/<name>.mdx
       6.1.e  If scenario != figma-only: stub <name>.stories.<ext> if absent — extension is framework-aware:
                - @storybook/sveltekit, @storybook/svelte-vite → <name>.stories.svelte (CSF3 in Svelte) or <name>.stories.ts (CSF3 with addon-svelte-csf)
                - @storybook/vue3-vite, @storybook/vue3-webpack5 → <name>.stories.ts (CSF3, render-fn imports the .vue SFC)
                - @storybook/angular → <name>.stories.ts (Angular CSF)
                - @storybook/web-components-vite, @storybook/web-components-webpack5 → <name>.stories.ts (Lit/CSF)
                - @storybook/react-vite, @storybook/react-webpack5, @storybook/nextjs, @storybook/preact-* → <name>.stories.tsx
                - @storybook/qwik, @storybook/html-* → <name>.stories.ts
                - Read framework from signals.storybook_framework (detect.py); skip story stub when framework=null (cannot pick extension safely)
6.2  Write/update components-index.json with all approved entries
6.3  Compose components/inventory.mdx (auto-generated from index)
6.4  Compose components/cheat-sheet.mdx (preview from extracted use cases; user edits)
```

## Step 7 — Folder 5: patterns/ (only if Q6=yes)

Same loop. Patterns extracted from any composition documentation in extractor output OR seeded from Carbon's pattern catalog (loading, notifications, empty-state, form, dialog).

## Step 8 — Folder 6: data-viz/ (only if Q7=yes)

Same loop. Data-viz components extracted from detected charting libs (recharts, d3, etc.).

## Step 9 — Folder 7: specs/ (only if Q8=yes)

Different — pages aren't auto-extracted (page-level rationale isn't in code/Figma). Use Q8 sub-prompt list to scaffold stub `<page>.mdx` files; user fills.

## Step 10 — Hand off to hd-setup voice authoring

This skill does NOT author voice. Announce:

> *"Now let's set up your harness's voice. Run `/hd:setup --voice-only` to add Voice / Use case / Forbidden moves to your AGENTS.md. (Or skip — your harness still works without these, but agents will lack tone consistency.)"*

If `signals.voice_docs_found` is non-empty, note: *"You already have voice content at: `<paths>`. /hd:setup will offer to extend or replace."*

## Step 11 — Generate Tracker.mdx + Audit.mdx

Run `scripts/generate-tracker.mjs` and `scripts/generate-audit.mjs`. These read all the `.mdx` files written in Steps 3-9 + the audit_findings emitted by sub-agents.

## Step 12 — Final summary

Print:

```
✓ /hd:design-system establish complete
  scenario:        <S>
  folders written: <list>
  files written:   N (.mdx + .stories.tsx + .storybook/* + harness-blocks)
  TODOs:           <count>
  audit findings:  <by-type-count>
  storybook:       <wired|preserved|adopted>
  next:            /hd:setup --voice-only   # add AGENTS.md voice sections
                   /hd:review l1            # validate before moving on
```

Stop hook fires (`post-setup-summary.sh`).

---

## Sub-flow branches (per scenario)

### Sub-flow A — `starter` (greenfield)

```
3.1.A  Run S-0 questionnaire (8 questions — see Appendix A.5 of plan)
3.1.B  Dispatch:
         Task harness-designing:analysis:design-system-starter-recommender(answers: {...})
3.1.C  Show top 5 starters; user picks one
3.1.D  Copy seed_path content into context-skeleton variables
3.1.E  Proceed with folder loop (Steps 3-9) using seeded content for each .mdx preview
```

### Sub-flow B — `figma-only`

```
3.1.A  Confirm Figma URL (from figma.config.json or prompt)
3.1.B  Verify MCP via mcp__Figma__whoami; on fail, dispatch ai-integration-scout(tool_name: "figma") + pause
3.1.C  Dispatch:
         Task harness-designing:research:figma-extractor(file_url: "<URL>", scope: "full", context: "establish")
3.1.D  Per folder, use figma-extractor result to seed previews
3.1.E  Component pages: NO .stories.tsx scaffolded; component.mdx template uses {{IF_FIGMA_ONLY}} branch (renders <FigmaFrame> in place of Canvas)
```

### Sub-flow C — `code-only`

```
3.1.A  Dispatch:
         Task harness-designing:research:code-introspector(scope: "full", context: "establish")
3.1.B  Per folder, use code-introspector result to seed previews
3.1.C  Batched rationale prompts: foundations gets 3 questions; per-component gets 1-line description in groups of 5
3.1.D  Component pages: stub .stories.tsx for each component without one
```

### Sub-flow D — `code-and-figma`

```
3.1.A  Confirm Figma URL + verify MCP
3.1.B  PARALLEL dispatch (≤5 batch):
         Task harness-designing:research:figma-extractor(...)
         Task harness-designing:research:code-introspector(...)
3.1.C  Inline diff procedure (compare structured outputs):
         - Per category (tokens / components / variants / states):
           - Match by canonical name (normalize case + dots → hyphens for comparison)
           - 4 outcomes: aligned · figma-only · code-only · mismatched
         - Render foundations/alignment-gaps.mdx with action-row table
         - Stable hash per row (SHA-1 of category+name+outcome)
         - Summary count: "47 aligned, 8 figma-only, 3 code-only, 2 mismatched"
3.1.D  Per folder, use diff result to seed previews; conflicting values present both with status flag
3.1.E  Component pages: scaffold .stories.tsx + record figma_node_id in components-index for FigmaFrame block
```

## State persistence

After every successful folder write, update `index-manifest.json`:

```json
{
  "scaffold_progress": {
    "current_folder": "<next-folder>",
    "completed": ["1-foundations", "2-styles"],
    "started_at": "<ISO>",
    "last_step_at": "<ISO>"
  }
}
```

If user invokes `/hd:design-system establish --resume`, skill reads `scaffold_progress.completed` and skips to `current_folder`.

## Failure modes

- **Sub-agent times out** — partial result returned; proceed with what was extracted, mark missing items as `<!-- TODO: re-extract -->` placeholders
- **MCP unavailable** (figma-only / code-and-figma) — fall back to user paste-organize for tokens; skip component extraction
- **User cancels mid-folder** — write what's approved so far; mark folder as `in-progress` in scaffold_progress; resume next time

## Source references

- Sub-agents: [`figma-extractor`](../../../agents/research/figma-extractor.md) · [`code-introspector`](../../../agents/research/code-introspector.md) · [`design-system-starter-recommender`](../../../agents/analysis/design-system-starter-recommender.md)
- Templates: [`page-templates.md`](page-templates.md) · [`harness-blocks.md`](harness-blocks.md)
- Storybook scaffold: [`storybook-wiring.md`](storybook-wiring.md)
- Status frontmatter: [`../../hd-setup/references/status-frontmatter.md`](../../hd-setup/references/status-frontmatter.md) (when written)
- Workflow pattern source: [feature-dev fleet pattern](https://github.com/anthropics/claude-code/blob/main/plugins/feature-dev/commands/feature-dev.md)
