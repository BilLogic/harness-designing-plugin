# design-harness — Plug-in Conventions

Canonical source of truth for this repo. Read natively by Claude Code, Codex CLI, Cursor CLI, Windsurf, GitHub Copilot. Other tools get thin redirects (`CLAUDE.md`, `.cursor/rules/AGENTS.mdc`).

## Philosophy

A design harness is the wrapper of context, skills, orchestration, rubrics, and knowledge built around an AI system so every design task inherits the team's accumulated thinking. This plug-in gives design teams skills to build one. Organizing frame: a five-layer noun stack (Context, Skills, Orchestration, Rubrics, Knowledge) — codify practice so it compounds.

## Repo layout

This repo is flat — the plug-in payload IS the repo root (no `plugins/<name>/` nesting since we ship one plug-in).

```
.
├── .claude-plugin/plugin.json     # Claude Code marketplace
├── .codex-plugin/plugin.json      # Codex CLI directory
├── .cursor-plugin/plugin.json     # Cursor marketplace
├── .cursor/rules/AGENTS.mdc       # Cursor IDE redirect → AGENTS.md
├── AGENTS.md                      # this file
├── CLAUDE.md                      # @AGENTS.md (1 line)
├── CHANGELOG.md
├── LICENSE                        # MIT
├── README.md
│
├── docs/                          # meta-harness for THIS plug-in
│   ├── context/                   # Layer 1 applied to us
│   ├── knowledge/                 # Layer 5 applied to us (lessons + rule adoptions)
│   ├── rubrics/INDEX.md           # Layer 4 pointer
│   └── plans/                     # PRDs + scenario docs
│
├── agents/                           # reusable sub-agents invoked by skills via Task
│   ├── analysis/
│   │   ├── harness-auditor.md         # layer-parameterized 5-way parallel
│   │   ├── rule-candidate-scorer.md   # cluster lessons, score rule-readiness
│   │   ├── rubric-recommender.md      # rank which starters to scaffold
│   │   └── coexistence-analyzer.md    # detect other-tool harness signals
│   ├── research/
│   │   ├── lesson-retriever.md        # past-lessons ranking
│   │   └── article-quote-finder.md    # + article-quote-finder-corpus.md (data ref, not an agent)
│   └── review/
│       ├── skill-quality-auditor.md   # 9-section rubric on any SKILL.md
│       ├── rubric-applier.md          # forward review (apply-mode)
│       └── rubric-extractor.md        # reverse extract (find implicit rubrics)
│
└── skills/
    ├── hd-learn/                # LEARN (Q&A)
    │   ├── SKILL.md
    │   └── references/            # 10 atomic concept files
    ├── hd-setup/                  # SETUP (walk the five layers)
    │   ├── SKILL.md
    │   ├── references/
    │   ├── assets/
    │   │   └── platform-stubs/    # per-IDE thin redirect stubs
    │   └── scripts/
    │       ├── detect.py
    │       └── detect-mode.sh
    ├── hd-maintain/               # MAINTAIN (capture + graduate)
    │   ├── SKILL.md
    │   ├── references/
    │   └── assets/
    └── hd-review/                 # IMPROVE (full + targeted review)
        ├── SKILL.md
        ├── references/
        ├── assets/
        │   └── starter-rubrics/   # a11y, design-system, component-budget,
        │                          # skill-quality, interaction-states
        └── scripts/
            └── budget-check.sh
```

**No `workflows/` folders inside skills.** Procedures live in each SKILL.md; shared procedures that span skills become sub-agents in `agents/<category>/`.

**No `commands/` directory.** Commands are skills with `name: hd:verb` frontmatter, exposed as `/hd:verb`.

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
