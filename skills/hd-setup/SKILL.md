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
- [ ] Step 1: Run detect.py
- [ ] Step 2: Suggest /hd:onboard if new user (soft, non-blocking)
- [ ] Step 3: Step 1.5 — tool discovery across 6 categories
- [ ] Step 4: Five-layer walk (L1 → L5) via workflows/layer-walk.md
- [ ] Step 5: Write design-harnessing.local.md (schema v2)
- [ ] Step 6: Summarize + suggest next
```

## Step 1 — Detect

Run [`scripts/detect.py`](scripts/detect.py) from the user's repo root. Emits JSON schema v2 per [`references/local-md-schema.md`](references/local-md-schema.md). Parse and retain for all subsequent steps.

If python3 unavailable, the bash shim [`scripts/detect-mode.sh`](scripts/detect-mode.sh) delegates to the python script. If bash+python3 both unavailable (rare), fall back to manual checklist in [`references/layer-1-context.md`](references/layer-1-context.md) appendix.

## Step 2 — Onboard soft-check

If `design-harnessing.local.md` does not exist AND user hasn't indicated prior familiarity:

> "New to the five-layer frame? Quick options:
> A. Run `/hd:onboard` first (5-min intro)
> B. Proceed — I'll explain as we go
> C. Already know it — skip the preamble"

Soft suggestion only. Default to B on no answer. Never block.

## Step 3 — Step 1.5: tool discovery

Per [`references/external-tooling.md`](references/external-tooling.md). Surface detected `team_tooling` + `mcp_servers` from Step 1, ask per-category for anything missing, triage per-tool integration path:

- MCP in session → active pull offered
- MCP configured in repo but not in session → start-command instructions
- Tool known-installable (see `external-tooling.md` table) → install walkthrough with API-key pointers
- Otherwise → pointer-only, recorded in `team_tooling`

**Universal principle:** only offer tools from the known-MCP table or ones the user names. Never recommend unknown / unmaintained packages. Never use plug-in-maintainer-specific MCPs — all integrations flow through the user's own config.

## Step 4 — Five-layer walk

Route to [`workflows/layer-walk.md`](workflows/layer-walk.md). That workflow owns:

- Per-layer frame + seed questions
- Default action suggestions (based on detection)
- Link / critique / scaffold / skip mechanics per layer
- Team-size-adaptive language (solo / small / medium / large)

`layer-walk.md` loads [`references/layer-1-context.md`](references/layer-1-context.md) through [`layer-5-knowledge.md`](references/layer-5-knowledge.md) on demand, per layer reached.

**The three legacy per-mode workflows** ([`greenfield.md`](workflows/greenfield.md), [`scattered.md`](workflows/scattered.md), [`advanced.md`](workflows/advanced.md)) remain as per-starting-state seed-content references. `layer-walk.md` loads them when their seed questions are relevant — they are NOT standalone routes in v1.1+.

## Step 5 — Write `design-harnessing.local.md`

Schema v2 spec: [`references/local-md-schema.md`](references/local-md-schema.md). Use [`templates/design-harnessing.local.md.template`](templates/design-harnessing.local.md.template).

Populate from layer-walk decisions:
- `schema_version: "2"`, `setup_mode`, `setup_date`, `team_size`
- `skipped_layers`, `coexistence`, `article_read`
- `team_tooling`, `mcp_servers_at_setup`, `layer_decisions`
- `other_tool_harnesses_detected`

Atomic write (temp file + `mv`).

## Step 6 — Summarize + suggest next

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

### Layer guides (loaded on demand by layer-walk.md)
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

- [layer-walk.md](workflows/layer-walk.md) — **primary** workflow (v1.1+)
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
