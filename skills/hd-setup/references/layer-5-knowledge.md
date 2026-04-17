# Layer 5 — Knowledge Compounding (setup guide)

**Purpose:** action-oriented guide for scaffolding Layer 5 in a user's repo.
**Concept explainer:** [hd-onboard `layer-5-knowledge.md`](../../hd-onboard/references/layer-5-knowledge.md)

## What to scaffold

Three paths under `docs/knowledge/`:

```
docs/knowledge/
├── INDEX.md                    # 1-paragraph explainer + links to lessons/graduations
├── graduations.md              # meta-log of lesson→rule promotions (empty at scaffold)
└── lessons/
    └── YYYY-MM-DD-<slug>.md    # dated lesson entries; append-only
```

Plus `docs/design-solutions/` namespace reserved (not populated at v0.MVP — `hd:compound` writes here starting v0.5).

## Scaffolding steps

1. **Create directory tree** from `templates/knowledge-skeleton/` (INDEX.md, graduations.md, lessons/ dir with .gitkeep).
2. **Seed one starter lesson** — pick something the user just did ("Today we set up the harness; chose `hd-*` prefix because..."). Makes the pattern real; users seeing an empty `lessons/` don't write lessons, users seeing one example write more.
3. **Explain graduation** — surface the lesson→rule promotion pattern in output:
   - "When a lesson recurs 3+ times, graduate it to a rule in `AGENTS.md`"
   - "The original lesson stays — history is sacred"
   - "A meta-entry lands in `graduations.md` linking lesson → rule"
4. **Hand off to `/hd:compound`** (v0.5) for ongoing capture.

## Lesson schema

Every lesson file starts with YAML frontmatter:

```markdown
---
title: "Short title of the lesson"
date: 2026-04-16
tags: [tag-a, tag-b, tag-c]
graduation_candidate: true | false
---

# Lesson

**Context:** What was happening?
**Decision / Observation:** What we did or noticed.
**Result:** How it went.
**Graduation-readiness:** Yes / No / too-early-to-tell.
```

Keep entries short — 5-10 sentences. Long lessons are rare; most are a paragraph.

## File naming convention

- Lessons: `YYYY-MM-DD-<kebab-slug>.md` — e.g. `2026-02-14-fourth-button-variant-reverted.md`
- Multiple lessons same day: add sequential suffix — `YYYY-MM-DD-<slug>-001.md`, `-002.md` etc. (rare)
- Slug is kebab-case, 3-5 words, memorable

## Collision avoidance

- **Never write to `docs/solutions/`** — that's compound-engineering's namespace
- **Write to `docs/design-solutions/` only when `hd:compound` activates** (v0.5+); at v0.MVP `docs/design-solutions/` is reserved but empty

## Graduation workflow (for user awareness)

- Proposer identifies pattern (3+ lessons on same topic) via `hd:compound` (v0.5)
- Plan emitted with proposed rule text + source lessons
- User reviews plan + confirms via plan-hash
- `hd:compound` applies: appends rule to `AGENTS.md`, adds meta-entry to `graduations.md`, lesson files stay untouched

This workflow is NOT in v0.MVP — inform user it's coming at v0.5.

## Audit signals for Layer 5 (v0.5+)

`hd:review` (v1) flags Layer 5 gaps when:

- Lessons accumulate but no graduations ever happen (team forgetting to promote)
- Lessons have no tags (hard to identify recurring patterns)
- `graduations.md` is empty 6+ months into harness use

## See also

- [layer-1-context.md](layer-1-context.md) — context/knowledge separation
- hd-onboard [layer-5-knowledge.md](../../hd-onboard/references/layer-5-knowledge.md) — conceptual version
