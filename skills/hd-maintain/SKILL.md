---
name: hd:maintain
description: Captures design lessons and proposes rule adoptions from narrative to rule. Use when capturing a decision or promoting a recurring pattern to AGENTS.md.
argument-hint: "capture | rule-propose <topic> | rule-apply --hash <prefix>"
---

# hd:maintain — maintain your harness (capture + graduate)

## Interaction method

Use `AskUserQuestion` for branching decisions (approve / edit / abort). If unavailable (non-Claude hosts), fall back to numbered-list prompts. **Never write to `AGENTS.md` or `changelog.md` without a verified plan-hash** — hash is always computed via [`scripts/compute-plan-hash.sh`](scripts/compute-plan-hash.sh), never in-head (F4 safety per [`references/plan-hash-protocol.md`](references/plan-hash-protocol.md)).

## Single job

Append a dated lesson to `docs/knowledge/lessons/` (capture) OR promote a pattern across ≥3 lessons to a rule in `AGENTS.md` (graduate). One skill, two verbs of the MAINTAIN family.

## Mode detection

| User says… / invokes… | Mode | Safety |
|---|---|---|
| "Save this lesson" / `/hd:maintain capture` | **capture** | 1 atomic write to lessons dir |
| "Graduate this" / `/hd:maintain rule-propose <topic>` | **propose** (writes `.hd/propose-<prefix>.json` only) | 0 writes to tracked files; emits plan + hash |
| `/hd:maintain rule-apply --hash <prefix>` | **apply** (destructive) | Hash-verified writes to AGENTS.md + changelog.md |

Ambiguous → ask. Never auto-dispatch across modes.

## Workflow checklist (copy into your response per mode)

Pick ONE checklist based on detected mode:

### Capture mode

```
hd:maintain capture Progress:
- [ ] Step 1: Identify subject + memory type against canonical-4 frame (article §2.5): episodic (lesson), procedural (decision), semantic (preference), semantic-speculative (ideation), episodic-temporal (changelog)
- [ ] Step 2: Resolve target file (lessons/YYYY-MM-DD-<slug>.md, or decisions/preferences/ideations/changelog.md)
- [ ] Step 3: Optional — retrieve relevant past lessons (sub-agent)
- [ ] Step 4: Draft the entry
- [ ] Step 5: Check tag-cluster size (≥ 3 lesson files sharing a tag → rule adoption candidate)
- [ ] Step 6: Show user the drafted entry + target file; get approval
- [ ] Step 7: Atomic write (new file for episodic; append for shared files); update INDEX.md
- [ ] Step 8: Summarize with rule-candidate signal
```

Classify memory type → resolve target (new date-slugged file for episodic, append for shared) → optional retrieval → draft → approve → atomic write → summarize with rule-candidate signals.
→ See [references/capture-procedure.md](references/capture-procedure.md) for full procedure

### Propose mode

```
hd:maintain propose Progress:
- [ ] Step 1: Parse topic
- [ ] Step 2: Run rule-candidate-scorer sub-agent
- [ ] Step 3: Filter to clusters scoring ≥ 3.5 (rule-ready)
- [ ] Step 4: Draft proposed rule + changelog.md entry per cluster
- [ ] Step 4b: If any source lesson has ≥4 imperative statements → dispatch rubric-extractor (optional, conditional)
- [ ] Step 5: Assemble structured inputs (title, paths, date, author, diff_summary)
- [ ] Step 6: Invoke `scripts/compute-plan-hash.sh` (JSON on stdin) → SHA-256
- [ ] Step 7: Write `.hd/propose-<prefix>.json` artifact (creates `.hd/` if missing)
- [ ] Step 8: Emit plan + hash to stdout (no writes to tracked files)
```

Score clusters → filter ≥3.5 → draft rule + rule adoptions entry → compute hash via `scripts/compute-plan-hash.sh` → persist `.hd/propose-<prefix>.json` → emit plan + hash. Zero writes to tracked files.
→ See [references/propose-procedure.md](references/propose-procedure.md) for full procedure

### Apply mode

```
hd:maintain apply Progress:
- [ ] Step 1: Parse --hash <prefix> argument; glob `.hd/propose-<prefix>*.json` (unique match required)
- [ ] Step 2: Read structured inputs from the persisted artifact (survives context compaction)
- [ ] Step 3: Re-run `scripts/compute-plan-hash.sh` with those inputs
- [ ] Step 4: Compare to artifact's stored `sha256`
- [ ] Step 5: On match → atomic writes to AGENTS.md + changelog.md. On mismatch → abort with drift diagnosis.
- [ ] Step 6: Move `.hd/propose-<hash>.json` → `.hd/applied/<hash>.json` (cleanup)
- [ ] Step 7: Post-write verification (`git status` shows exactly 2 tracked-file diffs)
- [ ] Step 8: Summarize
```

Locate `.hd/propose-<hash>.json` → re-run `scripts/compute-plan-hash.sh` → on byte-match atomic-write AGENTS.md + changelog.md, then `mv .hd/propose-<hash>.json .hd/applied/<hash>.json`; on mismatch abort with drift diagnosis.
→ See [references/apply-procedure.md](references/apply-procedure.md) for full procedure

## What this skill does NOT do

- **Concept questions** → `/hd:learn`
- **Harness scaffolding** → `/hd:setup`
- **Harness audit** → `/hd:review`
- **Modify source lessons** — Layer 5 is append-only
- **Apply rules without plan-hash** — refusal is structural

## Coexistence

- ✅ Writes ONLY to `docs/knowledge/lessons/` (capture) or `AGENTS.md` + `docs/knowledge/changelog.md` (apply)
- ❌ Never writes to `docs/solutions/` (compound's namespace)
- ❌ Never writes to `docs/design-solutions/` in this release (reserved for post-release)
- ✅ Task calls stay in our own namespace and are fully-qualified: `Task design-harnessing:<category>:<agent>(...)`. We do not invoke `compound-engineering:*` tasks.

## Compact-safe mode

- Capture → skip Step 2 (lesson-retriever); no research phase
- Propose → skip nothing (hash computation is non-optional)
- Apply → skip nothing (hash verification is mandatory)

## Reference files

- [references/capture-procedure.md](references/capture-procedure.md) — full capture-mode step sequence (Steps 1–8)
- [references/propose-procedure.md](references/propose-procedure.md) — full propose-mode step sequence (Steps 1–8)
- [references/apply-procedure.md](references/apply-procedure.md) — full apply-mode step sequence (Steps 1–8)
- [references/lesson-patterns.md](references/lesson-patterns.md) — YAML schema + body structure + anti-patterns
- [references/rule-adoption-criteria.md](references/rule-adoption-criteria.md) — 3-criterion rule + clean-imperative test
- [references/plan-hash-protocol.md](references/plan-hash-protocol.md) — SHA-256 proof-of-consent spec + canonical format

## Scripts

- [scripts/compute-plan-hash.sh](scripts/compute-plan-hash.sh) — deterministic canonical-string + SHA-256 builder (JSON stdin or flags). Reference implementation for Propose Step 6 and Apply Step 3.

## Assets

- [assets/lesson.md.template](assets/lesson.md.template)
- [assets/rule-entry.md.template](assets/rule-entry.md.template)

## Sub-agents invoked

All dispatch uses fully-qualified `design-harnessing:<category>:<agent>` Task names (compound 2.35.0 convention — bare names get re-prefixed wrong).

- `design-harnessing:research:lesson-retriever` — Phase 1 research (capture, optional)
- `design-harnessing:analysis:rule-candidate-scorer` — cluster scoring (propose, required)
- `design-harnessing:review:rubric-extractor` — optional; dispatched in propose mode when a source lesson contains ≥4 imperative statements (may be promotable to a rubric in its own right)
- `rule-apply` mode runs inline — no agent; `scripts/compute-plan-hash.sh` is authoritative
