---
rubric: skill-quality
name: "Skill quality (Layer 2 health check)"
applies_to:
  - skill-md
  - skill-dir
version: 1
severity_defaults:
  default: p2
source:
  - "Anthropic skill best practices + Bill's 9-section checklist"

sections:
  skill-definition:
    order: 1
    title: "Skill definition"
    criteria:
      - id: names-one-job
        severity: p1
        check: "Description names the skill's one job"
      - id: lists-trigger
        severity: p2
        check: "Description lists at least one concrete trigger scenario or keyword"
      - id: avoids-vague-verbs
        severity: p2
        check: "Description avoids vague verbs ('help with tasks', 'process data', 'handle things')"
      - id: third-person-voice
        severity: p3
        check: "Description uses third-person voice — no 'I', no 'you'"
      - id: specific-enough
        severity: p2
        check: "Description is specific enough to stand out from other skills in the same repo"

  scope:
    order: 2
    title: "Scope"
    criteria:
      - id: one-job-statement-present
        severity: p1
        check: "One job statement present at top of SKILL.md body"
      - id: no-grab-bag
        severity: p1
        check: "Skill does NOT combine unrelated workflows (research + design + coding)"
      - id: split-when-grown
        severity: p2
        check: "Skill could be broken into smaller skills if it grew past ~3 workflows"
      - id: composable-with-others
        severity: p2
        check: "Skill plays nicely with other skills (composable — suggests, doesn't invoke directly)"

  instructions:
    order: 3
    title: "Instructions"
    criteria:
      - id: imperative-verbs
        severity: p2
        check: "Workflows use imperative verbs ('Analyze…', 'Generate…', 'Read…', 'Write…')"
      - id: step-by-step-structure
        severity: p1
        check: "Workflows include step-by-step structure (numbered or checklisted)"
      - id: no-hedging
        severity: p2
        check: "Workflows avoid hedging language ('try to', 'consider', 'maybe', 'probably')"
      - id: explicit-io-contract
        severity: p2
        check: "Each workflow declares an explicit input → output contract"

  output-structure:
    order: 4
    title: "Output structure"
    criteria:
      - id: format-declared
        severity: p2
        check: "Output format is declared (bullets / table / sections / YAML / JSON)"
      - id: template-referenced
        severity: p1
        check: "Template file is referenced when output is structured"
      - id: deterministic-shape
        severity: p2
        check: "Same inputs produce same-shape output (reduces randomness)"

  context-design:
    order: 5
    title: "Context design"
    criteria:
      - id: skill-md-router-cap
        severity: p2
        check: "SKILL.md ≤ 200 lines (router soft cap)"
      - id: skill-md-hard-cap
        severity: p1
        check: "SKILL.md ≤ 500 lines (hard cap)"
      - id: bulk-content-in-references
        severity: p2
        check: "Large content (how-tos, specs, templates) lives in `references/` or `templates/`, not inline"
      - id: description-soft-cap
        severity: p2
        check: "Description frontmatter ≤ 180 chars (soft cap)"
      - id: description-hard-cap
        severity: p1
        check: "Description frontmatter ≤ 1024 chars (hard cap)"
      - id: progressive-loading
        severity: p3
        check: "Supports progressive loading — references linked contextually, not all at the top"

  workflow-value:
    order: 6
    title: "Workflow value"
    criteria:
      - id: repeatable
        severity: p2
        check: "Workflow is repeatable (not a one-off prompt dressed up as a skill)"
      - id: reduces-repeated-instructions
        severity: p2
        check: "Skill reduces the need for repeated user instructions"
      - id: stable-vs-cold-prompt
        severity: p3
        check: "Skill is more stable than asking the model the same question cold"

  trigger-action:
    order: 7
    title: "Trigger → action mapping"
    criteria:
      - id: description-matches-prompts
        severity: p2
        check: "Frontmatter description matches the kinds of prompts users actually write"
      - id: no-overlap-with-siblings
        severity: p1
        check: "No meaningful overlap with other skills in the same namespace"
      - id: not-too-broad
        severity: p2
        check: "Not so broad that it triggers on unrelated queries"
      - id: disable-invocation-only-when-manual
        severity: p2
        check: "`disable-model-invocation: true` set ONLY when skill is genuinely manual-only"

  scalability:
    order: 8
    title: "Scalability & maintainability"
    criteria:
      - id: clean-separation
        severity: p1
        check: "Clear separation: SKILL.md (router) / references (read) / templates (copy+fill) / scripts (execute)"
      - id: one-level-link-depth
        severity: p2
        check: "Reference links are one-level-deep relative markdown links"
      - id: scripts-by-path
        severity: p2
        check: "Scripts invoked by path, not markdown-linked into context"
      - id: no-fragile-patterns
        severity: p2
        check: "Avoids fragile bash/JS patterns (no command-as-boolean tricks, no regex that breaks on edge cases)"

  failure-handling:
    order: 9
    title: "Failure handling"
    criteria:
      - id: not-section-present
        severity: p2
        check: "'What this skill does NOT do' section present"
      - id: avoids-over-triggering
        severity: p2
        check: "Avoids over-triggering (doesn't grab every loosely related prompt)"
      - id: graceful-fallback
        severity: p2
        check: "Allows fallback to default model behavior when out of scope"
      - id: malformed-input-handled
        severity: p1
        check: "Handles malformed inputs with clear error + recovery path"
---

# Skill quality

Evaluates a Layer 2 skill (SKILL.md + its references / templates / scripts) against Anthropic's skill-authoring discipline and progressive-disclosure conventions. Apply during `/hd:review full` (every skill in `skills/` gets checked) or `/hd:review targeted skills/<name>/SKILL.md --rubric skill-quality` (focused review on one).

The 9 sections below map 1:1 to the nine-point checklist Bill uses for his own skill evaluations. Each section pairs prose rationale with pass/fail examples. The normative criteria live in this rubric's frontmatter (machine-queryable); this body is the human-readable "why".

## Scope & Grounding

This rubric is self-referential: it's the rubric we apply to our own Layer 2 skills during `/hd:review full`. Grounded in Anthropic's skill-authoring guidance and the 9-section checklist Bill uses for every `hd-*` skill.

### Personas
- **Skill author** — writing or editing a `SKILL.md`. Pain: bloated 800-line SKILL.md with references inlined; progressive disclosure collapses; context window suffers.
- **Skill reviewer / auditor** — running `/hd:review full` across every skill in `skills/`. Pain: no consistent rubric, so reviews drift by reviewer.
- **New contributor** — shipping their first skill. Pain: doesn't know the 9-section shape; misses "what this skill does NOT do" and triggers on everything.
- **Skill consumer (the model itself)** — loading the skill at invocation. Pain: vague descriptions and overlapping triggers cause wrong-skill activation.

### User stories
- As a **skill author**, I need **SKILL.md under 500 lines with references progressively loaded** so that **context stays clean**.
- As a **reviewer**, I need **the 9-section checklist as a rubric** so that **audits are reproducible across reviewers**.
- As a **new contributor**, I need **a "what this skill does NOT do" section modeled** so that **my skill doesn't over-trigger**.
- As the **model**, I need **descriptions naming the one job with concrete triggers** so that **I select the right skill**.

### Realistic scenarios
- **`hd:learn`** — 150-line SKILL.md router + 10 atomic reference files. Description: "Answers questions about the five-layer design harness framework." One job; non-overlapping with setup / maintain / review. Why it matters: canonical well-shaped skill.
- **`hd:setup` with detect script** — deterministic `scripts/detect-mode.sh` emits JSON; router reads JSON, branches, references per-mode procedures. Why it matters: scalability-and-maintainability section; separation of router / script / references.
- **Self-targeted critique before shipping** — author walks sections 1, 2, 3, 5 on their draft. Why it matters: these four catch the most common ship-blockers.

### Anti-scenarios (common failure modes)
- **800-line SKILL.md with everything inlined** — no references, no progressive disclosure. Symptom: section 5 (context design) fails immediately; model's context window pays the tax.
- **Vague description** — "Helps you with design-harness stuff". Symptom: section 1 fails; skill triggers on unrelated prompts or doesn't trigger at all.
- **Grab-bag skill** — captures lessons + graduates + full reviews + targeted reviews, all in one. Symptom: section 2 (scope) fails; skill should split.
- **Missing "what this skill does NOT do"** — over-triggers on adjacent prompts. Symptom: section 9 (failure handling) fails.
- **Future-version stub with `disable-model-invocation: true`** — fake trigger text + disabled flag. Symptom: the 2026-04-16 lesson; strictly worse than no skill at all.

## 1. Skill definition

The frontmatter `description:` is the trigger contract. The model selects skills by matching the user's prompt against descriptions, so vague verbs ("help with tasks") collide with every neighbor and specific verbs ("answers questions about the five-layer harness") win. Third-person voice removes ambiguity about who's speaking. Concrete triggers cut the search space.

**Pass example:**
> Answers questions about the five-layer design harness framework. Use when learning concepts, asking about a layer, or orienting before setup.

**Fail example:**
> Helps you with design-harness stuff.

## 2. Scope

A skill that does one thing well composes; a grab-bag skill swallows neighbors and creates trigger conflicts. The "one job statement" at the top of SKILL.md body is the contract — if you can't write it in one sentence, the skill needs to split. Composability means the skill *suggests* downstream skills (text in the body) rather than invoking them directly.

**Pass example:** `hd:learn` — single job: answer questions, read-only.

**Fail example:** one skill that captures lessons, graduates them, audits the harness, AND critiques work items.

## 3. Instructions

Imperative verbs ("Read", "Write", "Compute") translate cleanly into agent steps; hedging ("try to", "consider") leaves the model guessing. Numbered or checklisted structure makes failure points addressable — when an audit says "step 3 broke", the author knows where. The input → output contract per workflow lets downstream skills compose against a known shape.

**Pass example:** `Step 1 — Load reference. Step 2 — Synthesize. Step 3 — Write to docs/knowledge/lessons/YYYY-MM-DD-<slug>.md.`

**Fail example:** `You should probably look at the references and then consider writing something.`

## 4. Output structure

Declared output formats let consumers parse mechanically. A template file pinned in `assets/` is the strongest form of declaration — agents copy + fill rather than reinvent. Same inputs producing same-shape output means downstream tools (audits, dashboards) can trend metrics across runs.

**Pass example:** hd-review's audit has a template at `assets/audit-report.md.template` with explicit placeholders.

**Fail example:** "output a summary" with no shape declared — every run looks different.

## 5. Context design

Progressive disclosure protects the model's context window. The router (SKILL.md) stays small; bulk content lives in `references/` and loads on demand. The 200-line router cap is a soft target; the 500-line hard cap is the ship-blocker. Description caps (180 char soft, 1024 char hard) keep the trigger bar legible.

**Pass example:** SKILL.md is 150 lines; each reference loaded only when its topic arises in the router.

**Fail example:** SKILL.md is 800 lines with every reference inlined.

## 6. Workflow value

A skill encodes a *repeatable* workflow that beats one-off prompting. If the user could get the same result by typing the prompt cold each time, the skill is gold-plating. Repeated user instructions ("always run lint after build", "always cite the source") are the strongest signal a skill should exist.

**Pass example:** `/hd:setup` runs the same detection + scaffold flow across wildly different repo shapes.

**Fail example:** a skill that just says "reformat this JSON" — trivial enough to be a one-off prompt.

## 7. Trigger → action mapping

Descriptions that match real prompts trigger correctly; descriptions that imagine ideal prompts trigger never (or always). Overlap with sibling skills is the highest-pain failure — two skills competing for the same trigger means neither wins reliably. `disable-model-invocation: true` is the right choice for skills that must be user-initiated (e.g., destructive operations); using it on a regular Q&A skill makes the skill invisible.

**Pass example:** `hd:learn` (Q&A) vs `hd:setup` (scaffolding) — clean verb split, zero overlap.

**Fail example:** two skills named `hd:review` and `hd:review-harness` with near-identical descriptions.

## 8. Scalability & maintainability

The semantic split (router / references / templates / scripts) is the structural protection against bloat. References are READ; templates are COPY+FILL; scripts are EXECUTE — each has its place. One-level-deep relative links keep the resolution model simple. Scripts invoked by path (rather than markdown-linked into context) keep their bytes out of the model's working memory.

**Pass example:** `skills/hd-setup/` clean tree with deterministic `scripts/detect-mode.sh` emitting JSON.

**Fail example:** skill logic baked into a single 500-line SKILL.md with no separation.

## 9. Failure handling

Explicit "What this skill does NOT do" prevents over-triggering on adjacent prompts. Graceful fallback means the skill doesn't crash on out-of-scope inputs — it returns control to the default model behavior. Malformed-input handling (clear error + recovery path) is the ship-blocker; silent crashes leave users with no signal.

**Pass example:** `hd:maintain apply` aborts with "Missing --plan-hash. Run rule-propose first." and points to the recovery command.

**Fail example:** skill crashes silently on malformed input; user gets no signal.

## How to apply this rubric

### During full review (across all skills)

`/hd:review full` iterates every `skills/*/SKILL.md` and dispatches `skill-quality-auditor` per skill. The auditor reads this rubric's frontmatter `sections.*.criteria[]`, walks the criteria deterministically, and emits findings. Severity rollup → review report P1 / P2 / P3 buckets. Each finding cites the section's `order` + the criterion `id` so the fix is obvious.

### During targeted review (focused on one skill)

```
/hd:review targeted skills/hd-foo/SKILL.md --rubric skill-quality
```

Produces inline structured findings per `references/targeted-review-format.md`. Severity overrides from `hd-config.md:critique_rubrics.skill_quality` apply.

### During skill authoring (pre-ship check)

Self-critique before committing a new skill: walk the 9 sections with the draft in hand. Sections 1, 2, 3, 5 catch the most common ship-blockers.

## Extending this rubric

Copy to `docs/rubrics/skill-quality.md` in your repo and:

1. Adjust per-criterion `severity` values to match your team's tolerance — edit the YAML frontmatter directly.
2. Add team-specific criteria (append to the relevant section's `criteria[]` list).
3. Reference in `hd-config.md` under `critique_rubrics`.
4. Keep `source:` pointing at the original and append your team's citation (e.g., `- "starter-skill-quality + acme-customizations"`).

## What this rubric does NOT check

- Whether the skill's subject matter is well-chosen (that's a product decision, not a quality check)
- Whether the references are factually accurate (domain-specific — out of scope)
- Runtime performance of scripts (not a quality-of-skill-authoring concern)
- Cross-tool portability (Codex / Cursor / Claude) — covered by `coexistence` checks in `review-criteria-l2-skills.md`

## See also

- [`../../skills/hd-review/references/review-criteria-l2-skills.md`](../../skills/hd-review/references/review-criteria-l2-skills.md) — Layer 2 drift signals that reference this rubric
- [`../../skills/hd-review/references/targeted-review-format.md`](../../skills/hd-review/references/targeted-review-format.md) — output shape for targeted reviews
- [`../../skills/hd-review/references/rubric-yaml-schema.md`](../../skills/hd-review/references/rubric-yaml-schema.md) — schema for this rubric's YAML frontmatter
- Anthropic — [Skill best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices) (source for sections 1, 3, 5, 7)
