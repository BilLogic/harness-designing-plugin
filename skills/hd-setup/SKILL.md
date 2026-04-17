---
name: hd:setup
description: Scaffolds a five-layer design harness in the current repo. Adapts to greenfield, scattered, or existing-harness starting state.
argument-hint: "[greenfield | scattered | advanced | auto]"
---

# hd:setup — scaffold your design harness

## Interaction method

Default: walk the user through setup with `AskUserQuestion` for branching decisions. If `AskUserQuestion` is unavailable (non-Claude hosts — Codex, Gemini, Copilot), fall back to numbered-list prompts. **Never take destructive action without explicit confirmation** (scenario F4).

## What this skill does

Sets up a five-layer design harness (Context, Skills, Orchestration, Rubrics, Knowledge) for the current repo. Adapts to what already exists:

- **Greenfield** (no AI docs yet) → scaffolds from zero — [workflows/greenfield.md](workflows/greenfield.md)
- **Scattered** (some docs exist, not layered) → proposes reorganization with diff preview — [workflows/scattered.md](workflows/scattered.md)
- **Advanced** (full harness present) → light audit, no writes outside report — [workflows/advanced.md](workflows/advanced.md)

## Workflow checklist

Copy into your response and track progress:

```
hd:setup Progress:
- [ ] Step 1: Detect starting mode
- [ ] Step 2: Confirm mode with user
- [ ] Step 3: Route to matching workflow
- [ ] Step 4: Execute workflow steps
- [ ] Step 5: Write design-harnessing.local.md
- [ ] Step 6: Summarize + suggest next
```

## Step 1 — Detect starting mode

Run [`scripts/detect-mode.sh`](scripts/detect-mode.sh) from the user's repo root. It emits JSON matching the LOCKED shape in [local-md-schema.md](references/local-md-schema.md). Parse the `mode` field. Detection priority rules live in [modes overview](references/layer-1-context.md) — but the script is authoritative; don't re-implement the logic.

If bash isn't available (rare on Codex environments), fall back to manual checklist:

1. `design-harnessing.local.md` exists → `advanced`
2. ≥3 `{{...}}` placeholders in files → `localize`
3. `docs/context/` + `docs/knowledge/` exist → `advanced`
4. Any `AGENTS.md`, `CLAUDE.md`, `.cursor/rules/`, `.windsurf/rules/`, `.github/copilot-instructions.md`, or `DESIGN.md` exists → `scattered`
5. None of the above → `greenfield`

Coexistence overlay: `coexistence.compound_engineering: true` if `~/.claude/plugins/cache/compound-engineering-plugin/` exists — applied regardless of primary mode.

## Step 2 — Confirm mode with user

Surface detection in plain language. Example (greenfield):

> This looks like a **greenfield** repo — no AI setup yet, no `AGENTS.md`, no `docs/`. I'll scaffold from zero. Takes about 10 minutes of back-and-forth. OK to proceed, or did I miss something?

For `scattered`:

> Detected existing AI docs (`AGENTS.md`, 120 lines). This looks like a **scattered** setup — content exists but isn't layered. I'll propose a reorganization with diff preview before any write. OK to proceed?

For `advanced`:

> Detected a populated harness structure (`docs/context/`, `docs/knowledge/`). This looks like **advanced mode** — I'll run a light audit and report TODOs. **No writes outside the audit report.** OK to proceed?

Proceed only on explicit confirmation. If the user says "I want greenfield instead," respect them and route manually.

## Step 3 — Route to workflow

Based on confirmed mode:

- `greenfield` → follow [workflows/greenfield.md](workflows/greenfield.md)
- `scattered` → follow [workflows/scattered.md](workflows/scattered.md)
- `advanced` → follow [workflows/advanced.md](workflows/advanced.md)
- `localize` → surface "localize mode deferred to v0.5" and route to `scattered` as fallback at v0.MVP

Each workflow has its own checklist; use the workflow's checklist as progress tracking, not this SKILL.md's outer checklist.

## Step 4 — Execute workflow steps

Follow the chosen workflow file end-to-end. Workflows reference:

- **Layer guides** in [references/](references/) — load the layer's reference when scaffolding or auditing that layer (for example, loading [layer-1-context.md](references/layer-1-context.md) during Context scaffolding)
- **Shared knowledge** in [references/](references/):
  - [tier-budget-model.md](references/tier-budget-model.md) — three-tier loading + Tier 1 ≤200-line rule
  - [good-agents-md-patterns.md](references/good-agents-md-patterns.md) — healthy AGENTS.md shape
  - [coexistence-checklist.md](references/coexistence-checklist.md) — compound-engineering collision rules
  - [local-md-schema.md](references/local-md-schema.md) — `design-harnessing.local.md` YAML spec
- **Templates** in [templates/](templates/) — copy + fill into user's repo

## Step 5 — Write design-harnessing.local.md

Every setup run (greenfield / scattered / advanced) writes or updates `design-harnessing.local.md` at the user's repo root. Use [`templates/design-harnessing.local.md.template`](templates/design-harnessing.local.md.template). Schema spec: [local-md-schema.md](references/local-md-schema.md).

Write atomically: write to `design-harnessing.local.md.new`, then `mv` (prevents partial-write corruption).

## Step 6 — Summarize + suggest next

Report what was created (file list + line counts). Confirm Tier 1 budget via `wc -l AGENTS.md docs/context/product/one-pager.md`. Suggest ONE next step tuned to user context:

- **New to the framework?** → `/hd:onboard` for concept Q&A
- **Ready to capture lessons as you work?** → `/hd:compound`
- **Want to audit what you built?** → `/hd:review`

## What this skill does NOT do

- **Does not answer concept questions** → hand off to `/hd:onboard`
- **Does not capture ongoing lessons** → hand off to `/hd:compound`
- **Does not audit harness health** → hand off to `/hd:review`
- **Does not invoke other skills directly** — always suggest, never invoke

## Coexistence rules (must follow)

- Never write to `docs/solutions/` (compound-engineering's namespace)
- Never use `compound-engineering.local.md` — we use `design-harnessing.local.md`
- No "conflict" / "rivalry" / "vs." language in output (scenario F6)
- When invoking compound agents (v1 `hd:review` path), use fully-qualified Task names: `Task compound-engineering:research:learnings-researcher(...)`

See [coexistence-checklist.md](references/coexistence-checklist.md).

## Reference files

### Layer guides
- [layer-1-context.md](references/layer-1-context.md) — Context scaffolding
- [layer-2-skills.md](references/layer-2-skills.md) — Skills layer
- [layer-3-orchestration.md](references/layer-3-orchestration.md) — Orchestration
- [layer-4-rubrics.md](references/layer-4-rubrics.md) — Rubrics (distributed pattern)
- [layer-5-knowledge.md](references/layer-5-knowledge.md) — Knowledge scaffolding

### Shared knowledge
- [tier-budget-model.md](references/tier-budget-model.md)
- [good-agents-md-patterns.md](references/good-agents-md-patterns.md)
- [coexistence-checklist.md](references/coexistence-checklist.md)
- [local-md-schema.md](references/local-md-schema.md)

## Workflows

- [greenfield.md](workflows/greenfield.md)
- [scattered.md](workflows/scattered.md)
- [advanced.md](workflows/advanced.md)

## Templates

- [AGENTS.md.template](templates/AGENTS.md.template)
- [design-harnessing.local.md.template](templates/design-harnessing.local.md.template)
- [templates/context-skeleton/](templates/context-skeleton/) — Layer 1 starter files
- [templates/knowledge-skeleton/](templates/knowledge-skeleton/) — Layer 5 starter files

## Scripts

- `scripts/detect-mode.sh` — executed by Step 1; emits mode JSON
