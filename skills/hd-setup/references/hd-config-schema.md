# `hd-config.md` schema

**Purpose:** machine-parseable spec for the local config file every hd-* skill reads and writes. LOCKED for v0.MVP — subsequent skills (hd-maintain v0.5, hd-review v1) depend on stability.

## File location

At the user's **repo root**, alongside `AGENTS.md`. Created by `hd:setup` first run. Read (and optionally updated) by every subsequent hd-* skill.

Never at plug-in root. Never nested inside `docs/`. Never inside `.claude/`.

## Schema — LOCKED (schema_version: "3")

Bumps from `"2"` to `"3"` to generalize other-tool detection: the previously named vendor sub-field is removed; every detected tool (`.agent/`, `.claude/`, `.codex/`, any foreign plug-in, any future addition) becomes one entry in `other_tool_harnesses_detected[]`. No tool is privileged at the schema level. `"2"` files auto-upgrade on next run (any legacy vendor-specific bool synthesized into a generic array entry).

Prior: `"1"` → `"2"` added `team_tooling`, `mcp_servers_at_setup`, `layer_decisions`, `other_tool_harnesses_detected`, `files_written`.

```markdown
---
# Required
schema_version: "3"                        # semver major; bump on breaking changes
setup_mode: greenfield | scattered | advanced | localize
setup_date: 2026-04-17                     # ISO date; last mutation
team_size: solo | small | medium | large   # <2 | 2-5 | 5-20 | 20+

# Optional — omit field if unknown, don't write null
skipped_layers: [1, 2, 3, 4, 5]            # int list; layers user declined to create

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
    decision: scaffold        # scaffold | review | create | skip
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
    decision: create
    why: "no existing rubric library"
    files_written:
      - "docs/rubrics/INDEX.md"
      - "docs/rubrics/accessibility-wcag-aa.md"
  - layer: L5
    decision: create
    why: "knowledge skeleton absent"
    files_written:
      - "docs/knowledge/INDEX.md"
      - "docs/knowledge/lessons/README.md"

# Other-tool harnesses detected & respected (never touched).
# Schema v3: unified array — every detected tool is one entry, no named
# special cases. Entry schema:
#   name           (required string) — tool identifier (e.g. ".agent",
#                  ".claude", ".codex", or any foreign plug-in slug)
#   type           (required string) — plugin | meta-harness | convention | other
#   paths_found    (required list)   — repo-relative paths detected for this tool
#   config_file    (optional string) — tool's root-level config file, if any
#   skill_count    (optional int)    — SKILL.md count where relevant
#   rule_count     (optional int)    — rule .md count where relevant
#   owner          (optional string) — user-annotated: user | team | <tool-name>
#   policy         (optional string) — user-annotated: respect | link | coexist
other_tool_harnesses_detected:
  - name: .agent
    type: meta-harness
    paths_found: [".agent/skills/", ".agent/rules/"]
    skill_count: 6
    rule_count: 12
    owner: user
    policy: respect
  - name: .claude
    type: meta-harness
    paths_found: [".claude/skills/"]
    skill_count: 3
    owner: user
    policy: respect

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
| `schema_version` | string | yes | `"3"` | Semver major. Bump on breaking changes. `"1"` and `"2"` files are upgraded on next run. |
| `setup_mode` | enum | yes | `greenfield` \| `scattered` \| `advanced` \| `localize` | Matches `detect.py` output `mode` field |
| `setup_date` | date (ISO) | yes | `YYYY-MM-DD` | Last time this file was mutated by a skill |
| `team_size` | enum | yes | `solo` \| `small` \| `medium` \| `large` | solo=<2, small=2-5, medium=5-20, large=20+ |
| `skipped_layers` | int list | no | `[1-5]` | Which layers user declined during setup. Default `[]`. |
| `article_read` | bool | no | `true` \| `false` | User self-reported; default `false`. |
| `team_tooling` | map | no | category → list of tool slugs | Default `{}`. Categories: `docs, design, diagramming, analytics, pm, comms`. |
| `mcp_servers_at_setup` | string list | no | `[notion, figma, ...]` | From parsing `.mcp.json` / `.cursor/mcp.json` / etc. Default `[]`. |
| `layer_decisions` | list of objects | no | see below | One entry per layer. Each object: `{layer: L1\|L2\|L3\|L4\|L5, decision: scaffold\|review\|create\|skip, why: <one-line>, files_written: <list of relative paths, `[]` if none>}`. Default `[]`. |
| `other_tool_harnesses_detected` | list of objects | no | see below | Unified array — every detected tool is one entry, no named special cases. Required keys: `name` (string; e.g. `.agent`, `.claude`, `.codex`, or any foreign plug-in slug), `type` (enum: `plugin` \| `meta-harness` \| `convention` \| `other`), `paths_found` (list of repo-relative paths). Optional keys: `config_file` (string), `skill_count` (int), `rule_count` (int), `owner` (user-set: `user` \| `team` \| `<tool-name>`), `policy` (user-set: `respect` \| `link` \| `coexist`). Default `[]`. |
| `files_written` | string list | no | relative paths | Flat list of paths this `/hd:setup` run created. Used by `/hd:review health` to review harness coverage. Default `[]`. |

## Validation rules (enforced by any skill reading this file)

1. YAML frontmatter parses as valid YAML
2. `schema_version` present and string-typed (not number)
3. `setup_mode` is one of the 4 enum values
4. `setup_date` matches `YYYY-MM-DD` (10 chars, ISO date format)
5. `team_size` is one of the 4 enum values
6. If `layer_decisions` present, each entry has `layer`, `decision`, and `files_written` keys
7. If `other_tool_harnesses_detected` present, each entry has `name`, `type`, and `paths_found` keys
8. Missing optional fields default to: `skipped_layers: []`, `article_read: false`, `layer_decisions: []`, `other_tool_harnesses_detected: []`, `files_written: []`

Any validation failure: skill surfaces error + refuses to proceed until fixed (do not silently default on malformed file).

## Update rules

When a skill updates this file:

- **Atomic writes only** — write to `hd-config.md.new`, then `mv` (prevents partial-write corruption)
- **Always update `setup_date`** — reflects latest mutation
- **Never change `schema_version`** without a migration — contract for downstream skills
- **Preserve prose section** — YAML frontmatter is machine territory; body is user's
- **Append to `files_written`** when a later run adds files; don't overwrite the historical record.

## Migration contract

When `schema_version` bumps, the plug-in ships a migration skill or in-place upgrade logic. `"1"` → `"2"` migration: populate missing v2 fields with documented defaults; existing v1 keys unchanged. `"2"` → `"3"` migration: remove the legacy `coexistence` block; any legacy vendor-specific presence bool is synthesized into a `{name, type: "plugin", paths_found: [...]}` entry in `other_tool_harnesses_detected[]`. Existing array entries upgrade from `{path, owner, policy}` to `{name, type, paths_found, owner, policy}` by mapping `path` → `name`+`paths_found` and inferring `type: "meta-harness"` for `.agent`/`.claude`/`.codex` names.

## Example (additive-only advanced setup on plus-marketing-website)

Filled-in YAML from the plus-marketing-website pilot (2026-04-18). Shows `layer_decisions` with mixed create/skip, `other_tool_harnesses_detected` respecting an existing `.agent/` framework, and a populated `files_written` review trail.

```markdown
---
schema_version: "3"
setup_mode: advanced
setup_date: 2026-04-18
team_size: small
skipped_layers: [1, 2, 3]
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
    why: ".agent/skills/ IS Layer 2; review via skill-quality-auditor recommended separately"
    files_written: []
  - layer: L3
    decision: skip
    why: "prerequisite of 3+ Layer 2 skills not satisfied (.agent/skills/ not hd-owned)"
    files_written: []
  - layer: L4
    decision: create
    why: "extract + create rubrics (existing .agent/rules/ has implicit rubric content)"
    files_written:
      - "docs/rubrics/INDEX.md"
      - "docs/rubrics/accessibility-wcag-aa.md"
      - "docs/rubrics/design-system-compliance.md"
      - "docs/rubrics/component-budget.md"
      - "docs/rubrics/interaction-states.md"
      - "docs/rubrics/typography.md"
  - layer: L5
    decision: create
    why: "fresh knowledge-skeleton; .agent/ is Layer 1, not Layer 5"
    files_written:
      - "docs/knowledge/INDEX.md"
      - "docs/knowledge/README.md"
      - "docs/knowledge/lessons/README.md"
other_tool_harnesses_detected:
  - name: .agent
    type: meta-harness
    paths_found: [".agent/skills/", ".agent/rules/"]
    skill_count: 8
    rule_count: 4
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

This file is OURS (`hd-config.md`). Other plug-ins may write their own config files at repo root; they coexist without interference.

## See also

- `../assets/hd-config.md.template` — the actual file template hd:setup writes
