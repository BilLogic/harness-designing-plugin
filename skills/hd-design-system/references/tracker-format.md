# tracker-format — Tracker.mdx generation algorithm

**Loaded by:** [`SKILL.md`](../SKILL.md) `tracker` mode + [`establish-flow.md`](establish-flow.md) Step 11 + [`evolve-flow.md`](evolve-flow.md) Step 6. Owns: the algorithm that produces `0-welcome/Tracker.mdx`. Implementation lives in [`../scripts/generate-tracker.mjs`](../scripts/generate-tracker.mjs).

## Output location

`docs/context/design-system/0-welcome/Tracker.mdx` — auto-generated. Storybook reads it via the same `stories: ['../docs/context/design-system/**/*.mdx']` glob.

The page renders at `Welcome / Fill Tracker` in Storybook sidebar.

## Status emoji legend (load-bearing — used everywhere)

| Emoji | Status | Meaning |
|---|---|---|
| ⬜ | empty | File doesn't exist OR exists but has zero content beyond frontmatter |
| 📋 | placeholder | Template scaffolded; all sections still TODO |
| 🟡 | in-progress | Some TODOs cleared, some remain |
| ✅ | filled | 0 TODOs remaining; status manually confirmed OR auto-confirmed by validate |

These emojis are used consistently in: Tracker.mdx · MDX status banners · post-setup-summary hook · `/hd:review` health bars.

## Generation algorithm (4 phases)

### Phase 1 — Read manifest + folder enablement

```js
const manifest = JSON.parse(readFile('docs/context/design-system/index-manifest.json'));
const enabledFolders = [
  '0-welcome',
  '1-foundations',
  '2-styles',
  '3-assets',  // always — even if empty, gets a row showing 'no assets yet'
  '4-components',
  ...(manifest.folders_enabled.patterns ? ['5-patterns'] : []),
  ...(manifest.folders_enabled.data_viz ? ['6-data-viz'] : []),
  ...(manifest.folders_enabled.specs ? ['7-specs'] : []),
];
```

### Phase 2 — Walk every `.mdx` and collect status

```js
const files = [];
for (const folder of enabledFolders) {
  for (const file of glob(`docs/context/design-system/${folder}/**/*.mdx`)) {
    const fm = parseFrontmatter(file);
    const todoCount = countTodoMarkers(file);  // counts <!-- TODO --> patterns
    files.push({
      folder,
      path: file,
      status: fm.status || inferStatus(todoCount),
      last_filled: fm.last_filled,
      todos: todoCount,
    });
  }
}
```

`inferStatus(todoCount)`:
- 0 TODOs → `filled`
- 1+ TODOs and last_filled present → `in-progress`
- file exists but no last_filled → `placeholder`
- file doesn't exist → `empty`

### Phase 3 — Cross-check components-index.json

```js
const componentsIndex = JSON.parse(readFile('docs/context/design-system/4-components/components-index.json'));
const indexNames = new Set(componentsIndex.map(c => c.name.toLowerCase()));
const docNames = new Set(
  files.filter(f => f.folder === '4-components')
       .map(f => path.basename(f.path, '.mdx').toLowerCase())
);

const orphanInIndex = [...indexNames].filter(n => !docNames.has(n));
const orphanOnDisk = [...docNames].filter(n => !indexNames.has(n) && !['inventory', 'cheat-sheet', 'patterns'].includes(n));
```

These feed the IA sync health section.

### Phase 4 — Compute next-actions ranking

For every file with `status != 'filled'`, compute:

```js
const importance = (
  // Components — weight by tokens_consumed.length (high = many components depend on this)
  file.folder === '4-components' ? (componentsIndex[file.name]?.tokens_consumed?.length ?? 1) :
  // Foundations — weight by reference count (how many other docs link to this one)
  countCrossRefs(file.path)
);

const ease = 1 / (1 + file.todos * 0.5);  // fewer TODOs = easier to finish

const score = importance * ease;
```

Sort descending; take top 5.

### Phase 5 — Render

Use the `tracker.mdx.template`. Substitute:

- `{{TIMESTAMP}}` — ISO timestamp
- `{{SCENARIO}}` — from `manifest.scenario`
- `{{STORYBOOK_STATUS}}` — `wired` / `preserved` / `not enabled`
- `{{OVERALL_PCT}}` — round((filled+in-progress*0.5) / total * 100)
- `{{PROGRESS_BAR}}` — Unicode progress bar (`██████████░░░░░`) sized to OVERALL_PCT
- `{{FILLED_COUNT}}`, `{{TOTAL_COUNT}}`
- `{{SECTION_TABLE}}` — markdown table with one row per folder
- `{{COMPONENT_DETAIL_TABLE}}` — collapsed `<details>` block with per-component rows
- `{{IA_SYNC_BULLETS}}` — list of orphans + missing-tokens-consumed + MDX parse errors
- `{{NEXT_ACTIONS_LIST}}` — top 5 ranked

Write to `docs/context/design-system/0-welcome/Tracker.mdx`.

## Tracker.mdx template (full)

```mdx
import { Meta } from '@storybook/blocks';

<Meta title="Welcome/Fill Tracker" />

# Harness Fill Tracker

Generated {{TIMESTAMP}} · scenario: `{{SCENARIO}}` · Storybook {{STORYBOOK_STATUS}}

## Overall: {{OVERALL_PCT}}% filled

`{{PROGRESS_BAR}}` {{FILLED_COUNT}} of {{TOTAL_COUNT}} files

## By section

| Section | Filled | In progress | Empty | Placeholder | Total |
|---|---|---|---|---|---|
{{SECTION_TABLE}}

## Component coverage detail

<details><summary>Components ({{COMP_FILLED}} filled / {{COMP_IN_PROGRESS}} in-progress / {{COMP_PLACEHOLDER}} placeholder)</summary>

| Component | Status | TODOs | Last filled | Storybook |
|---|---|---|---|---|
{{COMPONENT_DETAIL_TABLE}}

</details>

## IA sync health

{{IA_SYNC_BULLETS}}

## Next 5 actions (computed by importance × ease)

{{NEXT_ACTIONS_LIST}}

---

*Run `/hd:design-system tracker` to regenerate. Run `/hd:design-system validate` to check for drift.*
```

## When this file is regenerated

- After every `establish` finalize (Step 11)
- After every `evolve` finalize (Step 6)
- On explicit `/hd:design-system tracker` invocation
- After `/hd:review l1` audit completes (delegated)
- (Recommended) on PostToolUse hook firing for `Edit|Write` on any `*.mdx` under `docs/context/design-system/` — but this is OFF by default (would regenerate too aggressively). Teams can opt in by extending `hooks/hooks.json`.

## Integration with `<HarnessStatusBanner>`

The status frontmatter that the Tracker reads from is the same data that `<HarnessStatusBanner>` (a harness-block) reads to render the per-page banner. Single source — when one updates, the other reflects on next render.

## Source references

- Status frontmatter schema: [`../../hd-setup/references/status-frontmatter.md`](../../hd-setup/references/status-frontmatter.md) (when written)
- Renderer implementation: [`../scripts/generate-tracker.mjs`](../scripts/generate-tracker.mjs)
- Template file: [`../assets/page-templates/tracker.mdx.template`](../assets/page-templates/tracker.mdx.template)
- Audit page (sibling): [`audit-format.md`](audit-format.md)
