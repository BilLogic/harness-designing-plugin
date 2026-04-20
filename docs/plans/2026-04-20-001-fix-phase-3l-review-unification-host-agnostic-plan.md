---
title: "Phase 3l — review unification + host-agnostic execution + 3k.13 completion"
type: fix
status: active
date: 2026-04-20
---

# Phase 3l — review unification + host-agnostic execution

Post-3k iteration. Live execution testing across 5 Codex repos on 2026-04-20 (cornerstone, lightning, caricature, oracle-chat, plus-uno-starter-kit) surfaced three classes of issues: incomplete 3k.13 cleanup, host-specific rendering gaps, and vocabulary friction around "audit vs critique." Testing log lives inline in the conversation transcript (no separate requirements doc).

## Problem summary

**P1 — 3k.13 cleanup is incomplete.** Retiring per-layer INDEX.md files was half-done. Layer 5 scaffold spec contradicts shipped templates; `hd:maintain capture` still tries to update a retired file; setup SKILL.md points to a "Preview table format" section that was never written.

**P1 — review execution is host-gated.** `/hd:review` depends on Claude Code's `Task` tool for Batch 1 + Batch 2 dispatch. On Codex (uses `/agent` + MCP) and Cursor (uses their subagents API), our `Task design-harnessing:*` syntax doesn't resolve; skill stalls at Batch 1, renders nothing. The agent logic is all markdown — every host can evaluate criteria inline, we just never wrote that path.

**P2 — vocabulary is confusing.** "audit vs critique" modal is abstract. Users expect "thorough review across all layers, or target one specific layer?" Default guardrail behavior (auto-skip L1/L2/L3 when existing harness detected) is too blunt — cuts off the value users came for.

**P2 — detector underfits.** Misses `.agents/` (the `s`), `.cursor/skills/`, `.windsurf/`. Reports `layers_present: []` on repos with scattered L1 content that's plainly present.

**P3 — progress bars buried.** ASCII health bars only render in the final review report. Would help far more surfaced after setup's pre-analysis pass and at the start of review.

## Acceptance criteria

### P1 — blockers

- [ ] **3l.1** Zero stale references to per-layer `INDEX.md` files across `skills/**/references/*.md`, `skills/**/SKILL.md`, procedure files, and templates. Canonical L5 scaffold output list locked (`changelog.md`, `decisions.md`, `ideations.md`, `preferences.md`, `lessons/.gitkeep` — no INDEX, no starter lesson). "Preview table format" section written in `per-layer-procedure.md`.
- [ ] **3l.2** `/hd:review` produces the full report (health bars + per-layer findings + cross-layer consistency + hd-config drift) on every host tested: Claude Code, Codex CLI, Cursor IDE, Cursor CLI. Inline serial execution is the baseline. Parallel dispatch becomes an optimization layer that auto-detects host capability.

### P2 — UX

- [ ] **3l.3** `detect.py` schema v4 — probes `.agents/`, `.cursor/skills/`, `.windsurf/`, `.roo/`; content-based L1 detection (PRD-shaped filenames, design-system dirs, tech-stack docs); new `layers_present_scattered[]` field distinguishing scattered from canonical from missing.
- [ ] **3l.4** Guardrail default flips from `skip` → `critique` when existing-harness signal fires. Additive-only invariant preserved (critique reads only; writes still gated on Step 8.5 preview).
- [ ] **3l.6** ASCII health bars render in three places: after setup Phase A pre-analysis, at top of review report (existing), and optionally on demand via `/hd:review snapshot`.
- [ ] **3l.7** Zero `audit` or `critique` references in living prose outside historical files (plans, dated lessons, CHANGELOG below Unreleased). `/hd:review` asks "thorough review across all layers, or review a specific layer?" instead of "audit or critique?"

### P3 — polish

- [ ] **3l.5** `lesson.md.template` includes `memory_type` field. `capture-procedure.md` auto-creates `docs/knowledge/lessons/` with narration when absent.

### Regression bar

- [ ] All 5 previous-testing repos produce coherent reports on Codex with full template rendering (ASCII bars + consistency + drift sections).
- [ ] 6 original pilot repos (sds, plus-marketing-website, caricature, oracle-chat, lightning, plus-uno) still produce coherent reports on Claude Code.
- [ ] Budget check passes: 4 SKILL.md files ≤200 lines, 0 violations.

---

## Per-unit fix notes

### 3l.1 — Finish 3k.13 cleanup

**Canonical L5 scaffold output:**
```
docs/knowledge/
├── changelog.md        # (from template)
├── decisions.md        # (from template)
├── ideations.md        # (from template)
├── preferences.md      # (from template)
└── lessons/
    └── .gitkeep        # empty placeholder
```

No `INDEX.md`. No starter lesson. AGENTS.md Harness map is the sole index.

**Files to update:**
- `skills/hd-setup/references/layer-5-knowledge.md` — remove INDEX.md scaffold mentions; reconcile changelog.md status (scaffolded at setup, not deferred)
- `skills/hd-setup/references/per-layer-procedure.md` — remove INDEX.md from scaffold outputs; **add missing "Preview table format" section** (the one SKILL.md Step 8.5 points to)
- `skills/hd-maintain/references/capture-procedure.md` — drop INDEX.md update step; add optional "append to AGENTS.md L5 Harness map?" prompt
- `skills/hd-setup/assets/knowledge-skeleton/` — verify templates match canonical list; no stray INDEX.md.template
- `skills/hd-setup/assets/context-skeleton/` — verify no INDEX.md.template residue

**Preview table format section to write** (Bill's spec from 3k.3):
```
Layer  Action    Files to write
────────────────────────────────────────────────
L4     critique  (no writes — review only)
L4     scaffold  docs/rubrics/accessibility-wcag-aa.md
                 docs/rubrics/design-system-compliance.md
L5     scaffold  docs/knowledge/changelog.md
                 docs/knowledge/decisions.md
                 docs/knowledge/ideations.md
                 docs/knowledge/preferences.md
                 docs/knowledge/lessons/.gitkeep
AGENTS.md   (always written / merged)
hd-config.md (always written)
────────────────────────────────────────────────
Total: 8 files across 2 layers + 2 root files

Proceed? (y / revise <layer> / cancel)
```

### 3l.2 — Host-agnostic review execution

**Architecture change:**

| Today | After 3l.2 |
|---|---|
| `Task design-harnessing:analysis:harness-auditor(layer: N)` × 5 required | Inline serial evaluation of `review-criteria-l<N>.md` is the baseline |
| Rendering gated behind dispatch completing | Rendering never gates — inline evaluation always produces full report |
| Stalls on Codex/Cursor | Full report on every host |
| No host detection | Detects: Claude (Task), Codex (MCP + /agent), Cursor IDE (subagents API), Cursor CLI (inline only), others (inline only) |
| Parallel is the only mode | Parallel is an optimization flag — same output, shorter wall time |

**Files:**
- `skills/hd-review/references/audit-procedure.md` → renamed to `review-procedure.md` (under 3l.7); rewritten with host-agnostic steps
- `skills/hd-review/references/host-capability-detection.md` — **new** file documenting capability probes + dispatch mapping per host
- `skills/hd-review/SKILL.md` — update dispatch prose; call out "same output on every host"

**Inline evaluation contract:** for each layer 1–5, read `review-criteria-l<N>.md`, gather evidence per check (file reads + regex heuristics), emit the same YAML output shape the parallel agent would. Consistency check (3k.7) remains inline anyway.

**Parallel dispatch layer:** wrapper that, when host supports it, fans out the same per-layer evaluation across sub-agents and merges results. Same criteria, same output shape. Just parallelized.

### 3l.3 — Detector content-awareness (schema v4)

**New probes in `detect.py`:**
```python
OTHER_TOOL_PATHS = [
    ".agent/",
    ".agents/",          # NEW — some teams pluralize
    ".claude/",
    ".codex/",
    ".cursor/",          # any .cursor presence
    ".cursor/skills/",   # specific
    ".windsurf/",        # NEW
    ".roo/",             # NEW (Roo Code)
]
```

**Content-based L1 heuristic:**
- Probe `docs/` for PRD-shaped filenames (`PRD*.md`, `*-prd.md`, `*_PRD.md`)
- Probe for tech-stack docs (`TECH_STACK.md`, `tech-stack.md`, `ARCHITECTURE.md`)
- Probe for design-system directories (`docs/design-system/`, `src/design-system/`, any dir with `tokens.md` + `components.md`)
- If any fire and `docs/context/` is absent → record in `layers_present_scattered: ["L1"]` (not `layers_present: []`)

**Schema bump** — `schema_version: "4"`. Added fields:
- `layers_present_scattered: []` — scattered but present
- `scattered_l1_signals: {prd_files: [...], tech_stack_files: [...], design_system_dirs: [...]}`
- Expanded `other_tool_harnesses_detected[]` entries for new probe paths

### 3l.4 — Retire auto-skip guardrail default

**Before:**
```
Existing harness detected → pre-select skip for L1/L2/L3
```

**After:**
```
Existing harness detected → pre-select critique for L1/L2/L3
Rationale: we review your existing layers + surface improvement suggestions;
we don't modify anything (additive-only still holds).
User can override to skip if they genuinely don't want suggestions.
```

**Files:**
- `skills/hd-setup/references/per-layer-procedure.md` — flip default table
- `skills/hd-setup/references/layer-1-context.md`, `layer-2-skills.md`, `layer-3-orchestration.md` — update default logic
- `skills/hd-setup/SKILL.md` Guardrail section — update narration from "pre-select skip" to "pre-select critique"
- `AGENTS.md` § Rules — update the 2026-04-18 rule to reflect the new default

### 3l.5 — Lesson template + capture bootstrap

**Files:**
- `skills/hd-maintain/assets/lesson.md.template` — add `memory_type: episodic` and `importance: <1-5>` to frontmatter per `lesson-patterns.md`
- `skills/hd-maintain/references/capture-procedure.md` — Step 0: check `docs/knowledge/lessons/` exists; if not, `mkdir -p` + narrate ("Creating `docs/knowledge/lessons/` — first-time setup for the knowledge layer")

### 3l.6 — Surface progress bars

**Three render points:**

1. **After Phase A pre-analysis in `/hd:setup`** (`references/phase-a-pre-analysis.md`):
   ```
   Phase A complete — layer snapshot:

   L1 Context          ████░░░░░░  4.0  scattered content, no canonical tree
   L2 Skills           █████████░  9.0  .agent/skills/ with 7 skills
   L3 Orchestration    ██████░░░░  6.0  workflow docs present, no gate map
   L4 Rubrics          ░░░░░░░░░░  0.0  absent
   L5 Knowledge        ██░░░░░░░░  2.0  docs/solutions/ only

   Walking layers now — default per-layer action based on this snapshot:
   L1 critique · L2 critique · L3 critique · L4 scaffold · L5 scaffold
   ```
2. **Top of `/hd:review` report** — already in place via 3k.4, stays.
3. **On demand via `/hd:review snapshot`** — quick-mode output shows just the bars + one-liner summaries; no full findings.

### 3l.7 — Retire "audit" term

**Renames (functional — coordinate with Git history):**

| Before | After |
|---|---|
| `skills/hd-review/references/audit-criteria-l1-context.md` | `review-criteria-l1-context.md` |
| `audit-criteria-l2-skills.md` | `review-criteria-l2-skills.md` |
| `audit-criteria-l3-orchestration.md` | `review-criteria-l3-orchestration.md` |
| `audit-criteria-l4-rubrics.md` | `review-criteria-l4-rubrics.md` |
| `audit-criteria-l5-knowledge.md` | `review-criteria-l5-knowledge.md` |
| `audit-criteria-budget.md` | `review-criteria-budget.md` |
| `audit-criteria-consistency.md` | `review-criteria-consistency.md` |
| `audit-procedure.md` | `review-procedure.md` |
| `critique-procedure.md` | `targeted-review-procedure.md` |
| `audit-report.md.template` | `review-report.md.template` |
| `critique-response.md.template` | `targeted-review-response.md.template` |
| Lesson output `<date>-harness-audit.md` | `<date>-harness-review.md` |

**Vocabulary updates in living prose:**
- "audit mode" / "critique mode" → "full review" / "targeted review"
- "run an audit" → "run a full review"
- "critique this file" → "review this file"
- `/hd:review` second-turn prompt: "Run a thorough review across all layers, or review one specific layer / file?"

**Agents:**
- `agents/analysis/harness-auditor.md` → keep filename (frontmatter `name: harness-auditor` unchanged, since "auditor" as a persona noun is still sensible — it's the role that does the review). Prose in the agent description updated from "audits one harness layer" → "reviews one harness layer."
- `agents/review/rubric-applier.md` — already correct

**Historical preservation:**
- `docs/plans/*` — no rewrites (audit trail)
- `docs/knowledge/lessons/*` — no rewrites (append-only)
- `CHANGELOG.md` below Unreleased — no rewrites

---

## Implementation order

1. **3l.7** (rename pass) — ~3 hrs. Must run first; the rest depends on file paths.
2. **3l.1** (3k.13 cleanup) — ~2 hrs. Can start as soon as 3l.7 settles.
3. **3l.4** (retire auto-skip) — ~2 hrs. Independent; can run in parallel with 3l.1.
4. **3l.5** (lesson template) — ~30 min. Independent; quick win.
5. **3l.3** (detector content-awareness) — ~3 hrs. Schema v4 bump.
6. **3l.2** (host-agnostic review) — ~half day. Biggest unit; must follow 3l.7 renames.
7. **3l.6** (progress bar surfacing) — ~1 hr. Depends on 3l.2 procedure being in place.

Regression pass: live-test all 5 Codex repos + smoke-test on our own repo.

## Verification

- [ ] `/hd:review` on Codex produces report with ASCII bars + 5 per-layer sections + Cross-layer consistency + hd-config drift
- [ ] `/hd:review` on Claude Code produces same report (parallel dispatch faster, same content)
- [ ] `rg -i "audit" skills/ agents/` returns zero matches in living prose (frontmatter + body)
- [ ] `/hd:setup` on cornerstone reports `layers_present_scattered: ["L1", "L3"]` not `[]`
- [ ] `/hd:setup` in a repo with `.claude/` defaults Layer 1–3 to `critique`, not `skip`
- [ ] `/hd:setup` Phase A renders the 5-row health snapshot before the layer walk
- [ ] `lesson.md.template` has `memory_type` field
- [ ] Preview table format section resolves from SKILL.md Step 8.5 link
- [ ] Budget check: 4 skills, 0 violations
- [ ] 6 original pilot repos regression bar maintained

## Out of scope

- New layer (5 stays the ceiling)
- Auto-fixing review findings (read-only invariant)
- Rewriting historical plans / lessons / CHANGELOG with new vocabulary
- `harness-auditor` → `harness-reviewer` agent rename (keep — "auditor" is a legitimate persona name)
- Figma / design-deliverable critique (still out of plugin scope)
