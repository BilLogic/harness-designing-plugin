# Targeted-review format

**Purpose:** structured output shape for targeted review. Loaded by [SKILL.md § Targeted review](../SKILL.md). Distinct from full review output (which writes a dated report file; targeted review is inline by default, optional save to `docs/knowledge/reviews/`).

## Output structure

Targeted review emits a single markdown response with three sections:

1. **Summary** — 1 paragraph; what the work item is + top-level verdict
2. **Findings (YAML)** — parseable severity list; each finding tagged with rubric + criterion + suggested fix
3. **Prose** — 1-3 paragraphs of narrative explanation, plus next-step suggestion

See [`../assets/targeted-review-response.md.template`](../assets/targeted-review-response.md.template) for the canonical template.

## Severity scale

Three levels. Same scale as full-review findings (P1/P2/P3) but applied to work items instead of harness health.

### P1 — Blocks approval

Rubric violations that would block design approval or merge:

- Accessibility: contrast ratio <3:1 for text; tap targets <32pt (clear inaccessibility)
- Design-system: unapproved color token; button variant not in approved set
- Component-budget: new primitive component without RFC
- Functional: missing required state (error / empty / loading absent on stateful view)

### P2 — Should fix

Violations that should be addressed but don't strictly block:

- Accessibility: focus state present but low contrast (3:1-4.5:1)
- Design-system: spacing off-grid by 2-4px (not egregious but drift)
- Typography: scale step skipped (18 → 30 without 24)
- Copy: unclear microcopy that passes but could be clearer

### P3 — Nice-to-have

Polish-level observations:

- Subtle inconsistencies across similar screens
- Minor optimization opportunities
- Suggestions for future iterations

## Finding YAML schema

Each finding has:

```yaml
- severity: p1 | p2 | p3
  rubric: <rubric-name>                 # matches rubric file in starter-rubrics/ or user's custom
  criterion: <criterion-name>           # matches a criterion within that rubric
  finding: <one-sentence description>   # what's wrong
  suggested_fix: <one-sentence>         # how to fix
  location: <where in the work item>    # file:line, Figma node ID, DOM selector, etc.
```

`location` is optional (some findings apply to the work item as a whole).

## Example output

```markdown
## Review: docs/proposals/q4-button-refresh.md

### Summary

Proposal adds three new button variants for the Q4 marketing campaign. One variant (primary-gradient) violates the design-system token budget — introduces a new gradient color not in the approved token set. Two other variants (destructive-outline, ghost-compact) compose approved tokens correctly.

### Findings

```yaml
- severity: p1
  rubric: design-system-compliance
  criterion: approved-color-tokens
  finding: "primary-gradient uses #0051FF→#8B5CF6, which is not in the approved token set"
  suggested_fix: "Use approved primary token or propose a token addition via RFC"
  location: "docs/proposals/q4-button-refresh.md:45"

- severity: p2
  rubric: design-system-compliance
  criterion: component-budget
  finding: "Three new button variants proposed in one cycle; component budget allows 1 new variant per quarter without RFC"
  suggested_fix: "Prioritize one variant for this quarter; defer the others to Q1"

- severity: p3
  rubric: accessibility-wcag-aa
  criterion: focus-indicator
  finding: "primary-gradient variant lacks a focus-state spec"
  suggested_fix: "Add focus ring spec matching the existing primary button pattern"
```

### Prose

The Q4 button refresh proposal is partially ready — two of three variants compose cleanly, but `primary-gradient` introduces an unapproved token. Token additions should flow through `docs/knowledge/decisions/` as an RFC first, then promote to `docs/context/design-system/` once approved. Defer the gradient variant; ship the other two.

Component-budget finding (P2) is worth surfacing at review: three variants in one cycle is above the informal quota. Consider phasing.

### Next step

This review surfaced a recurring pattern (marketing requests color-token exceptions). Consider `/hd:maintain capture` to log a lesson. After ≥3 similar lessons, `/hd:maintain rule-propose` could formalize the rule.
```

## Rubric attribution

Every finding attributes its rubric. This lets users:

- Filter findings by rubric (`grep` or YAML parse)
- Identify which rubrics are most active (frequent violations = maybe the rubric is too strict OR the team genuinely needs to address a pattern)
- Route suggestions (design-system findings → design lead; a11y findings → a11y champion)

## Next-step suggestions

Review ends with one concrete suggestion. Common patterns:

- **Findings include a pattern worth capturing** → "Consider `/hd:maintain capture` to log this as a lesson"
- **All P1 findings are design-system violations** → "Review your design-system/cheat-sheet.md with the team"
- **Work item passed** → "Ready for approval; consider documenting decisions as a `/hd:maintain capture`"

Never suggest another plug-in's commands — stay in our own `/hd:*` verb namespace in user-facing output.

## Work-item types supported

- **Local file path** — markdown, HTML, CSS, design-token JSON
- **Figma frame URL** — via Figma MCP (if installed)
- **PR diff** — user pastes diff
- **Pasted markdown** — copy-paste from Slack / doc

Work-item type affects which rubrics apply (accessibility rubric doesn't make sense on a raw token JSON file; design-system-compliance does).

## What review does NOT do

- **Does not modify the work item** — read-only
- **Does not auto-apply fixes** — suggest only
- **Does not score / grade** — qualitative findings, not numeric scores
- **Does not replace human review** — review augments; doesn't substitute

## See also

- [rubric-application.md](rubric-application.md) — the mechanism applying rubrics to work items
- [`../assets/targeted-review-response.md.template`](../assets/targeted-review-response.md.template) — canonical template
- [`../assets/starter-rubrics/`](../assets/starter-rubrics/) — shipped rubrics
