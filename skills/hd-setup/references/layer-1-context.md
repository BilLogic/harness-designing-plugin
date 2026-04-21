# Layer 1 — Context (depth reference)

**Loaded by:** `SKILL.md` Step 4 when scaffolding or reviewing Layer 1. Seed questions + top-level procedure live in SKILL.md; this file provides the per-sub-file detail, full Step-4 procedure, Tier-1 budget model, and healthy AGENTS.md patterns used during scaffolding.

**Concept explainer:** [`hd-learn/references/layer-1-context.md`](../../hd-learn/references/layer-1-context.md) — "what IS Context?"

## Baseline shape under `docs/context/` (plus-uno-derived)

```
docs/context/
├── product/                    # What the product IS
│   ├── app.md                  # elevator pitch + core thesis + current stage
│   ├── features.md             # 3–5 features, one paragraph each
│   ├── flows.md                # end-to-end user flows
│   ├── users.md                # 1–3 personas (goals, constraints, success signal)
│   └── pillars.md              # 3–5 non-negotiable principles
├── conventions/                # How work happens
│   ├── coding.md               # language, tooling, patterns, anti-patterns
│   ├── integrations.md         # external services + env vars + failure behavior
│   ├── tech-stack.md           # one-line inventory
│   └── terminology.md          # team's vocabulary
└── design-system/              # What "good design" looks like, structurally
    ├── foundations/            # non-negotiable baselines
    │   ├── accessibility.md    # WCAG target + non-negotiables + tooling
    │   ├── content-voice.md    # voice attributes + tone spectrum + banned phrases
    │   ├── layout.md           # grid, breakpoints, page patterns
    │   ├── principles.md       # philosophical commitments
    │   └── tokens.md           # authoritative token source + governance
    ├── styles/                 # look + feel per category
    │   ├── color.md
    │   ├── elevation.md        # shadows + radius scales
    │   ├── iconography.md
    │   ├── spacing.md
    │   └── typography.md
    ├── components/             # primitives + patterns inventory
    │   ├── cheat-sheet.md      # "which component for this use case"
    │   ├── components-index.json
    │   ├── inventory.md        # complete list with paths + status
    │   ├── layout-cheat-sheet.md
    │   └── patterns.md         # composition patterns + anti-patterns
    └── index-manifest.json     # federated index pointing at token/patterns/etc JSON indexes
```

Templates for all 21 files: [`../assets/context-skeleton/`](../assets/context-skeleton/). Each is a thin `.template` with `{{PLACEHOLDER}}` prompts guiding the user to fill with their actual content.

**Design principle:** this baseline reproduces the shape Bill uses in plus-uno — the reference implementation. The foundations / styles / components triad under design-system mirrors how mature design systems (Material 3, Ant Design, Atlassian, Fluent 2) organize. Starting with this shape means less re-structuring later as the design system matures.

## Escape hatch — "simple mode"

Some users don't need the full plus-uno baseline — they want a lightweight starter set. At Step 4, if user indicates "simple / minimal / just the basics," offer a reduced set:

- `product/app.md` (elevator pitch only)
- `conventions/tech-stack.md` (tech inventory only)
- `design-system/foundations/tokens.md` + `design-system/components/cheat-sheet.md` (no foundations/styles subfolders)

User can graduate to full baseline later by re-running `/hd:setup` and picking "full baseline".

## When existing content is present

Classify-don't-overwrite. Map existing content to the baseline sub-paths:

- Rules → AGENTS.md root (imperatives) or `conventions/coding.md`
- Product description → `product/app.md` + `product/features.md`
- User personas → `product/users.md`
- Design system cheat-sheet → split across `design-system/foundations/`, `styles/`, `components/`
- Tech stack list → `conventions/tech-stack.md`

Diff preview before any write (F4 safety in SKILL.md). If source content is in another tool (Notion / Figma), Step 4 prefers **scaffold mode** with extract+pointer (per `assets/pointer-file.md.template`) over create-duplicate.

## Scenario edge cases

- **S2 single-file AGENTS.md** — classify sections into the baseline tree; never destroy original
- **S3 DESIGN.md pattern** — decompose into `design-system/foundations/` + `styles/` + `components/`
- **S6 bloated docs** — enforce Tier 1 budget; non-Tier-1 content moves to sibling files in same subdir

## Procedure — Step 4

**Frame:** "Layer 1 — Context. What the AI needs every time: product, user, design system, conventions. Semantic memory (article §4a)."

**Show:** detect signals — `has_agent_dir`, `has_ai_docs`, `team_tooling.docs`, `team_tooling.design`, `has_tokens_package`, `has_figma_config`, Tier 1 budget state.

**Propose default** per [per-layer-procedure.md § Default action per detection](per-layer-procedure.md#default-action-per-detection).

**Execute (3n.5) — offer three fill paths** per [per-layer-procedure.md § Fill path](per-layer-procedure.md#fill-path-execute-sub-routine-for-create--scaffold-3n5): (A) wire up a tool via `ai-integration-scout`, (B) paste content via [`paste-organize.md`](paste-organize.md), or (C) create from scratch below. For L1, Path A is default when `team_tooling.docs` or `team_tooling.data_api` has entries (Notion / Supabase / Firebase feed product facts). Otherwise default C.

**Execute — create:**
- Load this file for L1 depth (baseline shape + healthy-AGENTS.md patterns below)
- Ask create depth: **full baseline** (21 files across product/conventions/design-system — matches plus-uno) vs **simple mode** (~4 files — just app.md + tech-stack.md + tokens.md + components/cheat-sheet.md). Default: full baseline for team repos, simple mode for solo.
- Seed questions for product/: (1) product in one sentence? (2) user in one sentence? (3) biggest design constraint? (4) top 3 features?
- Seed questions for conventions/: (1) primary language + framework? (2) 3 most important coding rules?
- Seed questions for design-system/: (1) token source of truth (Figma / tokens package / CSS vars)? (2) existing component library (shadcn / Radix / custom)? (3) a11y target (WCAG AA baseline)?
- If "I don't know" on design-system → offer Material 3 / Fluent 2 / awesome-design-md baselines + user's README/package.json
- Copy the chosen template set from [`../assets/context-skeleton/`](../assets/context-skeleton/) under `docs/context/`, pre-filling `{{PLACEHOLDER}}` with user answers
- Enforce Tier 1 budget per the *Tier-1 budget model* section below: `AGENTS.md` + `docs/context/product/app.md` combined ≤ 200 lines (non-Tier-1 content like features/flows/pillars lives in sibling files — doesn't count against budget)

**Execute — scaffold:** write pointer files under `docs/context/<subtopic>/` using [`../assets/pointer-file.md.template`](../assets/pointer-file.md.template). Each pointer file must include a 3–5 line **extracted summary** of the source content, not just the bare link. Goal: pointer file is Tier 1 useful standalone; source has full detail.

Read the source (Notion page via MCP if live, `.agent/rules/*`, `.github/copilot-instructions.md` section, etc.), extract a 3–5 line summary in plain prose, fill the template.

Example for sds L1 product pointer:
```markdown
# Product (pointer to source)

**Source:** [.github/copilot-instructions.md § "Repository Overview"](../../../.github/copilot-instructions.md)

SDS is a production-ready design system featuring Figma Code Connect
integration, React components built on React Aria/Stately for
accessibility, and Storybook as interactive documentation. Audience:
design-system teams extending the library or studying patterns.

*Pointer file — authoritative content lives at the source above.*
```

**Execute — review:** apply bloat-detection checks from the *Tier-1 budget model* section below. Surface findings. Don't write.

→ Return to [../SKILL.md § Step 4 — Layer 1 (Context)](../SKILL.md#step-4--layer-1-context)

## Tier-1 budget model

The three-tier context loading model `hd:setup` enforces during scaffolding and review. Shared across all layer scaffolding decisions.

### The three tiers

| Tier | Loaded | Budget | What's here |
|---|---|---|---|
| **Tier 1** | Always — every task, regardless of topic | **≤200 lines total** | Core `AGENTS.md` + `docs/context/product/one-pager.md` |
| **Tier 2** | Skill-triggered — when a matching task runs | No hard line limit | `docs/context/design-system/*.md`, `docs/context/conventions/*.md`, agent-persona.md |
| **Tier 3** | Explicit pull — user or skill asks by path | No limit | Full design-system libraries, archives, historical decisions |

### Why Tier 1 has a hard budget

Tier 1 loads on every task. Every token in Tier 1 is a token NOT available for the task itself. The 200-line ceiling is arbitrary but calibrated:

- <100 lines: too sparse; AI lacks context to avoid common mistakes
- 100-200 lines: ideal — enough to orient, not enough to crowd out task context
- 200-400 lines: context bloat; task quality degrades
- \>400 lines: AI starts ignoring sections; might as well not have them

### Enforcement at create time

After `hd:setup` writes Tier 1 files, it runs:

```bash
wc -l AGENTS.md docs/context/product/one-pager.md 2>/dev/null | tail -1
```

If total >200, surface the budget violation and propose tier promotion:

- Move non-critical product description lines from `one-pager.md` to `docs/context/product/details.md` (Tier 2)
- Split oversized AGENTS.md sections into `docs/context/conventions/*.md` files (Tier 2)

### Enforcement at review time (v1 `hd:review`)

`hd:review` checks Tier 1 budget during review. Flags it as a drift signal — teams often add to AGENTS.md over time without noticing budget creep.

### Tier 2 triggering — how it works

Tier 2 files don't load automatically. They load when:

- A skill's `references/` link points at them (for example, `hd-setup/references/layer-1-context.md` → `docs/context/design-system/cheat-sheet.md`)
- User explicitly references them in a question
- A workflow gate pulls them as a quality check input

### Tier 3 — opt-in only

Tier 3 files are essentially **reference archives**. Not loaded unless:

- User asks by exact path: "read `docs/context/design-system/archive/button-history.md`"
- A skill explicitly pulls them (for example, a custom skill that archaeology-checks past decisions)

Tier 3 is where long-form design-system docs, accessibility appendices, and decision archives live. They have value but would destroy the context budget if loaded by default.

### Common violations + fixes

| Violation | Fix |
|---|---|
| AGENTS.md has 500 lines | Split rules into `docs/context/conventions/*.md` (Tier 2); keep AGENTS.md <150 lines |
| Product one-pager is 300 lines | Move details to `docs/context/product/details.md`; keep one-pager <30 lines |
| Design-system cheat-sheet is 2000 lines | Most of it is Tier 3 reference material; cheat-sheet should be <200 lines with links into the archive |
| Rules.md growing unboundedly | Lessons in `docs/knowledge/lessons/` stay Tier 3; changelog.md just lists pointers |

## Good AGENTS.md patterns

Exemplary AGENTS.md shape + anti-patterns to avoid. Shared across all scaffolding decisions that write or modify `AGENTS.md`.

### What AGENTS.md IS

The repo-root source of truth for how AI should behave in this codebase. Read natively by Claude Code, Codex CLI, Cursor CLI, Windsurf, GitHub Copilot coding agent (2026 baseline).

Loaded as **Tier 1 context** — always, on every task. Budget: ≤200 lines total when combined with `docs/context/product/one-pager.md`.

### Structure of a healthy AGENTS.md

Six sections, in order:

1. **Philosophy / one-paragraph product thesis** (5-10 lines)
2. **Repo layout** (annotated tree, 15-25 lines)
3. **Command naming convention** (if plug-in authoring) OR just "how we work" section (10-15 lines)
4. **Coexistence rules** (if other AI tools in play) (5-15 lines)
5. **Skill / code compliance checklist** (20-40 lines)
6. **Rules section** — starts empty; populates via Layer 5 promotion (5-50 lines depending on team age)

Total: 100-150 lines when healthy. Budget exceeded = drift; promote content to Tier 2.

### Good excerpt example

```markdown
# design-harness — Plug-in Conventions

Canonical source of truth. Read natively by Claude Code, Codex CLI, Cursor CLI,
Windsurf, GitHub Copilot. Other tools get thin redirects (CLAUDE.md, .cursor/rules/).

## Philosophy

A design harness is the wrapper of context, skills, orchestration, rubrics, and knowledge
built around an AI system so every design task inherits team thinking.

## Repo layout

[flat tree with 15 lines]

## Command naming

All commands use `hd:` prefix (two letters — *harness design*).
Never ship bare names.

## Coexistence with other plug-ins

Declare namespace isolation rules for any other AI plug-ins in use (command prefixes, output paths, config files).

## Skill compliance checklist

[20-line checklist]

## Rules

<!-- Add new rules above this line. -->
- [2026-04-16] Button variants limited to approved set; new variants require RFC.
  Source: docs/knowledge/lessons/2026-04-16-button-variants-escape-hatch.md
```

### Anti-patterns

#### Anti-pattern 1: Mixing rules with stories

**Bad:**
```markdown
## Button variants

We have primary, secondary, ghost. Remember we tried a 4th variant for marketing
in Feb 2026 but reverted because it caused drift. Also in Q3 2025 we considered
adding an outlined variant but deferred.
```

**Why wrong:** Procedural memory (the rule) mixed with episodic memory (the stories). Stories belong in Layer 5 lessons. AGENTS.md stays rule-only.

**Fix:**
```markdown
## Button variants

Approved: primary, secondary, ghost. New variants require RFC.
(See docs/knowledge/lessons/ for historical attempts.)
```

#### Anti-pattern 2: The kitchen-sink AGENTS.md

**Bad:** 800-line AGENTS.md that tries to be the complete design system reference, coding standards, product history, onboarding guide, and rule set all in one file.

**Why wrong:** Violates Tier 1 budget catastrophically. AI ignores sections. Signal-to-noise tanks.

**Fix:** Keep AGENTS.md to rules + rubric gates + rules. Everything else promotes to Tier 2 (`docs/context/*`) or Tier 3 (archived).

#### Anti-pattern 3: Time-sensitive statements

**Bad:**
```markdown
Before August 2025, we used the v1 API. After August 2025, use v2.
```

**Why wrong:** Goes stale. Creates ambiguity for tasks running after the transition.

**Fix:** State current behavior directly. Put deprecated patterns in a collapsed `<details>` block or move to Layer 5 lessons:

```markdown
## API

Use v2: `api.example.com/v2/messages`.

<details>
<summary>Legacy v1 (deprecated 2025-08)</summary>
[v1 details]
</details>
```

#### Anti-pattern 4: Vague rules

**Bad:**
```markdown
- Write clean code
- Be mindful of performance
- Follow best practices
```

**Why wrong:** Unactionable. AI can't check these.

**Fix:** Concrete, testable rules:

```markdown
- Every public method has a docstring.
- No N+1 queries (use .includes() or equivalent).
- Cyclomatic complexity ≤10 per function.
```

#### Anti-pattern 5: Missing coexistence rules

If the repo uses multiple AI plug-ins, AGENTS.md MUST declare namespace isolation rules. Missing these = silent collision (plug-ins overwrite each other's output paths).

### Pre-write check

Before `hd:setup` writes or modifies AGENTS.md, verify:

- [ ] Current content backed up to `AGENTS.md.bak-YYYYMMDD` if modifying
- [ ] Diff preview shown to user before apply
- [ ] Tier 1 budget check (new total ≤200 lines)
- [ ] No anti-patterns introduced by the change

## See also

- [hd-learn/references/layer-1-context.md](../../hd-learn/references/layer-1-context.md) — concept explainer
- Plus-uno reference implementation: [github.com/BilLogic/plus-uno/tree/main/docs/context](https://github.com/BilLogic/plus-uno/tree/main/docs/context)
- Article §4a — Context Engineering
