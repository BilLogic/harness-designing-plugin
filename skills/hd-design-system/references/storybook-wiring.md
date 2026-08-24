# storybook-wiring — generic config + decorators + IA sync rule + existing-Storybook branch

**Loaded by:** [`establish-flow.md`](establish-flow.md) Step 2. Owns: the universal Storybook scaffold (config + 6 decorators + 2 doc renderers + 15 harness-blocks + harness-styles.css), the IA sync rule, and the existing-Storybook 3-way branch logic.

## Universal scaffold (same across all 4 starting states)

What gets written when `establish` Step 2 runs (and existing-Storybook is `no-existing` OR `adopt`):

```
.storybook/
├── main.js                        ← stories glob → docs/context/design-system/**/*.mdx; addons
├── preview.js                     ← 4 globals + 4 decorators + parameters
├── decorators/
│   ├── with-theme-brand.tsx       ← Fluent withFluentProvider equivalent
│   ├── with-direction.tsx         ← LTR/RTL toggle
│   ├── with-aria-live.tsx         ← Fluent verbatim
│   ├── with-react-strict-mode.tsx ← Fluent verbatim
│   ├── harness-docs-container.tsx ← DocsContainer with HarnessStatusBanner
│   └── harness-docs-page.tsx      ← Custom autodocs page renderer
└── harness-blocks/                ← 15 custom MDX components
    ├── Panel.tsx
    ├── SwatchRow.tsx
    ├── SurfaceScale.tsx
    ├── TextAndOutline.tsx
    ├── StateLayerScale.tsx
    ├── TypeRow.tsx
    ├── HierarchyDiagram.tsx
    ├── SpacingScale.tsx
    ├── SpacingDemo.tsx
    ├── ElevationDemo.tsx
    ├── GridVisualization.tsx
    ├── AssetGallery.tsx
    ├── FigmaFrame.tsx
    ├── HarnessStatusBanner.tsx
    ├── AuditFinding.tsx
    └── harness-styles.css
```

The script [`../scripts/scaffold-storybook.mjs`](../scripts/scaffold-storybook.mjs) is the canonical writer. It reads templates from `assets/storybook/`, `assets/decorators/`, and `assets/harness-blocks/` and substitutes:

- `{{FRAMEWORK}}` — from detect.py stack signal (`@storybook/react-vite | @storybook/react-webpack5 | @storybook/vue3-vite | @storybook/svelte-vite | @storybook/web-components-vite | etc.`)
- `{{BRANDS}}` — from `index-manifest.json:tokens.brands` (default: `["default"]`)
- `{{MODES}}` — from `index-manifest.json:tokens.modes` (default: `["light","dark"]`)
- `{{TEAM_THEME_PROVIDER_PATH}}` — `"../src/theme/ThemeProvider"` placeholder; user edits to their actual provider

## main.js — content

```js
export default {
  stories: ['../docs/context/design-system/**/*.mdx'],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    'storybook-design-token',
  ],
  framework: '{{FRAMEWORK}}',
  docs: { defaultName: 'Docs' },
};
```

The `stories` glob points at the harness directly — no `.storybook/components/<Name>.docs.mdx` mirror needed. Storybook reads the canonical `.mdx` files; agent reads the same files. Single source.

## preview.js — content

```js
import { withThemeBrand } from './decorators/with-theme-brand';
import { withDirection } from './decorators/with-direction';
import { withAriaLive } from './decorators/with-aria-live';
import { withReactStrictMode } from './decorators/with-react-strict-mode';
import { HarnessDocsContainer } from './decorators/harness-docs-container';
import { HarnessDocsPage } from './decorators/harness-docs-page';

export const globalTypes = {
  theme: {
    name: 'Theme',
    defaultValue: 'light',
    toolbar: { icon: 'paintbrush', items: {{MODES}} },
  },
  brand: {
    name: 'Brand',
    defaultValue: '{{BRANDS}}'[0],
    toolbar: { icon: 'circlehollow', items: {{BRANDS}} },
  },
  direction: {
    name: 'Direction',
    defaultValue: 'ltr',
    toolbar: { icon: 'transfer', items: ['ltr', 'rtl'] },
  },
  strictMode: {
    name: 'Strict mode',
    defaultValue: 'off',
    toolbar: { icon: 'beaker', items: ['off', 'on'] },
  },
};

export const decorators = [
  withThemeBrand,
  withDirection,
  withAriaLive,
  withReactStrictMode,
];

export const parameters = {
  viewMode: 'docs',
  controls: { expanded: true, sort: 'requiredFirst' },
  a11y: { config: {} },
  docs: {
    container: HarnessDocsContainer,
    page: HarnessDocsPage,
  },
};
```

## IA sync rule

`<Meta title="<N>-<folder>/<File>">` numeric prefix + folder name MUST match the directory under `docs/context/design-system/`. Validated by [`validate-rules.md`](validate-rules.md).

| Storybook prefix | DS folder |
|---|---|
| `0-welcome/` | (Storybook-only — README + Tracker + Audit) |
| `1-foundations/` | `1-foundations/` |
| `2-styles/` | `2-styles/` |
| `3-assets/` | `3-assets/` |
| `4-components/` | `4-components/` |
| `5-patterns/` | `5-patterns/` (when enabled) |
| `6-data-viz/` | `6-data-viz/` (when enabled) |
| `7-specs/` | `7-specs/` (when enabled) |

Adding a new folder under `docs/context/design-system/` (e.g., for a custom team concept) automatically gives it sidebar position via the same rule. Numeric prefixes must be unique.

## Existing-Storybook 3-way branch

Detected via `signals.storybook_present == true` from detect.py. Skill prompts user:

> *"Existing `.storybook/` detected. How should I handle it?*
> *(a) **Adopt** — overwrite with the harness pattern (diff preview before write)*
> *(b) **Preserve** — leave `.storybook/` alone; you wire your existing Storybook manually to read from `docs/context/design-system/`*
> *(c) **Skip Storybook** — no Storybook scaffold; harness still writes `.mdx` files*"*

Use `AskUserQuestion`.

### (a) Adopt path

Diff `.storybook/main.js` and `.storybook/preview.js` against the templates. Show diff. User approves per-file. Existing decorators that match by name are preserved unless the user opts to replace.

### (b) Preserve path

Skip Step 2 entirely. Print a manual-wire hint:

> *"To use the harness pattern with your existing Storybook, point your `stories` config at:*
> *  `'../docs/context/design-system/**/*.mdx'`*
>
> *And import these 6 decorators (we wrote them for you under `harness-blocks/`):*
> *  `withThemeBrand`, `withDirection`, `withAriaLive`, `withReactStrictMode`, `HarnessDocsContainer`, `HarnessDocsPage`*
>
> *See `references/storybook-wiring.md` for the full template."*

Update `index-manifest.json:storybook.existing_handling = "preserve"`.

### (c) Skip path

Don't write anything under `.storybook/`. The harness `.mdx` files still get written; user reads them as plain markdown or wires their own renderer later.

Update `index-manifest.json:storybook.enabled = false`.

## Recommended addon dependencies

After scaffold, tell the user to install:

```bash
npm install --save-dev @storybook/addon-a11y @storybook/addon-docs storybook-design-token
```

Skill is **advisor, not installer** — never runs npm install on the user's behalf.

## Framework adaptability — how harness-blocks work everywhere

**Key fact** (per [Storybook MDX docs](https://storybook.js.org/docs/writing-docs/mdx) — addons/docs has a peer dependency on `react`): Storybook's docs feature is built on React, so MDX custom components must be React components **regardless of which framework hosts your stories**. This means our 15 `.tsx` harness-blocks (`<Panel>`, `<SwatchRow>`, `<TypeRow>`, `<HierarchyDiagram>`, etc.) work unchanged for Svelte / Vue / Angular / Web Components / Qwik / Preact / HTML projects. The doc-page chrome renders in React; the `<Canvas>` block embeds framework-native stories inside it.

What IS framework-specific:
- **`main.js:framework`** — must match the team's installed `@storybook/<framework>-<bundler>` package (read from `signals.storybook_framework`).
- **`*.stories.<ext>`** — extension follows the framework (see "Story file extensions" table below).
- **Story body** — written in the framework's CSF dialect (Svelte stories use addon-svelte-csf or CSF3-with-render; Vue stories return Vue render fns; Angular stories use Angular CSF, etc.).

Our scaffold writes the framework-agnostic pieces (`.mdx` + harness-blocks `.tsx` + `main.js` + `preview.js`) and asks the user before stubbing framework-specific story files.

## Stack-specific notes — `main.js:framework` value

| Stack | `framework` value | Notes |
|---|---|---|
| React + Vite | `@storybook/react-vite` | Default for shadcn / Vite-React projects |
| React + Webpack 5 | `@storybook/react-webpack5` | CRA / older setups |
| Next.js | `@storybook/nextjs` | Wraps react-webpack5 with Next-specific config |
| Vue 3 + Vite | `@storybook/vue3-vite` | — |
| Vue 3 + Webpack | `@storybook/vue3-webpack5` | — |
| Svelte + SvelteKit | `@storybook/sveltekit` | Cornerstone uses this |
| Svelte + Vite (no Kit) | `@storybook/svelte-vite` | — |
| Angular | `@storybook/angular` | — |
| Web components + Vite | `@storybook/web-components-vite` | Lit / vanilla CE |
| Web components + Webpack | `@storybook/web-components-webpack5` | — |
| Preact + Vite | `@storybook/preact-vite` | — |
| Qwik | `@storybook/qwik` | — |
| HTML + Vite | `@storybook/html-vite` | Vanilla HTML/JS |
| Ember | `@storybook/ember` | — |
| React Native | (Storybook RN — separate package) | Non-standard; skill asks user to confirm |

When `signals.storybook_framework` is null, ask user before defaulting.

## Story file extensions — when scaffolding `*.stories.*` in code-only S-3

| Framework | Story extension | Body shape |
|---|---|---|
| `@storybook/sveltekit`, `@storybook/svelte-vite` | `.stories.svelte` (preferred via addon-svelte-csf) or `.stories.ts` | `<script context="module">` with `defineMeta` + `<Story>` blocks |
| `@storybook/vue3-vite`, `@storybook/vue3-webpack5` | `.stories.ts` | `meta.component = MyComponent` (.vue SFC); render fn returns Vue template |
| `@storybook/angular` | `.stories.ts` | `Meta<MyComponent>` + `StoryObj` per Angular CSF |
| `@storybook/web-components-vite` | `.stories.ts` | Lit `html` template literals or template fn returning DOM |
| `@storybook/react-*`, `@storybook/nextjs`, `@storybook/preact-*` | `.stories.tsx` | React JSX |
| `@storybook/qwik`, `@storybook/html-*`, `@storybook/ember` | `.stories.ts` | Framework-specific render fn |

## Custom layout extension (2 patterns)

### Pattern 1 — config-driven (in hd-config.md)

```yaml
storybook:
  mdx_layout_wrapper:
    import: "../../storybook-docs/ds-docs-layout.jsx"
    block: "DocsCanvasShell"
    wraps: ["component", "page-spec"]
```

`establish` reads this; emits component/page-spec MDX with the wrapper around `<Markdown>` + `<Canvas>` blocks.

### Pattern 2 — manual edit after scaffold

User edits `.mdx` directly. `validate` checks only frontmatter + structure + IA sync — ignores wrapper edits.

## Source references

- Fluent UI .storybook structure: [github.com/microsoft/fluentui/tree/master/.storybook](https://github.com/microsoft/fluentui/tree/master/.storybook)
- Fluent UI react-storybook-addon (decorator pattern): [github.com/microsoft/fluentui/tree/master/packages/react-components/react-storybook-addon](https://github.com/microsoft/fluentui/tree/master/packages/react-components/react-storybook-addon)
- Storybook MDX docs: [storybook.js.org/docs/writing-docs/mdx](https://storybook.js.org/docs/writing-docs/mdx)
- storybook-design-token addon: [storybook.js.org/addons/storybook-design-token](https://storybook.js.org/addons/storybook-design-token)
