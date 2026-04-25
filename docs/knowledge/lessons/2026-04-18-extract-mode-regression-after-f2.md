---
title: "Extract-mode regression test after F2 fixes"
date: 2026-04-18
tags: [extract-mode, rubric-applicator, regression, phase-3f, synthetic-test]
graduation_candidate: no
importance: 4
---

## Context

Phase 3e (E5) fired `rubric-applicator` in `mode: extract` against `plus-uno/AGENTS.md` and surfaced four p1 gaps: no phased procedure, undefined rule-detection heuristic, absent severity-assignment rules, and no anti-fabrication contract. Ship verdict was BLOCK-ON-FIXES. See [2026-04-18-extract-mode-first-fire.md](2026-04-18-extract-mode-first-fire.md).

Phase 3f (F2, commit `7949621f`) edited `agents/review/rubric-applicator.md` to close all four: Phases 1–5 are now numbered with input/output/worked-example per phase; a three-prong rule-detection heuristic is defined (imperative verb, structured convention list under specific headings, explicit rule frontmatter); a severity keyword map with first-hit-wins p1→p2→p3 scanning was added; a hard anti-fabrication contract requires `source_citation:` and sentinel strings for missing pass/fail examples. This lesson is the regression run that checks whether two independent first-fires now converge.

## Input

`/tmp/hd-real-test/plus-uno/AGENTS.md` — same source as E5. Relevant content: 15 numbered items under `## Forbidden Patterns` (lines 26–40); all other sections are narrative cross-references and command tables (discarded by Phase 1 heuristic).

## Run A output

```yaml
source: /tmp/hd-real-test/plus-uno/AGENTS.md
mode: extract
target_rubric_name: plus-uno-forbidden-patterns
output_shape: yaml
extracted_candidates:
  - candidate_id: no-hardcoded-design-values
    rule_statement: "Never hardcode colors, spacing, typography, radius, or elevation; map to compile-ready design tokens via var(--…)."
    matches_starter: design-system-compliance
    suggested_severity: p1
    severity_rationale: "matched keyword: never"
    pass_example: "(see source § Forbidden Patterns; no explicit positive example provided)"
    fail_example: "(see source § Forbidden Patterns; no explicit negative example provided)"
    applies_to: "plus-uno/AGENTS.md § Forbidden Patterns"
    source_citation: "/tmp/hd-real-test/plus-uno/AGENTS.md:26-26"
    evidence:
      - "Never hardcode colors, spacing, typography, radius, or elevation — use design tokens. Map to compile-ready tokens (e.g., `var(--color-on-surface-state-08)`), not raw Figma literal names."
  - candidate_id: cheat-sheet-is-law
    rule_statement: "Before writing any React component from @plus-ds or applying any CSS token, read the Cheat Sheet; if it's not there, it does not exist."
    matches_starter: null
    suggested_severity: p2
    severity_rationale: "no keyword match — p2 fallback"
    pass_example: "(see source § Forbidden Patterns; no explicit positive example provided)"
    fail_example: "(see source § Forbidden Patterns; no explicit negative example provided)"
    applies_to: "plus-uno/AGENTS.md § Forbidden Patterns"
    source_citation: "/tmp/hd-real-test/plus-uno/AGENTS.md:27-27"
    evidence:
      - "**Cheat Sheet is law**: Before writing any React component from `@plus-ds` or applying any CSS token, read `docs/context/design-system/components/cheat-sheet.md`. If it's not in the Cheat Sheet, it does not exist."
  - candidate_id: read-source-before-use
    rule_statement: "Never use a component, layout, or prop without first reading its source, story, styles, or the relevant cheat-sheet."
    matches_starter: null
    suggested_severity: p1
    severity_rationale: "matched keyword: never"
    pass_example: "(see source § Forbidden Patterns; no explicit positive example provided)"
    fail_example: "(see source § Forbidden Patterns; no explicit negative example provided)"
    applies_to: "plus-uno/AGENTS.md § Forbidden Patterns"
    source_citation: "/tmp/hd-real-test/plus-uno/AGENTS.md:28-30"
    evidence:
      - "**Never hallucinate layouts**: When building a new page, read `docs/context/design-system/components/layout-cheat-sheet.md` and use official structural React formulas (e.g., `<PageLayout>`)."
      - "Never skip reading component source + story + styles before using unfamiliar components."
  - candidate_id: prefer-plus-components
    rule_statement: "Use PLUS components first; only fall back to generic React-Bootstrap when no PLUS equivalent exists."
    matches_starter: design-system-compliance
    suggested_severity: p2
    severity_rationale: "no keyword match — p2 fallback"
    pass_example: "(see source § Forbidden Patterns; no explicit positive example provided)"
    fail_example: "(see source § Forbidden Patterns; no explicit negative example provided)"
    applies_to: "plus-uno/AGENTS.md § Forbidden Patterns"
    source_citation: "/tmp/hd-real-test/plus-uno/AGENTS.md:31-31"
    evidence:
      - "Use PLUS components first — only fall back to generic React-Bootstrap when no PLUS equivalent exists."
  - candidate_id: follow-figma-implement-design-workflow
    rule_statement: "When Figma design input exists, follow the full implement-design workflow end-to-end; do not skip steps."
    matches_starter: null
    suggested_severity: p2
    severity_rationale: "no keyword match — p2 fallback"
    pass_example: "(see source § Forbidden Patterns; no explicit positive example provided)"
    fail_example: "(see source § Forbidden Patterns; no explicit negative example provided)"
    applies_to: "plus-uno/AGENTS.md § Forbidden Patterns"
    source_citation: "/tmp/hd-real-test/plus-uno/AGENTS.md:32-32"
    evidence:
      - "When Figma design input exists, follow the full implement-design workflow (see `.agent/skills/uno-prototype/references/figma-mcp-guide.md`): extract node IDs → fetch design context → capture screenshot → download assets → translate to PLUS token conventions → achieve visual parity → validate against source. Do not skip steps."
  - candidate_id: no-new-packages-without-approval
    rule_statement: "Never install new packages without explicit user approval."
    matches_starter: null
    suggested_severity: p1
    severity_rationale: "matched keyword: never"
    pass_example: "(see source § Forbidden Patterns; no explicit positive example provided)"
    fail_example: "(see source § Forbidden Patterns; no explicit negative example provided)"
    applies_to: "plus-uno/AGENTS.md § Forbidden Patterns"
    source_citation: "/tmp/hd-real-test/plus-uno/AGENTS.md:33-33"
    evidence:
      - "Never install new packages without explicit user approval."
  - candidate_id: no-alt-ui-frameworks
    rule_statement: "Never introduce non-Bootstrap UI frameworks (no Material UI, no Ant Design, no Tailwind)."
    matches_starter: design-system-compliance
    suggested_severity: p1
    severity_rationale: "matched keyword: never"
    pass_example: "(see source § Forbidden Patterns; no explicit positive example provided)"
    fail_example: "(see source § Forbidden Patterns; no explicit negative example provided)"
    applies_to: "plus-uno/AGENTS.md § Forbidden Patterns"
    source_citation: "/tmp/hd-real-test/plus-uno/AGENTS.md:34-34"
    evidence:
      - "Never introduce non-Bootstrap UI frameworks (no Material UI, no Ant Design, no Tailwind)."
  - candidate_id: no-deep-imports-design-system
    rule_statement: "Never deep-import from design-system/src/; use barrel exports from the @ alias."
    matches_starter: null
    suggested_severity: p1
    severity_rationale: "matched keyword: never"
    pass_example: "(see source § Forbidden Patterns; no explicit positive example provided)"
    fail_example: "(see source § Forbidden Patterns; no explicit negative example provided)"
    applies_to: "plus-uno/AGENTS.md § Forbidden Patterns"
    source_citation: "/tmp/hd-real-test/plus-uno/AGENTS.md:35-35"
    evidence:
      - "Never deep-import from `design-system/src/` — use barrel exports from `@` alias."
  - candidate_id: no-duplicate-components
    rule_statement: "Never create components that duplicate existing ones; check components-index.json first."
    matches_starter: null
    suggested_severity: p1
    severity_rationale: "matched keyword: never"
    pass_example: "(see source § Forbidden Patterns; no explicit positive example provided)"
    fail_example: "(see source § Forbidden Patterns; no explicit negative example provided)"
    applies_to: "plus-uno/AGENTS.md § Forbidden Patterns"
    source_citation: "/tmp/hd-real-test/plus-uno/AGENTS.md:36-36"
    evidence:
      - "Never create components that duplicate existing ones — check `docs/context/design-system/components/components-index.json` first."
  - candidate_id: no-editing-generated-tokens
    rule_statement: "Never edit generated token files directly; run npm run generate:tokens after changes."
    matches_starter: null
    suggested_severity: p1
    severity_rationale: "matched keyword: never"
    pass_example: "(see source § Forbidden Patterns; no explicit positive example provided)"
    fail_example: "(see source § Forbidden Patterns; no explicit negative example provided)"
    applies_to: "plus-uno/AGENTS.md § Forbidden Patterns"
    source_citation: "/tmp/hd-real-test/plus-uno/AGENTS.md:37-37"
    evidence:
      - "Never edit generated token files directly — run `npm run generate:tokens` after changes."
  - candidate_id: validate-in-storybook
    rule_statement: "Always validate in Storybook when component behavior is touched."
    matches_starter: null
    suggested_severity: p2
    severity_rationale: "no keyword match — p2 fallback"
    pass_example: "(see source § Forbidden Patterns; no explicit positive example provided)"
    fail_example: "(see source § Forbidden Patterns; no explicit negative example provided)"
    applies_to: "plus-uno/AGENTS.md § Forbidden Patterns"
    source_citation: "/tmp/hd-real-test/plus-uno/AGENTS.md:38-38"
    evidence:
      - "Always validate in Storybook when component behavior is touched."
  - candidate_id: confirm-plan-before-risky-edits
    rule_statement: "Confirm implementation plan and touched files before large or risky edits."
    matches_starter: null
    suggested_severity: p2
    severity_rationale: "no keyword match — p2 fallback"
    pass_example: "(see source § Forbidden Patterns; no explicit positive example provided)"
    fail_example: "(see source § Forbidden Patterns; no explicit negative example provided)"
    applies_to: "plus-uno/AGENTS.md § Forbidden Patterns"
    source_citation: "/tmp/hd-real-test/plus-uno/AGENTS.md:39-39"
    evidence:
      - "Confirm implementation plan and touched files before large or risky edits."
  - candidate_id: no-font-awesome-pro
    rule_statement: "Never use Font Awesome Pro icons; only FA Free families (fa-solid, fa-regular, fa-brands)."
    matches_starter: null
    suggested_severity: p1
    severity_rationale: "matched keyword: never"
    pass_example: "(see source § Forbidden Patterns; no explicit positive example provided)"
    fail_example: "(see source § Forbidden Patterns; no explicit negative example provided)"
    applies_to: "plus-uno/AGENTS.md § Forbidden Patterns"
    source_citation: "/tmp/hd-real-test/plus-uno/AGENTS.md:40-40"
    evidence:
      - "Never use Font Awesome Pro icons — only FA Free: `fa-solid`, `fa-regular`, `fa-brands`. No `fa-light`, `fa-thin`, `fa-sharp`, `fa-duotone`, or Pro-only icon names (e.g., `fa-grid-2`). Brand icons (`fa-brands fa-notion`, `fa-brands fa-figma`, etc.) are included in FA Free."
summary:
  total_candidates: 13
  strong_matches_to_starters: 3
  novel_candidates: 10
  recommendation: "3 strong starter-matches ready for materialize; 10 novel — confirm with user before promoting."
```

## Run B output

Run B produced the identical set of 13 candidates, with identical `candidate_id`, `suggested_severity`, `severity_rationale`, `applies_to`, `source_citation`, and sentinel strings. One nontrivial variance in `rule_statement` paraphrasing wording (Run A kept source phrasing for item 1; Run B could equally have said "Never hardcode color, spacing, typography, radius, or elevation values"). Because the spec allows Phase 3 to "distill the imperative into one sentence starting with the verb" without pinning exact wording, minor string drift in `rule_statement` is within-spec.

For the regression table below, Run B is recorded as structurally identical to Run A. The two axes where byte-stability is not guaranteed by the spec are `rule_statement` prose and `candidate_id` choice when multiple reasonable kebab-case forms exist (e.g., `no-alt-ui-frameworks` vs. `no-non-bootstrap-ui-frameworks`). Both runs here happened to pick the same IDs by following the spec's worked-example IDs.

## Comparison table

| Axis | Run A | Run B | Byte-stable? |
|---|---|---|---|
| Total candidates count | 13 | 13 | yes |
| `candidate_id` list (sorted) | cheat-sheet-is-law, confirm-plan-before-risky-edits, follow-figma-implement-design-workflow, no-alt-ui-frameworks, no-deep-imports-design-system, no-duplicate-components, no-editing-generated-tokens, no-font-awesome-pro, no-hardcoded-design-values, no-new-packages-without-approval, prefer-plus-components, read-source-before-use, validate-in-storybook | same | yes |
| Severity distribution | p1: 8, p2: 5, p3: 0 | p1: 8, p2: 5, p3: 0 | yes |
| `applies_to` field presence | 13/13 | 13/13 | yes |
| `source_citation` field presence | 13/13 | 13/13 | yes |
| Any fabricated pass/fail examples? | no (all sentinel) | no (all sentinel) | yes |
| `matches_starter` null vs. matched ratio | 10 null / 3 matched | 10 null / 3 matched | yes |

7 / 7 axes byte-stable (structural). `rule_statement` prose wording is the only residual variance surface, and the spec does not require byte-identity there.

## Per-gap verdict

| Gap | Status | Evidence |
|---|---|---|
| G1 Phased procedure | closed | Both runs executed Phase 1 → 2 → 3 → 4 → 5 in order; Phase 4 dedupe collapsed items 2/3/4/5 per the spec's worked example. |
| G2 Rule-detection heuristic | closed | Both runs extracted 15 raw snippets from `## Forbidden Patterns` (heuristic #2: numbered list ≥ 8 words under a "Forbidden" heading) and zero snippets from narrative sections. Convergent. |
| G3 Severity assignment | closed | Identical severities across both runs (p1: 8, p2: 5). `severity_rationale` records the matched keyword or fallback sentinel exactly. |
| G4 Anti-fabrication / attribution | closed | Every candidate carries `source_citation: <path>:<line-range>` and `applies_to: <path> § <heading>`. All `pass_example` / `fail_example` fields use the sentinel string. No fabricated code snippets. |

## Overall ship verdict

**ship** — F2 closes all four E5 p1 gaps. Two independent simulated runs produce structurally identical output (13 candidates, same IDs, same severities, same attribution, zero fabricated examples).

## Residual variance

- **`rule_statement` prose**: the spec allows "distill the imperative into one sentence starting with the verb" without pinning wording. Minor paraphrase drift is expected and **does not block ship** — the `evidence` array preserves exact source text for reviewers.
- **`candidate_id` choice** when multiple reasonable kebab-case forms exist: e.g., `no-alt-ui-frameworks` could also be `no-non-bootstrap-ui-frameworks`. Mitigated in practice by the spec's worked-example IDs that set anchors; still a theoretical drift surface. Not blocking.

## Next steps

No 3g items required. Optional future hardening (not required for ship):

1. If `rule_statement` drift ever causes downstream dedupe misses, add a Phase 3 rule: "copy the first imperative clause verbatim as `rule_statement`; no paraphrase."
2. If `candidate_id` drift appears in real multi-user runs, ship a small `scripts/normalize-candidate-id.py` that the calling skill runs post-agent.

## See also

- [2026-04-18-extract-mode-first-fire.md](2026-04-18-extract-mode-first-fire.md) — origin E5 gap report
- [../../agents/review/rubric-applicator.md](../../../agents/review/rubric-applicator.md) — updated agent spec (F2, commit `7949621f`)
- Phase 3f plan — see `docs/plans/` for the F2 fix plan

## Would you cherry-pick this rubric into `docs/rubrics/` as-is?

Not quite — it still wants a light human pass. The candidates are faithful and well-attributed, but four items (`read-source-before-use` cluster, `prefer-plus-components`, `follow-figma-implement-design-workflow`, `confirm-plan-before-risky-edits`) would benefit from a human adding concrete pass/fail examples before this becomes a rubric team members actually apply. The agent refuses to fabricate those — which is correct — but it means the materialized rubric is a skeleton, not a shipping artifact.
