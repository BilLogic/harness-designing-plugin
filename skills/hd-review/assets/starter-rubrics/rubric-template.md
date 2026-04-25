---
rubric: {{RUBRIC_NAME}}                  # kebab-case identifier (e.g., telemetry-ingest); matches filename stem
name: "{{Human-readable title}}"         # displayed in reports
applies_to:                               # target shapes the rubric scores
  - {{target-type-1}}                     # e.g., tsx, figma-frame, design-file, skill-md
  - {{target-type-2}}
version: 1                                # rubric YAML schema version (see references/rubric-yaml-schema.md)
severity_defaults:
  default: {{p1 | p2 | p3}}               # fallback severity when a criterion omits its own
source:                                   # citation(s) — where the rules come from
  - "{{upstream reference OR team document OR pilot lesson}}"

# Criteria live in YAML frontmatter (machine-queryable); rationale + examples live in body (human-readable).
# `rubric-applier` reads `sections.*.criteria[]` deterministically — no markdown-table parsing.
sections:
  {{section-slug}}:                       # kebab-case, unique within rubric
    order: 1                              # int; renders sections in this order
    title: "{{Section title}}"            # human-readable; mirrors `## 1. <Section title>` heading in body
    criteria:
      - id: {{criterion-id}}              # kebab-case, unique within section, stable across versions
        severity: {{p1 | p2 | p3}}        # default; override via hd-config.md:critique_rubrics
        check: "{{Imperative one-liner. Reads as 'Subject verb object.'}}"
      - id: {{criterion-id}}
        severity: {{p1 | p2 | p3}}
        check: "{{Imperative one-liner.}}"
  {{another-section-slug}}:
    order: 2
    title: "{{Section title}}"
    criteria:
      - id: {{criterion-id}}
        severity: {{p1 | p2 | p3}}
        check: "{{Imperative one-liner.}}"
---

# {{Human-readable title}}

{{One-paragraph summary. What the rubric checks. What pain it prevents. What it does NOT check — defer to other rubrics. The body is descriptive prose; the YAML above is normative.}}

## Scope & Grounding

{{One sentence grounding the rubric in its source material — cite the upstream standard / pilot lesson / team document that informs it. If the source is thin, say so — better honest than padded.}}

### Personas

{{2–4 personas whose work or experience this rubric protects. Each has a one-sentence role + one explicit pain point the rubric addresses. Traceable to source material — no speculative personas.}}

- **{{Persona name}}** — {{one-sentence role}}. Pain: {{explicit pain point this rubric addresses}}.
- **{{Persona name}}** — {{role}}. Pain: {{pain point}}.
- **{{Persona name}}** — {{role}}. Pain: {{pain point}}.

### User stories

{{3–5 stories in "As a <persona>, I need <behavior> so that <outcome>" shape. Each story maps at least one persona to at least one criterion in the YAML above. A criterion with no corresponding user story is a smell.}}

- As a **{{persona}}**, I need **{{behavior}}** so that **{{outcome}}**.
- As a **{{persona}}**, I need **{{behavior}}** so that **{{outcome}}**.
- As a **{{persona}}**, I need **{{behavior}}** so that **{{outcome}}**.

### Realistic scenarios

{{3–5 grounded situations where this rubric applies. Name real surfaces (a card, a form, a SKILL.md, a dashboard); tie each to source material via a one-sentence "why it matters". A scenario that matches any well-built product is too generic — ground it.}}

- **{{Scenario name}}** — {{one-sentence description}}. Why it matters: {{tie to source material or team pain}}.
- **{{Scenario name}}** — {{description}}. Why it matters: {{tie}}.
- **{{Scenario name}}** — {{description}}. Why it matters: {{tie}}.

### Anti-scenarios (common failure modes)

{{3–5 failure modes — the shapes the rubric's concern takes when it goes wrong. Each has an observable symptom the rubric-applier can pattern-match against a review target. Prefer observables ("page visibly jumps", "halfwidth comma inside zh string") over abstract descriptions ("bad UX").}}

- **{{Failure mode}}** — {{description}}. Symptom: {{observable — what you can SEE or grep for}}.
- **{{Failure mode}}** — {{description}}. Symptom: {{observable}}.
- **{{Failure mode}}** — {{description}}. Symptom: {{observable}}.

## What this rubric covers (and does not)

{{Scope disambiguation. Explicit about what this rubric catches vs. what other rubrics catch. Prevents over-triggering.}}

**Covered:** {{concrete list of what the rubric scores}}.

**Not covered (defer to other rubrics):**
- {{Concern}} → defer to `{{other-rubric-name}}`
- {{Concern}} → defer to `{{other-rubric-name}}`

## 1. {{Section title}}

{{Prose rationale for this section's criteria — why these checks exist, what pain they prevent. Mirrors the `sections.<slug>.title` in YAML. Heading number = `order`.}}

**Pass example:**
> {{concrete example of content that satisfies the criteria in this section — small enough to read at a glance}}

**Fail example:**
> {{concrete example of content that fails — observable symptom}}

## 2. {{Section title}}

{{Prose rationale.}}

**Pass example:**
> {{...}}

**Fail example:**
> {{...}}

## How to apply this rubric

### During full review

{{How the rubric slots into `/hd:review full`. Which layer's auditor surfaces it (usually L4 rubric-recommender flags the gap, then rubric-applier walks criteria from the YAML). Severity rollup → P1 / P2 / P3 buckets in the report.}}

### During targeted review

```
/hd:review targeted <path-or-url> --rubric {{rubric-name}}
```

{{Produces inline structured findings per `references/targeted-review-format.md`. Severity overrides from `hd-config.md:critique_rubrics` apply. Scope & Grounding gates criterion application — if the target doesn't match any persona / scenario, `rubric-applier` downgrades severity or skips with `severity_rationale: persona-scope-mismatch`.}}

### During authoring (pre-ship check)

{{If relevant: how a content author uses this rubric on their own draft before submitting for review. Which criteria to walk first.}}

## Extending this rubric

Copy to `docs/rubrics/{{rubric-name}}.md` in your repo and:

1. Adjust per-criterion `severity` values in the YAML to match your team's tolerance.
2. Append team-specific criteria to the relevant section's `criteria[]` list.
3. Reference in `hd-config.md` under `critique_rubrics`.
4. When customizing a starter, keep `source:` pointing at the original and append your team's citation (e.g., `- "starter-{{rubric-name}} + acme-customizations"`).

## What this rubric does NOT check

{{Bulleted list of concerns deliberately out of scope — helps prevent over-triggering. Common examples:}}

- {{Concern}} — out of scope; covered by `{{other-rubric-name}}`
- {{Concern}} — runtime concern, not authoring concern
- {{Concern}} — domain-specific; out of this rubric's universe

## See also

- [rubric-yaml-schema.md](../../references/rubric-yaml-schema.md) — schema for the YAML frontmatter above
- [rubric-authoring-guide.md](../../references/rubric-authoring-guide.md) — full guide to the 4-block Scope & Grounding schema
- [rubric-application.md](../../references/rubric-application.md) — how `rubric-applier` walks criteria
- [targeted-review-format.md](../../references/targeted-review-format.md) — output shape for rubric-backed critiques
- [review-criteria-l4-rubrics.md](../../references/review-criteria-l4-rubrics.md) — rubrics are Layer 4; audit treats them as first-class artifacts
- Existing starter rubrics under `.` — `skill-quality.md` is the Phase 3q reference implementation of the YAML-criteria pattern
