---
title: Per-layer procedure (FRAME → SHOW → PROPOSE → ASK → EXECUTE)
loaded_by: hd-setup
---

## Purpose

The shared 5-part cycle applied to Layers 1–5 at Steps 4–8 of `hd:setup`. Defines default-action dispatch, the link-mode contract (extract-and-pointer), the post-layer checkpoint, and the Preview table format used at Step 8.5. Load when walking any layer.

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

### Default action per detection (post-3l.4)

| Condition | Default |
|---|---|
| **Existing harness detected** + layer is L1/L2/L3 | **review** (review existing content + surface improvement suggestions; additive-only) |
| **Existing harness detected** + layer is L4/L5 | scaffold (typical genuine gap) |
| Nothing detected at this layer + no external tooling mentioned | scaffold |
| Team tool detected (e.g., notion for L1) + MCP live in session | scaffold + MCP-pull |
| Team tool detected + MCP not in session | link + install-walkthrough |
| Other-tool harness artifact (e.g., `.agent/rules/*` for L1) | link |
| Existing `docs/<layer>/` file (prior hd-* run) | review |
| Bloat detected (L1 only) | review |

Default is a **suggestion**, not enforcement. User picks any of 4 options (link / review / scaffold / skip).

**Rationale for review-by-default on L1/L2/L3 when harness exists (3l.4).** Users running `/hd:setup` on a repo with an existing harness came for help improving it — not to be told "you already have this, we'll ignore it." Default shifts from `skip` to `review`: we review their existing layers read-only and surface suggestions. They can still override to `skip` if they genuinely don't want suggestions. Additive-only invariant holds: review writes nothing, and any user-approved scaffolding goes through Step 8.5 preview first.

### Link-mode contract — extract + pointer (all layers)

When any layer chooses **link**, write a pointer file using [`../assets/pointer-file.md.template`](../assets/pointer-file.md.template). The pointer must include a **3–5 line extracted summary** of the source content in plain prose — not just a bare `See [path]` reference. Pointer files should be useful standalone; the source provides full detail.

Read the source (via MCP if live, filesystem read for local paths, or pasted content from user for URLs without MCP), extract the summary, fill the template, write with explicit confirmation. Step 4 (Layer 1) includes a concrete example.

### Post-action checkpoint (friction, Layers 1–4)

After executing an action at a layer, offer before moving on:

```
Layer N [link | review | scaffold | skip] complete. Before Layer N+1:
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
L1     link       (no writes — pointer file only)
L1     review   (no writes — review only)
L1     scaffold   docs/context/product/one-pager.md
                  docs/context/design-system/components/cheat-sheet.md
L4     scaffold   docs/rubrics/accessibility-wcag-aa.md
                  docs/rubrics/design-system-compliance.md
L5     scaffold   docs/knowledge/changelog.md
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
- `link` and `review` rows show `(no writes — …)` to make the zero-write intent explicit
- AGENTS.md and hd-config.md always appear at the bottom (always written/merged)
- Total line summarizes scope
- Prompt offers three options: `y` (proceed), `revise <layer>` (go back to that layer's step), `cancel` (abort without any write)

**No INDEX.md in the scaffold output.** Per 3k.13, AGENTS.md Harness map is the sole master index. L5 scaffold writes the 4 canonical files + empty `lessons/` only.

**No starter lesson in the scaffold output.** Lessons come via `/hd:maintain capture`.

→ Return to [../SKILL.md § Workflow checklist](../SKILL.md#workflow-checklist)
