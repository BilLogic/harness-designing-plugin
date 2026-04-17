# Layer 3 — Workflow Orchestration (setup guide)

**Purpose:** action-oriented guide for Orchestration layer during setup + audit.
**Concept explainer:** [hd-onboard `layer-3-orchestration.md`](../../hd-onboard/references/layer-3-orchestration.md)

## v0.MVP scope — Layer 3 is NOT actively scaffolded

`hd:setup` at v0.MVP does not scaffold Layer 3 orchestration. Orchestration requires ≥1 Layer 2 skill to orchestrate; until the team has skills, there's nothing to sequence. `hd:setup` will:

- Mention Layer 3 during greenfield introduction
- Check Layer 2 prerequisite during advanced audit before suggesting Layer 3
- Defer scaffolding to v0.5+ when user has skills

## What to scaffold (v0.5+)

Three paths inside `docs/orchestration/` (not created at v0.MVP):

```
docs/orchestration/
├── workflows/
│   └── <workflow-name>.md              # sequence definition: skills + handoffs + gates
├── handoffs/                           # archived (persistent) handoff artifacts
│   └── <workflow>-<date>.md
└── INDEX.md                            # map of workflows to project phases
```

Working-memory handoffs live in `.agent/handoffs/` (gitignored by default) — not version-controlled.

## Prerequisites check

Before scaffolding Layer 3 (v0.5+), `hd:setup` verifies:

1. **At least 1 Layer 2 skill exists** in `skills/` — if zero, block with explanation + suggest authoring first skill
2. **Layer 1 context is populated** — orchestration reads context on gate checks; empty context breaks gates
3. **Layer 5 has ≥1 lesson** — workflows improve when they can learn from past runs

If any prerequisite is missing, `hd:setup` refuses to scaffold Layer 3 and explains which gap to close first.

## Workflow design patterns (for v0.5+ guidance)

- **Linear** — `skill-a → skill-b → skill-c` (simplest; most teams start here)
- **Gated** — `skill-a → [rubric check] → skill-b` (adds Layer 4 quality gate between steps)
- **Branching** — `skill-a → [condition] → (skill-b | skill-c)` (more complex; only when branches are distinct enough to warrant separate named paths)

Avoid:

- **Deeply-nested workflows** — ≤4 steps per workflow; if you need more, split into sub-workflows
- **Workflows with one step** — that's just a skill invocation; not a workflow

## Audit signals (v0.5+)

`hd:setup` advanced audit flags Layer 3 gaps when:

- ≥3 Layer 2 skills exist but no workflows defined (skills orphaned, repeating sequences prompt-by-prompt)
- Handoffs are happening informally (in Slack, comments) instead of as artifacts
- No quality gates — workflows skip rubric checks entirely

## See also

- [layer-2-skills.md](layer-2-skills.md) — prerequisite layer
- hd-onboard [layer-3-orchestration.md](../../hd-onboard/references/layer-3-orchestration.md) — conceptual version
