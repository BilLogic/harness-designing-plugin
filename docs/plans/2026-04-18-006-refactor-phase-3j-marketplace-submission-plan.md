---
title: "Phase 3j — marketplace submission: manifests, logo, marketplace.json, submission packets"
type: refactor
status: active
date: 2026-04-18
---

# Phase 3j — marketplace submission

Ship the plug-in to public distribution: Anthropic's Claude Code plugin directory, Cursor's marketplace, and (when it opens) Codex CLI's plugin directory. Origin: Bill's request 2026-04-18 post-Phase-3i.

## Research snapshot

| Platform | Submission status | Submission path |
|---|---|---|
| **Claude Code** (Anthropic) | ✅ open | [clau.de/plugin-directory-submission](https://clau.de/plugin-directory-submission) — Anthropic-reviewed. Self-hosted marketplace also possible via `marketplace.json` + `/plugin marketplace add`. |
| **Cursor** | ✅ open | [cursor.com/marketplace/publish](https://cursor.com/marketplace/publish) — community submission, review-gated. Launched with curated partners but now open. |
| **Codex CLI** (OpenAI) | ⚠️ "coming soon" | Official directory not yet live. Self-host via `marketplace.json` + `codex plugins add <repo>` until OpenAI opens submissions. |

## Five work units

### 3j.1 — Manifest polish

**Files:** `.claude-plugin/plugin.json`, `.cursor-plugin/plugin.json`, `.codex-plugin/plugin.json`

**Claude plugin.json fix:** `homepage` currently points at old `design-harnessing-plugin` URL; update to `https://github.com/BilLogic/harness-designing-plugin`.

**Cursor plugin.json additions:**
- `version` ✅ already present
- `keywords` ❌ add: `["design", "design-harness", "design-systems", "context-engineering", "knowledge-management", "ai-workflows", "rubrics"]`
- `repository` ❌ add: `"https://github.com/BilLogic/harness-designing-plugin"`
- `logo` ❌ add: `"./assets/logo.svg"` (created in 3j.2)
- `homepage` ❌ add

**Codex plugin.json fixes:**
- Verify `skills: "./skills"` resolves correctly
- Add `keywords` (Codex spec supports it per build docs)
- Add `repository` field if schema supports
- Add `logo: "./assets/logo.svg"`

**Acceptance:** each manifest JSON-valid, name `design-harness` consistent across all three, version `1.0.0` consistent.

### 3j.2 — Logo asset

**File (new):** `assets/logo.svg`

Design: geometric 5-layer stack mark. Simple, works at 64×64px (marketplace tile size) and 512×512px (hero).

Concept: five stacked horizontal bars (short-to-tall or staircase) representing the 5 layers, monochrome + one accent color. Matches "harness builds the ladder" metaphor from the article tagline.

**Acceptance:** valid SVG, renders at 64×64 and 512×512, MIT-licensed (declare in README + LICENSE coverage).

### 3j.3 — Self-hosted Claude Code marketplace

**File (new):** `marketplace.json` at repo root

Per [Anthropic's marketplace spec](https://code.claude.com/docs/en/plugin-marketplaces):

```json
{
  "name": "harness-designing",
  "display_name": "Harness Designing Plugin",
  "description": "A design-focused AI harness. 4 skills for assembling the scattered AI setup your team already has into a five-layer harness.",
  "author": "Bill Guo",
  "plugins": [
    {
      "name": "design-harness",
      "source": ".",
      "description": "Design-focused AI harness for design teams."
    }
  ]
}
```

Users install immediately with:

```bash
/plugin marketplace add BilLogic/harness-designing-plugin
/plugin install design-harness
```

**Update README Installation section** to mention this fast-path before the local-dev fallback.

**Acceptance:** `/plugin marketplace add BilLogic/harness-designing-plugin` in a fresh Claude Code session discovers the marketplace; `/plugin install design-harness` completes successfully.

### 3j.4 — Submission packets

Three pre-filled packets of text to paste into each platform's submission form. Written to `docs/submissions/` (new directory) — one file per platform.

**Files (new):**
- `docs/submissions/anthropic-submission.md` — paste into [clau.de/plugin-directory-submission](https://clau.de/plugin-directory-submission)
- `docs/submissions/cursor-submission.md` — paste into [cursor.com/marketplace/publish](https://cursor.com/marketplace/publish)
- `docs/submissions/codex-submission.md` — hold until Codex directory opens; prep the text now

Each packet: plugin name + URL + 1-line description + long description + keywords + author + repo + logo URL + license + category + screenshots/examples (if any).

**Acceptance:** Bill can copy-paste each packet into the corresponding form without edits.

### 3j.5 — Actual submission

- **Anthropic:** Bill (or I, if computer-use is granted) submits via clau.de form
- **Cursor:** Bill (or I, with Chrome MCP) submits via cursor.com/marketplace/publish
- **Codex:** monitor the [OpenAI Codex changelog](https://developers.openai.com/codex/changelog) for directory-open announcement; submit when live

Default: I prepare packets; Bill submits manually. Can escalate to computer-use if he grants access.

## Implementation order

1. **3j.1 manifest polish** (low-risk, unblocks 3j.3/3j.4)
2. **3j.2 logo** (independent; can run parallel with 3j.1)
3. **3j.3 marketplace.json** (depends on 3j.1 + 3j.2 for logo reference)
4. **3j.4 submission packets** (depends on 3j.1 + 3j.2 + 3j.3 content)
5. **3j.5 actually submit** (depends on 3j.4; requires Bill or computer-use grant)

## Verification

- [ ] All 3 manifests valid JSON, consistent name/version
- [ ] Logo renders at 64×64 and 512×512
- [ ] `marketplace.json` parses
- [ ] README Installation section includes `/plugin marketplace add` fast-path
- [ ] `docs/submissions/` has 3 files
- [ ] `/plugin marketplace add BilLogic/harness-designing-plugin` discovers us in a fresh Claude Code session (manual test)
- [ ] No `docs/solutions/` writes (compound namespace)
- [ ] CHANGELOG Unreleased section documents Phase 3j

## Sources

- [Claude Code plugin marketplaces](https://code.claude.com/docs/en/plugin-marketplaces)
- [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official)
- [Anthropic plugin directory submission form](https://clau.de/plugin-directory-submission)
- [Cursor plugins reference (building)](https://cursor.com/docs/plugins/building)
- [Cursor marketplace publish](https://cursor.com/marketplace/publish)
- [OpenAI Codex — Build plugins](https://developers.openai.com/codex/plugins/build)
