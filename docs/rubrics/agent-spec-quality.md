---
rubric: agent-spec-quality
name: "Agent spec quality (agents/<cat>/<name>.md)"
applies_to:
  - agent-md
version: 1
severity_defaults:
  default: p2
source:
  - "Anthropic Claude Agent SDK + Task-tool conventions"
  - "Compound-engineering agent corpus (skill-quality-auditor, harness-auditor, et al.) as canonical pattern"
  - "Phase 3i agent-architecture rename + reorganization plan"

sections:
  frontmatter:
    order: 1
    title: "Frontmatter"
    criteria:
      - id: name-kebab-case
        severity: p1
        check: "Frontmatter `name:` is kebab-case and matches the file's basename (e.g., `skill-quality-auditor.md` ↔ `name: skill-quality-auditor`)"
      - id: description-present-and-budget
        severity: p1
        check: "Frontmatter `description:` is present and ≤180 chars (soft cap; 1024 hard). Reads as one sentence stating WHAT the agent does + WHEN to invoke it"
      - id: description-third-person
        severity: p2
        check: "Description uses third-person voice — no 'I', no 'you'; the model selects agents by matching prompts against descriptions, third-person is the established convention"
      - id: color-and-model-set
        severity: p3
        check: "Frontmatter sets `color:` (visual disambiguation in dispatcher UI) and `model:` (typically `inherit`)"

  procedure:
    order: 2
    title: "Procedure shape"
    criteria:
      - id: single-job-statement-present
        severity: p1
        check: "Body opens with a one-sentence single-job statement after the H1 — what this agent does, applied to what input, producing what output"
      - id: inputs-or-parameters-section-present
        severity: p1
        check: "Body has an `## Inputs` or `## Parameters` section enumerating each parameter with type + required/optional + one-line description"
      - id: procedure-has-numbered-phases
        severity: p1
        check: "`## Procedure` section uses numbered phases (`### Phase 1: ...` through `### Phase N: ...`) — not a flat prose dump"
      - id: each-phase-imperative-and-actionable
        severity: p2
        check: "Each phase uses imperative verbs and produces a concrete artifact for the next phase ('Read X', 'Validate Y', 'Emit Z') — not 'Consider checking'"

  output:
    order: 3
    title: "Output schema"
    criteria:
      - id: output-section-present
        severity: p1
        check: "Body has an `## Output` section with a concrete YAML/JSON example showing the exact shape callers will see"
      - id: output-keys-stable
        severity: p2
        check: "Output schema uses stable kebab-case or snake_case keys; schema_version field present when shape may evolve (so callers can branch)"
      - id: error-output-shape-documented
        severity: p2
        check: "Output section names error shapes (e.g., `error: rubric-invalid` with one-line diagnosis) — not just success-path examples"

  coexistence:
    order: 4
    title: "Coexistence + safety"
    criteria:
      - id: coexistence-section-present
        severity: p1
        check: "Body has a `## Coexistence / security` or equivalent section declaring read-only / scope / cross-namespace discipline"
      - id: read-only-explicit-when-applicable
        severity: p2
        check: "If the agent is read-only (no writes to the work item), this is stated explicitly — and the agent demonstrably has no Write/Edit tool usage in its procedure"
      - id: foreign-mcp-discipline
        severity: p2
        check: "If the agent might be tempted to access MCPs (Figma / Notion / etc.), the spec states explicitly that it only uses MCPs the calling skill provides — never accesses the plug-in maintainer's own MCPs"
      - id: fully-qualified-task-names
        severity: p1
        check: "Any Task invocation references in the spec use fully-qualified `design-harnessing:<category>:<agent-name>` form — never bare names"

  failure-modes:
    order: 5
    title: "Failure modes"
    criteria:
      - id: failure-modes-section-present
        severity: p1
        check: "Body has a `## Failure modes` section enumerating the specific error classes the agent can produce + their causes (missing input / malformed input / out-of-scope target / etc.)"
      - id: graceful-fallback-documented
        severity: p2
        check: "For each failure mode, the agent's behavior is documented: abort with named error, partial result + note, or skip with rationale — never silent crash"
      - id: when-not-to-use-section
        severity: p3
        check: "Body has a `## When NOT to use this agent` section disambiguating from sister agents (e.g., `rubric-applier` vs `skill-quality-auditor`)"

  references:
    order: 6
    title: "References"
    criteria:
      - id: see-also-cites-related-agents
        severity: p3
        check: "`## See also` section cites related agents and reference docs — sets context for archaeologists + invokers"
      - id: references-subdirectory-self-documenting
        severity: p3
        check: "If agent category has a `references/` sibling subdirectory, it contains EITHER ≥2 files OR a single file plus a README.md explaining the directory's purpose; lone-file subdirs without README are pattern-in-waiting drift"
---

# Agent spec quality

Score `agents/<category>/<name>.md` files. Sub-agents are dispatched via Task; their specs ARE their system prompts. Quality here directly affects: (1) whether the model picks the right agent for a prompt, (2) whether the agent produces useful structured output, (3) whether the agent stays within scope and doesn't accidentally write to artifacts it shouldn't.

**Dogfood scope:** the 10 sub-agents in `agents/{analysis,research,review}/` of this plug-in. Currently scored against `skill-quality.md` which is wrong-fit (router/references/templates ≠ agent shape: frontmatter + procedure + output schema). This rubric closes that gap.

## Scope & Grounding

Grounded in:
- Anthropic's Agent SDK + Task-tool conventions (frontmatter shape, `inherit` model semantics)
- Compound-engineering's mature agent corpus — `skill-quality-auditor`, `harness-auditor`, `rule-candidate-scorer` are pattern references for what a clean agent spec looks like
- Phase 3i agent-architecture rename + reorganization plan (the prior pass that established `<category>:<name>` discipline)

### Personas
- **Agent author** — writing or editing an agent spec under `agents/<cat>/`. Pain: skill-quality rubric is wrong-fit; flags missing "router" / "templates/" sections that don't apply.
- **Skill that dispatches the agent** — invokes via `Task design-harnessing:<cat>:<agent>(...)`. Pain: agent spec missing `## Inputs` section means caller has to read the procedure to learn parameters.
- **Model selecting an agent** — picks agent by matching user prompt against `description:`. Pain: vague description ("Helps with reviews") collides with sibling agents.
- **Caller parsing output** — expects a stable shape. Pain: agent spec only shows success-path example; error shapes undocumented; caller gets a surprise.
- **Reviewer auditing the corpus** — wants to verify agents respect coexistence boundaries. Pain: no `## Coexistence` section; can't confirm agent isn't writing where it shouldn't.

### User stories
- As an **agent author**, I need **a rubric that fits agent shape** so that **I'm not falsely flagged on skill-quality criteria**.
- As a **dispatching skill**, I need **`## Inputs` / `## Parameters`** so that **I know what to pass without reading the whole procedure**.
- As the **model**, I need **descriptions that name the one job + when** so that **I select the right agent for a prompt**.
- As a **caller**, I need **error-shape documentation** so that **I handle failures without surprise**.
- As a **reviewer**, I need **`## Coexistence` declarations** so that **I can verify scope/safety boundaries**.

### Realistic scenarios
- **`agents/review/skill-quality-auditor.md`** — frontmatter {name, description ≤180c, color, model}; `## Inputs` (skill_md_path + rubric_overrides); `## Procedure` (4 phases); `## Output` (YAML); `## Coexistence` (read-only, namespaced scope); `## Failure modes` (4 enumerated). Why it matters: canonical reference shape post-3q.
- **`agents/analysis/harness-auditor.md`** — same shape applied to whole-harness audit; demonstrates the rubric scales beyond review-category agents.
- **`agents/research/lesson-retriever.md`** — has been pre-3p.3 but post-3p.3-update; demonstrates how a research-category agent fits this shape (Inputs + procedure + output schema all present).

### Anti-scenarios (common failure modes)
- **Description over 180 chars** — soft-cap blown. Symptom: model's selector context tax goes up; sibling-disambiguation suffers.
- **`## Procedure` as flat prose** — no numbered phases. Symptom: agent execution has implicit phase boundaries; debugging "phase 2 failed" is meaningless.
- **No `## Output` schema** — caller has to guess shape from procedure. Symptom: every caller re-derives parsing logic; integration brittle.
- **No `## Failure modes`** — silent crashes on unexpected inputs. Symptom: caller gets undefined behavior.
- **Lone-file `references/` sibling subdir** — like `agents/research/references/article-quote-finder-corpus.md` (current orphan smell). Symptom: lone-file subfolder is a pattern-in-waiting that drifts to dead code.

## Criteria — rationale + examples

### name-kebab-case

**Pass:** file `agents/review/skill-quality-auditor.md` ↔ frontmatter `name: skill-quality-auditor`.
**Fail:** file `agents/review/SkillQualityAuditor.md` (CamelCase) or mismatch between filename and `name:`.

### description-present-and-budget

**Pass:** "Applies the skill-quality rubric to one SKILL.md and returns structured severity findings. Use from hd:review audit (L2) or critique --rubric skill-quality." (156 chars)
**Fail:** description omitted, or 220 chars long.

### description-third-person

**Pass:** "Applies the rubric…" "Returns findings…"
**Fail:** "I will apply the rubric…" or "You should pass me…"

### color-and-model-set

**Pass:** `color: orange` + `model: inherit`.
**Fail:** missing color (cosmetic) or `model:` absent (silently inherits but explicit is better).

### single-job-statement-present

**Pass:** "Apply the 9-section `skill-quality` rubric to a single SKILL.md file. Produce structured findings with severity per section."
**Fail:** body opens with `## Procedure` directly; no statement of *what this agent fundamentally does*.

### inputs-or-parameters-section-present

**Pass:** "## Inputs — `skill_md_path` (required), `rubric_overrides` (optional)."
**Fail:** parameters discoverable only by reading the procedure body.

### procedure-has-numbered-phases

**Pass:** `### Phase 1: load the rubric` … `### Phase 4: compute composite verdict`.
**Fail:** flat `## Procedure` with bullet points or mixed prose.

### each-phase-imperative-and-actionable

**Pass:** "Read frontmatter `sections`. Iterate by `order`. For each criterion, resolve effective severity → check work item → emit finding."
**Fail:** "Phase 2: Consider whether the rubric applies, and maybe check…"

### output-section-present

**Pass:** `## Output` with YAML block showing the exact shape (`composite`, `sections[]`, `summary`).
**Fail:** output discussed inline in procedure prose; no consolidated schema.

### output-keys-stable

**Pass:** `criterion_id`, `section_slug`, `severity` — stable kebab-case keys.
**Fail:** mixed naming `criterionID`, `severity_level`, `criterion-name` across examples.

### error-output-shape-documented

**Pass:** "If rubric malformed, return `error: rubric-invalid` with one-line diagnosis."
**Fail:** error behavior is "the agent will fail" with no shape.

### coexistence-section-present

**Pass:** `## Coexistence / security` — read-only, scope is X, never accesses Y.
**Fail:** missing — reviewers can't verify boundaries.

### read-only-explicit-when-applicable

**Pass:** "READ-ONLY. Never modifies the SKILL.md being reviewed."
**Fail:** agent procedure includes "save findings to disk" without explicit Coexistence carve-out.

### foreign-mcp-discipline

**Pass:** "When the work item requires MCP access (Figma, Notion), only uses MCPs the calling skill provides — NEVER accesses the plug-in maintainer's own MCPs."
**Fail:** silent on MCP scope; risk of accessing user's personal connections.

### fully-qualified-task-names

**Pass:** any Task call cited as `Task design-harnessing:review:skill-quality-auditor(...)`.
**Fail:** bare `Task skill-quality-auditor(...)` — coexistence-collision red flag.

### failure-modes-section-present

**Pass:** `## Failure modes` enumerates: `skill-md-not-found` / `rubric-not-found` / `rubric-invalid` / etc.
**Fail:** missing — caller gets undefined behavior on edge cases.

### graceful-fallback-documented

**Pass:** "SKILL.md empty or <10 lines → emit p1 finding under §3, abort other section checks." Behavior is named.
**Fail:** "If something goes wrong, error out." Doesn't say which class, doesn't say recovery path.

### when-not-to-use-section

**Pass:** "## When NOT to use this agent — for SKILL.md review, use skill-quality-auditor (specialized); for harness-wide review, use hd:review audit." Disambiguates from siblings.
**Fail:** missing — model occasionally picks wrong sibling.

### see-also-cites-related-agents

**Pass:** `## See also` lists rubric-yaml-schema.md + sister agents + adjacent reference docs.
**Fail:** missing — archaeologist re-derives context.

### references-subdirectory-self-documenting

**Pass:** `agents/research/references/` has 2 files: `article-quote-finder-corpus.md` (loaded by the agent) + `README.md` explaining the directory's purpose. Lone-file pattern resolved into a documented convention.
**Fail:** category has a `references/` subdirectory with a single file and no README.md — pattern-in-waiting; future readers can't tell if it's intentional or vestigial.

## Extending this rubric

Copy to `docs/rubrics/agent-spec-quality-<team>.md` and:

1. Adjust per-criterion `severity` for your team's tolerance
2. Append team-specific criteria — e.g., "every agent must declare estimated wallclock duration"
3. Reference in `hd-config.md` under `critique_rubrics`

## What this rubric does NOT check

- Whether the agent's underlying job is well-chosen (a product/architecture call, not a quality check)
- Whether the agent's procedure correctly implements the stated single job (correctness review territory; out of scope)
- Cross-tool portability (Codex / Cursor) — covered by coexistence checks elsewhere
- Performance characteristics (large context, parallel safety) — covered by `audit-criteria-l3-orchestration.md`

## See also

- [`../../references/rubric-yaml-schema.md`](../../references/rubric-yaml-schema.md) — schema for the YAML frontmatter above
- [skill-quality.md](skill-quality.md) — sister rubric for Layer 2 skills (router-shaped)
- [plan-quality.md](plan-quality.md) — sister rubric for `docs/plans/`
- [lesson-quality.md](lesson-quality.md) — sister rubric for `docs/knowledge/lessons/`
- Compound-engineering agent corpus — pattern reference at `~/.claude/plugins/cache/compound-engineering-plugin/.../agents/`
