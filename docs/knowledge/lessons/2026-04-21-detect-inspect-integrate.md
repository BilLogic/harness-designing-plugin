---
title: "Detect infrastructure universally; integrate through user decision; reinforce the 5-layer harness as the coordinating frame"
date: 2026-04-21
memory_type: episodic
importance: 5
tags: [architecture, detection, external-formats, user-agency, integration, rule-candidate]

# Machine-extractable — for agent cross-reference (3p.3 schema)
applies_to_layers: [l1]
related_rules: []
related_lessons:
  - 2026-04-21-whitelist-vs-research-time
  - 2026-04-21-external-source-fill-path
decision_summary: "Never hardcode known external formats (DESIGN.md, CONTRIBUTING.md, CODEOWNERS) as special cases. Detect substantive infrastructure files generically; present as integration candidates; user decides integration."
result_summary: "Phase 3p ships generic L1 EXECUTE surfacing (no filename whitelist); our 5-layer structure stays the coordinating frame for external content."
next_watch: "When a second external format reaches ecosystem adoption (say, agents.md.spec), we should NOT reach for a filename probe. Second confirmation of this pattern graduates the candidate rule."
rule_candidate: true
rule_ref: R_2026_04_21_detection_enumeration  # graduated 2026-04-21 (paired with whitelist-vs-research-time)
supersedes: null
superseded_by: null
---

# Lesson

## Context

Post-v1.2.0 ship (2026-04-21, later in the day), reflection on the emerging DESIGN.md spec at `google-labs-code/design.md` raised the question: *"this is getting popular — should we detect it and integrate it into L1?"*

First instinct: add a `DESIGN.md` filename probe to `detect.py`. Maybe a `design-md-compliance` starter rubric. Special-case the L1 design-system scaffolder to defer to it.

That instinct was wrong. The Phase 3o whitelist-vs-research-time lesson (earlier today) literally warned against this pattern — hardcoding specific tool names produces a maintenance treadmill that never catches up with the ecosystem. A filename whitelist is the same shape: tools ship → list grows → maintainer bottleneck → coverage stays ~20%.

User caught it during the Phase 3p planning conversation: *"our solution should be, like, generic and universal. We shouldn't be, like, too rigid with how we approach things and always try to loop human into the decision making process."*

## Decision / Observation

**The anti-pattern:** detecting specific external formats by name + scaffolding special integration paths per format. Grows linearly with ecosystem; every new popular format demands a code change.

**The pattern:** three disciplined moves.

1. **Detect universally.** `detect.py` already surfaces substantive files via generic signals: `scattered_l1_signals` (PRD-shaped filenames, tech-stack docs, design-system dirs), `root_l1_files` (README.md, `*.local.md`, root SKILL.md — 3o.5d), `raw_signals.deps` + `raw_signals.urls` (3o.1). No filename whitelist. Substance thresholds (≥30 non-blank lines for README, ≥5 for `*.local.md`, etc.) keep trivial matches out.

2. **Inspect + present as integration candidates.** At per-layer EXECUTE, when detected files exist, proactively surface them with concrete integration options:
   - Scaffold pointer (thin summary file under `docs/context/`; original stays authoritative)
   - Paste-organize (extract content into our layer sub-folders)
   - Skip (treat as unrelated; create from scratch)
   The plug-in **reads** the file + **suggests** integration paths; it does NOT auto-integrate.

3. **Route every integration through user decision.** The 5-layer harness is the coordinating frame. External formats (DESIGN.md, CONTRIBUTING.md, CODEOWNERS, wiki exports, whatever ships next) are content-input to that frame, not override of it. Reviewing / revising / elaborating happens against OUR structure, not against the external format's rules.

### Why this specifically matters for DESIGN.md

The DESIGN.md spec is well-designed. Its dual-layer (YAML frontmatter + prose body) + "unknown content behavior" table + section-order-with-aliases are genuinely good patterns. But adopting DESIGN.md as a *privileged* L1 format would mean:
- We defer to its structure over ours — losing the 5-layer coordination
- We'd need to understand its spec updates — maintenance coupling
- We'd implicitly exclude the 10 other emerging design-system formats

Adopting its *patterns* (rigorous YAML-vs-prose separation in our own templates — see 3p.3) is legitimate. Adopting *it* as a special case is the trap.

### What this principle does NOT say

- Don't *read* external formats. We should. L1 EXECUTE proactively surfaces them.
- Don't *learn* from them. Adopting DESIGN.md's template-discipline patterns in our own lesson/decision/review frontmatter (Phase 3p.3) is the right borrow.
- Don't *link* to them. If the user has DESIGN.md, our pointer file under `docs/context/design-system/` referencing it is the right integration path when they choose Path A.

What it DOES say: never encode specific filenames as branch conditions in our detector, our scaffolder, or our rubric set. No `if filename == "DESIGN.md"`. No `design-md-compliance` starter rubric. No filename-indexed integration paths.

## Result

Phase 3p shipped with 5 units embodying the discipline:
- L1 EXECUTE proactively surfaces any detected substantive file (DESIGN.md or otherwise) via the existing `scattered_l1_signals` mechanism — no hardcoded filename logic
- Ship `rubric-template.md` so users can author format-specific rubrics themselves (including a DESIGN.md-compliance rubric if they want one)
- This lesson captured as rule_candidate for future graduation

## Graduation-readiness

**Candidate rule:** *"Detect substantive infrastructure files universally (no filename whitelist). Present detected files as integration candidates with concrete options (pointer / paste-organize / ignore). Every integration routes through explicit user decision. Our 5-layer harness is the coordinating frame; external formats are content-input, not override."*

**Strength of evidence so far:**
1. 2026-04-21 Phase 3o — whitelist-vs-research-time rejection of per-tool regex entries (first confirmation of the parent anti-pattern)
2. 2026-04-21 Phase 3p conversation — user caught the same anti-pattern being reintroduced as filename whitelist for DESIGN.md

This lesson is the 1st standalone confirmation. The related 2026-04-21 advisor-not-installer rule (already graduated) is adjacent but not identical — advisor-not-installer is about *action*; detect-inspect-integrate is about *structure / coordinating frame*.

**Graduation threshold:** second confirmation — i.e., a future emerging format (agents.md.spec, README.md extended shape, AGENTS.md semantic extension, etc.) we resist hardcoding by applying this pattern. At that point promote to `AGENTS.md § Rules`.

## Prevention pattern going forward

Before adding any filename-specific branch to `detect.py`, the L1 scaffolder, or the rubric loader, ask:
- *Would this entry need a sibling for every new popular format in this category?*
- *Does the generic signal mechanism already catch this file?*
- *Am I privileging one external format over others arbitrarily?*

If any answer is yes, push to the generic mechanism + user-decided integration path. The cost of generic mechanism is slightly less out-of-box recognition; the benefit is unbounded coverage without maintainer attention.

## Next

- Watch for the second external-format temptation. Most likely candidates: `agents.md.spec` (emerging), extended `AGENTS.md` semantics (Anthropic + others), some "standard" harness manifest format. When it appears, apply this pattern; that's the 2nd confirmation.
- If we see drift in reviewer behavior (someone suggesting "let's add a DESIGN.md probe"), cite this lesson.
- Related follow-up (Phase 3p+ or later): ship a user-authored `design-md-compliance` rubric as a *community starter* if users ask — but not in the plug-in's core starter set, and not privileged over other format-compliance rubrics.
