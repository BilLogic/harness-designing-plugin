---
title: "Single-source-of-truth for schemas: when an artifact is encoded in N>1 places, designate one authoritative"
date: 2026-04-25
memory_type: episodic
importance: 4
tags: [architecture, schema, single-source-of-truth, drift, agent-authored-agent-consumed]

applies_to_layers: [l1, l2, l3]
related_rules: [R_2026_04_25_schema_ssot, R_2026_04_24_rubric_yaml_split]
related_lessons:
  - 2026-04-21-rubric-yaml-prose-split
decision_summary: "When a schema is encoded in N>1 places (code emit + human doc + template), designate one authoritative file and derive the others. Drift is otherwise inevitable — one place updates, others lag, and audit catches the inconsistency days later."
result_summary: "Phase 3w established skills/hd-setup/scripts/schema.json as SSOT for the hd-config.md schema. detect.py imports SCHEMA_VERSION at module init. hd-config-schema.md gains a 'if drift, schema.json wins' pointer at top. Stale v3 reference (v3 → v5 drift caught by 2026-04-21 audit) corrected."
next_watch: "Other multi-encoded contracts: rubric YAML schema (already discipline-bound via R_2026_04_24_rubric_yaml_split); skill frontmatter contract (currently informal); audit-criteria files (currently inline-referenced). When a third multi-encoded contract appears, apply this pattern."
rule_candidate: false
rule_ref: R_2026_04_25_schema_ssot  # graduated 2026-04-25 (1st confirmation; same fast-track basis as namespace-rename rule)
supersedes: null
superseded_by: null
---

# Lesson

## Context

Pre-Phase-3w, the `hd-config.md` schema was encoded in three places:

1. **`detect.py`** — the emitter; line 1118 hardcoded `"schema_version": "5"`
2. **`hd-config-schema.md`** — the human-readable spec; line 131 said `"3"` (stale)
3. **`hd-config.md.template`** — the example output; line 2 had `"5"` (correct)

The 2026-04-21 dogfood audit (post-Phase-3p) caught the v3 → v5 drift between detect.py + the spec doc. Documented as ideation entry "Spec-as-single-source-of-truth for hd-config schema" with timing gate "next breaking schema change."

Cost of waiting: every reader of the spec doc encountered the wrong version; every audit reproduced the drift finding; new contributors had to mentally reconcile three numbers.

## Decision

**Designate `scripts/schema.json` as authoritative.** It carries:
- `schema_version` (the contract version)
- `additive_changes_since_lock` (history of what additive bumps lived under each version)
- `required_top_level_fields` + `optional_top_level_fields` + `field_types` (the actual contract)
- `validation_rules` (assertion list)
- `version_bump_policy` (when to bump major; K8s/dbt convention codified)
- `consumers` (who reads this; helps coordinate breaking changes)

`detect.py` reads `schema.json` at module init via `json.load`, sets `SCHEMA_VERSION` constant, emits in JSON output. Falls back gracefully if the file is missing/unparseable (warn to stderr, hardcode last-known v5) — drift detection without breaking the run.

`hd-config-schema.md` gains a header pointer: *"Single source of truth: `scripts/schema.json` is authoritative. This file is the human-readable derivation. If they drift, `schema.json` wins."*

`hd-config.md.template` doesn't need to change — it's already an example output rather than a schema spec.

## Result

Phase 3w shipped 2026-04-25:
- `skills/hd-setup/scripts/schema.json` — new, machine-readable authoritative spec
- `skills/hd-setup/scripts/detect.py` — imports SCHEMA_VERSION from schema.json with graceful fallback (warn-to-stderr if missing/malformed)
- `skills/hd-setup/references/hd-config-schema.md` — header pointer added; stale `"3"` row corrected to `"5"`

Smoke test: `python3 detect.py` in a clean tmp dir emits `schema_version: 5` (sourced from `schema.json`, not hardcoded). Removing or corrupting `schema.json` triggers stderr warning + fallback to hardcoded "5"; detect run still succeeds.

## Generalization (and tie-back to rubric-YAML-split)

This is the same pattern as `R_2026_04_24_rubric_yaml_split` applied at a different scope:
- Rubric YAML split: criteria normative in YAML frontmatter; rationale descriptive in body. Prevents prose-layout-fragility.
- Schema SSOT: contract normative in `schema.json`; spec descriptive in `hd-config-schema.md`. Prevents emit/doc drift.

Both come from the same recognition: when an artifact is *both* machine-consumed *and* prose-bearing, separate the layers structurally so neither couples to the other's layout.

The two rules likely consolidate eventually into a single discipline. For now: keep them distinct so the trigger conditions stay legible (rubric vs config schema vs future cases).

## Prevention pattern going forward

Before adding a new field to *any* contract, ask:
- Is this contract encoded in more than one place? (code emit + human doc + template + agent spec, etc.)
- If yes, which file is authoritative? Update there first.
- If no single authoritative file exists, designate one in this commit before adding the field.

## Next

- Watch for the next multi-encoded contract: skill frontmatter convention is currently distributed across `skill-quality.md` rubric, AGENTS.md skill-compliance pointer, and per-skill SKILL.md files. If drift appears, apply this pattern.
- Watch for graduation rate. With `R_2026_04_25_schema_ssot` + `R_2026_04_25_namespace_alignment` + `R_2026_04_24_rubric_yaml_split` all in 5 days, the rule corpus is growing fast. Re-audit at v2.0.0 to confirm rules are load-bearing rather than over-codified.
