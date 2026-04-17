# Layer 1 — Context Engineering (setup guide)

**Purpose:** action-oriented guide for scaffolding or auditing Layer 1 in a user's repo.
**Concept explainer:** see [hd-onboard `layer-1-context.md`](../../hd-onboard/references/layer-1-context.md) if the user asks "what IS Context?"

## What to scaffold

Four sub-paths under `docs/context/`:

```
docs/context/
├── agent-persona.md                    # how AI should behave — voice, defaults, escalation
├── product/
│   └── one-pager.md                    # what the product is, for whom, core thesis
├── design-system/
│   └── cheat-sheet.md                  # components, tokens, variants, escape-hatch rules
└── conventions/
    └── how-we-work.md                  # commits, reviews, naming, file conventions
```

Templates for each live in `skills/hd-setup/templates/context-skeleton/`.

## Three-tier loading — enforce at scaffold time

- **Tier 1 (always loaded, ≤200 lines combined)** — `AGENTS.md` + `docs/context/product/one-pager.md`. Every task sees this.
- **Tier 2 (skill-triggered)** — `docs/context/design-system/cheat-sheet.md` + `docs/context/conventions/how-we-work.md`.
- **Tier 3 (explicit pull)** — full design-system library, archived decisions (not scaffolded by v0.MVP; user adds as needed).

**Check Tier 1 budget at scaffold time:** after writing, run `wc -l AGENTS.md docs/context/product/one-pager.md | tail -1` and confirm total ≤200. If over, propose moving non-critical product lines to Tier 2 (`docs/context/product/details.md`).

## Scaffolding steps per sub-file

1. **`agent-persona.md`** — ask user: "Any voice guidelines? Defaults when unclear — ask / assume reasonable / escalate?" Fill placeholders; mark unknowns `{{TODO: ...}}`.
2. **`product/one-pager.md`** — ask user: "Product in one sentence? Who's it for?" Keep under 30 lines.
3. **`design-system/cheat-sheet.md`** — ask user: "Do you have a design system? If yes, point me at it; if no, scaffold a starter." Starter has 4 sections (foundations, styles, components, escape hatches). Mark starter sections `{{TODO}}`.
4. **`conventions/how-we-work.md`** — ask user: "Any style guide or 'how we work' notes?" Include commits, reviews, naming.

## Existing content — preserve + classify

If user already has `AGENTS.md` or similar at repo root, **do not overwrite**. Instead:

1. Read existing file.
2. Classify content against Layer 1 sub-paths (rules → Layer 1 conventions or AGENTS.md rules; product description → product/one-pager; component list → design-system/cheat-sheet).
3. Show diff preview before any write (see `workflows/scattered.md`).

## Edge cases from scenario matrix

- **S2 Single-file setup** — classify and unpack, never destroy original
- **S3 DESIGN.md style** — decompose into `design-system/` structure
- **S6 Bloated docs** — enforce Tier 1 budget; propose tier promotion

## See also

- [tier-budget-model.md](tier-budget-model.md) — budget details
- [good-agents-md-patterns.md](good-agents-md-patterns.md) — what a healthy AGENTS.md looks like
- hd-onboard [layer-1-context.md](../../hd-onboard/references/layer-1-context.md) — conceptual explainer
