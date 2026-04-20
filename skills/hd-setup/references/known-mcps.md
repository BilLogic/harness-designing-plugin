# External tooling — categories, known MCPs, fallback seeds

**Purpose:** reference spec consulted during the tool-discovery phase of [SKILL.md § Step 3 — Tool discovery](../SKILL.md#step-3--tool-discovery). Lists the 6 tool categories `hd:setup` cares about, the known-installable MCP table (the only MCPs we recommend), and fallback seed sources for teams without external sources.

**Loaded by:** [SKILL.md § Step 3 — Tool discovery](../SKILL.md#step-3--tool-discovery) and [SKILL.md § Per-layer procedure](../SKILL.md#per-layer-procedure-applied-to-layers-15) during tool discovery (ordered procedural steps live there — this file is reference material only).

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

Not every team uses every category. Users tag which tools matter; skill records per-category in `hd-config.md`.

## Integration-path triage table

When the tool-discovery step (in [SKILL.md § Step 3 — Tool discovery](../SKILL.md#step-3--tool-discovery)) encounters a tool, one of four integration paths applies:

| Condition | Path | Action |
|---|---|---|
| Tool's MCP is live in session (callable as a tool) | **active** | Offer to pull live content during relevant layer scaffolding |
| Tool's MCP is listed in `detect.py mcp_servers` (configured in `.mcp.json` / `.cursor/mcp.json`) but not live in session | **start-server** | Give the standard start command; user starts it + re-invokes or continues without live content |
| Tool is in the Known MCP installs table below but nothing configured yet | **install-walkthrough** | Share install command + API-key URL; offer to write the mcp.json stanza |
| Tool user named but NOT in Known table | **pointer-only** | Record in `team_tooling` + write a pointer file at the relevant layer; no MCP install offered |

**Never recommend an MCP package that isn't in the Known table** — broken or unmaintained packages create worse UX than pointer-only.

## Known MCP installs

Portable install instructions per tool. Keep this table short and accurate — offer only what's actually maintained. **Never offer a broken or unmaintained MCP.** Each row here has a corresponding detail subsection below with full install + wire-up + auth instructions.

| Tool | Package | Auth | Reference |
|---|---|---|---|
| notion | `@modelcontextprotocol/server-notion` (varies) | Notion internal integration token | [notion.so/help/create-integrations-with-the-notion-api](https://notion.so/help/create-integrations-with-the-notion-api) |
| figma | `@figma/mcp` (dev-mode, runs locally on port 3845) | Figma personal access token | [figma.com/developers/api#access-tokens](https://figma.com/developers/api#access-tokens) |
| linear | `@linear/mcp` or community | Linear API key | [linear.app/settings/api](https://linear.app/settings/api) |
| github (issues) | `@modelcontextprotocol/server-github` | GitHub personal access token | [github.com/settings/tokens](https://github.com/settings/tokens) |
| slack | community packages exist; verify maintenance | Slack bot token | [api.slack.com/authentication/token-types](https://api.slack.com/authentication/token-types) |
| google_docs | via google-workspace MCPs (varies) | OAuth or service-account JSON | — |

**When a tool is NOT in this table** but the user says they use it, the skill should:

1. Not offer an install (avoid recommending unknown packages)
2. Record as pointer-only
3. Note in `hd-config.md` under `team_tooling.<category>.<tool>` with `integration: pointer_only`

User can manually wire up MCP later and re-run `/hd:setup` to upgrade.

## Per-tool install detail

### figma (dev-mode)

Figma MCP runs as a **local SSE server** spawned by Figma desktop or via `npx`. Claude Code connects over SSE to `localhost:3845`.

**1. Get an access token.** [figma.com/developers/api#access-tokens](https://figma.com/developers/api#access-tokens) — create a personal access token with "File content" scope minimum.

**2. Start the local server.** Two paths:
- **Figma desktop (recommended):** enable *Preferences → Enable Dev Mode MCP Server*. Figma starts the local server automatically when a design file is open.
- **Standalone:** `npx -y @figma/mcp` in a separate terminal.

Both expose the SSE endpoint at `http://127.0.0.1:3845/sse`.

**3. Wire Claude Code.**

```bash
claude mcp add --transport sse figma-dev-mode-mcp-server http://127.0.0.1:3845/sse
```

**4. Wire Cursor** (if also used). Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "figma-dev-mode": {
      "transport": "sse",
      "url": "http://127.0.0.1:3845/sse"
    }
  }
}
```

**5. Verify.** In Claude Code, the MCP should register as `figma-dev-mode-mcp-server` with tools like `get_code`, `get_variable_defs`, `get_screenshot`. Test with: "List the variable definitions from my current Figma selection."

**Troubleshooting:** if `claude mcp list` shows the server but tools don't appear, confirm Figma desktop is running AND a file is open (the server only runs while a file is active).

### notion

**1. Create an integration.** [notion.so/help/create-integrations-with-the-notion-api](https://notion.so/help/create-integrations-with-the-notion-api) — internal integration, grab the integration token.

**2. Share the relevant pages** with the integration (Notion's permissions model is share-per-page, not workspace-wide).

**3. Install + wire.** Package varies — recent options: `@suekou/mcp-notion-server`, or OpenAPI-based `@modelcontextprotocol/server-notion`. Confirm the package is currently maintained before recommending. Once chosen:

```bash
claude mcp add notion npx -y <package-name> --auth-token $NOTION_TOKEN
```

### linear

**1. Get API key.** [linear.app/settings/api](https://linear.app/settings/api) — personal API key.

**2. Install + wire.** Official-ish package: `@tacticlaunch/mcp-linear` or `@linear/mcp` if/when it ships. Wire:

```bash
claude mcp add linear npx -y <package-name> --auth-token $LINEAR_API_KEY
```

### github (issues)

**1. Get personal access token.** [github.com/settings/tokens](https://github.com/settings/tokens) — fine-grained token with `repo` and `issues` scopes.

**2. Install + wire.**

```bash
claude mcp add github npx -y @modelcontextprotocol/server-github --auth-token $GITHUB_TOKEN
```

### slack, google_docs

Packages vary in maintenance status. **Verify currency** before recommending to a user. If unsure, fall back to pointer-only (record the Slack workspace URL / Google Drive folder URL as a Layer 1 or Layer 5 pointer; user accesses manually).

## Per-layer integration patterns

How discovered tools map into each layer during `five-layer-walk.md`:

### Layer 1 (Context)
- **docs (notion/google_docs/confluence)** — offer to pull root-level product pages + classify into `docs/context/product/`, `docs/context/conventions/`
- **design (figma)** — pull variable/token names via `@figma/mcp` and seed `docs/context/design-system/cheat-sheet.md`
- **diagramming** — ask which diagrams are evergreen (architecture / data-flow), add pointer files

### Layer 2 (Skills)
- Rarely external-sourced. If the user has team-specific skill definitions in docs/notion, offer to extract and create as `hd-*` / team-prefix skills.

### Layer 3 (Orchestration)
- **pm (linear/github_issues)** — scan recent labels / workflows for recurring handoff patterns; seed `docs/orchestration/workflows.md`
- **diagramming** — scaffold pointers to sequence/state diagrams

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
2. Note in `hd-config.md` prose section: "user was unsure about external tooling at setup; re-run `/hd:setup --discover-tools` when curious"
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

- [`hd-config-schema.md`](hd-config-schema.md) — where `team_tooling` + `mcp_servers_at_setup` land
- [`../SKILL.md § Per-layer procedure`](../SKILL.md#per-layer-procedure-applied-to-layers-15) — per-layer integration step uses this reference
- [`../scripts/detect.py`](../scripts/detect.py) — emits raw detection data this reference interprets
- Ideation doc [`docs/plans/2026-04-17-009-v1.1-skill-ideation.md`](../../../docs/plans/2026-04-17-009-v1.1-skill-ideation.md) C5 / C6 — rationale for this spec
