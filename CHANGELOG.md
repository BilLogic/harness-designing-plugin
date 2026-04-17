# Changelog

All notable changes to the `design-harness` plug-in are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Changed
- Flattened repo layout from `plugins/design-harness/*` to repo root (single-plug-in repo; not marketplace-shape).
- Rescoped v0.MVP to two ship-ready skills (`hd-onboard`, `hd-setup`); `hd-compound` moved to v0.5, `hd-review` to v1.

### Added
- `.codex-plugin/plugin.json` sibling manifest (Codex CLI submission target).
- `.cursor/rules/AGENTS.mdc` thin redirect for Cursor IDE extension.

### Removed
- Nested `plugins/design-harness/` directory (single-plug-in repo).
- `.claude-plugin/marketplace.json` (single plug-in, not marketplace).
- v0.5/v1 stub skills (`hd-compound/SKILL.md`, `hd-review/SKILL.md`) — stubs with `disable-model-invocation: true` were foreclosing design space; will author real implementations at their release phase.
- Superseded PRD drafts (v0.2 baseline, v0.3 deepened, 004 rejected 6-skill taxonomy) — preserved in git history.
- Empty `agents/` directory tree (v0.MVP ships zero sub-agents).
- `CONTRIBUTING.md` placeholder (single-author repo; no contribution pipeline yet).

## [0.1.0] — pending v0.MVP ship

Ships with Substack article #1. Includes:
- `hd-onboard` — article-backed Q&A with citations (learn verb; 10 atomic reference files)
- `hd-setup` — adaptive scaffold/reorganize/audit (setup verb; 9 references + 3 workflows + templates + `detect-mode.sh` deterministic mode detection)
- `docs/` meta-harness demonstrating the advocacy (context/, knowledge/, rubrics/INDEX.md — the plug-in runs its own five-layer pattern on itself)
- Three sibling manifests (`.claude-plugin`, `.codex-plugin`, `.cursor-plugin`) targeting Claude Code marketplace, Codex CLI directory, Cursor marketplace.
