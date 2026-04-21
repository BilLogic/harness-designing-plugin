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

Pre-verified rows that let `ai-integration-scout` return without hitting the web. `scout` appends new rows when Phase 2 finds high-confidence integrations. **Never rewrite or reorder existing rows** — append-only, one source of truth.

`cache_schema_version: "1"` — bump when category taxonomy or prompt shape changes; invalidates stale rows. Current categories: `cli | data_api | analytics | observability | auth | docs | design | pm | comms | framework-internal | not-ai-relevant | uncategorized`.

### Seeded cache entries (top-20, curated 2026-04-21 per Phase 3o.2)

```yaml
- tool_name: notion
  categories: { primary: docs, secondary: [], all: [docs] }
  classified_at: "2026-04-21"
  classifier_version: "1"
  source: curated
  confidence: 1.0
  integrations:
    mcp: { package: "varies (verify currency)", install_docs: "https://notion.so/help/create-integrations-with-the-notion-api", maintained: true, notes: "Notion internal integration token" }
    cli: null
    api: { docs_url: "https://developers.notion.com/reference/intro", notes: "Official Notion API" }

- tool_name: figma
  categories: { primary: design, secondary: [], all: [design] }
  classified_at: "2026-04-21"
  classifier_version: "1"
  source: curated
  confidence: 1.0
  integrations:
    mcp: { package: "@figma/mcp", install_docs: "https://figma.com/developers/dev-mode-mcp-server", maintained: true, notes: "Dev-mode MCP (local SSE on port 3845); requires Figma desktop" }
    cli: null
    api: { docs_url: "https://figma.com/developers/api", notes: "REST API + dev-mode SDK" }

- tool_name: linear
  categories: { primary: pm, secondary: [], all: [pm] }
  classified_at: "2026-04-21"
  classifier_version: "1"
  source: curated
  confidence: 1.0
  integrations:
    mcp: { package: "community + @linear/mcp when shipped", install_docs: "https://linear.app/docs/mcp", maintained: true, notes: "Confirm currency; multiple community packages" }
    cli: null
    api: { docs_url: "https://linear.app/developers/graphql", notes: "GraphQL API" }

- tool_name: github
  categories: { primary: pm, secondary: [data_api], all: [pm, data_api] }
  classified_at: "2026-04-21"
  classifier_version: "1"
  source: curated
  confidence: 1.0
  integrations:
    mcp: { package: "@modelcontextprotocol/server-github", install_docs: "https://github.com/settings/tokens", maintained: true, notes: "Fine-grained token with repo + issues scopes" }
    cli: { install_docs: "https://cli.github.com/", notes: "gh CLI; wrap as L2 skill for PR automation" }
    api: { docs_url: "https://docs.github.com/en/rest", notes: "REST + GraphQL" }

- tool_name: supabase
  categories: { primary: data_api, secondary: [cli, auth], all: [data_api, cli, auth] }
  classified_at: "2026-04-21"
  classifier_version: "1"
  source: curated
  confidence: 1.0
  integrations:
    mcp: { package: null, install_docs: "https://supabase.com/docs/guides/getting-started/mcp", maintained: true, notes: "Supabase MCP for database query + schema inspection" }
    cli: { install_docs: "https://supabase.com/docs/guides/cli", notes: "Local dev + migrations + types codegen" }
    api: { docs_url: "https://supabase.com/docs/reference/api", notes: "REST + GraphQL + auth" }

- tool_name: firebase
  categories: { primary: data_api, secondary: [analytics, auth], all: [data_api, analytics, auth] }
  classified_at: "2026-04-21"
  classifier_version: "1"
  source: curated
  confidence: 1.0
  integrations:
    mcp: null
    cli: { install_docs: "https://firebase.google.com/docs/cli", notes: "firebase-tools for deploy + emulators" }
    api: { docs_url: "https://firebase.google.com/docs", notes: "Auth + Firestore + Realtime DB + Analytics" }

- tool_name: vercel
  categories: { primary: cli, secondary: [observability], all: [cli, observability] }
  classified_at: "2026-04-21"
  classifier_version: "1"
  source: curated
  confidence: 1.0
  integrations:
    mcp: null
    cli: { install_docs: "https://vercel.com/docs/cli", notes: "Deploy + preview + logs; wrap as L2 deploy-preview skill" }
    api: { docs_url: "https://vercel.com/docs/rest-api", notes: "Deployment + project REST API" }

- tool_name: netlify
  categories: { primary: cli, secondary: [observability], all: [cli, observability] }
  classified_at: "2026-04-21"
  classifier_version: "1"
  source: curated
  confidence: 1.0
  integrations:
    mcp: null
    cli: { install_docs: "https://docs.netlify.com/cli/get-started/", notes: "netlify-cli for deploy + functions" }
    api: { docs_url: "https://docs.netlify.com/api/get-started/", notes: "Deployment REST API" }

- tool_name: stripe
  categories: { primary: data_api, secondary: [cli], all: [data_api, cli] }
  classified_at: "2026-04-21"
  classifier_version: "1"
  source: curated
  confidence: 1.0
  integrations:
    mcp: null
    cli: { install_docs: "https://docs.stripe.com/stripe-cli", notes: "stripe CLI for webhook testing + events" }
    api: { docs_url: "https://docs.stripe.com/api", notes: "Payments + subscriptions API" }

- tool_name: sentry
  categories: { primary: observability, secondary: [], all: [observability] }
  classified_at: "2026-04-21"
  classifier_version: "1"
  source: curated
  confidence: 1.0
  integrations:
    mcp: null
    cli: { install_docs: "https://docs.sentry.io/product/cli/", notes: "sentry-cli for source-map upload + releases" }
    api: { docs_url: "https://docs.sentry.io/api/", notes: "Issue + event REST API" }

- tool_name: slack
  categories: { primary: comms, secondary: [], all: [comms] }
  classified_at: "2026-04-21"
  classifier_version: "1"
  source: curated
  confidence: 1.0
  integrations:
    mcp: { package: "community (verify currency)", install_docs: "https://api.slack.com/authentication/token-types", maintained: true, notes: "Bot token; community packages vary" }
    cli: null
    api: { docs_url: "https://api.slack.com/web", notes: "Web API + Events API" }

- tool_name: amplitude
  categories: { primary: analytics, secondary: [], all: [analytics] }
  classified_at: "2026-04-21"
  classifier_version: "1"
  source: curated
  confidence: 1.0
  integrations:
    mcp: null
    cli: null
    api: { docs_url: "https://www.docs.developers.amplitude.com/", notes: "Event tracking + export API" }

- tool_name: mixpanel
  categories: { primary: analytics, secondary: [], all: [analytics] }
  classified_at: "2026-04-21"
  classifier_version: "1"
  source: curated
  confidence: 1.0
  integrations:
    mcp: null
    cli: null
    api: { docs_url: "https://developer.mixpanel.com/reference/overview", notes: "Event ingest + query API" }

- tool_name: posthog
  categories: { primary: analytics, secondary: [observability], all: [analytics, observability] }
  classified_at: "2026-04-21"
  classifier_version: "1"
  source: curated
  confidence: 1.0
  integrations:
    mcp: null
    cli: null
    api: { docs_url: "https://posthog.com/docs/api", notes: "Events + session recording + feature flags" }

- tool_name: aws_amplify
  categories: { primary: data_api, secondary: [auth, cli], all: [data_api, auth, cli] }
  classified_at: "2026-04-21"
  classifier_version: "1"
  source: curated
  confidence: 1.0
  integrations:
    mcp: null
    cli: { install_docs: "https://docs.amplify.aws/gen2/build-a-backend/cli/", notes: "amplify-cli for backend provisioning" }
    api: { docs_url: "https://docs.amplify.aws/", notes: "GraphQL + REST via amplify-js; auth + storage + API" }

- tool_name: hasura
  categories: { primary: data_api, secondary: [], all: [data_api] }
  classified_at: "2026-04-21"
  classifier_version: "1"
  source: curated
  confidence: 1.0
  integrations:
    mcp: null
    cli: { install_docs: "https://hasura.io/docs/latest/hasura-cli/overview/", notes: "hasura-cli for migrations + metadata" }
    api: { docs_url: "https://hasura.io/docs/latest/api-reference/overview/", notes: "GraphQL auto-generated from schema" }

- tool_name: airtable
  categories: { primary: data_api, secondary: [], all: [data_api] }
  classified_at: "2026-04-21"
  classifier_version: "1"
  source: curated
  confidence: 1.0
  integrations:
    mcp: null
    cli: null
    api: { docs_url: "https://airtable.com/developers/web/api/introduction", notes: "REST API + Scripting SDK" }

- tool_name: sanity
  categories: { primary: data_api, secondary: [cli], all: [data_api, cli] }
  classified_at: "2026-04-21"
  classifier_version: "1"
  source: curated
  confidence: 1.0
  integrations:
    mcp: null
    cli: { install_docs: "https://www.sanity.io/docs/cli", notes: "sanity CLI for schema + dataset + deploy" }
    api: { docs_url: "https://www.sanity.io/docs/http-api", notes: "GROQ + REST + Webhook" }

- tool_name: contentful
  categories: { primary: data_api, secondary: [], all: [data_api] }
  classified_at: "2026-04-21"
  classifier_version: "1"
  source: curated
  confidence: 1.0
  integrations:
    mcp: null
    cli: { install_docs: "https://www.contentful.com/developers/docs/tutorials/cli/installation/", notes: "contentful-cli for migrations" }
    api: { docs_url: "https://www.contentful.com/developers/docs/references/", notes: "Content Delivery + Management API" }

- tool_name: confluence
  categories: { primary: docs, secondary: [], all: [docs] }
  classified_at: "2026-04-21"
  classifier_version: "1"
  source: curated
  confidence: 1.0
  integrations:
    mcp: { package: "community; verify currency", install_docs: "https://www.atlassian.com/mcp", maintained: true, notes: "Atlassian MCP covers Confluence + Jira" }
    cli: null
    api: { docs_url: "https://developer.atlassian.com/cloud/confluence/rest/v2/intro/", notes: "REST v2 API" }
```

### Scout-written entries (appended on Phase 2 cache write-back)

Scout appends rows here with `source: "web-search"` or `"rule-based"`. Entries may include a `needs_review: true` flag when confidence is in the 0.6–0.8 band.

<!-- scout appends below this line -->

### Legacy short-form table (deprecated, kept for eyeball audit)

| Tool | Summary |
|---|---|
| notion | docs — see seeded entry above |
| figma | design — see seeded entry above |
| linear | pm — see seeded entry above |
| github | pm + data_api — see seeded entry above |
| slack | comms — see seeded entry above |
| google_docs | docs — no official MCP as of 2026-04 |

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
