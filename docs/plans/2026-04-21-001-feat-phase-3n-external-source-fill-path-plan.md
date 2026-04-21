---
title: "feat: Phase 3n — external-source fill-path + ai-integration-scout"
type: feat
status: completed
date: 2026-04-21
phase: 3n
---

# feat: Phase 3n — external-source fill-path + ai-integration-scout

## Overview

`/hd:setup` has two gaps surfaced by a 2026-04-21 live run on `sense_frontend`:

1. **Step 3 (Tool discovery) collapses silently.** In additive mode, the batched tool-discovery prompt barrels past the user. Our tester never saw a chance to name the tools they use.
2. **CLI tools + internal APIs aren't part of the tool-discovery frame.** Current 6 categories (`docs, design, diagramming, analytics, pm, comms`) cover MCPs tangentially but miss CLI dev tools (`vercel`, `supabase`, `wrangler`, `gh`, `stripe`) and internal data APIs (Supabase, Firebase, Hasura, company APIs) — both of which feed Layers 1 + 5 directly.

The plug-in is an **advisor, not an installer.** We scan, we ask, we **research** AI-integration options (MCP / CLI / API) for tools the user actually uses, then we **link to install docs**. The user installs themselves. Parallel path: users can **paste or drop files** into a layer folder and ask us to organize.

## Problem Statement / Motivation

**Who it hurts:** any user with an existing harness running `/hd:setup`. Additive-mode guardrail fires → Step 3 collapses → user walks away from setup without any prompt to hook up Notion / Figma / Supabase / Linear / their internal API. The whole point of the harness (Layer 1 loaded from canonical sources; Layer 5 compounding from pinned lessons) depends on those external sources landing in the harness. Missing the ask = missing the harness's best value.

**Why live testing caught it and spec review didn't:** our spec had Step 3 described as *"ask one batched question across all 6 categories"* — which reads fine. It doesn't read as "blocking gate" or "the user needs to see narration here." Additive-mode hosts rationally skip through it. Third time live testing has beaten a spec review on this plug-in (after 3k, 3l, 3m) — candidate rule territory.

**Principle clarification (2026-04-21 conversation):** we do NOT install MCPs / CLIs for users. When the user names a tool they use, we do a lightweight web search to see if there's AI support (MCP / CLI wrapper / documented API) and link to install docs. User decides. Alternative path: paste / upload files, plug-in organizes into the right layer.

## Proposed Solution

Three shifts in the setup flow:

1. **Collapse Step 3's interrogation into a scan-summary.** No more blocking batched question. `detect.py` results just get narrated: *"I scanned your repo and see figma, vercel, supabase — I'll surface these where relevant per layer."*
2. **Move the tool-offering into per-layer EXECUTE.** At the moment we're actually populating a layer (L1 Context, L5 Knowledge especially), offer three equal paths:
   - **(a) Wire up a tool** — dispatch `ai-integration-scout` → report MCP/CLI/API findings → link install docs
   - **(b) Paste or drop files** — user pastes markdown/text/URLs → plug-in structures into layer sub-folders
   - **(c) Create from scratch** — existing seeded-prompt path
3. **Add `cli` + `data_api` categories to `detect.py`** so the scan actually surfaces these tools. Schema bump v4 → v5.

New sub-agent `research:ai-integration-scout` does cheap on-demand web search. `known-mcps.md` flips from whitelist-gate to seeded cache that scout writes to. Step 10 adds a closing "research opportunities" nudge so even users who answer "none" have a clear re-entry path.

## Technical Considerations

**Performance:** scout is on-demand (dispatched when user names a tool). 1-2 web searches per tool invocation. Never blocks setup.

**Parallel→serial discipline:** if user names 4+ tools at once, scout dispatch batches ≤5 parallel per our standard convention.

**Schema migration:** v4 → v5 adds two optional arrays (`team_tooling.cli[]`, `team_tooling.data_api[]`). Backward-compatible — v4 configs still parse, missing arrays default to `[]`.

**Host-agnostic:** scout works on Claude Task dispatch + Codex `/agent` + Cursor subagents + inline serial fallback. Web-search tool required; if unavailable, scout degrades to "cache-only" (checks `known-mcps.md`, reports miss if not found, never fabricates).

**Copyright + safety:** scout returns links to official install docs only. Never copies/paraphrases doc content into our own files beyond a short 1-line description per finding.

## System-Wide Impact

- **Interaction graph:** Step 1 (detect) → Step 2 (onboard) → Phase A (parallel auditors) → **Step 3 (scan-summary only, no blocking ask)** → Step 3.5 (structure mode) → Phase B per-layer. Inside each layer's EXECUTE at `create` or `scaffold`, new **fill-path sub-routine** offers three paths; (a) dispatches `research:ai-integration-scout` on-demand.
- **Error propagation:** scout web-search failure → degrade to cache-only → report "no AI integration found in cache; search unavailable" → user proceeds with paste or create path. Never blocks.
- **State lifecycle:** scout writes cache rows back to `known-mcps.md` on successful find. Cache writes are additive only; pre-existing rows untouched.
- **API surface parity:** `detect.py` schema v5 ripples to `hd-config-schema.md`, `hd-config.md.template`, and `/hd:review` (budget-check.sh reads config — verify no breakage when `cli[]` / `data_api[]` present).
- **Integration test scenarios:** (1) repo with `vercel.json` + `supabase/` but no `.mcp.json` → detect emits both categories, L1 EXECUTE offers "research AI integration for supabase", scout returns Supabase MCP link; (2) user pastes a Notion export into `docs/context/product/` → plug-in restructures into `one-pager.md` / `users.md` / etc.; (3) user names a tool scout can't find → records pointer-only.

## Implementation Units

### Unit 1 — Capture the 3n lesson first

**Goal.** Document root cause + advisor-not-installer principle so the rule-candidate metadata is preserved before code lands.

**Files.** `docs/knowledge/lessons/2026-04-21-external-source-fill-path.md` (new).

**Approach.** Write lesson with frontmatter `memory_type: episodic`, `importance: 5`, `rule_candidate: true`. Cover: (a) what the live run surfaced; (b) the two gaps (collapsed Step 3 + missing categories); (c) the advisor-not-installer principle Bill clarified; (d) the two-path wire-or-paste model. Cite the origin convo + reference `/sense_frontend` anonymously.

**Patterns to follow.** Prior lesson: `docs/knowledge/lessons/2026-04-20-iterative-refinement-3k-to-3m.md` (same shape).

**Verification.** File exists, passes frontmatter schema, 3n is the 4th confirmation of "spec review misses what live testing finds" (may cross graduation threshold).

---

### Unit 2 — Collapse Step 3 into scan-summary only

**Goal.** Stop Step 3 from pretending to ask a blocking question it doesn't actually block on.

**Files.** `skills/hd-setup/SKILL.md` (edit Step 3 section lines ~84–92).

**Approach.** Replace the batched-question paragraph with narration-only:
> *"I scanned your repo and see these external tools: `<detected list>`. I'll surface research + integration paths per layer as we get to them. Other-tool harness(es) detected at `<paths>` — we'll coexist."*

Keep the `research:lesson-retriever` solo dispatch (topic: tool-discovery) — it's cheap and feeds Phase A. Drop the *"Ask one batched question"* language. Checklist line renames to *"Step 3: Scan summary + other-tool note (inline, no block)"*.

**Patterns to follow.** `SKILL.md` Step 2 onboard-check (soft narration, non-blocking, silent default).

**Verification.** Running `/hd:setup` inline does not pause at Step 3; scan-summary text appears in chat; flow advances to Step 3.5 without user input.

---

### Unit 3 — New sub-agent `research:ai-integration-scout`

**Goal.** On-demand tool-research agent invoked from per-layer EXECUTE.

**Files.** `agents/research/ai-integration-scout.md` (new).

**Approach.** Frontmatter: `name: design-harnessing:research:ai-integration-scout`, `description` under 180 chars. Body specifies:
- **Input:** `{ tool_name: string, context?: "l1" | "l5" | "l2" | "l3" | "l4" }`
- **Procedure:**
  1. Check `skills/hd-setup/references/known-mcps.md` cache for `<tool_name>` — if row exists, return cached findings + note `source: cache`
  2. On cache miss, run web-search tool for `<tool_name> MCP`, `<tool_name> CLI AI agents`, `<tool_name> API docs` (3 queries max, parallel)
  3. Synthesize findings into structured output (see Output schema below)
  4. Write back to `known-mcps.md` cache if new finding is high-confidence
- **Output:** `{ mcp: {url, maintained, install_docs} | null, cli: {url, install_docs} | null, api: {docs_url} | null, notes: string, source: "cache" | "web" | "none" }`
- **Guardrails:** never fabricate URLs; if all searches return nothing concrete, emit `source: none` + recommend pointer-only; never recommend an unmaintained package without the `maintained: false` flag

**Patterns to follow.** `agents/research/lesson-retriever.md` (structured output, bounded scope, fully-qualified Task name).

**Verification.** Agent responds to a test invocation with `{ tool_name: "supabase" }` returning MCP URL. Also responds to `{ tool_name: "nonexistent-xyz-tool" }` with `source: none`.

---

### Unit 4 — Reframe `known-mcps.md` from gate to cache

**Goal.** Drop the whitelist framing; make it the scout's cache.

**Files.** `skills/hd-setup/references/known-mcps.md` (edit).

**Approach.**
- Remove the line *"Never recommend an MCP package that isn't in the Known table"* (line 39 and similar).
- Remove Integration-Path Triage row for `install-walkthrough` path — we never walk installs.
- Rename section heading *"Known MCP installs"* → *"Seeded cache (scout reads + writes here)"*.
- Add intro paragraph: *"This file is a cache for `research:ai-integration-scout`. Rows are seeded from hand-verified sources; scout appends new rows on successful web finds. Never rely on it as a gate — always dispatch scout for fresh tools."*
- Keep per-tool detail subsections (they're useful install docs pointers).
- Simplify integration-path triage table to 3 paths: `active` (MCP live) / `available` (scout found AI support, user installs) / `pointer-only` (scout found nothing).

**Patterns to follow.** `agents/research/article-quote-finder-corpus.md` (cache-style reference material, not an agent).

**Verification.** No "never recommend unknown" language remains. Triage table has 3 rows. `per-layer-procedure.md` references updated (`install-walkthrough` path no longer mentioned).

---

### Unit 5 — Per-layer EXECUTE "fill path" sub-routine

**Goal.** At each layer where user picks `create` or `scaffold`, offer three equal paths.

**Files.**
- `skills/hd-setup/references/per-layer-procedure.md` (add new "Fill path" section after EXECUTE contract)
- `skills/hd-setup/references/layer-1-context.md` (integrate fill-path offer into Step 4 EXECUTE)
- `skills/hd-setup/references/layer-5-knowledge.md` (integrate fill-path offer into Step 8 EXECUTE)
- `skills/hd-setup/references/layer-2-skills.md` + `layer-3-orchestration.md` + `layer-4-rubrics.md` (shorter — link to per-layer-procedure's fill-path section)

**Approach.** New sub-section in `per-layer-procedure.md`:

```markdown
## Fill path (EXECUTE sub-routine for `create` + `scaffold`)

After user picks `create` or `scaffold` at a layer, offer three ways to populate it:

A. **Wire up a tool** — "Any tools you use that could feed this layer? (e.g., Notion for L1 product facts, Linear for L5 decisions.) I'll research whether there's an MCP / CLI / API to make the feed easier. You decide whether to install."
   → Dispatch `design-harnessing:research:ai-integration-scout` per named tool (batch ≤5 parallel)
   → Report `{mcp, cli, api}` findings inline with install-docs links
   → User installs themselves later; we record pointer file now

B. **Paste or drop files** — "Or drop the raw content / files / URLs into chat, and I'll organize them into <layer-folder>/ structure. Works for exports, pasted markdown, screenshot descriptions, or links I can fetch."
   → Accept content inline or from paths
   → Call the paste-organize helper (see references/paste-organize.md)
   → Write structured files into layer folder

C. **Create from scratch** — existing seeded-prompt path

Default after silence: C (no tool mentioned) / A (tool was mentioned in Step 3 scan-summary).
```

**Patterns to follow.** Existing EXECUTE sub-routines in `layer-1-context.md` (the extract+pointer pattern for scaffold mode).

**Verification.** Each layer reference points to the `## Fill path` section. A manual walkthrough at L1 `create` produces the three-choice prompt.

---

### Unit 6 — Paste-organize helper

**Goal.** Document the "user pastes, we organize" flow so multiple layer references can invoke it consistently.

**Files.** `skills/hd-setup/references/paste-organize.md` (new).

**Approach.** Describe the helper's contract:
- **Input:** user pastes content (markdown / text / bullet list / URLs) + target layer
- **Procedure:**
  1. Classify content into layer sub-categories (e.g., L1 content → `product/` / `engineering/` / `design-system/` / `conventions/`)
  2. Restructure into one-file-per-category using existing layer skeleton templates
  3. Render a proposed-files preview (reuse Step 8.5 table format)
  4. Ask for confirmation before writing
- **Guardrails:** never drop user content (if classification is uncertain, write to `<layer>/unsorted.md` and flag for manual review); never fetch URLs without explicit permission
- **Output:** list of files written + any unsorted residue

**Patterns to follow.** Step 8.5 preview-before-write gate (reuse its confirmation table format).

**Verification.** Reference exists; `per-layer-procedure.md` fill-path section links to it; manual test of pasting a sample Notion export structures into correct sub-folders.

---

### Unit 7 — Expand `detect.py` categories (+ schema v5 bump)

**Goal.** Add `cli` + `data_api` as scannable categories so scan-summary actually surfaces these tools.

**Files.**
- `skills/hd-setup/scripts/detect.py` (edit `CATEGORY_PATTERNS` around line 159)
- `skills/hd-setup/references/hd-config-schema.md` (schema v4 → v5)
- `skills/hd-setup/assets/hd-config.md.template` (schema comment + example rows)
- `skills/hd-setup/references/known-mcps.md` (update category table if present)

**Approach.**

**CLI patterns** — match on `package.json` devDeps + repo config files:
- `vercel` → `vercel.json` OR `vercel` in package.json
- `supabase` → `supabase/config.toml` OR `supabase` CLI in package.json
- `wrangler` → `wrangler.toml`
- `fly` → `fly.toml`
- `railway` → `railway.json` / `railway.toml`
- `gh` → `.github/` directory (soft signal) + pointer for user to confirm
- `stripe` → `stripe` in package.json OR `stripe.toml`
- `sentry` → `.sentryclirc` OR `sentry` in package.json

**Data-API patterns** — match on config files + env-var signals:
- `supabase` → `supabase/` directory (overlap with CLI, count once)
- `firebase` → `firebase.json` OR `.firebaserc`
- `hasura` → `hasura/` directory OR `hasura.config.yaml`
- `airtable` → `airtable` in package.json
- `postgres` → `.env*` scan for `DATABASE_URL` / `POSTGRES_URL` patterns (pointer-only; don't read values)
- `strapi` / `sanity` / `contentful` — headless CMS configs

Schema bump: `team_tooling.cli[]` + `team_tooling.data_api[]` added to schema v5. Backward-compatible (v4 configs parse fine; missing arrays default to `[]`).

**Patterns to follow.** Existing `CATEGORY_PATTERNS` dict (lines 159–195 of `detect.py`).

**Verification.** Run `detect.py` on a repo with `vercel.json` + `supabase/` → output includes `team_tooling.cli: ["vercel", "supabase"]` and `team_tooling.data_api: ["supabase"]`. `/hd:review` budget-check still parses the output (no regression).

---

### Unit 8 — Step 10 research-opportunity closer

**Goal.** Even if user answered "create from scratch" at every layer, Step 10 should surface the follow-up research path.

**Files.** `skills/hd-setup/SKILL.md` (edit Step 10 section).

**Approach.** After the existing *"Next step"* bullet list, add a *"Research opportunities"* subsection:

> **Research opportunities.** I scanned and noted these external tools: `<tool list from team_tooling>`. I didn't wire any up — your call. When you're ready:
> - *"Research AI integration for supabase"* → I'll check MCP / CLI / API support and link install docs
> - *"Organize the attached files into Layer 1"* → paste or drop files, I'll structure them
> - `/hd:setup --discover-tools` → re-enter setup with tool research as the focus

**Patterns to follow.** Step 10's existing outcome-tuned suggestions.

**Verification.** Running a full `/hd:setup` on a repo with detected tools shows the Research-opportunities block at the end.

---

## Scope Boundaries (non-goals)

- **We do NOT install MCPs / CLIs on the user's behalf.** Scout links to install docs; user installs. Explicit principle.
- **We do NOT scan user-level filesystem.** Only repo-scoped scans. `~/.zshrc`, global `~/.mcp.json`, homebrew list — all off-limits.
- **We do NOT wire up auth tokens / secrets.** Scout links to official auth docs; user handles secrets.
- **We do NOT cross-plugin invoke.** Scout stays in `design-harnessing:research:*` namespace.
- **No breaking changes to v4 `hd-config.md` files** — schema v5 is additive.

## Deferred to Implementation

- **Scout's web-search prompt shape.** The exact 3-query template gets tuned during Unit 3 build based on what returns cleanest results. Initial guess: `"<tool> Model Context Protocol" / "<tool> CLI agent" / "<tool> API documentation"`.
- **Paste-organize classification heuristics.** Unit 6 will land with simple keyword matching (e.g., "roadmap" / "priorities" → L1 product; "decision" / "rationale" → L5 knowledge). More sophisticated classification (LLM-delegated) if simple rules fail on test content.
- **Cache invalidation policy.** For now, `known-mcps.md` entries don't expire. If scout finds a cached entry is stale (404 on install doc URL), it overwrites. Separate expiration policy deferred.

## Acceptance Criteria

- [ ] **Unit 1:** Lesson file exists at `docs/knowledge/lessons/2026-04-21-external-source-fill-path.md` with `rule_candidate: true`
- [ ] **Unit 2:** `SKILL.md` Step 3 has no blocking question; scan-summary narration is the only user-visible output
- [ ] **Unit 3:** `agents/research/ai-integration-scout.md` exists; responds to `{tool: supabase}` with structured findings; responds to `{tool: nonexistent-xyz}` with `source: none`
- [ ] **Unit 4:** `known-mcps.md` has no "never recommend unknown" language; triage table lists 3 paths (`active` / `available` / `pointer-only`)
- [ ] **Unit 5:** Manual walkthrough of `/hd:setup` at L1 `create` shows the three-path prompt (wire / paste / scratch); L5 same
- [ ] **Unit 6:** `paste-organize.md` exists; user pasting a sample Notion export into L1 produces structured files in correct sub-folders
- [ ] **Unit 7:** `detect.py` on a repo with `vercel.json` + `supabase/` emits `team_tooling.cli[]` + `team_tooling.data_api[]`; existing v4 config files still parse
- [ ] **Unit 8:** `SKILL.md` Step 10 final render includes the "Research opportunities" section when any tool was detected
- [ ] Full `/hd:setup` dogfood run on this plug-in repo completes without regression; `/hd:review` audit emits no new P0/P1 findings against setup flow

## Success Metrics

- **Qualitative:** re-run the sense_frontend test — tester reports seeing the three-path prompt at L1 + L5, names at least one tool, gets scout findings back
- **Quantitative:**
  - Phase 3n adds ≤300 net lines across `SKILL.md` + per-layer references (the collapse of Step 3 should offset the per-layer additions)
  - New agent file ≤150 lines
  - `detect.py` CLI/data-api patterns ≤60 new lines
- **Staleness signal:** `/hd:review` run in 2 weeks on plug-in repo — no new drift related to tool-discovery

## Dependencies & Risks

**Dependencies:**
- Scout requires a web-search tool in the host environment. Claude Code has `WebSearch`; Codex has equivalents; Cursor inline serial fallback can use any. Degraded mode (cache-only) covers hosts without web search.

**Risks:**
- **Risk:** Scout returns stale / broken install-doc URLs. **Mitigation:** mark `maintained: false` when confidence is low; re-run scout on detection of staleness; add cache TTL in future (deferred).
- **Risk:** Schema v4 → v5 breaks downstream parsers. **Mitigation:** additive-only schema change (new fields default to `[]`); all v4 configs parse clean under v5; `hd-config-schema.md` documents the migration.
- **Risk:** Users paste sensitive content (API keys, personal data) into the paste-organize flow. **Mitigation:** paste-organize helper doc includes guardrail — *"Never write env / secret content; flag and redact before organizing."*
- **Risk:** Parallel scout dispatches exceed 5 when user names many tools. **Mitigation:** batch ≤5 per our standing convention; queue remainder serially.

## Sources & References

### Origin
- **Live run output** from sense_frontend test (2026-04-21, from-user convo) — surfaced the collapsed Step 3 + missing CLI/API categories
- **Principle clarification from Bill (2026-04-21)** — plug-in is advisor, not installer; research happens at layer-EXECUTE time (not pre-layer); two user paths (wire or paste)

### Internal references
- Prior phase plans: [`docs/plans/2026-04-20-001-fix-phase-3l-review-unification-host-agnostic-plan.md`](2026-04-20-001-fix-phase-3l-review-unification-host-agnostic-plan.md), [`docs/plans/2026-04-20-002-fix-phase-3m-setup-accuracy-review-actionability-plan.md`](2026-04-20-002-fix-phase-3m-setup-accuracy-review-actionability-plan.md)
- Latest live-testing lesson: [`docs/knowledge/lessons/2026-04-20-iterative-refinement-3k-to-3m.md`](../knowledge/lessons/2026-04-20-iterative-refinement-3k-to-3m.md) — this plan is the 4th confirmation of "spec review misses what live testing finds"
- Current Step 3 spec: [`skills/hd-setup/SKILL.md`](../../skills/hd-setup/SKILL.md#step-3--tool-discovery) lines 84–92
- Current categories: [`skills/hd-setup/scripts/detect.py`](../../skills/hd-setup/scripts/detect.py) line 159 `CATEGORY_PATTERNS`
- Current mcps reference (to reframe): [`skills/hd-setup/references/known-mcps.md`](../../skills/hd-setup/references/known-mcps.md)
- Per-layer procedure (to extend with fill-path): [`skills/hd-setup/references/per-layer-procedure.md`](../../skills/hd-setup/references/per-layer-procedure.md)

### Convention references
- [`AGENTS.md § Philosophy`](../../AGENTS.md) — advisor-not-installer aligns with "user drives every decision"
- [`AGENTS.md § Rules`](../../AGENTS.md#rules) — additive-only rule (2026-04-18) stays intact; this plan does not modify existing harness artifacts
