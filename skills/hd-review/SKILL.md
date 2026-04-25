---
name: hd:review
description: Reviews harness health (full) or targets one layer/file (targeted). Writes dated report; emits summary with health bars + priorities in chat.
argument-hint: "[full | <file-path-or-url> [--rubric <name>] | snapshot]"
---

# hd:review — review your harness (full or targeted)

## Interaction method

**Output destinations.** Every `/hd:review` run writes the full report to a dated markdown file and emits a rich summary in chat. Chat summary carries the visualization (ASCII health bars, priorities table, cross-layer signals). Deep findings live in the file.

**Host-agnostic by construction.** File write works on every host (Claude Code, Codex CLI, Cursor IDE/CLI, Windsurf, any terminal). Chat summary works everywhere the transcript does. No Task dispatch is required — it's an optional speed-up for the evaluation phase on hosts that support parallel sub-agents.

**Narrate rationale inline** at each major step (preflight, per-layer evaluation, synthesis, write, summary). Users shouldn't have to ask "what's going on?"

## Single job

Review harness health — either in full (every layer + cross-layer + budgets) or targeted (one layer, one file, or one rubric). One skill, two scopes of the IMPROVE family.

## Protected artifacts

Declares protected paths so any external review/cleanup tool leaves our artifacts alone:

```yaml
<protected_artifacts>
- docs/design-solutions/**
- docs/knowledge/**
- docs/context/**
- docs/plans/**
- docs/rubrics/**
- AGENTS.md
- hd-config.md
- loading-order.md
- skills/**
- agents/**
</protected_artifacts>
```

Multiple review tools can run on the same repo without modifying each other's outputs.

## Mode detection

- Bare `/hd:review` or `/hd:review full` → **full review** (default)
- `/hd:review snapshot` → **snapshot** (bars-only chat output, no file write)
- `/hd:review targeted <path> [--rubric <name>]` → **targeted review**
- `/hd:review <path>` (bare path, no verb) → ask *"Run a full review across all layers, or a targeted review of `<path>`?"*

Default is full review. Ambiguous input asks scope (full vs targeted), never legacy "audit vs critique" vocabulary.

## Workflow checklist (per mode)

### Full review

```
hd:review full Progress:
- [ ] Step 1: Preflight — run budget-check.sh + detect.py; diff vs hd-config.md
- [ ] Step 2: Per-layer evaluation (inline serial baseline; parallel when host supports it)
- [ ] Step 3: Cross-layer consistency check (inline)
- [ ] Step 4: Synthesize findings + cross-check against <protected_artifacts>
- [ ] Step 5: Render full report; atomic write to docs/knowledge/reviews/<date>-harness-review.md
- [ ] Step 6: Emit rich chat summary (bars + priorities + cross-layer signals)
- [ ] Step 7: Suggest next
```

**Per-layer evaluation:** for each layer 1–5, load `review-criteria-l<N>.md`, gather evidence, emit YAML findings. Baseline is inline serial (any host). Parallel dispatch (Claude Task, Codex /agent, Cursor subagents) runs the same evaluation concurrently when available.

→ See [references/review-procedure.md](references/review-procedure.md) for full step detail.

**Snapshot mode:** `/hd:review snapshot` — ~30s preflight-only pass. Emits bars-only table + overall score; no file write, no deep layer reads.

### Targeted review

```
hd:review targeted Progress:
- [ ] Step 1: Parse target + optional --rubric
- [ ] Step 2: Resolve rubric path (starter / user-defined)
- [ ] Step 3: Evaluate — SKILL.md target → skill-quality-auditor; otherwise → rubric-applier (inline or parallel)
- [ ] Step 4: Aggregate findings per targeted-review-format.md
- [ ] Step 5: Emit inline summary; write targeted report only if user confirms
```

→ See [references/targeted-review-procedure.md](references/targeted-review-procedure.md) for full step detail.

## Output shape

### File — always written by full review

Path: `docs/knowledge/reviews/<date>-harness-review.md`

Template: [`assets/review-report.md.template`](assets/review-report.md.template). Carries per-layer findings with evidence, recommendations, consistency findings, hd-config drift, agent list, meta.

### Chat summary — always emitted

Rich summary with Unicode box-drawing tables. Mandatory sections:

```
Review complete · Full report: docs/knowledge/reviews/<date>-harness-review.md

═══════════════════════════════════════════════════════════════════

Harness health — <score> / 10 (<state>)

Layer              Bar          Score   State
─────────────────  ───────────  ──────  ───────────────────────────
L1 Context         ████████░░    8.0    <one-line summary>
L2 Skill Curation  ██░░░░░░░░    2.0    <one-line summary>
L3 Orchestration   ██████░░░░    6.0    <one-line summary>
L4 Evaluation      ████░░░░░░    4.0    <one-line summary>
L5 Knowledge       █████░░░░░    5.0    <one-line summary>

═══════════════════════════════════════════════════════════════════

Top priorities

Sev  #    Layer    Finding                                      Effort
───  ───  ───────  ───────────────────────────────────────────  ──────
P1   1    L2       <one-line>                                   S
P1   2    L1       <one-line>                                   S
P2   3    L4       <one-line>                                   M

═══════════════════════════════════════════════════════════════════

Cross-layer signals

Signal           Status    Evidence
───────────────  ────────  ─────────────────────────────────────
hd-config.md     <status>  <evidence>
Consistency      <n>       <evidence>

═══════════════════════════════════════════════════════════════════

Next · <one-line next-step suggestion>
```

Rules: ASCII bars always shown. Tables preferred over bullets for structured data. Box-drawing `═` as section dividers, `─` inside tables. No emoji, no color codes.

## What this skill does NOT do

- **Scaffold harness** → `/hd:setup`
- **Concept Q&A** → `/hd:learn`
- **Capture lessons** → `/hd:maintain capture` (suggestion, not invocation)
- **Modify source work items** during targeted review (read-only)
- **Modify rubric files** (both modes — rubrics are team-owned)
- **Write to `docs/solutions/`** (reserved for other tools)

## Coexistence

- ✅ Reads our namespace + rubric files + user-specified work items
- ✅ Writes ONLY to `docs/knowledge/reviews/<date>-harness-review.md` (full review)
- ❌ Never writes to other plug-ins' namespaces
- ❌ Never modifies other plug-ins' config files
- `<protected_artifacts>` block declares our outputs as read-only for external review/cleanup tools
- Cross-plug-in Task calls fully-qualified

## Compact-safe mode

When context budget is tight: full review collapses to `snapshot` mode (bars-only, no file write). Targeted review applies fewer rubrics. No plan-hash mechanism (hd-review is read-mostly).

## Parallel dispatch — optional speed-up

When the host supports sub-agent dispatch (Claude `Task`, Codex `/agent`, Cursor subagents API), per-layer evaluation fans out in parallel (≤5 agents per batch). Otherwise runs inline serial. Output file + chat summary are identical regardless of mode.

## Reference files

- [references/review-procedure.md](references/review-procedure.md) — full review step sequence (preflight → per-layer → consistency → synthesize → file + summary)
- [references/targeted-review-procedure.md](references/targeted-review-procedure.md) — targeted review sequence
- [references/review-criteria-l1-context.md](references/review-criteria-l1-context.md) through `review-criteria-l5-knowledge.md` + `review-criteria-budget.md` + `review-criteria-consistency.md` — per-scope health criteria
- [references/bloat-detection.md](references/bloat-detection.md) — concrete thresholds
- [references/drift-detection.md](references/drift-detection.md) — stale-file + rule-adoption-drought signals
- [references/targeted-review-format.md](references/targeted-review-format.md) — targeted review output shape
- [references/rubric-application.md](references/rubric-application.md) — rubric → work-item mapping + resolution order
- [references/rubric-authoring-guide.md](references/rubric-authoring-guide.md) — authoring custom rubrics

## Assets

- [assets/review-report.md.template](assets/review-report.md.template) — full-review output file format
- [assets/targeted-review-response.md.template](assets/targeted-review-response.md.template) — targeted review response format
- [assets/starter-rubrics/](assets/starter-rubrics/) — 14 shipped rubrics with `## Scope & Grounding` sections

## Scripts

- `scripts/budget-check.sh` — deterministic always-loaded + SKILL.md budget enforcement; emits JSON

## Sub-agents dispatched (when host supports parallel)

All Task calls use fully-qualified names in the `harness-designing:` namespace. Never dispatches into other plug-ins' namespaces.

**Full review** — Batch 1 (parallel, 5): `harness-designing:analysis:harness-auditor` × 5 (one per layer). Batch 2 (parallel, 2–3): `harness-designing:analysis:rubric-recommender` + `harness-designing:research:lesson-retriever` + conditional `harness-designing:analysis:coexistence-analyzer` (when `other_tool_harnesses_detected[]` non-empty).

**Targeted review** — `harness-designing:review:skill-quality-auditor` for `SKILL.md` targets; `harness-designing:review:rubric-applier` for all other targets (batch-parallel ≤5). Optional external agents from `hd-config.md:review_agents` (empty default).
