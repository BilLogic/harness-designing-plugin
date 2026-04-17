# Knowledge layer — `design-harnessing-plugin`

Layer 5 of the five-layer design harness. What we've learned **building this plug-in**. Meta-harness — we dogfood the framework by running it on our own repo.

## Structure

- **[lessons/](lessons/)** — dated narratives of what happened during build (append-only; history is sacred)
- **[graduations.md](graduations.md)** — meta-log of lesson → rule promotions (one per graduation, dated, linked)

## Principles

- **History is sacred** — lessons are append-only; don't delete or rewrite
- **Graduate sparingly** — not every lesson becomes a rule
- **Date everything** — undated lesson is a rule in disguise

## How a lesson gets here

During build:
1. We hit a friction or make a non-obvious decision
2. Write it up: `lessons/YYYY-MM-DD-<slug>.md` with YAML frontmatter + 5-10 sentences
3. If the pattern repeats 3+ times, propose graduation (RFC / PR conversation)
4. On approval: rule lands in [AGENTS.md](../../AGENTS.md) under "Graduated rules"; meta-entry in [graduations.md](graduations.md); lesson file stays untouched

## Namespace

This plug-in's own knowledge lives here (`docs/knowledge/`). When users scaffold harnesses in their own repos, `/hd:compound` writes their lessons to their repo's `docs/knowledge/` — never mixed with ours.

Separately: `docs/design-solutions/` is reserved for future distilled pattern-solutions (currently unused) — **not** `docs/solutions/`, which is compound-engineering's namespace.

## Current lessons

See [lessons/](lessons/). v0.MVP seeds 3 real lessons from the build session:

1. `2026-04-16-every-plugin-teardown.md` — reading compound's cache as the canonical skill-authoring reference
2. `2026-04-16-anthropic-skill-guide-takeaways.md` — Anthropic best-practices distilled into authoring discipline
3. `2026-04-16-no-future-version-stubs.md` — graduated to rule (see [graduations.md](graduations.md))

## Related

- **Layer 1 Context** ([../context/](../context/)) — evergreen reference (semantic memory)
- **Layer 5 Knowledge** (this directory) — dated narratives (episodic memory)
- Graduated rules bridge the two: Layer 5 origin, Layer 1 / AGENTS.md destination
