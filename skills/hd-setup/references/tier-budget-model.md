# Tier budget model

**Purpose:** the three-tier context loading model `hd:setup` enforces during scaffolding and audit. Shared across all layer scaffolding decisions.

## The three tiers

| Tier | Loaded | Budget | What's here |
|---|---|---|---|
| **Tier 1** | Always — every task, regardless of topic | **≤200 lines total** | Core `AGENTS.md` + `docs/context/product/one-pager.md` |
| **Tier 2** | Skill-triggered — when a matching task runs | No hard line limit | `docs/context/design-system/*.md`, `docs/context/conventions/*.md`, agent-persona.md |
| **Tier 3** | Explicit pull — user or skill asks by path | No limit | Full design-system libraries, archives, historical decisions |

## Why Tier 1 has a hard budget

Tier 1 loads on every task. Every token in Tier 1 is a token NOT available for the task itself. The 200-line ceiling is arbitrary but calibrated:

- <100 lines: too sparse; AI lacks context to avoid common mistakes
- 100-200 lines: ideal — enough to orient, not enough to crowd out task context
- 200-400 lines: context bloat; task quality degrades
- \>400 lines: AI starts ignoring sections; might as well not have them

## Enforcement at scaffold time

After `hd:setup` writes Tier 1 files, it runs:

```bash
wc -l AGENTS.md docs/context/product/one-pager.md 2>/dev/null | tail -1
```

If total >200, surface the budget violation and propose tier promotion:

- Move non-critical product description lines from `one-pager.md` to `docs/context/product/details.md` (Tier 2)
- Split oversized AGENTS.md sections into `docs/context/conventions/*.md` files (Tier 2)

## Enforcement at audit time (v1 `hd:review`)

`hd:review` checks Tier 1 budget during audit. Flags it as a drift signal — teams often add to AGENTS.md over time without noticing budget creep.

## Tier 2 triggering — how it works

Tier 2 files don't load automatically. They load when:

- A skill's `references/` link points at them (for example, `hd-setup/references/layer-1-context.md` → `docs/context/design-system/cheat-sheet.md`)
- User explicitly references them in a question
- A workflow gate pulls them as a quality check input

## Tier 3 — opt-in only

Tier 3 files are essentially **reference archives**. Not loaded unless:

- User asks by exact path: "read `docs/context/design-system/archive/button-history.md`"
- A skill explicitly pulls them (for example, a custom skill that archaeology-checks past decisions)

Tier 3 is where long-form design-system docs, accessibility appendices, and decision archives live. They have value but would destroy the context budget if loaded by default.

## Common violations + fixes

| Violation | Fix |
|---|---|
| AGENTS.md has 500 lines | Split rules into `docs/context/conventions/*.md` (Tier 2); keep AGENTS.md <150 lines |
| Product one-pager is 300 lines | Move details to `docs/context/product/details.md`; keep one-pager <30 lines |
| Design-system cheat-sheet is 2000 lines | Most of it is Tier 3 reference material; cheat-sheet should be <200 lines with links into the archive |
| Graduations.md growing unboundedly | Lessons in `docs/knowledge/lessons/` stay Tier 3; graduations.md just lists pointers |

## See also

- [layer-1-context.md](layer-1-context.md) — primary layer enforcing this budget
- [good-agents-md-patterns.md](good-agents-md-patterns.md) — healthy AGENTS.md shape
- Article §4a — Context Engineering
