---
title: Article Quote Finder — Default Corpus
loaded_by: article-quote-finder
status: active
public_url: https://rexandduckie.substack.com/p/stop-chasing-design-tools-start-building
---

# Article Quote Finder — Default Corpus

## Purpose

This file is the default article corpus consulted by the `article-quote-finder` agent when no user-configured sources override it. Users can override any row (or add rows) via `article_sources` in their own repo's `hd-config.md`; user configuration always wins.

## Corpus table

Article: **Stop Chasing Design Tools. Start Building a Design Harness** by Bill Guo. Single-page Substack post — all sections live at the same URL; section anchors below are heading slugs Substack auto-generates from the section titles.

| Section | URL | Memory Type Focus | Layer Focus |
|---|---|---|---|
| Thesis / TL;DR (§1) | `https://rexandduckie.substack.com/p/stop-chasing-design-tools-start-building#tldr` | overview | all five layers — see `skills/hd-learn/references/concept-overview.md` |
| Why Tool Chasing Fails (§2) | `https://rexandduckie.substack.com/p/stop-chasing-design-tools-start-building#why-this-starts-to-feel-sisyphean` | overview | all five layers |
| Harness Definition (§3) | `https://rexandduckie.substack.com/p/stop-chasing-design-tools-start-building#how-might-we-harness-the-tools-instead-of-chasing-them` | overview | all five layers |
| Layer 1 — Context (§4a) | `https://rexandduckie.substack.com/p/stop-chasing-design-tools-start-building#layer-1-context-engineering` | semantic | `skills/hd-learn/references/layer-1-context.md` |
| Layer 2 — Skills (§4b) | `https://rexandduckie.substack.com/p/stop-chasing-design-tools-start-building#layer-2-skill-curation` | procedural | `skills/hd-learn/references/layer-2-skills.md` |
| Layer 3 — Orchestration (§4c) | `https://rexandduckie.substack.com/p/stop-chasing-design-tools-start-building#layer-3-workflow-orchestration` | procedural (meta) | `skills/hd-learn/references/layer-3-orchestration.md` |
| Layer 4 — Evaluation Design (§4d) | `https://rexandduckie.substack.com/p/stop-chasing-design-tools-start-building#layer-4-evaluation-design` | evaluative | `skills/hd-learn/references/layer-4-rubrics.md` |
| Layer 5 — Knowledge (§4e) | `https://rexandduckie.substack.com/p/stop-chasing-design-tools-start-building#layer-5-knowledge-compounding` | episodic | `skills/hd-learn/references/layer-5-knowledge.md` |
| Closing (§5) | `https://rexandduckie.substack.com/p/stop-chasing-design-tools-start-building#the-floor-the-ceiling-and-the-ladder` | overview | all five layers |

## Populating this corpus

The article is published. To override per-repo (leaves this file alone; takes precedence for your repo):

```yaml
# hd-config.md
article_sources:
  article_part_1_thesis: "https://your-mirror.example.com/article-part-1"
  layer_1_context: "https://your-mirror.example.com/layer-1"
```

Keys match the Section labels above (slugified) or use the legacy `article_part_N_*` names documented in the agent spec. User-supplied keys override matching corpus rows; unmatched keys are appended.

## Sentinel detection

The agent detects placeholder state by scanning the URL column for the literal string `{{TBD}}`. Rules:

- If a row's URL is `{{TBD}}` AND no user override in `hd-config.md article_sources` covers the same section → skip that row (do not attempt retrieval, do not fabricate a URL).
- If ALL rows resolve to `{{TBD}}` with no overrides → emit the graceful empty response (`corpus_status: not-configured`) documented in `article-quote-finder.md` and exit cleanly.
- Never invent URLs, never fabricate quotes. When the corpus is not configured, direct callers to `skills/hd-learn/references/` for offline concept content instead.

The default corpus above is populated and active — sentinel rules apply to user overrides only.
