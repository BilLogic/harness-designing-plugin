---
title: "feat: Phase 3o — universal tool discovery (shrink whitelist, scout classifies)"
type: feat
status: active
date: 2026-04-21
phase: 3o
deepened: 2026-04-21
---

# feat: Phase 3o — universal tool discovery

## Enhancement Summary

**Deepened on:** 2026-04-21 via `/ce:deepen-plan` (4 parallel research + review agents)

### Headline findings

1. **Layer C (curated top-20) is a coupling hazard, not an optimization.** Architecture reviewer + simplicity reviewer agree: maintaining a parallel `CATEGORY_PATTERNS` dict alongside scout's cache creates two sources of truth that can diverge. **Revised design: seed the scout cache with ~20 household names pre-populated; delete the parallel dict.** One list, one code path.
2. **Don't bump schema v5 → v6 for additive-only change.** Schema-versioning research flags this as over-signaling. Kubernetes / dbt / GitHub Actions use integer versions where additive changes don't bump — readers assume breakage when the integer changes. **Revised: stay at `schema_version: "5"` OR adopt `"5.1"` semver-minor.** Add a 4-line backward-compat contract in `hd-config.md` header.
3. **7 units → 3 units.** Simplicity review surfaces several vestigial pieces: config-file enumeration is speculative (most tools have their dep in `package.json` anyway); pyproject/Gemfile/Cargo mention invites scope creep; batch-classify is two layers of concurrency for v1 (existing parallel-Task pattern suffices); denylist is the same linear-with-ecosystem anti-pattern we're rejecting.
4. **Pre-classifier deterministic rules before LLM.** Best-practices research: cheap signals often suffice (package.json `bin` field = CLI; `keywords` array; `description` keyword match; GitHub topics). LLM-as-fallback, not frontline. Saves tokens + improves determinism.
5. **Cache-row schema needs provenance.** Architecture reviewer: "correct a wrong cache entry" is blind without `classified_at`, `source`, `confidence`, `classifier_version`, `source_sha`. Cache rows must be auditable.
6. **Multi-label output.** Supabase is both CLI and data_api — don't collapse to single category. Emit `{primary, secondary[], all[]}`.
7. **Structured output + category enum.** LLM classifier best practice: constrain decoding with explicit category enum + 1-sentence definitions inline. Always include `uncategorized` escape hatch; no forced hallucination.

### Revised scope (applied below)

**Cut:**
- ~~Unit 3o.1~~ (shrink `CATEGORY_PATTERNS`) → Replaced with "seed scout cache with top-20" (folded into new 3o.2)
- ~~Unit 3o.4~~ (Path A.2 sub-path narration) → collapsed into 3o.3 (scout classify becomes the only classification path)
- ~~Unit 3o.5~~ (scan-summary narration update) → one-line tweak in Step 3, folded into 3o.3
- ~~Unit 3o.6~~ (4 bug fixes) → **split out as Phase 3o.5 small fix batch** — not coupled to architectural shift
- ~~`raw_signals.configs` enumeration~~ → **cut**; enumerate `deps` + `urls` only. Config-file-only tools (rare) deferred.
- ~~pyproject / Gemfile / Cargo parsing~~ → **cut from scope** (not "future work" — out of phase entirely)
- ~~Denylist machinery~~ → **cut**; scout returns `framework-internal` classification instead. Same cache, self-populating.
- ~~Scout batch-classify interface~~ → **cut**; single-signal classify, caller parallelizes via existing ≤5 Task-batch convention.
- ~~Schema bump to v6~~ → **cut**; stay at v5 OR adopt `"5.1"` minor. Adds compat contract to template header.

**New refinements:**
- Scout's `classify` mode must include: structured output enum, primary+secondary category labels, confidence score, deterministic pre-classifier rules before LLM call.
- Cache row schema: `{tool_name, categories: {primary, secondary[]}, classified_at, classifier_version, source: web|curated|manual, confidence, source_sha, integrations: {mcp?, cli?, api?}}`.
- Hard ceiling for large-repo classify batches (e.g., ≥50 raw signals) — user confirms before fanning out.
- Degraded mode when web search unavailable: return `category: "unknown"` + offer paste-organize as fallback path (no "interactive tagging UX" — reuse existing path B).

### Research agents used
- `compound-engineering:research:best-practices-researcher` — LLM classifier + cache patterns (Anthropic Classification Cookbook, Hamel Husain evals, Simon Willison llm-classify, Tian et al. 2023 calibration)
- `compound-engineering:research:framework-docs-researcher` — YAML schema evolution (K8s, dbt, GitHub Actions deprecation patterns)
- `compound-engineering:review:architecture-strategist` — A/B/C split review (strengths + seam risks + simpler alternative)
- `compound-engineering:review:code-simplicity-reviewer` — YAGNI pass (7 → 3 units, delete Layer C, narrow configs, cut denylist + batch mode)

### Confidence signal
Two independent reviewers (architect + simplicity) both flagged Layer C as redundant via different reasoning — high confidence on that cut. Schema reviewer was unambiguous on the v6 bump. Classifier-pattern research was direct prescription, not judgment call.

## Overview

Phase 3n shipped 8 units including schema v5 with `cli[]` + `data_api[]` categories, detected via hardcoded regex + config-file probes in `detect.py`. A 4-repo dry-run test (Lightning, cornerstone, caricature, Oracle Chat) surfaced ≥4 false-negatives in the first day of real use: **netlify** missed despite `netlify.toml`, **AWS Amplify** missed despite `@aws-amplify/auth` in deps, **GraphQL-codegen** missed, **vercel-via-script-name** missed. The fix path proposed in that session was "add more regex entries" — but every new tool shipping = another P2 bug. The whitelist scales linearly with ecosystem size; ecosystem is effectively infinite.

Phase 3o replaces the whitelist architecture with a **research-time classification** model: `detect.py` enumerates raw signals (deps, configs, URLs) without categorization; `ai-integration-scout` gains a `classify` mode that categorizes any signal on demand, cache-first + web-search fallback. A small curated top-20 stays for out-of-box UX (no scout round-trip for household-name tools); everything else flows through scout naturally.

## Problem Statement / Motivation

**Whitelist scales linearly; research scales with usage.** The whitelist approach requires the plug-in maintainer to know about every ecosystem tool before users encounter them. That's impossible — an estimated 10,000+ npm packages plus thousands of SaaS tools plus every internal company API. Maintenance burden grows unboundedly; coverage remains ~20%.

**Every whitelist miss is user-visible drift.** The 4-repo test in this session found misses in well-known tools after just one day of use. At shipping velocity, we'd be patching the detector weekly forever.

**Research scales with real usage.** The scout pattern shipped in 3n.3 already has the right shape — cache-first, web-search fallback, writes back to cache. Extending it to classification means the cache grows with every real user invocation. After ~50 user runs, the top 100 tools are cached; after ~500 runs, the long tail is covered.

**4 repos confirmed the principle:**
- Lightning: netlify (missed), firebase ✓, supabase ✓
- cornerstone: AWS Amplify (missed), GraphQL-codegen (missed), sentry ✓, linear ✓
- caricature: supabase ✓ (but double-registered), markdown-todos (false positive)
- Oracle Chat: supabase ✓, radix a11y ✓ — but `.claude/settings.local.json` alone flagged as meta-harness (too-thin signal)

Net: whitelist approach fails on ≥4 real tools across 4 repos in 1 day. This is a structural problem.

## Proposed Solution

Three-layer split:

**Layer A — Deterministic signal enumeration** (`detect.py`, rewritten)
- Enumerate `package.json` (+ `pyproject.toml` + `Gemfile` + `Cargo.toml`) dependencies + devDependencies
- Enumerate root-level config files by filename pattern (`*.toml`, `*.config.{js,ts,cjs,mjs}`, `.*rc`, non-trivial `*.json`)
- Enumerate external URL signals (existing URL regex logic — **kept** for docs/design/pm/comms categories where URLs ARE the primary signal)
- Emit new `raw_signals: { deps: [...], configs: [...], urls: [...] }` alongside `team_tooling`
- No category assignment for deps/configs — that's Layer B's job

**Layer B — Research-time classification** (scout, extended)
- Scout gains `mode: classify` alongside existing tool-research mode
- Input: `dep_name | config_filename` + optional `context: "l1"|...|"l5"`
- Procedure: (1) check `known-mcps.md` cache for categorized entry → return cached; (2) if miss, web-search for `<name> purpose what does <name> do`, classify into one of: `cli`, `data_api`, `analytics`, `observability`, `auth`, `not-ai-relevant`, etc; (3) if AI-relevant, follow-up research for MCP/CLI/API integration; (4) write categorized entry back to cache
- Batch-parallel interface: classify up to 5 raw signals in one dispatch
- Output: `{ tool_name, category, ai_relevant: bool, mcp?, cli?, api?, install_docs? }`

**Layer C — Curated top-20 (fast path)**
- Keep `CATEGORY_PATTERNS["cli"]` + `["data_api"]` trimmed to ~20 household-name entries each (not the sprawling list)
- Purpose: first-run UX without scout round-trip for recognized tools
- Criteria for inclusion: (a) ecosystem top-50 by adoption, (b) stable config-file signal, (c) high-confidence category assignment
- Starting set: notion, figma, linear, github, supabase, firebase, vercel, netlify, stripe, sentry, slack, amplitude, mixpanel, posthog, aws_amplify, hasura, airtable, sanity, contentful, confluence, ... (tune to ~20 total across all categories)
- Anything outside this list falls through to Layer B on first encounter

### UX flow after 3o

Step 3 scan-summary becomes:

> *"Scanned. Recognized: `notion, figma, supabase, firebase, netlify` (top-20 fast-path). Also found 23 other deps + 8 config files — want me to research integrations for any? Type names or say 'all'."*

At per-layer EXECUTE, Path A (wire-up-a-tool) can dispatch scout in `classify` mode for a batch of uncategorized raw signals:

```
Task design-harnessing:research:ai-integration-scout(
  mode: "classify",
  signals: ["aws_amplify", "@graphql-codegen/cli", "@genql/runtime", "msw"],
  context: "l1"
)
```

Returns categorized findings inline; user picks which to wire up.

## Technical Considerations

**Schema migration.** `schema_version: "5"` → `"6"` (additive, backward-compat). v5 configs parse clean under v6; new `raw_signals` field defaults to `null` when absent. The shrink of `CATEGORY_PATTERNS` **also** needs to handle: some tools currently in `cli[]` + `data_api[]` from v5 detection should continue to detect. Verify the top-20 covers v5's existing detection; anything being dropped from v5 whitelist falls to scout at classification time.

**Performance.** Layer A stays fast (regex + filesystem probes — no LLM). Layer B dispatches scout only when user opts in; batch-parallel ≤5. First-run scout-cache is empty; warms up over sessions. No performance regression vs 3n for cached tools.

**Determinism.** Layer A is deterministic (same inputs → same outputs). Layer B has LLM classification variance, but writes authoritative cache entries so subsequent runs are deterministic.

**Backward compatibility.** v5 `hd-config.md` files parse clean under v6. Existing `team_tooling.cli[]` + `team_tooling.data_api[]` stay populated from Layer C (top-20). `raw_signals` is new + additive.

**Host-agnostic.** Scout's classify mode uses the same web-search tool the existing scout uses. No new host capability required.

## System-Wide Impact

- **Interaction graph:** `detect.py` → Phase A → Step 3 scan-summary (unchanged) → per-layer EXECUTE fill-path Path A now has a richer payload (raw_signals + top-20 matches) + scout-classify batch dispatch.
- **Error propagation:** scout classify miss (web-search unavailable) → signal stays uncategorized; user can still manually categorize via paste-organize or skip. No blocking failures.
- **State lifecycle:** cache writes on successful classification are additive (append rows to `known-mcps.md`); never overwrite existing rows. Cache grows monotonically.
- **API surface parity:** scout existing mode (tool-research for named tool) continues to work unchanged. New classify mode is additive.
- **Integration test scenarios:**
  1. Lightning repo post-3o: raw_signals enumerates `["next", "firebase", "@supabase/supabase-js", "netlify-cli", "@sentry/nextjs", ...]`; top-20 catches firebase + supabase + netlify + sentry; scout-classify batch resolves any remainder.
  2. cornerstone post-3o: `@aws-amplify/auth`, `@graphql-codegen/cli`, `genql` get classified on first invocation; cache entries land at `known-mcps.md`; second run reads from cache.
  3. Novel internal tool (e.g., company-internal `@acme/data-platform`): scout classifies as `data_api` with `mcp: null, cli: null, api: { docs_url: null }` → records pointer-only cleanly.

## Implementation Units (revised after /ce:deepen-plan)

**Revised structure:** 3 core units (3o.1, 3o.2, 3o.3) ship the architectural shift. Unit 3o.4 captures the lesson. Unit 3o.5 is a separate small-fix batch for non-architectural bugs from the 4-repo test (decoupled from 3o's risk; ship independently).

### Unit 3o.1 — Delete `CATEGORY_PATTERNS` cli/data_api + emit `raw_signals.deps`

**Goal.** Stop maintaining parallel category classification in `detect.py`. Emit raw dependency list; let scout handle classification.

**Files.** `skills/hd-setup/scripts/detect.py`.

**Approach.**
1. **Delete** `CATEGORY_PATTERNS["cli"]` and `CATEGORY_PATTERNS["data_api"]` entirely. Delete `CONFIG_FILE_SIGNALS` (the filesystem-existence hook for cli/data_api tools). Keep URL-pattern categories (docs/design/diagramming/analytics/pm/comms) **unchanged** — those aren't the scalability problem.
2. Emit new `raw_signals: { deps: [...], urls: [...] }` top-level field. `deps` enumerates `package.json` dependencies + devDependencies (merged, deduped, sorted). `urls` is a flat list of URLs caught by existing URL-pattern scan.
3. **No config-file enumeration** (cut per simplicity review — rare case, deferred).
4. **No pyproject/Gemfile/Cargo** (cut per simplicity review — out of phase).
5. **No denylist** (cut per simplicity review — scout classifies `framework-internal` on first encounter, caches).
6. Schema stays at `"5"` (K8s-style integer-versioning; additive doesn't bump per 3o deepen research). Or adopt `"5.1"` if signaling additive clearly matters.

**Patterns to follow.** Existing `detect_team_tooling()` structure. Reuse existing SKIP_DIRS conventions. Sort + dedupe deps for deterministic output.

**Verification.** `detect.py` on Lightning emits `raw_signals.deps` including `next`, `firebase`, `@supabase/supabase-js`, `netlify-cli`, `@sentry/nextjs`. `team_tooling.cli` + `team_tooling.data_api` fields either (a) disappear from output OR (b) remain as empty arrays for v5 parse compat — verify with existing consumers. No regression on URL-pattern categories.

---

### Unit 3o.2 — Scout `mode: classify` (single signal, cache-first, provenance-tracked)

**Goal.** Extend `ai-integration-scout` with a classification mode + seed the cache with ~20 household-name tools so first-run UX feels instant.

**Files.** `agents/research/ai-integration-scout.md` (edit) + `skills/hd-setup/references/known-mcps.md` (seed rows + cache-row schema).

**Approach — scout agent changes:**
- Add `mode: classify` alongside existing `research` mode. Input: single `tool_name` (dep name from raw_signals).
- **Deterministic pre-classifier** (before LLM call): check `package.json` entry for `bin` field (→ `cli`), `keywords` array match, `description` keyword hit, `homepage` URL domain. If rule-based signals agree, emit classification without LLM round-trip.
- **LLM fallback** (when rules don't fire): web-search `<tool> purpose primary category` + `<tool> MCP server` in parallel. Pass results to LLM with structured-output enum constraint. Require: `{primary: <category>, secondary: [<categories>], confidence: 0.0-1.0, ai_relevant: bool}`.
- **Category enum** (inline in prompt with 1-sentence definitions + 1-2 examples each): `cli`, `data_api`, `analytics`, `observability`, `auth`, `docs`, `design`, `pm`, `comms`, `framework-internal`, `not-ai-relevant`, `uncategorized`. Always include `uncategorized` escape hatch.
- **Multi-label output** (e.g., `supabase` → primary=`data_api`, secondary=[`cli`]). Downstream UIs consuming single-category read `primary`.
- **Cache write-back on `confidence ≥ 0.8`.** Low-confidence results stay uncached + queued for manual review (user can correct at per-layer EXECUTE).
- **Classifier versioning.** Emit `classifier_version` in cache rows. Bump when category taxonomy or prompt shape changes; invalidates stale cached classifications.

**Cache-row schema (new in known-mcps.md):**

```yaml
- tool_name: "supabase"
  categories:
    primary: "data_api"
    secondary: ["cli"]
    all: ["data_api", "cli"]
  classified_at: "2026-04-21"
  classifier_version: "1"
  source: "curated"  # curated | web-search | manual
  confidence: 1.0
  source_sha: null  # sha of fetched npm/GitHub description (for staleness check)
  integrations:
    mcp:
      package: null
      install_docs: "https://supabase.com/docs/guides/getting-started/mcp"
      maintained: true
    cli:
      install_docs: "https://supabase.com/docs/guides/cli"
    api:
      docs_url: "https://supabase.com/docs/reference/api"
```

**Seed the cache (top-20 household names):** notion, figma, linear, github, supabase, firebase, vercel, netlify, stripe, sentry, slack, amplitude, mixpanel, posthog, aws_amplify, hasura, airtable, sanity, contentful, confluence. **All seeded with `source: curated`** — distinguishable from web-classified rows.

**Guardrails:**
- Single-signal interface (not batch). Callers parallelize via existing ≤5 Task-batch convention.
- Never fabricate URLs; if unverified, emit `maintained: false` flag instead of omitting.
- Large-repo ceiling: if caller dispatches >50 classify requests from one `/hd:setup` invocation, scout emits a warning + requests user confirmation before proceeding.
- Degraded mode (no web search): return `{categories: {primary: "unknown"}, confidence: 0.0}` and suggest paste-organize path (reuse 3n Path B).

**Verification.** Manual dispatch: `classify(tool_name: "netlify-cli")` returns `{primary: "cli", secondary: ["observability"]?, confidence ≥0.8, integrations: {cli: {...}}}`. `classify(tool_name: "react")` returns `{primary: "framework-internal", ai_relevant: false}`. Cache writes land in known-mcps.md with full schema. Pre-classifier rules fire on `@aws-amplify/auth` (keyword hit) without LLM round-trip.

---

### Unit 3o.3 — Fill-path Path A dispatches scout-classify; Step 3 narrates raw_signals count

**Goal.** Wire the new classify mode into the per-layer EXECUTE flow + update Step 3 scan-summary narration.

**Files.** `skills/hd-setup/references/per-layer-procedure.md` (Fill path section), `skills/hd-setup/SKILL.md` (Step 3 narration), `skills/hd-setup/references/layer-1-context.md` + `layer-5-knowledge.md` (Path A examples).

**Approach.**
- **Step 3 scan-summary** adds raw_signals count: *"Scanned. Recognized: `<cached-tools from known-mcps.md>`. Found `<N>` uncategorized deps — research per-layer via Path A, or skip."*
- **Fill-path Path A** narration updated:
  > *"Path A — wire up a tool. Either name a tool you use, or say 'classify raw signals' and I'll research the uncategorized deps from your `package.json` (batch ≤5 parallel)."*
- **Concrete Task code-fence** example in layer-1-context.md + layer-5-knowledge.md:
  ```
  Task design-harnessing:research:ai-integration-scout(
    mode: "classify",
    tool_name: "<dep-name-from-raw_signals>"
  )
  ```
- Scout results reported inline with multi-label category badge (e.g. `netlify-cli → cli + observability (conf 0.92)`); user picks which to wire up.

**Patterns to follow.** Existing Fill path narration (per-layer-procedure.md:60+) and concrete Task code-fence pattern from layer-5-knowledge.md:89-94 (`rule-candidate-scorer`).

**Verification.** Running `/hd:setup` on a test repo shows: (a) Step 3 narration with raw_signals count, (b) at L1 create, Path A offer includes "classify raw signals" sub-path, (c) dispatching classify on a test tool returns multi-label result with concrete Task code-fence executable.

---

### Unit 3o.4 — Capture 3o architectural lesson

**Goal.** Preserve the principle learned in 3o before it fades. Rule-candidate strength is strong (architecture + simplicity reviewers both independently surfaced the Layer C duplicate-classifier risk).

**Files.** `docs/knowledge/lessons/2026-04-21-whitelist-vs-research-time.md` (new).

**Content.**
- The ad-hoc pattern we were falling into (add-a-regex-per-tool in 3n.7)
- The structural alternative (enumerate raw signals + classify at research time)
- Why "LLM as classifier with cache-first fallback" scales where whitelists don't
- Specific evidence: the 4-repo test that surfaced 4 false-negatives in 1 day; the deepen-plan research that found 2 independent reviewers flagging Layer C as duplicate-classifier risk
- **Candidate rule:** *"Detection logic that grows linearly with ecosystem size is an anti-pattern. Split into (A) deterministic enumeration of what a repo contains (scales with repo, not ecosystem) + (B) research-time classification with cache (scales with usage, not maintainer attention). Denylists are the same anti-pattern as whitelists — avoid."*

**Verification.** Lesson file exists, `rule_candidate: true`. Cited in 3o.1 + 3o.2 commit messages.

---

### Unit 3o.5 — Small-fix batch (non-architectural bugs from 4-repo test)

**Goal.** Ship the 4 non-architectural bugs surfaced in testing as a separate phase — decoupled from 3o's architectural risk. Can ship before, alongside, or after 3o.1–3o.4.

**Files.** `skills/hd-review/scripts/budget-check.sh`, `skills/hd-setup/scripts/detect.py`.

**Fixes:**
- **budget-check.sh missing-path handling** — when `contract_source=default` AND a file path doesn't exist, emit `status: "missing"` in the breakdown entry instead of `lines: 0`. Caught on Lightning + caricature.
- **Content-gated `.claude/` meta-harness detection** — require `.claude/skills/` OR `.claude/commands/` with ≥1 `.md` file alongside `settings.local.json` before flagging as meta-harness. Caught on Oracle Chat.
- **`pm.markdown-todos` threshold** — require `todos/*.md` ≥3 files AND (dated or priority-tagged) shape before triggering. Caught on Lightning + caricature.
- **scattered-L1 broaden** — include root-level `README.md` + `SKILL.md` + `<tool>.local.md` as scattered-L1 candidates. Caught on caricature.

**Patterns to follow.** Existing content-gated detection in `_meta_harness_entry()` (detect.py, 3m.1).

**Verification.** Re-run detect.py on the 4 test repos; confirm the 4 bugs no longer fire false-positive/false-negative as documented in the 2026-04-21 performance test synthesis.

---

---

## Original unit breakdown (pre-deepen; kept for audit trail)

> **The sections below are the PRE-DEEPEN 7-unit plan.** They are superseded by the 3-unit revised scope above. Kept for audit trail only — do NOT implement these directly. See Enhancement Summary § Revised scope for what was cut and why.

### Unit 3o.1 (SUPERSEDED) — Shrink `CATEGORY_PATTERNS` to curated top-20

**Goal.** Reduce maintenance burden on detect.py from "keep up with ecosystem" to "keep the top-20 current."

**Files.** `skills/hd-setup/scripts/detect.py` (edit `CATEGORY_PATTERNS` + `CONFIG_FILE_SIGNALS`).

**Approach.**
- Audit current `CATEGORY_PATTERNS["cli"]` + `["data_api"]` entries (added in 3n.7).
- Curate the top-20 across both categories by (a) adoption, (b) signal quality, (c) high-confidence categorization. Strawman list in Proposed Solution § Layer C.
- Keep URL-pattern detection for docs/design/diagramming/analytics/pm/comms **unchanged** — those use URLs as primary signal, not deps/configs.
- Delete the rest; scout picks them up via classify.

**Patterns to follow.** Existing `CATEGORY_PATTERNS` dict structure (detect.py:159). Keep the existing shape; only trim the cli/data_api sub-dicts.

**Verification.** `detect.py` output on our plug-in repo still emits clean `team_tooling`; no crash. v5-to-v6 migration verified on one synthetic repo with `package.json` + `netlify.toml`.

---

### Unit (SUPERSEDED) 3o.2 — Emit `raw_signals` in detect.py

**Goal.** Enumerate all language-ecosystem signals without categorization, as Layer A output.

**Files.** `skills/hd-setup/scripts/detect.py` (add new function + output field).

**Approach.**
- New function `enumerate_raw_signals()` emits three lists:
  - `deps`: all entries from `package.json` `dependencies` + `devDependencies`; expand to include `pyproject.toml` `[project.dependencies]`, `Gemfile`, `Cargo.toml` `[dependencies]` when detectable
  - `configs`: root-level files matching `*.toml`, `*.config.{js,ts,cjs,mjs}`, `.*rc`, selective `*.json` (exclude: `package.json`, `package-lock.json`, `tsconfig.json`, `.prettierrc`, `.eslintrc`, `.gitignore`-style internal configs)
  - `urls`: any external URLs already caught by existing URL-pattern scan — flatten and dedupe
- Denylist framework-internal deps from `deps` to reduce noise: `react`, `typescript`, `@types/*`, `@babel/*`, `eslint*`, `prettier`, `jest`, `vitest`, `webpack`, `rollup`, etc. (≤30 entry denylist — the framework plumbing).
- Emit as top-level `raw_signals: { deps, configs, urls }` in detect.py JSON output.
- Schema bump to v6 (additive).

**Patterns to follow.** Existing `detect_team_tooling()` structure (detect.py:254); reuse `SEARCH_EXTENSIONS` + `SKIP_DIRS` conventions.

**Verification.** `detect.py` on Lightning emits `raw_signals.deps` including `netlify-cli`, `@aws-amplify/auth` (when present in target repos). Denylist verified empty of user tools (e.g., `react` shouldn't appear; `next` should).

---

### Unit (SUPERSEDED) 3o.3 — Scout `mode: classify`

**Goal.** Extend `ai-integration-scout` with a batch-classify mode that takes raw signals and returns categorized findings.

**Files.** `agents/research/ai-integration-scout.md` (edit to add mode).

**Approach.**
- Add `mode` input: default `research` (existing behavior — named tool → MCP/CLI/API finding); new `classify` (batch of signals → categorized + AI-integration findings).
- Classify procedure:
  1. For each signal in batch, check `known-mcps.md` cache
  2. On cache hit, return cached `{category, mcp, cli, api}`
  3. On cache miss, do lightweight web-search: `<signal> purpose primary category` + `<signal> MCP server`
  4. Classify into category (one of: `cli`, `data_api`, `analytics`, `observability`, `auth`, `docs`, `design`, `pm`, `comms`, `not-ai-relevant`, `framework-internal`) + AI-integration findings
  5. If `ai_relevant: true`, write cache row
- Batch dispatch: caller can pass up to 20 signals in one invocation; scout parallelizes internal web searches ≤5 concurrent per existing convention.
- Output: `{ classifications: [{ tool_name, category, ai_relevant, mcp?, cli?, api?, install_docs? }] }`.

**Patterns to follow.** Existing scout `research` mode structure (agents/research/ai-integration-scout.md).

**Verification.** Manual dispatch: `classify(signals: ["netlify-cli", "@aws-amplify/auth", "@graphql-codegen/cli", "react", "zustand"])` returns 5 classifications; `netlify-cli → cli`, `aws-amplify/auth → data_api`, `graphql-codegen → cli`, `react → framework-internal`, `zustand → not-ai-relevant`.

---

### Unit (SUPERSEDED) 3o.4 — Update Fill-path Path A to dispatch scout-classify

**Goal.** When user picks Path A at per-layer EXECUTE, offer a batch-classify of uncategorized raw_signals in addition to the existing named-tool research.

**Files.** `skills/hd-setup/references/per-layer-procedure.md` (edit Fill path section); `skills/hd-setup/references/layer-1-context.md` + `layer-5-knowledge.md` (update Path A invocation examples).

**Approach.**
- Fill-path Path A now offers two sub-paths:
  - A.1 — user names a tool → dispatch scout `mode: research` (existing 3n behavior)
  - A.2 — user says "research the raw signals" / "all" → dispatch scout `mode: classify, signals: <raw_signals from Step 1>`
- Both report findings inline; user picks which to wire up.

**Patterns to follow.** Existing Fill path Path A narration (per-layer-procedure.md:60+).

**Verification.** Fill path narration is clear that both sub-paths exist; concrete Task code-fence shows both.

---

### Unit (SUPERSEDED) 3o.5 — Update Step 3 scan-summary to surface raw_signals counts

**Goal.** Scan-summary narration mentions the count of uncategorized raw signals so user knows to opt into classification later.

**Files.** `skills/hd-setup/SKILL.md` (edit Step 3 narration template).

**Approach.**
- Scan-summary format: *"Scanned. Recognized: `<team_tooling list>` (top-20 fast-path). Also found `<N>` uncategorized deps + `<M>` config files — research per-layer via Path A, or skip."*
- Keep non-blocking principle from 3n.2.

**Patterns to follow.** Existing Step 3 scan-summary (SKILL.md:84+).

**Verification.** Running `/hd:setup` on Lightning shows raw-signal counts in Step 3 narration.

---

### Unit (SUPERSEDED) 3o.6 — Smaller remaining fixes from 4-repo test

**Goal.** Pick up the non-whitelist bugs surfaced in testing that don't fit Unit 3o.1–5.

**Files.** `skills/hd-review/scripts/budget-check.sh`, `skills/hd-setup/scripts/detect.py`.

**Fixes:**
- **budget-check.sh missing-path handling** — when `contract_source=default` AND a file path doesn't exist, emit `status: "missing"` in the breakdown entry instead of `lines: 0`. User caught this on Lightning + caricature.
- **Content-gated `.claude/` meta-harness detection** — require `.claude/skills/` OR `.claude/commands/` with ≥1 `.md` file alongside `settings.local.json` before flagging as meta-harness. Caught on Oracle Chat (settings.local.json alone is too thin).
- **`pm.markdown-todos` threshold** — require `todos/*.md` ≥3 files AND (dated or priority-tagged) shape before triggering. Caught on Lightning + caricature (noise).
- **scattered-L1 broaden** — include root-level `README.md` + `SKILL.md` + `<tool>.local.md` as scattered-L1 candidates (scattered_l1_signals). Caught on caricature (missed rich L1 material).

**Patterns to follow.** Existing content-gated detection in `_meta_harness_entry()` (detect.py, 3m.1).

**Verification.** Re-run detect.py on the 4 test repos; confirm:
- Oracle Chat's `.claude/` no longer flags as meta-harness from settings.local.json alone
- Lightning + caricature no longer emit `pm: [markdown-todos]`
- caricature's scattered_l1_signals includes `README.md` + `compound-engineering.local.md`
- budget-check.sh reports `status: missing` for non-existent always-loaded paths

---

### Unit (SUPERSEDED) 3o.7 — Capture lesson: whitelist vs research-time categorization

**Goal.** Preserve the architectural principle before it fades.

**Files.** `docs/knowledge/lessons/2026-04-21-whitelist-vs-research-time.md` (new).

**Approach.** Write lesson covering:
- The ad-hoc pattern we were falling into (add-a-regex-per-tool)
- The structural alternative (enumerate raw signals + classify at research time)
- Why the second scales — cache grows with usage; no maintainer bottleneck
- Specific evidence: the 4-repo test that surfaced 4 false-negatives in 1 day
- Candidate rule: *"Detection logic that grows linearly with ecosystem size is an anti-pattern. Split into `deterministic raw-signal enumeration` (scales with repo, not ecosystem) + `research-time classification` (scales with usage, not maintainer)."*

**Verification.** Lesson file exists, frontmatter parses, `rule_candidate: true`, cited by Unit 3o.2 + 3o.3 implementation.

---

## Scope Boundaries (non-goals)

- **Do NOT rewrite URL-pattern detection for docs/design/diagramming/analytics/pm/comms.** URLs are the primary signal for those categories — whitelist of URL patterns doesn't have the same maintenance problem (notion.com / figma.com URLs are stable vendor domains). Keep those CATEGORY_PATTERNS unchanged.
- **Do NOT remove filesystem probes for meta-harness detection** (`.agent/`, `.claude/`, `.cursor/skills/`, `.windsurf/`). Those are our vocabulary, legitimately hardcoded.
- **Do NOT implement a full language-agnostic dep parser.** MVP focuses on `package.json` (most common); `pyproject.toml`/`Gemfile`/`Cargo.toml` are nice-to-have but deferred if detection works well on JS-ecosystem repos.
- **Do NOT add language-level runtime classification** (e.g., inferring "this imports supabase, so it uses supabase"). Dep-level detection is sufficient.
- **Do NOT invalidate cache entries automatically.** Cache TTL + staleness detection remain in `ideations.md` for future phases.

## Deferred to Implementation

- **Exact top-20 list** — finalize during Unit 3o.1 based on audit of 3n whitelist + ecosystem adoption signals. Strawman in Proposed Solution § Layer C.
- **Denylist entries for `raw_signals.deps`** — compiled during Unit 3o.2; expect ~30 entries (React, TypeScript, ESLint, Prettier, Jest, Vitest, bundlers, test runners, etc.). Goal: zero framework-plumbing in the output.
- **Web-search prompt shape for scout classify mode** — tune during Unit 3o.3 build; starting template: `"<signal> purpose what does <signal> do"` for category, `"<signal> MCP server"` for AI-integration.
- **Fallback when scout has no web search** — classify degrades to cache-only; returns `category: "unknown"` + `ai_relevant: null` for uncached signals. Non-blocking.

## Acceptance Criteria

- [ ] **3o.1:** `CATEGORY_PATTERNS["cli"]` + `["data_api"]` each have ≤10 entries (top-20 total across both); URL-pattern categories unchanged
- [ ] **3o.2:** `detect.py` emits `raw_signals: { deps, configs, urls }`; deps enumerate package.json; configs enumerate root-level matching patterns; denylist removes framework-internal entries
- [ ] **3o.3:** Scout supports `mode: classify` with batch input; returns categorized findings with AI-integration info; writes back to cache
- [ ] **3o.4:** Fill-path Path A narration offers both sub-paths (named tool vs raw-signal classify)
- [ ] **3o.5:** Step 3 scan-summary mentions raw_signals count
- [ ] **3o.6:** 4 remaining fixes land (budget-check missing-path, `.claude/` content-gate, markdown-todos threshold, scattered-L1 broaden)
- [ ] **3o.7:** Lesson captured; `rule_candidate: true`
- [ ] **Integration test:** re-run detect.py + dry-run scout-classify on the 4 test repos (Lightning, cornerstone, caricature, Oracle Chat); verify netlify + AWS Amplify + GraphQL-codegen all classify correctly on first invocation; no regression on firebase/supabase/sentry
- [ ] **Schema migration:** v5 `hd-config.md` files parse clean under v6; migration documented in `hd-config-schema.md`
- [ ] **Budget:** `hd-setup/SKILL.md` stays ≤200 lines; scout agent file stays ≤150 lines

## Success Metrics

- **Qualitative:** re-running the 4-repo test after 3o ships shows ≥90% of previously-missed tools now correctly categorized on first invocation (from 6/10 detection success → 9+/10)
- **Quantitative:**
  - `CATEGORY_PATTERNS` shrinks from ~45 entries to ~20
  - New `raw_signals.deps` is non-empty on repos with `package.json`
  - New `raw_signals.configs` is non-empty on repos with root-level TOML/RC files
  - Zero user-reported "tool X wasn't detected" issues for the next 2 weeks (signal: scalability working as intended)
- **Maintenance signal:** top-20 list stays stable for 30+ days without additions (inclusion bar is high; churn lives in scout's cache)

## Dependencies & Risks

**Dependencies:**
- Scout already ships in 3n; classify mode is additive extension.
- Web-search tool available in the host environment (existing scout dependency).

**Risks:**
- **Risk:** scout classify returns wrong category. **Mitigation:** cache writes are audit-trail — user can correct a cache entry if scout got it wrong; re-run picks up corrected entry.
- **Risk:** top-20 curation is subjective; different maintainers would pick different 20. **Mitigation:** document the inclusion criteria explicitly (adoption + signal + category confidence); make the list reviewable.
- **Risk:** `raw_signals.deps` becomes too noisy despite denylist. **Mitigation:** user can say "skip research" at per-layer EXECUTE; scan-summary shows count only, not full list; classify is opt-in.
- **Risk:** scout cache grows large over time. **Mitigation:** `known-mcps.md` is ~1 row per tool; realistically stays under ~500 lines for years. Revisit if it exceeds 2000 lines.
- **Risk:** Breaking change for consumers reading `team_tooling.cli[]` — tools that were detected in v5 may not be in v6's shrunk whitelist. **Mitigation:** v5→v6 migration note in `hd-config-schema.md`; any currently-detected tool not in top-20 appears in `raw_signals.deps` instead; users can re-run to re-categorize.

## Sources & References

### Origin
- **4-repo performance test** conducted 2026-04-21 surfaced the whitelist scalability problem: netlify, AWS Amplify, GraphQL-codegen, vercel-via-script-name all missed
- **User observation** (2026-04-21): *"our solution may seem quite ad-hoc instead of universal / scalable"*
- **Phase 3n plan:** [`docs/plans/2026-04-21-001-feat-phase-3n-external-source-fill-path-plan.md`](2026-04-21-001-feat-phase-3n-external-source-fill-path-plan.md) — origin of `cli[]` + `data_api[]` whitelist

### Internal references
- Current detector: [`skills/hd-setup/scripts/detect.py`](../../skills/hd-setup/scripts/detect.py) (CATEGORY_PATTERNS line 159, CONFIG_FILE_SIGNALS line ~200)
- Scout agent: [`agents/research/ai-integration-scout.md`](../../agents/research/ai-integration-scout.md) (target of classify-mode extension)
- Cache: [`skills/hd-setup/references/known-mcps.md`](../../skills/hd-setup/references/known-mcps.md) (cache-write target)
- Schema doc: [`skills/hd-setup/references/hd-config-schema.md`](../../skills/hd-setup/references/hd-config-schema.md) (v5 → v6 migration note)

### Convention references
- `AGENTS.md § Rules` 2026-04-21 (advisor-not-installer) — classify mode must link, not install
- `AGENTS.md § Rules` 2026-04-21 (live-testing rule) — the 4-repo test that triggered this plan is a 5th confirmation
- 2026-04-21 harness review — documented scalability concern as a candidate follow-up
