---
title: Article Quote Finder — Default Corpus
loaded_by: article-quote-finder
status: draft-local
---

# Article Quote Finder — Default Corpus

## Purpose

This file is the default article corpus consulted by the `article-quote-finder` agent when no user-configured sources override it. Users can override any row (or add rows) via `article_sources` in their own repo's `hd-config.md`; user configuration always wins. The public article URL is still TBD, so the default corpus points at a local draft excerpt file. Replace these local paths with canonical URLs after publication.

## Corpus table

| Section | URL | Memory Type Focus | Layer Focus |
|---|---|---|---|
| Thesis / TL;DR (§1) | `agents/research/references/article-draft-stop-chasing-design-tools.md#1--thesis--tldr` | overview | all five layers — see `skills/hd-learn/references/concept-overview.md` |
| Why Tool Chasing Fails (§2) | `agents/research/references/article-draft-stop-chasing-design-tools.md#2--why-tool-chasing-fails` | overview | all five layers |
| Harness Definition (§3) | `agents/research/references/article-draft-stop-chasing-design-tools.md#3--harness-definition` | overview | all five layers |
| Layer 1 — Context (§4a) | `agents/research/references/article-draft-stop-chasing-design-tools.md#4a--context-engineering` | semantic | `skills/hd-learn/references/layer-1-context.md` |
| Layer 2 — Skills (§4b) | `agents/research/references/article-draft-stop-chasing-design-tools.md#4b--skill-curation` | procedural | `skills/hd-learn/references/layer-2-skills.md` |
| Layer 3 — Orchestration (§4c) | `agents/research/references/article-draft-stop-chasing-design-tools.md#4c--workflow-orchestration` | procedural (meta) | `skills/hd-learn/references/layer-3-orchestration.md` |
| Layer 4 — Evaluation Design (§4d) | `agents/research/references/article-draft-stop-chasing-design-tools.md#4d--evaluation-design` | evaluative | `skills/hd-learn/references/layer-4-rubrics.md` |
| Layer 5 — Knowledge (§4e) | `agents/research/references/article-draft-stop-chasing-design-tools.md#4e--knowledge-compounding` | episodic | `skills/hd-learn/references/layer-5-knowledge.md` |
| Closing (§5) | `agents/research/references/article-draft-stop-chasing-design-tools.md#5--closing` | overview | all five layers |

## Populating this corpus

When Bill's article publishes, populate URLs in one of two ways:

1. **Update this file in-place** (benefits all plug-in users). Replace local draft paths with the canonical post URL for each section. Flip `status: draft-local` to `status: active` in frontmatter.
2. **Override per-repo via `hd-config.md`** (leaves this file alone; takes precedence for your repo):

```yaml
# hd-config.md
article_sources:
  article_part_1_thesis: "https://example.substack.com/p/five-layer-harness-part-1"
  layer_1_context: "https://example.substack.com/p/layer-1-context"
  layer_5_knowledge: "https://example.substack.com/p/layer-5-knowledge"
```

Keys match the Section labels above (slugified) or use the legacy `article_part_N_*` names documented in the agent spec. User-supplied keys override matching corpus rows; unmatched keys are appended.

## Sentinel detection

The agent detects placeholder state by scanning the URL column for the literal string `{{TBD}}`. Rules:

- If a row's URL is `{{TBD}}` AND no user override in `hd-config.md article_sources` covers the same section → skip that row (do not attempt retrieval, do not fabricate a URL).
- If ALL rows resolve to `{{TBD}}` with no overrides → emit the graceful empty response (`corpus_status: not-configured`) documented in `article-quote-finder.md` and exit cleanly.
- Never invent URLs, never fabricate quotes. When the corpus is not configured, direct callers to `skills/hd-learn/references/` for offline concept content instead.
