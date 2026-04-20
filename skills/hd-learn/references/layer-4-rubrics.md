# Layer 4 — Rubric Setting

**Article source:** §4d.
**Memory type:** procedural ("how we judge") — see [memory-taxonomy.md](memory-taxonomy.md).
**Mutability:** distributed across the harness, not a single folder.

## What belongs here

**Taste, embedded as checks.** Rubrics are your team's design standards made machine-readable:

- Accessibility (WCAG 2.1 AA contrast, tap targets ≥44pt, keyboard navigation, focus states)
- Design-system compliance (only approved tokens; variants within allowed set; no one-off colors)
- Component budget (no new primitive components without RFC)
- Interaction patterns (loading / empty / error / success states present for every stateful view)
- Copy voice (matches tone guide; avoids banned terms)

## Why distributed, not centralized (critical)

The article §4d is emphatic: **rubrics are a *behavior of the system*, not a folder.** They live in three places simultaneously:

1. **Definitions** — `docs/context/design-system/` describes what "good" looks like (Layer 1 territory)
2. **Execution** — `skills/hd-review/` runs the checks (review + review modes)
3. **Enforcement** — `AGENTS.md` lists rubric requirements as quality gates

Centralizing everything in one `rubrics/` folder flattens the structure and breaks the connection between *what good is* (Layer 1) and *how we check for it* (Layer 2 skill + Layer 3 gate).

## The v0 trade-off

`docs/rubrics/INDEX.md` is a thin pointer file so users can FIND the rubric story when they look. The actual rubrics execute in `hd:review` (review + review modes).

## What does NOT belong here

- **Rubric definitions** alone — those are Layer 1 context
- **Rubric execution logic** alone — that's Layer 2 skill code
- **A specific rubric result** ("yesterday's review failed 3 checks") — that's a Layer 5 lesson

Layer 4 is the *integration* of definitions + execution + enforcement. If one piece is missing, the layer isn't working.

## When a team needs Layer 4

Most design teams have an informal rubric already — "does this match our style?" Layer 4 formalizes it. Worth adopting when:

- Reviews are subjective and reviewers disagree on what "good" is
- Onboarding a new designer means re-teaching taste every time
- Designers rotate through projects and consistency is eroding

## Scaffolded by

Partially by `/hd:setup` (it creates `docs/context/design-system/` and `docs/rubrics/INDEX.md`). Fully activated by `/hd:review review` (harness-wide) or `/hd:review review <path>` (single work item).

## See also

- [concept-overview.md](concept-overview.md) — five-layer frame
- [layer-1-context.md](layer-1-context.md) — where rubric definitions live
- [glossary.md](glossary.md) — "rubric" vs "guideline" vs "check"
