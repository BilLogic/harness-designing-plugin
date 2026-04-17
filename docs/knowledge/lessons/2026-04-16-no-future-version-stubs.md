---
title: "Don't ship future-version skill stubs with disable-model-invocation"
date: 2026-04-16
tags: [skill-authoring, stubs, disable-model-invocation, forecloses-design-space, anti-pattern]
graduation_candidate: true
graduated_to: "AGENTS.md § Graduated rules, entry 2026-04-16"
---

# Lesson

**Context:** Mid-session we had scaffolded four skills in the plug-in at v0.MVP time: `hd-onboard`, `hd-setup` (both ready for implementation), plus `hd-compound` (v0.5) and `hd-review` (v1) as **namespace-reserving stubs**. Both stubs carried `disable-model-invocation: true` in frontmatter and fake-but-plausible trigger text in their descriptions.

Ran `/ce:review` on the scaffold with multiple compound reviewer agents.

**Decision / Observation:** Three independent agents converged on the same diagnosis:

1. **pattern-recognition-specialist** — flagged dangling markdown links from `hd-setup/SKILL.md` to the stubs; even `(v0.5)` labels don't prevent markdown parsers from attempting the link.
2. **code-simplicity-reviewer** — called stubs "worse than absent." Reasoning: the description field carries trigger text ("captures design lessons", "audits the design harness"). A user asking "capture this lesson" might get routed by Claude to the stub via description matching → the stub refuses to work → worse UX than "command not found."
3. **agent-native-reviewer** — flagged `disable-model-invocation: true` on stubs as *foreclosing design space*. The flag is a forward-looking commitment — "this skill will never auto-trigger." For v0.5 skills we haven't yet designed, we're locking in a human-loop shape that may be hard to reverse when the skill actually has logic.

Three reviewers, three angles, one convergent rule:

> **Don't ship future-version skill stubs with `disable-model-invocation: true` at current version. Wait to author the skill when it's being built. Stubs with fake trigger text + the flag make the skill surface actively worse than if it didn't exist.**

**Result:** Deleted both stubs (`skills/hd-compound/` and `skills/hd-review/`) during Phase 1 structural refactor. Will author real versions at v0.5 and v1 respectively. Repo README and CHANGELOG document the "coming at v0.5 / v1" commitment without shipping the stub machinery.

**Graduation-readiness:** **Yes.** Clean imperative, three independent confirmations in one review pass, applies to all future skill additions. Graduated to `AGENTS.md` "Graduated rules" 2026-04-16.

## Counter-cases (for future reference)

Stubs are OK when:
- The skill is **part of the current version** but not yet implemented (WIP; will land in this release)
- The stub explicitly refuses all inputs with "not yet implemented" + timeline
- The stub has NO `description` trigger text that would route real user queries to it

Stubs are NOT ok when (per this rule):
- Skill is scoped for a future version
- Stub has plausible trigger text that could match real user queries
- `disable-model-invocation: true` is used as a commitment device before the actual skill is designed
