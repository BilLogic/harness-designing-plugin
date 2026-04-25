# hd-setup Test Cases

**Created:** 2026-04-16
**Owner:** Engineering (the person building `hd-setup`)
**Lifecycle:** Evolves with implementation. Test case IDs stable (T-S1 ↔ S1 always); commands and setup steps evolve as skill surface changes.
**Purpose:** Concrete reproduction recipes — one test case per scenario. Each recipe is a copy-paste-runnable procedure.

**Companion files:**
- [`hd-setup-scenarios.md`](./hd-setup-scenarios.md) — the scenarios this file references
- [`hd-setup-success-criteria.md`](./hd-setup-success-criteria.md) — pass/fail definitions per test

---

## Test infrastructure

### Prerequisites
- macOS 14+ (or comparable Linux)
- Claude Code installed and API key configured
- `git` available in `$PATH`
- Design Harness plug-in installed or available via local `/plugin-dir` pointer
- Bash 5+

### Conventions
- Test sandbox root: `/tmp/hd-test/` (wiped between tests)
- Scratch dirs named `/tmp/hd-test/<test-id>-<slug>/`
- Invocation format: `cd <sandbox> && <claude-code-command>`
- Capture transcripts via Claude Code's session log (or copy-paste from UI)
- Always run teardown — don't let scratch dirs accumulate

### Environment matrix
| Dimension | Values tested |
|---|---|
| Claude Code version | current stable (capture at test time) |
| Plug-in install mode | local dev (`--plugin-dir`) for v0.MVP; marketplace for v0.5 |
| User platform | macOS primarily; Linux spot-check |
| Concurrent plugins | none (baseline); compound-engineering (S7/F6); figma (W4) |

### Observable outputs to capture per run
- Files created/modified (diff via `git status` + `git diff`)
- First-turn response text (copy)
- Turn count to completion
- Wall-clock time to first useful artifact
- Any errors or unexpected prompts

---

## Starting-state tests

### T-S1 — Greenfield reproduction
**Scenario:** [S1](./hd-setup-scenarios.md#s1--cold-greenfield)
**Setup:**
```bash
mkdir -p /tmp/hd-test/t-s1-greenfield && cd /tmp/hd-test/t-s1-greenfield
git init
```
**Invocation:** Open Claude Code in this dir. Invoke `/hd:setup`.
**Teardown:** `rm -rf /tmp/hd-test/t-s1-greenfield`
**Capture:** files created under `docs/`, first-turn response, presence of `design-harnessing.local.md`.

### T-S2 — Single-file setup
**Scenario:** [S2](./hd-setup-scenarios.md#s2--single-file-setup)
**Setup:**
```bash
mkdir -p /tmp/hd-test/t-s2-singlefile && cd /tmp/hd-test/t-s2-singlefile
git init
cat > AGENTS.md <<'EOF'
# Team Rules
- Use the shared button component from @team/ui.
- Never hardcode colors; use design tokens.

## Context
Our product is a tutoring marketplace for students and mentors.

## Lessons
- 2026-02-14: Tried a fourth button variant for marketing; reverted.
EOF
```
**Invocation:** `/hd:setup`
**Teardown:** `rm -rf /tmp/hd-test/t-s2-singlefile`
**Capture:** AGENTS.md content before/after (must be byte-identical unless explicit diff preview shown); proposed layer folders; whether diff preview shown before any write.

### T-S3 — Awesome-design-md style
**Scenario:** [S3](./hd-setup-scenarios.md#s3--awesome-design-md-style)
**Setup:** Repo containing only a `DESIGN.md` with foundations + styles + components sections (borrow from awesome-design-md examples).
**Invocation:** `/hd:setup`
**Teardown:** remove scratch dir.
**Capture:** decomposition preview's fidelity to original sections; proposed `docs/context/design-system/` tree.

### T-S4 — Multi-platform pointers
**Scenario:** [S4](./hd-setup-scenarios.md#s4--multi-platform-pointers)
**Setup:**
```bash
mkdir -p /tmp/hd-test/t-s4-multi && cd /tmp/hd-test/t-s4-multi
git init
touch CLAUDE.md
mkdir -p .cursor/rules && touch .cursor/rules/general.mdc
```
Populate both with a few real rules.
**Invocation:** `/hd:setup`
**Teardown:** remove dir.
**Capture:** proposed redirect stubs; `AGENTS.md` content after consolidation.

### T-S5 — Advanced / plus-uno-shaped
**Scenario:** [S5](./hd-setup-scenarios.md#s5--advanced--plus-uno-shaped)
**Setup:** `git clone https://github.com/BilLogic/plus-uno /tmp/hd-test/t-s5-plusuno` (fresh fork).
**Invocation:** `/hd:setup`
**Teardown:** remove dir.
**Capture:** whether any files outside the generated audit report are modified; audit report location + content.

### T-S6 — Bloated docs
**Scenario:** [S6](./hd-setup-scenarios.md#s6--bloated-docs)
**Setup:** Scratch repo with a 500-line `CLAUDE.md` (generate with filler content preserving real structure).
**Invocation:** `/hd:setup`
**Capture:** tier split proposal; specific file destinations for Tier 2 migration.

### T-S7 — Coexists with compound-engineering
**Scenario:** [S7](./hd-setup-scenarios.md#s7--everys-plug-in-installed)
**Setup:** Run on Bill's actual machine (both plug-ins already installed). Or: scratch dir with both plug-ins local-linked.
**Invocation:** `/hd:setup` followed by `/ce:plan`.
**Capture:** no conflict warnings from either plug-in; both commands still work.

### T-S8 — Plug-in installed but harness empty
**Scenario:** [S8](./hd-setup-scenarios.md#s8--plug-in-installed-but-harness-empty)
**Setup:**
```bash
mkdir -p /tmp/hd-test/t-s8-empty && cd /tmp/hd-test/t-s8-empty
git init
# hd-setup plug-in is installed globally but this repo has no docs/ structure
```
**Invocation:** `/hd:setup`
**Capture:** same observables as T-S1 (should behave identically).

### T-S9 — Re-run
**Scenario:** [S9](./hd-setup-scenarios.md#s9--re-run-on-existing-harness)
**Setup:** Run T-S1 to completion. Do not teardown. In the same dir, run `/hd:setup` a second time.
**Capture:** file creation delta between runs 1 and 2 (should be empty or additive-only). Response should offer layer-specific options, not rescan greenfield.

### T-S10 — Forked template
**Scenario:** [S10](./hd-setup-scenarios.md#s10--forked-from-another-teams-harness)
**Setup:** Fresh clone of `design-harnessing-plugin` template. `grep -r "{{" .` should return at least 3 placeholder hits.
**Invocation:** `/hd:setup`
**Capture:** interactive placeholder walkthrough; post-run `grep -r "{{" .` should return 0 hits (or only explicitly-skipped ones).

### T-S11 — Other-tool harness respected (v1.1)
**Scenario:** [S11](./hd-setup-scenarios.md#s11--other-tool-harness-present-plus-uno---agent----claude----codex-)
**Setup:**
```bash
mkdir -p /tmp/hd-test/t-s11-other-harness && cd /tmp/hd-test/t-s11-other-harness
git init
mkdir -p .agent/rules .claude docs/plans
cat > .agent/rules/100-project-context.md <<'EOF'
# Product: test widget
EOF
echo '{}' > .claude/launch.json
for i in 001 002 003; do
  echo "# Plan $i" > "docs/plans/2026-04-16-$i-feat-something-plan.md"
done
```
**Invocation:** `/hd:setup`
**User answers:** pick "link" at L1, "skip" at L2, "scaffold" at L4 + L5.
**Teardown:** `rm -rf /tmp/hd-test/t-s11-other-harness`
**Capture:**
- `design-harnessing.local.md` contains `other_tool_harnesses_detected:` with `.agent/` + `.claude/` + `docs/plans/`
- `.agent/rules/100-project-context.md` byte-identical after run
- `.claude/launch.json` byte-identical after run
- Pointer file exists at `docs/context/product/` that references `.agent/rules/`

### T-S12 — MCP pre-configured (v1.1)
**Scenario:** [S12](./hd-setup-scenarios.md#s12--mcp-pre-configured-in-repo)
**Setup:**
```bash
mkdir -p /tmp/hd-test/t-s12-mcp/.cursor && cd /tmp/hd-test/t-s12-mcp
git init
cat > .cursor/mcp.json <<'EOF'
{
  "mcpServers": {
    "notion": { "command": "npx", "args": ["notion-mcp"] },
    "figma": { "command": "npx", "args": ["@figma/mcp"] }
  }
}
EOF
```
**Invocation:** `/hd:setup`
**Capture:**
- Step 1 detection surfaces `mcp_servers: [figma, notion]` in agent output
- Agent asks per-tool integration path (active use if available, install-walkthrough if not)
- Final `design-harnessing.local.md` contains `mcp_servers_at_setup: [figma, notion]`

### T-S13 — External tooling URL-only (v1.1)
**Scenario:** [S13](./hd-setup-scenarios.md#s13--external-tooling-referenced-but-no-mcp-configured)
**Setup:**
```bash
mkdir -p /tmp/hd-test/t-s13-urls && cd /tmp/hd-test/t-s13-urls
git init
cat > README.md <<'EOF'
# Widget
Brand docs: https://www.notion.so/team/widget-brand
Design file: https://figma.com/design/abc123
Issues: https://github.com/team/widget/issues
EOF
```
**Invocation:** `/hd:setup`
**Capture:**
- Step 1.5 surfaces `team_tooling.docs: [notion]` and `team_tooling.design: [figma]` and `team_tooling.pm: [github_issues]`
- Agent offers per-tool triage (install-walkthrough / pointer-only / ignore)
- If user picks pointer-only for Notion: `docs/context/product/` contains a pointer file with the Notion URL
- Final `design-harnessing.local.md` `team_tooling.docs: [notion]`, `design: [figma]`, `pm: [github_issues]`

### T-S14 — Tokens / figma-config as SoT (v1.1)
**Scenario:** [S14](./hd-setup-scenarios.md#s14--tokens-package--figma-config-as-design-system-source-of-truth)
**Setup:**
```bash
mkdir -p /tmp/hd-test/t-s14-tokens/tokens && cd /tmp/hd-test/t-s14-tokens
git init
cat > tokens/colors.json <<'EOF'
{ "color": { "primary": { "value": "#0051FF" }, "text": { "value": "#1A1A1A" } } }
EOF
```
**Invocation:** `/hd:setup`
**User answers:** scaffold L1 cheat-sheet + scaffold L4 rubric.
**Capture:**
- L1 cheat-sheet `docs/context/design-system/cheat-sheet.md` contains references to actual token names (`color.primary`, `color.text`)
- L4 rubric scaffolded + references the tokens path
- No modifications to `tokens/colors.json`

---

## Team-context tests

### T-T1 — Solo designer flow
**Scenario:** [T1](./hd-setup-scenarios.md#t1--solo-designer)
**Setup:** T-S1 setup.
**Invocation:** `/hd:setup`. When asked "Solo or team?", answer solo.
**Capture:** which layers are recommended; whether Layer 5 graduation complexity is deferred.

### T-T2 — Team flow (default)
**Scenario:** [T2](./hd-setup-scenarios.md#t2--520-person-team-primary-persona)
**Setup:** T-S1 setup.
**Invocation:** `/hd:setup`. Answer team when asked.
**Capture:** all five layers present in recommendations.

---

## Workflow tests

### T-W2 — Skip-layer respected on re-run
**Scenario:** [W2](./hd-setup-scenarios.md#w2--user-explicitly-skipping-a-layer)
**Setup:** T-S1 setup.
**Invocation:** Run 1 — decline Layer 3 when prompted. Run 2 — same repo.
**Capture:** Layer 3 NOT re-proposed in run 2. `design-harnessing.local.md` contains a skip record for Layer 3.

### T-W5 — No-vendor file-only mode
**Scenario:** [W5](./hd-setup-scenarios.md#w5--user-has-no-vendor-ai-tools)
**Setup:** Scratch dir. No `.mcp.json`, no Figma-related files, no other plug-ins.
**Invocation:** `/hd:setup`
**Capture:** no MCP references in output; all examples are markdown-only.

### T-W7 — Article citation
**Scenario:** [W7](./hd-setup-scenarios.md#w7--user-has-article-open-while-running-skill)
**Setup:** T-S1 setup.
**Invocation:** `/hd:setup`
**Capture:** at least one `§` reference to the article in the response transcript.

---

## Failure-mode tests

### T-F4 — Overwrite confirm
**Scenario:** [F4](./hd-setup-scenarios.md#f4--destructive-action-about-to-overwrite-existing-file)
**Setup:** T-S2 setup (pre-existing AGENTS.md with content).
**Invocation:** `/hd:setup`. When proposed to write over AGENTS.md, decline.
**Capture:** three options presented (backup-and-replace, merge, abort); no silent overwrite in any n=5 runs.

### T-F6 — No rivalry with compound-engineering
**Scenario:** [F6](./hd-setup-scenarios.md#f6--conflicting-prior-plugin-eg-everys-compound-engineering-has-claimed-ce-)
**Setup:** Machine with compound-engineering installed.
**Invocation:** `/hd:setup`
**Capture:** grep the response transcript for any "conflict" / "rival" / "vs." copy. Must be empty.

---

## v0.MVP acceptance — 12 tests must pass

Running the following block end-to-end must return 12/12 pass:
T-S1, T-S2, T-S7, T-S8, T-S9, T-T1, T-T2, T-W2, T-W5, T-W7, T-F4, T-F6.

See [`hd-setup-success-criteria.md`](./hd-setup-success-criteria.md) for pass/fail definitions.

---

## Change log

| Date | Change | By |
|---|---|---|
| 2026-04-16 | Initial split from `hd-harness-scenario-matrix.md` | Claude + Bill |
