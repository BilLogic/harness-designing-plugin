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

## 2026-04-21 — Should `ai-integration-scout` cache entries expire?

**Prompt:** Scout writes high-confidence finds back to `skills/hd-setup/references/known-mcps.md` on successful web search. Today cache entries don't expire — a 3-year-old entry will still return `source: cache`. MCPs churn quickly; unmaintained packages become stale.
**Options on the table:** (a) no expiration — cache is manually maintained; (b) TTL per entry (e.g. 90 days) after which scout falls through to web on next invocation; (c) mark `maintained: false` on second web miss rather than expire.
**Current thinking:** defer. Re-evaluate after seeing a month of real-world cache hits. If stale-entry complaints surface, (b) is simpler than (c).
**Needed to decide:** usage signals from at least 5 real user runs; whether scout is invoked often enough to justify TTL machinery.

## 2026-04-21 — Should paste-organize fetch URLs the user pastes?

**Prompt:** `paste-organize.md` currently requires explicit permission before fetching URLs. Users dropping links (e.g. Notion page URLs) expect the plug-in to fetch content.
**Options on the table:** (a) keep "always ask" (safety-first); (b) heuristic fetch — auto-fetch from known-doc domains (notion.so, confluence), ask for anything else; (c) always fetch if user pasted the URL (implicit consent).
**Current thinking:** (a) for v1 (lowest trust risk). Revisit when we have user feedback on friction.
**Needed to decide:** 3-5 user runs; log how many times users drop URLs vs paste full content.

## ~~2026-04-21 — Should `/hd:setup` on the plug-in repo itself author `hd-config.md`?~~ → RESOLVED 2026-04-21

**Resolution:** picked option (a) — authored `hd-config.md` by hand same day. Covers all 5 layer decisions as `review` (each layer is populated by the plug-in's own payload; scaffold/create paths don't apply to a plug-in repo). File is a special-case meta-config, documented as such in its own prose. Closes the 2026-04-20 + 2026-04-21 review carry-over.

**Prompt:** The plug-in repo has no `hd-config.md` — flagged by both the 2026-04-20 and 2026-04-21 harness reviews. Running `/hd:setup` on ourselves would scaffold one but feels redundant (this IS the plug-in).
**Options on the table:** (a) author `hd-config.md` by hand for the advanced-mode case (setup_mode: advanced, with real layer_decisions recorded); (b) run `/hd:setup --discover-tools` on ourselves; (c) officially waive — this is the plug-in repo, not a user repo, so hd-config.md doesn't apply here.
**Current thinking:** (a) — authoring by hand captures intent cleanly and stops the audit from re-flagging. Document that the plug-in repo's own `hd-config.md` is special-case.
**Needed to decide:** nothing; just pick a half-hour slot.

## 2026-04-18 — Namespace rename: design-harnessing → harness-designing at Phase 3k+

**Prompt:** Repo + marketplace slug is `harness-designing-plugin` but the Task namespace (`design-harnessing:<cat>:<name>`) and some internal strings still read `design-harnessing`. Noticed during the 3i consistency sweep.
**Options on the table:** (a) keep both (repo slug = noun-phrase, Task namespace = gerund); (b) align everything on `harness-designing`; (c) align everything on `design-harnessing`.
**Current thinking:** lean (b) — the shipping artifact name wins; internal namespace should match. Defer until Phase 3k+ to avoid breaking in-flight pilot configs.
**Needed to decide:** (1) confirm no external consumers pin the Task namespace yet; (2) one-pass migration plan that covers manifests + skills + agents + docs in a single commit.
