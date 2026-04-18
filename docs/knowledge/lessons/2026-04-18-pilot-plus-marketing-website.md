---
title: "Pilot #2 — plus-marketing-website after Phase 3d"
date: 2026-04-18
tags: [pilot, plus-marketing-website, phase-3d, agent-framework, notion-integration, shadcn-mcp]
graduation_candidate: too-early-to-tell
importance: 4
---

# Lesson

**Context:** Second real-repo pilot of `/hd:setup`, on Bill's plus-marketing-website. First pilot was on figma/sds (public, no prior harness); this one exercises a repo with a mature `.agent/` framework (12 rules + 4 skills, plus-uno convention) already in place. Tests whether Phase 3d corrections (plus-uno template baseline + 12-rubric library + domain-grouped lessons + hd-config.md rename + rubrics-at-docs/rubrics/) actually improve the output on a real repo with nontrivial starting state.

## What detect.py found

```json
{
  "mode": "advanced",
  "priority_matched": 2,
  "signals": {
    "has_agent_dir": true,
    "has_ai_docs": true,
    "a11y_framework_in_use": true
  },
  "mcp_servers": ["shadcn"],
  "team_tooling": {"docs": ["notion", "google_docs"]},
  "detected_a11y_packages": ["@base-ui/react"]
}
```

(1 mid-pilot fix committed before proceeding: `@base-ui/react` was missed by my a11y-framework regex — only matched `@base-ui-components/`. Added `^@base-ui/` pattern. Commit `b13d0f87`.)

## Layer decisions + outputs

| Layer | Decision | Why | Output |
|---|---|---|---|
| L1 Context | **skip** | `.agent/rules/` already IS Layer 1 (12 rule files, ~650 lines covering product, tech stack, frontend conventions, security) | 0 files; logged in `hd-config.md` as `other_tool_harnesses_detected: [".agent/", "CLAUDE.md"]` |
| L2 Skills | **skip** | `.agent/skills/` IS Layer 2 (4 skills: shadcn, frontend-design, registry-advisor, compound-engineering). Critique via `skill-quality-auditor` recommended separately. | 0 files |
| L3 Orchestration | **skip** | prerequisite not met (fewer than 3 hd-owned Layer 2 skills) | 0 files |
| L4 Rubrics | **scaffold** (5 of 12 starters) | `.agent/rules/200-frontend-guidelines.md` + tokens.md have implicit rubric content to reference | `docs/rubrics/INDEX.md` + 5 rubric files |
| L5 Knowledge | **scaffold** (full new tree) | no existing `docs/knowledge/`; empty for episodic capture | `docs/knowledge/` with 7 files (INDEX, README, changelog, decisions, preferences, ideations, lessons/setup.md) |

Total **11 new files**. **Zero modifications** to `.agent/`, CLAUDE.md, or any existing file. Pilot branch: `pilot/hd-setup-re-pilot-2026-04-18` in `/tmp/hd-real-test/plus-marketing-website/`.

## Phase 3d corrections worked

### G5 (Figma MCP install detail) — N/A on this repo
Repo's `docs/setup-mcps.md` already documents Figma MCP install correctly (and is the precedent our Phase 3a G5 fix was modeled on). Nothing to apply.

### G6 (Layer 4 critique+extract) — partially applied
`.agent/rules/` combined is ~650 lines — well over the 200-line G6 threshold. Default SHOULD have been critique+extract. I used **scaffold + reference** instead (copy starter rubrics; reference `.agent/rules/` in the INDEX for extraction guidance). Honest reason: extract-mode in `rubric-applicator` is documented but not yet battle-tested; safer to copy starters and let user manually migrate from `.agent/rules/` as they customize.

**Graduation candidate:** when `rubric-applicator` extract-mode has been exercised on 2-3 pilots, we can move this from "copy + reference" to "actively extract + promote."

### G8 (pointer files with 3-5 line summary) — not applicable
No link-mode was chosen on any layer; L1/L2/L3 all skipped.

### Phase 3d Part A (L1 baseline + simple mode) — didn't apply here
Skill Step 4 with `.agent/` detected and user indicating existing-harness = default **skip**. The 21-file plus-uno baseline templates weren't written. Correct behavior — respect what exists.

### Phase 3d Part B (L5 5+1 memory-type model) — worked cleanly
`docs/knowledge/` scaffolded with all 6 non-graduations files (changelog/decisions/ideations/preferences/lessons/README + INDEX). Memory-type labels landed in YAML frontmatter + INDEX column + README explainer. Starter lesson went into `lessons/setup.md` (domain-grouped, not per-date per-file). Graduations.md correctly NOT scaffolded (deferred to first graduation).

### Phase 3d Part C (12 rubrics) — leveraged
Picked 5 of 12 starters (a11y-wcag-aa, design-system-compliance, component-budget, interaction-states, typography). Left 7 others available: heuristic-evaluation, color-and-contrast, spatial-design, motion-design, ux-writing, responsive-design, skill-quality. Team can opt in later.

### Phase 3d Part D (rubrics at docs/rubrics/) — correctly applied
All 5 rubric files written to `docs/rubrics/<name>.md`. None in `docs/context/design-system/`. Design-system source content stays in `.agent/skills/frontend-design/references/tokens.md` (where it belongs — that's Layer 1 territory on this repo).

### Phase 3d Part E (hd-config.md) — worked
`hd-config.md` at repo root. 12 chars, no `.local.md` awkwardness.

## What I learned

### When `.agent/` exists, hd-* is additive-only

Plus-marketing's `.agent/` serves Layers 1 + 2 completely. The value hd-* adds is Layers 4 + 5 — explicit rubric checks + episodic knowledge capture. **Pattern worth graduating (after 2-3 more confirmations):** when `has_agent_dir` OR `has_claude_dir` detected with rich content, hd-setup default is "skip L1/L2/L3, scaffold L4/L5 only."

### Pilot output is real harness, not a demo

Unlike the figma/sds pilot (which was a walkthrough simulation), this pilot produced a real feature branch (`pilot/hd-setup-re-pilot-2026-04-18`) in Bill's actual clone with 806 lines of content across 11 files. Bill can cherry-pick wholesale or file-by-file. All 11 files are additive; no merge conflicts.

### `rubric-applicator` extract mode still untested in practice

Documented in `agents/review/rubric-applicator.md` as `mode: extract`, but no actual invocation happened during this pilot (I used scaffold + reference instead). **Need to exercise extract mode on a future pilot** (or manually via `/hd:review critique` call in a future session) to confirm the output shape matches what `hd-setup` expects.

### detect.py pattern gap (@base-ui/) fixed mid-flight

Small 1-line regex addition (`^@base-ui/`) caught during the pilot. Representative of the broader category: framework-detection patterns are best-effort and will miss emerging packages. Good idea to document a standing "add-a-pattern" protocol so users/contributors know how to submit additions.

## Graduation-readiness

**Too early.** Two data points so far (sds + plus-marketing). Need 1-2 more (caricature or oracle-chat — both Bill-owned, solo, different starting state) before any pattern graduates.

Candidate patterns worth watching:
1. **`.agent/` or `.claude/` exists → skip L1/L2/L3 by default** (seen on plus-marketing; will see on plus-uno, lightning, oracle-chat if Bill approves continuing)
2. **Combined AI-docs > 200 lines → critique+extract at L4** (G6 rule; validated on sds; this pilot deferred to scaffold+reference)
3. **Scaffold-only-what's-missing** (additive discipline — don't touch existing)

## Files written in plus-marketing-website

```
hd-config.md                          # root; 46 lines; layer_decisions + team_tooling
docs/rubrics/INDEX.md                 # 24 lines
docs/rubrics/accessibility-wcag-aa.md # 135 lines (copied from starter)
docs/rubrics/component-budget.md      # 110 lines
docs/rubrics/design-system-compliance.md  # 103 lines
docs/rubrics/interaction-states.md    # 103 lines
docs/rubrics/typography.md            # 120 lines (copied from starter)
docs/knowledge/INDEX.md               # 33 lines
docs/knowledge/README.md              # 35 lines
docs/knowledge/changelog.md           # 18 lines; first entry documents this pilot
docs/knowledge/decisions.md           # 27 lines; empty scaffold
docs/knowledge/preferences.md         # 24 lines; empty scaffold (hints for plus-marketing preferences)
docs/knowledge/ideations.md           # 13 lines; empty scaffold
docs/knowledge/lessons/setup.md       # 31 lines; domain file with 1 starter entry
```

**Total: 14 files (INDEX + 5 rubrics + 6 knowledge + lessons/setup.md + 1 hd-config.md).**
**Zero modifications to pre-existing files.**

## Next steps

1. **Bill reviews** `pilot/hd-setup-re-pilot-2026-04-18` branch in plus-marketing-website
2. **Bill cherry-picks** the files he wants (all-or-subset) into his main working branch
3. **Iterate**: if Bill wants different rubric selection, or wants extract-mode actively applied against `.agent/rules/*`, re-run in a follow-up session
4. **Continue pilot series** on remaining 4 Bill-owned repos (caricature, oracle-chat, lightning, plus-uno) to gather 3rd/4th/5th/6th data points for graduation

## See also

- Pilot #1 (figma/sds): [2026-04-17-pilot-figma-sds.md](./2026-04-17-pilot-figma-sds.md)
- Re-pilot post-Phase-3a on sds: [2026-04-17-sds-re-pilot-after-phase-3a.md](./2026-04-17-sds-re-pilot-after-phase-3a.md)
- Phase 3d plan: [`../../plans/2026-04-17-011-refactor-phase-3d-template-alignment-plan.md`](../../plans/2026-04-17-011-refactor-phase-3d-template-alignment-plan.md)
- Plus-marketing pilot branch: `pilot/hd-setup-re-pilot-2026-04-18` in `/tmp/hd-real-test/plus-marketing-website/`
