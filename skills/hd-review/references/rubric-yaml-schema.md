---
title: Rubric YAML schema
loaded_by: hd-review
---

# Rubric YAML schema

Spec for the YAML frontmatter shape that machine-consumed rubrics use to declare their criteria. Phase 3q migrates `skill-quality.md` to this shape as proof-of-concept; Phase 3r propagates to `ux-writing.md` + `heuristic-evaluation.md` if the pattern holds.

## Why a schema

Rubrics today mix structured data (criterion + severity, identical shape every time) with prose (rationale, pass/fail examples, scope grounding). When agents parse criteria from markdown tables, any prose refactor that shifts table placement silently breaks the audit. The 2026-04-21 dogfood caught a 3l.7 sed-pass that mangled 16 tokens in `skill-quality.md` without disturbing the audit's regex anchors.

**Split:** YAML-normative criteria in frontmatter; prose-descriptive rationale in body. Agents query frontmatter deterministically; humans read body for the story; neither couples to the other's layout.

## Required frontmatter fields

```yaml
---
rubric: skill-quality                    # kebab-case identifier; matches filename stem
name: "Skill quality (Layer 2 health check)"  # human-readable title shown in reports
applies_to:                              # target shapes this rubric scores
  - skill-md
  - skill-dir
version: 1                               # rubric YAML schema version (this file)
severity_defaults:
  default: p2                            # fallback when a criterion omits severity
source:                                  # citation(s) — where the rules come from
  - "Anthropic skill best practices + Bill's 9-section checklist"

sections:                                # ordered map of named sections
  skill-definition:                      # section slug (kebab-case, unique)
    order: 1                             # int; renders sections in this order
    title: "Skill definition"            # human-readable section title
    criteria:                            # ordered list of checks
      - id: names-one-job                # kebab-case, unique within section
        severity: p1                     # p1 | p2 | p3
        check: "Description names the skill's one job"
      - id: lists-trigger
        severity: p2
        check: "Description lists at least one concrete trigger scenario or keyword"
  scope:
    order: 2
    title: "Scope"
    criteria:
      - id: one-job-statement-present
        severity: p1
        check: "One job statement present at top of SKILL.md body"
---
```

## Field definitions

| Field | Type | Required | Notes |
|---|---|---|---|
| `rubric` | string | yes | Kebab-case identifier; matches the file stem (e.g., `skill-quality`). |
| `name` | string | yes | Human-readable title. Shown in audit / critique reports. |
| `applies_to` | string list | yes | Target shapes the rubric scores (e.g., `skill-md`, `skill-dir`, `tsx`, `figma-frame`). `rubric-applier` refuses to run when shape mismatch. |
| `version` | int | yes | Rubric-YAML schema version (this file's contract). Bump when the YAML shape changes (new fields, retyping). Cache consumers can invalidate by version. |
| `severity_defaults.default` | enum | yes | `p1` \| `p2` \| `p3`. Fallback when a criterion's `severity:` is omitted. |
| `source` | string list | yes | Citation(s). Where the criteria come from (upstream standard, team document, pilot lesson). At least one entry. |
| `sections` | map | yes | Ordered map of named sections. Key is section slug (kebab-case, unique). Value is a section object. |
| `sections.<slug>.order` | int | yes | Render / iteration order. 1-indexed. Unique within the rubric. |
| `sections.<slug>.title` | string | yes | Human-readable section title. Shown in reports + report headings. |
| `sections.<slug>.criteria` | list | yes | Ordered list of criterion objects. May be empty (rare; usually means the section is a placeholder). |
| `sections.<slug>.criteria[].id` | string | yes | Kebab-case identifier. Unique within the section (cross-section duplicates allowed but discouraged). Stable across versions — finding output cites this id, so renaming breaks downstream traceability. |
| `sections.<slug>.criteria[].severity` | enum | no | `p1` \| `p2` \| `p3`. Defaults to `severity_defaults.default` when omitted. |
| `sections.<slug>.criteria[].check` | string | yes | Imperative one-liner stating what the criterion checks. Reads as "<subject> <verb> <object>" (e.g., "Description names the skill's one job"). |

## Body convention

The rubric body holds:

1. **Intro paragraph** — what this rubric checks; what pain it prevents; what it does NOT check (defer to other rubrics).
2. **`## Scope & Grounding`** — the 4-block schema (Personas / User stories / Realistic scenarios / Anti-scenarios). Unchanged from the prose-only shape; see [`rubric-authoring-guide.md`](rubric-authoring-guide.md).
3. **One `## <N>. <Section title>` heading per section in `sections`** — with prose rationale + concrete pass/fail examples. The section heading must use the same human-readable `title` as the YAML's `sections.<slug>.title`. The number matches `order`.
4. **`## How to apply this rubric`** + **`## Extending this rubric`** + **`## What this rubric does NOT check`** + **`## See also`** — unchanged.

**Invariant:** every YAML criterion has corresponding prose rationale somewhere in its section. The criterion's `check` string is the normative "what"; the body's prose is the "why". Examples in the body are advisory — the YAML criterion drives the audit.

## Backward compatibility + migrate-on-adopt

Rubrics whose frontmatter does NOT include a `sections:` map are treated as **legacy prose-table** rubrics. `rubric-applier` falls back to markdown-table parsing for these.

**Adopted rubrics are all on schema v1.** The 6 starters adopted to this plug-in's own dogfood (`skill-quality`, `ux-writing`, `heuristic-evaluation`, `plan-quality`, `lesson-quality`, `agent-spec-quality`) plus `rubric-template.md` ship in YAML schema v1.

**The 11 unadopted starters are legacy prose-only by design.** They are reference material — opinions in prose form, intentionally readable without machine-parsing. They migrate to schema v1 **when a team adopts them**, not before. Eager migration would (a) inflate file size with YAML duplicating the prose, (b) lock in criterion `id`s that the adopting team should be free to rename, and (c) imply machine-checkability for rubrics that may need team-specific adaptation first.

**`/hd:setup` L4 walks the migration step on adoption.** When a user copies a legacy starter into `docs/rubrics/`, the setup procedure prompts them to add `version: 1` + `source:` + a `sections:` map per the field-definitions table above before `rubric-applier` is run against the new copy. See [`../../hd-setup/references/layer-4-rubrics.md`](../../hd-setup/references/layer-4-rubrics.md) for the adoption walk-through.

**L4 audit:** unadopted starters with prose-only criteria are **not** flagged as defects. Adopted rubrics in `docs/rubrics/` without a `sections:` map ARE flagged (P1 — `rubric-applier` cannot parse them).

## Validation + version semantics

Readers enforce the field-definitions table above. Malformed YAML, missing required keys, wrong types, duplicate section `order`, or duplicate criterion `id` within a section all surface as `error: rubric-invalid` with a one-line diagnosis.

`version: 1` is the initial shape (Phase 3q). Additive changes (new optional fields) don't bump. Required-field promotion, type changes, or `severity` enum changes do bump. K8s / dbt convention; matches `hd-config.md` schema.

> **Type note:** `version` here is bare `int` (`1`) — distinct from `hd-config.md`'s `schema_version: "5"` (quoted string). Both follow the same additive-vs-breaking rules; only the type representation differs.

Validation failure: agent emits `error: rubric-invalid` + a brief diagnosis; the layer L4 audit reports it as a P1 meta-finding. Never silently default a malformed rubric.

## See also

- [rubric-authoring-guide.md](rubric-authoring-guide.md) — 4-block Scope & Grounding schema + authoring checklist
- [rubric-application.md](rubric-application.md) — how `rubric-applier` walks criteria
- [`../assets/starter-rubrics/rubric-template.md`](../assets/starter-rubrics/rubric-template.md) — fillable starter template using this schema
- [`../assets/starter-rubrics/skill-quality.md`](../assets/starter-rubrics/skill-quality.md) — Phase 3q reference implementation
- [`../../hd-setup/references/hd-config-schema.md`](../../hd-setup/references/hd-config-schema.md) — companion schema doc; same shape conventions
