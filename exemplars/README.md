# Exemplars — what the harness looks like populated

Three self-contained Storybooks, each demonstrating what `/hd:design-system establish` produces when pointed at a different DS shape.

| Exemplar | Source DS | Storybook framework | Why it's here |
|---|---|---|---|
| [`shadcn/`](shadcn/) | shadcn/ui canonical defaults (OKLCH, Tailwind v4) | `@storybook/react-vite` | Utility-first / token-pair model — minimal scale, paired roles |
| [`material/`](material/) | Material 3 (material-web tokens + docs) | `@storybook/web-components-vite` | Role-based tokens, state layers, elevation tiers — full M3 surface |
| [`fluent/`](fluent/) | Fluent 2 (FluentUI v9 web tokens) | `@storybook/react-vite` | Brand ramps, semantic neutrals, theme/brand/direction/strictMode globals |

Each exemplar runs independently:

```bash
cd exemplars/<name>
npm install
npm run storybook
```

## What this set proves

1. **Templates handle three very different DS philosophies** without forking — utility-first pairs (shadcn), role-based tokens (Material), brand-ramp + semantic neutrals (Fluent).
2. **Framework adaptability is real, not claimed.** Material runs `@storybook/web-components-vite` with Lit stories; shadcn and Fluent run `@storybook/react-vite` with TSX stories. All three share the same `.tsx` harness-blocks because Storybook docs is React regardless of story framework.
3. **The `<Panel>` block reads cleanly across all three.** Single API (`name` + `source`) handles shadcn's `src/components/`, Material's web-components paths, Fluent's `react-components` packages.

## Audit findings surfaced by authoring this set

(These are real signals about gaps in the v7.4 templates — captured during the dogfood pass and worth grading against `hd:maintain capture` after review.)

- `<SwatchRow scheme>` block hardcodes Material 3's `--color-{scheme}` / `--color-on-{scheme}` naming. Doesn't fit shadcn's `--primary` / `--primary-foreground` pair convention. **Fix:** add a `pattern` prop to SwatchRow so teams configure their naming, or ship a `<SwatchPair>` variant for pair-based systems.
- `<TypeRow token>` hardcodes `--md-sys-typescale-{token}-*`. Fluent + shadcn use different naming. **Fix:** same — `pattern` prop.
- `<SpacingScale />` looks for `--spacing-N` then falls back to `--space-{xs,sm,...}`. shadcn's `--space-1`, `--space-2` numeric semantic naming isn't matched. **Fix:** broaden the auto-detect set, or expose token-name list as a prop.

## Cleanup

When you're done browsing:

```bash
rm -rf exemplars/*/node_modules
```

(`node_modules` is gitignored at the exemplar level; the rest is committed.)
