---
name: hd:setup
description: Walks the five-layer design harness layer by layer. Detects existing harnesses + tools, offers per-layer scaffold / review / create / skip. Use to set up or revisit any repo.
argument-hint: "[--reset-skips | --discover-tools | --from-review <path>]"
---

# hd:setup — walk your design harness, layer by layer

## Interaction method

Use `AskUserQuestion` for branching decisions (option A/B/C/D per layer). If unavailable (non-Claude hosts), fall back to numbered-list prompts. **Never take destructive action without explicit confirmation** (scenario F4). **Never modify other-tool harnesses** (`.agent/`, `.claude/`, `.codex/`, external `.cursor/skills/`).

## Single job

Walk the five-layer harness in order. At each layer, detect existing material (other-tool harnesses, external tooling, MCP configs, prior hd-* content) and offer four choices:

- **scaffold** — point at existing source, wrap structure around it (pointer file from `docs/<layer>/`; original untouched)
- **review** — apply relevant rubric; surface findings; user decides per-finding
- **create** — start from scratch with seeded prompts; write new layer files
- **skip** — record in `skipped_layers`; re-runs don't re-propose unless `--reset-skips`

User drives every decision. Skill never merges, absorbs, or overwrites external harnesses.

## Workflow checklist

```
hd:setup Progress:
- [ ] Step 1: Detect — run detect.py; parse JSON
- [ ] Step 2: Onboard check — suggest /hd:learn if first-time user (soft)
- [ ] Step 3: Tool discovery — surface detected + ask per category
- [ ] Step 3.5: Scaffold mode — additive (default when existing harness) vs use-standard
- [ ] Step 4: Layer 1 (Context) — scaffold / review / create / skip
- [ ] Step 5: Layer 2 (Skills) — scaffold / review / create / skip
- [ ] Step 6: Layer 3 (Orchestration) — scaffold / review / create / skip
- [ ] Step 7: Layer 4 (Rubrics) — scaffold / review / create / skip
- [ ] Step 8: Layer 5 (Knowledge) — scaffold / review / create / skip
- [ ] Step 8.5: Proposed-files preview — show table; user confirms before any write
- [ ] Step 9: Write hd-config.md (schema v3)
- [ ] Step 10: Summarize decisions + suggest next skill
```

Steps 4–8 each follow the shared per-layer cycle. See [`references/per-layer-procedure.md`](references/per-layer-procedure.md) for the FRAME → SHOW → PROPOSE → ASK → EXECUTE contract, default-action table, scaffold-mode extract-and-pointer rule, and post-layer checkpoint.

## Guardrail — additive-only when existing harness detected

**Signals:** `.agent/` / `.agents/` with ≥1 skill/rule, `.claude/` with skills/settings, `.cursor/skills/` or `.windsurf/`, `AGENTS.md` ≥20 lines of real content, populated `docs/context/` or `docs/knowledge/`, or any other-tool harness flagged by `detect.py`.

If any signal fires: announce additive-only mode (no modification of existing harness artifacts); pre-select **review** for L1/L2/L3 when the layer has non-trivial content, else fall through to **create** (3m.2); keep L4/L5 defaults; emit `other_tool_harnesses_detected` into `hd-config.md` listing every artifact so `/hd:review` respects them.

**Why content-gated default?** A repo with real `.agent/skills/` + `docs/` benefits from review (surface improvement suggestions). A repo whose guardrail only fires on a nominal `.claude/settings.local.json` has nothing to review — create is the helpful default. `harness-auditor` emits `content_status` per check; Phase A synthesis uses it to pick review vs create. Skip remains a user-choice override in all cases.

Rule (see [AGENTS.md § Rules](../../AGENTS.md#rules)), confirmed across 4 pilots — additive-only discipline intact.

## Step 1 — Detect

Run [`scripts/detect.py`](scripts/detect.py). Emits JSON schema v3 per [`references/hd-config-schema.md`](references/hd-config-schema.md). Parse and retain all fields: `mode`, `signals.*` (includes `other_tool_harnesses_detected[]` and `compound_installed`), `mcp_servers[]`, `team_tooling.*`.

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

Runs AFTER Step 2 and BEFORE Step 3. Pre-computes per-layer proposals (scaffold / review / create / skip) so Phase B (Steps 4–8) feels informed rather than interrogative.

- **Batch 1** (parallel, 5 agents): `design-harnessing:analysis:harness-auditor` × 5 — one per layer, `scenario: setup-pre-analysis`
- **Batch 2** (parallel, 1 agent): `design-harnessing:analysis:rubric-recommender` — rubric-gap ranking + starter-trio recommendation

Each batch stays ≤5 agents (6+ parallel strains context). Outputs synthesize into a per-layer default table consumed by Phase B. Non-Claude hosts skip Phase A and fall back to the per-detection default table in [`per-layer-procedure.md`](references/per-layer-procedure.md).

→ See [`references/phase-a-pre-analysis.md`](references/phase-a-pre-analysis.md) for full dispatch detail, synthesis schema, and Guardrail interaction.

## Step 3 — Tool discovery

Surface detected `team_tooling` + `mcp_servers` from Step 1. If any `other_tool_harnesses_detected` entries are present, note once: *"Other-tool harness(es) detected at `<paths>` — we coexist by default; won't touch those namespaces."*

Solo-dispatch `design-harnessing:research:lesson-retriever` with `topic: "tool-discovery"` to surface past tool-adoption lessons. Skip when `docs/knowledge/lessons/` is empty.

Ask **one batched question** across all 6 categories (docs/wiki, design, diagramming, analytics, PM/issues, comms) with the detected list and category examples. Use "you (or contributors)" framing. Parse free-text reply; map to categories via [`references/known-mcps.md`](references/known-mcps.md). For each confirmed tool, triage per that file's integration-path table: **active** / **start-server** / **install-walkthrough** / **pointer-only**.

Only offer MCPs from the known table. Never recommend unknown packages. Never use plug-in-maintainer's own session MCPs on the user's behalf.

## Step 3.5 — Structure mode (3k.11)

**Narrate:** *"Before we walk the layers, pick how to arrange any new files."* Offer two modes:

- **A. Additive** (default when existing harness detected). Leave existing structure untouched; new files land alongside what's already there.
- **B. Use standard.** Lay down the canonical tree per [`references/standard-harness-structure.md`](references/standard-harness-structure.md). Default when greenfield.

Record in `hd-config.md:scaffold_mode` so later `/hd:review` runs know which structural contract to review against.

## Phase B — Steps 4–8 (interactive, inline)

Each step uses Phase A's pre-computed proposal as PROPOSE. No new Task dispatches for the default; execution is inline. Targeted dispatches live in per-layer references.

- **Step 4 — Layer 1 (Context).** Semantic memory. Create under `docs/context/`; scaffold writes pointer files with 3–5 line extracted summaries; review applies bloat-detection. → [layer-1-context.md](references/layer-1-context.md)
- **Step 5 — Layer 2 (Skills).** Procedural memory. Default typically **skip** or **review** via `review:skill-quality-auditor`. → [layer-2-skills.md](references/layer-2-skills.md)
- **Step 6 — Layer 3 (Orchestration).** Handoffs across PM tools. Default **scaffold** when PM tool detected, **skip** when <3 skills. → [layer-3-orchestration.md](references/layer-3-orchestration.md)
- **Step 7 — Layer 4 (Rubrics).** Default from `rubric-recommender`: if AI-docs > 200 lines → **review + extract** via `review:rubric-extractor` (batch ≤5); else **create** starter trio. `rubric-applier` (apply-mode) is `/hd:review review` territory, not here. Rubrics live in `docs/rubrics/`. → [layer-4-rubrics.md](references/layer-4-rubrics.md)
- **Step 8 — Layer 5 (Knowledge).** Default from Phase A's L5 auditor; deep review re-uses `analysis:rule-candidate-scorer` (solo) when `has_plans_convention`. → [layer-5-knowledge.md](references/layer-5-knowledge.md)

## Step 8.5 — Proposed-files preview (3k.3)

Before any file write, render a proposed-files table (layer → action → paths), state the total count, and ask *"Proceed? (y / revise `<layer>` / cancel)"*. Only an explicit `y` advances to Step 9. `revise L<N>` returns to that layer's step; `cancel` aborts without any write.

**Narrate:** *"Showing the full write list first so you can catch surprises before anything lands."* → See [`references/per-layer-procedure.md § Preview table format`](references/per-layer-procedure.md) for the exact rendering.

## Step 9 — Write `hd-config.md`

Schema v3 spec: [`references/hd-config-schema.md`](references/hd-config-schema.md). Template: [`assets/hd-config.md.template`](assets/hd-config.md.template).

Populate:
- `schema_version: "3"`, `setup_mode`, `setup_date`, `team_size`
- `skipped_layers`, `article_read`
- `team_tooling`, `mcp_servers_at_setup`, `layer_decisions`
- `other_tool_harnesses_detected`

Atomic write (temp file + `mv`).

## Step 10 — Summarize + suggest next

Report:
- **Layer decisions table** (5 rows: layer → choice → evidence)
- **Always-loaded budget snapshot** (run `bash skills/hd-review/scripts/budget-check.sh | jq .always_loaded_lines`)
- **Other-tool harnesses respected** (paths untouched)
- **Next step** tuned to outcome:
  - Mostly create → `/hd:maintain capture` to record first lesson
  - Mostly scaffold → `/hd:review` to review the combined harness
  - Mostly review → address findings; re-run `/hd:review`

## `--from-review` mode (3m.3)

`/hd:setup --from-review <path-to-review-file>` skips Phase A (already ran when the review was produced), extracts write-style findings from the review file, and merges them into Step 8.5 preview as `from-review`-tagged rows. User confirms per the usual `y / revise / cancel` gate.

Extraction heuristic: recommendations containing `"add <path>"`, `"create <path>"`, `"promote <src> to <dest>"`, `"trim/update/tighten <path>"` produce diff rows. Non-actionable findings are skipped. Closes the review → setup loop while preserving preview-before-write safety.

## Re-run semantics

When invoked on a repo that has `hd-config.md`:
1. Read prior `layer_decisions`, `skipped_layers`, `team_tooling`
2. For each layer, start from prior decision; offer "revisit" or "keep"
3. Don't re-propose `skipped_layers` unless `--reset-skips`
4. Never overwrite user content — re-runs are additive-only

## Failure modes

- **F1** Tool-discovery loop → skip, `team_tooling: {}`, note in prose
- **F2** MCP install → only recommend from [`references/known-mcps.md`](references/known-mcps.md); unknown → pointer-only
- **F3** Other-tool harness conflict → scaffold, don't absorb; never modify
- **F4** User stuck on seed questions → Material 3 / Fluent 2 / awesome-design-md fallbacks; still stuck → minimal placeholder
- **F5** Destructive action → always show diff preview; require explicit confirmation; never silent

## What this skill does NOT do

- Concept Q&A → `/hd:learn`; lesson capture → `/hd:maintain`; review → `/hd:review`
- Invoke other hd skills directly — always suggest, never invoke
- Modify `.agent/`, `.claude/`, `.codex/`, external `.cursor/skills/`, `.windsurf/` — strict coexistence
- Write to `docs/solutions/` (reserved for other tools) or recommend MCPs outside [`references/known-mcps.md`](references/known-mcps.md)

## Coexistence

Reads other-tool harnesses + external tooling for detection + link targets; writes pointer files when link chosen. Never writes to `docs/solutions/`, never uses another plug-in's config file, no rivalry language. All Task calls stay in our own namespace (`Task design-harnessing:<cat>:<name>(...)`) — we do not invoke other plug-ins' Task namespaces.

## Reference files

- [per-layer-procedure.md](references/per-layer-procedure.md) — FRAME/SHOW/PROPOSE/ASK/EXECUTE cycle + default-action table + scaffold-mode contract + Step 8.5 preview format
- [phase-a-pre-analysis.md](references/phase-a-pre-analysis.md) — parallel dispatch + health snapshot render
- Layer guides: `layer-1-context.md` through `layer-5-knowledge.md` under `references/` (per-layer depth + procedure)
- **Standard:** [standard-harness-structure.md](references/standard-harness-structure.md) (canonical tree), [standard-agent-categories.md](references/standard-agent-categories.md) (5 categories)
- Shared: [hd-config-schema.md](references/hd-config-schema.md), [known-mcps.md](references/known-mcps.md)

## Assets + scripts

- `assets/AGENTS.md.template` — master-index (harness map + agent persona)
- `assets/hd-config.md.template` — schema v4 config
- `assets/context-skeleton/` · `assets/knowledge-skeleton/` · `assets/platform-stubs/`
- `scripts/detect.py` — canonical detector (schema v4 JSON); `scripts/detect-mode.sh` — bash shim

## Sub-agents invoked

Fully-qualified `design-harnessing:<category>:<agent>` Task names only; each parallel batch ≤5.

- Phase A — `analysis:harness-auditor` × 5 + `analysis:rubric-recommender` (scenario: `setup-pre-analysis`)
- Step 3 — `research:lesson-retriever` (solo, topic: tool-discovery)
- Per-layer review actions — `review:skill-quality-auditor` (L2), `review:rubric-extractor` (L4 extract), `analysis:rule-candidate-scorer` (L5 when `has_plans_convention`)

`review:rubric-applier` is owned by `/hd:review` targeted mode, not dispatched here.
