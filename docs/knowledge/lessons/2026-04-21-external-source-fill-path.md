---
title: "External-source fill-path: the plug-in is an advisor, not an installer"
date: 2026-04-21
memory_type: episodic
importance: 5
tags: [live-testing, tool-discovery, advisor-pattern, mcp, cli, api, compounding]

# Machine-extractable — 3p.3 schema migration
applies_to_layers: [l1, l5]
related_rules: [R_2026_04_21_advisor, R_2026_04_21_live_testing]
related_lessons:
  - 2026-04-20-iterative-refinement-3k-to-3m
  - 2026-04-18-parallel-pilots-3-6-consolidated
decision_summary: "The plug-in is an advisor: it scans, asks, researches AI-integration options (MCP/CLI/API), links to install docs. Never installs or wires auth on the user's behalf. Parallel path: paste-and-organize."
result_summary: "Phase 3n shipped 8 units (scout agent, Step 3 collapse, known-mcps as cache, per-layer Fill path, paste-organize helper, Step 10 closer, schema v5). advisor-not-installer graduated to AGENTS.md § Rules same day."
next_watch: "If any reviewer proposes auto-installing on user's behalf, cite this lesson + rule."
rule_candidate: true
rule_ref: R_2026_04_21_advisor
supersedes: null
superseded_by: null
---

# Lesson

## Context

A friend ran `/hd:setup` live on `sense_frontend` (a Vue 3 + Pinia + MUI app with `.claude/skills/` + `.cursor/skills/` already in place). The setup completed cleanly — L1 create, L2 review, L3 skip, L4 create, L5 create, 36 files landed, always-loaded budget 124/200 — but when debriefed, the tester reported **he never saw a prompt asking whether he had external tools (Notion, Figma, Linear, Supabase, his internal API) that could feed the harness**. Step 3 (Tool discovery) collapsed silently inside additive-mode guardrail.

Worse: even if Step 3 had fired perfectly, our 6 categories (`docs`, `design`, `diagramming`, `analytics`, `pm`, `comms`) omit **CLI dev tools** (`vercel`, `supabase`, `wrangler`, `gh`, `stripe`) and **internal data APIs** (Supabase, Firebase, Hasura, company APIs) — exactly the sources that make Layer 1 (product facts) and Layer 5 (compounding knowledge) come alive.

This is the 4th live-testing finding (after 3k, 3l, 3m) that spec review missed. Candidate rule territory.

## Decision / Observation

Two gaps with one underlying root cause:

### Gap 1 — Step 3 is a soft ask in language only
SKILL.md Step 3 says *"Ask one batched question across all 6 categories"* — but it's not structured as a blocking gate. In additive mode the agent rationally interprets the additive-only narration as "user came for minimal disruption" and skips ahead. The tester experienced zero tool-discovery prompts.

### Gap 2 — Wrong mental model about what we offer
The original `known-mcps.md` framed the plug-in as an **MCP installer** — a whitelist of packages we'd walk users through installing. That was wrong. The plug-in should be an **advisor**:
1. User names the tools they use
2. Plug-in researches whether AI support exists (MCP / CLI wrapper / documented API)
3. Plug-in links to official install docs
4. User installs themselves

Parallel path: **user pastes or drops files** into a layer folder and asks the plug-in to organize. No MCP needed — raw content works fine.

### Root cause
Step 3 was written as if tool discovery was a **pre-layer interrogation phase**. It should be **contextualized inside each layer's EXECUTE step** — at the moment we're actually populating L1 Context or L5 Knowledge, offer three equal paths: (a) research a tool to wire up, (b) paste files and organize, (c) create from scratch with seeded prompts. All three land in the same folder; choice is about ergonomics.

## Result

Phase 3n plan written: [`docs/plans/2026-04-21-001-feat-phase-3n-external-source-fill-path-plan.md`](../../plans/2026-04-21-001-feat-phase-3n-external-source-fill-path-plan.md) — 8 implementation units:

1. **This lesson** (rule-candidate preservation)
2. **`detect.py` expansion** — `cli` + `data_api` categories, schema v4 → v5 (additive)
3. **`SKILL.md` Step 3 collapse** — scan-summary narration only, no blocking ask
4. **New `ai-integration-scout` sub-agent** — on-demand web search for `<tool> MCP / CLI / API`
5. **`known-mcps.md` reframed** from whitelist-gate to seeded cache the scout writes back to
6. **Per-layer EXECUTE "fill path" sub-routine** — three equal paths at `create` + `scaffold`
7. **`paste-organize` helper** — accept pasted content, structure into layer sub-folders
8. **Step 10 research-opportunity closer** — even after "create from scratch" answers, surface the research re-entry

## Graduation-readiness

**Primary candidate rule:** *"Spec review and dry runs won't find what live testing does. Budget at least one live run per repo-type before calling a feature done."*

This is the 4th confirmation across the project's short life:
1. Pilot matrix (2026-04-17): initial 5-repo live run surfaced detector false positives
2. sds re-pilot (2026-04-18): budget-check hardcoded to our own layout
3. 3k → 3l → 3m iteration (2026-04-20): 25 fixes across 10 repos
4. **sense_frontend run (2026-04-21): Step 3 collapses silently + categories incomplete**

At 4 confirmations, this warrants `/hd:maintain rule-propose` — promote to team rule in `AGENTS.md`.

**Secondary candidate rule:** *"The plug-in is an advisor, not an installer. We scan, ask, research, and link to install docs. We never install packages or wire auth on the user's behalf. Two user paths: wire-up-a-tool or paste-and-organize."*

Single confirmation so far (from the 2026-04-21 conversation clarification) — park as candidate, re-evaluate after 3n ships and gets tested.

## Next

- Execute Phase 3n plan (8 units)
- Re-test on sense_frontend and at least one greenfield repo after 3n lands
- If re-test surfaces any "advisor vs installer" drift, promote the secondary candidate rule to AGENTS.md
- Run `/hd:maintain rule-propose` for the primary candidate (live testing) — at 4 confirmations, it should score high enough to adopt
