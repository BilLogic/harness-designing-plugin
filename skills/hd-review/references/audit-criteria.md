# Audit criteria

**Purpose:** five-layer health criteria + priority framework + scope boundaries for harness audits. Loaded by `workflows/audit-parallel.md` and `workflows/audit-serial.md` as the canonical rubric for what "healthy harness" means.

## Per-layer criteria

### Layer 1 — Context Engineering

**Healthy:**
- `docs/context/` exists with 4+ populated sub-paths (product, design-system, conventions, agent-persona)
- Tier 1 budget ≤200 lines (AGENTS.md + product/one-pager.md combined)
- Files edited within the last 6 months OR explicitly marked stable

**Drift signals:**
- Tier 1 budget violated (>200 lines)
- Single file >500 lines (split candidate)
- agent-persona.md empty or template-placeholder-only
- Design-system cheat-sheet hasn't been updated after a product pivot

### Layer 2 — Skill Curation

**Healthy:**
- 1-5 custom skills (beyond what the plug-in ships) after 3+ months of use
- Each skill has SKILL.md ≤200 lines with proper YAML frontmatter
- All skills use the team's `<prefix>-*` convention
- Each skill passes the 9-point `skill-quality` rubric (see [`../templates/starter-rubrics/skill-quality.md`](../templates/starter-rubrics/skill-quality.md))

**Drift signals:**
- 0 custom skills after 6 months of use (suggests underused harness)
- Skill with description >180 chars (context budget waste)
- Skills without tags / categorization
- Any skill failing ≥ 2 sections of `skill-quality` rubric at p1 severity

**Audit action:** for every `skills/*/SKILL.md`, run the `skill-quality` rubric. Roll findings into the Layer 2 section of the audit report with the failing-section numbers cited (1–9).

### Layer 3 — Workflow Orchestration

**Healthy:**
- `docs/orchestration/` exists if team has ≥3 Layer 2 skills
- Workflows named and referenced in handoffs
- Gates declared (which rubrics apply where)

**Drift signals:**
- 3+ Layer 2 skills AND no orchestration/workflows → skills orphaned
- Workflow files not touched in 6+ months (stale)
- Handoffs happening in Slack instead of as artifacts

### Layer 4 — Rubric Setting

**Healthy:**
- `docs/rubrics/INDEX.md` exists as distributed-pattern pointer
- Rubric definitions in `docs/context/design-system/` (criteria files)
- `skills/hd-review/` exists for execution (self-reference — this skill IS the layer's execution engine)
- AGENTS.md § Graduated rules contains at least one rubric-derived rule

**Drift signals:**
- `docs/rubrics/` missing or empty
- Rubrics defined but never applied (hd:review never invoked)
- Design-system files lack criteria for accessibility, token-compliance, component-budget

### Layer 5 — Knowledge Compounding

**Healthy:**
- `docs/knowledge/lessons/*.md` has entries spread across time (not front-loaded)
- Lessons have consistent tagging
- At least one graduation visible in git history (via `docs/knowledge/graduations.md`)
- Graduation cadence: ~1 per 10 lessons is healthy

**Drift signals:**
- 10+ lessons with same tag and 0 graduations → graduation drought
- Lessons without dates or tags
- All lessons from a single week (burst capture; no ongoing discipline)
- `graduations.md` contains entries with `{{PLACEHOLDER}}` left unfilled

## Cross-cutting checks

### Tier 1 budget

Uses `scripts/budget-check.sh` output. Any file or combined-tier violation → P1.

### Coexistence compliance

- No writes to `docs/solutions/` (compound's namespace) — violation = P1
- `hd-config.md` schema valid per `hd-setup/references/hd-config-schema.md` — invalid = P2
- Cross-plug-in Task calls fully-qualified (no bare `learnings-researcher` etc.) — grep skill files for violations

### Naming discipline

- All skill dirs use `hd-*` prefix
- All skill `name:` frontmatter uses `hd:verb` form
- Plan files use `YYYY-MM-DD-NNN-<type>-<slug>-plan.md` convention

### Protected-artifacts integrity

Declared in `skills/hd-review/SKILL.md`. Audit verifies:

- Block is present and parseable
- Paths in block match the canonical set (docs/design-solutions/**, docs/knowledge/**, docs/context/**, AGENTS.md, hd-config.md, skills/**)
- If `/ce:review` or another review tool has modified any path in the block since the last audit → P1 structural violation

## Priority framework

Findings categorize as:

### P1 — Structural (ship-blocking in dogfood; urgent in user repos)

- Tier 1 budget violated
- Missing required layer (Layer 1 empty, Layer 5 missing)
- Coexistence violation (writes to `docs/solutions/`)
- `<protected_artifacts>` integrity violated
- Schema validation failure in `hd-config.md`

### P2 — Drift (should fix; not blocking)

- Stale files (6+ months, no explicit stable marker)
- Graduation drought (10+ same-tag lessons, 0 graduations)
- Skill-count drift (unused or proliferating)
- Naming inconsistencies
- Description char budget violations

### P3 — Polish (nice-to-have)

- Tag canonicalization opportunities
- Minor file organization improvements
- Cross-reference completeness
- Comment cleanup

## What's out of scope for this audit

`hd:review` checks **harness health**, not:

- Code quality of the user's product (that's compound's `/ce:review` domain)
- Security audits (not our domain)
- Performance analysis (not our domain)
- Design-system correctness (that's `hd:review critique` mode, applied to specific work items, not the harness itself)

If the user asks "is my app accessible?" → route to `hd:review critique <file>` with accessibility rubric, not audit mode.

## See also

- [bloat-detection.md](bloat-detection.md) — concrete thresholds + scripts for bloat
- [drift-detection.md](drift-detection.md) — stale-file and graduation-drought heuristics
- [critique-format.md](critique-format.md) — output shape for critique mode (distinct from audit)
- Article §4d — why Layer 4 is distributed behavior
