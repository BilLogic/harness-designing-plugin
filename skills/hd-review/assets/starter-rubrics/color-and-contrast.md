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

## Scope & Grounding

### Personas
- **Design-system steward** — owns the token set and dark-mode strategy. Pain: one-off hex literals in product code fork the system and make dark-mode re-theming intractable.
- **Colorblind end user (red-green, ~8% of men)** — relies on icon + text, not hue, to decode status. Pain: error states differentiated only by red text look identical to normal text.
- **Long-form reader** — reads articles or docs for minutes at a time. Pain: body text at exactly 4.5:1 is legal but fatiguing on long sessions.
- **Dark-mode user** — runs OS-dark by default, often in low-light environments. Pain: naive `filter: invert()` dark-mode causes halation and makes accent colors unusable.

### User stories
- As a **design-system steward**, I need **components to reference semantic tokens** so that **dark mode and theming change one place, not every component**.
- As a **colorblind user**, I need **status conveyed by icon + text, not color alone** so that **I can tell errors from normals**.
- As a **long-form reader**, I need **critical reading surfaces at AAA (≥ 7:1) contrast** so that **I don't fatigue over sustained reading**.
- As a **dark-mode user**, I need **a deliberately tuned dark palette, not flipped light** so that **surfaces don't halate and accents stay legible**.
- As a **brand designer**, I need **neutrals tinted toward the brand hue** so that **the UI feels integrated rather than a brand slab on gray chrome**.

### Realistic scenarios
- **Primary palette in OKLCH** — brand hue + tinted neutrals + one accent, all derived in OKLCH with documented lightness ladder. Why it matters: honest contrast math + tractable dark-mode theming.
- **Error form field** — red border + warning-triangle icon + "Error:" prefix + helper text naming the problem. Why it matters: colorblind-safe and screen-reader-friendly simultaneously.
- **Article body surface** — near-black on near-white at ~18:1, line-length 65ch. Why it matters: critical-reading surfaces earn AAA.
- **Dark-mode re-theme** — surfaces use lifted dark tones (not pure black), accents shift chroma, neutrals tuned independently. Why it matters: naive inversion is a known anti-pattern.

### Anti-scenarios (common failure modes)
- **Hex literals throughout components** — `color: #0051FF` scattered in 7 files. Symptom: dark-mode + theming forks; single color change requires global find-replace.
- **Required field marker color-only** — red border + red "*required*" with no icon. Symptom: red-green colorblind users see no difference between required and optional.
- **Palette bloat** — 8 "brand colors", 5 "accents", no usage guidance. Symptom: designers pick at random; product looks like three products.
- **Pure `#000` dark-mode background** — causes halation on OLED. Symptom: text appears to vibrate; long sessions fatigue users.
- **`filter: invert()` dark mode** — flipped light theme instead of re-theme. Symptom: brand colors become alien complements; illustrations look broken.

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
