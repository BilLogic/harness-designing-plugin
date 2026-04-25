---
title: "Harness review - 2026-04-25"
date: 2026-04-25
tags: [review, layer-review, harness-health, dogfood]
memory_type: episodic
rule_candidate: false
---

# Harness review - 2026-04-25

## Harness health

**Overall:** 7.6 / 10 (healthy, with setup drift)

```
Layer              Bar          Score   State
─────────────────  ───────────  ──────  ─────────────────────────────────────────
L1 Context         ███████░░░    7.0    populated; live slug drift remains in titles
L2 Skills          ████████░░    8.0    budget-clean; old review vocabulary remains in rubrics
L3 Orchestration   ███████░░░    7.0    namespace mostly aligned; one template still stale
L4 Rubrics         ████████░░    8.0    adopted set is coherent; count docs are uneven
L5 Knowledge       ████████░░    8.0    active lesson/review corpus; historical drift documented
```

## Top priorities

```
Sev  #    Layer    Finding                                               Effort
───  ───  ───────  ────────────────────────────────────────────────────  ──────
P1   1    L1/L3    hd-config template still emits old slug and repo URL  XS
P1   2    L1/L4    Submission packets point reviewers at missing logo    XS
P2   3    L3       Review report template still lists old Task namespace XS
P2   4    L1       detect.py under-detects L2/L3 in this meta-harness    M
P2   5    L2/L4    Old audit/critique vocabulary persists in rubric text M
```

## Current state

```
Artifact                         Observed state
───────────────────────────────  ───────────────────────────────────────────────
AGENTS.md + one-pager budget     155 lines / 200 budget; budget-check passes
Skills                           4 SKILL.md files; no budget violations
Agents                           10 task-invokable agents plus research refs
Starter rubrics                  17 shipped rubrics excluding rubric-template.md
Adopted rubrics                  6 rubrics plus INDEX.md in docs/rubrics/
Lessons                          22 lesson files in docs/knowledge/lessons/
Plugin manifests                 4 JSON files parse cleanly
Repo cleanliness                 untracked .DS_Store files present
```

## Findings

### P1 - structural

- id: F_2026_04_25_01
  severity: p1
  category: namespace-drift
  content_status: present-but-stale
  file: skills/hd-setup/assets/hd-config.md.template
  applies_to_layers: [l1, l3]
  finding: The user-facing hd-config template still writes `# design-harnessing - local config` and links to `BilLogic/design-harnessing-plugin`, so new setup runs can generate stale namespace artifacts after the v3.0 slug alignment.
  suggested_action: Replace the heading with `# harness-designing - local config` and point the schema link at `https://github.com/BilLogic/harness-designing-plugin/blob/main/skills/hd-setup/references/hd-config-schema.md`.
  effort: XS
  detected_by: inline review + namespace scan
  related_lesson: docs/knowledge/lessons/2026-04-25-plugin-slug-alignment.md

- id: F_2026_04_25_02
  severity: p1
  category: submission-drift
  content_status: present-but-stale
  file: docs/submissions/codex-submission.md
  applies_to_layers: [l1, l4]
  finding: Submission docs point to `assets/logo.svg`, but the repo only ships `assets/logo.png`. Reviewers or installer metadata following the packet will hit a missing file.
  suggested_action: Update codex, anthropic, and cursor submission packets to reference `assets/logo.png`, or add a real `assets/logo.svg` if SVG is required by a marketplace.
  effort: XS
  detected_by: inline review + file existence scan
  related_lesson: null

### P2 - drift

- id: F_2026_04_25_03
  severity: p2
  category: namespace-drift
  content_status: present-but-stale
  file: skills/hd-review/assets/review-report.md.template
  applies_to_layers: [l3]
  finding: The review report template's example agent list still uses `design-harnessing:analysis:*`, so new dogfood reports can reintroduce the retired Task namespace.
  suggested_action: Change the example agent list to `harness-designing:analysis:*` and `harness-designing:research:*`.
  effort: XS
  detected_by: inline review + namespace scan
  related_lesson: docs/knowledge/lessons/2026-04-25-namespace-rename.md

- id: F_2026_04_25_04
  severity: p2
  category: detection-gap
  content_status: present-but-stale
  file: skills/hd-setup/scripts/detect.py
  applies_to_layers: [l2, l3]
  finding: `detect.py --include-user-mcps` reports `layers_present: [L1, L4, L5]` and only `layers_present_scattered: [L3]` for this repo, even though `hd-config.md` correctly records the shipped `skills/` and `agents/` as the meta-harness L2/L3 payload.
  suggested_action: Add a meta-harness or plugin-repo detection rule so first-party `skills/hd-*` and `agents/{analysis,research,review}` count as populated L2/L3 when reviewing this plugin.
  effort: M
  detected_by: detect.py dogfood preflight
  related_lesson: docs/knowledge/lessons/2026-04-21-detect-inspect-integrate.md

- id: F_2026_04_25_05
  severity: p2
  category: vocabulary-drift
  content_status: present-but-stale
  file: docs/rubrics/skill-quality.md
  applies_to_layers: [l2, l4]
  finding: Adopted and starter rubrics still describe `hd:review audit` and `hd:review critique`, while the current skill vocabulary is `full` and `targeted`.
  suggested_action: Update living rubric prose and starter rubric prose to use `/hd:review full` and `/hd:review targeted`; preserve old vocabulary only in historical changelog/lesson records.
  effort: M
  detected_by: inline review + vocabulary scan
  related_lesson: null

- id: F_2026_04_25_06
  severity: p2
  category: runtime-install-drift
  content_status: present-but-stale
  file: /Users/billguo/.codex/harness-designing-plugin/skills/hd-review/SKILL.md
  applies_to_layers: [l2, l3]
  finding: Codex's installed skill copy loaded from `~/.codex/harness-designing-plugin` is older than this workspace and still says audit/critique plus `design-harnessing:` Task names, so dogfooding from Codex can test stale behavior unless the local plugin install is refreshed.
  suggested_action: Add a dogfood preflight note or script that compares the active host skill path/version against the workspace manifest before reviewing this repo.
  effort: S
  detected_by: Codex skill load during this review
  related_lesson: docs/knowledge/lessons/2026-04-25-plugin-slug-alignment.md

### P3 - polish

- id: F_2026_04_25_07
  severity: p3
  category: repo-hygiene
  content_status: present-but-stale
  file: .DS_Store
  applies_to_layers: [l1]
  finding: `.DS_Store` and `assets/.DS_Store` are untracked in the working tree.
  suggested_action: Delete the local files and consider adding `.DS_Store` to `.gitignore` if it is not already ignored in the packaging flow.
  effort: XS
  detected_by: git status + file scan
  related_lesson: null

- id: F_2026_04_25_08
  severity: p3
  category: naming-polish
  content_status: present-but-stale
  file: docs/context/product/one-pager.md
  applies_to_layers: [l1]
  finding: Some live context headings still say `design-harness` after the v3.0 `harness-designing` slug alignment.
  suggested_action: Update live non-historical headings in `docs/context/product/one-pager.md`, `docs/context/design-system/cheat-sheet.md`, and `hd-config.md` to the current public slug.
  effort: XS
  detected_by: namespace scan
  related_lesson: docs/knowledge/lessons/2026-04-25-plugin-slug-alignment.md

## Cross-layer consistency

- The strongest recurring consistency gap is "living docs vs historical docs." Historical plans, lessons, reviews, and changelog entries correctly preserve old names; templates, submission packets, current rubrics, and current context should use current names.
- Rubric count is mostly coherent: AGENTS.md and README say 17 starters, which matches 17 real starter rubrics when `rubric-template.md` is excluded. `skills/hd-review/SKILL.md` still says 14, which is stale.
- Review vocabulary has not fully migrated. `skills/hd-review/SKILL.md` uses full/targeted, but several rubrics and references still explain audit/critique flows.

## hd-config drift

- `hd-config.md` intentionally overrides `team_tooling.analytics` because `detect.py` sees a `metabase` example in prose. That override is documented and acceptable.
- `detect.py` reports `other_tool_harnesses_detected: compound-engineering` from `docs/plans/`; `hd-config.md` records the same as a respected external reference. No action needed.
- The meaningful drift is layer modeling: detect output does not consider this plugin's shipped `skills/` and `agents/` as populated L2/L3, while `hd-config.md` does.

## Staleness

Staleness: fresh review - current findings are mostly new post-v3.0 naming and packaging drift. There are 20+ relevant commits since the 2026-04-21 review and multiple 2026-04-25 lessons, so the review is not just re-reporting old P1s.

## Proposed revision

```diff
  harness-designing-plugin/
  ├── AGENTS.md
  ├── README.md
  ├── skills/
~ │   ├── hd-setup/assets/hd-config.md.template
~ │   └── hd-review/assets/review-report.md.template
~ ├── docs/
~ │   ├── submissions/{anthropic,codex,cursor}-submission.md
~ │   ├── rubrics/skill-quality.md
~ │   └── context/{product/one-pager.md,design-system/cheat-sheet.md}
~ ├── hd-config.md
~ └── skills/hd-setup/scripts/detect.py
```

Total: 0 new files, 8-10 small edits. To apply manually, address P1s first; `/hd:setup --from-review docs/knowledge/reviews/2026-04-25-harness-review.md` may need implementation support before it can transform all of these findings automatically.

## Suggested actions

1. Fix the two P1s before the next packaging/submission pass: stale hd-config template namespace and missing `assets/logo.svg` references.
2. Sweep living docs for the v3.0 rename: `design-harnessing`, non-historical `design-harness`, and `design-harnessing-plugin`.
3. Decide whether `detect.py` should have an explicit plugin-repo/meta-harness mode so dogfood reviews stop undercounting L2/L3.
4. Refresh the active Codex-installed copy before the next dogfood pass, or add a preflight warning that says the host is loading stale skill files.

## Agents used

- none - evaluated inline against `skills/hd-review/references/review-criteria-l*.md`
- deterministic tools: `budget-check.sh`, `detect.py --include-user-mcps`, JSON validation, namespace scans, file existence scans

## Meta

- Execution mode: inline-serial
- Agents invoked: 0
- Duration: manual review pass
- Report version: 2026-04-25-inline

---

**Note:** This review report is dated and append-only; history is sacred. Don't edit or delete this file; author a new dated review if findings need revising.
