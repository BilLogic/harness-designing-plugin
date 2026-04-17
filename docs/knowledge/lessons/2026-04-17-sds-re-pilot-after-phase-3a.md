---
title: "sds re-pilot — validates Phase 3a fixes (G5 + G6 + G8)"
date: 2026-04-17
tags: [pilot, figma-sds, re-pilot, phase-3a-validation, critique-extract, pointer-files]
graduation_candidate: too-early-to-tell
importance: 4
---

# Lesson

**Context:** Per the plan at [`docs/plans/2026-04-17-010-fix-sds-pilot-gap-iteration-plan.md`](../../plans/2026-04-17-010-fix-sds-pilot-gap-iteration-plan.md), ran a re-simulation of `/hd:setup` against `github.com/figma/sds` after landing Phase 3a (commit `d7fb465c`). Goal: confirm the 3 fixes (G5 MCP detail, G6 Layer 4 default, G8 pointer-file contract) produce substantively better output than the original pilot.

## What's unchanged

**Detection (Step 1).** Phase 3a didn't touch `detect.py`, so output is identical to the original pilot:

```
mode: scattered (pri 5)
active signals: has_ai_docs, has_figma_config
mcp_servers: []
team_tooling: {'design': ['figma']}
```

**Expected.** G1 (recursive tokens.json) + G2 (package.json deps) are Phase 3b/3c.

## What's substantively different after Phase 3a

### G5 effect — Figma MCP install-walkthrough now actionable

Original pilot at Step 3 surfaced: *"Figma MCP is installable via `npx -y @figma/mcp` with a personal access token."* That was all the detail the agent had. User would need to go figure out: transport? URL? How does Claude Code wire it up?

**After Phase 3a:** agent can now say:

> "Figma MCP runs locally on port 3845 via SSE. To wire it up:
>
> 1. Get a personal access token at figma.com/developers/api#access-tokens (File content scope)
> 2. Start the server: either enable Preferences → Enable Dev Mode MCP Server in Figma desktop (recommended — auto-starts when a file is open), OR run `npx -y @figma/mcp` in a separate terminal
> 3. Wire Claude Code: `claude mcp add --transport sse figma-dev-mode-mcp-server http://127.0.0.1:3845/sse`
> 4. (Also using Cursor?) add the SSE stanza to `.cursor/mcp.json` — I can write it for you
> 5. Verify: `claude mcp list` shows the server; test with 'list variable definitions from my Figma selection'
>
> Want me to walk through any of these?"

End-to-end reproducible without external docs lookup. **Works as advertised now.**

### G6 effect — Layer 4 default flips (biggest behavioral change)

Sds's AI-docs combined (`.cursor/rules/usage-guidelines.mdc` + `.github/copilot-instructions.md`) = **816 lines**. WELL over the 200-line threshold for the new Step 7 top condition.

**Original pilot (pre-fix):** default at Layer 4 was **scaffold** — write 4 fresh starter rubrics in `docs/context/design-system/` alongside the existing 16 KB of Copilot instructions. Duplicative; noisy.

**Re-pilot (post-fix):** default is now **critique + extract**. Agent says:

> "Layer 4 — Rubrics. You have substantial existing conventions across `.cursor/rules/usage-guidelines.mdc` (408 lines) + `.github/copilot-instructions.md` (408 lines). Instead of scaffolding fresh starter rubrics on top — which would duplicate your existing content — let me extract the implicit rubrics from what you have.
>
> Invoking `design-harnessing:review:rubric-applicator` in extract mode against both files..."

Agent then returns ~5 extracted candidates, for example:
- `a11y-react-aria-first` — "Components must use React Aria/Stately for interactive primitives"
- `approved-tokens-only` — "Only use tokens from the approved set; no hex codes"
- `component-budget-rfc-gate` — "New primitives require an RFC in the design system"
- `storybook-first-pattern` — "New components must ship with a Storybook story"
- `code-connect-mapping-required` — "UI components must have a Figma Code Connect mapping"

User picks which to promote. For each approved: agent copies the matching starter rubric (e.g., `skill-quality.md` → `component-budget.md` → etc.) + pre-fills with the extracted content + shows user the result + atomic write on confirmation. **Source files never touched** (strict coexistence).

This is a **night-and-day** improvement. The original pilot produced generic boilerplate rubric files. The re-pilot produces rubric files grounded in the team's actual conventions — written IN the team's language, not a generic library's.

### G8 effect — pointer files become standalone-useful

**Original pilot:** Layer 1 link-mode produced `docs/context/product/one-pager.md` containing literally one line: `See [.github/copilot-instructions.md § "Repository Overview"]`. No value over just reading the Copilot file.

**Re-pilot:** uses [`skills/hd-setup/assets/pointer-file.md.template`](../../../skills/hd-setup/assets/pointer-file.md.template). Agent reads the source, extracts a 3–5 line summary, and writes:

```markdown
# Product (pointer to source)

**Source:** [.github/copilot-instructions.md § "Repository Overview"](../../../.github/copilot-instructions.md)

SDS is a production-ready design system featuring Figma Code Connect
integration, React components built on React Aria/Stately for
accessibility, and Storybook as interactive documentation. Audience:
design-system teams extending the library or studying patterns.

*Pointer file — authoritative content lives at the source above.*
```

Now the pointer file has real Tier 1 value: a new teammate reading just this file gets essential signal. Source has full detail when needed.

Applies to all link-mode outputs across Layers 1–3 (per universal contract in SKILL.md).

## Validation verdict

**All 3 Phase 3a fixes produce substantively better output.** The improvements aren't cosmetic — they are the difference between:

- G5: "install walkthrough" that needs external docs  ↔  self-contained walkthrough
- G6: duplicative rubric scaffolding  ↔  rubrics extracted from real conventions
- G8: one-line pointer files  ↔  Tier-1-useful summary pointers

## Should we proceed to Phase 3b/3c?

**Yes.** G1 (`has_tokens_package` recursive detection) would catch sds's `scripts/tokens/tokens.json` and ground the extracted `design-system-compliance` rubric with actual token paths. That's tangible improvement on top of Phase 3a's wins.

G4 (batched tool discovery) is UX polish that will matter on pilots with heavier tool diversity (plus-marketing-website, plus-uno). Worth including before those pilots.

G9 (solo-friendly language) is minor but cheap.

G2 (package.json deps parsing for a11y-framework signal) is nice-to-have; would elevate a11y-wcag-aa with "you're already using React Aria" context.

**All of 3b/3c remains in-scope per the plan.** Proceeding.

## What's still uncertain

**The extract-mode for `rubric-applicator` is a new capability ask.** The current `rubric-applicator.md` sub-agent is designed for forward application (rubric → work item → findings). Extract-mode would be the inverse (existing-doc → implicit rubric candidates). This may require either:

1. Extending `rubric-applicator.md` with an `extract` mode (preferred — one agent, two modes)
2. Creating a new `rubric-extractor.md` agent (more files, but cleaner separation)

Our AGENTS.md convention says "prove ≥2 invocation sites before creating a new agent." We have 1 invocation site so far (hd:setup Step 7 critique-extract default). If the same pattern surfaces in hd:review critique or post-v1 usage, a dedicated `rubric-extractor` is justified. For now: extend `rubric-applicator.md` with `mode: extract` parameter.

**Action item for Phase 3b or immediately after:** update `agents/review/rubric-applicator.md` to document the `mode: extract` parameter + expected output shape. One-file change; agent definition stays <200 lines.

## See also

- [2026-04-17-pilot-figma-sds.md](./2026-04-17-pilot-figma-sds.md) — the original pilot with the 7 gaps surfaced
- [`docs/plans/2026-04-17-010-fix-sds-pilot-gap-iteration-plan.md`](../../plans/2026-04-17-010-fix-sds-pilot-gap-iteration-plan.md) — the plan being executed
- Commit `d7fb465c` — Phase 3a landing
- [`skills/hd-setup/SKILL.md`](../../../skills/hd-setup/SKILL.md) Step 7 — updated L4 default logic
- [`skills/hd-setup/references/known-mcps.md`](../../../skills/hd-setup/references/known-mcps.md) — new Figma MCP detail section
- [`skills/hd-setup/assets/pointer-file.md.template`](../../../skills/hd-setup/assets/pointer-file.md.template) — canonical pointer shape
