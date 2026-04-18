---
rubric: color-and-contrast
name: "Color + contrast"
applies_to:
  - design-file
  - figma-frame
  - tsx
  - jsx
  - html
  - css
  - token-json
severity_defaults:
  default: p2
source:
  - pbakaus/impeccable — source/skills/impeccable/reference/color-and-contrast.md (OKLCH, tinted neutrals, dark mode, accessibility)
  - Material Design 3 — color system
  - WCAG 2.1 — contrast ratios
---

# Color and contrast

Color system quality: palette coherence, contrast for accessibility, dark-mode strategy, tinted neutrals. Distinct from the pure-a11y rubric (which focuses on minimum contrast + ARIA); this rubric also covers aesthetic + design-system-level color decisions.

## Criteria

### uses-oklch-or-equivalent

**Check:** color tokens are defined in a perceptually-uniform color space (OKLCH, LCH, or LAB) rather than HSL/RGB/hex-only.
**Default severity:** p3

**Why:** OKLCH makes contrast math honest (perceptually uniform), makes dark-mode theming tractable (hue + lightness variations), makes accessibility checks reproducible.

**Example pass:** `--color-primary: oklch(65% 0.15 250)` with derivation documented.
**Example fail:** `--color-primary: #6366f1` with no derivation; dark-mode variant eyeballed; no contrast math.

### tinted-neutrals

**Check:** neutral grays are tinted toward a brand hue, not pure (0 chroma). Pure grays feel flat next to tinted brand colors.
**Default severity:** p3

**Example pass:** neutrals like `oklch(X% 0.02 250)` (same hue as brand, very low chroma) — integrates with brand.
**Example fail:** pure `#888` / `#ccc` grays next to vibrant brand colors — feels detached.

### contrast-meets-wcag-aa

**Check:** body text ≥ 4.5:1 contrast against its background; large text (>=18pt or 14pt bold) ≥ 3:1; UI components (borders, focus indicators) ≥ 3:1.
**Default severity:** p1

**Example pass:** body text `oklch(20% ...)` on `oklch(98% ...)` background = ~15:1. Muted text still ≥ 4.5:1.
**Example fail:** placeholder text with ~2:1 contrast (common WCAG failure); low-contrast mid-gray on white.

### contrast-meets-wcag-aaa-for-critical

**Check:** for critical reading (long-form body, core navigation), contrast ≥ 7:1 (AAA).
**Default severity:** p3

**Example pass:** article body near-black on near-white (~18:1).
**Example fail:** article body at exactly 4.5:1 — legal but fatiguing for sustained reading.

### color-is-not-the-only-signal

**Check:** state / status conveyed by color ALSO uses icon or text (colorblind safety).
**Default severity:** p1

**Example pass:** error state uses red + warning-triangle icon + "Error:" label prefix.
**Example fail:** form field with red border + red "*required*" text — red-green colorblind users see no difference.

### semantic-tokens-over-primitive

**Check:** components reference semantic tokens (`--color-text-primary`, `--color-surface`) not primitive tokens (`--gray-900`, `--blue-500`).
**Default severity:** p2

**Example pass:** `<Button style={{ color: 'var(--color-on-primary)' }}>` — theme-agnostic.
**Example fail:** `<Button style={{ color: '#ffffff' }}>` or `style={{ color: 'var(--gray-50)' }}` — doesn't theme; dark mode breaks.

### dark-mode-strategy-coherent

**Check:** dark mode isn't "flip every color"; it's a deliberate re-theming with tuned tokens. Avoid naive inversion.
**Default severity:** p2

**Example pass:** dark mode tokens tuned separately — chromatic neutrals darker, accents shifted in chroma/lightness, surfaces use lighter dark tones (not pure black).
**Example fail:** `filter: invert()` as dark-mode strategy. Pure black `#000` background (causes halation for some users).

### palette-scope-restrained

**Check:** total palette stays small — brand hue + 1-2 accents + neutrals. Every accent color earns its place with a specific purpose.
**Default severity:** p3

**Example pass:** brand-primary + one accent (e.g., warm success green) + tinted neutrals. Errors / warnings share the accent with different chroma.
**Example fail:** 8 "brand colors", 5 "accents", no usage guidance — designers pick at random.

## Extending this rubric

Copy to `docs/rubrics/color-and-contrast-<team>.md` and:

1. Specify your brand-hue range + approved derivatives
2. Add team-specific tokens (if your design has semantic roles beyond defaults)
3. Override severity per your audience (consumer product → stricter AAA; internal tool → relax AAA)

## What this rubric does NOT check

- Full a11y compliance (ARIA, keyboard, screen reader) — see `accessibility-wcag-aa.md`
- Color in illustrations / photos — scope is UI surfaces
- Token governance (how new colors get added) — see `design-system-compliance.md`

## See also

- [accessibility-wcag-aa.md](accessibility-wcag-aa.md) — WCAG contrast is a subset of this rubric's scope
- [design-system-compliance.md](design-system-compliance.md) — token-reference discipline
- [typography.md](typography.md) — text colors interact with line-height + font weight for readability
- Impeccable — [color-and-contrast.md](https://github.com/pbakaus/impeccable/blob/main/source/skills/impeccable/reference/color-and-contrast.md)
- Material Design 3 — [m3.material.io/styles/color](https://m3.material.io/styles/color/system/overview)
- WCAG 2.1 — [contrast ratio requirements](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
