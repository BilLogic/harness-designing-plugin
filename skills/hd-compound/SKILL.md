---
name: hd:compound
description: Captures design lessons and proposes graduations from narrative to rule. Use when capturing a decision or promoting a recurring pattern.
argument-hint: "capture | graduate-propose <topic> | graduate-apply --plan-hash <sha>"
---

# hd:compound — maintain your harness (capture + graduate)

## Interaction method

Default: walk the user through capture or graduation with `AskUserQuestion` for branching decisions (approve / edit / abort). If `AskUserQuestion` is unavailable (non-Claude hosts — Codex, Gemini, Copilot), fall back to numbered-list prompts. **Never write to `AGENTS.md` or `graduations.md` without a verified plan-hash** (F4 safety per [`references/plan-hash-protocol.md`](references/plan-hash-protocol.md)).

## Single job

Append a dated lesson to `docs/knowledge/lessons/` (capture mode) OR promote a pattern across multiple lessons to a rule in `AGENTS.md` (graduate mode). One skill, two modes — same verb family.

## Mode detection

Route based on user prompt + `argument-hint`:

| User says… / invokes… | Mode | Workflow |
|---|---|---|
| "Save this lesson" / "Capture this decision" / `/hd:compound capture` | **capture** | [workflows/capture.md](workflows/capture.md) |
| "Graduate this pattern" / "Promote to rule" / `/hd:compound graduate-propose <topic>` | **graduate-propose** (read-only) | [workflows/propose-graduation.md](workflows/propose-graduation.md) |
| `/hd:compound graduate-apply --plan-hash <sha>` | **graduate-apply** (destructive; plan-hash protected) | [workflows/apply-graduation.md](workflows/apply-graduation.md) |

Never auto-dispatch across modes. If the mode is ambiguous from context, **ask** before routing.

## Workflow checklist (mode-independent wrapper)

Copy into your response and track:

```
hd:compound Progress:
- [ ] Step 1: Identify mode (capture / propose / apply)
- [ ] Step 2: Route to matching workflow
- [ ] Step 3: For graduate-apply, verify plan-hash BEFORE any write
- [ ] Step 4: Execute atomic writes per workflow
- [ ] Step 5: Summarize + suggest next action
```

## Step 1 — Identify mode

Parse user prompt + `argument-hint` per the routing table above. When unclear (user says "compound this" with no context), ask:

> "Capture a new lesson, or graduate an existing pattern to a rule?"

## Step 2 — Route

Load exactly one workflow file. Don't cross-contaminate workflows — each mode is bounded.

## Step 3 — For graduate-apply only: verify hash

Per [`references/plan-hash-protocol.md`](references/plan-hash-protocol.md):

1. Parse `--plan-hash` argument
2. Re-read all inputs (source lessons, AGENTS.md, graduations.md)
3. Re-compute canonical hash input
4. Re-compute SHA-256
5. Compare with user-provided hash
6. **Match** → proceed to write
7. **Mismatch** → abort with drift diagnosis; suggest re-propose

**If the workflow is capture or graduate-propose, this step does not apply** (capture doesn't modify Tier 1; propose doesn't write at all).

## Step 4 — Execute per workflow

- **Capture** → 1 atomic write to `docs/knowledge/lessons/YYYY-MM-DD-<slug>.md`
- **Graduate-propose** → 0 writes; emit plan + hash to stdout
- **Graduate-apply** (after hash verified) → 2 atomic writes (AGENTS.md + graduations.md); source lessons byte-identical

All writes use temp file + `mv` (atomic on POSIX). On any write failure, roll back via `git checkout HEAD -- <file>`.

## Step 5 — Summarize

Report concise:

- Path(s) written (or plan + hash for propose mode)
- Graduation signal: if capture just created the 3rd+ matching lesson, surface graduation candidacy
- Next step suggestion:
  - After capture → "Review `/hd:onboard` if new to Layer 5 mechanics" or "Consider `/hd:compound graduate-propose` when ≥3 related lessons"
  - After graduate-apply → "Commit: `git commit -m \"chore: graduate <title>\"`" or "Run `/hd:review`"

## What this skill does NOT do

- **Does not answer concept questions** → hand off to `/hd:onboard`
- **Does not scaffold harness structure** → hand off to `/hd:setup`
- **Does not audit harness health** → hand off to `/hd:review`
- **Does not modify source lessons** — history is sacred (Layer 5 append-only rule)
- **Does not apply graduations without a verified plan-hash** — refusal is structural, not advisory

## Coexistence rules

- ✅ Writes ONLY to `docs/knowledge/lessons/` (capture), `AGENTS.md` + `docs/knowledge/graduations.md` (graduate-apply)
- ❌ Never writes to `docs/solutions/` (compound's namespace)
- ❌ Never writes to `docs/design-solutions/` in v0.5 (namespace reserved; distilled pattern-solutions are a post-v0.5 feature)
- Task invocations (optional Phase-1 research in capture mode) fully-qualified: `Task compound-engineering:research:learnings-researcher(...)` — bare names get re-prefixed wrong per compound 2.35.0

## Compact-safe mode

When context is tight (compound 2.39.0 lesson):

- Capture mode skips Step 6 Phase-1 research (no `compound-engineering:research:learnings-researcher` call)
- Propose mode keeps all hash-computation steps (non-optional for protocol correctness); reduces prose in emitted plan
- Apply mode unchanged (hash verification is mandatory regardless of context budget)

## Reference files

- [references/lesson-patterns.md](references/lesson-patterns.md) — YAML schema, body structure, anti-patterns, graduation-readiness heuristics
- [references/graduation-criteria.md](references/graduation-criteria.md) — when a lesson graduates (3+ occurrences + clean imperative + team agreement)
- [references/plan-hash-protocol.md](references/plan-hash-protocol.md) — SHA-256 proof-of-consent mechanism spec

## Workflows

- [workflows/capture.md](workflows/capture.md) — append single dated lesson (capture mode)
- [workflows/propose-graduation.md](workflows/propose-graduation.md) — analyze lessons + emit plan + hash (graduate-propose; read-only)
- [workflows/apply-graduation.md](workflows/apply-graduation.md) — verify hash + atomic write (graduate-apply; destructive; plan-hash protected)

## Templates

- [templates/lesson.md.template](templates/lesson.md.template) — scaffold for new lesson entries
- [templates/graduation-entry.md.template](templates/graduation-entry.md.template) — scaffold for graduations.md entries
