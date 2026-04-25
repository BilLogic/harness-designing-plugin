---
memory_type: semantic-taste
domain: preferences
split_threshold: 20
---
<!-- Tier: 2 (taste calls, mutable with team agreement) -->
# Preferences

Stable taste calls the team holds. More permissive than decisions.md — these are aesthetic / workflow preferences that don't need formal ADR treatment, but shape how work gets done.

## How this differs from decisions

- **Decisions** are architecturally consequential ("we chose Next.js over Remix")
- **Preferences** are stylistic / workflow ("we prefer feature flags over env-gates")

Both inform agent behavior; this file is where the agent learns the team's taste.

## Entries

- **Name skills by verb-intent, not noun-outcome.** `hd-learn` / `hd-setup` / `hd-maintain` / `hd-review` beat `hd-onboarding` / `hd-scaffolder` / `hd-knowledge` / `hd-auditor`. Verb-intent maps to the user's cognitive action at invocation time; noun-outcome maps to the artifact produced, which is less discoverable. Adopted via the 3i.1 rename; confirmed during pilot runs.
- **Dogfood before shipping.** Every convention defined in `skills/hd-setup/assets/` must also exist in this plug-in's own `docs/` meta-harness. If we can't live with it, users won't either.
- **Plan-then-work over single-shot.** Every Phase 3x change lands as a plan file in `docs/plans/` first, then the commit. Makes rollback + audit trivial.

<!-- Add entries inline. Bullet list format OK. When entries exceed ~20, consider splitting by theme. -->

## Mutable with team agreement

Preferences CAN change. When one does:
1. Update the entry (don't strike through; this isn't an ADR)
2. Note the change in `changelog.md` with the date
3. If the change affects existing work, flag it as a rule adoption candidate
