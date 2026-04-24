# design-harness — Plug-in Conventions

Canonical source of truth for this repo. Read natively by Claude Code, Codex CLI, Cursor CLI, Windsurf, GitHub Copilot. Other tools get thin redirects (`CLAUDE.md`, `.cursor/rules/AGENTS.mdc`).

## Philosophy

A design harness is the wrapper of context, skills, orchestration, rubrics, and knowledge built around an AI system so every design task inherits the team's accumulated thinking. This plug-in gives design teams skills to build one. Organizing frame: a five-layer noun stack (Context, Skills, Orchestration, Rubrics, Knowledge) — codify practice so it compounds.

## Repo layout

This repo is flat — the plug-in payload IS the repo root (no `plugins/<name>/` nesting since we ship one plug-in). Three sibling plug-in manifests (`.claude-plugin/`, `.codex-plugin/`, `.cursor-plugin/`). Top-level docs are `AGENTS.md` (this file), `CLAUDE.md` (`@AGENTS.md` shim), `CHANGELOG.md`, `README.md`, `LICENSE` (MIT), `loading-order.md` (Tier 1 contract).

Layer-to-path mapping is in § Harness map below. See [`docs/knowledge/reviews/`](docs/knowledge/reviews/) for dated audit reports covering structural drift.

**No `workflows/` folders inside skills.** Procedures live in each SKILL.md; shared procedures that span skills become sub-agents in `agents/<category>/`.

**No `commands/` directory.** Commands are skills with `name: hd:verb` frontmatter, exposed as `/hd:verb`.

## Harness map (where each layer lives)

| Layer | Path | What's here |
|---|---|---|
| **L1 Context** | `docs/context/` + `AGENTS.md` + `loading-order.md` | product/one-pager, design-system/cheat-sheet (file conventions), agent-persona, conventions/. `AGENTS.md` is the master index per 3k.13. |
| **L2 Skills** | `skills/hd-{learn,setup,maintain,review}/` | 4 shipped skills, each with `SKILL.md` + `references/` + optional `assets/` + `scripts/`. |
| **L3 Orchestration** | `agents/{analysis,research,review}/` + Task invocations in each `SKILL.md` | 10 sub-agents dispatched via fully-qualified `design-harnessing:<cat>:<name>` Task names; parallel→serial ≤5. |
| **L4 Rubrics** | `docs/rubrics/` + `skills/hd-review/assets/starter-rubrics/` | 3 adopted rubrics (`skill-quality`, `ux-writing`, `heuristic-evaluation`) + 14 starters available for user scaffolding. Waivers dated in § Rules. |
| **L5 Knowledge** | `docs/knowledge/` | `lessons/` (episodic) + `changelog.md` (rule-adoption log) + `decisions.md` (ADRs) + `ideations.md` + `preferences.md` + `reviews/` (dated harness reviews). |

## `docs/` is our meta-harness

`docs/context/`, `docs/knowledge/`, `docs/rubrics/` at repo root are the five-layer harness running **on this plug-in itself** (dogfood). Distinct from `skills/hd-setup/assets/context-skeleton/` — which is what `/hd:setup` writes to a **user's** repo. Two different harnesses:

- `docs/` = ours (the plug-in maintainers' harness)
- `skills/hd-setup/assets/` = theirs (what we scaffold for end-users)

## `agents/` is for reusable sub-agents

Each `.md` file under `agents/<category>/` defines a Task-invokable sub-agent: YAML frontmatter (`name`, `description`, optional `color` + `model`) + prose that acts as the sub-agent's system prompt.

Categories:
- `analysis/` — deterministic analysis (scoring, clustering)
- `research/` — retrieval + citation finding
- `review/` — rubric application + quality checks

**Invocation convention from skills:** fully-qualified Task names only. From inside our skills:
```
Task design-harnessing:<category>:<agent-name>(...)
```
Never bare names — bare names get re-prefixed wrong. Our namespace is strictly `design-harnessing:<cat>:<name>`; we do not invoke any other plug-in's Task namespace.

**When to create a new agent:** prove ≥2 invocation sites across ≥2 skills, OR a case where an isolated context window measurably improves quality (heavy reads, parallel dispatch). Don't create speculatively.

## Command naming

All commands use `hd:` prefix (two letters — *harness design*; secondary read *high-definition design*).

- `/hd:learn` — Q&A about the harness concept (LEARN)
- `/hd:setup` — walk the five layers (SETUP)
- `/hd:maintain` — capture lessons, promote lessons to rules (MAINTAIN)
- `/hd:review` — review harness health (full) or review a specific work item (targeted) (IMPROVE)

Never ship bare command names. Always namespaced — unnamespaced commands create rename pain when teams extend them.

## Coexistence with other plug-ins

Users often run multiple AI plug-ins in the same repo. Our discipline:

- All commands are `/hd:*` — we do not define or shadow any other plug-in's command prefix.
- All skills are `hd-*` — we do not collide with skill prefixes from other plug-ins.
- Our config file is `hd-config.md` at repo root.
- We write knowledge under `docs/design-solutions/` (activated v0.5), `docs/knowledge/`, and `docs/rubrics/` — namespaces unique to this plug-in.
- `<protected_artifacts>` in `hd-review/SKILL.md` declares paths external review/cleanup tools should leave alone.
- Our Task calls are always `Task design-harnessing:<category>:<agent-name>(...)` — fully-qualified, never bare. We do not call into any other plug-in's Task namespace.

## Skill compliance

Full checklist (YAML frontmatter rules, reference-link rules, budgets, writing style, markdown lint, coexistence) lives at [`docs/context/conventions/skill-compliance-checklist.md`](docs/context/conventions/skill-compliance-checklist.md). Read it before committing any skill.

## Semantic split vocabulary

When describing skill components, use these exact verbs:

- **`references/`** = READ (loaded into context on demand)
- **`templates/`** = COPY + FILL (scaffolding files for user's repo)
- **`scripts/`** = EXECUTE (bash/python tools; output consumed, source not loaded)
- **`assets/`** = ASSETS (templates + starters + skeletons; referenced by skill logic)

Per-mode procedures live in `SKILL.md` inline OR in `references/<mode>-procedure.md` files (e.g., `capture-procedure.md`, `review-procedure.md`). No separate `workflows/` subdirectory — procedures are either the router's body or referenced via progressive disclosure. Shared procedures spanning multiple skills promote to sub-agents in `agents/<category>/`.

## Skill authoring references

Required reading before authoring any skill:

- Anthropic — [Skill best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
- Anthropic — [Complete Guide to Building Skills for Claude (PDF)](https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf)

## Repo-level contributor rules

- **Plan files** use `YYYY-MM-DD-NNN-slug.md` naming (3-digit daily sequence to prevent collisions).
- **Lesson files** use `YYYY-MM-DD-slug.md` in `docs/knowledge/lessons/`.
- **Never write to `docs/solutions/`** — reserved for other tools. Our equivalent is `docs/design-solutions/` (v0.5+).
- **No cross-plug-in Task calls.** Our skills/agents only invoke `Task design-harnessing:<category>:<agent-name>(...)`.

## Rules

Rules that earned their place via episodic lesson → team rule. Each entry dated and sourced back to a lesson. Adoption events are also logged in [`docs/knowledge/changelog.md`](docs/knowledge/changelog.md). Format: `[YYYY-MM-DD] Rule. Source: path/to/lesson.md`.

<!-- Add new rules above this line. -->

- [2026-04-21] **Meta-harness L1 coverage waivers** (this plug-in only). `docs/context/product/` ships only `one-pager.md` — the 5 canonical product files (users-and-personas, user-journeys, capability-map, success-metrics, glossary) are intentionally omitted because the plug-in has no product users distinct from design-team readers of this repo. `docs/context/engineering/` is intentionally absent because the plug-in's "engineering stack" is markdown + bash + python `detect.py` + 3 sibling plug-in manifests, fully documented in AGENTS.md § Repo layout + README. These waivers apply only to this meta-harness — user-repo scaffolds ship all 6 product files + full engineering/ tree via `/hd:setup`. Source: 2026-04-21 L1 dogfood audit.
- [2026-04-21] **Spec review and dry runs won't find what live testing does.** Budget at least one live run per repo-type before calling a feature done. 4 confirmations: pilot matrix (2026-04-17), sds re-pilot (2026-04-17), 3k→3l→3m iteration (2026-04-20), 3n external-source fill-path (2026-04-21). Source: [docs/knowledge/lessons/2026-04-21-external-source-fill-path.md](docs/knowledge/lessons/2026-04-21-external-source-fill-path.md) + [docs/knowledge/lessons/2026-04-20-iterative-refinement-3k-to-3m.md](docs/knowledge/lessons/2026-04-20-iterative-refinement-3k-to-3m.md) + 2 supporting pilot lessons.
- [2026-04-21] **The plug-in is an advisor, not an installer.** We scan, ask, research AI-integration options, link to official install docs. Never install packages on the user's behalf. Never wire auth tokens. User installs themselves; parallel path is paste-and-organize. Source: [docs/knowledge/lessons/2026-04-21-external-source-fill-path.md](docs/knowledge/lessons/2026-04-21-external-source-fill-path.md).
- [2026-04-21] **`docs/rubrics/` adopts 3 of 14 starters** (`skill-quality`, `ux-writing`, `heuristic-evaluation`). Waives 10 visual/UI starters (`accessibility-wcag-aa`, `design-system-compliance`, `interaction-states`, `typography`, `color-and-contrast`, `spatial-design`, `motion-design`, `responsive-design`, `telemetry-display`) — this plug-in authors markdown + scripts, not UI. Waives `component-budget` — duplicative with `skills/hd-review/scripts/budget-check.sh`. Defers `i18n-cjk` until localization lands. Starters remain available for downstream user harnesses via `/hd:setup` L4. Source: 2026-04-21 L4 rubric-recommender audit in [docs/knowledge/reviews/2026-04-21-harness-review.md](docs/knowledge/reviews/2026-04-21-harness-review.md).
- [2026-04-20] When `.agent/` / `.agents/` / `.claude/` / `.cursor/skills/` / `.windsurf/` is detected with ≥1 skill or rule file, `/hd:setup` defaults to: **review** L1/L2/L3 (review existing content + surface improvement suggestions, read-only) and scaffold L4 (rubrics) + L5 (knowledge). The existing harness stays the authority — review never modifies it. Supersedes the 2026-04-18 skip-default rule; live testing across 5 Codex repos on 2026-04-20 surfaced that skip felt too blunt. Source: [docs/knowledge/lessons/2026-04-18-parallel-pilots-3-6-consolidated.md](docs/knowledge/lessons/2026-04-18-parallel-pilots-3-6-consolidated.md) (original 4 confirmations) + docs/plans/2026-04-20-001-fix-phase-3l-review-unification-host-agnostic-plan.md (3l.4 revision).
- [2026-04-18] `/hd:setup` is **additive-only** when any existing harness is detected. Never modify `CLAUDE.md`, `AGENTS.md`, `.agent/`, `.claude/`, `docs/context/`, `docs/knowledge/`, `docs/rubrics/`, or other-tool harness artifacts. New files only. Source: [docs/knowledge/lessons/2026-04-18-parallel-pilots-3-6-consolidated.md](docs/knowledge/lessons/2026-04-18-parallel-pilots-3-6-consolidated.md) (6 confirmations across full pilot matrix).
- [2026-04-16] Don't ship future-version skill stubs with `disable-model-invocation: true` at current version. Wait to author the skill when it's being built. Stubs with fake trigger text + the flag make the skill surface actively worse than if it didn't exist. Source: [docs/knowledge/lessons/2026-04-16-no-future-version-stubs.md](docs/knowledge/lessons/2026-04-16-no-future-version-stubs.md)

## Pre-commit checklist

- [ ] No manual version bump in `.claude-plugin/plugin.json` (automated release)
- [ ] README component counts match actual skill counts
- [ ] All new files pass the skill compliance checklist above
- [ ] Markdown lint clean (no broken fences, no unbalanced quotes)
- [ ] No writes to `docs/solutions/` (reserved for other tools)
- [ ] All three sibling manifests (`.claude-plugin`, `.codex-plugin`, `.cursor-plugin`) aligned on name + version + description
