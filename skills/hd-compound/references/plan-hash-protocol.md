# Plan-hash protocol

**Purpose:** SHA-256 proof-of-consent mechanism protecting graduation writes to `AGENTS.md` (Tier 1 context). Prevents hallucinated approval from modifying every-task context.

## Why plain-text consent isn't enough

Graduation writes to `AGENTS.md` — which loads on **every** task in the repo. A silent or hallucinated "yes" from:

- A runaway agent in a `/loop` misfire
- A parent skill echoing user text
- An LLM that generates "proceed" as a default completion
- An automated CI pipeline with no human review

...could drop an unreviewed rule into the tier-1 context. Text consent ("are you sure?" → "yes") is too easy to produce accidentally or maliciously.

We need a mechanism where:

1. The approver must have **seen** the specific plan (can't approve generically)
2. The plan can't **drift** between proposal and apply without detection
3. **Substitution** (swap one lesson for another under the hood) is detected

SHA-256 plan-hash provides all three with a single 64-char string.

## Hash input format (canonical, byte-stable)

The hash input is a deterministic string built from 7 lines. Every field is mandatory (missing → abort with error):

```
graduation-title: <title verbatim>
source-lessons:
<sorted-path>:<sha256-of-content>
<sorted-path>:<sha256-of-content>
target-agents-md: <repo-root>/AGENTS.md:<sha256-of-content>
target-graduations-md: <repo-root>/docs/knowledge/graduations.md:<sha256-of-content>
rule-text-sha256: <sha256-of-rule-text>
graduations-entry-sha256: <sha256-of-graduations-entry-text>
```

**Rules:**

- `source-lessons` paths **sorted alphabetically** before hashing (deterministic order across invocations)
- Each content hash is SHA-256 of the file's **exact byte content** (no normalization, no trailing-newline stripping)
- `rule-text-sha256` hashes the proposed rule body only (not including the date prefix that AGENTS.md adds)
- `graduations-entry-sha256` hashes the complete proposed graduations.md entry
- Use UTF-8 encoding throughout
- Newlines in the canonical string are `\n` (LF only; no CRLF)

## Computing the hash

Pseudo-code:

```bash
# For each source lesson:
for lesson in source_lessons_sorted; do
  echo "$lesson:$(sha256sum <"$lesson" | cut -d' ' -f1)"
done

# For targets:
echo "target-agents-md: AGENTS.md:$(sha256sum <AGENTS.md | cut -d' ' -f1)"
echo "target-graduations-md: docs/knowledge/graduations.md:$(sha256sum <docs/knowledge/graduations.md | cut -d' ' -f1)"

# For proposed content:
echo "rule-text-sha256: $(echo -n "$RULE_TEXT" | sha256sum | cut -d' ' -f1)"
echo "graduations-entry-sha256: $(echo -n "$ENTRY_TEXT" | sha256sum | cut -d' ' -f1)"

# Build canonical string with \n separators, hash it:
PLAN_HASH=$(printf '%s\n' "<canonical string>" | sha256sum | cut -d' ' -f1)
```

The result is 64 lowercase hex characters.

## Propose output (what the user sees)

`propose-graduation` emits to stdout (not disk):

```
## Graduation Plan: <title>

### Sources
- [<lesson-slug>](<path>)
- [<lesson-slug-2>](<path-2>)   # if multiple

### Proposed rule (append to AGENTS.md § Graduated rules)

> [YYYY-MM-DD] <rule text verbatim>. Source: <path-to-primary-lesson>

### Proposed graduations.md entry

> [complete entry body, matching templates/graduation-entry.md.template with placeholders filled]

### Plan hash

a1b2c3d4e5f6... (64 hex chars)

### To apply this graduation

/hd:compound graduate-apply --plan-hash a1b2c3d4e5f6...

The command requires the hash verbatim. Re-running `graduate-propose` emits a new hash (different invocation ⇒ potentially different inputs). If any source lesson, AGENTS.md, or graduations.md changes between propose and apply, the hash will mismatch and apply will abort.
```

**Crucially:** propose writes **nothing**. `git status` is clean after the command. The plan body + hash live only in stdout / conversation context.

## Apply verification procedure

`apply-graduation --plan-hash <sha>`:

1. **Parse argument.** Require `--plan-hash <64-char-hex>`. Abort if missing, malformed, or non-hex with clear error:

   > "Missing or malformed `--plan-hash`. Run `/hd:compound graduate-propose <topic>` first to generate the plan and its hash."

2. **Re-load all inputs.** Read:
   - Source lesson files (paths from context — the conversation should carry them; if not, abort)
   - Current `AGENTS.md`
   - Current `docs/knowledge/graduations.md`
3. **Re-compute canonical string.** Use the exact same algorithm as propose. Same sorting, same encoding, same content-hash computation.
4. **Re-hash.** SHA-256 of the canonical string.
5. **Compare.** Compare byte-for-byte against the `--plan-hash` argument.
6. **On match:** proceed to atomic write (see below).
7. **On mismatch:** abort. Print drift diagnosis:

   > "Hash mismatch. Expected `<user-hash>`, computed `<current-hash>`.
   > Drift detected in: <file-path>
   > (path changed between propose and apply).
   > Run `/hd:compound graduate-propose <topic>` again to get a fresh plan."

## Atomic write (on verified match)

Two files written in sequence:

1. **`AGENTS.md`** — append one line to the "Graduated rules" section, preserving all other content. Structure:

   ```
   - [YYYY-MM-DD] <rule text>. Source: <path-to-lesson>
   ```

2. **`docs/knowledge/graduations.md`** — prepend new entry above "Add new graduations above this line" marker. Structure from `templates/graduation-entry.md.template`.

Both writes use temp-file + `mv` (atomic on POSIX). If the second write fails, roll back the first via `git checkout HEAD -- AGENTS.md`. Worktree isolation guarantees clean rollback — no committed state to preserve during the write.

**Source lesson file(s) are NEVER touched.** History is sacred.

## UX examples

### Example 1: Clean apply (happy path)

```
User:  /hd:compound graduate-propose no-future-version-stubs
Skill: <emits plan + hash a1b2c3...>

User:  /hd:compound graduate-apply --plan-hash a1b2c3...
Skill: Hash verified. Writing AGENTS.md line 47. Writing graduations.md entry. Done.
       Graduated: "Don't ship future-version skill stubs..."
       Source lesson preserved: docs/knowledge/lessons/2026-04-16-no-future-version-stubs.md
       Next: commit this graduation, or run `/hd:review` for a harness audit.
```

### Example 2: Drift detected (file changed between propose and apply)

```
User:  /hd:compound graduate-propose no-future-version-stubs
Skill: <emits plan + hash a1b2c3...>

# (user or another process edits AGENTS.md between propose and apply)

User:  /hd:compound graduate-apply --plan-hash a1b2c3...
Skill: Hash mismatch.
       Expected: a1b2c3...
       Computed: d4e5f6...
       Drift: AGENTS.md modified since propose (content hash differs)
       Re-run graduate-propose to get a fresh plan.
```

### Example 3: Bad or missing hash

```
User:  /hd:compound graduate-apply
Skill: Missing --plan-hash argument.
       Run `/hd:compound graduate-propose <topic>` first to generate the plan + hash.

User:  /hd:compound graduate-apply --plan-hash not-a-real-hash
Skill: Malformed --plan-hash. Expected 64 lowercase hex chars. Got 13 chars.
```

## Limits (what plan-hash does NOT protect against)

Plan-hash is tamper-detection, not full cryptographic authentication. It does NOT protect against:

- **Multi-person social attacks.** Someone showing the hash to someone else who then approves via channel outside the skill. (Mitigation: audit `graduations.md` for suspicious entries; counter-graduate if needed.)
- **Insider tampering.** A maintainer could fabricate a lesson, propose, and apply — the hash doesn't authenticate identity. (Mitigation: branch protection + PR review + `git log` audit.)
- **Compromised environment.** If the machine running the skill is compromised, the hash offers no protection — the attacker controls both sides.

Plan-hash IS sufficient for the threat model we care about: preventing **accidental** hallucinated approval from runaway agents, loops, or LLMs that echo "yes" by default. That's the v0.5 scope. Full cryptographic signatures (GPG, WebAuthn) are a post-v1 consideration.

## See also

- [graduation-criteria.md](graduation-criteria.md) — when a graduation is appropriate (plan-hash protects the mechanism; criteria protect the content)
- [lesson-patterns.md](lesson-patterns.md) — lesson authoring discipline
- `../workflows/propose-graduation.md` — emits the hash
- `../workflows/apply-graduation.md` — verifies the hash
