# evolve-flow — re-extract + diff + selective update

**Loaded by:** `SKILL.md` mode router when `mode == "evolve"`. Owns: re-extraction, diff vs current `.mdx`, per-file user gates, selective writes. Reuses [`establish-flow.md`](establish-flow.md) folder-loop machinery — only the per-file logic differs (diff vs preview).

## When to run

- Components added/removed in code since last establish
- Tokens renamed or restructured
- New brand or mode added
- Figma file restructured
- User explicitly wants to re-sync after manual edits

## Pre-conditions

- `index-manifest.json` exists at `docs/context/design-system/` (skill error-exits otherwise)
- `hd-config.md` present at repo root
- Repo writable

## Procedure

### Step 0 — Re-detect scenario

Re-run `detect.py` (or read `signals.design_system_scenario` from `hd-config.md` if recently updated). If scenario CHANGED since last establish (e.g., team added Figma since `code-only` setup):

> *"Scenario changed: was `code-only`, now `code-and-figma`. Want to do a fresh `establish` instead of `evolve`? (`evolve` is incremental; `establish` re-walks all folders.)"*

If user picks fresh establish → exit and dispatch `/hd:design-system establish`. Else proceed with evolve.

### Step 1 — Re-run sub-agents

Per current scenario, re-run:

| Scenario | Agents |
|---|---|
| `starter` | (no extractors — evolve only useful when there's a real source. Tell user to run establish if they've adopted code/Figma since.) |
| `figma-only` | `figma-extractor` |
| `code-only` | `code-introspector` |
| `code-and-figma` | `figma-extractor` ‖ `code-introspector` (parallel) |

Pass `context: "evolve"` so sub-agents know they're producing diffs against existing content (subtler audit findings, more conservative re-classification).

### Step 2 — Diff per folder

For each folder where the user has existing `.mdx` files:

```
2.1  Read every existing .mdx in folder; parse frontmatter + extract embedded data (tokens consumed,
     variant axes, etc.) per template-aware parser
2.2  Compare against extractor output:
     - Tokens: match by name; flag value drift, new tokens, deleted tokens
     - Components: match by name; flag new variants, removed variants, prop signature changes
     - Patterns: rare but possible — match by name
2.3  Compose per-file change record:
     {
       file: "4-components/button.mdx",
       change_type: "modified" | "added" | "deleted-from-source",
       diff_summary: ["+ variant: 'destructive'", "- prop: deprecated 'small'"],
       audit_findings_delta: [...]
     }
```

### Step 3 — Per-folder gate

For each folder with non-empty change record:

```
3.1  Show the change summary table:
       | File | Change | Diff summary |
       |---|---|---|
       | components/button.mdx | modified | +1 variant, -1 prop |
       | components/badge.mdx  | added    | new component       |
       | components/legacy.mdx | deleted-from-source | code removed |
3.2  Ask:
       - Approve all  →  apply all changes in folder
       - Edit per-file → loop through each change record:
           - Show full diff
           - Approve | edit | skip
       - Skip folder  →  no writes; folder marked as 'pending evolve'
3.3  On approve, apply selectively:
       - 'modified' files → write new .mdx (status frontmatter updated: status='in-progress' if any new TODOs added)
       - 'added' files → write new .mdx (status='placeholder')
       - 'deleted-from-source' files → mark status='deprecated' in frontmatter; do NOT delete file (user decides eventually)
```

### Step 4 — components-index.json update

After all approved component changes are written, regenerate `components-index.json` from the final state. Keep `tokens_consumed[]` patterns up-to-date.

### Step 5 — Audit page update

Sub-agent emitted new `audit_findings`. Compare against existing `Audit.mdx`:

- New findings → add to Audit.mdx
- Resolved findings (id in existing Audit.mdx but not in new audit_findings) → mark as resolved (strikethrough + "resolved YYYY-MM-DD")
- Unchanged findings → kept as-is

### Step 6 — Tracker update

Run `scripts/generate-tracker.mjs`. The Tracker auto-reflects status frontmatter changes from Step 3.

### Step 7 — Summary

Print:
```
✓ /hd:design-system evolve complete
  modified:   N files
  added:      N files
  deprecated: N files (still on disk; review before deleting)
  audit:      +X new findings, -Y resolved
  next:       /hd:review l1   # validate before commit
```

## Diff specifics — variant changes

When a component's variant set changes:
- New variant → add row to Types table; flag with `<!-- NEW: confirm Decisions/Rationale -->` comment
- Removed variant → mark in Decisions section as deprecated; keep variant table row with strikethrough

## Diff specifics — token value drift

When a token's value changed:
- Update the value in the .mdx Reference table
- If the change affects ≥3 components, surface as a high-severity audit finding

## Conservative writes

Evolve mode is conservative by default:
- Never deletes files automatically (only marks `status: deprecated`)
- Never overwrites manually-edited Decisions / Rationale / Agent prompt guide sections (preserves user authorship; only updates auto-extractable sections like Types, Theming, API)
- Diff-aware writes — only touch sections that actually changed

To detect "manually edited" sections: each section gets a `<!-- auto-extracted: true -->` HTML comment when written. Sections without that marker are treated as user-authored and preserved.

## Failure modes

- **Sub-agent times out** — proceed with partial diff; mark missing folders as `pending` in scaffold_progress
- **Diff finds drift in 100% of files** — likely scenario change; suggest establish instead of evolve
- **User cancels** — preserve what's approved; rest can resume next invocation

## Source references

- Establish-flow folder-loop reuse: [`establish-flow.md`](establish-flow.md)
- Sub-agents: [`figma-extractor`](../../../agents/research/figma-extractor.md) · [`code-introspector`](../../../agents/research/code-introspector.md) — both accept `context: "evolve"`
- Audit findings: [`audit-format.md`](audit-format.md)
