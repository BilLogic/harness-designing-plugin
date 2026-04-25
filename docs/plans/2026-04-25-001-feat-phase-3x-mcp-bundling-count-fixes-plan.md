---
title: "feat: Phase 3x — context7 MCP bundling + count-drift cleanup + submission refresh"
type: feat
status: completed
date: 2026-04-25
phase: 3x
origin: review-driven (post-v2.0.0 dogfood + connector research conversation)
---

# feat: Phase 3x — context7 MCP bundling + count-drift cleanup + submission refresh

## Overview

Two threads land together as a v2.1.0 additive release:

1. **Bundle context7 as a Connector** using Compound Engineering's HTTP + env-var pattern (`${CONTEXT7_API_KEY:-}`). Threads the needle around `R_2026_04_21_advisor`: we ship connection scaffold only; user optionally sets their own `CONTEXT7_API_KEY`; works in anonymous mode otherwise. Marketplace listing will show "Connectors: 1 (context7)".
2. **Fix 9 count-drift instances + 1 stale marketplace description.** Counts haven't been propagated since Phase 3n added `ai-integration-scout` (+1 agent) and Phase 3s added 3 self-targeted rubrics (+3 starters, +3 adopted). Affects live marketplace listing display + submission packets.

## Problem Statement

**Connector gap.** Our agents (`ai-integration-scout`, `skill-quality-auditor`, `/hd:learn` references) would benefit from structured library doc lookup via context7 for:
- Scout's research mode (currently WebSearches each discovered package — noisy)
- Scout's classify mode (categorizing `raw_signals.deps` — easier with structured doc lookup)
- /hd:setup Step 3 scan summary (could enrich "Recognized: notion, figma, supabase" with MCP availability inline)

Compound Engineering already bundles context7 successfully. Their pattern (HTTP + `x-api-key: ${CONTEXT7_API_KEY:-}`) sidesteps the auth-wiring concern that originally led us to defer.

**Count drift.** Live files show stale counts:

| File | Says | Actual |
|---|---|---|
| `.claude-plugin/marketplace.json:15` | "9 agents + 14 starter rubrics" | **10 agents + 17 starter rubrics** |
| `AGENTS.md:26` (harness map) | "3 adopted rubrics + 14 starters" | **6 adopted + 17 starters** |
| `README.md:99` | "14 starter rubrics ship" | **17 starter rubrics** |
| `agents/analysis/rubric-recommender.md` (description + body line 120) | "the 14 starter rubrics" | **the 17 starter rubrics** |
| `agents/review/rubric-applier.md:44` | "all 3 adopted rubrics" | **all 6 adopted rubrics** |
| `docs/rubrics/INDEX.md:59` | "14 rubrics" | **17 rubrics** |
| `docs/submissions/anthropic-submission.md:33` | "9 sub-agents and 14 starter rubrics" | **10 + 17** |
| `docs/submissions/cursor-submission.md:34` | "9 sub-agents and 14 starter rubrics" | **10 + 17** |
| `hd-config.md:43` | "3-of-14 starter rubrics adopted" | **6-of-17** |

Plus marketplace.json description hasn't been refreshed since v1.0 — doesn't mention rubric-YAML schema, Step 10.5 hand-off, schema SSOT, or namespace-alignment.

## Proposed Solution

### Connector bundling

Add `.mcp.json` at repo root with Compound's pattern:

```json
{
  "mcpServers": {
    "context7": {
      "type": "http",
      "url": "https://mcp.context7.com/mcp",
      "headers": {
        "x-api-key": "${CONTEXT7_API_KEY:-}"
      }
    }
  }
}
```

Update relevant agents to declare opportunistic context7 usage in their procedure (try → fallback to WebSearch on error). README adds a one-line note explaining the optional `CONTEXT7_API_KEY` env var.

### Count-drift cleanup

Sed/edit the 9 instances above. Refresh marketplace.json description. Refresh submission packets to reflect v2.0+v2.1 capabilities for re-submission.

### Discipline lesson

Capture `2026-04-25-context7-mcp-bundling.md` documenting the env-var-with-empty-default pattern + the auth-wiring distinction that previously confused our analysis.

## Implementation Units

### Unit 3x.1 — Add `.mcp.json` + update README

**Goal.** Bundle context7 cleanly using HTTP + `${CONTEXT7_API_KEY:-}` pattern. Document optional env var in README.

**Files.**
- New: `.mcp.json` at repo root
- Modified: `README.md` (Installation section)

**Approach.**
1. Create `.mcp.json` with the Compound pattern (HTTP url, x-api-key with empty default)
2. Add a 3-line note to README's Installation section: "context7 ships as a Connector. Set `CONTEXT7_API_KEY` env var for higher rate limits; otherwise works anonymously."

**Patterns to follow.** Mirror `~/.claude/plugins/cache/compound-engineering-plugin/compound-engineering/2.42.0/.mcp.json` exactly.

**Verification.** `.mcp.json` parses as valid JSON; README diff is additive (no other content disturbed).

---

### Unit 3x.2 — Fix count drift across 9 live files

**Goal.** All live count claims match actual: 10 agents, 17 starter rubrics, 6 adopted rubrics.

**Files.**
- `.claude-plugin/marketplace.json:15` — "9 agents + 14 starter rubrics" → "10 agents + 17 starter rubrics"
- `AGENTS.md:26` — "3 adopted ... + 14 starters" → "6 adopted ... + 17 starters"
- `README.md:99` — "14 starter rubrics ship" → "17 starter rubrics ship"
- `agents/analysis/rubric-recommender.md:3, 120` — "the 14 starter rubrics" → "the 17 starter rubrics"
- `agents/review/rubric-applier.md:44` — "all 3 adopted rubrics" → "all 6 adopted rubrics"
- `docs/rubrics/INDEX.md:59` — "14 rubrics, for users to copy" → "17 rubrics"
- `hd-config.md:43` — "3-of-14 starter rubrics adopted" → "6-of-17 starter rubrics adopted"

**Approach.** Targeted edits per file. Where a count is part of prose, also expand the rubric list if needed (e.g., AGENTS.md harness map row currently lists 3 by name; expand to 6 inline names).

**Patterns to follow.** Existing line shape preserved; only the numbers change (and rubric-name lists where present).

**Verification.** `grep -E "9 agents|9 sub-agents|3 adopted|14 starter|14 rubrics|3 of 14" --include="*.md" --include="*.json"` returns 0 matches in live files (excluding `docs/plans/`, `docs/knowledge/lessons/`, `docs/knowledge/reviews/`, `CHANGELOG.md` historical sections, `docs/knowledge/changelog.md`, `docs/knowledge/decisions.md`).

---

### Unit 3x.3 — Refresh `marketplace.json` description for v2.0 + v2.1 capabilities

**Goal.** Description in `.claude-plugin/marketplace.json` reflects current capabilities, not v1.0 surface.

**Files.**
- `.claude-plugin/marketplace.json` — `metadata.description` and `plugins[0].description`

**Approach.** Replace the v1.0-era one-liner with a description that names: 4 skills, 10 agents, 17 starter rubrics, YAML-criteria rubric schema, Step 10.5 health hand-off, context7 connector. Stay under whatever character limit Anthropic's directory enforces (assume 250 chars for safety).

**Strawman:**
> "Design-focused AI harness. 4 skills + 10 agents + 17 starter rubrics on YAML-criteria schema. Walks teams through scaffolding, reviewing, and compounding lessons across the five-layer harness (Context, Skills, Orchestration, Rubrics, Knowledge). Plays well with context7."

**Verification.** marketplace.json parses as valid JSON; description ≤ ~250 chars; no broken syntax.

---

### Unit 3x.4 — Update 3 agent specs with opportunistic-context7 declarations

**Goal.** `ai-integration-scout`, `skill-quality-auditor`, `article-quote-finder` declare in their procedure that they will use context7 when available, with a named fallback.

**Files.**
- `agents/research/ai-integration-scout.md` — add to Procedure (research mode + classify mode): try context7 first; fall back to WebSearch.
- `agents/research/article-quote-finder.md` — add to Procedure: when corpus URL points at a context7-indexed source, prefer context7 lookup over web fetch.
- `agents/review/skill-quality-auditor.md` — when verifying an external source citation in a rubric, use context7 if present to confirm doc still exists.

**Approach.** Each gets a short "Phase: optional MCP enrichment" or similar block describing the try-fallback pattern. Don't bloat the agent specs — keep additions ≤ 5 lines each.

**Patterns to follow.** Existing agent procedure phase shape (numbered phases with concrete actions).

**Verification.** Each agent description budget still ≤180 chars; line counts not significantly grown.

---

### Unit 3x.5 — Refresh submission packets

**Goal.** `docs/submissions/anthropic-submission.md` + `cursor-submission.md` carry current count claims, current capability summary, current version (v2.1.0), context7 connector mention.

**Files.**
- `docs/submissions/anthropic-submission.md` — long description, version, "9 sub-agents and 14 starter rubrics" line
- `docs/submissions/cursor-submission.md` — same shape

**Approach.** Update both to reflect: v2.1.0, 10 sub-agents, 17 starter rubrics (6 adopted), context7 Connector, Step 10.5 hand-off, YAML-criteria schema. Add a "What changed since v1.0 submission" footnote so anyone re-reading the packet for re-submission knows what to highlight.

**Verification.** Counts match Unit 3x.2; version matches new release; both packets diff cleanly from each other on copy text (only platform-specific fields differ).

---

### Unit 3x.6 — Capture lesson

**Goal.** Codify the env-var-with-empty-default pattern + the "internal-research vs user-facing MCP" distinction that previously confused our analysis.

**Files.**
- New: `docs/knowledge/lessons/2026-04-25-context7-mcp-bundling.md`

**Content outline.**
- Context: original advisor-not-installer rule led to deferring context7; then we discovered Compound's pattern; the missing piece was distinguishing "wiring auth tokens" (user-supplied keys) from "shipping connection scaffold with empty default" (legitimate)
- Decision / pattern: `${CONTEXT7_API_KEY:-}` — bash-style empty-default expansion lets users opt into auth without us shipping a key
- Result: v2.1.0 ships context7 as Connector; advisor-not-installer rule intact
- Watch: any future MCP we want to bundle — apply the same pattern; if the MCP requires per-user auth and has no anonymous tier, defer to recommend-but-don't-bundle

**Frontmatter.** 3p.3 enriched schema. `rule_candidate: false` (this is a refinement of `R_2026_04_21_advisor`, not a new rule).

**Verification.** Lesson parses; cross-refs resolve; consistent with existing lessons' shape.

---

### Unit 3x.7 — Release v2.1.0

**Goal.** Tag + push v2.1.0. Use `scripts/release.sh 2.1.0`.

**Files.** All 4 manifests bumped 2.0.0 → 2.1.0 by the script; CHANGELOG.md `[Unreleased]` (which we'll write before release) → `[2.1.0] — 2026-04-25`.

**Approach.**
1. Write `[Unreleased]` section to CHANGELOG.md covering all 6 units above
2. Run `bash scripts/release.sh 2.1.0` (preflight + bump + commit + tag + branch push)
3. Push tag: `git push dh v2.1.0`
4. Push to main: `git push dh claude/elegant-euclid:main`
5. Create GitHub release: `gh release create v2.1.0 --notes-from-tag`

**Verification.**
- All 4 manifests at 2.1.0 + parse as valid JSON
- CHANGELOG.md `[2.1.0]` section non-empty
- Tag exists locally + on remote
- v2.1.0 GitHub release published

## Scope Boundaries (non-goals)

- **Don't bundle additional MCPs** beyond context7 — figma-mcp + notion-mcp stay in the "recommended in README" tier (require user-specific connections / auth that don't fit the env-var-empty-default pattern).
- **Don't touch agent invocation logic** — opportunistic context7 use is a description-level addition; agents already gracefully handle missing tools via WebSearch.
- **Don't migrate any rubrics** — count drift fixes only update prose claims, not rubric files themselves.
- **Don't graduate a new rule** for the env-var pattern — it's a refinement of R_advisor, not a new rule. Lesson is captured but `rule_candidate: false`.

## Deferred to Implementation

- **Exact wording of `marketplace.json` description.** Strawman in 3x.3; finalize during implementation. Cap at 250 chars for marketplace safety.
- **Whether to update `R_2026_04_21_advisor` rule text** to explicitly mention the env-var pattern. Strawman: leave the rule as-is (still accurate); the lesson references the rule + adds the pattern as a refinement. Finalize during 3x.6.
- **Submission packet's "What changed" footnote shape.** Strawman: a 3-bullet "Changes since v1.0 submission" block at top. Finalize during 3x.5.

## Acceptance Criteria

- [ ] **3x.1:** `.mcp.json` at repo root with Compound pattern; README Installation section gains 3-line context7 note
- [ ] **3x.2:** All 9 count-drift instances corrected; verification grep returns 0 matches in live files
- [ ] **3x.3:** marketplace.json description refreshed for v2.0+v2.1 capabilities (≤250 chars); JSON parses clean
- [ ] **3x.4:** 3 agent specs declare opportunistic context7 use; descriptions still ≤180 chars
- [ ] **3x.5:** Both submission packets refreshed with current counts + v2.1.0 + context7 + capability list
- [ ] **3x.6:** Lesson captured at `docs/knowledge/lessons/2026-04-25-context7-mcp-bundling.md` with 3p.3 frontmatter; rule_candidate: false
- [ ] **3x.7:** v2.1.0 released; all 4 manifests bumped + JSON valid; tag pushed; GitHub release published
- [ ] **Budgets:** always-loaded ≤200 lines; 0 skill / 0 agent violations
- [ ] **Smoke test:** `python3 detect.py` still works; budget-check.sh still passes; no test regressions
- [ ] **No history violations:** plans/lessons/reviews/CHANGELOG `[1.x.x]` historical entries unchanged

## Success Metrics

- **Quantitative:**
  - Live-file count claims = actual counts (verifiable via grep)
  - Marketplace listing displays "Connectors: 1 (context7)" after Anthropic refresh
  - 0 skill / 0 agent violations
- **Qualitative:**
  - Phase 3x ships in ≤30 minutes (it's a polish + bundle release; no architectural change)
  - The lesson clarifies the env-var pattern so future contributors don't repeat my flip-flop on whether bundling auth-bearing MCPs is OK

## Dependencies & Risks

**Dependencies:** None external. context7's hosted endpoint stays available.

**Risks:**
- **Risk:** context7's `${CONTEXT7_API_KEY:-}` pattern doesn't work on Codex / Cursor (different shell-expansion semantics). **Mitigation:** test by simulating env-var-unset case; if Codex/Cursor break, document as Claude-Code-only Connector and remove from the other two manifests.
- **Risk:** Anonymous-tier context7 returns rate-limit errors immediately. **Mitigation:** agent specs declare graceful fallback to WebSearch; users get a degraded but functional experience without setup.
- **Risk:** marketplace listing display takes time to refresh after v2.1.0 publish. **Mitigation:** marketplace.json bumps version; install path always pulls latest; the display is cosmetic for browsing.

## Sources & References

### Origin
- **Conversation:** post-v2.0.0 marketplace inspection of Compound Engineering's listing showed "Connectors: 1 (context7)" — sparked the question of whether we should match.
- **Discovery:** Compound's `.mcp.json` at `~/.claude/plugins/cache/compound-engineering-plugin/compound-engineering/2.42.0/.mcp.json` — uses the env-var-with-empty-default pattern.

### Internal references
- [`AGENTS.md § Rules`](../../AGENTS.md#rules) — `R_2026_04_21_advisor` (this is being refined, not amended)
- [`docs/knowledge/lessons/2026-04-21-external-source-fill-path.md`](../knowledge/lessons/2026-04-21-external-source-fill-path.md) — original advisor-not-installer lesson
- [`scripts/release.sh`](../../scripts/release.sh) — Phase 3u release automation; will execute the version bump
- [Compound Engineering's pattern](file://~/.claude/plugins/cache/compound-engineering-plugin/compound-engineering/2.42.0/.mcp.json) — reference implementation

### External references
- [Claude Code plugins reference](https://code.claude.com/docs/en/plugins-reference) — `.mcp.json` schema confirmed
- [Context7 client docs](https://context7.com/docs/resources/all-clients) — HTTP + stdio config options

### Deferred (not in this phase)
- Bundling figma-mcp / notion-mcp (require per-user OAuth flows; not env-var-pattern compatible)
- Migrating R_advisor rule text (lesson refines; rule stays as-is)
