# Fluent 2 — harness exemplar

Self-contained Storybook demonstrating the harness against Fluent 2 — brand ramps, semantic neutrals, three themes (including high-contrast), brand swap.

## Run

```bash
cd exemplars/fluent
npm install
npm run storybook
```

Storybook opens at `http://localhost:6008`. Sidebar order:

```
0-welcome/
1-foundations/   Tokens
2-styles/        Color, Typography, Spacing
4-components/    Button, Input, Card
```

## What's special about this exemplar

- **Four toolbar globals.** Theme + Brand + Direction + StrictMode. Modeled directly on Microsoft's [react-storybook-addon globalTypes](https://github.com/microsoft/fluentui/tree/master/packages/react-components/react-storybook-addon).
- **Three themes.** Light / Dark / High-contrast. Toggle the Theme toolbar; every page reflects.
- **Brand ramp swap.** Toggle Brand to switch from default Fluent blue to Teams purple. The whole brand color family swaps without a stylesheet reload.
- **Full RTL support.** Toggle Direction to RTL. Your stories' inline `style` properties may not flip; the `dir` attribute is set on `<html>`.

## Files

| Path | What |
|---|---|
| `src/styles/tokens.css` | Fluent v9 sys tokens — `--colorBrand*`, `--colorNeutral{Foreground,Background,Stroke}*`, `--colorPalette*`, `--fontSize{Base,Hero}*`, `--lineHeight{Base,Hero}*`, `--fontWeight*`, `--spacingHorizontal*`, `--strokeWidth*`, `--borderRadius*`, `--shadow*` |
| `src/components/Button.tsx` | React stub mirroring FluentUI v9's Button (`appearance` × `size`) |
| `src/components/Input.tsx` | React stub for Input (4 appearances × 3 sizes) |
| `src/components/Card.tsx` | React stub for Card with sub-components (CardHeader, CardPreview, CardFooter) |
| `docs/0-welcome/README.mdx` | Entry page — what the four toolbar globals do |
| `docs/1-foundations/tokens.mdx` | Token model — 7 families, theme + brand attribute strategy |
| `docs/2-styles/{color,typography,spacing}.mdx` | Visual values rendered live |
| `docs/4-components/{button,input,card}.mdx` | Per-component pages with `<Panel>` blocks |
| `.storybook/main.ts` | `@storybook/react-vite` framework |
| `.storybook/preview.ts` | 4 toolbar globals + decorator that sets `[data-theme]` + `[data-brand]` + `dir` on `<html>` |
| `.storybook/harness-blocks/*.tsx` | The 15 React harness-blocks (same as shadcn/ and material/) |

## What's intentionally minimal in v1

- 5 button appearances × 3 sizes documented; no `loading`, `iconPosition` props (real FluentUI ships these)
- No Avatar, Badge, MenuButton, ToggleButton, Spinner, Toast, Drawer — covered by the same template patterns
- Brand swap demos `default` + `teams` only; FluentUI ships several more brand ramps
