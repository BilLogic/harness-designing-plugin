# Graduation criteria

**Purpose:** rules for when a Layer 5 lesson graduates to a Layer 1 / AGENTS.md rule. Loaded by `workflows/propose-graduation.md` before drafting a graduation plan.

## The three criteria (all must hold)

A lesson qualifies for graduation when:

1. **Three or more occurrences.** At least 3 lessons matching the same topic, from at least 2 distinct contexts or contributors. Single occurrences aren't patterns; two occurrences might be coincidence; three is a pattern worth formalizing.
2. **Clean imperative.** The rule can be stated in one sentence of the form "always X unless Y" or "never X when Y." If the rule needs paragraphs of context to be understood, it's too complex to graduate yet — refine it first.
3. **Team agreement.** The team (or sole maintainer) agrees this should be a rule, not just a suggestion. Agreement comes via RFC, PR conversation, sync meeting, or explicit approval in the `apply-graduation` flow.

All three must hold. Missing any one → don't graduate; extend the lesson with more context and wait.

## Occurrence detection

Occurrence count is computed from `docs/knowledge/lessons/*.md` tag overlap:

- Load all lesson frontmatter
- For each tag in the proposed graduation's topic set, count lessons tagged with it
- Union-count across the topic's tags
- Filter out duplicates (same slug, different file)
- Threshold: ≥3 distinct lessons

The `propose-graduation` workflow automates this. If count < 3, workflow aborts with:

> Found N matching lessons. Need ≥3 for graduation. Add more lessons as the pattern recurs, or document why this warrants an exception.

## Clean-imperative test

Before proposing graduation, check: can the rule be stated in ≤1 sentence as a clean imperative?

**Good imperatives** (graduate-ready):

- "Don't ship future-version skill stubs with `disable-model-invocation: true`."
- "Button variants limited to approved set (primary / secondary / ghost); new variants require RFC."
- "Cross-plug-in Task invocations use fully-qualified names (e.g., `compound-engineering:review:...`)."

**Not yet clean** (refine first):

- "Sometimes we should probably use component A, but other times component B is better, depending on context."
- "Try to keep files short, though it's okay if they're longer when necessary."
- "Code reviews should be thorough but also fast."

If the imperative is fuzzy, the rule won't hold up in practice. Wait for more occurrences; extract a sharper rule; then graduate.

## Team agreement

Agreement is captured in the `apply-graduation` workflow:

1. Proposer runs `propose-graduation` → emits plan + hash
2. Reviewer(s) read the plan
3. Agreement signaled by running `apply-graduation --plan-hash <sha>` with the exact hash
4. `approver` field in `graduations.md` entry records who approved

For solo maintainers, the approver is themselves; plan-hash still matters as proof-of-seeing (can't approve without seeing the plan).

For teams, agreement is social: RFC merged, PR approved, sync meeting consensus. The plan-hash is technical ratification, not consensus mechanism.

## Counter-criteria (don't graduate)

Explicit cases where graduation is NOT appropriate:

### One-off

A one-time decision specific to a particular project phase or deadline. Example: "For the Q4 launch, button variants include a 'marketing' variant that reverts post-launch." This is a time-bound exception, not a rule.

### Time-bound / will expire

Rules tied to specific tech, vendor, or external state that may change. Example: "Use v1 API before August 2025." Put such conditional statements in Layer 1 context or a collapsible `<details>` section — they're not graduation-grade rules.

### Personal preference

"I like 2-space indentation" is a preference. Rules need to hold across contributors. If team consensus makes it a project-wide preference, it's graduate-able; if it's just one person's taste, it's not.

### Controversial

If proposing the rule would trigger team debate, it's not ready. Graduation is formalization of a consensus; if there's no consensus, graduation is premature. Let the debate play out first — capture it in lessons as "team discussed X; no consensus; revisit Q3" — then re-propose when consensus emerges.

## Counter-graduation (reversing a rule)

If a graduated rule turns out wrong, don't delete it — counter-graduate:

1. Capture a new lesson documenting why the rule should be revoked (example: `docs/knowledge/lessons/YYYY-MM-DD-revoke-X-rule.md`)
2. Propose counter-graduation: removes the rule from AGENTS.md, appends a "revoked" meta-entry to `graduations.md`, links both lessons (original + revocation)
3. Plan-hash verifies; apply atomically

The original graduated rule's AGENTS.md line is removed (we edit Tier 1); the original LESSON is preserved (history is sacred); the graduations.md gets a new entry showing the revocation.

**Counter-graduation is rare.** If you find yourself revoking frequently, graduations are premature. Tighten the criteria.

## See also

- [lesson-patterns.md](lesson-patterns.md) — authoring lessons well sets up good graduations
- [plan-hash-protocol.md](plan-hash-protocol.md) — the mechanism that protects the destructive AGENTS.md write
- `../workflows/propose-graduation.md` — the workflow that applies these criteria
