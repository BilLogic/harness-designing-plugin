# hd-setup Success Criteria

**Created:** 2026-04-16
**Owner:** QA + Bill (product)
**Lifecycle:** Locked before v0.MVP ship. Revisited only with explicit decisions documented in `docs/knowledge/lessons/`.
**Purpose:** The ship/no-ship bar. Measurable pass definitions per scenario + aggregate acceptance thresholds.

**Companion files:**
- [`hd-setup-scenarios.md`](./hd-setup-scenarios.md) — what each scenario is
- [`hd-setup-test-cases.md`](./hd-setup-test-cases.md) — how to reproduce

---

## Aggregate acceptance thresholds

### v0.MVP ship gate

- [ ] **12/12 scenario tests pass** (T-S1, T-S2, T-S7, T-S8, T-S9, T-T1, T-T2, T-W2, T-W5, T-W7, T-F4, T-F6)
- [ ] **n=5 usability tests pass:**
  - Median TTFUI (time to first useful interaction) ≤ 30 minutes
  - Median "can articulate the value" ≤ 5 minutes after completion
  - ≥4 of 5 users would recommend re-running on their real repo
- [ ] **Zero silent overwrites** across the full test suite
- [ ] **Coexistence verified:** `/ce:plan` still works after `/hd:setup` runs in same repo

### v0.5 ship gate (additive)

- [ ] All v0.MVP gates still pass
- [ ] **20+ scenarios covered** (add T-S3, T-S4, T-S5, T-S6, T-S10, T-T3, T-T4, T-T6, T-W1, T-W3, T-W4, T-F1, T-F2, T-F5, T-F7, T-F9)
- [ ] Marketplace install (X1) works end-to-end
- [ ] Plug-in meta-harness uses `hd-review` on itself (dogfood evidence)

---

## Per-scenario pass criteria

### C-S1 — Greenfield pass criteria
**Scenario:** [S1](./hd-setup-scenarios.md#s1--cold-greenfield) · **Test:** [T-S1](./hd-setup-test-cases.md#t-s1--greenfield-reproduction)
**Pass when ALL:**
- [ ] `docs/context/` created with ≥1 real file (not just placeholder)
- [ ] `design-harnessing.local.md` created at repo root with at minimum `team_size`, `skipped_layers` fields
- [ ] User touched ≥2 of the 5 layers during the session (enforces Goal #2 pedagogy)
- [ ] No destructive action taken without confirmation
- [ ] Output references at least one `§` from the article (W7 compliance)
- [ ] TTFUI ≤ 30 minutes (manual stopwatch, n=5 tests)
- [ ] Test user articulates value within 5 minutes of finishing
**Fail when:** any bullet above fails.
**Evidence to preserve:** session transcript + `docs/` tree screenshot + `design-harnessing.local.md` content.

### C-S2 — Single-file pass criteria
**Scenario:** [S2](./hd-setup-scenarios.md#s2--single-file-setup) · **Test:** [T-S2](./hd-setup-test-cases.md#t-s2--single-file-setup)
**Pass when ALL:**
- [ ] Original `AGENTS.md` byte-identical after run unless user explicitly approved a diff
- [ ] Diff preview shown before any write to existing file
- [ ] Classified content lands in the correct layer folder (rules → root AGENTS.md, context → `docs/context/`, lessons → `docs/knowledge/lessons/`)
- [ ] No content lost from original file
**Evidence:** before/after `md5sum AGENTS.md`; session transcript showing diff preview.

### C-S3 — Awesome-design-md pass criteria
**Scenario:** [S3](./hd-setup-scenarios.md#s3--awesome-design-md-style) · **Test:** [T-S3](./hd-setup-test-cases.md#t-s3--awesome-design-md-style)
**Pass when ALL:**
- [ ] Decomposition preview accurately preserves every top-level section of the original `DESIGN.md`
- [ ] Proposed tree matches article §4a structure (foundations / styles / components)
- [ ] No content silently dropped
**Evidence:** side-by-side diff of original DESIGN.md vs. proposed tree contents.

### C-S4 — Multi-platform consolidation pass criteria
**Scenario:** [S4](./hd-setup-scenarios.md#s4--multi-platform-pointers) · **Test:** [T-S4](./hd-setup-test-cases.md#t-s4--multi-platform-pointers)
**Pass when ALL:**
- [ ] `AGENTS.md` at repo root contains the canonical consolidated rules
- [ ] Platform-specific files become thin redirect stubs pointing to AGENTS.md
- [ ] No rule content deleted without user confirmation
**Evidence:** before/after file tree; content check of each platform stub.

### C-S5 — Advanced audit pass criteria
**Scenario:** [S5](./hd-setup-scenarios.md#s5--advanced--plus-uno-shaped) · **Test:** [T-S5](./hd-setup-test-cases.md#t-s5--advanced--plus-uno-shaped)
**Pass when ALL:**
- [ ] `docs/knowledge/lessons/harness-audit-<date>.md` produced
- [ ] Report contains specific, prioritized TODOs (not generic advice)
- [ ] **No files outside that report are modified**
- [ ] `git status` clean except for the new audit file
**Evidence:** `git status` output + audit report content.

### C-S6 — Bloated-docs pass criteria
**Scenario:** [S6](./hd-setup-scenarios.md#s6--bloated-docs) · **Test:** [T-S6](./hd-setup-test-cases.md#t-s6--bloated-docs)
**Pass when ALL:**
- [ ] Tier split proposal includes specific line-ranges for Tier 1 (<200 lines) vs. Tier 2
- [ ] Each moved section has a specific destination file path
- [ ] No content dropped
**Evidence:** proposal doc + target file paths.

### C-S7 — Coexistence pass criteria
**Scenario:** [S7](./hd-setup-scenarios.md#s7--everys-plug-in-installed) · **Test:** [T-S7](./hd-setup-test-cases.md#t-s7--coexists-with-compound-engineering)
**Pass when ALL:**
- [ ] No conflict warnings from either plug-in at invocation
- [ ] `/ce:plan` still works after `/hd:setup` runs
- [ ] No `hd-*` files written to `docs/solutions/` (ce's namespace)
- [ ] No `ce-*` files written to `docs/design-solutions/` (our namespace)
**Evidence:** back-to-back invocation transcripts; `git status` diff.

### C-S8 — Plug-in-installed-empty-repo pass criteria
**Scenario:** [S8](./hd-setup-scenarios.md#s8--plug-in-installed-but-harness-empty) · **Test:** [T-S8](./hd-setup-test-cases.md#t-s8--plug-in-installed-but-harness-empty)
**Pass when:** same criteria as C-S1. Behavior is identical to greenfield.

### C-S9 — Re-run pass criteria
**Scenario:** [S9](./hd-setup-scenarios.md#s9--re-run-on-existing-harness) · **Test:** [T-S9](./hd-setup-test-cases.md#t-s9--re-run)
**Pass when ALL:**
- [ ] No duplicate files created on second run
- [ ] User is offered layer-specific deep-dive options, not greenfield scaffold
- [ ] `design-harnessing.local.md` from first run is read and respected (skipped layers stay skipped)
**Evidence:** `git status` after run 2 should show additive-only changes.

### C-S10 — Localization pass criteria
**Scenario:** [S10](./hd-setup-scenarios.md#s10--forked-from-another-teams-harness) · **Test:** [T-S10](./hd-setup-test-cases.md#t-s10--forked-template)
**Pass when ALL:**
- [ ] `grep -r "{{" .` returns 0 hits after run (or only lines user explicitly skipped)
- [ ] All placeholders resolved or explicitly recorded as skipped in `design-harnessing.local.md`
**Evidence:** grep output before/after.

### C-T1 — Solo pass criteria
**Scenario:** [T1](./hd-setup-scenarios.md#t1--solo-designer) · **Test:** [T-T1](./hd-setup-test-cases.md#t-t1--solo-designer-flow)
**Pass when ALL:**
- [ ] Layer 5 graduation complexity is deferred (scratchpad-mode language in output)
- [ ] Layers 1 and 4 are still emphasized
- [ ] Flow completes without forcing team-only patterns (no "handoffs," "rotations," or "PRs" language)
**Evidence:** response transcript.

### C-T2 — Team pass criteria
**Scenario:** [T2](./hd-setup-scenarios.md#t2--520-person-team-primary-persona) · **Test:** [T-T2](./hd-setup-test-cases.md#t-t2--team-flow-default)
**Pass when:** all five layers appear in recommendations.

### C-W2 — Skip-respected pass criteria
**Scenario:** [W2](./hd-setup-scenarios.md#w2--user-explicitly-skipping-a-layer) · **Test:** [T-W2](./hd-setup-test-cases.md#t-w2--skip-layer-respected-on-re-run)
**Pass when ALL:**
- [ ] Run 1 records the skip in `design-harnessing.local.md`
- [ ] Run 2 does not re-propose the skipped layer
- [ ] User can explicitly un-skip with a flag (`--reset-skips` or similar)
**Evidence:** `design-harnessing.local.md` content + run 2 transcript.

### C-W5 — No-vendor pass criteria
**Scenario:** [W5](./hd-setup-scenarios.md#w5--user-has-no-vendor-ai-tools) · **Test:** [T-W5](./hd-setup-test-cases.md#t-w5--no-vendor-file-only-mode)
**Pass when ALL:**
- [ ] No MCP references in skill output
- [ ] All example files use plain markdown only
- [ ] No vendor-specific assumptions (no "install Figma plugin first")
**Evidence:** grep response for `mcp`/`figma`/`notion` should return 0 substantive references.

### C-W7 — Article citation pass criteria
**Scenario:** [W7](./hd-setup-scenarios.md#w7--user-has-article-open-while-running-skill) · **Test:** [T-W7](./hd-setup-test-cases.md#t-w7--article-citation)
**Pass when ALL:**
- [ ] At least one `§` or explicit article section reference in skill output
- [ ] Reference is accurate (correct section number for the concept cited)
**Evidence:** grep transcript for `§`.

### C-F4 — Overwrite-confirm pass criteria
**Scenario:** [F4](./hd-setup-scenarios.md#f4--destructive-action-about-to-overwrite-existing-file) · **Test:** [T-F4](./hd-setup-test-cases.md#t-f4--overwrite-confirm)
**Pass when ALL:**
- [ ] All three options (backup-and-replace, merge, abort) presented when skill would overwrite
- [ ] **Zero silent overwrites across n=5 test runs**
- [ ] "Abort" option is genuinely non-destructive (no partial writes)
**Evidence:** n=5 transcripts; `git status` after each abort should be clean.

### C-F6 — No-rivalry pass criteria
**Scenario:** [F6](./hd-setup-scenarios.md#f6--conflicting-prior-plugin-eg-everys-compound-engineering-has-claimed-ce-) · **Test:** [T-F6](./hd-setup-test-cases.md#t-f6--no-rivalry-with-compound-engineering)
**Pass when ALL:**
- [ ] No "conflict," "rival," "vs.," or "incompatible" language in output
- [ ] Acknowledgment of compound-engineering as philosophical cousin (if the topic comes up)
- [ ] Our protected-artifact list does not overlap with compound's (`docs/solutions/`)
**Evidence:** grep response for the forbidden terms.

---

### C-S11 — Other-tool harness respected (v1.1)
**Scenario:** [S11](./hd-setup-scenarios.md#s11--other-tool-harness-present-plus-uno---agent----claude----codex-) · **Test:** [T-S11](./hd-setup-test-cases.md#t-s11--other-tool-harness-respected-v11)
**Pass when ALL:**
- [ ] `detect.py` mode is `advanced` with `priority_matched: 2`
- [ ] Every file under `.agent/`, `.claude/`, `.codex/`, `.cursor/skills/` is byte-identical before and after the run (`diff -r` clean)
- [ ] `design-harnessing.local.md` `other_tool_harnesses_detected:` lists the detected paths
- [ ] For every layer where the other-tool harness had material, the user's decision was offered and recorded in `layer_decisions:`
- [ ] Any `link` decision produced a pointer file under `docs/<layer>/` that references the other-tool source by path
- [ ] Zero "rivalry" language in transcript (no "I'll take over your harness" / "migrate to hd-*" / etc.)
**User-story pass:** user describes the experience as "my existing harness was respected, I got a clear per-layer decision, I'm unblocked to continue."
**Evidence:** `diff -r` of `.agent/` / `.claude/` before vs. after; `design-harnessing.local.md` dump; pointer file content check.

### C-S12 — MCP pre-configured surfaced (v1.1)
**Scenario:** [S12](./hd-setup-scenarios.md#s12--mcp-pre-configured-in-repo) · **Test:** [T-S12](./hd-setup-test-cases.md#t-s12--mcp-pre-configured-v11)
**Pass when ALL:**
- [ ] `detect.py` output `mcp_servers:` contains all servers from every mcp.json file in the repo
- [ ] Agent surfaces the detected server list at Step 1.5 (user-visible)
- [ ] For each known-integrable server (notion, figma, linear, github), agent offers a per-tool integration triage with the 3 options (active / start-command / pointer-only)
- [ ] Agent NEVER recommends an MCP package not in `external-tooling.md` known-installs table
- [ ] Agent NEVER silently uses its session's own MCPs on the user's behalf without explicit consent
- [ ] `mcp_servers_at_setup:` in `design-harnessing.local.md` matches the detected list
**User-story pass:** user says "the tool was transparent about what it knew and what it could do; it did not magically pull my data without asking."
**Evidence:** transcript grep for session-MCP names; comparison of `detect.py mcp_servers` with final `mcp_servers_at_setup`; check that no MCP named was from outside the known table.

### C-S13 — External tooling URL-only (v1.1)
**Scenario:** [S13](./hd-setup-scenarios.md#s13--external-tooling-referenced-but-no-mcp-configured) · **Test:** [T-S13](./hd-setup-test-cases.md#t-s13--external-tooling-url-only-v11)
**Pass when ALL:**
- [ ] Every URL-referenced tool (notion, figma, linear, etc.) surfaces in `detect.py team_tooling` output
- [ ] Agent surfaces detected tools per category at Step 1.5
- [ ] For each tool user confirms, one of 3 integration paths offered: install-walkthrough / pointer-only / ignore
- [ ] Install-walkthrough (if chosen) names the correct MCP package from the known table + points to the API-key URL
- [ ] Pointer-only (if chosen) produces a pointer file at the appropriate layer with the source URL
- [ ] `team_tooling.<category>:` in `design-harnessing.local.md` matches user decisions
- [ ] ZERO recommendations of MCP packages outside the known table
**User-story pass:** user describes the tool as "aware of where my work lives" and feels "unblocked — I have a clear next step for each source."
**Evidence:** transcript grep for offered MCP packages (must be in known table); pointer file content; `team_tooling` dump.

### C-S14 — Tokens / figma-config SoT (v1.1)
**Scenario:** [S14](./hd-setup-scenarios.md#s14--tokens-package--figma-config-as-design-system-source-of-truth) · **Test:** [T-S14](./hd-setup-test-cases.md#t-s14--tokens--figma-config-as-sot-v11)
**Pass when ALL:**
- [ ] `detect.py` emits `has_tokens_package: true` OR `has_figma_config: true` (whichever applies)
- [ ] At L1 frame, agent explicitly surfaces the detected SoT ("your design-system source-of-truth looks like `tokens/`")
- [ ] If user scaffolds L1 cheat-sheet, output references actual token names read from files (not just `{{PLACEHOLDER}}`)
- [ ] If user scaffolds L4 rubric, output includes a rubric rule that REFERENCES the detected SoT path
- [ ] Zero modifications to the SoT files themselves (`tokens/*`, `figma.config.json`)
**User-story pass:** user describes the harness as "grounded in my real code" (cheat-sheet matches tokens; rubric checks against the same tokens).
**Evidence:** cheat-sheet content diff vs. actual token names; rubric content showing token-path reference; `diff` of SoT files (must be zero).

---

## Remaining scenarios (v0.5 criteria TBD)

The following scenarios from [`hd-setup-scenarios.md`](./hd-setup-scenarios.md) do not yet have locked success criteria — they ship in v0.5 and will be spec'd when that gate approaches:

- C-T3 (rotation team) · C-T4 (designer+engineer pair) · C-T5 (monorepo) · C-T6 (no design system)
- C-W1 (mid-project) · C-W3 (ungraduated lessons) · C-W4 (Figma MCP) · C-W6 (non-Claude platform)
- C-F1 (hd-compound before hd-setup) · C-F2 (Layer 3 before Layer 2) · C-F3 (multiple harnesses) · C-F5 (confused mid-run) · C-F7 (AGENTS.md conflict) · C-F8 (API key) · C-F9 (contradictory signals)
- C-X1, C-X2, C-X3, C-X4 (cross-platform listing)

When adding criteria, keep the same format: scenario link, test link, pass-when-ALL checklist, evidence.

---

## Change log

| Date | Change | By |
|---|---|---|
| 2026-04-16 | Initial split from `hd-harness-scenario-matrix.md` | Claude + Bill |
