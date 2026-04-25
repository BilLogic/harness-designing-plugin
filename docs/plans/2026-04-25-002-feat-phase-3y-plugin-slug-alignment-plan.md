---
title: "feat: Phase 3y — plug-in slug alignment + v3.0.0 release + multi-marketplace submission refresh"
type: feat
status: completed
date: 2026-04-25
phase: 3y
origin: post-3x conversation about marketplace listing alignment + Compound Engineering reference pattern
---

# feat: Phase 3y — plug-in slug alignment + v3.0.0 release + multi-marketplace submission refresh

## Overview

Final naming-alignment pass. Phase 3v already aligned the Task namespace (`design-harnessing:` → `harness-designing:`) on the marketplace + GitHub slug. Phase 3y closes the last drift: the plug-in slug itself.

Today: `plugin.json:name = "design-harness"` (noun phrase) ≠ marketplace name = repo name = Task namespace = `harness-designing` (gerund).

After: ONE name across all surfaces. Install command becomes `/plugin install harness-designing` (matches Compound's reference pattern).

Bundled with submission-packet refresh for all 3 directories (Anthropic — re-submit; Cursor — pending nudge; Codex — packet ready, directory still closed).

## Problem Statement

**Slug drift.** Plug-in slug `design-harness` was the original v1.0 choice; it never got migrated when v2.0.0 aligned everything else on `harness-designing`. The result: install command `/plugin install design-harness` doesn't match what users see in marketplace listings (titled `harness-designing`).

User confirmed (2026-04-25): no external consumers exist yet. Renaming is safe — paper-only breaking change.

**Reference pattern (Compound Engineering's listing):**

| Surface | Compound | Us today | Us after 3y |
|---|---|---|---|
| GitHub repo | `EveryInc/compound-engineering-plugin` | `BilLogic/harness-designing-plugin` | `BilLogic/harness-designing-plugin` |
| Plug-in slug | `compound-engineering` | `design-harness` ❌ drift | `harness-designing` ✅ aligned |
| Marketplace name | `compound-engineering` | `harness-designing` | `harness-designing` |
| Install cmd | `/plugin install compound-engineering` | `/plugin install design-harness` | `/plugin install harness-designing` |

**Multi-marketplace submission status.** Three directories, three statuses:
- **Anthropic** — live as v2.1.0 (approved 2026-04-18, listing auto-updates from marketplace.json)
- **Cursor** — pending reviewer response (submitted 2026-04-18, no approval yet); needs re-submission with v3.0.0 metadata
- **Codex** — directory not open ("Adding plugins to the official Plugin Directory is coming soon" per developers.openai.com/codex/plugins/build); packet ready to submit when it opens

## Proposed Solution

**Rename plug-in slug:** `design-harness` → `harness-designing` across:
- 3 sibling `plugin.json` manifests (`name` field)
- `marketplace.json` `plugins[0].name`
- README install commands (5 host sections)
- AGENTS.md prose mentions
- Submission packets (×3)
- Hard-coded slug strings in skills/agents (none expected, will grep to verify)

**Bump v3.0.0** (technically breaking install command). User confirmed safe.

**Refresh + (re-)submit:**
- Anthropic — listing auto-updates via marketplace.json on git push; no separate action needed
- Cursor — re-submit refreshed packet via cursor.com/marketplace/publish
- Codex — packet ready; document monitoring path; submit when directory opens

## Implementation Units

### Unit 3y.1 — Rename plug-in slug across manifests

**Goal.** All 4 manifest files declare `name: "harness-designing"`.

**Files.**
- `.claude-plugin/plugin.json` — `"name": "design-harness"` → `"harness-designing"`
- `.codex-plugin/plugin.json` — same
- `.cursor-plugin/plugin.json` — same
- `.claude-plugin/marketplace.json` — `plugins[0].name` (also `"design-harness"` → `"harness-designing"`)

**Approach.** Targeted edits. Validate JSON parses post-edit.

**Patterns to follow.** Existing manifest shape unchanged otherwise.

**Verification.** All 4 manifests parse as valid JSON. Slug `"name": "harness-designing"` present in all.

---

### Unit 3y.2 — Update README install commands + Migration callout

**Goal.** All 5 host install sections in README use the new slug. Migration section calls out the v2.x → v3.0 install command change.

**Files.** `README.md`

**Approach.**
1. Replace `/plugin install design-harness` → `/plugin install harness-designing` (Claude Code section)
2. Codex section: `bunx @every-env/compound-plugin install compound-engineering --to codex` is Compound-specific; check if our Codex section has parallel install commands using our slug — update those
3. Cursor section: `/add-plugin design-harness` → `/add-plugin harness-designing`
4. Update the "Migrating from v1.x → v2.0.0+" section to also note v2.x → v3.0.0 (slug rename); both changes are now bundled in the migration story
5. Bump pin example v2.1.0 → v3.0.0
6. Update Status line to v3.0.0

**Patterns to follow.** Existing install-command shape; only the slug token changes.

**Verification.** `grep -c "install design-harness" README.md` returns 0. Migration callout mentions both v2.0.0 namespace + v3.0.0 slug renames.

---

### Unit 3y.3 — Update AGENTS.md prose mentions

**Goal.** AGENTS.md repo-conventions doc reflects the new slug consistently.

**Files.** `AGENTS.md`

**Approach.**
- H1 line: `# design-harness — Plug-in Conventions` → `# harness-designing — Plug-in Conventions`
- Any prose mention of "the design-harness plug-in" → "the harness-designing plug-in"
- Coexistence section's *"plug-in slug `design-harness` (no -ing) untouched"* — REMOVE this carve-out; the rename closes it

**Patterns to follow.** Existing AGENTS.md prose shape.

**Verification.** `grep -c "design-harness" AGENTS.md` returns only allowed-historical-context counts (e.g., the rule entry citing the rename event itself); no live-prose drift.

---

### Unit 3y.4 — Refresh all 3 submission packets

**Goal.** Anthropic + Cursor + Codex packets carry v3.0.0, new slug, refreshed capabilities, and an "alignment milestone" note.

**Files.**
- `docs/submissions/anthropic-submission.md`
- `docs/submissions/cursor-submission.md`
- `docs/submissions/codex-submission.md`

**Approach.**
1. Bump version field: `2.1.0` → `3.0.0`
2. Update plug-in name field: `design-harness` → `harness-designing`
3. Refresh "Changes since v1.0 submission" footnote in anthropic + cursor packets — append v3.0.0 entry: *"Plug-in slug renamed `design-harness` → `harness-designing` to fully align with marketplace + GitHub + Task namespace. Install command changes; no functional changes."*
4. Cursor packet: add re-submission notes (since they haven't reviewed v1.0 yet, the re-submission overlays current state)
5. Codex packet: keep "HOLDING" status; update slug + version; document the monitoring path; mark when directory opens we submit immediately

**Patterns to follow.** Existing packet structure (sections preserved).

**Verification.** All 3 packets reference `harness-designing` not `design-harness` for the plug-in name field. Versions all 3.0.0. Cursor packet has explicit "this is a re-submission overlay" note.

---

### Unit 3y.5 — Capture alignment-completion lesson

**Goal.** Document the slug-rename completion as the final closing of the namespace alignment arc started 2026-04-25.

**Files.** New: `docs/knowledge/lessons/2026-04-25-plugin-slug-alignment.md`

**Content outline.**
- Context: post-v2.0.0 we partially aligned (Task namespace) but left plug-in slug at `design-harness`. User noticed listing-vs-install command mismatch.
- Decision: rename `design-harness` → `harness-designing` for full alignment. Compound Engineering's reference pattern (one name across listing/marketplace/slug) was the model.
- Result: v3.0.0 ships ONE name across all surfaces. Install command reads cleanly: `/plugin install harness-designing`.
- This refines `R_2026_04_25_namespace_alignment` ("shipping artifact name wins") — extends from "Task namespace alignment" to "ALL identifier surfaces alignment, including plug-in slug."

**Frontmatter.** 3p.3 enriched. `rule_candidate: false` (refines existing rule).

**Verification.** Lesson parses; frontmatter conformant; cross-refs resolve.

---

### Unit 3y.6 — Release v3.0.0

**Goal.** Tag + push v3.0.0. Bundle 3y units + post-3x README polish.

**Files.** All 4 manifests bumped 2.1.0 → 3.0.0 by `scripts/release.sh`. `CHANGELOG.md [Unreleased]` (we'll write it before release) → `[3.0.0] — 2026-04-25`.

**Approach.**
1. Write `[Unreleased]` section to CHANGELOG.md covering 3y units + reaffirm v3.0.0 is breaking only at install-command level (no functional change for end users on `/hd:*` commands)
2. Run `bash scripts/release.sh 3.0.0`
3. Push tag: `git push dh v3.0.0`
4. Push to main: `git push dh claude/elegant-euclid:main`
5. Create GitHub release: `gh release create v3.0.0 --notes-from-tag`

**Verification.**
- All 4 manifests at 3.0.0 + parse as valid JSON
- CHANGELOG.md `[3.0.0]` section non-empty
- Tag exists locally + on remote
- v3.0.0 GitHub release published

---

### Unit 3y.7 — Multi-marketplace submission actions

**Goal.** Each marketplace status updated post-v3.0.0.

**Anthropic:** Listing auto-updates from marketplace.json on git push. After v3.0.0 ships and CDN refreshes, listing displays new slug. No manual action; this is just confirmation.

**Cursor:** Re-submit packet via cursor.com/marketplace/publish using the refreshed packet from 3y.4. They haven't reviewed v1.0 yet, so the re-submission becomes the active version.

**Codex:** Document monitoring + add a wake-up reminder. Packet ready to submit when directory opens. No action this phase beyond documentation.

**Files (documentation only).**
- README "Status" line — note Cursor re-submission
- `docs/submissions/codex-submission.md` — refresh monitoring URLs + status note

**Verification.**
- Anthropic listing reflects v3.0.0 (within 48h of git push; cosmetic)
- Cursor re-submission acknowledged via auto-reply email (form submission successful)
- Codex packet at v3.0.0 + ready

## Scope Boundaries (non-goals)

- **Don't change slash command prefix** `/hd:*` — short form earns its keep at daily-use surface
- **Don't change Task namespace** — already aligned in v2.0.0; stays `harness-designing:`
- **Don't actually submit to Codex** — directory still closed; keep packet ready
- **Don't migrate any user data / hd-config.md** — slug change is in our manifests, not user-side files
- **Don't touch GitHub repo URL** — `harness-designing-plugin` (with `-plugin` suffix) is the canonical convention; matches Compound's pattern

## Deferred to Implementation

- **Exact wording of CHANGELOG `[3.0.0]` section** — strawman: lead with "Plug-in slug aligned with marketplace name; install command changes; no functional change for `/hd:*` users." Finalize during 3y.6.
- **Whether to email Anthropic about the slug change** — strawman: skip (no users yet per user confirmation; standard semver + listing auto-refresh handles it). Finalize during 3y.7.
- **Whether to add `/plugin update` reminder to README** — strawman: already covered by recent 3x README polish. Verify during 3y.2.

## Acceptance Criteria

- [ ] **3y.1:** All 4 manifests declare `name: "harness-designing"`; JSON parses clean
- [ ] **3y.2:** README install commands all use new slug; pin example v3.0.0; Status line updated
- [ ] **3y.3:** AGENTS.md H1 + prose mentions use new slug; coexistence carve-out for `design-harness` removed
- [ ] **3y.4:** All 3 submission packets refreshed (version 3.0.0, slug `harness-designing`, alignment milestone footnote)
- [ ] **3y.5:** Lesson captured at `docs/knowledge/lessons/2026-04-25-plugin-slug-alignment.md` with 3p.3 frontmatter
- [ ] **3y.6:** v3.0.0 released; all 4 manifests bumped + JSON valid; tag pushed; GitHub release published
- [ ] **3y.7:** Cursor re-submission completed; Codex monitoring documented
- [ ] **Budgets:** always-loaded ≤200 lines; 0 skill / 0 agent violations
- [ ] **Smoke test:** budget-check.sh still passes; detect.py still works; no test regressions
- [ ] **No history violations:** plans / lessons / reviews / CHANGELOG `[1.x.x]–[2.x.0]` historical entries unchanged
- [ ] **No live-file drift:** `grep -rn "design-harness" --include="*.md" --include="*.json"` returns only history-allowed instances + the rule entry citing the rename event

## Success Metrics

- **Quantitative:**
  - 0 live `design-harness` references (excluding history)
  - 4 manifests on v3.0.0 with new slug
  - 0 skill / 0 agent violations
- **Qualitative:**
  - Phase 3y ships in ≤30 minutes (largely mechanical sed pass + release)
  - Marketplace listing displays cleanly at `/plugin install harness-designing` after 48h refresh
  - Lesson clarifies when partial-alignment-with-deferred-completion is OK (the v2.0 carve-out for plug-in slug) and when to close the loop

## Dependencies & Risks

**Dependencies:** None external.

**Risks:**
- **Risk:** Anthropic's marketplace cache holds v2.1.0 metadata for >48h. **Mitigation:** users installing fresh always pull the latest tagged version regardless of listing display; cosmetic-only delay.
- **Risk:** Cursor's re-submission is treated as a new submission rather than an update. **Mitigation:** include "v3.0.0 — slug renamed; previously submitted as design-harness on 2026-04-18" in cover note; their reviewer can route accordingly.
- **Risk:** Some skill/agent file hardcodes the old slug `design-harness` in a string we miss. **Mitigation:** comprehensive grep before commit; verification step in 3y catches any leftover.

## Sources & References

### Origin
- **Conversation 2026-04-25** — post-3x review of Compound Engineering's marketplace listing surfaced the slug-vs-marketplace-name divergence
- **Earlier ideation** — `docs/knowledge/ideations.md` 2026-04-18 entry on namespace rename (resolved partially in v2.0.0)

### Internal references
- [`AGENTS.md § Rules`](../../AGENTS.md#rules) — `R_2026_04_25_namespace_alignment` (this lesson refines it)
- [`docs/knowledge/lessons/2026-04-25-namespace-rename.md`](../knowledge/lessons/2026-04-25-namespace-rename.md) — the v2.0.0 sibling lesson on Task namespace
- [`scripts/release.sh`](../../scripts/release.sh) — release automation; will execute the v3.0.0 bump
- Compound's pattern at `~/.claude/plugins/cache/compound-engineering-plugin/compound-engineering/2.42.0/.claude-plugin/marketplace.json` — reference for slug-name alignment

### External references
- [Claude Code plugins reference](https://code.claude.com/docs/en/plugins-reference) — install command shape `/plugin install <name>` documented
- [Cursor marketplace publish](https://cursor.com/marketplace/publish) — re-submission portal
- [OpenAI Codex plugins](https://developers.openai.com/codex/plugins/build) — directory still "coming soon"

### Deferred (not in this phase)
- Codex actual submission (directory not open)
- Slash command prefix change (intentionally distinct from slug; daily-use surface earns short form)
