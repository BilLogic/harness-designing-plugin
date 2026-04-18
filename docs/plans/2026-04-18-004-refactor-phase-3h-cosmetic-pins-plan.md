---
title: "Phase 3h — cosmetic pins: candidate_id derivation, path format, rule_statement punctuation"
type: refactor
status: completed
date: 2026-04-18
origin: docs/knowledge/lessons/2026-04-18-extract-mode-two-session-regression.md
---

# Phase 3h — cosmetic pins

Close the 3 surface-drift items surfaced by the Phase 3g G6 true-two-session regression. All three are cosmetic (no ship-blocker). Single file: `agents/review/rubric-applicator.md`. Single commit target.

## H1 — Pin `candidate_id` derivation

**Problem:** Spec says "kebab-case from rule intent, ≤40 chars". Both G6 runs complied but picked different valid paraphrases (5/13 candidates drifted: `prefer-plus-components` vs `plus-components-first`, etc.).

**Pin:** derive `candidate_id` from the rule statement via:

1. Take the first imperative verb (must|never|always|don't|avoid|prefer|require|forbid|ensure|use|follow|skip)
2. Take the first noun-phrase object after that verb (up to 3 words, lowercase, stop at punctuation/conjunction)
3. If the verb is negative (`never`, `don't`, `avoid`, `forbid`), prefix the noun-phrase with `no-`; drop the verb
4. Kebab-case the result; strip articles (the/a/an); cap at 40 chars
5. Exception: when multiple candidates would collide (same id), suffix `-2`, `-3`, etc. by source line order

Document the rule as a small numbered-list + 3 worked examples in the agent prompt.

## H2 — Pin path format for `applies_to` and `source_citation`

**Problem:** Run A emitted `plus-uno/AGENTS.md:26-26`, Run B emitted `/tmp/hd-real-test/plus-uno/AGENTS.md:26-26`. Spec didn't pin absolute vs relative.

**Pin:** `source_citation` + `applies_to` MUST use a **repo-relative path** (from the target repo's root, not from the agent's cwd). If the caller passes an absolute path as `source:`, the agent strips the repo-root prefix (detected via nearest `.git/` ancestor) before emitting citations. If the repo root isn't detectable, fall back to the basename.

Examples:
- Input `source: "/tmp/hd-real-test/plus-uno/AGENTS.md"` → citation `AGENTS.md:26-26` (plus-uno is the repo root since `.git/` is there)
- Input `source: "docs/rubrics/accessibility.md"` (already relative) → citation `docs/rubrics/accessibility.md:15-20` unchanged

## H3 — Pin `rule_statement` punctuation

**Problem:** Run A used semicolons between rule clauses; Run B used colons. Lowest-value drift — evidence snippets verbatim identical either way.

**Pin:** use `:` (colon) to separate rule heading from elaboration (e.g., `"Never hallucinate layouts: when building a new page, read ..."`). Use `;` only when chaining two independent imperatives in one statement. When in doubt: colon.

Document as a single one-liner in the Phase 3 Structure spec. No long justification needed.

## Implementation

Single edit pass to `agents/review/rubric-applicator.md`. Each pin lands as ≤15 lines of added spec language in the appropriate Phase section. Then mental-trace against the G6 test inputs to verify the pins resolve the 3 cosmetic drift axes.

## Files to touch

**Modify:** `agents/review/rubric-applicator.md`, `CHANGELOG.md`.
**Delete:** none.

## Verification

Done when:
- [ ] H1 rule documented with 3 worked examples
- [ ] H2 path-format rule documented with 2 worked examples
- [ ] H3 punctuation rule documented as one-liner
- [ ] Mental trace against G6 test inputs shows zero drift on the 3 axes
- [ ] CHANGELOG documents Phase 3h

## Sources

- [`docs/knowledge/lessons/2026-04-18-extract-mode-two-session-regression.md`](../knowledge/lessons/2026-04-18-extract-mode-two-session-regression.md) § Residual variance
- Phase 3g plan [`docs/plans/2026-04-18-003-refactor-phase-3g-remaining-backlog-plan.md`](./2026-04-18-003-refactor-phase-3g-remaining-backlog-plan.md)
- `agents/review/rubric-applicator.md` — F2 spec landed in Phase 3f commit `7949621f`
