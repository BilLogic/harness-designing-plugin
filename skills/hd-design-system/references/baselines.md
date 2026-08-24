# baselines — M3 + Fluent 2 + awesome-design-md seed catalog

**Loaded by:** [`establish-flow.md`](establish-flow.md) Sub-flow A (greenfield/starter scenario only). Owns: the catalog of starter design systems the [`design-system-starter-recommender`](../../../agents/analysis/design-system-starter-recommender.md) sub-agent ranks against, plus the offline seed-content paths that get copied when a user picks a starter.

## When this is used

Only the `starter` scenario (S-0) — user has neither code-side tokens nor a Figma file. The recommender ranks this catalog against the 8-Q questionnaire answers, returns top 5, user picks one, and skill copies the `seed_path` content into the per-folder previews.

## Catalog format

Each entry:

```yaml
- name: <human-readable name>
  tags: [...]                      # closed-enum tag set for ranking
  seed_path: <path under ../assets/baselines/...>
  attribution:
    license: <SPDX identifier>
    url: <official site URL>
  description: <2-3 sentence summary>
```

## Tag enum

Used for matching against questionnaire answers:

| Category | Values |
|---|---|
| Audience | `consumer` · `b2b` · `dev-tool` · `marketing` |
| Surface | `mobile` · `desktop` · `responsive-both` |
| Theming | `light-first` · `dark-first` · `light+dark` · `density` · `high-contrast` · `multi-mode` |
| Touch points | `single-product` · `multi-product` · `multi-brand` |
| Stack | `react` · `vue` · `svelte` · `web-components` · `flutter` · `react-native` · `framework-agnostic` |
| Strengths | `accessibility-first` · `tokens-first` · `mobile-first` · `dense-data` · `expressive` · `minimal` |

Each starter carries a multi-label tag set drawn from this enum.

## Seed-content layout (under `../assets/baselines/`)

For each starter, the seed folder mirrors the DS folder structure with filled content:

```
../assets/baselines/<starter-name>/
├── 1-foundations/
│   ├── principles.mdx     ← seeded with starter's principles
│   ├── accessibility.mdx
│   ├── content-voice.mdx
│   ├── layout.mdx
│   └── tokens.mdx
├── 2-styles/
│   ├── color.mdx          ← seeded with starter's color tokens
│   ├── typography.mdx
│   ├── spacing.mdx
│   ├── elevation.mdx
│   └── iconography.mdx
└── 4-components/
    ├── button.mdx         ← 5 sample component pages
    ├── input.mdx
    ├── dialog.mdx
    ├── card.mdx
    └── badge.mdx
```

When user picks a starter, scaffold copies all `*.mdx` from the seed path into `docs/context/design-system/`, applying the variable substitution (status frontmatter set to `placeholder`).

## The 3 offline-bundled starters

Always available even without network. These are the safe fallbacks the recommender includes in top 5 results.

### Material 3

```yaml
name: Material 3
tags: [consumer, b2b, responsive-both, light+dark, multi-mode, single-product, react, web-components, flutter, accessibility-first, tokens-first, expressive]
seed_path: ../assets/baselines/material-3/
attribution:
  license: Apache-2.0
  url: https://m3.material.io/
description: |
  Google's open Material 3 design system. 3-tier token model (reference → system → component);
  comprehensive component coverage; first-class light+dark theming; ships React + web components.
  Strong choice for general consumer apps.
```

### Fluent 2

```yaml
name: Fluent 2
tags: [b2b, dev-tool, responsive-both, light+dark, density, high-contrast, multi-brand, react, accessibility-first, dense-data]
seed_path: ../assets/baselines/fluent-2/
attribution:
  license: MIT
  url: https://fluent2.microsoft.design/
description: |
  Microsoft's Fluent 2. Global → alias → component token model (3-tier); comprehensive a11y
  including high-contrast mode; theme switching as Storybook global decorator pattern (which
  we adopt). Strong for productivity / B2B apps. Multi-brand support via theme assemblies.
```

### shadcn/ui starter

```yaml
name: shadcn-ui
tags: [consumer, b2b, dev-tool, responsive-both, light+dark, single-product, react, framework-agnostic, tokens-first, minimal]
seed_path: ../assets/baselines/shadcn/
attribution:
  license: MIT
  url: https://ui.shadcn.com/
description: |
  shadcn/ui — copy-paste component starter built on Radix UI + Tailwind CSS. 2-tier tokens
  (HSL primitives → semantic CSS vars); developer-friendly; minimal opinion. Strong for teams
  that want to own their components rather than depend on a library.
```

## awesome-design-md corpus (online)

When network is available, the recommender fetches [awesome-design-md](https://github.com/VoltAgent/awesome-design-md) README and extracts additional candidates:

- Linear-style (dev-tool, dark-first, minimal)
- Stripe-style (b2b, light+dark, expressive)
- Vercel-style (dev-tool, dark-first, minimal)
- Claude-style (b2b, light+dark, minimal)
- Polaris-style (b2b, light+dark, density)
- Carbon-style (b2b, light+dark, accessibility-first, dense-data)
- (~70 total in the corpus)

For these, seed_path points at template content derived at fetch time (not pre-bundled). Recommender returns the URL + the curated DESIGN.md if available.

## Recommender ranking notes

Scoring is multi-label match — see [`design-system-starter-recommender.md`](../../../agents/analysis/design-system-starter-recommender.md) for the scoring rubric.

The 3 offline starters always appear in top 5 results when their tags match (so a connectivity-poor user always has a usable pick).

## Updating

To refresh the corpus:
1. Re-fetch `awesome-design-md` README
2. Update tag sets for new starters
3. (Manual) author seed_path content for any new starter we want to bundle offline
4. Bump `corpus_freshness` in this file's header (when present)

## Source references

- awesome-design-md (the corpus): [github.com/VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md)
- Material 3 official docs: [m3.material.io](https://m3.material.io/)
- Fluent 2 official site: [fluent2.microsoft.design](https://fluent2.microsoft.design/)
- shadcn/ui: [ui.shadcn.com](https://ui.shadcn.com/)
- Recommender sub-agent: [`design-system-starter-recommender`](../../../agents/analysis/design-system-starter-recommender.md)
