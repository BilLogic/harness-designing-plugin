# Harness Designing

**A plug-in that turns your team's scattered AI usage into a design practice that compounds.**

Four skills. Five layers. One harness your whole team inherits—across Notion, Figma, AGENTS.md, and every chat thread.

Works with [Claude](https://claude.com/claude-code), [Codex](https://github.com/openai/codex), [Cursor](https://cursor.com), and other agentic coding tools. [Install →](#installation)

> *"Tools lower the floor. Taste sets the ceiling. Your harness builds the ladder."*
> —from the companion article

## Thesis

**You already have a design harness.** It's scattered—Slack pins, Notion docs, Figma comments, AGENTS.md rules, a decade of design reviews.

This plug-in assembles the pile into **five layers**. Every AI-assisted task inherits all of them. Each layer has its own home and feeds the others.

| Layer | What lives here | How it connects |
|---|---|---|
| **1. Context Engineering** | Product facts, users, brand voice, design tokens, conventions | Loaded first on every task. Every other layer reads from it. |
| **2. Skill Curation** | Repeatable jobs (research, plan, prototype, review, compound) | Draws from Context. Invokes Rubrics at gates. Writes to Knowledge. |
| **3. Workflow Orchestration** | How skills compose into real work—sequences, handoffs, gates | Emerges from how Skills dispatch agents. |
| **4. Rubric Setting** | Quality bars—a11y, design-system, typography, telemetry, i18n | Applied by Skills at workflow gates. |
| **5. Knowledge Compounding** | Lessons, decisions, preferences, changelog | Captured by every skill. Recurring patterns promote to Context rules. |

**At each layer, four choices:**

- **scaffold** — point at what already exists, wrap structure around it
- **review** — evaluate it against a rubric, flag what could improve
- **create** — start from scratch with seeded prompts
- **skip** — leave this layer for later

## Commands

### [`/hd:learn`](skills/hd-learn/SKILL.md) — ask about the concept

Read-only Q&A about any layer, memory type, or decision in the harness frame.

Ten atomic references back the answers—one per layer, plus glossary, FAQ, and memory taxonomy. Article sections cited when the corpus is configured.

**Try:**

- *"What's the difference between Layer 1 and Layer 5?"*
- *"When should I scaffold vs. create at Layer 1?"*
- *"Walk me through the five layers for a team just starting out."*

### [`/hd:setup`](skills/hd-setup/SKILL.md) — walk your repo, layer by layer

Detects existing harness artifacts (`.agent/`, `.claude/`, `docs/context/`, etc.). Pre-analyzes all five layers in parallel. Walks each layer with a **preview-before-write gate**.

Per layer: **scaffold** · **review** · **create** · **skip**.

When scaffolding a greenfield repo, it proposes this starting structure:

```
<repo-root>/
├── AGENTS.md                   # always-loaded rules + harness map + agent persona
├── hd-config.md                # machine-parseable config
│
├── docs/
│   ├── context/                # L1 — what's always true
│   │   ├── product/            # one-pager, users, journeys, capabilities, metrics
│   │   ├── engineering/        # stack, data, API, deployment, dev env, security
│   │   ├── design-system/      # styles · foundations · components
│   │   └── conventions/        # repo map + team norms
│   │
│   ├── rubrics/                # L4 — how we judge "good"
│   └── knowledge/              # L5 — changelog, decisions, ideations, preferences, lessons
│
├── skills/                     # L2 — repeatable jobs
└── agents/                     # L3 emerges from skills ↔ agents dispatch
```

> **Starting template, not a contract.** Rename folders, skip layers, add your own. The plug-in audits what exists, suggests what's missing, respects what you built (additive-only by default). Full spec: [`standard-harness-structure.md`](skills/hd-setup/references/standard-harness-structure.md).

### [`/hd:maintain`](skills/hd-maintain/SKILL.md) — capture lessons, promote to rules

**Capture.** When a decision, surprise, or recurring pattern is worth remembering. One dated file per event.

**Propose.** When the same pattern recurs three-plus times, `rule-propose` scores the cluster and suggests a new rule for `AGENTS.md`.

**Adopt.** Rule adoption requires SHA-256 plan-hash proof-of-consent. Rules never land by accident.

**Try:**

- *"Capture a lesson: our AntD buttons don't work with dark-mode tokens; reverted to custom overrides."*
- *"Propose a rule: we've had three lessons about dark-mode token drift this month."*

### [`/hd:review`](skills/hd-review/SKILL.md) — full or targeted review

**Full review** across all five layers:

- Writes a dated report to `docs/knowledge/reviews/<date>-harness-review.md`
- Emits a chat summary with ASCII health bars, priorities table, cross-layer signals, a **Proposed revision** file-tree diff, and a staleness check against any prior review
- Pair with `/hd:setup --from-review <path>` to apply findings as concrete writes

**Targeted review** of one layer, file, or rubric against team rubrics.

**17 starter rubrics ship with the plug-in** (all on YAML-criteria schema). Copy any into `docs/rubrics/<name>.md` and customize:

| Category | Rubrics |
|---|---|
| **Craft** | `accessibility-wcag-aa`, `design-system-compliance`, `component-budget`, `skill-quality`, `interaction-states`, `heuristic-evaluation` |
| **Visual** | `typography`, `color-and-contrast`, `spatial-design`, `motion-design` |
| **Communication** | `ux-writing`, `responsive-design` |
| **Domain-specific** | `telemetry-display`, `i18n-cjk` |

Each rubric carries a `## Scope & Grounding` block—personas, user stories, scenarios, anti-scenarios—with source citation.

> **The plug-in maintains the library. Your AI applies it** against actual design work.

## Installation

> **Status (v3.0.0)** — distributed via self-hosted marketplace today. Pending review in Anthropic's and Cursor's directories; same flow as compound-engineering and other third-party plug-ins. Codex official directory still ["coming soon"](https://developers.openai.com/codex/plugins/build).

> **Bundled connector** — [context7](https://context7.com) HTTP MCP for library doc lookup (used by `ai-integration-scout`, `skill-quality-auditor`, `/hd:learn`). Works anonymously out of the box; set `CONTEXT7_API_KEY` env var for higher rate limits ([free key](https://context7.com/dashboard)). We never wire your key — `.mcp.json` reads `${CONTEXT7_API_KEY:-}`.

### Claude Code

```
/plugin marketplace add BilLogic/harness-designing-plugin
/plugin install harness-designing
```

### Cursor

In Cursor Agent chat (once submission approved):

```
/add-plugin harness-designing
```

Or search "harness designing" in the plugin marketplace UI. Until approved, use the clone fallback at the bottom of this section.

### Codex CLI

Codex's official plugin directory is still "coming soon" — clone-install works today:

```bash
git clone https://github.com/BilLogic/harness-designing-plugin ~/.codex/harness-designing-plugin
mkdir -p ~/.codex/skills
ln -sf ~/.codex/harness-designing-plugin/skills ~/.codex/skills/harness-designing
# Restart Codex
```

⚠️ Codex's plugin spec doesn't register custom sub-agents yet, so our 10 sub-agents only dispatch via Task on hosts that expose it. On Codex CLI, skills run inline serial (~1–2 min) instead of parallel (~30s). Same output.

### Other hosts (Windsurf, plain terminal)

```bash
git clone https://github.com/BilLogic/harness-designing-plugin ~/plugins/harness-designing
```

Configure your host's skill-loader to read `~/plugins/harness-designing/skills/`, or invoke scripts directly (`python3 ~/plugins/harness-designing/skills/hd-setup/scripts/detect.py`).

### Updating

Claude Code:

```
/plugin update harness-designing
```

Clone-based: `cd <clone> && git pull` (or `git checkout v3.0.0` to pin).

### Migrating from v1.x or v2.x

- **v1.x → v2.0** — Task namespace renamed `design-harnessing:` → `harness-designing:`. Update any external code that referenced our agents.
- **v2.x → v3.0** — Plug-in slug renamed `design-harness` → `harness-designing`. If you previously installed:

  ```
  /plugin uninstall design-harness
  /plugin install harness-designing
  ```

`/hd:*` slash commands didn't change — end users are unaffected. See [CHANGELOG.md](./CHANGELOG.md) for full migration details.

### Uninstall

Claude Code:

```
/plugin uninstall harness-designing
/plugin marketplace remove harness-designing
```

Clone-based: remove the clone + any symlinks (`~/.codex/skills/harness-designing`, etc.).

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

- **Article corpus URL is TBD.** `article-quote-finder` emits `corpus_status: not-configured` and returns an empty citation set rather than fabricating quotes. Populate `agents/research/references/article-quote-finder-corpus.md` once the Substack series is live (`agents/research/references/README.md` documents the convention).
- **User-level MCPs require opt-in.** `detect.py` scans repo-scoped MCP configs by default. Pass `--include-user-mcps` to also scan `~/.claude/mcp.json` and `~/.codex/mcp.json`.
- **Namespace respect, not integration.** Strictly namespaced: commands `/hd:*`, skills `hd-*`, config `hd-config.md`, knowledge under `docs/design-solutions/` (never `docs/solutions/`). The `<protected_artifacts>` block declares our outputs as read-only for external review/cleanup tools. We do not call into other plug-ins' skills or agents.

## Version History

See [CHANGELOG.md](./CHANGELOG.md).

- **v2.0.0** (2026-04-25) — ⚠️ BREAKING. Task namespace renamed `design-harnessing:` → `harness-designing:` to align with marketplace + GitHub slug. `hd-config.md` schema gets a single source of truth at `skills/hd-setup/scripts/schema.json` (detect.py imports SCHEMA_VERSION at module init). Three new self-targeted rubrics shipped (`plan-quality`, `lesson-quality`, `agent-spec-quality`). `/hd:setup` Step 10.5 now appends a deterministic `Next step:` action hand-off. New `scripts/release.sh` automates version bumps + tag + push. Two rules graduated: namespace-alignment + schema-SSOT.
- **v1.4.0** (2026-04-24) — rubric-YAML-split graduates. All 3 adopted rubrics (`skill-quality`, `ux-writing`, `heuristic-evaluation`) migrate from prose-table criteria to YAML-criteria-in-frontmatter + prose-rationale-in-body. `rubric-applier` agent reads YAML deterministically (legacy parser removed via clean cut). Removes the prose-layout-fragility class entirely. Rule `R_2026_04_24_rubric_yaml_split` adopted.
- **v1.3.0** (2026-04-21) — detect-inspect-integrate + setup health disclosure. `/hd:setup` Step 10.5 renders compact 5-layer ASCII health bar + top-3 priorities at completion. L1 EXECUTE proactively surfaces detected substantive files (DESIGN.md, CONTRIBUTING.md, extended AGENTS.md) generically — no filename whitelist. Lesson + decision frontmatter gain machine-extractable fields (3p.3 enriched schema).
- **v1.2.0** (2026-04-21) — universal tool discovery + advisor-not-installer. `detect.py` schema v5 emits `raw_signals.deps` universally; `ai-integration-scout` classify mode replaces hardcoded CATEGORY_PATTERNS. The plug-in is an advisor, not an installer: surfaces MCP/CLI/API options + install-doc links; never installs on the user's behalf.
- **v1.1.0** (2026-04-20) — iteration release. Unified vocabulary (audit/critique → review), file-first reporting with `Proposed revision` file-tree diffs, `/hd:setup --from-review` bridge, Staleness check, content-quality grading, host-agnostic execution, schema-v4 detector. ~25 fixes surfaced by live testing across 10 repos.
- **v1.0.0** (2026-04-18) — distribution-ready. Validated across 6-repo pilot matrix (sds, plus-marketing-website, caricature, oracle-chat, lightning, plus-uno). Submitted to Anthropic Claude Code plug-in directory + Cursor marketplace.

## License

MIT—see [LICENSE](./LICENSE).
