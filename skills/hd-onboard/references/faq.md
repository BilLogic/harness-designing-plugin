# FAQ

Ten canonical questions `hd:onboard` should answer cold. Each answer cites at least one article section.

## 1. What's a design harness?

A wrapper of five layers around an AI system — Context (what it knows), Skills (what it can do), Orchestration (how tasks flow), Rubrics (what "good" means), Knowledge (what you've learned). Every design task inherits team thinking instead of starting cold. See article §2.

## 2. How is this different from a style guide?

A style guide is a PDF that goes stale. A harness is running code the AI uses every time. Style guides describe outputs after the fact; harnesses shape the workflow producing those outputs. Style guide answers "what does our button look like?" — harness answers "how does our team decide when to add a button variant, and what happens to that decision six months later?" See article §3.

## 3. How is this different from Every's compound-engineering-plugin?

Same move (codify practice so it compounds), different domain. Compound is engineering — PRs, tests, reviews, worktrees. This plug-in is design — mockups, rubrics, critique, graduation. The two coexist without namespace fights. See [coexistence-with-compound.md](coexistence-with-compound.md) for the isolation rules, and article §3 for the positioning argument.

## 4. Do I need all five layers?

No. Start with Layers 1 and 5 — Context (what the AI knows) + Knowledge (what you've learned). Layers 2, 3, 4 become valuable as the team grows and patterns repeat. `/hd:setup` lets you skip layers explicitly; your skip record lands in `design-harnessing.local.md` so future runs don't re-propose. See article §4a and §4e for the foundational layers.

## 5. Where does the harness live — inside my repo or separately?

Inside your repo. The harness is version-controlled alongside the code and designs it serves. That's the point — when the team evolves, the harness evolves with it, in the same commit, reviewed by the same people. See article §2 for the thesis.

## 6. What if I already have an `AGENTS.md` or `CLAUDE.md`?

`/hd:setup` detects it and classifies the content against the five layers. It proposes an unpacking with a diff preview *before any write* — your original file is never destroyed without explicit approval. See article §4a for how Context Engineering handles existing setups.

## 7. What's a "graduation"?

When a lesson has been useful 3+ times across the team, promote it from narrative (in `docs/knowledge/lessons/`) to rule (in `AGENTS.md` under "Graduated rules"). The original lesson stays — history is sacred. A meta-entry in `docs/knowledge/graduations.md` documents the promotion. See article §4e for the mechanics. In this plug-in, `/hd:compound` proposes graduations; `/hd:graduate` is *not* a separate skill (folded into compound — single verb family).

## 8. Do I need Claude Code, or does this work elsewhere?

v0 is Claude-native but **submits to three marketplaces**: Claude Code, Codex CLI, Cursor. The SKILL.md format is identical across Claude + Codex, so no skill rewrites. Cursor also reads the same format. Windsurf, Continue, and Copilot have architecture mismatches; portable markdown via `AGENTS.md` still works as universal convention. See article §3 for the why.

## 9. Should I use this solo or wait until I have a team?

Solo is fine — Layer 5 graduation machinery can wait. `/hd:setup` has a `solo` prompt answer that defers team-specific patterns. But the compounding value grows with team size; 5–20 person teams are the primary persona. See article §3 for the scaling argument.

## 10. Where does this plug-in come from?

Extracted from plus-uno (Bill's personal working implementation at [github.com/BilLogic/plus-uno](https://github.com/BilLogic/plus-uno)) and structurally mimics [EveryInc/compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin). Companion to a Substack article series making the thesis (§2, §3, §4a-e, §6).

## See also

- [concept-overview.md](concept-overview.md) — the framework in 200 words
- [glossary.md](glossary.md) — term lookups
- [coexistence-with-compound.md](coexistence-with-compound.md) — how this plug-in differs from compound
