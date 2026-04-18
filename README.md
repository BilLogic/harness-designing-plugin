# Harness Designing Plugin

A plug-in for design teams to assemble the AI harness you already have into something that compounds. Ships for [Claude Code](https://claude.com/claude-code), [Codex CLI](https://github.com/openai/codex), and [Cursor](https://cursor.com) from one repo with three sibling manifests.

## Thesis

You already have a design harness. It's just scattered — across Slack pins, Notion docs, Figma comments, AGENTS.md rules, and a decade of design reviews. This plug-in assembles that pile into **five layers** every AI-assisted design task inherits:

| Layer | Memory type | What lives here |
|---|---|---|
| **1. Context** | semantic | Product, users, brand voice, design system tokens — what's always true |
| **2. Skills** | procedural | Repeatable design tasks (prototype a screen, write a component, audit a11y) |
| **3. Orchestration** | procedural-of-procedures | When to invoke which skill, and in what order |
| **4. Rubrics** | semantic checks | How to judge quality — a11y, typography, interaction, telemetry, i18n, … |
| **5. Knowledge** | episodic + temporal + speculative + semantic-taste + procedural-chosen | Lessons, decisions, preferences, changelogs, ideations |

Per layer, four choices: **link** (pointer to source of truth), **critique** (apply a rubric), **scaffold** (seed questions + write files), or **skip**.

## Components

| Component | Count |
|---|---|
| Skills | 4 |
| Agents | 9 |
| Starter rubrics | 14 |
| Scripts | 3 |

## Commands

| Command | Use it to… |
|---|---|
| [`/hd:learn`](skills/hd-learn/SKILL.md) | Ask questions about the harness concept. 10 atomic references (one per layer + glossary + FAQ + coexistence + memory-taxonomy). Article § citations when the corpus is configured. No writes. |
| [`/hd:setup`](skills/hd-setup/SKILL.md) | Walk the five layers in order. Phase A runs parallel pre-analysis (detect + harness-auditor + coexistence-analyzer + rubric-recommender). Offer per-layer link / critique / scaffold / skip. Write `hd-config.md`. |
| [`/hd:maintain`](skills/hd-maintain/SKILL.md) | Capture lessons (one dated file per event). Propose rules from lessons to AGENTS.md. Destructive rule adoptions require SHA-256 plan-hash proof-of-consent. |
| [`/hd:review`](skills/hd-review/SKILL.md) | `audit` harness health in a 2-batch dispatch (preflight + deep); `critique` work items against rubrics. `<protected_artifacts>` declared so `/ce:review` never flags our outputs. |

## Agents

Invoked from skills via `Task design-harnessing:<category>:<name>(…)`.

### `analysis/` (4)

| Agent | Purpose |
|---|---|
| `harness-auditor` | 5-layer health narrative; full mode or quick preflight |
| `rule-candidate-scorer` | Cluster lessons; score rule-readiness on recurrence × clean-imperative × team-agreement |
| `rubric-recommender` | Propose which starter rubrics to seed given repo signals |
| `coexistence-analyzer` | Detect compound-engineering artifacts and namespace collisions |

### `research/` (2)

| Agent | Purpose |
|---|---|
| `lesson-retriever` | Retrieve past lessons weighted by relevance × recency × importance |
| `article-quote-finder` | Verbatim article quotes with § citations; graceful empty when corpus not configured |

### `review/` (3)

| Agent | Purpose |
|---|---|
| `skill-quality-auditor` | Apply the 9-section skill-quality rubric to any SKILL.md |
| `rubric-applier` | Forward critique: apply any rubric to any work item |
| `rubric-extractor` | Find implicit rubrics in AGENTS.md, docs, design reviews; emit candidate rubric YAML |

## Starter rubrics

In [`skills/hd-review/assets/starter-rubrics/`](skills/hd-review/assets/starter-rubrics/). Each carries a `## Scope & Grounding` section (personas + user stories + scenarios + anti-scenarios) and cites its `source:` derivation. Authoring guide at [`skills/hd-review/references/rubric-authoring-guide.md`](skills/hd-review/references/rubric-authoring-guide.md). Derived from [pbakaus/impeccable](https://github.com/pbakaus/impeccable), Nielsen's 10 heuristics, [Material Design 3](https://m3.material.io), and [Fluent 2](https://fluent2.microsoft.design).

### Quality & craft

| Rubric | Covers |
|---|---|
| `accessibility-wcag-aa` | WCAG 2.1 AA conformance |
| `design-system-compliance` | Token/component adherence; pre-fills for antd / chakra-ui / mui / mantine |
| `component-budget` | Per-surface component-count ceilings |
| `skill-quality` | 9-section SKILL.md rubric |
| `interaction-states` | Default / hover / active / focus / disabled / loading / error |
| `heuristic-evaluation` | Nielsen's 10 |

### Visual & sensory

| Rubric | Covers |
|---|---|
| `typography` | Scale, hierarchy, line-length, rhythm |
| `color-and-contrast` | Contrast ratios, semantic color use |
| `spatial-design` | Spacing scale, density, alignment |
| `motion-design` | Duration, easing, purpose, reduced-motion |

### Communication & shape

| Rubric | Covers |
|---|---|
| `ux-writing` | Voice, clarity, actionability |
| `responsive-design` | Breakpoints, fluid scaling, touch targets |

### Domain-specific

| Rubric | Covers |
|---|---|
| `telemetry-display` | IoT / hardware / real-time dashboards |
| `i18n-cjk` | Bilingual and CJK products |

## Scripts

| Script | Purpose |
|---|---|
| [`skills/hd-setup/scripts/detect.py`](skills/hd-setup/scripts/detect.py) | Schema-v2 repo scan — layer presence, managed design systems, a11y frameworks, other-tool harnesses, compound coexistence, team tooling, MCP servers |
| [`skills/hd-maintain/scripts/compute-plan-hash.sh`](skills/hd-maintain/scripts/compute-plan-hash.sh) | Deterministic canonical-string SHA-256 for rule-adoption consent |
| [`skills/hd-review/scripts/budget-check.sh`](skills/hd-review/scripts/budget-check.sh) | SKILL.md line budgets + Tier 1 combined-context budget |

## Coexistence with compound-engineering

Runs alongside [EveryInc/compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin) without namespace collisions. Our skills invoke compound's agents via fully-qualified Task names (`Task compound-engineering:research:learnings-researcher(…)`).

| Compound's | Ours |
|---|---|
| `/ce:*` commands | `/hd:*` commands |
| `docs/solutions/` | `docs/design-solutions/` (v0.5+) |
| `compound-engineering.local.md` | `hd-config.md` |
| `ce-*` skill prefix | `hd-*` skill prefix |

## Installation

```bash
claude /plugin install harness-designing
```

Local dev:

```bash
git clone https://github.com/BilLogic/harness-designing-plugin ~/plugins/harness-designing
claude --plugin-dir ~/plugins/harness-designing
```

Codex CLI and Cursor equivalents ship from the same repo via `.codex-plugin/` and `.cursor-plugin/` sibling manifests.

## Credits

**Article** — Bill Guo's Substack series on design harnessing *(URL TBD)*.

**Plugin architecture inspiration** — [EveryInc/compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin) by [@dhh](https://twitter.com/dhh) and [@kieranklaassen](https://twitter.com/kieranklaassen). Same move (codify practice so it compounds), different domain.

**Rubric source material**
- [pbakaus/impeccable](https://github.com/pbakaus/impeccable) by [@paulbakaus](https://twitter.com/paulbakaus)
- [Nielsen Norman Group](https://www.nngroup.com) — [Nielsen's 10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/)
- [Material Design 3](https://m3.material.io) — Google
- [Fluent 2](https://fluent2.microsoft.design) — Microsoft

**Skill-authoring guidance** — Anthropic's [Skill best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices) and [Complete Guide to Building Skills for Claude](https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf).

## Known Issues

- **Article corpus URL is TBD.** `article-quote-finder` emits `corpus_status: not-configured` and returns an empty citation set rather than fabricating quotes. Set the corpus path in `agents/research/article-quote-finder-corpus.md` once the article series publishes.
- **User-level MCPs require opt-in.** `detect.py` scans repo-scoped MCP configs by default. Pass `--include-user-mcps` to also scan `~/.claude/mcp.json` and `~/.codex/mcp.json`.

## Version History

See [CHANGELOG.md](./CHANGELOG.md). Phases 3e–3i shipped 2026-04-18; validated across a 6-repo pilot matrix (sds, plus-marketing-website, caricature, oracle-chat, lightning, plus-uno).

## License

MIT — see [LICENSE](./LICENSE).
