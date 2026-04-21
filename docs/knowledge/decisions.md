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

## 2026-04-21 — Advisor-not-installer framing for external tools

**Context:** Phase 3n live run on sense_frontend surfaced that Step 3 (Tool discovery) had an unclear mental model. Original `known-mcps.md` framed the plug-in as an MCP installer — a whitelist of packages we'd walk users through installing. Bill clarified this was wrong: the plug-in's role is to scan, ask, research, and link to install docs. User installs themselves.
**Options considered:** (A) keep installer framing, beef up known-mcps.md; (B) fully scan + install automatically; (C) advisor role — plug-in researches AI integration (MCP/CLI/API) when user names a tool, links to official install docs, never installs; parallel path is paste-and-organize.
**Chosen:** C. Respects user agency; simpler code surface (no install-walkthrough logic); works across every host (Claude/Codex/Cursor/terminal) uniformly; surfaces the plug-in's actual value (organizing existing content) separately from the wire-up question.
**Trade-offs accepted:** No "one-click install" UX. Users have to read install docs and run commands themselves. Deemed acceptable — they're already in a shell, and the plug-in's value isn't installer ergonomics.
**Supersedes:** Implicit installer framing in pre-3n `known-mcps.md` (integration-path: install-walkthrough).

## 2026-04-21 — `docs/rubrics/` adoption policy: 3 of 14 starters

**Context:** 2026-04-20 harness review flagged `docs/rubrics/` as under-populated (1 of 14 starters adopted). 2026-04-21 rubric-recommender audit clarified: this plug-in is markdown+scripts, not UI — most visual rubrics are genuinely N/A.
**Options considered:** (A) adopt all 14 starters for maximum coverage; (B) adopt 1 (`skill-quality`) and leave 13 silent; (C) adopt 3 (`skill-quality`, `ux-writing`, `heuristic-evaluation`), waive 10 visual rubrics with dated rationale, waive `component-budget` as duplicative with `budget-check.sh`, defer `i18n-cjk` until localization lands.
**Chosen:** C. Surfaces only the rubrics that actually apply. Each decision is dated + documented in `AGENTS.md § Rules` so the next audit stops re-flagging.
**Trade-offs accepted:** Future rubric additions require explicit adoption + waiver decisions (slightly more ceremony). Accepted — silent N/A was already causing audit confusion.
**Supersedes:** 2026-04-20 pattern of "adopt skill-quality only; leave others silent."

## 2026-04-18 — Memory-term rename: "graduation" → "rules" / "adoption"

**Context:** Phase 3i.2 consistency sweep flagged that "graduation" overloaded two concepts — (a) the event where a lesson becomes a rule, and (b) the standing list of adopted rules. Mixed metaphor with academic "graduation" also obscured the mechanism (a rule is *adopted* by the team).
**Options considered:** (A) keep "graduation" everywhere; (B) rename the section heading only; (C) full rename — section `## Rules`, event verb `adopt`, meta-log file `changelog.md` (merged from the separate `graduations.md`).
**Chosen:** C. Clearer semantics, fewer files, aligns with how ADRs talk about "adopting" a decision.
**Trade-offs accepted:** One-pass sweep across living docs required (W3 finding in 3i audit); historical lesson files retain the old term (history is sacred).
**Supersedes:** N/A (first memory-term decision).
