# Rubrics Index — `design-harnessing-plugin` meta-harness

Layer 4 of the five-layer design harness. For this plug-in's own dogfood.

## Rubrics are a *behavior of the system*, not a folder

Per article §4d: rubrics are distributed across three loci:

- **Definitions** → [`../context/design-system/cheat-sheet.md`](../context/design-system/cheat-sheet.md) (what "good" looks like for plug-in files + content)
- **Execution** → `skills/hd-review/` (audit + critique modes run the checks)
- **Enforcement** → [`../../AGENTS.md`](../../AGENTS.md) § "Skill compliance checklist" (gates at commit time)

Centralizing everything here in `rubrics/` would break the connection between *what good is* (Layer 1) and *how we check for it* (Layer 2 + AGENTS.md). This INDEX is navigational, not prescriptive.

## Active rubric criteria (plug-in files + content)

Defined in [`../context/design-system/cheat-sheet.md`](../context/design-system/cheat-sheet.md):

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
- Coexistence rules (no writes to `docs/solutions/`, fully-qualified Task names for cross-plug-in)

`/ce:review` has run against this scaffold and surfaced the findings codified in the graduated-rules section.

## `hd:review` execution

`hd:review` executes rubric checks programmatically:

- `audit-parallel.md` / `audit-serial.md` workflows run compound-engineering's research + review agents against the harness (parallel ≤5; serial auto-switch ≥6)
- `critique.md` workflow applies rubrics to a specific work item
- Starter rubrics ship at `skills/hd-review/templates/starter-rubrics/` (for users to extend): accessibility-wcag-aa, design-system-compliance, component-budget

Run `/hd:review audit` for harness health; `/hd:review critique <path-or-url>` for single-work-item rubric application.

## See also

- Article §4d — Rubric Setting (distributed pattern argument)
- [`../../skills/hd-onboard/references/layer-4-rubrics.md`](../../skills/hd-onboard/references/layer-4-rubrics.md) — conceptual explainer
- [`../../skills/hd-setup/references/layer-4-rubrics.md`](../../skills/hd-setup/references/layer-4-rubrics.md) — scaffolding guide
