# Harness Designing Plugin

A plug-in for design teams to assemble the AI harness you already have into something that compounds. Ships for [Claude Code](https://claude.com/claude-code), [Codex CLI](https://github.com/openai/codex), and [Cursor](https://cursor.com) from one repo with three sibling manifests.

> *"Tools lower the floor. Taste sets the ceiling. Your harness builds the ladder."*
> — from the companion article

## Thesis

You already have a design harness. It's just scattered — across Slack pins, Notion docs, Figma comments, AGENTS.md rules, and a decade of design reviews. This plug-in assembles that pile into **five layers** every AI-assisted design task inherits:

| Layer | Memory type | What lives here |
|---|---|---|
| **1. Context Engineering** | semantic (+ identity-layer procedural) | Product facts, users, brand voice, design system tokens, conventions — what's always true |
| **2. Skill Curation** | procedural | Repeatable design tasks the agent *does* (research, plan, prototype, review, ship, compound) |
| **3. Workflow Orchestration** | procedural | When to invoke which skill and in what order; handoffs between skills |
| **4. Rubric Setting** | procedural (for evaluation) | How to judge "good" — a11y, typography, interaction, telemetry, i18n, … wired between workflow phases |
| **5. Knowledge Compounding** | episodic | Lessons, decisions, preferences, changelogs, ideations — captured per event, promoted to rules when patterns repeat |

Working memory — the active session — is ephemeral. The five layers control what flows into it each time.

At each layer, four choices: **link** (pointer to source of truth), **critique** (apply a rubric), **scaffold** (seed questions + write files), or **skip**.

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
| [`/hd:learn`](skills/hd-learn/SKILL.md) | Ask questions about the harness concept. 10 atomic references (one per layer + glossary + FAQ + memory-taxonomy). Article § citations when the corpus is configured. No writes. |
| [`/hd:setup`](skills/hd-setup/SKILL.md) | Walk the five layers in order. Phase A runs parallel pre-analysis (detect + 5× harness-auditor + rubric-recommender). Offer per-layer link / critique / scaffold / skip. Write `hd-config.md`. |
| [`/hd:maintain`](skills/hd-maintain/SKILL.md) | Capture lessons (one dated file per event). Promote lessons to rules in AGENTS.md. Destructive rule adoptions require SHA-256 plan-hash proof-of-consent. |
| [`/hd:review`](skills/hd-review/SKILL.md) | `audit` harness health in a 2-batch parallel dispatch; `critique` harness artifacts (SKILL.md, rubric, lesson) against quality rubrics. Not for critiquing design deliverables — that happens outside our scope. |

## Agents

Invoked from skills via `Task design-harnessing:<category>:<name>(…)`.

### `analysis/` (4)

| Agent | Purpose |
|---|---|
| `harness-auditor` | Audit one layer given `layer: 1\|2\|3\|4\|5`. Dispatched 5× parallel by `/hd:review audit` and reused by `/hd:setup` Phase A |
| `rule-candidate-scorer` | Cluster lessons; score rule-readiness on recurrence × clean-imperative × team-agreement |
| `rubric-recommender` | From `detect.py` signals, rank which starter rubrics to scaffold or flag as gaps |
| `coexistence-analyzer` | Detect other-tool artifacts (`.agent/`, `.claude/`, `.codex/`, compound-engineering footprint); flag collision risks |

### `research/` (2)

| Agent | Purpose |
|---|---|
| `lesson-retriever` | Retrieve past lessons weighted by relevance × recency × importance |
| `article-quote-finder` | Verbatim article quotes with § citations; emits graceful empty when corpus not configured |

### `review/` (3)

| Agent | Purpose |
|---|---|
| `skill-quality-auditor` | Apply the 9-section skill-quality rubric to any SKILL.md |
| `rubric-applier` | Forward critique: apply any rubric to any harness artifact |
| `rubric-extractor` | Find implicit rubrics in AGENTS.md, conventions, design reviews; emit candidate rubric YAML |

## Starter rubrics

In [`skills/hd-review/assets/starter-rubrics/`](skills/hd-review/assets/starter-rubrics/). Each carries a `## Scope & Grounding` section (personas + user stories + scenarios + anti-scenarios) and cites its `source:` derivation. Authoring guide at [`skills/hd-review/references/rubric-authoring-guide.md`](skills/hd-review/references/rubric-authoring-guide.md).

Teams copy any starter into `docs/rubrics/<name>.md` and customize. This plug-in scaffolds and maintains the rubric library; running rubrics against actual design work happens in whatever AI tool the team uses.

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
| [`skills/hd-setup/scripts/detect.py`](skills/hd-setup/scripts/detect.py) | Schema-v2 repo scan — layer presence, managed design systems, a11y frameworks, other-tool harnesses, team tooling, MCP servers |
| [`skills/hd-maintain/scripts/compute-plan-hash.sh`](skills/hd-maintain/scripts/compute-plan-hash.sh) | Deterministic canonical-string SHA-256 for rule-adoption consent |
| [`skills/hd-review/scripts/budget-check.sh`](skills/hd-review/scripts/budget-check.sh) | SKILL.md line budgets + Tier 1 combined-context budget |

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

**The article** — Bill Guo's Substack series on design harnessing *(URL TBD)*. The thesis, the five-layer frame, the memory taxonomy, and the core quotables all originate there. This plug-in is the starter kit.

**Plug-in pattern** — [EveryInc/compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin) by [@dhh](https://twitter.com/dhh) and [@kieranklaassen](https://twitter.com/kieranklaassen). The structural model — `plugin.json` + skills as commands + agents as categorized sub-agents + plan-then-work workflow — is lifted directly from their work. Their companion essay, [*Compound Engineering*](https://every.to/guides/compound-engineering), is the lineage we extend into design.

**Harness vocabulary + anatomy** — LangChain: [*Anatomy of an Agent Harness*](https://blog.langchain.com/anatomy-of-an-agent-harness) and [*Your Harness, Your Memory*](https://blog.langchain.com/your-harness-your-memory). The noun "harness," the memory-typology framing, and the ownership argument come from here.

**Context engineering + harness design for long-running apps** — Anthropic: [*Effective Context Engineering for AI Agents*](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents), [*Harness Design for Long-Running Apps*](https://www.anthropic.com/engineering/harness-design-long-running-apps), [*Authoring Skills for Claude*](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices), and the [Complete Guide to Building Skills for Claude](https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf). Attention-budget and progressive-disclosure patterns from these.

**Rubric source material**
- [pbakaus/impeccable](https://github.com/pbakaus/impeccable) by [@paulbakaus](https://twitter.com/paulbakaus) — typography, color-and-contrast, spatial-design, motion-design, ux-writing, responsive-design
- [Nielsen Norman Group](https://www.nngroup.com) — [Nielsen's 10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/) → `heuristic-evaluation`
- [Material Design 3](https://m3.material.io) — Google → `design-system-compliance`, `interaction-states`
- [Fluent 2](https://fluent2.microsoft.design) — Microsoft → `accessibility-wcag-aa`, `ux-writing`

**Adjacent work** — [*Designer's Guide to Context Engineering with AI IDEs*](https://productpower.substack.com/p/the-designers-guide-to-context-engineering) by productpower covers context engineering for designers; this plug-in extends to all five layers.

**Working implementation** — [BilLogic/plus-uno](https://github.com/BilLogic/plus-uno) is the open-source harness built for a rotating 15-designer team; the patterns templated here are distilled from it.

## Known Issues

- **Article corpus URL is TBD.** `article-quote-finder` emits `corpus_status: not-configured` and returns an empty citation set rather than fabricating quotes. Populate `agents/research/article-quote-finder-corpus.md` once the series publishes.
- **User-level MCPs require opt-in.** `detect.py` scans repo-scoped MCP configs by default. Pass `--include-user-mcps` to also scan `~/.claude/mcp.json` and `~/.codex/mcp.json`.
- **Namespace respect, not integration.** If you also run `compound-engineering`, this plug-in stays out of its namespace — our commands are `/hd:*` (not `/ce:*`), we write to `docs/design-solutions/` (not `docs/solutions/`), our config is `hd-config.md` (not `compound-engineering.local.md`), and our `<protected_artifacts>` block tells `/ce:review` to leave our outputs alone. We don't call into compound's skills or agents.

## Version History

See [CHANGELOG.md](./CHANGELOG.md). Phases 3e–3i shipped 2026-04-18; validated across a 6-repo pilot matrix (sds, plus-marketing-website, caricature, oracle-chat, lightning, plus-uno).

## License

MIT — see [LICENSE](./LICENSE).
