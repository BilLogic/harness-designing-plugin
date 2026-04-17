# Workflow — Apply graduation

**When to use:** user provides a plan hash from a prior `propose-graduation` and invokes `/hd:compound graduate-apply --plan-hash <sha>`.
**Goal:** verify the plan hash against current file state; on match, atomically write the graduated rule to `AGENTS.md` + meta-entry to `docs/knowledge/graduations.md`. **Source lesson(s) never touched.**

## Progress checklist

```
Apply-Graduation Progress:
- [ ] Step 1: Parse --plan-hash argument
- [ ] Step 2: Recover context (source lessons, proposed rule text, proposed entry)
- [ ] Step 3: Re-read all input files
- [ ] Step 4: Re-compute canonical hash input
- [ ] Step 5: Compute current plan hash
- [ ] Step 6: Compare against user-provided hash
- [ ] Step 7: On match → atomic write. On mismatch → abort with drift diagnosis.
- [ ] Step 8: Post-write verification
- [ ] Step 9: Summarize
```

## Step 1 — Parse --plan-hash

Require `--plan-hash <64-char-hex>`. Validate:

- Present → proceed
- Missing → abort:

  > "Missing `--plan-hash` argument. Run `/hd:compound graduate-propose <topic>` first to generate the plan and its hash."

- Malformed (not 64 hex chars, contains spaces, mixed case) → abort:

  > "Malformed `--plan-hash`. Expected 64 lowercase hex chars. Got: `<actual>`"

## Step 2 — Recover context

The propose workflow emitted:

- Graduation title
- Source lesson paths (sorted alphabetically)
- Proposed rule text
- Proposed graduations.md entry
- Plan hash

Apply needs the source paths + rule + entry to reconstruct canonical input. These come from **conversation context** (the user ran propose earlier in the session and apply is following up).

If the context is lost (session compacted, conversation switched), abort:

> "Can't recover propose context. Re-run `/hd:compound graduate-propose <topic>` to get a fresh plan."

Don't try to reconstruct from the hash alone — hashes are one-way.

## Step 3 — Re-read inputs

Read:

- Each source lesson file (sorted paths as in propose)
- Current `AGENTS.md`
- Current `docs/knowledge/graduations.md`

Validate source lesson YAML — if any fails schema now (but passed at propose), the lesson has been edited since propose. That's a drift case; handle in Step 6.

## Step 4 — Re-compute canonical input

Use the exact same algorithm as `propose-graduation` Steps 6-7:

- Same sort order (alphabetical paths)
- Same format (7-line canonical string per [`../references/plan-hash-protocol.md`](../references/plan-hash-protocol.md))
- Same encoding (UTF-8, LF-only newlines)
- Content hashes computed fresh against **current** file bytes

## Step 5 — Compute current hash

SHA-256 of the canonical string → 64-char lowercase hex.

## Step 6 — Compare

Byte-for-byte compare current hash against user-provided `--plan-hash`.

### On match → Step 7 (apply)

### On mismatch → abort with drift diagnosis

Diagnose which specific input changed by re-hashing each input file individually and comparing against the stored hash from propose (carry these in context):

```
Hash mismatch.
  User-provided: <user-hash>
  Current:       <current-hash>

Drift detected in:
- AGENTS.md (content differs from propose-time)
- (or: docs/knowledge/graduations.md; or: source lesson <path>)

Re-run `/hd:compound graduate-propose <topic>` to get a fresh plan based on current file state.
```

Abort without any writes. `git status` should be clean (or unchanged from pre-apply state).

## Step 7 — Atomic write (only on hash match)

Two writes in sequence:

### Write 1: AGENTS.md

Locate the "Graduated rules" section. Append the proposed rule line above the marker:

```markdown
<!-- Add new graduated rules above this line. -->
```

Specifically:

1. Read current `AGENTS.md` into buffer
2. Find marker line (index `M`)
3. Insert proposed rule at index `M` (pushes marker down by one line)
4. Write buffer to temp file `/tmp/agents-md.new`
5. `mv /tmp/agents-md.new AGENTS.md` (atomic)

Verify the marker survived (didn't get overwritten). If marker missing post-write → roll back via `git checkout HEAD -- AGENTS.md` and abort.

### Write 2: graduations.md

Fill the two remaining placeholders in the proposed entry:

- `{{APPROVER}}` — from context (user's name/handle; or "solo approval" if maintainer is sole approver)
- `{{PLAN_HASH}}` — the user-provided hash (now verified)

Locate the "Entries" section + "Add new graduations above this line" marker. Prepend the filled entry above the marker.

1. Read current `graduations.md`
2. Find the comment marker
3. Insert filled entry above the marker (newest first convention)
4. Write to temp + `mv`

If this write fails → roll back both writes via `git checkout HEAD -- AGENTS.md docs/knowledge/graduations.md`.

### Source lesson files: NEVER TOUCHED

No writes to `docs/knowledge/lessons/*.md`. If any write there is attempted during this workflow, abort the skill — source lessons are sacred history.

Verify post-write: `sha256sum docs/knowledge/lessons/<each-source>.md` equals the hash captured at propose time. If any drifted (shouldn't, unless external process edited), alert user.

## Step 8 — Post-write verification

After both writes:

```bash
# AGENTS.md — expect new rule present, marker still present
grep -c "<rule text distinctive substring>" AGENTS.md  # expect 1
grep -c "Add new graduated rules above this line" AGENTS.md  # expect 1

# graduations.md — expect new entry present, marker still present
grep -c "## <date> — <title>" docs/knowledge/graduations.md  # expect 1

# Source lessons — expect byte-identical
for lesson in <source-lesson-paths>; do
  [ "$(sha256sum <"$lesson" | cut -d' ' -f1)" = "<stored-hash>" ] || echo "DRIFT: $lesson"
done
```

If any verification fails → restore from git + abort with clear error.

## Step 9 — Summarize

Report:

```
Graduated: <title>
  Rule now at AGENTS.md § Graduated rules:
    <rule text>

  Meta-entry at docs/knowledge/graduations.md:
    ## <date> — <title>

  Source lesson(s) preserved at:
    - <path-1>
    - <path-2>

  Plan hash verified: <user-hash> ✓

Next steps:
  1. Review the changes: git diff HEAD
  2. Commit: git commit -m "chore: graduate <title>"
  3. (Optional) Run `/hd:review` for harness audit (v1)
```

## Failure modes

- **F1 Missing/malformed hash** — Step 1 aborts
- **F2 Context lost** — Step 2 aborts; re-propose
- **F3 Drift detected** — Step 6 aborts with diagnosis; user re-proposes
- **F4 Write failure mid-apply** — roll back both files via git; abort with error
- **F5 Source lesson write attempted** — absolute refusal; skill aborts immediately; investigate
- **F6 Marker missing in AGENTS.md or graduations.md** — files were edited to remove the insertion marker; abort; user restores marker or re-proposes
- **F7 Double-apply (same hash used twice)** — check `graduations.md` for existing entry with matching hash; if present, warn:

  > "This graduation appears already applied (found entry with matching plan hash). Running apply again would create a duplicate AGENTS.md rule. Abort."

## Coexistence rules

- ✅ Writes ONLY to `AGENTS.md` and `docs/knowledge/graduations.md` in the user's repo
- ❌ Never writes to `docs/solutions/` (compound's)
- ❌ Never writes to `docs/knowledge/lessons/*.md` (source lessons are append-only, history is sacred)
- Task invocations (if used) fully-qualified

## See also

- [`../references/plan-hash-protocol.md`](../references/plan-hash-protocol.md) — verification algorithm
- [propose-graduation.md](propose-graduation.md) — must run first to generate the hash
- [`../../hd-onboard/references/layer-5-knowledge.md`](../../hd-onboard/references/layer-5-knowledge.md) — why history is sacred (explains the source-lesson-never-touched rule)
