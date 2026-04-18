---
title: Apply-mode procedure
loaded_by: hd-compound
---

# Apply mode — full procedure (destructive; hash-verified)

## Purpose

Step-by-step procedure for `/hd:compound graduate-apply --hash <prefix>`: locate the persisted `.hd/propose-<hash>.json` artifact, re-run `scripts/compute-plan-hash.sh` against its structured inputs, and — on byte-for-byte match — atomically append to `AGENTS.md` and prepend to `docs/knowledge/graduations.md`. On successful apply, move `.hd/propose-<hash>.json` → `.hd/applied/<hash>.json`. On mismatch, abort with drift diagnosis. Invoked by the apply-mode workflow checklist in `../SKILL.md`.

## Steps

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

→ Return to [../SKILL.md § apply-mode](../SKILL.md#apply-mode)
