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

## Scope & Grounding

Grounded in the plus-uno pilot: **cheat-sheet-is-law** + **no-duplicate-components** were the two rules that prevented a 30-component drift into chaos. This rubric codifies both.

### Personas
- **Design-system steward** — owns the cheat-sheet and the primitive inventory. Pain: primitives proliferate when contributors don't search for existing solutions before proposing new ones.
- **Feature designer** — needs UI building blocks for a flow they're scoping. Pain: staff DS reviews feel like gatekeeping when they're actually preventing parallel-primitive drift.
- **New contributor** — joined recently, unsure what primitives already exist. Pain: ships a `StepIndicator` next to an existing `Stepper` simply because they didn't know.

### User stories
- As a **feature designer**, I need **to compose existing primitives first and document why they're insufficient** so that **I don't fork the system out of ignorance**.
- As a **DS steward**, I need **every new primitive to ship with an RFC, a migration plan, and sensible defaults** so that **the system's surface area only grows for justified reasons**.
- As a **new contributor**, I need **the cheat-sheet to be the first stop** so that **I find the existing `Stepper` before writing `StepIndicator`**.
- As a **tech lead**, I need **a quarterly primitive budget** so that **the system's growth rate is bounded and intentional**.

### Realistic scenarios
- **Proposing a `<Stepper>` primitive** — RFC documents failed composition of Card + Button + ProgressBar, quantifies the 40-line-to-4-line reduction, includes migration plan for 3 existing ad-hoc patterns. Why it matters: the plus-uno pattern — every primitive earns its place.
- **Adding a `ghost` variant to `<Button>`** — NOT governed by this rubric (variant within existing primitive). Routed to `design-system-compliance`. Why it matters: the rubric scope-check prevents over-triggering.
- **Hitting the quarterly budget** — team declared 2/quarter; this would be the 4th. Defer or cut. Why it matters: budget math makes the trade-off explicit instead of implicit.

### Anti-scenarios (common failure modes)
- **New primitive without RFC** — ships straight to the library. Symptom: nobody remembers why it exists six months later; parallel primitive emerges.
- **Insufficiency not documented** — RFC jumps to spec without addressing "why not compose existing?". Symptom: duplicate primitive ships; DS steward discovers it in review.
- **No migration plan** — new primitive ships but ad-hoc predecessors stay forever. Symptom: three patterns for the same UX live in the codebase indefinitely.
- **Over-configurable primitive** — requires 8 explicit props to render anything sensible. Symptom: every use site is a 20-line configuration block; nobody uses it.

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
