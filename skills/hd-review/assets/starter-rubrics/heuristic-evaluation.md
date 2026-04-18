---
rubric: heuristic-evaluation
name: "Usability heuristic evaluation (Nielsen 10)"
applies_to:
  - design-file
  - figma-frame
  - tsx
  - jsx
  - html
  - screen-recording
severity_defaults:
  default: p2
source:
  - Nielsen Norman Group — "10 Usability Heuristics for User Interface Design" (Jakob Nielsen, 1994; updated 2020)
  - Material 3 foundations — accessibility + interaction
  - Fluent 2 — accessibility + content guidance
---

# Heuristic evaluation (Nielsen 10)

Jakob Nielsen's 10 usability heuristics, adapted as an actionable rubric. These are the most widely-used heuristic lens for UI quality — every critique session should at least run this rubric.

## Scope & Grounding

Grounded in Nielsen Norman Group's original 10 heuristics (1994, updated 2020) plus Material 3 and Fluent 2 foundations. This rubric is the baseline pass for any UI critique.

### Personas
- **Novice user** — first time using the product; needs recognition over recall and clear system status. Pain: invisible state after clicking submit leads to duplicate actions.
- **Power user** — knows the product; wants shortcuts, efficient paths, and predictable standards. Pain: novice-only wizards with no keyboard shortcuts force them through long flows every time.
- **Recovering-from-error user** — just hit an error state and needs to understand and fix it. Pain: "Error 422" tells them nothing actionable.
- **Mistake-maker user** — clicked the wrong button, needs a clearly-marked emergency exit. Pain: destructive actions without undo lose their work.

### User stories
- As a **novice user**, I need **immediate feedback on every action** so that **I know the system heard me**.
- As a **power user**, I need **keyboard shortcuts and efficient paths** so that **I'm not stuck in novice wizards**.
- As a **recovering user**, I need **error messages in plain language with a proposed fix** so that **I can resolve the problem myself**.
- As a **mistake-maker**, I need **Cancel / Undo / Back on every destructive or long flow** so that **one wrong click doesn't cost me my work**.
- As any **user**, I need **consistency across screens** so that **I don't re-learn patterns on every page**.

### Realistic scenarios
- **Submit with async feedback** — button shows loading spinner within 100ms; success toast names what succeeded. Why it matters: visibility-of-system-status is the single most-violated heuristic.
- **Destructive action with undo** — Delete triggers a toast "Item deleted [Undo]" with a 5-second window. Why it matters: user-control-and-freedom without modal friction.
- **Consistent Save pattern** — Save is primary-positioned + primary-styled on every screen; never "Submit" or "Apply" for the same verb. Why it matters: consistency-and-standards compounds across the product.
- **Diagnostic error** — "Email already registered — [Sign in instead] or [Use a different email]". Why it matters: help-users-recognize-diagnose-recover.

### Anti-scenarios (common failure modes)
- **Silent submit** — button shows no feedback; user clicks again; duplicate submission. Symptom: violates visibility-of-system-status.
- **"Are you sure?" modal** — existential prompt with OK/Cancel, no named consequence. Symptom: user doesn't know what "sure" means; violates error-prevention + user-control.
- **Dashboard with 20 equal widgets** — no hierarchy, user can't tell what matters. Symptom: violates aesthetic-and-minimalist-design.
- **HTTP codes in user-facing errors** — "422 Unprocessable Entity". Symptom: violates match-between-system-and-real-world AND help-recognize-diagnose-recover.
- **Memory-required wizards** — step 4 requires recall of step 2 inputs. Symptom: violates recognition-rather-than-recall.

## Criteria

### visibility-of-system-status

**Check:** the system always keeps users informed about what's going on via appropriate feedback within reasonable time.
**Default severity:** p1

**Example pass:** submit button shows loading spinner immediately on click; progress bar for upload > 2s; network error banner appears when connection drops.
**Example fail:** button shows no feedback on click; user clicks again; duplicate submission.

### match-between-system-and-real-world

**Check:** speak the user's language, follow real-world conventions, make information appear in natural order.
**Default severity:** p2

**Example pass:** error message "We couldn't find your order — check the order number" (user language). Shopping-cart icon for a cart.
**Example fail:** "HTTP 404" as a user-facing error. Arbitrary icons that require learning.

### user-control-and-freedom

**Check:** users make mistakes; provide clearly-marked "emergency exit" (undo, cancel, back).
**Default severity:** p1

**Example pass:** every form has `Cancel`; delete actions have undo toast; long flows have `Back` without losing progress.
**Example fail:** destructive action with no undo; form cancel button discards all data silently.

### consistency-and-standards

**Check:** follow platform + product conventions; same words / situations / actions mean the same things.
**Default severity:** p2

**Example pass:** `Save` button always primary-positioned + primary-styled across the product.
**Example fail:** `Save` is primary on page A, ghost on page B; `Submit` vs `Save` vs `Apply` used inconsistently.

### error-prevention

**Check:** eliminate error-prone conditions or present confirmation before destructive actions.
**Default severity:** p1

**Example pass:** typed confirmation ("type DELETE to confirm") for irreversible actions; auto-save prevents lost work.
**Example fail:** single-click delete with no confirmation; form that silently discards on navigation.

### recognition-rather-than-recall

**Check:** minimize memory load by making objects / actions / options visible; users shouldn't remember info between steps.
**Default severity:** p2

**Example pass:** breadcrumb shows current location; previous-step selections persist visibly in wizard.
**Example fail:** wizard where user must remember what they entered on step 2 to complete step 4.

### flexibility-and-efficiency-of-use

**Check:** shortcuts / power-user paths coexist with novice-friendly paths.
**Default severity:** p3

**Example pass:** keyboard shortcuts for common actions (⌘K); recent-files quick-access alongside full search.
**Example fail:** only one path to every action; power users forced through novice wizards every time.

### aesthetic-and-minimalist-design

**Check:** UI doesn't contain irrelevant / rarely-needed information; every unit competes with relevant units.
**Default severity:** p2

**Example pass:** dashboard shows the 3 most-used metrics prominently; rest are one-click-away.
**Example fail:** dashboard with 20 widgets, no hierarchy; user can't tell what's important.

### help-users-recognize-diagnose-recover-from-errors

**Check:** error messages in plain language, state the problem precisely, suggest a solution.
**Default severity:** p1

**Example pass:** "Email already registered — [sign in instead] or [use a different email]."
**Example fail:** "Error code 422" with no explanation.

### help-and-documentation

**Check:** even if the system is self-evident, provide help when needed (contextual, searchable, task-focused).
**Default severity:** p3

**Example pass:** inline tooltips on complex fields; searchable help center; empty-state coaching.
**Example fail:** no help text anywhere; user stuck on ambiguous field with no tooltip.

## Extending this rubric

Copy to `docs/rubrics/heuristic-evaluation-<team>.md` and:

1. Adjust severity per heuristic for your product (e.g., a B2B tool might deprioritize `flexibility-and-efficiency` if users are trained)
2. Add heuristic-11+ for product-specific concerns (e.g., "predictive next-step suggestions" for AI-enhanced flows)
3. Reference in `hd-config.md` under `critique_rubrics`

## What this rubric does NOT check

- Aesthetic quality beyond minimalism — use `typography.md`, `color-and-contrast.md`, `spatial-design.md`
- WCAG conformance — use `accessibility-wcag-aa.md` for granular a11y checks
- Interaction states (loading / empty / error / success) — use `interaction-states.md`
- Design-system compliance — use `design-system-compliance.md`

## See also

- [accessibility-wcag-aa.md](accessibility-wcag-aa.md) — granular a11y
- [interaction-states.md](interaction-states.md) — the state coverage overlap with visibility-of-system-status
- Nielsen Norman Group — [10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/)
- Material Design 3 — [m3.material.io/foundations](https://m3.material.io/foundations)
- Fluent 2 — [fluent2.microsoft.design/accessibility](https://fluent2.microsoft.design/accessibility)
