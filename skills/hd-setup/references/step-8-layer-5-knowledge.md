---
title: Step 8 — Layer 5 (Knowledge) full procedure
loaded_by: hd-setup
---

## Purpose

Full procedure for Layer 5 (Knowledge) — episodic memory and procedural rules. Load when Step 8 runs.

## Step 8 — Layer 5 (Knowledge)

**Frame:** "Layer 5 — Knowledge. What the team has learned. Episodic memory + procedural (article §4e)."

**Show:** `has_plans_convention` + count, existing lessons count, rule adoption count, `team_tooling.docs` (for retros) and `team_tooling.pm` (for closed-issue decisions).

**Propose default:**
- `has_plans_convention: true` → **critique** — invoke `rule-candidate-scorer` on existing lessons
- `team_tooling.docs` + MCP live → **scaffold** + offer to pull retro/post-mortem/decision-labeled pages
- Nothing → **scaffold** empty lessons dir from [`../assets/knowledge-skeleton/`](../assets/knowledge-skeleton/)

**Execute — critique:** invoke:

```
Task design-harnessing:analysis:rule-candidate-scorer(
  lessons_root: "docs/knowledge/lessons/",
  rules_log: "docs/knowledge/changelog.md"
)
```

Surface ready clusters to user. Suggest `/hd:maintain rule-propose <topic>` for each.

**Execute — scaffold:**
- Load [`layer-5-knowledge.md`](layer-5-knowledge.md) for L5 depth
- Seed questions: (1) 3 decisions in last 6 months new hire should know? (2) mistake you want to prevent recurring? (3) pattern across 3+ projects worth formalizing?
- Write `docs/knowledge/INDEX.md`, `docs/knowledge/changelog.md`, 1 starter lesson

→ Return to [../SKILL.md § Step 8 — Layer 5 (Knowledge)](../SKILL.md#step-8--layer-5-knowledge)
