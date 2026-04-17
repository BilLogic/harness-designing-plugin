# hd-setup Scenarios

**Created:** 2026-04-16
**Owner:** Bill (design + PM)
**Lifecycle:** Living document. Append-only during build. Scenarios rarely get removed; they get re-scoped.
**Purpose:** Catalog of "what can happen" when a user invokes `hd-setup`. Covers starting state, team context, workflow, failure modes, and cross-platform listing.

**Companion files:**
- [`hd-setup-test-cases.md`](./hd-setup-test-cases.md) — reproduction recipes per scenario
- [`hd-setup-success-criteria.md`](./hd-setup-success-criteria.md) — pass/fail bars per scenario

**Parent PRD:** [`2026-04-16-002-design-harness-plugin-v0.3-deepened.md`](./2026-04-16-002-design-harness-plugin-v0.3-deepened.md) (will be superseded by v0.4)

---

## Why this file exists separately

The matrix has three concerns with different lifecycles: *scenarios* (what can happen), *test cases* (how to reproduce), *success criteria* (how to verify pass/fail). Splitting them keeps each concern legible and lets different owners edit without stepping on each other. This file owns scenarios only.

If the PRD and this file disagree on scenario coverage, **this file wins.** Add scenarios here first, then reference from the PRD.

---

## Skill architecture recap

Four-skill plug-in taxonomy (see v0.4 PRD):

| Skill | Verb | Purpose |
|---|---|---|
| `hd-onboard` | learn | Article-backed Q&A. No writes. |
| `hd-setup` | setup | **This file's subject.** Adaptive scaffold/reorganize/audit. Writes layer folders. |
| `hd-compound` | maintain | Lesson capture + graduation. Writes to `docs/design-solutions/`. |
| `hd-review` | improve | Meta-audit via compound agents. Read-mostly. |

`hd-setup` uses progressive disclosure. Layer-specific content lives in `references/layer-N-*.md`, loaded only when that layer's flow activates. Never inlined in SKILL.md.

---

## Detection priorities

On invocation, `hd-setup` auto-detects the user's starting state via these signals, in order:

1. Presence/shape of `AGENTS.md`, `CLAUDE.md` at repo root
2. Existence of `.cursor/`, `.windsurf/`, `.github/copilot-instructions.md` (cross-platform signals)
3. Existence of `docs/context/`, `docs/knowledge/`, `.agent/`, or plus-uno-shaped dirs
4. Size of any AI-docs folder (Tier 1 budget check: <200 lines total)
5. Presence of other plugins (`compound-engineering`, `figma`, etc.) via `~/.claude/plugins/` scan
6. Repo age and commit count (fresh vs. established project)
7. Presence of `design-harnessing.local.md` (prior-run marker)
8. Explicit user-provided mode flag (`/hd:setup --mode=audit`)

---

## Category 1 — Starting-state scenarios (what the repo looks like)

### S1 — Cold greenfield
- **Signal:** No `AGENTS.md`, `CLAUDE.md`, `.cursor/`, `.agent/`, or AI-specific docs. Repo empty or non-AI.
- **Mode:** `greenfield`
- **Expected behavior:** Scaffold from zero. Walk user through Layer 1 (Context) first — easiest universal entry. Create minimal `docs/` skeleton. Offer one example artifact per layer from plug-in templates. Write `design-harnessing.local.md` at repo root.
- **Priority:** v0.MVP
- **See:** [T-S1](./hd-setup-test-cases.md#t-s1), [C-S1](./hd-setup-success-criteria.md#c-s1)

### S2 — Single-file setup
- **Signal:** Only `AGENTS.md` or `CLAUDE.md` exists at root; no layer folders, no `.agent/`.
- **Mode:** `scattered`
- **Expected behavior:** Read existing file. Classify content against the five layers. Propose unpacking into layer folders. Preserve original verbatim; never destroy.
- **Priority:** v0.MVP
- **See:** [T-S2](./hd-setup-test-cases.md#t-s2), [C-S2](./hd-setup-success-criteria.md#c-s2)

### S3 — Awesome-design-md style
- **Signal:** `DESIGN.md` or similar single-purpose design file exists (awesome-design-md pattern).
- **Mode:** `scattered`
- **Expected behavior:** Detect single-file design doc. Propose decomposing into `docs/context/design-system/` structure per article §4a (foundations / styles / components).
- **Priority:** v0.5
- **See:** [T-S3](./hd-setup-test-cases.md#t-s3), [C-S3](./hd-setup-success-criteria.md#c-s3)

### S4 — Multi-platform pointers
- **Signal:** ≥2 of `CLAUDE.md`, `.cursor/rules/`, `.windsurf/rules/`, `.github/copilot-instructions.md`.
- **Mode:** `scattered`
- **Expected behavior:** Detect scattered platform files. Propose consolidation via `AGENTS.md` as single source of truth + platform-specific redirect stubs (pattern from plus-uno Appendix B).
- **Priority:** v0.5
- **See:** [T-S4](./hd-setup-test-cases.md#t-s4), [C-S4](./hd-setup-success-criteria.md#c-s4)

### S5 — Advanced / plus-uno-shaped
- **Signal:** Full layer folders already exist (`docs/context/`, `docs/knowledge/`, `.agent/skills/`).
- **Mode:** `advanced`
- **Expected behavior:** Audit mode. Compare actual structure against the five-layer rubric. Flag gaps, bloat, drift. Never overwrite.
- **Priority:** v0.5
- **See:** [T-S5](./hd-setup-test-cases.md#t-s5), [C-S5](./hd-setup-success-criteria.md#c-s5)

### S6 — Bloated docs
- **Signal:** AI-docs folder combined > 200 lines (violates Tier 1 budget) OR single file > 500 lines.
- **Mode:** `scattered` with audit overlay
- **Expected behavior:** Propose tier restructuring. Identify non-critical content for migration to Tier 2 (skill-triggered).
- **Priority:** v0.5
- **See:** [T-S6](./hd-setup-test-cases.md#t-s6), [C-S6](./hd-setup-success-criteria.md#c-s6)

### S7 — Every's plug-in installed
- **Signal:** `compound-engineering` plugin detected at `~/.claude/plugins/cache/compound-engineering-plugin/`.
- **Mode:** any of the above, with `coexistence` overlay
- **Expected behavior:** Work alongside without namespace fights. `/hd:*` is its own surface; don't touch `/ce:*`. Acknowledge Every as philosophical cousin. Position hd-* as design-domain complement. See Appendix F in v0.4 PRD for full collision-mitigation rules.
- **Priority:** v0.MVP
- **See:** [T-S7](./hd-setup-test-cases.md#t-s7), [C-S7](./hd-setup-success-criteria.md#c-s7)

### S8 — Plug-in installed but harness empty
- **Signal:** `design-harness` plug-in present at plug-in cache but no `docs/` structure in user's current repo.
- **Mode:** `greenfield` (within the user's repo) even though plugin is installed
- **Expected behavior:** Treat as cold start for that repo. Same as S1.
- **Priority:** v0.MVP
- **See:** [T-S8](./hd-setup-test-cases.md#t-s8), [C-S8](./hd-setup-success-criteria.md#c-s8)

### S9 — Re-run on existing harness
- **Signal:** `design-harnessing.local.md` or `docs/knowledge/graduations.md` exists (markers that `hd-setup` has run before).
- **Mode:** `advanced` (audit/optimize)
- **Expected behavior:** Do not re-scaffold. Offer layer-specific deep-dive options. Surface what's new since last run.
- **Priority:** v0.MVP
- **See:** [T-S9](./hd-setup-test-cases.md#t-s9), [C-S9](./hd-setup-success-criteria.md#c-s9)

### S10 — Forked from another team's harness
- **Signal:** Placeholders like `{{TEAM_NAME}}`, `{{PREFIX}}`, `{{YOUR_PRODUCT}}` detected in any file.
- **Mode:** `localize`
- **Expected behavior:** Localization workflow. Walk through placeholder replacement interactively.
- **Priority:** v0.5
- **See:** [T-S10](./hd-setup-test-cases.md#t-s10), [C-S10](./hd-setup-success-criteria.md#c-s10)

---

## Category 2 — Team-context scenarios (what the skill asks mid-setup)

### T1 — Solo designer
- **Prompt:** "Solo designer or team?"
- **If solo:** Defer Layer 5 graduation complexity. Emphasize Layers 1 (Context) + 4 (Rubrics). Single-person knowledge capture is fine as a scratchpad; graduation can wait.
- **Priority:** v0.MVP
- **See:** [T-T1](./hd-setup-test-cases.md#t-t1), [C-T1](./hd-setup-success-criteria.md#c-t1)

### T2 — 5–20 person team (primary persona)
- **Default path.** Full five-layer recommendation.
- **Priority:** v0.MVP
- **See:** [T-T2](./hd-setup-test-cases.md#t-t2), [C-T2](./hd-setup-success-criteria.md#c-t2)

### T3 — Team with rotation
- **Prompt:** "Does your team rotate, have interns, or high turnover?"
- **If yes:** Emphasize Layer 5 graduation patterns, rotation-resilient onboarding docs, handoff patterns in Layer 3.
- **Priority:** v0.5

### T4 — Designer + engineer pair
- **Prompt:** "Cross-functional pair, or design-only team?"
- **If pair:** Recommend Layer 3 handoff artifacts (design specs, reviewed tokens, synced design system).
- **Priority:** v0.5

### T5 — Monorepo with multiple products
- **Prompt:** "One product or multiple in this repo?"
- **If multiple:** Offer "one harness per product" vs. "shared harness with product-specific context files." Explain trade-offs.
- **Priority:** future

### T6 — No design system yet
- **Signal:** No `design-system/`, `tokens.json`, `packages/ui/`, or similar.
- **Expected behavior:** Scaffold minimal `docs/context/design-system/` with placeholder cheat-sheet template. Explicitly mark as starter.
- **Priority:** v0.5

---

## Category 3 — Workflow / integration scenarios

### W1 — User mid-project (not fresh start)
- **Signal:** Existing active project (>20 non-trivial commits in last 30 days).
- **Expected behavior:** Migration path, not scaffold. Smaller increments. Offer "just the lesson-capture workflow" as a lighter entry point.
- **Priority:** v0.5

### W2 — User explicitly skipping a layer
- **Trigger:** User declines layer setup in interactive flow.
- **Expected behavior:** Respect choice. Write skip record to `design-harnessing.local.md` so future runs don't re-propose.
- **Priority:** v0.MVP
- **See:** [T-W2](./hd-setup-test-cases.md#t-w2), [C-W2](./hd-setup-success-criteria.md#c-w2)

### W3 — Knowledge lessons present but never graduated
- **Signal:** `docs/knowledge/lessons/*.md` exist with dates, but no corresponding rules in `AGENTS.md`.
- **Expected behavior:** Hand off to `hd-compound` with a note. `hd-setup` does NOT do graduations — separation of concerns.
- **Priority:** v0.5

### W4 — User has Figma MCP installed
- **Signal:** `.mcp.json` references `figma` OR `figma` plugin detected.
- **Expected behavior:** Recommend Figma-specific rubrics in Layer 4 reference (e.g., token drift checks). Load `layer-4-rubrics.md` with Figma-aware suggestions.
- **Priority:** v1

### W5 — User has no vendor AI tools
- **Expected behavior:** File-only mode. No MCP dependencies. Markdown-only examples.
- **Priority:** v0.MVP
- **See:** [T-W5](./hd-setup-test-cases.md#t-w5), [C-W5](./hd-setup-success-criteria.md#c-w5)

### W6 — User on non-Claude platform (future cross-platform)
- **Signal:** Skill invoked via Codex CLI or Cursor.
- **Expected behavior:** Graceful degradation. Point at portable markdown outputs. Skip Claude-specific `/hd:*` command hints.
- **Priority:** P2

### W7 — User has article open while running skill
- **Signal:** Not detectable directly; infer from session context.
- **Expected behavior:** Skill output references article sections by number ("this maps to §4a in the article") so reading and doing stay linked.
- **Priority:** v0.MVP
- **See:** [T-W7](./hd-setup-test-cases.md#t-w7), [C-W7](./hd-setup-success-criteria.md#c-w7)

---

## Category 4 — Failure-mode scenarios

### F1 — `hd-compound` invoked before `hd-setup` ever ran
- **Behavior:** Warn. Check for `docs/knowledge/` existence. If missing, suggest running `hd-setup` first. User can force-override with `--skip-checks`.
- **Priority:** v0.5

### F2 — Layer 3 setup attempted before any Layer 2 skill exists
- **Behavior:** Block. Explain dependency (orchestration needs ≥1 skill to orchestrate). Link to `layer-2-skills.md` reference.
- **Priority:** v0.5

### F3 — Multiple harnesses detected in repo
- **Signal:** `docs/` with layer structure exists AND `apps/foo/docs/` with layer structure exists.
- **Behavior:** Ask which to operate on. Support monorepo pattern.
- **Priority:** future

### F4 — Destructive action about to overwrite existing file
- **Behavior:** Always confirm. Never silent. Offer three options: backup-and-replace, merge, abort.
- **Priority:** v0.MVP
- **See:** [T-F4](./hd-setup-test-cases.md#t-f4), [C-F4](./hd-setup-success-criteria.md#c-f4)

### F5 — Skill gets confused mid-run (unexpected repo state, malformed YAML, etc.)
- **Behavior:** Save progress to `.hd-setup/session.md`. Exit with clear error. Resumable on next invocation (within 7 days; after that, fresh start).
- **Priority:** v0.5

### F6 — Conflicting prior plugin (e.g., Every's `compound-engineering` has claimed `ce-*`)
- **Behavior:** Document coexistence. Don't fight other plugins' namespaces. `hd-*` is its own surface. No "rivalry" copy in output.
- **Priority:** v0.MVP
- **See:** [T-F6](./hd-setup-test-cases.md#t-f6), [C-F6](./hd-setup-success-criteria.md#c-f6)

### F7 — User's AGENTS.md has conflicting rules
- **Signal:** e.g., "never use markdown" when skill writes markdown.
- **Behavior:** Detect conflict. Surface to user. Ask whether to honor existing rule, override for this skill, or update AGENTS.md.
- **Priority:** v0.5

### F8 — API key missing or invalid
- **Behavior:** Standard Claude Code failure mode; skill should not attempt to handle this — let the platform error surface.
- **Priority:** v0.MVP (pass-through)

### F9 — Partial detection (detects contradictory signals, e.g., S1 + S5 simultaneously)
- **Behavior:** Ask the user explicitly. Don't guess.
- **Priority:** v0.5

---

## Category 5 — Cross-platform listing scenarios (deferred)

### X1 — Plug-in listed on Claude Code marketplace
- **Publish artifact:** `.claude-plugin/plugin.json` + `.claude-plugin/marketplace.json` at repo root.
- **Priority:** v0.5

### X2 — Plug-in listed on Codex CLI
- **Publish artifact:** `.codex-plugin/plugin.json` at same plugin root. SKILL.md tree is identical — no skill rewrite needed.
- **Priority:** v1

### X3 — Plug-in listed on Cursor marketplace
- **Publish artifact:** `.cursor-plugin/plugin.json`. Requires manual review + OSS license (MIT clears).
- **Priority:** P2

### X4 — Windsurf, Continue.dev, Copilot
- **Status:** Windsurf has no skill-layer marketplace. Continue.dev needs `config.yaml` format. Copilot requires HTTP service architecture — not compatible with markdown bundles.
- **Priority:** deferred indefinitely; portable markdown still works via AGENTS.md convention.

---

## Open questions per category

**Starting-state:**
- [ ] How does `hd-setup` treat a repo that has `plus-uno` itself as a git submodule? (meta-meta-case)
- [ ] What if user's `AGENTS.md` is actually Every's `AGENTS.md` unchanged? (false positive for S2)

**Team-context:**
- [ ] Do we ask team questions every run or only first run? (Default: first run writes answer to `design-harnessing.local.md`; subsequent runs read from there.)

**Workflow:**
- [ ] Is article-aware mode (W7) too clever? Maybe just link to article once at the end.

**Failure modes:**
- [ ] F5 resumability — 7 days is the current default, matching plus-uno's handoff pruning. Revisit if users report stale-session friction.

---

## Change log

| Date | Change | By |
|---|---|---|
| 2026-04-16 | Initial matrix created (as `hd-harness-scenario-matrix.md`) during pivot from 3-skill to layer-reference architecture | Claude + Bill |
| 2026-04-16 | Matrix split into scenarios / test-cases / success-criteria. Skill renamed hd-harness → hd-setup. Old matrix file deleted. | Claude + Bill |
