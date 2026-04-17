# Lesson patterns

**Purpose:** authoring discipline for Layer 5 lesson entries. Loaded by `workflows/capture.md` when drafting a new lesson.

## YAML frontmatter schema (required)

Every lesson file begins with:

```yaml
---
title: "Short title of the lesson"    # required; 3-10 words; descriptive
date: YYYY-MM-DD                      # required; ISO date of capture
tags: [tag-a, tag-b, tag-c]           # required; 1-5 tags; kebab-case; topic + domain + status
graduation_candidate: true | false    # required; is this ready to graduate soon?
graduated_to: null                    # optional; filled in post-graduation with AGENTS.md entry reference
---
```

`title` is byte-stable (used in plan-hash computation at graduation time). Don't change it after capture.

`tags` drive graduation-candidate detection: when ≥3 lessons share a tag, that tag becomes a graduation topic.

## Body structure (required)

Four sections, always in this order:

```markdown
# Lesson

**Context:** What was happening? 1-2 sentences.

**Decision / Observation:** What we did or noticed. 1-3 sentences.

**Result:** How it went. 1-3 sentences.

**Graduation-readiness:** Yes / No / too-early-to-tell. One sentence of rationale.
```

Total body: 5-10 sentences typical. Long lessons are rare; most are a paragraph per section.

## Good example

```markdown
---
title: "Don't ship future-version skill stubs with disable-model-invocation"
date: 2026-04-16
tags: [skill-authoring, stubs, disable-model-invocation, anti-pattern]
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
- [hd-onboard `layer-5-knowledge.md`](../../hd-onboard/references/layer-5-knowledge.md) — conceptual framing of Layer 5
