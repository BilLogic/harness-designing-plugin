# Changelog

All notable changes to the `design-harness` plug-in are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

*(No changes since [0.1.0] ship-ready.)*

## [0.1.0] — 2026-04-16 (v0.MVP, ready to ship)

First public release. Ships alongside Substack article #1.

### Added

**Two complete skills:**
- `hd-onboard` — article-backed Q&A about the five-layer design harness framework (learn verb). 11 files: SKILL.md router + 10 atomic reference files (concept-overview, memory-taxonomy, 5 layer explainers, glossary, 10-question FAQ, compound-engineering coexistence). 53 article § citations across the skill.
- `hd-setup` — adaptive scaffold / reorganize / audit of the five-layer harness in a user's repo (setup verb). 23 files: SKILL.md router + 9 references (5 layer-specific + 4 shared: tier-budget-model, good-agents-md-patterns, coexistence-checklist, local-md-schema) + 3 workflows (greenfield / scattered / advanced) + 9 templates (AGENTS.md, design-harnessing.local.md, context-skeleton with 4 sub-files, knowledge-skeleton with 3 sub-files) + `scripts/detect-mode.sh` deterministic bash mode detection emitting LOCKED JSON shape.

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
- `docs/plans/` — PRDs + scenario matrices (historical record of the build)

**First graduated rule (via episodic→procedural graduation):**
- "Don't ship future-version skill stubs with `disable-model-invocation: true`" — lesson + AGENTS.md rule + graduations.md meta-entry, all dated 2026-04-16. Surfaced by `/ce:review` synthesis of 3 independent reviewer agents.

### Changed

- Flattened repo layout from `plugins/design-harness/*` to repo root (single-plug-in repo; not marketplace-shape).
- Rescoped v0.MVP to two ship-ready skills; `hd-compound` moved to v0.5, `hd-review` to v1.

### Removed

- Nested `plugins/design-harness/` directory (single-plug-in repo).
- `.claude-plugin/marketplace.json` (single plug-in, not marketplace).
- v0.5/v1 stub skills — graduated rule applies.
- Superseded PRD drafts (v0.2 baseline, v0.3 deepened, 004 rejected 6-skill taxonomy) — preserved in git history.
- Empty `agents/` directory tree (v0.MVP ships zero sub-agents; use compound-engineering's via fully-qualified Task calls).
- `CONTRIBUTING.md` placeholder (single-author repo; no contribution pipeline yet).

### Coexistence

All namespace-isolation rules with `compound-engineering` locked in. See [AGENTS.md § Coexistence](AGENTS.md#coexistence-with-compound-engineering).

### Acceptance

Per `docs/plans/2026-04-16-005-feat-v0-mvp-implementation-plan.md`:
- Phase 1 structural refactor passed 10/10 verification checks (commit `6d7a5e16`)
- Phase 2a hd-onboard passed 7/7 acceptance checks (commit `d361bb2e`)
- Phase 2b hd-setup passed 8/8 acceptance checks (commit `b4387dd2`)
- Phase 3 meta-harness + graduation + CHANGELOG finalize — this release

Pending before v0.MVP ships to marketplaces:
- n=5 usability tests (median TTFUI ≤30 min; median "articulate value" ≤5 min)
- 12/12 scenario tests per `docs/plans/hd-setup-success-criteria.md`
- Article #1 URL filled in (currently *TBD* placeholder in README)
