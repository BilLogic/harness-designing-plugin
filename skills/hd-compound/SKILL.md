---
name: hd:compound
description: Captures design lessons and proposes graduations from narrative to rule. Use when capturing a decision or promoting a recurring pattern to AGENTS.md.
argument-hint: "capture | graduate-propose <topic> | graduate-apply --plan-hash <sha>"
---

# hd:compound — maintain your harness (capture + graduate)

## Interaction method

Use `AskUserQuestion` for branching decisions (approve / edit / abort). If unavailable (non-Claude hosts), fall back to numbered-list prompts. **Never write to `AGENTS.md` or `graduations.md` without a verified plan-hash** (F4 safety per [`references/plan-hash-protocol.md`](references/plan-hash-protocol.md)).

## Single job

Append a dated lesson to `docs/knowledge/lessons/` (capture) OR promote a pattern across ≥3 lessons to a rule in `AGENTS.md` (graduate). One skill, two verbs of the MAINTAIN family.

## Mode detection

| User says… / invokes… | Mode | Safety |
|---|---|---|
| "Save this lesson" / `/hd:compound capture` | **capture** | 1 atomic write to lessons dir |
| "Graduate this" / `/hd:compound graduate-propose <topic>` | **propose** (read-only) | 0 writes; emits plan + hash |
| `/hd:compound graduate-apply --plan-hash <sha>` | **apply** (destructive) | Hash-verified writes to AGENTS.md + graduations.md |

Ambiguous → ask. Never auto-dispatch across modes.

## Workflow checklist (copy into your response per mode)

Pick ONE checklist based on detected mode:

### Capture mode

```
hd:compound capture Progress:
- [ ] Step 1: Identify subject + memory type (episodic / decision / preference / ideation / changelog)
- [ ] Step 2: Resolve target file (lessons/<domain>.md, or decisions/preferences/ideations/changelog.md)
- [ ] Step 3: Optional — retrieve relevant past lessons (sub-agent)
- [ ] Step 4: Draft the entry
- [ ] Step 5: Check split threshold (≥ 15 entries → propose sub-domain split)
- [ ] Step 6: Show user the drafted entry + target file; get approval
- [ ] Step 7: Atomic append (preserve existing entries; update INDEX.md)
- [ ] Step 8: Summarize with graduation-candidate signal
```

### Propose mode

```
hd:compound propose Progress:
- [ ] Step 1: Parse topic
- [ ] Step 2: Run graduation-candidate-scorer sub-agent
- [ ] Step 3: Filter to clusters scoring ≥ 3.5 (graduation-ready)
- [ ] Step 4: Draft proposed rule + graduations.md entry per cluster
- [ ] Step 5: Read input files + compute content hashes
- [ ] Step 6: Build canonical hash input (7-line format)
- [ ] Step 7: Compute SHA-256 plan hash
- [ ] Step 8: Emit plan + hash to stdout (no writes)
```

### Apply mode

```
hd:compound apply Progress:
- [ ] Step 1: Parse --plan-hash argument
- [ ] Step 2: Recover propose context (source lessons, rule, entry)
- [ ] Step 3: Re-read all input files (current bytes)
- [ ] Step 4: Re-compute canonical hash input
- [ ] Step 5: Compare with user-provided hash
- [ ] Step 6: On match → atomic writes. On mismatch → abort with drift diagnosis.
- [ ] Step 7: Post-write verification
- [ ] Step 8: Summarize
```

## Capture mode — procedure

**Step 1 — Identify subject + memory type.** Extract from conversation. Classify:
- "What happened during this work?" → **episodic** → `docs/knowledge/lessons/<domain>.md`
- "What did we choose, and why?" → **procedural-chosen** → `docs/knowledge/decisions.md`
- "What taste/workflow call are we standardizing?" → **semantic-taste** → `docs/knowledge/preferences.md`
- "What idea are we exploring / deferring?" → **speculative** → `docs/knowledge/ideations.md`
- "What harness-structural change happened?" → **temporal** → `docs/knowledge/changelog.md`

If thin/ambiguous, ask: *"What's the lesson? Answer in one sentence."* Then: *"Is this (a) episodic what-happened, (b) a decision we made, (c) a preference we hold, (d) an idea to explore, or (e) a harness-structural change?"* Default when unclear: episodic lesson.

**Step 2 — Resolve target file.**

**If episodic (most common):** determine domain:
1. If lesson tags clearly match an existing `lessons/<domain>.md` file → target that file (APPEND mode)
2. Else ask: *"Which domain? Existing: [list from grep lessons/*.md]. Or new domain name (kebab-case)."*
3. If new domain → create `lessons/<new-domain>.md` with YAML frontmatter (`memory_type: episodic`, `domain: <name>`, `split_threshold: 15`)

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

**Step 5 — Check split threshold.** If the target domain file already has ≥ 15 entries, surface to user: *"`lessons/<domain>.md` has N entries (threshold 15). Options: (a) append anyway, (b) split into `lessons/<domain>-<sub>.md` — which sub-domain for this new entry?"*

**Step 6 — Approval.** Show the drafted entry verbatim + target file (append location). User approves (Y), edits (E), or aborts (A). Never write without explicit Y/E.

**Step 7 — Atomic append.** Append the new entry to the target file with a `---` separator between entries. Temp file + `mv`. Preserve existing entries; append only. Update `docs/knowledge/INDEX.md` entry count + last-updated column for this domain.

**Step 8 — Summarize.** Report target file + entry count + graduation-candidate signal (if any). Next-step suggestion: `/hd:compound graduate-propose <topic>` when target file has ≥ 3 entries with shared tags.

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

**Step 5 — Read inputs.** Per [`references/plan-hash-protocol.md`](references/plan-hash-protocol.md) § Hash input format:
- Each source lesson file (sorted alphabetically by path)
- Current `AGENTS.md`
- Current `docs/knowledge/graduations.md`

**Step 6 — Canonical input.** Build the 7-line string per protocol spec (UTF-8, LF-only). Sorting, encoding, and format are load-bearing.

**Step 7 — Hash.** SHA-256 of canonical string → 64 lowercase hex chars.

**Step 8 — Emit.** Stdout output (no writes):

```
## Graduation Plan: <title>

### Sources
- [lesson-slug](path)
- [lesson-slug-2](path-2)

### Proposed rule (append to AGENTS.md § Graduated rules)
> [YYYY-MM-DD] <rule>. Source: <path-to-primary-lesson>

### Proposed graduations.md entry
> [complete entry body]

### Plan hash
`<64-char-hex>`

### To apply
/hd:compound graduate-apply --plan-hash <64-char-hex>
```

**Confirm zero writes.** Run `git status` — should be clean. Re-run propose any time; the hash is tied to current file bytes, so drift will be detected at apply time.

## Apply mode — procedure (destructive; hash-verified)

**Step 1 — Parse argument.** Require `--plan-hash <64-char-hex>`. Validate:
- Missing → abort: *"Missing `--plan-hash`. Run `/hd:compound graduate-propose <topic>` first."*
- Malformed (not 64 hex, mixed case, spaces) → abort with `Expected 64 lowercase hex. Got <N> chars.`

**Step 2 — Recover context.** Propose emitted: title, source lesson paths (sorted), proposed rule, proposed entry, hash. Recovery comes from **conversation context** — user ran propose earlier in the session. If context is lost (compacted, switched chat), abort: *"Can't recover propose context. Re-run graduate-propose."* Never reconstruct from hash alone.

**Step 3 — Re-read inputs.** Read current bytes of each source lesson + current AGENTS.md + current graduations.md. If any lesson YAML now fails schema → drift case (Step 6 will catch via hash mismatch).

**Step 4 — Re-compute canonical input.** Exact same algorithm as propose Steps 5–6. Same sort order, same encoding, same hash computation.

**Step 5 — Compare.** Byte-for-byte vs user-provided `--plan-hash`.

**Step 6 — Match: atomic writes.**
1. Append to `AGENTS.md` under "Graduated rules": `- [YYYY-MM-DD] <rule>. Source: <lesson path>`
2. Prepend to `docs/knowledge/graduations.md` above the "Add new graduations above this line" marker: proposed entry from Step 4 of propose

Both writes use temp file + `mv` (atomic on POSIX). If second write fails, roll back first: `git checkout HEAD -- AGENTS.md`.

**Source lesson file(s) are NEVER touched.** History is sacred.

**Step 6 — Mismatch: abort with drift diagnosis.**
```
Hash mismatch.
Expected: <user-hash>
Computed: <current-hash>
Drift detected in: <file-path>
Re-run `/hd:compound graduate-propose <topic>` to get a fresh plan.
```
Print which specific file's content-hash changed since propose.

**Step 7 — Post-write verify.** Run `git status` — should show exactly 2 modified files (AGENTS.md, graduations.md). Any other diff → roll back + abort with integrity error.

**Step 8 — Summarize.**
```
Graduated: "<rule text>"
Source lesson preserved: <path>
AGENTS.md updated; graduations.md updated.
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

## Assets

- [assets/lesson.md.template](assets/lesson.md.template)
- [assets/graduation-entry.md.template](assets/graduation-entry.md.template)

## Sub-agents invoked

- `design-harnessing:research:lesson-retriever` — Phase 1 research (capture, optional)
- `design-harnessing:analysis:graduation-candidate-scorer` — cluster scoring (propose, required)
