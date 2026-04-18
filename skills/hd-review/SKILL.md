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

This skill respects and declares the coexistence contract. Our output paths are protected from modification by other review tools (e.g., `/ce:review` from compound-engineering):

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

Pattern from compound's `ce-review/SKILL.md` protected-artifacts. Both plug-ins can audit the same repo without modifying each other's outputs.

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
- [ ] Step 1: Load agent list from hd-config.md
- [ ] Step 2: Count agents; auto-switch to serial if ≥6
- [ ] Step 3: Run harness-health-analyzer sub-agent (opens the report)
- [ ] Step 4: Run skill-quality-auditor per skill (L2 health check)
- [ ] Step 5: Run graduation-candidate-scorer (L5 drift check)
- [ ] Step 6: Run budget-check.sh for deterministic budget data
- [ ] Step 7: Dispatch review agents (parallel or serial)
- [ ] Step 8: Synthesize findings + cross-check against <protected_artifacts>
- [ ] Step 9: Render report per template
- [ ] Step 10: Atomic write to docs/knowledge/lessons/harness-audit-YYYY-MM-DD.md
- [ ] Step 11: Summarize + suggest next
```

Load-from-config → dispatch sub-agents (parallel ≤5 / serial ≥6) → synthesize with protected-artifacts cross-check → atomic write one dated audit lesson → summarize.
→ See [references/audit-procedure.md](references/audit-procedure.md) for full procedure

**Quick mode:** `/hd:review audit mode:quick` — ~30s scan based on `detect.py` signals + `hd-config.md` only (no deep file reads, no file writes). Use as preflight before a full audit or as a CI check. See [references/audit-procedure.md § Mode: quick](references/audit-procedure.md#mode-quick).

### Critique mode

```
hd:review critique Progress:
- [ ] Step 1: Parse target work item + optional --rubric
- [ ] Step 2: Resolve rubric path (starter / user-defined)
- [ ] Step 3: Dispatch appropriate applicator (skill-quality-auditor OR rubric-applicator)
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
- **Write to `docs/solutions/`** (compound's namespace)

## Coexistence

- ✅ Reads our namespace + rubric files + user-specified work items
- ✅ Writes ONLY to `docs/knowledge/lessons/harness-audit-*.md` (audit mode)
- ❌ Never writes to compound's namespace
- ❌ Never modifies compound's config files
- `<protected_artifacts>` block (above) protects our outputs from `/ce:review`
- Cross-plug-in Task calls fully-qualified

## Compact-safe mode

When context budget is tight:
- Audit → auto-switch to serial (≥ 3 agents → serial in compact mode)
- Critique → apply fewer rubrics (skip ones requiring deep file reads)
- Hash mechanisms: N/A (hd-review doesn't use plan-hash; read-mostly)

## Reference files

- [references/audit-procedure.md](references/audit-procedure.md) — full audit-mode step sequence (Steps 1–11)
- [references/critique-procedure.md](references/critique-procedure.md) — full critique-mode step sequence (Steps 1–5)
- [references/audit-criteria.md](references/audit-criteria.md) — five-layer health criteria + severity framework
- [references/bloat-detection.md](references/bloat-detection.md) — concrete thresholds + scripts
- [references/drift-detection.md](references/drift-detection.md) — stale-file + graduation-drought signals
- [references/critique-format.md](references/critique-format.md) — critique output shape
- [references/rubric-application.md](references/rubric-application.md) — rubric → work-item mapping + resolution order

## Assets

- [assets/audit-report.md.template](assets/audit-report.md.template) — audit output format
- [assets/critique-response.md.template](assets/critique-response.md.template) — critique output format
- [assets/starter-rubrics/](assets/starter-rubrics/) — 12 shipped rubrics:
  - `accessibility-wcag-aa.md` — WCAG 2.1 AA + Fluent 2 + Material 3 a11y
  - `design-system-compliance.md` — token + variant adherence
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
  - Users extend by authoring new rubric check files at `docs/rubrics/<name>.md` (NOT `docs/context/design-system/` — that's Layer 1 source content)

## Scripts

- `scripts/budget-check.sh` — deterministic Tier 1 + SKILL.md budget enforcement; emits JSON

## Sub-agents invoked

- `design-harnessing:workflow:harness-health-analyzer` — narrative 5-layer health (audit Step 3)
- `design-harnessing:review:skill-quality-auditor` — per-skill rubric (audit Step 4 + critique on SKILL.md)
- `design-harnessing:analysis:graduation-candidate-scorer` — L5 drift detection (audit Step 5)
- `design-harnessing:review:rubric-applicator` — generic rubric → work item (critique default)
- `compound-engineering:research:learnings-researcher` — always-run during audit (Step 7)
- Other `compound-engineering:review:*` agents per user config (Step 7)
