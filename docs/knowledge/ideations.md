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

## ~~2026-04-21 — Rubric YAML split: should criteria move from prose tables to frontmatter YAML?~~ → PROMOTED to Phase 3q plan 2026-04-21

**Resolution:** promoted to [docs/plans/2026-04-21-004-feat-phase-3q-rubric-yaml-split-plan.md](../plans/2026-04-21-004-feat-phase-3q-rubric-yaml-split-plan.md). Scoped to skill-quality.md POC first; propagation to ux-writing + heuristic-evaluation deferred to Phase 3r if the pattern holds.

**Prompt:** Post-3p audit observed that `docs/rubrics/skill-quality.md` mixes YAML-shape tables (criterion rows + severity) with prose (rationale + pass/fail examples). The `review:skill-quality-auditor` agent parses the markdown tables with regex — any prose refactor that shifts table placement silently breaks the audit. DESIGN.md's discipline (normative YAML frontmatter + descriptive prose body) suggests a path.
**Options on the table:** (a) leave as-is — works today, low-risk markdown; (b) migrate `skill-quality.md` as proof-of-concept: frontmatter holds `sections.<name>.criteria[]` with id+severity, body keeps prose rationale + examples; (c) migrate all 3 adopted rubrics + update `rubric-applier` agent to query YAML deterministically.
**Current thinking:** (b) as a dedicated phase. 2-3 hr of work; proves the pattern before propagating. Biggest architectural win: auditor stops being fragile to prose refactors; adding a criterion becomes a YAML edit (not a table-row insertion in the right section).
**Needed to decide:** commit a phase slot (3q or 3r) when we're ready. No external dependencies; purely internal polish + rubric-template schema update.

## 2026-04-21 — Spec-as-single-source-of-truth for hd-config schema

**Prompt:** The hd-config.md schema is encoded in THREE places: `detect.py` (literal `"schema_version": "5"` + field names), `hd-config-schema.md` (prose + YAML block), `hd-config.md.template` (filled-in example). The 2026-04-21 review found they'd drifted (schema doc said v3 while code emitted v4 for multiple releases). Structural drift risk.
**Options on the table:** (a) keep hand-maintenance + dogfood audits catch drift (current state); (b) generate schema docs from `detect.py` source literal (one-way); (c) central `schema.yaml` file → `detect.py` imports + validates output; `hd-config-schema.md` generated from it; `hd-config.md.template` generated from it (bi-directional SSOT).
**Current thinking:** (c) but gate on the next schema bump. When we're ready to go v5 → v6 for a legitimate breaking reason, that's the moment to also land SSOT — amortizes the architectural investment against a schema change we'd have to make anyway. Low-value sooner; high-value at the right moment.
**Needed to decide:** the next breaking schema change. 3-4 hr of work when we get there.

## 2026-04-21 — Should legacy lessons be back-migrated to 3p.3 schema?

**Prompt:** Post-3p audit found schema drift in `docs/knowledge/lessons/` — 5 lessons on new `rule_candidate:` + machine-extractable fields schema; 12 legacy lessons on older `graduation_candidate:` only. `lesson-retriever` now handles both, but mixed-shape corpus makes aggregate queries brittle.
**Options on the table:** (a) leave as-is — history is sacred per decisions.md; legacy lessons are episodic artifacts; (b) back-migrate all 12 (but that violates append-only history policy); (c) teach downstream agents both schemas as synonyms (current state); new lessons use new schema, legacy stays frozen; (d) write a one-time read-only migration that generates a sidecar `.legacy-schema.yaml` per legacy lesson WITHOUT touching the original .md files.
**Current thinking:** (c) is where we are. (a) and (c) are equivalent for practical purposes. (d) is over-engineered for 12 files.
**Resolution:** no action; (c) holds. Leaving this entry as a marker so future readers know the question was considered + dismissed.

## 2026-04-21 — Scripted release automation

**Prompt:** v1.3.0 release requires: bump 3 sibling manifests (`.claude-plugin/`, `.codex-plugin/`, `.cursor-plugin/`) + `marketplace.json`, close CHANGELOG `[Unreleased]` → `[<version>]`, git tag, push tag, `gh release create`. All manual today; easy to miss a manifest or diverge versions.
**Options on the table:** (a) keep manual (current); (b) `scripts/release.sh` that takes a version arg + runs all steps; (c) commit-based auto-release via `release-please` or similar when CHANGELOG changes.
**Current thinking:** (b). Single script, low complexity, prevents version divergence. Skip (c) — commit-based automation is too much machinery for a solo maintainer.
**Needed to decide:** pick this up when a release feels painful enough to motivate. v1.3.0 was manual; if v1.4.0 also feels painful, build the script.

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
