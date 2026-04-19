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
- Coexistence rules (no writes to `docs/solutions/`, fully-qualified Task names in our own `design-harnessing:*` namespace)

## `hd:review` execution

`hd:review` executes rubric checks programmatically:

- See `skills/hd-review/SKILL.md` § Audit mode and § Critique mode for the procedures (parallel 2-batch audit dispatch; critique applies rubrics to a single work item).
- Starter rubrics ship at `skills/hd-review/assets/starter-rubrics/` (14 rubrics, for users to copy into `docs/rubrics/<name>.md` and customize). See `skills/hd-review/references/rubric-authoring-guide.md` for the authoring spec.

Run `/hd:review audit` for harness health; `/hd:review critique <path-or-url>` for single-work-item rubric application.

## See also

- Article §4d — Rubric Setting (distributed pattern argument)
- [`../../skills/hd-learn/references/layer-4-rubrics.md`](../../skills/hd-learn/references/layer-4-rubrics.md) — conceptual explainer
- [`../../skills/hd-setup/references/layer-4-rubrics.md`](../../skills/hd-setup/references/layer-4-rubrics.md) — scaffolding guide
