---
title: Article Quote Finder — Default Corpus
loaded_by: article-quote-finder
status: placeholder
---

# Article Quote Finder — Default Corpus

## Purpose

This file is the default article corpus consulted by the `article-quote-finder` agent when no user-configured sources override it. Users can override any row (or add rows) via `article_sources` in their own repo's `hd-config.md`; user configuration always wins. While the Substack article series publication is TBD, URLs below are sentinel `{{TBD}}` values and the agent fails gracefully with a clear empty response rather than attempting retrieval.

## Corpus table

| Section | URL | Memory Type Focus | Layer Focus |
|---|---|---|---|
| Introduction / Thesis (§1–§2) | `{{TBD}}` | overview | all five layers — see `skills/hd-onboard/references/concept-overview.md` |
| Layer 1 — Context (§4a) | `{{TBD}}` | semantic | `skills/hd-onboard/references/layer-1-context.md` |
| Layer 2 — Skills (§4b) | `{{TBD}}` | procedural | `skills/hd-onboard/references/layer-2-skills.md` |
| Layer 3 — Orchestration (§4c) | `{{TBD}}` | procedural (meta) | `skills/hd-onboard/references/layer-3-orchestration.md` |
| Layer 4 — Rubrics (§4d) | `{{TBD}}` | evaluative | `skills/hd-onboard/references/layer-4-rubrics.md` |
| Layer 5 — Knowledge (§4e) | `{{TBD}}` | episodic | `skills/hd-onboard/references/layer-5-knowledge.md` |

## Populating this corpus

When Bill's Substack article(s) publish, populate URLs in one of two ways:

1. **Update this file in-place** (benefits all plug-in users). Replace `{{TBD}}` with the canonical post URL for each section. Flip `status: placeholder` to `status: active` in frontmatter.
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
- Never invent URLs, never fabricate quotes. When the corpus is not configured, direct callers to `skills/hd-onboard/references/` for offline concept content instead.
