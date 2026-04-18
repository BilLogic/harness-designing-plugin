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
