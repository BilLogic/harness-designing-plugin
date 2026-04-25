---
title: "First synthetic fire of rubric-applicator mode: extract against plus-uno"
date: 2026-04-18
tags: [extract-mode, rubric-applicator, synthetic-test, phase-3e]
graduation_candidate: too-early-to-tell
importance: 4
---

## Context

Across six real pilot runs of `hd:setup` against partner repos, the `rubric-applicator` agent's `mode: extract` path has never actually fired — every pilot either lacked AI-docs of sufficient size or chose a different Layer-4 branch. Before Phase 4 ships this to users, we needed a synthetic fire to validate the output shape and catch any aspirational holes in the agent spec (we suspected ~40% aspirational from the earlier hd-review skill-test).

This lesson documents that synthetic fire against plus-uno's `AGENTS.md` — the richest implicit-rubric source across the pilot matrix — and the gaps surfaced by acting as the agent with only its current prompt to go on. See also the parallel-pilots consolidated lesson for broader Phase 3 findings.

## Input

- Source: `/tmp/hd-real-test/plus-uno/AGENTS.md` (96 lines)
- Chosen because it carries an explicit numbered "Forbidden Patterns" list of 15 imperatives — denser rule-content than the other five pilot repos, which bury conventions inside prose.
- Target rubric name: `plus-uno-forbidden-patterns`
- Shape template: `skills/hd-review/assets/starter-rubrics/skill-quality.md` + `heuristic-evaluation.md`

## Simulated agent output

What the agent would emit as `extracted_candidates` → materialized as a full rubric file (since the calling skill is `hd:setup` Layer 4, which copies + fills a starter shape):

```markdown
---
rubric: plus-uno-forbidden-patterns
name: "plus-uno Forbidden Patterns (extracted)"
applies_to:
  - tsx
  - jsx
  - scss
  - css
  - mdx
severity_defaults:
  default: p2
source:
  - /tmp/hd-real-test/plus-uno/AGENTS.md §"Forbidden Patterns" (items 1–15)
  - Extracted 2026-04-18 via rubric-applicator mode:extract (synthetic)
---

# plus-uno Forbidden Patterns

Team-specific rubric extracted from plus-uno's `AGENTS.md`. Enforces the 15 imperatives that gate any React/CSS work in the plus-uno workspace. Apply during `hd:review critique` on any component, style, or page-level file touched by a PR.

## Criteria

### no-hardcoded-design-values
**Check:** no literal color, spacing, typography, radius, or elevation values; all reference design tokens via `var(--…)` (compile-ready names, not raw Figma labels).
**Default severity:** p1
**Pass:** `color: var(--color-on-surface-state-08);`
**Fail:** `color: #1A73E8;` or `color: var(--figma-blue-600);`

### cheat-sheet-is-law
**Check:** every `@plus-ds` component and CSS token used appears in `docs/context/design-system/components/cheat-sheet.md`.
**Default severity:** p1
**Pass:** `<Button variant="primary">` where Button + `variant="primary"` are both in the Cheat Sheet.
**Fail:** `<Chip tone="warning">` when `tone` is not listed on Chip in the Cheat Sheet.

### official-layout-formulas-only
**Check:** new pages use structural React formulas from `layout-cheat-sheet.md` (e.g., `<PageLayout>`), not hand-rolled grids.
**Default severity:** p1
**Pass:** page wrapped in `<PageLayout header={…} sidebar={…}>`.
**Fail:** `<div className="container mx-auto grid-cols-12">` hand-rolled.

### verified-props-only
**Check:** props used on a PLUS component are verified against its `.jsx` or `.stories.jsx` source.
**Default severity:** p1
**Pass:** `<Modal size="lg" />` where `size` appears in `Modal.stories.jsx` argTypes.
**Fail:** `<Modal fullscreen />` where `fullscreen` is not in source.

### read-source-before-use
**Check:** unfamiliar components have their source + stories + styles consulted before first use in a PR.
**Default severity:** p2
**Pass:** commit or PR note references `src/components/Popover/Popover.jsx` lines.
**Fail:** component used for first time with no evidence of source read.

### plus-components-first
**Check:** React-Bootstrap is used only when no PLUS equivalent exists.
**Default severity:** p2
**Pass:** `<Button>` from `@plus-ds`.
**Fail:** `import Button from 'react-bootstrap'` when `@plus-ds` exports Button.

### implement-design-workflow-when-figma-present
**Check:** PRs with Figma input follow the full figma-mcp-guide workflow (node IDs → context → screenshot → assets → token map → parity check).
**Default severity:** p1
**Pass:** PR description lists all six steps.
**Fail:** "matched the Figma" with no evidence of MCP calls.

### no-unapproved-packages
**Check:** no new `dependencies`/`devDependencies` added without explicit user approval in the PR.
**Default severity:** p1
**Pass:** `package.json` diff empty or approved in PR comments.
**Fail:** silent `npm install framer-motion`.

### no-alt-ui-frameworks
**Check:** no Material UI, Ant Design, or Tailwind imports.
**Default severity:** p1
**Pass:** dependency graph free of `@mui/*`, `antd`, `tailwindcss`.
**Fail:** `import { Button } from '@mui/material'`.

### no-deep-imports-from-design-system-src
**Check:** imports use `@` alias barrel, not `design-system/src/…`.
**Default severity:** p2
**Pass:** `import { Button } from '@plus-ds'`.
**Fail:** `import Button from 'design-system/src/components/Button/Button'`.

### no-duplicate-components
**Check:** new components checked against `components-index.json` before authoring.
**Default severity:** p2
**Pass:** PR note references the index and justifies novelty.
**Fail:** new `<Card2>` added while `<Card>` exists with equivalent variants.

### no-direct-edits-to-generated-tokens
**Check:** generated token files untouched; changes flow through `npm run generate:tokens`.
**Default severity:** p1
**Pass:** diff touches token source + regenerates outputs.
**Fail:** hand-edit to `tokens.generated.scss`.

### storybook-validated
**Check:** touched components have Storybook validation evidence (screenshot, story update, or note).
**Default severity:** p2
**Pass:** PR links Storybook URL or attaches screenshot.
**Fail:** component behavior changed, no story touched.

### plan-confirmed-before-risky-edits
**Check:** large/risky edits have a confirmed plan + touched-files list before execution.
**Default severity:** p3
**Pass:** PR opens with plan block.
**Fail:** 40-file refactor with no plan.

### fa-free-icons-only
**Check:** only Font Awesome Free variants (`fa-solid`, `fa-regular`, `fa-brands`); no `fa-light`, `fa-thin`, `fa-sharp`, `fa-duotone`, or Pro-only icon names.
**Default severity:** p1
**Pass:** `<i className="fa-solid fa-check" />`.
**Fail:** `<i className="fa-light fa-grid-2" />`.

## Extending this rubric

1. Tune severities in `hd-config.md` under `critique_rubrics.plus-uno-forbidden-patterns`.
2. Add project-specific criteria (e.g., telemetry-event naming) as `criterion-16+`.
3. Re-run extraction after `AGENTS.md` edits; diff against this file.

## See also

- Source: `/tmp/hd-real-test/plus-uno/AGENTS.md`
- Shape exemplars: `skills/hd-review/assets/starter-rubrics/skill-quality.md`, `heuristic-evaluation.md`
```

## Gap report

| gap_id | what the spec says | what a model actually has to guess | severity |
|---|---|---|---|
| G1-no-phased-procedure | `mode: extract` has an output-shape example but no numbered Phase 1/2/3 steps (unlike `mode: apply` which has 5 phases) | What to read first, how to scan, when to stop, how to cluster near-duplicates | p1 |
| G2-rule-detection-heuristic-absent | Says "identify rule-like / check-like statements" — no definition of what counts | Whether to match only imperative verbs (never/always/must/don't), or also softer guidance ("prefer", "confirm"); whether numbered lists get special treatment | p1 |
| G3-severity-assignment-unspecified | `suggested_severity: p1` shown in example, no rubric for choosing | Whether to default all to p2, or infer from language strength ("never" → p1, "prefer" → p3), or copy starter-rubric defaults | p1 |
| G4-criterion-id-naming-convention | Example uses `approved-tokens-only` but no rule | kebab-case vs snake_case; length cap; whether to echo source wording or abstract it | p2 |
| G5-matches-starter-field-ambiguous | `matches_starter: design-system-compliance` shown but starter isn't in our shipped set | Whether to match against our starter-rubrics dir, compound's, or invent names; what "match" threshold means | p2 |
| G6-output-file-vs-yaml-candidates | Spec output is a YAML candidates block; Phase 3e task required a full markdown rubric file | Whether agent emits candidates for the skill to materialize, OR materializes the file itself; who owns the copy-from-starter step | p1 |
| G7-applies-to-inference | Rubric shape requires `applies_to:` list; no guidance on how to derive from an AI-doc | Whether to copy from source's implied file types (tsx/scss), read the repo tree, or leave as TODO | p2 |
| G8-evidence-format | "evidence" example is `"Line 47: '...'"` but source numbered lists have no line references in the provided extracts | Whether to cite line numbers (requires re-read), section anchors, or quote only | p3 |
| G9-novel-vs-starter-split-rationale | Spec says `novel_candidates: 1` without defining novelty threshold | Whether a 60% semantic overlap counts as match; who breaks ties | p2 |
| G10-pass-fail-examples-source | Starter rubrics have concrete pass/fail code snippets; source AGENTS.md has imperatives only | Whether the agent must synthesize plausible examples (risk: fabrication) or leave placeholders for the user | p2 |
| G11-size-budget-undefined | No target length (80–150? 300?); no criterion-count cap | Whether to emit all 15 imperatives as criteria, cluster to 8, or gate by severity | p3 |
| G12-deduplication-unspecified | plus-uno items #2, #3, #4, #5, #11 all collapse to "read source before use" variants | Whether to merge near-dupes or preserve 1:1 with source numbering | p2 |

## Verdict

Per-gap ship verdicts:

- **Block on fixes (p1):** G1, G2, G3, G6 — these four gaps caused me to guess heavily while simulating. Without phased procedure + rule-detection heuristic + severity-assignment rule + output-ownership contract, two agents run on the same input produce materially different rubrics.
- **Ship with caveats (p2):** G4, G5, G7, G9, G10, G12 — resolvable with one paragraph each of spec prose. Current output is usable but needs human cleanup.
- **Polish (p3):** G8, G11 — nice to have; don't block Phase 4.

**Overall: block-on-fixes.** Extract-mode is not ready for user-facing `hd:setup` runs. The p1 gaps are procedural, not cosmetic — they change what gets extracted, not just how it's formatted. Ship after Phase 3f closes G1/G2/G3/G6.

## Next steps (Phase 3f)

1. Add a numbered Phase 1–5 procedure block to `agents/review/rubric-applicator.md` under "mode: extract" (closes G1).
2. Define a "rule-detection heuristic" sub-section: imperative-verb allowlist (`never|always|must|don't|do not|required|forbidden`) + numbered-list bonus (closes G2).
3. Add a severity-assignment rule table: language strength → default severity, overridable by `hd-config.md` (closes G3).
4. Clarify the output contract: `mode: extract` emits YAML candidates; the calling skill (`hd:setup`) materializes rubric files from starter shapes. Agent does NOT write files directly (closes G6).
5. Re-run this synthetic test on the other 5 pilot AGENTS.md files; expect variance to drop to p2/p3 only.

## See also

- [parallel-pilots consolidated lesson](../../../docs/knowledge/lessons/) — Phase 3 pilot matrix findings (link when landed)
- [agents/review/rubric-applicator.md](../../../agents/review/rubric-applicator.md) — the spec under test
- [skills/hd-review/assets/starter-rubrics/skill-quality.md](../../../skills/hd-review/assets/starter-rubrics/skill-quality.md) — shape exemplar
- [skills/hd-review/assets/starter-rubrics/heuristic-evaluation.md](../../../skills/hd-review/assets/starter-rubrics/heuristic-evaluation.md) — shape exemplar
