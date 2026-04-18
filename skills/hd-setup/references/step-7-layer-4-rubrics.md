---
title: Step 7 — Layer 4 (Rubrics) full procedure
loaded_by: hd-setup
---

## Purpose

Full procedure for Layer 4 (Rubrics) — taste embedded as explicit checks. Covers the critique+extract path for repos with existing AI-docs and the scaffold path for starter rubrics. Load when Step 7 runs.

## Step 7 — Layer 4 (Rubrics)

**Frame:** "Layer 4 — Rubrics. Taste embedded as checks. Distributed pattern (article §4d)."

**Show:** `has_tokens_package` + `tokens_package_paths`, `has_figma_config`, `a11y_framework_in_use` + `detected_a11y_packages`, existing `docs/rubrics/` or `docs/context/design-system/` rubric files, combined size of existing AI-docs (AGENTS.md + CLAUDE.md + `.cursor/rules/` + `.github/copilot-instructions.md` + DESIGN.md).

**Rationale injection:** when `a11y_framework_in_use: true`, elevate the `accessibility-wcag-aa` rubric in recommendations with the framework name — e.g., *"accessibility-wcag-aa is especially relevant because your repo already uses `<detected_a11y_packages>`; the rubric grounds the a11y investment in explicit checks."*

**Propose default** (checked in order; first match wins):

| Condition | Default |
|---|---|
| 1. `has_ai_docs: true` AND combined existing AI-doc size > 200 lines | **critique + extract** (surface implicit rubrics from existing docs; do NOT duplicate as fresh starters) |
| 2. `has_tokens_package` or `has_figma_config` | **scaffold** design-system-compliance rubric referencing actual token paths |
| 3. `has_external_skills: true` | **scaffold** skill-quality rubric entry |
| 4. Nothing detected | **scaffold** starter trio (accessibility-wcag-aa + design-system-compliance + component-budget) |

Condition 1 mirrors Layer 1's link-default logic: respect what already exists. A repo with 16 KB of Copilot instructions has implicit rubric content already; duplicating as fresh starters adds noise.

**Execute — critique + extract** (condition 1):
1. Invoke the rubric-applicator sub-agent against each existing AI-doc with a "meta-extract" target: find rule-like statements that could become explicit rubric criteria.
   ```
   Task design-harnessing:review:rubric-applicator(
     work_item_path: ".github/copilot-instructions.md",
     rubric_path: "skills/hd-review/assets/starter-rubrics/skill-quality.md",
     mode: "extract"
   )
   ```
2. Present extracted candidates to user as a list: *"I see 5 implicit rubrics in your copilot-instructions.md: (a) approved color tokens, (b) React Aria for a11y, (c) component-budget gate for new primitives, (d) storybook-first pattern, (e) no-hex-codes. Want to promote any to explicit rubric files under `docs/rubrics/`?"*
3. For each candidate the user approves: copy the matching starter rubric from [`../../hd-review/assets/starter-rubrics/`](../../hd-review/assets/starter-rubrics/) to `docs/rubrics/<name>.md`, pre-fill with the extracted content, show the user the result, atomic write on confirmation.
4. For candidates the user rejects: record in `hd-config.md` prose section as "surfaced but declined" so re-runs don't re-propose.
5. Never modify the source AI-doc file. Extraction is read-only on the source.

**Execute — scaffold** (conditions 2/3/4):
- Load [`layer-4-rubrics.md`](layer-4-rubrics.md) for L4 depth (distributed-behavior rationale, 12-starter enumeration, INDEX.md pattern)
- Seed questions (open-ended first): (1) first thing you check when reviewing? (2) mistake seen twice? (3) one bar new designer should clear?
- If "no clear criteria yet" → offer the 12 starter rubrics at [`../../hd-review/assets/starter-rubrics/`](../../hd-review/assets/starter-rubrics/) (distilled from Impeccable + Nielsen + Material 3 + Fluent 2) + fallback baselines
- Write `docs/rubrics/INDEX.md` from [`../assets/rubrics-index.md.template`](../assets/rubrics-index.md.template)
- Copy user-selected starter rubrics into `docs/rubrics/<name>.md` (NOT `docs/context/design-system/` — that's Layer 1 source content; rubrics are checks against it)

**Execute — critique** (targeted, when user explicitly points at a work item): invoke:

```
Task design-harnessing:review:rubric-applicator(
  work_item_path: <user-provided>,
  rubric_path: <rubric file>
)
```

→ Return to [../SKILL.md § Step 7 — Layer 4 (Rubrics)](../SKILL.md#step-7--layer-4-rubrics)
