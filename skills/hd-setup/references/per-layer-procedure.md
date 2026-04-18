---
title: Per-layer procedure (FRAME → SHOW → PROPOSE → ASK → EXECUTE)
loaded_by: hd-setup
---

## Purpose

The shared 5-part cycle applied to Layers 1–5 at Steps 4–8 of `hd:setup`. Defines default-action dispatch, the link-mode contract (extract-and-pointer), and the post-layer checkpoint. Load when walking any layer.

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
| **Guardrail fired** (existing `.agent/` or `.claude/` with content) + layer is L1/L2/L3 | **skip** (existing harness IS this layer) |
| **Guardrail fired** + layer is L4/L5 | scaffold (typical genuine gap) |
| Nothing detected at this layer + no external tooling mentioned | scaffold |
| Team tool detected (e.g., notion for L1) + MCP live in session | scaffold + MCP-pull |
| Team tool detected + MCP not in session | link + install-walkthrough |
| Other-tool harness artifact (e.g., `.agent/rules/*` for L1) | link |
| Existing `docs/<layer>/` file (prior hd-* run) | critique |
| Bloat detected (L1 only) | critique |

Default is a **suggestion**, not enforcement. User picks any of 4 options.

### Link-mode contract — extract + pointer (all layers)

When any layer chooses **link**, write a pointer file using [`../assets/pointer-file.md.template`](../assets/pointer-file.md.template). The pointer must include a **3–5 line extracted summary** of the source content in plain prose — not just a bare `See [path]` reference. Pointer files should be Tier 1 useful standalone; the source provides full detail.

Read the source (via MCP if live, filesystem read for local paths, or pasted content from user for URLs without MCP), extract the summary, fill the template, write with explicit confirmation. Step 4 (Layer 1) includes a concrete example.

### Post-action checkpoint (friction, Layers 1–4)

After executing an action at a layer, offer before moving on:

```
Layer N [link | critique | scaffold | skip] complete. Before Layer N+1:
  A. Review what landed — /hd:review critique <path> on it
  B. Capture a lesson — /hd:maintain capture if something surprised you
  C. Inspect manually — open the file, look around
  D. Continue to Layer N+1
```

Default after silence is D. Users never feel railroaded.

→ Return to [../SKILL.md § Workflow checklist](../SKILL.md#workflow-checklist)
