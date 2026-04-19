---
title: Capture-mode procedure
loaded_by: hd-maintain
---

# Capture mode — full procedure

## Purpose

Step-by-step procedure for `/hd:maintain capture`: classify the memory type, resolve target file (date-slugged `lessons/YYYY-MM-DD-<slug>.md` for episodic, or the appropriate shared memory file), draft, approve, atomic-write, and surface rule-candidate signals. Invoked by the capture-mode workflow checklist in `../SKILL.md`.

## Steps

**Step 1 — Identify subject + memory type.** Extract from conversation. Classify against the canonical-4 frame from article §2.5 (procedural / semantic / episodic / working); derivative subtype names on the right are the operational labels used in frontmatter:

- "What happened during this work?" → **episodic** (canonical) → `docs/knowledge/lessons/YYYY-MM-DD-<slug>.md` (new file)
- "What did we choose, and why?" → **procedural** → subtype `procedural-chosen` → `docs/knowledge/decisions.md`
- "What taste/workflow call are we standardizing?" → **semantic** → subtype `semantic-taste` → `docs/knowledge/preferences.md`
- "What idea are we exploring / deferring?" → **semantic** (not-yet-committed) → subtype `speculative` → `docs/knowledge/ideations.md`
- "What harness-structural change happened?" → **episodic** (time-ordered) → subtype `temporal` → `docs/knowledge/changelog.md`

If thin/ambiguous, ask: *"What's the lesson? Answer in one sentence."* Then: *"Is this (a) episodic what-happened, (b) a decision we made, (c) a preference we hold, (d) an idea to explore, or (e) a harness-structural change?"* Default when unclear: episodic lesson.

**Step 2 — Resolve target file.**

**If episodic (most common):** create a **new** file at `docs/knowledge/lessons/YYYY-MM-DD-<slug>.md` where:
1. `YYYY-MM-DD` is today's ISO date
2. `<slug>` is kebab-case, derived from the primary tag or a user-supplied short descriptor (confirm with user if ambiguous)
3. If a file with that exact name already exists (same-day duplicate), append a disambiguator (`-2`, `-3`) rather than overwriting

One file per lesson event — **never** append to an existing lesson file. See [`lesson-patterns.md` § File organization](lesson-patterns.md).

**If non-episodic:** target is one of the shared files (`decisions.md`, `preferences.md`, `ideations.md`, `changelog.md`). These files always exist post-setup; append the new entry.

**Step 3 — Optional retrieval.** If context budget permits, invoke:

```
Task design-harnessing:research:lesson-retriever(
  lessons_root: "docs/knowledge/lessons/",
  topic: <subject-keywords>,
  max_results: 3
)
```

to surface similar past lessons. Findings enrich the new entry's rationale + flag rule-candidacy. Skip in compact-safe mode.

**Step 4 — Draft the entry.** Use [`../assets/lesson.md.template`](../assets/lesson.md.template) as the per-entry shape (for episodic lessons). Other memory types have per-file formats documented in each file's template — see `knowledge-skeleton/decisions.md.template`, `ideations.md.template`, etc.

Entry YAML (episodic):
- `date` — today's ISO date
- `tags` — 1–5 kebab-case; grep existing entries in this file + sibling domain files to avoid tag-drift
- `rule_candidate` — `true` / `false` / `too-early-to-tell`

Entry body — 4 sections, each 1–3 sentences: **Context / Decision / Result / Graduation-readiness.**

**Step 5 — Tag-cluster check.** After classifying tags, grep `docs/knowledge/lessons/*.md` for frontmatter matches. If ≥ 3 existing lesson files share any tag with this new entry, flag the cluster as a rule adoption candidate in the Step 8 summary. Non-blocking; rule adoption is a separate flow.

**Step 6 — Approval.** Show the drafted entry verbatim + target file path (new file for episodic; append location for shared files). User approves (Y), edits (E), or aborts (A). Never write without explicit Y/E.

**Step 7 — Atomic write.** For episodic: write the full file to a temp path then `mv` it to `docs/knowledge/lessons/YYYY-MM-DD-<slug>.md`. For non-episodic shared files: append entry with `---` separator, temp file + `mv`. Always update `docs/knowledge/INDEX.md` entry count + last-updated.

**Step 8 — Summarize.** Report target file + tag-cluster signal (if any). Next-step suggestion: `/hd:maintain rule-propose <topic>` when ≥ 3 lesson files share a tag.

→ Return to [../SKILL.md § capture-mode](../SKILL.md#capture-mode)
