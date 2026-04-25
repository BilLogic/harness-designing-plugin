---
title: "Anthropic skill best-practices distilled into our authoring discipline"
date: 2026-04-16
tags: [anthropic-best-practices, skill-authoring, context-budget, progressive-disclosure]
graduation_candidate: false
---

# Lesson

**Context:** Before authoring `hd-onboard` and `hd-setup`, we fetched and read Anthropic's [Skill best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices) and the [Complete Guide to Building Skills for Claude](https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf).

**Decision / Observation:** Six rules emerged as non-negotiable for our skills:

1. **Concise is king.** The context window is a public good. Default assumption: Claude is already smart — only add what Claude doesn't know. Our SKILL.md targets ≤200 lines; references are 40-150 lines each.

2. **Match freedom to fragility.** High-freedom instructions for tasks with many valid approaches (our `hd-onboard` Q&A). Low-freedom specific scripts for fragile operations (our `detect-mode.sh` — deterministic, not LLM-guessed).

3. **`name` + `description` are how Claude picks the skill.** Third-person, ≤180 chars, include both *what it does* AND *when to use it*. Our descriptions hit 141 (hd-onboard) and 127 (hd-setup) chars.

4. **Progressive disclosure via references.** SKILL.md is a router; references load on demand; scripts execute without loading source. We expose 10 atomic references in `hd-onboard/` and 9 in `hd-setup/`, one concept per file, one level deep.

5. **Solve, don't punt.** Error-handling in scripts must explicitly handle failures, not leave them to Claude's runtime improv. Our `detect-mode.sh` has explicit fallback for each signal; bash 3.2+ compatibility documented.

6. **Test with all models you'll ship to.** Our distribution targets Claude + Codex + Cursor; SKILL.md format is identical across all three. Sibling manifests handle the per-platform registration.

**Result:** Authoring discipline is now codified in `AGENTS.md` § "Skill compliance checklist". Every skill we ship passes the checklist at commit time. Pre-commit grep checks catch most violations automatically (bare backtick references, Windows paths, unclosed fences).

**Graduation-readiness:** The *checklist* is already in AGENTS.md — functionally the rule it would graduate to. This lesson documents *why* the checklist exists, not a new rule. No graduation needed.
