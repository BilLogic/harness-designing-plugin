---
title: "Harness review — 2026-04-20"
date: 2026-04-20
tags: [review, layer-review, harness-health, self-dogfood]
memory_type: episodic
rule_candidate: false
---

# Harness review — 2026-04-20

First self-review of the plugin repo after Phase 3m ships. Dogfood run — inline serial evaluation against `review-criteria-l*.md`. Establishes the baseline so future reviews can compute staleness overlap.

## Harness health

**Overall:** 7.1 / 10 (healthy-but-drift)

```
Layer              Bar          Score   State
─────────────────  ───────────  ──────  ─────────────────────────────────
L1 Context         ████████░░    8.0    AGENTS.md + docs/context/ populated; harness map present
L2 Skill Curation  █████████░    9.0    4 skills, all under budget, 0 violations
L3 Orchestration   ███████░░░    7.0    skills↔agents dispatch graph documented inline
L4 Rubric Setting  ████░░░░░░    4.0    docs/rubrics/INDEX.md present but no rubric files
                                        — starters live in skills/hd-review/assets/ only
L5 Knowledge       ██████░░░░    6.0    14 lessons + 4 canonical files BUT retired
                                        INDEX.md and README.md still on disk
```

## Top priorities

| Sev | # | Layer | Finding | Effort |
|---|---|---|---|---|
| P2 | 1 | L5 | `docs/knowledge/INDEX.md` + `docs/knowledge/README.md` retired by 3k.13 but still on disk | S |
| P2 | 2 | L4 | `docs/rubrics/` has only `INDEX.md` — we don't dogfood any of our own 14 starters against our own code | M |
| P2 | 3 | Cross-layer | `hd-config.md` missing for this repo — we've never scaffolded our own config | S |
| P3 | 4 | L5 | `docs/knowledge/ideations.md` exists but is empty / placeholder — scaffold seeded during 3k.13 never populated | S |

## Current state

| Area | Observed state |
|---|---|
| Always-loaded budget | 193 / 200 lines — under budget (AGENTS.md + 2 product/design-system files) |
| Skill dir | `skills/` detected, 4 skills, 0 violations, all `.md` ≤200 lines |
| Layers present | L1, L4, L5 (canonical); L3 scattered via docs/plans/ convention |
| Other-tool harnesses | compound-engineering (expected — we are a plugin that shares compound's lineage) |
| L5 cadence | 14 lessons between 2026-04-16 and 2026-04-18; healthy trickle, paused since 3k-3m iteration |
| Prior review | none (first review — establishes baseline) |

## Findings

### P1 — structural (ship-blocking)

*(none — all P1-severity checks pass)*

### P2 — drift (should fix)

- **[L5] Retired INDEX.md + README.md still on disk.** Evidence: `docs/knowledge/INDEX.md` + `docs/knowledge/README.md` exist. These were retired by Phase 3k.13 (AGENTS.md became the sole master index). Not harmful but contradicts the shipped convention. Remedy: delete both.
- **[L4] docs/rubrics/ empty except INDEX.md.** Evidence: `ls docs/rubrics/` shows only `INDEX.md`. We ship 14 starters at `skills/hd-review/assets/starter-rubrics/` but none are active at `docs/rubrics/`. Remedy: promote skill-quality.md (at minimum) so we dogfood our own L4 contract.
- **[Cross-layer] hd-config.md missing.** Evidence: `ls hd-config.md` returns not-found. We've never run `/hd:setup` on our own repo since hd-config.md schema was defined. Remedy: run `/hd:setup` on self, or author `hd-config.md` by hand for the advanced-mode case.

### P3 — polish (nice-to-have)

- **[L5] Empty `ideations.md`.** Scaffolded during 3k.13 but never populated. Either add real unchosen-paths content (e.g., deferred ideas from 3k-3m) or remove.

## Cross-layer consistency

No duplicate rules detected. No orphan pointers. One consistency note: `AGENTS.md § Rules` has 3 adopted rules dated 2026-04-16 through 2026-04-18 — each cites a source lesson in `docs/knowledge/lessons/`. Consistency healthy.

## hd-config drift

hd-config.md missing entirely — full "drift" at maximum level. Not a diff from recorded state (no recorded state exists).

## Staleness

Staleness: fresh review — first review on this repo, no prior to compare. A follow-up review in 2 weeks would exercise the overlap logic.

## Proposed revision

```diff
  design-harnessing-plugin/
  ├── AGENTS.md                              # unchanged (under budget)
  ├── CLAUDE.md                              # unchanged
  ├── .claude-plugin/plugin.json             # unchanged
  ├── .codex-plugin/plugin.json              # unchanged
  ├── .cursor-plugin/plugin.json             # unchanged
  ├── skills/                                # unchanged (4 skills, 0 violations)
  ├── agents/                                # unchanged
- ├── docs/knowledge/INDEX.md                # - remove (retired by 3k.13)
- ├── docs/knowledge/README.md               # - remove (retired by 3k.13)
  ├── docs/knowledge/changelog.md            # unchanged
  ├── docs/knowledge/decisions.md            # unchanged
  ├── docs/knowledge/ideations.md            # ~ edit: populate with deferred ideas
  ├── docs/knowledge/preferences.md          # unchanged
  ├── docs/knowledge/lessons/                # unchanged (14 lessons)
+ ├── docs/knowledge/reviews/                # + new (this file lives here)
+ │   └── 2026-04-20-harness-review.md
+ ├── hd-config.md                           # + new (run /hd:setup on self)
  ├── docs/rubrics/INDEX.md                  # unchanged
+ ├── docs/rubrics/skill-quality.md          # + promote from starter-rubrics
  └── docs/context/                          # unchanged
```

Total: 3 new files, 1 edit, 2 removals · To apply: `/hd:setup --from-review docs/knowledge/reviews/2026-04-20-harness-review.md`

## Suggested actions

1. Remove retired `docs/knowledge/INDEX.md` + `docs/knowledge/README.md` (P2, quick)
2. Promote `skills/hd-review/assets/starter-rubrics/skill-quality.md` → `docs/rubrics/skill-quality.md` (P2, dogfood our own rubric)
3. Author `hd-config.md` via `/hd:setup` on self or manual template (P2, quick)
4. Populate `ideations.md` with deferred items from 3k/3l/3m (P3, quick)

## Agents used

None. This review was generated inline serial (Claude Code session context) — no Task-dispatched sub-agents. Same output shape the parallel path would produce.

## Meta

- Execution mode: inline-serial
- Agents invoked: 0
- Duration: ~2 minutes
- Report version: 1

---

**Note:** This review report is dated and append-only. Future reviews will compare their findings against this one via Jaccard overlap on `(category, check, file)` triples. If this review's findings recur without resolution, the next run will surface a Staleness block.
