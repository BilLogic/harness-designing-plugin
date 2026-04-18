---
title: Step 5 — Layer 2 (Skills) full procedure
loaded_by: hd-setup
---

## Purpose

Full procedure for Layer 2 (Skills) — procedural memory codified as AI capabilities. Load when Step 5 runs.

## Step 5 — Layer 2 (Skills)

**Frame:** "Layer 2 — Skills. AI capabilities your team codifies. Procedural memory (article §4b)."

**Show:** `has_external_skills`, `has_claude_dir`, `.agent/skills/` presence.

**Propose default:**
- `has_external_skills: true` → **critique** via skill-quality rubric
- `.agent/skills/` → **link**
- Nothing → **skip** (Layer 2 is premature for most teams)

**Execute — critique:** per-skill invocation:

```
Task design-harnessing:review:skill-quality-auditor(
  skill_md_path: "<path>/SKILL.md"
)
```

Aggregate findings. Present to user. Don't modify anything.

**Execute — scaffold:** seed questions: (1) workflow explained 3+ times last month? (2) repetitive task worth automating? Point user at [`layer-2-skills.md`](layer-2-skills.md) for authoring discipline.

→ Return to [../SKILL.md § Step 5 — Layer 2 (Skills)](../SKILL.md#step-5--layer-2-skills)
