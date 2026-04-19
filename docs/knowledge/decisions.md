---
memory_type: procedural-chosen
domain: decisions
split_threshold: 15
---
<!-- Tier: 2 (append-only ADR log) -->
# Decisions

ADR-style: "we chose X over Y because Z." Append-only — supersede with new entries, never edit old ones (the audit trail matters).

## Format

```markdown
## YYYY-MM-DD — <short-decision-title>

**Context:** <what prompted this decision>
**Options considered:** <A, B, C — brief>
**Chosen:** <which and why>
**Trade-offs accepted:** <what we gave up>
**Supersedes:** <date of prior decision this replaces, if any>
```

## Entries

<!-- Add new decisions above this line, most recent first. -->

## 2026-04-18 — Memory-term rename: "graduation" → "rules" / "adoption"

**Context:** Phase 3i.2 consistency sweep flagged that "graduation" overloaded two concepts — (a) the event where a lesson becomes a rule, and (b) the standing list of adopted rules. Mixed metaphor with academic "graduation" also obscured the mechanism (a rule is *adopted* by the team).
**Options considered:** (A) keep "graduation" everywhere; (B) rename the section heading only; (C) full rename — section `## Rules`, event verb `adopt`, meta-log file `changelog.md` (merged from the separate `graduations.md`).
**Chosen:** C. Clearer semantics, fewer files, aligns with how ADRs talk about "adopting" a decision.
**Trade-offs accepted:** One-pass sweep across living docs required (W3 finding in 3i audit); historical lesson files retain the old term (history is sacred).
**Supersedes:** N/A (first memory-term decision).
