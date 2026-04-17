# Layer 3 — Workflow Orchestration

**Article source:** §4c.
**Memory type:** procedural ("how we work") — see [memory-taxonomy.md](memory-taxonomy.md).
**Mutability:** versioned; workflows evolve as the team learns.

## What belongs here

How skills compose into real work. A **workflow** is a named sequence of skills + handoffs + quality gates that accomplishes something end-to-end.

## Examples of workflows

- **New feature flow** — research (find precedent) → spec (write PRD) → critique (rubric check) → compound (capture lessons on ship)
- **Design review flow** — spec → review → iterate → approve → handoff
- **Design system update flow** — audit → propose → review → promote to library → graduate lesson

## Handoffs

The connector between skills. Handoffs live either in:

- **`.agent/handoffs/`** (working memory; gitignored by default) — ephemeral mid-workflow state
- **`docs/orchestration/handoffs/`** (archived) — when a workflow finishes and its handoffs have retrospective value

## Gates

Quality checks between skills. Usually pull from Layer 4 rubrics. Example: "design-system compliance check must pass before `/hd:critique` marks work approved."

## Prerequisites

Layer 3 requires at least one Layer 2 skill to orchestrate. `hd:setup` blocks Layer 3 scaffolding if Layer 2 is empty — no point sequencing zero skills.

## What does NOT belong here

- **Single-skill procedures** — those are in the skill's own `workflows/` subdir, not Layer 3
- **The skill definitions themselves** — those are Layer 2
- **Why we chose this workflow** — that's a Layer 5 lesson

## When a team needs Layer 3

- Fewer than 3 skills: probably not needed. Each skill runs standalone.
- 3+ skills and designers invoke them in predictable sequences: Layer 3 is earning its weight.
- Cross-functional handoffs (designer ↔ engineer, designer ↔ PM): Layer 3 is essential.

## Scaffolded by

`/hd:setup` v0.5+ will scaffold Layer 3 once the user's Layer 2 has ≥1 real skill. v0.MVP does not.

## See also

- [concept-overview.md](concept-overview.md) — five-layer frame
- [layer-2-skills.md](layer-2-skills.md) — prerequisite layer
- [memory-taxonomy.md](memory-taxonomy.md) — why workflows are procedural
