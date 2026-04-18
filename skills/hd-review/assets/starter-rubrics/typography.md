---
rubric: typography
name: "Typography"
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
  - pbakaus/impeccable — source/skills/impeccable/reference/typography.md (type systems, font pairing, modular scales, OpenType)
  - Material Design 3 — type scale foundations
  - Practical Typography (Matthew Butterick) — reading-ease + line-length principles
---

# Typography

Typographic quality: font choice, hierarchy, scale, spacing, OpenType. A good type system makes interfaces easier to scan + more pleasant to read; a bad one creates cognitive friction even when users don't consciously notice.

## Criteria

### font-choice-purposeful

**Check:** sans-serif (or serif) choice is purposeful. Avoid defaults — Inter + system-ui + Arial are the "tech template" everyone uses; the product should have a distinct voice.
**Default severity:** p3

**Example pass:** DM Sans for the marketing site; Geist Mono for code; intentional reason documented in `foundations/principles.md`.
**Example fail:** Inter everywhere with no rationale. OR generic system-ui fallback that changes personality across OSes.

### type-scale-modular

**Check:** size scale follows a modular ratio (1.2, 1.25, 1.333 — "minor third" to "perfect fourth"). Arbitrary sizes like 13px, 17px, 23px break the rhythm.
**Default severity:** p2

**Example pass:** scale: 12 / 14 / 16 / 20 / 24 / 32 / 48 (1.25 ratio with some editorial adjustments); every text in the product uses one of these tokens.
**Example fail:** scale includes 13px, 15px, 17px, 23px — no ratio, eyeballed.

### line-height-semantic

**Check:** body text has line-height 1.4–1.6; headlines tighter (1.1–1.3); captions/labels wider (1.5). Never 1.0 for paragraphs.
**Default severity:** p2

**Example pass:** body line-height 1.5; h1 line-height 1.1; error text line-height 1.5.
**Example fail:** everything line-height 1.0 or 1.2; long-form text cramped.

### line-length-readable

**Check:** long-form text wraps at 60–75 characters per line. Wider → user loses line position; narrower → too many returns.
**Default severity:** p2

**Example pass:** article body `max-width: 65ch`. Form labels can break this rule (short content).
**Example fail:** article text spans full viewport width (>100ch); user eyes fatigue.

### heading-hierarchy-semantic

**Check:** headings use H1 > H2 > H3 structure semantically (never skip levels for styling). Visual scale may differ from semantic level with CSS classes.
**Default severity:** p1

**Example pass:** page has one H1; sub-sections H2; sub-sub H3. Visual sizes can still be controlled via `text-3xl` etc.
**Example fail:** page has H1 + H3 + H5 (skipping H2/H4 for visual reasons); screen readers navigate incorrectly.

### weight-contrast-sufficient

**Check:** weight changes (regular 400 → semibold 600 → bold 700) create clear visual hierarchy; avoid weight "ladders" that are hard to distinguish (400 / 500 / 600).
**Default severity:** p3

**Example pass:** body 400, strong 600, headlines 700 — three distinct weights; each visually clear.
**Example fail:** body 400, subtle emphasis 450, strong 500, stronger 550 — users can't tell them apart.

### opentype-features-used

**Check:** OpenType features enabled where the font supports them (tabular numbers for data, stylistic alternates for brand consistency, proper ligatures).
**Default severity:** p3

**Example pass:** `font-feature-settings: 'tnum'` on data tables so columns align; ligatures on for body prose.
**Example fail:** data tables with proportional numerals — columns misalign across rows with different digits.

### font-loading-performance

**Check:** fonts preloaded; FOIT (flash of invisible text) avoided via `font-display: swap` or equivalent; no layout shift on font load.
**Default severity:** p2

**Example pass:** fonts preloaded in `<head>`; `font-display: swap`; fallback font metrics match (Adobe `size-adjust` / `ascent-override`).
**Example fail:** FOUT (flash of unstyled text) causes 200px layout shift on every page load.

### font-pairing-coherent

**Check:** when multiple fonts are used, they harmonize (typically one sans + one serif OR one sans + one mono; two sans-serifs is usually noise).
**Default severity:** p3

**Example pass:** DM Sans (body) + Geist Mono (code). Each has a distinct role.
**Example fail:** Inter (body) + Helvetica (headlines) — too similar; no visual differentiation.

## Extending this rubric

Copy to `docs/rubrics/typography-<team>.md` or `docs/context/design-system/styles/typography.md` (if extending the design-system doc with team-specific checks) and:

1. Add team-specific criteria (e.g., "display headlines use DM Serif Display only at 48px+")
2. Override severity for your product's reading context
3. Reference in `hd-config.md` under `critique_rubrics`

## What this rubric does NOT check

- Color contrast of text — see `color-and-contrast.md`
- Semantic heading structure for screen readers beyond hierarchy — see `accessibility-wcag-aa.md`
- Content voice / tone of copy — see `ux-writing.md`

## See also

- [color-and-contrast.md](color-and-contrast.md) — text color readability
- [accessibility-wcag-aa.md](accessibility-wcag-aa.md) — heading-level enforcement for a11y
- [spatial-design.md](spatial-design.md) — vertical rhythm that pairs with type scale
- Impeccable — [github.com/pbakaus/impeccable/blob/main/source/skills/impeccable/reference/typography.md](https://github.com/pbakaus/impeccable/blob/main/source/skills/impeccable/reference/typography.md)
- Material Design 3 — [m3.material.io/styles/typography](https://m3.material.io/styles/typography)
