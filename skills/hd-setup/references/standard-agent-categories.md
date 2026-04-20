# Standard agent categories

Five recommended categories for organizing `agents/` in a user repo: **`research / planning / generation / review / compound`**. Starting point, not a schema — users can rename, merge, or add categories freely. Review checks agent frontmatter validity, not category names.

## The five categories

### `research/`

**Purpose.** Retrieve, cite, pattern-mine from internal corpus + external sources.

**Examples:**
- `competitor-analyzer` — surveys competitors, returns structured comparison
- `pattern-retriever` — finds past solutions to a similar problem
- `user-research-synthesizer` — collapses interview notes into themes
- `source-finder` — returns verbatim quotes + citations from an article corpus

### `planning/`

**Purpose.** Structure + decompose work. Turn fuzzy goals into actionable sequences.

**Examples:**
- `project-planner` — breaks a feature into milestones + tasks
- `roadmap-structurer` — aligns proposals with existing roadmap
- `scope-analyzer` — identifies what's in-scope vs deferred
- `dependency-mapper` — traces prerequisites before execution

### `generation/`

**Purpose.** Create new artifacts. Produce first drafts of specs, components, copy, tokens.

**Examples:**
- `copy-generator` — drafts UX copy against a voice guide
- `component-spec-drafter` — writes component specs from Figma + patterns
- `token-proposer` — proposes token values to fill a design-system gap
- `figma-layout-generator` — sketches layout candidates

### `review/`

**Purpose.** Apply rubrics, surface findings, quality-check artifacts.

**Examples:**
- `rubric-applier` — forward review against any rubric
- `design-system-auditor` — checks adherence to tokens + components
- `a11y-checker` — accessibility-specific review
- `skill-quality-auditor` — applies the 9-section skill rubric

### `compound/`

**Purpose.** Lesson capture + rule promotion. Feed the knowledge-compounding loop.

**Examples:**
- `lesson-clusterer` — groups recent lessons by theme
- `rule-candidate-scorer` — scores whether a lesson cluster is ready for rule adoption
- `drift-detector` — flags harness artifacts that have gone stale
- `decision-archiver` — turns conversational decisions into `docs/knowledge/decisions.md` entries

## Why these five

- **Research / Review / Generation** — the classic review/create/retrieve split any creative workflow needs
- **Planning** — explicit structuring layer so agents can sequence work, not just execute
- **Compound** — makes knowledge-compounding a first-class agent category, not an afterthought

This mirrors the typical design-team cadence: **research → plan → generate → review → compound** into rules.

## When to deviate

Rename or merge whenever:

- Your team doesn't do a category (e.g. no `planning/` if PM handles it elsewhere)
- Two categories collapse in practice (e.g. `review/` + `compound/` merged as `quality/`)
- You need a domain-specific category (e.g. `prototyping/`, `ops/`, `brand/`)

**Review does not enforce these names.** `agents/whatever/<name>.md` with valid frontmatter passes. The five above are defaults, not a contract.

## Frontmatter requirements

Every agent file carries YAML frontmatter:

```yaml
---
name: <agent-name>                    # kebab-case, unique
description: "<≤180 chars>"           # what this agent does + when it's invoked
color: <optional>                     # UI hint (purple, cyan, etc.)
model: inherit                        # typically inherit from caller
---
```

## Dispatch convention

Agents are invoked from skills via fully-qualified Task names:

```
Task <namespace>:<category>:<agent-name>(…)
```

For our plug-in: `Task design-harnessing:analysis:harness-auditor(…)`. For a user's agents: `Task <their-namespace>:<category>:<agent-name>(…)`.

Users pick their namespace via `hd-config.md:namespace` (defaults to repo-slug).

## See also

- [`standard-harness-structure.md`](standard-harness-structure.md) — canonical file tree
- `../../agents/` — the plug-in's own `analysis / research / review` split (internal; doesn't dictate user structure)
