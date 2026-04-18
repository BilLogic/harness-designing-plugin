# The design harness — concept overview

**Distilled from:** Substack article §2 (the five-layer frame) + §3 (why this matters now).

## The claim

You already have a design harness. It's just scattered — across Slack pins, Notion docs, Figma comments, retros, and a decade of design-review muscle memory. This framework gives that pile a shape so it can compound instead of rot.

## Five layers

| # | Layer | What it is | Mutability | Article § |
|---|---|---|---|---|
| 1 | **Context Engineering** | Stable context the AI needs every task: design system, product, conventions, agent persona. | Curated; revised with product | §4a |
| 2 | **Skill Curation** | Reusable capabilities your team offers: research, plan, prototype, review, compound. | Additive | §4b |
| 3 | **Workflow Orchestration** | How skills compose into real work: sequences, handoffs, quality gates. | Versioned | §4c |
| 4 | **Rubric Setting** | Taste embedded as checks: accessibility, design-system compliance, component budgets. | Distributed across the harness (not a folder) | §4d |
| 5 | **Knowledge Compounding** | What the team has learned — lessons, decisions, rules. | Append-only for lessons; rules edit AGENTS.md | §4e |

## Why this isn't a style guide

Style guides are PDFs. They go stale. They describe outputs after the fact. A harness is running code the AI uses *every time* — shaping the workflow that produces the outputs. Style guide answers "what does our button look like?" A harness answers "how does our team decide when to add a button variant, and what happens to that decision six months later?"

## Why now (§3)

Design teams in 2026 have individual AI tooling (Cursor, Claude, Figma AI, ChatGPT) but no shared harness. Fifteen designers each re-learning the same button-variant lesson is 15× the wasted cycles. Scattered knowledge doesn't just fail to compound — it actively rots as people rotate through the team. A shared harness is the difference between "AI made us faster at the same mistakes" and "AI made us slower at making them again."

## The four verbs in this plug-in

This plug-in exposes four skills, one per lifecycle phase:

| Verb | Skill | Phase | Ships |
|---|---|---|---|
| **learn** | `/hd:learn` | any | v0.MVP |
| **setup** | `/hd:setup` | one-time | v0.MVP |
| **maintain** | `/hd:maintain` | ongoing | v0.5 |
| **improve** | `/hd:review` | periodic | v1 |

You're reading output from the first skill right now.

## See also (load on demand)

- Memory taxonomy (procedural / semantic / episodic / working) → [memory-taxonomy.md](memory-taxonomy.md) (article §2.5)
- Specific layer deep-dives → [layer-1-context.md](layer-1-context.md) through [layer-5-knowledge.md](layer-5-knowledge.md)
- Term lookups → [glossary.md](glossary.md)
- Common questions → [faq.md](faq.md)
- How this differs from compound-engineering → [coexistence-with-compound.md](coexistence-with-compound.md)
