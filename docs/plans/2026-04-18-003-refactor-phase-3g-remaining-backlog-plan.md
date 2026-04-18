---
title: "Phase 3g — remaining backlog: hd-setup slimming, article corpus, MCP scoping, mode:quick wiring, vocabulary reconciliation, two-session regression"
type: refactor
status: active
date: 2026-04-18
origin: docs/plans/2026-04-18-002-refactor-phase-3f-skill-test-findings-plan.md
---

# Phase 3g — remaining backlog

Closes the 6 items deferred from Phase 3f. Scope: 5 fix units (G1–G5) + 1 validation exercise (G6). Branch: `claude/elegant-euclid`.

## G1 — `hd-setup/SKILL.md` slimming

**File:** `skills/hd-setup/SKILL.md` (currently 407 lines; target ≤200)

Only SKILL.md left over the 200-line soft cap after Phase 3f. Same pattern as F5: move per-step procedures out to references, keep SKILL.md as router + guardrail + workflow checklist + reference list.

**New references to create:**
- `skills/hd-setup/references/per-layer-procedure.md` — the FRAME → SHOW → PROPOSE → ASK → EXECUTE cycle + default action table + link-mode contract + checkpoint (currently lines 100–144)
- `skills/hd-setup/references/step-4-layer-1-context.md` — full L1 procedure (currently lines 146–183)
- `skills/hd-setup/references/step-5-layer-2-skills.md` — full L2 procedure (lines 184–206)
- `skills/hd-setup/references/step-6-layer-3-orchestration.md` — full L3 procedure (lines 207–219)
- `skills/hd-setup/references/step-7-layer-4-rubrics.md` — full L4 procedure (lines 220–268)
- `skills/hd-setup/references/step-8-layer-5-knowledge.md` — full L5 procedure (lines 269–295)

**Keep in SKILL.md:** frontmatter, interaction method, single job / scope, workflow checklist (step names only), guardrail (additive-only when existing harness), Step 1 detect, Step 2 onboard check, Step 3 tool discovery, Step 9 write `hd-config.md`, Step 10 summarize, re-run semantics, failure modes, what-skill-does-NOT-do, coexistence, reference files list, assets list, scripts list, sub-agents invoked list.

Steps 4–8 each become: 2–3 line summary + `→ See [references/step-N-<name>.md](references/step-N-<name>.md) for full procedure`.

**Acceptance:** `wc -l skills/hd-setup/SKILL.md ≤ 200`. `budget-check.sh` exits 0 with zero violations across all SKILL.md.

## G2 — `article-quote-finder` article corpus

**Problem:** Agent's happy path depends on `article_sources` config in `hd-config.md` that's effectively never populated. Every real invocation returns empty quotes + "(corpus not configured)" note.

**Decision (pick in implementation):**
- **Option A (preferred):** ship a `agents/research/article-quote-finder-corpus.md` reference companion with the canonical Substack article URLs (once Bill confirms the public URL — if TBD per README, use a sentinel placeholder that the agent checks for; fail gracefully). Agent reads this reference file alongside `hd-config.md.article_sources` at invocation time; union the two.
- **Option B (fallback):** disable the agent's integration from `hd-onboard` until v0.6+; add a clear "v0.6+" note in the agent frontmatter and hd-onboard SKILL.md.

Go with A. If the article URL is truly TBD, the corpus file documents the structure + cites the placeholder so users can populate locally.

**Files:**
- `agents/research/article-quote-finder-corpus.md` (NEW) — structured list of canonical article § URLs (or placeholders with `{{TBD}}` + instructions for user to populate in their `hd-config.md article_sources`)
- `agents/research/article-quote-finder.md` (MODIFY) — point to the corpus reference; add a non-fatal fallback: if neither corpus ref nor config has URLs, agent returns structured empty with clear "no corpus configured" note (no invention).

**Acceptance:** agent invocation with no `hd-config.md article_sources` returns a well-formed empty response (not a parse error). With at least one URL configured, agent attempts retrieval.

## G3 — `detect.py` MCP user-level scoping

**Problem:** `detect.py` scans repo-level `.mcp.json` / `.claude/settings*` but ignores user-level MCP config at `~/.claude/mcp.json` or `~/.codex/mcp.json`. Plus-uno pilot: Bill runs Figma + Notion MCPs user-wide but detect reports `mcp_servers: []`.

**Decision:** add `--include-user-mcps` flag (opt-in). Default behavior unchanged (repo-scoped). When flag passed, union user-level MCPs into output with a `user_mcps_included: true` signal so hd-config.md can surface it explicitly.

**Files:**
- `skills/hd-setup/scripts/detect.py` (MODIFY) — add `--include-user-mcps` argparse flag; when set, read `~/.claude/mcp.json` + `~/.codex/mcp.json` (if exist) and merge into `mcp_servers`; also set `user_mcps_included: true` in output
- `skills/hd-setup/references/hd-config-schema.md` (MODIFY) — document new flag + `user_mcps_included` field
- `skills/hd-setup/SKILL.md` (MODIFY) — Step 1 ask "also scan your user-level MCPs?" before running detect; if yes, pass `--include-user-mcps`

**Acceptance:** running detect from plus-uno with `--include-user-mcps` surfaces Figma + Notion (or whatever Bill has user-wide). Without the flag, behavior unchanged.

## G4 — `harness-health-analyzer mode: quick` wiring

**Problem:** Agent spec defines `mode: full | quick` parameter but `hd-review/SKILL.md` Step 1 (in the audit-procedure.md now) hardcodes `mode: "full"`. Quick-mode is unreachable.

**Decision:** wire the quick-mode dispatch from hd-review. Quick-mode = scoped to detect.py signals + `hd-config.md` state only (no deep file reads). Full-mode unchanged.

**Files:**
- `skills/hd-review/references/audit-procedure.md` (MODIFY) — Step 1 reads `args.mode` (user passes `mode: quick` or `mode: full` when invoking `/hd:review audit`); defaults to full. Dispatches with chosen mode.
- `skills/hd-review/SKILL.md` (MODIFY) — audit-mode section mentions `mode: quick` option with 1-line description ("~30s scan based on detect.py signals; use before full audits")
- `agents/workflow/harness-health-analyzer.md` (MODIFY if needed) — verify spec's mode:quick body is realistic given the quick-mode's scope; trim or expand as needed

**Acceptance:** `/hd:review audit mode:quick` dispatches correctly; returns abbreviated report. Full-mode still works.

## G5 — `workflows/` vocabulary reconciliation

**Problem:** AGENTS.md contradicts itself. "Repo layout" says "No `workflows/` folders inside skills" (correct, repo-specific rule). "Semantic split vocabulary" still lists `workflows/` = FOLLOW as a general skill-authoring category. hd-onboard references teach users the `workflows/` subdir convention as if it were active.

**Decision:** harmonize on repo policy. `workflows/` is NOT a vocabulary category in this plug-in; procedures live in SKILL.md or references. Update:
- `AGENTS.md § Semantic split vocabulary` — remove `workflows/` entry; note that procedures live inline in SKILL.md or in `references/*-procedure.md` files (point at the Phase 3f F5 pattern as precedent)
- `skills/hd-onboard/references/layer-3-orchestration.md` — update line 34 ref to `workflows/` subdir convention → reference the inline-procedures-or-references pattern
- `skills/hd-onboard/references/layer-2-skills.md` — update line 14 ref to `references/workflows/templates/scripts` subdir convention → drop `workflows/`
- `skills/hd-onboard/references/coexistence-with-compound.md` — update line 56 subdir convention list → drop `workflows/`

**Acceptance:** `grep -rn "workflows/" .` (repo-wide) returns only `.github/workflows/` hits + the intentional user-repo example in `hd-setup/references/layer-3-orchestration.md`. AGENTS.md semantic-split section describes our actual convention (inline + references).

## G6 — True two-session F2 regression

**Problem:** Phase 3f F2 regression (commit `2e0db704`) simulated both runs in a single agent context. Spec is tight, output was byte-stable, but independent invocations weren't exercised.

**Approach:** dispatch two **separate** subagents, each getting fresh context, each performing one extraction run against `/tmp/hd-real-test/plus-uno/AGENTS.md`. Compare outputs.

**Acceptance:** if structural axes (candidate IDs, severities, attribution fields) remain byte-stable across truly-independent runs, file a confirmation lesson. If drift exceeds prior same-turn variance, file a blocker lesson + plan Phase 3h p1 fix.

**File:** `docs/knowledge/lessons/2026-04-18-extract-mode-two-session-regression.md` (NEW)

## Implementation order

All 6 can run in parallel since they touch non-overlapping files (except G4, which touches `hd-review/references/audit-procedure.md` freshly created in F5 — fine since F5 is committed).

1. Dispatch G1, G2, G3, G4, G5, G6-Run-A, G6-Run-B as parallel subagents
2. Each agent writes files only; I serialize commits
3. After all land, run `budget-check.sh` regression + full `grep -rn workflows/` audit
4. CHANGELOG Unreleased section + plan status → completed

## Files to touch

**New:**
- `skills/hd-setup/references/per-layer-procedure.md`
- `skills/hd-setup/references/step-4-layer-1-context.md`
- `skills/hd-setup/references/step-5-layer-2-skills.md`
- `skills/hd-setup/references/step-6-layer-3-orchestration.md`
- `skills/hd-setup/references/step-7-layer-4-rubrics.md`
- `skills/hd-setup/references/step-8-layer-5-knowledge.md`
- `agents/research/article-quote-finder-corpus.md`
- `docs/knowledge/lessons/2026-04-18-extract-mode-two-session-regression.md`

**Modify:**
- `skills/hd-setup/SKILL.md`
- `agents/research/article-quote-finder.md`
- `skills/hd-setup/scripts/detect.py`
- `skills/hd-setup/references/hd-config-schema.md`
- `skills/hd-review/references/audit-procedure.md`
- `skills/hd-review/SKILL.md`
- `agents/workflow/harness-health-analyzer.md`
- `AGENTS.md`
- `skills/hd-onboard/references/layer-2-skills.md`
- `skills/hd-onboard/references/layer-3-orchestration.md`
- `skills/hd-onboard/references/coexistence-with-compound.md`
- `CHANGELOG.md`

**Delete:** none.

## Verification

Done when:
- [ ] `wc -l skills/hd-setup/SKILL.md ≤ 200` (G1)
- [ ] `budget-check.sh` exits 0 with zero violations (G1 final check)
- [ ] `article-quote-finder` invocation with empty corpus returns graceful structured empty (G2)
- [ ] `detect.py --include-user-mcps` surfaces user-level MCPs; default unchanged (G3)
- [ ] `/hd:review audit mode:quick` dispatches correctly; full-mode still works (G4)
- [ ] `grep -rn "workflows/" .` returns only `.github/workflows/` + user-repo example (G5)
- [ ] G6 lesson filed with ship-or-block verdict based on true-independent regression
- [ ] `CHANGELOG.md` Unreleased section documents Phase 3g
- [ ] No writes to `docs/solutions/`

## Sources

- [Phase 3f plan § Deferred to Phase 3g](./2026-04-18-002-refactor-phase-3f-skill-test-findings-plan.md#deferred-parked-for-phase-3g)
- [Phase 3e plan § Deferred](./2026-04-18-001-refactor-phase-3e-pilot-consolidation-plan.md#deferred-parked-for-phase-3f)
- hd-review skill-test audit 2026-04-18 (`mode: quick` wiring gap, `article-quote-finder` corpus gap)
- plus-uno pilot (MCP user-level scoping)
- F2 regression caveat (commit `2e0db704`)
