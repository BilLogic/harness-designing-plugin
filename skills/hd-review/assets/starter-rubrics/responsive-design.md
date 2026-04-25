---
rubric: responsive-design
name: "Responsive design"
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
  - pbakaus/impeccable — source/skills/impeccable/reference/responsive-design.md (mobile-first, fluid design, container queries)
  - Material Design 3 — layout foundations (window size classes)
---

# Responsive design

Quality of cross-viewport experience. A good responsive design isn't just "works on phone" — it's "feels native on every size," with content priority, density, and interaction patterns that adapt purposefully.

## Scope & Grounding

Grounded in pbakaus/impeccable's responsive-design reference (mobile-first, fluid design, container queries) and Material 3 window-size-class foundations.

### Personas
- **Mobile-primary user** — 70%+ of consumer traffic. Pain: desktop-first CSS stuffs everything into a 375px viewport as an afterthought.
- **Touch user on any viewport** — iPad, touch-capable laptop, phone. Pain: hover-only nav dropdowns are unreachable; 24px icon buttons miss.
- **Wide-desktop user** — 1920px+ monitors. Pain: content pinned at 1200px max-width with acres of empty margin OR scaled to fill with 120-character line lengths.
- **iPhone notch / Android gesture-bar user** — bottom-fixed CTAs collide with system chrome. Pain: FAB sits on top of the home indicator, unreachable.

### User stories
- As a **mobile-primary user**, I need **mobile-first CSS** so that **my viewport is the default, not the fallback**.
- As a **touch user**, I need **every hover pattern to have a tap equivalent** so that **I can reach dropdowns and tooltips**.
- As a **touch user**, I need **44×44pt tap targets** so that **I don't misfire on adjacent buttons**.
- As any **viewport user**, I need **layout to scale fluidly between breakpoints** so that **there are no awkward tweener states**.
- As a **notched-device user**, I need **safe-area insets respected** so that **CTAs aren't hidden behind system chrome**.

### Realistic scenarios
- **Mobile-first card** — `.card { padding: 16px } @media (min-width: 768px) { .card { padding: 24px } }`. Why it matters: the canonical impeccable pattern; everything else is layered on top.
- **Progressive disclosure** — desktop: content + sidebar + detail; mobile: collapses sidebar to hamburger, detail to bottom sheet. Why it matters: content-priority-per-breakpoint.
- **Fluid type** — `font-size: clamp(1rem, 1rem + 0.5vw, 1.25rem)`. Why it matters: no breakpoint jumps between sizes.
- **Safe-area footer** — `padding-bottom: env(safe-area-inset-bottom)` on fixed CTA. Why it matters: iPhone home indicator doesn't hide the button.

### Anti-scenarios (common failure modes)
- **Desktop-first CSS** — `max-width` queries throughout. Symptom: mobile feels like an afterthought; default styles are desktop.
- **Hover-only nav** — dropdowns trigger on hover with no tap handler. Symptom: touch users can't reach nav at all.
- **Horizontal scroll at 320px** — rigid 600px element. Symptom: whole page scrolls sideways; layout is broken.
- **12px body on mobile** — text too small to read. Symptom: user pinch-zooms; a11y failure.
- **FAB over home indicator** — no safe-area handling. Symptom: button partially hidden, tap misfires into system gesture.

## Criteria

### mobile-first-design

**Check:** design + CSS starts with the smallest viewport, layers up for larger. Default styles = mobile; `@media (min-width: N)` for enhancements.
**Default severity:** p2

**Example pass:** CSS has `.card { padding: 16px; } @media (min-width: 768px) { .card { padding: 24px; } }` — small first, larger enhanced.
**Example fail:** desktop-first: `.card { padding: 24px; } @media (max-width: 767px) { .card { padding: 16px; } }` — mobile is an afterthought.

### content-priority-per-breakpoint

**Check:** at smaller viewports, lower-priority content hides or collapses (progressive disclosure). Not everything visible + crammed.
**Default severity:** p2

**Example pass:** desktop shows primary content + sidebar + detail panel; mobile collapses sidebar to hamburger, detail panel to bottom sheet.
**Example fail:** all three panels crammed into mobile viewport at tiny sizes — nothing usable.

### fluid-sizing-between-breakpoints

**Check:** between fixed breakpoints, layout scales smoothly. Use `clamp()`, `min()`, `%`, `vw` for fluid bounds.
**Default severity:** p3

**Example pass:** `font-size: clamp(1rem, 1rem + 0.5vw, 1.25rem)` — scales smoothly without breakpoint jumps.
**Example fail:** font-size stays at 14px from 320px to 1279px, then jumps to 16px at 1280px — noticeable jump.

### container-queries-when-appropriate

**Check:** components that appear in multiple layouts use container queries, not just viewport queries. A card in a sidebar behaves differently than in a full-width grid.
**Default severity:** p3

**Example pass:** `.card { @container (min-width: 400px) { ... } }` — card adapts to its container, not just window.
**Example fail:** card uses viewport-width queries; appears cramped in sidebar even on wide screens.

### touch-targets-44pt

**Check:** interactive elements are ≥ 44×44 pt on touch devices (iOS HIG) or ≥ 48×48 dp (Material). Tap targets spaced with ≥ 8pt gaps.
**Default severity:** p1

**Example pass:** buttons have min-height 44pt; icon-buttons wrapped in padded areas to meet target.
**Example fail:** 24px icon-only buttons stacked with no padding — impossible to tap accurately; leads to misclicks.

### hover-patterns-have-touch-equivalents

**Check:** any interaction that uses hover (tooltips, reveal content, hover-trigger menus) has a touch equivalent (tap to reveal, long-press, always-visible, or different UI).
**Default severity:** p2

**Example pass:** tooltip appears on hover (desktop) + on tap (mobile); menu opens on click (both).
**Example fail:** nav dropdowns only trigger on hover — touch users can't reach them at all.

### images-responsive

**Check:** images use `srcset` + `sizes` for appropriate resolution per viewport. No single huge image loaded at mobile.
**Default severity:** p2

**Example pass:** `<img srcset="small.jpg 640w, med.jpg 1024w, big.jpg 1920w" sizes="(max-width: 640px) 100vw, 50vw">` — right image loaded.
**Example fail:** single 2MB image loaded at all sizes — mobile users waste bandwidth.

### text-readable-without-zoom

**Check:** body text ≥ 16px on mobile (users shouldn't need to pinch-zoom to read). Minimum 14px for secondary content.
**Default severity:** p2

**Example pass:** body font-size 16px on mobile; footer/caption 14px.
**Example fail:** body 12px on mobile "to fit more content" — user must zoom; accessibility fails.

### no-horizontal-scroll

**Check:** content doesn't cause horizontal scrolling at any common viewport (320px–2560px). Elements wrap, truncate, or use overflow patterns.
**Default severity:** p1

**Example pass:** wide tables have horizontal-scroll containers; long titles truncate with ellipsis; wide images scale down.
**Example fail:** rigid 600px-wide element in a 320px viewport causes whole page to scroll sideways.

### safe-area-respected

**Check:** content respects device safe areas (iPhone notch, Dynamic Island, Android navigation bars). Use `env(safe-area-inset-*)` for insets.
**Default severity:** p2

**Example pass:** bottom-fixed buttons add `padding-bottom: env(safe-area-inset-bottom)`; avoid hiding behind navigation bars.
**Example fail:** floating action button sits ON TOP of iPhone home indicator — unreachable.

## Extending this rubric

Copy to `docs/rubrics/responsive-design-<team>.md` and:

1. Document your specific breakpoints + rationale (why 640/768/1024/1280? or why different?)
2. Add device-family targets (tablet-first? watch? TV?)
3. Add container-query conventions if heavily used

## What this rubric does NOT check

- Performance of responsive images/layouts — performance-oracle territory
- Mobile-specific interaction patterns (pull-to-refresh, swipe gestures) — scope is visual/layout
- Platform-specific UI (native iOS vs Android) — scope is web/cross-platform

## See also

- [spatial-design.md](spatial-design.md) — breakpoint transitions + grid
- [accessibility-wcag-aa.md](accessibility-wcag-aa.md) — touch-target compliance
- Impeccable — [responsive-design.md](https://github.com/pbakaus/impeccable/blob/main/source/skills/impeccable/reference/responsive-design.md)
- Material Design 3 — [window size classes](https://m3.material.io/foundations/layout/applying-layout/window-size-classes)
