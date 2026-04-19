---
rubric: skill-quality
name: "Skill quality (Layer 2 health check)"
applies_to:
  - skill-md
  - skill-dir
severity_defaults:
  default: p2
---

# Skill quality

Evaluates a Layer 2 skill (SKILL.md + its references / workflows / templates / scripts) against Anthropic's skill-authoring discipline and progressive-disclosure conventions. Apply this rubric during `hd:review audit` (every skill in `skills/` gets checked) or `hd:review critique skills/<name>/SKILL.md` (focused review on one).

The 9 sections below map 1:1 to the nine-point checklist Bill uses for his own skill evaluations. Each section lists criteria, a default severity, and pass/fail examples. Severity can be overridden per-repo in `hd-config.md`.

## Scope & Grounding

This rubric is self-referential: it's the rubric we apply to our own Layer 2 skills during `hd:review audit`. Grounded in Anthropic's skill-authoring guidance and the 9-section checklist Bill uses for every `hd-*` skill.

### Personas
- **Skill author** — writing or editing a `SKILL.md`. Pain: bloated 800-line SKILL.md with references inlined; progressive disclosure collapses; context window suffers.
- **Skill reviewer / auditor** — running `hd:review audit` across every skill in `skills/`. Pain: no consistent rubric, so reviews drift by reviewer.
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
- **Self-critique before shipping** — author walks sections 1, 2, 3, 5 on their draft. Why it matters: these four catch the most common ship-blockers.

### Anti-scenarios (common failure modes)
- **800-line SKILL.md with everything inlined** — no references, no progressive disclosure. Symptom: section 5 (context design) fails immediately; model's context window pays the tax.
- **Vague description** — "Helps you with design-harness stuff". Symptom: section 1 fails; skill triggers on unrelated prompts or doesn't trigger at all.
- **Grab-bag skill** — captures lessons + graduates + audits + critiques, all in one. Symptom: section 2 (scope) fails; skill should split.
- **Missing "what this skill does NOT do"** — over-triggers on adjacent prompts. Symptom: section 9 (failure handling) fails.
- **Future-version stub with `disable-model-invocation: true`** — fake trigger text + disabled flag. Symptom: the 2026-04-16 lesson; strictly worse than no skill at all.

## 1. Skill definition

**Check:** frontmatter `description:` clearly states *what the skill does* AND *when to use it*, with specific triggers.

| Criterion | Default severity |
|---|---|
| Description names the skill's one job | p1 |
| Description lists at least one concrete trigger scenario or keyword | p2 |
| Description avoids vague verbs ("help with tasks", "process data", "handle things") | p2 |
| Third-person voice — no "I", no "you" | p3 |
| Specific enough to stand out from other skills in the same repo | p2 |

**Pass example:** `Answers questions about the five-layer design harness framework. Use when learning concepts, asking about a layer, or orienting before setup.`
**Fail example:** `Helps you with design-harness stuff.`

## 2. Scope

**Check:** skill covers *one clear task*, not a grab-bag.

| Criterion | Default severity |
|---|---|
| One job statement present at top of SKILL.md body | p1 |
| Does NOT combine unrelated workflows (research + design + coding) | p1 |
| Could be broken into smaller skills if it grew past ~3 workflows | p2 |
| Plays nicely with other skills (composable — suggests, doesn't invoke directly) | p2 |

**Pass example:** `hd:learn` — single job: answer questions, read-only.
**Fail example:** one skill that captures lessons, graduates them, audits the harness, AND critiques work items.

## 3. Instructions

**Check:** workflows use imperative verbs and explicit step-by-step structure.

| Criterion | Default severity |
|---|---|
| Uses imperative verbs ("Analyze…", "Generate…", "Read…", "Write…") | p2 |
| Includes step-by-step workflow (numbered or checklisted) | p1 |
| Avoids hedging ("try to", "consider", "maybe", "probably") | p2 |
| Explicit input → output contract per workflow | p2 |

**Pass example:** `Step 1 — Load reference. Step 2 — Synthesize. Step 3 — Write to docs/knowledge/lessons/YYYY-MM-DD-<slug>.md.`
**Fail example:** `You should probably look at the references and then consider writing something.`

## 4. Output structure

**Check:** output format is declared and consistent across runs.

| Criterion | Default severity |
|---|---|
| Output format declared (bullets / table / sections / YAML / JSON) | p2 |
| Template file referenced when output is structured | p1 |
| Reduces randomness — same inputs produce same-shape output | p2 |

**Pass example:** hd-review audit has a template at `templates/audit-report.md.template` with explicit placeholders.
**Fail example:** "output a summary" with no shape declared — every run looks different.

## 5. Context design

**Check:** SKILL.md is concise; bulk content lives in references / assets / templates.

| Criterion | Default severity |
|---|---|
| SKILL.md ≤ 200 lines (router) or ≤ 500 lines (hard cap) | p1 ≤ 500; p2 ≤ 200 |
| Large content (how-tos, specs, templates) moved to `references/` or `templates/` | p2 |
| Description frontmatter ≤ 180 chars (soft), ≤ 1024 (hard) | p1 ≤ 1024; p2 ≤ 180 |
| Supports progressive loading — references linked contextually, not all at top | p3 |

**Pass example:** SKILL.md is 150 lines; each reference loaded only when its topic arises in the router.
**Fail example:** SKILL.md is 800 lines with every reference inlined.

## 6. Workflow value

**Check:** skill encapsulates a repeatable workflow that beats a one-off prompt.

| Criterion | Default severity |
|---|---|
| Workflow is repeatable (not a one-off prompt dressed up as a skill) | p2 |
| Reduces the need for repeated user instructions | p2 |
| More stable than asking the model the same question cold | p3 |

**Pass example:** `/hd:setup` runs the same detection + scaffold flow across wildly different repo shapes.
**Fail example:** a skill that just says "reformat this JSON" — trivial enough to be a one-off prompt.

## 7. Trigger → action mapping

**Check:** clear mapping from user intent to skill activation, no overlap with other skills.

| Criterion | Default severity |
|---|---|
| Frontmatter description matches the kinds of prompts users actually write | p2 |
| No meaningful overlap with other skills in the same namespace | p1 |
| Not so broad that it triggers on unrelated queries | p2 |
| `disable-model-invocation: true` set ONLY when skill is genuinely manual-only | p2 |

**Pass example:** `hd:learn` (Q&A) vs `hd:setup` (scaffolding) — clean verb split, zero overlap.
**Fail example:** two skills named `hd:review-harness` and `hd:audit-harness` with near-identical descriptions.

## 8. Scalability & maintainability

**Check:** skill is structured for extension, not hardcoded.

| Criterion | Default severity |
|---|---|
| Clear separation: SKILL.md (router) / references (read) / workflows (follow) / templates (copy+fill) / scripts (execute) | p1 |
| Reference links are one-level-deep relative markdown links | p2 |
| Scripts invoked by path, not markdown-linked into context | p2 |
| Avoids fragile bash/JS patterns (no command-as-boolean tricks, no regex that breaks on edge cases) | p2 |

**Pass example:** `skills/hd-setup/` clean tree with deterministic `scripts/detect-mode.sh` emitting JSON.
**Fail example:** skill logic baked into a single 500-line SKILL.md with no separation.

## 9. Failure handling

**Check:** skill explicitly defines when NOT to use it and allows graceful fallback.

| Criterion | Default severity |
|---|---|
| "What this skill does NOT do" section present | p2 |
| Avoids over-triggering (doesn't grab every loosely related prompt) | p2 |
| Allows fallback to default model behavior when out of scope | p2 |
| Handles malformed inputs with clear error + recovery path | p1 |

**Pass example:** `hd:maintain apply` aborts with "Missing --plan-hash. Run rule-propose first." and points to the recovery command.
**Fail example:** skill crashes silently on malformed input; user gets no signal.

## How to apply this rubric

### During audit (across all skills)

`hd:review audit` iterates every `skills/*/SKILL.md` and runs the checks above. Severity rollup → audit report P1 / P2 / P3 buckets. Each violation cites the section number (1–9) so the fix is obvious.

### During critique (focused on one skill)

```
/hd:review critique skills/hd-foo/SKILL.md --rubric skill-quality
```

Produces inline structured critique per `references/critique-format.md`. Severity overrides from `hd-config.md` apply.

### During skill authoring (pre-ship check)

Self-critique before committing a new skill: walk the 9 sections with the draft in hand. Sections 1, 2, 3, 5 catch the most common ship-blockers.

## Extending this rubric

Copy to `docs/context/skill-standards.md` in your repo and:

1. Adjust severity defaults to match your team's tolerance
2. Add team-specific criteria (e.g., "every skill must cite a PR or design doc")
3. Reference in `hd-config.md` under `critique_rubrics`

## What this rubric does NOT check

- Whether the skill's subject matter is well-chosen (that's a product decision, not a quality check)
- Whether the references are factually accurate (domain-specific — out of scope)
- Runtime performance of scripts (not a quality-of-skill-authoring concern)
- Cross-tool portability (Codex / Cursor / Claude) — covered by `coexistence` checks in `audit-criteria.md`

## See also

- [../../references/audit-criteria.md](../../references/audit-criteria.md) — Layer 2 drift signals that reference this rubric
- [../../references/critique-format.md](../../references/critique-format.md) — output shape for `hd:review critique`
- Anthropic — [Skill best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices) (source for sections 1, 3, 5, 7)
- [component-budget.md](component-budget.md) — parallel rubric for Layer 1 (components); this one is for Layer 2 (skills)
