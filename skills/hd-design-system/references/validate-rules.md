# validate-rules — frontmatter + MDX + components-index ↔ files coverage + IA sync

**Loaded by:** [`SKILL.md`](../SKILL.md) `validate` mode + delegated from `/hd:review l1`. Owns: the validation rule catalog. Implementation lives in [`../scripts/validate.mjs`](../scripts/validate.mjs).

## Output

Validate is read-only. Exits non-zero on high-severity drift; emits findings list to stdout. Does NOT regenerate Tracker or Audit (that's `tracker` mode's job).

## Rule catalog

YAML rubric (frontmatter) + prose (per-rule fix instructions):

```yaml
rubric_name: hd-design-system-validate
severity_default: medium
exit_codes:
  - { code: 0, when: "no high-severity findings" }
  - { code: 1, when: "≥1 high-severity finding" }
  - { code: 2, when: "I/O failure (missing manifest, unreadable file)" }
rules:
  - id: frontmatter-present
    description: Every .mdx under docs/context/design-system/ has valid status frontmatter
    severity: high
  - id: frontmatter-status-enum
    description: status field is one of empty | placeholder | in-progress | filled
    severity: high
  - id: frontmatter-todos-int
    description: todos field is a non-negative integer
    severity: medium
  - id: index-to-file
    description: Every entry in components-index.json has a matching <name>.mdx file
    severity: high
  - id: file-to-index
    description: Every <name>.mdx in 4-components/ (except inventory/cheat-sheet/patterns) has an index entry
    severity: medium
  - id: tokens-consumed-non-empty
    description: Every component in components-index.json has non-empty tokens_consumed[]
    severity: medium
  - id: mdx-parses
    description: Every .mdx parses as valid MDX (no broken JSX islands, no unresolved imports)
    severity: high
  - id: ia-sync
    description: <Meta title="<N>-<folder>/<File>"> numeric prefix + folder name matches the directory
    severity: high
  - id: harness-blocks-importable
    description: Imports from ../.storybook/harness-blocks/ resolve when storybook.enabled
    severity: medium
  - id: figma-frame-when-figma-only
    description: Components in figma-only scenario have figma_node_id in components-index OR FigmaFrame in .mdx
    severity: medium
  - id: stories-when-not-figma-only
    description: Components in non-figma-only scenarios have stories_path in components-index OR <Component>.stories.tsx file
    severity: low
  - id: no-img-in-md
    description: components/*.mdx MUST NOT contain raw <img> tags (visuals belong in <FigmaFrame> or <Canvas>)
    severity: high
  - id: variant-combo-rule
    description: Components with >10 variant combinations list axes (not enumerated combinations) in Types section
    severity: low
```

## Per-rule fix instructions

### `frontmatter-present`
**Fix:** Add status frontmatter to top of file:
```yaml
---
status: placeholder
last_filled: <ISO date>
todos: <count>
---
```

### `frontmatter-status-enum`
**Fix:** Change status to one of the 4 valid values. Use `inferStatus` logic from tracker-format.md if unsure.

### `frontmatter-todos-int`
**Fix:** Set `todos` to count of `<!-- TODO` markers in the file. If unknown, recompute via `grep -c '<!-- TODO' <file>`.

### `index-to-file`
**Fix:** For each missing file, EITHER:
- Create the `.mdx` (run `/hd:design-system evolve` and approve the missing component), OR
- Remove the orphan entry from `components-index.json`

### `file-to-index`
**Fix:** For each orphan file, EITHER:
- Add an index entry (run `/hd:design-system evolve` to regenerate index), OR
- Move file to a different folder if it's not a component

### `tokens-consumed-non-empty`
**Fix:** Components without consumed tokens are usually unstyled or misclassified. Either populate `tokens_consumed[]` (run evolve to re-extract) or remove the entry if the component isn't real.

### `mdx-parses`
**Fix:** Open the file; run `npx storybook dev` to see the parse error in browser; fix the JSX or import path. Common causes:
- Missing import for a harness-block (`import { Panel } from '../../../.storybook/harness-blocks'`)
- Unbalanced `{{}}` substitution placeholder (template wasn't fully filled)
- Self-closing tag issues with custom components

### `ia-sync`
**Fix:** Update `<Meta title=...>` to match the file's directory. E.g., file at `docs/context/design-system/2-styles/color.mdx` MUST have `<Meta title="Styles/Color">` (the prefix `2-` is parsed; `Styles` is the section).

### `harness-blocks-importable`
**Fix:** Run `/hd:design-system establish` (or `--rewire-storybook`) to regenerate `.storybook/harness-blocks/` with all 15 blocks.

### `figma-frame-when-figma-only`
**Fix:** Either populate `figma_node_id` in `components-index.json` (run evolve) or add `<FigmaFrame url="...">` block manually to the .mdx.

### `stories-when-not-figma-only`
**Fix:** Run evolve to scaffold missing `.stories.tsx` stubs.

### `no-img-in-md`
**Fix:** Remove `<img>` tags from component .mdx files. Replace with `<FigmaFrame>` (Figma reference) or `<Canvas>` (live render). The agent contract is text-only; visuals belong in JSX islands rendered by Storybook.

### `variant-combo-rule`
**Fix:** Replace enumerated variant table (e.g., 195 rows) with axes table:

```mdx
## Variants

| Axis | Values | Use case |
|---|---|---|
| `style` | primary, secondary, ... | Semantic role |
| `fill` | filled, tonal, ... | Visual emphasis |
| `size` | small, medium, large | Density |
```

Below the table, link to `<Canvas of={Stories.AllVariants}>` for visual proof of combinations.

## Output format (validate.mjs stdout)

```
✓ frontmatter-present (12 files checked)
✓ frontmatter-status-enum (12 files checked)
✓ frontmatter-todos-int (12 files checked)
✗ index-to-file (HIGH) — 1 finding
  - components-index.json:Button → expected docs/context/design-system/4-components/button.mdx (NOT FOUND)
✓ file-to-index (12 files checked)
✗ tokens-consumed-non-empty (MEDIUM) — 2 findings
  - Card (no tokens_consumed)
  - Badge (no tokens_consumed)
✓ mdx-parses (12 files parsed)
✓ ia-sync (12 files checked)
✗ no-img-in-md (HIGH) — 1 finding
  - 4-components/button.mdx:42 contains <img src="...">
─────
3 findings (2 HIGH, 2 MEDIUM, 0 LOW). Exit 1.
```

When `--json` flag is passed, output is JSON instead — useful for `/hd:review` to parse:

```json
{
  "rubric": "hd-design-system-validate",
  "exit_code": 1,
  "summary": { "high": 2, "medium": 2, "low": 0, "passed": 8 },
  "findings": [
    { "rule": "index-to-file", "severity": "high", "evidence": [...] },
    ...
  ]
}
```

## Performance

Validate is read-only and runs in <1s for typical repos (~50 components). Cached MDX parses via mtime check.

## Integration with `/hd:review`

`/hd:review l1` invokes `validate` with `--json`. Findings feed into the L1 health-bar computation. Specifically:

- ≥1 HIGH finding → Layer 1 health: ⚠️ amber
- ≥3 MEDIUM findings → Layer 1 health: 🟡 yellow
- 0 HIGH + <3 MEDIUM → Layer 1 health: ✅ green

## What this skill does NOT validate

- Code implementation correctness (out of scope — this is doc validation)
- Storybook story file correctness (Storybook itself catches these on build)
- AGENTS.md voice section presence (that's hd-setup's check via voice_docs_found)
- Figma file validity (figma-extractor catches MCP errors)

## Source references

- Status frontmatter schema: [`../../hd-setup/references/status-frontmatter.md`](../../hd-setup/references/status-frontmatter.md) (when written)
- Renderer: [`../scripts/validate.mjs`](../scripts/validate.mjs)
- Page templates that the validator checks against: [`page-templates.md`](page-templates.md)
- IA sync rule definition: [`storybook-wiring.md` § IA sync rule](storybook-wiring.md)
