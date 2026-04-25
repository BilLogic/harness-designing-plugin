# Rubric application

**Purpose:** how to apply a Layer 4 rubric to a specific work item. Loaded by [SKILL.md § Targeted review](../SKILL.md).

## Rubric file schema

Every rubric file (starter or user-authored) has this shape:

```markdown
---
rubric: <rubric-slug>                      # kebab-case; unique across team
name: "<Human-readable name>"              # title for display
applies_to:                                # work-item types this rubric targets
  - design-file
  - figma-frame
  - html
  - css
  - token-json
severity_defaults:                          # default severity for each criterion if not overridden
  default: p2
---

# <Human-readable name>

## Criteria

### <criterion-slug-1>

**Check:** <one-sentence test>
**Default severity:** p1 | p2 | p3
**Applies to:** <subset of applies_to, if narrower than rubric-level>

<Explanation of what good looks like.>

**Example pass:** <concrete example of a work item passing this criterion>
**Example fail:** <concrete example of a work item failing, with why>

### <criterion-slug-2>
...
```

## Work-item types

| Type | Input format | How rubrics access it |
|---|---|---|
| `design-file` | Local path to markdown doc describing a design | `Read` the file content |
| `figma-frame` | Figma URL | Figma MCP (if installed) — fetches frame metadata |
| `html` | Local path or pasted HTML | Parse via markdown Read |
| `css` | Local path or pasted CSS | Parse via markdown Read |
| `token-json` | Local path to tokens.json | Parse as JSON |
| `pr-diff` | Pasted unified diff | Parse as text |

A rubric's `applies_to` field determines which work-item types trigger it. Applying an accessibility rubric to a `token-json` file is nonsensical — the rubric's `applies_to` excludes that type, so the criterion skips.

## Application loop

For each rubric + work item pair:

1. **Validate rubric schema** — frontmatter must have `rubric`, `name`, `applies_to`
2. **Check type compatibility** — if work item's type ∉ rubric's `applies_to`, skip this rubric (not a failure; just not applicable)
3. **For each criterion:**
   - Apply the check
   - Record result: `pass` / `fail` / `warning` / `skip`
   - If `fail` or `warning`, capture finding with severity (from `severity_defaults` or criterion-level override)
4. **Aggregate findings** across all applied criteria
5. **Deduplicate** — if two criteria across two rubrics produce identical finding text, merge (rare but possible)
6. **Sort** — by severity (P1 first), then by rubric + criterion alphabetically
7. **Emit** — per `targeted-review-format.md`

## Applying multiple rubrics

Targeted review typically applies multiple rubrics to a single work item — a design proposal might get checked against accessibility, design-system-compliance, and component-budget simultaneously.

Order of rubric application:

1. User's `--rubric <name>` flag → only that rubric
2. `hd-config.md` field `critique_rubrics` → that list, in order
3. Default: all starter rubrics that match the work item's type

## Custom rubric authoring

Users extend by authoring new rubric files. Location: `docs/rubrics/<rubric-name>.md` (canonical; rubrics are CHECKS separate from design-system source content).

Requirements:

- Follows the schema above
- References the rubric in `hd-config.md` `critique_rubrics` list
- Criteria are concrete (pass/fail testable), not aspirational

### Example custom rubric skeleton

```markdown
---
rubric: marketing-exception-pattern
name: "Marketing-exception scoping"
applies_to:
  - design-file
  - figma-frame
severity_defaults:
  default: p1
---

# Marketing-exception scoping

## Criteria

### time-bound

**Check:** Does the design explicitly state an end date or campaign duration?
**Default severity:** p1

Marketing variants must be time-bound. They're exceptions to the design system, not additions.

**Example pass:** "This variant is for the Q4 launch (ends Dec 15, 2026); revert to standard afterward."
**Example fail:** No end date mentioned; variant treated as permanent.

### explicit-rationale

**Check:** Does the design include a sentence explaining why existing variants were insufficient?
**Default severity:** p2
...
```

## Edge cases

### Ambiguous criteria

Some criteria can't be machine-checked precisely (e.g., "is this visually balanced?"). For these:

- Severity defaults to P3 (advisory, not blocking)
- Finding text explicitly says "qualitative check — human review recommended"
- Rubric file notes the criterion as qualitative

### Work item spans multiple files

If a design proposal references 5 other files, review applies to the top-level proposal only. Referenced files aren't auto-recursed. Users can run review separately on each.

### Rubric applies but work item missing required context

Example: design-system-compliance rubric checks "uses approved color tokens," but the user's repo has no design-system/components/cheat-sheet.md yet. Rubric aborts with: "Can't apply — missing `docs/context/design-system/components/cheat-sheet.md`. Run `/hd:setup` to scaffold Layer 1 first."

## Cross-reference

- [targeted-review-format.md](targeted-review-format.md) — output structure (pairs with application loop)
- [`../assets/starter-rubrics/`](../assets/starter-rubrics/) — shipped rubric examples; canonical schema reference
- [`../SKILL.md`](../SKILL.md) § Targeted review — step-by-step procedure using this mechanism
