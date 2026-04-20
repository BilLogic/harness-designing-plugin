---
title: Targeted-review procedure
loaded_by: hd-review
---

# Targeted review — procedure

## Purpose

Step-by-step procedure for `/hd:review targeted <path-or-url> [--rubric <name>]`: resolve the rubric, dispatch the appropriate applicator sub-agent (or run inline), and emit findings. Read-only by default. Invoked by the targeted-review workflow checklist in `../SKILL.md`.

## Steps

**Step 1 — Parse target.** From `/hd:review targeted <path-or-url> [--rubric <name>]`. If target missing → ask: *"Which work item? Give me a path or URL."*

**Step 2 — Resolve rubric.**

Resolution order:
1. `--rubric <name>` explicit → look in `docs/rubrics/<name>.md` first, then `docs/context/design-system/<name>.md` (legacy or team-specific overlay), then `skills/hd-review/assets/starter-rubrics/<name>.md`
2. No explicit → infer from work item type (see [`rubric-application.md`](rubric-application.md)):
   - `.tsx` / `.jsx` / `.html` / `.css` → `design-system-compliance`
   - `SKILL.md` → `skill-quality`
   - Figma file URL → `accessibility-wcag-aa` + `design-system-compliance`

If ambiguous, ask: *"Which rubric? Available: [list]"*

**Step 3 — Evaluate.** Parallel dispatch when host supports it; inline otherwise. Same output shape either way.

### Target is a SKILL.md + rubric is skill-quality

**With parallel dispatch:**
```
Task design-harnessing:review:skill-quality-auditor(
  skill_md_path: <path>
)
```

**Inline:** read the skill-quality rubric, apply to the SKILL.md, emit findings.

If multiple SKILL.md paths were passed, dispatch in a single parallel batch (up to 5; serial at 6+).

### Any other target

**With parallel dispatch:**
```
Task design-harnessing:review:rubric-applier(
  work_item_path: <path>,
  rubric_path: <rubric file>
)
```

**Inline:** read the rubric, apply each criterion against the work item, emit findings.

If multiple rubrics apply to one target, dispatch one `rubric-applier` per rubric in a single parallel batch (up to 5; serial at 6+).

Note: `rubric-applier` is apply-mode only. For extract-mode (surfacing implicit rubric criteria from an AI-doc corpus) use `design-harnessing:review:rubric-extractor` — that path is owned by `/hd:setup` Step 7 and `/hd:maintain rule-propose` Step 4b, not by `/hd:review targeted`.

**Step 4 — Aggregate per [`targeted-review-format.md`](targeted-review-format.md).**

Output format:
```markdown
## Targeted review — <work-item>
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

**Step 5 — Emit inline.** Zero file writes by default. `git status` after must be clean.

Optional: if user asks to save the targeted review output, write to `docs/knowledge/reviews/$(date -u +%Y-%m-%d)-targeted-<target-slug>.md`.

→ Return to [../SKILL.md](../SKILL.md)
