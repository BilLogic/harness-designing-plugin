# Workflow — Propose graduation

**When to use:** user says "graduate this," "promote this pattern to a rule," or invokes `/hd:compound graduate-propose <topic>`.
**Goal:** analyze source lessons on the given topic, draft a graduation plan, emit SHA-256 hash. **Writes nothing.** Read-only analysis + hash emission.

## Progress checklist

```
Propose-Graduation Progress:
- [ ] Step 1: Parse topic
- [ ] Step 2: Scan lessons for topic matches
- [ ] Step 3: Check threshold (≥3 occurrences)
- [ ] Step 4: Verify clean imperative is extractable
- [ ] Step 5: Draft proposed rule + graduations.md entry
- [ ] Step 6: Read input files + compute content hashes
- [ ] Step 7: Build canonical hash input
- [ ] Step 8: Compute SHA-256 plan hash
- [ ] Step 9: Emit plan + hash to stdout (no writes)
```

## Step 1 — Parse topic

From argument to `/hd:compound graduate-propose <topic>` or from conversation context. Topic is a string like `"no-future-version-stubs"` or `"button-variants"`. Should match a tag used across multiple lessons.

If topic is ambiguous or missing, ask:

> "Which topic are we graduating? Give me a tag or keyword."

## Step 2 — Scan lessons

Find lessons with matching tags:

```bash
# Pseudocode
for f in docs/knowledge/lessons/*.md; do
  read frontmatter
  if tags include <topic> OR title contains <topic>; then
    add $f to source_lessons
  fi
done
```

Deduplicate: if two files have the same slug (different dates), count as one unless they're genuinely distinct lessons (ask user).

**Validate YAML frontmatter** of each source lesson — if any fails schema (per [`../references/lesson-patterns.md`](../references/lesson-patterns.md)), abort with clear error. Malformed input = abort; don't propose graduations on bad data.

## Step 3 — Threshold check

Per [`../references/graduation-criteria.md`](../references/graduation-criteria.md):

- **Count ≥ 3** → proceed
- **Count < 3** → abort:

  > "Found N matching lessons. Graduation needs ≥3 occurrences. Add more lessons as the pattern recurs, or document why this warrants an exception."

Don't silently proceed with <3; the threshold is load-bearing.

## Step 4 — Clean-imperative check

Per [`../references/graduation-criteria.md`](../references/graduation-criteria.md) § Clean-imperative test:

Synthesize a candidate rule from the source lessons. Ask yourself: "Can I state this as 'always X unless Y' or 'never X when Y' in one sentence?"

- **Yes** → continue
- **No** (rule is fuzzy, conditional, or context-dependent) → abort:

  > "Rule couldn't be stated as a clean imperative. Refine the pattern further; add more specific lessons; then re-propose."

Examples of refinement: split a fuzzy rule into two sharper rules; add the specific trigger condition ("when X happens, do Y"); narrow scope.

## Step 5 — Draft proposed rule + entry

### Rule text (for AGENTS.md)

Format (matches existing Graduated rules section):

```
- [YYYY-MM-DD] <clean imperative>. Source: docs/knowledge/lessons/<primary-lesson>.md
```

Date: today's. Primary lesson: the most recent source (by date). Other sources referenced in graduations.md entry.

Rule text should be byte-stable once emitted — it enters the plan-hash. If user requests wording changes, re-emit (new hash).

### graduations.md entry

Use [`../templates/graduation-entry.md.template`](../templates/graduation-entry.md.template). Fill:

- `{{DATE}}` — today's ISO date
- `{{TITLE}}` — short graduation title (not the same as rule text; more like a heading)
- `{{RULE_TEXT}}` — verbatim from above
- `{{LESSON_FILENAME}}` — primary source lesson filename
- `{{LESSON_PATH}}` — full path
- `{{OCCURRENCE_COUNT}}` — N from Step 2
- `{{TOPIC_TAGS}}` — the tag(s) that matched
- `{{PROPOSER}}` — from context (usually user or "Claude via /hd:compound")
- `{{APPROVER}}` — placeholder "pending apply" (filled at apply time)
- `{{PLAN_HASH}}` — placeholder "pending" (filled at apply time via the hash user provided)

## Step 6 — Compute content hashes

Read:

- Each source lesson file (sorted paths alphabetically)
- Current `AGENTS.md`
- Current `docs/knowledge/graduations.md`

For each, compute SHA-256 of the file's byte content:

```bash
sha256sum <"$path" | cut -d' ' -f1
```

Store `(path, hash)` tuples for canonical-string assembly.

Also compute:
- `rule-text-sha256` — SHA-256 of the rule text body (without date prefix)
- `graduations-entry-sha256` — SHA-256 of the graduations.md entry body

## Step 7 — Build canonical hash input

Per [`../references/plan-hash-protocol.md`](../references/plan-hash-protocol.md), exact 7-line format:

```
graduation-title: <title>
source-lessons:
<sorted-path>:<content-hash>
<sorted-path-2>:<content-hash-2>
target-agents-md: AGENTS.md:<content-hash>
target-graduations-md: docs/knowledge/graduations.md:<content-hash>
rule-text-sha256: <hash>
graduations-entry-sha256: <hash>
```

Rules: UTF-8, LF-only newlines, no trailing whitespace.

## Step 8 — Compute plan hash

SHA-256 of the canonical string:

```bash
printf '%s\n' "$CANONICAL_STRING" | sha256sum | cut -d' ' -f1
```

Result: 64-char lowercase hex. This is the plan hash.

## Step 9 — Emit plan + hash (no writes)

Output to stdout:

```markdown
## Graduation Plan: <title>

### Sources

- [<slug-1>](<path-1>)
- [<slug-2>](<path-2>)
- [<slug-3>](<path-3>)

### Proposed rule (append to AGENTS.md § Graduated rules)

> - [YYYY-MM-DD] <rule text verbatim>. Source: <primary-lesson-path>

### Proposed graduations.md entry

> <entry body from Step 5, placeholders still in>

### Plan hash

`<64-char hex>`

### To apply this graduation

`/hd:compound graduate-apply --plan-hash <64-char hex>`

The hash verifies no file drifted between propose and apply. If AGENTS.md, graduations.md, or any source lesson changes before apply, the hash will mismatch and apply will abort. Re-run propose to get a fresh hash.
```

**Critical:** this workflow writes nothing. No temp files. No disk modifications. The plan body + hash live only in stdout / conversation context until user chooses to apply.

Verify post-run: `git status` should be clean (or unchanged from pre-propose state).

## Failure modes

- **F1 Malformed YAML in source lesson** — Step 2 validation catches; abort before analysis
- **F2 Count < 3** — Step 3 aborts
- **F3 Fuzzy rule** — Step 4 aborts; user refines lessons first
- **F4 Collision with existing graduated rule** — if AGENTS.md already has a rule on this topic, abort: "This topic is already graduated. Did you mean counter-graduation?"
- **F5 Accidental write** — if any tool call detects a file write during propose, abort the skill invocation with an error (propose is strictly read-only)

## Compact-safe mode

When context budget is tight (per compound 2.39.0 lesson), skip non-essential analysis:

- Skip Phase-1 research (don't invoke `compound-engineering:research:learnings-researcher`)
- Still do Steps 1-9 core — they're mandatory for the hash mechanism to work
- Reduce prose in emitted plan (shorter summaries; same hash)

Hash correctness is never compromised in compact-safe mode. Only verbosity varies.

## Coexistence rules

- ✅ Reads from our namespace: `docs/knowledge/lessons/`, `AGENTS.md`, `docs/knowledge/graduations.md`
- ❌ Never reads `compound-engineering.local.md` or `docs/solutions/` — those are compound's
- Task invocations (if used) fully-qualified

## See also

- [`../references/graduation-criteria.md`](../references/graduation-criteria.md) — criteria applied in Steps 3-4
- [`../references/plan-hash-protocol.md`](../references/plan-hash-protocol.md) — hash spec
- [apply-graduation.md](apply-graduation.md) — the next workflow (applies a proposed plan)
