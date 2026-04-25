---
title: v0.5 Implementation Plan — hd-compound (capture + graduate)
type: feat
status: active
date: 2026-04-16
origin: docs/plans/2026-04-16-005-feat-v0-mvp-implementation-plan.md
---

# v0.5 Implementation Plan — `hd-compound` (capture + graduate)

## Overview

Builds the **MAINTAIN** skill of the design-harness plug-in. Ships with Substack article #3 (Knowledge Compounding layer). One skill with two modes:

- **Capture** — appends a dated lesson to `docs/knowledge/lessons/YYYY-MM-DD-<slug>.md`. Low-stakes, append-only.
- **Graduate** — promotes a lesson (or pattern across lessons) to a rule in `AGENTS.md`. Destructive-adjacent (modifies Tier 1 context). Protected by **plan-hash proof-of-consent** — prevents hallucinated approval.

9 files total: `SKILL.md` + 3 references + 3 workflows + 2 templates. No scripts (graduation is logic, not detection).

**Origin document:** [2026-04-16-005](./2026-04-16-005-feat-v0-mvp-implementation-plan.md) (v0.MVP implementation plan). All architectural locks carry forward — this plan doesn't re-argue them. Key locks: `/hd:` prefix; SKILL.md ≤200 lines routers; atomic topical references; `docs/design-solutions/` namespace reserved for us (never `docs/solutions/`); fully-qualified Task names for cross-plug-in invocation; compound 2.35.0 / 2.36.0 / 2.39.0 lessons baked into repo AGENTS.md.

## Problem Statement

Layer 5 of the five-layer framework is about **compounding knowledge** — episodic lessons accumulating into procedural rules. Without `hd-compound`:

1. Users can write lessons manually, but the skill discipline (YAML frontmatter, slug naming, date format, graduation-readiness heuristic) isn't enforced.
2. Graduation from lesson → rule is the compounding move. Manual graduation is fragile — easy to delete the source lesson, forget the meta-entry, or promote something that shouldn't graduate.
3. Graduation modifies `AGENTS.md` (Tier 1 context). A silent or hallucinated approval — a runaway agent, a `/loop` misfire, an LLM that echoes "yes" — could drop an unreviewed rule into every future task's context. This needs stronger protection than text consent.

`hd-compound` solves all three: templated capture with schema enforcement, structured graduation workflow, and plan-hash proof-of-consent for the destructive step.

## Proposed Solution

Three-workflow skill mirroring compound-engineering's `ce-compound` pattern (Phase-1 research → Phase-2 writer), extended with a cryptographic proof-of-consent mechanism borrowed from infrastructure-as-code plan verification.

Workflows:

| Workflow | Mode | Writes? | Protected? |
|---|---|---|---|
| `capture.md` | capture-lesson | 1 file in `docs/knowledge/lessons/` | No (append-only; low-stakes) |
| `propose-graduation.md` | graduate-propose | **Nothing** | No (read-only analysis + hash emission) |
| `apply-graduation.md` | graduate-apply | `AGENTS.md` + `docs/knowledge/graduations.md` atomically | **Yes** — SHA-256 plan-hash verification |

## Technical Considerations

### Router dispatch (SKILL.md)

SKILL.md detects mode from the user prompt + optional `argument-hint` form. Routing table:

- User says "save this lesson" / "capture this" / explicit `/hd:compound capture` → `workflows/capture.md`
- User says "graduate this" / "promote to rule" / `/hd:compound graduate-propose <topic>` → `workflows/propose-graduation.md`
- User replies with hash + `/hd:compound graduate-apply --plan-hash <sha>` → `workflows/apply-graduation.md`

Never auto-dispatch between modes. Explicit mode identification only.

### Plan-hash protocol (the critical new mechanism)

Detailed spec in `references/plan-hash-protocol.md`. Summary:

**Hash input** — canonical, deterministic, byte-stable string:

```
graduation-title: <title>
source-lessons:
  <path1>:<sha256-of-path1-content>
  <path2>:<sha256-of-path2-content>  # if multiple; paths sorted
target-agents-md: <repo-root>/AGENTS.md:<sha256-of-agents-md-content-at-propose-time>
target-graduations-md: <repo-root>/docs/knowledge/graduations.md:<sha256-of-graduations-md-content-at-propose-time>
rule-text-sha256: <sha256-of-proposed-rule-text>
graduations-entry-sha256: <sha256-of-proposed-graduations-entry>
```

**Hash** — SHA-256 of the canonical string above, 64 hex chars.

**Propose output** (written to stdout, not disk):

```
## Graduation Plan: <title>

### Sources
- [source lesson 1] (path)
- [source lesson 2] (path)  # if multiple

### Proposed rule (to be added to AGENTS.md § Graduated rules)

> [rule text verbatim]

### Proposed graduations.md entry

> [entry text verbatim]

### Plan hash
<64-hex-char SHA-256>

### To apply
/hd:compound graduate-apply --plan-hash <64-hex-char>
```

**Apply verification:**

1. Re-read all inputs (source lessons, current AGENTS.md, current graduations.md)
2. Reconstruct canonical string with current content hashes
3. Re-compute SHA-256
4. Compare with user-provided hash
5. **Match** → execute atomically (write AGENTS.md rule + graduations.md entry; source lessons untouched)
6. **Mismatch** → abort, print diff (which file drifted: source lesson, AGENTS.md, or graduations.md), suggest re-propose

This prevents four attack surfaces:

- **Hallucinated "yes"** — approver must produce the exact 64-char hash, can't fake it from generic approval
- **Silent re-planning** — re-running propose emits a new hash; can't apply old plan after new propose
- **File drift** — if AGENTS.md / graduations.md / lesson file changed between propose and apply, hash mismatches
- **Swapped sources** — source lesson paths are hashed, can't substitute different lessons under the hood

### `docs/design-solutions/` namespace (activation)

v0.MVP reserved `docs/design-solutions/` — our equivalent of compound's `docs/solutions/`. v0.5 activates it: `hd-compound` is the first skill to write here. But NOT for lesson capture (lessons go in `docs/knowledge/lessons/`). `docs/design-solutions/` is for **distilled recurring-problem solutions** — a post-v0.5 feature, deferred to v1 or later. v0.5 reserves the directory but doesn't write to it yet.

This keeps the coexistence story clean: `docs/solutions/` is compound's; `docs/design-solutions/` is ours (writes activate post-v0.5).

## Per-File Specification

### `skills/hd-compound/SKILL.md`

**Frontmatter:**

```yaml
---
name: hd:compound
description: Captures design lessons and proposes graduations from narrative to rule. Use when capturing a decision or promoting a recurring pattern.
argument-hint: "capture | graduate-propose <topic> | graduate-apply --plan-hash <sha>"
---
```

Character count: 146 chars (≤180 ✓). `argument-hint` YAML-quoted (compound 2.36.0).

**Target length:** ≤200 lines.

**Sections:**

1. Interaction Method (5-line preamble; AskUserQuestion fallback)
2. Single job statement (capture OR graduate; one skill, two modes)
3. Workflow checklist (copy-into-response; 5 steps)
4. Step 1: identify mode (capture / propose / apply) — routing table
5. Step 2: route to matching workflow (one-level-deep links)
6. Step 3: for graduate-apply, verify hash BEFORE any write
7. Step 4: execute atomically (capture: 1 file; apply: 2 files)
8. Step 5: summarize + suggest next (e.g., "run /hd:review" v1)
9. What this skill does NOT do (handoffs to `/hd:onboard`, `/hd:review`)
10. Coexistence rules reminder (no writes to `docs/solutions/`; docs/design-solutions/ namespace reserved; fully-qualified Task calls)
11. Reference file + workflow index

### `references/lesson-patterns.md`

**Purpose:** good-lesson authoring patterns + anti-patterns + graduation-readiness heuristics.
**Target length:** 80-120 lines.

**Sections:**

- Lesson YAML frontmatter schema (title, date, tags, graduation_candidate, graduated_to)
- Body structure (Context / Decision / Result / Graduation-readiness)
- Good vs bad examples (2 of each)
- Anti-patterns (no dates, mixed rules + stories, kitchen-sink lessons)
- Graduation-readiness signals (3+ occurrences, clean imperative, team agreement)
- When NOT to graduate (one-off decisions, time-bound fixes, personal preferences)

### `references/graduation-criteria.md`

**Purpose:** what qualifies a lesson for graduation + how to detect candidates.
**Target length:** 60-100 lines.

**Sections:**

- Three criteria (must all three be met): 3+ occurrences + clean imperative + team agreement
- Occurrence detection: grep `docs/knowledge/lessons/*.md` for matching tags
- Clean-imperative test: can the rule be stated as "always X unless Y" in ≤1 sentence?
- Team agreement: RFC / PR conversation / sync meeting — user confirms
- Counter-criteria (do NOT graduate): one-off, time-bound, personal preference, controversial

### `references/plan-hash-protocol.md`

**Purpose:** full specification of the SHA-256 plan-hash mechanism.
**Target length:** 100-150 lines.

**Sections:**

- Problem statement (why plain text consent is insufficient for Tier 1 writes)
- Hash input format (canonical string, verbatim — the 7-line structure above)
- Hash computation (SHA-256; 64 hex chars lowercase)
- Content-hash helpers (how to hash each input file deterministically)
- Propose output format (what user sees)
- Apply verification procedure (step-by-step)
- Mismatch handling (abort + diff + re-propose suggestion)
- UX examples (2-3 worked scenarios: clean apply, drift detected, re-propose)
- What plan-hash does NOT protect against (multiple reviewers, social engineering) — acknowledged limits

### `workflows/capture.md`

**Purpose:** append a single dated lesson to `docs/knowledge/lessons/`.
**Target length:** 80-120 lines.

**Steps (copy-into-response checklist):**

1. Identify subject (what lesson is being captured) — extract from conversation context or ask
2. Draft YAML frontmatter (title, today's date, tags, graduation_candidate flag)
3. Draft body (Context / Decision / Result / Graduation-readiness)
4. Compute slug from title (kebab-case, 3-5 words)
5. Check for existing file at path `docs/knowledge/lessons/YYYY-MM-DD-<slug>.md` — if exists, prompt: edit? / append suffix `-001`? / abort?
6. Optional Phase-1 research: `Task compound-engineering:research:learnings-researcher(topic)` to surface related past lessons (compact-safe mode skips this)
7. Show user the drafted lesson
8. On approval: write atomically (temp file + `mv`)
9. Update `docs/knowledge/INDEX.md` count if auto-maintained (optional)
10. Summarize: "Captured lesson at <path>. Detected N similar lessons (tagged X). Graduation candidate? <yes/no/too-early>."

### `workflows/propose-graduation.md`

**Purpose:** analyze source lessons, draft graduation plan, emit hash. **Writes nothing.**
**Target length:** 100-130 lines.

**Steps:**

1. Parse `<topic>` from argument or conversation
2. Scan `docs/knowledge/lessons/*.md` — find lessons matching topic (tag match + title fuzzy match)
3. If count < 3 → abort: "Need ≥3 lessons for graduation. Found N. Wait for more occurrences."
4. If count ≥ 3 → proceed
5. Synthesize clean imperative from lessons — draft proposed rule text
6. Propose AGENTS.md insertion point (under "Graduated rules" section)
7. Propose `docs/knowledge/graduations.md` entry
8. Read source lessons + current AGENTS.md + current graduations.md — compute content hashes
9. Build canonical hash-input string (per `references/plan-hash-protocol.md`)
10. Compute SHA-256 → the plan hash
11. Emit propose output (title + sources + rule + entry + hash + apply command)
12. **Do not write anything.** Abort if any file-write attempt detected in execution path.

### `workflows/apply-graduation.md`

**Purpose:** verify plan-hash, then apply graduation atomically.
**Target length:** 100-130 lines.

**Steps:**

1. Require `--plan-hash <sha>` argument. If missing → abort with clear error.
2. Re-read all inputs: source lessons (from plan), current AGENTS.md, current graduations.md
3. Reconstruct canonical hash-input string
4. Re-compute SHA-256
5. Compare with user-provided hash
6. **Mismatch** → abort. Print which file drifted (source lesson / AGENTS.md / graduations.md). Suggest re-propose.
7. **Match** → proceed with atomic write:
   - Write AGENTS.md rule line (append to "Graduated rules" section, preserving other content)
   - Append graduations.md entry (prepend to "Entries" list, preserving meta-format)
   - Both writes in sequence; if second fails, roll back first via git (worktree guarantees clean rollback)
8. Verify post-write: grep AGENTS.md + graduations.md for new entries → expect exact match
9. Summarize: "Graduated <title>. Rule in AGENTS.md line N. Meta-entry in graduations.md. Source lesson preserved at <path>."
10. Suggest next step: "Run `/hd:review`" (v1) or commit manually.

### `templates/lesson.md.template`

**Purpose:** YAML frontmatter + body scaffold for new lessons (capture workflow fills this).
**Target length:** ~30 lines.

**Structure:**

```markdown
---
title: "{{TITLE}}"
date: {{DATE}}
tags: [{{TAGS}}]
graduation_candidate: {{GRADUATION_CANDIDATE}}
---

# Lesson

**Context:** {{CONTEXT}}

**Decision / Observation:** {{DECISION}}

**Result:** {{RESULT}}

**Graduation-readiness:** {{GRADUATION_READINESS}}
```

### `templates/graduation-entry.md.template`

**Purpose:** structured `graduations.md` entry (apply workflow appends this).
**Target length:** ~20 lines.

**Structure:**

```markdown
## {{DATE}} — {{TITLE}}

**Rule (now in AGENTS.md):** *"{{RULE_TEXT}}"*

**Source lesson:** [{{LESSON_PATH}}]({{LESSON_PATH}})

**Occurrences before graduation:** {{OCCURRENCE_COUNT}} lessons matching topic

**Proposer:** {{PROPOSER}}

**Approved by:** {{APPROVER}}
**Plan hash:** `{{PLAN_HASH}}`
```

## Execution Order

Same pattern as v0.MVP phases: references + templates + workflows before SKILL.md; SKILL.md last so all link targets exist.

```
Phase 1 (serial — references + templates):
  P1.1 references/lesson-patterns.md
  P1.2 references/graduation-criteria.md
  P1.3 references/plan-hash-protocol.md
  P1.4 templates/lesson.md.template
  P1.5 templates/graduation-entry.md.template

Phase 2 (serial — workflows):
  P2.1 workflows/capture.md
  P2.2 workflows/propose-graduation.md
  P2.3 workflows/apply-graduation.md

Phase 3:
  P3.1 SKILL.md (last)

Phase 4:
  P4.1 Verification
  P4.2 Commit
```

No mid-phase commits. One commit at end of build: `feat(hd-compound): implement v0.5 maintain skill`.

## Verification Steps

### Grep compliance

Same rules as v0.MVP per repo AGENTS.md § Skill compliance checklist:

```bash
# Description ≤180 chars
desc=$(awk '/^description:/{print; exit}' skills/hd-compound/SKILL.md | sed 's/^description: //')
[ ${#desc} -le 180 ] && echo "PASS: $((${#desc})) chars" || echo "FAIL"

# SKILL.md ≤200 lines
wc -l skills/hd-compound/SKILL.md | awk '$1 <= 200 {print "PASS: "$1" lines"} $1 > 200 {print "FAIL: "$1" lines"}'

# No bare-backtick references in SKILL.md (scripts exempt per convention)
grep -rn --include="SKILL.md" -E '`(references|workflows|templates)/[^`]+`' skills/hd-compound/ \
  | grep -v '^\[.*\](.*)' \
  && echo "FAIL" || echo "PASS"

# References atomic (each 40-150 lines)
wc -l skills/hd-compound/references/*.md
```

### Plan-hash round-trip test

Manual smoke test on a scratch repo:

1. Write 3 lessons on same topic in scratch repo
2. Run `/hd:compound graduate-propose <topic>` → capture hash
3. Run `/hd:compound graduate-apply --plan-hash <hash>` → expect success
4. Verify: AGENTS.md has new rule; graduations.md has new entry; lessons untouched
5. Re-run propose → hash differs (graduations.md changed)
6. Run apply with OLD hash → expect drift-detected abort

### Coexistence checks

- `docs/solutions/` never written
- `docs/design-solutions/` exists but empty at v0.5 (activated but not used)
- Cross-plug-in Task calls (if used in Phase-1 research) fully-qualified: `Task compound-engineering:research:learnings-researcher(...)`

### Idempotency

- Capture the same lesson twice — second time prompts (edit/suffix/abort), doesn't silently duplicate
- Apply the same graduation twice — second time either detects via graduations.md and warns, or updates existing entry with new approval

## Acceptance Criteria

### Functional (all three modes)

- [ ] **Capture mode:** writes exactly 1 file to `docs/knowledge/lessons/YYYY-MM-DD-<slug>.md`; YAML frontmatter schema valid; body has 4 sections (Context/Decision/Result/Graduation-readiness); no writes elsewhere
- [ ] **Graduate-propose mode:** emits plan body + SHA-256 hash to stdout; **writes zero files**; `git status` clean after invocation
- [ ] **Graduate-apply mode:** verifies provided hash against recomputed hash; on match, writes AGENTS.md line + graduations.md entry atomically; source lessons byte-identical after run; on mismatch, prints drift diff and exits non-zero

### Plan-hash integrity

- [ ] Hash input format matches spec in `references/plan-hash-protocol.md` byte-for-byte
- [ ] Re-running propose with unchanged inputs produces the same hash (deterministic)
- [ ] Modifying any input file between propose and apply causes hash mismatch
- [ ] User cannot apply without the exact hash string (no partial match, no case insensitivity)

### Coexistence

- [ ] Zero writes to `docs/solutions/` across any mode (verified post-run via `find docs/solutions/ -newer AGENTS.md`)
- [ ] `docs/design-solutions/` reserved but not written during v0.5 (future activation)
- [ ] Cross-plug-in Task calls fully-qualified

### Structural

- [ ] SKILL.md ≤200 lines; description ≤180 chars; `argument-hint` YAML-quoted
- [ ] References atomic (each 60-150 lines; topic-per-file)
- [ ] Workflows have copy-into-response checklists
- [ ] All reference links one level deep; no bare-backtick references

### Dogfood

- [ ] First real graduation via `hd-compound` during v0.5 build visible in git history (eat our own dog food on our own repo's graduations.md)

## Risks & Mitigations

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R1 | Plan-hash UX friction — user forgets the hash, copies wrong string | Med | Low | `propose` output makes hash prominent (own section); `apply` gives clear error if hash missing or malformed |
| R2 | Compact-safe mode not clearly distinguished | Low | Low | SKILL.md has explicit "compact-safe mode" section documenting that Phase-1 research via compound:learnings-researcher is optional; capture + graduate work without it |
| R3 | `docs/design-solutions/` activation confuses users | Low | Low | At v0.5, reserve the directory but don't write there yet; clear explanation in SKILL.md and AGENTS.md |
| R4 | Malformed YAML in source lessons | Low | Med | `propose` validates lesson frontmatter before analyzing; aborts with clear error if any source lesson fails schema check |
| R5 | Multiple source lessons — canonical hash ordering | Low | Med | Spec in `plan-hash-protocol.md` locks: sort source-lesson paths alphabetically before hashing; reproducible across invocations |
| R6 | Non-atomic write failure (AGENTS.md written, graduations.md fails) | Low | High | On any write failure, roll back via `git checkout HEAD -- AGENTS.md docs/knowledge/graduations.md`; uncommitted state guaranteed by worktree isolation during build |
| R7 | User tries to graduate a one-off lesson (<3 occurrences) | Med | Low | `propose` checks occurrence count; aborts with "Need ≥3 lessons; found N. Wait for more occurrences or document why this warrants exception." |

## Dependencies

### Hard dependencies (must be satisfied before execute)

- [x] v0.MVP ship-ready (commits `6d7a5e16`, `d361bb2e`, `b4387dd2`, `712222aa`)
- [x] Repo AGENTS.md already declares no-stubs graduated rule (2026-04-16)
- [x] `docs/knowledge/` tree exists (created Phase 3 of v0.MVP)
- [x] `docs/knowledge/lessons/` has ≥3 real lessons (captured during v0.MVP build)

### No blocking external dependencies

Pure bash + python3 (for SHA-256). Both available on macOS 14+ baseline. No npm/pip installs.

## Time Estimate

6 hours total:

| Phase | Scope | Time |
|---|---|---|
| Phase 1 | 3 references (lesson-patterns, graduation-criteria, plan-hash-protocol) + 2 templates | 2h |
| Phase 2 | 3 workflows (capture, propose, apply) | 2h |
| Phase 3 | SKILL.md router | 1h |
| Phase 4 | Verification + commit + plan-hash smoke test | 1h |

Single commit at end of Phase 4: `feat(hd-compound): implement v0.5 maintain skill`.

## Alternative Approaches Considered

**Alternative A — hd-graduate as a separate skill.** Rejected: over-splitting. Graduation IS compounding — same verb family, different mode. Two-skill split doubles surface area for users without improving discipline.

**Alternative B — automatic graduation (no plan-hash).** Rejected: modifying Tier 1 context without explicit consent is unsafe. Hallucinated approval is a real failure mode per agent-native reviewer's findings in /ce:review 2026-04-16.

**Alternative C — plan-hash as a separate feature flag.** Rejected: plan-hash IS the safety mechanism; making it optional defeats the purpose. Ship it as the only path.

**Alternative D — full cryptographic signatures (GPG / WebAuthn).** Rejected: over-engineered for v0.5. SHA-256 hash provides sufficient tamper detection + proof-of-seeing. Add signatures post-v1 if threat model demands it.

## Sources & References

### Origin

- **Origin document:** [docs/plans/2026-04-16-005-feat-v0-mvp-implementation-plan.md](./2026-04-16-005-feat-v0-mvp-implementation-plan.md) — v0.MVP implementation plan. Key decisions carried forward: hd:compound as single skill with 2 modes (no hd-graduate split); plan-hash proof-of-consent mechanism; `docs/design-solutions/` namespace activates v0.5; 9 files total.

### Internal

- Parent skill pattern: compound-engineering's `skills/ce-compound/SKILL.md` (Phase-1 parallel research → Phase-2 single writer)
- Coexistence: [repo AGENTS.md § Coexistence](../../AGENTS.md#coexistence-with-compound-engineering)
- Scenario matrix (applies to hd-compound too, via propose/apply flow): [hd-setup-scenarios.md](./hd-setup-scenarios.md)
- Graduated rule 2026-04-16 (no-stubs-with-disable-model-invocation) — our canonical graduation example

### External

- compound CHANGELOG lessons:
  - 2.35.0 — fully-qualified Task naming
  - 2.36.0 — argument-hint YAML quoting
  - 2.39.0 — compact-safe mode (context-budget precheck)
- Anthropic [Skill best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
- SHA-256 / hash-based plan verification: precedent in Terraform `plan -out` + `apply`

## Execution Ready

All locks in place. No open questions. Next command: `/ce:work docs/plans/2026-04-16-006-feat-hd-compound-v0-5-plan.md` starts Phase 1 immediately.

Plan written to `docs/plans/2026-04-16-006-feat-hd-compound-v0-5-plan.md`.
