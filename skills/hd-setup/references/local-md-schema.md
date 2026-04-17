# `design-harnessing.local.md` schema

**Purpose:** machine-parseable spec for the local config file every hd-* skill reads and writes. LOCKED for v0.MVP — subsequent skills (hd-compound v0.5, hd-review v1) depend on stability.

## File location

At the user's **repo root**, alongside `AGENTS.md`. Created by `hd:setup` first run. Read (and optionally updated) by every subsequent hd-* skill.

Never at plug-in root. Never nested inside `docs/`. Never inside `.claude/`.

## Schema — LOCKED (schema_version: "1")

```markdown
---
# Required
schema_version: "1"                        # semver major; bump on breaking changes
setup_mode: greenfield | scattered | advanced | localize
setup_date: 2026-04-16                     # ISO date; last mutation
team_size: solo | small | medium | large   # <2 | 2-5 | 5-20 | 20+

# Optional — omit field if unknown, don't write null
skipped_layers: [1, 2, 3, 4, 5]            # int list; layers user declined to scaffold
coexistence:
  compound_engineering: true               # detected at setup time
article_read: true                         # self-reported; never blocking
---

# design-harnessing — local config

Prose section for humans. Skills only read the YAML frontmatter above.

Free-form notes about the harness — team context, customizations, decisions specific to this repo.
```

## Field definitions

| Field | Type | Required | Values | Notes |
|---|---|---|---|---|
| `schema_version` | string | yes | `"1"` for v0.MVP | Semver major. Bump on breaking changes. |
| `setup_mode` | enum | yes | `greenfield` \| `scattered` \| `advanced` \| `localize` | Matches `detect-mode.sh` output `mode` field |
| `setup_date` | date (ISO) | yes | `YYYY-MM-DD` | Last time this file was mutated by a skill |
| `team_size` | enum | yes | `solo` \| `small` \| `medium` \| `large` | solo=<2, small=2-5, medium=5-20, large=20+ |
| `skipped_layers` | int list | no | `[1-5]` | Which layers user declined during setup. Default `[]` if missing. |
| `coexistence.compound_engineering` | bool | no | `true` \| `false` | Default `false` if missing |
| `article_read` | bool | no | `true` \| `false` | User self-reported; default `false` if missing |

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
schema_version: "1"
setup_mode: greenfield
setup_date: 2026-04-16
team_size: small
skipped_layers: [3]
coexistence:
  compound_engineering: true
article_read: true
---

# design-harnessing — local config

Set up 2026-04-16 on greenfield repo. Skipped Layer 3 (Orchestration) for now —
team only has 1 skill, orchestration would be premature. Revisit at v0.5 when
/hd:compound ships.

compound-engineering already installed. No conflicts expected.
```

## Coexistence note

This file is OURS (`design-harnessing.local.md`). NOT to be confused with compound's `compound-engineering.local.md`. If both plug-ins are installed, two config files coexist at repo root. See [coexistence-checklist.md](coexistence-checklist.md).

## See also

- [coexistence-checklist.md](coexistence-checklist.md) — namespace isolation
- `../templates/design-harnessing.local.md.template` — the actual file template hd:setup writes
