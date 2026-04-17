# Memory taxonomy

**Distilled from:** Substack article §2.5.

Four kinds of memory, each mapping to a different part of the harness. Collapsing them is the single most common mistake — it's the reason so many AI-context setups rot after a few months.

## The four memory types

| Type | What it is | Example | Where it lives | Mutability |
|---|---|---|---|---|
| **Procedural** | How we work | "Always ask before changing the shared button component." | `AGENTS.md` + Layer 3 orchestration + graduated rules from Layer 5 | Curated; edits overwrite prior versions |
| **Semantic** | What we know | "Our design system uses 3 button variants: primary / secondary / ghost." | Layer 1 context — `docs/context/design-system/` etc. | Mutable, revised with the product |
| **Episodic** | What happened | "On 2026-02-14, we tried a 4th variant for marketing. Reverted after launch." | Layer 5 knowledge — `docs/knowledge/lessons/YYYY-MM-DD-*.md` | **Append-only — history is sacred** |
| **Working** | Right now | Current conversation turn; mid-task handoffs. | Context window + (optional) `.agent/handoffs/` | Ephemeral |

## Why collapsing context and knowledge is the trap

Context (Layer 1) is evergreen reference: "we have 3 button variants." Knowledge (Layer 5) is dated narrative: "on 2026-02-14, we tried a 4th variant and reverted." The first is updated as the product changes. The second is *added to* but never rewritten — the 4th-variant attempt happened; erasing the lesson destroys the signal.

When teams mix them (for example, appending "LESSON: don't add a 4th variant" into the design-system cheat-sheet), two things break:

1. The cheat-sheet gets cluttered with time-bound stories that were relevant once. Signal-to-noise decays.
2. Later, when someone proposes an escape-hatch variant for a new reason, there's no clean way to say "we've considered this 3 times; each time reverted." The lesson is fused with the rule and can't be examined independently.

**Rule of thumb:** if a sentence starts with a date, it's episodic. If it's evergreen, it's semantic. Different files.

## Why procedural and semantic are kept separate

Procedural memory is *how* we work — it's rules, commitments, promises. Semantic is *what* we know — facts, reference material. Mixing them means every AGENTS.md edit has to decide "is this a rule or a fact?" That decision is tedious and gets wrong. Splitting them means AGENTS.md stays small (Tier 1 budget ≤200 lines) and Layer 1 context can grow richer.

## How the four types interact during a task

A typical design task reads from all four:

1. **Procedural** (AGENTS.md) is always loaded — how we work is never optional.
2. **Semantic** (Layer 1) loads per-task — design-system cheat-sheet only loads when the task touches design.
3. **Episodic** (Layer 5) loads on demand — the agent reads relevant past lessons only when the task resembles a past situation.
4. **Working** — the current conversation.

When a task finishes, any genuine learning becomes a new **episodic** entry. If that learning recurs 3+ times across the team, it graduates to **procedural** (added to AGENTS.md) — and the original episodic narrative stays put.

## See also

- [layer-1-context.md](layer-1-context.md) — Context layer (semantic memory home)
- [layer-5-knowledge.md](layer-5-knowledge.md) — Knowledge layer (episodic memory home)
- [concept-overview.md](concept-overview.md) — overall five-layer frame
