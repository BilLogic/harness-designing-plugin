---
memory_type: speculative
domain: ideations
split_threshold: 20
---
<!-- Tier: 3 (open questions — loaded on demand) -->
# Ideations

Open questions, unchosen paths, ideas worth revisiting. Append-only; cross off (don't delete) when an idea either graduates to a decision or gets rejected.

## How to use

- **When in doubt about whether to document something:** if it's a "what if we…" or "should we…", it goes here
- **Don't confuse with decisions.md:** decisions are things we've committed to; ideations are things we're thinking about
- **Cross off, don't delete:** when an idea graduates or is rejected, mark it (~~strikethrough~~ + annotation) so the history survives

## Format

```markdown
## YYYY-MM-DD — <short-question-or-idea>

**Prompt:** <what made this come up>
**Options on the table:** <what we're considering>
**Current thinking:** <if any; may be empty>
**Needed to decide:** <data, user research, team discussion, ship-then-measure>
```

## Entries

<!-- Add new ideations above this line. -->

## 2026-04-18 — Namespace rename: design-harnessing → harness-designing at Phase 3k+

**Prompt:** Repo + marketplace slug is `harness-designing-plugin` but the Task namespace (`design-harnessing:<cat>:<name>`) and some internal strings still read `design-harnessing`. Noticed during the 3i consistency sweep.
**Options on the table:** (a) keep both (repo slug = noun-phrase, Task namespace = gerund); (b) align everything on `harness-designing`; (c) align everything on `design-harnessing`.
**Current thinking:** lean (b) — the shipping artifact name wins; internal namespace should match. Defer until Phase 3k+ to avoid breaking in-flight pilot configs.
**Needed to decide:** (1) confirm no external consumers pin the Task namespace yet; (2) one-pass migration plan that covers manifests + skills + agents + docs in a single commit.
