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
| Team tool detected + MCP not in session | scaffold + install-walkthrough |
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
