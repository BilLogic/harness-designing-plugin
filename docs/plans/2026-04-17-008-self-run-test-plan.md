---
title: "Self-run agent-driven test plan — v1.0.0 ship gate"
type: test-plan
status: active
date: 2026-04-17
origin: docs/plans/hd-setup-test-cases.md
---

# Self-run agent-driven test plan for v1.0.0

## Why this exists

Two prior documents set the framing:

- [`hd-setup-test-cases.md`](./hd-setup-test-cases.md) + [`hd-setup-success-criteria.md`](./hd-setup-success-criteria.md) — define 12 v0.MVP acceptance tests with pass bars
- [`usability-test-protocol.md`](./usability-test-protocol.md) — n=5 designer recruit protocol (blocked on finding 5 designers)

This doc replaces the recruit-blocker half: **Bill acts as the user in scratch repos**, running the 12 scenarios himself (or handing this plan to a fresh Claude Code session). The deterministic half is already validated in [`docs/knowledge/lessons/2026-04-17-self-audit.md`](../knowledge/lessons/2026-04-17-self-audit.md) — this plan covers the agent-driven half.

**Scope:** the 12 v0.MVP acceptance tests, plus a plan-hash round-trip with a real agent, plus an audit-writes-exactly-one-file verification with a real agent. Excludes n=5 human usability (deferred), marketplace listing (deferred), and post-v1 scenarios.

## Prerequisites

Before kicking off the test session:

- [ ] This branch (`claude/elegant-euclid`) is pushed to origin — needed so the local-dev install path resolves
- [ ] Claude Code installed and responsive (`claude --version` works)
- [ ] Plug-in installed locally: `claude --plugin-dir /Users/billguo/Desktop/design-harnessing-plugin/.claude/worktrees/elegant-euclid` — OR the public plug-in directory entry once v1.0.0 is tagged and published
- [ ] This machine has `compound-engineering` cached at `~/.claude/plugins/cache/compound-engineering-plugin/compound-engineering/2.42.0/` (already present — needed for T-S7 + T-F6)
- [ ] `git`, `bash 5+`, `python3`, `shasum`, `jq` all in `$PATH`

## Session kickoff prompt

Paste this verbatim into a fresh Claude Code session to start the test run. The agent will self-script from here:

```
I'm running the v1.0.0 self-run test plan at
/Users/billguo/Desktop/design-harnessing-plugin/.claude/worktrees/elegant-euclid/docs/plans/2026-04-17-008-self-run-test-plan.md

Read the full plan, then execute Phase 1 (setup) and Phase 2 (the 7 agent-driven
v0.MVP tests) in order. Capture evidence per each test's "Evidence to capture"
section. Produce a final summary report at
docs/knowledge/lessons/2026-04-17-v1-ship-gate-results.md with pass/fail per
test + any bugs found + next-step recommendation.

Treat every /hd:setup invocation as if I, the user, am driving it — answer
prompts the way a real designer would (solo or team decision, skip Layer 3 when
T-W2 asks, decline the AGENTS.md overwrite in T-F4, etc.).
```

## Phase 1 — Setup (≈ 10 min)

### Step 1.1 — Fixture root

```bash
mkdir -p /tmp/hd-v1-gate
cd /tmp/hd-v1-gate
rm -rf ./*
```

Everything below runs under `/tmp/hd-v1-gate/`. Per-test subdirs follow the `t-<id>-<slug>/` convention already used by [`hd-setup-test-cases.md`](./hd-setup-test-cases.md).

### Step 1.2 — Build deterministic fixtures

```bash
# T-S1, T-S8 — two fresh greenfields (T-S8 re-uses S1 shape)
for d in t-s1-greenfield t-s8-empty; do mkdir -p "$d" && (cd "$d" && git init -q); done

# T-S2 — single-file AGENTS.md
mkdir -p t-s2-singlefile && (cd t-s2-singlefile && git init -q && cat > AGENTS.md <<'EOF'
# Team Rules
- Use the shared button component from @team/ui.
- Never hardcode colors; use design tokens.

## Context
Our product is a tutoring marketplace for students and mentors.

## Lessons
- 2026-02-14: Tried a fourth button variant for marketing; reverted.
EOF
)

# T-S7 — coexistence (compound already installed on this machine)
mkdir -p t-s7-coexist && (cd t-s7-coexist && git init -q && touch AGENTS.md)

# T-S9 — re-run: S1 fixture will be used twice; do NOT teardown between runs

# T-T1, T-T2 — use S1 shape, different user answers
for d in t-t1-solo t-t2-team; do mkdir -p "$d" && (cd "$d" && git init -q); done

# T-W2 — skip-respected, use S1 shape
mkdir -p t-w2-skip && (cd t-w2-skip && git init -q)

# T-W5 — no-vendor file-only mode, S1 shape
mkdir -p t-w5-novendor && (cd t-w5-novendor && git init -q)

# T-W7 — article citation, S1 shape
mkdir -p t-w7-article && (cd t-w7-article && git init -q)

# T-F4 — overwrite confirm uses T-S2 fixture; re-build
mkdir -p t-f4-overwrite && (cd t-f4-overwrite && git init -q && cat > AGENTS.md <<'EOF'
# Precious AGENTS.md
Do not overwrite silently.
EOF
md5sum AGENTS.md > AGENTS.md.md5 2>/dev/null || shasum -a 256 AGENTS.md > AGENTS.md.sha
)

# T-F6 — rivalry language check, use T-S7 shape (compound already installed)
mkdir -p t-f6-rivalry && (cd t-f6-rivalry && git init -q && touch AGENTS.md)

ls /tmp/hd-v1-gate/
```

Expected: 12 subdirectories listed.

## Phase 2 — Agent-driven v0.MVP tests

Run in the order below. Per test: `cd` to the fixture, invoke `/hd:setup` (or the variant noted), let the agent drive, answer prompts as specified, then run the "Evidence" block and record pass/fail.

For every test, capture into `/tmp/hd-v1-gate/evidence/<test-id>/`:
- `pre.txt` — `git status` + `ls -la` + content hashes BEFORE invocation
- `transcript.txt` — the full Claude Code transcript (copy-paste or export)
- `post.txt` — `git status` + `ls -la` + content hashes AFTER
- `diff.txt` — `git diff` or `diff -r <before> <after>`

---

### T-S1 — Greenfield (C-S1)

**Fixture:** `/tmp/hd-v1-gate/t-s1-greenfield/`
**Invocation:** `/hd:setup`
**User answers during session:**
- When asked "Solo or team?", say "team"
- When asked which layers to scaffold, say "all five"
- When offered to run `/hd:onboard` first for context, decline (we want to exercise setup cold)

**Evidence to capture + verify:**
```bash
cd /tmp/hd-v1-gate/t-s1-greenfield

# C-S1 pass criteria checks
test -d docs/context && echo "PASS: docs/context exists" || echo "FAIL: no docs/context"
test -f design-harnessing.local.md && echo "PASS: local.md exists" || echo "FAIL"
grep -c "team_size\|skipped_layers" design-harnessing.local.md  # >= 2
grep -c "§" "$TRANSCRIPT_PATH"  # >= 1 (W7 article citation)
git status  # should show only additive files
```

**Pass when ALL of:**
- `docs/context/` with ≥ 1 real file ✓/✗
- `design-harnessing.local.md` with `team_size`, `skipped_layers` fields ✓/✗
- ≥ 2 of 5 layers touched (count subdirs under `docs/`) ✓/✗
- No destructive action without confirmation (git log shows no deletions) ✓/✗
- ≥ 1 `§` reference in transcript ✓/✗

---

### T-S2 — Single-file AGENTS.md (C-S2)

**Fixture:** `/tmp/hd-v1-gate/t-s2-singlefile/`
**Invocation:** `/hd:setup`
**User answers:**
- When asked about existing AGENTS.md, approve the diff preview (but verify it was shown)
- When asked how to classify "Lessons" section, accept the proposed routing to `docs/knowledge/lessons/`

**Evidence + verify:**
```bash
cd /tmp/hd-v1-gate/t-s2-singlefile
shasum -a 256 AGENTS.md  # compare to pre-run hash — must differ ONLY if user explicitly approved a diff
grep -i "diff\|before\|after" "$TRANSCRIPT_PATH"  # must find diff-preview language
ls docs/knowledge/lessons/ 2>/dev/null  # the "Lessons" section should have landed here
```

**Pass when ALL of:**
- Diff preview shown in transcript before any write ✓/✗
- Original AGENTS.md content preserved (either byte-identical OR user-approved diff) ✓/✗
- "Lessons" section routes to `docs/knowledge/lessons/` (not lost) ✓/✗
- No content silently dropped ✓/✗

---

### T-S7 — Coexists with compound-engineering (C-S7)

**Fixture:** `/tmp/hd-v1-gate/t-s7-coexist/`
**Invocation 1:** `/hd:setup` (answer any prompts; focus on non-conflict with compound)
**Invocation 2 (after #1):** `/ce:plan test-coexist`

**Evidence + verify:**
```bash
cd /tmp/hd-v1-gate/t-s7-coexist
# No hd-* files in compound's namespace
test -d docs/solutions && ls docs/solutions/ || echo "docs/solutions/ not touched — good"
# No ce-* files in our namespace
test -d docs/design-solutions && ls docs/design-solutions/ || echo "docs/design-solutions/ not created by /ce:plan — good"
# Both commands still work (no mutual exclusion errors in transcripts)
grep -i "conflict\|incompatible\|rival" "$TRANSCRIPT_1" "$TRANSCRIPT_2"
# Expected: 0 substantive hits (educational mentions OK, rivalry copy NOT OK)
```

**Pass when ALL of:**
- Zero "conflict / rival / incompatible" language in either transcript ✓/✗
- No `hd-*` files in `docs/solutions/` ✓/✗
- No `ce-*` files in `docs/design-solutions/` ✓/✗
- `/ce:plan` completed without errors after `/hd:setup` ran ✓/✗

---

### T-S8 — Plug-in installed, repo empty (C-S8)

**Fixture:** `/tmp/hd-v1-gate/t-s8-empty/`
**Invocation:** `/hd:setup`
**Expected behavior:** identical to T-S1.

**Evidence + verify:** run the same checks as T-S1. Transcripts should be near-equivalent (modulo randomness in conversational filler).

**Pass when:** all C-S1 criteria pass, **AND** the transcript does not mention "plug-in not installed" or similar meta-confusion (the plug-in is installed globally; the repo is what's empty).

---

### T-S9 — Re-run (C-S9)

**Fixture:** `/tmp/hd-v1-gate/t-s1-greenfield/` (re-used after T-S1 completes — do NOT teardown T-S1 before this test)
**Invocation:** `/hd:setup` (second time in same dir)
**User answers:** whatever makes sense — the test is about the skill reading the prior run's `design-harnessing.local.md`.

**Evidence + verify:**
```bash
cd /tmp/hd-v1-gate/t-s1-greenfield
git status  # only additive changes since T-S1 end
diff <(git ls-tree -r HEAD --name-only) <(find . -type f | sort)  # should be additive-only
grep -c "greenfield" "$TRANSCRIPT_S9"  # should be 0 — skill should NOT re-propose greenfield scaffold
grep -i "layer-specific\|deep-dive\|revisit" "$TRANSCRIPT_S9"  # should find layer-menu language
```

**Pass when ALL of:**
- Zero duplicate files ✓/✗
- Skill offers layer-specific deep-dive menu (NOT greenfield re-scaffold) ✓/✗
- `design-harnessing.local.md` from run 1 is read (e.g., skipped layers stay skipped) ✓/✗

---

### T-T1 — Solo designer (C-T1)

**Fixture:** `/tmp/hd-v1-gate/t-t1-solo/`
**Invocation:** `/hd:setup`
**User answers:** "solo" when asked about team structure.

**Evidence + verify:**
```bash
grep -i "handoff\|rotation\|PR review\|graduation ceremony" "$TRANSCRIPT_T1"  # should be 0 or near-0
grep -i "scratchpad\|solo\|defer Layer 5" "$TRANSCRIPT_T1"  # should be ≥ 1
```

**Pass when ALL of:**
- Solo-appropriate language in output (scratchpad-mode framing) ✓/✗
- Layer 5 graduation complexity deferred (not aggressively pushed) ✓/✗
- Layers 1 and 4 still emphasized ✓/✗

---

### T-T2 — Team flow (default) (C-T2)

**Fixture:** `/tmp/hd-v1-gate/t-t2-team/`
**Invocation:** `/hd:setup`
**User answers:** "team of 8" or similar within 5–20 range.

**Evidence + verify:**
```bash
# All five layers mentioned in the response
for layer in "Layer 1\|Context" "Layer 2\|Skills" "Layer 3\|Orchestration" "Layer 4\|Rubrics" "Layer 5\|Knowledge"; do
  grep -cE "$layer" "$TRANSCRIPT_T2"
done
# Each should return ≥ 1
```

**Pass when:** all 5 layers appear in recommendations.

---

### T-W2 — Skip-layer respected on re-run (C-W2)

**Fixture:** `/tmp/hd-v1-gate/t-w2-skip/`
**Invocation 1:** `/hd:setup` — **decline Layer 3** when asked ("skip Layer 3 / Orchestration for now").
**Invocation 2 (same dir):** `/hd:setup` — observe whether Layer 3 is re-proposed.

**Evidence + verify:**
```bash
grep -A2 "skipped_layers" /tmp/hd-v1-gate/t-w2-skip/design-harnessing.local.md  # should list layer-3
grep -c "Layer 3\|Orchestration" "$TRANSCRIPT_W2_RUN2"  # should only appear in "already-skipped" acknowledgment, not as a prompt
```

**Pass when ALL of:**
- Run 1 records `skipped_layers: [layer-3]` in `design-harnessing.local.md` ✓/✗
- Run 2 does NOT re-propose Layer 3 ✓/✗
- User can un-skip explicitly (document the flag the skill exposes — `--reset-skips` or whatever it ends up being) ✓/✗

---

### T-W5 — No-vendor file-only mode (C-W5)

**Fixture:** `/tmp/hd-v1-gate/t-w5-novendor/`
**Invocation:** `/hd:setup` (no `.mcp.json`, no other plug-ins in this scratch dir)

**Evidence + verify:**
```bash
grep -iE "mcp|figma|notion|install the .+ plugin first" "$TRANSCRIPT_W5"
# Expected: 0 substantive hits (the word "Figma" may appear in educational example text, but
# no instruction to install Figma MCP should be emitted)
```

**Pass when ALL of:**
- No MCP references in output ✓/✗
- No vendor-specific "install X first" instructions ✓/✗
- All examples use plain markdown ✓/✗

---

### T-W7 — Article citation (C-W7)

**Fixture:** `/tmp/hd-v1-gate/t-w7-article/`
**Invocation:** `/hd:setup`

**Evidence + verify:**
```bash
grep -oE "§[0-9]+[a-z]?" "$TRANSCRIPT_W7" | sort -u
# Expected: at least one §N reference, and each is a real article section (§2, §3, §4a, §4b, §4c, §4d, §4e, §6)
```

**Pass when:** ≥ 1 valid `§` citation in transcript.

---

### T-F4 — Overwrite confirm (C-F4)

**Fixture:** `/tmp/hd-v1-gate/t-f4-overwrite/` (has pre-existing AGENTS.md)
**Invocation:** `/hd:setup`
**User answers:** when skill proposes writing over AGENTS.md, **decline** (choose "abort").

**Evidence + verify:**
```bash
cd /tmp/hd-v1-gate/t-f4-overwrite
# AGENTS.md must be byte-identical to pre-run
diff <(shasum -a 256 AGENTS.md) <(cat AGENTS.md.sha)  # should be empty
# Three options must have been presented
grep -iE "backup|merge|abort" "$TRANSCRIPT_F4" | head
# `git status` should be clean (no partial writes)
git status
```

**Pass when ALL of:**
- All three options (backup-and-replace / merge / abort) presented ✓/✗
- Abort was honored — AGENTS.md byte-identical ✓/✗
- No partial writes elsewhere ✓/✗

---

### T-F6 — No rivalry with compound (C-F6)

**Fixture:** `/tmp/hd-v1-gate/t-f6-rivalry/`
**Invocation:** `/hd:setup` on a machine with compound-engineering installed.

**Evidence + verify:**
```bash
grep -iE "conflict|rival|vs\.|incompatible|replaces compound" "$TRANSCRIPT_F6"
# Expected: 0 substantive hits
grep -iE "philosophical cousin|complement|coexist|sibling" "$TRANSCRIPT_F6"
# Expected: if compound is mentioned, at least one friendly-framing hit
```

**Pass when ALL of:**
- Zero rivalry/conflict/vs. language ✓/✗
- If compound is mentioned, framing is cousin/complement ✓/✗
- Protected-artifact lists do not overlap with compound's ✓/✗

---

## Phase 3 — Agent-driven hd-compound + hd-review tests

### P3.1 — Plan-hash round-trip with a real agent (not just the shell test from 04-17)

**Fixture:**

```bash
mkdir -p /tmp/hd-v1-gate/t-ph-roundtrip/docs/knowledge/lessons
cd /tmp/hd-v1-gate/t-ph-roundtrip
git init -q
cat > AGENTS.md <<'EOF'
# Test repo
## Graduated rules
EOF
cat > docs/knowledge/graduations.md <<'EOF'
# Graduations
<!-- Add new graduations above this line -->
EOF
for i in 01 02 03; do
  cat > docs/knowledge/lessons/2026-04-${i}-token-drift.md <<EOF
---
title: "Token drift observed $i"
date: 2026-04-${i}
tags: [design-system, token-drift]
graduation_candidate: true
---
Lesson $i: we should always lint tokens on commit.
EOF
done
```

**Invocation sequence:**
1. `/hd:compound graduate-propose token-drift` → agent emits plan + hash
2. Copy the hash
3. `/hd:compound graduate-apply --plan-hash <sha>` → agent verifies + writes
4. Tamper: modify `AGENTS.md` manually (add a blank line)
5. `/hd:compound graduate-apply --plan-hash <same-sha>` → agent must abort with drift diagnosis

**Pass when ALL of:**
- Step 1 emits a 64-char hex hash; git status clean after step 1 ✓/✗
- Step 3 writes exactly 2 files (AGENTS.md, graduations.md); source lessons byte-identical ✓/✗
- Step 5 aborts with "Hash mismatch" + drift identification ✓/✗
- Never accepts a fabricated or empty `--plan-hash` ✓/✗

---

### P3.2 — Audit writes exactly one file

**Fixture:** use the current working repo (this plug-in's own repo) OR a fresh clone.

**Invocation:** `/hd:review audit`

**Evidence + verify:**
```bash
BEFORE=$(find docs -type f | sort)
/hd:review audit  # via the agent
AFTER=$(find docs -type f | sort)
diff <(echo "$BEFORE") <(echo "$AFTER")
# Expected diff: exactly 1 new file at docs/knowledge/lessons/harness-audit-YYYY-MM-DD.md
```

**Pass when ALL of:**
- Exactly 1 new file under `docs/knowledge/lessons/harness-audit-*.md` ✓/✗
- Zero modifications to any existing file ✓/✗
- Report contains specific, prioritized findings (not "looks good") ✓/✗
- Report cites the `skill-quality` rubric by section number when flagging Layer 2 findings (test that the wiring done on 04-17 actually holds in practice) ✓/✗

---

### P3.3 — Critique with the skill-quality rubric

**Invocation:** `/hd:review critique skills/hd-setup/SKILL.md --rubric skill-quality`

**Pass when ALL of:**
- Output is structured per the critique template (YAML severity list + prose) ✓/✗
- Each finding cites a numbered section (1-9) of the skill-quality rubric ✓/✗
- Zero file writes (`git status` clean after) ✓/✗
- Severity is applied consistently (p1/p2/p3 with rationale) ✓/✗

---

## Phase 4 — Report + teardown

### Step 4.1 — Aggregate report

Produce a single summary at:
`/Users/billguo/Desktop/design-harnessing-plugin/.claude/worktrees/elegant-euclid/docs/knowledge/lessons/2026-04-17-v1-ship-gate-results.md`

Structure:

```markdown
---
title: "v1.0.0 ship-gate self-run test results"
date: 2026-04-17
tags: [test-results, ship-gate, v1, self-run]
graduation_candidate: no
---

# Summary

| Test | Pass/Fail | Notes |
|---|---|---|
| T-S1 | ... | ... |
| ... | ... | ... |

Aggregate: N/12 v0.MVP tests passing, plus P3.1/P3.2/P3.3 ...

# Bugs found

(list with file:line + reproduction)

# Recommendation

Ship / Don't ship / Ship after fixing X
```

### Step 4.2 — Teardown

```bash
rm -rf /tmp/hd-v1-gate
```

Do NOT delete the evidence dir if any test failed — keep for triage.

### Step 4.3 — Capture lessons

Any unexpected behavior discovered during the test run → `/hd:compound capture` in this worktree (not in the scratch fixtures).

## Aggregate ship gate

v1.0.0 ships when **all three** hold:

1. **12/12 v0.MVP tests pass** (Phase 2) — non-negotiable
2. **P3.1 plan-hash round-trip holds** with a real agent (Phase 3.1) — non-negotiable; this is the F4 safety mechanism
3. **P3.2 audit single-file invariant holds** with a real agent (Phase 3.2) — non-negotiable; any multi-file write is a ship-blocker

Soft bars (ship anyway if missed; open post-v1 todos):
- P3.3 critique rubric-wiring fidelity
- Zero bugs discovered during Phase 2 (realistic target: ≤ 3 minor bugs is acceptable)

## Estimated time

- Phase 1: 10 min
- Phase 2 (12 tests): 2–3 hours (agent-turn-bound; each test has 3-8 turns)
- Phase 3 (3 tests): 45 min
- Phase 4 (report + teardown): 30 min

**Total: 3.5–4.5 hours.** Can be split across two sessions if needed — the natural break is after Phase 2.

## What this plan does NOT cover

- Marketplace listing end-to-end (X1/X2/X3) — deferred to post-v1
- Cross-platform (Codex / Cursor) parity — same plug-in files should work; verifying takes separate sessions with those tools installed
- Performance / latency benchmarking — out of scope for correctness gate
- Security audit (API key handling, command injection via user inputs) — out of scope
- Long-form usability (n=5 designer recruit) — [`usability-test-protocol.md`](./usability-test-protocol.md) still applies when designers are available

## See also

- [hd-setup-scenarios.md](./hd-setup-scenarios.md) — scenario catalog referenced by T-* test IDs
- [hd-setup-test-cases.md](./hd-setup-test-cases.md) — reproduction recipes this plan extends
- [hd-setup-success-criteria.md](./hd-setup-success-criteria.md) — per-C-* pass bars this plan implements
- [usability-test-protocol.md](./usability-test-protocol.md) — human-driven alternative (deferred)
- [../knowledge/lessons/2026-04-17-self-audit.md](../knowledge/lessons/2026-04-17-self-audit.md) — deterministic half already completed
- [../knowledge/lessons/2026-04-17-v1-smoke-tests.md](../knowledge/lessons/2026-04-17-v1-smoke-tests.md) — plan-hash + audit-write shell smoke tests (completed 04-17 morning)
