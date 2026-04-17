# Changelog

All notable changes to the `design-harness` plug-in are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

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
- **Deleted `workflows/` folders** in hd-setup, hd-compound, hd-review. Procedures absorbed into each SKILL.md inline. Rationale: workflows inside skills conflated procedural memory with orchestration memory. Shared procedures that span skills are now sub-agents in `agents/`. Matches compound-engineering's current (GitHub main) convention where most skills are flat SKILL.md + references + assets.
- **Renamed `templates/` → `assets/`** in all skills (matches compound's current convention).
- **hd-setup SKILL.md rewritten** (164 → 326 lines): 10-step workflow with explicit Layers 1–5 each as their own step (was previously hidden under a single "five-layer walk" bullet). Per-layer procedure with FRAME → SHOW → PROPOSE → ASK → EXECUTE. Per-layer checkpoint (A/B/C/D: review/capture/inspect/continue) prevents agent-driven steamrolling. Explicit `link / critique / scaffold / skip` contract at every layer. Strict non-interference with `.agent/` / `.claude/` / `.codex/` / external `.cursor/skills/`.
- **hd-compound SKILL.md rewritten** (122 → 240 lines): three modes (capture / propose / apply) inlined with distinct checklists each. Integration with `design-harnessing:research:lesson-retriever` (capture Phase 1) and `design-harnessing:analysis:graduation-candidate-scorer` (propose).
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
All 6 real repos (figma/sds, plus-marketing-website, caricature, oracle-chat, lightning, plus-uno) continue to route correctly after the reshape. Budgets green: Tier 1 179/200, all 4 SKILL.md under 500-line hard cap (hd-compound 240, hd-onboard 124, hd-review 324, hd-setup 326).

## [1.0.0] — 2026-04-17 (full release — all four skills)

First public release. Four-skill design-harness plug-in, full-release at v1.0.0. Users get the complete set immediately — no phased rollout.

### Added

**Four complete skills:**

- **`hd-onboard`** — LEARN verb. Article-backed Q&A about the five-layer framework (Context / Skills / Orchestration / Rubrics / Knowledge). 11 files: SKILL.md router + 10 atomic reference files (concept-overview, memory-taxonomy, 5 layer explainers, glossary, 10-question FAQ, compound-engineering coexistence). 53 article § citations across the skill.

- **`hd-setup`** — SETUP verb. Adaptive scaffold / reorganize / audit of the five-layer harness in a user's repo. 23 files: SKILL.md router + 9 references (5 layer-specific + 4 shared: tier-budget-model, good-agents-md-patterns, coexistence-checklist, local-md-schema) + 3 workflows (greenfield / scattered / advanced) + 9 templates (AGENTS.md, design-harnessing.local.md, context-skeleton with 4 sub-files, knowledge-skeleton with 3 sub-files) + `scripts/detect-mode.sh` deterministic bash mode detection emitting LOCKED JSON shape.

- **`hd-compound`** — MAINTAIN verb. Capture lessons + graduate to rules. **SHA-256 plan-hash proof-of-consent** for the destructive AGENTS.md write prevents hallucinated approval from runaway agents or LLM-default "yes" completions. 9 files: SKILL.md + 3 references (lesson-patterns, graduation-criteria, plan-hash-protocol) + 3 workflows (capture, propose-graduation, apply-graduation) + 2 templates.

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
- hd-onboard passed 7/7 acceptance checks (commit `d361bb2e`)
- hd-setup passed 8/8 acceptance checks (commit `b4387dd2`)
- Meta-harness + graduation example (commit `712222aa`)
- hd-compound with plan-hash protocol (commit `540a1b45`)
- hd-review with `<protected_artifacts>` block + budget-check.sh (commit `5a871c87`)
- README + CHANGELOG reflect full-release state (commit `ddd159cd` + this commit)

### Pending before public ship

- n=5 usability tests per skill (median TTFUI ≤30 min; median "articulate value" ≤5 min)
- 12/12 scenario tests per `docs/plans/hd-setup-success-criteria.md`
- Plan-hash round-trip smoke test for hd-compound (propose → apply on scratch repo)
- Audit smoke test for hd-review (verify exactly 1 write to `docs/knowledge/lessons/harness-audit-*.md`)
- Article URLs filled in (currently *TBD* placeholders in README + manifest descriptions)
- Release tag `v1.0.0` pushed to remote
