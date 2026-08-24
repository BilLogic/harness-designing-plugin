# page-templates — 9 MDX template shapes + variant-combo rule + custom layout extension

**Loaded by:** [`establish-flow.md`](establish-flow.md) (writes), [`evolve-flow.md`](evolve-flow.md) (recognizes existing shapes), [`validate-rules.md`](validate-rules.md) (verifies). Owns: per-page-kind content shape, variable substitution, conditional rendering rules, the variant-combo rule.

## Template inventory

The 9 templates live as `.mdx.template` files under [`../assets/page-templates/`](../assets/page-templates/). Each grounded in a research source.

| Template | Used for | Source inspiration |
|---|---|---|
| **welcome.mdx.template** | `0-welcome/README.mdx` (1) | Claude Design `index.html` (hero + page-grid) + material-web `intro.md` |
| **tracker.mdx.template** | `0-welcome/Tracker.mdx` (auto-gen) | Dashboard pattern (no DS analog) |
| **audit.mdx.template** | `0-welcome/Audit.mdx` (auto-gen) | Audit findings list grouped by type — harness-specific |
| **prose-page.mdx.template** | `1-foundations/<topic>.mdx` (5), inventory.mdx + cheat-sheet.mdx (per folder) | Stitch DESIGN.md "Do's and don'ts" + material-web foundations |
| **style-category.mdx.template** | `2-styles/<category>.mdx` (5) | Claude Design `color_and_type.html` + `spacing_and_elevation.html` + material-web `theming/` |
| **asset-gallery.mdx.template** | `3-assets/<type>.mdx` (≤4) | Polaris brand-assets pattern |
| **component.mdx.template** | `4-components/<name>.mdx` (N) | Claude Design `components.html` (panels) + material-web component shape + Carbon single-MDX + Fluent autodocs description |
| **pattern.mdx.template** | `5-patterns/<name>.mdx` (N opt) | Claude Design `patterns.html` (visual demos) + Carbon patterns |
| **page-spec.mdx.template** | `7-specs/<page>.mdx` (N opt) | Fluent UI `specs/` adapted for pages + Figma iframe embed |

## Variable substitution

All templates use `{{HANDLEBARS}}` substitution. Common variables across templates:

- `{{TITLE}}` — page title
- `{{DOC_PATH}}` — relative path of the `.mdx` (for status banner backref)
- `{{STATUS}}` — empty | placeholder | in-progress | filled
- `{{LAST_FILLED}}` — ISO date
- `{{TODOS}}` — count of `<!-- TODO` markers
- `{{ONE_LINE_PURPOSE}}` — ≤120 chars

Per-template additional variables specified inline in each template file.

## Conditional rendering markers

Three conditional branches handled at scaffold time (NOT at MDX render time — these resolve to plain MDX):

| Marker | When true | Affects |
|---|---|---|
| `{{IF_HAS_STORIES}}` | Scenario != figma-only AND `<Component>.stories.tsx` exists | component.mdx + pattern.mdx — render `<Canvas>`, `<Controls>`, `<Stories>`, `<ArgsTable>` |
| `{{IF_FIGMA_ONLY}}` | Scenario == figma-only | component.mdx — render `<FigmaFrame>` instead of `<Canvas>` + "implement code" hint |
| `{{IF_FIGMA_FRAME}}` | components-index has Figma URL for this component | component.mdx — adds "Design reference" section with `<FigmaFrame>` |
| `{{IF_MODES}}` | `index-manifest.json:tokens.modes.length > 1` | style-category.mdx — render Mode mappings section |
| `{{IF_MULTI_BRAND}}` | `index-manifest.json:tokens.brands.length > 1` | style-category.mdx — render Brand variants section |
| `{{IF_PATTERNS}}`, `{{IF_DATA_VIZ}}`, `{{IF_SPECS}}`, `{{IF_ASSETS}}` | Folder enabled in `index-manifest.json:folders_enabled` | welcome.mdx — show in section list |

## Variant-combo rule

If a component has >10 variant combinations (cartesian product across all variant axes — e.g., plus-uno's Button has 13 styles × 5 fills × 3 sizes = 195), the `.mdx` Types/Variants section MUST list **variant axes** as table rows (one row per axis with the value set), NOT enumerated combinations.

```mdx
## Types

| Axis | Values | Use case |
|---|---|---|
| `style` | primary, secondary, ghost, destructive | Semantic role |
| `fill` | filled, tonal, outline, ghost, text | Visual emphasis |
| `size` | small, medium, large | Density |

(195 combinations; see Live preview for visual gallery.)

<Canvas of={ComponentStories.AllVariants} sourceState="none" />
```

Visual proof of combinations lives in `<Canvas of={Stories.AllVariants}>` rendering. Below the threshold, an enumerated variant table is fine.

## Per-template content (full) — see assets/page-templates/

Each `.mdx.template` file in `../assets/page-templates/` is the canonical source. This reference summarizes the section structure.

### welcome.mdx.template — sections

```
[Hero block — eyebrow + headline + lede + meta-strip]
## Sections           (per-folder one-liner; conditional on folders_enabled)
## How to use this Storybook
## Tracker            (link to Tracker.mdx)
```

### prose-page.mdx.template — sections

```
## {{DECISIONS_HEADER}}     ← "Principles" / "WCAG target" / "Voice" / "Layout rules" / "Tokens"
## Reference
## Do's and don'ts
## Rationale
## Source of truth
## Agent prompt guide
```

### style-category.mdx.template — sections (per category variant)

Color variant:
```
## Color scheme
### Accent schemes        — <SwatchRow> per role
### Status colors         — <SwatchRow> per status
### Brand variants        — when multi-brand
### Neutrals & surfaces   — <SurfaceScale> + <TextAndOutline>
### State layers          — <StateLayerScale>
## Decisions
{{IF_MODES}}## Mode mappings{{/IF_MODES}}
{{IF_MULTI_BRAND}}## Brand variants{{/IF_MULTI_BRAND}}
## Do's and don'ts
## Source of truth
## Agent prompt guide
```

Typography variant:
```
## Type scale
### Display & headlines   — <TypeRow> per token
### Body
### Labels
## Decisions
## Implementation
## Source of truth
## Agent prompt guide
```

Spacing variant:
```
## Context-level hierarchy — <HierarchyDiagram levels={['Element','Card','Section','Modal']}>
## Element tokens          — <SpacingScale>
## Card & section padding  — <SpacingDemo>
## Decisions
## Source of truth
## Agent prompt guide
```

Elevation variant:
```
## Levels                  — <ElevationDemo level={1}> ... <ElevationDemo level={5}>
## When to use which
## Decisions
## Source of truth
## Agent prompt guide
```

Iconography variant:
```
## Icon system
## Available icons         — gallery
## Naming
## Decisions
## Source of truth
## Agent prompt guide
```

### component.mdx.template — sections

```
## Description
## Variants               — <Panel name="Color styles" source="<path>"> wrapping <Canvas>
### Sizes                 — <Panel> wrapping <Canvas>
### States                — <Panel> wrapping <Canvas>
### Fill treatments       — (or other axis-specific subsections)
## Usage
### Basic                 — code block + <Canvas>
### {{NESTED_FEATURE_SUBSECTIONS}}  — material-web text-field pattern
## Accessibility
## When to use which
## Do's and don'ts
## Theming                — token table + <DesignTokenDocBlock>
## API                    — <ArgsTable>
{{IF_HAS_STORIES}}## Examples — <Canvas> + <Controls> + <Stories>{{/IF_HAS_STORIES}}
{{IF_FIGMA_FRAME}}## Design reference — <FigmaFrame>{{/IF_FIGMA_FRAME}}
## Source of truth
## Decisions
## Agent prompt guide
```

### pattern.mdx.template — sections

```
## Description
## When to use            ← decision tree
## Variants               — <Panel> per variant
## Anatomy                — composition diagram
## Components used        — table linking to components/*.mdx
## Behaviors              — state transitions
## Accessibility
## Do's and don'ts
{{IF_HAS_STORIES}}## Examples — <Canvas>{{/IF_HAS_STORIES}}
## Edge cases
## Source of truth
## Decisions
## Agent prompt guide
```

### page-spec.mdx.template — sections

```
## Reference pages        ← similar pages in other apps
## Page contract          ← URL, props, slots
## Layout                 ← regions
## Components used        ← table
## Content                ← copy strings
## States                 ← table with ARIA col
## Behaviors              ← transitions
## Edge cases
## Accessibility
## Visual reference       — <FigmaFrame>
## Concerns               ← perf, SEO
## Source of truth
## Decisions
## Agent prompt guide
```

### asset-gallery.mdx.template — sections

```
## Decisions
## Gallery                — <AssetGallery dir="...">
## How to reference       — code example
## Do's and don'ts
## Source of truth
## Agent prompt guide
```

### tracker.mdx.template — auto-generated

See [`tracker-format.md`](tracker-format.md).

### audit.mdx.template — auto-generated

See [`audit-format.md`](audit-format.md).

## Custom layout extension

Two patterns; see [`storybook-wiring.md` § Custom layout extension](storybook-wiring.md).

## Inventory + cheat-sheet variants of prose-page.mdx.template

`inventory.mdx` per folder uses the prose-page shape but the body is auto-generated:

```
# {{FOLDER_TITLE}} inventory
> Index of {{FOLDER_TITLE}} pages.

| Page | Status | Last filled |
|---|---|---|
| [{{NAME}}]({{PATH}}) | {{STATUS_EMOJI}} {{STATUS}} | {{LAST_FILLED}} |
| ... | ... | ... |
```

`cheat-sheet.mdx` (components only) follows the use-case → component table pattern from material-web's component cheat sheet.

## Source references

- Sources for each template inline in the inventory table above
- Hand-fill exemplar: plan Appendix C (`components/button.mdx` for plus-uno)
- Storybook MDX block reference: [storybook.js.org/docs/writing-docs/mdx](https://storybook.js.org/docs/writing-docs/mdx)
