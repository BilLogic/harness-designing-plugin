# harness-blocks — 15 custom MDX components catalog

**Loaded by:** [`page-templates.md`](page-templates.md) (used inside templates), [`storybook-wiring.md`](storybook-wiring.md) (scaffolded into `.storybook/harness-blocks/`).

These are the custom MDX components our scaffolded Storybook ships. Modeled on Claude Design's HTML reference patterns (panels, swatch rows, type rows, hierarchy diagrams) so the rendered Storybook visually matches a real DS reference, not a generic markdown render.

All blocks live as `.tsx` files under [`../assets/harness-blocks/`](../assets/harness-blocks/) at scaffold-source location. Scaffolded into `.storybook/harness-blocks/` in the user's repo at establish Step 2.

## The 15 blocks

| Block | Used in templates | Purpose |
|---|---|---|
| **`<Panel name source>`** | component, pattern, page-spec | Container card with header (name + source path link) + body slot. Models Claude Design's `panel-header` + `panel-body` pattern. |
| **`<SwatchRow scheme>`** | style-category (color) | 5 colored swatches per role group: scheme / scheme-text / on-scheme / scheme-container / on-scheme-container. Reads tokens from CSS vars. |
| **`<SurfaceScale />`** | style-category (color) | The 5-step surface scale (lowest → highest container). |
| **`<TextAndOutline />`** | style-category (color) | on-surface / outline / outline-variant rows. |
| **`<StateLayerScale role>`** | style-category (color) | state-08 / state-12 / state-16 layer demos for hover/focus/press. |
| **`<TypeRow token>`** | style-category (typography) | Live sample text at actual size + spec column (font / size / line-height / weight). |
| **`<HierarchyDiagram levels>`** | style-category (spacing) | Visual nested boxes showing Element → Card → Section → Modal hierarchy. |
| **`<SpacingScale />`** | style-category (spacing) | Numeric scale visualization (4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 ...). |
| **`<SpacingDemo level>`** | style-category (spacing) | Padding visualization at element / card / section / modal level. |
| **`<ElevationDemo level>`** | style-category (elevation) | Card with the corresponding shadow applied (5 levels). |
| **`<GridVisualization />`** | foundations/layout | 12-column grid demo with gutters. |
| **`<AssetGallery dir>`** | asset-gallery | Lists files from `dir` + previews + download buttons. Reads filesystem at build time. |
| **`<FigmaFrame url>`** | component (figma-only / both), page-spec | Properly-sized iframe embedding Figma frame. |
| **`<HarnessStatusBanner />`** | (auto-injected by `HarnessDocsContainer`) | Reads frontmatter status + renders banner with emoji + last_filled + todos count. |
| **`<AuditFinding>`** | audit | One audit finding row — type tag + severity color + file:line list (clickable) + optional side-by-side preview + action button. |

## Per-block API + implementation hints

### `<Panel name source>`

```tsx
type PanelProps = {
  name: string;          // Display name (e.g., "Color styles")
  source: string;        // Code path (e.g., "design-system/src/components/Button")
  children: React.ReactNode;  // The actual demo content (usually <Canvas>)
};
```

Render: bordered card with `panel-header` div (flex row: name on left, source path link on right) + `panel-body` div (children). Source path is rendered as a code-styled link to the file (uses `vscode://file/...` URL scheme when available).

### `<SwatchRow scheme>`

```tsx
type SwatchRowProps = {
  scheme: string;        // e.g., "primary", "secondary", "danger"
};
```

Render: 5 swatches in a row. Reads CSS vars `--color-{scheme}`, `--color-{scheme}-text`, `--color-on-{scheme}`, `--color-{scheme}-container`, `--color-on-{scheme}-container`. Each swatch shows label + hex (computed via `getComputedStyle`).

Falls back gracefully when vars are missing (renders empty cell with "missing" placeholder).

### `<SurfaceScale />`

Reads CSS vars `--color-surface-container-{lowest|low|medium|high|highest}`. Renders 5 stacked rows showing each surface tier with its hex.

### `<TextAndOutline />`

Reads `--color-on-surface`, `--color-on-surface-variant`, `--color-outline`, `--color-outline-variant`. Renders a 4-row table.

### `<StateLayerScale role>`

```tsx
type StateLayerScaleProps = {
  role: string;  // e.g., "primary"
};
```

Renders 3 swatches showing `--color-{role}-state-08`, `state-12`, `state-16` overlay opacities. Labels the use case (hover / focus / pressed).

### `<TypeRow token>`

```tsx
type TypeRowProps = {
  token: string;  // e.g., "headline-large"
};
```

Reads `--md-sys-typescale-{token}-{font|size|line-height|weight|tracking}` (or team's naming convention via `index-manifest.json:tokens.naming_pattern`). Renders 2-column row: live sample text on left ("The quick brown fox..." at the actual style), spec table on right (font / size / line-height / weight).

### `<HierarchyDiagram levels>`

```tsx
type HierarchyDiagramProps = {
  levels: string[];  // e.g., ['Element', 'Card', 'Section', 'Modal']
};
```

Renders nested concentric boxes; each labeled with the level name. Demonstrates the spacing-context hierarchy.

### `<SpacingScale />`

Reads `--spacing-{0,1,2,3,4,5,6,7,8,...}` or `--space-{xs,sm,md,lg,xl,2xl,...}` (auto-detect naming). Renders horizontal bars sized to the actual values, labeled with the token name + value.

### `<SpacingDemo level>`

```tsx
type SpacingDemoProps = {
  level: 'element' | 'card' | 'section' | 'modal';
};
```

Renders a sample container at the specified context level with padding demos overlaid.

### `<ElevationDemo level>`

```tsx
type ElevationDemoProps = {
  level: 1 | 2 | 3 | 4 | 5;
};
```

Renders a card with `box-shadow: var(--elevation-light-{level})`. Labels the level + the shadow value.

### `<GridVisualization />`

Renders 12 columns at the configured breakpoint. Reads `--grid-gutter`, `--grid-margin`, `--breakpoint-{sm,md,lg,xl}` from CSS.

### `<AssetGallery dir>`

```tsx
type AssetGalleryProps = {
  dir: string;  // e.g., "../docs/context/design-system/3-assets/logos"
};
```

At build time (Storybook static build), enumerates files in `dir`, generates a grid with file previews (image thumbs for raster/SVG, file icon for others), download links, and copy-path buttons. Implementation uses `import.meta.glob` (Vite) or `require.context` (Webpack).

### `<FigmaFrame url>`

```tsx
type FigmaFrameProps = {
  url: string;  // Full Figma frame URL
  height?: number;  // Default: 600
};
```

Renders Figma's official embed iframe (`https://www.figma.com/embed?embed_host=storybook&url=<encoded>`). Width 100%; height configurable.

### `<HarnessStatusBanner />`

Auto-injected by `HarnessDocsContainer` (not used directly in MDX). Reads `parameters.docs.metadata` (Storybook 8+) or parses frontmatter from the page's source MDX. Renders:

```
[STATUS_EMOJI] Harness status: <status> · last filled <date> · <N> TODOs remaining
```

Status colors: ⬜ gray, 📋 yellow-tan, 🟡 yellow, ✅ green.

### `<AuditFinding>`

```tsx
type AuditFindingProps = {
  type: 'discrepancy' | 'redundancy' | 'orphan-token' | 'inline-value' | 'naming-inconsistency' | 'doc-fragment';
  severity: 'high' | 'medium' | 'low';
  locations: { path: string; line: number }[];
  subject: string;
  evidence?: { values?: string[]; preview_left?: string; preview_right?: string; ... };
  suggestedAction: { verb: string; target: string; details: string };
  children?: React.ReactNode;
};
```

Renders:
- Header: type tag (color-coded by severity) + subject + severity badge
- Locations: clickable file:line list
- Evidence: optional side-by-side preview (for redundancies) or value comparison (for discrepancies)
- Suggested action: button with verb + target ("Consolidate to src/styles/_colors.scss:42")

## Visual styling

`harness-styles.css` (also scaffolded into `.storybook/harness-blocks/`) defines:

- `.harness-hero` — Claude Design hero block (eyebrow + headline + lede + meta-strip)
- `.harness-page-grid` — 2×2 grid for welcome page reference cards
- `.harness-page-card` — individual card in the grid
- `.harness-panel` — panel container (header + body)
- `.harness-panel-header` — panel header row (name + source link)
- `.harness-panel-body` — panel body (live demo)
- `.harness-swatch-row` — 5-swatch flex row
- `.harness-swatch` — individual swatch (label + hex)
- `.harness-type-row` — 2-column type-row (sample + spec)
- `.harness-hierarchy-diagram` — nested concentric boxes
- `.harness-status-banner` — status banner with emoji + meta
- `.harness-audit-finding` — audit finding row layout
- `.harness-audit-severity-{high|medium|low}` — severity color modifiers

Sourced visually from Claude Design's [`tokens.css`](file:///tmp/design-fetch/plus-bs4/project/tokens.css) reference styles. Adapted to consume the user's tokens (not hardcoded).

## Extending

Teams can add custom blocks by:
1. Drop new `.tsx` file in `.storybook/harness-blocks/`
2. Import in MDX with relative path
3. Use in template substitution if scaffolded by `establish` (add to `assets/harness-blocks/` to ship)

`validate-rules.md` doesn't enforce a closed set; custom blocks are allowed.

## Source references

- Visual benchmark: [Claude Design PLUS-BS4 bundle](file:///tmp/design-fetch/plus-bs4/project/) (panels, swatches, type rows, hierarchy)
- storybook-design-token addon (DesignTokenDocBlock pattern): [storybook.js.org/addons/storybook-design-token](https://storybook.js.org/addons/storybook-design-token)
- Fluent UI custom Storybook addon (FluentDocsContainer/FluentDocsPage equivalent): [github.com/microsoft/fluentui/tree/master/packages/react-components/react-storybook-addon](https://github.com/microsoft/fluentui/tree/master/packages/react-components/react-storybook-addon)
