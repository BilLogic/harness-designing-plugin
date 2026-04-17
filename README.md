# design-harness

A Claude Code plug-in for design teams building AI harnesses.

**Companion to:** the Substack article series on design harnessing *(link TBD)*.
**Philosophical cousin to:** [EveryInc/compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin) — same move (codify practice so it compounds), different domain (design, not engineering).

## Thesis

You already have a design harness. It's just scattered — across Slack pins, Notion docs, Figma comments, and a decade of design reviews. This plug-in helps you assemble that pile into five layers (**Context**, **Skills**, **Orchestration**, **Rubrics**, **Knowledge**) so every design task inherits your team's accumulated thinking.

## Skills

All four skills are code-complete in the repo. Marketplace release phases align with Substack article cadence:

| Skill | Verb | Use it to… | Ships |
|---|---|---|---|
| `/hd:onboard` | learn | Ask questions about the harness concept. Article-backed Q&A, 10 atomic references, article § citations. | **v0.MVP** (article #1) |
| `/hd:setup` | setup | Scaffold or reorganize your harness. Adaptive across greenfield / scattered / advanced repos. `detect-mode.sh` emits deterministic mode JSON. | **v0.MVP** (article #1) |
| `/hd:compound` | maintain | Capture lessons; propose graduations from narrative to team rule. **Plan-hash proof-of-consent** for the destructive AGENTS.md write (SHA-256 tamper-detection). | v0.5 (article #3) |
| `/hd:review` | improve | Audit your harness health (multi-agent orchestration, parallel/serial auto-switch at 6+); critique work items against team rubrics (WCAG, design-system, component-budget starters). | v1 (article #5) |

## Install

### v0.MVP — `git clone`

```bash
git clone https://github.com/BilLogic/design-harnessing-plugin ~/path/to/design-harness
# Then point Claude Code at the repo directory:
#   claude --plugin-dir ~/path/to/design-harness
```

### v1+ — marketplace *(coming soon)*

```bash
# Claude Code marketplace
/plugin marketplace add BilLogic/design-harnessing-plugin
/plugin install design-harness

# Codex CLI submission planned at v0.5
# Cursor marketplace submission at v1
```

## File tree

Annotated — the five-layer framework you're building with this plug-in is visible in the plug-in's own `docs/` (we dogfood the advocacy).

```
design-harness/                        ← this repo IS the plug-in payload (flat)
├── .claude-plugin/plugin.json         # Claude Code manifest
├── .codex-plugin/plugin.json          # Codex CLI manifest
├── .cursor-plugin/plugin.json         # Cursor manifest
├── .cursor/rules/AGENTS.mdc           # Cursor IDE redirect
│
├── AGENTS.md                          # conventions; read natively by Claude/Codex/Cursor/Windsurf/Copilot
├── CLAUDE.md                          # @AGENTS.md (1 line)
├── CHANGELOG.md  LICENSE  README.md
│
├── docs/                              # meta-harness — we run the five-layer pattern on ourselves
│   ├── context/                       ← Layer 1: how AI behaves when working on this plug-in
│   ├── knowledge/lessons/             ← Layer 5: what we've learned building it
│   ├── rubrics/INDEX.md               ← Layer 4: pointer (distributed pattern)
│   └── plans/                         ← PRDs + scenario matrices
│
└── skills/
    ├── hd-onboard/                    ← LEARN (v0.MVP) — SKILL.md + 10 atomic reference files
    ├── hd-setup/                      ← SETUP (v0.MVP) — SKILL.md + 9 refs + 3 workflows + 9 templates + detect-mode.sh
    ├── hd-compound/                   ← MAINTAIN (v0.5) — SKILL.md + 3 refs + 3 workflows + 2 templates; plan-hash mechanism
    └── hd-review/                     ← IMPROVE (v1) — SKILL.md + 5 refs + 3 workflows + 2 templates + 3 starter rubrics + budget-check.sh; <protected_artifacts> declared
```

## Coexists with compound-engineering

Runs alongside [EveryInc/compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin) without namespace fights. Our `/hd:*` vs their `/ce:*`; our `docs/design-solutions/` (v0.5+) vs their `docs/solutions/`; our `design-harnessing.local.md` vs their `compound-engineering.local.md`. See [AGENTS.md § Coexistence](./AGENTS.md#coexistence-with-compound-engineering) for full collision-avoidance rules.

## License

MIT — fork, adapt, make it your team's. See [LICENSE](./LICENSE).
