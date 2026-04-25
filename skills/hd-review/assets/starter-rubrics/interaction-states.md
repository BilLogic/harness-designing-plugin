---
rubric: interaction-states
name: "Interaction states coverage"
applies_to:
  - design-file
  - figma-frame
  - component
  - tsx
  - jsx
  - html
severity_defaults:
  default: p2
---

# Interaction states

Every stateful view should handle its four canonical interaction states: **loading**, **empty**, **error**, **success**. This rubric checks whether each is present, visually distinct, and semantically meaningful. Adapts baselines from Material 3 and Fluent 2 state-pattern guidelines.

## Scope & Grounding

Grounded in Material 3's state-pattern foundations and Fluent 2's accessibility-first state guidelines.

### Personas
- **First-use (new) user** — arriving at a view with zero data. Pain: empty whitespace or "No items" leaves them with no hint of what to do next.
- **Slow-network user** — waiting for a data-bound view to load. Pain: silent blank screens during load make them reload or bounce.
- **Recovering-from-error user** — network dropped mid-flow. Pain: "Oops! Something went wrong" gives them no recoverable action.
- **Action-completing user** — just clicked Save / Submit. Pain: silent success leaves them wondering if the action landed.

### User stories
- As a **new user**, I need **an empty state with illustration + one-sentence explanation + CTA** so that **I know what to do first**.
- As a **slow-network user**, I need **a skeleton or spinner with the same dimensions as loaded content** so that **the page doesn't jump when data arrives**.
- As a **recovering user**, I need **error copy that says what failed and how to retry** so that **I'm not stuck**.
- As an **action-completing user**, I need **an explicit success indicator (toast / confirmation)** so that **I know the action landed**.
- As a **colorblind user**, I need **state indicators that use color + icon together** so that **I can distinguish error from success without hue**.

### Realistic scenarios
- **Data-bound dashboard** — all four states in Storybook: skeleton on load, empty illustration + CTA, diagnostic error with Retry, silent success with toast. Why it matters: the all-four-states-covered check is the single biggest catch.
- **Empty cart** — illustration + "Your cart is empty" + "Browse items" CTA. Why it matters: canonical Material 3 empty-state pattern.
- **Form submit** — loading spinner on button at 100ms, "Settings saved" toast on success, "Couldn't save — your internet dropped. [Try again]" on recoverable error. Why it matters: the full state cycle for the most-common interaction.

### Anti-scenarios (common failure modes)
- **"Oops! Something went wrong"** — fuzzy non-diagnostic error. Symptom: user has no signal on what failed or how to fix it.
- **Silent success** — page refreshes with no toast/confirmation. Symptom: user re-clicks Save to be sure; duplicate submits.
- **Skeleton dimension mismatch** — 24px loading spinner replaced by 400px content. Symptom: page visibly jumps; layout shift confuses users.
- **Missing empty state** — zero-data view shows bare whitespace or "No items". Symptom: new users bounce.
- **Color-only state indicator** — red text for error, green for success, no icon. Symptom: colorblind users see identical states.

## Criteria

### loading-state-present

**Check:** view shows a loading indicator (skeleton / spinner / progress bar / placeholder) while async data is in-flight.
**Default severity:** p1 for data-bound views, p3 for purely-static views.

**Example pass:** component renders `<SkeletonGrid />` while the `useQuery` result is `isLoading === true`.
**Example fail:** component shows empty whitespace or flashes fully-empty content while loading, then abruptly pops full data in.

### empty-state-present

**Check:** when the underlying data source is empty (zero results, new user, cleared filter), the view presents a purposeful empty state — not a bare "no results" or blank screen.
**Default severity:** p2

A good empty state has three elements: (1) illustration or visual anchor, (2) one-sentence explanation, (3) call-to-action if applicable.

**Example pass:** empty cart shows a cart illustration + "Your cart is empty" + "Browse items" CTA.
**Example fail:** empty cart shows nothing, or just the text "No items."

### error-state-present

**Check:** error states distinguish between recoverable (retry) and non-recoverable (contact support / go back) outcomes. Error copy is human.
**Default severity:** p1

Banned copy: "Something went wrong", "Error 500", "Oops! An error occurred." These are non-diagnostic and unhelpful.

**Example pass:** "Couldn't load your orders. Check your connection and [Try again]." (recoverable)
**Example fail:** "Error. Please try again." (fuzzy and non-actionable)

### success-state-present

**Check:** non-trivial actions that the user initiated (save, submit, apply, order) have an explicit success indicator — visual (checkmark / confirmation screen) or toast/snackbar.
**Default severity:** p2

Silent success (form submits and page refreshes with no acknowledgment) is a common fail — user can't tell if it worked.

**Example pass:** after save, toast appears: "Settings saved." with dismissal after 3s.
**Example fail:** after save, page silently refreshes with the same view; user unsure whether save occurred.

### state-transitions-smooth

**Check:** transitions between states (loading → success, loading → error) don't cause layout shift, flash of empty content, or content jumps.
**Default severity:** p3

**Example pass:** skeleton has the same dimensions as the real content, so there's no jump when data loads.
**Example fail:** loading spinner is 24px tall; replaced content is 400px tall; page visibly jumps.

### all-four-states-covered

**Check:** the view demonstrably covers loading + empty + error + success. If the view is dynamic but only covers 2/4 (typically loading + success, missing empty + error), it scores a finding.
**Default severity:** p1 for primary user flows, p3 for utility/admin views.

**Example pass:** Storybook stories or design file has frames for each of the 4 states.
**Example fail:** component code has no conditional paths for empty or error — those states are only revealed in production.

### state-indicator-semantic

**Check:** indicators use color + icon together (not color alone) for colorblind accessibility.
**Default severity:** p2

**Example pass:** error uses red + triangle-warning icon + "Error" label.
**Example fail:** error differentiated only by red text color.

## Extending this rubric

Copy to `docs/context/design-system/interaction-states-<team>.md` and:

1. Add team-specific state patterns (e.g., "we use Pulse component for all loading states")
2. Override severity per criterion for your team's tolerance
3. Reference in `hd-config.md` `critique_rubrics` list

## What this rubric does NOT check

- Whether the state copy is well-written (that's copy-voice rubric)
- Whether the state is accessible to screen readers (accessibility-wcag-aa rubric covers ARIA semantics)
- Whether the state is performant (that's a performance rubric, not in this plug-in)
- Whether the state matches product requirements (that's PM review, not design review)

## See also

- [accessibility-wcag-aa.md](accessibility-wcag-aa.md) — screen reader announcements for state changes
- [design-system-compliance.md](design-system-compliance.md) — approved loading indicator variants
- Material 3: [m3.material.io/foundations/interaction/states](https://m3.material.io/foundations/interaction/states) — baseline state patterns
- Fluent 2: [fluent2.microsoft.design/accessibility](https://fluent2.microsoft.design/accessibility) — a11y-first state guidelines
