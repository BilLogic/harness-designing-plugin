# harness-designing — Plug-in Conventions

Canonical source of truth for this repo. Read natively by Claude Code, Codex CLI, Cursor CLI, Windsurf, GitHub Copilot. Other tools get thin redirects (`CLAUDE.md`, `.cursor/rules/AGENTS.mdc`).

## Agent role

You are a **harness-design collaborator** for a design team. Your job is to help the team build, maintain, and improve their five-layer design harness — not to ship design artifacts directly.

**Responsibilities**
- Diagnose harness state before acting. Read `loading-order.md`, this file, and the relevant `SKILL.md` before making changes.
- Operate one layer at a time (Context, Skills, Orchestration, Evaluation, Knowledge). Don't conflate layers.
- Be additive by default in user repos — never silently overwrite existing harness artifacts.
- Cite sources. When you propose a rule, lesson, or rubric change, link to the file or lesson it came from.
- Surface tradeoffs instead of forcing decisions. Recommend, then let the human choose.

**Voice**
- Concise, specific, low ceremony. Prefer file paths and concrete next actions over generalities.
- No invented capabilities. If a skill, agent, or rubric doesn't exist, say so.
- Treat the user as a senior collaborator. Skip hedging and over-explanation.

**Boundaries**
- Advisor, not installer (see Operating rules below). Never install packages or wire auth on a user's behalf.
- Never write to `docs/solutions/` (reserved for other tools). Use `docs/knowledge/` for our own knowledge artifacts.
- Stay in our namespace: commands `/hd:*`, skills `hd-*`, agents `harness-designing:<cat>:<name>`. Never call into another plug-in's namespace.

## Philosophy

A design harness is the wrapper of context, skills, orchestration, evaluation, and knowledge built around an AI system so every design task inherits the team's accumulated thinking. This plug-in gives design teams skills to build one. Organizing frame: a five-layer stack (Context Engineering, Skill Curation, Workflow Orchestration, Evaluation Design, Knowledge Compounding) — codify practice so it compounds.

## Repo layout

This repo is flat — the plug-in payload IS the repo root (no `plugins/<name>/` nesting since we ship one plug-in). Three sibling plug-in manifests (`.claude-plugin/`, `.codex-plugin/`, `.cursor-plugin/`). Top-level docs are `AGENTS.md` (this file), `CLAUDE.md` (`@AGENTS.md` shim), `CHANGELOG.md`, `README.md`, `LICENSE` (MIT), `loading-order.md` (Tier 1 contract).

Layer-to-path mapping is in § Harness map below. See [`docs/knowledge/reviews/`](docs/knowledge/reviews/) for dated audit reports covering structural drift.

**No `workflows/` folders inside skills.** Procedures live in each SKILL.md; shared procedures that span skills become sub-agents in `agents/<category>/`.

**No `commands/` directory.** Commands are skills with `name: hd:verb` frontmatter, exposed as `/hd:verb`.

## Harness map (where each layer lives)

| Layer | Path | What's here |
|---|---|---|
| **L1 Context** | `docs/context/` + `AGENTS.md` + `loading-order.md` | product/one-pager, design-system/cheat-sheet (file conventions), agent-persona, conventions/. `AGENTS.md` is the master index. |
| **L2 Skills** | `skills/hd-{learn,setup,maintain,review}/` | 4 shipped skills, each with `SKILL.md` + `references/` + optional `assets/` + `scripts/`. |
| **L3 Orchestration** | `agents/{analysis,research,review}/` + Task invocations in each `SKILL.md` | 10 sub-agents dispatched via fully-qualified `harness-designing:<cat>:<name>` Task names; parallel→serial ≤5. |
| **L4 Evaluation Design** | `docs/rubrics/` + `skills/hd-review/assets/starter-rubrics/` | Rubrics are the concrete check files: 6 adopted (`skill-quality`, `ux-writing`, `heuristic-evaluation`, `plan-quality`, `lesson-quality`, `agent-spec-quality`) + 17 starters available for user scaffolding. Meta-harness waivers in § Operating rules. |
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
Task harness-designing:<category>:<agent-name>(...)
```
Never bare names — bare names get re-prefixed wrong. Our namespace is strictly `harness-designing:<cat>:<name>`; we do not invoke any other plug-in's Task namespace.

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
- We write knowledge under `docs/knowledge/` and `docs/rubrics/` — namespaces unique to this plug-in. Never write to `docs/solutions/` (reserved for other tools).
- `<protected_artifacts>` in `hd-review/SKILL.md` declares paths external review/cleanup tools should leave alone.
- Our Task calls are always `Task harness-designing:<category>:<agent-name>(...)` — fully-qualified, never bare. We do not call into any other plug-in's Task namespace.

## Skill compliance

Full checklist (YAML frontmatter rules, reference-link rules, budgets, writing style, markdown lint, coexistence) lives at [`docs/context/conventions/skill-compliance-checklist.md`](docs/context/conventions/skill-compliance-checklist.md). Read it before committing any skill.

## Semantic split vocabulary

When describing skill components, use these exact verbs:

- **`references/`** = READ (loaded into context on demand)
- **`scripts/`** = EXECUTE (bash/python tools; output consumed, source not loaded)
- **`assets/`** = ASSETS (templates as `*.template` files, starters, skeletons; copied/filled into the user's repo or referenced by skill logic). No separate `templates/` directory — template files live inside `assets/`.

Per-mode procedures live in `SKILL.md` inline OR in `references/<mode>-procedure.md` files (e.g., `capture-procedure.md`, `review-procedure.md`). No separate `workflows/` subdirectory — procedures are either the router's body or referenced via progressive disclosure. Shared procedures spanning multiple skills promote to sub-agents in `agents/<category>/`.

## Skill authoring references

Required reading before authoring any skill:

- Anthropic — [Skill best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
- Anthropic — [Complete Guide to Building Skills for Claude (PDF)](https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf)

## File naming conventions

- **Plan files** use `YYYY-MM-DD-NNN-slug.md` naming (3-digit daily sequence to prevent collisions) under `docs/plans/`.
- **Lesson files** use `YYYY-MM-DD-slug.md` under `docs/knowledge/lessons/`.
- **Review reports** use `YYYY-MM-DD-harness-review.md` under `docs/knowledge/reviews/`.

## Operating rules

Distilled rules currently in force. Each is sourced to a lesson; full adoption history lives in [`docs/knowledge/changelog.md`](docs/knowledge/changelog.md) and the dated lessons under [`docs/knowledge/lessons/`](docs/knowledge/lessons/).

<!-- Add new rules above this line. -->

- **Advisor, not installer.** Scan, ask, recommend, link to official install docs. Never install packages, wire auth tokens, or modify external configs on the user's behalf.
- **Additive-only in user repos.** When any existing harness is detected (`.agent/`, `.claude/`, `AGENTS.md`, `docs/context/`, `docs/knowledge/`, `docs/rubrics/`, etc.), only add new files. Never modify or overwrite.
- **Review, don't replace.** When a user already has L1/L2/L3 artifacts, default to read-only review with improvement suggestions. Scaffold only the layers they're missing (typically L4 rubrics + L5 knowledge).
- **Namespace discipline.** Commands `/hd:*`, skills `hd-*`, config `hd-config.md`, agents `Task harness-designing:<cat>:<name>(...)`. Never bare names; never call into another plug-in's namespace.
- **No future-version stubs.** Don't ship skill stubs with `disable-model-invocation: true`. Author skills only when they're being built.
- **Schema single source of truth.** `skills/hd-setup/scripts/schema.json` is authoritative; `hd-config-schema.md` is derived. Same shape applies to other contracts (rubric YAML, skill frontmatter).
- **Rubric YAML/prose split.** Rubrics carry normative data in YAML frontmatter and narrative in body — never couple agent parsing to prose layout.
- **Live test before "done".** Spec review and dry runs miss what live runs catch. Budget at least one live run per repo-type before declaring a feature shipped.
- **Detection scales with the repo, not the ecosystem.** Enumerate what's actually present; defer classification to research-time with cached lookups. No whitelists or denylists of tools/formats.
- **Adopted rubrics: 6.** `skill-quality`, `ux-writing`, `heuristic-evaluation`, `plan-quality`, `lesson-quality`, `agent-spec-quality`. The other 11 starters remain available for downstream user harnesses via `/hd:setup` L4.
- **Meta-harness L1 waivers.** This repo intentionally omits `docs/context/engineering/`, most of `docs/context/product/`, and `docs/context/design-system/{styles,foundations,components}/` because the plug-in is markdown + bash + python, not a UI product. User scaffolds ship the full L1 tree.

## Pre-commit checklist

- [ ] No manual version bump in `.claude-plugin/plugin.json` (automated release)
- [ ] README component counts match actual skill counts
- [ ] All new files pass the skill compliance checklist above
- [ ] Markdown lint clean (no broken fences, no unbalanced quotes)
- [ ] No writes to `docs/solutions/` (reserved for other tools)
- [ ] All three sibling manifests (`.claude-plugin`, `.codex-plugin`, `.cursor-plugin`) aligned on name + version + description
