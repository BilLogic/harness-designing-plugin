# External tooling — discovery, access, integration

**Purpose:** spec for how `hd:setup` discovers the team's full tool ecosystem (docs, design, diagramming, analytics, PM, comms) and offers integration paths — MCP, API key, or pointer-only — at Step 1.5 before the five-layer walk.

**Loaded by:** SKILL.md Step 1.5 and `workflows/layer-walk.md` per-layer "link" option.

## Universal principle

**The skill is tool-agnostic.** It never hardcodes a specific tool or vendor. Every tool the skill offers integration with is something the user has (a) already configured, (b) can install themselves, or (c) has credentials for.

Explicitly: if the SKILL session has access to specific MCPs (for example `mcp__notion-plus__*`, `mcp__parsnip__*`), those are **the current user's MCPs**, not something this plug-in provides. Portable plug-in code references MCP servers by **dynamic discovery** (parse `.mcp.json` / check available tools) — never by hardcoded name.

## Six tool categories

`hd:setup` cares about these categories because each maps to one or more of the five harness layers:

| Category | Tools detected by `detect.py` | Typical layer(s) |
|---|---|---|
| **docs** | notion, google_docs, confluence, coda, obsidian | Layer 1 (Context), Layer 5 (Knowledge) |
| **design** | figma, paper, pencildev, sketch | Layer 1 (Context/design-system), Layer 4 (Rubrics) |
| **diagramming** | excalidraw, miro, whimsical, lucidchart, figjam | Layer 1 (Context/system diagrams), Layer 3 (Orchestration) |
| **analytics** | amplitude, mixpanel, posthog, metabase, hotjar, fullstory | Layer 5 (Knowledge via data) |
| **pm** | linear, jira, github_issues, asana, monday | Layer 3 (Orchestration), Layer 5 (Knowledge via decisions) |
| **comms** | slack, discord, loom | Layer 5 (Knowledge via pinned threads, recordings) |

Not every team uses every category. Users tag which tools matter; skill records per-category in `design-harnessing.local.md`.

## Step 1.5 — tool-discovery flow

After mode detection, before layer walk:

### 1. Surface what was detected

```
Detected in your repo:
  docs: notion (2 refs), google_docs (3 refs)
  design: figma (7 refs)
  pm: github_issues
  — nothing detected for: diagramming, analytics, comms

MCP servers configured (from .mcp.json / .cursor/mcp.json):
  shadcn

(MCP servers at session level — your Claude Code global config — aren't
visible to me from the repo; I'll ask per-tool if integration matters.)
```

### 2. Ask per-category — open-ended first

For each category, ask:

> "Any [category] tools your team uses that I missed?"

Even if detection returned nothing, ASK — most teams use analytics and comms tools that never leave URL traces in the repo.

### 3. Per-tool integration triage

For each tool the user confirms (detected OR added manually), decide integration path:

```
For tool <T>:
  A. Is <T>-MCP in session? (check via tool-availability introspection)
     YES → offer "load live content via MCP" (active integration)
  B. Is <T>-MCP configured in repo's mcp.json but not in session?
     OFFER instructions: "your repo declares <T>-MCP but the server isn't
     running in this session. Start it via: <standard start cmd for <T>>"
  C. Is <T>-MCP available as a known install? (Known MCPs list below)
     OFFER walkthrough: "install via `<cmd>`, get API key at <url>, add
     to your mcp.json. Shall I write the mcp.json stanza?"
  D. Otherwise:
     RECORD as a pointer-only source. No live integration; user accesses
     manually; future skill runs see the pointer in team_tooling.
```

### 4. Record decisions

Write `team_tooling:` and `mcp_servers_at_setup:` fields to `design-harnessing.local.md` (schema v2). Never lose the user's answers — re-runs respect prior decisions per the re-run semantics in `workflows/layer-walk.md`.

## Known MCP installs (reference table)

Portable install instructions per tool. Keep this table short and accurate — offer only what's actually maintained. **Never offer a broken or unmaintained MCP.**

| Tool | MCP package | Auth | Reference |
|---|---|---|---|
| notion | `@modelcontextprotocol/server-notion` (varies) | Notion internal integration token | notion.so/help/create-integrations-with-the-notion-api |
| figma | `@figma/mcp` (dev-mode) | Figma personal access token | figma.com/developers/api#access-tokens |
| linear | `@linear/mcp` or community | Linear API key | linear.app/settings/api |
| github (issues) | `@modelcontextprotocol/server-github` | GitHub personal access token | github.com/settings/tokens |
| slack | community packages exist; verify maintenance | Slack bot token | api.slack.com/authentication/token-types |
| google_docs | via google-workspace MCPs (varies) | OAuth or service-account JSON | — |

**When a tool is NOT in this table** but the user says they use it, the skill should:

1. Not offer an install (avoid recommending unknown packages)
2. Record as pointer-only
3. Note in `design-harnessing.local.md` under `team_tooling.<category>.<tool>` with `integration: pointer_only`

User can manually wire up MCP later and re-run `/hd:setup` to upgrade.

## Per-layer integration patterns

How discovered tools map into each layer during `layer-walk.md`:

### Layer 1 (Context)
- **docs (notion/google_docs/confluence)** — offer to pull root-level product pages + classify into `docs/context/product/`, `docs/context/conventions/`
- **design (figma)** — pull variable/token names via `@figma/mcp` and seed `docs/context/design-system/cheat-sheet.md`
- **diagramming** — ask which diagrams are evergreen (architecture / data-flow), add pointer files

### Layer 2 (Skills)
- Rarely external-sourced. If the user has team-specific skill definitions in docs/notion, offer to extract and scaffold as `hd-*` / team-prefix skills.

### Layer 3 (Orchestration)
- **pm (linear/github_issues)** — scan recent labels / workflows for recurring handoff patterns; seed `docs/orchestration/workflows.md`
- **diagramming** — link to sequence/state diagrams

### Layer 4 (Rubrics)
- **design (figma)** — component + variant inventory → seed component-budget rubric
- **design + tokens package** → seed design-system-compliance rubric with actual token names

### Layer 5 (Knowledge)
- **docs (notion)** — scan for "retro" / "decision" / "post-mortem" labels → optional lesson imports
- **analytics (amplitude/posthog)** — ask whether user wants analytics-driven lessons (e.g., "add a lesson when bounce-rate on X jumps > Y%")
- **comms (slack)** — pinned threads as lesson seeds (manual for v1.1; MCP-automated for v1.2+)
- **pm (linear/github_issues)** — closed issues with `design-decision` label → lesson candidates

## When the user says "I don't know"

A valid answer. Default path:

1. Record `team_tooling: {}` + proceed with scaffolding
2. Note in `design-harnessing.local.md` prose section: "user was unsure about external tooling at setup; re-run `/hd:setup --discover-tools` when curious"
3. Do NOT block the layer walk on tool discovery

## Fallback seeds (when user has no external sources)

For teams that answer "nothing external, everything in the repo" — draw Layer 4 rubric seeds from established design systems:

- **Material Design 3** — [m3.material.io/foundations](https://m3.material.io/foundations) — token scales, interaction states, accessibility minima
- **Fluent 2** — [fluent2.microsoft.design/accessibility](https://fluent2.microsoft.design/accessibility) — a11y-first baselines
- **awesome-design-md** — [github.com/VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) — curated cheat-sheet patterns

The starter rubrics shipped in `skills/hd-review/templates/starter-rubrics/` already absorb baseline principles from these sources. Offering "adapt a starter" is the lightest path for teams with no external SoT.

## What this reference does NOT cover

- **Which specific MCP package to install** — only the `Known MCP installs` table above. Outside that, defer to user research.
- **MCP server authentication details** — point to upstream docs, don't duplicate
- **Tool-specific layer guides** — those belong in each layer's reference file (`layer-1-context.md`, `layer-5-knowledge.md`, etc.)

## See also

- [`local-md-schema.md`](local-md-schema.md) — where `team_tooling` + `mcp_servers_at_setup` land
- [`../workflows/layer-walk.md`](../workflows/layer-walk.md) — per-layer integration step uses this reference
- [`../scripts/detect.py`](../scripts/detect.py) — emits raw detection data this reference interprets
- Ideation doc [`docs/plans/2026-04-17-009-v1.1-skill-ideation.md`](../../../docs/plans/2026-04-17-009-v1.1-skill-ideation.md) C5 / C6 — rationale for this spec
