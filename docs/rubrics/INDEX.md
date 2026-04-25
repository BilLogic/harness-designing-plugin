# Rubrics Index — `harness-designing-plugin` meta-harness

Layer 4 — Evaluation Design — of the five-layer design harness. For this plug-in's own dogfood. Rubrics are the concrete check files that make evaluation inspectable.

## Evaluation is a *behavior of the system*, not a folder

Per article §4d: evaluation is distributed across three loci:

- **Definitions** → [`../context/design-system/cheat-sheet.md`](../context/design-system/cheat-sheet.md) (what "good" looks like for plug-in files + content)
- **Execution** → `skills/hd-review/` (full + targeted review modes run the checks)
- **Enforcement** → [`../../AGENTS.md`](../../AGENTS.md) § "Skill compliance checklist" (gates at commit time)

Centralizing everything here in `rubrics/` would break the connection between *what good is* (Layer 1) and *how we check for it* (Layer 2 + AGENTS.md). This INDEX is navigational, not prescriptive.

## Adopted rubrics (dogfood)

Promoted from [`../../skills/hd-review/assets/starter-rubrics/`](../../skills/hd-review/assets/starter-rubrics/) and adapted to this plug-in's own content:

- [`skill-quality.md`](skill-quality.md) — 9-section Layer 2 skill health (every `SKILL.md` in `skills/hd-*/` reviewed against this)
- [`ux-writing.md`](ux-writing.md) — copy quality across SKILL.md prose, agent descriptions, command text, script error messages (adapted 2026-04-21 — skip button/hover/empty-state criteria; apply command-prompt + error-message criteria)
- [`heuristic-evaluation.md`](heuristic-evaluation.md) — Nielsen 10 heuristics applied to `/hd:*` command interaction flows (adapted 2026-04-21 — read "UI" as "command flow"; skip visual heuristics)
- [`plan-quality.md`](plan-quality.md) — applied to `docs/plans/*.md` (adopted 2026-04-24, Phase 3s)
- [`lesson-quality.md`](lesson-quality.md) — applied to `docs/knowledge/lessons/*.md` (adopted 2026-04-24, Phase 3s)
- [`agent-spec-quality.md`](agent-spec-quality.md) — applied to `agents/*/*.md` sub-agent specs (adopted 2026-04-24, Phase 3s)

## Waived starter rubrics (dated 2026-04-21)

Per AGENTS.md § Rules, these starters intentionally remain at starter status for this plug-in repo — they apply to user repos consuming the plug-in, not to the plug-in's own markdown + script content:

- `accessibility-wcag-aa`, `design-system-compliance`, `interaction-states`, `typography`, `color-and-contrast`, `spatial-design`, `motion-design`, `responsive-design`, `telemetry-display` — visual/UI rubrics; no runtime UI in this repo
- `component-budget` — duplicative with `skills/hd-review/scripts/budget-check.sh` which mechanically enforces SKILL.md line budgets
- `i18n-cjk` — deferred; revisit if command descriptions or agent prose are localized

## Active rubric criteria (plug-in files + content)

Also defined in [`../context/design-system/cheat-sheet.md`](../context/design-system/cheat-sheet.md):

- **File naming** — `hd-<verb>/`, `.template` suffix, `YYYY-MM-DD-<slug>.md` for lessons
- **SKILL.md structure** — frontmatter + interaction method preamble + workflow + non-scope + reference index
- **Reference link syntax** — proper markdown, one level deep, no bare backticks (except scripts)
- **Frontmatter discipline** — `name`, `description` ≤180 chars third-person, `argument-hint` YAML-quoted
- **Content style** — imperative/infinitive, third person, concise, no time-sensitive statements
- **Markdown lint** — closed fences, balanced quotes, forward-slash paths, proper heading hierarchy

## Enforcement points

Per [`../../AGENTS.md`](../../AGENTS.md) § "Skill compliance checklist", every skill passes:

- YAML frontmatter validity
- SKILL.md ≤200 lines
- Description ≤180 chars
- One-level reference links
- Imperative/infinitive voice
- Markdown lint clean
- Coexistence rules (no writes to `docs/solutions/`, fully-qualified Task names in our own `harness-designing:*` namespace)

## `hd:review` execution

`hd:review` executes rubric checks programmatically:

- See `skills/hd-review/SKILL.md` for the full and targeted review procedures (parallel 2-batch review dispatch; targeted review applies rubrics to a single work item).
- Starter rubrics ship at `skills/hd-review/assets/starter-rubrics/` (17 rubrics, for users to copy into `docs/rubrics/<name>.md` and customize). See `skills/hd-review/references/rubric-authoring-guide.md` for the authoring spec.

Run `/hd:review full` for harness health; `/hd:review targeted <path-or-url>` for single-work-item rubric application.

## See also

- Article §4d — Evaluation Design (distributed pattern argument)
- [`../../skills/hd-learn/references/layer-4-rubrics.md`](../../skills/hd-learn/references/layer-4-rubrics.md) — conceptual explainer
- [`../../skills/hd-setup/references/layer-4-rubrics.md`](../../skills/hd-setup/references/layer-4-rubrics.md) — scaffolding guide
