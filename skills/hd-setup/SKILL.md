---
name: hd:setup
description: Walks the five-layer design harness layer by layer. Detects existing harnesses + tools, offers per-layer link / critique / scaffold / skip. Use to set up or revisit any repo.
argument-hint: "[--reset-skips | --discover-tools]"
---

# hd:setup — walk your design harness, layer by layer

## Interaction method

Use `AskUserQuestion` for branching decisions (option A/B/C/D per layer). If unavailable (non-Claude hosts), fall back to numbered-list prompts. **Never take destructive action without explicit confirmation** (scenario F4). **Never modify other-tool harnesses** (`.agent/`, `.claude/`, `.codex/`, external `.cursor/skills/`).

## Single job

Walk the five-layer harness in order. At each layer, detect existing material (other-tool harnesses, external tooling, MCP configs, prior hd-* content) and offer four choices:

- **link** — pointer file from `docs/<layer>/` to existing source; original untouched
- **critique** — apply relevant rubric; surface findings; user decides per-finding
- **scaffold** — seed questions + write new layer files
- **skip** — record in `skipped_layers`; re-runs don't re-propose unless `--reset-skips`

User drives every decision. Skill never merges, absorbs, or overwrites external harnesses.

## Workflow checklist

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

Steps 4–8 each follow the same per-layer procedure documented below.

## Step 1 — Detect

Run [`scripts/detect.py`](scripts/detect.py). Emits JSON schema v2 per [`references/local-md-schema.md`](references/local-md-schema.md). Parse and retain all fields: `mode`, `signals.*`, `coexistence.compound_engineering`, `mcp_servers[]`, `team_tooling.*`, `other_tool_harnesses_detected[]`.

If python3 unavailable → use [`scripts/detect-mode.sh`](scripts/detect-mode.sh) bash shim. If both unavailable (rare), fall back to manual signals via [`references/layer-1-context.md`](references/layer-1-context.md) appendix.

**Optional depth:** for long narrative analysis of the repo's full harness state, invoke:

```
Task design-harnessing:workflow:harness-health-analyzer(
  repo_root: ".",
  detect_json: <output from detect.py>,
  mode: "full"
)
```

Use for deeper audit-style analysis; skip for standard flows.

## Step 2 — Onboard check

If `design-harnessing.local.md` does not exist AND user hasn't shown framework familiarity:

> "New to the five-layer frame?
> A. Run `/hd:onboard` first (5-min intro)
> B. Proceed — I'll explain as we go
> C. Already know it — skip the preamble"

Default to B on silence. Never block.

## Step 3 — Tool discovery

Surface detected `team_tooling` per category + `mcp_servers` from Step 1. If `coexistence.compound_engineering: true`, note once (not a separate step): *"compound-engineering detected — we coexist by default; won't touch its namespace."*

Ask per category for anything detection missed. For each confirmed tool, triage per the integration-path table in [`references/known-mcps.md`](references/known-mcps.md):

- **active** — MCP live in session → offer live pull during later layer scaffolding
- **start-server** — MCP configured but not running → give start command
- **install-walkthrough** — tool in known-MCP table → install command + API-key URL
- **pointer-only** — user-named tool not in known table → record, write pointer files, no install recommended

Universal: only offer MCPs from the known table. Never recommend unknown packages. Never use plug-in-maintainer's own session MCPs on the user's behalf.

## Per-layer procedure (applied to Layers 1–5)

For each of Steps 4–8, run this 5-part cycle:

```
FRAME → explain the layer in one sentence + article § reference
SHOW  → present detect.py signals relevant to this layer
PROPOSE → default action (link / critique / scaffold / skip) per the table below
ASK   → user picks action; record in layer_decisions
EXECUTE → perform chosen action; checkpoint after (optional review / capture / continue)
```

### Default action per detection

| Condition | Default |
|---|---|
| Nothing detected at this layer + no external tooling mentioned | scaffold |
| Team tool detected (e.g., notion for L1) + MCP live in session | scaffold + MCP-pull |
| Team tool detected + MCP not in session | link + install-walkthrough |
| Other-tool harness artifact (e.g., `.agent/rules/*` for L1) | link |
| Existing `docs/<layer>/` file (prior hd-* run) | critique |
| Bloat detected (L1 only) | critique |

Default is a **suggestion**, not enforcement. User picks any of 4 options.

### Post-action checkpoint (friction, Layers 1–4)

After executing an action at a layer, offer before moving on:

```
Layer N [link | critique | scaffold | skip] complete. Before Layer N+1:
  A. Review what landed — /hd:review critique <path> on it
  B. Capture a lesson — /hd:compound capture if something surprised you
  C. Inspect manually — open the file, look around
  D. Continue to Layer N+1
```

Default after silence is D. Users never feel railroaded.

## Step 4 — Layer 1 (Context)

**Frame:** "Layer 1 — Context. What the AI needs every time: product, user, design system, conventions. Semantic memory (article §4a)."

**Show:** detect signals — `has_agent_dir`, `has_ai_docs`, `team_tooling.docs`, `team_tooling.design`, `has_tokens_package`, `has_figma_config`, Tier 1 budget state.

**Propose default** per table above.

**Execute — scaffold:**
- Load [`references/layer-1-context.md`](references/layer-1-context.md) for L1 depth (includes healthy-AGENTS.md patterns)
- Seed questions: (1) product in one sentence? (2) user in one sentence? (3) biggest design constraint? (4) design-system source of truth?
- If "I don't know" → offer Material 3 / Fluent 2 / awesome-design-md baselines + user's README/package.json
- Write 4 sub-files from [`assets/context-skeleton/`](assets/context-skeleton/) templates
- Enforce Tier 1 budget per [`references/tier-budget-model.md`](references/tier-budget-model.md): `AGENTS.md` + `product/one-pager.md` combined ≤ 200 lines

**Execute — link:** write pointer files under `docs/context/<subtopic>/` referencing external source (e.g., `See [Notion — PLUS product](<url>)` or `See [.agent/rules/100-project-context.md](path)`).

**Execute — critique:** apply bloat-detection checks from [`references/tier-budget-model.md`](references/tier-budget-model.md). Surface findings. Don't write.

## Step 5 — Layer 2 (Skills)

**Frame:** "Layer 2 — Skills. AI capabilities your team codifies. Procedural memory (article §4b)."

**Show:** `has_external_skills`, `has_claude_dir`, `.agent/skills/` presence.

**Propose default:**
- `has_external_skills: true` → **critique** via skill-quality rubric
- `.agent/skills/` → **link**
- Nothing → **skip** (Layer 2 is premature for most teams)

**Execute — critique:** per-skill invocation:

```
Task design-harnessing:review:skill-quality-auditor(
  skill_md_path: "<path>/SKILL.md"
)
```

Aggregate findings. Present to user. Don't modify anything.

**Execute — scaffold:** seed questions: (1) workflow explained 3+ times last month? (2) repetitive task worth automating? Point user at [`references/layer-2-skills.md`](references/layer-2-skills.md) for authoring discipline.

## Step 6 — Layer 3 (Orchestration)

**Frame:** "Layer 3 — Orchestration. How skills + handoffs flow. Procedural memory (article §4c)."

**Show:** `team_tooling.pm` (linear / github_issues / jira), `team_tooling.diagramming`, GitHub Actions in `.github/workflows/`.

**Propose default:**
- `team_tooling.pm` present → **link** (orchestration lives in PM tool labels)
- `team_tooling.diagramming` → **link** to sequence/state diagrams
- Fewer than 3 Layer 2 skills → **skip**

**Execute — scaffold:** seed questions: (1) 3–5 steps from idea to shipped? (2) most common handoff that breaks? See [`references/layer-3-orchestration.md`](references/layer-3-orchestration.md) for L3 depth.

## Step 7 — Layer 4 (Rubrics)

**Frame:** "Layer 4 — Rubrics. Taste embedded as checks. Distributed pattern (article §4d)."

**Show:** `has_tokens_package`, `has_figma_config`, existing `docs/rubrics/` or `docs/context/design-system/` rubric files.

**Propose default:**
- `has_tokens_package` or `has_figma_config` → **scaffold** design-system-compliance rubric referencing actual tokens
- `has_external_skills` → **scaffold** skill-quality rubric entry
- Nothing → **scaffold** starter trio: accessibility + design-system + component-budget

**Execute — scaffold:**
- Load [`references/layer-4-rubrics.md`](references/layer-4-rubrics.md) for L4 depth (why distributed, INDEX.md pattern)
- Seed questions (open-ended first): (1) first thing you check when reviewing? (2) mistake seen twice? (3) one bar new designer should clear?
- If "no clear criteria yet" → offer baselines: Material 3 / Fluent 2 / awesome-design-md / starters in [`../hd-review/assets/starter-rubrics/`](../hd-review/assets/starter-rubrics/)
- Write `docs/rubrics/INDEX.md` from [`assets/rubrics-index.md.template`](assets/rubrics-index.md.template)
- Copy user-selected starters into `docs/context/design-system/` or `docs/rubrics/` for customization

**Execute — critique:** invoke:

```
Task design-harnessing:review:rubric-applicator(
  work_item_path: <user-provided>,
  rubric_path: <rubric file>
)
```

## Step 8 — Layer 5 (Knowledge)

**Frame:** "Layer 5 — Knowledge. What the team has learned. Episodic memory + graduated procedural (article §4e)."

**Show:** `has_plans_convention` + count, existing lessons count, graduation count, `team_tooling.docs` (for retros) and `team_tooling.pm` (for closed-issue decisions).

**Propose default:**
- `has_plans_convention: true` → **critique** — invoke `graduation-candidate-scorer` on existing lessons
- `team_tooling.docs` + MCP live → **scaffold** + offer to pull retro/post-mortem/decision-labeled pages
- Nothing → **scaffold** empty lessons dir from [`assets/knowledge-skeleton/`](assets/knowledge-skeleton/)

**Execute — critique:** invoke:

```
Task design-harnessing:analysis:graduation-candidate-scorer(
  lessons_root: "docs/knowledge/lessons/",
  graduated_log: "docs/knowledge/graduations.md"
)
```

Surface ready clusters to user. Suggest `/hd:compound graduate-propose <topic>` for each.

**Execute — scaffold:**
- Load [`references/layer-5-knowledge.md`](references/layer-5-knowledge.md) for L5 depth
- Seed questions: (1) 3 decisions in last 6 months new hire should know? (2) mistake you want to prevent recurring? (3) pattern across 3+ projects worth formalizing?
- Write `docs/knowledge/INDEX.md`, `docs/knowledge/graduations.md`, 1 starter lesson

## Step 9 — Write `design-harnessing.local.md`

Schema v2 spec: [`references/local-md-schema.md`](references/local-md-schema.md). Template: [`assets/design-harnessing.local.md.template`](assets/design-harnessing.local.md.template).

Populate:
- `schema_version: "2"`, `setup_mode`, `setup_date`, `team_size`
- `skipped_layers`, `coexistence`, `article_read`
- `team_tooling`, `mcp_servers_at_setup`, `layer_decisions`
- `other_tool_harnesses_detected`

Atomic write (temp file + `mv`).

## Step 10 — Summarize + suggest next

Report:
- **Layer decisions table** (5 rows: layer → choice → evidence)
- **Tier 1 budget snapshot** (`wc -l AGENTS.md docs/context/product/one-pager.md | tail -1`)
- **Other-tool harnesses respected** (paths untouched)
- **Next step** tuned to outcome:
  - Mostly scaffold → `/hd:compound capture` to record first lesson
  - Mostly link → `/hd:review audit` to audit the combined harness
  - Mostly critique → address findings; re-run `/hd:review audit`

## Re-run semantics

When invoked on a repo that has `design-harnessing.local.md`:
1. Read prior `layer_decisions`, `skipped_layers`, `team_tooling`
2. For each layer, start from prior decision; offer "revisit" or "keep"
3. Don't re-propose `skipped_layers` unless `--reset-skips`
4. Never overwrite user content — re-runs are additive-only

## Failure modes

- **F1 Tool-discovery loop** — user can't decide. Skip; `team_tooling: {}`; note in prose.
- **F2 MCP install** — only recommend from [`references/known-mcps.md`](references/known-mcps.md). Unknown → pointer-only.
- **F3 Other-tool harness conflict** — **link, don't absorb**. Pointer file, never modify.
- **F4 User stuck on seed questions** — Material 3 / Fluent 2 / awesome-design-md fallbacks. Still stuck → minimal placeholder + revisit-note.
- **F5 Destructive action** — always show diff preview; require explicit confirmation; never silent.

## What this skill does NOT do

- **Concept Q&A** → `/hd:onboard`
- **Ongoing lesson capture** → `/hd:compound`
- **Harness audit** → `/hd:review`
- **Invoke other hd skills directly** — always suggest, never invoke
- **Modify `.agent/`, `.claude/`, `.codex/`, external `.cursor/skills/`, `.windsurf/`** — strict coexistence
- **Write to `docs/solutions/`** (compound's namespace)
- **Recommend unknown MCPs** — see [`references/known-mcps.md`](references/known-mcps.md)

## Coexistence

- ✅ Reads other-tool harnesses + external tooling for detection + link targets
- ✅ Writes pointer files (`docs/<layer>/...` containing `See [external]`) when link chosen
- ❌ Never writes to `docs/solutions/`
- ❌ Never uses `compound-engineering.local.md`
- ❌ No "conflict / rivalry / vs." language
- ✅ Cross-plug-in Task calls fully-qualified: `Task compound-engineering:research:learnings-researcher(...)`

See [`references/coexistence-checklist.md`](references/coexistence-checklist.md).

## Reference files

### Layer guides (loaded on demand per layer)
- [layer-1-context.md](references/layer-1-context.md) — L1 depth incl. healthy AGENTS.md patterns
- [layer-2-skills.md](references/layer-2-skills.md)
- [layer-3-orchestration.md](references/layer-3-orchestration.md)
- [layer-4-rubrics.md](references/layer-4-rubrics.md) — incl. INDEX.md template
- [layer-5-knowledge.md](references/layer-5-knowledge.md) — incl. lesson YAML

### Shared
- [tier-budget-model.md](references/tier-budget-model.md)
- [coexistence-checklist.md](references/coexistence-checklist.md)
- [local-md-schema.md](references/local-md-schema.md) — schema v2 spec
- [known-mcps.md](references/known-mcps.md) — 6-category tool map + known-MCP install table

## Assets

- [AGENTS.md.template](assets/AGENTS.md.template)
- [design-harnessing.local.md.template](assets/design-harnessing.local.md.template) (schema v2)
- [rubrics-index.md.template](assets/rubrics-index.md.template)
- [context-skeleton/](assets/context-skeleton/)
- [knowledge-skeleton/](assets/knowledge-skeleton/)
- [platform-stubs/](assets/platform-stubs/) — redirect stubs for scattered mode

## Scripts

- `scripts/detect.py` — canonical detector (schema v2 JSON)
- `scripts/detect-mode.sh` — bash shim → detect.py

## Sub-agents invoked

- `design-harnessing:workflow:harness-health-analyzer` — deep narrative analysis (Step 1 optional)
- `design-harnessing:analysis:graduation-candidate-scorer` — L5 cluster scoring (Step 8 critique)
- `design-harnessing:review:skill-quality-auditor` — L2 skill audit (Step 5 critique)
- `design-harnessing:review:rubric-applicator` — L4 rubric application (Step 7 critique)
