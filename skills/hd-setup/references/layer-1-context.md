# Layer 1 — Context (depth reference)

**Loaded by:** `SKILL.md` Step 4 when scaffolding or critiquing Layer 1. Seed questions + top-level procedure live in SKILL.md; this file provides the per-sub-file detail needed during scaffolding.

**Concept explainer:** [`hd-onboard/references/layer-1-context.md`](../../hd-onboard/references/layer-1-context.md) — "what IS Context?"

## Four sub-files under `docs/context/`

```
docs/context/
├── agent-persona.md          # how AI should behave — voice, defaults, escalation
├── product/
│   └── one-pager.md          # what the product is, for whom, core thesis
├── design-system/
│   └── cheat-sheet.md        # components, tokens, variants, escape-hatch rules
└── conventions/
    └── how-we-work.md        # commits, reviews, naming, file conventions
```

Templates: [`../assets/context-skeleton/`](../assets/context-skeleton/) (one `.template` per sub-file).

## Per-sub-file scaffold detail

### `agent-persona.md`
Ask: voice guidelines? default behavior when unclear — ask / assume reasonable / escalate? Fill placeholders; mark unknowns `{{TODO: …}}`.

### `product/one-pager.md`
Ask: product in one sentence for a new teammate? user in one sentence? core thesis? Keep under 30 lines — this is Tier 1 (every-task) context.

### `design-system/cheat-sheet.md`
Ask: do you have a design system? If yes, point me at it (Figma / tokens package / Storybook); if no, scaffold a starter. Starter has 4 sections: **foundations / styles / components / escape hatches**. Mark starter content `{{TODO}}` — user fills incrementally.

### `conventions/how-we-work.md`
Ask: style guide or "how we work" notes? Include **commits / reviews / naming / file conventions**.

## Tier budget

Tier 1 combined ≤200 lines = `AGENTS.md` + `product/one-pager.md`. After scaffolding, verify:

```bash
wc -l AGENTS.md docs/context/product/one-pager.md | tail -1
```

If over, propose moving non-critical product lines to `docs/context/product/details.md` (Tier 2). Full tier model + rationale: [tier-budget-model.md](tier-budget-model.md).

## Healthy AGENTS.md

Pattern library: [good-agents-md-patterns.md](good-agents-md-patterns.md). Key properties: concise, imperatively-worded, links to context layers, has a "Graduated rules" section for hd:compound writes.

## When existing content is present

Classify-don't-overwrite. Map existing content to Layer 1 sub-paths (rules → AGENTS.md or conventions; product description → product/one-pager; component list → design-system/cheat-sheet). Diff preview before any write (F4 safety in SKILL.md).

## Scenario edge cases

- **S2 single-file AGENTS.md** — classify sections, unpack, never destroy original
- **S3 DESIGN.md pattern** — decompose into `design-system/` sub-structure
- **S6 bloated docs** — Tier 1 budget enforcement; propose tier promotion

## See also

- [tier-budget-model.md](tier-budget-model.md) — three-tier budget model + rationale
- [good-agents-md-patterns.md](good-agents-md-patterns.md) — healthy AGENTS.md shape
- [hd-onboard/references/layer-1-context.md](../../hd-onboard/references/layer-1-context.md) — concept explainer
