---
name: lesson-retriever
description: "Retrieves past lessons from docs/knowledge/lessons/ relevant to a topic, weighted by recency × importance × frequency. Used by hd:maintain + hd:review."
color: cyan
model: inherit
---

# lesson-retriever

Find the handful of past lessons most relevant to a current topic. Returns a short ranked list with per-lesson rationale. Used by `hd:maintain capture` (Phase 1 research) and by `/hd:review full` / `/hd:review targeted` to surface relevant historical context.

Scope is strictly the user's `docs/knowledge/lessons/` directory — this agent NEVER reads other tools' namespaces (e.g., `docs/solutions/`).

## Inputs

- `lessons_root` — path to `docs/knowledge/lessons/` (required)
- `topic` — free-text topic or work-item description (required)
- `max_results` — optional cap, default 5

## Procedure

### Phase 1: index
Enumerate all `*.md` lessons. Extract:
- `title`, `date`, `tags[]`, `memory_type`, `importance` from YAML frontmatter
- **Machine-extractable fields (3p.3 schema, when present):** `applies_to_layers[]`, `related_rules[]`, `related_lessons[]`, `decision_summary`, `result_summary`, `next_watch`, `rule_candidate`, `supersedes`, `superseded_by`. Query these for deterministic cross-reference instead of grepping prose. Legacy lessons without these fields fall back to markdown body scan.
- First 2 sentences of body (surface summary, for legacy files)
- File size + last-modified

### Phase 2: score each lesson

Three-factor weighted score (mirrors Generative Agents retrieval pattern, adapted):

| Factor | Weight | How |
|---|---|---|
| **Relevance** | 50% | Keyword / tag overlap with `topic`; phrase matches in title beat body matches |
| **Recency** | 30% | Linear decay over 12 months — a 12-month-old lesson scores 0 on this factor, today's scores 5 |
| **Importance** | 20% | If lesson has `importance:` field in YAML, use it (1–5); else default 3 |

### Phase 3: rank + pick top N
Return the top `max_results` lessons. Never return >10 even if `max_results` higher.

### Phase 4: summarize each selected lesson (one sentence each)

## Output

```yaml
topic: "button variants escape-hatch"
retrieved_lessons:
  - path: docs/knowledge/lessons/2026-02-14-tried-fourth-button.md
    title: "Tried a fourth button variant for marketing; reverted"
    date: 2026-02-14
    score: 4.6
    relevance_signal: "tag match (button, variant) + title match (fourth button variant)"
    summary: "Marketing wanted a new primary-cta variant outside approved 3-variant set; shipped then reverted 1 week later."
  - path: ...
    title: ...
    date: ...
    score: 3.8
    relevance_signal: ...
    summary: ...
summary:
  total_lessons_scanned: 24
  returned: 3
  skipped_due_to_low_score: 21
  no_matches_note: null
```

If no lessons score above 2.0, return empty `retrieved_lessons[]` and set `summary.no_matches_note: "no lessons sufficiently relevant to topic"`.

## Security / coexistence

- READ-ONLY. Never modifies any file.
- Reads only under `lessons_root`.
- NEVER reads `docs/solutions/` or other tools' namespaces — out of scope for this agent. This plug-in does not invoke other plug-ins' Task namespaces; foreign namespaces are respected as external territory only.

## Scope

- **Use `harness-designing:research:lesson-retriever`** for design-harness lessons under `docs/knowledge/lessons/` (Layer 5), filtered and weighted. That is this agent's only corpus.

## Failure modes

- `lessons_root` missing → return empty + note
- Malformed YAML → skip that lesson, note in skipped count
- Large corpus (>100 lessons) → stream through files one at a time; return highest-scoring as you go

## See also

- `skills/hd-maintain/references/lesson-patterns.md` — what well-formed lessons look like (scoring assumes this shape)
- `agents/analysis/rule-candidate-scorer.md` — sibling agent for cluster-level analysis
