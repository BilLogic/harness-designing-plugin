# Layer 4 — Rubrics (depth reference)

**Loaded by:** `SKILL.md` Step 7 when scaffolding or critiquing Layer 4. Seed questions + decision defaults live in SKILL.md; this file provides the distributed-pattern rationale + `INDEX.md` template text + the 12 starter-rubric categories shipped.

**Concept explainer:** [hd-learn `layer-4-rubrics.md`](../../hd-learn/references/layer-4-rubrics.md)

## The distributed-behavior pattern (load-bearing)

Rubrics are **a behavior of the system, not a folder**. They live in three places simultaneously:

- **Design-system SOURCE content** (what "good" looks like) → `docs/context/design-system/foundations/`, `styles/`, `components/` (Layer 1 territory — tokens, color rules, type scale, principles)
- **Rubric CHECK files** (how we verify "good") → `docs/rubrics/<name>.md` (Layer 4 — checks against Layer 1 content)
- **Execution** → `skills/hd-review/` (audit + critique modes run the checks via sub-agents)
- **Enforcement** → `AGENTS.md` quality gates (what must pass before a change ships)

Key distinction: **design-system holds the source-of-truth CONTENT; rubrics hold the CHECKS against that content.** Don't confuse them. A `typography.md` in `design-system/styles/` defines "we use DM Sans at modular scale 1.25"; a `typography.md` in `docs/rubrics/` defines "headings must use the approved type scale."

Per article §4d: centralizing CHECKS + ENFORCEMENT into design-system/ would break the connection between *what good is* (Layer 1 source content) and *how we check for it* (Layer 4 rubrics). `hd:setup` scaffolds `docs/rubrics/INDEX.md` as a **thin pointer file** explaining this distributed pattern — it's navigational.

## Starter rubric library (12 shipped)

Located at [`../../hd-review/assets/starter-rubrics/`](../../hd-review/assets/starter-rubrics/). `hd:setup` Step 7 scaffold copies user-chosen starters into `docs/rubrics/<name>.md` for customization.

| # | File | Applies to | Source |
|---|---|---|---|
| 1 | `accessibility-wcag-aa.md` | design/html/css/components | WCAG 2.1 AA + Fluent 2 + Material 3 a11y |
| 2 | `design-system-compliance.md` | design/css/token-json | token + variant adherence |
| 3 | `component-budget.md` | design/component | new-primitive RFC gate |
| 4 | `skill-quality.md` | SKILL.md files | 9-section Layer 2 skill health check |
| 5 | `interaction-states.md` | design/component | loading/empty/error/success coverage (Material 3 + Fluent 2) |
| 6 | `heuristic-evaluation.md` | design/screen/flow | Nielsen 10 usability heuristics |
| 7 | `typography.md` | design/css | type scale + font pairing + hierarchy + OpenType (Impeccable + Material 3) |
| 8 | `color-and-contrast.md` | design/css/token-json | OKLCH + contrast + tinted neutrals + dark-mode (Impeccable + Material 3 + WCAG) |
| 9 | `spatial-design.md` | design/css/component | spacing scale + proximity + grids + rhythm (Impeccable + Material 3) |
| 10 | `motion-design.md` | design/css/component | reduced-motion + duration + easing + purpose (Impeccable + Material 3) |
| 11 | `ux-writing.md` | design/component | error/empty/success copy + voice + banned phrases (Impeccable + Fluent 2) |
| 12 | `responsive-design.md` | design/css/component | mobile-first + fluid + touch targets + safe area (Impeccable + Material 3) |

Teams extend by authoring more specific rubrics: team-voice, product-specific patterns, i18n, performance-perception, etc. Copy a starter to `docs/rubrics/<name>-<team>.md` and customize.

## `INDEX.md` template written by hd:setup

```markdown
# Rubrics Index

Rubrics are a **behavior of the system**, not a folder. They live distributed:

- **Design-system source content** (what "good" IS) → `docs/context/design-system/` (foundations, styles, components)
- **Rubric check files** (how we verify good) → `docs/rubrics/<name>.md` (this folder)
- **Execution** → `skills/hd-review/` (audit + critique runs checks)
- **Enforcement** → `AGENTS.md` quality gates

See article §4d for the reasoning.

## Active rubrics in this repo

(Start empty or seeded with links to the starter rubrics your team adopted.)

To add: copy a starter from `skills/hd-review/assets/starter-rubrics/` into
`docs/rubrics/<name>.md` and customize. Then add to your `hd-config.md`
under `critique_rubrics:` to make it the default for `hd:review critique <path>`.
```

Source: [`../assets/rubrics-index.md.template`](../assets/rubrics-index.md.template).

## When Layer 4 is scaffolded vs linked vs critiqued

- **Scaffold** (default when nothing detected) — write `docs/rubrics/INDEX.md` + copy user-chosen starter rubrics into `docs/rubrics/<name>.md`. Design-system source content under `docs/context/design-system/` is separate (Part A territory).
- **Link** (default when user points at Figma / existing rubric dir elsewhere) — write pointer files at `docs/rubrics/<name>.md` using pointer-file template
- **Critique + extract** (default when `has_ai_docs: true` AND combined AI-doc size > 200 lines) — invoke `design-harnessing:review:rubric-applicator` in extract mode against existing AI-docs; promote approved candidates to `docs/rubrics/<name>.md`
- **Critique** (when user points at a specific work item) — invoke `design-harnessing:review:rubric-applicator` against that work item with a named rubric

## See also

- [layer-1-context.md](layer-1-context.md) — where design-system SOURCE content lives (distinct from rubric checks)
- [hd-learn/references/layer-4-rubrics.md](../../hd-learn/references/layer-4-rubrics.md) — concept explainer
- [`../../hd-review/assets/starter-rubrics/`](../../hd-review/assets/starter-rubrics/) — 12 starter rubrics shipped
- [`../../hd-review/assets/starter-rubrics/`](../../hd-review/assets/starter-rubrics/) — 5 shipped starters (a11y, design-system, component-budget, interaction-states, skill-quality)
