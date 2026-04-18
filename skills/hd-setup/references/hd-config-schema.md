# `hd-config.md` schema

**Purpose:** machine-parseable spec for the local config file every hd-* skill reads and writes. LOCKED for v0.MVP — subsequent skills (hd-maintain v0.5, hd-review v1) depend on stability.

## File location

At the user's **repo root**, alongside `AGENTS.md`. Created by `hd:setup` first run. Read (and optionally updated) by every subsequent hd-* skill.

Never at plug-in root. Never nested inside `docs/`. Never inside `.claude/`.

## Schema — LOCKED (schema_version: "2")

Bumps from `"1"` to `"2"` to add `team_tooling`, `mcp_servers_at_setup`, `layer_decisions`, `other_tool_harnesses_detected`, and `files_written`. The pilot series (plus-marketing #2, oracle-chat #4, lightning #5, plus-uno #6) all wrote these fields manually; promotes them to first-class. `"1"` files auto-upgrade on next run (missing fields default as documented).

```markdown
---
# Required
schema_version: "2"                        # semver major; bump on breaking changes
setup_mode: greenfield | scattered | advanced | localize
setup_date: 2026-04-17                     # ISO date; last mutation
team_size: solo | small | medium | large   # <2 | 2-5 | 5-20 | 20+

# Optional — omit field if unknown, don't write null
skipped_layers: [1, 2, 3, 4, 5]            # int list; layers user declined to scaffold

coexistence:
  compound_engineering: true               # detected at setup time

article_read: true                         # self-reported; never blocking

# NEW in schema v2 — what tools the team uses, decided per-category at Step 1.5
team_tooling:
  docs: [notion]                           # detected via URL grep + user confirmation
  design: [figma, pencildev]
  diagramming: [excalidraw]
  analytics: [amplitude]
  pm: [linear]
  comms: [slack]

# NEW in schema v2 — MCPs configured at setup time (from .mcp.json, etc.)
mcp_servers_at_setup: [notion, figma, shadcn]

# NEW in schema v2 — per-layer decisions recorded during the Step 4 layer-walk.
# One row per layer (L1–L5); array-of-objects so we can attach `why` and `files_written`
# alongside each decision.
layer_decisions:
  - layer: L1
    decision: link            # link | critique | scaffold | skip
    why: ".agent/rules/ IS Layer 1 — overlay would duplicate"
    files_written: []
  - layer: L2
    decision: skip
    why: ".agent/skills/ owned elsewhere"
    files_written: []
  - layer: L3
    decision: skip
    why: "prerequisite of 3+ Layer 2 skills not satisfied"
    files_written: []
  - layer: L4
    decision: scaffold
    why: "no existing rubric library"
    files_written:
      - "docs/rubrics/INDEX.md"
      - "docs/rubrics/accessibility-wcag-aa.md"
  - layer: L5
    decision: scaffold
    why: "knowledge skeleton absent"
    files_written:
      - "docs/knowledge/INDEX.md"
      - "docs/knowledge/lessons/README.md"

# NEW in schema v2 — other-tool harnesses detected & respected (never touched)
other_tool_harnesses_detected:
  - path: ".agent/"
    owner: user
    policy: respect         # respect | link | coexist
  - path: "docs/plans/"
    owner: compound-engineering
    policy: coexist

# NEW in schema v2 — flat list of relative paths this /hd:setup run created
files_written:
  - "docs/rubrics/INDEX.md"
  - "docs/rubrics/accessibility-wcag-aa.md"
  - "docs/knowledge/INDEX.md"
  - "docs/knowledge/lessons/README.md"
  - "hd-config.md"
---

# design-harnessing — local config

Prose section for humans. Skills only read the YAML frontmatter above.

Free-form notes about the harness — team context, customizations, decisions specific to this repo.
```

## Field definitions

| Field | Type | Required | Values | Notes |
|---|---|---|---|---|
| `schema_version` | string | yes | `"2"` | Semver major. Bump on breaking changes. `"1"` files are upgraded on next run. |
| `setup_mode` | enum | yes | `greenfield` \| `scattered` \| `advanced` \| `localize` | Matches `detect.py` output `mode` field |
| `setup_date` | date (ISO) | yes | `YYYY-MM-DD` | Last time this file was mutated by a skill |
| `team_size` | enum | yes | `solo` \| `small` \| `medium` \| `large` | solo=<2, small=2-5, medium=5-20, large=20+ |
| `skipped_layers` | int list | no | `[1-5]` | Which layers user declined during setup. Default `[]`. |
| `coexistence.compound_engineering` | bool | no | `true` \| `false` | Default `false`. |
| `article_read` | bool | no | `true` \| `false` | User self-reported; default `false`. |
| `team_tooling` | map | no | category → list of tool slugs | Default `{}`. Categories: `docs, design, diagramming, analytics, pm, comms`. |
| `mcp_servers_at_setup` | string list | no | `[notion, figma, ...]` | From parsing `.mcp.json` / `.cursor/mcp.json` / etc. Default `[]`. |
| `layer_decisions` | list of objects | no | see below | One entry per layer. Each object: `{layer: L1\|L2\|L3\|L4\|L5, decision: link\|critique\|scaffold\|skip, why: <one-line>, files_written: <list of relative paths, `[]` if none>}`. Default `[]`. |
| `other_tool_harnesses_detected` | list of objects | no | see below | Each object: `{path: <relative path>, owner: user\|team\|<tool-name>, policy: respect\|link\|coexist}`. Default `[]`. `respect` = detected, never modified; `link` = referenced from Layer 1/2 pointer files; `coexist` = tool runs alongside hd-* without collision. |
| `files_written` | string list | no | relative paths | Flat list of paths this `/hd:setup` run created. Used by `/hd:review health` to audit harness coverage. Default `[]`. |

## Validation rules (enforced by any skill reading this file)

1. YAML frontmatter parses as valid YAML
2. `schema_version` present and string-typed (not number)
3. `setup_mode` is one of the 4 enum values
4. `setup_date` matches `YYYY-MM-DD` (10 chars, ISO date format)
5. `team_size` is one of the 4 enum values
6. If `layer_decisions` present, each entry has `layer`, `decision`, and `files_written` keys
7. If `other_tool_harnesses_detected` present, each entry has `path`, `owner`, and `policy` keys
8. Missing optional fields default to: `skipped_layers: []`, `coexistence.compound_engineering: false`, `article_read: false`, `layer_decisions: []`, `other_tool_harnesses_detected: []`, `files_written: []`

Any validation failure: skill surfaces error + refuses to proceed until fixed (do not silently default on malformed file).

## Update rules

When a skill updates this file:

- **Atomic writes only** — write to `hd-config.md.new`, then `mv` (prevents partial-write corruption)
- **Always update `setup_date`** — reflects latest mutation
- **Never change `schema_version`** without a migration — contract for downstream skills
- **Preserve prose section** — YAML frontmatter is machine territory; body is user's
- **Append to `files_written`** when a later run adds files; don't overwrite the historical record.

## Migration contract

When `schema_version` bumps, the plug-in ships a migration skill or in-place upgrade logic. `"1"` → `"2"` migration: populate missing v2 fields with documented defaults; existing v1 keys unchanged.

## Example (additive-only advanced setup on plus-marketing-website)

Filled-in YAML from the plus-marketing-website pilot (2026-04-18). Shows `layer_decisions` with mixed scaffold/skip, `other_tool_harnesses_detected` respecting an existing `.agent/` framework, and a populated `files_written` audit trail.

```markdown
---
schema_version: "2"
setup_mode: advanced
setup_date: 2026-04-18
team_size: small
skipped_layers: [1, 2, 3]
coexistence:
  compound_engineering: true
article_read: true
team_tooling:
  docs: [notion, google_docs]
  design: [figma]
  pm: [github_issues]
  comms: [slack]
  analytics: []
  diagramming: []
mcp_servers_at_setup: [shadcn]
layer_decisions:
  - layer: L1
    decision: skip
    why: ".agent/rules/ IS Layer 1; no overlay"
    files_written: []
  - layer: L2
    decision: skip
    why: ".agent/skills/ IS Layer 2; critique via skill-quality-auditor recommended separately"
    files_written: []
  - layer: L3
    decision: skip
    why: "prerequisite of 3+ Layer 2 skills not satisfied (.agent/skills/ not hd-owned)"
    files_written: []
  - layer: L4
    decision: scaffold
    why: "extract + scaffold rubrics (existing .agent/rules/ has implicit rubric content)"
    files_written:
      - "docs/rubrics/INDEX.md"
      - "docs/rubrics/accessibility-wcag-aa.md"
      - "docs/rubrics/design-system-compliance.md"
      - "docs/rubrics/component-budget.md"
      - "docs/rubrics/interaction-states.md"
      - "docs/rubrics/typography.md"
  - layer: L5
    decision: scaffold
    why: "fresh knowledge-skeleton; .agent/ is Layer 1, not Layer 5"
    files_written:
      - "docs/knowledge/INDEX.md"
      - "docs/knowledge/README.md"
      - "docs/knowledge/lessons/README.md"
other_tool_harnesses_detected:
  - path: ".agent/"
    owner: user
    policy: respect
  - path: "CLAUDE.md"
    owner: user
    policy: respect
files_written:
  - "hd-config.md"
  - "docs/rubrics/INDEX.md"
  - "docs/rubrics/accessibility-wcag-aa.md"
  - "docs/rubrics/design-system-compliance.md"
  - "docs/rubrics/component-budget.md"
  - "docs/rubrics/interaction-states.md"
  - "docs/rubrics/typography.md"
  - "docs/knowledge/INDEX.md"
  - "docs/knowledge/README.md"
  - "docs/knowledge/lessons/README.md"
---
```

## `detect.py` CLI flags & output signals (informational)

`detect.py` is the scanner that feeds `hd:setup`. Its flags and emitted signals are not part of the `hd-config.md` schema, but several signals map 1:1 into config fields — so they're documented here for reference.

**Flags:**

| Flag | Default | Effect |
|---|---|---|
| `--include-user-mcps` | off | Also read `~/.claude/mcp.json` and `~/.codex/mcp.json`. Opt-in: default behavior stays repo-scoped so team-independent MCPs don't pollute the team config. |

**Output signals added for user-MCP scoping (G3):**

| Signal path | Type | Notes |
|---|---|---|
| `signals.user_mcps_included` | bool | `true` iff `--include-user-mcps` was passed. Absent/false by default. |
| `signals.user_mcp_sources` | string list | Absolute paths of the user-level MCP files actually read + parsed successfully. Empty list if flag absent or no files present. |

When the flag is passed, any MCP server names found in user-level files are **unioned (deduped by name)** into the top-level `mcp_servers` list alongside repo-level detections. `hd:setup` records provenance by writing `user_mcp_sources` into the hd-config prose body so the team can see which MCPs came from personal configs.

**Error handling:** if a user config file exists but is malformed JSON, detect skips it and writes a single line to stderr: `warn: malformed user MCP config at <path>`. Detect never crashes on user-config errors.

## Coexistence note

This file is OURS (`hd-config.md`). NOT to be confused with compound's `compound-engineering.local.md`. If both plug-ins are installed, two config files coexist at repo root. See [coexistence-checklist.md](coexistence-checklist.md).

## See also

- [coexistence-checklist.md](coexistence-checklist.md) — namespace isolation
- `../assets/hd-config.md.template` — the actual file template hd:setup writes
