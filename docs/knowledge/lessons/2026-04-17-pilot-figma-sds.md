---
title: "Pilot: /hd:setup walkthrough on figma/sds"
date: 2026-04-17
tags: [pilot, figma-sds, walkthrough, first-real-repo, scattered-mode]
graduation_candidate: too-early-to-tell
importance: 4
---

# Lesson

**Context:** After the comprehensive architecture reshape (commit `31f8d4e9` + polish `15b6f5c5`), ran the first pilot of `/hd:setup` against a real public repo: [figma/sds](https://github.com/figma/sds) — Figma's "Simple Design System" starter. Functional simulation of the walk by an agent with the updated SKILL.md + references, targeting the actual repo at `/tmp/hd-real-test/sds/`. No writes to the real repo yet; output captured for validation.

## What detect.py reported (Step 1)

```json
{
  "mode": "scattered",
  "priority_matched": 5,
  "signals": {
    "has_ai_docs": true,         // .cursor/rules/ + .github/copilot-instructions.md
    "has_figma_config": true     // figma.config.json at root
  },
  "mcp_servers": [],
  "team_tooling": { "design": ["figma"] },
  "coexistence": { "compound_engineering": true }
}
```

Signals missed by v1 detection, surfaced manually during recon:
- `scripts/tokens/tokens.json` — Figma-emitted token JSON file, not in a top-level `tokens/` dir (our detection currently looks for top-level only → `has_tokens_package: false`)
- `.storybook/` exists — Storybook as design-system SSoT (deferred to v2 per prior decision, correctly not detected)
- React Aria / React Stately dependency — accessibility framework signal (not in our detection yet; could inform Layer 4 a11y rubric seeding)

**Enhancement candidate:** broaden `has_tokens_package` detection to `find . -name "tokens.json" -not -path "*/node_modules/*" | head -3` or similar, not just top-level.

## Step 2 — Onboard check

No `design-harnessing.local.md` present → soft prompt fires:

> "New to the five-layer frame?
> A. Run `/hd:onboard` first (5-min intro)
> B. Proceed — I'll explain as we go
> C. Already know it — skip the preamble"

A Figma team member using SDS would likely pick B or C. For this pilot, assume B. Skill proceeds but references layer concepts inline as layers arise.

## Step 3 — Tool discovery

Agent surfaces:

```
Detected:
  design tools: figma (high — figma.config.json + Code Connect setup + 16KB copilot-instructions.md mentions Figma extensively)
  docs tools: — nothing
  MCP servers configured: — none

  Coexistence: compound-engineering detected (we'll coexist; won't touch docs/solutions/).
```

Agent asks per category for what's missing:

> "I detected Figma for design. Anything else your team uses that I missed? Docs (Notion, Confluence, Google Docs)? Analytics (Amplitude, Mixpanel, PostHog)? PM (Linear, Jira, GitHub Issues)? Comms (Slack)? Diagramming (Excalidraw, Miro)?"

For a hypothetical Figma-internal team working on SDS: likely **Slack** for comms, **Linear or GitHub Issues** for PM, possibly **Notion** for internal docs. Agent records each answer into the eventual `team_tooling` map.

For each named tool not in the Known-MCPs table (`known-mcps.md`), the agent offers three options:
- **active** — if MCP is live in session, pull content now
- **install-walkthrough** — if tool is in the known-MCPs install table, give the command + API-key URL
- **pointer-only** — record in `team_tooling` + write a pointer file at the relevant layer

For Figma specifically: `@figma/mcp` is in the known-installs table, but `mcp_servers: []` means it's not configured in this repo. Agent offers:

> "Figma MCP is installable via `npx -y @figma/mcp` with a personal access token from figma.com/developers/api#access-tokens. Want me to walk you through install + write the `.mcp.json` stanza? (A) yes, (B) pointer-only for now, (C) skip"

## Steps 4–8 — the five-layer walk

### Step 4 — Layer 1 (Context)

**Signals:** no docs/ dir, no AGENTS.md, but `.cursor/rules/usage-guidelines.mdc` (16 KB) + `.github/copilot-instructions.md` (16 KB) both have extensive team conventions already. `figma.config.json` suggests Figma is design-system SoT.

**Default action:** **link** (existing material lives in `.cursor/rules/` + `.github/` — respect coexistence, don't absorb).

Agent proposes:

> "Layer 1 — Context. You have rich existing content in `.cursor/rules/usage-guidelines.mdc` + `.github/copilot-instructions.md`. I'll create `docs/context/` with pointer files back to these — originals untouched.
>
> Options:
>   A. Link (default) — pointer files in docs/context/ back to your existing sources
>   B. Critique — apply Tier 1 budget check + bloat detection; surface findings
>   C. Scaffold — write fresh docs/context/ files from our templates (your existing sources stay; hd-* layer is additional)
>   D. Skip"

For the pilot, picking **A (link)**. Agent would write:

- `docs/context/product/one-pager.md` — pointer: `See .github/copilot-instructions.md § "Repository Overview"`
- `docs/context/design-system/cheat-sheet.md` — pointer: `See figma.config.json (Code Connect map) + scripts/tokens/tokens.json (tokens) + .cursor/rules/usage-guidelines.mdc § "Design tokens"`
- `docs/context/conventions/how-we-work.md` — pointer: `See .cursor/rules/usage-guidelines.mdc § "Code patterns"`
- `docs/context/agent-persona.md` — scaffold minimal (no existing persona content to point to; fill via seed questions)

**Checkpoint:** *"Layer 1 linked to existing `.cursor/rules/` + `.github/copilot-instructions.md`. Before Layer 2: (A) review via `/hd:review critique docs/context/`, (B) capture a lesson, (C) inspect, (D) continue to Layer 2."* User picks D.

### Step 5 — Layer 2 (Skills)

**Signals:** `has_external_skills: false`, no `.agent/skills/`, no `.claude/skills/`. SDS doesn't ship team-authored skills.

**Default action:** **skip** (Layer 2 is premature for most teams; revisit when patterns emerge).

> "Layer 2 — Skills. You don't have team-authored AI skills yet. Most teams don't need Layer 2 until patterns clearly recur. Recommend skipping now; revisit when you notice yourself re-prompting the same thing 3+ times.
>
> Options: (A) skip (default), (B) scaffold a starter skill anyway, (C) link existing — N/A here."

User picks A. Skipped recorded in `layer_decisions.layer_2: skip`.

### Step 6 — Layer 3 (Orchestration)

**Signals:** `team_tooling.pm: []` (not yet asked in tool discovery for this pilot — assume filled). No `docs/orchestration/`. Fewer than 3 Layer 2 skills.

**Default action:** **skip** (prerequisite not met — Layer 3 orchestrates Layer 2; no skills to orchestrate).

User picks A (skip).

### Step 7 — Layer 4 (Rubrics)

**Signals:** `has_figma_config: true`, `scripts/tokens/tokens.json` present (manually surfaced), React Aria/Stately dependency. No existing `docs/rubrics/` or `docs/context/design-system/` rubric files.

**Default action:** **scaffold** (tokens + Figma config + React Aria a11y framework all map cleanly to shippable starter rubrics).

Agent proposes:

> "Layer 4 — Rubrics. Given Figma + tokens + React Aria, I'd scaffold:
>   1. `accessibility-wcag-aa` — applies directly (you're already using React Aria)
>   2. `design-system-compliance` — references `scripts/tokens/tokens.json` approved colors + variants
>   3. `interaction-states` — loading/empty/error/success coverage
>   4. `component-budget` — gate for new primitives
>
> Plus the `skill-quality` rubric if/when you author Layer 2 skills.
>
> Options: (A) scaffold all 4 starters (default), (B) pick a subset, (C) link to existing rubric conventions from `.cursor/rules/` if any, (D) skip"

User picks A. Agent would write:
- `docs/rubrics/INDEX.md` — thin pointer to distributed pattern (from `assets/rubrics-index.md.template`)
- `docs/context/design-system/accessibility-wcag-aa.md` — copy of starter + fill-in "team extensions" placeholders
- `docs/context/design-system/design-system-compliance.md` — copy of starter, actual token names read from `scripts/tokens/tokens.json` and referenced by `tokens-package-path: scripts/tokens/tokens.json`
- `docs/context/design-system/component-budget.md`, `interaction-states.md` — copies

**Checkpoint after Layer 4:** User could run `/hd:review critique src/ui/compositions/Button.tsx --rubric design-system-compliance` to validate the rubric against real code. Picking D.

### Step 8 — Layer 5 (Knowledge)

**Signals:** `has_plans_convention: false` (no `docs/plans/` with YYYY-MM-DD-NNN-*-plan.md naming), no existing `docs/knowledge/lessons/`.

**Default action:** **scaffold** (empty dir for go-forward capture).

> "Layer 5 — Knowledge. No existing lesson corpus. I'll scaffold the dir + a starter lesson capturing this setup session. Going forward, use `/hd:compound capture` to record decisions."

Agent writes:
- `docs/knowledge/INDEX.md`
- `docs/knowledge/graduations.md` (empty — awaiting first graduation)
- `docs/knowledge/lessons/2026-04-17-setup-via-hd-setup.md` — the starter lesson (meta — captures "we set up the harness today via /hd:setup, chose link-mode for Layer 1 because Cursor + Copilot already had content")

User picks A.

## Step 9 — Write `design-harnessing.local.md`

Final file content:

```yaml
---
schema_version: "2"
setup_mode: scattered
setup_date: 2026-04-17
team_size: medium    # assumed — Figma team working on SDS
skipped_layers: [2, 3]
coexistence:
  compound_engineering: true
article_read: false  # user proceeded without /hd:onboard
team_tooling:
  design: [figma]
  # docs/comms/pm/diagramming/analytics left empty or populated from Step 3 answers
mcp_servers_at_setup: []
layer_decisions:
  layer_1: link
  layer_2: skip
  layer_3: skip
  layer_4: scaffold
  layer_5: scaffold
other_tool_harnesses_detected:
  - ".cursor/rules/"
  - ".github/copilot-instructions.md"
---

# design-harnessing — local config

Set up 2026-04-17 via /hd:setup walkthrough on figma/sds. Layer 1 was linked to
existing .cursor/rules/ + .github/copilot-instructions.md (respecting those
tool-specific conventions as source-of-truth). Layer 4 rubrics scaffolded with
references to actual tokens in scripts/tokens/tokens.json.

Layer 2 + 3 skipped; team hasn't produced repeated AI-skill patterns yet. Revisit
when prompting patterns recur 3+ times.

Figma MCP not installed; recommended via docs/setup-mcps.md. No Notion/Linear
integration at setup time.
```

## Step 10 — Summary

```
hd:setup complete on figma/sds.

Layer decisions:
  L1 Context:       link      → docs/context/{product,design-system,conventions,agent-persona}/
                                 pointers to .cursor/rules/ + .github/copilot-instructions.md
  L2 Skills:        skip      (no existing, not yet needed)
  L3 Orchestration: skip      (no Layer 2 to orchestrate)
  L4 Rubrics:       scaffold  → 4 starter rubrics in docs/context/design-system/
                                 + docs/rubrics/INDEX.md (distributed pattern)
  L5 Knowledge:     scaffold  → docs/knowledge/{INDEX,graduations,lessons/}
                                 + 1 starter lesson (this setup session)

Other-tool harnesses respected (untouched): .cursor/rules/, .github/copilot-instructions.md

Tier 1 budget: AGENTS.md (scaffolded) + docs/context/product/one-pager.md (pointer) → small; well under 200 lines.

Next: address Layer 4 rubric findings by running `/hd:review critique src/ui/compositions/Button.tsx`
       capture first real lesson as you iterate: `/hd:compound capture`
```

## Pilot validation — what worked + what to fix

### Works well ✓

- **detect.py** correctly flagged `.cursor/rules/` + `.github/copilot-instructions.md` as scattered signal (priority 5)
- **`has_figma_config: true`** correctly detected from `figma.config.json` at root
- **`team_tooling.design: [figma]`** correctly detected from URL references
- **Mode routing** correctly lands on `scattered` (not greenfield, not advanced), which maps to the right layer defaults
- **Layer 1 link-mode** default is the right call for a repo with rich existing Cursor + Copilot content — respects coexistence, avoids duplication
- **Layer 4 scaffold-mode** default fires correctly because tokens are detected — actual token path references would ground the rubric in real code
- **Per-layer checkpoints** (A/B/C/D — review/capture/inspect/continue) let the user slow down at any layer

### Gaps surfaced

**G1 — `has_tokens_package` false negative (P2).** Our detection looks for top-level `tokens/` dir or `style-dictionary.config.*`. SDS has `scripts/tokens/tokens.json` (non-top-level). Missed. Fix: broaden `detect_config_sot()` in `detect.py` to recursive `find tokens.json` up to depth 3, or add `has_tokens_json_anywhere`.

**G2 — React Aria / React Stately not surfaced (P3).** `package.json` dependencies on `react-aria` / `react-stately` / `@react-aria/*` are strong signals that the team uses an accessibility framework. Could auto-suggest `accessibility-wcag-aa` rubric as especially relevant when detected. Enhancement for `detect.py` package-deps parser.

**G3 — Storybook detection correctly deferred to v2 per prior decision** — not a gap, but noted for the v2 scope: SDS has `.storybook/` which is its design-system SSoT. When v2 detection lands, this repo becomes a primary validation target.

**G4 — Tool discovery category questions could be batched (P3 UX).** Agent asks per-category: "Any docs tools? Any analytics? Any PM?" — that's 6 prompts. For faster flows, batch: "What else does your team use across docs / analytics / PM / comms? List any." Let user answer in one message.

**G5 — The Figma-MCP install-walkthrough in Step 3 needs the specific figma config override** — SDS uses `@figma/mcp` dev-mode which needs MCP server URL config (`http://127.0.0.1:3845/sse`). The known-MCPs table mentions the token but not the transport. Fix in `known-mcps.md`: add transport + URL to the Figma entry, matching what plus-marketing-website's `docs/setup-mcps.md` documents.

### Graduation-readiness

**Too-early-to-tell.** This is the first pilot; one data point. The pattern ("default actions per layer based on detection") may need refinement after 3+ more pilots (caricature, oracle-chat, lightning, plus-uno, plus-marketing-website) before graduating anything.

## Next pilots (planned)

Per Bill's direction, the pilot series continues with his 5 repos:
1. plus-marketing-website — team of 3, Notion docs via sync, `.agent/` framework, shadcn MCP
2. caricature — solo, plans-convention, Gemini integration
3. oracle-chat — solo, .claude/ + .agent/, 84 docs
4. lightning — solo, external `.claude/skills/` + `.cursor/skills/`, tokens package, Chinese PDF
5. plus-uno — solo (reference implementation), maximal harness

Each will exercise different signal paths. Validate the link/critique/scaffold defaults work correctly; capture any gaps as lessons.

## See also

- [2026-04-17-self-audit.md](./2026-04-17-self-audit.md) — earlier self-audit of the skill-quality rubric applied to our own skills
- [2026-04-17-v1-smoke-tests.md](./2026-04-17-v1-smoke-tests.md) — plan-hash round-trip + audit-write smoke tests from earlier today
- [docs/plans/2026-04-17-009-v1.1-skill-ideation.md](../../plans/2026-04-17-009-v1.1-skill-ideation.md) — ideation doc that grounded the comprehensive architecture (now implemented)
- Target repo: [github.com/figma/sds](https://github.com/figma/sds)
