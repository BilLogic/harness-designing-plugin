# Layer 4 — Rubric Setting (setup guide)

**Purpose:** action-oriented guide for the Rubrics layer — critically, rubrics are *distributed behavior*, not a folder.
**Concept explainer:** [hd-onboard `layer-4-rubrics.md`](../../hd-onboard/references/layer-4-rubrics.md)

## v0.MVP scope — thin pointer only

`hd:setup` scaffolds `docs/rubrics/INDEX.md` as a **thin pointer file** (~15 lines) explaining that:

- Rubric *definitions* live in `docs/context/design-system/` (Layer 1 territory)
- Rubric *execution* happens in `skills/hd-review/` (v1 — not shipped at v0.MVP)
- Rubric *enforcement* lives in `AGENTS.md` as quality gates

The INDEX.md is navigational, not prescriptive. It exists so users looking for "the rubrics folder" find the distributed-pattern explanation rather than an empty dir.

## Why NOT a centralized `rubrics/` folder

Per article §4d: centralizing definitions + execution + enforcement in one `rubrics/` folder breaks the connection between *what good is* (Layer 1) and *how we check for it* (Layer 2/3). Each piece belongs in its native layer; rubrics are the *integration*, not a storage location.

## What a rubric IS (concretely)

A rubric is taste-embedded-as-check. Four canonical categories:

1. **Accessibility** — WCAG 2.1 AA contrast, tap targets ≥44pt, keyboard navigation, focus states
2. **Design-system compliance** — only approved tokens; variants within allowed set
3. **Component budget** — no new primitive components without RFC
4. **Interaction states** — loading / empty / error / success present for every stateful view

(Other rubric types: copy voice, consistency, accessibility depth, motion, etc.)

## Scaffolding steps (v0.MVP)

1. Create `docs/rubrics/` dir
2. Write `docs/rubrics/INDEX.md` from template (see below)
3. Inform user: "Rubrics execute when `/hd:review` ships in v1. For now, define rubric criteria in `docs/context/design-system/` and reference them in your AGENTS.md quality gates."

### INDEX.md template

```markdown
# Rubrics Index

Rubrics are a **behavior of the system**, not a folder. They live distributed:

- **Definitions** → `docs/context/design-system/` (what "good" looks like)
- **Execution** → `skills/hd-review/` (v1 — audit + critique runs checks)
- **Enforcement** → `AGENTS.md` quality gates

See article §4d for the reasoning.

## Active rubrics (v0.MVP)

None yet. Add rubric criteria to `docs/context/design-system/<rubric-name>.md` as your team formalizes them. When `/hd:review` ships (v1), it reads this index + the distributed criteria to run checks.
```

## When v0.5+ expands Layer 4

- When user has ≥3 documented rubric criteria in `docs/context/design-system/`, `hd:review` (v1) activates Layer 4 execution
- Starter rubrics ship at v1 in `skills/hd-review/templates/starter-rubrics/` (accessibility, design-system, component-budget)

## See also

- [layer-1-context.md](layer-1-context.md) — where rubric definitions live
- hd-onboard [layer-4-rubrics.md](../../hd-onboard/references/layer-4-rubrics.md) — conceptual version
