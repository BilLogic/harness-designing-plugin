# External tooling — categories, scout cache, fallback seeds

**Purpose:** this file is the **seeded cache** for the [`ai-integration-scout`](../../../agents/research/ai-integration-scout.md) sub-agent. Lists the 8 tool categories `hd:setup` cares about, pre-seeded rows for common tools (so the scout returns fast without a web search), and fallback seed sources for teams without external sources.

**Cache, not gate.** Rows below are **hand-verified seeds** for fast cache hits. `ai-integration-scout` appends new rows on successful web finds (Phase 4 cache write-back). Never rely on this file as a whitelist — always dispatch the scout for fresh or uncached tools.

**Loaded by:**
- [`ai-integration-scout`](../../../agents/research/ai-integration-scout.md) on Phase 1 cache lookup
- [`per-layer-procedure.md § Fill path`](per-layer-procedure.md) for category-to-layer mapping
- [SKILL.md § Step 3 — Scan summary](../SKILL.md#step-3--scan-summary) for the detected tool list

## Universal principle

**The plug-in is an advisor, not an installer.** We scan, we ask, we research, and we link to official install docs. The user installs themselves, wires up their own auth, and decides what to adopt. Parallel path: users can paste or drop content into layer folders and ask the plug-in to organize — no MCP/CLI wire-up needed.

The skill is also **tool-agnostic.** It never hardcodes a specific tool or vendor at runtime. Every tool the skill discusses is something the user has (a) already configured, (b) can install themselves, or (c) has credentials for.

Explicitly: if the SKILL session has access to specific MCPs (for example `mcp__notion-plus__*`, `mcp__parsnip__*`), those are **the current user's MCPs**, not something this plug-in provides. Portable plug-in code references MCP servers by **dynamic discovery** (parse `.mcp.json` / check available tools) — never by hardcoded name.

## Eight tool categories (v5, 3n.7)

`hd:setup` cares about these categories because each maps to one or more of the five harness layers:

| Category | Tools detected by `detect.py` | Typical layer(s) |
|---|---|---|
| **docs** | notion, google_docs, confluence, coda, obsidian | Layer 1 (Context), Layer 5 (Knowledge) |
| **design** | figma, paper, pencildev, sketch | Layer 1 (Context/design-system), Layer 4 (Rubrics) |
| **diagramming** | excalidraw, miro, whimsical, lucidchart, figjam | Layer 1 (Context/system diagrams), Layer 3 (Orchestration) |
| **analytics** | amplitude, mixpanel, posthog, metabase, hotjar, fullstory | Layer 5 (Knowledge via data) |
| **pm** | linear, jira, github_issues, asana, monday | Layer 3 (Orchestration), Layer 5 (Knowledge via decisions) |
| **comms** | slack, discord, loom | Layer 5 (Knowledge via pinned threads, recordings) |
| **cli** | vercel, supabase, wrangler, fly, railway, turbo, nx, sentry, stripe | Layer 2 (Skills wrap deploys/migrations), Layer 3 (Orchestration sequences) |
| **data_api** | supabase, firebase, hasura, airtable, strapi, sanity, contentful | Layer 1 (canonical product facts), Layer 5 (event data → lessons) |

Not every team uses every category. Users tag which tools matter; skill records per-category in `hd-config.md`.

## Integration-path triage (3 paths, post-3n.4)

When a user names a tool during per-layer EXECUTE, one of three integration paths applies:

| Condition | Path | Action |
|---|---|---|
| Tool's MCP is live in session (callable as a tool) | **active** | Offer to pull live content during relevant layer scaffolding |
| Scout found AI support (MCP / CLI / API) with verified install docs | **available** | Report findings inline + link install docs; user installs later; record pointer file now |
| Scout found nothing concrete (or no web search available) | **pointer-only** | Record in `team_tooling` + write a pointer file at the relevant layer |

The plug-in never walks the user through an install. When a path is `available`, the chat response is "here's where to install it" — not "run these commands."

## Seeded cache (scout reads + writes here)

Pre-verified rows that let `ai-integration-scout` return without hitting the web. `scout` appends new rows when Phase 2 finds high-confidence integrations. Never rewrite or reorder existing rows.

| Tool | Package | Auth | Reference |
|---|---|---|---|
| notion | `@modelcontextprotocol/server-notion` (varies) | Notion internal integration token | [notion.so/help/create-integrations-with-the-notion-api](https://notion.so/help/create-integrations-with-the-notion-api) |
| figma | `@figma/mcp` (dev-mode, runs locally on port 3845) | Figma personal access token | [figma.com/developers/api#access-tokens](https://figma.com/developers/api#access-tokens) |
| linear | `@linear/mcp` or community | Linear API key | [linear.app/settings/api](https://linear.app/settings/api) |
| github (issues) | `@modelcontextprotocol/server-github` | GitHub personal access token | [github.com/settings/tokens](https://github.com/settings/tokens) |
| slack | community packages exist; verify maintenance | Slack bot token | [api.slack.com/authentication/token-types](https://api.slack.com/authentication/token-types) |
| google_docs | via google-workspace MCPs (varies) | OAuth or service-account JSON | — |

**When a tool is NOT in this cache** but the user says they use it:

1. Dispatch `ai-integration-scout` to research the tool (Phase 2 web search)
2. If scout finds a high-confidence integration → `available` path; report the install-docs URL + summary; scout writes a new cache row for next time
3. If scout finds nothing concrete → `pointer-only` path; record in `hd-config.md` under `team_tooling.<category>`

The plug-in never walks through an install. User reads the docs and wires it up themselves when ready. Re-running `/hd:setup --discover-tools` after install upgrades the path from `pointer-only` → `active`.

## Per-tool docs pointer (for the scout to link back to)

Each row below is a cache entry — the fastest-to-link official install docs per tool. The plug-in **links** to these; user installs themselves.

### figma (dev-mode)

Local SSE server spawned by Figma desktop. Install docs: [figma.com/developers/dev-mode-mcp-server](https://figma.com/developers/dev-mode-mcp-server). Auth: Figma personal access token ([figma.com/developers/api#access-tokens](https://figma.com/developers/api#access-tokens)).

### notion

Notion's own integration docs: [notion.so/help/create-integrations-with-the-notion-api](https://notion.so/help/create-integrations-with-the-notion-api). MCP package varies — point the user at the official Notion MCP guide for the current maintained option.

### linear

Linear API setup: [linear.app/settings/api](https://linear.app/settings/api). MCP docs: [linear.app/docs/mcp](https://linear.app/docs/mcp) (confirm currency; community alternatives exist).

### github (issues)

Token setup: [github.com/settings/tokens](https://github.com/settings/tokens) — fine-grained token with `repo` + `issues` scopes. MCP server docs: upstream `@modelcontextprotocol/server-github` README.

### supabase

MCP guide: [supabase.com/docs/guides/getting-started/mcp](https://supabase.com/docs/guides/getting-started/mcp). Also supports CLI ([supabase.com/docs/guides/cli](https://supabase.com/docs/guides/cli)) and REST/GraphQL API.

### vercel

No official MCP at time of seeding — surface as `cli` with deploy-skill wrapper opportunity. Install docs: [vercel.com/docs/cli](https://vercel.com/docs/cli). REST API: [vercel.com/docs/rest-api](https://vercel.com/docs/rest-api).

### slack, google_docs

Package maintenance varies over time. The scout must verify before recommending — on miss, fall back to `pointer-only` (record workspace/folder URLs at the relevant layer; user accesses manually).

## Per-layer integration patterns

How discovered tools map into each layer during `five-layer-walk.md`:

### Layer 1 (Context)
- **docs (notion/google_docs/confluence)** — offer to pull root-level product pages + classify into `docs/context/product/`, `docs/context/conventions/`
- **design (figma)** — pull variable/token names via `@figma/mcp` and seed `docs/context/design-system/cheat-sheet.md`
- **diagramming** — ask which diagrams are evergreen (architecture / data-flow), add pointer files

### Layer 1 (Context) — new in v5
- **data_api (supabase/firebase/hasura/sanity/contentful)** — canonical product facts (schema, tables, content types) feed `docs/context/product/` + `docs/context/engineering/`

### Layer 2 (Skills)
- Rarely external-sourced. If the user has team-specific skill definitions in docs/notion, offer to extract and create as `hd-*` / team-prefix skills.
- **cli (vercel/supabase/wrangler/stripe)** — wrap high-traffic commands as L2 skills (e.g. `deploy-preview.md` wraps `vercel --target preview`; `db-migration.md` wraps `supabase migration new`)

### Layer 3 (Orchestration)
- **pm (linear/github_issues)** — scan recent labels / workflows for recurring handoff patterns; seed `docs/orchestration/workflows.md`
- **cli chains (turbo/nx)** — mono-repo task graphs hint at orchestration sequences
- **diagramming** — scaffold pointers to sequence/state diagrams

### Layer 4 (Rubrics)
- **design (figma)** — component + variant inventory → seed component-budget rubric
- **design + tokens package** → seed design-system-compliance rubric with actual token names

### Layer 5 (Knowledge)
- **docs (notion)** — scan for "retro" / "decision" / "post-mortem" labels → optional lesson imports
- **analytics (amplitude/posthog)** — ask whether user wants analytics-driven lessons (e.g., "add a lesson when bounce-rate on X jumps > Y%")
- **data_api (supabase events, firebase analytics)** — event streams as lesson seeds (pattern: "when metric X drifts, log a lesson")
- **comms (slack)** — pinned threads as lesson seeds (manual for v1.1; MCP-automated for v1.2+)
- **pm (linear/github_issues)** — closed issues with `design-decision` label → lesson candidates
- **cli (sentry)** — error trend seeds for L5 quality lessons

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

- **Installation procedure for any tool.** We link to official docs; users install themselves. The plug-in is an advisor, not an installer.
- **MCP server authentication details** — point to upstream docs, don't duplicate
- **Tool-specific layer guides** — those belong in each layer's reference file (`layer-1-context.md`, `layer-5-knowledge.md`, etc.)

## See also

- [`../../../agents/research/ai-integration-scout.md`](../../../agents/research/ai-integration-scout.md) — the scout agent that reads + writes this cache
- [`hd-config-schema.md`](hd-config-schema.md) — where `team_tooling` + `mcp_servers_at_setup` land
- [`per-layer-procedure.md`](per-layer-procedure.md) — fill-path sub-routine that dispatches scout on-demand
- [`../scripts/detect.py`](../scripts/detect.py) — emits raw detection data; includes v5 `cli` + `data_api` categories
- Phase 3n plan: [`../../../docs/plans/2026-04-21-001-feat-phase-3n-external-source-fill-path-plan.md`](../../../docs/plans/2026-04-21-001-feat-phase-3n-external-source-fill-path-plan.md) — rationale for cache reframe + scout pattern
