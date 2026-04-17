# `design-harnessing.local.md` schema

**Purpose:** machine-parseable spec for the local config file every hd-* skill reads and writes. LOCKED for v0.MVP — subsequent skills (hd-compound v0.5, hd-review v1) depend on stability.

## File location

At the user's **repo root**, alongside `AGENTS.md`. Created by `hd:setup` first run. Read (and optionally updated) by every subsequent hd-* skill.

Never at plug-in root. Never nested inside `docs/`. Never inside `.claude/`.

## Schema — LOCKED (schema_version: "2")

v1.1 bumps from `"1"` to `"2"` to add `team_tooling`, `mcp_servers_at_setup`, `layer_decisions`, and `other_tool_harnesses_detected`. v1.0 users' files auto-upgrade on next run (missing fields default as documented).

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

# NEW in schema v2 — per-layer decision recorded during layer-walk
layer_decisions:
  layer_1: link         # link | critique | scaffold | skip
  layer_2: critique
  layer_3: skip
  layer_4: scaffold
  layer_5: scaffold

# NEW in schema v2 — other-tool harnesses detected & respected (never touched)
other_tool_harnesses_detected: [".agent/", ".claude/skills/", "docs/plans/"]
---

# design-harnessing — local config

Prose section for humans. Skills only read the YAML frontmatter above.

Free-form notes about the harness — team context, customizations, decisions specific to this repo.
```

## Field definitions

| Field | Type | Required | Values | Notes |
|---|---|---|---|---|
| `schema_version` | string | yes | `"2"` for v1.1 | Semver major. Bump on breaking changes. v1.0 files with `"1"` are upgraded on next run. |
| `setup_mode` | enum | yes | `greenfield` \| `scattered` \| `advanced` \| `localize` | Matches `detect.py` output `mode` field |
| `setup_date` | date (ISO) | yes | `YYYY-MM-DD` | Last time this file was mutated by a skill |
| `team_size` | enum | yes | `solo` \| `small` \| `medium` \| `large` | solo=<2, small=2-5, medium=5-20, large=20+ |
| `skipped_layers` | int list | no | `[1-5]` | Which layers user declined during setup. Default `[]` if missing. |
| `coexistence.compound_engineering` | bool | no | `true` \| `false` | Default `false` if missing |
| `article_read` | bool | no | `true` \| `false` | User self-reported; default `false` if missing |
| `team_tooling` | map | no | category → list of tool slugs | Default `{}`. Categories: `docs, design, diagramming, analytics, pm, comms`. |
| `mcp_servers_at_setup` | string list | no | `[notion, figma, ...]` | From parsing `.mcp.json` / `.cursor/mcp.json` / etc. at setup time. Default `[]`. |
| `layer_decisions` | map | no | `layer_N` → enum | For each of 5 layers, user's decision during layer-walk: `link` / `critique` / `scaffold` / `skip`. Default `{}`. |
| `other_tool_harnesses_detected` | string list | no | path-list | Paths to other-tool harness dirs/conventions hd:setup detected but never modifies. Default `[]`. |

## Validation rules (enforced by any skill reading this file)

1. YAML frontmatter parses as valid YAML
2. `schema_version` present and string-typed (not number)
3. `setup_mode` is one of the 4 enum values
4. `setup_date` matches `YYYY-MM-DD` (10 chars, ISO date format)
5. `team_size` is one of the 4 enum values
6. Missing optional fields default to: `skipped_layers: []`, `coexistence.compound_engineering: false`, `article_read: false`

Any validation failure: skill surfaces error + refuses to proceed until fixed (do not silently default on malformed file).

## Update rules

When a skill updates this file:

- **Atomic writes only** — write to `design-harnessing.local.md.new`, then `mv` (prevents partial-write corruption)
- **Always update `setup_date`** — reflects latest mutation
- **Never change `schema_version`** without a migration — contract for downstream skills
- **Preserve prose section** — YAML frontmatter is machine territory; body is user's

## Migration contract

When `schema_version` bumps (for example `"1"` → `"2"`), the plug-in ships a migration skill or in-place upgrade logic. Until a bump happens, v0.MVP ships `"1"` and guarantees no breaking changes within `"1"`.

## Example file (post-greenfield setup)

```markdown
---
schema_version: "2"
setup_mode: greenfield
setup_date: 2026-04-17
team_size: small
skipped_layers: [3]
coexistence:
  compound_engineering: true
article_read: true
team_tooling:
  docs: [notion]
  design: [figma]
mcp_servers_at_setup: [figma]
layer_decisions:
  layer_1: scaffold
  layer_2: skip
  layer_3: skip
  layer_4: scaffold
  layer_5: scaffold
---

# design-harnessing — local config

Set up 2026-04-17 on greenfield repo. Skipped Layer 3 (Orchestration) for now —
team only has 1 skill, orchestration would be premature.

Team docs live in Notion (brand workspace). Figma is source-of-truth for design
system. Figma MCP configured at setup time; Notion MCP not yet — see
docs/setup-mcps.md for install instructions when we're ready.

compound-engineering already installed. No conflicts expected.
```

## Example file (post-layer-walk on advanced repo with other-tool harness)

```markdown
---
schema_version: "2"
setup_mode: advanced
setup_date: 2026-04-17
team_size: solo
skipped_layers: []
coexistence:
  compound_engineering: true
article_read: true
team_tooling:
  docs: [notion]
  pm: [github_issues]
mcp_servers_at_setup: [shadcn]
layer_decisions:
  layer_1: link          # existing .agent/rules/100-project-context.md linked
  layer_2: link          # existing .agent/skills/frontend-design/ linked
  layer_3: skip
  layer_4: scaffold      # new starter rubrics written
  layer_5: scaffold      # new docs/knowledge/lessons/ created
other_tool_harnesses_detected:
  - ".agent/"
  - "docs/plans/"        # compound-style plan convention (36 files)
---

# design-harnessing — local config

Existing .agent/ harness detected and linked, not modified. hd-* structure
layers over it by pointing back to .agent/ from docs/context/ and docs/skills/
index files. Set up 2026-04-17.

Notion is where product docs live; if we later want richer integration we'll
install Notion MCP.
```

## Coexistence note

This file is OURS (`design-harnessing.local.md`). NOT to be confused with compound's `compound-engineering.local.md`. If both plug-ins are installed, two config files coexist at repo root. See [coexistence-checklist.md](coexistence-checklist.md).

## See also

- [coexistence-checklist.md](coexistence-checklist.md) — namespace isolation
- `../templates/design-harnessing.local.md.template` — the actual file template hd:setup writes
