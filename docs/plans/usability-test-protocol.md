---
title: "n=5 usability test protocol — v1.0.0 ship gate"
type: test-protocol
status: active
date: 2026-04-17
---

# Usability test protocol — design-harness v1.0.0

**Purpose:** Gate the v1.0.0 release on real-designer feedback. Five designers, one hour each. Measures TTFUI (time-to-first-useful-interaction) and "can they articulate value?" both per the v0.4 PRD success criteria.

**Who runs it:** Bill (host) + one note-taker (optional). Both observe silently except for the scripted prompts below.

**What we're NOT testing:** the article itself, Claude Code onboarding, or anything outside the plug-in. If a designer gets stuck installing Claude Code, that's out of scope — skip ahead to the next task.

---

## Recruit

5 designers matching the primary persona:

- Works in a team of 5–20 designers
- Has at least one repo with existing design docs (AGENTS.md, DESIGN.md, style-guide.md, or a Figma-linked knowledge base)
- Has used Claude Code or a similar AI coding tool for ≥2 weeks
- NOT co-authored any part of this plug-in (no insiders)

Mix: 3 ICs, 2 managers. At least one designer who has never read the Substack article.

---

## Setup (5 min, pre-session)

1. Designer installs the plug-in via `/plugin install design-harness` in their own Claude Code (or the local-dev path if marketplace not yet live).
2. Designer picks one of their own repos to run the session against.
3. Bill shares a blank Google Doc for notes and the session transcript.

**If install fails:** abort session; log the failure under "install friction" and reschedule.

---

## The four tasks (50 min, 10–15 min each)

### Task 1 — `/hd:onboard` (LEARN, 10 min)

**Prompt to designer:** "Run `/hd:onboard` and ask it whatever you want about the design-harness concept. Stop when you feel you understand what a design harness is and whether you'd want one."

**What we measure:**
- TTFUI: stopwatch from `/hd:onboard` keystroke to moment designer says "I get it."
- Article citations they actually read (did they click through to a reference file?)
- Questions they asked that the skill couldn't answer

**Pass bar:** designer can articulate the five-layer frame in ≤ 5 minutes, in their own words, without looking back at the skill output.

### Task 2 — `/hd:setup` (SETUP, 15 min)

**Prompt:** "Run `/hd:setup` in the repo you picked. Follow the skill's flow. Let me know when you've done enough that you'd commit the result."

**What we measure:**
- Which mode does `detect-mode.sh` land on? (greenfield / scattered / advanced / localize)
- Does the mode match reality? (Bill eyeballs the repo)
- How many layers does the designer actually scaffold?
- How many times does the designer back out of a prompt?
- Does `design-harnessing.local.md` end up at the repo root?

**Pass bar:** designer touches ≥ 2 of the 5 layers, has non-empty `docs/context/` at end, and says "I'd commit this" without prompting.

### Task 3 — `/hd:compound capture` (MAINTAIN, 10 min)

**Prompt:** "Think of a recent design decision or debate on your team. Use `/hd:compound capture` to record it. Stop when the lesson file looks right."

**What we measure:**
- Does the captured lesson land at `docs/knowledge/lessons/YYYY-MM-DD-<slug>.md`?
- Does the designer use the template structure (Context / Decision / Result / Graduation-readiness)?
- If they skip fields, which ones?

**Pass bar:** a lesson file exists at the expected path with Context + Decision + Result populated.

**Optional sub-task (only if time permits):** run `/hd:compound graduate-propose <topic>` against an existing lesson cluster if the repo has one. Observe whether the designer understands the plan-hash handoff between propose and apply.

### Task 4 — `/hd:review audit` (IMPROVE, 10 min)

**Prompt:** "Run `/hd:review audit` on the harness you just built. When the audit completes, open the report. Tell me whether you'd act on any of the findings."

**What we measure:**
- Does exactly 1 file land at `docs/knowledge/lessons/harness-audit-YYYY-MM-DD.md`? (Grep `git status` after the run.)
- Does the designer identify at least one finding they'd act on?
- If the audit surfaced 6+ agents, did it auto-switch to serial with the right user-facing message?

**Pass bar:** single-file write invariant holds + designer points to ≥ 1 actionable finding.

**Also check in the audit report:** does the Layer 2 section cite the `skill-quality` rubric by section number (1–9)? If yes, the rubric wiring is working. If the audit surfaces no Layer 2 findings at all, that's suspicious — at least one of the user's custom skills probably has a description-chars or one-job-focus issue worth surfacing.

---

## Post-session debrief (5 min)

Three open questions:

1. "What was confusing?"
2. "What would you remove?"
3. "What would you add?"

Record verbatim. Do not rebut or defend. One follow-up clarifying question per answer max.

---

## Aggregate pass criteria (gate v1.0.0 ship)

v1.0.0 ships when:

| Metric | Bar | Notes |
|---|---|---|
| Install success | 5/5 | Zero tolerance; install failure blocks everything |
| Task 1 (onboard) TTFUI median | ≤ 5 min | Time-to-"I get it" |
| Task 1 articulation | 4/5 | 4 of 5 can paraphrase the five-layer frame |
| Task 2 (setup) completion | 4/5 | Designer says "I'd commit this" |
| Task 2 mode correctness | 5/5 | `detect-mode.sh` matches reality per Bill's eyeballing |
| Task 3 lesson file lands | 5/5 | Deterministic; file at expected path |
| Task 4 single-file write | 5/5 | Non-negotiable — multi-file writes = ship-blocker |
| Task 4 actionable finding | 3/5 | Softer bar; designers differ on what's actionable |
| "What was confusing?" themes | ≤ 2 clusters with ≥ 3 of 5 designers | If 3+ designers get confused by the same thing, fix before ship |

**If any non-negotiable fails (install, mode correctness, single-file write):** stop the gate, fix, re-run n=5.

**If soft bars miss (articulation, actionable-finding counts):** ship v1.0.0 anyway, open P2 todos in `docs/plans/` for post-v1 iteration.

---

## Data hygiene

- Each session's notes in `docs/plans/usability-sessions/YYYY-MM-DD-<designer-initials>.md` (create folder when first session runs)
- Designer names anonymized to initials; no employer/company info in committed files
- Session transcripts NOT committed (Google Doc link in the session note is enough)
- Aggregate results summarized in a single `docs/knowledge/lessons/YYYY-MM-DD-v1-usability.md` lesson after all 5 sessions complete

## See also

- [hd-setup-success-criteria.md](./hd-setup-success-criteria.md) — per-scenario pass bars (automation-oriented)
- [2026-04-16-003-design-harness-plugin-v0.4-four-skills.md](./2026-04-16-003-design-harness-plugin-v0.4-four-skills.md) — PRD § "Success criteria" lines that seeded the bars above
- [2026-04-17-v1-smoke-tests.md](../knowledge/lessons/2026-04-17-v1-smoke-tests.md) — deterministic smoke tests run before this human gate
