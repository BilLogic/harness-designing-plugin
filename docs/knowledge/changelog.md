---
memory_type: temporal
domain: changelog
split_threshold: 50
---
<!-- Tier: 3 (harness changelog — audit trail for structural + rule-adoption events) -->
# Changelog

Harness-structural changes and rule-adoption events over time. Loaded infrequently; exists so `/hd:review audit` can trace when structural decisions were made.

NOT a changelog for the plug-in's shipped features — that's `CHANGELOG.md` at repo root. This file is specifically for changes to the HARNESS structure of THIS plug-in's meta-harness (`docs/`), plus the rule-adoption meta-log (which lessons were promoted into AGENTS.md rules, and when).

## Format

```markdown
## YYYY-MM-DD — <short-change-title>

**Changed:** <what part of the harness changed>
**Before:** <what it was>
**After:** <what it is now>
**Why:** <brief rationale>
**Source:** <link to lesson or plan, if applicable>
```

## Entries

<!-- Add new entries above this line, most recent first. -->

## 2026-04-18 — Phase 3e–3j shipped

**Changed:** skill + agent + rubric roster reached v1.0.0 shape
**Before:** pre-3e hd-onboard / hd-compound naming; 3 agents; 3 rubrics
**After:** hd-learn / hd-maintain rename; 9 agents across 3 categories; 14 starter rubrics; 4 scripts
**Why:** verb-intent naming (learn/setup/maintain/review) aligns with memory-operation taxonomy; agent expansion supports 5-way parallel layer audit
**Source:** canonical record is repo-root [CHANGELOG.md](../../CHANGELOG.md) (Phases 3e–3j); pilot validation in [lessons/2026-04-18-parallel-pilots-3-6-consolidated.md](lessons/2026-04-18-parallel-pilots-3-6-consolidated.md)
