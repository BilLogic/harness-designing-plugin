# design-harness — Plug-in Conventions

Canonical source of truth for this repo. Read natively by Claude Code, Codex CLI, Cursor CLI, Windsurf, GitHub Copilot. Other tools get thin redirects (`CLAUDE.md`, `.cursor/rules/AGENTS.mdc`).

## Philosophy

A design harness is the wrapper of context, skills, orchestration, rubrics, and knowledge built around an AI system so every design task inherits the team's accumulated thinking. This plug-in gives design teams skills to build one. Philosophical cousin to `EveryInc/compound-engineering-plugin`: same move (codify practice so it compounds), different domain (design, not engineering), different organizing frame (five-layer noun stack, not compound loop).

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
│   ├── knowledge/                 # Layer 5 applied to us (lessons + graduations)
│   ├── rubrics/INDEX.md           # Layer 4 pointer
│   └── plans/                     # PRDs + scenario docs
│
├── agents/                        # reusable sub-agents invoked by skills via Task
│   ├── analysis/
│   │   └── graduation-candidate-scorer.md
│   ├── research/
│   │   ├── lesson-retriever.md
│   │   └── article-quote-finder.md
│   ├── review/
│   │   ├── skill-quality-auditor.md
│   │   └── rubric-applicator.md
│   └── workflow/
│       └── harness-health-analyzer.md
│
└── skills/
    ├── hd-onboard/                # LEARN (Q&A)
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
    ├── hd-compound/               # MAINTAIN (capture + graduate)
    │   ├── SKILL.md
    │   ├── references/
    │   └── assets/
    └── hd-review/                 # IMPROVE (audit + critique)
        ├── SKILL.md
        ├── references/
        ├── assets/
        │   └── starter-rubrics/   # a11y, design-system, component-budget,
        │                          # skill-quality, interaction-states
        └── scripts/
            └── budget-check.sh
```

**No `workflows/` folders inside skills.** Procedures live in each SKILL.md; shared procedures that span skills become sub-agents in `agents/<category>/`.

**No `commands/` directory.** Commands are skills with `name: hd:verb` frontmatter, exposed as `/hd:verb` (compound v2.39.0 convention).

## `docs/` is our meta-harness

`docs/context/`, `docs/knowledge/`, `docs/rubrics/` at repo root are the five-layer harness running **on this plug-in itself** (dogfood). Distinct from `skills/hd-setup/assets/context-skeleton/` — which is what `/hd:setup` writes to a **user's** repo. Two different harnesses:

- `docs/` = ours (the plug-in maintainers' harness)
- `skills/hd-setup/assets/` = theirs (what we scaffold for end-users)

## `agents/` is for reusable sub-agents

Each `.md` file under `agents/<category>/` defines a Task-invokable sub-agent: YAML frontmatter (`name`, `description`, optional `color` + `model`) + prose that acts as the sub-agent's system prompt.

Categories mirror compound's convention (with some of ours):
- `analysis/` — deterministic analysis (scoring, clustering)
- `research/` — retrieval + citation finding
- `review/` — rubric application + quality checks
- `workflow/` — procedural helpers that span multiple skills

**Invocation convention from skills:** fully-qualified Task names only. From inside our skills:
```
Task design-harnessing:<category>:<agent-name>(...)
```
From OUR skills to compound's agents:
```
Task compound-engineering:<category>:<agent-name>(...)
```
Never bare names — compound 2.35.0 lesson: bare names get re-prefixed wrong.

**When to create a new agent:** prove ≥2 invocation sites across ≥2 skills, OR a case where an isolated context window measurably improves quality (heavy reads, parallel dispatch). Don't create speculatively.

## Command naming

All commands use `hd:` prefix (two letters — *harness design*; secondary read *high-definition design*).

- `/hd:onboard` — Q&A about the harness concept (LEARN)
- `/hd:setup` — walk the five layers (SETUP)
- `/hd:compound` — capture lessons, graduate to rules (MAINTAIN)
- `/hd:review` — audit harness health, critique work items (IMPROVE)

Never ship bare command names. Always namespaced (compound 2.38.0 rename-pain lesson).

## Coexistence with compound-engineering

Most readers run `compound-engineering` alongside this plug-in. Hard rules:

| Compound's | Ours |
|---|---|
| `/ce:*` commands | `/hd:*` commands |
| `docs/solutions/` | `docs/design-solutions/` (activated v0.5) |
| `compound-engineering.local.md` | `hd-config.md` |
| `ce-*` skill prefix | `hd-*` skill prefix |

Invoke compound agents via fully-qualified Task names: `compound-engineering:review:pattern-recognition-specialist` (compound 2.35.0 fix). Bare names get re-prefixed incorrectly.

## Skill compliance

Full checklist (YAML frontmatter rules, reference-link rules, budgets, writing style, markdown lint, coexistence) lives at [`docs/context/conventions/skill-compliance-checklist.md`](docs/context/conventions/skill-compliance-checklist.md). Read it before committing any skill.

## Semantic split vocabulary

When describing skill components, use these exact verbs:

- **`references/`** = READ (loaded into context on demand)
- **`templates/`** = COPY + FILL (scaffolding files for user's repo)
- **`scripts/`** = EXECUTE (bash/python tools; output consumed, source not loaded)
- **`assets/`** = ASSETS (templates + starters + skeletons; referenced by skill logic)

Per-mode procedures live in `SKILL.md` inline OR in `references/<mode>-procedure.md` files (e.g., `capture-procedure.md`, `audit-procedure.md`). No separate `workflows/` subdirectory — procedures are either the router's body or referenced via progressive disclosure. Shared procedures spanning multiple skills graduate to sub-agents in `agents/<category>/`.

## Skill authoring references

Required reading before authoring any skill:

- Anthropic — [Skill best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
- Anthropic — [Complete Guide to Building Skills for Claude (PDF)](https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf)
- EveryInc — `compound-engineering/skills/create-agent-skills/` (meta-skill; read locally at `~/.claude/plugins/cache/compound-engineering-plugin/compound-engineering/2.42.0/skills/create-agent-skills/`)

## Repo-level contributor rules

- **Plan files** use `YYYY-MM-DD-NNN-slug.md` naming (3-digit daily sequence to prevent collisions, compound 2.37.1 lesson).
- **Lesson files** use `YYYY-MM-DD-slug.md` in `docs/knowledge/lessons/`.
- **Never write to `docs/solutions/`** — that's compound-engineering's namespace. Our equivalent is `docs/design-solutions/` (v0.5+).
- **Cross-plug-in agent invocation** always uses fully-qualified names: `Task compound-engineering:research:learnings-researcher(...)`.

## Graduated rules

Rules that earned their place here via episodic→procedural graduation (see [docs/knowledge/graduations.md](docs/knowledge/graduations.md)). Each entry: `[YYYY-MM-DD] Rule. Source: path/to/lesson.md`.

<!-- Add new graduated rules above this line. -->

- [2026-04-18] When `.agent/` or `.claude/` is detected with ≥1 skill or rule file, `/hd:setup` defaults to: skip L1/L2/L3 prompts and scaffold only L4 (rubrics) and L5 (knowledge). The existing harness is treated as Layer 1+2 authority; hd-* adds Layer 4+5 on top. Source: [docs/knowledge/lessons/2026-04-18-parallel-pilots-3-6-consolidated.md](docs/knowledge/lessons/2026-04-18-parallel-pilots-3-6-consolidated.md) (4 confirmations: plus-marketing, oracle-chat, lightning, plus-uno).
- [2026-04-18] `/hd:setup` is **additive-only** when any existing harness is detected. Never modify `CLAUDE.md`, `AGENTS.md`, `.agent/`, `.claude/`, `docs/context/`, `docs/knowledge/`, `docs/rubrics/`, or compound-engineering artifacts. New files only. Source: [docs/knowledge/lessons/2026-04-18-parallel-pilots-3-6-consolidated.md](docs/knowledge/lessons/2026-04-18-parallel-pilots-3-6-consolidated.md) (6 confirmations across full pilot matrix).
- [2026-04-16] Don't ship future-version skill stubs with `disable-model-invocation: true` at current version. Wait to author the skill when it's being built. Stubs with fake trigger text + the flag make the skill surface actively worse than if it didn't exist. Source: [docs/knowledge/lessons/2026-04-16-no-future-version-stubs.md](docs/knowledge/lessons/2026-04-16-no-future-version-stubs.md)

## Pre-commit checklist

- [ ] No manual version bump in `.claude-plugin/plugin.json` (automated release)
- [ ] README component counts match actual skill counts
- [ ] All new files pass the skill compliance checklist above
- [ ] Markdown lint clean (no broken fences, no unbalanced quotes)
- [ ] No writes to `docs/solutions/` (compound's namespace)
- [ ] All three sibling manifests (`.claude-plugin`, `.codex-plugin`, `.cursor-plugin`) aligned on name + version + description
