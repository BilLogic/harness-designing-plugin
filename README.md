# design-harness

A Claude Code plug-in for design teams building AI harnesses.

**Companion to:** the Substack article series on design harnessing *(link TBD)*.
**Philosophical cousin to:** [EveryInc/compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin) — same move (codify practice so it compounds), different domain (design, not engineering).

## Thesis

You already have a design harness. It's just scattered — across Slack pins, Notion docs, Figma comments, and a decade of design reviews. This plug-in helps you assemble that pile into five layers (**Context**, **Skills**, **Orchestration**, **Rubrics**, **Knowledge**) so every design task inherits your team's accumulated thinking.

## Skills

Four skills, full-release at v1.0.0:

| Skill | Verb | Use it to… |
|---|---|---|
| `/hd:onboard` | **learn** | Ask questions about the harness concept. Article-backed Q&A, 10 atomic references, article § citations. |
| `/hd:setup` | **setup** | Scaffold or reorganize your harness. Adaptive across greenfield / scattered / advanced repos. `detect-mode.sh` emits deterministic mode JSON. |
| `/hd:compound` | **maintain** | Capture lessons; propose graduations from narrative to team rule. **Plan-hash proof-of-consent** for destructive AGENTS.md writes (SHA-256 tamper-detection). |
| `/hd:review` | **improve** | Audit harness health (multi-agent orchestration, parallel/serial auto-switch at 6+); critique work items against team rubrics (WCAG, design-system, component-budget, **skill-quality** starters — the last being a 9-point Layer 2 health check applied to every `skills/*/SKILL.md` during audit). |

## Install

### Local dev — `git clone`

```bash
git clone https://github.com/BilLogic/design-harnessing-plugin ~/path/to/design-harness
# Then point Claude Code at the repo directory:
#   claude --plugin-dir ~/path/to/design-harness
```

### Marketplaces *(pending first publication)*

```bash
# Claude Code marketplace
/plugin marketplace add BilLogic/design-harnessing-plugin
/plugin install design-harness
```

Also submitted to Codex CLI directory and Cursor marketplace — all three sibling manifests (`.claude-plugin/`, `.codex-plugin/`, `.cursor-plugin/`) ship from this same repo.

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
    ├── hd-onboard/                    ← LEARN — SKILL.md + 10 atomic reference files
    ├── hd-setup/                      ← SETUP — SKILL.md + 9 refs + 3 workflows + 9 templates + detect-mode.sh
    ├── hd-compound/                   ← MAINTAIN — SKILL.md + 3 refs + 3 workflows + 2 templates; plan-hash mechanism
    └── hd-review/                     ← IMPROVE — SKILL.md + 5 refs + 3 workflows + 2 templates + 4 starter rubrics + budget-check.sh; <protected_artifacts> declared
```

## Coexists with compound-engineering

Runs alongside [EveryInc/compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin) without namespace fights. Our `/hd:*` vs their `/ce:*`; our `docs/design-solutions/` (v0.5+) vs their `docs/solutions/`; our `design-harnessing.local.md` vs their `compound-engineering.local.md`. See [AGENTS.md § Coexistence](./AGENTS.md#coexistence-with-compound-engineering) for full collision-avoidance rules.

## License

MIT — fork, adapt, make it your team's. See [LICENSE](./LICENSE).
