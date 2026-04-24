---
title: "feat: Phase 3q — rubric YAML split (skill-quality.md POC)"
type: feat
status: completed
date: 2026-04-21
phase: 3q
origin_ideation: docs/knowledge/ideations.md § "Rubric YAML split" (2026-04-21)
---

# feat: Phase 3q — rubric YAML split

## Overview

`docs/rubrics/skill-quality.md` is our most machine-consumed rubric — `review:skill-quality-auditor` reads it to audit every SKILL.md. The rubric today mixes structured YAML-shape data (criterion rows + severity) with prose (rationale + pass/fail examples) in 9 markdown sections. The auditor parses markdown tables with regex.

**The fragility:** any prose refactor that shifts table placement silently breaks the audit. We already hit this once — the 3l.7 vocab-unification sed mangled 16 tokens in skill-quality.md before the 2026-04-21 dogfood caught it.

**The shift:** move criteria into YAML frontmatter; keep prose rationale + pass/fail in the body. Agent queries frontmatter deterministically — no markdown-parse fragility. Adding a criterion becomes a YAML edit, not prose-table surgery in the right section.

Phase 3q migrates `skill-quality.md` as proof of concept. Propagation to `ux-writing` + `heuristic-evaluation` is deferred to Phase 3r if the pattern holds.

## Problem Statement / Motivation

**Concrete fragility:** `skill-quality-auditor` parses `docs/rubrics/skill-quality.md` sections 1–9, extracting criterion rows from markdown tables. The regex matches `| <criterion> | <severity> |` in specific table positions per section. Two failure modes:

1. **Prose refactor that moves tables.** A well-meaning edit (e.g., reordering a paragraph) can push the table past the regex's look-behind anchor. Audit silently runs against fewer criteria.
2. **Sed-style bulk edit.** The 3l.7 pass inserted spaces and broken identifiers inside table cells. Result: criteria still "present" by line count but semantically corrupted.

Both are observable today. Neither is prevented by any structural guarantee.

**Why now:** this was the one captured ideation today WITHOUT a timing gate (the other three — spec-as-SSOT, scripted release, test fixtures — all wait for a triggering event). Rubric-YAML-split pays off independently. Exercises the "agent-authored, agent-consumed" design discipline that is the core value prop.

**Why skill-quality.md first:** it's the most-consumed rubric (the only one with a dedicated agent — `skill-quality-auditor`) so the payoff is concentrated. `ux-writing` and `heuristic-evaluation` are consumed by the generic `rubric-applier`; migrating them is mechanical once the pattern proves out.

## Proposed Solution

**Split rubric content into two layers:**

- **Frontmatter (YAML):** all criteria with `id`, `severity`, `check` (imperative one-liner). Structured; machine-queryable; immune to prose refactors.
- **Body (prose):** rationale per section, pass/fail examples, Scope & Grounding block, coexistence notes. Human-authored narrative; layout can change freely without affecting the audit.

**Pattern carried over from DESIGN.md's discipline:** YAML = normative; prose = descriptive. Each has a distinct role.

### Target shape (skill-quality.md)

```yaml
---
rubric: skill-quality
name: "Skill quality (Layer 2 health check)"
applies_to: [skill-md, skill-dir]
version: 1                            # schema version for this rubric's YAML shape
severity_defaults:
  default: p2
source:
  - "Anthropic skill best practices + Bill's 9-section checklist"

sections:
  skill-definition:
    order: 1
    title: "Skill definition"
    criteria:
      - id: names-one-job
        severity: p1
        check: "Description names the skill's one job"
      - id: lists-trigger
        severity: p2
        check: "Description lists at least one concrete trigger scenario or keyword"
      - id: avoids-vague-verbs
        severity: p2
        check: "Description avoids vague verbs ('help with tasks', 'process data', 'handle things')"
      - id: third-person-voice
        severity: p3
        check: "Third-person voice — no 'I', no 'you'"
      - id: specific-enough
        severity: p2
        check: "Specific enough to stand out from other skills in the same repo"
  scope:
    order: 2
    title: "Scope"
    criteria:
      - id: one-job-statement-present
        severity: p1
        check: "One job statement present at top of SKILL.md body"
      # ...
  # Sections 3-9 follow same shape
---

# Skill quality

[Intro + what this rubric checks + what it does NOT check]

## Scope & Grounding

[Personas / User stories / Realistic scenarios / Anti-scenarios — unchanged from current shape]

## 1. Skill definition (rationale)

[Prose explaining WHY these checks exist — the pain they prevent, examples of good/bad]

**Pass example:**
> Answers questions about the five-layer design harness framework.

**Fail example:**
> Helps you with design-harness stuff.

## 2. Scope (rationale)

[...]
```

**Invariant:** the same criteria exist in YAML as previously lived in the prose tables. The rationale + examples live in the body. An auditor reading the YAML gets the normative list; a human reading the body gets the story.

## Technical Considerations

**Agent refactor.** `review:skill-quality-auditor` today reads sections 1–9, extracts criterion tables, iterates. Post-migration: read frontmatter, iterate `sections.<name>.criteria[]`. Simpler + deterministic.

**Schema version.** Introduce `version: 1` at rubric level. When the rubric's YAML shape changes (new fields added), bump this. Cache consumers can invalidate based on version.

**Backward compatibility.** `ux-writing.md` + `heuristic-evaluation.md` stay in their current prose-table shape for Phase 3q. `rubric-applier` agent needs to handle BOTH shapes until Phase 3r migrates those too:
- If frontmatter has `sections.*.criteria[]` → use YAML path (deterministic)
- Else → fall back to markdown-table regex (legacy path)

Document this fallback explicitly in `rubric-applier` spec.

**Template update.** `skills/hd-review/assets/starter-rubrics/rubric-template.md` (shipped 3p.5) needs to match the new YAML-criteria shape. Users/agents authoring new rubrics adopt the new pattern by default.

**Non-goals** (see Scope Boundaries below):
- Migrating ux-writing + heuristic-evaluation (Phase 3r)
- Designing a rubric-validator CLI (future phase)
- Schema formalization for the rubric YAML (keep loose for now; lock in Phase 3r)

## System-Wide Impact

- **Interaction graph:** `/hd:review audit` dispatches `skill-quality-auditor` via Task → auditor reads rubric → returns findings. Only touches the auditor's parse logic.
- **Error propagation:** if rubric YAML malformed (invalid yaml, missing `sections`), auditor emits `error: rubric-invalid` + skips. Non-fatal; the layer L2 audit reports the error as a P1 meta-finding.
- **State lifecycle:** rubric file is read-only at audit time. No cache.
- **API surface parity:** skill-quality-auditor is the only consumer of skill-quality.md today. No other agent needs updating.
- **Integration test scenarios:**
  1. Run `skill-quality-auditor` against `skills/hd-setup/SKILL.md` pre-migration; capture findings.
  2. Run same audit post-migration. Findings MUST match on count + severity + criterion id per finding.
  3. Delete a YAML criterion mid-migration and verify auditor correctly drops the corresponding check (not silent-pass).
  4. Introduce a malformed YAML mid-migration and verify auditor emits rubric-invalid error gracefully.

## Implementation Units

### Unit 3q.1 — Design the rubric-YAML schema

**Goal.** Lock the YAML shape for sections + criteria before any migration. Single source of truth going forward.

**Files.** New schema doc at `skills/hd-review/references/rubric-yaml-schema.md`.

**Approach.**
- Document required fields: `rubric`, `name`, `applies_to[]`, `version`, `severity_defaults.default`, `source[]`, `sections`.
- Document `sections.<slug>` shape: `order`, `title`, `criteria[]`.
- Document `criteria[]` item shape: `id` (kebab-case unique within section), `severity` (p1|p2|p3), `check` (imperative one-liner).
- Document `version: 1` semantics + when to bump.
- Document backward-compat expectation: rubrics without frontmatter `sections` fall back to markdown-table parsing (Phase 3q only).

**Patterns to follow.** Existing `hd-config-schema.md` structure for schema docs.

**Verification.** Schema doc lints (valid markdown); section headings follow convention; cross-references to rubric-authoring-guide work.

---

### Unit 3q.2 — Migrate `skill-quality.md` (both copies)

**Goal.** Mechanical content translation — YAML criteria in frontmatter, prose rationale in body.

**Files.**
- `docs/rubrics/skill-quality.md` (dogfood adopted copy)
- `skills/hd-review/assets/starter-rubrics/skill-quality.md` (starter ship copy)

**Approach.**
1. Extract all 9 section criterion tables into structured YAML under `sections.<slug>.criteria[]`.
2. Assign stable kebab-case `id` per criterion (e.g., `names-one-job`, `lists-trigger`).
3. Preserve severity assignments exactly.
4. Rewrite body: each section becomes "rationale + pass/fail examples" only — no criterion table.
5. Keep Scope & Grounding block unchanged.
6. Diff both copies — they should stay identical.

**Patterns to follow.** Current `skill-quality.md` shape for prose sections. Target YAML shape per Unit 3q.1 schema doc.

**Verification.** Criterion count matches exactly pre/post (grep `| p1 |` count in old; YAML `severity: p1` count in new). No semantic drift. Both copies diff clean.

---

### Unit 3q.3 — Update `skill-quality-auditor` to read YAML

**Goal.** Auditor queries frontmatter `sections.*.criteria[]` instead of parsing markdown tables.

**Files.** `agents/review/skill-quality-auditor.md`.

**Approach.**
- Update "Load the rubric" step: read frontmatter `sections` map.
- For each section, iterate `criteria[]`.
- Pass per-criterion `id` through to findings output (enables cross-review traceability).
- Remove markdown-table parsing code path (clean cut — no fallback needed since this auditor only reads skill-quality.md, which IS migrated).

**Patterns to follow.** Existing auditor "Phase 1: load criteria reference" pattern.

**Verification.** Manual test: run auditor against `skills/hd-setup/SKILL.md` pre/post migration. Findings match: same count, same severities, same criteria cited. Any drift indicates bug.

---

### Unit 3q.4 — Update `rubric-template.md` + authoring guide

**Goal.** Future rubric authors ship in the new shape by default.

**Files.**
- `skills/hd-review/assets/starter-rubrics/rubric-template.md` (update placeholders to include `sections.*.criteria[]` YAML)
- `skills/hd-review/references/rubric-authoring-guide.md` (update guide text + cite the new schema doc)

**Approach.**
- Template gains a `sections: {{...}}` placeholder in frontmatter with one filled-in example section showing the criterion shape.
- Body of template shows the "rationale + pass/fail examples (no criterion tables)" pattern.
- Guide explains: "criteria live in frontmatter; rationale lives in body; do not duplicate."

**Patterns to follow.** Existing `rubric-template.md` shape (shipped 3p.5).

**Verification.** Template lints; authoring guide links to rubric-yaml-schema.md; example frontmatter in template is valid YAML.

---

### Unit 3q.5 — Update `rubric-applier` to handle both shapes (backward compat)

**Goal.** During the transition window (Phase 3q only ships skill-quality migration; 3r will migrate the other 2 rubrics), `rubric-applier` must handle both shapes.

**Files.** `agents/review/rubric-applier.md`.

**Approach.**
- At rubric-load time, check for frontmatter `sections` key.
- If present → use YAML path (deterministic, same as skill-quality-auditor).
- If absent → fall back to existing markdown-table parsing (legacy path for ux-writing + heuristic-evaluation until Phase 3r).
- Document the fallback explicitly. Emit a `schema_version: legacy` flag in the output so callers know which path ran.

**Patterns to follow.** Defensive-parsing patterns in existing agent specs.

**Verification.** Dispatch rubric-applier against skill-quality.md (migrated) → YAML path. Against ux-writing.md (unmigrated) → legacy path. Against a malformed rubric → graceful error.

---

### Unit 3q.6 — Capture 3q architectural lesson

**Goal.** Preserve the pattern + rationale before it fades. Sets up for Phase 3r propagation.

**Files.** `docs/knowledge/lessons/2026-04-21-rubric-yaml-prose-split.md` (new).

**Content outline:**
- Context: `skill-quality.md` was the most-consumed rubric with a hidden prose-layout dependency; 3l.7 sed incident already caused one silent-damage event.
- Decision: split YAML-normative (criteria) from prose-descriptive (rationale + examples).
- Pattern: DESIGN.md-style dual-layer, applied to our own rubrics.
- Result: auditor becomes deterministic; criterion diffs now visible in git; cross-rubric aggregation via grep.
- **Candidate rule:** *"When a machine-consumed artifact has structured data (criteria, rules, thresholds) mixed with rationale, separate the two layers: normative YAML in frontmatter, descriptive prose in body. Agents query frontmatter; humans read body; neither couples to the other's layout."*

Not a rule-candidate yet (1 confirmation; parks until a second migration confirms the pattern holds).

**Verification.** Lesson file parses (3p.3 enriched frontmatter schema); lesson-retriever surfaces it on "rubric" / "architecture" queries.

---

## Scope Boundaries (non-goals)

- **Do not migrate `ux-writing` or `heuristic-evaluation`** in Phase 3q. They stay in legacy prose-table shape. Phase 3r migrates them once skill-quality proves the pattern.
- **Do not lock the rubric YAML schema formally.** Keep the shape flexible during migration. Phase 3r (or later) can formalize + version the schema.
- **Do not author a rubric-validator CLI.** Out of phase — could be a future ideation if hand-validation becomes painful.
- **Do not extend auditor behavior** beyond the YAML-vs-markdown parsing swap. New audit capabilities belong in separate phases.
- **Do not touch the other 11 starter rubrics** (the unadopted ones). They ship as reference material; migration when each is adopted by a user.

## Deferred to Implementation

- **Exact `id` naming** for criteria. Strawman: kebab-case, unique within section, reads as "what the criterion checks" (e.g., `names-one-job`, `avoids-vague-verbs`). Finalize during Unit 3q.2.
- **Should `title:` be required or optional** in `sections.<slug>`? Default stance: required (agents render it in reports). Finalize during Unit 3q.1.
- **Rubric-applier's legacy fallback shape.** Keep the existing markdown-table regex exactly or refactor? Strawman: keep exactly for minimum-risk. Finalize during Unit 3q.5.

## Acceptance Criteria

- [ ] **3q.1:** `skills/hd-review/references/rubric-yaml-schema.md` exists with required-fields table + `sections.<slug>.criteria[]` shape documented
- [ ] **3q.2:** Both copies of `skill-quality.md` (docs/rubrics/ + starter-rubrics/) migrated to YAML-criteria shape; criterion count matches pre-migration; both copies diff clean
- [ ] **3q.3:** `skill-quality-auditor` reads YAML; produces same findings (count + severity + criterion id) as pre-migration run against `hd-setup/SKILL.md`
- [ ] **3q.4:** `rubric-template.md` + `rubric-authoring-guide.md` updated to show new YAML-criteria pattern; both lint clean
- [ ] **3q.5:** `rubric-applier` handles both YAML-criteria shape AND legacy markdown-table shape; emits `schema_version: legacy` flag for backward-compat invocations
- [ ] **3q.6:** Lesson captured at `docs/knowledge/lessons/2026-04-21-rubric-yaml-prose-split.md` with 3p.3 enriched frontmatter
- [ ] **Regression:** `/hd:review audit` on the plug-in's own repo produces same total finding count pre/post migration (no silent loss of criteria coverage)
- [ ] **Budgets:** `skills/hd-review/SKILL.md` stays ≤200 lines; 0 new skill/agent violations

## Success Metrics

- **Qualitative:** `skill-quality-auditor` becomes deterministic — its parse logic no longer has hidden dependency on markdown layout. Adding a new criterion to skill-quality is a YAML edit; users can do this via `/hd:maintain` extend flow or directly.
- **Quantitative:**
  - YAML `sections.*.criteria[]` entries = prose-table rows pre-migration (exact match)
  - Auditor findings diff = 0 (same count, severity, citation) between pre/post
  - `rubric-applier` handles both shapes without error on any of the 14 starter rubrics

## Dependencies & Risks

**Dependencies:** None external. All work is internal refactor of shipped files.

**Risks:**
- **Risk:** Migration drops a criterion silently. **Mitigation:** Unit 3q.2 requires exact count match. Unit 3q.3 requires exact findings match. Both are acceptance criteria.
- **Risk:** Auditor bug during YAML-parse refactor breaks audits. **Mitigation:** Unit 3q.3 tests against a known SKILL.md; diff findings pre/post.
- **Risk:** `rubric-applier` backward-compat path breaks for ux-writing or heuristic-evaluation. **Mitigation:** Unit 3q.5 tests on all 14 starter rubrics.
- **Risk:** Authors find the YAML-plus-prose shape heavier than pure prose. **Mitigation:** Template already splits visually; the added structure IS the value for downstream agents. Document in authoring guide.

## Sources & References

### Origin
- **Captured ideation:** [`docs/knowledge/ideations.md` § "Rubric YAML split"](../knowledge/ideations.md) (2026-04-21)
- **DESIGN.md conversation (2026-04-21):** architectural discipline inspired this pattern
- **Specific precedent:** 3l.7 vocab-unification sed mangled `skill-quality.md` (caught by 2026-04-21 dogfood); pure-prose rubrics ARE silently refactor-fragile

### Internal references
- Current rubric: [`docs/rubrics/skill-quality.md`](../../docs/rubrics/skill-quality.md)
- Starter copy: [`skills/hd-review/assets/starter-rubrics/skill-quality.md`](../../skills/hd-review/assets/starter-rubrics/skill-quality.md)
- Auditor agent: [`agents/review/skill-quality-auditor.md`](../../agents/review/skill-quality-auditor.md)
- Generic applier: [`agents/review/rubric-applier.md`](../../agents/review/rubric-applier.md)
- Template: [`skills/hd-review/assets/starter-rubrics/rubric-template.md`](../../skills/hd-review/assets/starter-rubrics/rubric-template.md)
- Authoring guide: [`skills/hd-review/references/rubric-authoring-guide.md`](../../skills/hd-review/references/rubric-authoring-guide.md)

### Related lessons + rules
- `docs/knowledge/lessons/2026-04-21-sed-vocabulary-rename-mishap.md` — the precedent showing prose-layout fragility bites us
- `AGENTS.md § Rules` `R_2026_04_21_detection_enumeration` — same pattern applied to detection/classification earlier today

### Deferred (not in this phase)
- Phase 3r: migrate `ux-writing.md` + `heuristic-evaluation.md` once 3q proves the pattern
- Future phase: formalize rubric-YAML schema version bumping policy
