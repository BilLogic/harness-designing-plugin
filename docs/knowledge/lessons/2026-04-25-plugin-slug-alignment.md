---
title: "Plug-in slug alignment: complete the namespace-rename arc by closing the install-command surface"
date: 2026-04-25
memory_type: episodic
importance: 4
tags: [naming, refactor, slug, marketplace, alignment-completion]

applies_to_layers: [l1, l3]
related_rules: [R_2026_04_25_namespace_alignment]
related_lessons:
  - 2026-04-25-namespace-rename
decision_summary: "v2.0.0 partially aligned identifiers (Task namespace, repo, marketplace name) but kept plug-in slug `design-harness` as a deliberate carve-out. v3.0.0 closes the carve-out: rename `design-harness` → `harness-designing` so install command, marketplace name, and slug all match. Compound Engineering's listing pattern (one name across all surfaces) is the model."
result_summary: "Phase 3y migrated 4 manifests + README install commands across 5 host sections + AGENTS.md prose + 3 submission packets. Tagged v3.0.0. Install command becomes `/plugin install harness-designing`. /hd:* slash commands unchanged — end users unaffected."
next_watch: "Watch for the carve-out pattern in future renames — partial alignment with deferred completion can be valid (e.g., when external dependencies pin the unchanged piece). When the constraint that justified the carve-out lifts (here: 'no users yet'), close the loop promptly."
rule_candidate: false
rule_ref: R_2026_04_25_namespace_alignment  # refines existing rule (extension from Task namespace to ALL identifiers)
supersedes: null
superseded_by: null
---

# Lesson

## Context

Phase 3v (v2.0.0, 2026-04-25 morning) renamed the Task namespace `design-harnessing:` → `harness-designing:` to align with the marketplace + GitHub slug. That rename explicitly preserved the plug-in slug `design-harness` (no -ing) — the v2.0.0 lesson called it out: *"Plug-in slug `design-harness` (no -ing) untouched — different identifier, different concern."*

That carve-out was correct given the constraint at the time: **uncertain whether external consumers had pinned the slug**. Renaming the install slug is a breaking change for anyone running `/plugin install design-harness` in scripts.

Post-3x audit revealed Compound Engineering's marketplace listing uses a unified name across all surfaces:

| Surface | Compound | Us (post-v2.0.0) |
|---|---|---|
| GitHub repo | `EveryInc/compound-engineering-plugin` | `BilLogic/harness-designing-plugin` |
| Plug-in slug | `compound-engineering` | `design-harness` ❌ drift |
| Marketplace name | `compound-engineering` | `harness-designing` |
| Install cmd | `/plugin install compound-engineering` | `/plugin install design-harness` |

User confirmed the constraint had lifted: *"no one had used our plugin yet, so that's not a problem."* Carve-out justification gone → close the loop.

## Decision

Rename plug-in slug `design-harness` → `harness-designing`. Result: ONE name across all surfaces.

- GitHub repo: `BilLogic/harness-designing-plugin`
- Plug-in slug: `harness-designing`
- Marketplace name: `harness-designing`
- Task namespace: `harness-designing:`
- Install command: `/plugin install harness-designing`
- Slash command prefix: `/hd:*` (unchanged — short form earns its place at daily-use surface)

This refines `R_2026_04_25_namespace_alignment` from "Task namespace alignment" to "ALL identifier surfaces alignment, including the plug-in slug." Same rule, broader application; no new rule needed.

## Result

Phase 3y shipped 2026-04-25:
- 4 manifests bumped (`plugin.json` ×3 + `marketplace.json`); slug field updated
- README updated: 5 host install sections + Migration callout (now covers v1.x→v2 task namespace + v2.x→v3 slug)
- AGENTS.md H1 + rule entry updated
- 3 submission packets refreshed (anthropic + cursor + codex), all bumped to v3.0.0 with new slug + alignment milestone footnote
- Lesson captured (this file; rule_candidate: false; refinement of R_2026_04_25_namespace_alignment)

`scripts/release.sh 3.0.0` executed end-to-end (preflight + bump + commit + tag + branch push). Tag pushed; main fast-forwarded; GitHub release created.

## Why this isn't a new rule

The pattern is identical to v2.0.0's namespace alignment, just at a different scope. The v2.0.0 lesson already codified the principle: "shipping artifact name wins when slugs diverge." This phase extends scope to "all identifier surfaces" but doesn't introduce a new principle.

Two-confirmation graduation might apply later if a third namespace surface drifts and we re-run the same logic — but for now, refinement is enough.

## Carve-out pattern (lesson within a lesson)

Partial alignment with deferred completion **is a valid pattern** when the deferred piece has a real constraint (here: external pins). The v2.0.0 carve-out was right at the time. What matters:

1. **Document the carve-out explicitly** when you make it (we did — v2.0.0 lesson called it out)
2. **Document the constraint** that justifies the carve-out (we did — "different identifier, different concern" implied external-pinning concern)
3. **Watch for the constraint lifting** (here: "no users yet" → carve-out unjustified → close the loop)
4. **Close promptly** when constraint lifts — don't let partial alignment ossify

Without step 3 + 4, the carve-out becomes permanent drift.

## Prevention pattern

Before introducing a new identifier surface (a new slug, namespace, prefix, or display name), ask:
- Is there an existing identifier this might collide with or duplicate?
- If alignment is technically possible but blocked by a constraint, document the constraint
- Set a watch-condition for when the constraint lifts (e.g., user count threshold, external dependency removed, version migration completed)

## Next

- Watch v3.0.0 marketplace listing render after Anthropic CDN refresh (24–48h). Should display `/plugin install harness-designing` with the new slug.
- Watch Cursor re-submission acknowledgement (using the refreshed v3.0.0 packet).
- Watch Codex marketplace opening; submit packet immediately when self-serve publishing lands.
- Final identifier audit: confirm `grep -rn "design-harness" --include="*.md" --include="*.json"` returns only history-allowed instances.
