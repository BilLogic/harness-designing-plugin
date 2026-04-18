# design-harness

**A plug-in for design teams to assemble the AI harness you already have into something compounding.**

Ships for [Claude Code](https://claude.com/claude-code), [Codex CLI](https://github.com/openai/codex), and [Cursor](https://cursor.com). One repo, three sibling manifests.

> **Companion to** the Substack article series on design harnessing *(link TBD)*.
> **Philosophical cousin to** [EveryInc/compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin) — same move (codify practice so it compounds), different domain (design, not engineering).

---

## Thesis

You already have a design harness. It's just scattered — across Slack pins, Notion docs, Figma comments, AGENTS.md rules, and a decade of design reviews. This plug-in helps you assemble that pile into **five layers** that every AI-assisted design task inherits:

| Layer | Memory type | What lives here |
|---|---|---|
| **1. Context** | semantic | Product, users, brand voice, design system tokens — what's always true |
| **2. Skills** | procedural | Repeatable design tasks (prototype a screen, write a component, audit a11y) |
| **3. Orchestration** | procedural-of-procedures | When to invoke which skill, and in what order |
| **4. Rubrics** | semantic checks | How to judge quality — a11y, typography, interaction, telemetry, i18n, … |
| **5. Knowledge** | episodic + temporal + speculative + semantic-taste + procedural-chosen | Lessons, decisions, preferences, changelogs, ideations — time-ordered and tag-navigable |

The plug-in walks you through each layer, detects what you already have, and offers four choices per layer: **link** (pointer to source of truth), **critique** (apply a rubric to what exists), **scaffold** (seed questions + write new files), or **skip**.

---

## Four commands

| Command | Verb | Use it to… |
|---|---|---|
| [`/hd:onboard`](skills/hd-onboard/SKILL.md) | **learn** | Ask questions about the harness concept. Article-backed Q&A, 10 atomic references (one per layer + glossary + FAQ + coexistence + memory-taxonomy), article § citations when the corpus is configured. No writes. |
| [`/hd:setup`](skills/hd-setup/SKILL.md) | **setup** | Walk the five layers in order. Detect existing harnesses (`.agent/`, `.claude/`, `AGENTS.md`, compound-engineering artifacts) and external tooling (6 team-tool categories, MCP configs at repo- and optionally user-level). Offer per-layer link / critique / scaffold / skip. Write `hd-config.md` recording every decision. |
| [`/hd:compound`](skills/hd-compound/SKILL.md) | **maintain** | Capture lessons (episodic memory; one dated file per event). Propose graduations from narrative lesson to team rule in AGENTS.md. **Destructive graduations require SHA-256 plan-hash proof-of-consent** — compute on propose, persist to `.hd/propose-<hash>.json`, verify on apply. Survives context compaction. |
| [`/hd:review`](skills/hd-review/SKILL.md) | **improve** | `audit` harness health via multi-agent orchestration (parallel/serial auto-switch at 6+ agents) — full mode or `mode:quick` (~30s preflight). `critique` work items against rubrics. `<protected_artifacts>` declared so `/ce:review` and friends never flag our outputs. |

---

## What ships in the box

### Six reusable sub-agents (`agents/`)

Invoked from skills via `Task design-harnessing:<category>:<name>(…)`. Descriptions ≤180 chars (skill-quality rubric §1 compliance):

| Category | Agent | Purpose |
|---|---|---|
| `analysis/` | `graduation-candidate-scorer` | Cluster lessons; score graduation-readiness on recurrence × clean-imperative × team-agreement |
| `research/` | `lesson-retriever` | Retrieve past lessons weighted by relevance × recency × importance |
| `research/` | `article-quote-finder` | Verbatim article quotes with § citations (graceful empty if corpus not configured) |
| `review/` | `skill-quality-auditor` | Apply 9-section skill-quality rubric to any SKILL.md |
| `review/` | `rubric-applicator` | Apply any rubric to any work item — two modes: `apply` (forward critique) and `extract` (find implicit rubrics in AGENTS.md, docs, etc.) |
| `workflow/` | `harness-health-analyzer` | Deep narrative 5-layer health report (full mode) or abbreviated preflight (quick mode) |

### 14 starter rubrics (`skills/hd-review/assets/starter-rubrics/`)

Distilled from [pbakaus/impeccable](https://github.com/pbakaus/impeccable), Nielsen's 10 heuristics, Material 3, and Fluent 2:

**Quality & craft:** a11y-wcag-aa • design-system-compliance (with managed-DS pre-fills for **antd / chakra-ui / mui / mantine**) • component-budget • skill-quality • interaction-states • heuristic-evaluation
**Visual & sensory:** typography • color-and-contrast • spatial-design • motion-design
**Communication & shape:** ux-writing • responsive-design
**Domain-specific:** telemetry-display (IoT / hardware / real-time) • i18n-cjk (bilingual / CJK products)

Each rubric cites its `source:` derivation in YAML frontmatter. Copy to `docs/rubrics/<name>.md` and edit for your team; the starter-vs-customized precedence is checked at apply time.

### `detect.py` schema v2 (`skills/hd-setup/scripts/`)

Scans the repo and emits structured JSON covering:

- **Layer-presence signals:** `has_rubrics_dir`, `has_knowledge_dir`, `memory_types_present`, `layers_present: [L1, L4, L5, ...]`
- **Managed design systems:** `managed_design_system: "ant-design" | "chakra" | "mui" | "mantine" | null`
- **A11y frameworks:** Radix, Headless UI, Reach, react-bootstrap, React Aria, base-ui (systematic `package.json` scan)
- **Other-tool harnesses:** `.agent/`, `.claude/`, `.codex/`, external `.cursor/skills/` — enumerated into `other_tool_harnesses_detected`
- **Compound coexistence:** paths found (`docs/solutions/`, `docs/ideation/`, `docs/brainstorms/`, `docs/plans/`) + config file detection
- **Team tooling, 6 categories:** docs, design, diagramming, analytics, pm (incl. `markdown-todos` convention), comms
- **MCP servers** at repo-level and, with opt-in `--include-user-mcps` flag, user-level (`~/.claude/mcp.json`, `~/.codex/mcp.json`)

Schema spec at [`skills/hd-setup/references/hd-config-schema.md`](skills/hd-setup/references/hd-config-schema.md).

### Templates (`skills/hd-setup/assets/`)

- `hd-config.md.template` — root config recording `layer_decisions` (per-layer), `other_tool_harnesses_detected`, `files_written`, `team_tooling`, `mcp_servers`
- `context-skeleton/` — full Layer 1 baseline: product (5 files) + conventions (4) + design-system/foundations (5) + styles (5) + components (5) + index-manifest
- `knowledge-skeleton/` — Layer 5 baseline: INDEX, README explaining memory-type taxonomy, changelog, decisions, preferences, ideations, lessons/
- `rubrics-index.md.template` — Layer 4 INDEX shell
- `pointer-file.md.template` — link-mode contract: every pointer carries a 3–5 line extracted summary, never a bare `See [path]`

---

## Design discipline

Five rules the plug-in enforces on itself (dogfooded in `docs/`):

1. **Additive-only when an existing harness is detected.** `/hd:setup` never modifies `CLAUDE.md`, `AGENTS.md`, `.agent/`, `.claude/`, `docs/context/`, `docs/knowledge/`, `docs/rubrics/`, or compound artifacts. New files only. *Confirmed across 6-repo pilot matrix; graduated rule 2026-04-18.*
2. **Existing harness → skip L1/L2/L3, scaffold L4/L5 by default.** When `.agent/` or `.claude/` with content is detected, the existing harness IS Layer 1+2; hd-* adds rubrics + knowledge on top. *Graduated rule 2026-04-18, 4 pilot confirmations.*
3. **Graduated rules require plan-hash consent.** AGENTS.md edits that promote episodic learnings to procedural rules compute a SHA-256 over title + date + author + paths + diff, persist the plan artifact to `.hd/propose-<hash>.json`, and verify on apply. Two sessions or context-compaction-safe.
4. **Never fabricate examples.** `rubric-applicator`'s extract mode uses sentinel strings when source lacks explicit positive/negative examples, rather than inventing plausible snippets. Every candidate carries `source_citation: <repo-relative-path>:<line-range>`.
5. **Skill quality gated at three tiers.** Frontmatter description ≤180 chars (hard cap on agent-facing tokens). SKILL.md ≤200 lines soft / 500 hard (progressive disclosure). Tier 1 combined context ≤200 lines. Enforced by [`skills/hd-review/scripts/budget-check.sh`](skills/hd-review/scripts/budget-check.sh).

Every rule above earned its place via **episodic → procedural graduation**: captured as lessons in `docs/knowledge/lessons/`, scored by `graduation-candidate-scorer`, promoted only after ≥3 confirmations across different repos.

---

## Coexists with compound-engineering

Runs alongside [EveryInc/compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin) without namespace collisions:

| Compound's | Ours |
|---|---|
| `/ce:*` commands | `/hd:*` commands |
| `docs/solutions/` | `docs/design-solutions/` (v0.5+) |
| `compound-engineering.local.md` | `hd-config.md` |
| `ce-*` skill prefix | `hd-*` skill prefix |

Our skills invoke compound's agents via fully-qualified Task names (`Task compound-engineering:research:learnings-researcher(…)`). `/hd:review` declares `<protected_artifacts>` so `/ce:review` never flags our outputs. Full collision-avoidance rules at [AGENTS.md § Coexistence](./AGENTS.md#coexistence-with-compound-engineering).

---

## Install

### Claude Code — local dev

```bash
git clone https://github.com/BilLogic/harness-designing-plugin ~/plugins/design-harness
claude --plugin-dir ~/plugins/design-harness
```

### Marketplaces *(pending first publication)*

```bash
# Claude Code
/plugin marketplace add BilLogic/harness-designing-plugin
/plugin install design-harness
```

Codex CLI + Cursor equivalents ship from the same repo via `.codex-plugin/` and `.cursor-plugin/` sibling manifests. Native `AGENTS.md` support on all three platforms means zero-glue conventions.

---

## File tree

This repo IS the plug-in payload (flat — no `plugins/<name>/` nesting):

```
design-harness/
├── .claude-plugin/plugin.json         # Claude Code manifest
├── .codex-plugin/plugin.json          # Codex CLI manifest
├── .cursor-plugin/plugin.json         # Cursor manifest
├── .cursor/rules/AGENTS.mdc           # Cursor IDE redirect → AGENTS.md
│
├── AGENTS.md                          # conventions + graduated rules
├── CLAUDE.md                          # @AGENTS.md (1 line shim)
├── CHANGELOG.md  LICENSE  README.md
│
├── docs/                              # meta-harness — we run the 5-layer pattern on ourselves
│   ├── context/                       # Layer 1 applied to us
│   ├── knowledge/                     # Layer 5 — lessons, decisions, preferences, changelog
│   │   ├── graduations.md             # meta-log of episodic→procedural promotions
│   │   └── lessons/                   # dated files (YYYY-MM-DD-<slug>.md)
│   ├── rubrics/INDEX.md               # Layer 4 pointer
│   └── plans/                         # PRDs + phase plans (YYYY-MM-DD-NNN-*)
│
├── agents/                            # 6 reusable sub-agents
│   ├── analysis/graduation-candidate-scorer.md
│   ├── research/lesson-retriever.md
│   ├── research/article-quote-finder.md (+ corpus.md companion)
│   ├── review/skill-quality-auditor.md
│   ├── review/rubric-applicator.md     # apply + extract modes, both phased
│   └── workflow/harness-health-analyzer.md
│
└── skills/
    ├── hd-onboard/                    # LEARN — SKILL.md + 10 atomic references
    ├── hd-setup/                      # SETUP — SKILL.md + ~15 references (per-layer + step-N-*)
    │   ├── assets/                    # context + knowledge + rubrics skeletons
    │   └── scripts/detect.py          # schema-v2 detection
    ├── hd-compound/                   # MAINTAIN — SKILL.md + per-mode references + plan-hash
    │   └── scripts/compute-plan-hash.sh  # deterministic canonical-string hasher
    └── hd-review/                     # IMPROVE — SKILL.md + audit/critique procedures
        ├── assets/starter-rubrics/    # 14 starters
        └── scripts/budget-check.sh    # SKILL budget + Tier 1 compliance
```

Per-mode procedures live in `references/<mode>-procedure.md` files (F5 convention), not `workflows/` subdirectories. Shared procedures graduate to sub-agents in `agents/<category>/`.

---

## How mature is it?

**Phases 3a–3h shipped.** Validated across a 6-repo pilot matrix (sds, plus-marketing-website, caricature, oracle-chat, lightning, plus-uno) with two parallel-subagent pilot runs + four regression lessons. Budget-check clean on the full skill set (all 4 SKILL.md under 200 lines, Tier 1 at 198/200, zero violations). Full history in [CHANGELOG.md](./CHANGELOG.md).

The plug-in dogfoods itself — every `docs/knowledge/lessons/*.md` in this repo was captured by `/hd:compound capture`, every plan was written through `/ce:plan` → `/ce:work`, every extraction test validated by `rubric-applicator mode: extract` against real AGENTS.md files.

---

## Contributing

Pilots and lessons welcome. If you run `/hd:setup` against a repo we haven't tested (especially a framework or domain we don't have a starter rubric for — Vue/Svelte/Solid, mobile-native, hardware, design-tokens-only), open an issue or PR with:

- The `hd-config.md` the run produced (redacted if sensitive)
- Any starter rubric gaps the run surfaced
- Any `detect.py` false-negatives on your stack

Pattern graduations require ≥3 confirmations across different repos. Additive-only discipline applies to our own dev loop too.

---

## License

MIT — fork, adapt, make it your team's. See [LICENSE](./LICENSE).
