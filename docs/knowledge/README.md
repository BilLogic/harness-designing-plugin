<!-- Tier: 3 (explainer, loaded when a user or agent asks "what IS this folder for") -->
# `docs/knowledge/` — memory layer README

Layer 5 of the five-layer design harness, applied to THIS plug-in (dogfood meta-harness). Organized by memory type — each file plays a specific role.

## Memory types used here

Anchored on the article §2.5 canonical-4 frame (procedural / semantic / episodic / working). Derivative subtype names on the right are the operational role labels used in frontmatter.

| File | Canonical type (§2.5) | Derivative subtype | What it captures | Mutability |
|------|------------------------|--------------------|------------------|------------|
| `lessons/<slug>.md` | **episodic** | — | Dated narratives of what happened during specific work | Append-only; history is sacred (article §4e) |
| `decisions.md` | **procedural** | procedural-chosen | ADR-style: "we chose X over Y because Z" | Append-only; supersede with new entries, never edit old |
| `preferences.md` | **semantic** | semantic-taste | Stable taste calls the team holds | Mutable with team agreement |
| `ideations.md` | **semantic** (not-yet-committed) | speculative | Open questions, unchosen paths, ideas we might revisit | Append-only; cross off when decided |
| `changelog.md` | **episodic** (time-ordered) | temporal + meta-log | When harness-structural changes happened; which lessons promoted into AGENTS.md rules | Append-only |

Working memory (§2.5's fourth canonical type) is intentionally absent here — it's ephemeral session scratch, not something a harness persists.

Article §2.5 is the primary vocabulary; the derivative subtypes are operational refinements for this folder, not peers of the canonical 4.

## Why separate files?

Each memory type has a different *lifecycle*:

- Episodic lessons decay in relevance with time but NEVER delete (history is sacred)
- Decisions supersede but don't edit (ADR discipline)
- Preferences are the only mutable file — taste changes, we update
- Ideations cross off as ideas either graduate or get rejected
- Changelog is strictly temporal — structural changes + rule adoptions in time order

Mixing them in one big `lessons.md` collapses the lifecycles — you can't tell what to append to, what to revise, what to delete.

## How `/hd:maintain` interacts

- **`/hd:maintain capture`** appends to the right file based on content type (lesson / decision / preference / ideation).
- **`/hd:maintain rule-propose <topic>`** reads `lessons/` files; proposes rule adoption when ≥ 3 same-topic episodes with a clean imperative.
- **`/hd:maintain rule-apply --plan-hash <sha>`** writes the rule to `AGENTS.md` § Rules and appends a meta-entry to `changelog.md`. Source lessons are never touched.

## Article cross-references

- **§4e** — Knowledge Compounding (this layer's chapter)
- **§2.5** — Memory taxonomy (why these specific types)
