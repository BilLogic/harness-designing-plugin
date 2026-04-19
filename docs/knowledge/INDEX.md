# Knowledge layer — `design-harnessing-plugin`

Layer 5 of the five-layer design harness. What we've learned **building this plug-in**. Meta-harness — we dogfood the framework by running it on our own repo.

## Structure

- **[lessons/](lessons/)** — dated narratives of what happened during build (append-only; history is sacred)
- **[changelog.md](changelog.md)** — temporal log of harness-structural changes and rule adoptions (append-only, most recent first)
- **[decisions.md](decisions.md)** — ADR-style procedural record (append-only; supersede, never edit)
- **[preferences.md](preferences.md)** — stable taste calls (mutable with team agreement)
- **[ideations.md](ideations.md)** — open questions / unchosen paths (append-only; cross off when decided)
- **[README.md](README.md)** — memory-type taxonomy explainer (article §2.5)

## Principles

- **History is sacred** — lessons are append-only; don't delete or rewrite
- **Promote sparingly** — not every lesson becomes a rule
- **Date everything** — undated lesson is a rule in disguise

## How a lesson gets here

During build:
1. We hit a friction or make a non-obvious decision
2. Write it up: `lessons/YYYY-MM-DD-<slug>.md` with YAML frontmatter + 5-10 sentences
3. If the pattern repeats 3+ times, propose rule adoption (RFC / PR conversation)
4. On approval: rule lands in [AGENTS.md](../../AGENTS.md) under "Rules"; adoption event logged in [changelog.md](changelog.md); lesson file stays untouched

## Namespace

This plug-in's own knowledge lives here (`docs/knowledge/`). When users scaffold harnesses in their own repos, `/hd:maintain` writes their lessons to their repo's `docs/knowledge/` — never mixed with ours.

Separately: `docs/design-solutions/` is reserved for future distilled pattern-solutions (currently unused) — **not** `docs/solutions/`, which is compound-engineering's namespace.

## Current lessons

See [lessons/](lessons/). 12 lessons span 2026-04-16 → 2026-04-18 covering the Phase 1 → 3j build: plug-in teardown, Anthropic skill-authoring discipline, no-future-version-stubs (adopted as rule), pilot runs across 6 repos, extract-mode regression analysis.

## Related

- **Layer 1 Context** ([../context/](../context/)) — evergreen reference (semantic memory)
- **Layer 5 Knowledge** (this directory) — dated narratives (episodic memory)
- Adopted rules bridge the two: Layer 5 origin, Layer 1 / AGENTS.md destination
