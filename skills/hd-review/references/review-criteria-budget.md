---
title: Audit criteria — Budget-check interpretation
loaded_by: hd-review audit mode (when interpreting budget-check.sh output)
---

# Audit criteria: Budget-check output interpretation

## Purpose

Thin reference for reading the JSON output of `scripts/budget-check.sh`. The
skill runs the script inline; this file documents the output shape and severity
mapping so the auditor can interpret results consistently. Does NOT re-run the
check.

## Output shape of `budget-check.sh`

`scripts/budget-check.sh` emits JSON on stdout:

```json
{
  "tier1": {
    "limit_lines": 200,
    "actual_lines": 178,
    "files": [
      { "path": "AGENTS.md", "lines": 118 },
      { "path": "docs/context/product/one-pager.md", "lines": 60 }
    ],
    "status": "pass"
  },
  "per_file": [
    { "path": "docs/context/design-system/tokens.md", "lines": 880, "status": "fail" }
  ],
  "violations": [
    { "kind": "single_file_over_500", "path": "docs/context/design-system/tokens.md", "lines": 880 }
  ]
}
```

## Severity mapping

| Violation kind | Severity | Rationale |
|---|---|---|
| `tier1_over_limit` | **P1** | Tier 1 is loaded every turn; overruns degrade every downstream prompt. Ship-blocking. |
| `single_file_over_500` | **P2** | Bloat signal; candidate for split. Not blocking, but flag. |
| `combined_tier_over_limit` (tier 2/3 where defined) | **P1** | Same reasoning as tier 1 — any budget band overrun is structural. |
| `file_stale_over_6mo` (if budget-check extended for freshness) | **P2** | Drift, not structural. |

## How the auditor consumes this

1. Skill runs `bash scripts/budget-check.sh` and captures JSON.
2. Auditor (or the cross-cutting pass) maps each entry in `violations[]` to a
   severity via the table above.
3. Each violation becomes one check result:

```yaml
- check: tier1-budget
  status: fail
  severity: p1
  evidence: "tier1 actual_lines=340 exceeds limit=200 (AGENTS.md 280 + one-pager.md 60)"
  recommendation: "Split AGENTS.md rules into docs/context/conventions/*.md; keep top-level AGENTS.md ≤180 lines"
```

4. If `budget-check.sh` exits non-zero or JSON fails to parse → emit one
   `check: budget-check-execution` result at P1 with the stderr text as
   evidence. Do NOT silently skip.

## Pass condition

- `tier1.status == "pass"` AND `violations` array is empty → no budget checks
  contribute findings.

## See also

- Parent skill: `../SKILL.md`
- Script source: `../scripts/budget-check.sh`
- Layer 1 criteria that depend on this: `review-criteria-l1-context.md` §
  `always-loaded-budget`
- Cross-cutting coexistence checks: handled by the `coexistence-analyzer` agent (`agents/analysis/coexistence-analyzer.md`)
