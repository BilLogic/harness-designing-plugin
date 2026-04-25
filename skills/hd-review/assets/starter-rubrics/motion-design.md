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

## Scope & Grounding

Grounded in pbakaus/impeccable's motion-design reference (easing curves, staggering, reduced motion) and Material 3 motion foundations.

### Personas
- **Vestibular-disorder user** — triggered by large or rapid motion. Pain: parallax and auto-play cause nausea; `prefers-reduced-motion` ignored.
- **Power user** — clicks fast; wants snap response and no animation-blocking. Pain: 300ms modal-in animations block interaction on a CTA they already know is coming.
- **Attention-fatigued user** — working long sessions. Pain: multiple always-on loopers (pulsing badges, shimmering placeholders) make nothing feel important.
- **First-time user** — needs motion to signal causality (this came from there, that replaced this). Pain: instant state changes feel jittery and lose continuity.

### User stories
- As a **vestibular-sensitive user**, I need **`prefers-reduced-motion` respected** so that **non-essential motion is disabled**.
- As a **power user**, I need **motion to not block input** so that **I can click the CTA the moment it's visible**.
- As any **user**, I need **motion to signal causality** so that **state changes feel continuous, not jarring**.
- As any **user**, I need **feedback within 100ms** so that **interactions feel instant**.
- As any **user**, I need **duration to scale with travel distance** so that **small animations feel snappy and large ones don't feel hurried**.

### Realistic scenarios
- **Modal enter** — 300ms slide-in with ease-out; CTA clickable at ~150ms (not blocked for full duration). Why it matters: the impeccable rule — ease-out for appearing.
- **List stagger-in** — 6 dropdown items with 50ms stagger (total < 400ms). Why it matters: intentional cascade beats all-at-once or slow-stagger.
- **Button press feedback** — scale or color change within 16ms (next frame). Why it matters: the 100ms perceived-as-instant threshold.
- **Reduced-motion mode** — global `animation-duration: 0.01ms` when media query matches; essential spinners replaced with static indicators. Why it matters: a11y-first default.

### Anti-scenarios (common failure modes)
- **Uniform 300ms everywhere** — tooltip, modal, page-transition all the same. Symptom: small feels sluggish, large feels hurried.
- **Motion blocks interaction** — modal can't be clicked until its 300ms animation completes. Symptom: power users' clicks feel ignored.
- **Always-on loopers everywhere** — pulsing badges, shimmering cards, spinning hero. Symptom: nothing feels important; attention fatigue.
- **Reduced-motion ignored** — animations run regardless of OS setting. Symptom: vestibular users get motion sick.
- **No feedback within 100ms** — submit has no visible response for 500ms. Symptom: user double-clicks; duplicate submission.

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
