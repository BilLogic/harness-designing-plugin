# Layer 5 — Knowledge (depth reference)

**Loaded by:** `SKILL.md` Step 8 when scaffolding or critiquing Layer 5. Seed questions + decision defaults live in SKILL.md; this file provides the 5-memory-type model, domain-grouped-lessons convention, INDEX pattern, and graduation handoff.

**Concept explainer:** [hd-onboard `layer-5-knowledge.md`](../../hd-onboard/references/layer-5-knowledge.md)

## Shape under `docs/knowledge/` (plus-uno-derived)

```
docs/knowledge/
├── INDEX.md              # domain table: Domain | Memory Type | File | Entries | Last Updated | Top Tags
├── README.md             # memory-type taxonomy explainer (article § citations)
├── changelog.md          # memory_type: temporal — harness-structural changes over time
├── decisions.md          # memory_type: procedural-chosen — ADR-style (append-only, supersede; never edit)
├── ideations.md          # memory_type: speculative — open questions + unchosen paths
├── preferences.md        # memory_type: semantic-taste — stable taste calls (mutable w/ team agreement)
└── lessons/              # memory_type: episodic — domain-grouped, NOT per-date
    ├── <domain-1>.md     # created on first capture targeting this domain
    ├── <domain-2>.md
    └── ...               # split threshold ~15 entries per file
```

`graduations.md` — **memory_type: meta-log** — is NOT scaffolded at setup time. Created on first graduation (`/hd:compound graduate-apply`) to avoid empty-file noise. When it appears, it lives at `docs/knowledge/graduations.md`.

Templates for the 6 scaffolded files: [`../assets/knowledge-skeleton/`](../assets/knowledge-skeleton/).

## Five-memory-type model

| Type | File | Lifecycle | What it captures |
|------|------|-----------|------------------|
| **episodic** | `lessons/<domain>.md` | Append-only; history is sacred | Dated narratives of what happened during specific work |
| **procedural-chosen** | `decisions.md` | Append-only; supersede with new entries, never edit | ADR-style chosen-option-with-rationale |
| **semantic-taste** | `preferences.md` | Mutable with team agreement | Stable taste calls |
| **speculative** | `ideations.md` | Append-only; cross off (don't delete) when idea decided | Open questions, unchosen paths |
| **temporal** | `changelog.md` | Append-only | When harness-structural changes happened |
| **meta-log** | `graduations.md` | Append-only; created on first graduation | Which episodic lessons became AGENTS.md rules |

The 5+1 taxonomy comes from agent-memory research (OpenClaw / MemGPT / Generative Agents). Article §2.5 covers the broader harness-memory mapping.

## Memory-type labels appear in three places

1. **YAML frontmatter** on each file — `memory_type: <type>`
2. **INDEX.md** has a Memory Type column
3. **README.md** explains the taxonomy with article § citations

## Domain-grouped lessons (NOT per-date files)

Plus-uno precedent: lessons grouped by DOMAIN into single files (`lessons/ds-compliance.md`, `lessons/integration.md`, `lessons/agent-patterns.md`, `lessons/ui-patterns.md`), each file holding multiple entries separated by `---`.

**Rationale:** per-date files accumulate as noise. Grouping by domain keeps related episodes together; retrieval is more coherent. Split threshold (~15 entries) prevents any file from becoming unwieldy; `/hd:compound capture` proposes sub-domain split when the threshold approaches.

Each domain file has YAML frontmatter:

```yaml
---
memory_type: episodic
domain: <name>
split_threshold: 15
---
```

Individual entries follow with per-entry YAML (title, date, tags, graduation_candidate, importance). See [`../../hd-compound/references/lesson-patterns.md`](../../hd-compound/references/lesson-patterns.md) for the entry schema.

## Seeded starter lesson (first capture post-setup)

If `/hd:setup` creates the `docs/knowledge/` scaffold fresh, the starter lesson is NOT pre-written. Instead, `/hd:setup` Step 10 suggests: *"Capture your first lesson now — the setup session itself is a lesson. Run `/hd:compound capture`."*

If the user does, `/hd:compound capture`:
1. Classifies the subject (likely episodic with domain like `harness-setup` or `meta`)
2. Creates `lessons/<domain>.md` with YAML frontmatter
3. Appends the first entry
4. Updates INDEX.md

This single pattern — domain file created on-first-capture — applies for all future captures too.

## Graduation workflow (Layer 5 → AGENTS.md)

When an episodic-lesson pattern recurs 3+ times on the same topic:

1. User runs `/hd:compound graduate-propose <topic>`
2. Sub-agent `design-harnessing:analysis:graduation-candidate-scorer` evaluates clusters on 3 dimensions (recurrence × clean-imperative × team-agreement)
3. Clusters scoring ≥ 3.5 get a proposed rule + SHA-256 plan hash
4. User reviews, runs `/hd:compound graduate-apply --plan-hash <sha>`
5. Rule lands in `AGENTS.md` under "Graduated rules"; meta-entry in `graduations.md`; **source entries untouched — history is sacred**

This workflow is owned by `/hd:compound`; Layer 5 setup only prepares the directory structure + informs the user that compounding happens via that skill.

## Coexistence

- ❌ Never write to `docs/solutions/` — that's compound-engineering's namespace
- ✅ `docs/design-solutions/` is ours (reserved for distilled pattern-solutions in future releases)

## Audit signals (hd:review audit surfaces these)

Layer 5 drift signals:
- **Graduation drought** — 10+ entries with same tag across lessons/* + 0 graduations (team captures but never promotes)
- **Missing tags** — entries without `tags:` field (hard to cluster)
- **Stale INDEX** — INDEX.md entry counts don't match actual file contents (re-sync needed)
- **Burst-capture** — all entries in a file from a single week then nothing (no ongoing discipline)
- **Oversized domain file** — >15 entries without a sub-domain split

The `graduation-candidate-scorer` sub-agent quantifies these signals for `hd:review audit`.

## See also

- [layer-1-context.md](layer-1-context.md) — context/knowledge separation (different memory types, different lifecycles)
- [hd-onboard/references/layer-5-knowledge.md](../../hd-onboard/references/layer-5-knowledge.md) — concept explainer
- [`../../hd-compound/references/lesson-patterns.md`](../../hd-compound/references/lesson-patterns.md) — entry authoring + domain-file schema
- [`../../hd-compound/references/graduation-criteria.md`](../../hd-compound/references/graduation-criteria.md) — 3-criterion rule for graduation-readiness
- [`../../hd-compound/references/plan-hash-protocol.md`](../../hd-compound/references/plan-hash-protocol.md) — SHA-256 proof-of-consent spec
- Plus-uno reference implementation: [github.com/BilLogic/plus-uno/tree/main/docs/knowledge](https://github.com/BilLogic/plus-uno/tree/main/docs/knowledge)
