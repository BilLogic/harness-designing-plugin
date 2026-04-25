---
title: Review criteria — Layer 3 (Orchestration)
loaded_by: hd-review review mode (via harness-auditor agent with layer: 3)
---

# Review criteria: Layer 3 — Workflow Orchestration

## Purpose

Criteria for the Orchestration layer: the **dispatch graph** between `skills/` (user-triggered) and `agents/` (skill-invoked). L3 is **not a folder**; orchestration emerges from legible wiring between L2 and the agents layer.

**Grading.** 4-level `content_status`: `missing` · `present-but-stale` · `present-and-populated` · `healthy`.

## Criteria

### agents-directory-present

- **Check:** `agents/` (or `.agent/agents/`, `.claude/agents/`) exists if team has ≥3 skills
- **Default severity:** p3 (optional for small teams)
- **Stale signal:** directory exists but empty, or contains only template placeholders

### agent-frontmatter-valid

- **Check:** every agent file has valid YAML frontmatter with `name` + `description`
- **Default severity:** p1
- **Content checks:**
  - Frontmatter parses
  - `description` non-empty, ≤180 chars (soft) / ≤1024 (hard)
  - `name` matches filename (kebab-case)

### dispatch-wiring-legible

- **Check:** skills that dispatch agents use fully-qualified Task names (`<namespace>:<category>:<agent>`)
- **Default severity:** p1
- **Content check:** grep every SKILL.md for `Task ` invocations; all should be `<ns>:<cat>:<name>(...)` form
- **Stale signal:** bare Task names (no namespace) — gets re-prefixed wrong on rename

### skill-to-agent-consistency

- **Check:** every agent referenced by a skill exists on disk
- **Default severity:** p1
- **Content check:** for every `Task ns:cat:agent` in any SKILL.md, verify `agents/<cat>/<agent>.md` (or equivalent path) exists
- **Stale signal:** skill references `harness-designing:analysis:foo` but `agents/analysis/foo.md` doesn't exist

### category-naming-sanity

- **Check:** agent categories are reasonable (using standard 5, or team has documented custom categories in AGENTS.md)
- **Default severity:** p3
- **Note:** standard categories are `research / planning / generation / review / compound`; users may deviate. Review does NOT enforce these names, just checks they're documented.

### workflow-gates-readable

- **Check:** if a skill's workflow includes rubric gates, the rubric path is explicit in SKILL.md
- **Default severity:** p2
- **Content check:** skills mentioning "apply rubric X" should cite the rubric's path under `docs/rubrics/`

### cross-plugin-namespace-respect

- **Check:** no skill dispatches into another plug-in's Task namespace
- **Default severity:** p1
- **Stale signal:** foreign Task calls (e.g. `compound-engineering:*` from our skills) — handled via `coexistence-analyzer`

## Output shape

```yaml
- check: <name>
  status: pass | warn | fail
  content_status: missing | present-but-stale | present-and-populated | healthy
  severity: p1 | p2 | p3
  evidence: "<observation>"
  recommendation: "<action>"
```

## See also

- Agent: `../../../agents/analysis/harness-auditor.md` (`layer: 3`)
- Coexistence: `../../../agents/analysis/coexistence-analyzer.md`
- Standard categories: `../../hd-setup/references/standard-agent-categories.md`
