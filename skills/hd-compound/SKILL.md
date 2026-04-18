---
name: hd:compound
description: Captures design lessons and proposes graduations from narrative to rule. Use when capturing a decision or promoting a recurring pattern to AGENTS.md.
argument-hint: "capture | graduate-propose <topic> | graduate-apply --hash <prefix>"
---

# hd:compound — maintain your harness (capture + graduate)

## Interaction method

Use `AskUserQuestion` for branching decisions (approve / edit / abort). If unavailable (non-Claude hosts), fall back to numbered-list prompts. **Never write to `AGENTS.md` or `graduations.md` without a verified plan-hash** — hash is always computed via [`scripts/compute-plan-hash.sh`](scripts/compute-plan-hash.sh), never in-head (F4 safety per [`references/plan-hash-protocol.md`](references/plan-hash-protocol.md)).

## Single job

Append a dated lesson to `docs/knowledge/lessons/` (capture) OR promote a pattern across ≥3 lessons to a rule in `AGENTS.md` (graduate). One skill, two verbs of the MAINTAIN family.

## Mode detection

| User says… / invokes… | Mode | Safety |
|---|---|---|
| "Save this lesson" / `/hd:compound capture` | **capture** | 1 atomic write to lessons dir |
| "Graduate this" / `/hd:compound graduate-propose <topic>` | **propose** (writes `.hd/propose-<prefix>.json` only) | 0 writes to tracked files; emits plan + hash |
| `/hd:compound graduate-apply --hash <prefix>` | **apply** (destructive) | Hash-verified writes to AGENTS.md + graduations.md |

Ambiguous → ask. Never auto-dispatch across modes.

## Workflow checklist (copy into your response per mode)

Pick ONE checklist based on detected mode:

### Capture mode

```
hd:compound capture Progress:
- [ ] Step 1: Identify subject + memory type (episodic / decision / preference / ideation / changelog)
- [ ] Step 2: Resolve target file (lessons/YYYY-MM-DD-<slug>.md, or decisions/preferences/ideations/changelog.md)
- [ ] Step 3: Optional — retrieve relevant past lessons (sub-agent)
- [ ] Step 4: Draft the entry
- [ ] Step 5: Check tag-cluster size (≥ 3 lesson files sharing a tag → graduation candidate)
- [ ] Step 6: Show user the drafted entry + target file; get approval
- [ ] Step 7: Atomic write (new file for episodic; append for shared files); update INDEX.md
- [ ] Step 8: Summarize with graduation-candidate signal
```

### Propose mode

```
hd:compound propose Progress:
- [ ] Step 1: Parse topic
- [ ] Step 2: Run graduation-candidate-scorer sub-agent
- [ ] Step 3: Filter to clusters scoring ≥ 3.5 (graduation-ready)
- [ ] Step 4: Draft proposed rule + graduations.md entry per cluster
- [ ] Step 5: Assemble structured inputs (title, paths, date, author, diff_summary)
- [ ] Step 6: Invoke `scripts/compute-plan-hash.sh` (JSON on stdin) → SHA-256
- [ ] Step 7: Write `.hd/propose-<prefix>.json` artifact (creates `.hd/` if missing)
- [ ] Step 8: Emit plan + hash to stdout (no writes to tracked files)
```

### Apply mode

```
hd:compound apply Progress:
- [ ] Step 1: Parse --hash <prefix> argument; glob `.hd/propose-<prefix>*.json` (unique match required)
- [ ] Step 2: Read structured inputs from the persisted artifact (survives context compaction)
- [ ] Step 3: Re-run `scripts/compute-plan-hash.sh` with those inputs
- [ ] Step 4: Compare to artifact's stored `sha256`
- [ ] Step 5: On match → atomic writes to AGENTS.md + graduations.md. On mismatch → abort with drift diagnosis.
- [ ] Step 6: Move `.hd/propose-<hash>.json` → `.hd/applied/<hash>.json` (cleanup)
- [ ] Step 7: Post-write verification (`git status` shows exactly 2 tracked-file diffs)
- [ ] Step 8: Summarize
```

## Capture mode — procedure

**Step 1 — Identify subject + memory type.** Extract from conversation. Classify:
- "What happened during this work?" → **episodic** → `docs/knowledge/lessons/YYYY-MM-DD-<slug>.md` (new file)
- "What did we choose, and why?" → **procedural-chosen** → `docs/knowledge/decisions.md`
- "What taste/workflow call are we standardizing?" → **semantic-taste** → `docs/knowledge/preferences.md`
- "What idea are we exploring / deferring?" → **speculative** → `docs/knowledge/ideations.md`
- "What harness-structural change happened?" → **temporal** → `docs/knowledge/changelog.md`

If thin/ambiguous, ask: *"What's the lesson? Answer in one sentence."* Then: *"Is this (a) episodic what-happened, (b) a decision we made, (c) a preference we hold, (d) an idea to explore, or (e) a harness-structural change?"* Default when unclear: episodic lesson.

**Step 2 — Resolve target file.**

**If episodic (most common):** create a **new** file at `docs/knowledge/lessons/YYYY-MM-DD-<slug>.md` where:
1. `YYYY-MM-DD` is today's ISO date
2. `<slug>` is kebab-case, derived from the primary tag or a user-supplied short descriptor (confirm with user if ambiguous)
3. If a file with that exact name already exists (same-day duplicate), append a disambiguator (`-2`, `-3`) rather than overwriting

One file per lesson event — **never** append to an existing lesson file. See [`references/lesson-patterns.md` § File organization](references/lesson-patterns.md).

**If non-episodic:** target is one of the shared files (`decisions.md`, `preferences.md`, `ideations.md`, `changelog.md`). These files always exist post-setup; append the new entry.

**Step 3 — Optional retrieval.** If context budget permits, invoke:

```
Task design-harnessing:research:lesson-retriever(
  lessons_root: "docs/knowledge/lessons/",
  topic: <subject-keywords>,
  max_results: 3
)
```

to surface similar past lessons. Findings enrich the new entry's rationale + flag graduation-candidacy. Skip in compact-safe mode.

**Step 4 — Draft the entry.** Use [`assets/lesson.md.template`](assets/lesson.md.template) as the per-entry shape (for episodic lessons). Other memory types have per-file formats documented in each file's template — see `knowledge-skeleton/decisions.md.template`, `ideations.md.template`, etc.

Entry YAML (episodic):
- `date` — today's ISO date
- `tags` — 1–5 kebab-case; grep existing entries in this file + sibling domain files to avoid tag-drift
- `graduation_candidate` — `true` / `false` / `too-early-to-tell`

Entry body — 4 sections, each 1–3 sentences: **Context / Decision / Result / Graduation-readiness.**

**Step 5 — Tag-cluster check.** After classifying tags, grep `docs/knowledge/lessons/*.md` for frontmatter matches. If ≥ 3 existing lesson files share any tag with this new entry, flag the cluster as a graduation candidate in the Step 8 summary. Non-blocking; graduation is a separate flow.

**Step 6 — Approval.** Show the drafted entry verbatim + target file path (new file for episodic; append location for shared files). User approves (Y), edits (E), or aborts (A). Never write without explicit Y/E.

**Step 7 — Atomic write.** For episodic: write the full file to a temp path then `mv` it to `docs/knowledge/lessons/YYYY-MM-DD-<slug>.md`. For non-episodic shared files: append entry with `---` separator, temp file + `mv`. Always update `docs/knowledge/INDEX.md` entry count + last-updated.

**Step 8 — Summarize.** Report target file + tag-cluster signal (if any). Next-step suggestion: `/hd:compound graduate-propose <topic>` when ≥ 3 lesson files share a tag.

## Propose mode — procedure (READ-ONLY — writes NOTHING)

**Step 1 — Parse topic.** From argument or conversation context. If missing, ask: *"Which topic are we graduating? Give me a tag or keyword."*

**Step 2 — Run scorer.** Invoke:

```
Task design-harnessing:analysis:graduation-candidate-scorer(
  lessons_root: "docs/knowledge/lessons/",
  topic_filter: <topic>,
  graduated_log: "docs/knowledge/graduations.md"
)
```

The scorer returns clusters with scores. See [`references/graduation-criteria.md`](references/graduation-criteria.md) for the 3-dimension scoring.

**Step 3 — Filter.** Keep clusters scoring ≥ 3.5. If none:

> "Found N matching lessons scoring <3.5. Graduation needs ≥3 occurrences + clean imperative + team agreement. Add more lessons as the pattern recurs."

Abort cleanly. Don't silently proceed.

**Step 4 — Draft rule + entry.** For each ready cluster:
- **Rule text** (for AGENTS.md): `[YYYY-MM-DD] <clean imperative>. Source: docs/knowledge/lessons/<primary-lesson>.md`
- **Graduations.md entry**: per [`assets/graduation-entry.md.template`](assets/graduation-entry.md.template) — title, lesson sources list, rule text, reviewed-by (user), date

**Step 5 — Assemble structured inputs.** Build the JSON payload for the hash script:

```json
{
  "title": "<clean imperative / rule text>",
  "paths": [
    "<source-lesson-1>",
    "<source-lesson-2>",
    "AGENTS.md",
    "docs/knowledge/graduations.md"
  ],
  "date": "<YYYY-MM-DD today>",
  "author": "<approver>",
  "diff_summary": "<one-line description of what will change>"
}
```

Order in `paths` doesn't matter — the script sorts with `LC_ALL=C sort`.

**Step 6 — Compute hash.** Invoke the reference implementation:

```bash
echo "$propose_json" | skills/hd-compound/scripts/compute-plan-hash.sh
```

Never compute the hash any other way. Two sessions "reasoning" their way to a hash will diverge; the script is the only authoritative source.

**Step 7 — Persist propose artifact.** Take the first 8 chars of the hash as `<prefix>`. Create `.hd/` at repo root if missing. Write `.hd/propose-<prefix>.json`:

```json
{
  "title": "...",
  "paths": ["..."],
  "date": "YYYY-MM-DD",
  "author": "...",
  "diff_summary": "...",
  "canonical_string": "<from --print-canonical>",
  "sha256": "<64-char-hex>"
}
```

This artifact makes Apply survive context compaction. Do **not** add `.hd/` to the user's `.gitignore` from within this skill — that's their repo decision. (`/hd:setup` may propose the addition separately via `skills/hd-setup/assets/gitignore-entries.txt`.)

**Step 8 — Emit plan + hash to stdout.** Same format as before:

```
## Graduation Plan: <title>

### Sources
- [lesson-slug](path)

### Proposed rule (append to AGENTS.md § Graduated rules)
> [YYYY-MM-DD] <rule>. Source: <path-to-primary-lesson>

### Proposed graduations.md entry
> [complete entry body]

### Plan hash
`<64-char-hex>`  (artifact: .hd/propose-<prefix>.json)

### To apply
/hd:compound graduate-apply --hash <prefix>
```

**Confirm zero writes to tracked files.** `git status` should show no tracked-file changes — only the untracked `.hd/` directory (which the user should gitignore).

## Apply mode — procedure (destructive; hash-verified)

**Step 1 — Locate propose artifact.** Require `--hash <prefix>` (8+ hex chars). Glob `.hd/propose-<prefix>*.json`:
- Zero matches → abort: *"No matching propose artifact for `<prefix>`. Run `/hd:compound graduate-propose <topic>` first, or widen the prefix."*
- Multiple matches → abort: *"Ambiguous `<prefix>` — matched N files. Re-invoke with a longer prefix."*
- Exactly one match → continue. This decouples Apply from conversation context: a propose from a prior / compacted session still works.

**Step 2 — Read structured inputs from the artifact.** Load `title`, `paths`, `date`, `author`, `diff_summary`, `canonical_string`, `sha256` from the JSON. No reconstruction from conversation.

**Step 3 — Re-run `compute-plan-hash.sh`.** Feed the artifact's structured fields back through the script:

```bash
jq '{title, paths, date, author, diff_summary}' .hd/propose-<prefix>.json \
  | skills/hd-compound/scripts/compute-plan-hash.sh
```

**Step 4 — Compare.** Fresh hash vs artifact's stored `sha256`, byte-for-byte.

**Step 5a — Match: atomic writes.**
1. Append to `AGENTS.md` under "Graduated rules": `- [YYYY-MM-DD] <rule>. Source: <primary lesson path>`
2. Prepend to `docs/knowledge/graduations.md` above the "Add new graduations above this line" marker: proposed entry body

Both writes use temp file + `mv` (atomic on POSIX). If second write fails, roll back first: `git checkout HEAD -- AGENTS.md`.

**Source lesson file(s) are NEVER touched.** History is sacred.

**Step 5b — Mismatch: abort with drift diagnosis.**
```
Hash mismatch.
Expected (from artifact): <stored-sha256>
Computed (fresh):         <current-sha256>
The plan input has drifted since propose (likely: one of the source files or
targets changed, or the artifact was hand-edited). Re-run
`/hd:compound graduate-propose <topic>` to regenerate the plan + hash.
```

**Step 6 — Cleanup.** On successful apply, move the artifact:

```bash
mkdir -p .hd/applied
mv .hd/propose-<prefix>*.json .hd/applied/
```

Keeps a receipt trail for audit while clearing the "pending" slot.

**Step 7 — Post-write verify.** `git status` should show exactly 2 modified tracked files (AGENTS.md, docs/knowledge/graduations.md). Untracked `.hd/applied/…` entry is fine. Any other tracked diff → roll back + abort with integrity error.

**Step 8 — Summarize.**
```
Graduated: "<rule text>"
Source lesson preserved: <path>
AGENTS.md updated; graduations.md updated.
Artifact archived: .hd/applied/<prefix>.json
Next: commit + optional `/hd:review audit` to check the harness with new rule.
```

## What this skill does NOT do

- **Concept questions** → `/hd:onboard`
- **Harness scaffolding** → `/hd:setup`
- **Harness audit** → `/hd:review`
- **Modify source lessons** — Layer 5 is append-only
- **Apply graduations without plan-hash** — refusal is structural

## Coexistence

- ✅ Writes ONLY to `docs/knowledge/lessons/` (capture) or `AGENTS.md` + `docs/knowledge/graduations.md` (apply)
- ❌ Never writes to `docs/solutions/` (compound's namespace)
- ❌ Never writes to `docs/design-solutions/` in this release (reserved for post-release)
- ✅ Cross-plug-in Task calls fully-qualified: `Task compound-engineering:research:learnings-researcher(...)`

## Compact-safe mode

- Capture → skip Step 2 (lesson-retriever); no research phase
- Propose → skip nothing (hash computation is non-optional)
- Apply → skip nothing (hash verification is mandatory)

## Reference files

- [references/lesson-patterns.md](references/lesson-patterns.md) — YAML schema + body structure + anti-patterns
- [references/graduation-criteria.md](references/graduation-criteria.md) — 3-criterion rule + clean-imperative test
- [references/plan-hash-protocol.md](references/plan-hash-protocol.md) — SHA-256 proof-of-consent spec + canonical format

## Scripts

- [scripts/compute-plan-hash.sh](scripts/compute-plan-hash.sh) — deterministic canonical-string + SHA-256 builder (JSON stdin or flags). Reference implementation for Propose Step 6 and Apply Step 3.

## Assets

- [assets/lesson.md.template](assets/lesson.md.template)
- [assets/graduation-entry.md.template](assets/graduation-entry.md.template)

## Sub-agents invoked

- `design-harnessing:research:lesson-retriever` — Phase 1 research (capture, optional)
- `design-harnessing:analysis:graduation-candidate-scorer` — cluster scoring (propose, required)
