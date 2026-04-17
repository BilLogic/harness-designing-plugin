# Layer 4 — Rubrics (depth reference)

**Loaded by:** `SKILL.md` Step 7 when scaffolding or critiquing Layer 4. Seed questions + decision defaults live in SKILL.md; this file provides the distributed-pattern rationale + `INDEX.md` template text + the five starter-rubric categories shipped.

**Concept explainer:** [hd-onboard `layer-4-rubrics.md`](../../hd-onboard/references/layer-4-rubrics.md)

## The distributed-behavior pattern (load-bearing)

Rubrics are **a behavior of the system, not a folder**. They live in three places simultaneously:

- **Definitions** → `docs/context/design-system/` (Layer 1 territory — what "good" looks like)
- **Execution** → `skills/hd-review/` (audit + critique modes run the checks)
- **Enforcement** → `AGENTS.md` quality gates (what must pass before a change ships)

Per article §4d: centralizing all three in one `rubrics/` folder breaks the connection between *what good is* (Layer 1) and *how we check for it* (Layer 2/3). Rubrics are the *integration*, not a storage location. `hd:setup` scaffolds `docs/rubrics/INDEX.md` as a **thin pointer file** explaining this — it's navigational, not prescriptive.

## Starter rubric categories (5 shipped)

Located at [`../../hd-review/assets/starter-rubrics/`](../../hd-review/assets/starter-rubrics/):

1. **accessibility-wcag-aa** — WCAG 2.1 AA contrast, tap targets ≥44pt, keyboard navigation, focus states
2. **design-system-compliance** — only approved tokens; variants within allowed set; tokens referenced not duplicated
3. **component-budget** — no new primitive components without RFC; component-density limits
4. **interaction-states** — loading / empty / error / success state coverage (Material 3 + Fluent 2 baselines)
5. **skill-quality** — 9-section rubric for auditing a SKILL.md file (applied by `design-harnessing:review:skill-quality-auditor` sub-agent)

Teams extend by authoring more: copy-voice, motion, mobile-first, information-architecture, etc.

## `INDEX.md` template written by hd:setup

```markdown
# Rubrics Index

Rubrics are a **behavior of the system**, not a folder. They live distributed:

- **Definitions** → `docs/context/design-system/` (what "good" looks like)
- **Execution** → `skills/hd-review/` (audit + critique runs checks)
- **Enforcement** → `AGENTS.md` quality gates

See article §4d for the reasoning.

## Active rubrics

(Start empty or seeded with links to the starter rubrics your team adopted.)

To add: copy a starter from `skills/hd-review/assets/starter-rubrics/` into
`docs/context/design-system/<rubric>.md` and customize. Then add to your
`design-harnessing.local.md` under `critique_rubrics:` to make it the
default for `hd:review critique <path>`.
```

Source: [`../assets/rubrics-index.md.template`](../assets/rubrics-index.md.template).

## When Layer 4 is scaffolded vs linked

- **Scaffold** (default when nothing detected) — write `docs/rubrics/INDEX.md` + copy user-chosen starter rubrics into `docs/context/design-system/`
- **Link** (default when user points at Figma / existing rubric dir) — write pointer files
- **Critique** (when user has existing rubrics to review) — invoke `design-harnessing:review:rubric-applicator` sub-agent against specific work items

## See also

- [layer-1-context.md](layer-1-context.md) — where rubric definitions live (Layer 1 design-system sub-dir)
- [hd-onboard/references/layer-4-rubrics.md](../../hd-onboard/references/layer-4-rubrics.md) — concept explainer
- [`../../hd-review/assets/starter-rubrics/`](../../hd-review/assets/starter-rubrics/) — 5 shipped starters (a11y, design-system, component-budget, interaction-states, skill-quality)
