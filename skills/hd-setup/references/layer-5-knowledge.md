# Layer 5 — Knowledge (depth reference)

**Loaded by:** `SKILL.md` Step 8 when setting up or reviewing Layer 5. Seed questions + decision defaults live in SKILL.md; this file provides the canonical-4 memory frame, output shape, and rule-adoption handoff.

**Concept explainer:** [hd-learn `layer-5-knowledge.md`](../../hd-learn/references/layer-5-knowledge.md)

## Canonical shape under `docs/knowledge/`

```
docs/knowledge/
├── changelog.md          # memory_type: temporal (episodic subtype) — harness-structural events
├── decisions.md          # memory_type: procedural-chosen — ADR-style (append-only, supersede)
├── ideations.md          # memory_type: speculative — open questions + unchosen paths
├── preferences.md        # memory_type: semantic-taste — stable taste calls (mutable w/ team agreement)
└── lessons/
    └── .gitkeep          # seeded empty; populates as /hd:maintain capture runs
```

**No `INDEX.md`.** Per 3k.13, AGENTS.md Harness map is the sole index for every layer, including L5. The L5 section in AGENTS.md lists `changelog.md`, `decisions.md`, `ideations.md`, `preferences.md`, and `lessons/`.

**No starter lesson.** `/hd:setup` scaffolds the 4 top-level files + empty `lessons/` dir. First real lesson comes from `/hd:maintain capture` (setup Step 10 nudges the user to run it).

**`changelog.md` IS created at setup.** Template seed: one `## YYYY-MM-DD — harness setup` entry recording the setup event itself. Not empty, not placeholder — the real first structural event.

Templates for the 4 scaffolded files: [`../assets/knowledge-skeleton/`](../assets/knowledge-skeleton/). (No `INDEX.md.template` — retired in 3k.13. No starter `lesson.md` in the skeleton — lessons come via `/hd:maintain capture`.)

## Memory types in Layer 5

Anchor: article §2.5 canonical-4 frame — **procedural / semantic / episodic / working**. Layer 5 is primarily **episodic** memory (what happened), plus procedural-chosen (decisions) + semantic-taste (preferences) + speculative (ideations).

| File | Canonical type (article §2.5) | Derivative subtype | Lifecycle | What it captures |
|------|------------------------------|--------------------|-----------|------------------|
| `lessons/<slug>.md` | **episodic** | — (canonical) | Append-only; history is sacred | Dated narratives of what happened |
| `decisions.md` | **procedural** | procedural-chosen (ADR) | Append-only; supersede entries | Chosen-option-with-rationale |
| `preferences.md` | **semantic** | semantic-taste | Mutable with team agreement | Stable taste calls |
| `ideations.md` | **semantic** (not-yet-committed) | speculative | Append-only; cross off when decided | Open questions, unchosen paths |
| `changelog.md` | **episodic** (time-ordered) | temporal + meta-log | Append-only | Harness events + rule adoptions |

The canonical-4 frame from article §2.5 is the primary vocabulary. Derivative subtype names appear in `memory_type:` YAML frontmatter as role labels.

## Lesson file naming

**Canonical:** per-date files at `docs/knowledge/lessons/YYYY-MM-DD-slug.md`. One file per captured event.

**Alternative (larger teams):** domain-grouped files (`lessons/ds-compliance.md`, `lessons/integration.md`, etc.), each holding multiple dated entries separated by `---`. Plus-uno uses this pattern. If a team opts in, `/hd:maintain capture` proposes sub-domain split at ~15 entries per file.

Default is per-date. Teams can switch by setting `hd-config.md:lessons_format: domain-grouped`.

## Rule adoption workflow (Layer 5 → AGENTS.md)

When an episodic-lesson pattern recurs 3+ times on the same topic:

1. User runs `/hd:maintain rule-propose <topic>`
2. Sub-agent `design-harnessing:analysis:rule-candidate-scorer` evaluates clusters on 3 dimensions (recurrence × clean-imperative × team-agreement)
3. Clusters scoring ≥ 3.5 get a proposed rule + SHA-256 plan hash
4. User reviews, runs `/hd:maintain rule-apply --plan-hash <sha>`
5. Rule lands in `AGENTS.md` under "Rules"; meta-entry in `changelog.md`; **source entries untouched — history is sacred**

This workflow is owned by `/hd:maintain`; Layer 5 setup only prepares the directory structure + informs the user that compounding happens via that skill.

## Coexistence

- ❌ Never write to `docs/solutions/` — reserved for other tools
- ✅ `docs/design-solutions/` is ours (reserved for distilled pattern-solutions in future releases)
- ✅ `docs/knowledge/reviews/` is the review-report destination (3l.2), separate from `lessons/`

## Review signals (hd:review surfaces these)

Layer 5 drift signals (per [`../../hd-review/references/review-criteria-l5-knowledge.md`](../../hd-review/references/review-criteria-l5-knowledge.md)):

- **Rule-adoption drought** — 10+ entries with same tag + 0 rule adoptions
- **Missing tags** — entries without `tags:` field (hard to cluster)
- **Burst-capture** — all entries from a single week then nothing
- **Changelog placeholder residue** — `{{...}}` left unfilled

## Procedure — Step 8

**Frame:** "Layer 5 — Knowledge. What the team has learned. Episodic memory + procedural (article §4e)."

**Show:** `has_plans_convention` + count, existing lessons count, rule adoption count, `team_tooling.docs` (for retros) and `team_tooling.pm` (for closed-issue decisions).

**Propose default (post-3l.4):**
- `has_plans_convention: true` or `has_knowledge_dir: true` → **review** — run `rule-candidate-scorer` on existing entries; surface improvement suggestions
- `team_tooling.docs` + MCP live → **create** + offer to pull retro/post-mortem/decision-labeled pages
- Nothing → **create** the 4 canonical files + empty `lessons/` from [`../assets/knowledge-skeleton/`](../assets/knowledge-skeleton/)

**Execute — review:** invoke:

```
Task design-harnessing:analysis:rule-candidate-scorer(
  lessons_root: "docs/knowledge/lessons/",
  rules_log: "docs/knowledge/changelog.md"
)
```

Surface ready clusters to user. Suggest `/hd:maintain rule-propose <topic>` for each.

**Execute — create:** write exactly these files:
- `docs/knowledge/changelog.md` (from template)
- `docs/knowledge/decisions.md` (from template)
- `docs/knowledge/ideations.md` (from template)
- `docs/knowledge/preferences.md` (from template)
- `docs/knowledge/lessons/.gitkeep` (empty)

Update AGENTS.md Harness map L5 section to list the above. No `INDEX.md` written.

→ Return to [../SKILL.md § Step 8 — Layer 5 (Knowledge)](../SKILL.md#step-8--layer-5-knowledge)

## See also

- [layer-1-context.md](layer-1-context.md) — context/knowledge separation
- [hd-learn/references/layer-5-knowledge.md](../../hd-learn/references/layer-5-knowledge.md) — concept explainer
- [`../../hd-maintain/references/lesson-patterns.md`](../../hd-maintain/references/lesson-patterns.md) — entry authoring
- [`../../hd-maintain/references/rule-adoption-criteria.md`](../../hd-maintain/references/rule-adoption-criteria.md) — 3-criterion rule-readiness
- [`../../hd-maintain/references/plan-hash-protocol.md`](../../hd-maintain/references/plan-hash-protocol.md) — SHA-256 proof-of-consent
- Plus-uno reference: [github.com/BilLogic/plus-uno/tree/main/docs/knowledge](https://github.com/BilLogic/plus-uno/tree/main/docs/knowledge)
