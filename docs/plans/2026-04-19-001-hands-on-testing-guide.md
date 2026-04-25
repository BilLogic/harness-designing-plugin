---
title: Hands-on testing guide — v1.0.0
type: testing-guide
status: active
date: 2026-04-19
---

# Hands-on testing guide — v1.0.0

Copy-paste prompts for testing each skill on real projects. Use this as a running companion as you set up harnesses on the six pilot repos.

## 0. Install check

Run once in any repo after installing the plugin:

```
/hd:learn what are the five layers?
```

**Pass:** Returns a clear explanation of Context Engineering, Skill Curation, Workflow Orchestration, Rubric Setting, Knowledge Compounding — with brief descriptions of each.  
**Red flag:** Unknown command / no response / generic answer with wrong layer names.

---

## 1. `/hd:learn` — Q&A smoke tests

Good for warming up before setup. Run these in any repo.

```
/hd:learn what's the difference between context and knowledge layers?
```
```
/hd:learn when should I scaffold vs link at a layer?
```
```
/hd:learn what is working memory and why is it ephemeral?
```
```
/hd:learn what's the right layer for my team's AGENTS.md rules?
```
```
/hd:learn when should a lesson become a rule?
```

**What to check:**
- Answers cite the right layer (L1 = Context, L5 = Knowledge, etc.)
- No hallucinated layer names or incorrect memory type labels
- Tone is helpful + concrete, not generic

---

## 2. `/hd:setup` — Per-project prompts

### plus-uno (existing compound harness + design system)

This is the richest test — compound-engineering is already present.

```
/hd:setup
```

**What to check in Phase A (pre-analysis):**
- Detects the existing `.claude/` harness and compound-engineering footprint
- Defaults to skip L1/L2/L3 (existing harness is authority) and focus scaffold on L4 + L5
- `rubric-recommender` surfaces relevant starters (likely: `design-system-compliance`, `accessibility-wcag-aa`, `component-budget`)
- Does NOT modify `AGENTS.md`, `CLAUDE.md`, or any existing harness files

**What to check in Phase B (layer walk):**
- L4 scaffold offers to write into `docs/rubrics/` — not overwriting anything
- L5 scaffold creates `docs/knowledge/` structure if not present
- `hd-config.md` written at repo root at the end with correct fields

---

### sds (design system repo)

```
/hd:setup
```

**What to check:**
- Detects design system signals (component library, token files, Storybook/Figma patterns)
- `rubric-recommender` prioritises `design-system-compliance`, `component-budget`, `accessibility-wcag-aa`
- L1 scaffold pre-fills with design system context shape (tokens, component names, conventions)
- Additive only — no destructive writes

---

### oracle-chat (IoT / telemetry dashboard)

```
/hd:setup
```

**What to check:**
- `rubric-recommender` surfaces `telemetry-display` and possibly `i18n-cjk` (CJK signals)
- L1 context scaffold includes slot for telemetry domain context
- Phase A audit for L4 flags absence of domain-specific rubrics as a gap

---

### plus-marketing-website (marketing / content site)

```
/hd:setup
```

**What to check:**
- `rubric-recommender` surfaces `ux-writing`, `responsive-design`, `motion-design`
- L4 scaffold doesn't force engineering rubrics (no `component-budget` if no component library detected)
- Handles "scattered" mode gracefully if AI docs are spread across Notion links + AGENTS.md stubs

---

### caricature (creative / generative tool)

```
/hd:setup
```

**What to check:**
- Phase A doesn't over-prescribe rubrics for a creative tool
- `rubric-recommender` offers `interaction-states`, `ux-writing` — not `accessibility-wcag-aa` as top priority
- L5 scaffold creates knowledge structure ready for capturing generative design lessons

---

### lightning (Next.js + Firebase platform)

```
/hd:setup
```

**What to check:**
- Detects Next.js + Firebase signals; no false-positive compound-engineering detection
- `rubric-recommender` surfaces `responsive-design`, `interaction-states`, `accessibility-wcag-aa`
- Additive only when other harness artifacts are present

---

## 3. `/hd:maintain` — Capture + rule-propose prompts

Run these after a real design decision has been made in the project.

### Capture a lesson

```
/hd:maintain capture
```

Then describe the lesson naturally when prompted, e.g.:
> We tried using motion animations on the telemetry chart updates but it caused cognitive overload for operators watching live data. Reverted to instant updates with a subtle colour pulse instead.

**What to check:**
- Creates a dated `.md` file in `docs/knowledge/lessons/`
- File has correct YAML frontmatter (title, date, tags, importance)
- Doesn't duplicate a nearly identical existing lesson (lesson-retriever dedup check fires)
- No writes outside `docs/knowledge/lessons/`

### Propose a rule

After capturing 2–3 related lessons:

```
/hd:maintain rule-propose
```

**What to check:**
- `rule-candidate-scorer` clusters the related lessons and surfaces them as a candidate
- Proposes a clean imperative rule (e.g. "For real-time telemetry, use instant updates with colour pulse; avoid motion animations.")
- Shows the SHA-256 plan hash and asks for explicit consent before writing to AGENTS.md
- Does NOT write to AGENTS.md without the hash confirmation step

---

## 4. `/hd:review` — Audit + critique prompts

### Audit harness health

```
/hd:review audit
```

**What to check:**
- Dispatches 5× `harness-auditor` in parallel (one per layer)
- Batch 2 fires `rubric-recommender` + `lesson-retriever` (+ `coexistence-analyzer` if other-tool harness detected)
- Returns structured per-layer report with gaps, recommendations, and health signal
- Synthesises a dated lesson file at the end
- Does NOT modify any harness files — read-only

### Critique a SKILL.md

```
/hd:review critique skills/hd-setup/SKILL.md
```

**What to check:**
- Applies `skill-quality` rubric (9-section check)
- Returns findings grouped by rubric dimension
- Flags real issues, not invented ones
- Does NOT rewrite the file

### Critique a rubric

```
/hd:review critique docs/rubrics/design-system-compliance.md
```

**What to check:**
- Uses `rubric-applier` against the rubric-authoring guide
- Surfaces missing Scope & Grounding sections if absent
- Flags vague criteria (non-measurable, no pass/fail signal)

---

## 5. Edge cases worth probing

| Scenario | Prompt | Watch for |
|---|---|---|
| Empty repo (no AI files at all) | `/hd:setup` in a `git init` dir | Greenfield mode, scaffolds all 5 layers |
| Repo already has `hd-config.md` | `/hd:setup` again | Detects existing config, asks to re-run or skip |
| Conflicting compound + hd harness | `/hd:setup` in plus-uno | Coexistence mode, additive only, no overwrites |
| Very long lesson list (>20 lessons) | `/hd:maintain rule-propose` | lesson-retriever streams without OOM, returns top 5 |
| Unknown rubric name | `/hd:review critique docs/rubrics/nonexistent.md` | Graceful error, not silent failure |
| `/hd:learn` with corpus not configured | `/hd:learn quote from the article` | `corpus_status: not-configured`, no fabricated quotes |

---

## 6. What to log as you go

After each test session, drop a quick lesson:

```
/hd:maintain capture
```

Note: what worked, what felt off, what was confusing. These become the next round of rules.

Keep a running tally of anything that looks broken — paste it here or open a GitHub issue on `BilLogic/harness-designing-plugin`.

---

## 7. Green / red signals at a glance

| ✅ Green | 🔴 Red |
|---|---|
| Phase A runs before any questions | Skips Phase A, jumps straight to walk |
| `hd-config.md` written at end of setup | Setup completes but no config file |
| Additive only — no existing files modified | Modifies `AGENTS.md` or `CLAUDE.md` without consent |
| Rule adoption requires SHA-256 confirmation | Rule written directly without hash step |
| `audit` is read-only | Audit rewrites or deletes harness files |
| Layer names match article canonical names | Stale names (hd-onboard, graduation, compounding) |
| Graceful empty on unconfigured corpus | Fabricated article quotes |
