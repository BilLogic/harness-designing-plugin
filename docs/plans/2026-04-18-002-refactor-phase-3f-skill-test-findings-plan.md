---
title: "Phase 3f — skill-test findings: agent desc trimming, extract-mode p1 fixes, hd-onboard polish, budget-check rewrite, legacy cleanup"
type: refactor
status: completed
date: 2026-04-18
origin: docs/knowledge/lessons/2026-04-18-extract-mode-first-fire.md
---

# Phase 3f — skill-test findings

Batches the findings from three parallel skill-tests (hd-onboard, hd-compound, hd-review + 6 sub-agents) run 2026-04-18 plus the E5 synthetic extract-mode first-fire. See [Phase 3e plan](./2026-04-18-001-refactor-phase-3e-pilot-consolidation-plan.md) § "Deferred" for the full backlog.

Scope: 6 fix batches (F1–F6). F7/F8 intentionally parked for 3g (article-quote-finder corpus, detect.py MCP user-level scoping — lower priority, acceptable workarounds exist). Branch: `claude/elegant-euclid` (current worktree).

## F1 — Agent description trimming (compliance sweep)

All 6 sub-agent descriptions currently violate the 180-char cap from the skill-quality rubric:

| Agent | Current | Cap | Action |
|---|---|---|---|
| `agents/analysis/graduation-candidate-scorer.md` | 327 | 180 | trim |
| `agents/research/lesson-retriever.md` | 318 | 180 | trim |
| `agents/research/article-quote-finder.md` | 270 | 180 | trim |
| `agents/review/skill-quality-auditor.md` | 251 | 180 | trim |
| `agents/review/rubric-applicator.md` | 352 | 180 | trim |
| `agents/workflow/harness-health-analyzer.md` | 320 | 180 | trim |

Keep each description concrete: what the agent does + primary trigger context in ≤180 chars. Move longer expository text into the system-prompt body. No functional changes — frontmatter compression only.

**Acceptance:** `yq '.description | length' agents/**/*.md` returns ≤180 for all 6 files.

## F2 — rubric-applicator `mode: extract` p1 fixes (ship-blocker)

From [`docs/knowledge/lessons/2026-04-18-extract-mode-first-fire.md`](../knowledge/lessons/2026-04-18-extract-mode-first-fire.md), 4 p1 gaps must close before `/hd:setup` L4 critique+extract is user-safe:

### F2.1 — Add phased procedure to extract-mode
**File:** `agents/review/rubric-applicator.md`

Currently `mode: apply` has Phase 1/2/3 numbered structure; `mode: extract` has none. Author explicit phases:
- **Phase 1 — Scan:** identify rule-like statements in source using the heuristic from F2.2
- **Phase 2 — Classify:** per-candidate: match to existing starter rubric or mark as novel
- **Phase 3 — Structure:** per-candidate: draft severity (F2.3 heuristic), pass/fail snippets (F2.4 attribution rules), `applies_to:` scope
- **Phase 4 — Dedupe:** cluster near-duplicates with same rule_intent, keep the sharpest evidence snippet
- **Phase 5 — Materialize:** emit either YAML `extracted_candidates` array (for programmatic consumers) OR a full starter-rubric-shape markdown file (for direct paste into `docs/rubrics/`). Caller specifies via `output_shape: yaml|markdown` parameter.

### F2.2 — Rule-detection heuristic
Make operational: a statement is rule-like if it has **any** of:
- Imperative verb (must, never, always, don't, avoid, prefer, require)
- Numbered/bulleted list item ≥8 words AND in a section titled (Patterns|Rules|Guidelines|Forbidden|Do|Don't|Conventions)
- YAML frontmatter `severity:` OR `rule:` OR `policy:` field

Discard: narrative/explanatory prose, historical context, decision rationale without an imperative extract.

### F2.3 — Severity-assignment rules
Default severity derived from rule-statement markers:
- **p1:** "never", "must not", "blocks ship", safety/security/data-loss keywords
- **p2:** "avoid", "prefer", "should", standards/consistency keywords
- **p3:** "consider", "often", "typically", nit keywords
- **fallback:** p2 if no keyword match

Document in the agent's system prompt as a small table the agent can reference.

### F2.4 — Output-ownership + attribution
- Pass example: only synthesize if source contains an explicit positive example; otherwise mark `pass_example: "(see source; no explicit positive shown)"` and skip fabrication
- Fail example: same rule
- `applies_to:` MUST cite the specific source file section (not inferred scope) — e.g., `applies_to: "plus-uno/AGENTS.md § Forbidden Patterns"`
- Every criterion gets `source_citation: <file>:<line-range>` field

Forbid fabrication: if the source doesn't have it, the agent says so explicitly — never invent plausible-looking snippets.

**Acceptance (F2):** re-run the E5 synthetic test against plus-uno AGENTS.md. Output should (a) have explicit Phase 1–5 trace, (b) no fabricated snippets, (c) every criterion carries `source_citation:`, (d) produce stable output across 2 runs of the same agent invocation.

## F3 — hd-onboard FAQ polish

From the skill-test: 3 FAQ gaps + 1 taxonomy scope issue.

### F3.1 — Add FAQ entries
**File:** `skills/hd-onboard/references/faq.md`

Append 3 Q&A entries:
1. **"Why five layers specifically? Why not 3 or 7?"** — defend the arity. Cite the article § that introduces the stack. Short answer: each layer maps to a distinct memory mechanism (procedural semantic / skill semantic / procedural orchestration / semantic checks / episodic + temporal). Collapsing loses a mechanism; splitting further duplicates.
2. **"I already have CLAUDE.md or .agent/ — do I still need this?"** — explicit yes, with reasoning: `/hd:setup` now defaults to additive-only + L4/L5-only when existing harness detected (new graduated rule 2026-04-18). Points to AGENTS.md graduated rules.
3. **"How do I customize the starter rubrics for my team?"** — point to `skills/hd-review/assets/starter-rubrics/skill-quality.md § Extending this rubric`. Three paths: copy-and-edit, add criteria to existing, add whole new rubric with `source:` citation.

### F3.2 — Memory-taxonomy scope clarification
**File:** `skills/hd-onboard/references/memory-taxonomy.md`

Current file names 4 memory types (procedural / semantic / episodic / working). Across the plug-in we use 6 (adds speculative + temporal). Either:
- Add speculative + temporal entries, OR
- Add an explicit footnote "This taxonomy names 4 primary types. Our knowledge-layer README references 2 additional (speculative, temporal) that are derivative — see [`layer-5-knowledge.md`](layer-5-knowledge.md)".

Pick whichever keeps the file under 500 lines and the explanation clean.

## F4 — hd-review `budget-check.sh` rewrite

**File:** `skills/hd-review/scripts/budget-check.sh`

Current issues (from skill-test):
- Fragile JSON string-surgery on lines 62–71 (first loop produces partial JSON; second loop at 90–124 silently overwrites — dead code)
- `yq` implicit dependency — unshipped, silently breaks the 6+ parallel→serial auto-switch
- Quoting issues if any skill dir name contains a quote (low risk but fragile)

Rewrite:
- Use `jq -n` for all JSON construction (eliminates string surgery)
- Remove the dead first loop; keep only the second loop's accumulator
- Replace `yq` with a jq-compatible approach OR grep+awk fallback that handles YAML frontmatter. Prefer: `awk '/^---/{n++;next} n==1{print}'` to extract frontmatter, then `grep -c '^review_agents:'` + line count check.
- Document any remaining deps in a 3-line header comment at the top of the script.
- `bash -n` must pass; script exits 0 on healthy state + prints structured JSON.

**Acceptance:** running `bash skills/hd-review/scripts/budget-check.sh` on this repo emits valid JSON on stdout, exits 0 when all budgets pass, non-zero with structured violation output otherwise. No `yq` required.

## F5 — SKILL.md slimming

Both over the 200-line soft cap:
- `skills/hd-review/SKILL.md` — 332 lines → target ≤200
- `skills/hd-compound/SKILL.md` — 311 lines (post-3e E6) → target ≤200

For each: move per-mode procedures out of SKILL.md into `references/<mode>-procedure.md` files. SKILL.md retains: frontmatter, interaction-method preamble, scope, workflow checklist (step names only), cross-cutting behavior (coexistence, failure modes, what-skill-does-NOT-do), reference-file list. Steps become `See references/<name>.md § Phase N` instead of inline numbered procedures.

**hd-review references to create:**
- `references/audit-procedure.md` (move Steps 1–5 audit flow here)
- `references/critique-procedure.md` (move Steps 1–3 critique flow here)

**hd-compound references to create:**
- `references/capture-procedure.md`
- `references/propose-procedure.md`
- `references/apply-procedure.md`

Cross-links: each new reference ends with `→ Return to SKILL.md § <step>` pointer.

**Acceptance:** `wc -l skills/hd-{review,compound}/SKILL.md` shows ≤200 for both. No logic loss — all previously-inlined procedure steps live in exactly one of the new references.

## F6 — Legacy `workflows/` ref cleanup

Per Phase 3e E6.3 scope was `skills/hd-compound/` only. Extend to:
- `skills/hd-review/references/audit-criteria.md` — "Loaded by `workflows/audit-parallel.md` and `workflows/audit-serial.md`" — replace with SKILL.md step pointers
- `skills/hd-review/references/critique-format.md` — "Loaded by `workflows/critique.md`" — replace
- `skills/hd-review/references/rubric-application.md` — 2 refs to `../workflows/critique.md` — replace
- `skills/hd-setup/references/known-mcps.md` — 3 refs to `workflows/five-layer-walk.md` — replace with `SKILL.md § Step 3` and `SKILL.md § Per-layer procedure`
- `skills/hd-setup/references/layer-3-orchestration.md` — line with `workflows/` in a tree diagram; decide in implementation whether it's illustrative (template user-writes) or an internal ref that should be removed
- `skills/hd-setup/SKILL.md` line 100 has `.github/workflows/` — this is GitHub Actions path, NOT our skill convention. Leave alone.

**Acceptance:** `grep -r "workflows/" skills/ | grep -v ".github/workflows/"` returns 0 hits.

## Implementation order

1. **F1** (trim 6 agent descriptions — zero-risk, immediate compliance win)
2. **F6** (legacy refs cleanup — zero-risk, tightens consistency from E6.3)
3. **F3** (hd-onboard FAQ polish — user-facing small fixes)
4. **F4** (budget-check.sh rewrite — self-contained; improves tooling)
5. **F2** (extract-mode phased procedure — ship-blocker; highest cognitive load)
6. **F5** (SKILL.md slimming — largest refactor; do last to avoid churning the other workstreams)

Then regression: re-run E5 synthetic extract-mode against plus-uno AGENTS.md and confirm the 4 p1 gaps are closed. Update `CHANGELOG.md` Unreleased section.

## Files to touch

**New:**
- `skills/hd-review/references/audit-procedure.md`
- `skills/hd-review/references/critique-procedure.md`
- `skills/hd-compound/references/capture-procedure.md`
- `skills/hd-compound/references/propose-procedure.md`
- `skills/hd-compound/references/apply-procedure.md`

**Modify:**
- `agents/analysis/graduation-candidate-scorer.md`
- `agents/research/lesson-retriever.md`
- `agents/research/article-quote-finder.md`
- `agents/review/skill-quality-auditor.md`
- `agents/review/rubric-applicator.md`
- `agents/workflow/harness-health-analyzer.md`
- `skills/hd-onboard/references/faq.md`
- `skills/hd-onboard/references/memory-taxonomy.md`
- `skills/hd-review/scripts/budget-check.sh`
- `skills/hd-review/SKILL.md`
- `skills/hd-compound/SKILL.md`
- `skills/hd-review/references/audit-criteria.md`
- `skills/hd-review/references/critique-format.md`
- `skills/hd-review/references/rubric-application.md`
- `skills/hd-setup/references/known-mcps.md`
- `skills/hd-setup/references/layer-3-orchestration.md`
- `CHANGELOG.md`

**Delete:** none.

## Deferred (parked for Phase 3g)

- **`article-quote-finder` corpus.** Either ship a local copy of the Substack article(s) as a reference file, an explicit URL list in config, or disable the agent's integration from hd-onboard until v0.6+. Acceptable interim: agent returns empty with "(corpus not configured)" note (current behavior).
- **`detect.py` MCP user-level scoping.** Plus-uno pilot: Bill's personal Figma + Notion MCPs configured at user-level are invisible to detect.py (only scans repo `.mcp.json`). Decide scope in 3g — document as scoped-by-design OR add `--include-user-mcps` flag.
- **`harness-health-analyzer mode: quick`** parameter defined but never dispatched by hd-review (Step 3 hardcodes `mode: "full"`). Wire the quick-mode dispatch path or drop the parameter.

## Verification

Done when:
- [ ] All 6 agent descriptions ≤180 chars (F1 acceptance)
- [ ] E5 synthetic extract-mode re-run against plus-uno AGENTS.md — 4 p1 gaps closed, 2 runs produce byte-stable criterion list (F2 acceptance)
- [ ] hd-onboard FAQ covers 3 new questions + memory-taxonomy scope resolved (F3 acceptance)
- [ ] `budget-check.sh` no longer depends on `yq`, emits valid JSON via `jq -n` (F4 acceptance)
- [ ] `wc -l skills/hd-{review,compound}/SKILL.md` ≤200 each (F5 acceptance)
- [ ] `grep -r "workflows/" skills/ | grep -v ".github/workflows/"` returns 0 (F6 acceptance)
- [ ] `CHANGELOG.md` Unreleased section documents Phase 3f
- [ ] No writes to `docs/solutions/`
- [ ] Skill compliance checklist passes

## Sources

- **Origin document:** [`docs/knowledge/lessons/2026-04-18-extract-mode-first-fire.md`](../knowledge/lessons/2026-04-18-extract-mode-first-fire.md) — E5 gap-report with 4 p1 findings
- Phase 3e Deferred section: [`2026-04-18-001-refactor-phase-3e-pilot-consolidation-plan.md`](./2026-04-18-001-refactor-phase-3e-pilot-consolidation-plan.md) § "Deferred"
- hd-onboard skill-test report: in-session 2026-04-18 audit
- hd-compound skill-test report: in-session 2026-04-18 audit
- hd-review + 6 sub-agent skill-test report: in-session 2026-04-18 audit
