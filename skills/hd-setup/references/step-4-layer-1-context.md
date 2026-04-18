---
title: Step 4 — Layer 1 (Context) full procedure
loaded_by: hd-setup
---

## Purpose

Full FRAME/SHOW/PROPOSE/EXECUTE procedure for Layer 1 (Context) — the semantic memory layer covering product, user, design system, and conventions. Load when Step 4 runs.

## Step 4 — Layer 1 (Context)

**Frame:** "Layer 1 — Context. What the AI needs every time: product, user, design system, conventions. Semantic memory (article §4a)."

**Show:** detect signals — `has_agent_dir`, `has_ai_docs`, `team_tooling.docs`, `team_tooling.design`, `has_tokens_package`, `has_figma_config`, Tier 1 budget state.

**Propose default** per [per-layer-procedure.md § Default action per detection](per-layer-procedure.md#default-action-per-detection).

**Execute — scaffold:**
- Load [`layer-1-context.md`](layer-1-context.md) for L1 depth (baseline shape + healthy-AGENTS.md patterns)
- Ask scaffold depth: **full baseline** (21 files across product/conventions/design-system — matches plus-uno) vs **simple mode** (~4 files — just app.md + tech-stack.md + tokens.md + components/cheat-sheet.md). Default: full baseline for team repos, simple mode for solo.
- Seed questions for product/: (1) product in one sentence? (2) user in one sentence? (3) biggest design constraint? (4) top 3 features?
- Seed questions for conventions/: (1) primary language + framework? (2) 3 most important coding rules?
- Seed questions for design-system/: (1) token source of truth (Figma / tokens package / CSS vars)? (2) existing component library (shadcn / Radix / custom)? (3) a11y target (WCAG AA baseline)?
- If "I don't know" on design-system → offer Material 3 / Fluent 2 / awesome-design-md baselines + user's README/package.json
- Copy the chosen template set from [`../assets/context-skeleton/`](../assets/context-skeleton/) under `docs/context/`, pre-filling `{{PLACEHOLDER}}` with user answers
- Enforce Tier 1 budget per [`tier-budget-model.md`](tier-budget-model.md): `AGENTS.md` + `docs/context/product/app.md` combined ≤ 200 lines (non-Tier-1 content like features/flows/pillars lives in sibling files — doesn't count against budget)

**Execute — link:** write pointer files under `docs/context/<subtopic>/` using [`../assets/pointer-file.md.template`](../assets/pointer-file.md.template). Each pointer file must include a 3–5 line **extracted summary** of the source content, not just the bare link. Goal: pointer file is Tier 1 useful standalone; source has full detail.

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

**Execute — critique:** apply bloat-detection checks from [`tier-budget-model.md`](tier-budget-model.md). Surface findings. Don't write.

→ Return to [../SKILL.md § Step 4 — Layer 1 (Context)](../SKILL.md#step-4--layer-1-context)
