---
title: Audit criteria — cross-layer consistency + redundancy
loaded_by: hd-review (via harness-auditor agent after per-layer checks complete)
---

# Audit criteria: Cross-layer consistency + redundancy

## Purpose

Catch contradictions, duplications, and orphan pointers across the 5 layers. Harness coherence breaks when the same rule appears in two places with different wording, when AGENTS.md points at a file that's been renamed, or when two skills do overlapping jobs.

Loaded by `harness-auditor` in a final cross-layer pass after each per-layer audit completes.

**Grading.** Same 4-level `content_status` as other criteria.

## Criteria

### duplicate-rule-detection

- **Check:** the same imperative rule stated in multiple places (AGENTS.md Rules + a rubric file)
- **Default severity:** p2
- **Heuristic:** for each rule line in AGENTS.md, search `docs/rubrics/*.md` for high-similarity (≥80% token overlap) imperative sentences; flag pairs
- **Stale signal:** duplicate statements with slightly different wording → drift risk
- **Remedy:** pick one location (typically AGENTS.md for team rules, rubric for gate criteria); delete or reword the other to reference the canonical location

### contradicting-rule-and-rubric

- **Check:** AGENTS.md Rules and a rubric make opposing claims
- **Default severity:** p1
- **Heuristic:** scan for negated or opposing patterns ("always X" in one file, "never X" or "avoid X" in another)
- **Remedy:** resolve by editing one side + capturing a decision in `docs/knowledge/decisions.md`

### orphan-pointer-detection

- **Check:** every file/folder path referenced from AGENTS.md, SKILL.md, or rubric files actually exists on disk
- **Default severity:** p2
- **Heuristic:** extract every markdown link target, file reference, and `see:` pointer; check each resolves
- **Stale signal:** target file was renamed/moved and references not updated
- **Remedy:** update link or delete reference

### overlapping-skill-scope

- **Check:** two or more skills whose `description:` fields describe ≥70% overlapping jobs
- **Default severity:** p2
- **Heuristic:** token-overlap across pairs of SKILL.md `description:` fields; flag high-overlap pairs
- **Pass example:** `design-review` and `code-review` overlap 30% — distinct
- **Fail example:** `design-review` and `ui-review` overlap 85% — consolidate or differentiate

### cross-layer-cross-reference-integrity

- **Check:** references from one layer to another resolve (e.g. skill references a rubric path; rubric path exists under `docs/rubrics/`)
- **Default severity:** p2
- **Heuristic:** for every cross-layer path reference, verify target exists + is non-empty

### stale-lesson-citations

- **Check:** every rule in AGENTS.md with a "Source: lesson.md" citation points to a real lesson file
- **Default severity:** p2
- **Stale signal:** rule cites a lesson that was deleted or renamed

### hd-config-drift (3k.6)

- **Check:** current `detect.py` JSON output aligns with `hd-config.md` recorded state
- **Default severity:** p2
- **Heuristic:** compare key fields — `other_tool_harnesses_detected[]`, `skipped_layers`, `team_tooling`, `skills_by_platform`. Mismatch = drift.
- **Pass example:** hd-config records `.claude/` detected; detect.py confirms
- **Fail example:** detect.py finds `.codex/` harness signal; hd-config doesn't list it → config is stale
- **Remedy:** re-run `/hd:setup` or edit `hd-config.md` to reflect current state

### redundant-knowledge-indexing

- **Check:** lessons indexed in multiple places (e.g., both in AGENTS.md L5 section AND a standalone INDEX.md)
- **Default severity:** p3
- **Remedy:** consolidate into AGENTS.md Harness map (canonical per 3k.13)

## Output shape

```yaml
- check: <name>
  status: pass | warn | fail
  content_status: missing | present-but-stale | present-and-populated | healthy
  severity: p1 | p2 | p3
  evidence: "<observation, usually two file:line pairs>"
  recommendation: "<action>"
  affected_layers: [<layer-numbers>]
```

## See also

- Agent: `../../../agents/analysis/harness-auditor.md`
- Detection script: `../../hd-setup/scripts/detect.py`
- Consistency check dispatch: `review-procedure.md` (final synthesis step)
