# Layer 3 — Orchestration (depth reference)

**Loaded by:** `SKILL.md` Step 6 when scaffolding or critiquing Layer 3. Seed questions + decision defaults live in SKILL.md; this file provides orchestration patterns + prerequisite checks used during execution.

**Concept explainer:** [hd-learn `layer-3-orchestration.md`](../../hd-learn/references/layer-3-orchestration.md)

## When NOT to scaffold Layer 3

Orchestration requires ≥1 Layer 2 skill to orchestrate. If the team has zero skills, there's nothing to sequence. SKILL.md defaults Layer 3 to **skip** in that case. This reference documents what Layer 3 looks like when it IS scaffolded.

## What to scaffold when L3 is active

User repo example (user's own layout) — three paths inside `docs/orchestration/`:

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

Before scaffolding Layer 3, `hd:setup` verifies:

1. **At least 1 Layer 2 skill exists** in `skills/` — if zero, block with explanation + suggest authoring first skill
2. **Layer 1 context is populated** — orchestration reads context on gate checks; empty context breaks gates
3. **Layer 5 has ≥1 lesson** — workflows improve when they can learn from past runs

If any prerequisite is missing, refuse to scaffold Layer 3 and explain which gap to close first.

## Workflow design patterns

- **Linear** — `skill-a → skill-b → skill-c` (simplest; most teams start here)
- **Gated** — `skill-a → [rubric check] → skill-b` (adds Layer 4 quality gate between steps)
- **Branching** — `skill-a → [condition] → (skill-b | skill-c)` (more complex; only when branches are distinct enough to warrant separate named paths)

Avoid:

- **Deeply-nested workflows** — ≤4 steps per workflow; if you need more, split into sub-workflows
- **Workflows with one step** — that's just a skill invocation; not a workflow

## Audit signals

Audit flags Layer 3 gaps when:

- ≥3 Layer 2 skills exist but no workflows defined (skills orphaned, repeating sequences prompt-by-prompt)
- Handoffs are happening informally (in Slack, comments) instead of as artifacts
- No quality gates — workflows skip rubric checks entirely

## See also

- [layer-2-skills.md](layer-2-skills.md) — prerequisite layer
- hd-learn [layer-3-orchestration.md](../../hd-learn/references/layer-3-orchestration.md) — conceptual version
