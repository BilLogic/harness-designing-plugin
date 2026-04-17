---
name: hd:setup
description: Walks the five-layer design harness layer by layer. Detects existing harnesses + tools, offers per-layer link / critique / scaffold / skip. Use to set up or revisit any repo.
argument-hint: "[--reset-skips | --discover-tools]"
---

# hd:setup — walk your design harness, layer by layer

## Interaction method

Default: `AskUserQuestion` for branching decisions (option A/B/C/D per layer). If `AskUserQuestion` is unavailable (non-Claude hosts), fall back to numbered-list prompts. **Never take destructive action without explicit confirmation** (scenario F4). **Never modify other-tool harnesses** (`.agent/`, `.claude/`, `.codex/`, external `.cursor/skills/`).

## What this skill does

Runs a unified five-layer walk (L1 → L5 in order). At each layer, detects existing material (other-tool harnesses, external team tooling, MCP configs, prior hd-* content) and offers four choices:

- **link** — pointer file from hd-* structure to existing source
- **critique** — apply relevant rubric, surface findings, let user decide deltas
- **scaffold** — seed questions + write new files
- **skip** — record in `skipped_layers`

User drives every per-layer decision. Skill never merges, absorbs, or overwrites external harnesses.

## Workflow checklist

Copy into your response and track progress:

```
hd:setup Progress:
- [ ] Step 1: Detect — run detect.py; parse JSON
- [ ] Step 2: Onboard check — suggest /hd:onboard if first-time user (soft)
- [ ] Step 3: Tool discovery — surface detected + ask per category
- [ ] Step 4: Layer 1 (Context) — link / critique / scaffold / skip
- [ ] Step 5: Layer 2 (Skills) — link / critique / scaffold / skip
- [ ] Step 6: Layer 3 (Orchestration) — link / critique / scaffold / skip
- [ ] Step 7: Layer 4 (Rubrics) — link / critique / scaffold / skip
- [ ] Step 8: Layer 5 (Knowledge) — link / critique / scaffold / skip
- [ ] Step 9: Write design-harnessing.local.md (schema v2)
- [ ] Step 10: Summarize decisions + suggest next skill
```

Steps 4–8 are the five-layer walk — executed per [`workflows/five-layer-walk.md`](workflows/five-layer-walk.md). Each layer gets its own progress line so the user always sees where they are.

## Step 1 — Detect

Run [`scripts/detect.py`](scripts/detect.py) from the user's repo root. Emits JSON schema v2 per [`references/local-md-schema.md`](references/local-md-schema.md). Parse and retain for all subsequent steps.

If python3 unavailable, the bash shim [`scripts/detect-mode.sh`](scripts/detect-mode.sh) delegates to the python script. If both unavailable (rare), fall back to manual checklist in [`references/layer-1-context.md`](references/layer-1-context.md) appendix.

## Step 2 — Onboard check

If `design-harnessing.local.md` does not exist AND user hasn't indicated prior familiarity:

> "New to the five-layer frame?
> A. Run `/hd:onboard` first (5-min intro)
> B. Proceed — I'll explain as we go
> C. Already know it — skip the preamble"

Soft suggestion only. Default to B on no answer. Never block.

## Step 3 — Tool discovery

Surface detected `team_tooling` + `mcp_servers` from Step 1. If `coexistence.compound_engineering: true`, note it here once (not as a separate step): *"compound-engineering detected — we coexist by default; won't touch its namespace (`docs/solutions/`, `ce-*`)."*

Ask per-category for anything detection missed, then triage each tool per the integration-path table in [`references/external-tooling.md`](references/external-tooling.md):

- **active** — MCP live in session → offer live pull
- **start-server** — MCP configured but not running → give start command
- **install-walkthrough** — tool in known-MCP table → install command + API-key URL
- **pointer-only** — tool user-named but not in known table → record, write pointer, no install recommended

Universal principle: only offer MCPs from the known-installs table. Never recommend unknown packages. Never use plug-in-maintainer's own session MCPs on the user's behalf.

## Steps 4–8 — Five-layer walk (L1 → L5)

Route to [`workflows/five-layer-walk.md`](workflows/five-layer-walk.md). That workflow owns:

- Per-layer frame + seed questions
- Default action suggestions (based on detection)
- Link / critique / scaffold / skip mechanics per layer
- Team-size-adaptive language (solo / small / medium / large)
- Re-run semantics (additive-only on repeat)

Each layer step (4 through 8) corresponds to one walk iteration. `five-layer-walk.md` loads the per-layer reference ([`references/layer-1-context.md`](references/layer-1-context.md) through [`layer-5-knowledge.md`](references/layer-5-knowledge.md)) on demand as each layer is reached.

## Step 9 — Write `design-harnessing.local.md`

Schema v2 spec: [`references/local-md-schema.md`](references/local-md-schema.md). Template: [`templates/design-harnessing.local.md.template`](templates/design-harnessing.local.md.template).

Populate from walk decisions:
- `schema_version: "2"`, `setup_mode`, `setup_date`, `team_size`
- `skipped_layers`, `coexistence`, `article_read`
- `team_tooling`, `mcp_servers_at_setup`, `layer_decisions`
- `other_tool_harnesses_detected`

Atomic write (temp file + `mv`).

## Step 10 — Summarize + suggest next

Report:
- Layer-decision table (5 rows: layer → choice → evidence)
- Tier 1 budget snapshot
- Other-tool harnesses respected (paths untouched)
- Next step, tuned to what the walk produced:
  - Mostly scaffold → `/hd:compound capture` to record first lesson
  - Mostly link → `/hd:review audit` to audit the combined harness
  - Mostly critique → address findings one at a time; re-run `/hd:review audit` when done

## What this skill does NOT do

- **Does not answer concept questions** → hand off to `/hd:onboard`
- **Does not capture ongoing lessons** → hand off to `/hd:compound`
- **Does not audit harness health** → hand off to `/hd:review`
- **Does not invoke other skills directly** — always suggest, never invoke
- **Does not modify any file under `.agent/`, `.claude/`, `.codex/`, `.cursor/skills/`, `.windsurf/`** — strict coexistence
- **Does not write to `docs/solutions/`** (compound's namespace) — ever
- **Does not recommend unknown / unmaintained MCPs** — see `external-tooling.md` for the known table

## Coexistence rules

- ✅ Reads other-tool harnesses and external tooling for detection + link targets
- ✅ Writes pointer files (`docs/<layer>/<topic>.md` containing `See [external path]`) when `link` is chosen
- ❌ Never writes to `docs/solutions/` (compound's namespace)
- ❌ Never uses `compound-engineering.local.md` — we use `design-harnessing.local.md`
- ❌ No "conflict" / "rivalry" / "vs." language in output (scenario F6)
- ✅ Cross-plug-in Task calls fully-qualified: `Task compound-engineering:research:learnings-researcher(...)`

See [`references/coexistence-checklist.md`](references/coexistence-checklist.md).

## Reference files

### Layer guides (loaded on demand by five-layer-walk.md)
- [layer-1-context.md](references/layer-1-context.md)
- [layer-2-skills.md](references/layer-2-skills.md)
- [layer-3-orchestration.md](references/layer-3-orchestration.md)
- [layer-4-rubrics.md](references/layer-4-rubrics.md)
- [layer-5-knowledge.md](references/layer-5-knowledge.md)

### Shared
- [tier-budget-model.md](references/tier-budget-model.md) — three-tier loading + Tier 1 ≤200-line rule
- [good-agents-md-patterns.md](references/good-agents-md-patterns.md) — healthy AGENTS.md shape
- [coexistence-checklist.md](references/coexistence-checklist.md) — compound-engineering collision rules
- [local-md-schema.md](references/local-md-schema.md) — `design-harnessing.local.md` YAML v2 spec
- [external-tooling.md](references/external-tooling.md) — Step 1.5 tool discovery + MCP integration

## Workflows

- [five-layer-walk.md](workflows/five-layer-walk.md) — **primary** workflow (v1.1+)
- Legacy per-mode (now per-starting-state seed refs loaded by layer-walk):
  - [greenfield.md](workflows/greenfield.md)
  - [scattered.md](workflows/scattered.md)
  - [advanced.md](workflows/advanced.md)

## Templates

- [AGENTS.md.template](templates/AGENTS.md.template)
- [design-harnessing.local.md.template](templates/design-harnessing.local.md.template) — schema v2
- [templates/context-skeleton/](templates/context-skeleton/) — Layer 1 starter files
- [templates/knowledge-skeleton/](templates/knowledge-skeleton/) — Layer 5 starter files

## Scripts

- `scripts/detect.py` — canonical detector (schema v2 JSON)
- `scripts/detect-mode.sh` — bash shim → detect.py (backward compat)
