# Workflow — Capture lesson

**When to use:** user says "save this lesson," "capture this decision," "log that we chose X," or invokes `/hd:compound capture`.
**Goal:** append one dated lesson to `docs/knowledge/lessons/YYYY-MM-DD-<slug>.md` following the schema in [`../references/lesson-patterns.md`](../references/lesson-patterns.md). **Append-only — never modifies existing lessons.**

## Progress checklist

```
Capture Progress:
- [ ] Step 1: Identify the lesson subject
- [ ] Step 2: Draft YAML frontmatter
- [ ] Step 3: Draft body (Context / Decision / Result / Graduation-readiness)
- [ ] Step 4: Compute slug + target path
- [ ] Step 5: Check for path collision
- [ ] Step 6 (optional): Phase-1 research for similar past lessons
- [ ] Step 7: Show user the drafted lesson
- [ ] Step 8: On approval, atomic write
- [ ] Step 9: Summarize with graduation-candidate signal
```

## Step 1 — Identify subject

Extract the lesson content from conversation context. If context is thin or ambiguous, ASK:

> "What's the lesson? Answer in one sentence."

Then ask follow-ups to flesh out Context / Decision / Result if not already clear.

## Step 2 — Draft frontmatter

Per [`../references/lesson-patterns.md`](../references/lesson-patterns.md) § YAML frontmatter schema:

- `title` — 3-10 word descriptive imperative (e.g., "Don't ship future-version skill stubs with disable-model-invocation")
- `date` — today's ISO date
- `tags` — 1-5 kebab-case tags mixing topic + domain + status. Use consistent naming with past lessons (grep `docs/knowledge/lessons/*.md` for existing tags to avoid drift)
- `graduation_candidate` — `true` if ≥1 prior matching lesson + clean imperative + team agreement likely; else `false` or leave as `too-early-to-tell`

## Step 3 — Draft body

Per [`../references/lesson-patterns.md`](../references/lesson-patterns.md) § Body structure — four sections in order. Each 1-3 sentences. Total body 5-10 sentences typical.

Use [`../templates/lesson.md.template`](../templates/lesson.md.template) as scaffolding. Fill every `{{PLACEHOLDER}}`. Don't leave `{{TODO}}` markers for this file — the lesson should be complete at capture time.

## Step 4 — Compute slug + target path

Slug rules:
- Kebab-case
- 3-7 words
- Derived from title (not date)
- Stable (used in graduation plan-hash later)

Target path: `docs/knowledge/lessons/YYYY-MM-DD-<slug>.md`.

Example: title `"Don't ship future-version skill stubs with disable-model-invocation"` → slug `no-future-version-stubs` → path `docs/knowledge/lessons/2026-04-16-no-future-version-stubs.md`.

## Step 5 — Check for collision

```bash
if [ -f "docs/knowledge/lessons/YYYY-MM-DD-<slug>.md" ]; then
  # Collision — surface to user
fi
```

On collision, ask user:

1. **Edit existing** — open the existing file; proposed content may append as a new section (rare)
2. **Append suffix** — write to `YYYY-MM-DD-<slug>-001.md` (next available suffix)
3. **Abort** — cancel capture

Never silently overwrite.

## Step 6 (optional) — Phase-1 research

If context budget permits (not compact-safe mode), invoke:

```
Task compound-engineering:research:learnings-researcher(<topic>)
```

to surface similar past lessons from `docs/knowledge/lessons/` or compound's `docs/solutions/`. Findings inform:

- Tag consistency (use existing tags rather than inventing new)
- Graduation-readiness (count of existing matching lessons)
- Cross-references (the new lesson can note related past lessons)

Skip this step in **compact-safe mode** (context budget tight per compound 2.39.0 lesson). Capture still works without research.

## Step 7 — Show user the drafted lesson

Before any write, display the complete lesson (frontmatter + body) and ask for approval:

> Here's the drafted lesson. Approve write? (yes / edit / abort)

Show the proposed path too so user sees where it lands.

## Step 8 — Atomic write

On "yes":

```bash
# Write to temp file, then mv (atomic on POSIX)
cat > /tmp/hd-lesson.md <<'EOF'
<drafted lesson>
EOF
mv /tmp/hd-lesson.md docs/knowledge/lessons/YYYY-MM-DD-<slug>.md
```

On "edit": user dictates changes; re-draft; re-prompt.
On "abort": no write; exit cleanly.

## Step 9 — Summarize + signal

Report:

- Lesson path + line count
- Related lessons detected (from Step 6 research, if run): "N similar lessons tagged `<tag>`"
- Graduation signal: if the new lesson is the 3rd+ with matching tags, surface:

   > "This is the 3rd lesson tagged `<tag>`. Consider `/hd:compound graduate-propose <topic>` when you're ready to formalize."

If less than 3, just note count without suggesting graduation.

## Failure modes

- **F1 Malformed YAML** — if draft fails YAML parse on dry-run, fix before write (don't commit malformed frontmatter — it would break downstream parsers)
- **F2 Tag inconsistency** — research detects "you tagged this `button-variant` but past lessons used `button-variants`"; ask user to reconcile
- **F3 Missing date / slug collision** — covered in Steps 4-5
- **F4 Path outside docs/knowledge/lessons/** — never allowed; absolute refusal

## Coexistence rules

- ✅ Write only to `docs/knowledge/lessons/` in the user's repo
- ❌ Never write to `docs/solutions/` (compound namespace)
- ❌ Never write to `docs/design-solutions/` during capture (reserved for distilled pattern-solutions; hd-compound v0.5 capture writes lessons, not solutions — solutions are post-v0.5)
- Task invocations fully-qualified: `Task compound-engineering:research:learnings-researcher(...)`

## See also

- [../references/lesson-patterns.md](../references/lesson-patterns.md) — schema + anti-patterns
- [../references/graduation-criteria.md](../references/graduation-criteria.md) — when a captured lesson graduates
- [propose-graduation.md](propose-graduation.md) — the graduate-propose flow (after enough lessons accumulate)
