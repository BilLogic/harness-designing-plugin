---
rubric: lesson-quality
name: "Lesson quality (docs/knowledge/lessons/ corpus)"
applies_to:
  - lesson-md
version: 1
severity_defaults:
  default: p2
source:
  - "/hd:maintain capture flow + 3p.3 enriched lesson frontmatter schema (skills/hd-maintain/assets/lesson.md.template)"
  - "Phase 3p.3 lessons-as-machine-extractable principle"
  - "Phase 3r post-graduation drift incident (3 lessons whose rules graduated still flagged rule_candidate: true)"

sections:
  frontmatter:
    order: 1
    title: "Frontmatter conformance (3p.3 enriched schema)"
    criteria:
      - id: title-and-date-present
        severity: p1
        check: "Frontmatter has `title` (descriptive sentence) and `date` (ISO YYYY-MM-DD)"
      - id: memory-type-and-importance
        severity: p2
        check: "Frontmatter has `memory_type: episodic` and `importance` (1–5 int)"
      - id: tags-non-empty
        severity: p2
        check: "Frontmatter has `tags: [...]` with ≥2 tags from controlled vocabulary (architecture, detection, refactor, live-testing, …) — enables retrieval by lesson-retriever"
      - id: machine-extractable-block-present
        severity: p1
        check: "Frontmatter has the 3p.3 machine-extractable block: `applies_to_layers[]`, `related_rules[]`, `related_lessons[]`, `decision_summary`, `result_summary`, `next_watch`, `rule_candidate`, `rule_ref`, `supersedes`, `superseded_by`"
      - id: decision-summary-non-empty
        severity: p1
        check: "`decision_summary` is a single complete sentence (or short paragraph) capturing the chosen pattern; not blank or placeholder"
      - id: result-summary-non-empty
        severity: p2
        check: "`result_summary` names what was shipped or observed as a consequence of the decision; not blank"
      - id: next-watch-non-empty
        severity: p2
        check: "`next_watch` names the trigger / signal to look for that would either confirm or revise this lesson; not blank"

  graduation-state:
    order: 2
    title: "Graduation state (truth + cross-refs)"
    criteria:
      - id: rule-candidate-reflects-current-state
        severity: p1
        check: "If `rule_candidate: true`, the rule has NOT yet graduated. If the linked rule HAS graduated (cited in AGENTS.md § Rules), `rule_candidate: false` and `rule_ref` populated. No drift between flag and reality."
      - id: rule-ref-resolves
        severity: p1
        check: "When `rule_ref` is non-null, it matches a real `rule_id` in AGENTS.md § Rules (e.g., `R_2026_04_24_rubric_yaml_split`)"
      - id: related-rules-resolve
        severity: p2
        check: "Each entry in `related_rules[]` matches a real `rule_id` in AGENTS.md (no orphan refs)"
      - id: related-lessons-resolve
        severity: p2
        check: "Each entry in `related_lessons[]` matches a real lesson filename slug in `docs/knowledge/lessons/` (no broken cross-refs)"
      - id: supersedes-chain-valid
        severity: p2
        check: "If `supersedes` non-null, it points at a real lesson file AND that lesson has `superseded_by` matching this lesson's slug (bidirectional integrity)"

  body:
    order: 3
    title: "Body shape"
    criteria:
      - id: context-section-present
        severity: p1
        check: "`## Context` section opens the body — names the trigger event, the prior state, and what surfaced the lesson"
      - id: decision-or-observation-present
        severity: p1
        check: "`## Decision` (or `## Decision / Observation`) section names the chosen pattern explicitly — usually mirroring + expanding `decision_summary`"
      - id: result-section-present
        severity: p2
        check: "`## Result` section names what shipped (commits / phases / files) as a consequence"
      - id: graduation-readiness-when-candidate
        severity: p2
        check: "When `rule_candidate: true`, body includes `## Graduation-readiness` section listing confirmation count + threshold for graduation"
      - id: prevention-or-next-section
        severity: p3
        check: "Body includes a `## Prevention pattern going forward` OR `## Next` section with concrete watch-points or triggers"

  scope-and-discipline:
    order: 4
    title: "Scope + discipline"
    criteria:
      - id: not-padded
        severity: p2
        check: "Lesson body length is proportionate to substance — does not duplicate `decision_summary` + `result_summary` + `next_watch` already in frontmatter at length in body"
      - id: cites-evidence
        severity: p2
        check: "Body cites concrete evidence (file:line, commit hash, phase/plan reference, dated event) — not just abstract claims"
      - id: identifies-anti-pattern-explicitly
        severity: p3
        check: "If the lesson rejects an anti-pattern, the anti-pattern is named explicitly (so it surfaces in lesson-retriever queries against future incidents of the same shape)"
---

# Lesson quality

Score `docs/knowledge/lessons/YYYY-MM-DD-<slug>.md` files. Lessons are the L5 substrate that compounds episodic experience into team rules. Quality here directly affects whether `lesson-retriever` surfaces the right lesson on a future query, and whether `rule-candidate-scorer` can graduate confirmed patterns deterministically.

**Dogfood scope:** the 18 lessons in this plug-in's `docs/knowledge/lessons/`. Catches both schema drift (mixed-shape corpus from pre-3p.3) and graduation-state drift (lessons whose rule has graduated but flag wasn't reset — this happened in Phase 3r and triggered authoring this rubric).

## Scope & Grounding

Grounded in:
- `/hd:maintain capture` flow (the procedure that creates lessons)
- `skills/hd-maintain/assets/lesson.md.template` (the canonical shape, 3p.3 enriched frontmatter)
- The Phase 3r post-graduation drift incident: 3 lessons whose rule had already graduated still carried `rule_candidate: true`. Caught only by manual L5 audit. This rubric prevents that class.

### Personas
- **Lesson author** — running `/hd:maintain capture` after a notable event or insight. Pain: forgets one of the 10 frontmatter fields; lesson lands with partial machine-extractable data.
- **lesson-retriever agent** — searches the corpus on `/hd:review audit` or `/ce:plan` queries. Pain: weak `tags` or empty `decision_summary` makes the lesson invisible to relevance scoring.
- **rule-candidate-scorer agent** — counts confirmations toward graduation. Pain: stale `rule_candidate: true` on already-graduated lessons inflates candidate count incorrectly.
- **Future archaeologist** — reads a lesson 6 months later. Pain: no `## Result` section means the lesson tells the *what-we-thought* but not *what-actually-happened*.
- **Reviewer of an audit report** — sees a lesson surfaced as relevant context. Pain: padded body that duplicates the frontmatter; signal-to-noise ratio is poor.

### User stories
- As a **lesson author**, I need **the 3p.3 frontmatter schema enforced** so that **machine-extractable fields aren't optional**.
- As **lesson-retriever**, I need **populated `tags` + `decision_summary`** so that **I rank lessons by relevance, not by file recency**.
- As **rule-candidate-scorer**, I need **`rule_candidate` flag to track ground truth** so that **graduation counts are deterministic**.
- As an **archaeologist**, I need **`## Context` + `## Decision` + `## Result`** so that **the lesson tells the full arc**.
- As a **reader**, I need **bodies that don't duplicate frontmatter** so that **I'm not reading the same insight twice**.

### Realistic scenarios
- **Phase 3q rubric YAML split lesson** — `2026-04-21-rubric-yaml-prose-split.md`. Full 3p.3 frontmatter. `## Context` cites the 3l.7 sed incident concretely. `## Result` lists the 6 shipped units. `rule_candidate: false` post-graduation, `rule_ref: R_2026_04_24_rubric_yaml_split`. Why it matters: reference quality bar.
- **Phase 3p detect-inspect-integrate lesson** — same shape, includes anti-scenario "filename whitelist" enumerated. Why it matters: identifies-anti-pattern criterion grounded.
- **Phase 3l→3m iteration lesson** — `2026-04-20-iterative-refinement-3k-to-3m.md`. Currently `rule_candidate: true` legitimately (1st confirmation; awaiting 2nd). Why it matters: criterion `rule-candidate-reflects-current-state` PASSES here; this is the supposed-to-be-true case.

### Anti-scenarios (common failure modes)
- **Frontmatter has `decision_summary: ""`** — empty machine-extractable field. Symptom: lesson-retriever ranks it last on every query.
- **Body duplicates `decision_summary` + `result_summary` + `next_watch` in longform** — padded. Symptom: 100-line lesson where 30 carries the same signal as the frontmatter.
- **`rule_candidate: true` after the rule has graduated** — drift (the Phase 3r incident class). Symptom: rule-candidate-scorer counts already-graduated lessons in pending-graduation pool; signals confused.
- **`related_lessons:` cites a filename slug that doesn't exist** — broken cross-ref. Symptom: lesson-retriever follow-up queries return 404; archaeologist gets stuck.
- **`## Result` section absent** — lesson tells what-we-decided but not what-shipped. Symptom: archaeologist can't tell if the decision was actually executed or got revised before landing.

## Criteria — rationale + examples

Per-criterion prose. Normative criteria live in YAML frontmatter; this body explains *why* + concrete pass/fail.

### title-and-date-present

**Pass:** `title: "Split machine-consumed rubrics into normative YAML criteria + descriptive prose body"` + `date: 2026-04-21`.
**Fail:** missing date or title; corpus listing breaks.

### memory-type-and-importance

**Pass:** `memory_type: episodic` + `importance: 4` (canonical for Phase-relevant lessons).
**Fail:** `importance:` missing → defaults to 0 in retriever rankings.

### tags-non-empty

**Pass:** `tags: [architecture, rubrics, schema, agent-authored-agent-consumed, rule-candidate]` — 5 tags from established vocabulary.
**Fail:** `tags: []` or `tags: [misc]` — useless for retrieval.

### machine-extractable-block-present

**Pass:** all 10 fields (`applies_to_layers`, `related_rules`, `related_lessons`, `decision_summary`, `result_summary`, `next_watch`, `rule_candidate`, `rule_ref`, `supersedes`, `superseded_by`) present.
**Fail:** Phase-3p-2026-04-21 lessons that pre-date 3p.3 schema and never got migrated — partial conformance.

### decision-summary-non-empty

**Pass:** `decision_summary: "Rubric criteria belong in YAML frontmatter (machine-queryable); rationale + pass/fail belong in prose body."`
**Fail:** `decision_summary: ""` or placeholder text.

### result-summary-non-empty

**Pass:** `result_summary: "Phase 3q ships skill-quality.md as the reference implementation."`
**Fail:** blank — readers can't tell what shipped.

### next-watch-non-empty

**Pass:** `next_watch: "Second emerging format tempts us to whitelist → apply this pattern instead → graduate."`
**Fail:** blank — corpus loses the signal-to-watch.

### rule-candidate-reflects-current-state

**Pass:** `rule_candidate: false` + `rule_ref: R_2026_04_24_rubric_yaml_split` after graduation.
**Fail:** `rule_candidate: true` on a lesson whose rule has already graduated — Phase 3r incident class.

### rule-ref-resolves

**Pass:** `rule_ref: R_2026_04_24_rubric_yaml_split` matches AGENTS.md entry `[2026-04-24] rule_id: R_2026_04_24_rubric_yaml_split`.
**Fail:** `rule_ref: R_typo_here` — nothing resolves.

### related-rules-resolve

**Pass:** every entry in `related_rules:` is a real rule_id citable in AGENTS.md.
**Fail:** stale rule_id from before a rename.

### related-lessons-resolve

**Pass:** every entry is a real filename slug in `docs/knowledge/lessons/`.
**Fail:** typo in slug; cross-ref dead.

### supersedes-chain-valid

**Pass:** A lesson with `superseded_by: 2026-05-01-newer-version` AND the 2026-05-01 lesson has `supersedes: 2026-04-21-older-version`. Bidirectional.
**Fail:** unilateral pointer; chain breaks for archaeologist.

### context-section-present

**Pass:** `## Context` opens body — names trigger event + prior state.
**Fail:** body opens with `## Decision` directly; archaeologist has no setup.

### decision-or-observation-present

**Pass:** `## Decision / Observation` block names the chosen pattern (mirrors + expands frontmatter `decision_summary`).
**Fail:** body has only `## Context` + `## Result`; no explicit "and so we chose X."

### result-section-present

**Pass:** `## Result` names commits / phases / shipped artifacts.
**Fail:** missing — lesson reads as a thought-piece, not an event log.

### graduation-readiness-when-candidate

**Pass:** rule_candidate lessons include `## Graduation-readiness` with confirmation count + threshold. Removed once graduated.
**Fail:** rule_candidate lesson lacks this section; rule-candidate-scorer can't reason about distance-to-graduation.

### prevention-or-next-section

**Pass:** body closes with `## Prevention pattern going forward` OR `## Next` listing watch-points.
**Fail:** body just stops; reader has no signal about future relevance.

### not-padded

**Pass:** ~50–80-line body when frontmatter is rich; body adds context + concrete examples not in frontmatter.
**Fail:** 150-line body where 80 lines restate `decision_summary`, `result_summary`, `next_watch` in longer form.

### cites-evidence

**Pass:** "Caught only by 2026-04-21 dogfood (see `2026-04-21-sed-vocabulary-rename-mishap.md`)."
**Fail:** "We had a problem and fixed it" — abstract; lesson-retriever can't pattern-match to similar-shape future incidents.

### identifies-anti-pattern-explicitly

**Pass:** "**The anti-pattern:** detecting specific external formats by name + scaffolding special integration paths per format."
**Fail:** lesson celebrates the right pattern but doesn't name the wrong one; future incidents repeat the anti-pattern undetected.

## Extending this rubric

Copy to `docs/rubrics/lesson-quality-<team>.md` and:

1. Adjust per-criterion `severity` for your team's tolerance
2. Append team-specific criteria — e.g., "every lesson must link a Slack thread or GitHub issue"
3. Add additional frontmatter fields if your `lesson.md.template` evolves (extension is additive in YAML schema)

## What this rubric does NOT check

- Whether the lesson's underlying observation is correct (that's a team-judgment call, not a quality check)
- Whether the lesson should graduate (that's `rule-candidate-scorer` territory)
- Lesson tagging vocabulary consistency across the corpus (separate concern; see `lesson-retriever` agent's index logic)

## See also

- [`../../references/rubric-yaml-schema.md`](../../references/rubric-yaml-schema.md) — schema for the YAML frontmatter above
- [`../../../../skills/hd-maintain/assets/lesson.md.template`](../../../../skills/hd-maintain/assets/lesson.md.template) — canonical lesson shape
- [skill-quality.md](skill-quality.md) — sister rubric for Layer 2 skills
- [plan-quality.md](plan-quality.md) — sister rubric for `docs/plans/`
- [agent-spec-quality.md](agent-spec-quality.md) — sister rubric for `agents/<cat>/<name>.md`
