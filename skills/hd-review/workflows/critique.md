# Workflow — Critique work item

**When to use:** `hd:review critique <path-or-url> [--rubric <name>]` OR user says "review this design" / "critique this work item."
**Goal:** apply Layer 4 rubric(s) to a specific work item; emit structured critique per [`../references/critique-format.md`](../references/critique-format.md). **Read-only.** No file writes.

## Progress checklist

```
Critique Progress:
- [ ] Step 1: Parse arguments (work item + optional --rubric filter)
- [ ] Step 2: Identify work-item type
- [ ] Step 3: Load rubric(s) to apply
- [ ] Step 4: Load the work item itself
- [ ] Step 5: Apply rubrics (criterion loop)
- [ ] Step 6: Aggregate + deduplicate findings
- [ ] Step 7: Sort by severity
- [ ] Step 8: Emit structured response per template
- [ ] Step 9: Suggest next step (hd:compound capture if learning emerged)
```

## Step 1 — Parse arguments

Required: work-item identifier (file path, URL, or pasted content).
Optional: `--rubric <name>` filter to apply a single rubric (repeatable for multi-rubric).

Examples:

- `/hd:review critique docs/proposals/q4-buttons.md` → all default rubrics
- `/hd:review critique docs/proposals/q4-buttons.md --rubric accessibility-wcag-aa` → only a11y
- `/hd:review critique --rubric design-system-compliance` (no path) → prompt user for work item

## Step 2 — Identify work-item type

Based on argument:

- Path ending `.md` / `.mdc` → `design-file` (proposals, specs)
- URL starting `https://figma.com` → `figma-frame`
- Path ending `.html` / pasted HTML → `html`
- Path ending `.css` / pasted CSS → `css`
- Path ending `.json` → `token-json` (validate it's actually tokens)
- Pasted diff (multi-line starting `diff --git` or `---`/`+++`) → `pr-diff`

Type determines which rubrics apply — each rubric's `applies_to` field filters relevance.

## Step 3 — Load rubrics

Resolution order:

1. **`--rubric <name>` flag** — explicit. Only that rubric runs. If multiple flags, all listed rubrics run.
2. **`design-harnessing.local.md` `critique_rubrics` field** — team's default rubric set for critique mode. Apply all listed rubrics (filtered by work-item type).
3. **Fallback: all starter rubrics** — `starter-rubrics/accessibility-wcag-aa.md`, `design-system-compliance.md`, `component-budget.md` (filtered by work-item type).

For each resolved rubric file:

1. Read frontmatter — validate `rubric`, `name`, `applies_to` present
2. Check work-item type ∈ `applies_to` — skip rubric if not
3. Load criteria from body

Invalid rubric (missing required frontmatter, malformed YAML) → warn user, skip that rubric, continue with others. Don't abort the whole critique on one bad rubric.

## Step 4 — Load work item

- **Local path** → `Read` the file
- **Figma URL** → invoke Figma MCP if available (`Task figma:get-frame <url>`); if not installed, warn user and abort critique with suggestion: "Install Figma MCP for figma-frame critiques, or paste the exported design as markdown."
- **Pasted content** → user already provided in conversation; use as-is

Large work items (>10K lines): sample relevant sections; note in critique that full coverage not attempted.

## Step 5 — Apply rubrics

Outer loop: for each rubric.
Inner loop: for each criterion in the rubric.

For each criterion:

1. Apply the check (per criterion's `Check` field)
2. Record result: `pass`, `fail`, `warning`, or `skip` (skip if criterion's `Applies to` narrows further than rubric's `applies_to`)
3. On `fail` or `warning` → capture finding with:
   - `severity` (from criterion's `Default severity` or rubric-level `severity_defaults`)
   - `rubric` (slug from frontmatter)
   - `criterion` (slug)
   - `finding` (one-sentence description of what's wrong)
   - `suggested_fix` (one-sentence action)
   - `location` (file:line / selector / figma-node if available)

Pass the work item's full text to the check — don't over-abstract. The criterion's example-pass / example-fail in the rubric file gives the AI enough signal to evaluate.

## Step 6 — Aggregate + deduplicate

After all rubrics applied:

1. Collect all findings into a single list
2. Deduplicate: if two findings from different rubrics have identical `finding` + `location` text, merge (rare)
3. Deduplicate within a rubric: same criterion flagged multiple times for the same location → collapse into one finding with location list

## Step 7 — Sort by severity

Order: P1 first, then P2, then P3. Within same severity, order by rubric slug alphabetically, then by criterion slug.

## Step 8 — Emit structured response

Load [`../templates/critique-response.md.template`](../templates/critique-response.md.template). Fill:

- `{{WORK_ITEM_NAME}}` — basename of path or short-URL identifier
- `{{ONE_PARAGRAPH_SUMMARY}}` — top-level verdict + headline finding
- `{{FINDINGS_YAML}}` — the YAML list from Step 6-7
- `{{PROSE_EXPLANATION}}` — 1-3 paragraphs of narrative
- `{{SUGGESTED_NEXT}}` — concrete next step (see Step 9)

Emit to conversation. **No file writes.** The critique lives as conversation history; if the user wants to preserve it, they run `hd:compound capture` afterward.

## Step 9 — Suggest next step

Pick ONE next-step suggestion:

- **Pattern emerged from critique** (e.g., "marketing-exception happened AGAIN") → "Capture this? Run `/hd:compound capture` — this is the Nth time this pattern appeared."
- **All findings P3** → "Ready for approval."
- **Findings include P1** → "Address P1 findings before approval:" + list
- **Rubric itself seems off** (e.g., generating many false positives) → "Consider reviewing the rubric definition in `docs/context/design-system/<rubric>.md`."

Never suggest `/ce:*` commands.

## Failure modes

- **F1 Work item unreadable** — abort with clear error ("file missing" / "Figma MCP not installed")
- **F2 No rubrics apply** (work item is `token-json`; only a11y rubric is configured → `applies_to` excludes it) — abort with: "No rubrics apply to `token-json` work items. Configure or specify a rubric via `--rubric`."
- **F3 Rubric validation failure** — warn + skip; continue with remaining rubrics
- **F4 All rubrics invalid** — abort with aggregated error
- **F5 Accidental file write attempted** — refuse; critique is strictly read-only

## Coexistence rules

- ✅ Reads work items (user-provided paths/URLs/content) + rubric files
- ❌ **Never writes to disk** — critique is read-only
- If critique surfaces a capture-worthy insight, SUGGEST `/hd:compound capture` but never invoke

## See also

- [../references/critique-format.md](../references/critique-format.md) — output shape
- [../references/rubric-application.md](../references/rubric-application.md) — application mechanism
- [../templates/critique-response.md.template](../templates/critique-response.md.template) — fill-in template
- [../templates/starter-rubrics/](../templates/starter-rubrics/) — shipped rubrics (starter set)
