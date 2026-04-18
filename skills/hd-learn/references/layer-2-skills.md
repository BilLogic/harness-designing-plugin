# Layer 2 — Skill Curation

**Article source:** §4b.
**Memory type:** procedural ("how we work") — see [memory-taxonomy.md](memory-taxonomy.md).
**Mutability:** additive; skills graduate from scratch → team → plug-in.

## What belongs here

Reusable capabilities your harness offers. A **skill** is a named, versioned piece of *how-we-work* with:

- A single job ("review this design against our rubric")
- A clear trigger ("when a PR touches UI")
- Bounded scope (not a catch-all)
- Its own `references/` / `templates/` / `scripts/` per progressive disclosure

## Examples of real skills

Fictionalized but concrete:

- `dh-critique` — one-shot design review applying the team's accessibility rubric
- `dh-spec` — generate a dev spec from a Figma frame
- `dh-tokens` — check code tokens against the Figma library and flag drift
- `dh-research` — before proposing a new pattern, check if something similar already exists

Real skills from this plug-in:

- `hd-learn` — this skill — answer concept questions
- `hd-setup` — adaptive scaffold/reorganize/audit
- `hd-maintain` — capture lessons + graduate to rules
- `hd-review` — audit harness + critique work items

## When to add a skill

Don't fake maturity. **3 well-used skills beat 30 dead ones.** Add a skill when:

1. A pattern has repeated 3+ times and someone keeps re-explaining it
2. The pattern survives cross-team use (not one person's quirk)
3. The skill can be bounded (no "does everything" skills)

## Skill authoring

Skill authoring is a discipline — not an ad-hoc prose-writing exercise. Three canonical sources for how to author skills well:

- Anthropic's [Skill best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
- Anthropic's [Complete Guide to Building Skills for Claude](https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf)
- compound-engineering's [`skills/create-agent-skills/`](https://github.com/EveryInc/compound-engineering-plugin) meta-skill

Our plug-in's contributor conventions in [AGENTS.md](../../../AGENTS.md) distill these into a skill compliance checklist.

## What does NOT belong here

- **Rules** (procedural) — those go in `AGENTS.md` directly, not as skills
- **Data / reference material** — that's Layer 1 context, not a skill
- **Episodic lessons** — those go in Layer 5 knowledge

## Scaffolded by

`/hd:setup` does not actively scaffold Layer 2 at v0.MVP (we don't generate skills for users — they author their own). At v0.5, `hd:setup` advanced-mode audit will flag when a Layer 2 skill is missing but the harness would benefit from one.

## See also

- [concept-overview.md](concept-overview.md) — five-layer frame
- [memory-taxonomy.md](memory-taxonomy.md) — why Layer 2 is procedural
- [AGENTS.md § Skill compliance checklist](../../../AGENTS.md#skill-compliance-checklist) — our authoring rules
