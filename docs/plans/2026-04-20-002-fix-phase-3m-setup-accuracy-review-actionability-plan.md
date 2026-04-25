---
title: "Phase 3m — setup accuracy + review actionability"
type: fix
status: active
date: 2026-04-20
---

# Phase 3m — setup accuracy + review actionability

Post-3l iteration. Live stress-test across 5 real repos on 2026-04-20 (Dawnova, compound-designing/sds, plus-marketing-website, cornerstone, Oracle Chat) surfaced five concrete issues grouped into two themes: setup-time accuracy (1–3) and review actionability (4–5). Testing log is inline in the conversation transcript — no separate requirements doc.

## Problem summary

**Setup accuracy (P1–P2):**

- Detector treats `.claude/worktrees/` (Claude Code metadata) as a meta-harness signal. Guardrail fires on repos that have zero actual harness content. Dawnova case: triggered additive-only mode on a fresh Vite app with only worktree metadata.
- Review-by-default on L1/L2/L3 when guardrail fires is tone-deaf when the existing harness is nominal-only. Reviewing an empty `.claude/settings.local.json` produces no useful findings — scaffold is the right action there.
- Review mode's content-based findings (e.g. "promote rubric from `.agent/skills/cs-critique/references/` to `docs/rubrics/`", "add pointer in AGENTS.md mapping 13-rule system") don't flow into any write pipeline. User sees the finding, then has to manually act or re-run `/hd:setup` without the context.

**Review actionability (P2):**

- Review chat summary lists priorities but doesn't show the **revised file tree**. Users can't see the concrete plan inline — they re-read the file or re-run `/hd:setup` to learn what writes would land.
- Re-running review on the same repo re-proposes the same findings indefinitely. No awareness of whether the team acted on the previous review. No "you've seen this before" accountability signal.

## Acceptance criteria

### P1 — setup accuracy

- [ ] **3m.1** `.claude/worktrees/` (and equivalents for `.agent/`, `.codex/`) no longer triggers meta-harness detection. `_meta_harness_entry()` requires at least one of: `skills/` with ≥1 SKILL.md, `rules/` with ≥1 `.md`, `agents/` with ≥1 `.md`, `commands/` with ≥1 `.md`, OR `settings.json`/`settings.local.json` with non-trivial content (≥5 lines of real config). Metadata-only dirs are excluded.
- [ ] **3m.2** Review-default on L1/L2/L3 when guardrail fires is gated by content substance. When `harness-auditor` reports `content_status: missing` for all per-layer checks at that layer, setup falls through to `scaffold` as the default. When `content_status: present-but-stale` or better, `review` stays.

### P2 — review actionability

- [ ] **3m.3** `/hd:setup --from-review <path>` flag reads a prior review file and merges its write-style findings into Step 8.5 preview as opt-in rows. `/hd:review` Next-step suggestion explicitly names this path: *"To apply these findings as writes, run `/hd:setup --from-review docs/knowledge/reviews/<date>-harness-review.md`."*
- [ ] **3m.4** `/hd:review` chat summary renders a `Proposed revision` section showing the full revised file tree with `+` (new), `~` (edited), and plain (unchanged) annotations. Full review file carries the same diff tree for reference.
- [ ] **3m.5** `/hd:review` runs a staleness check before per-layer evaluation. Reads most recent prior review from `docs/knowledge/reviews/`. After synthesizing new findings, computes overlap with prior findings. If overlap ≥70%, chat summary surfaces a `Staleness` signal row naming the prior review date + git-log activity since + a prompt to either re-prioritize or capture a blocker lesson.

### Regression bar

- [ ] Dawnova no longer triggers guardrail additive-only mode (3m.1 fix). Scaffold mode defaults to "greenfield" or whatever matches its actual content-lacking state.
- [ ] compound-designing / cornerstone / plus-marketing still trigger guardrail correctly (they have real harness content).
- [ ] Review chat summaries on all 5 test repos include the file-tree diff (3m.4).
- [ ] All 4 SKILL.md under 200-line budget.
- [ ] Zero `audit` / `critique` references introduced (vocab sweep from 3l.7 holds).

---

## Per-unit fix notes

### 3m.1 — `.claude/worktrees/` false positive

**Files:**

- `skills/hd-setup/scripts/detect.py` — `_meta_harness_entry(dirname)` function

**Current behavior:** returns a meta-harness entry as long as the dir exists, even if it only contains `worktrees/` (Claude Code metadata) or a stub `settings.local.json`.

**Fix:** add content-substance probe. A meta-harness requires AT LEAST ONE of:

1. `<dir>/skills/` with ≥1 SKILL.md OR ≥1 `*.md` file
2. `<dir>/rules/` with ≥1 `*.md` file
3. `<dir>/agents/` with ≥1 `*.md` file
4. `<dir>/commands/` with ≥1 `*.md` file
5. `<dir>/settings.json` or `<dir>/settings.local.json` with non-trivial content (file ≥5 lines OR `wc -c > 100`)
6. `<dir>/AGENTS.md` or `<dir>/AGENT.md` with ≥20 lines

Pure metadata (`worktrees/`, `logs/`, etc. with nothing else) → return `None`.

**Schema:** v4 stays compatible; `other_tool_harnesses_detected[]` just has fewer false-positive entries.

**Test case:** on Dawnova (`.claude/worktrees/` only), detect.py emits `other_tool_harnesses_detected: []` for `.claude` — guardrail doesn't fire.

### 3m.2 — Nuance review default for nominal-only layers

**Files:**

- `skills/hd-setup/references/per-layer-procedure.md` — default-action table
- `skills/hd-setup/references/phase-a-pre-analysis.md` — Phase A synthesis logic
- `agents/analysis/harness-auditor.md` — ensure `recommended_action` respects `content_status`

**Current behavior:** guardrail fires → L1/L2/L3 pre-select `review`.

**Fix:** defer to `harness-auditor` content_status:

- If all per-layer checks report `content_status: missing` → `recommended_action.default: scaffold`
- If ≥1 check reports `content_status: present-but-stale` or better → `recommended_action.default: review`

Update per-layer-procedure.md default table to show the branch:

```
| Existing harness + layer has non-trivial content (≥1 check ≠ missing) | review |
| Existing harness + layer is nominal-only (all checks missing)         | scaffold |
```

### 3m.3 — `/hd:setup --from-review` flag

**Files:**

- `skills/hd-setup/SKILL.md` — add `--from-review <path>` flag handling + argument-hint
- `skills/hd-setup/references/per-layer-procedure.md` — Step 8.5 merges from-review proposals with Phase A defaults
- `skills/hd-review/references/review-procedure.md` — Step 7 Next-step suggestion names the flag
- `skills/hd-review/assets/review-report.md.template` — `## Next step` section cites the exact command

**Mechanics:**

1. `/hd:setup --from-review <path>` skips Phase A (Phase A already happened when the review ran)
2. Parses the review file's findings; extracts any that name a specific write (e.g. "add `docs/rubrics/cs-critique-rubric.md`", "trim AGENTS.md to 80 lines")
3. Merges those write proposals into Step 8.5 preview as additional rows marked `from-review`
4. User confirms / revises per usual Step 8.5 flow

**Finding-to-write heuristic (extraction rule):**

A review finding produces a scaffold proposal when its `recommendation` field contains phrases like:

- "add `<path>`" / "create `<path>`" → new file
- "scaffold `<path>`" → new file
- "promote `<source>` to `<dest>`" → copy + new file at `<dest>`
- "trim `<path>` to N lines" → edit existing file
- "update `<path>`" → edit existing file

Non-actionable findings (e.g. "pattern is tribal knowledge") stay informational; no write proposed.

### 3m.4 — Revised file-tree diff in review output

**Files:**

- `skills/hd-review/references/review-procedure.md` — Step 6 chat-summary rendering spec adds the diff section
- `skills/hd-review/assets/review-report.md.template` — new `## Proposed revision` section in the full file

**Rendering spec:**

```
═══════════════════════════════════════════════════════════════════

Proposed revision

```diff
  <repo-root>/
  ├── AGENTS.md                              # ~ edit: +60 lines (harness map)
  ├── .agent/                                # unchanged
+ ├── hd-config.md                           # + new
+ ├── docs/rubrics/                          # + new (5 files)
+ │   ├── accessibility-wcag-aa.md
+ │   ├── design-system-compliance.md
+ │   ├── ux-writing.md
+ │   ├── responsive-design.md
+ │   └── interaction-states.md
+ ├── docs/knowledge/                        # + new (5 files)
+ │   ├── changelog.md
+ │   ├── decisions.md
+ │   ├── ideations.md
+ │   ├── preferences.md
+ │   └── lessons/.gitkeep
  └── docs/                                  # existing docs unchanged
```

Total: 10 new files, 1 edit · To apply: /hd:setup --from-review docs/knowledge/reviews/<date>-harness-review.md

═══════════════════════════════════════════════════════════════════
```

**Rules:**

- Group by action: new files (+), edits (~), unchanged (plain)
- Fenced as ```diff so Markdown renderers highlight the + lines green
- Total line summarizes scope
- Last line is the exact command to apply (3m.3 bridge)

### 3m.5 — Staleness check

**Files:**

- `skills/hd-review/references/review-procedure.md` — new Step 1.5 "staleness check" before per-layer evaluation
- `skills/hd-review/assets/review-report.md.template` — new `## Staleness` section

**Mechanics:**

1. Glob `docs/knowledge/reviews/*-harness-review.md`; take most recent by date in filename
2. If none → skip staleness check (first review)
3. Parse prior report's P1+P2 findings (category + check name + file path are sufficient for overlap)
4. After Step 5 synthesis, compute overlap:
   - Jaccard similarity on finding sets keyed by `(category, check, file)`
   - Threshold: `overlap ≥ 0.7` → flag staleness
5. Read `git log --oneline --since=<prior-review-date> docs/ AGENTS.md skills/ agents/ hd-config.md` → activity summary
6. Include in chat summary + full file

**Chat summary addition:**

```
═══════════════════════════════════════════════════════════════════

Staleness check

Signal           Status      Evidence
───────────────  ──────────  ──────────────────────────────────────
Prior review     2026-04-13  12 commits since; 0 lessons captured;
                             docs/rubrics/ unchanged
Overlap          72% (18/25) Same 18 findings recur:
                             - [P1] L4 no docs/rubrics/ (3 reviews running)
                             - [P2] AGENTS.md missing harness map (3 reviews)
                             - [P2] knowledge/ sparse (3 reviews)

Suggestion: capture a blocker lesson with /hd:maintain capture explaining
            why these haven't been addressed, OR re-prioritize by
            marking findings as "deferred" in the review file

═══════════════════════════════════════════════════════════════════
```

When `overlap < 0.7` → show a compact "Staleness: fresh review, 4 new findings since 2026-04-13" line instead of the full block.

---

## Implementation order

1. **3m.1** (1 hr) — `detect.py` worktree false-positive fix. Quick + unblocks 3m.2 testing.
2. **3m.2** (2 hrs) — Nuance review default. Depends on 3m.1's cleaner detect output.
3. **3m.4** (2 hrs) — File-tree diff rendering. Independent; can run in parallel with 3m.5.
4. **3m.3** (2 hrs) — `--from-review` flag. Depends on 3m.4 (both write to chat summary + file).
5. **3m.5** (3 hrs) — Staleness check. Longest item; involves prior-review parsing + git log + Jaccard overlap.
6. **Regression pass** — live re-test on Dawnova (3m.1 verification), compound-designing / cornerstone / plus-marketing (3m.2–5).

## Verification

- [ ] `python3 skills/hd-setup/scripts/detect.py` on Dawnova: `other_tool_harnesses_detected: []` (was `['.claude']`)
- [ ] `python3 skills/hd-setup/scripts/detect.py` on compound-designing: `other_tool_harnesses_detected` still includes `.agent` + real entries
- [ ] `/hd:setup` on Dawnova: guardrail does NOT fire; default scaffold mode
- [ ] `/hd:setup` on compound-designing: guardrail fires correctly; L1/L2/L3 default to review
- [ ] `/hd:review` chat summary on any repo shows `## Proposed revision` section with file tree
- [ ] `/hd:setup --from-review docs/knowledge/reviews/<date>-harness-review.md` merges proposals into Step 8.5 preview
- [ ] Second `/hd:review` within same week: shows Staleness block naming prior review + overlap %
- [ ] Budget-check: 0 violations, 4 SKILL.md ≤200 lines
- [ ] Zero `audit`/`critique` introduced

## Out of scope

- Hour estimates in review findings (Bill explicitly declined — S/M/L stays)
- Auto-applying review findings without user confirmation (manual Step 8.5 gate preserved)
- Rewriting review reports when findings are addressed (append-only — history is sacred)
- Detection of non-Claude worktree metadata (`.cursor/worktrees/`, etc.) — deferred until seen in the wild
- Cross-repo review diffing (stays per-repo scoped)
