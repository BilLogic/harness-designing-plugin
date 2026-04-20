# Standard harness structure

The canonical file tree `/hd:setup` scaffolds when a user picks **"Use standard"** mode. This is a **starting point + reference**, not a straitjacket — users can rename, split, merge, or skip folders as their team's workflow takes shape. Review grades on content quality (see `review-criteria-l*.md`), not strict structural conformance.

## The tree

```
<repo-root>/
├── AGENTS.md                               # always-loaded: rules + harness map + agent persona
├── hd-config.md                            # harness config (machine-parseable)
│
├── docs/
│   ├── context/                            # ────── L1 semantic (what's always true)
│   │   ├── product/
│   │   │   ├── one-pager.md                # always-loaded
│   │   │   ├── users-and-personas.md
│   │   │   ├── user-journeys.md
│   │   │   ├── capability-map.md
│   │   │   ├── success-metrics.md
│   │   │   └── glossary.md
│   │   │
│   │   ├── engineering/
│   │   │   ├── system-overview.md
│   │   │   ├── tech-stack.md
│   │   │   ├── data-model.md
│   │   │   ├── api-surface.md
│   │   │   ├── deployment.md
│   │   │   ├── dev-environment.md
│   │   │   └── security-and-privacy.md
│   │   │
│   │   ├── design-system/
│   │   │   ├── index-manifest.json
│   │   │   ├── styles/
│   │   │   │   ├── color.md
│   │   │   │   ├── typography.md
│   │   │   │   ├── spacing.md
│   │   │   │   ├── iconography.md
│   │   │   │   ├── elevation.md
│   │   │   │   └── motion.md
│   │   │   ├── foundations/
│   │   │   │   ├── principles.md
│   │   │   │   ├── tokens.md
│   │   │   │   ├── accessibility.md
│   │   │   │   ├── layout.md
│   │   │   │   ├── content-voice.md
│   │   │   │   └── interaction.md
│   │   │   └── components/
│   │   │       ├── cheat-sheet.md          # always-loaded
│   │   │       ├── inventory.md
│   │   │       ├── layout-cheat-sheet.md
│   │   │       ├── patterns.md
│   │   │       └── components-index.json
│   │   │
│   │   └── conventions/
│   │       └── repo-map.md
│   │
│   ├── rubrics/                            # ────── L4 evaluation (how we judge "good")
│   │   └── <rubric-name>.md                # flat; indexed in AGENTS.md
│   │
│   └── knowledge/                          # ────── L5 episodic (what happened)
│       ├── changelog.md
│       ├── decisions.md
│       ├── ideations.md
│       ├── preferences.md
│       └── lessons/
│           └── YYYY-MM-DD-slug.md
│
├── skills/                                 # ────── L2 procedural (repeatable jobs)
│   └── <skill-name>/
│       ├── SKILL.md
│       ├── references/                     # READ — loaded on demand
│       ├── assets/                         # COPY + FILL — templates
│       └── scripts/                        # EXECUTE — tools
│
└── agents/                                 # ────── L3 emerges from skills ↔ agents dispatch
    └── <category>/                         # research / planning / generation / review / compound
        └── <agent-name>.md
```

## Layer-by-layer rationale

### L1 Context — `docs/context/`

What's always true about the product, the system, the team. Read frequently. Changes slowly.

**`product/`** — who uses this, what they do, what we measure.

| File | Purpose |
|---|---|
| `one-pager.md` | Vision + thesis + one-sentence "why this exists." **Always-loaded.** |
| `users-and-personas.md` | Real users — roles, contexts, constraints, frustrations |
| `user-journeys.md` | What users actually do, step by step, in the real product |
| `capability-map.md` | Feature → code-path cross-reference |
| `success-metrics.md` | North-star + guardrails; what "working" means |
| `glossary.md` | Team-specific vocabulary; jargon index |

**`engineering/`** — the runtime reality. What code runs where, with what dependencies.

| File | Purpose |
|---|---|
| `system-overview.md` | Architecture diagram + request flow in plain English |
| `tech-stack.md` | Languages, frameworks, versions, critical deps |
| `data-model.md` | Tables / collections / key entities; ownership boundaries |
| `api-surface.md` | Public endpoints; auth model |
| `deployment.md` | CI/CD, environments, release cadence |
| `dev-environment.md` | Getting started; required tools |
| `security-and-privacy.md` | Data handling, auth flow, compliance stance |

**`design-system/`** — visual + interaction contract. Patterned after [plus-uno's design system](https://github.com/BilLogic/plus-uno/tree/main/docs/context/design-system), cross-checked against Material 3 + Fluent 2 coverage.

Three sub-areas:

- **`styles/`** — the atoms. `color`, `typography`, `spacing`, `iconography`, `elevation`, `motion`.
- **`foundations/`** — the rules. `principles`, `tokens`, `accessibility`, `layout`, `content-voice`, `interaction`.
- **`components/`** — the building blocks. `inventory`, `cheat-sheet` (**always-loaded**), `layout-cheat-sheet`, `patterns`, `components-index.json` (machine-readable).

**`conventions/`** — team norms. Repo map, naming rules, PR conventions.

### L2 Skills — `skills/`

Repeatable jobs the agent *does*. Each skill is a folder with SKILL.md (router) + references (read on demand) + assets (templates) + scripts (executables).

Conforms to [Anthropic's skill best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices) + [Complete Guide](https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf).

### L3 Orchestration — no folder, emerges from `skills/` ↔ `agents/`

L3 is **not a folder**. Orchestration is the dispatch graph between skills (which users trigger) and agents (which skills invoke). This mirrors the plug-in's own architecture.

- Skill writes "Dispatch `Task design-harnessing:research:lesson-retriever(…)`"
- Agent writes "I am invoked by `hd:maintain` and `hd:review`"
- AGENTS.md harness map lists both, so the workflow is readable

If a team needs explicit workflow gates (e.g. "build → review → ship" with checkpoint artifacts), document them inside the owning SKILL.md — still no separate folder.

### L4 Rubrics — `docs/rubrics/`

Flat folder of markdown files. Each rubric is one file; AGENTS.md lists them in the Harness map. No nested categories — naming handles taxonomy.

Every rubric must include a `## Scope & Grounding` section (personas + user stories + realistic scenarios + anti-scenarios). See `skills/hd-review/references/rubric-authoring-guide.md`.

### L5 Knowledge — `docs/knowledge/`

Episodic memory. What happened, when, why.

| File / folder | Purpose |
|---|---|
| `changelog.md` | Rule adoptions, structural events, version bumps. Dated. Append-only. |
| `decisions.md` | ADR-lite — decisions made, alternatives considered, rationale |
| `ideations.md` | What we considered + rejected. Prevents re-litigating dead ideas. |
| `preferences.md` | Team taste. Soft rules that don't warrant AGENTS.md promotion. |
| `lessons/` | `YYYY-MM-DD-slug.md` — one file per dated lesson |

### Agents — `agents/`

Sub-agents skills dispatch. Categorized by purpose. See [`standard-agent-categories.md`](standard-agent-categories.md) for the 5 standard categories.

## What's NOT in this standard

- **No per-layer `INDEX.md`.** AGENTS.md is the always-loaded master index for every layer.
- **No `docs/orchestration/` folder.** L3 emerges from the dispatch graph.
- **No `docs/architecture/` folder.** Renamed `engineering/`; covers the runtime reality more broadly.
- **No `patterns/` top-level folder.** UX / UI patterns live in `docs/context/design-system/components/patterns.md` or as a dedicated rubric in `docs/rubrics/`.

## Always-loaded files (three, not more)

The files every session opens before doing anything else:

1. **`AGENTS.md`** — rules + harness map + persona
2. **`docs/context/product/one-pager.md`** — product identity in one page
3. **`docs/context/design-system/components/cheat-sheet.md`** — design system shortcut

Keep this list small. Anything beyond these three is lazy-loaded on demand via references, scripts, or explicit skill reads.

## Coexistence with existing harnesses

When `/hd:setup` detects `.agent/`, `.claude/`, or existing `AGENTS.md` in a repo, **additive-only** mode is the default. The standard above is a **proposal**, not a migration mandate. Users can opt into "Use standard" mode to scaffold the canonical tree alongside existing files — but the plug-in never moves or rewrites what's already there.

## Deviation is expected

Your repo's actual needs may differ. Some teams:

- Don't need `engineering/` at all (pure design-system repo)
- Keep rubrics co-located with skills (`skills/<name>/references/rubric.md`)
- Use `.agent/skills/` instead of `skills/` (Codex-native)
- Skip `docs/knowledge/ideations.md` entirely (captured in Notion)

All of these are fine. Review grades on content quality — empty folders fail, missing folders are flagged, but structural deviation is not punished.

## See also

- [`per-layer-procedure.md`](per-layer-procedure.md) — how `/hd:setup` walks each layer
- [`standard-agent-categories.md`](standard-agent-categories.md) — the 5 recommended agent categories
- [`hd-config-schema.md`](hd-config-schema.md) — `hd-config.md` schema
- [`skill-compliance-checklist.md`](skill-compliance-checklist.md) — L2 authoring rules
