---
title: "Pilots #3–#6 (parallel) — consolidated findings across caricature, oracle-chat, lightning, plus-uno"
date: 2026-04-18
tags: [pilot, parallel, caricature, oracle-chat, lightning, plus-uno, detect.py, templates, rubrics, graduation]
graduation_candidate: yes-multiple
importance: 5
---

# Lesson

**Context:** Ran pilots #3–#6 as four parallel sub-agents against `/tmp/hd-real-test/{caricature, oracle-chat, lightning, plus-uno}/`. Each sub-agent executed the full hd:setup flow, wrote a pilot branch (zero modifications to existing files), and reported findings. Combined with prior pilots on sds (#1) and plus-marketing-website (#2), this gives **6 real-repo data points**.

## Per-repo outcome

| # | Repo | Mode | L1 | L2 | L3 | L4 | L5 | Files | Commit |
|---|---|---|---|---|---|---|---|---|---|
| 1 | sds | greenfield-ish | scaffold | — | — | scaffold | scaffold | ~14 | (earlier) |
| 2 | plus-marketing | advanced | skip | skip | skip | scaffold(5) | scaffold | 11 | d24e6db |
| 3 | caricature | advanced | scaffold | skip | skip | scaffold(4) | scaffold | 22 | b2d7f4a |
| 4 | oracle-chat | advanced | skip | skip | skip | scaffold(5) | scaffold | 14 | ffc14e04 |
| 5 | lightning | advanced | skip | skip | skip | scaffold(5) | scaffold | 14 | f199850f |
| 6 | plus-uno (reference) | advanced | skip | skip | skip | scaffold(5) | skip | 7 | c7fe0bd6 |

All 6 produced a pilot branch. Zero modifications across all 6. Additive-only discipline held universally.

## Graduation-ready patterns (3+ data points)

### 1. `.agent/` or `.claude/` present → default "skip L1/L2/L3, scaffold L4/L5"

Confirmed on **plus-marketing, oracle-chat, lightning, plus-uno** (4 pilots). Caricature had no `.agent/` → needed L1 scaffold → correctly diverged. This is the core graduation candidate from the pilot series. **Graduate into SKILL.md Step 4 default table.**

### 2. Additive-only discipline when existing harness detected

All 6 pilots: zero modifications to pre-existing files. The rule "if we detect an existing harness, hd-setup is additive-only" is now empirically stable. **Graduate into AGENTS.md as a top-level rule.**

### 3. `hd-config.md.template` is silently incomplete

Every pilot (#2–#6) hand-added `layer_decisions`, `other_tool_harnesses_detected`, `files_written` to the config. Template is missing all three. **Immediate fix — graduate those fields.**

### 4. `rubrics-index.md.template` asset missing

SKILL.md Step 7 references it; file doesn't exist. Every pilot hand-wrote `docs/rubrics/INDEX.md`. **Immediate fix — create the template.**

## detect.py gaps (recurring across pilots)

| Gap | Pilots affected | Fix |
|---|---|---|
| a11y regex misses `@radix-ui/*`, `radix-ui`, `@headlessui/*`, `@reach/*`, `react-bootstrap` | oracle-chat, plus-uno | Expand `A11Y_FRAMEWORK_PATTERNS` |
| No `has_rubrics_dir` / `rubrics_file_count` signal | plus-uno | Add L4 inventory signal |
| No `has_knowledge_dir` / `knowledge_file_count` / `memory_types_present` | plus-uno | Add L5 maturity signal |
| No `layers_present: [L1, L4, L5]` composite | plus-uno, all | Derive from above |
| Managed-DS deps (`antd`, `chakra-ui`, `mantine`, `@mui/material`) unseen | caricature, lightning | Add `managed_design_system` signal |
| `todos/` markdown PM convention unseen | caricature | Add to team_tooling.pm |
| `external_skills_count` counts directories as files | lightning (reported 8, actual 5) | Glob `*.md` only |
| User-level MCPs invisible (only scans repo `.mcp.json`) | plus-uno | Document scope OR add `--include-user-mcps` |
| `docs/solutions/` / `docs/ideation/` / `docs/brainstorms/` existence not surfaced as compound-footprint detail | caricature, oracle-chat, lightning | Enrich `coexistence.compound_engineering` with paths found |
| `schema_version` in template lags detect.py output (1 vs 2) | oracle-chat | Bump template to v2 |
| `article_read` field has no detection path | lightning | Prompt-driven or drop |
| Embedded `skill/` folder ≠ `.claude/skills/` not disambiguated | caricature (app exports a persona skill) | Ask before assuming |

## Rubric library gaps

1. **IoT / hardware / telemetry** — lightning has 53 binary message types + `apps/iot-gateway/`. No starter rubric covers device-state visualization, telemetry freshness, offline/stale affordances, real-time data display.
2. **Bilingual / CJK typography & ux-writing** — caricature (zh-CN) and lightning (zh-EN bilingual) both flagged. Current `typography.md` and `ux-writing.md` are English-centric.
3. **Managed-DS pre-fills** — when AntD / Chakra / MUI / Mantine is detected, `design-system-compliance.md` should be pre-filled with that DS's specific hooks (token names, component imports, theme config).

## Rubric-applicator `extract` mode still unused

4 pilots later, no pilot has actually exercised `mode: extract` on `agents/review/rubric-applicator.md`. Every pilot with rich existing AI-docs (plus-marketing 650 lines, oracle-chat with product-development skill references, lightning 2860 lines) did **scaffold + reference** instead of **critique + extract**. Need a synthetic run to validate the documented output shape before any user hits it cold.

## Process observations

- **Sub-agent parallelism worked cleanly.** 4 concurrent pilots against 4 separate `/tmp/hd-real-test/*` clones produced no conflicts. Each agent returned a self-contained report. Total wall time ~4 minutes (vs ~30 min serial).
- **Every report converged on similar gap categories.** High agreement is a signal that the gaps are real (not just one agent's quirk).
- **The `other_tool_harnesses_detected` field proved its worth** in dense-coexistence repos (oracle-chat and lightning both had 3+ compound conventions active). Formalizing its schema is worth doing before `/hd:review audit` lands.

## Files written to our plug-in during consolidation

Just this lesson file (`docs/knowledge/lessons/2026-04-18-parallel-pilots-3-6-consolidated.md`). No skill or script changes yet — those go into a follow-up Phase 3e plan.

## Next steps

1. **Phase 3e plan** — split into 3 clean parts:
   - **E1 (template graduations):** `hd-config.md.template` fields + `rubrics-index.md.template` asset + schema_version bump → unblocks all future pilots
   - **E2 (detect.py signal expansion):** L4/L5 maturity + managed-DS + a11y primitive libs + external_skills_count fix + compound footprint detail
   - **E3 (rubric library expansion round 2):** IoT/telemetry rubric + CJK/bilingual addendum + managed-DS pre-fill sections
2. **Graduate the "existing-harness → additive-only, L4/L5-only scaffold" default** into SKILL.md Step 4 + AGENTS.md graduated-rules.
3. **Exercise rubric-applicator `extract` mode** once, synthetically, against plus-uno's `AGENTS.md` Forbidden Patterns — validate output shape.
4. **Bill reviews 4 pilot branches** and decides which (if any) to cherry-pick into main working branches.

## See also

- Pilot #2 (plus-marketing): [2026-04-18-pilot-plus-marketing-website.md](./2026-04-18-pilot-plus-marketing-website.md)
- Pilot #1 (sds): [2026-04-17-pilot-figma-sds.md](./2026-04-17-pilot-figma-sds.md)
- sds re-pilot: [2026-04-17-sds-re-pilot-after-phase-3a.md](./2026-04-17-sds-re-pilot-after-phase-3a.md)
- Phase 3d plan: [`../../plans/2026-04-17-011-refactor-phase-3d-template-alignment-plan.md`](../../plans/2026-04-17-011-refactor-phase-3d-template-alignment-plan.md)

## Pilot branches for cherry-pick

- caricature: `pilot/hd-setup-2026-04-18-caricature` @ `b2d7f4a`
- oracle-chat: `pilot/hd-setup-2026-04-18-oracle-chat` @ `ffc14e04`
- lightning: `pilot/hd-setup-2026-04-18-lightning` @ `f199850f`
- plus-uno: `pilot/hd-setup-2026-04-18-plus-uno` @ `c7fe0bd6`

All at `/tmp/hd-real-test/<repo>/`. None pushed.
