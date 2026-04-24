---
title: "feat: Phase 3p — detect-inspect-integrate + setup health disclosure"
type: feat
status: active
date: 2026-04-21
phase: 3p
---

# feat: Phase 3p — detect-inspect-integrate + setup health disclosure

## Overview

Phase 3o shipped universal tool discovery via research-time classification. Testing + reflection on external format trends (e.g. `DESIGN.md` at google-labs-code) surfaced two gaps:

1. **`/hd:setup` doesn't disclose a post-setup health assessment.** Step 10 reports layer decisions + budget + next-step, but discards Phase A's per-layer health data (already computed via `harness-auditor × 5`). Users finish setup without a view of "what shape is this harness in now?"
2. **L1 EXECUTE doesn't proactively surface substantive existing files** already detected by `scattered_l1_signals` / `root_l1_files`. When a user has DESIGN.md, README.md, PRD docs, tech-stack files, or `*.local.md` configs, our Fill-path waits for them to invoke Path B (paste-organize). They may not realize that's the move.

Plus a related internal opportunity: our agent-authored templates (lessons, decisions, review reports) have thin frontmatter + rich prose. Downstream agents (lesson-retriever, rule-candidate-scorer) grep prose to extract structured data. Richer frontmatter = deterministic agent queries + no markdown-parse fragility.

Phase 3p is four small units tied by a single principle: **detect-inspect-integrate universally; the 5-layer harness is the coordinating frame, external formats are content-input**.

## Problem Statement / Motivation

**Why detect-inspect-integrate generically and not by filename:** hardcoding DESIGN.md as a known format would reintroduce the whitelist anti-pattern 3o just rejected. New format ships next quarter (agents.md.spec, README.md extended shape, whatever) → another entry → treadmill. The universal shape is: `detect.py` already surfaces substantive files via `scattered_l1_signals`; what's missing is the **proactive offer** at L1 EXECUTE so the user sees their existing content as integration candidates without having to invoke Path B blind.

**Why the user decides integration (not the plug-in):** per the 2026-04-21 advisor-not-installer rule. Our 5-layer harness is the coordinating structure — external formats (DESIGN.md, CONTRIBUTING.md, etc.) are content-input to that structure, not overrides of it. The plug-in reads + presents + suggests; the human picks pointer vs paste-organize vs ignore. This reinforces our standard without privileging any specific external format.

**Why richer template frontmatter:** agents author lessons + decisions + reviews; other agents consume them. Today `lesson-retriever` greps prose for relevance; `rule-candidate-scorer` parses markdown tables. Adding `applies_to_layers`, `related_rules`, `decision_summary`, `result_summary`, `next_watch` to frontmatter lets downstream agents query deterministically instead of regex-grep.

**Why setup needs its own health disclosure:** Phase A already computes it. Throwing the data away after using it for default-action proposals is wasteful. Users deserve to see "you came in, we looked, here's what shape it's in now" — closes the feedback loop.

## Proposed Solution

Four units, ordered by dependency:

1. **Surface Phase A's health data at setup end** (Step 10.5). Pure read of existing data.
2. **L1 EXECUTE proactively offers detected substantive files** as Fill-path input. Generic — not filename-specific.
3. **Enrich agent-authored template frontmatter**. Machine-queryable metadata.
4. **Capture the detect-inspect-integrate principle as lesson** (rule_candidate; builds on the advisor-not-installer rule).

Plus a bonus:

5. **Ship `rubric-template.md`** as an explicit starter so users (or their AI) can author their own rubrics without copying an existing starter as implicit template.

## Implementation Units

### Unit 3p.1 — Step 10.5 post-setup health assessment

**Goal.** Surface the harness-auditor × 5 data already computed in Phase A as a final assessment when `/hd:setup` finishes.

**Files.** `skills/hd-setup/SKILL.md` (add Step 10.5 section after Step 10).

**Approach.**
- Phase A returns per-layer `{layer, health_score, overall_health, top_findings[]}`. Today we use it for default-action proposals then discard.
- Retain the Phase A synthesis in memory through setup completion.
- After Step 10, render a health rollup:

```
Harness health (post-setup):

Layer              Bar          Score   State
─────────────────  ───────────  ──────  ─────────────────────────────
L1 Context         ████████░░    8.0    populated; minor drift
L2 Skill Curation  █████████░    9.0    well-scoped
L3 Orchestration   ██████░░░░    6.0    workflows scattered — scaffold recommended
L4 Rubric Setting  ██████████  10.0    starter trio adopted
L5 Knowledge       ████████░░    8.0    empty; first /hd:maintain capture soon

Top 3 priorities from setup:
  P2  L3  Scaffold workflows/ directory               M
  P3  L1  Populate docs/context/engineering/          S
  P3  L5  Capture first lesson                        XS
```

- Reuses `/hd:review audit` ASCII bar format for visual consistency (same block glyphs, same score scale).
- Non-blocking — narration only; then Step 11 "Next step" suggestion as today.

**Patterns to follow.** `hd-review/assets/review-report.md.template § Harness health` + `hd-review/references/review-procedure.md` bar-rendering logic.

**Verification.** Running `/hd:setup` on the plug-in's own repo ends with a 5-layer ASCII bar block + top-3 priorities populated from the Phase A pre-analysis.

---

### Unit 3p.2 — L1 EXECUTE proactive surfacing of detected files

**Goal.** When user reaches L1 Fill path and `scattered_l1_signals` has non-empty hits, proactively surface those files as integration candidates across Fill paths A/B/C.

**Files.** `skills/hd-setup/references/layer-1-context.md` (extend Fill path narration).

**Approach.**
- At L1 EXECUTE entry, check `scattered_l1_signals`:
  - `root_l1_files[]` (README.md, `*.local.md`, root SKILL.md — from 3o.5d)
  - `prd_files[]` (PRD_*.md, requirements.md — from 3l.3)
  - `tech_stack_files[]` (TECH_STACK.md, ARCHITECTURE.md — from 3l.3)
  - `design_system_dirs[]` (docs/design-system/, src/design-system/ — from 3l.3)
  - *Plus any root-level `*.md` with ≥30 non-blank lines that isn't already in the above* (catches DESIGN.md, CONTRIBUTING.md, etc. generically without naming them)
- If any hits, prepend to the Fill path narration:

> *"Found substantive L1 content already in your repo:*
> *- `DESIGN.md` (root, 87 lines)*
> *- `README.md` (root, 45 lines)*
> *- `docs/design-system/` (dir, 12 files)*
> *- `compound-engineering.local.md` (root, 8 lines)*
>
> *How to incorporate into the harness?*
> *(a) Scaffold pointers — thin summary files under `docs/context/` referencing originals (originals stay authoritative)*
> *(b) Paste-organize — extract content into `docs/context/` sub-folders (reuses 3n Path B helper)*
> *(c) Both — pointer for some, paste-organize for others*
> *(d) Skip — treat as unrelated; I'll create from scratch*
>
> *Our standard structure is `docs/context/product/` / `engineering/` / `design-system/` / `conventions/` — whichever path you pick, content lands there."*

- Critically: **no hardcoded filename logic.** Whatever the detector surfaces via existing signals is what we offer. No `if DESIGN.md` branch. No special rubric. No filename whitelist.
- User always decides. Plug-in never auto-integrates.

**Patterns to follow.** Existing L1 Fill path narration (layer-1-context.md:84). Reuses `paste-organize.md` helper (3n.6).

**Verification.** On Lightning (has README.md + compound-engineering.local.md in `root_l1_files`), simulated L1 EXECUTE narration lists both files + 4-option integration prompt. On Oracle Chat (has docs/PRD_*.md + docs/TECH_STACK.md), narration lists those. On a fresh greenfield repo with nothing, narration skips the prepended block and proceeds to standard A/B/C.

---

### Unit 3p.3 — Richer frontmatter on agent-authored templates

**Goal.** Move machine-queryable metadata from prose body into frontmatter on lesson / decision / review templates. Body stays prose narrative; downstream agents query frontmatter deterministically.

**Files.**
- `docs/knowledge/lessons/` — no template file exists today; existing lessons follow a de-facto shape. Update AGENTS.md § Rules or create `skills/hd-maintain/assets/lesson.md.template`
- `docs/knowledge/decisions.md` — extend the in-file format block with richer frontmatter schema
- `skills/hd-review/assets/review-report.md.template` — add per-finding structured fields (findings already partially structured; extend)

**Approach.**

**Lesson frontmatter (before):**
```yaml
---
title: "..."
date: YYYY-MM-DD
tags: [...]
memory_type: episodic
importance: 5
rule_candidate: true
rule_ref: null
---
```

**After:**
```yaml
---
title: "..."
date: YYYY-MM-DD
memory_type: episodic
importance: 5
tags: [...]

# Machine-extractable — for agent cross-reference
applies_to_layers: [l1, l4]      # which layers this lesson informs
related_rules: []                 # AGENTS.md rule IDs if any
related_lessons: []               # sibling lesson slugs
decision_summary: "One-sentence extractable decision."
result_summary: "One-sentence extractable outcome."
next_watch: "What future signal confirms or disconfirms this."
rule_candidate: true
rule_ref: null
supersedes: null
superseded_by: null
---

# <narrative rationale in body — humans + coding-agent read this>
```

**Decision (ADR) frontmatter** — add per-decision structured fields:
```yaml
- decision_id: D_2026_04_21_advisor
  title: "Advisor-not-installer framing for external tools"
  date: 2026-04-21
  related_rules: [R_2026_04_21_advisor]
  related_lessons: [2026-04-21-external-source-fill-path]
  supersedes: null
  superseded_by: null
  # prose rationale follows in markdown body
```

**Review-report finding frontmatter** — findings list already structured; extend with:
```yaml
findings:
  - id: F_2026_04_21_01
    severity: p1
    category: always-loaded-budget
    content_status: present-but-stale
    file: skills/hd-review/scripts/budget-check.sh
    finding: "Loading-order contract points at nonexistent path"
    suggested_action: "Install loading-order.md at repo root"
    detected_by: harness-auditor-l1
    applies_to_layers: [l1]
```

**Why this helps downstream agents:**
- `lesson-retriever` queries `applies_to_layers: [l1]` directly — no markdown grep
- `rule-candidate-scorer` aggregates by `related_rules` + `rule_candidate: true` — no table-parsing
- `/hd:review audit` can build a graph of rules ↔ lessons ↔ decisions from frontmatter alone
- Human body stays unchanged; only structure-above-the-fold gets richer

**Patterns to follow.** Existing lesson frontmatter (14 lessons under `docs/knowledge/lessons/` — use as shape reference). Existing `review-report.md.template` finding format.

**Verification.** (1) Author lesson template file at `skills/hd-maintain/assets/lesson.md.template`. (2) Migrate 2–3 recent lessons (2026-04-21 ones) to the richer shape — preserve content, add fields. (3) Write a one-liner check that every new lesson has `applies_to_layers` field set (non-blocking warn, not error). (4) Confirm `lesson-retriever` agent spec reads the new fields (update agent if needed).

---

### Unit 3p.4 — Capture detect-inspect-integrate principle as lesson

**Goal.** Preserve the principle before it fades. Candidate rule builds on 2026-04-21 advisor-not-installer.

**Files.** `docs/knowledge/lessons/2026-04-21-detect-inspect-integrate.md` (new).

**Content (outline):**
- Context: Phase 3o (universal tool discovery) + Phase 3p conversation surfaced a latent rule.
- Observation: hardcoding known external formats (DESIGN.md, CONTRIBUTING.md) as special cases is the same whitelist anti-pattern we rejected for CLI/data_api tools. Ecosystem produces new formats continuously; maintenance burden grows linearly.
- The discipline: detect substantive files via generic signals (filename patterns, size thresholds, content heuristics); present them to the user as integration candidates; route every integration through user decision; the 5-layer harness remains the coordinating frame.
- **Candidate rule:** *"Detect substantive infrastructure files universally (no filename whitelist). Present detected files as integration candidates with concrete options (pointer / paste-organize / ignore). Every integration routes through explicit user decision. Our 5-layer harness is the coordinating frame; external formats are content-input, not override."*

Extends the 2026-04-21 advisor-not-installer rule. Graduate when confirmed by a second live run or a second reviewer finding. First confirmation is today's conversation + the 3o whitelist-vs-research-time lesson.

**Verification.** Lesson file exists; frontmatter parses (use the 3p.3 enriched shape); citations from the lesson include the DESIGN.md conversation + whitelist-vs-research-time precedent.

---

### Unit 3p.5 — Ship `rubric-template.md` as explicit starter

**Goal.** Today users wanting to author their own rubric either (a) read `rubric-authoring-guide.md` prose or (b) copy an existing starter as implicit template. Explicit `rubric-template.md` with clearly-marked placeholders is lower-friction.

**Files.** `skills/hd-review/assets/starter-rubrics/rubric-template.md` (new). Update `skills/hd-review/references/rubric-authoring-guide.md` to point at it.

**Approach.** Ship a skeleton rubric file with placeholder text wrapped in `{{DOUBLE_BRACES}}` pattern (consistent with our other `.template` files). Include inline comments explaining each section's purpose. Include the Scope & Grounding schema (4 sub-blocks) with placeholder personas / stories / scenarios / anti-scenarios.

See template content in § Template example below.

**Verification.** `rubric-template.md` lints as valid YAML frontmatter + valid markdown. `rubric-authoring-guide.md` links to it. A user (or their AI) can `cp skills/hd-review/assets/starter-rubrics/rubric-template.md docs/rubrics/<name>.md` and fill in placeholders.

---

## Template example — `rubric-template.md`

For reference (also written as Unit 3p.5):

```markdown
---
rubric: {{RUBRIC_NAME}}                 # kebab-case identifier (e.g., telemetry-ingest)
name: "{{Human-readable title}}"        # displayed in reports (e.g., "Telemetry ingest quality")
applies_to:                              # target types the rubric scores
  - {{target-type-1}}                    # e.g., tsx, figma-frame, design-file, skill-md
  - {{target-type-2}}
severity_defaults:
  default: {{p1 | p2 | p3}}              # fallback severity when a criterion doesn't specify
source:                                  # citation(s) — where the rules come from
  - "{{upstream reference OR team document OR pilot lesson}}"
---

# {{Human-readable title}}

{{One-paragraph summary. What the rubric checks. What pain it prevents. What it does NOT check — defer to other rubrics.}}

## Scope & Grounding

{{One sentence grounding the rubric in its source material — cite the upstream standard / pilot lesson / team document that informs it. If the source is thin, say so — better honest than padded.}}

### Personas

{{2–4 personas whose work or experience this rubric protects. Each has role + one pain point the rubric addresses. Traceable to source material — no speculative personas.}}

- **{{Persona name}}** — {{one-sentence role}}. Pain: {{explicit pain point this rubric addresses}}.
- **{{Persona name}}** — {{role}}. Pain: {{pain point}}.
- **{{Persona name}}** — {{role}}. Pain: {{pain point}}.

### User stories

{{3–5 stories in "As a <persona>, I need <behavior> so that <outcome>" shape. Each story maps at least one persona to at least one criterion below.}}

- As a **{{persona}}**, I need **{{behavior}}** so that **{{outcome}}**.
- As a **{{persona}}**, I need **{{behavior}}** so that **{{outcome}}**.
- As a **{{persona}}**, I need **{{behavior}}** so that **{{outcome}}**.

### Realistic scenarios

{{3–5 grounded situations where this rubric applies. Name real surfaces; tie each to source material via a one-sentence "why it matters". A scenario that matches any well-built product is too generic — ground it.}}

- **{{Scenario name}}** — {{one-sentence description}}. Why it matters: {{tie to source material or team pain}}.
- **{{Scenario name}}** — {{description}}. Why it matters: {{tie}}.
- **{{Scenario name}}** — {{description}}. Why it matters: {{tie}}.

### Anti-scenarios (common failure modes)

{{3–5 failure modes — the shapes the rubric's concern takes when it goes wrong. Each has an observable symptom the rubric-applier can pattern-match. Prefer observables ("page visibly jumps") over abstractions ("bad UX").}}

- **{{Failure mode}}** — {{description}}. Symptom: {{observable — what you can SEE or grep for}}.
- **{{Failure mode}}** — {{description}}. Symptom: {{observable}}.
- **{{Failure mode}}** — {{description}}. Symptom: {{observable}}.

## What this rubric covers (and does not)

{{Scope disambiguation. Explicit about what this rubric catches vs. what other rubrics catch. Prevents over-triggering.}}

**Covered:** {{concrete list of what the rubric scores}}.

**Not covered (defer to other rubrics):**
- {{Concern}} → defer to `{{other-rubric-name}}`
- {{Concern}} → defer to `{{other-rubric-name}}`

## Criteria

{{One section per check. Shape: `### criterion-name` + Check / Default severity / Example pass / Example fail. Use imperative Check phrasing. Provide one concrete pass and one concrete fail example per criterion so the rubric-applier has anchors for severity calibration.}}

### {{criterion-name}}

**Check:** {{imperative one-sentence check — "Does X hold?" shape}}
**Default severity:** {{p1 | p2 | p3}}

**Example pass:**
> {{concrete example of content that passes this criterion — small enough to read at a glance}}

**Example fail:**
> {{concrete example of content that fails — observable symptom}}

### {{criterion-name}}

**Check:** {{...}}
**Default severity:** {{p1 | p2 | p3}}

**Example pass:**
> {{...}}

**Example fail:**
> {{...}}

### {{criterion-name}}

**Check:** {{...}}
**Default severity:** {{p1 | p2 | p3}}

**Example pass:**
> {{...}}

**Example fail:**
> {{...}}

## How to apply this rubric

### During full review

{{How the rubric slots into `/hd:review audit`. Which layer's auditor invokes it (usually L4 rubric-recommender surfaces, then rubric-applier walks criteria). Severity rollup → P1 / P2 / P3 buckets in the report.}}

### During targeted review

```
/hd:review critique <path-or-url> --rubric {{rubric-name}}
```

{{Produces inline structured findings per `references/targeted-review-format.md`. Severity overrides from `hd-config.md:targeted_review_rubrics` apply.}}

## Extending this rubric

Copy to `docs/rubrics/{{rubric-name}}.md` in your repo and:

1. Adjust severity defaults to match your team's tolerance.
2. Add team-specific criteria (e.g., "every X must cite a Y").
3. Reference in `hd-config.md` under `targeted_review_rubrics`.
4. When customizing, keep `source:` pointing at the original and append your team's citation (e.g., `source: starter-{{rubric-name}} + <team>-customizations`).

## See also

- [rubric-authoring-guide.md](../../references/rubric-authoring-guide.md) — full guide to the 4-block Scope & Grounding schema
- [rubric-application.md](../../references/rubric-application.md) — how `rubric-applier` walks criteria
- [targeted-review-format.md](../../references/targeted-review-format.md) — output shape for rubric-backed reviews
- [review-criteria-l4-rubrics.md](../../references/review-criteria-l4-rubrics.md) — rubrics are Layer 4; full review treats them as first-class artifacts
```

## Technical Considerations

**Performance.** 3p.1 reuses Phase A data (no new agent dispatches). 3p.2 is narration-only (no new reads). 3p.3 is schema additions, no runtime cost. 3p.4/3p.5 are content. Zero performance impact.

**Schema compatibility.** Frontmatter additions to lesson / decision / review templates are **additive** — existing files without new fields continue to parse. Downstream agents that query new fields fall back to markdown-grep on legacy files. Schema version of hd-config.md unchanged.

**Host-agnostic.** Nothing requires new capabilities. Fill-path narration is markdown output regardless of host.

## Scope Boundaries (non-goals)

- **No hardcoded DESIGN.md / CONTRIBUTING.md / CODEOWNERS detection.** Generic `scattered_l1_signals` + root-level `.md` substance heuristic catches them without naming them.
- **No `design-md-compliance` (or equivalent) starter rubric** in this phase. Users who want to lint DESIGN.md against its upstream spec can author a rubric themselves using `rubric-template.md`. Phase 3p ships the template, not the content.
- **No auto-integration.** Plug-in never writes a pointer file or paste-organizes without the user explicitly choosing an option at L1 EXECUTE.
- **Don't retrofit all 16 existing lessons to the richer frontmatter.** Migrate 2–3 recent ones as examples (Unit 3p.3); leave historical lessons in their original shape. History is sacred.
- **Don't change `/hd:review` output format** to reuse setup's rollup. 3p.1 borrows ASCII-bar rendering patterns but produces a setup-specific, more compact artifact.

## Deferred to Implementation

- **Exact "root-level substantive .md" threshold** for Unit 3p.2. Strawman: any root `.md` with ≥30 non-blank lines that isn't already in `root_l1_files` → include in L1 EXECUTE offer. Tune during build based on what actually surfaces across the 4 test repos.
- **Lesson template location.** Unit 3p.3 could live at `skills/hd-maintain/assets/lesson.md.template` OR at `docs/knowledge/lessons/_template.md`. Prefer the skills/ location for consistency with our other `.template` files.
- **Backfill schedule for decision ADR structured fields.** Unit 3p.3 adds the schema; migrating the two existing decisions (advisor-not-installer, rubric-policy) can happen inline or as a follow-up.

## Acceptance Criteria

- [ ] **3p.1:** `/hd:setup` on plug-in's own repo ends with a 5-layer ASCII health bar block + top-3 priorities table. Phase A data sourced, no new agent dispatches.
- [ ] **3p.2:** On a repo with detected `scattered_l1_signals` hits, L1 EXECUTE narration lists the detected files + 4-option integration prompt. On a greenfield repo, narration skips the prepended block. Zero hardcoded filenames.
- [ ] **3p.3:** `skills/hd-maintain/assets/lesson.md.template` exists with richer frontmatter schema. At least 2 recent lessons migrated as examples. `lesson-retriever` agent spec updated to read new fields.
- [ ] **3p.4:** `docs/knowledge/lessons/2026-04-21-detect-inspect-integrate.md` exists with `rule_candidate: true`. Cites advisor-not-installer + whitelist-vs-research-time lessons.
- [ ] **3p.5:** `skills/hd-review/assets/starter-rubrics/rubric-template.md` exists. `rubric-authoring-guide.md` links to it. Template lints (valid YAML, valid markdown).
- [ ] **Budgets:** `hd-setup/SKILL.md` ≤200 lines; all agent descriptions ≤180 chars; 0 skill violations; 0 agent violations.
- [ ] **No regression:** `detect.py` on 4 test repos (Lightning, cornerstone, caricature, Oracle Chat) produces the same `scattered_l1_signals` / `root_l1_files` / `raw_signals` output as post-3o.

## Success Metrics

- **Qualitative:** re-run `/hd:setup` on the plug-in's own repo. Observe: (1) setup health bars at Step 10.5; (2) at L1 EXECUTE, README.md + `*.local.md` surfaced as integration candidates with clear options; (3) lesson captured via new template has richer frontmatter than pre-3p lessons.
- **Quantitative:**
  - Net lines added ≤300 across plan units (excluding the lesson + rubric-template which are content)
  - Budgets preserved (no skill creeps over 200 lines)
  - 0 new rule entries in `AGENTS.md` (the candidate rule in 3p.4 stays as candidate; doesn't graduate until second confirmation)

## Dependencies & Risks

**Dependencies:** Phase 3o schema v5 output + existing `scattered_l1_signals` / `root_l1_files` fields (3o.5d shipped). No external tool deps.

**Risks:**
- **Risk:** 3p.2's generic ≥30-line `.md` threshold might over-trigger on irrelevant root markdown (e.g., boilerplate CHANGELOG.md, LICENSE-adjacent notes). **Mitigation:** narration clearly labels as "found, consider incorporating" — user picks ignore if irrelevant. Tune threshold during build if over-triggers dominate.
- **Risk:** Richer lesson frontmatter may feel heavy for users authoring inline. **Mitigation:** `lesson.md.template` includes only the required fields as non-placeholder; optional fields are placeholder-commented (agents can leave them null).
- **Risk:** Setup health bars duplicate effort with `/hd:review audit`'s output. **Mitigation:** Step 10.5 is compact (5 bars + 3 priorities); full-review report is comprehensive (findings + cross-layer + staleness + proposed-revision). Different artifacts for different moments.

## Sources & References

### Origin
- **Conversation 2026-04-21 (post-v1.2.0 ship):** user reflection on external format trends (DESIGN.md) + hardcoded-filename-is-anti-pattern reframe. Explicit principle stated: *"detect universally; route integration through user decision; reinforce our 5-layer standard as the coordinating frame."*
- **Setup disclosure gap** observation: `/hd:setup` ends without a health assessment, though Phase A already computes one.

### Internal references
- [`docs/plans/2026-04-21-002-feat-phase-3o-universal-tool-discovery-plan.md`](2026-04-21-002-feat-phase-3o-universal-tool-discovery-plan.md) — whitelist-vs-research-time pattern 3p extends
- [`docs/knowledge/lessons/2026-04-21-whitelist-vs-research-time.md`](../knowledge/lessons/2026-04-21-whitelist-vs-research-time.md) — architectural precedent
- [`AGENTS.md § Rules` 2026-04-21](../../AGENTS.md#rules) — advisor-not-installer rule 3p reinforces
- [`skills/hd-setup/scripts/detect.py`](../../skills/hd-setup/scripts/detect.py) — `scattered_l1_signals` emitter (3l.3 + 3o.5d)
- [`skills/hd-setup/references/layer-1-context.md`](../../skills/hd-setup/references/layer-1-context.md) — L1 EXECUTE narration edit target (3p.2)
- [`skills/hd-review/assets/review-report.md.template`](../../skills/hd-review/assets/review-report.md.template) — health-bar rendering reference for 3p.1
- [`skills/hd-review/references/rubric-authoring-guide.md`](../../skills/hd-review/references/rubric-authoring-guide.md) — guide 3p.5 template companions

### External references
- [google-labs-code/design.md](https://github.com/google-labs-code/design.md) — emerging DESIGN.md spec; trigger for this phase's reflection. We do NOT privilege this format; we build generic detection that happens to catch it.
