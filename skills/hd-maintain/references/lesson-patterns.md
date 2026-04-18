# Lesson patterns

**Purpose:** authoring discipline for Layer 5 entries. Loaded by `hd:maintain capture` when drafting a new entry.

## File organization — date-slug, one file per lesson event

Lessons live in `docs/knowledge/lessons/YYYY-MM-DD-<slug>.md` — **one file per lesson event**, not one file per domain. The `<slug>` is kebab-case, derived from the lesson's primary tag or a user-supplied short title. Examples from this plug-in's own corpus:

- `lessons/2026-04-16-no-future-version-stubs.md`
- `lessons/2026-04-17-pilot-figma-sds.md`
- `lessons/2026-04-18-parallel-pilots-3-6-consolidated.md`

**Tags (not filenames) are the organizing dimension.** Cross-domain retrieval happens via tag search; the `design-harnessing:research:lesson-retriever` sub-agent ranks on tag overlap + recency, not on directory structure.

### Why date-slug, not domain-grouped

Date-slug files are append-only in spirit: each file is frozen once captured. Domain-grouped files (`lessons/ds-compliance.md` with 15 entries) require editing existing files on every capture — more contention, more merge conflicts, worse git blame. Date-slug is also what every existing lesson in this plug-in already is.

A "domain-grouped" escape hatch may graduate later if per-domain volume gets heavy enough to warrant a separate index. **Not yet adopted.** Until then: one file per event.

### Per-file YAML frontmatter

Each lesson file begins with a single YAML block declaring its memory type:

```yaml
---
title: "Short title of the lesson"      # required; 3-10 words; descriptive
date: YYYY-MM-DD                        # required; ISO date of capture; must match filename prefix
tags: [tag-a, tag-b, tag-c]             # required; 1-5 tags; kebab-case
memory_type: episodic                   # episodic | procedural-chosen | semantic-taste | speculative | temporal
graduation_candidate: true | false      # required for episodic; ready to graduate soon?
graduated_to: null                      # optional; filled post-graduation w/ AGENTS.md entry ref
importance: 3                           # optional 1-5; used by lesson-retriever weighting
---
```

`title` is byte-stable (used in plan-hash computation at graduation time). Don't change it after capture.

`tags` drive graduation-candidate detection: when ≥ 3 lesson files share a tag, that tag becomes a graduation topic. Cross-referencing happens at tag-search time (via `lesson-retriever`), not by filename.

## Body structure (episodic)

Four sections, always in this order:

```markdown
# <Entry title>

**Context:** What was happening? 1-2 sentences.

**Decision / Observation:** What we did or noticed. 1-3 sentences.

**Result:** How it went. 1-3 sentences.

**Graduation-readiness:** Yes / No / too-early-to-tell. One sentence of rationale.
```

Total body: 5–10 sentences typical. Long entries are rare; most are a paragraph per section. Since each lesson lives in its own file, there is no in-file separator between entries.

## Non-episodic entries

Decisions / preferences / ideations / changelog use their own per-file formats, documented in each file's template:

- `docs/knowledge/decisions.md` — ADR-style (context / options / chosen / trade-offs / supersedes)
- `docs/knowledge/preferences.md` — bullet list (preference — rationale)
- `docs/knowledge/ideations.md` — prompt + options + current thinking + needed-to-decide
- `docs/knowledge/changelog.md` — changed / before / after / why

`/hd:maintain capture` classifies the entry to the right memory type at Step 1 and targets the right file.

## Good example

Filename: `docs/knowledge/lessons/2026-04-16-no-future-version-stubs.md`

```markdown
---
title: "Don't ship future-version skill stubs with disable-model-invocation"
date: 2026-04-16
tags: [skill-authoring, stubs, disable-model-invocation, anti-pattern]
memory_type: episodic
graduation_candidate: true
---

# Lesson

**Context:** Scaffolded v0.5 and v1 skills as stubs during v0.MVP build, with `disable-model-invocation: true` and fake trigger text for namespace reservation.

**Decision / Observation:** `/ce:review` surfaced the stubs as "worse than absent" across three independent reviewer agents — pattern-recognition flagged dangling links; code-simplicity flagged misleading trigger text; agent-native flagged the flag as foreclosing design space before real design decisions.

**Result:** Deleted both stubs. Will author at v0.5 and v1 when the skills actually have logic.

**Graduation-readiness:** Yes. Three reviewers converged on one clean imperative; ready for AGENTS.md.
```

## Anti-patterns (avoid these)

### No dates

Lessons without dates are rules in disguise. Date is how we know when to revisit and whether patterns are recurring. Always include `date:` frontmatter; always use ISO format.

### Mixed rules and stories

Bad: `"Button variants limited to 3. We tried 4 in Feb 2026 and reverted."` — that's a rule + a story mashed together. Split them: the rule goes in AGENTS.md (once graduated); the story goes in the lesson.

### Kitchen-sink lessons

Bad: a 500-line lesson covering 4 unrelated topics from one design review. Split into 4 lessons; each atomic; each with its own tags. Long lessons lose signal.

### Vague titles

Bad: `"Lesson about buttons"`. Good: `"Don't ship future-version skill stubs with disable-model-invocation"`. Title should convey the imperative, not just the topic.

### Speculative graduation

Bad: `graduation_candidate: true` on the first occurrence of a pattern. Wait for 3+ before flagging. Premature graduation muddies the signal.

## Graduation-readiness heuristics

Set `graduation_candidate: true` when ALL of:

1. You've seen this pattern before (≥1 prior lesson with overlapping tags)
2. The lesson can be stated as a clean imperative ("always X unless Y")
3. It survives a "would-the-team-agree?" gut check

Set `graduation_candidate: false` when ANY of:

1. It's a one-off (unique situation unlikely to recur)
2. It's controversial (team might disagree)
3. It's time-bound (will become irrelevant in 6 months)
4. The imperative is fuzzy ("try to X, but sometimes Y")

Set `too-early-to-tell` when:

1. First occurrence of a plausible pattern
2. Need to see if it recurs

## Tag conventions

Tags are kebab-case. Use 1-5 tags. Mix categories:

- **Topic:** `skill-authoring`, `design-system`, `button`, `layout`, `typography`
- **Domain:** `plug-in`, `user-harness`, `meta-harness`
- **Status:** `anti-pattern`, `pattern`, `open-question`, `deprecated`
- **Specific:** `disable-model-invocation`, `tier-budget`, `compound-coexistence`

Tags drive graduation detection — ≥3 matching-tag lessons → propose graduation. Consistent tagging is the cheapest high-impact lesson-curation discipline.

## See also

- [graduation-criteria.md](graduation-criteria.md) — when a lesson crosses the graduation threshold
- [plan-hash-protocol.md](plan-hash-protocol.md) — proof-of-consent mechanism for the graduation write
- [hd-learn `layer-5-knowledge.md`](../../hd-learn/references/layer-5-knowledge.md) — conceptual framing of Layer 5
