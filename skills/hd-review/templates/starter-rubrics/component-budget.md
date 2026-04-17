---
rubric: component-budget
name: "Component budget"
applies_to:
  - design-file
  - figma-frame
severity_defaults:
  default: p1
---

# Component budget

Checks whether a design proposal respects the team's primitive-component budget. **New primitive components require an RFC** — this rubric enforces that gate. Compound extensions of existing primitives (different props, composition) are not governed here; only new primitives that would expand the design-system surface area.

## What counts as a "primitive"

A primitive is a reusable visual building block that the team would add to the design system library — Button, Input, Card, Badge, Modal, Tooltip, etc.

**Not primitives:**
- Specific compositions (e.g., "SignupModal" composed of existing Modal + Form + Button primitives)
- One-off layouts for specific pages
- Variants of existing primitives (e.g., adding a `ghost` variant to an existing Button is a variant decision, governed by `design-system-compliance`)

## Criteria

### new-primitive-requires-rfc

**Check:** If the proposal introduces a new primitive component, is there a linked RFC in `docs/knowledge/decisions/` (or equivalent path documented in the team's conventions)?
**Default severity:** p1

**Example pass:**
> Proposal: Add `<Stepper>` primitive.
> RFC: `docs/knowledge/decisions/2026-04-16-stepper-primitive-rfc.md` — documents alternatives considered (composing ProgressBar + Button; using existing Badge), reasons for new primitive, migration plan.

**Example fail:**
> Proposal: Add `<Stepper>` primitive.
> No RFC linked; primitive appears without prior documented decision.

### existing-insufficiency-documented

**Check:** The proposal or RFC explicitly addresses why existing primitives are insufficient.
**Default severity:** p1

Teams proliferate primitives when they don't check for existing solutions first. Forcing "why not X?" documentation prevents parallel primitives.

**Example pass:**
> RFC explicitly states: "Tried composing `<Card>` + `<Button>` + `<ProgressBar>` for step-indicator UX; the composition was 40 lines per use and didn't capture the active/complete/disabled state cleanly. A dedicated Stepper primitive reduces usage to 4 lines and centralizes state logic."

**Example fail:**
> RFC jumps straight to the new-primitive spec without discussing whether existing components could compose the same UX.

### migration-plan

**Check:** If the new primitive replaces existing usage patterns, the proposal documents the migration approach (codemods, deprecation timeline, parallel-use period).
**Default severity:** p2

**Example pass:**
> "Existing ad-hoc step-indicator patterns in 3 places (checkout flow, onboarding, settings wizard). Migration: (1) ship Stepper primitive; (2) migrate checkout flow as canonical example; (3) migrate other two over next sprint; (4) add lint rule rejecting ad-hoc patterns after Q2."

**Example fail:**
> No mention of existing patterns or migration; new primitive ships but old code stays indefinitely.

### naming-aligned-with-existing

**Check:** New primitive name follows the team's existing naming conventions (casing, semantic pattern).
**Default severity:** p3

**Example pass:** Team uses single-word PascalCase (Button, Card, Modal). New primitive: `Stepper`. ✓
**Example fail:** Team convention is PascalCase single-word; proposal adds `StepIndicator` (compound name) — not necessarily wrong, but creates naming drift. Flag for discussion.

### default-props-sensible

**Check:** The new primitive ships with sensible defaults — using it without props should produce a reasonable result.
**Default severity:** p2

Over-configurable primitives become liability; every use site needs to know all the props. Good defaults reduce cognitive load.

**Example pass:** `<Stepper>` with no props shows a horizontal stepper with auto-inferred steps from children.
**Example fail:** `<Stepper>` requires explicit `direction`, `size`, `color`, `animationType`, and 4 other props; no sensible defaults.

## Budget math (optional criterion)

Teams that formalize a quota:

### component-budget-within-quota

**Check:** New primitives this quarter ≤ team's declared budget (e.g., "≤2 new primitives per quarter").
**Default severity:** p2

Requires the team to declare their quota in `docs/context/conventions/how-we-work.md`. If undeclared, skip this criterion.

**Example pass:** Budget is 2/quarter; this is the 1st new primitive this quarter. ✓
**Example fail:** Budget is 2/quarter; this would be the 4th. Defer or cut.

## Extension

If the team has stricter budget rules (e.g., "no new primitives ever without unanimous design team approval"), duplicate this file to `docs/context/design-system/component-budget-<team>.md` and codify.

## What this rubric does NOT check

- Whether the proposed primitive is well-designed (visual, UX quality) — that's `design-system-compliance` + human review
- Whether the primitive is accessible — `accessibility-wcag-aa` covers that
- Whether the RFC itself is well-written — different kind of review
- Code quality of the implementation — out of scope

## See also

- [design-system-compliance.md](design-system-compliance.md) — governs variants within existing primitives
- [accessibility-wcag-aa.md](accessibility-wcag-aa.md) — applies to any new primitive's visual spec
- [../../references/rubric-application.md](../../references/rubric-application.md) — how rubrics apply
