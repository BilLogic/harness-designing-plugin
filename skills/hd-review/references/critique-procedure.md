---
title: Critique-mode procedure
loaded_by: hd-review
---

# Critique mode — full procedure

## Purpose

Step-by-step procedure for `/hd:review critique <path-or-url> [--rubric <name>]`: resolve the rubric, dispatch the appropriate applicator sub-agent, and emit findings inline. Read-only; zero file writes. Invoked by the critique-mode workflow checklist in `../SKILL.md`.

## Steps

**Step 1 — Parse target.** From `/hd:review critique <path-or-url> [--rubric <name>]`. If target missing → ask: *"Which work item? Give me a path or URL."*

**Step 2 — Resolve rubric.**

Resolution order:
1. `--rubric <name>` explicit → look in `docs/rubrics/<name>.md` first, then `docs/context/design-system/<name>.md` (legacy or team-specific overlay), then `skills/hd-review/assets/starter-rubrics/<name>.md`
2. No explicit → infer from work item type (see [`rubric-application.md`](rubric-application.md)):
   - `.tsx` / `.jsx` / `.html` / `.css` → `design-system-compliance`
   - `SKILL.md` → `skill-quality`
   - Figma file URL → `accessibility-wcag-aa` + `design-system-compliance`

If ambiguous, ask: *"Which rubric? Available: [list]"*

**Step 3 — Dispatch.** Specialized handling for SKILL.md targets; generic for everything else:

### Target is a SKILL.md + rubric is skill-quality

```
Task design-harnessing:review:skill-quality-auditor(
  skill_md_path: <path>
)
```

### Any other target

```
Task design-harnessing:review:rubric-applicator(
  work_item_path: <path>,
  rubric_path: <rubric file>
)
```

**Step 4 — Aggregate per [`critique-format.md`](critique-format.md).**

Output format:
```markdown
## Critique — <work-item>
**Rubric:** <name> · **Composite:** healthy | degraded | critical_fail

### P1 findings (fix before merge)
- [criterion: <name>] <evidence> → <suggested_fix>

### P2 findings (should fix)
...

### P3 findings (polish)
...

### Recommendation
<one-sentence verdict + next step>
```

**Step 5 — Emit inline. Zero file writes.** `git status` after critique must be clean.

→ Return to [../SKILL.md § critique-mode](../SKILL.md#critique-mode)
