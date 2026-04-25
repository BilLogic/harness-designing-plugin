---
title: "MCP bundling with env-var-empty-default lets us ship Connectors without violating advisor-not-installer"
date: 2026-04-25
memory_type: episodic
importance: 4
tags: [mcp, connectors, marketplace, advisor-not-installer, refinement]

applies_to_layers: [l3]
related_rules: [R_2026_04_21_advisor]
related_lessons:
  - 2026-04-21-external-source-fill-path
decision_summary: "When an MCP supports HTTP transport + reads its API key from a header populated by an env var with empty default (${KEY:-}), bundling it in .mcp.json doesn't violate advisor-not-installer. We ship the connection scaffold; user controls auth via their own env var; works in anonymous mode if unset."
result_summary: "Phase 3x ships .mcp.json bundling context7 with the Compound-Engineering-pattern (HTTP url + x-api-key: \\${CONTEXT7_API_KEY:-}). Marketplace listing displays Connectors: 1. Three agents declare opportunistic context7 use with WebSearch/WebFetch fallback."
next_watch: "Future MCPs with the same shape (HTTP transport + env-var auth + anonymous tier) — apply this pattern. MCPs requiring per-user OAuth flows or stdio binary install do NOT fit; defer to recommend-but-don't-bundle (e.g. figma-mcp, notion-mcp)."
rule_candidate: false
rule_ref: R_2026_04_21_advisor  # this lesson refines the rule, doesn't graduate a new one
supersedes: null
superseded_by: null
---

# Lesson

## Context

Post-v2.0.0 we noticed Compound Engineering's marketplace listing showed *"Connectors: 1 (context7)"* — a feature our listing lacked despite our agents (`ai-integration-scout`, `skill-quality-auditor`) being natural beneficiaries of structured library doc lookup.

Initial analysis flip-flopped:
1. **First pass:** "Yes, bundle context7 — improves scout/audit quality." Strong intuition that the value was real.
2. **Second pass:** "No — context7 docs say `--api-key YOUR_API_KEY` is required. Bundling violates `R_2026_04_21_advisor` ('Never wire auth tokens')." Reversed.
3. **Third pass (this lesson):** Inspected Compound's actual `.mcp.json`. Found their pattern uses HTTP transport + `${CONTEXT7_API_KEY:-}` env-var-with-empty-default expansion. **The auth concern was real but I was solving it wrong.** Compound shipped connection scaffold only; user opts into auth via their own env var; works anonymously if unset.

The flip-flop wasn't a bug in the rule — it was a missing pattern in my mental model.

## Decision / Pattern

**Refines `R_2026_04_21_advisor` without amending it:** the rule says "never wire auth tokens." That's still right. The refinement is *what counts as wiring*:

- **Wiring (forbidden):** shipping a hardcoded key, requiring users to fill in `YOUR_API_KEY` placeholder, or auto-installing an OAuth flow on the user's behalf.
- **Not wiring (allowed):** shipping `${KEY:-}` with empty default — we provide the scaffold; user's environment provides (or doesn't provide) the key. We never see, store, or transmit it.

The empty-default fallback is what makes this OK. Without it, an unset env var would error; with it, the request goes through unauthenticated and the MCP either rate-limits or serves anonymous tier.

### Concrete shape (Phase 3x)

```json
{
  "mcpServers": {
    "context7": {
      "type": "http",
      "url": "https://mcp.context7.com/mcp",
      "headers": {
        "x-api-key": "${CONTEXT7_API_KEY:-}"
      }
    }
  }
}
```

Three properties make this work:
1. **HTTP transport** (not stdio/npx) — no local binary install, no `npm install -g` side-effect on the user's machine
2. **`${KEY:-}` empty default** — works without setup; auth is purely additive
3. **Anonymous tier exists** — if the MCP refused all unauthenticated requests, this pattern would still ship a broken-by-default Connector and we'd be back to violating advisor-not-installer

## Result

Phase 3x shipped 2026-04-25:
- `.mcp.json` at repo root with the pattern above
- `agents/research/ai-integration-scout.md` — declares opportunistic context7 use (research mode + classify mode); WebSearch fallback
- `agents/research/article-quote-finder.md` — context7 lookup when corpus URL is on a context7-indexed surface; WebFetch fallback
- `agents/review/skill-quality-auditor.md` — context7 verification of external citation URLs; non-blocking on miss
- README "Installation" section gains a `CONTEXT7_API_KEY` note (optional env var for higher rate limits)
- Marketplace listing now shows "Connectors: 1 (context7)"

## When this pattern applies (and when it doesn't)

**Applies — bundle in `.mcp.json`:**
- HTTP transport MCP
- API key passed via header (or query param)
- Empty-string default produces a working anonymous tier
- No mandatory local binary install
- Examples: context7, possibly future doc-lookup or search MCPs

**Doesn't apply — recommend in README only:**
- Stdio MCP requiring `npm install -g <pkg>` or similar local install (we'd be installing on user's behalf)
- OAuth-required MCP (no anonymous tier; user must complete browser auth flow before any request works)
- Per-user data MCP where anonymous is meaningless (Figma frames are user-specific; Notion pages too)
- Examples: figma-mcp, notion-mcp, github-mcp (auth-mandatory mode)

## Why this isn't a new rule

The discipline is identical to `R_2026_04_21_advisor`. We just learned a sharper test for "is this wiring auth?" — answered by checking whether the user's environment is the source of any credential we ship. If yes (env var with empty default), we're hosting a placeholder, not wiring auth. If no (hardcoded value, required placeholder, or OAuth flow we initiate), we're wiring.

A new rule would be over-codification. The lesson + the existing rule + the example shipped in `.mcp.json` are enough — future contributors looking to add another MCP will read all three and reproduce the pattern.

## Prevention pattern

Before bundling any MCP in `.mcp.json`, walk this checklist:

1. **Transport:** HTTP (✅ no install) or stdio/npx (⚠️ user-side install needed)
2. **Auth shape:** env-var-with-empty-default (✅), hardcoded (❌), required placeholder (❌), OAuth-required (❌)
3. **Anonymous tier:** present + functional (✅), absent (❌)
4. **User-data shape:** generic / public-data (✅), per-user-secret-data (❌)

All four ✅ → bundle. Any ❌ → recommend in README, declare opportunistic use in agents, never bundle.

## Next

- Watch for second-confirmation case (another HTTP-transport + env-var-default MCP we want to bundle). If pattern holds, consider graduating a rule like `R_<date>_mcp_bundling_pattern` codifying the 4-point checklist. Until then, this lesson refines the existing advisor-not-installer rule.
- Document the same checklist in `agents/research/ai-integration-scout.md` so future scout invocations classify discovered MCPs against it (whether they fit the bundle pattern or only the recommend pattern).
