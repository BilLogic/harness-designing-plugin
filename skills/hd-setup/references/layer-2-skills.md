# Layer 2 — Skill Curation (setup guide)

**Purpose:** action-oriented guide for the Skill Curation layer during setup and audit.
**Concept explainer:** [hd-onboard `layer-2-skills.md`](../../hd-onboard/references/layer-2-skills.md) — "what IS Layer 2?"

## v0.MVP scope — Layer 2 is NOT actively scaffolded

`hd:setup` at v0.MVP does not generate skills for users. Teams author their own skills. This layer is referenced during:

- **Greenfield mode** — inform user that Layer 2 exists; point at skill-authoring resources; do NOT scaffold an empty `skills/` dir
- **Advanced mode (audit)** — check if user has skills; flag if none after 3+ months of harness use ("you've got context and knowledge; might be time for your first skill")

## What "good Layer 2" looks like

Teams that get Layer 2 right have:

- **3-5 skills** before considering more — not 0 (undercooked), not 30 (faking maturity)
- Each skill has **one job, clear trigger, bounded scope**
- Skills are named with a **team prefix** (like `hd-*`, `ce-*`, `figma-*`) — avoids collisions
- SKILL.md is **≤200 lines**; overflow in `references/`
- **Commands exposed via skill-name frontmatter** (`name: prefix:verb`), not via a separate `commands/` dir (compound v2.39.0 convention)

## When a team earns its first skill

Add a skill when:

1. A pattern has repeated 3+ times and someone keeps re-explaining it
2. The pattern survives cross-team use (not one person's quirk)
3. The skill can be bounded (no "does everything" skills)

If the pattern is team-specific and one-off, it's a Layer 1 convention entry, not a skill.

## When `hd:setup` suggests Layer 2 expansion

During advanced audit, `hd:setup` flags Layer 2 as a gap when:

- `docs/knowledge/lessons/` has 10+ lessons AND no graduations AND no skills
- `AGENTS.md` has 20+ rules (graduated or not) — some rules are probably skill-shaped
- User reports spending >30% of AI session time on repetitive prompting patterns

## Skill-authoring resources (shared with contributors)

Required reading before a user authors their own first skill:

- Anthropic — [Skill best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
- Anthropic — [Complete Guide to Building Skills for Claude](https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf)
- EveryInc — [compound-engineering `skills/create-agent-skills/`](https://github.com/EveryInc/compound-engineering-plugin) — meta-skill for authoring skills

Our own conventions in [../../../AGENTS.md](../../../AGENTS.md) § Skill compliance checklist distill these into a compliance checklist.

## See also

- [tier-budget-model.md](tier-budget-model.md) — how skills interact with context budget
- hd-onboard [layer-2-skills.md](../../hd-onboard/references/layer-2-skills.md) — conceptual version
