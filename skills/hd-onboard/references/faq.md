# FAQ

Ten canonical questions `hd:onboard` should answer cold. Each answer cites at least one article section.

## 1. What's a design harness?

A wrapper of five layers around an AI system — Context (what it knows), Skills (what it can do), Orchestration (how tasks flow), Rubrics (what "good" means), Knowledge (what you've learned). Every design task inherits team thinking instead of starting cold. See article §2.

## 2. How is this different from a style guide?

A style guide is a PDF that goes stale. A harness is running code the AI uses every time. Style guides describe outputs after the fact; harnesses shape the workflow producing those outputs. Style guide answers "what does our button look like?" — harness answers "how does our team decide when to add a button variant, and what happens to that decision six months later?" See article §3.

## 3. How is this different from Every's compound-engineering-plugin?

Same move (codify practice so it compounds), different domain. Compound is engineering — PRs, tests, reviews, worktrees. This plug-in is design — mockups, rubrics, critique, graduation. The two coexist without namespace fights. See [coexistence-with-compound.md](coexistence-with-compound.md) for the isolation rules, and article §3 for the positioning argument.

## 4. Do I need all five layers?

No. Start with Layers 1 and 5 — Context (what the AI knows) + Knowledge (what you've learned). Layers 2, 3, 4 become valuable as the team grows and patterns repeat. `/hd:setup` lets you skip layers explicitly; your skip record lands in `hd-config.md` so future runs don't re-propose. See article §4a and §4e for the foundational layers.

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

## 11. Why five layers specifically? Why not 3 or 7?

Each layer maps to a distinct memory/cognition mechanism, and collapsing or splitting loses mechanism coverage. Concretely:

- **L1 Context** = *semantic memory* (what's always true about the product)
- **L2 Skills** = *procedural memory* (how to do repeated tasks)
- **L3 Orchestration** = *procedural memory of procedures* (when to invoke which skill)
- **L4 Rubrics** = *semantic checks* (how to judge quality)
- **L5 Knowledge** = *episodic + temporal memory* (what happened, when, with consequences)

Collapsing L1+L2 loses the noun/verb distinction. Collapsing L4+L1 loses the checks-vs-source-content separation (a bug we fixed in Phase 3d). Splitting L5 into episodic-vs-temporal-vs-speculative proved too granular in practice — the 5 memory types live *inside* L5, not as separate layers. See article § layer-overview.

## 12. I already have CLAUDE.md or .agent/ — do I still need this?

Yes, but additive-only. As of graduated rule 2026-04-18, `/hd:setup` defaults to **skip L1/L2/L3, scaffold L4/L5 only** when `.agent/` or `.claude/` with content is detected. Existing harness is respected as Layer 1+2 authority; hd-* adds rubric checks (L4) + episodic knowledge capture (L5) on top. Zero modifications to pre-existing files (6/6 pilots confirmed). See `AGENTS.md § Graduated rules` for the rule.

## 13. How do I customize the starter rubrics for my team?

Three paths, depending on how different your needs are:

1. **Copy-and-edit:** `cp skills/hd-review/assets/starter-rubrics/<name>.md docs/rubrics/<name>.md`, then edit severities, examples, criteria to match your team. Change the `source:` field to `source: "starter + <team-name> customizations"`.
2. **Extend in place:** add criteria to an existing rubric under an `## Extension: <team-name>` section. Keep the starter criteria untouched.
3. **New rubric:** author from scratch following `skills/hd-review/assets/starter-rubrics/skill-quality.md § Extending this rubric`. Must cite a `source:` derivation (pattern we adopted from the 12-starter library).

All three paths coexist. `/hd:review critique <rubric-name>` uses your customized version in `docs/rubrics/` over the shipped starter.

## See also

- [concept-overview.md](concept-overview.md) — the framework in 200 words
- [glossary.md](glossary.md) — term lookups
- [coexistence-with-compound.md](coexistence-with-compound.md) — how this plug-in differs from compound
