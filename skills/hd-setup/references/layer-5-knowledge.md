# Layer 5 — Knowledge (depth reference)

**Loaded by:** `SKILL.md` Step 8 when scaffolding or critiquing Layer 5. Seed questions + decision defaults live in SKILL.md; this file provides the lesson schema, file-naming rules, and graduation-workflow awareness.

**Concept explainer:** [hd-onboard `layer-5-knowledge.md`](../../hd-onboard/references/layer-5-knowledge.md)

## What gets scaffolded

Three paths under `docs/knowledge/`:

```
docs/knowledge/
├── INDEX.md                    # 1-paragraph explainer + links to lessons/graduations
├── graduations.md              # meta-log of lesson→rule promotions (empty at scaffold)
└── lessons/
    └── YYYY-MM-DD-<slug>.md    # dated lesson entries; append-only
```

Source templates: [`../assets/knowledge-skeleton/`](../assets/knowledge-skeleton/).

`docs/design-solutions/` is a reserved namespace (not populated by this skill — `/hd:compound` writes distilled pattern-solutions there in future releases).

## Lesson YAML schema

Every lesson file starts with:

```markdown
---
title: "Short title of the lesson"
date: 2026-04-16
tags: [tag-a, tag-b, tag-c]
graduation_candidate: true | false | too-early-to-tell
importance: 3                   # optional 1–5; used by lesson-retriever sub-agent
---

# Lesson

**Context:** What was happening?
**Decision / Observation:** What we did or noticed.
**Result:** How it went.
**Graduation-readiness:** Yes / No / too-early-to-tell.
```

Keep entries short — 5–10 sentences. Most are a paragraph. Long lessons are rare.

## File naming

- Lessons: `YYYY-MM-DD-<kebab-slug>.md` — e.g., `2026-02-14-fourth-button-variant-reverted.md`
- Multiple lessons same day: sequential suffix `-001`, `-002` (rare)
- Slug is kebab-case, 3–5 words, memorable

## Seeded starter lesson

The scaffold writes one starter lesson capturing something the user just did ("Today we set up the harness; chose `hd-*` prefix because…"). Users seeing an empty `lessons/` don't write lessons; users seeing one example do. The pattern matters more than the content — delete + rewrite is fine.

## Graduation workflow (Layer 5 → AGENTS.md)

When a lesson recurs 3+ times on the same topic:

1. User runs `/hd:compound graduate-propose <topic>`
2. Sub-agent `design-harnessing:analysis:graduation-candidate-scorer` evaluates clusters on 3 dimensions (recurrence × clean-imperative × team-agreement)
3. Clusters scoring ≥ 3.5 get a proposed rule + SHA-256 plan hash
4. User reviews, runs `/hd:compound graduate-apply --plan-hash <sha>`
5. Rule lands in `AGENTS.md` under "Graduated rules"; meta-entry in `graduations.md`; **source lesson files stay untouched — history is sacred**

This workflow is owned by `/hd:compound`; Layer 5 setup only prepares the directory structure + informs the user that compounding happens via that skill.

## Coexistence

- ❌ Never write to `docs/solutions/` — that's compound-engineering's namespace
- ✅ `docs/design-solutions/` is ours (reserved for distilled pattern-solutions in future releases)

## Audit signals (hd:review audit surfaces these)

Layer 5 drift signals:
- **Graduation drought** — 10+ lessons with same tag + 0 graduations (team captures but never promotes)
- **Missing tags** — lessons without `tags:` field (hard to cluster)
- **Stale INDEX** — `graduations.md` empty 6+ months into harness use
- **Burst-capture** — all lessons from a single week then nothing (no ongoing discipline)

The `graduation-candidate-scorer` sub-agent quantifies these signals for `hd:review audit`.

## See also

- [layer-1-context.md](layer-1-context.md) — context/knowledge separation (different memory types, different lifecycles)
- [hd-onboard/references/layer-5-knowledge.md](../../hd-onboard/references/layer-5-knowledge.md) — concept explainer
- [`../../hd-compound/references/lesson-patterns.md`](../../hd-compound/references/lesson-patterns.md) — lesson authoring discipline (used by hd:compound capture)
- [`../../hd-compound/references/graduation-criteria.md`](../../hd-compound/references/graduation-criteria.md) — 3-criterion rule for graduation-readiness
- [`../../hd-compound/references/plan-hash-protocol.md`](../../hd-compound/references/plan-hash-protocol.md) — SHA-256 proof-of-consent spec
