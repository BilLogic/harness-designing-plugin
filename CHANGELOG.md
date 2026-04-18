# Changelog

All notable changes to the `design-harness` plug-in are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Phase 3h — cosmetic pins (extract-mode drift axes)

Completed per [`docs/plans/2026-04-18-004-refactor-phase-3h-cosmetic-pins-plan.md`](docs/plans/2026-04-18-004-refactor-phase-3h-cosmetic-pins-plan.md). Single file, single commit. Closes the 3 surface-drift items from the Phase 3g G6 true-two-session regression.

**H1/H2/H3 pins** (`11bfa196`, single file: `agents/review/rubric-applicator.md`):

- **H1 — `candidate_id` derivation rule:** new 5-step deterministic recipe (first imperative verb from fixed allowlist → first noun phrase up to 3 words → negative prefixing → kebab-case → collision suffix). 4 worked examples. Collapses the 5-of-13 phrasing drift seen in G6 (`prefer-plus-components` vs `plus-components-first`).
- **H2 — path-format rule:** `applies_to` + `source_citation` MUST use repo-relative paths. Absolute input paths get stripped to the nearest `.git/` ancestor; already-relative pass through; no-ancestor fallback is basename. 3 worked examples. Collapses the absolute/relative drift (`/tmp/hd-real-test/plus-uno/AGENTS.md` vs `AGENTS.md`).
- **H3 — `rule_statement` punctuation:** use `:` (colon) to separate rule heading from elaboration; use `;` only when chaining independent imperatives. One-line spec addition. Collapses the Run A vs Run B punctuation drift.

Phase 3 Structure output-ownership rules also updated to reference the repo-relative path-format rule, keeping the anti-fabrication contract and the pinning rules consistent.

Mental trace against G6 inputs confirms all 3 drift axes collapse.

Phase 3h is the **first phase with no deferred items** — the extract-mode spec is now as deterministic as a single-file spec can make it. Any further stability work would be agent-runtime determinism (temperature settings, beam search, etc.), not spec tightening.

### Phase 3g — remaining backlog

Completed per [`docs/plans/2026-04-18-003-refactor-phase-3g-remaining-backlog-plan.md`](docs/plans/2026-04-18-003-refactor-phase-3g-remaining-backlog-plan.md). Closes all 6 items deferred from Phase 3f via 7 parallel subagents (G1–G5 + G6-Run-A + G6-Run-B). All 4 SKILL.md files now pass the 200-line soft cap; `budget-check.sh` exits 0 with 0 violations.

**G5 — `workflows/` vocabulary reconciliation** (`bb396098`): AGENTS.md Semantic split vocabulary was internally inconsistent ("no workflows/ inside skills" rule but vocabulary listed workflows/ = FOLLOW). Reconciled to repo policy: dropped workflows/ entry; added assets/ entry; added paragraph explaining per-mode procedures live in SKILL.md inline OR references/`<mode>`-procedure.md (cites F5 pattern). 3 hd-learn refs updated to drop stale workflows/ subdir convention.

**G2 — `article-quote-finder` corpus** (`cb2ed19d`): ships `agents/research/article-quote-finder-corpus.md` as structured default corpus (6 article sections with `{{TBD}}` URL placeholders since Bill's Substack article is unpublished). Agent unions corpus + `hd-config.md article_sources` override; sentinel-filter drops `{{TBD}}` entries; emits graceful structured empty when resolved set is empty (`corpus_status: not-configured`). No invented quotes. Fixes happy-path-unreachable bug.

**G3 — `detect.py --include-user-mcps` flag** (`c83859a7`): opt-in user-level MCP scoping. Default unchanged (repo-scoped). When flag set, reads `~/.claude/mcp.json` + `~/.codex/mcp.json`, unions + dedupes into `mcp_servers`, records provenance via new `signals.user_mcp_sources` + `signals.user_mcps_included`. Malformed user config: stderr warn, skip, continue (never crash). hd-setup Step 1 asks once before invoking detect; passes flag if user opts in. Surfaces the plus-uno pilot's Figma + Notion MCP gap (previously invisible).

**G4 — `harness-health-analyzer mode: quick` wiring** (`73db7161`): agent's quick-mode was defined in spec but hardcoded to `full` at dispatch. `audit-procedure.md` +50 lines (152→202): new `## Inputs` section declares `mode: "full" | "quick"` (default full); new `## Mode: quick` section with 4-step abbreviated-scan procedure (detect.py + hd-config.md only; dispatches analyzer with `mode: "quick"`; emits top-3-per-layer inline report; no file write). `hd-review/SKILL.md` +2 lines: one-paragraph quick-mode callout. Full-mode behavior unchanged. Harness-health-analyzer.md unchanged (its existing Phase 2 "skipped in quick" spec already matched the wired scope).

**G6 — True two-session extract-mode regression** (`9aa957fb`): two independently dispatched subagents with fresh contexts ran `rubric-applicator mode: extract` against plus-uno AGENTS.md. **9/9 structural axes byte-identical** (total=13, severity p1:11 p2:2, phases followed, matches_starter breakdown, zero fabrication, keyword rationale list, sentinel examples). Surface drift cosmetic only: candidate_id phrasing (5/13 differ), path format (absolute vs relative), rule_statement punctuation (: vs ;). **SHIP verdict confirmed** under stronger evidence than the same-turn Phase 3f regression. 3h candidates (purely cosmetic): pin candidate_id derivation, pin path format, pin punctuation.

**G1 — `hd-setup/SKILL.md` slimming** (`c3dc2ef8`): last SKILL.md over the 200-line soft cap. 420 → **200** (at cap). 6 new reference files house per-step procedures: `per-layer-procedure.md` (FRAME→SHOW→PROPOSE→ASK→EXECUTE cycle + default-action table + link-mode contract), `step-4-layer-1-context.md`, `step-5-layer-2-skills.md`, `step-6-layer-3-orchestration.md`, `step-7-layer-4-rubrics.md`, `step-8-layer-5-knowledge.md`. Critical preservations verified: Guardrail section (additive-only when harness detected) kept verbatim, default action table with guardrail rows moved with per-layer-procedure, link-mode 3-5 line extracted-summary contract, all fully-qualified Task invocations.

**Budget-check final state:** all 4 SKILL.md pass (hd-maintain 124, hd-learn 124, hd-review 146, hd-setup 200); Tier 1 tracked at 198/200; exit 0, violations=0.

**Deferred to Phase 3h (cosmetic, optional):**
- Pin `rubric-applicator` `candidate_id` derivation rule (collapses 5-candidate phrasing drift)
- Pin `applies_to` / `source_citation` path format (relative from repo root)
- Pin `rule_statement` punctuation (lowest-value; only if downstream consumers care)

### Phase 3f — skill-test findings

Completed per [`docs/plans/2026-04-18-002-refactor-phase-3f-skill-test-findings-plan.md`](docs/plans/2026-04-18-002-refactor-phase-3f-skill-test-findings-plan.md). Batches findings from 3 parallel skill-test audits (hd-learn, hd-maintain, hd-review + 6 sub-agents) + the Phase 3e E5 synthetic extract-mode first-fire. Six F-units + regression + doc sync.

**F1 — Agent description trimming** (`7a419d16`): all 6 sub-agent frontmatter `description:` fields trimmed to ≤180 chars (range was 237–352; now 166–179). Expository content moved into system-prompt bodies; no information loss.

**F3 — hd-learn FAQ polish** (`bd1bb037`):
- `faq.md`: +3 Q&A entries (Q11 "Why five layers specifically?" defending arity via memory-mechanism distinctness; Q12 ".agent/ / CLAUDE.md coexistence" citing 2026-04-18 graduated rules; Q13 "customizing starter rubrics" with 3 paths).
- `memory-taxonomy.md`: added "Derivative types" section with speculative + temporal entries; top-of-file clarifying sentence ("4 classical + 2 derivative"). Original 4-type table preserved verbatim.

**F4 — `budget-check.sh` rewrite** (`0d7ae491`): 153 → 178 lines. All JSON construction via `jq -n` (17 invocations); `yq` dependency fully removed (grep -c yq = 0); `set -euo pipefail`; paths always quoted; edge-case guards for empty skill dirs, missing SKILL.md, missing description, quoted vs unquoted YAML values. Dead first loop deleted. `bash -n` passes; emits valid JSON; exit 0 healthy / exit 1 on violations.

**F6 — Legacy `workflows/` ref cleanup** (`b955476c`): 7 refs across hd-review + hd-setup references replaced with `../SKILL.md#anchor` pointers. 1 ref in `hd-setup/references/layer-3-orchestration.md` preserved as illustrative user-repo example tree. Post-change: 0 in-scope hits. Extends Phase 3e E6.3 (hd-maintain-only) to the rest of the plug-in.

**F2 — `rubric-applicator` extract-mode ship-blocker fixes** (`7949621f`): closes 4 p1 gaps from E5 first-fire lesson. File grew 143 → 303 lines.
- F2.1 Phase 1–5 explicit procedure (Scan → Classify → Structure → Dedupe → Materialize) with worked examples.
- F2.2 3-prong rule-detection heuristic (imperative verb allowlist / numbered-list-under-titled-heading ≥8 words / inline severity/rule/policy frontmatter) + explicit discard list.
- F2.3 Severity keyword map (4 rows); required `severity_rationale:` field; first-hit-wins.
- F2.4 Anti-fabrication attribution contract: `pass_example`/`fail_example` use sentinel strings when source lacks explicit examples; `applies_to` must cite `<file> § <heading>`; new required `source_citation: <file>:<line-range>` field.
- New `## Parameters` section documents `output_shape: yaml|markdown` (new). Apply-mode preserved verbatim.

**F2 regression** (`2e0db704`): re-ran E5 synthetic test against plus-uno AGENTS.md twice. 7/7 byte-stable axes (candidate count, IDs, severity distribution, attribution presence, zero fabrication). All 4 p1 gaps verified closed. **Ship verdict: SHIP** for extract-mode. Residual: rule_statement prose paraphrasing not pinned (p2/p3); materialized output wants ~10min human editing pass to add concrete examples where source lacks them.

**F5 — SKILL.md slimming** (`f0443e31`): brought hd-review + hd-maintain under 200-line soft cap per skill-quality rubric §5.
- `hd-review/SKILL.md` 331 → **144**
- `hd-maintain/SKILL.md` 311 → **124**
- 5 new reference files house per-mode procedures: `{audit,critique}-procedure.md` (hd-review), `{capture,propose,apply}-procedure.md` (hd-maintain).
- Critical Phase 3e E6 preservations verified: `compute-plan-hash.sh` invocations, `.hd/propose-<hash>.json` persistence, capture date-slug convention.
- Kept in SKILL.md: workflow checklists (runtime progress boxes), protected-artifacts block, interaction preamble, compact-safe mode. Cross-link integrity verified.
- `hd-setup/SKILL.md` at 407 lines remains over cap — slimming parked for 3g (F5 scope excluded it).

Budget-check post-Phase-3f: 3/4 SKILL.md files pass soft cap (124 / 124 / 144); only hd-setup (407) flagged.

**Deferred to Phase 3g:**
- `hd-setup/SKILL.md` slimming (407 → <200)
- `article-quote-finder` article corpus (happy path still unreachable)
- `detect.py` MCP user-level scoping
- `harness-health-analyzer mode: quick` dispatch wiring
- `workflows/` vocabulary reconciliation in `hd-learn/references/` + AGENTS.md semantic-split section
- True two-session (not same-turn-simulated) F2 regression as confidence booster

### Phase 3e — pilot consolidation (6-repo matrix)

Completed per [`docs/plans/2026-04-18-001-refactor-phase-3e-pilot-consolidation-plan.md`](docs/plans/2026-04-18-001-refactor-phase-3e-pilot-consolidation-plan.md). Findings from 4 new parallel pilots (caricature, oracle-chat, lightning, plus-uno) combined with prior pilots (sds, plus-marketing) consolidated in [`docs/knowledge/lessons/2026-04-18-parallel-pilots-3-6-consolidated.md`](docs/knowledge/lessons/2026-04-18-parallel-pilots-3-6-consolidated.md).

**E1 — Template graduations** (`c722bb24`):
- `hd-config.md.template` gains `layer_decisions` (5-row array with decision + why + files_written), `other_tool_harnesses_detected` (list of `{path, owner, policy}`), `files_written` (flat list); `schema_version: "2"` now consistent with detect.py output.
- `rubrics-index.md.template` added (was referenced by SKILL.md Step 7 but missing; every pilot hand-wrote `docs/rubrics/INDEX.md`).
- `hd-config-schema.md` updated to v2 with filled-in plus-marketing example.

**E3 — Rubric library round 2** (`60efe132`): starter count 12 → 14.
- `telemetry-display.md` (NEW, 103 lines): 7 IoT/hardware criteria (freshness indicators, offline affordances, device-state viz, binary-protocol display, map-as-canvas, update choreography, alarm prioritization). Surfaced by lightning pilot.
- `i18n-cjk.md` (NEW, 102 lines): 7 bilingual/CJK criteria (dual-script line-height, mixed-script punctuation, IME states, date/number formats, bilingual register, line-break, font-stack fallback). Surfaced by caricature + lightning.
- `design-system-compliance.md` gains managed-DS pre-fill sections for ant-design / chakra-ui / mui / mantine (+48 lines).

**E2 — detect.py signal expansion** (`f0680e22`): +177 lines.
- New signals: `has_rubrics_dir`, `rubrics_file_count`, `has_knowledge_dir`, `knowledge_file_count`, `memory_types_present` (scans `memory_type:` with `type:` fallback), `layers_present` composite, `managed_design_system` (antd/chakra/mui/mantine).
- a11y patterns expanded: `@radix-ui/`, `radix-ui`, `@headlessui/`, `@reach/`, `react-bootstrap` (closes blind spot from pilots #2/4/6).
- `external_skills_count` fixed: counts `SKILL.md` + bare `*.md`, takes max across sibling `.claude|.codex|.cursor/skills` dirs to avoid double-counting mirrors. Lightning: 10 → 5.
- `coexistence.compound_engineering` upgraded from bool to `{present, paths_found[], config_file}`.
- `team_tooling.pm` gains `markdown-todos` when `todos/` has ≥2 `\d{3}-\w+.*\.md` files.

**E6 — hd-maintain graduation-loop safety** (`d50f7b5d`): closes the safety thesis that was previously aspirational.
- `compute-plan-hash.sh` (NEW, 123 lines, `+x`): deterministic SHA-256 canonical-string builder. Strict normalization (`LC_ALL=C sort` on paths, LF-only, no trailing newline, fixed field order joined by single `\n`, paths joined by `|`). Byte-identical hashes across runs verified.
- Persisted propose artifact: SKILL.md Propose writes `.hd/propose-<8hex>.json` containing all inputs + `canonical_string` + `sha256`. Apply globs by `--hash` prefix, re-runs the script, compares. No longer depends on conversation context — survives session compaction. Cleanup moves to `.hd/applied/`.
- `gitignore-entries.txt` asset added (hd-setup proposes `.hd/` to user's `.gitignore`).
- Removed dangling `workflows/propose-graduation.md` / `workflows/apply-graduation.md` refs in `plan-hash-protocol.md` + `graduation-criteria.md` (AGENTS.md forbids `workflows/` inside skills; `grep -r workflows/ skills/hd-maintain/` returns 0).
- Lesson-corpus convention (Option A — match reality): `lesson-patterns.md` rewritten for date-slug (`YYYY-MM-DD-<slug>.md`) per-event files (the actual corpus convention, vs. the prior domain-grouped aspiration). Capture Step 2 creates new dated file, no append-to-domain.

**E4 — Pattern graduations** (`b7b360ab`):
- **`.agent/` or `.claude/` present → skip L1/L2/L3, scaffold L4/L5** (4 confirmations: plus-marketing, oracle-chat, lightning, plus-uno). Graduated to `AGENTS.md § Graduated rules` + `hd-setup/SKILL.md` new "Guardrail" section before Step 1 + default-action table.
- **Additive-only discipline when existing harness detected** (6 confirmations, all pilots). Graduated to `AGENTS.md § Graduated rules` + `hd-setup/SKILL.md` guardrail announces the mode up front.

**Regression:** `detect.py` v2 against all 6 `/tmp/hd-real-test/*` clones — all signals populate as expected. sds=scattered, others=advanced. Schema v2 consistent.

### Phase 3d — plus-uno template alignment + rubric expansion

Completed per [`docs/plans/2026-04-17-011-refactor-phase-3d-template-alignment-plan.md`](docs/plans/2026-04-17-011-refactor-phase-3d-template-alignment-plan.md). Six parts, one commit per part:

**Part E** (`26fad172`) — Config file renamed `design-harnessing.local.md` → `hd-config.md`; reference `local-md-schema.md` → `hd-config-schema.md`. 24 living files updated; historical plan/lesson files preserved. Coexistence intact (compound has `compound-engineering.local.md`).

**Part A** (`34e940f7`) — Layer 1 context-skeleton aligned with plus-uno baseline:
- `product/` expanded to 5 files (app / features / flows / users / pillars)
- `conventions/` expanded to 4 files (coding / integrations / tech-stack / terminology)
- `design-system/` restructured into foundations/ + styles/ + components/ triad + `index-manifest.json` (mirrors Material 3 / Ant Design / plus-uno patterns)
- Dropped `agent-persona.md` per Bill directive
- SKILL.md Step 4 now offers "full baseline vs simple mode" depth choice

**Part B** (`65bff04d`) — Layer 5 knowledge-skeleton with 5+1 memory-type model:
- New scaffolded files: `INDEX.md` (domain table with Memory Type column), `README.md` (taxonomy explainer), `changelog.md` (temporal), `decisions.md` (procedural-chosen ADR), `ideations.md` (speculative), `preferences.md` (semantic-taste)
- Lessons are now **domain-grouped** (`lessons/<domain>.md` with ~15 entries) not per-date
- `graduations.md` deferred scaffold (created on first graduation)
- Memory-type labels appear in 3 places: YAML frontmatter, INDEX column, README
- `hd:maintain capture` rewritten to classify-and-append-to-domain-file (not create-dated-file); enforces split threshold

**Part C** (`e3251916`) — Rubric library expanded 5 → 12 starters:
- Added: `heuristic-evaluation.md` (Nielsen 10), `typography.md` (Impeccable + Material 3), `color-and-contrast.md` (Impeccable + Material 3 + WCAG), `spatial-design.md` (Impeccable + Material 3), `motion-design.md` (Impeccable + Material 3), `ux-writing.md` (Impeccable + Fluent 2), `responsive-design.md` (Impeccable + Material 3)
- Each new rubric cites its `source:` derivation in YAML frontmatter

**Part D + F** (`2dff1da9`) — Rubric location correction + reference alignment:
- Rubrics now live at `docs/rubrics/<name>.md` (NOT `docs/context/design-system/`). Design-system = source content (tokens/color/type DEFINITIONS); rubrics = checks against that content. Separate concerns.
- `hd-setup/SKILL.md` Step 7 scaffold + critique-extract paths updated
- `hd-review/SKILL.md` rubric resolution: docs/rubrics/ first, design-system/ legacy fallback
- `layer-4-rubrics.md` rewritten with 12-starter enumeration + corrected distributed-behavior explanation
- `rubric-application.md` canonicalizes `docs/rubrics/`
- README + hd-review SKILL.md Assets section list all 12 starters

### Architecture reshape — comprehensive structure

**Added**
- `agents/` at plug-in root — 6 reusable sub-agents invoked via fully-qualified Task names from our skills (`design-harnessing:<category>:<name>`). Categories: analysis, research, review, workflow.
  - `agents/analysis/graduation-candidate-scorer.md` — cluster lessons, score 1–5 on grad-readiness (3 dims: recurrence × clean-imperative × team-agreement)
  - `agents/research/lesson-retriever.md` — retrieve past lessons weighted by relevance × recency × importance
  - `agents/research/article-quote-finder.md` — verbatim article quotes with § citations
  - `agents/review/skill-quality-auditor.md` — apply 9-section skill-quality rubric to any SKILL.md
  - `agents/review/rubric-applicator.md` — apply any rubric to any work item
  - `agents/workflow/harness-health-analyzer.md` — deep narrative 5-layer health report
- `hd-setup` detection upgrades (detect.py schema v2):
  - Other-tool harness detection: `.claude/` / `.codex/` / `.agent/` / external `.cursor/skills/` / `docs/plans/` convention
  - MCP configuration parsing: `.mcp.json` / `.cursor/mcp.json` / `.codex/mcp.json` → `mcp_servers[]`
  - 6-category team-tooling detection: docs (notion, google_docs, confluence, coda, obsidian), design (figma, paper, pencildev, sketch), diagramming (excalidraw, miro, whimsical, lucidchart, figjam), analytics (amplitude, mixpanel, posthog, metabase, hotjar, fullstory), pm (linear, jira, github_issues, asana, monday), comms (slack, discord, loom)
  - Config-SoT signals: `tokens_package`, `figma_config`
- `hd-setup` scenarios S11–S14 with user stories:
  - S11 other-tool harness respected (.agent/, .claude/, .codex/, docs/plans/)
  - S12 MCP pre-configured in repo
  - S13 external tooling URL-only (no MCP)
  - S14 tokens-package / figma-config as design-system SoT
- Platform-stubs (scattered→SSoT consolidation): `skills/hd-setup/assets/platform-stubs/` with redirect templates for CLAUDE.md, `.cursor/rules/AGENTS.mdc`, `.windsurf/rules/agent.md`, `.github/copilot-instructions.md`
- 5th starter rubric: `interaction-states.md` (loading / empty / error / success state coverage; Material 3 + Fluent 2 baselines)
- `local-md-schema.md` schema v2: `team_tooling`, `mcp_servers_at_setup`, `layer_decisions`, `other_tool_harnesses_detected` (additive; v1 files upgrade on next skill run)

**Changed**
- **Deleted `workflows/` folders** in hd-setup, hd-maintain, hd-review. Procedures absorbed into each SKILL.md inline. Rationale: workflows inside skills conflated procedural memory with orchestration memory. Shared procedures that span skills are now sub-agents in `agents/`. Matches compound-engineering's current (GitHub main) convention where most skills are flat SKILL.md + references + assets.
- **Renamed `templates/` → `assets/`** in all skills (matches compound's current convention).
- **hd-setup SKILL.md rewritten** (164 → 326 lines): 10-step workflow with explicit Layers 1–5 each as their own step (was previously hidden under a single "five-layer walk" bullet). Per-layer procedure with FRAME → SHOW → PROPOSE → ASK → EXECUTE. Per-layer checkpoint (A/B/C/D: review/capture/inspect/continue) prevents agent-driven steamrolling. Explicit `link / critique / scaffold / skip` contract at every layer. Strict non-interference with `.agent/` / `.claude/` / `.codex/` / external `.cursor/skills/`.
- **hd-maintain SKILL.md rewritten** (122 → 240 lines): three modes (capture / propose / apply) inlined with distinct checklists each. Integration with `design-harnessing:research:lesson-retriever` (capture Phase 1) and `design-harnessing:analysis:graduation-candidate-scorer` (propose).
- **hd-review SKILL.md rewritten** (154 → 324 lines): audit + critique inlined. Audit dispatches `design-harnessing:workflow:harness-health-analyzer` (opening), `design-harnessing:review:skill-quality-auditor` (per-skill L2 check), `design-harnessing:analysis:graduation-candidate-scorer` (L5 drift), plus configured `compound-engineering:*` reviewers. Critique dispatches `design-harnessing:review:rubric-applicator` (generic) or `skill-quality-auditor` (SKILL.md targets).
- `references/external-tooling.md` renamed → `references/known-mcps.md` (tighter name reflecting what it actually is: 6-category tool map + known-MCP install table + fallback seeds from Material 3 / Fluent 2 / awesome-design-md).
- `detect-mode.sh` kept as thin bash shim; canonical detector is now `detect.py` (schema v2).
- AGENTS.md plug-in conventions doc expanded with full architecture diagram + `agents/` invocation convention + "when to create a new agent" rule.

**Fixed**
- `detect-mode.sh` fragile `{ "$x" = true || ... }` bash syntax replaced with explicit `[ ... ]` form (the pattern worked only by accident — `true`/`false` are real commands).
- `detect-mode.sh` placeholder regex false-positive on our own repo: tightened `{{.*}}` → `{{[A-Z][A-Z0-9_]+}}` and fixed `--exclude-dir` basename matching (grep doesn't match paths).

**Memory-management research (OpenClaw / MemGPT / Generative Agents / Voyager lens)**
Our five-layer framework maps cleanly to established memory-type taxonomy. Procedural = SKILL.md; semantic = references/; episodic = `docs/knowledge/lessons/` (append-only memory stream per Generative Agents pattern); working = Claude Code's context window (managed via progressive disclosure, mirroring MemGPT memory tiers). Our graduation mechanism IS reflection (Generative Agents) + skill acquisition (Voyager). Tier 1/2/3 context budget IS memory tiering by access frequency (MemGPT). Future directions noted for post-comprehensive-reshape: importance scoring on lessons, recurrence count on patterns, retrieval-weighted by recency × relevance × importance.

**Regression check**
All 6 real repos (figma/sds, plus-marketing-website, caricature, oracle-chat, lightning, plus-uno) continue to route correctly after the reshape. Budgets green: Tier 1 179/200, all 4 SKILL.md under 500-line hard cap (hd-maintain 240, hd-learn 124, hd-review 324, hd-setup 326).

## [1.0.0] — 2026-04-17 (full release — all four skills)

First public release. Four-skill design-harness plug-in, full-release at v1.0.0. Users get the complete set immediately — no phased rollout.

### Added

**Four complete skills:**

- **`hd-learn`** — LEARN verb. Article-backed Q&A about the five-layer framework (Context / Skills / Orchestration / Rubrics / Knowledge). 11 files: SKILL.md router + 10 atomic reference files (concept-overview, memory-taxonomy, 5 layer explainers, glossary, 10-question FAQ, compound-engineering coexistence). 53 article § citations across the skill.

- **`hd-setup`** — SETUP verb. Adaptive scaffold / reorganize / audit of the five-layer harness in a user's repo. 23 files: SKILL.md router + 9 references (5 layer-specific + 4 shared: tier-budget-model, good-agents-md-patterns, coexistence-checklist, local-md-schema) + 3 workflows (greenfield / scattered / advanced) + 9 templates (AGENTS.md, design-harnessing.local.md, context-skeleton with 4 sub-files, knowledge-skeleton with 3 sub-files) + `scripts/detect-mode.sh` deterministic bash mode detection emitting LOCKED JSON shape.

- **`hd-maintain`** — MAINTAIN verb. Capture lessons + graduate to rules. **SHA-256 plan-hash proof-of-consent** for the destructive AGENTS.md write prevents hallucinated approval from runaway agents or LLM-default "yes" completions. 9 files: SKILL.md + 3 references (lesson-patterns, graduation-criteria, plan-hash-protocol) + 3 workflows (capture, propose-graduation, apply-graduation) + 2 templates.

- **`hd-review`** — IMPROVE verb. Audit harness health (multi-agent orchestration via Task tool, parallel/serial auto-switch at 6+ agents per compound 2.39.0 lesson) + critique work items against team rubrics. Declares `<protected_artifacts>` block so `/ce:review` respects our outputs during cross-plug-in runs. 15 files: SKILL.md + 5 references + 3 workflows (audit-parallel, audit-serial, critique) + 2 templates + 3 starter rubrics (accessibility-wcag-aa, design-system-compliance, component-budget) + `scripts/budget-check.sh`.

**Three sibling manifests (cross-platform submission from day one):**
- `.claude-plugin/plugin.json` — Claude Code marketplace
- `.codex-plugin/plugin.json` — Codex CLI directory
- `.cursor-plugin/plugin.json` — Cursor marketplace
- `.cursor/rules/AGENTS.mdc` — Cursor IDE thin redirect → AGENTS.md

**Universal conventions:**
- `AGENTS.md` — canonical conventions doc (read natively by Claude Code, Codex CLI, Cursor CLI, Windsurf, GitHub Copilot)
- `CLAUDE.md` — one-line `@AGENTS.md` pointer (belt-and-suspenders)

**Meta-harness (dogfood):**
- `docs/context/` — Layer 1 for this plug-in's own build (agent-persona, product one-pager, design-system/file conventions cheat-sheet, conventions/how-we-work)
- `docs/knowledge/` — Layer 5 with 3 real lessons from the build session + one graduation visible in git history
- `docs/rubrics/INDEX.md` — Layer 4 thin pointer (distributed-pattern explainer)
- `docs/plans/` — PRDs + implementation plans + scenario matrices (historical record of the build)

**First graduated rule (via episodic→procedural graduation):**
- "Don't ship future-version skill stubs with `disable-model-invocation: true`" — lesson + AGENTS.md rule + graduations.md meta-entry. Surfaced by `/ce:review` synthesis of 3 independent reviewer agents. Informed the decision to ship all four skills together rather than stage behind article cadence.

### Changed

- Flattened repo layout from `plugins/design-harness/*` to repo root (single-plug-in repo; not marketplace-shape).

### Removed

- Nested `plugins/design-harness/` directory (single-plug-in repo).
- `.claude-plugin/marketplace.json` (single plug-in, not marketplace).
- Superseded PRD drafts (v0.2 baseline, v0.3 deepened, 004 rejected 6-skill taxonomy) — preserved in git history.
- Empty `agents/` directory tree (zero sub-agents shipped; uses compound-engineering's via fully-qualified Task calls).
- `CONTRIBUTING.md` placeholder (single-author repo; no contribution pipeline yet).
- Staged/phased release plans — all four skills ship together at v1.0.0.

### Coexistence

All namespace-isolation rules with `compound-engineering` locked in. See [AGENTS.md § Coexistence](AGENTS.md#coexistence-with-compound-engineering).

### Acceptance

Per `docs/plans/2026-04-16-005-feat-v0-mvp-implementation-plan.md` + 006 + 007:
- Phase 1 structural refactor passed 10/10 verification checks (commit `6d7a5e16`)
- hd-learn passed 7/7 acceptance checks (commit `d361bb2e`)
- hd-setup passed 8/8 acceptance checks (commit `b4387dd2`)
- Meta-harness + graduation example (commit `712222aa`)
- hd-maintain with plan-hash protocol (commit `540a1b45`)
- hd-review with `<protected_artifacts>` block + budget-check.sh (commit `5a871c87`)
- README + CHANGELOG reflect full-release state (commit `ddd159cd` + this commit)

### Pending before public ship

- n=5 usability tests per skill (median TTFUI ≤30 min; median "articulate value" ≤5 min)
- 12/12 scenario tests per `docs/plans/hd-setup-success-criteria.md`
- Plan-hash round-trip smoke test for hd-maintain (propose → apply on scratch repo)
- Audit smoke test for hd-review (verify exactly 1 write to `docs/knowledge/lessons/harness-audit-*.md`)
- Article URLs filled in (currently *TBD* placeholders in README + manifest descriptions)
- Release tag `v1.0.0` pushed to remote
