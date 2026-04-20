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
- [ ] **3l.2** `/hd:review` writes the full report to `docs/knowledge/reviews/<date>-harness-review.md` and emits a rich chat summary (ASCII health bars + priorities table + cross-layer signals) on every host tested: Claude Code, Codex CLI, Cursor IDE, Cursor CLI. File write is the canonical output — chat summary is derivative. Parallel dispatch stays as an optional speed-up for the evaluation phase, not a requirement.

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

### 3l.2 — File-first reporting (host-agnostic by construction)

**Key reframe.** Review writes the full report to a dated md file. Chat emits a rich summary with the visualization (ASCII bars + tables). Host-parity question dissolves — every host can write files.

**Architecture change:**

| Today | After 3l.2 |
|---|---|
| Full report text emitted inline in chat transcript | Full report written to `docs/knowledge/reviews/<date>-harness-review.md` |
| Rendering gated behind `Task` dispatch | Rendering is a file write — no dispatch dependency |
| Stalls on Codex/Cursor because Task doesn't resolve | File-write works on every host; same output everywhere |
| Chat shows entire report (eats context) | Chat shows summary only: health bars + top priorities + cross-layer signals + path |
| Parallel dispatch is required | Parallel dispatch is an *optional* speed-up for the evaluation phase (not rendering) |

**Output destinations:**
- **File:** `docs/knowledge/reviews/<date>-harness-review.md` (full template — per-layer findings with evidence, recommendations, agent list, meta)
- **Chat:** rich summary — see below

**Chat summary spec (tables + dividers, not bullets):**

```
Review complete · Full report: docs/knowledge/reviews/<date>-harness-review.md

═══════════════════════════════════════════════════════════════════

Harness health — <score> / 10 (<state>)

Layer              Bar          Score   State
─────────────────  ───────────  ──────  ───────────────────────────
L1 Context         ████████░░    8.0    <one-line summary>
L2 Skill Curation  ██░░░░░░░░    2.0    <one-line summary>
L3 Orchestration   ██████░░░░    6.0    <one-line summary>
L4 Rubric Setting  ████░░░░░░    4.0    <one-line summary>
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

Next · address P1s before ship · full findings + evidence in file
```

**Rules:**
- ASCII bars mandatory in summary (the at-a-glance visualization Bill called "eye-catching")
- Tables preferred over bullets for structured data (priorities, cross-layer signals)
- Box-drawing `═` chars as section dividers, `─` for table row separators
- No emoji, no color codes, no zero-width characters — pure Unicode
- Summary length is whatever carries the required info; no line cap
- Full file always co-exists at the cited path; user opens for deep dive

**Files:**
- `skills/hd-review/references/audit-procedure.md` → renamed to `review-procedure.md` (under 3l.7); rewritten to write file + emit summary
- `skills/hd-review/SKILL.md` — update output-destination language; no Task gating
- `skills/hd-review/assets/audit-report.md.template` → renamed to `review-report.md.template` (under 3l.7); same content; lives only in the file now

**Inline evaluation contract:** for each layer 1–5, read `review-criteria-l<N>.md`, gather evidence per check (file reads + regex heuristics), emit the YAML output shape. Consistency + drift checks run inline. Same logic whether host dispatches in parallel or serial.

**Parallel dispatch (optional speed-up):** wrapper that, when host supports it, fans out per-layer evaluation across sub-agents and merges results. Cuts wall time. Does NOT change output.

**New directory:** `docs/knowledge/reviews/` — review outputs live here (separate from `docs/knowledge/lessons/` which stays for real episodic captures via `/hd:maintain capture`).

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

### 3l.6 — Surface progress bars (tables + dividers)

**Three render points, all using the same table format:**

**1. After Phase A pre-analysis in `/hd:setup`** (`references/phase-a-pre-analysis.md`):

```
═══════════════════════════════════════════════════════════════════

Phase A complete — layer snapshot

Layer              Bar          Score   State
─────────────────  ───────────  ──────  ───────────────────────────
L1 Context         ████░░░░░░    4.0    scattered, no canonical tree
L2 Skill Curation  █████████░    9.0    .agent/skills/ with 7 skills
L3 Orchestration   ██████░░░░    6.0    workflow docs, no gate map
L4 Rubric Setting  ░░░░░░░░░░    0.0    absent
L5 Knowledge       ██░░░░░░░░    2.0    docs/solutions/ only

═══════════════════════════════════════════════════════════════════

Proposed per-layer action (override any row to change)

Layer  Action     Rationale
─────  ─────────  ───────────────────────────────────────────────
L1     critique   scattered content — review + suggest canonical map
L2     critique   existing skills — surface skill-quality findings
L3     critique   workflows implicit — propose explicit gates
L4     scaffold   absent — starter trio + scope-and-grounding
L5     scaffold   thin — full knowledge structure
```

Summary only — not written to any file (setup writes per-layer scaffolds later, gated by Step 8.5 preview).

**2. In `/hd:review` chat summary** — the full summary spec from 3l.2 (file writes go to `docs/knowledge/reviews/<date>-harness-review.md`; chat shows bars + priorities + cross-layer).

**3. On demand via `/hd:review snapshot`** — quick-mode, bars-only output (no priorities, no cross-layer, no file write):

```
═══════════════════════════════════════════════════════════════════

Harness health — <score> / 10 (<state>)

Layer              Bar          Score   State
─────────────────  ───────────  ──────  ───────────────────────────
L1 Context         ████░░░░░░    4.0    <one-line>
L2 Skill Curation  █████████░    9.0    <one-line>
L3 Orchestration   ██████░░░░    6.0    <one-line>
L4 Rubric Setting  ░░░░░░░░░░    0.0    <one-line>
L5 Knowledge       ██░░░░░░░░    2.0    <one-line>

═══════════════════════════════════════════════════════════════════

Run `/hd:review` for full findings + evidence
```

**Rules applied consistently across all 3 render points:**
- Table layout for layer snapshot (Layer / Bar / Score / State columns)
- Box-drawing `═` for section dividers, `─` for in-table row separators
- Bars: `blocks_filled = round(health_score)`, filled = `█`, empty = `░`
- No emoji, no color codes — Unicode box-drawing only

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

- [ ] `/hd:review` on Codex writes `docs/knowledge/reviews/<date>-harness-review.md` (full template) AND emits chat summary with bars + priorities table + cross-layer table + dividers
- [ ] `/hd:review` on Claude Code produces same file + same chat summary (parallel dispatch faster on the evaluation phase, same output)
- [ ] `/hd:review snapshot` emits bars-only chat output, writes nothing
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
