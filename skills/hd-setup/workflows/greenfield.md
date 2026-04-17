# Reference — Greenfield seed content

**Status in v1.1+:** no longer a standalone workflow. [`five-layer-walk.md`](five-layer-walk.md) loads this file on demand when a layer's default action is **scaffold** AND the repo has no prior material — i.e., the greenfield case for that layer.

**Legacy status:** this file was a standalone v1.0 workflow. It's preserved because its seed-content (template references, scaffold scripts, confirmation language) is still valuable when `five-layer-walk.md` routes a layer to scaffold-from-zero. The coexistence announcement + team-size branching have moved upstream to SKILL.md Step 3 (tool discovery) and `five-layer-walk.md` team-size-adaptive language.

**Don't read this top-down as a workflow.** Read only the section that matches the layer you're scaffolding.

## Scaffold skeleton (used by any greenfield-layer scaffold)

Create directories (confirm with user before executing):

```bash
mkdir -p docs/context/product \
         docs/context/design-system \
         docs/context/conventions \
         docs/knowledge/lessons \
         docs/rubrics
# docs/design-solutions/ NOT created — reserved for future distilled-solution output; hd:compound writes lessons to docs/knowledge/lessons/
```

## Step 5 — Walk Layer 1 (Context)

Load [layer-1-context.md](../references/layer-1-context.md). Walk through each sub-file with 1-2 questions per:

- **`docs/context/product/one-pager.md`** — "What's your product in one sentence? Who's it for?"
- **`docs/context/design-system/cheat-sheet.md`** — "Do you have a design system? Point me at it, or I'll scaffold a starter."
- **`docs/context/conventions/how-we-work.md`** — "Any style guide or 'how we work' notes?"
- **`docs/context/agent-persona.md`** — "Any voice guidelines for the AI? Formality, defaults when unclear?"

Use [`../templates/context-skeleton/`](../templates/context-skeleton/) starter files. Fill with user answers; leave `{{TODO: ...}}` placeholders for unknowns. Never invent content.

## Step 6 — Walk Layer 5 (Knowledge)

Load [layer-5-knowledge.md](../references/layer-5-knowledge.md). Create:

- `docs/knowledge/INDEX.md` — one-paragraph explainer (from [`../templates/knowledge-skeleton/INDEX.md.template`](../templates/knowledge-skeleton/INDEX.md.template))
- `docs/knowledge/graduations.md` — empty meta-log with one-line header (from [`../templates/knowledge-skeleton/graduations.md.template`](../templates/knowledge-skeleton/graduations.md.template))
- `docs/knowledge/lessons/YYYY-MM-DD-first-lesson.md` — seed with today's date + a 3-sentence example (something the user did during this setup session)

**Why seed a lesson:** users who see an empty `lessons/` folder don't write lessons. Users who see one example write more.

## Step 7 — Write AGENTS.md

Use [`../templates/AGENTS.md.template`](../templates/AGENTS.md.template). Fill placeholders:

- `{{TEAM_NAME}}` — from user input
- `{{PRODUCT_ONE_LINER}}` — from Step 5 product one-pager
- `{{DESIGN_SYSTEM_LOCATION}}` — file path or "starter in docs/context/design-system/"
- `{{DATE}}` — today's ISO date

Target length: **≤200 lines total** (Tier 1 budget — see [tier-budget-model.md](../references/tier-budget-model.md)). If the user's answers push over the budget, propose moving non-critical sections to `docs/context/conventions/`.

## Step 8 — Write design-harnessing.local.md

Use [`../templates/design-harnessing.local.md.template`](../templates/design-harnessing.local.md.template). YAML frontmatter + markdown body per [local-md-schema.md](../references/local-md-schema.md). Fill:

- `schema_version: "1"`
- `setup_mode: greenfield`
- `setup_date: YYYY-MM-DD` (today)
- `team_size: <answer from Step 2>`
- `skipped_layers: []` (or layer list if user declined any)
- `coexistence.compound_engineering: <true/false from Step 3>`
- `article_read: <ask user>`

Write atomically: write to `design-harnessing.local.md.new`, then `mv`.

## Step 9 — Summarize + suggest next

Report what was created (file list + line counts). Confirm Tier 1 budget (combined AGENTS.md + one-pager ≤200 lines). Suggest ONE next action based on user context:

- **New to the framework?** → "Run `/hd:onboard` to explore concepts before going deeper"
- **Want to capture lessons as you work?** → "Run `/hd:compound`"
- **Ready to audit what you just built?** → "Run `/hd:review`"

## Failure modes

- **F4 Overwrite safety** — never overwrite existing files silently. Confirm before every write. See [scattered.md](scattered.md) if pre-existing AGENTS.md detected (should have been routed to scattered mode by detect-mode.sh, but double-check).
- **F6 Coexistence** — if compound-engineering detected mid-run, announce per Step 3; never skip.

## Success criteria

Passes [C-S1 greenfield criteria](../../../docs/plans/hd-setup-success-criteria.md#c-s1--greenfield-pass-criteria) when:

- `docs/context/` has ≥1 real file (not placeholder-only)
- `design-harnessing.local.md` exists at repo root with valid YAML
- User touched ≥2 of 5 layers during session (Layers 1 + 5 in greenfield by default)
- No silent overwrites
- Output references ≥1 article `§`
- TTFUI ≤30 min (stopwatch during n=5 usability tests)
