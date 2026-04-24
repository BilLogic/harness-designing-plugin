---
title: "Whitelist vs research-time classification: detection that scales with ecosystem is an anti-pattern"
date: 2026-04-21
memory_type: episodic
importance: 5
tags: [architecture, detection, classification, scalability, llm-as-fallback, refactor, lesson-from-audit]

# Machine-extractable — 3p.3 schema migration
applies_to_layers: [l1, l3]
related_rules: []
related_lessons:
  - 2026-04-21-external-source-fill-path
  - 2026-04-21-detect-inspect-integrate
decision_summary: "Detection logic that grows linearly with ecosystem size is an anti-pattern. Split into (A) deterministic enumeration (scales with repo) + (B) research-time classification with cache (scales with usage). Denylists are the same anti-pattern as whitelists."
result_summary: "Phase 3o shipped: detect.py emits raw_signals.deps universally; scout gains classify mode; 45-entry whitelist deleted; cache grows organically via scout write-back."
next_watch: "Second emerging format tempts us to whitelist → apply this pattern instead → graduate to AGENTS.md § Rules at 2nd confirmation."
rule_candidate: true
rule_ref: null
supersedes: null
superseded_by: null
---

# Lesson

## Context

Phase 3n (2026-04-21, earlier today) shipped `detect.py` schema v5 with `cli[]` + `data_api[]` tool categories. Detection used `CATEGORY_PATTERNS` (regex per tool) + `CONFIG_FILE_SIGNALS` (filesystem probes per tool) — one hardcoded entry per tool name.

A **4-repo dry-run test** (Lightning, cornerstone, caricature, Oracle Chat) conducted hours after 3n shipped surfaced ≥4 false-negatives on well-known tools:
- **netlify** missed despite `netlify.toml` at repo root
- **AWS Amplify** missed despite `@aws-amplify/auth` in package.json
- **GraphQL-codegen** missed despite `@graphql-codegen/cli` in deps
- **Vercel-via-script-name** missed when only `"build-vercel"` script existed without `vercel.json`

The first-draft fix was a table labeled "Phase 3n.1 small patches — add 4 regex entries." That's the trap: every missed tool leads to a new regex. The whitelist grows linearly with ecosystem size. Ecosystem is effectively infinite (10,000+ npm packages alone; thousands of SaaS tools; every company has internal tools).

## Decision / Observation

**Whitelist scales with maintainer attention. Research scales with real usage.**

The scalability pathology is universal: any detection-logic that enumerates instances of what it's looking for (per-tool regex, per-tool config files, per-tool install walkthroughs) will always lag the ecosystem. The plug-in maintainer becomes the bottleneck — and coverage never approaches 100% because a new tool ships every day.

The structural alternative, as verified by independent review from two reviewer agents (`architecture-strategist` + `code-simplicity-reviewer`) during the 3o plan deepen-pass:

**Split detection into two layers by what they scale with:**

1. **Layer A — Deterministic enumeration (scales with the user's repo, not the ecosystem)**
   - Read `package.json` dependencies / config-file presence / URL signals
   - Emit raw lists, no categorization
   - Same repo, same run → same output (deterministic)
   - Maintenance: ~zero — reads well-known manifests; new tools appear automatically as new deps

2. **Layer B — Research-time classification (scales with usage, not maintainer attention)**
   - On-demand LLM classifier (+ web search fallback)
   - Cache-first; writes back to cache on successful classification
   - After N real invocations, the top-N tools are cached
   - Maintenance: ~zero — cache grows organically

Two reinforcing consequences:
- **Layer C (curated top-20 dict in `detect.py`) is an anti-pattern if it lives alongside the cache.** Two sources of truth can disagree. **Solution:** seed the cache with top-20 entries; delete the parallel dict. One list, one code path.
- **Denylists are the same anti-pattern as whitelists.** A hardcoded list of "framework-internal" tools (React, TypeScript, ESLint) requires maintenance as frameworks evolve. The scout's classify mode can return `framework-internal` for those on first encounter + cache the answer. Self-populating.

## Best-practice patterns (from deepen-plan research)

- **LLM as fallback, not frontline.** Cheap deterministic signals (package.json `bin` field, `keywords` array, `description` keyword matches) fire first; LLM only when rules don't resolve. Saves tokens + improves determinism. (Hamel Husain, "Your AI Product Needs Evals," 2024.)
- **Structured output with category enum.** Constrained decoding beats free-text parsing. Always include `uncategorized` escape hatch to prevent forced hallucination. (Anthropic Classification Cookbook, 2025.)
- **Multi-label output.** Tools fit multiple categories (supabase → `data_api` + `cli`). Emit `{primary, secondary[], all[]}` — don't collapse to one label.
- **Cache provenance matters.** Cache rows need `classified_at`, `source: curated|web-search|manual`, `confidence`, `classifier_version`, `source_sha` (material-change hash). Without provenance, "correct a wrong cache entry" is blind editing.
- **Versioned invalidation beats TTL.** Bump `classifier_version` when category taxonomy or prompt shape changes; invalidates stale rows deterministically. TTL churns for stable tools.
- **Batch size sweet spot is 8-10, not 20.** Quality degrades past ~15 items per prompt (ordering bias, late-item neglect). Parallelize smaller batches instead.

## Result

Phase 3o plan [docs/plans/2026-04-21-002-feat-phase-3o-universal-tool-discovery-plan.md](../../plans/2026-04-21-002-feat-phase-3o-universal-tool-discovery-plan.md) shipped with 5 units (3 core + 1 lesson + 1 split-out small-fix batch) after deepen-plan review. Key cuts from the original 7-unit plan:
- **Cut Layer C** (hardcoded top-20 dict) → seed cache instead
- **Cut schema v5 → v6 bump** (additive changes don't bump integer versions per K8s/dbt convention)
- **Cut `raw_signals.configs`** (speculative; deps cover 95% of cases)
- **Cut denylist** (same anti-pattern as whitelist)
- **Cut batch-classify interface** (existing Task-batch ≤5 suffices)
- **Cut pyproject/Gemfile/Cargo scope** (out of phase)

## Graduation-readiness

**Primary candidate rule:** *"Detection logic that grows linearly with ecosystem size is an anti-pattern. Split into (A) deterministic enumeration of what a repo contains (scales with repo, not ecosystem) + (B) research-time classification with cache (scales with usage, not maintainer attention). Denylists are the same anti-pattern as whitelists — avoid both."*

**Strength of evidence:**
1. Live 4-repo test (2026-04-21) — 4 false-negatives in 1 day on well-known tools
2. Two independent reviewer agents (`architecture-strategist` + `code-simplicity-reviewer`) converged on the same fix via different reasoning (coupling risk vs YAGNI) during deepen-plan review
3. This is the 5th confirmation of the related live-testing rule (already graduated today at 4th confirmation)

Ready to graduate at Phase 3o ship. Log adoption event in `docs/knowledge/changelog.md`.

## Prevention pattern going forward

- Before adding a regex or filesystem probe to `detect.py`, ask: *"Will this entry need a sibling for every new tool in this category?"* If yes, push classification to research-time instead.
- Before authoring a denylist of framework plumbing, ask: *"Can the classifier emit `framework-internal` as a category?"* Cache self-populates.
- When audit finds a detector miss, the instinct to "add a regex" should be traded for: "does the miss point at an architecture problem?"
- **Test on ≥4 unrelated repos** before shipping any detection refactor. Real-repo performance is the ground truth.

## Next

- Watch v1.2.0 release (3o shipping) for confirmation that the classifier-as-fallback pattern works as designed
- If scout's classify mode produces poor results in the wild, the fix is to improve the pre-classifier rules + prompt; NOT to re-add hardcoded regex entries
- Consider documenting the "LLM-as-classifier with cache-first" pattern as a reusable plug-in convention (applies to any future similar problem in the harness)
