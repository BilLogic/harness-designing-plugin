---
rubric: accessibility-wcag-aa
name: "Accessibility — WCAG 2.1 AA"
applies_to:
  - design-file
  - figma-frame
  - html
  - css
severity_defaults:
  default: p1
---

# Accessibility — WCAG 2.1 AA

Foundation-level accessibility checks against WCAG 2.1 AA standards. Non-exhaustive — covers the criteria most frequently violated during design. Teams should extend with domain-specific checks (motion safety, cognitive load, localization).

## Scope & Grounding

### Personas
- **Low-vision keyboard user** — navigates primarily by keyboard at 200% zoom with high-contrast OS preferences. Pain: invisible focus rings and low-contrast disabled states strand them mid-flow.
- **Screen-reader user (JAWS/NVDA/VoiceOver)** — consumes the UI linearly via assistive tech. Pain: unlabeled icon buttons and placeholder-only inputs announce as "edit text" with no context.
- **Motor-impaired touch user** — hits small targets inaccurately and benefits from generous hit areas. Pain: 16px icon buttons with no padding cause repeated misfires.
- **Vestibular-disorder user** — triggered by parallax, auto-play, and large sweeping motion. Pain: animations that ignore `prefers-reduced-motion` cause nausea.

### User stories
- As a **keyboard user**, I need **every interactive element reachable and focus-visible** so that **I can complete tasks without a mouse**.
- As a **screen-reader user**, I need **every input labeled and headings in semantic order** so that **rotor navigation lands on meaningful targets**.
- As a **low-vision user**, I need **text and UI contrast ≥ 4.5:1 / 3:1** so that **I can read body copy and see button borders without zooming past 200%**.
- As a **motor-impaired user**, I need **tap targets ≥ 44×44pt** so that **I can activate controls without repeated misclicks**.
- As a **vestibular-sensitive user**, I need **animations to respect reduced-motion** so that **parallax and auto-play don't trigger symptoms**.

### Realistic scenarios
- **Primary CTA on a marketing page** — approved token pair yields 7.2:1 contrast; focus ring is visible. Why it matters: the most-seen control sets the a11y baseline for the whole product.
- **Modal dialog with a form** — focus trapped inside, Escape closes, every input has a `<label>`. Why it matters: modals are where a11y regressions accumulate fastest.
- **Icon-only toolbar** — 24px icons with 44×44pt hit areas via padding, each with `aria-label`. Why it matters: icon-only UIs fail silently for both screen-reader and motor users.
- **Data-loaded dashboard** — skeletons on load, error state with diagnostic copy, `aria-live` for status. Why it matters: dynamic content is invisible to AT without live regions.

### Anti-scenarios (common failure modes)
- **Global `outline: none`** — focus rings removed with no replacement. Symptom: keyboard users lose track of focus entirely.
- **Placeholder-as-label** — input uses `placeholder="Email"` with no `<label>`. Symptom: screen reader announces "edit text"; placeholder disappears on type.
- **Gray-on-gray body text** — `--text-muted on --bg-subtle` at 2.8:1. Symptom: low-vision users can't read the copy at normal zoom.
- **Auto-play hero with parallax** — no reduced-motion fallback. Symptom: vestibular-disorder users get motion sick on first visit.
- **Headings skipped for styling** — h1 then h4 because "h2 looked too big". Symptom: screen-reader rotor navigation jumps levels and misrepresents structure.

## Criteria

### contrast-text

**Check:** Text color vs background contrast ratio ≥ 4.5:1 (normal text) or ≥ 3:1 (large text ≥18pt or 14pt bold).
**Default severity:** p1

Low-contrast text is the single most common accessibility failure. Design-system tokens should pre-satisfy this — if your system's primary+background pair is ≥ 4.5:1, using approved tokens automatically passes.

**Example pass:** `color: var(--text-primary) on background: var(--bg-default)` with computed ratio 7.2:1.
**Example fail:** Gray-on-gray (ratio 2.8:1) for body text — specifically the `--text-muted on --bg-subtle` pair.

### contrast-ui

**Check:** Interactive UI components (buttons, form borders, focus rings) contrast ≥ 3:1 against adjacent background.
**Default severity:** p1

Button borders, disabled states, and focus indicators must be distinguishable.

**Example pass:** Primary button with white text on `#0051FF` (ratio 5.9:1 against page background).
**Example fail:** Ghost button with outline `#E5E5E5` on `#FFFFFF` (ratio 1.3:1) — invisible to low-vision users.

### tap-target-size

**Check:** Interactive elements ≥ 44×44pt (iOS HIG) or 48×48dp (Material) tap target.
**Default severity:** p1
**Applies to:** design-file, figma-frame (less applicable to HTML/CSS where size is responsive)

Small tap targets disproportionately affect users with motor impairments.

**Example pass:** Icon button is 24px, but has 44×44pt hit area via padding.
**Example fail:** Close button 16×16px with no padding.

### keyboard-navigation

**Check:** All interactive elements reachable via keyboard (Tab / Shift+Tab / Enter / Space) in logical order.
**Default severity:** p1
**Applies to:** html, design-file (when flows are documented)

**Example pass:** Modal traps focus, Escape closes, Tab cycles through interactive elements inside modal.
**Example fail:** Custom dropdown built with `<div>` clicks only — no keyboard support.

### focus-indicator

**Check:** Every interactive element has a visible focus indicator with ≥ 3:1 contrast against both the element and the background.
**Default severity:** p2

Default browser outlines are often removed via `outline: none;` without a replacement. Always replace.

**Example pass:** Button has `:focus-visible` style with 2px blue ring at 4.8:1 contrast.
**Example fail:** Global `*:focus { outline: none; }` with no replacement.

### semantic-structure

**Check:** Headings in order (h1 → h2 → h3; no skipping); landmarks used (main, nav, aside, footer); lists use `<ul>` / `<ol>`.
**Default severity:** p2
**Applies to:** html

**Example pass:** Page has one `<h1>`; section navs use `<nav>`; article content in `<article>`.
**Example fail:** Entire page is nested `<div>`s; h1 then h4 without h2/h3.

### form-labels

**Check:** Every form input has an associated `<label>` (or aria-label for icon-only inputs).
**Default severity:** p1
**Applies to:** html, design-file

Screen readers announce inputs without labels as "edit text" — useless.

**Example pass:** `<label for="email">Email</label><input id="email">`
**Example fail:** Placeholder-only input (`<input placeholder="Email">`) — placeholder disappears on type; screen readers may skip it.

### alt-text

**Check:** Meaningful images have descriptive alt text; decorative images use `alt=""` (not missing alt).
**Default severity:** p2
**Applies to:** html, design-file

**Example pass:** Hero image: `alt="Designer collaborating with engineer on a whiteboard"`.
**Example fail:** Stock photo: `alt="image"` or missing alt entirely.

### motion-safety

**Check:** Animations respect `prefers-reduced-motion` media query.
**Default severity:** p2
**Applies to:** css, design-file

Vestibular disorders are triggered by large or rapid motion. Provide a reduced-motion fallback.

**Example pass:** `@media (prefers-reduced-motion: reduce) { .hero-animate { animation: none; } }`
**Example fail:** Parallax scrolling or auto-playing video with no reduced-motion opt-out.

## Extending this rubric

Duplicate this file to `docs/context/design-system/accessibility-<team>.md` and add domain-specific criteria:

- Localization (RTL layout support, text-expansion tolerance)
- Cognitive accessibility (reading level, clear language)
- Assistive-technology-specific (ARIA patterns for your components)

Reference the extension in `hd-config.md` `critique_rubrics` list.

## See also

- [WCAG 2.1 AA spec](https://www.w3.org/WAI/WCAG21/quickref/?currentsidebar=%23col_customize&levels=aaa)
- [../../references/rubric-application.md](../../references/rubric-application.md) — how this rubric gets applied
- [design-system-compliance.md](design-system-compliance.md) — complementary rubric on token compliance
