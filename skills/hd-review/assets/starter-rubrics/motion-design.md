---
rubric: motion-design
name: "Motion design"
applies_to:
  - design-file
  - figma-frame
  - tsx
  - jsx
  - html
  - css
  - screen-recording
severity_defaults:
  default: p3
source:
  - pbakaus/impeccable — source/skills/impeccable/reference/motion-design.md (easing curves, staggering, reduced motion)
  - Material Design 3 — motion foundations
---

# Motion design

Purposeful animation. Motion should reinforce hierarchy + signal causality + delight — not distract, slow, or pressure. Badly-used motion fatigues users; well-used motion makes interfaces feel alive + responsive.

## Criteria

### reduced-motion-respected

**Check:** animations respect `prefers-reduced-motion: reduce`. Non-essential motion disabled; essential motion (e.g., spinner) simplified or replaced.
**Default severity:** p1

**Example pass:** CSS uses `@media (prefers-reduced-motion: reduce) { * { animation-duration: 0.01ms; transition-duration: 0.01ms; } }` globally; component-level opt-outs for motion-critical UI.
**Example fail:** animations run regardless of OS setting; vestibular-disorder users get motion sickness.

### duration-proportional

**Check:** animation duration scales with travel distance / scope. Small (~100px) ≈ 150ms; medium (~300px) ≈ 250ms; large (full-screen) ≈ 400-500ms. Not all 300ms uniform.
**Default severity:** p2

**Example pass:** tooltip fade-in 150ms; modal slide-in 300ms; page transition 400ms.
**Example fail:** every animation is the same 300ms — small ones feel sluggish, large ones feel hurried.

### easing-purposeful

**Check:** easing curves match the animation's character. Ease-out for appearing (starts fast, settles); ease-in-out for transitioning; linear only for infinite (spinners).
**Default severity:** p2

**Example pass:** modal enters with ease-out (lands smoothly); page transitions use ease-in-out; loading spinner linear.
**Example fail:** everything uses ease-in-out or default linear; exits and entrances feel interchangeable.

### no-gratuitous-motion

**Check:** motion serves a purpose (feedback, continuity, delight at intentional moments). Avoid moving things just because you can.
**Default severity:** p3

**Example pass:** button has subtle scale on press (feedback); list items stagger-in on page load (continuity); success confetti fires only on intentional celebration moments.
**Example fail:** every card pulses continuously; scroll triggers unnecessary parallax on 30 elements; non-critical elements bounce on every state change.

### staggering-intentional

**Check:** when animating lists or groups, stagger children with a small delay (40–80ms between items) for natural cascade. Avoid all-at-once (chaotic) or slow-stagger (tedious).
**Default severity:** p3

**Example pass:** dropdown items appear with 50ms stagger; total cascade <400ms for 6 items.
**Example fail:** dropdown items all appear simultaneously OR stagger 300ms each (1.8s total = user waits).

### state-transitions-smooth

**Check:** interactive state changes (hover, focus, pressed, selected) animate smoothly. Not instant jumps; not laggy overlong.
**Default severity:** p3

**Example pass:** button color + elevation changes on hover in 150ms; focus ring animates in over 100ms.
**Example fail:** hover state instant (feels jittery with movement); OR hover delays 400ms (feels unresponsive).

### loading-feedback-within-100ms

**Check:** user action triggers visible feedback within 100ms. Perceived-as-instant threshold; anything slower feels broken.
**Default severity:** p1

**Example pass:** button press → state change within 16ms (next frame); async action → spinner within 100ms.
**Example fail:** user clicks submit, no visible feedback for 500ms, double-clicks → duplicate submission.

### no-motion-blocks-interaction

**Check:** animations don't block user input. User should be able to click-through an animation in progress; no "please wait while the modal finishes opening."
**Default severity:** p2

**Example pass:** modal animates in over 300ms; user can click primary CTA as soon as it's visible (at ~150ms).
**Example fail:** modal animation blocks input for its full 300ms duration; user clicks feel ignored.

### animation-loops-restrained

**Check:** looping animations (spinners, pulses, idle shimmers) don't dominate the UI. At most 1–2 loopers visible at once; background animation de-emphasized.
**Default severity:** p2

**Example pass:** one loading spinner per active operation; no always-on pulsing elements.
**Example fail:** dashboard with 6 pulsing attention indicators + 2 loading shimmers + a spinning hero graphic — nothing feels important.

## Extending this rubric

Copy to `docs/rubrics/motion-design-<team>.md` and:

1. Specify your animation-duration scale (e.g., `--motion-fast: 150ms`, `--motion-medium: 300ms`)
2. Add team-specific easing tokens
3. Document special animations (brand reveal, celebrations) with their own criteria

## What this rubric does NOT check

- Animation performance (jank, dropped frames) — performance rubric territory
- GPU utilization — runtime concern, not design review
- Video motion / illustration motion — scope is UI state transitions

## See also

- [interaction-states.md](interaction-states.md) — state transitions overlap with motion
- [accessibility-wcag-aa.md](accessibility-wcag-aa.md) — reduced-motion support ties to a11y
- Impeccable — [motion-design.md](https://github.com/pbakaus/impeccable/blob/main/source/skills/impeccable/reference/motion-design.md)
- Material Design 3 — [m3.material.io/styles/motion](https://m3.material.io/styles/motion/overview)
