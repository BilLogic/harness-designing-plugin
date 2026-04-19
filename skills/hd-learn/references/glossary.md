# Glossary

Canonical definitions for terms used across the design harness framework. `hd:learn` answers questions about any term here — this file is the single source of truth.

| Term | Definition | Article § |
|---|---|---|
| **Design harness** | The wrapper of context + skills + orchestration + rubrics + knowledge around an AI system that makes every task inherit team thinking. | §2 |
| **Harness layer** | One of the five parts of the framework: Context, Skills, Orchestration, Rubrics, Knowledge. | §2 |
| **Skill** | A named, versioned, reusable capability with a single job, a clear trigger, and bounded scope. | §4b |
| **Rubric** | Taste embedded as checks. A *behavior of the system*, distributed across definitions (Layer 1), execution (Layer 2 skill), and enforcement (AGENTS.md gate) — not a folder. | §4d |
| **Workflow** | A named sequence of skills + handoffs + gates that accomplishes something end-to-end. | §4c |
| **Handoff** | The connector between skills in a workflow; working-memory artifact passed forward. | §4c |
| **Gate** | A quality check between workflow steps. Usually pulls from Layer 4 rubrics. | §4c |
| **Graduation** | Promotion of a Layer 5 lesson (episodic) to a Layer 3/AGENTS.md rule (procedural). Requires 3+ occurrences + clean imperative + team agreement. The original lesson is never deleted. | §4e |
| **Procedural memory** | How we work. Lives in `AGENTS.md` + Layer 3 orchestration + rules from Layer 5. | §2.5 |
| **Semantic memory** | What we know. Lives in Layer 1 context (`docs/context/`). | §2.5 |
| **Episodic memory** | What happened. Lives in Layer 5 knowledge (`docs/knowledge/lessons/*.md`). | §2.5 |
| **Working memory** | Right now — current conversation turn. Also includes ephemeral handoffs. | §2.5 |
| **Tier 1 context** | Always-loaded context, ≤200 lines total. Core `AGENTS.md` + product one-pager. | §4a |
| **Tier 2 context** | Skill-triggered context. Design-system cheat-sheet, conventions — loaded only when a matching task runs. | §4a |
| **Tier 3 context** | Explicit-pull context. Full design-system library, archives — only when a skill or user explicitly asks. | §4a |
| **Progressive disclosure** | Skill pattern: SKILL.md is a router; `references/` are loaded on demand; `scripts/` are executed without loading source. | Anthropic spec |
| **Meta-harness** | A harness run on the thing building the harness. This plug-in's own `docs/` is its meta-harness — we dogfood the advocacy. | — |
| **Coexistence** | Running alongside another plug-in without namespace collisions. Requires discipline on paths, config files, and Task invocation syntax. | — |

## See also

- [concept-overview.md](concept-overview.md) — where terms fit in the overall frame
- [faq.md](faq.md) — common questions, grounded in these terms
