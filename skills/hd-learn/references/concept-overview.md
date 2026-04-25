# The design harness — concept overview

**Distilled from:** "Stop Chasing Design Tools. Start Building a Design Harness" §TL;DR + §"How might we harness the tools instead of chasing them?"

## The claim

AI keeps lowering the floor for design output. A design harness gives teams the layer they own across tool releases: durable context, reusable skills, orchestrated workflows, checkable standards, and lessons that carry forward.

The short formula:

```text
Agent = Model + Harness
Design Harness = Context Engineering + Skill Curation + Workflow Orchestration + Evaluation Design + Knowledge Compounding
```

## Five layers

| # | Layer | What it is | Mutability | Article § |
|---|---|---|---|---|
| 1 | **Context Engineering** | Stable context the AI needs every task: design system, product, conventions, agent persona. | Curated; revised with product | §4a |
| 2 | **Skill Curation** | Reusable capabilities your team offers: research, plan, prototype, review, compound. | Additive | §4b |
| 3 | **Workflow Orchestration** | How skills compose into real work: sequences, handoffs, quality gates. | Versioned | §4c |
| 4 | **Evaluation Design** | Standards made checkable: accessibility, design-system compliance, component budgets, review gates. Rubrics are the implementation mechanism. | Distributed across the harness (not a folder) | §4d |
| 5 | **Knowledge Compounding** | What the team has learned — lessons, decisions, rules. | Append-only for lessons; rules edit AGENTS.md | §4e |

## Why this isn't a style guide

Style guides are PDFs. They go stale. They describe outputs after the fact. A harness is running code the AI uses *every time* — shaping the workflow that produces the outputs. Style guide answers "what does our button look like?" A harness answers "how does our team decide when to add a button variant, and what happens to that decision six months later?"

## Why now (§3)

Design teams in 2026 have individual AI tooling (Cursor, Claude, Figma AI, ChatGPT, image models, design-generation tools) but no shared harness. When each release resets the practice, the practice depends too much on the tool. A shared harness is the difference between "AI made us faster at the same mistakes" and "AI made us slower at making them again."

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
