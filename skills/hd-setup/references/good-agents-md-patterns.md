# Good AGENTS.md patterns

**Purpose:** exemplary AGENTS.md shape + anti-patterns to avoid. Shared across all scaffolding decisions that write or modify `AGENTS.md`.

## What AGENTS.md IS

The repo-root source of truth for how AI should behave in this codebase. Read natively by Claude Code, Codex CLI, Cursor CLI, Windsurf, GitHub Copilot coding agent (2026 baseline).

Loaded as **Tier 1 context** — always, on every task. Budget: ≤200 lines total when combined with `docs/context/product/one-pager.md`.

## Structure of a healthy AGENTS.md

Six sections, in order:

1. **Philosophy / one-paragraph product thesis** (5-10 lines)
2. **Repo layout** (annotated tree, 15-25 lines)
3. **Command naming convention** (if plug-in authoring) OR just "how we work" section (10-15 lines)
4. **Coexistence rules** (if other AI tools in play) (5-15 lines)
5. **Skill / code compliance checklist** (20-40 lines)
6. **Graduated rules section** — starts empty; populates via Layer 5 graduation (5-50 lines depending on team age)

Total: 100-150 lines when healthy. Budget exceeded = drift; promote content to Tier 2.

## Good excerpt example

```markdown
# design-harness — Plug-in Conventions

Canonical source of truth. Read natively by Claude Code, Codex CLI, Cursor CLI,
Windsurf, GitHub Copilot. Other tools get thin redirects (CLAUDE.md, .cursor/rules/).

## Philosophy

A design harness is the wrapper of context, skills, orchestration, rubrics, and knowledge
built around an AI system so every design task inherits team thinking.

## Repo layout

[flat tree with 15 lines]

## Command naming

All commands use `hd:` prefix (two letters — *harness design*).
Never ship bare names.

## Coexistence with compound-engineering

| Compound's | Ours |
|---|---|
| `/ce:*` | `/hd:*` |
| `docs/solutions/` | `docs/design-solutions/` |

## Skill compliance checklist

[20-line checklist]

## Graduated rules

<!-- Add new graduated rules above this line. -->
- [2026-04-16] Button variants limited to approved set; new variants require RFC.
  Source: docs/knowledge/lessons/2026-04-16-button-variants-escape-hatch.md
```

## Anti-patterns

### Anti-pattern 1: Mixing rules with stories

**Bad:**
```markdown
## Button variants

We have primary, secondary, ghost. Remember we tried a 4th variant for marketing
in Feb 2026 but reverted because it caused drift. Also in Q3 2025 we considered
adding an outlined variant but deferred.
```

**Why wrong:** Procedural memory (the rule) mixed with episodic memory (the stories). Stories belong in Layer 5 lessons. AGENTS.md stays rule-only.

**Fix:**
```markdown
## Button variants

Approved: primary, secondary, ghost. New variants require RFC.
(See docs/knowledge/lessons/ for historical attempts.)
```

### Anti-pattern 2: The kitchen-sink AGENTS.md

**Bad:** 800-line AGENTS.md that tries to be the complete design system reference, coding standards, product history, onboarding guide, and rule set all in one file.

**Why wrong:** Violates Tier 1 budget catastrophically. AI ignores sections. Signal-to-noise tanks.

**Fix:** Keep AGENTS.md to rules + rubric gates + graduated rules. Everything else promotes to Tier 2 (`docs/context/*`) or Tier 3 (archived).

### Anti-pattern 3: Time-sensitive statements

**Bad:**
```markdown
Before August 2025, we used the v1 API. After August 2025, use v2.
```

**Why wrong:** Goes stale. Creates ambiguity for tasks running after the transition.

**Fix:** State current behavior directly. Put deprecated patterns in a collapsed `<details>` block or move to Layer 5 lessons:

```markdown
## API

Use v2: `api.example.com/v2/messages`.

<details>
<summary>Legacy v1 (deprecated 2025-08)</summary>
[v1 details]
</details>
```

### Anti-pattern 4: Vague rules

**Bad:**
```markdown
- Write clean code
- Be mindful of performance
- Follow best practices
```

**Why wrong:** Unactionable. AI can't check these.

**Fix:** Concrete, testable rules:

```markdown
- Every public method has a docstring.
- No N+1 queries (use .includes() or equivalent).
- Cyclomatic complexity ≤10 per function.
```

### Anti-pattern 5: Missing coexistence rules

If the repo uses multiple AI plug-ins (compound-engineering + design-harness, etc.), AGENTS.md MUST declare namespace isolation rules. Missing these = silent collision (plug-ins overwrite each other's output paths).

## Pre-write check

Before `hd:setup` writes or modifies AGENTS.md, verify:

- [ ] Current content backed up to `AGENTS.md.bak-YYYYMMDD` if modifying
- [ ] Diff preview shown to user before apply
- [ ] Tier 1 budget check (new total ≤200 lines)
- [ ] No anti-patterns introduced by the change

## See also

- [tier-budget-model.md](tier-budget-model.md) — budget enforcement
- [coexistence-checklist.md](coexistence-checklist.md) — coexistence rules detail
- [layer-1-context.md](layer-1-context.md) — Context layer scaffolding
