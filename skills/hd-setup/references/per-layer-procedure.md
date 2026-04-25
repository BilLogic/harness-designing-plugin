---
title: Per-layer procedure (FRAME → SHOW → PROPOSE → ASK → EXECUTE)
loaded_by: hd-setup
---

## Purpose

The shared 5-part cycle applied to Layers 1–5 at Steps 4–8 of `hd:setup`. Defines default-action dispatch, the scaffold-mode contract (extract-and-pointer), the post-layer checkpoint, and the Preview table format used at Step 8.5. Load when walking any layer.

## Per-layer procedure (applied to Layers 1–5)

For each of Steps 4–8, run this 5-part cycle:

```
FRAME → explain the layer in one sentence + article § reference
SHOW  → present detect.py signals relevant to this layer
PROPOSE → default action from Phase A's pre-computed proposal table (see SKILL.md § Phase A)
ASK   → user picks action; record in layer_decisions
EXECUTE → perform chosen action; checkpoint after (optional review / capture / continue)
```

**PROPOSE step sourcing.** The default action shown to the user at each layer is looked up from the Phase A synthesis table (Batch 1 `harness-auditor × 5` + Batch 2 `rubric-recommender`). No new agent dispatch happens at the PROPOSE step. The per-detection default table below is the *fallback* when Phase A was skipped OR when the Phase A agent returned inconclusive.

### Default action per detection (post-3m.2)

| Condition | Default |
|---|---|
| **Existing harness detected** + layer has **non-trivial content** (≥1 per-layer check ≠ `content_status: missing`) | **review** (review existing content + surface improvement suggestions; additive-only) |
| **Existing harness detected** + layer is **nominal-only** (all per-layer checks report `content_status: missing`) | **create** (nothing of substance to review — propose the canonical tree) |
| **Existing harness detected** + layer is L4/L5 | create (typical genuine gap) |
| Nothing detected at this layer + no external tooling mentioned | create |
| Team tool detected (e.g., notion for L1) + MCP live in session | create + MCP-pull |
| Team tool detected + no live MCP in session | scaffold + scout-research (Path A of Fill path) |
| Other-tool harness artifact (e.g., `.agent/rules/*` for L1) | scaffold |
| Existing `docs/<layer>/` file (prior hd-* run) | review |
| Bloat detected (L1 only) | review |

Default is a **suggestion**, not enforcement. User picks any of 4 options (scaffold / review / create / skip).

**Rationale for content-gated review default (3m.2).** Users running `/hd:setup` on a repo with a **real** existing harness came for help improving it — `review` defaults pay off there. Users running `/hd:setup` on a repo where the guardrail fires on **nominal-only** signals (e.g. `.claude/settings.local.json` with a few lines but no skills/rules) are effectively greenfield at that layer — reviewing "nothing" produces no useful findings, and `create` is the helpful default. Content substance is the switch: if `harness-auditor` reports ≥1 check with `content_status` better than `missing`, default to `review`; else fall through to `create`. Additive-only invariant preserved either way.

**How Phase A synthesizes this default.** For each layer, the `harness-auditor` sub-agent returns per-check `content_status`. Phase A synthesis logic:

```
non_missing_checks = [c for c in layer.checks if c.content_status != "missing"]
if guardrail_fired and layer in {L1, L2, L3}:
    if len(non_missing_checks) >= 1:
        recommended_action.default = "review"
    else:
        recommended_action.default = "create"
```

### Scaffold-mode contract — extract + pointer (all layers)

When any layer chooses **scaffold**, write a pointer file using [`../assets/pointer-file.md.template`](../assets/pointer-file.md.template). The pointer must include a **3–5 line extracted summary** of the source content in plain prose — not just a bare `See [path]` reference. Pointer files should be useful standalone; the source provides full detail.

Read the source (via MCP if live, filesystem read for local paths, or pasted content from user for URLs without MCP), extract the summary, fill the template, write with explicit confirmation. Step 4 (Layer 1) includes a concrete example.

### Fill path (EXECUTE sub-routine for `create` + `scaffold`, 3n.5)

After user picks `create` or `scaffold` at a layer, offer three equal ways to populate it. Choice is about ergonomics — all three land in the same layer folder.

**Narration template (tune per layer):**

> *"Three ways to fill Layer `<N>` (`<layer-name>`):*
> *A. **Wire up a tool** — name a tool you use (e.g. `<suggested from scan>`) and I'll research whether there's an MCP / CLI / API to feed this layer. I'll link install docs; you install.*
> *B. **Paste or drop files** — paste the raw content (markdown, export, bullets, links) and I'll organize it into the right sub-folders.*
> *C. **Create from scratch** — seeded prompts and I write new files. Classic path."*

**Path A — Wire up a tool** (two sub-paths, 3o.3)

Path A.1 — **named tool research** (user already knows what they want):
1. User names one or more tools (e.g. "notion", "supabase")
2. Dispatch `research:ai-integration-scout` with `mode: research` per tool (batch ≤5 parallel)
3. Report structured findings inline: *"`<tool>` → primary `<category>`, MCP at `<install_docs>`, CLI at `<url>`. Install when ready."*
4. Write pointer file referencing the tool + install docs
5. Record in `hd-config.md:team_tooling.<category>` with `integration: available`

Path A.2 — **classify raw_signals** (user says "classify my deps" or "research the raw signals" — 3o.3):
1. Read `raw_signals.deps` from detect.py output (from Step 1 cached state)
2. Cap at large-batch ceiling (≤50 signals per `/hd:setup` run; if more, ask user to pick top-N)
3. Dispatch `research:ai-integration-scout` with `mode: classify, tool_name: <dep>` per signal (batch ≤5 parallel)
4. Aggregate results by category; skip `framework-internal` + `not-ai-relevant`
5. Report: *"Classified `<M>` deps into `<K>` AI-relevant tools across `<categories>`. Top matches for Layer `<N>`: `<tool1>` (confidence <c>), `<tool2>` (confidence <c>). Which to wire up?"*
6. For user-selected tools, proceed as Path A.1 (pointer file + config entry)

Concrete dispatch example:

```
Task harness-designing:research:ai-integration-scout(
  mode: "classify",
  tool_name: "@aws-amplify/auth",
  context: "l1"
)
```

Returns `{categories: {primary: "data_api", secondary: ["auth"]}, confidence: 0.92, integrations: {...}}`. Cache write-back lands in `known-mcps.md`.

**Path B — Paste or drop files**
1. User pastes content or provides local paths
2. Invoke [`paste-organize.md`](paste-organize.md) helper
3. Classify + structure → preview-before-write → atomic write
4. Record files in `hd-config.md:files_written` + `layer_decisions.files_written`

**Path C — Create from scratch**
1. Walk the layer's existing seeded-prompt flow (see `layer-1-context.md`, `layer-5-knowledge.md`, etc.)
2. Standard create-from-template path

**Defaults.** If `team_tooling` has entries relevant to this layer (via [`known-mcps.md § Per-layer integration patterns`](known-mcps.md#per-layer-integration-patterns)), default to A. If user mentioned pasting content, default to B. Otherwise C.

All three paths share the same preview-before-write gate at Step 8.5 — no writes land without explicit `y` confirmation.

### Post-action checkpoint (friction, Layers 1–4)

After executing an action at a layer, offer before moving on:

```
Layer N [scaffold | review | create | skip] complete. Before Layer N+1:
  A. Review what landed — /hd:review targeted <path> on it
  B. Capture a lesson — /hd:maintain capture if something surprised you
  C. Inspect manually — open the file, look around
  D. Continue to Layer N+1
```

Default after silence is D. Users never feel railroaded.

## Preview table format (Step 8.5)

Before any file write, Step 8.5 renders the proposed-files preview table + asks for explicit confirmation. Format:

```
Layer  Action     Files to write
─────  ─────────  ──────────────────────────────────────────────
L1     scaffold   (no writes — pointer file only)
L1     review     (no writes — review only)
L1     create     docs/context/product/one-pager.md
                  docs/context/design-system/components/cheat-sheet.md
L4     create     docs/rubrics/accessibility-wcag-aa.md
                  docs/rubrics/design-system-compliance.md
L5     create     docs/knowledge/changelog.md
                  docs/knowledge/decisions.md
                  docs/knowledge/ideations.md
                  docs/knowledge/preferences.md
                  docs/knowledge/lessons/.gitkeep
AGENTS.md    (always written / merged with Harness map)
hd-config.md (always written)
─────  ─────────  ──────────────────────────────────────────────

Total: <N> files across <M> layers + 2 root files

Proceed? (y / revise <layer> / cancel)
```

**Rules:**
- Each row shows Layer · Action · Path(s) — multi-path actions use indented continuation rows
- `scaffold` (pointer-only) and `review` rows show `(no writes — …)` to make the zero-write intent explicit
- AGENTS.md and hd-config.md always appear at the bottom (always written/merged)
- Total line summarizes scope
- Prompt offers three options: `y` (proceed), `revise <layer>` (go back to that layer's step), `cancel` (abort without any write)

**No INDEX.md in the create output.** Per 3k.13, AGENTS.md Harness map is the sole master index. L5 create writes the 4 canonical files + empty `lessons/` only.

**No starter lesson in the create output.** Lessons come via `/hd:maintain capture`.

→ Return to [../SKILL.md § Workflow checklist](../SKILL.md#workflow-checklist)
