# Layer 5 — Knowledge Compounding

**Article source:** §4e.
**Memory type:** episodic ("what happened") + graduated procedural ("what we now always do") — see [memory-taxonomy.md](memory-taxonomy.md).
**Mutability:** append-only for episodic. Procedural additions happen via graduation.

## What belongs here

What the team has learned. Three distinct streams:

1. **Lessons** — dated narratives of what happened. Live in `docs/knowledge/lessons/YYYY-MM-DD-<slug>.md`. **Append-only — history is sacred.**
2. **Decisions** — "we chose X over Y because Z" with rationale. Live in `docs/knowledge/decisions/` (optional subdir if team wants separation).
3. **Graduations** — meta-log of which lessons became rules. Lives in `docs/knowledge/graduations.md`.

## Graduation — the core move

A lesson graduates from *narrative* (lived experience) to *rule* (procedural memory) when:

1. The same situation has shown up **3+ times** across different designers
2. The lesson has a **clean imperative** ("always X unless Y")
3. The team **agrees** (via short RFC, review, or PR conversation)

On graduation:

- The lesson in `docs/knowledge/lessons/` **stays** (don't delete — history is sacred)
- A new rule appears in `AGENTS.md` under "Graduated rules" (or in `docs/context/conventions/`)
- A meta-entry lands in `docs/knowledge/graduations.md` linking lesson → rule + date

This is the compounding move. Without it, lessons accumulate but never change behavior — Layer 5 becomes a read-only archive instead of a running curriculum.

## Why separate from Layer 1 context?

**Context is evergreen reference** ("our design system uses 3 button variants"). **Knowledge is dated narrative** ("on 2026-02-14, we tried a 4th button variant for marketing; reverted after launch"). Different half-lives, different mutability rules.

If you mix them (append lessons into the design-system cheat-sheet), the cheat-sheet bloats with time-bound stories and the signal decays. See [memory-taxonomy.md](memory-taxonomy.md) for the full rationale.

## Our `docs/design-solutions/` namespace

`hd:compound` (v0.5) writes to `docs/design-solutions/` for distilled pattern-solutions — **not** `docs/solutions/` (that's compound-engineering's namespace). Keeps the two plug-ins out of each other's way.

## What does NOT belong here

- **Rules** (without history) — graduated rules belong in AGENTS.md; the Layer 5 trace is the *path* to the rule, not the rule itself
- **Design-system facts** — those are Layer 1 context
- **Workflow definitions** — those are Layer 3 orchestration

## Lesson entry template

A good lesson is short — 5–10 sentences. Structure:

```markdown
---
title: "Short title of the lesson"
date: 2026-04-16
tags: [button, variant, marketing-exception]
graduation_candidate: true
---

# Lesson

**Context:** What was happening?
**Decision / Observation:** What we did or noticed.
**Result:** How it went.
**Graduation-readiness:** Yes / No / too-early-to-tell.
```

## Scaffolded by

`/hd:setup` scaffolds the `docs/knowledge/` tree and seeds one starter lesson. `/hd:compound` (v0.5) captures ongoing lessons and proposes graduations.

## See also

- [memory-taxonomy.md](memory-taxonomy.md) — procedural vs episodic rules
- [layer-1-context.md](layer-1-context.md) — context/knowledge separation
- [concept-overview.md](concept-overview.md) — overall five-layer frame
