# status-frontmatter — schema + transitions for harness `.mdx` status

**Loaded by:** [`hd-design-system/SKILL.md`](../../hd-design-system/SKILL.md) (writes + reads), [`hd-review/SKILL.md`](../../hd-review/SKILL.md) (reads), [`hd-design-system/scripts/validate.mjs`](../../hd-design-system/scripts/validate.mjs) (validates), [`hd-design-system/references/tracker-format.md`](../../hd-design-system/references/tracker-format.md) (renders).

This is a **cross-skill shared reference**. Lives in `hd-setup/references/` because `hd-setup` is the skill the harness initially scaffolds via, and the convention applies repo-wide. All hd-* skills read/write this frontmatter on `.mdx` files under `docs/context/design-system/`.

## Schema

Every `.mdx` file under `docs/context/design-system/` carries a YAML frontmatter block at the very top:

```yaml
---
status: empty | placeholder | in-progress | filled
last_filled: <ISO date>
todos: <non-negative integer>
---
```

Fields:

| Field | Type | Required | Notes |
|---|---|---|---|
| `status` | enum string | yes | One of 4 values; see § Status transitions below |
| `last_filled` | ISO date string | yes (when status != empty) | YYYY-MM-DD or full ISO. The date the file was last meaningfully written or reviewed |
| `todos` | non-negative integer | yes | Count of `<!-- TODO` markers in the file body |

Optional additional fields (not enforced):
- `owner` — string, single owner email or handle
- `last_reviewed` — ISO date, distinct from last_filled (review without write)

## Status enum

| Value | Meaning | Set by | Display |
|---|---|---|---|
| `empty` | File doesn't exist OR has zero content beyond this frontmatter | (rare — usually file is missing instead) | ⬜ |
| `placeholder` | Template scaffolded; all sections still TODO | `establish` writes this on initial scaffold | 📋 |
| `in-progress` | Some TODOs cleared, some remain | Auto-set when `validate` sees todos drop AND last_filled present | 🟡 |
| `filled` | 0 TODOs remaining; ready for use | Auto-set when todos == 0 AND user manually confirms (or validate auto-confirms after 24h with no churn) | ✅ |

The 4 emojis are used **everywhere** the status is displayed — Tracker.mdx · MDX banner injected by `<HarnessStatusBanner>` · `/hd:review` health bars · post-setup-summary hook output.

## Status transitions

```
[file doesn't exist]  →  empty
                          ↓ (establish writes file)
                       placeholder         (status: placeholder, todos: <count>)
                          ↓ (user removes some <!-- TODO --> markers AND saves)
                       in-progress         (status: in-progress; auto-set by validate when todos drops AND > 0)
                          ↓ (user removes last <!-- TODO -->)
                       filled              (status: filled; auto-set when todos == 0; user can also manually set)

  evolve mode can re-introduce TODOs:
  filled  ←→  in-progress  (when evolve diff adds new TODOs)
```

Special cases:
- **`status: deprecated`** (extension) — used by `evolve` when a component is removed from source. File stays on disk; user reviews + decides to delete eventually. NOT in the canonical 4-enum.

## Auto-update rules per skill

| Skill | Reads | Writes |
|---|---|---|
| **hd-setup** (voice authoring step) | (n/a — voice authoring writes to AGENTS.md, not docs/context/design-system) | (n/a) |
| **hd-design-system: establish** | (n/a — initial write) | sets `status: placeholder` for all written files; `last_filled = now()`; `todos = count of TODO markers in template after substitution` |
| **hd-design-system: evolve** | reads existing frontmatter | preserves status when content unchanged; updates last_filled when content changed; recomputes todos; status → in-progress if todos > 0 |
| **hd-design-system: tracker** | reads only — never writes | (writes only Tracker.mdx + Audit.mdx, not status frontmatter) |
| **hd-design-system: validate** | reads to check schema | optionally rewrites status (when --auto-fix flag); else just reports |
| **hd-review l1** | reads to compute health bars | does not write |
| **hd-maintain** | (n/a — works on AGENTS.md and lessons) | (n/a) |

## How `<HarnessStatusBanner>` reads frontmatter

The banner block is injected by `HarnessDocsContainer` (Storybook decorator). At render time, it parses the page's source `.mdx` frontmatter (via Storybook's `parameters.docs.metadata`) and renders:

```
[STATUS_EMOJI] Harness status: <status> · last filled <date> · <N> TODOs remaining
```

Color-coded:
- ⬜ empty → gray
- 📋 placeholder → tan/yellow
- 🟡 in-progress → yellow
- ✅ filled → green

## Validation rules (enforced by `/hd:design-system validate`)

See [`hd-design-system/references/validate-rules.md`](../../hd-design-system/references/validate-rules.md):

- `frontmatter-present` (HIGH) — every `.mdx` has frontmatter
- `frontmatter-status-enum` (HIGH) — status is one of the 4 valid values
- `frontmatter-todos-int` (MEDIUM) — todos is a non-negative integer

## Inferring status when frontmatter is missing or stale

`tracker-format.md` Phase 2 + `validate.mjs`'s --auto-fix flag use this inference:

```js
function inferStatus(file, content) {
  if (!fileExists(file)) return 'empty';
  const todos = countTodoMarkers(content);
  if (todos === 0) return 'filled';
  if (frontmatter.last_filled) return 'in-progress';
  return 'placeholder';
}
```

`countTodoMarkers(content)` matches `<!-- TODO` (HTML comment style). Doesn't match inline `// TODO` in code blocks (those are code-side TODOs).

## Why YAML frontmatter (not separate manifest)

Frontmatter is co-located with the file content. Editing the file (adding/removing TODOs) updates status in the same commit — no separate manifest to keep in sync. Carbon-style single-MDX architecture.

The cross-file aggregate (Tracker.mdx) is regenerated from frontmatter on demand — never edited by hand.

## Source references

- Renderer: [`<HarnessStatusBanner>` block](../../hd-design-system/references/harness-blocks.md)
- Validation: [`validate-rules.md`](../../hd-design-system/references/validate-rules.md)
- Tracker generation: [`tracker-format.md`](../../hd-design-system/references/tracker-format.md)
