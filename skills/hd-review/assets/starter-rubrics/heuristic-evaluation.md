---
rubric: heuristic-evaluation
name: "Usability heuristic evaluation (Nielsen 10)"
applies_to:
  - skill-md
  - slash-command-flow
  - design-file
  - tsx
version: 1
severity_defaults:
  default: p2
source:
  - "Nielsen Norman Group — '10 Usability Heuristics for User Interface Design' (Jakob Nielsen, 1994; updated 2020)"
  - "Material 3 foundations — accessibility + interaction"
  - "Fluent 2 — accessibility + content guidance"
adapted_for: "This plug-in's own meta-harness (2026-04-21) — `/hd:*` command interaction flows, SKILL.md decision trees, per-layer procedure prose."

sections:
  criteria:
    order: 1
    title: "Criteria"
    criteria:
      - id: visibility-of-system-status
        severity: p1
        check: "System keeps users informed about what's going on via appropriate feedback within reasonable time"
      - id: match-between-system-and-real-world
        severity: p2
        check: "System speaks user's language, follows real-world conventions, presents information in natural order"
      - id: user-control-and-freedom
        severity: p1
        check: "Users can recover from mistakes via clearly-marked emergency exit (undo, cancel, back)"
      - id: consistency-and-standards
        severity: p2
        check: "Same words / situations / actions mean the same things; follows platform + product conventions"
      - id: error-prevention
        severity: p1
        check: "Eliminates error-prone conditions OR presents confirmation before destructive actions"
      - id: recognition-rather-than-recall
        severity: p2
        check: "Minimizes memory load by making objects / actions / options visible; users don't have to remember info between steps"
      - id: flexibility-and-efficiency-of-use
        severity: p3
        check: "Shortcuts / power-user paths coexist with novice-friendly paths"
      - id: aesthetic-and-minimalist-design
        severity: p2
        check: "UI doesn't contain irrelevant / rarely-needed information; every unit competes with relevant units"
      - id: help-users-recognize-diagnose-recover-from-errors
        severity: p1
        check: "Error messages in plain language, state the problem precisely, suggest a solution"
      - id: help-and-documentation
        severity: p3
        check: "Provides help when needed (contextual, searchable, task-focused) — even if system seems self-evident"
---

# Heuristic evaluation (Nielsen 10)

Jakob Nielsen's 10 usability heuristics, adapted as an actionable rubric.

**Dogfood scope (this plug-in repo):** read "UI" as "`/hd:*` command interaction flow". A user invoking `/hd:setup` walks a 10-step procedure with branching decisions — every step is a UX moment. Apply the 10 heuristics to the SKILL.md-driven interaction: visibility of system status (step-numbered progress), match between system and real world (plain-English narration), user control (skip / revise / cancel gates), error prevention (preview-before-write), recognition over recall (scan-summary before layer walks), etc. Skip visual heuristics (aesthetic design, color) — those don't apply to markdown interaction.

## Scope & Grounding

Grounded in Nielsen Norman Group's original 10 heuristics (1994, updated 2020) plus Material 3 and Fluent 2 foundations. This rubric is the baseline pass for any UI review.

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

## Criteria — rationale + examples

Per-heuristic prose. Normative criteria live in YAML frontmatter above; this body explains the *why* + concrete pass/fail anchors.

### visibility-of-system-status

**Pass:** submit button shows loading spinner immediately on click; progress bar for upload > 2s; network error banner appears when connection drops.
**Fail:** button shows no feedback on click; user clicks again; duplicate submission.

### match-between-system-and-real-world

**Pass:** error message "We couldn't find your order — check the order number" (user language). Shopping-cart icon for a cart.
**Fail:** "HTTP 404" as a user-facing error. Arbitrary icons that require learning.

### user-control-and-freedom

**Pass:** every form has `Cancel`; delete actions have undo toast; long flows have `Back` without losing progress.
**Fail:** destructive action with no undo; form cancel button discards all data silently.

### consistency-and-standards

**Pass:** `Save` button always primary-positioned + primary-styled across the product.
**Fail:** `Save` is primary on page A, ghost on page B; `Submit` vs `Save` vs `Apply` used inconsistently.

### error-prevention

**Pass:** typed confirmation ("type DELETE to confirm") for irreversible actions; auto-save prevents lost work.
**Fail:** single-click delete with no confirmation; form that silently discards on navigation.

### recognition-rather-than-recall

**Pass:** breadcrumb shows current location; previous-step selections persist visibly in wizard.
**Fail:** wizard where user must remember what they entered on step 2 to complete step 4.

### flexibility-and-efficiency-of-use

**Pass:** keyboard shortcuts for common actions (⌘K); recent-files quick-access alongside full search.
**Fail:** only one path to every action; power users forced through novice wizards every time.

### aesthetic-and-minimalist-design

**Pass:** dashboard shows the 3 most-used metrics prominently; rest are one-click-away.
**Fail:** dashboard with 20 widgets, no hierarchy; user can't tell what's important.

### help-users-recognize-diagnose-recover-from-errors

**Pass:** "Email already registered — [sign in instead] or [use a different email]."
**Fail:** "Error code 422" with no explanation.

### help-and-documentation

**Pass:** inline tooltips on complex fields; searchable help center; empty-state coaching.
**Fail:** no help text anywhere; user stuck on ambiguous field with no tooltip.

## Extending this rubric

Copy to `docs/rubrics/heuristic-evaluation-<team>.md` and:

1. Adjust per-heuristic `severity` values in the YAML for your product (e.g., a B2B tool might deprioritize `flexibility-and-efficiency-of-use` if users are trained)
2. Add heuristic-11+ entries to the YAML for product-specific concerns (e.g., "predictive next-step suggestions" for AI-enhanced flows)
3. Reference in `hd-config.md` under `critique_rubrics`

## What this rubric does NOT check

- Aesthetic quality beyond minimalism — use `typography.md`, `color-and-contrast.md`, `spatial-design.md`
- WCAG conformance — use `accessibility-wcag-aa.md` for granular a11y checks
- Interaction states (loading / empty / error / success) — use `interaction-states.md`
- Design-system compliance — use `design-system-compliance.md`

## See also

- [`../../skills/hd-review/references/rubric-yaml-schema.md`](../../skills/hd-review/references/rubric-yaml-schema.md) — schema for the YAML frontmatter above
- [accessibility-wcag-aa.md](accessibility-wcag-aa.md) — granular a11y
- [interaction-states.md](interaction-states.md) — the state coverage overlap with visibility-of-system-status
- Nielsen Norman Group — [10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/)
- Material Design 3 — [m3.material.io/foundations](https://m3.material.io/foundations)
- Fluent 2 — [fluent2.microsoft.design/accessibility](https://fluent2.microsoft.design/accessibility)
