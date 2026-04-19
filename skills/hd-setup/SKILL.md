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
- [ ] Step 2: Onboard check — suggest /hd:learn if first-time user (soft)
- [ ] Step 3: Tool discovery — surface detected + ask per category
- [ ] Step 4: Layer 1 (Context) — link / critique / scaffold / skip
- [ ] Step 5: Layer 2 (Skills) — link / critique / scaffold / skip
- [ ] Step 6: Layer 3 (Orchestration) — link / critique / scaffold / skip
- [ ] Step 7: Layer 4 (Rubrics) — link / critique / scaffold / skip
- [ ] Step 8: Layer 5 (Knowledge) — link / critique / scaffold / skip
- [ ] Step 9: Write hd-config.md (schema v2)
- [ ] Step 10: Summarize decisions + suggest next skill
```

Steps 4–8 each follow the shared per-layer cycle. See [`references/per-layer-procedure.md`](references/per-layer-procedure.md) for the FRAME → SHOW → PROPOSE → ASK → EXECUTE contract, default-action table, link-mode extract-and-pointer rule, and post-layer checkpoint.

## Guardrail — additive-only when existing harness detected

Before Step 1 completes, check: does this repo already have an AI harness?

**Positive-harness signals (any one triggers guardrail):** `.agent/` with ≥1 skill or rule file, `.claude/` with skills or settings, `AGENTS.md` ≥ 20 lines of real content, `docs/context/` populated, `docs/knowledge/` populated, compound-engineering artifacts (`compound-engineering.local.md` OR `docs/solutions/`).

If any signal fires:

1. **Announce additive-only mode.** Say: *"Detected existing harness at `<paths>`. I'll operate additive-only — won't modify `CLAUDE.md`, `AGENTS.md`, `.agent/`, `.claude/`, or any existing `docs/context/`, `docs/knowledge/`, `docs/rubrics/` file. New files only."*
2. **Adjust per-layer defaults** for Steps 4/5/6: pre-select **skip** (the existing harness IS Layer 1/2/3). User can override to critique/scaffold per layer, but the friction is flipped.
3. **Keep Steps 7/8 defaults** (Layer 4 rubrics + Layer 5 knowledge) — these are typically the genuine gap.
4. **Emit into `hd-config.md`** `other_tool_harnesses_detected: [{path, owner: user, policy: respect}, ...]` listing every pre-existing artifact so future `/hd:review` calls can parse + respect.

This is a rule (see [AGENTS.md § Rules](../../AGENTS.md#rules)), confirmed across 4 pilots (plus-marketing, oracle-chat, lightning, plus-uno) with 6-pilot additive-only discipline intact.

## Step 1 — Detect

Run [`scripts/detect.py`](scripts/detect.py). Emits JSON schema v2 per [`references/hd-config-schema.md`](references/hd-config-schema.md). Parse and retain all fields: `mode`, `signals.*`, `coexistence.compound_engineering`, `mcp_servers[]`, `team_tooling.*`, `other_tool_harnesses_detected[]`.

If python3 unavailable → use [`scripts/detect-mode.sh`](scripts/detect-mode.sh) bash shim. If both unavailable (rare), fall back to manual signals via [`references/layer-1-context.md`](references/layer-1-context.md) appendix.

Deep analysis is handled by Phase A (below), not here — Step 1 is the deterministic signal dump only.

## Step 2 — Onboard check

If `hd-config.md` does not exist AND user hasn't shown framework familiarity:

> "New to the five-layer frame?
> A. Run `/hd:learn` first (5-min intro)
> B. Proceed — I'll explain as we go
> C. Already know it — skip the preamble"

Default to B on silence. Never block.

## Phase A — parallel pre-analysis

Runs AFTER Step 2 and BEFORE Step 3. Pre-computes per-layer proposals (link / critique / scaffold / skip) so Phase B (Steps 4–8) feels informed rather than interrogative.

- **Batch 1** (parallel, 5 agents): `design-harnessing:analysis:harness-auditor` × 5 — one per layer, `scenario: setup-pre-analysis`
- **Batch 2** (parallel, 1 agent): `design-harnessing:analysis:rubric-recommender` — rubric-gap ranking + starter-trio recommendation

Each batch stays ≤5 agents (compound v2.39.0: 6+ parallel crashes context). Outputs synthesize into a per-layer default table consumed by Phase B. Non-Claude hosts skip Phase A and fall back to the per-detection default table in [`per-layer-procedure.md`](references/per-layer-procedure.md).

→ See [`references/phase-a-pre-analysis.md`](references/phase-a-pre-analysis.md) for full dispatch detail, synthesis schema, and Guardrail interaction.

## Step 3 — Tool discovery

Surface detected `team_tooling` + `mcp_servers` from Step 1. If `coexistence.compound_engineering: true`, note once: *"compound-engineering detected — we coexist by default; won't touch its namespace."*

Solo-dispatch `design-harnessing:research:lesson-retriever` with `topic: "tool-discovery"` to surface past tool-adoption lessons. Skip when `docs/knowledge/lessons/` is empty.

Ask **one batched question** across all 6 categories (docs/wiki, design, diagramming, analytics, PM/issues, comms) with the detected list and category examples. Use "you (or contributors)" framing. Parse free-text reply; map to categories via [`references/known-mcps.md`](references/known-mcps.md). For each confirmed tool, triage per that file's integration-path table: **active** / **start-server** / **install-walkthrough** / **pointer-only**.

Only offer MCPs from the known table. Never recommend unknown packages. Never use plug-in-maintainer's own session MCPs on the user's behalf.

## Phase B — Steps 4–8 (interactive, inline)

Each step uses Phase A's pre-computed proposal as PROPOSE. No new Task dispatches for the default; execution is inline. Targeted dispatches live in per-layer references.

- **Step 4 — Layer 1 (Context).** Semantic memory. Scaffold under `docs/context/`; link writes pointer files with 3–5 line extracted summaries; critique applies bloat-detection. → [layer-1-context.md](references/layer-1-context.md)
- **Step 5 — Layer 2 (Skills).** Procedural memory. Default typically **skip** or **critique** via `review:skill-quality-auditor`. → [layer-2-skills.md](references/layer-2-skills.md)
- **Step 6 — Layer 3 (Orchestration).** Handoffs across PM tools. Default **link** when PM tool detected, **skip** when <3 skills. → [layer-3-orchestration.md](references/layer-3-orchestration.md)
- **Step 7 — Layer 4 (Rubrics).** Default from `rubric-recommender`: if AI-docs > 200 lines → **critique + extract** via `review:rubric-extractor` (batch ≤5); else **scaffold** starter trio. `rubric-applier` (apply-mode) is `/hd:review critique` territory, not here. Rubrics live in `docs/rubrics/`. → [layer-4-rubrics.md](references/layer-4-rubrics.md)
- **Step 8 — Layer 5 (Knowledge).** Default from Phase A's L5 auditor; deep critique re-uses `analysis:rule-candidate-scorer` (solo) when `has_plans_convention`. → [layer-5-knowledge.md](references/layer-5-knowledge.md)

## Step 9 — Write `hd-config.md`

Schema v2 spec: [`references/hd-config-schema.md`](references/hd-config-schema.md). Template: [`assets/hd-config.md.template`](assets/hd-config.md.template).

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
  - Mostly scaffold → `/hd:maintain capture` to record first lesson
  - Mostly link → `/hd:review audit` to audit the combined harness
  - Mostly critique → address findings; re-run `/hd:review audit`

## Re-run semantics

When invoked on a repo that has `hd-config.md`:
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

- Concept Q&A → `/hd:learn`; lesson capture → `/hd:maintain`; audit → `/hd:review`
- Invoke other hd skills directly — always suggest, never invoke
- Modify `.agent/`, `.claude/`, `.codex/`, external `.cursor/skills/`, `.windsurf/` — strict coexistence
- Write to `docs/solutions/` (compound's namespace) or recommend MCPs outside [`references/known-mcps.md`](references/known-mcps.md)

## Coexistence

Reads other-tool harnesses + external tooling for detection + link targets; writes pointer files when link chosen. Never writes to `docs/solutions/`, never uses `compound-engineering.local.md`, no rivalry language. All Task calls stay in our own namespace (`Task design-harnessing:<cat>:<name>(...)`) — we do not invoke `compound-engineering:*` tasks. See [`references/coexistence-checklist.md`](references/coexistence-checklist.md).

## Reference files

- [per-layer-procedure.md](references/per-layer-procedure.md) — shared FRAME/SHOW/PROPOSE/ASK/EXECUTE cycle + default-action table + link-mode contract + checkpoint
- Layer guides (concept + procedure + depth): [layer-1-context.md](references/layer-1-context.md) (healthy AGENTS.md patterns + Tier-1 budget model + Step 4 procedure), [layer-2-skills.md](references/layer-2-skills.md) (+ Step 5 procedure), [layer-3-orchestration.md](references/layer-3-orchestration.md) (+ Step 6 procedure), [layer-4-rubrics.md](references/layer-4-rubrics.md) (INDEX.md template + Step 7 procedure), [layer-5-knowledge.md](references/layer-5-knowledge.md) (lesson YAML + Step 8 procedure)
- Shared: [coexistence-checklist.md](references/coexistence-checklist.md), [hd-config-schema.md](references/hd-config-schema.md) (schema v2), [known-mcps.md](references/known-mcps.md) (6-category tool map + install table)

## Assets

- [AGENTS.md.template](assets/AGENTS.md.template)
- [hd-config.md.template](assets/hd-config.md.template) (schema v2)
- [rubrics-index.md.template](assets/rubrics-index.md.template)
- [context-skeleton/](assets/context-skeleton/)
- [knowledge-skeleton/](assets/knowledge-skeleton/)
- [platform-stubs/](assets/platform-stubs/) — redirect stubs for scattered mode

## Scripts

- `scripts/detect.py` — canonical detector (schema v2 JSON)
- `scripts/detect-mode.sh` — bash shim → detect.py

## Sub-agents invoked

Fully-qualified `design-harnessing:<category>:<agent>` Task names only (compound 2.35.0). Each parallel batch stays ≤5 (compound v2.39.0).

- **Phase A Batch 1** — `analysis:harness-auditor` × 5 (one per layer, `scenario: setup-pre-analysis`)
- **Phase A Batch 2** — `analysis:rubric-recommender` (scenario: setup-pre-analysis)
- **Step 3** — `research:lesson-retriever` (solo, topic: tool-discovery)
- **Step 5 critique** — `review:skill-quality-auditor` (solo or batch ≤5)
- **Step 7 critique+extract** — `review:rubric-extractor` (batch ≤5 across AI-doc targets)
- **Step 8 critique** — `analysis:rule-candidate-scorer` (solo, when `has_plans_convention`)

`review:rubric-applier` is NOT dispatched here — `/hd:review critique` owns apply-mode.
