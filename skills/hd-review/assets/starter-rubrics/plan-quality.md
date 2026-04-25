---
rubric: plan-quality
name: "Plan quality (docs/plans/ output)"
applies_to:
  - plan-md
version: 1
severity_defaults:
  default: p2
source:
  - "/ce:plan + /ce:deepen-plan conventions (compound-engineering)"
  - "Phase 3a–3r plan corpus (this plug-in's own dogfood; 6+ executed plans)"
  - "Phase 3q acceptance-criteria pattern (measurable + verification field)"

sections:
  framing:
    order: 1
    title: "Framing"
    criteria:
      - id: title-typed-and-dated
        severity: p1
        check: "Frontmatter `title`, `type` (feat|fix|refactor|docs), `date` (ISO YYYY-MM-DD), `status` (active|completed) all present"
      - id: phase-or-origin-cited
        severity: p2
        check: "Frontmatter cites either `phase:` (for our phase plans) OR `origin:` / `origin_ideation:` (for plans derived from a brainstorm or ideation entry)"
      - id: overview-paragraph-present
        severity: p1
        check: "First section (after frontmatter) is a single Overview paragraph stating WHAT the plan delivers and WHY now"

  scope:
    order: 2
    title: "Scope"
    criteria:
      - id: problem-statement-explicit
        severity: p1
        check: "Problem statement / motivation section names the concrete pain or trigger — not 'we should do X' but 'X bites us in Y way' with cited evidence"
      - id: scope-boundaries-declared
        severity: p1
        check: "Explicit `Scope Boundaries (non-goals)` section listing what is NOT in this plan; prevents scope creep during /ce:work"
      - id: deferred-questions-flagged
        severity: p2
        check: "If implementation-time unknowns exist, a `Deferred to Implementation` section names them with strawman defaults (so executor can resolve in-flight without surprise)"

  units:
    order: 3
    title: "Implementation units"
    criteria:
      - id: units-numbered-with-goals
        severity: p1
        check: "Plan has Implementation Units (e.g., 3q.1, 3q.2…) — each with explicit Goal, Files, Approach, and Verification fields"
      - id: file-paths-explicit
        severity: p2
        check: "Each unit names concrete file paths it will touch (not 'update the agent') so executor doesn't have to guess"
      - id: patterns-to-follow-cited
        severity: p2
        check: "Each unit cites Patterns to Follow — e.g., 'mirror the shape of skills/hd-setup/references/hd-config-schema.md' — so executor mirrors existing conventions"
      - id: units-have-effort-estimate
        severity: p3
        check: "Units carry rough effort sizing (XS / S / M / L OR explicit hour estimates) so total plan effort is legible at glance"

  acceptance:
    order: 4
    title: "Acceptance"
    criteria:
      - id: acceptance-criteria-measurable
        severity: p1
        check: "Acceptance Criteria are checkboxes with concrete measurables (line counts, file presence, exact-match diffs, count equality) — not vague aspirations like 'works well'"
      - id: regression-acceptance-explicit
        severity: p2
        check: "If the plan touches existing functionality, acceptance criteria include at least one regression check (pre/post diff = 0, count match, etc.)"
      - id: budget-acceptance-explicit
        severity: p3
        check: "If the plan touches Tier 1 surfaces (always-loaded, SKILL.md, agent specs), acceptance asserts budgets are preserved (e.g., 'always-loaded ≤200', '0 violations')"

  references:
    order: 5
    title: "References"
    criteria:
      - id: sources-section-present
        severity: p2
        check: "Sources & References section cites origin ideation, related lessons, related rules, and adjacent plans (so executor has full context without re-discovering)"
      - id: deferred-section-present
        severity: p3
        check: "If parts of the work are deferred to a later phase, a `Deferred (not in this phase)` block names them — keeps the boundary visible to readers post-completion"
---

# Plan quality

Score `docs/plans/YYYY-MM-DD-NNN-<type>-<slug>-plan.md` files. The plan is the decision artifact that `/ce:work` follows — quality here directly affects execution quality. A plan that's missing scope boundaries blows up; a plan with unmeasurable acceptance criteria leaves "done" undefined.

**Dogfood scope:** Phase 3a–3r plan corpus (`docs/plans/*-plan.md`). The plan template enforced by `/ce:plan` already pushes most of these criteria — this rubric is the post-write check before `/ce:work`.

## Scope & Grounding

Grounded in the `/ce:plan` + `/ce:deepen-plan` flow conventions and the lived experience of executing 6+ phase plans on this plug-in itself (Phases 3e through 3r). Criteria emerge from observed failure modes — plans that left scope boundaries implicit caused mid-work scope creep; plans without measurable acceptance left ship/no-ship ambiguous.

### Personas
- **Plan author** — running `/ce:plan` or hand-writing a plan. Pain: plan looks good in isolation but the executor (often the same person hours later) rediscovers gaps.
- **Plan executor** — running `/ce:work` against the plan, often in a fresh context window. Pain: missing patterns-to-follow forces re-discovery; vague acceptance leaves uncertainty.
- **Reviewer** — `/ce:review` after work lands. Pain: no regression check in acceptance means review can't verify "nothing else broke."
- **Future archaeologist** — reading the plan months later to understand why a change happened. Pain: missing problem statement turns the plan into a pure to-do list with no rationale.

### User stories
- As a **plan author**, I need **explicit scope boundaries** so that **mid-work scope creep is a deliberate amendment, not an accident**.
- As a **plan executor**, I need **per-unit Patterns to Follow** so that **I match conventions without re-deriving them**.
- As a **reviewer**, I need **regression acceptance** so that **I can verify nothing existing broke**.
- As an **archaeologist**, I need **a problem statement with cited evidence** so that **the plan tells me why, not just what**.
- As any **stakeholder**, I need **measurable acceptance criteria** so that **"done" is unambiguous**.

### Realistic scenarios
- **Phase 3q rubric YAML split** — `docs/plans/2026-04-21-004-feat-phase-3q-rubric-yaml-split-plan.md`. 6 implementation units, explicit Scope Boundaries, Deferred to Implementation block, measurable acceptance ("criterion count matches exactly pre/post"). Why it matters: executed cleanly in one /ce:work pass; reference quality bar.
- **Phase 3p detect-inspect-integrate plan** — adjacent example with an Origin section linking to source ideations. Why it matters: archaeologist persona served via origin trace.
- **Pre-3q plan files lacking phase tag** — older `2026-04-16-*` plans don't have `phase:` frontmatter; surfaced as p2 finding when re-audited. Why it matters: legacy plans drift into harder-to-cross-reference state.

### Anti-scenarios (common failure modes)
- **Plan with "fix the rubric" as a bullet** — no problem statement, no scope boundary, no acceptance. Symptom: executor builds wrong scope OR halts asking clarifying questions.
- **Acceptance criteria as "should work"** — un-measurable. Symptom: ship/no-ship debate post-work; ambiguity costs time.
- **Implementation Units without file paths** — "update the agent" with no path. Symptom: executor grep-archaeologies for the right file; risk of touching wrong one.
- **No Scope Boundaries section** — feature creep during /ce:work. Symptom: plan grows mid-work; commit churn.
- **Plan body has Implementation code (Ruby/Python/etc) inline** — the plan turns into a code dump. Symptom: plan becomes brittle (code drifts from actual implementation); plan should describe approach, not author code.

## Criteria — rationale + examples

Per-criterion prose. Normative criteria live in YAML frontmatter above; this body explains the *why* + concrete pass/fail anchors.

### title-typed-and-dated

**Pass:** frontmatter has `title:`, `type: feat`, `date: 2026-04-24`, `status: active`. Renders cleanly in plan listings.
**Fail:** missing `type` or `date`; can't sort or filter the plans corpus.

### phase-or-origin-cited

**Pass:** `phase: 3r` for our phase plans; OR `origin: docs/brainstorms/2026-04-22-feature-x-requirements.md` for derived plans.
**Fail:** plan exists in isolation, no traceability back to the upstream artifact.

### overview-paragraph-present

**Pass:** opens with one tight paragraph explaining WHAT lands and WHY now. Reader knows in 30 seconds whether the plan is relevant.
**Fail:** opens with "## Background" → 5 paragraphs of context before the actual deliverable is named.

### problem-statement-explicit

**Pass:** "Concrete fragility: skill-quality-auditor parses the rubric via markdown-table regex. Two failure modes: (1) prose refactor moves tables; (2) sed-style bulk edit. Both observable today."
**Fail:** "Rubrics could be improved" — no cited evidence, no concrete pain.

### scope-boundaries-declared

**Pass:** "Do NOT migrate ux-writing or heuristic-evaluation in 3q (deferred to 3r). Do NOT formalize schema. Do NOT author CLI validator."
**Fail:** No "non-goals" section. Mid-work, scope expansion is an undocumented decision.

### deferred-questions-flagged

**Pass:** "Deferred to Implementation: exact `id` naming for criteria. Strawman: kebab-case. Finalize during 3q.2."
**Fail:** Implementation hits an unknown mid-work; executor halts to ask.

### units-numbered-with-goals

**Pass:** "Unit 3q.2 — Migrate skill-quality.md (both copies). Goal. Files. Approach. Verification."
**Fail:** "TODO: migrate the rubric" — no goal field, no verification clause.

### file-paths-explicit

**Pass:** "`docs/rubrics/skill-quality.md` (dogfood adopted copy) + `skills/hd-review/assets/starter-rubrics/skill-quality.md` (starter ship copy)"
**Fail:** "update the rubric" — executor picks wrong file 50% of the time.

### patterns-to-follow-cited

**Pass:** "Patterns to follow: Existing `hd-config-schema.md` structure for schema docs."
**Fail:** Plan asks executor to author a new schema doc with no example to mirror.

### units-have-effort-estimate

**Pass:** "Unit 3q.1: 0.5 hr" — total effort legible at glance.
**Fail:** No estimates; can't tell if plan is a 30-min polish or a 3-day refactor.

### acceptance-criteria-measurable

**Pass:** "Both copies of `skill-quality.md` migrated; criterion count matches pre-migration (37 ± 0); both copies diff-clean."
**Fail:** "Migration works correctly." Un-verifiable.

### regression-acceptance-explicit

**Pass:** "`/hd:review audit` on the plug-in's own repo produces same total finding count pre/post migration (no silent loss of criteria coverage)"
**Fail:** No regression bar — the plan changed existing behavior but didn't gate against breaking it.

### budget-acceptance-explicit

**Pass:** "skills/hd-review/SKILL.md stays ≤200 lines; 0 new skill/agent violations"
**Fail:** Plan touches Tier 1 surface but doesn't assert budget preservation.

### sources-section-present

**Pass:** "Sources: Origin ideation [link], related lessons [list], related rules [list], adjacent plans [list]"
**Fail:** No sources block — executor reconstructs context from scratch.

### deferred-section-present

**Pass:** "Deferred (not in this phase): Phase 3r migrates ux-writing + heuristic-evaluation; future phase formalizes schema."
**Fail:** Plan completes; readers can't tell what's still on the table for next phase.

## Extending this rubric

Copy to `docs/rubrics/plan-quality-<team>.md` and:

1. Adjust per-criterion `severity` in the YAML for your team's tolerance
2. Append team-specific criteria — e.g., "every plan must link a Linear issue"
3. Reference in `hd-config.md` under `critique_rubrics`

## What this rubric does NOT check

- Whether the plan's underlying decision is correct (that's a product call) — see `/ce:deepen-plan` for upstream second-opinion review
- Whether implementation matches the plan post-work — that's `/ce:review` territory
- Plan formatting beyond required sections (line lengths, prose style) — see `ux-writing.md`

## See also

- [`../../references/rubric-yaml-schema.md`](../../references/rubric-yaml-schema.md) — schema for the YAML frontmatter above
- [skill-quality.md](skill-quality.md) — sister rubric for Layer 2 skill quality
- [lesson-quality.md](lesson-quality.md) — sister rubric for Layer 5 lesson quality
- compound-engineering — `/ce:plan` skill at `~/.claude/plugins/cache/compound-engineering-plugin/.../skills/ce-plan/SKILL.md`
