# Layer 2 — Skills (depth reference)

**Loaded by:** `SKILL.md` Step 5 when scaffolding or critiquing Layer 2. Seed questions + decision defaults live in SKILL.md; this file provides the "what good looks like" criteria and skill-authoring resources.

**Concept explainer:** [hd-learn `layer-2-skills.md`](../../hd-learn/references/layer-2-skills.md) — "what IS Layer 2?"

## hd:setup does NOT author skills for users

Teams author their own skills — `hd:setup` provides guidance + prerequisite checks, never generates. The skill's Layer 2 step:

- **Scaffold default** — skip (Layer 2 is premature for most teams; revisit when patterns emerge)
- **Critique default** — invoke `design-harnessing:review:skill-quality-auditor` per existing SKILL.md
- **Link default** — if user has `.claude/skills/` / `.cursor/skills/` / `.agent/skills/` already, write pointer files to those locations

## What "good Layer 2" looks like

Teams that get Layer 2 right have:

- **3-5 skills** before considering more — not 0 (undercooked), not 30 (faking maturity)
- Each skill has **one job, clear trigger, bounded scope**
- Skills are named with a **team prefix** (like `hd-*`, `figma-*`, `acme-*`) — avoids collisions
- SKILL.md is **≤200 lines**; overflow in `references/`
- **Commands exposed via skill-name frontmatter** (`name: prefix:verb`), not via a separate `commands/` dir

## When a team earns its first skill

Add a skill when:

1. A pattern has repeated 3+ times and someone keeps re-explaining it
2. The pattern survives cross-team use (not one person's quirk)
3. The skill can be bounded (no "does everything" skills)

If the pattern is team-specific and one-off, it's a Layer 1 convention entry, not a skill.

## When `hd:setup` suggests Layer 2 expansion

During advanced audit, `hd:setup` flags Layer 2 as a gap when:

- `docs/knowledge/lessons/` has 10+ lessons AND no rule adoptions AND no skills
- `AGENTS.md` has 20+ rules (promoted or not) — some rules are probably skill-shaped
- User reports spending >30% of AI session time on repetitive prompting patterns

## Skill-authoring resources (shared with contributors)

Required reading before a user authors their own first skill:

- Anthropic — [Skill best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
- Anthropic — [Complete Guide to Building Skills for Claude](https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf)

Our own conventions in [../../../AGENTS.md](../../../AGENTS.md) § Skill compliance checklist distill these into a compliance checklist.

## Procedure — Step 5

**Frame:** "Layer 2 — Skills. AI capabilities your team codifies. Procedural memory (article §4b)."

**Show:** `has_external_skills`, `has_claude_dir`, `.agent/skills/` presence.

**Propose default:**
- `has_external_skills: true` → **critique** via skill-quality rubric
- `.agent/skills/` → **link**
- Nothing → **skip** (Layer 2 is premature for most teams)

**Execute — critique:** per-skill invocation:

```
Task design-harnessing:review:skill-quality-auditor(
  skill_md_path: "<path>/SKILL.md"
)
```

Aggregate findings. Present to user. Don't modify anything.

**Execute — scaffold:** seed questions: (1) workflow explained 3+ times last month? (2) repetitive task worth automating? Point user at the "What good Layer 2 looks like" section above for authoring discipline.

→ Return to [../SKILL.md § Step 5 — Layer 2 (Skills)](../SKILL.md#step-5--layer-2-skills)

## See also

- [layer-1-context.md](layer-1-context.md) — Tier-1 budget model (how skills interact with context budget)
- hd-learn [layer-2-skills.md](../../hd-learn/references/layer-2-skills.md) — conceptual version
