---
rubric: spatial-design
name: "Spatial design (spacing, grids, hierarchy)"
applies_to:
  - design-file
  - figma-frame
  - tsx
  - jsx
  - html
  - css
severity_defaults:
  default: p2
source:
  - pbakaus/impeccable — source/skills/impeccable/reference/spatial-design.md (spacing systems, grids, visual hierarchy)
  - Material Design 3 — spacing + layout foundations
---

# Spatial design

How elements are spaced, grouped, and hierarchically arranged. Good spatial design makes interfaces feel intentional; bad spatial design makes them feel cobbled together.

## Criteria

### spacing-on-scale

**Check:** spacing values come from a defined scale (4-point or 8-point grid typically). No off-scale values (13px, 22px, etc.).
**Default severity:** p1

**Example pass:** scale: 0, 4, 8, 12, 16, 24, 32, 48, 64. Every margin/padding uses a token like `--space-4` (= 16px).
**Example fail:** padding: 13px; margin: 22px — eyeballed values that break the visual rhythm.

### proximity-groups-related

**Check:** related elements are spatially close; unrelated ones are spatially apart. "Proximity = relationship."
**Default severity:** p1

**Example pass:** label, input, helper text, error share tight spacing (4–8px gaps); form fields separated by larger spacing (24–32px).
**Example fail:** label 24px from input, error text 4px from next field — user unclear which error belongs to which field.

### hierarchy-through-spacing

**Check:** more important content gets more surrounding space (breathing room); less important is denser.
**Default severity:** p2

**Example pass:** page title has 48px margin-below (breathing room); list items 16px apart (dense but scannable).
**Example fail:** page title immediately followed by dense content — title gets lost; user scans past it.

### optical-alignment-over-mathematical

**Check:** for icons/shapes with varied visual weight, optical alignment (looks centered) beats mathematical alignment (measured-center). Particularly for icon-text pairings.
**Default severity:** p3

**Example pass:** down-arrow icon nudged 1-2px up to feel vertically centered with text baseline (because the arrow's visual weight is below center).
**Example fail:** icon mathematically centered — visually looks slightly low; menu feels off.

### grid-system-consistent

**Check:** layouts align to a consistent grid (12-column, 8-column, or flexbox with defined gutter). Content doesn't float randomly at varying x-positions.
**Default severity:** p2

**Example pass:** all page sections align to the same 12-column grid; gutters consistent across breakpoints.
**Example fail:** one section at 1200px max-width, another at 1280px, third at 1320px — inconsistent page rhythm.

### breakpoint-transitions-smooth

**Check:** layout changes at breakpoints don't cause awkward tweener states (e.g., mobile layout stretching too wide at 600px before desktop kicks in at 640px).
**Default severity:** p2

**Example pass:** breakpoints chosen where content actually breaks; fluid spacing between breakpoints handles in-between sizes.
**Example fail:** cards stack on mobile, then jump abruptly to 4-column at 768px — no graceful 2-column middle state.

### density-matches-use-case

**Check:** information density matches the user's task. Dashboards dense; onboarding spacious; forms intermediate.
**Default severity:** p3

**Example pass:** data table dense (compact rows, tight padding); marketing hero spacious (generous whitespace).
**Example fail:** onboarding screen as dense as a data table — overwhelming; user can't find the CTA.

### vertical-rhythm-aligned-with-type

**Check:** vertical spacing matches the type scale's baseline grid. Line-height × N = paragraph spacing for harmony.
**Default severity:** p3

**Example pass:** body line-height 24px → paragraph spacing = 24px (1x) or 48px (2x) — rhythm preserved.
**Example fail:** body line-height 24px, paragraph spacing 20px — rhythm broken; content feels off-cadence.

### padding-consistent-within-similar

**Check:** like-components have like-padding. All `<Card>` components should have the same internal padding; inconsistent padding reads as design neglect.
**Default severity:** p2

**Example pass:** all cards use `--space-4` (16px) padding; any deviation is an intentional variant (e.g., `<Card variant="compact">`).
**Example fail:** card A has 16px padding, card B has 20px, card C has 14px — no system.

## Extending this rubric

Copy to `docs/rubrics/spatial-design-<team>.md` and:

1. Specify your grid + spacing scale explicitly
2. Add team-specific density targets (e.g., "data tables: max 32 rows/viewport")
3. Override severity per product type

## What this rubric does NOT check

- Motion / transitions between layouts — see `motion-design.md`
- Responsive breakpoint content priority — see `responsive-design.md`
- Component-level spacing within specific primitives — covered by design-system docs

## See also

- [typography.md](typography.md) — vertical-rhythm interaction
- [responsive-design.md](responsive-design.md) — breakpoint transitions
- Impeccable — [spatial-design.md](https://github.com/pbakaus/impeccable/blob/main/source/skills/impeccable/reference/spatial-design.md)
- Material Design 3 — [m3.material.io/foundations/layout](https://m3.material.io/foundations/layout/applying-layout/window-size-classes)
