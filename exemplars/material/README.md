# Material 3 — harness exemplar

Self-contained Storybook demonstrating the harness against Material 3 — role-based tokens, state layers, elevation tiers.

## Run

```bash
cd exemplars/material
npm install
npm run storybook
```

Storybook opens at `http://localhost:6007`. Sidebar order:

```
0-welcome/
1-foundations/   Design tokens
2-styles/        Color, Typography, Spacing, Elevation
4-components/    Filled Button, Filled Text Field, Outlined Card
```

## What's special about this exemplar

- **Different framework than shadcn / Fluent.** Storybook framework: `@storybook/web-components-vite`. Components in `src/components/` are Lit custom elements, stories author with `lit-html`. The 15 `.tsx` harness-blocks (`<Panel>`, etc.) still render the docs page chrome — Storybook docs is React regardless of story framework.
- **Token coverage spans 5 categories.** Color (role groups + surface tiers + outline) + Typography (15 typescale tokens) + Spacing (4dp base) + Shape (5 radii) + Elevation (6 levels). Larger surface than shadcn or Fluent.
- **State layers.** Hover/focus/pressed are overlay opacities, not separate colors. Means a `<md-filled-button>` and `<md-tonal-button>` (not in v1) get hover state from the same overlay system, automatically themed.

## Files

| Path | What |
|---|---|
| `src/styles/tokens.css` | M3 sys-tier tokens — `--md-sys-color-*`, `--md-sys-typescale-*-{font,size,line-height,weight,tracking}`, `--md-sys-spacing-*`, `--md-sys-elevation-level{0..5}`, `--md-sys-shape-corner-*`, `--md-sys-state-*-state-layer-opacity` |
| `src/components/filled-button.ts` | Lit stub mirroring material-web's filled-button surface |
| `src/components/filled-text-field.ts` | Lit stub mirroring material-web's filled-text-field surface |
| `src/components/outlined-card.ts` | Lit stub for Outlined + Elevated card variants |
| `src/components/*.stories.ts` | Lit-html stories powering `<Canvas of={...} />` |
| `docs/0-welcome/README.mdx` | Entry page |
| `docs/1-foundations/design-tokens.mdx` | Token model — sys vs ref, the four families, state layers |
| `docs/2-styles/{color, typography, spacing, elevation}.mdx` | Visual values rendered live from tokens.css |
| `docs/4-components/*.mdx` | Per-component pages with `<Panel>` blocks |
| `.storybook/main.ts` | `@storybook/web-components-vite` framework |
| `.storybook/preview.ts` | Single light/dark theme global; `[data-theme]` applied via decorator |
| `.storybook/harness-blocks/*.tsx` | The 15 React harness-blocks (same as shadcn/) |

## What's intentionally minimal in v1

- Only 1 button variant (Filled) — M3 has 5 (filled, tonal, outlined, text, elevated)
- Only 1 text field variant (Filled) — M3 has 2 (filled + outlined)
- 2 card variants (Outlined + Elevated) — M3 has 3 (filled is the third)
- No Top app bar, Navigation rail, FAB, Chip, Snackbar, Dialog — covered by the same template patterns
