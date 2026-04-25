---
title: Review criteria — Layer 1 (Context)
loaded_by: hd-review review mode (via harness-auditor agent with layer: 1)
---

# Review criteria: Layer 1 — Context Engineering

## Purpose

Criteria for reviewing the Context layer: `docs/context/` structure, always-loaded budget health, coverage of product / engineering / design-system / conventions, and **content quality**. Loaded by `harness-auditor` when dispatched with `layer: 1`.

**Grading principle.** Presence of a file or folder is necessary but not sufficient. Each check emits a 4-level `content_status`:

- `missing` — path absent entirely → p1/p2 depending on check
- `present-but-stale` — path exists but content fails heuristics (empty, template placeholder, broken references, stale dates) → retain check's default severity
- `present-and-populated` — heuristics pass but ≥1 drift signal → p3
- `healthy` — populated + zero drift → pass

## Criteria

### context-coverage

- **Check:** `docs/context/` exists with 4 populated sub-paths: `product/`, `engineering/`, `design-system/`, `conventions/`.
- **Default severity:** p2
- **Content checks (must all pass for `present-and-populated`):**
  - Each sub-path contains ≥1 `.md` file
  - No sub-path contains only template placeholders (files where >50% of non-blank lines are `{{...}}` or `TODO:` markers)
- **Healthy signal:** every expected file under each sub-path exists AND its frontmatter is parseable AND `freshness:` marker (or last-modified within 6 months)

### product-coverage

- **Check:** `docs/context/product/` contains the 6 canonical files — `one-pager.md`, `users-and-personas.md`, `user-journeys.md`, `capability-map.md`, `success-metrics.md`, `glossary.md`
- **Default severity:** p2
- **Content checks:**
  - `one-pager.md` non-empty (≥20 lines) AND mentions the product's name + one-sentence value prop
  - `capability-map.md` contains ≥2 code-path references (e.g. `src/`, `app/`, `components/`) that actually exist on disk
  - `glossary.md` has ≥3 defined terms
- **Stale signal:** `capability-map.md` references code paths that don't exist (repo was refactored, map not updated)

### engineering-coverage

- **Check:** `docs/context/engineering/` contains `system-overview.md` + `tech-stack.md` at minimum; 5 others recommended (`data-model`, `api-surface`, `deployment`, `dev-environment`, `security-and-privacy`)
- **Default severity:** p2
- **Content checks:**
  - `system-overview.md` is non-trivial (≥30 lines of real content)
  - `tech-stack.md` lists actual frameworks / languages present in the repo (cross-check against `package.json` / `Gemfile` / `requirements.txt` / `go.mod` if present)
- **Stale signal:** `tech-stack.md` lists a framework that's been removed from the repo, or misses a major framework that's currently loaded

### design-system-coverage

- **Check:** `docs/context/design-system/` contains the three canonical sub-folders (`styles/`, `foundations/`, `components/`)
- **Default severity:** p2
- **Content checks:**
  - Each sub-folder has ≥1 non-trivial file
  - `components/cheat-sheet.md` (always-loaded) is populated with ≥5 component entries
  - If `components-index.json` exists: valid JSON
- **Stale signal:** `components/inventory.md` references components that don't exist in code

### always-loaded-budget

- **Check:** Always-loaded file set combined ≤200 lines (per `budget-check.sh`)
- **Default severity:** p1
- **Source of truth:** `.agent/loading-order.md` or `loading-order.md` if present; otherwise default set (AGENTS.md + `docs/context/product/one-pager.md` + `docs/context/design-system/components/cheat-sheet.md`)
- **Pass:** budget script returns `always_loaded_ok: true`
- **Fail:** budget script returns `always_loaded_ok: false`

### freshness

- **Check:** L1 files edited within 6 months OR marked `stable: true` in frontmatter
- **Default severity:** p2
- **Content checks:** files older than 12 months without `stable:` marker → flag as stale regardless of git mtime (Git might not reflect real update cadence)

### bloat-detection

- **Check:** no single file >500 lines (split candidate)
- **Default severity:** p2
- **Remedy:** split oversized file along natural boundaries (per-component, per-page, per-section)

### agent-persona-populated

- **Check:** AGENTS.md has populated `## Agent persona` section (role + responsibility + boundary, each non-empty)
- **Default severity:** p2
- **Content checks:**
  - All three sub-sections present
  - No template placeholder residue (`{{TEAM_ROLE}}`, `TODO:` etc.)
  - Each sub-section has ≥1 sentence of real content

### harness-map-populated

- **Check:** AGENTS.md has populated `## Harness map` section covering all 5 layers
- **Default severity:** p2
- **Content checks:**
  - Headings for L1, L2, L3 (agents), L4, L5 all present
  - Under each heading: ≥1 actual file/folder reference that exists on disk
- **Stale signal:** any listed file doesn't exist (orphan pointer)

### post-pivot-freshness

- **Check:** design-system cheat-sheet updated after any product pivot event in `docs/knowledge/changelog.md`
- **Default severity:** p2
- **Stale signal:** changelog records a pivot; cheat-sheet unmodified since

## Output shape

Each check produces:

```yaml
- check: <name>
  status: pass | warn | fail
  content_status: missing | present-but-stale | present-and-populated | healthy
  severity: p1 | p2 | p3
  evidence: "<concrete observation, e.g. file:line or value>"
  recommendation: "<what to do>"
```

## See also

- Parent skill: `../SKILL.md`
- Agent: `../../../agents/analysis/harness-auditor.md` (invoked with `layer: 1`)
- Budget script: `../scripts/budget-check.sh`
- Cross-cutting: `review-criteria-budget.md`, `review-criteria-consistency.md`
- Bloat thresholds: `bloat-detection.md`
