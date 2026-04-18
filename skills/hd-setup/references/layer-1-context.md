# Layer 1 — Context (depth reference)

**Loaded by:** `SKILL.md` Step 4 when scaffolding or critiquing Layer 1. Seed questions + top-level procedure live in SKILL.md; this file provides the per-sub-file detail needed during scaffolding.

**Concept explainer:** [`hd-learn/references/layer-1-context.md`](../../hd-learn/references/layer-1-context.md) — "what IS Context?"

## Baseline shape under `docs/context/` (plus-uno-derived)

```
docs/context/
├── product/                    # What the product IS
│   ├── app.md                  # elevator pitch + core thesis + current stage
│   ├── features.md             # 3–5 features, one paragraph each
│   ├── flows.md                # end-to-end user flows
│   ├── users.md                # 1–3 personas (goals, constraints, success signal)
│   └── pillars.md              # 3–5 non-negotiable principles
├── conventions/                # How work happens
│   ├── coding.md               # language, tooling, patterns, anti-patterns
│   ├── integrations.md         # external services + env vars + failure behavior
│   ├── tech-stack.md           # one-line inventory
│   └── terminology.md          # team's vocabulary
└── design-system/              # What "good design" looks like, structurally
    ├── foundations/            # non-negotiable baselines
    │   ├── accessibility.md    # WCAG target + non-negotiables + tooling
    │   ├── content-voice.md    # voice attributes + tone spectrum + banned phrases
    │   ├── layout.md           # grid, breakpoints, page patterns
    │   ├── principles.md       # philosophical commitments
    │   └── tokens.md           # authoritative token source + governance
    ├── styles/                 # look + feel per category
    │   ├── color.md
    │   ├── elevation.md        # shadows + radius scales
    │   ├── iconography.md
    │   ├── spacing.md
    │   └── typography.md
    ├── components/             # primitives + patterns inventory
    │   ├── cheat-sheet.md      # "which component for this use case"
    │   ├── components-index.json
    │   ├── inventory.md        # complete list with paths + status
    │   ├── layout-cheat-sheet.md
    │   └── patterns.md         # composition patterns + anti-patterns
    └── index-manifest.json     # federated index pointing at token/patterns/etc JSON indexes
```

Templates for all 21 files: [`../assets/context-skeleton/`](../assets/context-skeleton/). Each is a thin `.template` with `{{PLACEHOLDER}}` prompts guiding the user to fill with their actual content.

**Design principle:** this baseline reproduces the shape Bill uses in plus-uno — the reference implementation. The foundations / styles / components triad under design-system mirrors how mature design systems (Material 3, Ant Design, Atlassian, Fluent 2) organize. Starting with this shape means less re-structuring later as the design system matures.

## Escape hatch — "simple mode"

Some users don't need the full plus-uno baseline — they want a lightweight scaffold. At Step 4, if user indicates "simple / minimal / just the basics," offer a reduced set:

- `product/app.md` (elevator pitch only)
- `conventions/tech-stack.md` (tech inventory only)
- `design-system/foundations/tokens.md` + `design-system/components/cheat-sheet.md` (no foundations/styles subfolders)

User can graduate to full baseline later by re-running `/hd:setup` and picking "full scaffold".

## Tier budget

Tier 1 combined ≤ 200 lines = `AGENTS.md` + `docs/context/product/app.md`. After scaffolding, verify:

```bash
wc -l AGENTS.md docs/context/product/app.md | tail -1
```

If over, propose moving non-critical product lines to `features.md` / `flows.md` / `pillars.md` — those sibling files ARE Tier 2 and don't count against the budget. Full tier model + rationale: [tier-budget-model.md](tier-budget-model.md).

## Healthy AGENTS.md

Pattern library: [good-agents-md-patterns.md](good-agents-md-patterns.md). Key properties: concise, imperatively-worded, links to context layers, has a "Graduated rules" section for hd:maintain writes.

## When existing content is present

Classify-don't-overwrite. Map existing content to the baseline sub-paths:

- Rules → AGENTS.md root (imperatives) or `conventions/coding.md`
- Product description → `product/app.md` + `product/features.md`
- User personas → `product/users.md`
- Design system cheat-sheet → split across `design-system/foundations/`, `styles/`, `components/`
- Tech stack list → `conventions/tech-stack.md`

Diff preview before any write (F4 safety in SKILL.md). If source content is in another tool (Notion / Figma), Step 4 prefers **link mode** with extract+pointer (per `assets/pointer-file.md.template`) over scaffold-duplicate.

## Scenario edge cases

- **S2 single-file AGENTS.md** — classify sections into the baseline tree; never destroy original
- **S3 DESIGN.md pattern** — decompose into `design-system/foundations/` + `styles/` + `components/`
- **S6 bloated docs** — enforce Tier 1 budget; non-Tier-1 content moves to sibling files in same subdir

## See also

- [tier-budget-model.md](tier-budget-model.md) — three-tier budget model + rationale
- [good-agents-md-patterns.md](good-agents-md-patterns.md) — healthy AGENTS.md shape
- [hd-learn/references/layer-1-context.md](../../hd-learn/references/layer-1-context.md) — concept explainer
- Plus-uno reference implementation: [github.com/BilLogic/plus-uno/tree/main/docs/context](https://github.com/BilLogic/plus-uno/tree/main/docs/context)
