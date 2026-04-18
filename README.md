# design-harness

A Claude Code plug-in for design teams building AI harnesses.

**Companion to:** the Substack article series on design harnessing *(link TBD)*.
**Philosophical cousin to:** [EveryInc/compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin) — same move (codify practice so it compounds), different domain (design, not engineering).

## Thesis

You already have a design harness. It's just scattered — across Slack pins, Notion docs, Figma comments, and a decade of design reviews. This plug-in helps you assemble that pile into five layers (**Context**, **Skills**, **Orchestration**, **Rubrics**, **Knowledge**) so every design task inherits your team's accumulated thinking.

## Skills

Four user-facing skills:

| Skill | Verb | Use it to… |
|---|---|---|
| `/hd:onboard` | **learn** | Ask questions about the harness concept. Article-backed Q&A, 10 atomic references, article § citations. |
| `/hd:setup` | **setup** | Walk the five layers in order. At each layer, detect existing harnesses + external tooling and offer per-layer **link / critique / scaffold / skip**. `detect.py` emits schema-v2 JSON covering other-tool harnesses, MCP config, 6-category team tooling, config SoT. |
| `/hd:compound` | **maintain** | Capture lessons; propose graduations from narrative to team rule. **Plan-hash proof-of-consent** for destructive AGENTS.md writes (SHA-256 tamper-detection). |
| `/hd:review` | **improve** | Audit harness health (multi-agent orchestration, parallel/serial auto-switch at 6+); critique work items against team rubrics. **14 starter rubrics shipped** — a11y-wcag-aa, design-system-compliance (with managed-DS pre-fills for antd/chakra/mui/mantine), component-budget, skill-quality, interaction-states, heuristic-evaluation, typography, color-and-contrast, spatial-design, motion-design, ux-writing, responsive-design, telemetry-display (IoT/hardware), i18n-cjk (bilingual/CJK products). Distilled from Impeccable + Nielsen + Material 3 + Fluent 2. |

## Sub-agents

Six reusable sub-agents at plug-in root (`agents/`), invoked from our skills via `Task design-harnessing:<category>:<name>(…)`:

| Category | Agent | What it does |
|---|---|---|
| `analysis/` | `graduation-candidate-scorer` | Clusters lessons, scores grad-readiness (recurrence × clean-imperative × team-agreement) |
| `research/` | `lesson-retriever` | Retrieves past lessons weighted by relevance × recency × importance |
| `research/` | `article-quote-finder` | Verbatim article quotes with § citations |
| `review/` | `skill-quality-auditor` | Applies 9-section skill-quality rubric to any SKILL.md |
| `review/` | `rubric-applicator` | Applies any rubric to any work item |
| `workflow/` | `harness-health-analyzer` | Deep narrative 5-layer health report |

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
│   └── plans/                         ← PRDs + ideation + scenario matrices
│
├── agents/                            # reusable sub-agents (invoked via Task)
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
    ├── hd-onboard/                    ← LEARN — SKILL.md + 10 atomic references
    ├── hd-setup/                      ← SETUP — SKILL.md + 10 references (5 layer + 5 shared) + assets (AGENTS.md template, context/knowledge skeletons, platform-stubs for scattered-mode SSoT consolidation) + scripts (detect.py schema-v2 + detect-mode.sh shim)
    ├── hd-compound/                   ← MAINTAIN — SKILL.md + 3 references (lesson-patterns, graduation-criteria, plan-hash-protocol) + assets (lesson + graduation-entry templates); plan-hash mechanism
    └── hd-review/                     ← IMPROVE — SKILL.md + 5 references + assets (report + critique templates, 14 starter rubrics) + budget-check.sh; <protected_artifacts> declared
```

**No `workflows/` folders inside skills.** Procedures live in each SKILL.md; shared procedures that span skills are sub-agents in `agents/`. Matches compound-engineering's current convention.

## Coexists with compound-engineering

Runs alongside [EveryInc/compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin) without namespace fights. Our `/hd:*` vs their `/ce:*`; our `docs/design-solutions/` vs their `docs/solutions/`; our `hd-config.md` vs their `compound-engineering.local.md`. Our skills invoke compound's agents via fully-qualified Task names (e.g., `Task compound-engineering:research:learnings-researcher(…)`). See [AGENTS.md § Coexistence](./AGENTS.md#coexistence-with-compound-engineering) for full collision-avoidance rules.

## License

MIT — fork, adapt, make it your team's. See [LICENSE](./LICENSE).
