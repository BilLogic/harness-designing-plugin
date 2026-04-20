# Layer 4 — Rubrics (depth reference)

**Loaded by:** `SKILL.md` Step 7 when setting up or reviewing Layer 4. Seed questions + decision defaults live in SKILL.md; this file provides the distributed-pattern rationale + `INDEX.md` template text + the 12 starter-rubric categories shipped.

**Concept explainer:** [hd-learn `layer-4-rubrics.md`](../../hd-learn/references/layer-4-rubrics.md)

## The distributed-behavior pattern (load-bearing)

Rubrics are **a behavior of the system, not a folder**. They live in three places simultaneously:

- **Design-system SOURCE content** (what "good" looks like) → `docs/context/design-system/foundations/`, `styles/`, `components/` (Layer 1 territory — tokens, color rules, type scale, principles)
- **Rubric CHECK files** (how we verify "good") → `docs/rubrics/<name>.md` (Layer 4 — checks against Layer 1 content)
- **Execution** → `skills/hd-review/` (review + review modes run the checks via sub-agents)
- **Enforcement** → `AGENTS.md` quality gates (what must pass before a change ships)

Key distinction: **design-system holds the source-of-truth CONTENT; rubrics hold the CHECKS against that content.** Don't confuse them. A `typography.md` in `design-system/styles/` defines "we use DM Sans at modular scale 1.25"; a `typography.md` in `docs/rubrics/` defines "headings must use the approved type scale."

Per article §4d: centralizing CHECKS + ENFORCEMENT into design-system/ would break the connection between *what good is* (Layer 1 source content) and *how we check for it* (Layer 4 rubrics). `hd:setup` creates `docs/rubrics/INDEX.md` as a **thin pointer file** explaining this distributed pattern — it's navigational.

## Starter rubric library (12 shipped)

Located at [`../../hd-review/assets/starter-rubrics/`](../../hd-review/assets/starter-rubrics/). `hd:setup` Step 7 create action copies user-chosen starters into `docs/rubrics/<name>.md` for customization.

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
- **Execution** → `skills/hd-review/` (review + review runs checks)
- **Enforcement** → `AGENTS.md` quality gates

See article §4d for the reasoning.

## Active rubrics in this repo

(Start empty or seeded with links to the starter rubrics your team adopted.)

To add: copy a starter from `skills/hd-review/assets/starter-rubrics/` into
`docs/rubrics/<name>.md` and customize. Then add to your `hd-config.md`
under `critique_rubrics:` to make it the default for `hd:review review <path>`.
```

Source: [`../assets/rubrics-index.md.template`](../assets/rubrics-index.md.template).

## When Layer 4 is created vs scaffolded vs reviewed

- **Create** (default when nothing detected) — write `docs/rubrics/INDEX.md` + copy user-chosen starter rubrics into `docs/rubrics/<name>.md`. Design-system source content under `docs/context/design-system/` is separate (Part A territory).
- **Scaffold** (default when user points at Figma / existing rubric dir elsewhere) — write pointer files at `docs/rubrics/<name>.md` using pointer-file template
- **Review + extract** (default when `has_ai_docs: true` AND combined AI-doc size > 200 lines) — invoke `design-harnessing:review:rubric-extractor` against existing AI-docs; promote approved candidates to `docs/rubrics/<name>.md`
- **Review** (when user points at a specific work item) — hand off to `/hd:review review <path>`, which dispatches `design-harnessing:review:rubric-applier`. `/hd:setup` itself only does extract-mode.

## Procedure — Step 7

**Frame:** "Layer 4 — Rubrics. Taste embedded as checks. Distributed pattern (article §4d)."

**Show:** `has_tokens_package` + `tokens_package_paths`, `has_figma_config`, `a11y_framework_in_use` + `detected_a11y_packages`, existing `docs/rubrics/` or `docs/context/design-system/` rubric files, combined size of existing AI-docs (AGENTS.md + CLAUDE.md + `.cursor/rules/` + `.github/copilot-instructions.md` + DESIGN.md).

**Rationale injection:** when `a11y_framework_in_use: true`, elevate the `accessibility-wcag-aa` rubric in recommendations with the framework name — e.g., *"accessibility-wcag-aa is especially relevant because your repo already uses `<detected_a11y_packages>`; the rubric grounds the a11y investment in explicit checks."*

**Propose default** (checked in order; first match wins):

| Condition | Default |
|---|---|
| 1. `has_ai_docs: true` AND combined existing AI-doc size > 200 lines | **review + extract** (surface implicit rubrics from existing docs; do NOT duplicate as fresh starters) |
| 2. `has_tokens_package` or `has_figma_config` | **create** design-system-compliance rubric referencing actual token paths |
| 3. `has_external_skills: true` | **create** skill-quality rubric entry |
| 4. Nothing detected | **create** starter trio (accessibility-wcag-aa + design-system-compliance + component-budget) |

Condition 1 mirrors Layer 1's scaffold-default logic: respect what already exists. A repo with 16 KB of Copilot instructions has implicit rubric content already; duplicating as fresh starters adds noise.

**Execute — review + extract** (condition 1):
1. Invoke the rubric-extractor sub-agent against each existing AI-doc (batch-parallel ≤5; serial at 6+ per compound v2.39.0): find rule-like statements that could become explicit rubric criteria.
   ```
   Task design-harnessing:review:rubric-extractor(
     source_path: ".github/copilot-instructions.md",
     mode: "extract"
   )
   ```
2. Present extracted candidates to user as a list: *"I see 5 implicit rubrics in your copilot-instructions.md: (a) approved color tokens, (b) React Aria for a11y, (c) component-budget gate for new primitives, (d) storybook-first pattern, (e) no-hex-codes. Want to promote any to explicit rubric files under `docs/rubrics/`?"*
3. For each candidate the user approves: copy the matching starter rubric from [`../../hd-review/assets/starter-rubrics/`](../../hd-review/assets/starter-rubrics/) to `docs/rubrics/<name>.md`, pre-fill with the extracted content, show the user the result, atomic write on confirmation.
4. For candidates the user rejects: record in `hd-config.md` prose section as "surfaced but declined" so re-runs don't re-propose.
5. Never modify the source AI-doc file. Extraction is read-only on the source.

**Execute — create** (conditions 2/3/4):
- Use the "distributed-behavior pattern" + "starter rubric library" sections above for L4 depth (distributed-behavior rationale, 12-starter enumeration, INDEX.md pattern)
- Seed questions (open-ended first): (1) first thing you check when reviewing? (2) mistake seen twice? (3) one bar new designer should clear?
- If "no clear criteria yet" → offer the 12 starter rubrics at [`../../hd-review/assets/starter-rubrics/`](../../hd-review/assets/starter-rubrics/) (distilled from Impeccable + Nielsen + Material 3 + Fluent 2) + fallback baselines
- Write `docs/rubrics/INDEX.md` from [`../assets/rubrics-index.md.template`](../assets/rubrics-index.md.template)
- Copy user-selected starter rubrics into `docs/rubrics/<name>.md` (NOT `docs/context/design-system/` — that's Layer 1 source content; rubrics are checks against it)

**Execute — review** (targeted, when user explicitly points at a work item): hand off to `/hd:review review <path>`. That command dispatches `design-harnessing:review:rubric-applier`. `/hd:setup` itself does not run apply-mode.

→ Return to [../SKILL.md § Step 7 — Layer 4 (Rubrics)](../SKILL.md#step-7--layer-4-rubrics)

## See also

- [layer-1-context.md](layer-1-context.md) — where design-system SOURCE content lives (distinct from rubric checks)
- [hd-learn/references/layer-4-rubrics.md](../../hd-learn/references/layer-4-rubrics.md) — concept explainer
- [`../../hd-review/assets/starter-rubrics/`](../../hd-review/assets/starter-rubrics/) — 12 starter rubrics shipped
- [`../../hd-review/assets/starter-rubrics/`](../../hd-review/assets/starter-rubrics/) — 5 shipped starters (a11y, design-system, component-budget, interaction-states, skill-quality)
