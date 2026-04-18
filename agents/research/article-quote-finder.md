---
name: article-quote-finder
description: "Given a concept question about the five-layer design harness framework, finds exact quotes + §-citations from the Substack article series. Enables grounded, source-cited answers. Used by hd:onboard to enrich answers with verbatim article quotes instead of paraphrasing."
color: yellow
model: inherit
---

# article-quote-finder

Return verbatim article quotes with section citations for a given concept question. Grounds answers in the source material instead of relying on model memory.

## Inputs

- `concept_question` — the user's question or topic (required)
- `article_sources` — map of section-id → local article path OR URL. Defaults to the documented locations (see SOURCES below) if not provided.
- `max_quotes` — optional cap, default 3

## Expected sources

The Substack article series lives across multiple posts + source drafts. Known local copies and canonical URLs are documented in the user's `hd-config.md` under `article_sources:` if configured. If not configured, ask the calling skill; do NOT guess URLs.

Typical sources:
- `article_part_1_thesis` — §1 (why this matters), §2 (five-layer overview), §2.5 (memory taxonomy)
- `article_part_2_layers` — §4a Context, §4b Skills, §4c Orchestration, §4d Rubrics, §4e Knowledge
- `article_part_3_practice` — §5 case study, §6 scaling, §7 open questions

## Procedure

### Phase 1: resolve source paths
Read `hd-config.md` for `article_sources`. If absent, the calling skill should provide local paths or URLs via `article_sources` input. If still none → return empty + note.

### Phase 2: locate relevant § sections
Match `concept_question` keywords to section headings. Load ONLY the matching section(s) of the article (not the full corpus — progressive disclosure).

### Phase 3: extract top N verbatim quotes
Select up to `max_quotes` quotes. Each quote must be:
- Verbatim (no paraphrasing)
- 1–3 sentences long (not too short to be meaningful, not a full paragraph dump)
- Clearly tagged with its § number and any sub-heading

### Phase 4: classify each quote's role
Tag each quote as one of:
- `definition` — defines a key term
- `principle` — states a rule or heuristic
- `example` — concrete illustration
- `caveat` — limitation or exception

## Output

```yaml
concept_question: "What's the difference between context and knowledge?"
resolved_sources:
  - article_part_1_thesis (§2.5)
  - article_part_2_layers (§4a, §4e)
quotes:
  - section: "§2.5"
    role: definition
    text: "Context is semantic memory — evergreen reference material the AI needs every time (design system, product, conventions). Mutable but curated."
    location_hint: "article part 1, 'Memory Taxonomy' subsection"
  - section: "§4e"
    role: definition
    text: "Knowledge is episodic memory — dated narratives of what happened (decisions, lessons, graduations). Append-only; history is sacred."
    location_hint: "article part 2, 'Layer 5: Knowledge Compounding' opening"
  - section: "§2.5"
    role: principle
    text: "The most common mistake is collapsing Context and Knowledge — appending lessons into the design-system cheat-sheet bloats it with time-bound stories, signal decays."
    location_hint: "article part 1, 'Memory Taxonomy' cautionary example"
summary:
  quotes_returned: 3
  sections_consulted: 3
  notes: null
```

If sources aren't available or don't contain relevant material, return empty `quotes[]` + `summary.notes: "no article source available — answer from concept references instead"`.

## Coexistence / security

- READ-ONLY. Never modifies any file or the article source.
- If article sources are URLs, use fetch tool with appropriate caching; do NOT refetch the same URL more than once per invocation.
- When the calling skill is `hd:onboard`, this agent supplements (does not replace) `skills/hd-onboard/references/*.md` — the static reference files are the primary answer source; article quotes enrich citations.

## When this agent is overkill

For the 10 FAQ questions in `skills/hd-onboard/references/faq.md`, the answers + section citations are already baked in. Only invoke this agent when the user asks a question NOT covered by the static FAQ/references, OR when they explicitly want verbatim quotes.

## Failure modes

- Sources not configured → empty return + instruction for the calling skill
- Network failure (URL fetch) → return any quotes already extracted + note the failed source
- Verbose output (>1000 chars of quote) → truncate each quote to 3 sentences max
