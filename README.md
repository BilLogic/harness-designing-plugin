# Harness Designing Plugin

A plug-in for design teams to assemble the AI harness you already have into something that compounds. Ships for [Claude Code](https://claude.com/claude-code), [Codex CLI](https://github.com/openai/codex), and [Cursor](https://cursor.com) from one repo with three sibling manifests.

> *"Tools lower the floor. Taste sets the ceiling. Your harness builds the ladder."*
>—from the companion article

## Thesis

You already have a design harness. It's just scattered—across Slack pins, Notion docs, Figma comments, AGENTS.md rules, and a decade of design reviews. This plug-in assembles that pile into **five layers** every AI-assisted design task inherits:

| Layer | Memory type | What lives here |
|---|---|---|
| **1. Context Engineering** | semantic | Product facts, users, brand voice, design system tokens, conventions—what's always true |
| **2. Skill Curation** | procedural | Repeatable design tasks the agent *does* (research, plan, prototype, review, ship, compound) |
| **3. Workflow Orchestration** | procedural | When to invoke which skill and in what order; handoffs between skills |
| **4. Rubric Setting** | procedural (for evaluation) | How to judge "good"—a11y, typography, interaction, telemetry, i18n, … wired between workflow phases |
| **5. Knowledge Compounding** | episodic | Lessons, decisions, preferences, changelogs, ideations—captured per event, promoted to rules when patterns repeat |

Working memory—the active session—is ephemeral. The five layers control what flows into it each time.

At each layer, four choices: **link** (pointer to source of truth), **review** (apply a rubric + surface improvement suggestions), **scaffold** (seed questions + write files), or **skip**.

## Components

| Component | Count |
|---|---|
| Skills | 4 |
| Agents | 9 |
| Starter rubrics | 14 |
| Scripts | 4 |

## Commands

| Command | Use it to… |
|---|---|
| [`/hd:learn`](skills/hd-learn/SKILL.md) | Ask questions about the harness concept. 10 atomic references (one per layer + glossary + FAQ + memory-taxonomy). Article § citations when the corpus is configured. No writes. |
| [`/hd:setup`](skills/hd-setup/SKILL.md) | Walk the five layers in order. Phase A runs parallel pre-analysis (detect + 5× harness-auditor + rubric-recommender). Offer per-layer link / review / scaffold / skip. Write `hd-config.md`. |
| [`/hd:maintain`](skills/hd-maintain/SKILL.md) | Capture lessons (one dated file per event). Promote lessons to rules in AGENTS.md. Destructive rule adoptions require SHA-256 plan-hash proof-of-consent. |
| [`/hd:review`](skills/hd-review/SKILL.md) | Full review across all 5 layers (parallel dispatch when host supports it) OR targeted review of one layer / file / rubric. Writes full report to `docs/knowledge/reviews/<date>-harness-review.md`; emits chat summary with ASCII health bars + priorities table + `Proposed revision` file-tree diff + Staleness check (comparing against any prior review). Pair with `/hd:setup --from-review <path>` to apply findings as concrete writes. Not for reviewing design deliverables—that happens outside our scope. |

## Agents

Invoked from skills via `Task design-harnessing:<category>:<name>(…)`.

### `analysis/` (4)

| Agent | Purpose |
|---|---|
| `harness-auditor` | Review one layer given `layer: 1\|2\|3\|4\|5`. Dispatched 5× parallel by `/hd:review` (full) and reused by `/hd:setup` Phase A |
| `rule-candidate-scorer` | Cluster lessons; score rule-readiness on recurrence × clean-imperative × team-agreement |
| `rubric-recommender` | From `detect.py` signals, rank which starter rubrics to scaffold or flag as gaps |
| `coexistence-analyzer` | Detect other-tool harness artifacts (`.agent/`, `.claude/`, `.codex/`, foreign plug-in footprints); flag collision risks |

### `research/` (2)

| Agent | Purpose |
|---|---|
| `lesson-retriever` | Retrieve past lessons weighted by relevance × recency × importance |
| `article-quote-finder` | Verbatim article quotes with § citations; emits graceful empty when corpus not configured |

### `review/` (3)

| Agent | Purpose |
|---|---|
| `skill-quality-auditor` | Apply the 9-section skill-quality rubric to any SKILL.md |
| `rubric-applier` | Forward review: apply any rubric to any harness artifact |
| `rubric-extractor` | Find implicit rubrics in AGENTS.md, conventions, design reviews; emit candidate rubric YAML |

## Starter rubrics

In [`skills/hd-review/assets/starter-rubrics/`](skills/hd-review/assets/starter-rubrics/). Each carries a `## Scope & Grounding` section (personas + user stories + scenarios + anti-scenarios) and cites its `source:` derivation. Authoring guide at [`skills/hd-review/references/rubric-authoring-guide.md`](skills/hd-review/references/rubric-authoring-guide.md).

Teams copy any starter into `docs/rubrics/<name>.md` and customize. This plug-in scaffolds and maintains the rubric library; running rubrics against actual design work happens in whatever AI tool the team uses.

### Quality and craft

| Rubric | Covers |
|---|---|
| `accessibility-wcag-aa` | WCAG 2.1 AA conformance |
| `design-system-compliance` | Token/component adherence; pre-fills for antd / chakra-ui / mui / mantine |
| `component-budget` | Per-surface component-count ceilings |
| `skill-quality` | 9-section SKILL.md rubric |
| `interaction-states` | Default / hover / active / focus / disabled / loading / error |
| `heuristic-evaluation` | Nielsen's 10 |

### Visual and sensory

| Rubric | Covers |
|---|---|
| `typography` | Scale, hierarchy, line-length, rhythm |
| `color-and-contrast` | Contrast ratios, semantic color use |
| `spatial-design` | Spacing scale, density, alignment |
| `motion-design` | Duration, easing, purpose, reduced-motion |

### Communication and shape

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
| [`skills/hd-setup/scripts/detect.py`](skills/hd-setup/scripts/detect.py) | Schema-v4 repo scan—layer presence + scattered-layer detection, managed design systems, a11y frameworks, other-tool harnesses (`.agent/`, `.agents/`, `.claude/`, `.codex/`, `.cursor/skills/`, `.windsurf/`, `.roo/`), team tooling, MCP servers |
| [`skills/hd-setup/scripts/detect-mode.sh`](skills/hd-setup/scripts/detect-mode.sh) | Bash shim fallback for `detect.py` when python3 unavailable |
| [`skills/hd-maintain/scripts/compute-plan-hash.sh`](skills/hd-maintain/scripts/compute-plan-hash.sh) | Deterministic canonical-string SHA-256 for rule-adoption consent |
| [`skills/hd-review/scripts/budget-check.sh`](skills/hd-review/scripts/budget-check.sh) | SKILL.md line budgets + always-loaded combined-context budget |

## Installation

> **Status—beta testing.** Submitted to Anthropic's plug-in directory and Cursor's marketplace on 2026-04-18; both pending review. Once approved, one-line installs land via the official UI. Until then, use the per-host instructions below—they work today.

The plug-in ships three sibling manifests from one repo (`.claude-plugin/`, `.codex-plugin/`, `.cursor-plugin/`)—same skills, agents, scripts. Two install patterns per host: **copy-paste a natural-language prompt** and let your AI do the setup (recommended—handles different home dirs, shells, skill-dir conventions for you), or run the exact commands yourself.

### Claude Code

**Paste this into Claude Code:**

```
Install the Harness Designing Plugin from https://github.com/BilLogic/harness-designing-plugin
using the self-hosted marketplace. Run these in order:
  /plugin marketplace add BilLogic/harness-designing-plugin
  /plugin install design-harness
Then list my available skills so I can confirm hd:learn, hd:setup,
hd:maintain, and hd:review appear.
```

<details>
<summary>Or run the commands directly</summary>

```
/plugin marketplace add BilLogic/harness-designing-plugin
/plugin install design-harness
```

</details>

<details>
<summary>Alternative—clone + --plugin-dir (for inspecting / forking)</summary>

```bash
git clone https://github.com/BilLogic/harness-designing-plugin ~/plugins/harness-designing
claude --plugin-dir ~/plugins/harness-designing
```

</details>

### Codex CLI

**Paste this into Codex:**

```
Install the Harness Designing Plugin from
https://github.com/BilLogic/harness-designing-plugin into my Codex CLI:

1. Clone the repo to a stable location (e.g. ~/.codex/harness-designing-plugin
   or wherever Codex expects externally-cloned plugins on my machine)
2. Register its skills/ directory so hd-learn, hd-setup, hd-maintain, and
   hd-review appear alongside my existing skills (use whichever mechanism
   my Codex version supports—symlink into ~/.codex/skills/, or the Codex
   plugin-registration API, or a config entry)
3. Tell me what to restart / reload so the skills activate
4. List my skills after restart to confirm the four hd-* skills loaded
```

<details>
<summary>Or run the commands directly</summary>

```bash
git clone https://github.com/BilLogic/harness-designing-plugin ~/.codex/harness-designing-plugin
mkdir -p ~/.codex/skills
ln -sf ~/.codex/harness-designing-plugin/skills ~/.codex/skills/design-harness
# Then restart Codex
```

Update: `cd ~/.codex/harness-designing-plugin && git pull`

</details>

### Cursor (IDE + CLI)

**Paste this into Cursor:**

```
Install the Harness Designing Plugin from
https://github.com/BilLogic/harness-designing-plugin into my Cursor setup:

1. Clone the repo to a stable location (e.g. ~/cursor-plugins/harness-designing
   or wherever Cursor expects externally-cloned plugins on my machine)
2. Register its skills/ directory so the hd-* skills appear alongside my
   existing skills (typically via ~/.cursor/skills/ or your current
   skill-loading mechanism—pick what works for my Cursor version)
3. Tell me what to restart / reload
4. Note: if I'm on Cursor CLI rather than the IDE, /hd:review will run
   inline serial because the CLI doesn't expose the Task tool—same
   output, just ~1–2 min wall time instead of ~30s
```

<details>
<summary>Or run the commands directly</summary>

```bash
git clone https://github.com/BilLogic/harness-designing-plugin ~/cursor-plugins/harness-designing
mkdir -p ~/.cursor/skills
ln -sf ~/cursor-plugins/harness-designing/skills ~/.cursor/skills/design-harness
# Then restart Cursor
```

</details>

### Windsurf / plain terminal / any other host

**Paste this into your AI:**

```
Install the Harness Designing Plugin from
https://github.com/BilLogic/harness-designing-plugin on my current host:

1. Clone the repo to a stable location on my machine
2. Set up whatever pointer / env var / config entry my host needs so its
   skill-loader or agent-loader can find the SKILL.md files under skills/
3. If my host has no skill-loader, just confirm the clone location so
   I can invoke scripts directly (e.g. the detect.py and budget-check.sh
   from skills/hd-*/scripts/)
4. Tell me how to restart / reload so the skills activate
```

<details>
<summary>Or run the commands directly</summary>

```bash
git clone https://github.com/BilLogic/harness-designing-plugin ~/harness-designing
export DESIGN_HARNESS=~/harness-designing

# Direct script invocation (hosts without skill-loader convention):
python3 $DESIGN_HARNESS/skills/hd-setup/scripts/detect.py
bash $DESIGN_HARNESS/skills/hd-review/scripts/budget-check.sh
```

</details>

### Host compatibility

| Host | Install path | Parallel sub-agent dispatch | Output |
|---|---|---|---|
| Claude Code | Marketplace one-liner | ✅ via `Task` tool | Full parallel (~30s /hd:review) |
| Codex CLI | Clone + symlink | ✅ via `/agent` + MCP | Full parallel (~30s) |
| Cursor IDE | Clone + symlink | ✅ via subagents API (≤4) | Full parallel (~45s) |
| Cursor CLI | Clone + symlink | ❌ inline serial | Same output, ~1–2 min |
| Windsurf / other | Clone + manual | ❌ inline serial | Same output, ~1–2 min |

`/hd:review` writes the full report file regardless of host; chat summary renders identically everywhere (box-drawing tables work in every terminal that supports UTF-8).

### Updating

All install paths share the same update command:

```bash
# Claude Code marketplace
/plugin marketplace update BilLogic/harness-designing-plugin

# Any clone-based install
cd <clone-path> && git pull
```

Pin to a specific release:

```bash
cd <clone-path> && git checkout v1.1.0
```

### Official directories *(beta—pending marketplace review)*

The plug-in is in **beta testing**. Submitted to Anthropic's Claude Code plug-in directory and Cursor's marketplace on 2026-04-18; both are pending reviewer response. Once accepted, installation becomes a one-liner via each platform's native UI (no git clone, no manual registration). Until then the clone-based paths above work on every host today. OpenAI Codex directory opens later.

### Uninstall

```bash
# Claude Code
/plugin uninstall design-harness
/plugin marketplace remove harness-designing

# Codex CLI / Cursor / Windsurf (clone-based)
rm ~/.codex/skills/design-harness      # remove symlink (if Codex)
rm ~/.cursor/skills/design-harness     # remove symlink (if Cursor)
rm -rf ~/.codex/harness-designing-plugin   # remove the clone
```

The plug-in never modifies files outside its own install directory. Uninstalling means deleting the clone and any symlinks you created.

## Credits

**The article**—Bill Guo's Substack series on design harnessing *(URL TBD)*. The thesis, the five-layer frame, the memory taxonomy, and the core quotables all originate there. This plug-in is the starter kit.

**Harness vocabulary + anatomy (primary inspiration)**—LangChain: [*The Anatomy of an Agent Harness*](https://blog.langchain.com/the-anatomy-of-an-agent-harness/) by [Vivek Trivedy](https://x.com/Vtrivedy10) and [*Your Harness, Your Memory*](https://blog.langchain.com/your-harness-your-memory/) by [Harrison Chase](https://x.com/hwchase17). The noun "harness," the memory-typology framing, and the ownership argument come from here—this is the vocab + concept lineage that made a design-focused harness legible in the first place.

**Compounding practice + plug-in pattern**—[compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin) by [Kieran Klaassen](https://twitter.com/kieranklaassen) and the [Every](https://every.to) team, with their companion essay [*Compound Engineering*](https://every.to/guides/compound-engineering). Heavy user—their lesson → rule compounding loop inspired the design-focused compounding we wire into the Workflow Orchestration layer. The structural model (`plugin.json` + skills as commands + agents as categorized sub-agents + plan-then-work workflow) is also lifted from their work.

**Context engineering + harness design for long-running apps**—Anthropic: [*Effective Context Engineering for AI Agents*](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) by [Prithvi Rajasekaran](https://x.com/rgb_prithvi), [Ethan Dixon](https://www.linkedin.com/in/eltd/), [Carly Ryan](https://www.linkedin.com/in/carly-ryan-2565b3154/), and [Jeremy Hadfield](https://x.com/jerhadf) of the Applied AI team; [*Harness Design for Long-Running Apps*](https://www.anthropic.com/engineering/harness-design-long-running-apps) by Prithvi Rajasekaran (Labs team); [*Effective Harnesses for Long-Running Agents*](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) by [Justin Young](https://www.linkedin.com/in/jyoung127) with contributions from David Hershey, Prithvi Rajasekaran, Jeremy Hadfield, Naia Bouscal, Michael Tingley, Jesse Mu, Jake Eaton, Marius Buleandara, Maggie Vo, Pedram Navid, Nadine Yasser, and Alex Notov (Claude Code + code RL teams); [*Authoring Skills for Claude*](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices); and the [Complete Guide to Building Skills for Claude](https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf). Attention-budget and progressive-disclosure patterns from these.

**Rubric source material**
- [pbakaus/impeccable](https://github.com/pbakaus/impeccable) by [Paul Bakaus](https://twitter.com/paulbakaus)—typography, color-and-contrast, spatial-design, motion-design, ux-writing, responsive-design
- [Nielsen Norman Group](https://twitter.com/NNgroup)—[Nielsen's 10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/) by [Jakob Nielsen](https://twitter.com/JakobNielsen) → `heuristic-evaluation`
- [Material Design 3](https://m3.material.io)—Google → `design-system-compliance`, `interaction-states`
- [Fluent 2](https://fluent2.microsoft.design)—Microsoft → `accessibility-wcag-aa`, `ux-writing`

**Adjacent work**—[*Designer's Guide to Context Engineering with AI IDEs*](https://productpower.substack.com/p/the-designers-guide-to-context-engineering) by [Samet Özkale](https://twitter.com/sametozkale) covers context engineering for designers; this plug-in extends to all five layers.

**Working implementation**—[BilLogic/plus-uno](https://github.com/BilLogic/plus-uno) is the open-source harness built for a rotating 15-designer team; the patterns templated here are distilled from it.

## Known Issues

- **Article corpus URL is TBD.** `article-quote-finder` emits `corpus_status: not-configured` and returns an empty citation set rather than fabricating quotes. Populate `agents/research/article-quote-finder-corpus.md` once the series is live.
- **User-level MCPs require opt-in.** `detect.py` scans repo-scoped MCP configs by default. Pass `--include-user-mcps` to also scan `~/.claude/mcp.json` and `~/.codex/mcp.json`.
- **Namespace respect, not integration.** Strictly namespaced: commands `/hd:*`, skills `hd-*`, config `hd-config.md`, knowledge under `docs/design-solutions/` (never `docs/solutions/`). The `<protected_artifacts>` block declares our outputs as read-only for external review/cleanup tools. We do not call into other plug-ins' skills or agents.

## Version History

See [CHANGELOG.md](./CHANGELOG.md).

- **v1.1.0** (2026-04-20)—iteration release. Unified vocabulary (audit/critique → review), file-first reporting with `Proposed revision` file-tree diffs, `/hd:setup --from-review` bridge, Staleness check, content-quality grading, host-agnostic execution, schema-v4 detector. ~25 fixes surfaced by live testing across 10 repos.
- **v1.0.0** (2026-04-18)—distribution-ready. Validated across 6-repo pilot matrix (sds, plus-marketing-website, caricature, oracle-chat, lightning, plus-uno). Submitted to Anthropic Claude Code plug-in directory + Cursor marketplace.

## License

MIT—see [LICENSE](./LICENSE).
