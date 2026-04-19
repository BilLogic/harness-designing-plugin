---
name: hd:review
description: Audits harness health or applies team rubrics to a work item. Use for harness health checks or single-item design critique.
argument-hint: "audit | critique <file-path-or-url> [--rubric <name>]"
---

# hd:review — improve your harness (audit + critique)

## Interaction method

Default: dispatch via Task tool for audit mode; inline response for critique mode. If `AskUserQuestion` is unavailable (non-Claude hosts), fall back to numbered-list prompts. **Read-only by design** — audit writes exactly one dated lesson file; critique writes nothing.

## Single job

Audit harness health (audit mode) OR apply Layer 4 rubric(s) to a work item (critique mode). One skill, two verbs of the IMPROVE family.

## Protected artifacts

Declares protected paths so any external review/cleanup tool leaves our artifacts alone:

```yaml
<protected_artifacts>
- docs/design-solutions/**
- docs/knowledge/**
- docs/context/**
- AGENTS.md
- hd-config.md
- skills/**
</protected_artifacts>
```

Multiple review tools can audit the same repo without modifying each other's outputs.

## Mode detection

| User says… / invokes… | Mode |
|---|---|
| "Audit my harness" / `/hd:review audit` | **audit** |
| "Review this design" / `/hd:review critique <path> [--rubric <name>]` | **critique** |

Ambiguous → ask: *"Audit the harness itself, or critique a specific work item?"*

## Workflow checklist (per mode)

### Audit mode

```
hd:review audit Progress:
- [ ] Step 1: Load agent list from hd-config.md; run budget-check.sh
- [ ] Step 2: BATCH 1 (parallel) — harness-auditor × 5 (one per layer 1–5)
- [ ] Step 3: BATCH 2 (parallel) — rubric-recommender + lesson-retriever + (conditional) coexistence-analyzer
- [ ] Step 4: Inline parse budget-check.sh JSON
- [ ] Step 5: Synthesize findings + cross-check against <protected_artifacts>
- [ ] Step 6: Render report per template
- [ ] Step 7: Atomic write to docs/knowledge/lessons/<date>-harness-audit.md
- [ ] Step 8: Summarize + suggest next
```

Two-batch parallel dispatch, each batch ≤5 agents (≥6 parallel strains context; we split into 2 batches to stay safe). Batch 1 fans out across layers; Batch 2 covers rubric gaps + lesson corpus + optional coexistence. Inline `budget-check.sh` parse. Synthesize with protected-artifacts cross-check → atomic write one dated audit lesson.
→ See [references/audit-procedure.md](references/audit-procedure.md) for full procedure

**Quick mode:** `/hd:review audit mode:quick` — ~30s scan based on `detect.py` signals + `hd-config.md` only (no deep file reads, no file writes). Dispatches a single `harness-auditor` in aggregate mode. Use as preflight before a full audit or as a CI check. See [references/audit-procedure.md § Mode: quick](references/audit-procedure.md#mode-quick).

### Critique mode

```
hd:review critique Progress:
- [ ] Step 1: Parse target work item(s) + optional --rubric
- [ ] Step 2: Resolve rubric path (starter / user-defined)
- [ ] Step 3: Dispatch — SKILL.md target → skill-quality-auditor; otherwise → rubric-applier (batch-parallel ≤5 if multiple)
- [ ] Step 4: Aggregate findings per critique-format.md
- [ ] Step 5: Emit inline; zero file writes
```

Parse target + rubric → resolve rubric path → dispatch applicator sub-agent → aggregate findings → emit inline (zero writes).
→ See [references/critique-procedure.md](references/critique-procedure.md) for full procedure

## What this skill does NOT do

- **Scaffold harness** → `/hd:setup`
- **Concept Q&A** → `/hd:learn`
- **Capture lessons** → `/hd:maintain capture` (suggestion, not invocation)
- **Modify source work items** during critique (read-only)
- **Modify rubric files** (both modes — rubrics are team-owned)
- **Write to `docs/solutions/`** (reserved for other tools)

## Coexistence

- ✅ Reads our namespace + rubric files + user-specified work items
- ✅ Writes ONLY to `docs/knowledge/lessons/harness-audit-*.md` (audit mode)
- ❌ Never writes to other plug-ins' namespaces
- ❌ Never modifies other plug-ins' config files
- `<protected_artifacts>` block (above) declares our outputs as read-only for external review/cleanup tools
- Cross-plug-in Task calls fully-qualified

## Compact-safe mode

When context budget is tight:
- Audit → collapse to `mode:quick` (single `harness-auditor` aggregate, no deep reads)
- Critique → apply fewer rubrics (skip ones requiring deep file reads)
- Hash mechanisms: N/A (hd-review doesn't use plan-hash; read-mostly)

## Parallel→serial auto-switch

Each dispatch batch stays ≤5 agents (6+ parallel strains context). Audit splits into two batches of ≤5 to stay under the cap; critique batches up to 5 rubric-applier calls in parallel and falls back to serial at 6+.

## Reference files

- [references/audit-procedure.md](references/audit-procedure.md) — full audit-mode step sequence (2-batch dispatch)
- [references/critique-procedure.md](references/critique-procedure.md) — full critique-mode step sequence (Steps 1–5)
- [references/audit-criteria-l1-context.md](references/audit-criteria-l1-context.md) through `audit-criteria-l5-knowledge.md` + `audit-criteria-budget.md` — per-scope health criteria + severity framework (cross-tool coexistence checks live in the `coexistence-analyzer` agent spec)
- [references/bloat-detection.md](references/bloat-detection.md) — concrete thresholds + scripts
- [references/drift-detection.md](references/drift-detection.md) — stale-file + rule-adoption-drought signals
- [references/critique-format.md](references/critique-format.md) — critique output shape
- [references/rubric-application.md](references/rubric-application.md) — rubric → work-item mapping + resolution order

## Assets

- [assets/audit-report.md.template](assets/audit-report.md.template) — audit output format
- [assets/critique-response.md.template](assets/critique-response.md.template) — critique output format
- [assets/starter-rubrics/](assets/starter-rubrics/) — 14 shipped rubrics (each with `## Scope & Grounding` per 3i.8):
  - `accessibility-wcag-aa.md` — WCAG 2.1 AA + Fluent 2 + Material 3 a11y
  - `design-system-compliance.md` — token + variant adherence (managed-DS pre-fills: antd, chakra, mui, mantine)
  - `component-budget.md` — new-primitive RFC gate
  - `skill-quality.md` — 9-point Layer 2 skill health check (applied by `skill-quality-auditor` sub-agent)
  - `interaction-states.md` — loading / empty / error / success state coverage
  - `heuristic-evaluation.md` — Nielsen 10 usability heuristics
  - `typography.md` — type scale + pairing + hierarchy + OpenType
  - `color-and-contrast.md` — OKLCH + contrast + tinted neutrals + dark-mode
  - `spatial-design.md` — spacing + proximity + grids + rhythm
  - `motion-design.md` — reduced-motion + duration + easing + purpose
  - `ux-writing.md` — error/empty/success copy + voice + banned phrases
  - `responsive-design.md` — mobile-first + fluid + touch targets + safe area
  - `telemetry-display.md` — IoT / hardware / real-time-data (freshness, device-state, alerts)
  - `i18n-cjk.md` — bilingual / CJK-primary products (dual-script, IME states, fontstack)
  - Users extend by authoring new rubric check files at `docs/rubrics/<name>.md`. See `references/rubric-authoring-guide.md`.

## Scripts

- `scripts/budget-check.sh` — deterministic Tier 1 + SKILL.md budget enforcement; emits JSON

## Sub-agents invoked

All dispatch uses fully-qualified Task names. We stay within `design-harnessing:` and do not dispatch into other plug-ins' namespaces by default.

**Audit mode — BATCH 1 (parallel, 5 agents):**
- `design-harnessing:analysis:harness-auditor` × 5 — one per layer (`layer: 1` through `layer: 5`), `scenario: audit`

**Audit mode — BATCH 2 (parallel, 2–3 agents):**
- `design-harnessing:analysis:rubric-recommender` — L4 gap finding (`scenario: audit-gap-finding`)
- `design-harnessing:research:lesson-retriever` — L5 cluster corpus scan
- `design-harnessing:analysis:coexistence-analyzer` — conditional; dispatched only when `other_tool_harnesses_detected` is non-empty

**Audit mode — quick:**
- Single `design-harnessing:analysis:harness-auditor` in aggregate mode (reads `detect.py` JSON + `hd-config.md` only)

**Critique mode:**
- `design-harnessing:review:skill-quality-auditor` — targets whose path ends in `SKILL.md` (batch-parallel if multiple SKILLs passed)
- `design-harnessing:review:rubric-applier` — all other targets (batch-parallel ≤5 if multiple rubrics)

**Cross-plug-in (optional user config):**
- Users may list external agents in `hd-config.md:review_agents`; those are dispatched with fully-qualified Task names, one entry per external agent. Empty by default.
