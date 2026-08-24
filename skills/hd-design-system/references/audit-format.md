# audit-format — Audit.mdx generation + finding types + suggested-action vocabulary

**Loaded by:** [`SKILL.md`](../SKILL.md) `tracker` mode + [`establish-flow.md`](establish-flow.md) Step 11 + [`evolve-flow.md`](evolve-flow.md) Step 5. Owns: the algorithm that produces `0-welcome/Audit.mdx` from sub-agent `audit_findings` outputs. Implementation lives in [`../scripts/generate-audit.mjs`](../scripts/generate-audit.mjs).

## Purpose

The Audit page surfaces what `code-introspector` and `figma-extractor` found during whole-codebase + Figma scrape: **discrepancies, redundancies, orphan tokens, inline-value candidates, naming inconsistencies, and DS-relevant doc fragments scattered across the codebase**. Each finding includes a suggested action the user can take to resolve it.

Distinct from Tracker.mdx (which is *fill status*). Audit is *content quality*.

## Output location

`docs/context/design-system/0-welcome/Audit.mdx` — auto-generated. Renders at `Welcome / Audit` in Storybook sidebar.

## Finding types

Closed enum — sub-agents emit one of these:

| Type | Meaning | Detected by |
|---|---|---|
| **`discrepancy`** | Same logical token name with different values across ≥2 files | code-introspector (cross-file token diff) + figma-extractor (Figma vs code diff in S-2/S-3 alignment) |
| **`redundancy`** | ≥2 components / variants with near-identical render | code-introspector (JSX shape similarity ≥ 0.85) + figma-extractor (component description similarity) |
| **`orphan-token`** | Token defined but never consumed by any component | code-introspector (Step 1 ∖ Step 2 in walk) |
| **`inline-value`** | Hardcoded hex/px/rgb in component file with no equivalent token | code-introspector (Step 4 hits without Step 1 match) |
| **`naming-inconsistency`** | Token violates the dominant naming pattern in the codebase | code-introspector (variance from majority pattern) |
| **`doc-fragment`** | DS-relevant prose found in unexpected location (random README, inline comment) | code-introspector (Step 3 harvest with classification) |

## Severity model

| Severity | Threshold |
|---|---|
| **high** | discrepancy with mismatched values; redundancy with ≥3 near-identical variants; missing Code Connect for component used in >5 places |
| **medium** | orphan tokens; naming inconsistencies on ≥3 tokens; inline-value with frequency ≥3 |
| **low** | single-occurrence naming inconsistency; doc-fragment classification = TODO |

Sub-agents assign severity at emission time; algorithm preserves it.

## Suggested-action vocabulary

Closed enum:

| Verb | When | Example |
|---|---|---|
| **consolidate** | Multiple defs of same thing | "Drop duplicate in tailwind.config.ts; consume CSS var instead" |
| **pick-canonical** | Discrepancy with no clear winner | "Pick canonical: src/styles/_colors.scss:42 OR Figma var brand-primary" |
| **deprecate** | Legacy variant should be retired | "Mark `Button size='small'` as deprecated; consume `size='medium'`" |
| **tokenize** | Inline value should become a token | "Add `--color-callout-bg: #0066cc` to tokens.css; replace inline hex" |
| **rename** | Naming-convention violation | "Rename `--brand-color-1` → `--color-brand-primary` (matches dominant pattern)" |
| **surface-in-doc** | Doc fragment should be promoted to canonical location | "Move 'Design tokens' section from README.md to 1-foundations/tokens.mdx" |

Each finding has exactly one suggested action with a concrete `target` (file:line or path) + `details` (1-line fix description).

## Generation algorithm

### Phase 1 — Read findings

Sub-agent outputs persist in `index-manifest.json:audit_findings_cache` (keyed by stable hash) so re-runs preserve unresolved findings without re-detection.

```js
const cache = manifest.audit_findings_cache || [];
const newFindings = [...figmaExtractorOutput.audit_findings, ...codeIntrospectorOutput.audit_findings];

// Merge — keep cached findings that are still valid; add new ones; mark resolved if a cached finding
// is not in the new set
const byHash = new Map(cache.map(f => [f.id, f]));
for (const f of newFindings) byHash.set(f.id, f);
const cachedHashes = new Set(cache.map(f => f.id));
const newHashes = new Set(newFindings.map(f => f.id));
for (const oldId of cachedHashes) {
  if (!newHashes.has(oldId) && !byHash.get(oldId).resolved_at) {
    byHash.get(oldId).resolved_at = new Date().toISOString();
  }
}
const allFindings = [...byHash.values()];
```

### Phase 2 — Group + sort

```js
const byType = groupBy(allFindings, 'type');
for (const type of Object.keys(byType)) {
  byType[type].sort((a, b) => severityRank(b.severity) - severityRank(a.severity));
}
```

### Phase 3 — Render

```mdx
import { Meta } from '@storybook/blocks';
import { AuditFinding } from '../../../.storybook/harness-blocks';

<Meta title="Welcome/Audit" />

# Audit findings

Generated {{TIMESTAMP}} · {{ACTIVE_COUNT}} active · {{RESOLVED_COUNT}} resolved

{{IF_EMPTY}}
✅ No findings — your DS is clean. Run `/hd:design-system evolve` after changes to re-scan.
{{/IF_EMPTY}}

{{#each FINDING_TYPES_PRESENT}}
## {{TYPE_TITLE}} ({{COUNT}})

{{#each FINDINGS_OF_TYPE}}
<AuditFinding
  type="{{type}}"
  severity="{{severity}}"
  subject="{{subject}}"
  locations={{LOCATIONS_JSON}}
  evidence={{EVIDENCE_JSON}}
  suggestedAction={{SUGGESTED_ACTION_JSON}}
/>
{{/each}}
{{/each}}

## Resolved findings ({{RESOLVED_COUNT}})

<details><summary>Show resolved</summary>

{{#each RESOLVED_FINDINGS}}
- ~~{{type}}: {{subject}}~~ — resolved {{resolved_at}}
{{/each}}

</details>

---

*Run `/hd:design-system evolve` to re-scan. Each suggested action button opens the relevant file or writes a TODO.*
```

`{{TYPE_TITLE}}` substitutes:
- discrepancy → "Discrepancies"
- redundancy → "Redundancies"
- orphan-token → "Orphan tokens"
- inline-value → "Inline value candidates (tokenize)"
- naming-inconsistency → "Naming inconsistencies"
- doc-fragment → "Doc fragments to surface"

### Phase 4 — Write back to manifest

Write the merged `audit_findings_cache` back to `index-manifest.json` so the next invocation starts from current state.

## `<AuditFinding>` block — what it renders (humans)

See [`harness-blocks.md` § AuditFinding](harness-blocks.md). Each finding renders as a card with:
- Type tag (color-coded by severity)
- Subject line
- Severity badge
- Clickable file:line list (opens via `vscode://file/...`)
- Optional side-by-side preview (for redundancies — two component renders next to each other)
- Optional value comparison (for discrepancies — two values side by side with hex/value diff)
- "Suggested action" button → click opens file at line OR writes a `<!-- TODO: <action details> -->` comment in the target file (depending on action verb)

## Stable hash (id)

Each finding has `id = sha1(type + ':' + subject + ':' + sorted_evidence_keys.join(','))`. Stable across re-runs so resolved findings stay tracked.

When the underlying issue is fixed, the next sub-agent run won't emit that finding → algorithm marks it resolved.

## Action handlers (Storybook MDX → action)

When a user clicks a suggested-action button in Storybook, what happens depends on the verb:

| Verb | Click handler |
|---|---|
| `consolidate` | Opens `target` file at line |
| `pick-canonical` | Opens both candidate files in a side-by-side diff (when supported by IDE) |
| `deprecate` | Writes `// @deprecated` JSDoc into target component |
| `tokenize` | Writes `<!-- TODO: tokenize <value> -->` comment in target file |
| `rename` | (Manual — opens both old and new locations) |
| `surface-in-doc` | Writes `<!-- TODO: surface fragment from <source> -->` in target `.mdx` |

These are best-effort — Storybook in browser can't actually edit files. The button copies a CLI command to the clipboard (e.g., `code -g src/styles/_colors.scss:42`) for the user to paste.

## When this file is regenerated

- After every `establish` finalize (Step 11) — initial findings
- After every `evolve` finalize (Step 5) — diff vs cached findings
- On explicit `/hd:design-system tracker` invocation (regenerates both Tracker and Audit)
- Never on PostToolUse — too aggressive

## Integration with /hd:review

`/hd:review l1` reads Audit.mdx as part of the L1 health check. High-severity unresolved findings count as drift signals.

## Source references

- DS archaeology spec: plan Architecture § "DS archaeology (whole-codebase scan)"
- Sub-agent output schema: [`code-introspector.md` § Result schema](../../../agents/research/code-introspector.md) + [`figma-extractor.md` § Result schema](../../../agents/research/figma-extractor.md)
- Renderer implementation: [`../scripts/generate-audit.mjs`](../scripts/generate-audit.mjs)
- AuditFinding block: [`harness-blocks.md`](harness-blocks.md)
