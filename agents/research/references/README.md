---
title: Research-agent reference corpus
loaded_by: agents/research/*
---

# `agents/research/references/`

Reference content loaded by sub-agents in the `research/` category. Each file declares `loaded_by:` in frontmatter naming the agent(s) that consume it; agents read these as part of their procedure (not as part of their always-loaded prompt).

## Pattern

Research-category agents that need a default corpus, lookup table, or schema reference keep that data here rather than inlining it in the agent spec body. Keeps agent specs focused on *procedure*; lets corpus content evolve independently.

## Distinction from `skills/<name>/references/`

`skills/<name>/references/` is read by a *skill* (router-shaped) on demand. `agents/research/references/` is read by a *sub-agent* (procedure-shaped) when invoked.

The two reference patterns coexist; they're not competing.

## Adding a new reference

When authoring a new research agent that needs a corpus:

1. Place the corpus file at `agents/research/references/<topic>.md`
2. Frontmatter: `loaded_by: <agent-name>` (or `loaded_by: agents/research/*` for shared corpora)
3. Reference from the agent's procedure: "Read `references/<topic>.md` for the lookup table"

## Current contents

- [`article-quote-finder-corpus.md`](article-quote-finder-corpus.md) — default corpus for `article-quote-finder` (local draft or public article locations + section anchors)
- [`article-draft-stop-chasing-design-tools.md`](article-draft-stop-chasing-design-tools.md) — local draft excerpt corpus until the public article URL is available
