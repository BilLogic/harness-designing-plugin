# Plan-hash protocol

**Purpose:** SHA-256 proof-of-consent mechanism protecting rule writes to `AGENTS.md` (Tier 1 context). Prevents hallucinated approval from modifying every-task context.

## Why plain-text consent isn't enough

Rule adoption writes to `AGENTS.md` — which loads on **every** task in the repo. A silent or hallucinated "yes" from:

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

The **reference implementation** is [`../scripts/compute-plan-hash.sh`](../scripts/compute-plan-hash.sh). Claude MUST invoke this script; never compute the hash "in its head". Two sessions computing the hash independently will diverge on trailing newlines, quoting, or locale-sorted path order — which would make apply-mismatch indistinguishable from honest drift.

The script accepts a JSON object on stdin (preferred) or equivalent flags:

```json
{
  "title": "<rule title verbatim>",
  "paths": ["<source lesson paths + AGENTS.md + changelog.md>"],
  "date": "YYYY-MM-DD",
  "author": "<approver>",
  "diff_summary": "<one-line summary of proposed change>"
}
```

All five fields are mandatory; `paths` must be a non-empty array.

### Canonical string

The script normalizes and concatenates fields in a fixed order, with `\n` (LF-only) separators and **no trailing newline**:

```
<title>\n<date>\n<author>\n<sorted_paths_joined_with_|>\n<diff_summary>
```

Normalization rules (enforced by the script):

- Strip carriage returns (`\r`) from every field
- Strip leading/trailing whitespace (spaces, tabs, newlines) on every field
- Sort `paths` with `LC_ALL=C sort` (byte order, locale-independent)
- Drop empty paths after whitespace trim
- Join sorted paths with a single `|` character
- UTF-8 throughout

### Hash computation

```bash
printf '%s' "$canonical" | shasum -a 256 | cut -d' ' -f1
```

(Falls back to `sha256sum` on Linux.) Result: 64 lowercase hex characters.

### Debug: print canonical string

Pass `--print-canonical` to emit the canonical string instead of the hash — useful when a hash mismatch needs forensic inspection.

## Computing the hash

Always via the script. Propose mode runs it after drafting the plan; Apply mode re-runs it against the persisted propose artifact (`.hd/propose-<prefix>.json`) to re-verify.

```bash
echo "$propose_json" | skills/hd-maintain/scripts/compute-plan-hash.sh
```

## Propose output (what the user sees)

`propose-rule` emits to stdout (not disk):

```
## Rule adoption Plan: <title>

### Sources
- [<lesson-slug>](<path>)
- [<lesson-slug-2>](<path-2>)   # if multiple

### Proposed rule (append to AGENTS.md § Rules)

> [YYYY-MM-DD] <rule text verbatim>. Source: <path-to-primary-lesson>

### Proposed changelog.md entry

> [complete entry body, matching templates/rule-entry.md.template with placeholders filled]

### Plan hash

a1b2c3d4e5f6... (64 hex chars)

### To apply this rule

/hd:maintain rule-apply --plan-hash a1b2c3d4e5f6...

The command requires the hash verbatim. Re-running `rule-propose` emits a new hash (different invocation ⇒ potentially different inputs). If any source lesson, AGENTS.md, or changelog.md changes between propose and apply, the hash will mismatch and apply will abort.
```

**Crucially:** propose writes **nothing**. `git status` is clean after the command. The plan body + hash live only in stdout / conversation context.

## Apply verification procedure

`apply-rule --hash <prefix>`:

1. **Parse argument.** Require `--hash <hex-prefix>` (8 chars recommended; full 64 accepted). Glob `.hd/propose-<prefix>*.json`; exactly one match required. Abort on zero / multiple matches with clear error:

   > "No matching propose artifact for `--hash <prefix>`. Run `/hd:maintain rule-propose <topic>` first, or widen the prefix."

2. **Re-load inputs from the artifact.** The persisted `.hd/propose-<prefix>.json` carries `title`, `paths`, `date`, `author`, `diff_summary`, `canonical_string`, and `sha256`. No dependency on conversation context — survives compaction.
3. **Re-run the script.** Feed the artifact's structured fields back into `compute-plan-hash.sh`; capture fresh hash.
4. **Compare.** Byte-for-byte vs the `sha256` stored in the artifact (and vs the `--hash` prefix provided).
5. **On match:** proceed to atomic write (see below). Then `mv .hd/propose-<hash>.json .hd/applied/<hash>.json` (creating `.hd/applied/` as needed).
6. **On mismatch:** abort. Print drift diagnosis:

   > "Hash mismatch. Expected `<user-hash>`, computed `<current-hash>`.
   > Drift detected in: <file-path>
   > (path changed between propose and apply).
   > Run `/hd:maintain rule-propose <topic>` again to get a fresh plan."

## Atomic write (on verified match)

Two files written in sequence:

1. **`AGENTS.md`** — append one line to the "Rules" section, preserving all other content. Structure:

   ```
   - [YYYY-MM-DD] <rule text>. Source: <path-to-lesson>
   ```

2. **`docs/knowledge/changelog.md`** — prepend new entry above "Add new rule adoptions above this line" marker. Structure from `templates/rule-entry.md.template`.

Both writes use temp-file + `mv` (atomic on POSIX). If the second write fails, roll back the first via `git checkout HEAD -- AGENTS.md`. Worktree isolation guarantees clean rollback — no committed state to preserve during the write.

**Source lesson file(s) are NEVER touched.** History is sacred.

## UX examples

### Example 1: Clean apply (happy path)

```
User:  /hd:maintain rule-propose no-future-version-stubs
Skill: <emits plan + hash a1b2c3...>

User:  /hd:maintain rule-apply --plan-hash a1b2c3...
Skill: Hash verified. Writing AGENTS.md line 47. Writing changelog.md entry. Done.
       Graduated: "Don't ship future-version skill stubs..."
       Source lesson preserved: docs/knowledge/lessons/2026-04-16-no-future-version-stubs.md
       Next: commit this rule, or run `/hd:review` for a harness review.
```

### Example 2: Drift detected (file changed between propose and apply)

```
User:  /hd:maintain rule-propose no-future-version-stubs
Skill: <emits plan + hash a1b2c3...>

# (user or another process edits AGENTS.md between propose and apply)

User:  /hd:maintain rule-apply --plan-hash a1b2c3...
Skill: Hash mismatch.
       Expected: a1b2c3...
       Computed: d4e5f6...
       Drift: AGENTS.md modified since propose (content hash differs)
       Re-run rule-propose to get a fresh plan.
```

### Example 3: Bad or missing hash

```
User:  /hd:maintain rule-apply
Skill: Missing --plan-hash argument.
       Run `/hd:maintain rule-propose <topic>` first to generate the plan + hash.

User:  /hd:maintain rule-apply --plan-hash not-a-real-hash
Skill: Malformed --plan-hash. Expected 64 lowercase hex chars. Got 13 chars.
```

## Limits (what plan-hash does NOT protect against)

Plan-hash is tamper-detection, not full cryptographic authentication. It does NOT protect against:

- **Multi-person social attacks.** Someone showing the hash to someone else who then approves via channel outside the skill. (Mitigation: review `changelog.md` for suspicious entries; revoke a rule if needed.)
- **Insider tampering.** A maintainer could fabricate a lesson, propose, and apply — the hash doesn't authenticate identity. (Mitigation: branch protection + PR review + `git log` review.)
- **Compromised environment.** If the machine running the skill is compromised, the hash offers no protection — the attacker controls both sides.

Plan-hash IS sufficient for the threat model we care about: preventing **accidental** hallucinated approval from runaway agents, loops, or LLMs that echo "yes" by default. That's the v0.5 scope. Full cryptographic signatures (GPG, WebAuthn) are a post-v1 consideration.

## See also

- [rule-adoption-criteria.md](rule-adoption-criteria.md) — when a rule adoption is appropriate (plan-hash protects the mechanism; criteria protect the content)
- [lesson-patterns.md](lesson-patterns.md) — lesson authoring discipline
- [`../SKILL.md` § Propose mode](../SKILL.md) — emits the hash + writes `.hd/propose-<prefix>.json`
- [`../SKILL.md` § Apply mode](../SKILL.md) — verifies the hash against the persisted artifact
- [`../scripts/compute-plan-hash.sh`](../scripts/compute-plan-hash.sh) — reference implementation
