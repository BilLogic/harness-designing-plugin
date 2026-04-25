---
title: "Phase 3e — pilot consolidation: template graduations, detect.py signal expansion, rubric library round 2"
type: refactor
status: completed
date: 2026-04-18
origin: docs/knowledge/lessons/2026-04-18-parallel-pilots-3-6-consolidated.md
---

# Phase 3e — pilot consolidation

Consolidate findings from the 6-repo pilot matrix (sds, plus-marketing, caricature, oracle-chat, lightning, plus-uno) into concrete plug-in fixes. Origin lesson: [`docs/knowledge/lessons/2026-04-18-parallel-pilots-3-6-consolidated.md`](../knowledge/lessons/2026-04-18-parallel-pilots-3-6-consolidated.md).

Scope: 3 fix batches (E1/E2/E3) + 2 pattern graduations (E4) + 1 synthetic test (E5) + 1 ship-blocker bundle (E6 — `hd-compound` graduation safety). MUST-FIX; no phasing. Branch: `claude/elegant-euclid` (current worktree).

## E1 — Template graduations

Every pilot since #2 silently hand-fixed the same template gaps. Graduate those fixes.

### E1.1 — `hd-config.md.template` add missing fields
**File:** `skills/hd-setup/assets/hd-config.md.template`
**Add fields** (match what pilots #2–#6 all wrote manually):
- `layer_decisions:` — 5-row YAML array (`L1|L2|L3|L4|L5`, each with `decision: link|critique|scaffold|skip` and `why:` + `files_written:` list)
- `other_tool_harnesses_detected:` — YAML list of `{path, owner, policy}` objects (e.g., `{path: .agent/, owner: user, policy: respect}`)
- `files_written:` — flat YAML list of relative paths created by this `/hd:setup` run
- Bump frontmatter `schema_version: "1"` → `"2"` to match `detect.py` output

**Acceptance:** diffing a freshly-generated `hd-config.md` from `/hd:setup` against pilots #2–#6 outputs shows 0 manual additions needed.

### E1.2 — Add missing `rubrics-index.md.template`
**File:** `skills/hd-setup/assets/rubrics-index.md.template` (NEW)
**Content:** INDEX.md body copied from plus-marketing or oracle-chat pilot output (whichever is cleaner). Includes rubric table (file | purpose | severity-default), "Coexistence" section placeholder, "Extending this rubric library" pointer.
**Also update:** `skills/hd-setup/SKILL.md` Step 7 — the template reference already exists; now it resolves.

**Acceptance:** `/hd:setup` L4 scaffold writes `docs/rubrics/INDEX.md` from this template without hand-authoring.

### E1.3 — `skills/hd-setup/references/hd-config-schema.md` bump to v2

Ensure the schema doc reflects the new fields added in E1.1. Add example YAML block showing a filled `layer_decisions` + `other_tool_harnesses_detected`.

## E2 — `detect.py` signal expansion

**File:** `skills/hd-setup/scripts/detect.py`

### E2.1 — L4/L5 maturity signals
Add:
- `has_rubrics_dir: bool` — `docs/rubrics/` exists and has ≥1 `.md`
- `rubrics_file_count: int`
- `has_knowledge_dir: bool` — `docs/knowledge/` exists with `INDEX.md` OR `lessons/`
- `knowledge_file_count: int`
- `memory_types_present: list[str]` — inspect frontmatter `memory_type:` across knowledge files, return unique set
- `layers_present: list[str]` — composite, derived: `["L1" if has_ai_docs else ..., ...]`

### E2.2 — Managed-DS signal
Add `managed_design_system: str | null` by matching `package.json` dependencies against:
- `antd`, `@ant-design/*` → `"ant-design"`
- `@chakra-ui/*` → `"chakra"`
- `@mantine/*` → `"mantine"`
- `@mui/material`, `@mui/*` → `"mui"`

### E2.3 — a11y pattern expansion
Extend `A11Y_FRAMEWORK_PATTERNS` with:
- `^@radix-ui/`
- `^radix-ui$`
- `^@headlessui/`
- `^@reach/`
- `^react-bootstrap$`

### E2.4 — `external_skills_count` fix
Current: counts dir entries. New: glob `**/SKILL.md` or `*.md` under `.claude/skills/` and `.codex/skills/`. Verify against lightning (should now report 5, not 8).

### E2.5 — Compound-footprint enrichment
Expand `coexistence.compound_engineering` from bool to:
```python
{
  "present": bool,
  "paths_found": ["docs/solutions/", "docs/ideation/", "docs/brainstorms/", ...],
  "config_file": "compound-engineering.local.md" | null
}
```

### E2.6 — PM tooling: `todos/` markdown convention
Extend `team_tooling.pm` detection: if repo root has `todos/*.md` matching `\d{3}-\w+-\w+-\w+\.md`, add `"markdown-todos"` to pm list.

### E2.7 — Drop or demote `article_read`
No signal path exists. Options (pick in implementation):
- Drop from schema v2
- OR move to `prompt_fields` section signaling "needs user input"

**Acceptance (E2):** Re-run `detect.py` across all 6 `/tmp/hd-real-test/*` clones. Each output should newly populate the added signals. Lightning should show `external_skills_count: 5`, oracle-chat + plus-uno should show `a11y_framework_in_use: true`, caricature + lightning should show `managed_design_system: "ant-design"`, plus-uno should show `has_rubrics_dir: false` but `has_knowledge_dir: true` + `memory_types_present: ["procedural-chosen", "semantic-taste", "episodic", "speculative", "temporal"]`.

## E3 — Rubric library expansion round 2

**Dir:** `skills/hd-review/assets/starter-rubrics/`

### E3.1 — `telemetry-display.md` (NEW)
~100 lines. Criteria: real-time-freshness indicators (stale-data badges, last-updated timestamps), offline/disconnected affordances, device-state visualization (online/offline/error/unknown), binary-protocol message rendering (hex/decoded toggle), map-as-canvas patterns. Source: Lightning pilot + Material 3 state indicators + Fluent 2 offline patterns.

### E3.2 — `i18n-cjk.md` (NEW)
~80 lines. Criteria: dual-script line-height (CJK vs Latin typically 1.75 vs 1.5), mixed-script paragraph typography, CJK IME input-states (composition-pending, candidate-selection), date/number format (YYYY年MM月DD日 vs ISO), ZH-EN bilingual UI register (formal Chinese vs. casual English divergence). Source: caricature + lightning pilots.

### E3.3 — `design-system-compliance.md` managed-DS pre-fill sections
**File (modify):** `skills/hd-review/assets/starter-rubrics/design-system-compliance.md`
Add 4 collapsible "Managed DS: <name>" sections with DS-specific hooks:
- **ant-design:** `theme.token.*` hook names, `ConfigProvider` wrapping, `antd@v6` vs v5 migration flags
- **chakra:** `useColorMode`, `@chakra-ui/system` tokens
- **mui:** `ThemeProvider`, `styled()` vs `sx=`, `@mui/material/styles`
- **mantine:** `MantineProvider`, CSS-variable theme

Pre-fill criteria + default severity per DS. Source: caricature (antd), lightning (antd).

**Acceptance (E3):** `/hd:review critique design-system-compliance.md <work-item>` in an AntD repo produces AntD-specific findings, not generic. Starter-rubric count 12 → 14.

## E4 — Pattern graduations (pilot series → team rules)

Two patterns have earned episodic → procedural promotion.

### E4.1 — Graduate to AGENTS.md: "existing harness → additive-only, skip L1/L2/L3, scaffold L4/L5"

**4 confirmations:** plus-marketing (#2), oracle-chat (#4), lightning (#5), plus-uno (#6).

**File:** `AGENTS.md` § "Graduated rules" — add entry:
```
- [2026-04-18] When `.agent/` or `.claude/` is detected with ≥1 skill or rule file, `/hd:setup` defaults to: skip L1/L2/L3, scaffold L4/L5 only, zero modifications to pre-existing files. Source: docs/knowledge/lessons/2026-04-18-parallel-pilots-3-6-consolidated.md
```

**File:** `skills/hd-setup/SKILL.md` Step 4 — update layer-decision default table so this rule is the first branch checked (before falling through to per-layer defaults).

### E4.2 — Graduate to AGENTS.md: "additive-only discipline"

**6 confirmations:** all pilots. Zero modifications to pre-existing files across every pilot.

**File:** `AGENTS.md` § "Graduated rules" — add entry:
```
- [2026-04-18] `/hd:setup` is additive-only when any existing harness is detected. Never modify CLAUDE.md, AGENTS.md, .agent/, .claude/, docs/context/, docs/knowledge/, docs/rubrics/, or compound-engineering artifacts. New files only. Source: docs/knowledge/lessons/2026-04-18-parallel-pilots-3-6-consolidated.md
```

**File:** `skills/hd-setup/SKILL.md` — add pre-Step-1 guardrail: "If any harness signal is positive, confirm additive-only mode before proceeding."

## E5 — Synthetic `rubric-applicator` extract-mode test

4 pilots later, `mode: extract` has never fired. Validate output shape before any user hits it cold.

**File (no persistent write):** synthetic one-shot run.

**Input:**
- `/tmp/hd-real-test/plus-uno/AGENTS.md` (Bill-authored Forbidden Patterns — highest rubric-like implicit content)

**Task:** invoke `Task design-harnessing:review:rubric-applicator(mode=extract, source=plus-uno/AGENTS.md, target-rubric-name=forbidden-patterns)` and capture output.

**Expected output shape** (per `agents/review/rubric-applicator.md` spec): YAML frontmatter + criteria list (name, severity default, pass example, fail example, source_citation).

**Acceptance:** output is structurally valid rubric markdown, writable as `docs/rubrics/extracted-from-plus-uno-agents.md`. Document any gap between spec and reality in a new lesson (`docs/knowledge/lessons/2026-04-18-extract-mode-first-fire.md`). If the agent's prompt is aspirational, file a blocker and fix before Phase 3f.

## E6 — hd-compound graduation-loop ship-blockers

Surfaced by the concurrent hd-compound skill-test (2026-04-18). The plan-hash SHA-256 proof-of-consent is the skill's entire safety thesis and is currently aspirational — Claude computes the hash "in its head" with no deterministic reference implementation; two sessions can diverge on trailing newlines, quoting, or sort collation, making apply-mismatch indistinguishable from honest drift. Additionally, apply-mode depends on conversation context (dies under compaction), and there are dangling refs to non-existent `workflows/` files. Fix all in this batch so the graduation loop actually closes.

### E6.1 — Deterministic plan-hash script
**File:** `skills/hd-compound/scripts/compute-plan-hash.sh` (NEW)

Reproducible SHA-256 canonical-string builder. Requirements:
- Take structured inputs (title, paths, date, author, diff-summary) via flags or stdin JSON
- Emit canonical string with strict normalization: LF-only line endings, trailing-newline stripped, paths sorted (`LC_ALL=C sort`), quote-stripped, single-space between tokens
- `echo -n <canonical> | shasum -a 256 | cut -d' ' -f1` — print hash to stdout only
- Exit non-zero on malformed input with stderr message

Update `skills/hd-compound/SKILL.md` Propose Step 7 + Apply Step 4 to invoke this script by path — not "Claude computes hash". Update `references/plan-hash-protocol.md` to document the canonical format authoritatively (script is the reference implementation).

**Acceptance:** same inputs produce byte-identical hash across sessions / machines. Synthetic test: run twice with same input, compare outputs.

### E6.2 — Persisted propose artifact
**File:** `skills/hd-compound/SKILL.md` Propose procedure

After computing hash, write `.hd/propose-<short-hash>.json` at repo root (create `.hd/` if missing; add `.hd/` to `.gitignore` via a one-line template update at `skills/hd-setup/assets/gitignore-entries.txt`). File contents: `{title, paths, date, author, diff_summary, canonical_string, sha256}`.

Apply Step 1: locate the `.hd/propose-<short-hash>.json` file by hash prefix, re-read structured inputs from there rather than reconstructing from conversation. Context compaction no longer breaks apply.

Apply Step 6 (cleanup): after successful apply, `rm .hd/propose-<short-hash>.json` (or move to `.hd/applied/`).

**Acceptance:** run propose in session A, compact context, run apply in session B pointing at the hash — succeeds without replaying propose.

### E6.3 — Remove dangling workflow references
**Files:**
- `skills/hd-compound/references/plan-hash-protocol.md` — remove "See also" links to `../workflows/propose-graduation.md` and `../workflows/apply-graduation.md`
- `skills/hd-compound/references/graduation-criteria.md` — same cleanup

Replace with correct pointers into SKILL.md sections or E6.1 script.

**Acceptance:** `grep -r "workflows/" skills/` returns 0 hits (AGENTS.md explicitly forbids `workflows/` dirs inside skills).

### E6.4 — Resolve lesson-corpus convention contradiction
`references/lesson-patterns.md` § "File organization" asserts domain-grouped (`lessons/<domain>.md`), but the live corpus in `docs/knowledge/lessons/` is date-slug (`YYYY-MM-DD-<slug>.md`). SKILL.md Capture Step 2 can't route correctly against its own repo.

**Decision to make in implementation:**
- **Option A (match reality):** rewrite `lesson-patterns.md` to document date-slug as the convention; update Capture Step 2 to append to a **new** per-event file with today's date. Simpler, matches every existing file.
- **Option B (match aspiration):** migrate existing lessons to domain-grouped files; keep references as-written. Larger refactor; risks breaking cross-links.

**Default: Option A.** Date-slug-per-event is what every lesson in the corpus already is. Domain grouping can graduate later if we accumulate enough per-domain volume to need it.

Update `references/lesson-patterns.md` + `SKILL.md` Capture Step 2 accordingly.

**Acceptance:** Capture Step 2 procedure runs cleanly against this plug-in's own `docs/knowledge/lessons/` corpus with no routing ambiguity.

## Implementation order (one commit per item)

1. E1.1, E1.2, E1.3 (template graduations — zero-risk, unblocks future pilots)
2. E4.1, E4.2 (pattern graduations — text-only edits, immediate trust win)
3. E6.3, E6.4 (hd-compound cleanup — remove dangling refs, pick corpus convention)
4. E6.1, E6.2 (plan-hash script + propose-artifact persistence — closes the graduation safety loop)
5. E2.1 → E2.7 (detect.py — one commit per sub-signal, easy bisect if any regress)
6. E3.1, E3.2, E3.3 (rubric library — independent files)
7. E5 (synthetic extract-mode test — validates agent before we ship it)

Then re-regression: run `detect.py` against all 6 `/tmp/hd-real-test/*` clones; confirm new signals populate as expected per E2 acceptance. Run `compute-plan-hash.sh` twice with identical input; confirm byte-identical output. Update `CHANGELOG.md` Unreleased section.

## Files to touch

**New:**
- `skills/hd-setup/assets/rubrics-index.md.template`
- `skills/hd-review/assets/starter-rubrics/telemetry-display.md`
- `skills/hd-review/assets/starter-rubrics/i18n-cjk.md`
- `skills/hd-compound/scripts/compute-plan-hash.sh` (E6.1)
- `skills/hd-setup/assets/gitignore-entries.txt` (E6.2 — adds `.hd/` line)
- `docs/knowledge/lessons/2026-04-18-extract-mode-first-fire.md` (E5 output)

**Modify:**
- `skills/hd-setup/assets/hd-config.md.template`
- `skills/hd-setup/references/hd-config-schema.md`
- `skills/hd-setup/scripts/detect.py`
- `skills/hd-setup/SKILL.md`
- `skills/hd-review/assets/starter-rubrics/design-system-compliance.md`
- `skills/hd-compound/SKILL.md` (E6.1 invoke script + E6.2 propose-artifact + E6.4 corpus convention)
- `skills/hd-compound/references/plan-hash-protocol.md` (E6.1 canonical format + E6.3 dangling ref removal)
- `skills/hd-compound/references/lesson-patterns.md` (E6.4 — match date-slug reality)
- `skills/hd-compound/references/graduation-criteria.md` (E6.3 dangling ref removal)
- `AGENTS.md`
- `README.md` (starter-rubric count 12 → 14)
- `CHANGELOG.md`

**Delete:** none.

## Deferred (parked for Phase 3f)

Batched into Phase 3f plan once 3e ships. All surfaced by the concurrent skill-test pass (2026-04-18).

**hd-onboard polish (additive, small):**
- FAQ gaps: "why 5 layers specifically?", "`.agent/` pre-existing?", "how do I customize starter rubrics?"
- Memory-taxonomy reference only names 4 types; explicitly scope speculative + temporal in or out

**hd-review + agents cleanup:**
- All 6 agent descriptions exceed 180-char cap (range 251–352) — systematic trim
- `rubric-applicator` extract-mode has no phased procedure (60% real, 40% aspirational) — author Phase 1–N like apply-mode has
- `article-quote-finder` has no shipped article corpus — either ship local copy / URL list or disable integration until v0.6+
- `budget-check.sh` dead code + fragile JSON (rewrite with `jq -n`); document or replace `yq` dependency
- `hd-review/SKILL.md` 332 lines → under 200 soft cap (move Step 7/8 detail to reference)
- `hd-compound/SKILL.md` 258 lines → under 200 soft cap (move per-mode procedures to `references/*-procedure.md`)
- `harness-health-analyzer` `mode: quick` parameter defined but never dispatched — wire it or drop it
- Scoping note: `lesson-retriever` + `article-quote-finder` are orphan to hd-review (owned by hd-compound / hd-onboard) — document or remove from audit scope

**detect.py MCP scoping:**
- User-level MCPs invisible to detect.py (plus-uno pilot — Bill runs Figma + Notion MCPs, detect shows `mcp_servers: []`). Decide: document the scope OR add `--include-user-mcps` flag OR accept as-is.

## Verification

Done when:
- [ ] All E1/E2/E3/E4/E6 files written/modified per spec
- [ ] Re-run `detect.py` on 6 `/tmp/hd-real-test/*` clones; each output matches E2 acceptance
- [ ] Fresh `/hd:setup` on sds (clean slate) produces `hd-config.md` and `docs/rubrics/INDEX.md` with zero manual edits
- [ ] AGENTS.md graduated-rules section has 2 new entries with source citations
- [ ] E5 extract-mode run produces valid rubric markdown; gap report filed
- [ ] E6.1: `compute-plan-hash.sh` produces byte-identical output across two invocations with same input
- [ ] E6.2: propose → (compact context) → apply round-trip succeeds using only `.hd/propose-<hash>.json`
- [ ] E6.3: `grep -r "workflows/" skills/` returns 0 hits
- [ ] E6.4: Capture mode routes cleanly against this plug-in's own `docs/knowledge/lessons/` corpus
- [ ] `README.md` rubric count updated (12 → 14)
- [ ] `CHANGELOG.md` Unreleased section documents Phase 3e
- [ ] No writes to `docs/solutions/` (compound's namespace)
- [ ] Skill compliance checklist passes

## Sources

- **Origin document:** [`docs/knowledge/lessons/2026-04-18-parallel-pilots-3-6-consolidated.md`](../knowledge/lessons/2026-04-18-parallel-pilots-3-6-consolidated.md) — 6-repo pilot matrix, graduation-ready patterns, detect.py gaps, rubric gaps
- Phase 3d plan: [`2026-04-17-011-refactor-phase-3d-template-alignment-plan.md`](./2026-04-17-011-refactor-phase-3d-template-alignment-plan.md)
- Pilot #2 lesson: [`docs/knowledge/lessons/2026-04-18-pilot-plus-marketing-website.md`](../knowledge/lessons/2026-04-18-pilot-plus-marketing-website.md)
- Pilot branches (cherry-pick-ready): `pilot/hd-setup-2026-04-18-{caricature, oracle-chat, lightning, plus-uno}` in their respective `/tmp/hd-real-test/*` clones
