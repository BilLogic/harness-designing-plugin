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
