---
name: hd:learn
description: Answers questions about the five-layer design harness framework. Use when learning concepts, asking about a layer, or orienting before setup.
---

# hd:learn — learn the design harness concept

## Interaction method

Default: respond directly to the user's question with citations to article sections and links to reference files. When a decision needs user input (for example, "which layer do you want a deeper explanation of?"), use `AskUserQuestion` if available. If `AskUserQuestion` is unavailable (non-Claude hosts — Codex, Gemini, Copilot), fall back to a numbered list: "Reply with the number of your choice."

## Single job

Answer questions about the five-layer framework with accurate citations to the Substack article. **Read-only** — no writes to disk, no scaffolding, no config changes.

## Trigger phrases

- "What is a design harness?"
- "Explain Layer N" (where N is 1–5 or a layer name)
- "What's the difference between context and knowledge?"
- "How do I know if I need Layer 4?"
- "/hd:learn [topic]"

## Workflow

Copy this checklist and track progress:

```
hd:learn Progress:
- [ ] Step 1: Identify topic (concept / specific layer / glossary term / FAQ)
- [ ] Step 2: Load matching reference file
- [ ] Step 3: Answer with article § citations
- [ ] Step 4: Close with a concrete suggested next step
```

### Step 1 — Identify topic

Map the question to one of four categories:

- **Concept / overview** → load [references/concept-overview.md](references/concept-overview.md)
- **Specific layer** → load the matching `layer-N-*.md` reference (see "Routing table" below)
- **Term lookup** → load [references/glossary.md](references/glossary.md)
- **Common question** → load [references/faq.md](references/faq.md)

Questions spanning multiple categories: load multiple references. Questions about memory (procedural / semantic / episodic / working) → always load [references/memory-taxonomy.md](references/memory-taxonomy.md).

### Step 2 — Load reference

Use the `Read` tool on the one-level-deep markdown link. Never load nested paths; every reference lives directly under `references/`.

### Step 3 — Answer with citations

Every substantive claim cites an article section (`§2`, `§4a`, etc.). Format:

> Context (Layer 1) is your semantic memory — the stable stuff the AI needs every time (design system, product, conventions). Mutable but curated. See article §4a and [layer-1-context.md](references/layer-1-context.md).

Never answer without citations. "According to the article" is weak; `§4a` is direct.

### Step 4 — Close with a next step

Every response ends with a concrete suggested action:

- "Ready to scaffold?" → suggest `/hd:setup`
- "Want to read the full argument?" → suggest article URL
- "Have a related question?" → suggest the matching reference file

## Routing table

| Question pattern | Primary reference | Likely also load |
|---|---|---|
| "What is a design harness?" / "Why this framework?" | [concept-overview.md](references/concept-overview.md) | — |
| "Explain Layer 1" / "Tell me about Context" | [layer-1-context.md](references/layer-1-context.md) | memory-taxonomy.md |
| "Explain Layer 2" / "What's Skill Curation?" | [layer-2-skills.md](references/layer-2-skills.md) | — |
| "Explain Layer 3" / "Workflow Orchestration" | [layer-3-orchestration.md](references/layer-3-orchestration.md) | layer-2-skills.md |
| "Explain Layer 4" / "What are rubrics?" | [layer-4-rubrics.md](references/layer-4-rubrics.md) | layer-1-context.md |
| "Explain Layer 5" / "Knowledge compounding" | [layer-5-knowledge.md](references/layer-5-knowledge.md) | memory-taxonomy.md |
| "What's procedural / episodic / semantic memory?" | [memory-taxonomy.md](references/memory-taxonomy.md) | layer-1-context.md + layer-5-knowledge.md |
| "Define [term]" | [glossary.md](references/glossary.md) | — |
| "How is this different from compound-engineering?" | [coexistence-with-compound.md](references/coexistence-with-compound.md) | — |
| "Do I need X?" / "Should I skip Y?" | [faq.md](references/faq.md) | — |

## Example interactions

**Q: "What's the difference between context and knowledge in this framework?"**

Load [layer-1-context.md](references/layer-1-context.md), [layer-5-knowledge.md](references/layer-5-knowledge.md), and [memory-taxonomy.md](references/memory-taxonomy.md). Respond:

> Context (Layer 1) is *semantic memory* — evergreen reference material the AI needs every time (design system, product, conventions). Mutable but curated. See article §4a.
>
> Knowledge (Layer 5) is *episodic memory* — dated narratives of what happened (decisions, lessons, rule adoptions). Append-only; history is sacred. See article §4e.
>
> The most common mistake is collapsing them — appending lessons into the design-system cheat-sheet bloats it with time-bound stories, signal decays. See article §2.5 for the memory taxonomy.
>
> Ready to scaffold both layers? Run `/hd:setup`.

**Q: "How do I know when to promote a lesson into a rule?"**

Load [layer-5-knowledge.md](references/layer-5-knowledge.md). Respond:

> Three criteria (article §4e): the situation has shown up 3+ times across different designers; the lesson has a clean imperative ("always X unless Y"); the team agrees via RFC, review, or PR conversation.
>
> On rule adoption: the original lesson stays (history is sacred), a new rule lands in `AGENTS.md` under "Rules," and a meta-entry lands in `docs/knowledge/changelog.md` linking lesson → rule + date.
>
> The `/hd:maintain` skill proposes rule adoptions when it detects matching lessons (≥3 same-topic occurrences). Run `/hd:maintain rule-propose <topic>` to start.

## What this skill does NOT do

- **Does not scaffold files** → hand off to `/hd:setup`
- **Does not answer non-harness questions** → politely decline; suggest a topic from the routing table
- **Does not access the user's repo state** (no reads of their `docs/` etc.)
- **Does not invoke other skills directly** — always suggest, never invoke

## Sub-agents invoked

Fully-qualified Task names only (compound 2.35.0 convention).

- `design-harnessing:research:article-quote-finder` — optional solo dispatch when a question requires pulling an exact quote or passage from the source Substack article and its local corpus

## Reference files

- [concept-overview.md](references/concept-overview.md) — the framework in 200 words
- [memory-taxonomy.md](references/memory-taxonomy.md) — procedural / semantic / episodic / working
- [layer-1-context.md](references/layer-1-context.md)
- [layer-2-skills.md](references/layer-2-skills.md)
- [layer-3-orchestration.md](references/layer-3-orchestration.md)
- [layer-4-rubrics.md](references/layer-4-rubrics.md)
- [layer-5-knowledge.md](references/layer-5-knowledge.md)
- [glossary.md](references/glossary.md) — term lookups
- [faq.md](references/faq.md) — 10 canonical questions
- [coexistence-with-compound.md](references/coexistence-with-compound.md) — how we differ from compound-engineering
