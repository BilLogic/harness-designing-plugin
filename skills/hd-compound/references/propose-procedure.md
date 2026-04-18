---
title: Propose-mode procedure
loaded_by: hd-compound
---

# Propose mode — full procedure (READ-ONLY — writes NOTHING to tracked files)

## Purpose

Step-by-step procedure for `/hd:compound graduate-propose <topic>`: score candidate clusters, draft the rule + graduations.md entry, compute a deterministic plan hash via `scripts/compute-plan-hash.sh`, and persist a `.hd/propose-<prefix>.json` artifact so Apply survives context compaction. No writes to tracked files. Invoked by the propose-mode workflow checklist in `../SKILL.md`.

## Steps

**Step 1 — Parse topic.** From argument or conversation context. If missing, ask: *"Which topic are we graduating? Give me a tag or keyword."*

**Step 2 — Run scorer.** Invoke:

```
Task design-harnessing:analysis:graduation-candidate-scorer(
  lessons_root: "docs/knowledge/lessons/",
  topic_filter: <topic>,
  graduated_log: "docs/knowledge/graduations.md"
)
```

The scorer returns clusters with scores. See [`graduation-criteria.md`](graduation-criteria.md) for the 3-dimension scoring.

**Step 3 — Filter.** Keep clusters scoring ≥ 3.5. If none:

> "Found N matching lessons scoring <3.5. Graduation needs ≥3 occurrences + clean imperative + team agreement. Add more lessons as the pattern recurs."

Abort cleanly. Don't silently proceed.

**Step 4 — Draft rule + entry.** For each ready cluster:
- **Rule text** (for AGENTS.md): `[YYYY-MM-DD] <clean imperative>. Source: docs/knowledge/lessons/<primary-lesson>.md`
- **Graduations.md entry**: per [`../assets/graduation-entry.md.template`](../assets/graduation-entry.md.template) — title, lesson sources list, rule text, reviewed-by (user), date

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

→ Return to [../SKILL.md § propose-mode](../SKILL.md#propose-mode)
