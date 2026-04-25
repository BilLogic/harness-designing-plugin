---
title: "Reading compound-engineering's installed cache as the canonical reference"
date: 2026-04-16
tags: [compound-engineering, skill-authoring, reference-pattern, coexistence]
graduation_candidate: false
---

# Lesson

**Context:** Building v0.MVP scaffolding from a plan, we needed to match 2026 Claude Code plug-in conventions precisely. Compound-engineering was already installed at `~/.claude/plugins/cache/compound-engineering-plugin/compound-engineering/2.42.0/`.

**Decision / Observation:** Rather than infer conventions from docs or ask what pattern to follow, we read compound's **installed cache directly** — `AGENTS.md`, `.claude-plugin/plugin.json`, `CLAUDE.md` (which was literally `@AGENTS.md`, one line), `CHANGELOG.md`, and most importantly `skills/create-agent-skills/` (the canonical meta-skill for skill authoring). Patterns surfaced from the live code that wouldn't have shown up in prose docs:

- Commands migrated to skills in compound 2.39.0 — no separate `commands/` directory
- `.cursor-plugin/` sibling manifest already shipped (cross-platform awareness older than we thought)
- `CLAUDE.md = @AGENTS.md` is the minimal insurance pattern — 1 line
- Keep-a-changelog format with dated `[X.Y.Z]` sections
- Description ≤180 chars (compound 2.31.0 context budget lesson)
- Fully-qualified Task names required for cross-plugin invocation (compound 2.35.0 fix)
- Semantic split: references = READ, workflows = FOLLOW, templates = COPY+FILL, scripts = EXECUTE
- `argument-hint:` must quote YAML special chars (compound 2.36.0 crash fix)

**Result:** Our structure now mirrors compound's at every layer where pattern-match helps — manifest shape, SKILL.md frontmatter, `create-agent-skills`-style sub-directories. Divergences are deliberate (design vs engineering domain, five-layer noun stack vs compound loop) rather than accidental.

**Graduation-readiness:** Too early. This is a process lesson, not a rule — the pattern "read installed cache first" is how we'd onboard contributors. Won't graduate unless it becomes a repeat issue (e.g., contributors missing conventions; then `AGENTS.md` adds "Read compound's installed cache at [path] before authoring your first skill" as a graduated rule).
