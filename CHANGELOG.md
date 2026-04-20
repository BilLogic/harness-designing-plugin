# Changelog

All notable changes to the `design-harness` plug-in are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.1.0] — 2026-04-20

Iteration release. Three phases (3k, 3l, 3m) built on top of v1.0.0 distribution-ready baseline. Surfaced by live testing across 10 real repos (plus-uno, sds, plus-marketing-website, caricature, oracle-chat, lightning, cornerstone, Dawnova, compound-designing, plus-vibe-coding-starting-kit). ~25 fixes landed.

Headlines:

- **Unified vocabulary** — "audit" and "critique" retired; one verb: **review**. `/hd:review` asks "full or targeted" scope, never audit-vs-critique (3l.7).
- **File-first reporting** — full review writes to `docs/knowledge/reviews/<date>-harness-review.md`; chat emits rich summary with ASCII bars + tables + file-tree diff. Host-agnostic by construction — works on Claude Code, Codex CLI, Cursor IDE, Cursor CLI, Windsurf, any terminal (3l.2, 3m.4).
- **Content-quality grading** — `harness-auditor` grades on actual file content (4-level `content_status`), not just path presence. Caricature-style false passes eliminated (3k.1, 3k.10).
- **Smarter detection** — `budget-check.sh` auto-detects `.agent/skills/` / `.claude/skills/` / `skills/`. `detect.py` schema v4 probes `.agents/` (plural), `.cursor/skills/`, `.windsurf/`, `.roo/`; detects scattered L1 content in non-canonical locations. False positives on `.claude/worktrees/` metadata-only dirs eliminated (3k.2, 3l.3, 3m.1).
- **Review → setup feedback loop** — `/hd:setup --from-review <path>` applies review findings as opt-in Step 8.5 writes. Staleness preflight flags when the same findings recur across reviews (3m.3, 3m.5).
- **Canonical standard locked** — `standard-harness-structure.md` (full tree aligned with plus-uno + Material 3 + Fluent 2) + `standard-agent-categories.md` (research / planning / generation / review / compound) (3k.12).
- **AGENTS.md is the sole master index** — per-layer INDEX.md files retired. Template gains Agent persona + Harness map sections (3k.13).

Full details per phase below.

### Phase 3m — setup accuracy + review actionability (2026-04-20)

Completed per [`docs/plans/2026-04-20-002-fix-phase-3m-setup-accuracy-review-actionability-plan.md`](docs/plans/2026-04-20-002-fix-phase-3m-setup-accuracy-review-actionability-plan.md). Shipped five fixes surfaced by live stress-testing across five real repos. Commit `dd69f449f8`.

- **3m.1** `_meta_harness_entry()` in `detect.py` now requires content substance (skills/rules/agents/commands dir with ≥1 .md, OR settings.json with ≥5 non-blank lines, OR AGENTS.md with ≥20 non-blank lines). Pure-metadata dirs (`.claude/worktrees/` alone) return `None`. Fixes Dawnova false positive where a bare worktree metadata folder triggered guardrail additive-only mode.
- **3m.2** Per-layer review default gated by content substance. When `harness-auditor` reports `content_status: missing` for all per-layer checks, Phase A synthesis flips default from `review` to `scaffold`. No more tone-deaf "review nothing" when guardrail fires on nominal-only signals. Layers with ≥1 non-missing check still default to `review` (3l.4 behavior preserved).
- **3m.4** `/hd:review` chat summary + report template gain `## Proposed revision` section. Renders revised file tree as a ```diff fenced block with `+` new files, `~` edits, unchanged lines for context. Derived from finding recommendations via phrase heuristics (`add <path>` / `promote <src> to <dest>` / `trim <path>` etc.). Users see the concrete plan inline without re-running setup.
- **3m.3** `/hd:setup --from-review <path>` flag. Skips Phase A (already ran when review was produced), extracts write-style findings, merges them into Step 8.5 preview as opt-in rows. Closes the review → setup feedback loop while preserving preview-before-write safety.
- **3m.5** Staleness preflight check. `/hd:review` Step 1.5 reads most recent prior review from `docs/knowledge/reviews/*-harness-review*.md`. After synthesis, computes Jaccard overlap on `(category, check, file)` finding triples. Overlap ≥70% → Staleness block in chat summary with git-log activity since + lesson-capture count + suggestion to capture a blocker lesson or mark deferred. Overlap <70% → single compact line. First review → "fresh review — no prior".

**Dogfood run (`<commit>`):** first self-review landed at `docs/knowledge/reviews/2026-04-20-harness-review.md`. Surfaced real drift in the plug-in repo: retired `docs/knowledge/INDEX.md` + `README.md` still on disk (3k.13 cleanup incomplete), `docs/rubrics/` had only `INDEX.md` without actual rubrics (no dogfood of our own L4 contract). Acted on the review: removed two retired files, promoted `skill-quality.md` starter to `docs/rubrics/`.

### Phase 3l — review unification + host-agnostic execution (2026-04-20)

Completed per [`docs/plans/2026-04-20-001-fix-phase-3l-review-unification-host-agnostic-plan.md`](docs/plans/2026-04-20-001-fix-phase-3l-review-unification-host-agnostic-plan.md). Addressed vocabulary friction + host-specific rendering gaps from 2026-04-19 live testing. Commits `a90e0a51b9` + `f0c307a0b7`.

- **3l.7** Retire "audit" + "critique" vocabulary. Unified under "review" (full / targeted). Renamed 7 `audit-criteria-l*.md` → `review-criteria-l*.md`, `audit-procedure.md` → `review-procedure.md`, `critique-procedure.md` → `targeted-review-procedure.md`, `critique-format.md` → `targeted-review-format.md`, `audit-report.md.template` → `review-report.md.template`, `critique-response.md.template` → `targeted-review-response.md.template`. Per-layer setup action `critique` → `review`. Bulk sweep of 52 living files via word-boundary regex (preserves `auditor` agent names). `/hd:review` mode detection now asks "full or targeted", never "audit or critique".
- **3l.1** Finished 3k.13 INDEX.md retirement cleanup. `layer-5-knowledge.md` reconciled: canonical L5 scaffold outputs `changelog.md` + `decisions.md` + `ideations.md` + `preferences.md` + `lessons/.gitkeep` (no INDEX, no starter lesson). Added missing "Preview table format" section in `per-layer-procedure.md` that SKILL.md Step 8.5 was pointing to. `capture-procedure.md` drops INDEX.md update; bootstraps `docs/knowledge/lessons/` if absent.
- **3l.4** Guardrail default flipped `skip` → `review` for L1/L2/L3 when existing harness detected. Critique reviews existing content read-only and surfaces improvement suggestions instead of tone-deaf "you already have this, we'll do nothing" skip. AGENTS.md rule updated to supersede 2026-04-18 skip-default.
- **3l.5** `lesson.md.template` gains `memory_type` + `importance` fields (required per `lesson-patterns.md`). `capture-procedure.md` Step 0 auto-creates `docs/knowledge/lessons/` with narration when absent.
- **3l.3** `detect.py` schema v4. New probes: `.agents/` (plural), `.cursor/skills/`, `.windsurf/`, `.roo/`. Content-based L1 detection for scattered content (PRD filenames, tech-stack docs, design-system dirs). New `layers_present_scattered[]` field + `scattered_l1_signals` sub-object. Oracle Chat now correctly reports `layers_present_scattered: ["L1", "L3"]` (was `layers_present: []`).
- **3l.2** File-first reporting. `review-procedure.md` rewritten — inline serial is the baseline; parallel dispatch is an optional speed-up on hosts that support it (Claude `Task`, Codex `/agent`, Cursor subagents API). Full report writes to `docs/knowledge/reviews/<date>-harness-review.md`. Chat emits rich summary with Unicode box-drawing tables (═/─), ASCII health bars, priorities table, cross-layer signals. Same output on every host — wall time differs, content doesn't.
- **3l.6** Progress bars surface beyond the review report. Phase A renders a 5-row ASCII health snapshot after pre-analysis completes, before Phase B's layer walk. `/hd:review snapshot` mode added for bars-only output (no file write, ~30s).

### Phase 3k — audit accuracy + UX polish + canonical standard (2026-04-19)

Completed per [`docs/plans/2026-04-19-002-fix-phase-3k-testing-findings-plan.md`](docs/plans/2026-04-19-002-fix-phase-3k-testing-findings-plan.md). Addressed audit credibility + UX issues from 5-repo hands-on testing. Commit `433298bc54`.

- **3k.1 + 3k.10** Content-quality grading in `harness-auditor`. Output gains `content_status: missing | present-but-stale | present-and-populated | healthy`. Empty indexes, stub files, orphan pointers fail instead of passing. Caricature's false L1-L3 pass (paths existed but content was stale) now fires findings correctly.
- **3k.2** `budget-check.sh` auto-detects user-repo skill locations. Probes `.agent/skills/`, `.claude/skills/`, `skills/` in priority order. Reads `loading-order.md` (or `.agent/loading-order.md`) for repo's own always-loaded contract. Output gains `skill_dir_detected`, `always_loaded_contract_source`, `always_loaded_lines` fields. Cornerstone false-clean 0-skill report → correctly 6 skills with 5 violations.
- **3k.3** `/hd:setup` Step 8.5 proposed-files preview table before any write. Users see the full scope + confirm `y / revise / cancel` before files land.
- **3k.4** ASCII layer-health bars at top of review report. Block chars (`█`/`░`) + percentages. Terminal + chat friendly. No emoji, no color codes.
- **3k.5** `/hd:review` defaults to full review when invoked bare. Only asks for scope when a file path is passed without a verb.
- **3k.6** Stale `hd-config.md` detection. `/hd:review` re-runs `detect.py` and diffs vs recorded config. Any drift (other-tool harnesses added, team tooling changed, skipped layers mismatched) queues a `hd-config-stale` (p2) finding for synthesis.
- **3k.7** New `review-criteria-consistency.md` (post-3l.7 rename). Cross-layer check surface: duplicate rules across AGENTS.md vs rubrics, contradicting rule+rubric pairs, orphan pointers (link exists, target missing), overlapping skill scope, stale lesson citations, hd-config drift.
- **3k.8** Narrated execution. SKILL.md files explain rationale inline at each major step ("Running preflight — budget check + fresh detect.py scan. This lets us see what's really in the repo right now vs what hd-config.md recorded.").
- **3k.9** Plain-language copy-edit pass. Retired "tier 1" jargon in living prose in favor of "always-loaded". Historical files (CHANGELOG, plans, dated lessons) preserved as audit trail.
- **3k.11** `/hd:setup` Step 3.5 scaffold mode choice: **additive** (default when existing harness detected) vs **use-standard** (scaffold the canonical tree).
- **3k.12** Locked canonical harness structure at `skills/hd-setup/references/standard-harness-structure.md`. Per-layer tree with `product/` + `engineering/` (renamed from `architecture/`) + `design-system/` (styles/foundations/components, derived from plus-uno + Material 3 + Fluent 2). Locked standard agent categories at `skills/hd-setup/references/standard-agent-categories.md` — `research / planning / generation / review / compound` (non-enforced).
- **3k.13** `AGENTS.md` is the sole master index. Per-layer `INDEX.md` files retired. Template gains `## Agent persona` section (role + responsibility + boundary) and `## Harness map` covering all 5 layers. L5 scaffold drops INDEX.md.template + starter-lesson.md.template; only 4 canonical files + empty `lessons/.gitkeep`.

### Phase 3j — marketplace submission prep (Anthropic, Cursor, Codex CLI)

Completed per [`docs/plans/2026-04-18-006-refactor-phase-3j-marketplace-submission-plan.md`](docs/plans/2026-04-18-006-refactor-phase-3j-marketplace-submission-plan.md). Preps distribution to three platforms plus in-session content sweep triggered by Bill's README review.

**Post-Phase-3i sweep** (`4ca0673c7e`): 13 living files corrected for two framing issues Bill surfaced reviewing the README:

- **Coexistence framing** — reframed from bidirectional ("our skills invoke compound's agents") to one-way namespace respect. We do not invoke `compound-engineering:*` Task names from our skills or agents. `AGENTS.md § Coexistence` rule is now "No cross-plug-in Task calls." Living files swept: `AGENTS.md`, 4 coexistence references, `agents/research/lesson-retriever.md`, skill coexistence paragraphs in `hd-setup` + `hd-maintain`. Only surviving cross-plug-in Task references are labeled WRONG-form examples.
- **Memory taxonomy** — anchored all living files to the article's canonical 4-type frame (procedural / semantic / episodic / working, per article §2.5). The five operational subtypes (temporal, procedural-chosen, semantic-taste, speculative, + canonical episodic) now nest as *derivative refinements* inside the canonical 4, not as peers. Files swept: `memory-taxonomy.md`, `faq.md`, `layer-5-knowledge.md`, `SKILL.md` + `capture-procedure.md` + `lesson-patterns.md` in `hd-maintain`, knowledge-skeleton `README.md.template`.

**3j.1 — Manifest polish** (`5ea07e2082`): 3 plugin manifests updated for submission readiness.

- `.claude-plugin/plugin.json` — fixed stale `homepage` + `repository` URLs (`design-harnessing-plugin` → `harness-designing-plugin`)
- `.cursor-plugin/plugin.json` — added `homepage`, `repository`, `logo`, 7-keyword array
- `.codex-plugin/plugin.json` — added same 4 fields; preserved Codex-specific `skills`, `category`, `capabilities`
- Cross-manifest consistency: name `design-harness`, version `1.0.0`, description identical

**3j.2 — Logo asset** (same commit): `assets/logo.svg` (501 bytes, viewBox `0 0 512 512`). 5 left-aligned horizontal bars in an inverted staircase: charcoal `#1f2937` (layers 2–5) + teal accent `#0d9488` (Layer 1 foundation). Renders crisp at 64px and 512px; evokes "harness builds the ladder" from the article tagline.

**3j.3 — Self-hosted marketplace** (same commit): `marketplace.json` at repo root enables instant install before official directory listing:
```
/plugin marketplace add BilLogic/harness-designing-plugin
/plugin install design-harness
```
README Installation section restructured into three H3 subsections: Fastest path (marketplace add) → Local dev (git clone) → Official directories (pending submission).

**3j.4 — Submission packets** (`b8241c8d88`): pre-filled copy-paste packets in `docs/submissions/`:
- `anthropic-submission.md` for [clau.de/plugin-directory-submission](https://clau.de/plugin-directory-submission)
- `cursor-submission.md` for [cursor.com/marketplace/publish](https://cursor.com/marketplace/publish)
- `codex-submission.md` HOLDING until OpenAI opens self-serve publishing

**3j.5 — Actual submission**: executed via the Claude in Chrome extension + Chrome MCP.

- **Anthropic Claude Code marketplace** — submitted via [claude.ai/settings/plugins/submit](https://claude.ai/settings/plugins/submit). Platforms: Claude Code + Claude Cowork. Status: *"Plugin submitted for review. The review team will evaluate it and may reach out for additional information."*
- **Cursor marketplace** — submitted via [cursor.com/marketplace/publish](https://cursor.com/marketplace/publish). Owner: individual, contact boyuang@cmu.edu. Logo: `https://raw.githubusercontent.com/BilLogic/harness-designing-plugin/main/assets/logo.svg`. Status: *"Thanks for applying. We've received your submission. We'll follow up at marketplace-publishing@cursor.com once we review your plugin."*
- **Codex CLI (OpenAI)** — parked. Self-serve publishing not yet open per the [Codex plugin docs](https://developers.openai.com/codex/plugins/build). `docs/submissions/codex-submission.md` ready for instant submission when OpenAI opens the directory. `.codex-plugin/plugin.json` already includes `skills`, `category`, and `capabilities` fields for Codex schema compatibility.

**3j review fixes** (`3cc82444a1`, post-/ce:review pass):

- `docs/rubrics/INDEX.md:53` — fixed broken link from removed `hd-onboard/` path → `hd-learn/` (missed during the 3i.1 rename sweep)
- `agents/research/lesson-retriever.md` — description trimmed 181 → 153 chars
- `agents/review/rubric-extractor.md` — description trimmed 182 → 170 chars

/ce:review verdict across 3 reviewers: **SHIP.** Simplicity reviewer: zero blockers, ship as-is. Agent-native-parity reviewer: PASS clean across all 4 skills, 25+ Task calls fully-qualified, `<protected_artifacts>` well-formed. Pattern-recognition reviewer: 7 consistency dimensions verified clean (after the 3 fixes above landed).

### Phase 3i — agent architecture, skill renames, memory-term rename, reference reorg, README rewrite

Completed per [`docs/plans/2026-04-18-005-refactor-phase-3i-agent-arch-renames-reorg-plan.md`](docs/plans/2026-04-18-005-refactor-phase-3i-agent-arch-renames-reorg-plan.md). Eleven work units. Origin: six rounds of in-session design dialogue 2026-04-18.

**3i.0 — Repo pollution fix** (history rewrite via `git filter-repo`): stripped a `Desktop/Vibe Coding/Lightning/README.md` path dragged in from the shared home-dir git repo. 70 commits → 67 after empty-commit prune. Force-pushed to `dh/main` + `dh/claude/elegant-euclid`. Safety tag `backup/pre-3i-0-2026-04-18` preserved locally.

**3i.1 — Skill renames** (breaking; unpublished):
- `skills/hd-onboard/` → `skills/hd-learn/`, frontmatter `name: hd:onboard` → `hd:learn`.
- `skills/hd-compound/` → `skills/hd-maintain/`, frontmatter `name: hd:compound` → `hd:maintain`.
- 41 living files swept. `compound-engineering` mentions preserved verbatim (16 total).

**3i.2 — Memory-term rename to "rules"**: `graduation` / `graduated` → `rule` / `rules`. `graduation_candidate` → `rule_candidate`. `/hd:maintain` modes `graduate-propose` / `graduate-apply` → `rule-propose` / `rule-apply`. `AGENTS.md § Graduated rules` → `§ Rules`. `docs/knowledge/graduations.md` deleted (adoption events flow into `changelog.md` as temporal events). 44 files, 89-pattern sed + 7 narrative hand-edits. File renames: `graduation-candidate-scorer.md` → `rule-candidate-scorer.md`, `graduation-criteria.md` → `rule-adoption-criteria.md`, `graduation-entry.md.template` → `rule-entry.md.template`.

**3i.3 — Agent reorg part 1**:
- Split `agents/review/rubric-applicator.md` (303 lines, two modes) → `rubric-applier.md` (109 lines, apply-only) + `rubric-extractor.md` (257 lines, extract-only). All H1/H2/H3 pins from 3h preserved in `rubric-extractor.md` verbatim.
- Deleted `agents/workflow/harness-health-analyzer.md` (superseded by new `harness-auditor`).
- Dropped `agents/workflow/` directory. Three categories remain: `analysis/`, `research/`, `review/`.
- AGENTS.md repo-layout tree updated.

**3i.4 — New agents** (3 new in `agents/analysis/`):
- `harness-auditor.md` (140 lines, desc 171 chars): `layer: 1|2|3|4|5` param, `scenario: audit|setup-pre-analysis`, `mode: full|quick`. Dispatched 5× parallel by `/hd:review audit` Batch 1 and reused by `/hd:setup` Phase A.
- `rubric-recommender.md` (124 lines, desc 161 chars): ranks which starters to scaffold or flag as gaps from `detect.py` signals + `package.json` + existing rubric set.
- `coexistence-analyzer.md` (155 lines, desc 161 chars): all-tools coexistence report (`.agent/`, `.claude/`, `.codex/`, compound-engineering). Existence + metadata only; never reads external skill bodies.

**3i.5 — Skill rewire (parallel dispatch + context isolation)**:
- `/hd:review audit` 2-batch parallel: BATCH 1 = `harness-auditor × 5`; BATCH 2 = `rubric-recommender` + `lesson-retriever` + optional `coexistence-analyzer`. Parallel→serial auto-switch at 6+ (per compound v2.39.0); our design stays ≤5 per batch.
- `/hd:setup` NEW **Phase A** (parallel pre-analysis, between Step 2 and Step 3): `harness-auditor × 5` + `rubric-recommender` pre-compute per-layer proposals before Phase B interactive walk.
- `/hd:maintain rule-propose` dispatches `rule-candidate-scorer` then conditional `rubric-extractor` if source lesson has ≥4 imperatives.
- All 4 SKILL.md ≤200 lines; budget-check clean.

**3i.6 — hd-setup reference reorg 16 → 9**: merged 5 `step-N-*.md` + `good-agents-md-patterns.md` + `tier-budget-model.md` into the 5 `layer-N-*.md` files (each now concept + procedure + depth). Seven files deleted.

**3i.7 — hd-review audit-criteria split 1 → 7**: monolithic `audit-criteria.md` split into `audit-criteria-l1-context` through `-l5-knowledge`, plus `-coexistence` and `-budget`. Enables per-layer context isolation during parallel `harness-auditor` dispatch. 45 criteria preserved across the splits.

**3i.8 — Rubric scope-and-grounding**: added `## Scope & Grounding` section (personas, user stories, realistic scenarios, anti-scenarios, each grounded in source material) to all 14 starters. NEW `skills/hd-review/references/rubric-authoring-guide.md` (50 lines) documents the 4-block schema + `rubric-applier` consumption contract + authoring checklist.

**3i.9 — README rewrite**: 13 sections, 162 lines. Name: "Harness Designing Plugin" (matches GitHub repo). Thesis + 5-layer memory-type table preserved. NEW Credits section with hyperlinks (compound-engineering: [@dhh](https://twitter.com/dhh), [@kieranklaassen](https://twitter.com/kieranklaassen); [pbakaus/impeccable](https://github.com/pbakaus/impeccable) [@paulbakaus](https://twitter.com/paulbakaus); Nielsen Norman Group; Material 3; Fluent 2; Anthropic). No marketing adjectives. Tables-first. Internal `design-harnessing:` namespace unchanged.

**3i.10 — `/every-style-editor` pass + flag resolutions**:
- Auto-applied: 2 hyphen → en-dash fixes (`1-5` → `1–5`) for numeric ranges.
- Flag A: fixed `hd-review/SKILL.md` rubric count 12 → 14 + added `telemetry-display` and `i18n-cjk` to the starter enumeration (omitted since Phase 3e E3).
- Flag B: fixed `hd-learn/SKILL.md` FAQ grammar artifact from the 3i.2 sed rename ("write a lesson as a rule into a rule" → "promote a lesson into a rule").

**Post-Phase-3i state:**
- 4 skills: `/hd:learn`, `/hd:setup`, `/hd:maintain`, `/hd:review`. All SKILL.md ≤200 lines.
- 9 agents across 3 categories (`analysis/` 4, `research/` 2, `review/` 3).
- 14 starter rubrics, each with `## Scope & Grounding`.
- 4 scripts (`detect.py`, `detect-mode.sh`, `compute-plan-hash.sh`, `budget-check.sh`).
- Budget-check: violations 0; Tier-1 198/200.
- Repo history clean on `dh/main`.

### Phase 3h — cosmetic pins (extract-mode drift axes)

Completed per [`docs/plans/2026-04-18-004-refactor-phase-3h-cosmetic-pins-plan.md`](docs/plans/2026-04-18-004-refactor-phase-3h-cosmetic-pins-plan.md). Single file, single commit. Closes the 3 surface-drift items from the Phase 3g G6 true-two-session regression.

**H1/H2/H3 pins** (`11bfa196`, single file: `agents/review/rubric-applicator.md`):

- **H1 — `candidate_id` derivation rule:** new 5-step deterministic recipe (first imperative verb from fixed allowlist → first noun phrase up to 3 words → negative prefixing → kebab-case → collision suffix). 4 worked examples. Collapses the 5-of-13 phrasing drift seen in G6 (`prefer-plus-components` vs `plus-components-first`).
- **H2 — path-format rule:** `applies_to` + `source_citation` MUST use repo-relative paths. Absolute input paths get stripped to the nearest `.git/` ancestor; already-relative pass through; no-ancestor fallback is basename. 3 worked examples. Collapses the absolute/relative drift (`/tmp/hd-real-test/plus-uno/AGENTS.md` vs `AGENTS.md`).
- **H3 — `rule_statement` punctuation:** use `:` (colon) to separate rule heading from elaboration; use `;` only when chaining independent imperatives. One-line spec addition. Collapses the Run A vs Run B punctuation drift.

Phase 3 Structure output-ownership rules also updated to reference the repo-relative path-format rule, keeping the anti-fabrication contract and the pinning rules consistent.

Mental trace against G6 inputs confirms all 3 drift axes collapse.

Phase 3h is the **first phase with no deferred items** — the extract-mode spec is now as deterministic as a single-file spec can make it. Any further stability work would be agent-runtime determinism (temperature settings, beam search, etc.), not spec tightening.

### Phase 3g — remaining backlog

Completed per [`docs/plans/2026-04-18-003-refactor-phase-3g-remaining-backlog-plan.md`](docs/plans/2026-04-18-003-refactor-phase-3g-remaining-backlog-plan.md). Closes all 6 items deferred from Phase 3f via 7 parallel subagents (G1–G5 + G6-Run-A + G6-Run-B). All 4 SKILL.md files now pass the 200-line soft cap; `budget-check.sh` exits 0 with 0 violations.

**G5 — `workflows/` vocabulary reconciliation** (`bb396098`): AGENTS.md Semantic split vocabulary was internally inconsistent ("no workflows/ inside skills" rule but vocabulary listed workflows/ = FOLLOW). Reconciled to repo policy: dropped workflows/ entry; added assets/ entry; added paragraph explaining per-mode procedures live in SKILL.md inline OR references/`<mode>`-procedure.md (cites F5 pattern). 3 hd-learn refs updated to drop stale workflows/ subdir convention.

**G2 — `article-quote-finder` corpus** (`cb2ed19d`): ships `agents/research/article-quote-finder-corpus.md` as structured default corpus (6 article sections with `{{TBD}}` URL placeholders since Bill's Substack article is unpublished). Agent unions corpus + `hd-config.md article_sources` override; sentinel-filter drops `{{TBD}}` entries; emits graceful structured empty when resolved set is empty (`corpus_status: not-configured`). No invented quotes. Fixes happy-path-unreachable bug.

**G3 — `detect.py --include-user-mcps` flag** (`c83859a7`): opt-in user-level MCP scoping. Default unchanged (repo-scoped). When flag set, reads `~/.claude/mcp.json` + `~/.codex/mcp.json`, unions + dedupes into `mcp_servers`, records provenance via new `signals.user_mcp_sources` + `signals.user_mcps_included`. Malformed user config: stderr warn, skip, continue (never crash). hd-setup Step 1 asks once before invoking detect; passes flag if user opts in. Surfaces the plus-uno pilot's Figma + Notion MCP gap (previously invisible).

**G4 — `harness-health-analyzer mode: quick` wiring** (`73db7161`): agent's quick-mode was defined in spec but hardcoded to `full` at dispatch. `audit-procedure.md` +50 lines (152→202): new `## Inputs` section declares `mode: "full" | "quick"` (default full); new `## Mode: quick` section with 4-step abbreviated-scan procedure (detect.py + hd-config.md only; dispatches analyzer with `mode: "quick"`; emits top-3-per-layer inline report; no file write). `hd-review/SKILL.md` +2 lines: one-paragraph quick-mode callout. Full-mode behavior unchanged. Harness-health-analyzer.md unchanged (its existing Phase 2 "skipped in quick" spec already matched the wired scope).

**G6 — True two-session extract-mode regression** (`9aa957fb`): two independently dispatched subagents with fresh contexts ran `rubric-applicator mode: extract` against plus-uno AGENTS.md. **9/9 structural axes byte-identical** (total=13, severity p1:11 p2:2, phases followed, matches_starter breakdown, zero fabrication, keyword rationale list, sentinel examples). Surface drift cosmetic only: candidate_id phrasing (5/13 differ), path format (absolute vs relative), rule_statement punctuation (: vs ;). **SHIP verdict confirmed** under stronger evidence than the same-turn Phase 3f regression. 3h candidates (purely cosmetic): pin candidate_id derivation, pin path format, pin punctuation.

**G1 — `hd-setup/SKILL.md` slimming** (`c3dc2ef8`): last SKILL.md over the 200-line soft cap. 420 → **200** (at cap). 6 new reference files house per-step procedures: `per-layer-procedure.md` (FRAME→SHOW→PROPOSE→ASK→EXECUTE cycle + default-action table + link-mode contract), `step-4-layer-1-context.md`, `step-5-layer-2-skills.md`, `step-6-layer-3-orchestration.md`, `step-7-layer-4-rubrics.md`, `step-8-layer-5-knowledge.md`. Critical preservations verified: Guardrail section (additive-only when harness detected) kept verbatim, default action table with guardrail rows moved with per-layer-procedure, link-mode 3-5 line extracted-summary contract, all fully-qualified Task invocations.

**Budget-check final state:** all 4 SKILL.md pass (hd-maintain 124, hd-learn 124, hd-review 146, hd-setup 200); Tier 1 tracked at 198/200; exit 0, violations=0.

**Deferred to Phase 3h (cosmetic, optional):**
- Pin `rubric-applicator` `candidate_id` derivation rule (collapses 5-candidate phrasing drift)
- Pin `applies_to` / `source_citation` path format (relative from repo root)
- Pin `rule_statement` punctuation (lowest-value; only if downstream consumers care)

### Phase 3f — skill-test findings

Completed per [`docs/plans/2026-04-18-002-refactor-phase-3f-skill-test-findings-plan.md`](docs/plans/2026-04-18-002-refactor-phase-3f-skill-test-findings-plan.md). Batches findings from 3 parallel skill-test audits (hd-learn, hd-maintain, hd-review + 6 sub-agents) + the Phase 3e E5 synthetic extract-mode first-fire. Six F-units + regression + doc sync.

**F1 — Agent description trimming** (`7a419d16`): all 6 sub-agent frontmatter `description:` fields trimmed to ≤180 chars (range was 237–352; now 166–179). Expository content moved into system-prompt bodies; no information loss.

**F3 — hd-learn FAQ polish** (`bd1bb037`):
- `faq.md`: +3 Q&A entries (Q11 "Why five layers specifically?" defending arity via memory-mechanism distinctness; Q12 ".agent/ / CLAUDE.md coexistence" citing 2026-04-18 rules; Q13 "customizing starter rubrics" with 3 paths).
- `memory-taxonomy.md`: added "Derivative types" section with speculative + temporal entries; top-of-file clarifying sentence ("4 classical + 2 derivative"). Original 4-type table preserved verbatim.

**F4 — `budget-check.sh` rewrite** (`0d7ae491`): 153 → 178 lines. All JSON construction via `jq -n` (17 invocations); `yq` dependency fully removed (grep -c yq = 0); `set -euo pipefail`; paths always quoted; edge-case guards for empty skill dirs, missing SKILL.md, missing description, quoted vs unquoted YAML values. Dead first loop deleted. `bash -n` passes; emits valid JSON; exit 0 healthy / exit 1 on violations.

**F6 — Legacy `workflows/` ref cleanup** (`b955476c`): 7 refs across hd-review + hd-setup references replaced with `../SKILL.md#anchor` pointers. 1 ref in `hd-setup/references/layer-3-orchestration.md` preserved as illustrative user-repo example tree. Post-change: 0 in-scope hits. Extends Phase 3e E6.3 (hd-maintain-only) to the rest of the plug-in.

**F2 — `rubric-applicator` extract-mode ship-blocker fixes** (`7949621f`): closes 4 p1 gaps from E5 first-fire lesson. File grew 143 → 303 lines.
- F2.1 Phase 1–5 explicit procedure (Scan → Classify → Structure → Dedupe → Materialize) with worked examples.
- F2.2 3-prong rule-detection heuristic (imperative verb allowlist / numbered-list-under-titled-heading ≥8 words / inline severity/rule/policy frontmatter) + explicit discard list.
- F2.3 Severity keyword map (4 rows); required `severity_rationale:` field; first-hit-wins.
- F2.4 Anti-fabrication attribution contract: `pass_example`/`fail_example` use sentinel strings when source lacks explicit examples; `applies_to` must cite `<file> § <heading>`; new required `source_citation: <file>:<line-range>` field.
- New `## Parameters` section documents `output_shape: yaml|markdown` (new). Apply-mode preserved verbatim.

**F2 regression** (`2e0db704`): re-ran E5 synthetic test against plus-uno AGENTS.md twice. 7/7 byte-stable axes (candidate count, IDs, severity distribution, attribution presence, zero fabrication). All 4 p1 gaps verified closed. **Ship verdict: SHIP** for extract-mode. Residual: rule_statement prose paraphrasing not pinned (p2/p3); materialized output wants ~10min human editing pass to add concrete examples where source lacks them.

**F5 — SKILL.md slimming** (`f0443e31`): brought hd-review + hd-maintain under 200-line soft cap per skill-quality rubric §5.
- `hd-review/SKILL.md` 331 → **144**
- `hd-maintain/SKILL.md` 311 → **124**
- 5 new reference files house per-mode procedures: `{audit,critique}-procedure.md` (hd-review), `{capture,propose,apply}-procedure.md` (hd-maintain).
- Critical Phase 3e E6 preservations verified: `compute-plan-hash.sh` invocations, `.hd/propose-<hash>.json` persistence, capture date-slug convention.
- Kept in SKILL.md: workflow checklists (runtime progress boxes), protected-artifacts block, interaction preamble, compact-safe mode. Cross-link integrity verified.
- `hd-setup/SKILL.md` at 407 lines remains over cap — slimming parked for 3g (F5 scope excluded it).

Budget-check post-Phase-3f: 3/4 SKILL.md files pass soft cap (124 / 124 / 144); only hd-setup (407) flagged.

**Deferred to Phase 3g:**
- `hd-setup/SKILL.md` slimming (407 → <200)
- `article-quote-finder` article corpus (happy path still unreachable)
- `detect.py` MCP user-level scoping
- `harness-health-analyzer mode: quick` dispatch wiring
- `workflows/` vocabulary reconciliation in `hd-learn/references/` + AGENTS.md semantic-split section
- True two-session (not same-turn-simulated) F2 regression as confidence booster

### Phase 3e — pilot consolidation (6-repo matrix)

Completed per [`docs/plans/2026-04-18-001-refactor-phase-3e-pilot-consolidation-plan.md`](docs/plans/2026-04-18-001-refactor-phase-3e-pilot-consolidation-plan.md). Findings from 4 new parallel pilots (caricature, oracle-chat, lightning, plus-uno) combined with prior pilots (sds, plus-marketing) consolidated in [`docs/knowledge/lessons/2026-04-18-parallel-pilots-3-6-consolidated.md`](docs/knowledge/lessons/2026-04-18-parallel-pilots-3-6-consolidated.md).

**E1 — Template rule adoption** (`c722bb24`):
- `hd-config.md.template` gains `layer_decisions` (5-row array with decision + why + files_written), `other_tool_harnesses_detected` (list of `{path, owner, policy}`), `files_written` (flat list); `schema_version: "2"` now consistent with detect.py output.
- `rubrics-index.md.template` added (was referenced by SKILL.md Step 7 but missing; every pilot hand-wrote `docs/rubrics/INDEX.md`).
- `hd-config-schema.md` updated to v2 with filled-in plus-marketing example.

**E3 — Rubric library round 2** (`60efe132`): starter count 12 → 14.
- `telemetry-display.md` (NEW, 103 lines): 7 IoT/hardware criteria (freshness indicators, offline affordances, device-state viz, binary-protocol display, map-as-canvas, update choreography, alarm prioritization). Surfaced by lightning pilot.
- `i18n-cjk.md` (NEW, 102 lines): 7 bilingual/CJK criteria (dual-script line-height, mixed-script punctuation, IME states, date/number formats, bilingual register, line-break, font-stack fallback). Surfaced by caricature + lightning.
- `design-system-compliance.md` gains managed-DS pre-fill sections for ant-design / chakra-ui / mui / mantine (+48 lines).

**E2 — detect.py signal expansion** (`f0680e22`): +177 lines.
- New signals: `has_rubrics_dir`, `rubrics_file_count`, `has_knowledge_dir`, `knowledge_file_count`, `memory_types_present` (scans `memory_type:` with `type:` fallback), `layers_present` composite, `managed_design_system` (antd/chakra/mui/mantine).
- a11y patterns expanded: `@radix-ui/`, `radix-ui`, `@headlessui/`, `@reach/`, `react-bootstrap` (closes blind spot from pilots #2/4/6).
- `external_skills_count` fixed: counts `SKILL.md` + bare `*.md`, takes max across sibling `.claude|.codex|.cursor/skills` dirs to avoid double-counting mirrors. Lightning: 10 → 5.
- `coexistence.compound_engineering` upgraded from bool to `{present, paths_found[], config_file}`.
- `team_tooling.pm` gains `markdown-todos` when `todos/` has ≥2 `\d{3}-\w+.*\.md` files.

**E6 — hd-maintain graduation-loop safety** (`d50f7b5d`): closes the safety thesis that was previously aspirational.
- `compute-plan-hash.sh` (NEW, 123 lines, `+x`): deterministic SHA-256 canonical-string builder. Strict normalization (`LC_ALL=C sort` on paths, LF-only, no trailing newline, fixed field order joined by single `\n`, paths joined by `|`). Byte-identical hashes across runs verified.
- Persisted propose artifact: SKILL.md Propose writes `.hd/propose-<8hex>.json` containing all inputs + `canonical_string` + `sha256`. Apply globs by `--hash` prefix, re-runs the script, compares. No longer depends on conversation context — survives session compaction. Cleanup moves to `.hd/applied/`.
- `gitignore-entries.txt` asset added (hd-setup proposes `.hd/` to user's `.gitignore`).
- Removed dangling `workflows/propose-rule.md` / `workflows/apply-rule.md` refs in `plan-hash-protocol.md` + `rule-adoption-criteria.md` (AGENTS.md forbids `workflows/` inside skills; `grep -r workflows/ skills/hd-maintain/` returns 0).
- Lesson-corpus convention (Option A — match reality): `lesson-patterns.md` rewritten for date-slug (`YYYY-MM-DD-<slug>.md`) per-event files (the actual corpus convention, vs. the prior domain-grouped aspiration). Capture Step 2 creates new dated file, no append-to-domain.

**E4 — Pattern rule adoption** (`b7b360ab`):
- **`.agent/` or `.claude/` present → skip L1/L2/L3, scaffold L4/L5** (4 confirmations: plus-marketing, oracle-chat, lightning, plus-uno). Graduated to `AGENTS.md § Rules` + `hd-setup/SKILL.md` new "Guardrail" section before Step 1 + default-action table.
- **Additive-only discipline when existing harness detected** (6 confirmations, all pilots). Graduated to `AGENTS.md § Rules` + `hd-setup/SKILL.md` guardrail announces the mode up front.

**Regression:** `detect.py` v2 against all 6 `/tmp/hd-real-test/*` clones — all signals populate as expected. sds=scattered, others=advanced. Schema v2 consistent.

### Phase 3d — plus-uno template alignment + rubric expansion

Completed per [`docs/plans/2026-04-17-011-refactor-phase-3d-template-alignment-plan.md`](docs/plans/2026-04-17-011-refactor-phase-3d-template-alignment-plan.md). Six parts, one commit per part:

**Part E** (`26fad172`) — Config file renamed `design-harnessing.local.md` → `hd-config.md`; reference `local-md-schema.md` → `hd-config-schema.md`. 24 living files updated; historical plan/lesson files preserved. Coexistence intact (compound has `compound-engineering.local.md`).

**Part A** (`34e940f7`) — Layer 1 context-skeleton aligned with plus-uno baseline:
- `product/` expanded to 5 files (app / features / flows / users / pillars)
- `conventions/` expanded to 4 files (coding / integrations / tech-stack / terminology)
- `design-system/` restructured into foundations/ + styles/ + components/ triad + `index-manifest.json` (mirrors Material 3 / Ant Design / plus-uno patterns)
- Dropped `agent-persona.md` per Bill directive
- SKILL.md Step 4 now offers "full baseline vs simple mode" depth choice

**Part B** (`65bff04d`) — Layer 5 knowledge-skeleton with 5+1 memory-type model:
- New scaffolded files: `INDEX.md` (domain table with Memory Type column), `README.md` (taxonomy explainer), `changelog.md` (temporal), `decisions.md` (procedural-chosen ADR), `ideations.md` (speculative), `preferences.md` (semantic-taste)
- Lessons are now **domain-grouped** (`lessons/<domain>.md` with ~15 entries) not per-date
- `changelog.md` deferred scaffold (created on first rule adoption)
- Memory-type labels appear in 3 places: YAML frontmatter, INDEX column, README
- `hd:maintain capture` rewritten to classify-and-append-to-domain-file (not create-dated-file); enforces split threshold

**Part C** (`e3251916`) — Rubric library expanded 5 → 12 starters:
- Added: `heuristic-evaluation.md` (Nielsen 10), `typography.md` (Impeccable + Material 3), `color-and-contrast.md` (Impeccable + Material 3 + WCAG), `spatial-design.md` (Impeccable + Material 3), `motion-design.md` (Impeccable + Material 3), `ux-writing.md` (Impeccable + Fluent 2), `responsive-design.md` (Impeccable + Material 3)
- Each new rubric cites its `source:` derivation in YAML frontmatter

**Part D + F** (`2dff1da9`) — Rubric location correction + reference alignment:
- Rubrics now live at `docs/rubrics/<name>.md` (NOT `docs/context/design-system/`). Design-system = source content (tokens/color/type DEFINITIONS); rubrics = checks against that content. Separate concerns.
- `hd-setup/SKILL.md` Step 7 scaffold + critique-extract paths updated
- `hd-review/SKILL.md` rubric resolution: docs/rubrics/ first, design-system/ legacy fallback
- `layer-4-rubrics.md` rewritten with 12-starter enumeration + corrected distributed-behavior explanation
- `rubric-application.md` canonicalizes `docs/rubrics/`
- README + hd-review SKILL.md Assets section list all 12 starters

### Architecture reshape — comprehensive structure

**Added**
- `agents/` at plug-in root — 6 reusable sub-agents invoked via fully-qualified Task names from our skills (`design-harnessing:<category>:<name>`). Categories: analysis, research, review, workflow.
  - `agents/analysis/rule-candidate-scorer.md` — cluster lessons, score 1–5 on grad-readiness (3 dims: recurrence × clean-imperative × team-agreement)
  - `agents/research/lesson-retriever.md` — retrieve past lessons weighted by relevance × recency × importance
  - `agents/research/article-quote-finder.md` — verbatim article quotes with § citations
  - `agents/review/skill-quality-auditor.md` — apply 9-section skill-quality rubric to any SKILL.md
  - `agents/review/rubric-applicator.md` — apply any rubric to any work item
  - `agents/workflow/harness-health-analyzer.md` — deep narrative 5-layer health report
- `hd-setup` detection upgrades (detect.py schema v2):
  - Other-tool harness detection: `.claude/` / `.codex/` / `.agent/` / external `.cursor/skills/` / `docs/plans/` convention
  - MCP configuration parsing: `.mcp.json` / `.cursor/mcp.json` / `.codex/mcp.json` → `mcp_servers[]`
  - 6-category team-tooling detection: docs (notion, google_docs, confluence, coda, obsidian), design (figma, paper, pencildev, sketch), diagramming (excalidraw, miro, whimsical, lucidchart, figjam), analytics (amplitude, mixpanel, posthog, metabase, hotjar, fullstory), pm (linear, jira, github_issues, asana, monday), comms (slack, discord, loom)
  - Config-SoT signals: `tokens_package`, `figma_config`
- `hd-setup` scenarios S11–S14 with user stories:
  - S11 other-tool harness respected (.agent/, .claude/, .codex/, docs/plans/)
  - S12 MCP pre-configured in repo
  - S13 external tooling URL-only (no MCP)
  - S14 tokens-package / figma-config as design-system SoT
- Platform-stubs (scattered→SSoT consolidation): `skills/hd-setup/assets/platform-stubs/` with redirect templates for CLAUDE.md, `.cursor/rules/AGENTS.mdc`, `.windsurf/rules/agent.md`, `.github/copilot-instructions.md`
- 5th starter rubric: `interaction-states.md` (loading / empty / error / success state coverage; Material 3 + Fluent 2 baselines)
- `local-md-schema.md` schema v2: `team_tooling`, `mcp_servers_at_setup`, `layer_decisions`, `other_tool_harnesses_detected` (additive; v1 files upgrade on next skill run)

**Changed**
- **Deleted `workflows/` folders** in hd-setup, hd-maintain, hd-review. Procedures absorbed into each SKILL.md inline. Rationale: workflows inside skills conflated procedural memory with orchestration memory. Shared procedures that span skills are now sub-agents in `agents/`. Matches compound-engineering's current (GitHub main) convention where most skills are flat SKILL.md + references + assets.
- **Renamed `templates/` → `assets/`** in all skills (matches compound's current convention).
- **hd-setup SKILL.md rewritten** (164 → 326 lines): 10-step workflow with explicit Layers 1–5 each as their own step (was previously hidden under a single "five-layer walk" bullet). Per-layer procedure with FRAME → SHOW → PROPOSE → ASK → EXECUTE. Per-layer checkpoint (A/B/C/D: review/capture/inspect/continue) prevents agent-driven steamrolling. Explicit `link / critique / scaffold / skip` contract at every layer. Strict non-interference with `.agent/` / `.claude/` / `.codex/` / external `.cursor/skills/`.
- **hd-maintain SKILL.md rewritten** (122 → 240 lines): three modes (capture / propose / apply) inlined with distinct checklists each. Integration with `design-harnessing:research:lesson-retriever` (capture Phase 1) and `design-harnessing:analysis:rule-candidate-scorer` (propose).
- **hd-review SKILL.md rewritten** (154 → 324 lines): audit + critique inlined. Audit dispatches `design-harnessing:workflow:harness-health-analyzer` (opening), `design-harnessing:review:skill-quality-auditor` (per-skill L2 check), `design-harnessing:analysis:rule-candidate-scorer` (L5 drift), plus configured `compound-engineering:*` reviewers. Critique dispatches `design-harnessing:review:rubric-applicator` (generic) or `skill-quality-auditor` (SKILL.md targets).
- `references/external-tooling.md` renamed → `references/known-mcps.md` (tighter name reflecting what it actually is: 6-category tool map + known-MCP install table + fallback seeds from Material 3 / Fluent 2 / awesome-design-md).
- `detect-mode.sh` kept as thin bash shim; canonical detector is now `detect.py` (schema v2).
- AGENTS.md plug-in conventions doc expanded with full architecture diagram + `agents/` invocation convention + "when to create a new agent" rule.

**Fixed**
- `detect-mode.sh` fragile `{ "$x" = true || ... }` bash syntax replaced with explicit `[ ... ]` form (the pattern worked only by accident — `true`/`false` are real commands).
- `detect-mode.sh` placeholder regex false-positive on our own repo: tightened `{{.*}}` → `{{[A-Z][A-Z0-9_]+}}` and fixed `--exclude-dir` basename matching (grep doesn't match paths).

**Memory-management research (OpenClaw / MemGPT / Generative Agents / Voyager lens)**
Our five-layer framework maps cleanly to established memory-type taxonomy. Procedural = SKILL.md; semantic = references/; episodic = `docs/knowledge/lessons/` (append-only memory stream per Generative Agents pattern); working = Claude Code's context window (managed via progressive disclosure, mirroring MemGPT memory tiers). Our rule adoption mechanism IS reflection (Generative Agents) + skill acquisition (Voyager). Tier 1/2/3 context budget IS memory tiering by access frequency (MemGPT). Future directions noted for post-comprehensive-reshape: importance scoring on lessons, recurrence count on patterns, retrieval-weighted by recency × relevance × importance.

**Regression check**
All 6 real repos (figma/sds, plus-marketing-website, caricature, oracle-chat, lightning, plus-uno) continue to route correctly after the reshape. Budgets green: Tier 1 179/200, all 4 SKILL.md under 500-line hard cap (hd-maintain 240, hd-learn 124, hd-review 324, hd-setup 326).

## [1.0.0] — 2026-04-17 (full release — all four skills)

First public release. Four-skill design-harness plug-in, full-release at v1.0.0. Users get the complete set immediately — no phased rollout.

### Added

**Four complete skills:**

- **`hd-learn`** — LEARN verb. Article-backed Q&A about the five-layer framework (Context / Skills / Orchestration / Rubrics / Knowledge). 11 files: SKILL.md router + 10 atomic reference files (concept-overview, memory-taxonomy, 5 layer explainers, glossary, 10-question FAQ, compound-engineering coexistence). 53 article § citations across the skill.

- **`hd-setup`** — SETUP verb. Adaptive scaffold / reorganize / audit of the five-layer harness in a user's repo. 23 files: SKILL.md router + 9 references (5 layer-specific + 4 shared: tier-budget-model, good-agents-md-patterns, coexistence-checklist, local-md-schema) + 3 workflows (greenfield / scattered / advanced) + 9 templates (AGENTS.md, design-harnessing.local.md, context-skeleton with 4 sub-files, knowledge-skeleton with 3 sub-files) + `scripts/detect-mode.sh` deterministic bash mode detection emitting LOCKED JSON shape.

- **`hd-maintain`** — MAINTAIN verb. Capture lessons + promote lessons to rules. **SHA-256 plan-hash proof-of-consent** for the destructive AGENTS.md write prevents hallucinated approval from runaway agents or LLM-default "yes" completions. 9 files: SKILL.md + 3 references (lesson-patterns, graduation-criteria, plan-hash-protocol) + 3 workflows (capture, propose-rule, apply-rule) + 2 templates.

- **`hd-review`** — IMPROVE verb. Audit harness health (multi-agent orchestration via Task tool, parallel/serial auto-switch at 6+ agents per compound 2.39.0 lesson) + critique work items against team rubrics. Declares `<protected_artifacts>` block so `/ce:review` respects our outputs during cross-plug-in runs. 15 files: SKILL.md + 5 references + 3 workflows (audit-parallel, audit-serial, critique) + 2 templates + 3 starter rubrics (accessibility-wcag-aa, design-system-compliance, component-budget) + `scripts/budget-check.sh`.

**Three sibling manifests (cross-platform submission from day one):**
- `.claude-plugin/plugin.json` — Claude Code marketplace
- `.codex-plugin/plugin.json` — Codex CLI directory
- `.cursor-plugin/plugin.json` — Cursor marketplace
- `.cursor/rules/AGENTS.mdc` — Cursor IDE thin redirect → AGENTS.md

**Universal conventions:**
- `AGENTS.md` — canonical conventions doc (read natively by Claude Code, Codex CLI, Cursor CLI, Windsurf, GitHub Copilot)
- `CLAUDE.md` — one-line `@AGENTS.md` pointer (belt-and-suspenders)

**Meta-harness (dogfood):**
- `docs/context/` — Layer 1 for this plug-in's own build (agent-persona, product one-pager, design-system/file conventions cheat-sheet, conventions/how-we-work)
- `docs/knowledge/` — Layer 5 with 3 real lessons from the build session + one rule visible in git history
- `docs/rubrics/INDEX.md` — Layer 4 thin pointer (distributed-pattern explainer)
- `docs/plans/` — PRDs + implementation plans + scenario matrices (historical record of the build)

**First rule (via episodic→procedural promotion):**
- "Don't ship future-version skill stubs with `disable-model-invocation: true`" — lesson + AGENTS.md rule + changelog.md meta-entry. Surfaced by `/ce:review` synthesis of 3 independent reviewer agents. Informed the decision to ship all four skills together rather than stage behind article cadence.

### Changed

- Flattened repo layout from `plugins/design-harness/*` to repo root (single-plug-in repo; not marketplace-shape).

### Removed

- Nested `plugins/design-harness/` directory (single-plug-in repo).
- `.claude-plugin/marketplace.json` (single plug-in, not marketplace).
- Superseded PRD drafts (v0.2 baseline, v0.3 deepened, 004 rejected 6-skill taxonomy) — preserved in git history.
- Empty `agents/` directory tree (zero sub-agents shipped; uses compound-engineering's via fully-qualified Task calls).
- `CONTRIBUTING.md` placeholder (single-author repo; no contribution pipeline yet).
- Staged/phased release plans — all four skills ship together at v1.0.0.

### Coexistence

All namespace-isolation rules with `compound-engineering` locked in. See [AGENTS.md § Coexistence](AGENTS.md#coexistence-with-compound-engineering).

### Acceptance

Per `docs/plans/2026-04-16-005-feat-v0-mvp-implementation-plan.md` + 006 + 007:
- Phase 1 structural refactor passed 10/10 verification checks (commit `6d7a5e16`)
- hd-learn passed 7/7 acceptance checks (commit `d361bb2e`)
- hd-setup passed 8/8 acceptance checks (commit `b4387dd2`)
- Meta-harness + rule adoption example (commit `712222aa`)
- hd-maintain with plan-hash protocol (commit `540a1b45`)
- hd-review with `<protected_artifacts>` block + budget-check.sh (commit `5a871c87`)
- README + CHANGELOG reflect full-release state (commit `ddd159cd` + this commit)

### Pending before public ship

- n=5 usability tests per skill (median TTFUI ≤30 min; median "articulate value" ≤5 min)
- 12/12 scenario tests per `docs/plans/hd-setup-success-criteria.md`
- Plan-hash round-trip smoke test for hd-maintain (propose → apply on scratch repo)
- Audit smoke test for hd-review (verify exactly 1 write to `docs/knowledge/lessons/harness-audit-*.md`)
- Article URLs filled in (currently *TBD* placeholders in README + manifest descriptions)
- Release tag `v1.0.0` pushed to remote
