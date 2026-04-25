# Design Harness — Plug-in v1 PRD (v0.4 four-skills)

**Owner:** Bill (Design Lead, PLUS Tutoring)
**Status:** Draft v0.4 — four-skill architecture + compound-engineering coexistence baked in
**Last updated:** 2026-04-16
**Baseline preserved at:** [`2026-04-16-001-design-harness-plugin-v0.2-baseline.md`](./2026-04-16-001-design-harness-plugin-v0.2-baseline.md)
**v0.3 preserved at:** [`2026-04-16-002-design-harness-plugin-v0.3-deepened.md`](./2026-04-16-002-design-harness-plugin-v0.3-deepened.md)

**Related artifacts (internal — read before building):**
- [Substack article outline (WIP)](/Users/billguo/Documents/Claude/Projects/PLUS/design-harness-article-outline.md) — five-layer framework, locked punchlines, memory taxonomy
- [Substack article drafts (WIP)](/Users/billguo/Documents/Claude/Projects/PLUS/design-harness-article-drafts.md) — §2 / §3 prose for tone
- [plus-uno repo](https://github.com/BilLogic/plus-uno) — extraction source
- [design-harnessing-plugin repo](https://github.com/BilLogic/design-harnessing-plugin) — target repo
- [`hd-setup-scenarios.md`](./hd-setup-scenarios.md) — scenario catalog (10+6+7+9+4)
- [`hd-setup-test-cases.md`](./hd-setup-test-cases.md) — reproduction recipes
- [`hd-setup-success-criteria.md`](./hd-setup-success-criteria.md) — pass/fail bars

**External references:**
- [Every's Compound Engineering guide](https://every.to/guides/compound-engineering)
- Compound plug-in installed at `/Users/billguo/.claude/plugins/cache/compound-engineering-plugin/compound-engineering/2.42.0/`
- [Anthropic skill best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
- [Complete Guide to Building Skills for Claude (PDF)](https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf)

---

## Enhancement summary (v0.3 → v0.4)

**Changed in v0.4:**

1. **Four skills instead of three.** Added `hd-onboard` as a pure learning/Q&A skill backed by article content. Clean four-verb taxonomy:

   | Skill | Verb | Purpose | Writes to |
   |---|---|---|---|
   | `hd-onboard` | **learn** | Article-backed Q&A. Explains concepts, terminology, layer relationships. | Nothing (`design-harnessing.local.md` config only) |
   | `hd-setup` | **setup** | Adaptive scaffold/reorganize/audit. | `docs/context/`, `docs/rubrics/`, `docs/knowledge/` |
   | `hd-compound` | **maintain** | Capture lessons; propose episodic→procedural graduations. | `docs/design-solutions/` |
   | `hd-review` | **improve** | Meta-audit the harness. Read-mostly. | `docs/knowledge/lessons/harness-audit-*.md` |

2. **Skill renamed `hd-harness` → `hd-setup`.** "Setup" is more direct than "harness" since the whole plug-in is called "design harness." Avoids the confusing self-reference.

3. **Progressive-disclosure layer references inside `hd-setup`.** `SKILL.md` is a ≤200-line router; layer-specific content lives in `references/layer-N-*.md` loaded on-demand. Mirrors compound-engineering's `skills/create-agent-skills/` canonical pattern.

4. **Scenario matrix split into three files** — `hd-setup-scenarios.md` (what can happen) + `hd-setup-test-cases.md` (reproduction recipes) + `hd-setup-success-criteria.md` (pass/fail bars). Different owners, different lifecycles.

5. **Compound-engineering coexistence locked in (Appendix F).** Deep review of compound v2.42.0 surfaced collision risks + patterns to copy. Addressed:
   - `hd-compound` writes to `docs/design-solutions/` (not `docs/solutions/`) to avoid `ce-compound-refresh` rewrites
   - `hd-review` uses `design-harnessing.local.md` config (not `compound-engineering.local.md`)
   - Shared compound agents invoked via fully-qualified `compound-engineering:*` Task names
   - `<protected_artifacts>` block in `hd-review/SKILL.md` lists all hd-* outputs
   - `hd:` prefix on every slash command, always

6. **CHANGELOG gotchas pre-incorporated.** From compound 2.31.0 → 2.39.0: description ≤ 180 chars, `disable-model-invocation: true` for manual-only skills, YAML-quoted `argument-hint`, parallel→serial auto-switch at 6+ agents, context-budget precheck before compound operations, markdown-lint every SKILL.md.

7. **Plan-file naming convention.** `YYYY-MM-DD-NNN-slug.md` (3-digit daily sequence) to prevent collisions. This PRD is `-003-`.

8. **Tool-agnostic config file.** `design-harnessing.local.md` at repo root. Markdown, not JSON/YAML. Pattern from compound's `skills/setup/`.

9. **v0.MVP scope adjusted.** `hd-onboard` ships with v0.MVP alongside `hd-setup` since it's pure-learning (no writes) and low-cost to author. `hd-compound` + `hd-review` remain v0.5.

10. **Appendix E expanded** — semantic split vocabulary as build-time rule: references = READ, workflows = FOLLOW, templates = COPY+FILL, scripts = EXECUTE.

### Locked decisions carried from v0.3

- `/hd:` prefix
- `hd-*` skill filenames (one prefix per plugin)
- Two-level repo split (`docs/` pedagogy + `plugins/design-harness/` mechanics)
- No top-level `workflows/` or `rubrics/` folders (ecosystem outlier)
- MIT license
- Commands are skills via `name: hd:verb` frontmatter (compound v2.39.0)

### Open questions still open

- **OQ-9 [Design]** `hd-onboard` trigger: auto-invoke on Q&A-shaped prompts, or manual-only (`disable-model-invocation: true`)? Leaning manual-only to prevent over-triggering.
- **OQ-10 [Engineering]** Ship `.mcp.json` in v0.MVP? Only if any skill needs it (likely no for hd-onboard + hd-setup).
- **OQ-11 [Strategy]** Rename repo `design-harnessing-plugin` → `design-harness` before article #1? Decide before CTA URL lands.

---

## TL;DR

An installable Claude Code plug-in giving design teams a working four-skill harness in under 30 minutes. `hd-onboard` teaches the concept, `hd-setup` scaffolds the harness, `hd-compound` captures lessons, `hd-review` audits the harness itself. Conversion target for the Substack article series.

## Prior Art & Positioning

*(Structure unchanged from v0.3; see that file for full treatment. Key update: compound's 2026 skill count is 46, not 44. Our v0.MVP (2 skills) vs. v0.5 (4 skills) stays proportionally conservative.)*

Differentiation strategy:
1. Five-layer stack (nouns) × four verbs (`/hd:onboard/setup/compound/review`) = different organizing frame than Every's Plan→Work→Review→Compound loop
2. README hero is annotated file tree, not feature list
3. `hd-onboard` output must cite article sections (§) — not possible for `/ce:*` skills which are engineering-domain
4. v0.5 dogfood shows graduation lifecycle in git history

## Problem Statement

*(Unchanged from v0.2/v0.3.)*

## Goals

1. **TTFUI ≤ 30 min** on clean machine. Measured via n=5 usability tests in v0.MVP (telemetry in v1).
2. **Five layers visible in `docs/`** — `context/` + `rubrics/INDEX.md` + `knowledge/` (+ `skills-index.md` / `orchestration.md` at v0.5). Mechanics in `plugins/design-harness/`.
3. **Forkable.** MIT, named placeholders, "Make It Yours" README section.
4. **Substack → clone in one line.** `git clone` for v0.MVP; marketplace for v0.5.
5. **Article is primary; plug-in is conversion target.**

## Non-Goals

*(Unchanged from v0.3.)*

## User Stories

*(Unchanged scope from v0.3. Updated skill names: `hd-setup` replaces `hd-harness`.)*

### Critical edge cases

All addressed in [`hd-setup-scenarios.md`](./hd-setup-scenarios.md). v0.4 update: edge cases are now categorized (S/T/W/F/X), each has a test case and pass criteria in the companion files.

## Requirements

### Must-Have for v0.MVP — ships with article #1

- **P0.0** **Design spikes for `hd-setup` and `hd-onboard`.** Two spec docs in `docs/knowledge/lessons/`:
  - `hd-setup-design.md` — mode detection, layer-reference structure, setup flow per mode, scenario coverage mapping
  - `hd-onboard-design.md` — Q&A interaction shape, article-citation format, reference catalog, glossary scope
  - Both block P0.2. Spec before code.

- **P0.1′** **Three-folder pedagogical scaffolding in `docs/`**: `context/`, `rubrics/INDEX.md` pointer, `knowledge/` — one real artifact each.

- **P0.2a** **`hd-setup` skill.** At `plugins/design-harness/skills/hd-setup/`:
  - `SKILL.md` (≤200 lines, `name: hd:setup`)
  - `references/modes.md`, `layer-1-context.md`, `layer-5-knowledge.md`, `scenarios.md` (pointer)
  - `templates/AGENTS.md.template` + `context-skeleton/`
  - `workflows/greenfield-setup.md`, `scattered-reorg.md`
  - Acceptance: 12/12 v0.MVP scenarios pass per [`hd-setup-success-criteria.md`](./hd-setup-success-criteria.md)

- **P0.2b** **`hd-onboard` skill.** At `plugins/design-harness/skills/hd-onboard/`:
  - `SKILL.md` (≤200 lines, `name: hd:onboard`, likely `disable-model-invocation: true`)
  - `references/concept-overview.md`, `layer-1-explainer.md` through `layer-5-explainer.md`, `glossary.md`, `faq.md`, `article-link-map.md`
  - No `templates/` (no writes beyond `design-harnessing.local.md`)
  - Acceptance: answers 10 seeded FAQ questions with article-section citations

- **P0.4′** **Graduation pattern concrete example**: one lesson in `docs/knowledge/lessons/` + one matching rule in `AGENTS.md` + one entry in `docs/knowledge/graduations.md`.

- **P0.5′** **`git clone` install**. No marketplace dependency.

- **P0.6** **MIT license**.

- **P0.7′** **README with 4 load-bearing sections**: thesis, annotated file tree, install, article link.

### Must-Have for v0.5 full-P0 — ships with article #3

- **P0.1″** Complete pedagogy: add `docs/skills-index.md` + `docs/orchestration.md`. Backfill `hd-setup/references/layer-2/3/4-*.md`.
- **P0.7″** Full 10-section README.
- **P0.8** **Four skills total**: `hd-onboard` + `hd-setup` + `hd-compound` + `hd-review`.
- **P0.9** **Self-referential dogfood — verifiable** (same criteria as v0.3).
- **P0.5″** Marketplace install. Sibling `.codex-plugin/plugin.json` manifest.
- **CONTRIBUTING.md** — two-lane flow.

### Nice-to-Have (P1)

*(Unchanged from v0.3.)*

### Future Considerations (P2)

*(Unchanged from v0.3.)*

## Success Metrics

*(Unchanged from v0.3.)*

## Timeline / Phasing

| Phase | Scope | Ships with |
|---|---|---|
| **v0.0 build** | P0.0 spikes only (two design specs) | pre-article |
| **v0.MVP** | P0.1′, P0.2a (hd-setup), P0.2b (hd-onboard), P0.4′, P0.5′, P0.6, P0.7′ | article #1 |
| **v0.5** | Full four-skill set + verifiable dogfood + marketplace | article #3 |
| **v1** | + telemetry + CTA deep-link + template customization + PLUS case study | article #5 |
| **v2** | P2 items prioritized on v1 signal | post-series |

---

## Implementation Instructions

### Step 1 — Read the live compound plug-in (60 min)

Available locally at `/Users/billguo/.claude/plugins/cache/compound-engineering-plugin/compound-engineering/2.42.0/`. Read in order:
1. `AGENTS.md` (canonical convention doc)
2. `skills/create-agent-skills/` full tree (router-pattern gold standard — hd-setup mirrors this)
3. `skills/ce-compound/SKILL.md` (hd-compound parent)
4. `skills/ce-review/SKILL.md` (hd-review parent — note `<protected_artifacts>` block at lines 54-61)
5. `skills/setup/` (hd-onboard config-writing pattern)

**Deliverable:** `docs/knowledge/lessons/every-plugin-teardown.md` — one-page "what I learned."

### Step 2 — Read the Anthropic skill docs (45 min)

- [Skill best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
- [Complete Guide PDF](https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf)

**Deliverables:** two dogfood entries:
- `docs/knowledge/lessons/skill-best-practices.md`
- `docs/knowledge/lessons/anthropic-skill-guide-takeaways.md`

### Step 3 — Read both articles side by side (60 min)

Plus-uno article outline + drafts. Confirm five-layer framework is superset, not restatement.

### Step 4 — Extract from plus-uno

Redact PLUS-Tutoring-specific content. Rename `uno-*` → `hd-*`. Reorganize into two-level split.

### Step 5 — Build hd-onboard first

It's the simpler skill (no writes beyond config), and writing its layer explainers forces you to concretize the five-layer vocabulary. Use the explainers as the source when writing hd-setup's layer references.

### Step 6 — Build hd-setup

Mirror `create-agent-skills/` structure exactly. Every `references/layer-N-*.md` must be ≤300 lines (else split).

### Step 7 — Run acceptance before shipping

Before calling v0.MVP done: 12/12 scenarios in [`hd-setup-success-criteria.md`](./hd-setup-success-criteria.md) + n=5 usability tests.

---

## Practices to Adopt / Diverge On

*(Unchanged from v0.3; see that file.)*

## Strategic Friction

*(Unchanged from v0.3.)*

---

## Appendix A — Research agents consulted
*(See v0.3.)*

## Appendix B — Canonical file paths for v0 build

- Compound convention doc: `/Users/billguo/.claude/plugins/cache/compound-engineering-plugin/compound-engineering/2.42.0/AGENTS.md`
- create-agent-skills tree: `.../skills/create-agent-skills/`
- ce-compound: `.../skills/ce-compound/SKILL.md`
- ce-review: `.../skills/ce-review/SKILL.md`
- setup (config pattern): `.../skills/setup/`
- Article outline: `/Users/billguo/Documents/Claude/Projects/PLUS/design-harness-article-outline.md`
- Article drafts: `/Users/billguo/Documents/Claude/Projects/PLUS/design-harness-article-drafts.md`
- Scenarios / tests / criteria: `./hd-setup-scenarios.md`, `./hd-setup-test-cases.md`, `./hd-setup-success-criteria.md`

## Appendix C — Cross-platform publishing requirements (2026)

*(Full matrix in v0.3 Appendix C. Key update for v0.4: `*.local.md` config pattern is portable to Codex + Cursor as-is — strengthens cross-platform story.)*

## Appendix D — Scenario coverage pointers

**→ [`hd-setup-scenarios.md`](./hd-setup-scenarios.md)** (what can happen)
**→ [`hd-setup-test-cases.md`](./hd-setup-test-cases.md)** (reproduction recipes)
**→ [`hd-setup-success-criteria.md`](./hd-setup-success-criteria.md)** (pass/fail bars)

Per-skill scenario matrices for `hd-onboard`, `hd-compound`, `hd-review` arrive at v0.5.

## Appendix E — Skill-authoring source materials + build-time rules

### Sources (required reading)
1. [Anthropic — Skill Best Practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
2. [Anthropic — Complete Guide PDF](https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf)
3. [EveryInc/compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin), especially `skills/create-agent-skills/`

### Build-time rules
- **Semantic split vocabulary:** references = READ, workflows = FOLLOW, templates = COPY+FILL, scripts = EXECUTE (not context-loaded)
- **Frontmatter discipline:** `name` (namespaced), `description` (what + when; ≤180 chars), `argument-hint` (YAML-quote specials), `allowed-tools` (YAML list)
- **SKILL.md ≤ 300 lines** (ideally ≤ 200); overflow → `references/`
- **One-level reference links only:** `[name.md](references/name.md)`; never `references/foo/bar.md`
- **Bottom "Reference Files" section** closes each SKILL.md
- **Mode detection discipline:** every adaptive skill matches the scenario matrix signals
- **Destructive actions always confirm** (F4 rule)
- **Output includes ≥1 article-section citation** for onboarding outputs (W7 rule)
- **Markdown-lint pass:** no unclosed fences, no unbalanced quotes
- **Manual-only skills get `disable-model-invocation: true`**
- **AskUserQuestion fallback preamble:** every hd-* SKILL.md opens with 5-line "Interaction Method" block

### Build-time checklist per skill
- [ ] Frontmatter fields present and correct
- [ ] Description ≤ 180 chars
- [ ] SKILL.md ≤ 300 lines
- [ ] References linked via proper markdown (no bare backticks)
- [ ] Mode detection matches scenario matrix
- [ ] Destructive actions always confirm
- [ ] Output references ≥1 article section
- [ ] AskUserQuestion fallback preamble present
- [ ] Markdown passes lint
- [ ] SKILL.md passes `compound-engineering:skills/create-agent-skills` verify-skill workflow

## Appendix F — Compound-engineering coexistence (NEW in v0.4)

Deep review of compound v2.42.0 surfaced the following coexistence rules. All are MUST-follow, not nice-to-have, since Bill (and likely readers) run both plug-ins side by side.

### Namespace isolation

| Compound's | Ours | Rule |
|---|---|---|
| `/ce:*` commands | `/hd:*` commands | Never ship bare command names. Always namespaced. |
| `docs/solutions/` | `docs/design-solutions/` | hd-compound writes to `docs/design-solutions/` exclusively. |
| `compound-engineering.local.md` | `design-harnessing.local.md` | Separate config files. No shared state. |
| `ce-*` skill prefix | `hd-*` skill prefix | Distinct, no collisions. |

### Protected artifacts (hd-review `<protected_artifacts>` block)

`hd-review/SKILL.md` declares:
```yaml
<protected_artifacts>
- docs/design-solutions/**
- docs/knowledge/lessons/**
- docs/knowledge/graduations.md
- design-harnessing.local.md
- plugins/design-harness/**
</protected_artifacts>
```

This prevents other review tools (including `/ce:review`) from flagging our outputs for modification. Mirror pattern from `skills/ce-review/SKILL.md:54-61`.

### Agent reuse via fully-qualified names

Compound's review + research + design agents are reusable. Invoke via fully-qualified Task syntax so bare names don't get re-prefixed incorrectly (compound 2.35.0 fix):

- `compound-engineering:research:framework-docs-researcher`
- `compound-engineering:research:learnings-researcher`
- `compound-engineering:research:best-practices-researcher`
- `compound-engineering:review:pattern-recognition-specialist`
- `compound-engineering:review:code-simplicity-reviewer`
- `compound-engineering:review:agent-native-reviewer`
- `compound-engineering:workflow:spec-flow-analyzer`
- `compound-engineering:design:design-iterator`
- `compound-engineering:design:design-implementation-reviewer`
- `compound-engineering:design:figma-design-sync`

**Skip these** (engineering/Rails/Py/TS-specific or engineering-lifecycle-specific):
- `dhh-rails-reviewer`, `kieran-*-reviewer`, `architecture-strategist`, `data-integrity-guardian`, `data-migration-expert`, `deployment-verification-agent`, `performance-oracle`, `schema-drift-detector`, `security-sentinel`, `ankane-readme-writer`, `bug-reproduction-validator`, `lint`, `pr-comment-resolver`

### Cross-plug-in behavior checks (added to success criteria)

Per [C-S7](./hd-setup-success-criteria.md#c-s7--coexistence-pass-criteria) and [C-F6](./hd-setup-success-criteria.md#c-f6--no-rivalry-pass-criteria):
- No conflict warnings from either plug-in at invocation
- `/ce:plan` still works after `/hd:setup` runs
- No `hd-*` files written to `docs/solutions/` (compound's namespace)
- No `ce-*` files written to `docs/design-solutions/` (our namespace)
- No "conflict/rival/vs./incompatible" language in any skill output

### CHANGELOG gotchas pre-incorporated

From compound 2.31.0 → 2.39.0, these gotchas shaped our design decisions:

1. **2.38.0** — namespace rename pain. Pick `hd:` up front, never ship bare names. ✓
2. **2.38.1** — AskUserQuestion fallback. 5-line preamble on every SKILL.md. ✓
3. **2.39.0** — context-budget precheck in ce:compound. hd-compound offers compact-safe mode when context tight.
4. **2.39.0** — 6+ parallel agents crashes context. hd-review auto-switches parallel→serial at 6+ agents.
5. **2.37.1** — plan-file collisions. Use `YYYY-MM-DD-NNN-slug.md` 3-digit daily sequence. ✓ (this file is `-003-`)
6. **2.36.0** — YAML quoting in `argument-hint`. Quote special chars.
7. **2.36.0** — hyphens not underscores in skill names. ✓
8. **2.31.0** — description ≤ 180 chars. Budget discipline across all hd-* SKILL.md frontmatter.
9. **2.35.0** — fully-qualified Task names for cross-plugin invocation. ✓
10. **2.33.0** — lint SKILL.md for broken markdown (unclosed fences, unbalanced quotes). Add to pre-commit check.
11. **Setup pattern** — `*.local.md` tool-agnostic config (not JSON/YAML). ✓ (`design-harnessing.local.md`)

### Why no hooks, no shell linter

Compound does zero grep-based compliance scanning. All linting happens via sub-agents with Read/Grep internally. **hd-review follows this architecture** — agent-orchestrator loading agents from `design-harnessing.local.md`, NOT a shell linter. Bundle `worktree-manager.sh` (isolated audit passes) from compound's `skills/git-worktree/scripts/` and `get-pr-comments` helpers only.

---

## Change log

| Date | Version | Change | By |
|---|---|---|---|
| 2026-04-16 | v0.2 | Baseline pasted into conversation | Bill |
| 2026-04-16 | v0.3 | Deepened via 5 parallel research agents | Claude + Bill |
| 2026-04-16 | v0.4 | Four skills, hd-harness→hd-setup rename, compound coexistence, scenario split | Claude + Bill |
