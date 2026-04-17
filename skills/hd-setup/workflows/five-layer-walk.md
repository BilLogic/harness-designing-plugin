# Workflow — five-layer walk

**When to use:** loaded by `SKILL.md` as Steps 4–8 of the overall setup flow. By the time this workflow starts, the SKILL.md has already run detection (Step 1), the onboard soft-check (Step 2), and tool discovery (Step 3). This workflow owns only the per-layer walk.

**Goal:** walk the user through Layer 1 → Layer 5 in strict order. At each layer: show what was detected, propose a default action, let the user pick **link / critique / scaffold / skip**. Record each decision in `design-harnessing.local.md` under `layer_decisions:`. **Never** modify other-tool harnesses (`.agent/`, `.claude/`, `.codex/`, external `.cursor/skills/`).

## Per-layer procedure (runs 5 times, once per layer)

```
For each of Layer 1 through Layer 5, in order:
  1. FRAME — explain the layer in one sentence + cite article §
  2. SHOW — present what detect.py found for this layer + what team_tooling maps here
  3. PROPOSE — pick default action per the decision table below
  4. ASK — user chooses link / critique / scaffold / skip; record in layer_decisions
  5. EXECUTE the chosen action (procedures below, per layer)
```

The 5 sections that follow (Layer 1 through Layer 5) apply this procedure in order.

## Per-layer action options (universal contract)

At every layer:

- **link** — add a pointer file (markdown stub with URL / path to existing content) under `docs/<layer-folder>/`. Original source untouched. Used when content already lives in another tool or another harness convention.
- **critique** — apply the relevant starter rubric; surface findings inline; do NOT modify the source. User then decides per-finding whether to scaffold a delta.
- **scaffold** — seed questions + write new file(s) under `docs/<layer-folder>/` per the layer's template. Used when the layer has no existing material.
- **skip** — record in `skipped_layers`. Re-runs don't re-propose unless user passes `--reset-skips`.

**Never merge, never absorb, never overwrite external harnesses.** If `signals.has_agent_dir` / `has_claude_dir` / `has_codex_dir` / `has_external_skills` is set, the `link` option points FROM `docs/<layer>/` TO `.agent/rules/*` or `.claude/skills/*` etc. The other-tool harness is never touched.

## Default action per layer (based on detection)

| Condition | Default | Reasoning |
|---|---|---|
| Nothing detected at this layer + no external tooling mentioned | scaffold | Greenfield for this layer |
| External tool detected (e.g., `team_tooling.docs: [notion]` for L1) + MCP available in session | scaffold + offer MCP-pull | Use the MCP to seed actual content |
| External tool detected + MCP not in session | link + offer MCP-install | Pointer now, richer later |
| Other-tool harness file detected (e.g., `.agent/rules/*` for L1) | link | Respect existing, don't duplicate |
| Existing `docs/<layer>/` file detected (prior hd-* run) | critique | Review what's there, fill gaps |
| Bloat detected (`has_bloat` flag, for L1) | critique | Tier-budget restructure needed |

The default is a **suggestion**, never an enforcement. User can pick any of the 4 options.

## Layer 1 — Context

**Frame for user:**

> "Layer 1 — Context. What the AI needs to know every time it works in this repo. Think: product, user, design system, conventions. Semantic memory (article §4a)."

**What the skill does:**

1. Present detection results relevant to L1:
   - `has_agent_dir` → "You have `.agent/rules/*` — often that's your Layer 1."
   - `team_tooling.docs` → "Detected `[notion | google_docs | …]` — team product docs often live there."
   - `team_tooling.design` → "Detected `[figma | …]` — design system source likely there."
   - `has_figma_config` / `has_tokens_package` → "Token SoT candidates detected."

2. Load [`../references/layer-1-context.md`](../references/layer-1-context.md) for layer spec.

3. Propose default action per table above. Ask user to choose (A)link / (B)critique / (C)scaffold / (D)skip.

4. If **scaffold**: seed questions before writing (see "Seed questions" section below).

5. If **link**: write pointer files — e.g., `docs/context/product/one-pager.md` containing `See [.agent/rules/100-project-context.md](../../../.agent/rules/100-project-context.md)` or `See [Notion — PLUS product](https://notion.so/...)`.

6. If **critique**: apply bloat-detection + Tier 1 budget check; surface findings; do NOT write.

7. Record decision in-session; write to `design-harnessing.local.md` at Step 6.

### Seed questions (L1, when scaffolding from zero)

Open-ended, user drives. Skill waits for answers:

1. "Describe your product in one sentence for a new teammate."
2. "Who's the user in one sentence?"
3. "What's the single biggest design constraint you face right now?"
4. "Where does your design system source-of-truth live? (Figma / code tokens / ad-hoc / somewhere else)"

**User says "I don't know":** offer baseline from Material 3 / Fluent 2 foundations + their existing code (README, package.json description). Skill drafts, user edits.

## Layer 2 — Skills

**Frame:**

> "Layer 2 — Skills. AI capabilities your team codifies — specific, repeatable workflows. Procedural memory (article §4b)."

**Detection → defaults:**
- `has_external_skills` (`.claude/skills/` / `.cursor/skills/`) → default **critique** via `skill-quality` rubric (9-section check, `skills/hd-review/templates/starter-rubrics/skill-quality.md`)
- `.agent/skills/` → default **link**
- Nothing detected → default **skip** (Layer 2 is premature for most teams; revisit when patterns emerge)

**Seed questions (L2, when scaffolding):**
1. "Is there a workflow you've had to explain 3+ times in the last month?"
2. "If you could automate one repetitive design-adjacent task, what would it be?"

## Layer 3 — Orchestration

**Frame:**

> "Layer 3 — Orchestration. How skills + handoffs flow. Who does what, in what order. Procedural memory (article §4c)."

**Detection → defaults:**
- `team_tooling.pm` (linear / github_issues / jira) → default **link** (orchestration often lives in PM-tool labels/templates)
- `team_tooling.diagramming` → default **link** to sequence/state diagrams
- Fewer than 3 Layer 2 skills → default **skip** (orchestration needs something to orchestrate)

**Seed questions (L3):**
1. "When a design goes from idea to shipped, name the 3–5 steps it passes through."
2. "What's the most common handoff that breaks?"

## Layer 4 — Rubrics

**Frame:**

> "Layer 4 — Rubrics. Taste, embedded as checks. What 'good' means, machine-readable. Distributed pattern (article §4d)."

**Detection → defaults:**
- `has_tokens_package` / `has_figma_config` → default **scaffold** design-system-compliance rubric (reference actual tokens)
- `has_external_skills` → default **scaffold** skill-quality rubric entry
- Nothing detected → default **scaffold** starter trio (accessibility + design-system + component-budget)

**Seed questions (L4 — open-ended first):**

1. "When you review each other's work, what's the first thing you check?"
2. "What's a mistake you've seen your team make twice?"
3. "If a new designer shipped something tomorrow, what's the one quality bar they should clear?"

**User says "I don't have clear criteria yet":**

Offer baseline rubric seeds from established design systems:
- Material Design 3 → [m3.material.io/foundations](https://m3.material.io/foundations) — token scales, states, a11y minima
- Fluent 2 → [fluent2.microsoft.design/accessibility](https://fluent2.microsoft.design/accessibility) — a11y-first baselines
- awesome-design-md → [github.com/VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) — cheat-sheet patterns
- Starter rubrics in [`../../hd-review/templates/starter-rubrics/`](../../hd-review/templates/starter-rubrics/) — pick one, customize

## Layer 5 — Knowledge

**Frame:**

> "Layer 5 — Knowledge. What the team has learned — lessons + graduations. Episodic memory + graduated procedural (article §4e)."

**Detection → defaults:**
- `has_plans_convention` (`docs/plans/*-plan.md`) → default **critique**: scan plans for recurring patterns, surface 3–5 lesson candidates
- `team_tooling.docs` + `docs` MCP in session → default **scaffold + offer pull** of any "retro" / "post-mortem" / "decision" labeled pages as lesson seeds
- `team_tooling.pm` → default **link** (decisions often in closed-issue threads)
- Nothing detected → default **scaffold** (empty `docs/knowledge/lessons/` for go-forward capture)

**Seed questions (L5):**
1. "Name 3 design decisions your team made in the last 6 months that a new hire would benefit from knowing."
2. "What's a mistake you made recently that you want to prevent recurring?"
3. "Is there a pattern you've noticed across 3+ projects worth formalizing?" (candidate for graduation)

## After the walk — handoff to SKILL.md

Once all 5 layers have a decision (recorded in-memory), control returns to `SKILL.md` Steps 9 (write `design-harnessing.local.md`) and 10 (summarize + suggest next). This workflow does NOT write the local.md itself — the SKILL.md owns that atomic write so the layer-walk can stay pure procedure.

## Team-size-adaptive language

Based on user-reported `team_size`:

| team_size | Framing |
|---|---|
| **solo** | "your future self", "scratchpad mode", skip graduation ceremony talk at L5 |
| **small** (2–5) | "you and your co-designers", introduce graduation lightly |
| **medium** (5–20) | full five-layer emphasis, graduation workflow explicit |
| **large** (20+) | defer; suggest per-product harness in monorepo pattern; see [scattered.md](scattered.md) legacy ref |

Language switches happen **inside** seed questions and frame paragraphs — the decision mechanics (link/critique/scaffold/skip) are identical.

## Re-run semantics

When this workflow runs on a repo that already has `design-harnessing.local.md`:

1. Read prior `layer_decisions`, `skipped_layers`, `team_tooling`
2. For each layer: start from the prior decision; offer "revisit" or "keep"
3. Do NOT re-propose `skipped_layers` unless user passes `--reset-skips`
4. **Never overwrite user's prior scaffolded content.** If `critique` surfaces gaps, let user decide per-gap.

Re-run produces **additive** changes only (or a critique report). Git diff after re-run should show only new files or explicit user-approved edits.

## Failure modes

- **F1 Tool-discovery loop** — user can't decide on team_tooling. Skip the discovery, default `team_tooling: {}`, record in prose.
- **F2 MCP install instructions invalid** — never recommend from a table that isn't the `Known MCP installs` list in `external-tooling.md`. If user-named tool isn't in the table, record as pointer-only.
- **F3 Other-tool harness contains content we'd want at L1** — the rule is absolute: **link, don't absorb**. Write a pointer file.
- **F4 User answers "I don't know" to every seed question** — offer Material 3 / Fluent 2 / awesome-design-md fallbacks. If they still don't know, scaffold minimal placeholder with a note "revisit when you have answers."
- **F5 Destructive action proposed** — always show diff preview; require explicit confirmation; never silent overwrite.

## Coexistence rules

- ✅ Reads `.agent/`, `.claude/`, `.codex/`, external skills, MCP configs for detection
- ✅ Writes pointer files in `docs/context/`, `docs/knowledge/`, `docs/rubrics/`, `docs/orchestration/` that REFERENCE external paths
- ❌ Never modifies any file under `.agent/`, `.claude/`, `.codex/`, `.cursor/skills/`, `.windsurf/`
- ❌ Never writes to `docs/solutions/` (compound's namespace)
- ❌ Never renames or deletes user files

## See also

- [`../references/external-tooling.md`](../references/external-tooling.md) — Step 1.5 integration spec
- [`../references/local-md-schema.md`](../references/local-md-schema.md) — schema v2 fields this workflow populates
- [`../references/layer-1-context.md`](../references/layer-1-context.md) through `layer-5-knowledge.md` — per-layer detail
- Legacy per-mode workflows (now per-starting-state seed content):
  - [`greenfield.md`](greenfield.md)
  - [`scattered.md`](scattered.md)
  - [`advanced.md`](advanced.md)
