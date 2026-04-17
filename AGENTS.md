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
├── docs/                          # meta-harness for THIS plug-in + plans
│   ├── context/                   # Layer 1 for this project
│   ├── knowledge/                 # Layer 5 for this project (lessons + graduations)
│   ├── rubrics/INDEX.md           # Layer 4 pointer
│   └── plans/                     # PRDs + scenario docs
└── skills/
    ├── hd-onboard/                # v0.MVP — LEARN (Q&A)
    └── hd-setup/                  # v0.MVP — SETUP (scaffold)
```

**v0.MVP ships 2 skills.** v0.5 adds `hd-compound` (maintain); v1 adds `hd-review` (improve). Not-yet-shipped skills do NOT exist on disk — no stubs.

**No `commands/` directory.** Commands are skills with `name: hd:verb` frontmatter, exposed as `/hd:verb` (compound v2.39.0 convention).

## `docs/` is our meta-harness

`docs/context/`, `docs/knowledge/`, `docs/rubrics/` at repo root are the five-layer harness running **on this plug-in itself** (dogfood). Distinct from `skills/hd-setup/templates/context-skeleton/` — which is what `/hd:setup` writes to a **user's** repo. Two different harnesses:

- `docs/` = ours (the plug-in maintainers' harness)
- `skills/hd-setup/templates/` = theirs (what we scaffold for end-users)

## Command naming

All commands use `hd:` prefix (two letters — *harness design*; secondary read *high-definition design*).

- `/hd:onboard` — Q&A about the harness concept (learn; v0.MVP)
- `/hd:setup` — scaffold or reorganize your harness (setup; v0.MVP)
- `/hd:compound` — capture lessons, graduate to rules (maintain; v0.5)
- `/hd:review` — audit your harness + critique work (improve; v1)

Never ship bare command names. Always namespaced (compound 2.38.0 rename-pain lesson).

## Coexistence with compound-engineering

Most readers run `compound-engineering` alongside this plug-in. Hard rules:

| Compound's | Ours |
|---|---|
| `/ce:*` commands | `/hd:*` commands |
| `docs/solutions/` | `docs/design-solutions/` (activated v0.5) |
| `compound-engineering.local.md` | `design-harnessing.local.md` |
| `ce-*` skill prefix | `hd-*` skill prefix |

Invoke compound agents via fully-qualified Task names: `compound-engineering:review:pattern-recognition-specialist` (compound 2.35.0 fix). Bare names get re-prefixed incorrectly.

## Skill compliance checklist

Verify before committing any skill:

### YAML frontmatter (required)

- [ ] `name:` matches directory name; `hd:verb` form for slash-command skills
- [ ] `description:` present; **what + when** format; third person; ≤ 180 chars preferred (≤ 1024 hard)
- [ ] `argument-hint:` (if present) quotes YAML special chars (compound 2.36.0 fix)
- [ ] `disable-model-invocation: true` ONLY if genuinely manual-only (default: omit)

### Reference links (required if `references/` exists)

- [ ] Linked as `[filename.md](references/filename.md)` — never bare backticks
- [ ] One level deep only (no `references/foo/bar.md`)
- [ ] Linked contextually where topics arise (not in a closing dump)

### Structure budget

- [ ] SKILL.md body ≤ 200 lines for routers (≤ 500 hard Anthropic limit)
- [ ] Overflow content → `references/`
- [ ] Scripts invoked by path, not markdown-linked

### Writing style (Anthropic best practices)

- [ ] Imperative/infinitive form (verb-first): "Scan the repo" not "You should scan"
- [ ] Third-person descriptions
- [ ] Concise — assume Claude already knows common concepts
- [ ] No time-sensitive statements ("as of 2026…"); use "old patterns" section instead
- [ ] Consistent terminology throughout (one term per concept)

### Markdown lint

- [ ] No unclosed code fences
- [ ] No unbalanced quotes
- [ ] Forward slashes only (no Windows paths)

### Coexistence

- [ ] Skill does NOT write to `docs/solutions/` (compound's namespace)
- [ ] Skill does NOT read `compound-engineering.local.md` as its config
- [ ] No "rivalry" language in output (no vs./conflict/incompatible with compound)
- [ ] Cross-plug-in Task calls use fully-qualified names

## Semantic split vocabulary

When describing skill components, use these exact verbs:

- **`references/`** = READ (loaded into context on demand)
- **`workflows/`** = FOLLOW (step-by-step procedures)
- **`templates/`** = COPY + FILL (scaffolding files for user's repo)
- **`scripts/`** = EXECUTE (bash/python tools; output consumed, source not loaded)

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

- [2026-04-16] Don't ship future-version skill stubs with `disable-model-invocation: true` at current version. Wait to author the skill when it's being built. Stubs with fake trigger text + the flag make the skill surface actively worse than if it didn't exist. Source: [docs/knowledge/lessons/2026-04-16-no-future-version-stubs.md](docs/knowledge/lessons/2026-04-16-no-future-version-stubs.md)

## Pre-commit checklist

- [ ] No manual version bump in `.claude-plugin/plugin.json` (automated release)
- [ ] README component counts match actual skill counts
- [ ] All new files pass the skill compliance checklist above
- [ ] Markdown lint clean (no broken fences, no unbalanced quotes)
- [ ] No writes to `docs/solutions/` (compound's namespace)
- [ ] All three sibling manifests (`.claude-plugin`, `.codex-plugin`, `.cursor-plugin`) aligned on name + version + description
