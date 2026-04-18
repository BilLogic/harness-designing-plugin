---
title: Audit criteria — Coexistence (cross-cutting)
loaded_by: hd-review audit mode (run once at the end of the parallel layer dispatch)
---

# Audit criteria: Coexistence & cross-cutting checks

## Purpose

Cross-cutting criteria that span all five layers: compound-engineering
coexistence, pre-existing harness detection (`.agent/` / `.claude/` / `.codex/`),
protected-artifact integrity, naming discipline, scope boundaries. Loaded once
per audit run (not dispatched per-layer).

## Criteria

### no-writes-to-compound-namespace
- **Check:** no writes to `docs/solutions/` (compound-engineering's namespace)
- **Default severity:** p1
- **Pass example:** team uses `docs/design-solutions/` for our equivalent
- **Fail example:** an hd-* skill or rubric writes into `docs/solutions/**`
- **Scope:** cross-cutting

### hd-config-schema-valid
- **Check:** `hd-config.md` schema valid per `hd-setup/references/hd-config-schema.md`
- **Default severity:** p2
- **Pass example:** all required keys present, types correct
- **Fail example:** missing `design_system:` key, or unknown top-level key
- **Scope:** cross-cutting

### fully-qualified-task-calls
- **Check:** cross-plug-in Task calls are fully qualified (no bare `learnings-researcher` etc.)
- **Default severity:** p1
- **Pass example:** `Task compound-engineering:research:learnings-researcher(...)`
- **Fail example:** bare `Task learnings-researcher(...)` — will get re-prefixed wrong
- **Scope:** cross-cutting (grep skill files for violations)

### naming-discipline
- **Check:** skill dirs use `hd-*` prefix; `name:` frontmatter uses `hd:verb`; plan files use `YYYY-MM-DD-NNN-<type>-<slug>-plan.md`
- **Default severity:** p2
- **Pass example:** all three conventions honored
- **Fail example:** a `review.md` plan without the date+seq prefix, or a skill named `setup` without `hd-` prefix
- **Scope:** cross-cutting

### protected-artifacts-block-present
- **Check:** `<protected_artifacts>` block in `skills/hd-review/SKILL.md` is present and parseable
- **Default severity:** p1
- **Pass example:** block parses, lists canonical paths
- **Fail example:** block missing, malformed YAML, or references nonexistent paths
- **Scope:** cross-cutting

### protected-paths-canonical
- **Check:** paths in the protected block match the canonical set (`docs/design-solutions/**`, `docs/knowledge/**`, `docs/context/**`, `AGENTS.md`, `hd-config.md`, `skills/**`)
- **Default severity:** p1
- **Pass example:** block lists exactly the canonical set
- **Fail example:** a required path (e.g., `docs/knowledge/**`) is missing
- **Scope:** cross-cutting

### protected-artifact-integrity
- **Check:** if `/ce:review` or another review tool modified any protected path since the last audit → structural violation
- **Default severity:** p1
- **Pass example:** git log on protected paths shows only hd-* or human commits since last audit marker
- **Fail example:** `/ce:review` commit touched `docs/knowledge/**`
- **Scope:** cross-cutting

### existing-harness-additive-only
- **Check:** when `.agent/` or `.claude/` is detected with ≥1 skill or rule file, `/hd:setup` is additive-only (never modifies `CLAUDE.md`, `AGENTS.md`, `.agent/`, `.claude/`, `docs/context/`, `docs/knowledge/`, `docs/rubrics/`, or compound artifacts)
- **Default severity:** p1
- **Pass example:** only new files created; existing harness untouched
- **Fail example:** hd-setup rewrote `AGENTS.md` in a repo that already had one
- **Scope:** cross-cutting (grounded in 2026-04-18 graduated rule)

## What's out of scope for this audit

`hd:review` checks **harness health**, not:

- Code quality of the user's product (that's compound's `/ce:review` domain)
- Security audits (not our domain)
- Performance analysis (not our domain)
- Design-system correctness of a specific work item (that's `hd:review critique` mode, not audit)

If the user asks "is my app accessible?" → route to `hd:review critique <file>` with accessibility rubric, not audit mode.

## Priority framework

### P1 — Structural (ship-blocking in dogfood; urgent in user repos)
- Tier 1 budget violated
- Missing required layer (Layer 1 empty, Layer 5 missing)
- Coexistence violation (writes to `docs/solutions/`)
- `<protected_artifacts>` integrity violated
- Schema validation failure in `hd-config.md`

### P2 — Drift (should fix; not blocking)
- Stale files (6+ months, no explicit stable marker)
- Rule-adoption drought (10+ same-tag lessons, 0 adoptions)
- Skill-count drift (unused or proliferating)
- Naming inconsistencies
- Description char-budget violations

### P3 — Polish (nice-to-have)
- Tag canonicalization opportunities
- Minor file organization improvements
- Cross-reference completeness
- Comment cleanup

## Output shape

Each check produces:
```yaml
- check: <name>
  status: pass | warn | fail
  severity: p1 | p2 | p3
  evidence: "<what was observed>"
  recommendation: "<what to do if fail>"
```

## See also

- Parent skill: `../SKILL.md`
- Tier-1 budget interpretation: `audit-criteria-budget.md`
- Per-layer criteria: `audit-criteria-l{1..5}-*.md`
