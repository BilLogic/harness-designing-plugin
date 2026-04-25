---
title: "fix: sds-pilot gap iteration (Phases 3a/3b/3c)"
type: fix
status: completed
date: 2026-04-17
origin: docs/knowledge/lessons/2026-04-17-pilot-figma-sds.md
completion_commits:
  - d7fb465c  # Phase 3a — G5 + G6 + G8
  - dd1df9a6  # Re-pilot validation lesson
  - 9585761a  # Phase 3b — G1 + G4 + G9 + rubric-applicator extract mode
  - 56958605  # Phase 3c — G2 a11y-framework detection
---

# fix: sds-pilot gap iteration (Phases 3a / 3b / 3c)

First real-repo pilot of `/hd:setup` on [github.com/figma/sds](https://github.com/figma/sds) surfaced 7 gaps in detection, per-layer defaults, and UX. Fix them before running subsequent pilots on Bill's 5 repos (plus-marketing-website, caricature, oracle-chat, lightning, plus-uno), so we don't compound bad defaults across multiple repos.

**Origin decisions carried forward from** [`docs/knowledge/lessons/2026-04-17-pilot-figma-sds.md`](../knowledge/lessons/2026-04-17-pilot-figma-sds.md):
- G3 (Storybook) intentionally deferred to v2 — not included here
- G7 (scattered-rich mode) subsumed by G6 — mode enum stays coarse; per-layer logic handles richness
- 5 real repos + sds (6 total) continue to be the validation set

Each gap is small (<100 lines of change) and independently committable.

## Phase 3a — MUST FIX (blocks subsequent pilots)

### G5 — Complete Figma MCP entry in `known-mcps.md`

**Problem:** Current entry names `@figma/mcp` + API token URL, but omits the transport spec. Figma MCP runs locally as an SSE server on port 3845; `claude mcp add` requires `--transport sse <url>`. Without this, install-walkthrough path is unreproducible.

**Fix:** expand the Figma row in the Known-MCP-installs table to include:
- Install: `npx -y @figma/mcp` (starts the local server)
- Transport: `sse`
- URL: `http://127.0.0.1:3845/sse`
- Claude Code wiring: `claude mcp add --transport sse figma-dev-mode-mcp-server http://127.0.0.1:3845/sse`
- Auth: Figma personal access token from [figma.com/developers/api#access-tokens](https://figma.com/developers/api#access-tokens)
- Cursor wiring: mcp.json stanza example

Precedent: plus-marketing-website's `docs/setup-mcps.md` documents exactly this shape.

**Acceptance:**
- [ ] Figma row has 5 fields (install / transport / URL / wire-cmd / auth URL) + optional mcp.json stanza example
- [ ] User can follow the row end-to-end without consulting external docs

**Files:** `skills/hd-setup/references/known-mcps.md`

---

### G6 — Layer 4 default logic: critique-when-rich, scaffold-when-nothing

**Problem:** Pilot showed sds has 16 KB of `.github/copilot-instructions.md` that is effectively implicit rubric content ("use React Aria for a11y", "follow token variables", etc.). Our current Layer 4 default scaffolds 4 fresh starter rubrics on top — duplicative and noisy. Layer 1 already gets the "respect what exists" treatment via link-default. Layer 4 needs the same.

**Fix:** Update Step 7 (Layer 4) Default Action table in `SKILL.md` with a new top condition:

| Condition | Default |
|---|---|
| **NEW:** `has_ai_docs: true` AND combined size of `.cursor/rules/` + `.github/copilot-instructions.md` + `AGENTS.md` + `CLAUDE.md` + `DESIGN.md` > 200 lines | **critique + extract** — surface implicit rubrics from existing docs; do NOT scaffold fresh starter rubrics |
| `has_tokens_package` or `has_figma_config` | scaffold design-system-compliance rubric referencing actual tokens |
| `has_external_skills` | scaffold skill-quality rubric entry |
| Nothing detected | scaffold starter trio (a11y + design-system + component-budget) |

The "critique + extract" procedure:
1. Invoke `design-harnessing:review:rubric-applicator` with existing AI-doc file(s) as targets + a "meta-rubric" for extraction (or use the skill-quality-auditor's general pattern-recognition ability)
2. Surface extracted rubric candidates to user as a list: "I see 5 implicit rubrics in your copilot-instructions.md: [list]. Want to promote any to explicit rubric files in docs/context/design-system/?"
3. For each candidate user approves, copy the relevant starter rubric + pre-fill it with the extracted content
4. User reviews and edits; `hd:setup` writes with explicit confirmation

**Acceptance:**
- [ ] Step 7 Default Action table has the new 4-condition hierarchy
- [ ] Critique + extract procedure described in SKILL.md Step 7 (~15 lines)
- [ ] sds re-simulated: Layer 4 lands on critique-mode (not scaffold-mode)
- [ ] Pointer to `design-harnessing:review:rubric-applicator` as the agent that does the extraction

**Files:** `skills/hd-setup/SKILL.md`

---

### G8 — "Extract + pointer" procedure for link-mode writes

**Problem:** Pilot's Layer 1 link-mode wrote `docs/context/product/one-pager.md` containing literally one line: `See [.github/copilot-instructions.md § "Repository Overview"]`. That's no better than having no pointer — user would just read the Copilot file directly. Pointer file has zero standalone value.

**Fix:** When any layer chooses **link** action, the pointer file includes a 3–5 line extracted summary + the reference. Canonical shape:

```markdown
# <Layer concept> (pointer to source)

**Source:** [<path or URL>](<path-or-URL>)

<3–5 line extracted summary of what's at the source. Plain prose. Enough
standalone context that reading just this file gives a new teammate
essential signal; the source has full detail.>

*(Pointer file — authoritative content lives at the source above. Update this summary when the source changes materially.)*
```

Apply to: Step 4 Layer 1 link, Step 5 Layer 2 link, Step 6 Layer 3 link.

**Acceptance:**
- [ ] Steps 4, 5, 6 "Execute — link" procedure updated to reference the extract+summary pattern
- [ ] New asset template: `skills/hd-setup/assets/pointer-file.md.template` with the canonical shape
- [ ] Example shown in SKILL.md Step 4 body (one concrete example using the sds Copilot-instructions-as-source case)

**Files:** `skills/hd-setup/SKILL.md` + new `skills/hd-setup/assets/pointer-file.md.template`

## Phase 3b — SHOULD FIX (UX quality; not breaking)

### G1 — Recursive `tokens.json` detection

**Problem:** Sds has `scripts/tokens/tokens.json`. Current `detect_config_sot()` in `detect.py` only checks top-level (`./tokens/`, `./tokens.config.json`, etc.). Misses the sds case. Likely common pattern — design-system repos often put tokens under scripts/ or build/.

**Fix:** Add a recursive search to `detect_config_sot()`:

```python
# Add after existing tokens_signals list
tokens_json_paths = []
for candidate in REPO.rglob("tokens.json"):
    # Exclude node_modules, dist, build, .next, __pycache__
    if any(skip in candidate.parts for skip in {"node_modules", "dist", "build", ".next", "__pycache__", ".git"}):
        continue
    # Limit to depth 3 to avoid runaway
    if len(candidate.relative_to(REPO).parts) > 3:
        continue
    tokens_json_paths.append(str(candidate.relative_to(REPO)))
    if len(tokens_json_paths) >= 3:  # cap
        break

has_tokens_json = len(tokens_json_paths) > 0
has_tokens = has_tokens or has_tokens_json  # OR with existing top-level check
```

Also emit new field `tokens_package_paths: [...]` in JSON output so Layer 4 can reference the actual path.

**Acceptance:**
- [ ] `has_tokens_package: true` on sds after fix
- [ ] `tokens_package_paths: ["scripts/tokens/tokens.json"]` in sds JSON
- [ ] `tokens.json` under `node_modules/` NOT matched
- [ ] Depth-3 cap enforced (no recursion into deep dirs)
- [ ] All 6 real repos still detect correctly (regression)

**Files:** `skills/hd-setup/scripts/detect.py`

---

### G4 — Batch tool-discovery prompts

**Problem:** SKILL.md Step 3 currently asks 6 sequential per-category prompts. High friction; feels interrogating.

**Fix:** Replace with one batched prompt shape:

> "I detected: `<detected tools>`. Anything else you (or contributors) use for this project — across these categories?
>
> - **Docs/wiki** — notion, confluence, coda, obsidian, google docs, …
> - **Design** — figma, paper, pencildev, sketch, …
> - **Diagramming** — excalidraw, miro, whimsical, figjam, …
> - **Analytics** — amplitude, mixpanel, posthog, metabase, …
> - **PM/issues** — linear, jira, github issues, asana, …
> - **Comms** — slack, discord, loom, …
>
> Reply with anything I missed (one line per tool + category, or `nothing else`)."

Then parse the user's free-text reply; map to categories; record in `team_tooling`.

**Acceptance:**
- [ ] SKILL.md Step 3 prompt collapsed to 1 batched question (as shown above)
- [ ] Parse-free-text handling described: comma/newline separated tool names, optional `category: tool` shorthand
- [ ] 6 separate per-category prompts removed

**Files:** `skills/hd-setup/SKILL.md`

---

### G9 — Solo-friendly language

**Problem:** Step 3 uses "your team" which assumes team context. Many users are solo (per our 6-repo test set, 4 of 6 are solo or ~1-person).

**Fix:** Replace "your team" with "you (or contributors)" in Step 3 prompts and surrounding context. Also check other steps for team-assumed language.

**Acceptance:**
- [ ] `grep -c "your team" skills/hd-setup/SKILL.md` returns 0 in Step 3 prompts (may remain in generic framing paragraphs)
- [ ] Solo and team users both see appropriate framing
- [ ] Team-size question in SKILL.md stays (still useful for adaptive templates later) but isn't gating

**Files:** `skills/hd-setup/SKILL.md`

## Phase 3c — NICE TO HAVE

### G2 — package.json a11y-framework detection

**Problem:** Sds uses React Aria + React Stately (accessibility frameworks). Strong signal that a11y rubric is especially relevant. Currently detect.py doesn't parse package.json deps, so this signal is invisible.

**Fix:** Add `detect_a11y_framework()` function to `detect.py`. Parse `package.json` `dependencies` + `devDependencies`. Match against known a11y-framework package patterns:

- `react-aria`, `@react-aria/*`
- `react-stately`, `@react-stately/*`
- `react-spectrum`, `@adobe/react-spectrum`
- `@radix-ui/*`
- `@headlessui/*`
- `reakit`
- `@mui/material` (has a11y built-in, flag as supporting)

Emit two new fields:
- `a11y_framework_in_use: bool`
- `detected_a11y_packages: [pkg-name, ...]`

Use `a11y_framework_in_use: true` in Layer 4 default: scaffold accessibility-wcag-aa with a rationale line ("especially relevant because `<packages>` detected — you're already investing in a11y").

**Acceptance:**
- [ ] `a11y_framework_in_use` emitted in detect.py JSON (schema v2 additive — no breaking changes)
- [ ] Sds detects true with at minimum `react-aria` listed
- [ ] Non-Node repos (no package.json) → `a11y_framework_in_use: false`, no error
- [ ] Layer 4 scaffold path shows rationale line when true

**Files:** `skills/hd-setup/scripts/detect.py` + `skills/hd-setup/SKILL.md` (Step 7 rationale line)

## Acceptance (aggregate)

- [ ] **Phase 3a:** G5 + G6 + G8 all land; sds pilot re-simulated; Layer 4 now defaults to critique-mode; Layer 1 pointer files have 3–5 line summaries
- [ ] **Phase 3b:** G1 + G4 + G9 all land; sds re-detects `has_tokens_package: true`; Step 3 is one prompt; no "your team" gating language
- [ ] **Phase 3c:** G2 lands; `a11y_framework_in_use` emitted; sds detects true via react-aria; Layer 4 rationale surfaces the reason
- [ ] Budget check green: Tier 1 ≤ 200 lines, all SKILL.md ≤ 500 lines
- [ ] Regression: all 6 real repos (sds, plus-marketing-website, caricature, oracle-chat, lightning, plus-uno) still route correctly
- [ ] Post-Phase-3a: new lesson at `docs/knowledge/lessons/2026-04-17-sds-re-pilot-after-phase-3a.md` capturing improvement evidence
- [ ] Commit hygiene: one commit per phase (3a / 3b / 3c) for clean diff review

## Implementation order

1. **Phase 3a commit** (G5 → G6 → G8) — ~45 min
2. **Re-simulate sds pilot**; capture post-3a lesson; validate substantive improvement — ~15 min
3. **Phase 3b commit** (G1 → G4 → G9) — ~30 min
4. **Phase 3c commit** (G2) — ~20 min
5. Optional: second sds re-simulation after 3b/3c if detection changed — ~10 min

**Total: ~2 hrs.** Splittable anywhere; Phase 3a is the gating work before re-piloting.

## Context

**Preceding commits on branch `claude/elegant-euclid`:**
- `7213faf5` docs(lesson): pilot walkthrough of /hd:setup on figma/sds
- `15b6f5c5` polish: README + layer refs slimmed + AGENTS.md Tier-1 compliance
- `31f8d4e9` refactor: comprehensive architecture — agents/ + flat skills + 6 sub-agents

**Current state:** all 4 SKILL.md files within budget (≤ 500 lines hard cap), all 6 real repos detect correctly, 6 sub-agents shipped in `agents/`, workflows/ folders deleted, templates/ → assets/ renamed. Ready for pilot iteration.

## Sources

- **Origin document:** [`docs/knowledge/lessons/2026-04-17-pilot-figma-sds.md`](../knowledge/lessons/2026-04-17-pilot-figma-sds.md) — all 7 gaps surfaced during the sds pilot with concrete evidence (file sizes, detect.py output, example pointer file)
- **Related test plan:** [`docs/plans/2026-04-17-008-self-run-test-plan.md`](2026-04-17-008-self-run-test-plan.md) — broader v1.0.0 ship-gate test spec
- **Related ideation:** [`docs/plans/2026-04-17-009-v1.1-skill-ideation.md`](2026-04-17-009-v1.1-skill-ideation.md) — architectural reshape ideation that preceded the pilot
- **Current files to touch:**
  - [`skills/hd-setup/SKILL.md`](../../skills/hd-setup/SKILL.md) (326 lines; G4, G6, G8, G9)
  - [`skills/hd-setup/references/known-mcps.md`](../../skills/hd-setup/references/known-mcps.md) (G5)
  - [`skills/hd-setup/scripts/detect.py`](../../skills/hd-setup/scripts/detect.py) (G1, G2)
- **Precedent for Figma MCP transport detail:** plus-marketing-website's `docs/setup-mcps.md` — inspected during architecture ideation on 2026-04-17
