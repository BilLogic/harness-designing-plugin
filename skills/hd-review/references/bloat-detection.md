# Bloat detection

**Purpose:** concrete thresholds + tooling for detecting context-budget violations + file-size bloat. Loaded by audit workflows.

## Tier 1 budget (hardest bar)

**Definition:** lines combined across `AGENTS.md` + `docs/context/product/one-pager.md`.

**Budget:** ≤200 lines.

**Why it matters:** Tier 1 loads on every task. Every token is a token not available for the actual work. Budget violation = AI has less context for the real problem.

**Check:**

```bash
bash skills/hd-review/scripts/budget-check.sh
```

Returns JSON with `tier_1.status: "pass" | "fail"` and detailed breakdown. Authoritative; prefer over manual `wc -l`.

**On fail:** flag P1 structural; suggest moving non-critical content to Tier 2 (`docs/context/*` sub-files outside product/one-pager.md).

## Per-file line thresholds

| File type | Soft target | Hard cap (Anthropic) | Flag level |
|---|---|---|---|
| SKILL.md router | ≤200 | ≤500 | >200 = P2; >500 = P1 |
| SKILL.md description field | ≤180 chars | ≤1024 | >180 = P3; >1024 = P1 |
| References | 40-200 lines | no hard cap | >300 = P2 (suggest split); >500 = P1 |
| Workflows | 60-250 lines | no hard cap | >300 = P2 |
| Templates | ≤50 lines | no hard cap | >80 = P3 (templates should be minimal) |

Budget-check script emits `skill_md_lines` map for every SKILL.md in `skills/`; audit compares against thresholds.

## Combined-folder heuristics

**Total `docs/context/`:** no hard cap, but:

- <100 lines combined → likely underpopulated (P3 — "consider filling out context")
- 100-500 lines → healthy range for most teams
- 500-1500 lines → growing; check for Tier 2 / Tier 3 split opportunities
- \>1500 lines → P2 drift; something belongs in Tier 3 archive

**Total `docs/knowledge/lessons/`:** no cap (lessons are append-only episodic memory; growth is expected). But:

- Rate: 1-5 lessons per quarter is healthy
- 50+ lessons tagged with same topic + 0 rule adoptions → P2 drift (rule-adoption drought)
- No new lessons in 6+ months with active development → P2 drift (capture discipline lapsed)

## Single-file bloat rules

A single file is "bloated" when:

1. **Line count exceeds the soft target by ≥50%** (e.g., SKILL.md at 310 lines, reference at 310 lines)
2. **Token count (rough approximation) exceeds context-window concerns** — 4 chars ≈ 1 token; a 500-line file with wide lines is ~15-20K tokens, significant slice of a 200K context window
3. **Reader can't find what they need without scrolling past irrelevant sections** — qualitative signal, surface as P3

## What's NOT bloat

- Tier 3 archives intentionally exceeding 500 lines (they're not loaded by default)
- Well-structured reference files with clear TOC (Anthropic allows longer files if they have a TOC per best-practices doc)
- Plan files in `docs/plans/` — these are historical records, not runtime context
- `docs/knowledge/changelog.md` accumulating entries over years (it's a log)

## Ancillary checks

### Reference link bloat

- SKILL.md with >10 reference links → too many; consolidate or move some to workflows
- Reference files linking to other references (>2 levels deep) → violates Anthropic one-level-deep rule; P2

### Template placeholder density

- Templates with >20 `{{PLACEHOLDER}}` fields → probably too complex; split into multiple templates or simplify the domain

### Tag cardinality

- `docs/knowledge/lessons/` using >30 distinct tags → tag sprawl; P3 suggest canonicalization

## See also

- [audit-criteria.md](audit-criteria.md) — where bloat fits into the audit framework
- `../scripts/budget-check.sh` — deterministic budget checker
- Anthropic [Skill best practices § Progressive disclosure](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
