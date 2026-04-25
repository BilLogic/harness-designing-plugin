---
title: "Sed-based vocabulary renames need surgical precision or an always-manual review pass"
date: 2026-04-21
tags: [vocabulary-rename, sed, refactor, review-tools, lesson-from-audit]
memory_type: episodic
importance: 4
rule_candidate: true
rule_ref: null
---

# Lesson

## Context

The 2026-04-21 harness review (dogfood run, post-3n ship) surfaced a P1 finding in Layer 4: `docs/rubrics/skill-quality.md` and its starter copy both contained **16 broken tokens** from the 3l.7 vocab unification pass (`audit → full review` / `critique → targeted review`). Examples:

- `"full reviewor"` (was `auditor` — `audit` matched inside the word)
- `"templates/full review-report.md.template"` (file path with a space!)
- `"hd:full review-harness"` (broken slash-command)
- `"full review-criteria.md"` (should be `review-criteria.md`)
- `"targeted review-format.md"` (should be `targeted-review-format.md` — hyphen broken into space)
- `"targeted review_rubrics"` (broken YAML key)

The replace ran across literal word boundaries and inside file paths / compound identifiers. Output was syntactically valid markdown but semantically incoherent — broken links to files that don't exist, YAML keys with spaces, slash-commands that parse wrong.

## Decision / Observation

Two distinct failure modes showed up here:

### Mode 1 — Replacement that matches inside larger words
`audit → full review` replacing inside `auditor` produces `full reviewor`. Basic sed `s/audit/full review/g` has no word-boundary guard. Fix: `s/\baudit\b/full review/g` (word boundaries). But word boundaries alone don't fix …

### Mode 2 — Replacement that matches across identifier boundaries (hyphens, dots, slashes)
`critique → targeted review` replacing in `critique-format.md` produces `targeted review-format.md` (space in file path). File paths use hyphens and dots as identifier joiners; those get obliterated by an unbounded replace.

Both are well-known sed pitfalls; neither was caught during 3l.7 ship because:
1. No CI check for broken markdown links after the rename
2. No `/hd:review audit` run on the plug-in repo between 3l ship and today
3. The broken copy of `skill-quality.md` sat in `assets/starter-rubrics/` where it wasn't rendered by any consumer (silent rot)

The full harness review surfaced it immediately once dispatched. **The harness's own L4 auditor is the most reliable way to catch vocabulary-rename drift.**

### The fix pattern (for today's 3l.7 residue)

Manual + context-aware, one token at a time:

| Broken | Context | Corrected |
|---|---|---|
| `full reviewor` | word boundary collision | `auditor` (original) |
| `templates/full review-report.md.template` | file path | `assets/review-report.md.template` (actual path) |
| `hd:full review-harness` | slash-command | remove or rename to `hd:review-harness` |
| `full review-criteria.md` | file path | `review-criteria-l2-skills.md` (per L2-specific file) |
| `targeted review-format.md` | file path | `targeted-review-format.md` (correct hyphenation) |
| `targeted review_rubrics` | YAML key | `targeted_review_rubrics` |

## Result

Both copies of `skill-quality.md` restored in commit `9b2fbaf7dd`. All 16 broken tokens fixed. File re-reads as coherent prose + valid file-path references.

## Graduation-readiness

**Candidate rule:** *"Vocabulary renames across the plug-in repo must use either (a) surgical context-aware edits file-by-file, or (b) a post-rename `/hd:review audit` dogfood pass before commit. Global sed without either safeguard is banned."*

First confirmation (this incident). Park as candidate; graduate when we see the second occurrence or when we find evidence that a future rename was avoided because of this lesson.

## Prevention pattern going forward

Any future vocabulary-rename task should include in its plan:
1. **Scoped grep audit before running sed:** list every file containing the old term; read context for each match to confirm the replacement makes sense
2. **Word boundaries + path separators in the sed:** `s/\baudit\b/full review/g` — never `s/audit/full review/g`
3. **Post-rename dogfood:** run `/hd:review audit` on the plug-in repo immediately after commit; any P1 finding in the affected layer = revert and retry
4. **CI check:** broken markdown links should fail the pre-commit (future improvement)

## Next

- Watch for the second occurrence (any future rename); if one materializes, graduate the rule to `AGENTS.md § Rules`
- Next pre-commit pass: verify no other rubric or reference file has residual broken tokens from 3l.7 (grep for `full reviewor`, `targeted review-format`, etc.)
- Consider a simple lint script that flags `\S\s\S+\.md` (space between non-whitespace chunks in a presumed file path) as a pre-commit warning
