---
rubric: design-system-compliance
name: "Design-system compliance"
applies_to:
  - design-file
  - figma-frame
  - css
  - token-json
severity_defaults:
  default: p1
---

# Design-system compliance

Checks whether a work item adheres to the team's design-system definitions in `docs/context/design-system/cheat-sheet.md`. This rubric is **repo-specific by design** — the criteria below are generic; the actual approved token sets / variant lists come from the user's cheat-sheet.

## Criteria

### approved-color-tokens

**Check:** Only colors from `docs/context/design-system/cheat-sheet.md` approved token set are used.
**Default severity:** p1

One-off hex codes are the single most common design-system drift. Every approved color has a token name.

**Example pass:** `color: var(--text-primary)` or `color: #0051FF` where `#0051FF` is the documented primary color.
**Example fail:** `color: #0060FF` — close to primary but not exact; not in the token set.

### approved-typography

**Check:** Font family + size from the approved typography scale.
**Default severity:** p1

**Example pass:** `font-family: var(--font-sans)`; `font-size: var(--text-base)` (16px per scale).
**Example fail:** `font-size: 17px` — off-scale value.

### approved-spacing

**Check:** Margins, paddings, gaps use tokens from the approved spacing scale (e.g., 4/8/12/16/20/24/32/40/48/64).
**Default severity:** p2

Off-grid spacing (e.g., 13px, 22px) is drift — usually pixel-peeping from a Figma export that lost its token references.

**Example pass:** `padding: var(--space-4)` (16px on an 8-point grid).
**Example fail:** `padding: 13px` — off-grid.

### approved-radius

**Check:** Border radius from approved scale (e.g., sm=4, md=8, lg=16, full=9999).
**Default severity:** p3

**Example pass:** `border-radius: var(--radius-md)`.
**Example fail:** `border-radius: 6px` — off-scale.

### variant-within-approved-set

**Check:** Components use only variants listed in the design-system (e.g., button variants: primary / secondary / ghost).
**Default severity:** p1

**Example pass:** `<Button variant="primary">`.
**Example fail:** `<Button variant="primary-gradient">` (not in approved set).

### tokens-referenced-not-duplicated

**Check:** Color / typography / spacing values reference tokens; same value doesn't appear as a literal multiple places.
**Default severity:** p2

**Example pass:** All primary-color references use `var(--color-primary)`.
**Example fail:** `#0051FF` appears in 7 places across the CSS; should all use the token.

### semantic-naming

**Check:** Token uses semantic naming (`--text-primary`, `--surface-default`) not structural (`--blue-500`, `--gray-100`).
**Default severity:** p3
**Applies to:** token-json, css

Semantic names decouple values from meaning; supports theming (light/dark) and future value changes.

**Example pass:** `--text-primary: #1A1A1A; --text-muted: #666;`
**Example fail:** `--gray-900: #1A1A1A; --gray-500: #666;` — used directly as text colors.

## Managed-DS pre-fills

When `detect.py` reports a managed design-system (`managed_design_system: "ant-design" | "chakra" | "mui" | "mantine"`), apply the matching sub-block below **in addition to** the generic criteria above. These are DS-specific supplements, not replacements. Source: caricature pilot (AntD), lightning pilot (AntD), Phase 3e plan.

<details>
<summary><strong>ant-design (v5 / v6)</strong></summary>

- **Theme-token names over hex literals** — design references cite `theme.token.colorPrimary`, `colorText`, `colorBgContainer`, etc., not hex values. (severity: p2)
- **Single `<ConfigProvider theme={...}>` at root** — theme is set once at the app shell, not per-component or per-page. (severity: p2)
- **v5 ↔ v6 mixing flagged** — codebase on AntD v5 must not import v6-only APIs (and vice-versa); breaking API changes cause silent visual regressions. (severity: p1)
- **No raw `.ant-*` className overrides** — component customization goes through `theme.components.<Component>.token` or `ConfigProvider` algorithm, not global CSS targeting `.ant-btn`. (severity: p1)

*Detection hook:* `grep -rE "(#[0-9a-fA-F]{3,8})" src/ | grep -v "theme\\.token"` — hex literals outside theme config; `grep -rE "\\.ant-[a-z-]+\\s*\\{" src/` — raw AntD class overrides.
</details>

<details>
<summary><strong>chakra-ui</strong></summary>

- **`useColorMode` hook for theme toggling** — no manual `document.documentElement.classList.toggle("dark")` or direct DOM manipulation. (severity: p1)
- **Tokens from `@chakra-ui/system` theme object** — spacing / color / radius values pulled from the theme, not hardcoded. (severity: p2)
- **Style props over `css={}` for reusable patterns** — prefer Chakra's style-prop API (`<Box p={4} bg="gray.100">`) over emotion `css={}` for consistency and theme-awareness. (severity: p3)
- **Theme extended via `extendTheme({...})`** — no global CSS overrides; customization lives in the theme object. (severity: p2)

*Detection hook:* `grep -rE "classList\\.(add|toggle|remove)\\(['\"]dark" src/` — manual dark-mode toggle; `grep -rE "css=\\{\\{[^}]*(padding|margin|color):" src/` — inline CSS where style props suffice.
</details>

<details>
<summary><strong>mui (Material UI)</strong></summary>

- **Single `<ThemeProvider theme={...}>` at root** — no per-page or nested ThemeProviders with divergent themes. (severity: p2)
- **`styled()` from `@mui/material/styles` over inline `sx=` for reused styles** — `sx` is fine for one-offs; anything reused across components should be a `styled()` component. (severity: p3)
- **`theme.palette.*` tokens in `sx` — no hex literals** — `sx={{ color: theme.palette.primary.main }}` not `sx={{ color: "#1976d2" }}`. (severity: p2)
- **No remaining `makeStyles` / JSS in v5+** — v5 → v6 migration requires removing legacy JSS; `makeStyles` is deprecated and breaks SSR + strict mode. (severity: p1)

*Detection hook:* `grep -rE "makeStyles|createStyles" src/` — legacy JSS; `grep -rE "sx=\\{\\{[^}]*#[0-9a-fA-F]{3,8}" src/` — hex in `sx` prop.
</details>

<details>
<summary><strong>mantine</strong></summary>

- **Single `<MantineProvider theme={...}>` at root** — provider wraps the app once; no nested providers. (severity: p2)
- **CSS-variable tokens in custom styles** — use `var(--mantine-color-blue-6)`, `var(--mantine-spacing-md)` in custom CSS rather than duplicating literal values. (severity: p2)
- **`rem()` / `em()` helpers for spacing** — no bare `px` values in component styles; Mantine's size helpers keep rhythm consistent across density modes. (severity: p3)
- **`useMantineTheme()` for JS theme access** — don't duplicate token values in JS; read them from the hook. (severity: p3)

*Detection hook:* `grep -rE "(padding|margin|gap):\\s*\\d+px" src/` — bare px values in component styles; `grep -rE "var\\(--mantine-" src/` — confirms CSS-variable usage (low count = probable drift).
</details>

## Extending this rubric

The core criteria apply to most design systems. Customize by:

1. Copying to `docs/context/design-system/design-system-<team>.md`
2. Adding team-specific criteria (e.g., "all icons use the icon-library set")
3. Overriding severity for criteria your team treats differently
4. Reference in `hd-config.md` `critique_rubrics` list

## What this rubric does NOT check

- Whether the design system itself is well-designed (that's a different critique)
- Accessibility (separate rubric: `accessibility-wcag-aa`)
- Performance (not in this rubric's scope)
- Cross-browser compatibility

## See also

- [accessibility-wcag-aa.md](accessibility-wcag-aa.md) — a11y rubric; frequently paired with this one
- [component-budget.md](component-budget.md) — governs NEW components (this rubric checks adherence within existing system)
- [../../../../docs/context/design-system/cheat-sheet.md](../../../../docs/context/design-system/cheat-sheet.md) — source of truth for approved tokens (user's repo equivalent)
