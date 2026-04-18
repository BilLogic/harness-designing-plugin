# Layer 1 — Context Engineering

**Article source:** §4a.
**Memory type:** semantic ("what we know") — see [memory-taxonomy.md](memory-taxonomy.md).
**Mutability:** curated and revised as the product evolves. Not append-only.

## What belongs here

The stable context the AI needs *before* any specific task starts. Four kinds:

1. **Product** — what the product is, who it's for, the one-sentence thesis. Lives in `docs/context/product/`.
2. **Design system** — components, tokens, variants, escape-hatch rules. Lives in `docs/context/design-system/`.
3. **Conventions** — how your team writes commits, names files, reviews work. Lives in `docs/context/conventions/`.
4. **Agent persona** — how the AI should behave: voice, defaults, how it escalates. Lives in `docs/context/agent-persona.md`.

## Three-tier loading budget

Context has a budget. Not all semantic memory should load every task:

- **Tier 1 (always loaded, ≤200 lines total)** — `AGENTS.md` + `docs/context/product/one-pager.md`. Loaded on every task regardless of topic.
- **Tier 2 (skill-triggered)** — design-system cheat-sheet loads when a design task runs; conventions load when a code task runs.
- **Tier 3 (explicit pull)** — full design-system library, archived decisions, long reference material. Only when a skill or user explicitly asks.

Skipping tier discipline is how Layer 1 goes from 200 lines to 2000 lines and starts crowding out the actual task context.

## What does NOT belong here

- **Decisions / lessons** — those go in Layer 5 ([knowledge](layer-5-knowledge.md)). Layer 1 is evergreen; Layer 5 is dated.
- **Workflows** — those go in Layer 3 ([orchestration](layer-3-orchestration.md)). Layer 1 is the data; Layer 3 is the procedure.
- **Rubrics** — those are distributed across Layer 4. Layer 1 describes what IS; rubrics describe what's GOOD.

## Mutability rules

Layer 1 is mutable — you edit files as the product evolves. But edits should be **deliberate** and **documented in a commit message**. If you find yourself editing a Layer 1 file with the rationale "here's what we learned about X," stop — that's probably a Layer 5 lesson, not a Layer 1 context change.

The safe heuristic: Layer 1 edits should read like "updating the description of what IS." Layer 5 entries should read like "on [date], this happened."

## Scaffolded by

`/hd:setup` — the setup skill scaffolds `docs/context/` with one starter file per subdirectory. For users orienting on the concept first, no scaffolding is required — read the article §4a and decide.

## See also

- [memory-taxonomy.md](memory-taxonomy.md) — why Layer 1 is semantic and not procedural
- [layer-5-knowledge.md](layer-5-knowledge.md) — the lesson/decision counterpart
- [concept-overview.md](concept-overview.md) — overall five-layer frame
