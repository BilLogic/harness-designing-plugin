# Anthropic Claude Code plugin directory — submission packet

**Form:** https://clau.de/plugin-directory-submission

## Changes since the v1.0 submission (2026-04-18)

For re-submission / metadata-refresh purposes — the plug-in has shipped 5 minor versions + 1 major since the original packet:

- **v1.1.0** unified `audit/critique` vocabulary into `review`; file-first reporting with `Proposed revision` diffs; `/hd:setup --from-review` bridge; Staleness check; host-agnostic execution
- **v1.2.0** universal tool discovery (`raw_signals.deps`); `ai-integration-scout` classify mode; advisor-not-installer rule graduated
- **v1.3.0** Step 10.5 post-setup health rollup (5-layer ASCII bars + priorities); generic root-md detection (DESIGN.md / CONTRIBUTING.md without filename whitelist); 3p.3 enriched lesson frontmatter
- **v1.4.0** all 3 then-adopted rubrics migrated to YAML-criteria schema; `rubric-applier` legacy parser removed
- **v2.0.0** ⚠️ **BREAKING** — Task namespace renamed `design-harnessing:` → `harness-designing:` to align with marketplace + GitHub slug; `hd-config.md` schema gets a single source of truth at `skills/hd-setup/scripts/schema.json`
- **v2.1.0** 3 new self-targeted rubrics added (`plan-quality`, `lesson-quality`, `agent-spec-quality`); Step 10.5 actionable hand-off (`Next step:` line); `scripts/release.sh` automation; **bundles `context7` MCP** as Connector for library doc lookup (HTTP transport, anonymous tier by default)
- **v3.0.0** ⚠️ **BREAKING** — plug-in slug renamed `design-harness` → `harness-designing` (final alignment: marketplace name = repo name = plug-in slug = Task namespace). Install command becomes `/plugin install harness-designing`. Slash commands `/hd:*` unchanged.

**Counts updated:** 4 skills, **10 sub-agents** (was 9; +1 from `ai-integration-scout`), **17 starter rubrics** (was 14; +3 from Phase 3s), **6 adopted rubrics** in `docs/rubrics/` (was 3).

## Pre-filled content (copy-paste into form fields)

### Plugin name
```
Harness Designing Plugin
```

### Plugin slug / package name
```
harness-designing
```

### Short description (1 line, ~160 chars)
```
A design-focused AI harness. Four skills for assembling the scattered AI setup your design team already has into a five-layer harness.
```

### Long description (paragraph)
```
Harness Designing Plugin helps design teams turn their scattered AI setup — Notion prompts, Figma comments, AGENTS.md rules, chat histories — into a five-layer design harness that compounds across sessions and rotations. Four skills walk you through the assembly:

- /hd:learn — Q&A about the five-layer concept (Context, Skills, Orchestration, Rubrics, Knowledge)
- /hd:setup — detects existing harness artifacts, pre-analyzes all five layers in parallel, and walks you through scaffold / review / create / skip per layer with a preview-before-write gate
- /hd:maintain — captures lessons and promotes them to team rules with SHA-256 plan-hash proof-of-consent
- /hd:review — full review across all 5 layers OR targeted review of one layer / file / rubric. Writes a dated report to docs/knowledge/reviews/ and emits a rich chat summary with ASCII health bars, priorities table, Proposed revision file-tree diff, and Staleness check (flags when the same findings recur across reviews). Pairs with /hd:setup --from-review <path> to apply findings as concrete writes.

Host-agnostic by construction: inline serial execution is the baseline; parallel sub-agent dispatch is an optional speed-up for hosts that support it (Claude Task, Codex /agent, Cursor subagents API). Same output on every host.

Ships 10 sub-agents and 17 starter rubrics on a YAML-criteria schema (distilled from pbakaus/impeccable, Nielsen's 10 heuristics, Material 3, Fluent 2). Each rubric carries a Scope & Grounding section with personas, user stories, realistic scenarios, and anti-scenarios. Bundles `context7` MCP as a Connector for library doc lookup (HTTP transport, anonymous tier by default; users opt into auth via `CONTEXT7_API_KEY` env var). Validated across 10 repos (6-repo pilot matrix + 4 Phase 3k-3m test repos).

This plug-in is the companion toolkit to Bill Guo's Substack series on design harnessing.
```

### Repository URL
```
https://github.com/BilLogic/harness-designing-plugin
```

### Homepage URL
```
https://github.com/BilLogic/harness-designing-plugin
```

### License
```
MIT
```

### Author
```
Bill Guo (@BilLogic)
```

### Keywords / tags
```
design, harness-designing, design-systems, context-engineering, knowledge-management, ai-workflows, rubrics, design-review, harness-engineering, agentic-design
```

### Logo
File: `assets/logo.svg` in the repository root. Already referenced from `.claude-plugin/plugin.json` indirectly via the sibling manifests.

### Category
```
Design / Productivity
```

### Version
```
3.0.0
```

## Plugin self-host URL (for users to add before official review lands)

```
/plugin marketplace add BilLogic/harness-designing-plugin
/plugin install harness-designing
```

## Additional notes (if the form has an open text field)

- Validated across 10 repos total: 6-repo pilot matrix (figma/sds, plus-marketing-website, caricature, oracle-chat, lightning, plus-uno) + 4 Phase 3k–3m test repos (cornerstone, Dawnova, compound-designing, plus-vibe-coding-starting-kit).
- All four SKILL.md files ≤200 lines.
- `<protected_artifacts>` block declared in `hd-review` so external review/cleanup tools leave our outputs alone.
- No cross-plugin Task invocations — we stay entirely within the `harness-designing:<category>:<agent>` namespace and respect other tools' namespaces (`docs/solutions/`, foreign config files, foreign command prefixes).
- v1.0.0 shipped 2026-04-18; v1.1.0 shipped 2026-04-20 (3k/3l/3m iteration, ~25 fixes from live testing).
- GitHub release: https://github.com/BilLogic/harness-designing-plugin/releases/tag/v1.1.0

## Links to pass the reviewer

- README: https://github.com/BilLogic/harness-designing-plugin/blob/main/README.md
- AGENTS.md: https://github.com/BilLogic/harness-designing-plugin/blob/main/AGENTS.md
- Marketplace manifest: https://github.com/BilLogic/harness-designing-plugin/blob/main/marketplace.json
- Claude Code plugin manifest: https://github.com/BilLogic/harness-designing-plugin/blob/main/.claude-plugin/plugin.json
- Example skill: https://github.com/BilLogic/harness-designing-plugin/blob/main/skills/hd-setup/SKILL.md
- Example agent: https://github.com/BilLogic/harness-designing-plugin/blob/main/agents/analysis/harness-auditor.md
- CHANGELOG: https://github.com/BilLogic/harness-designing-plugin/blob/main/CHANGELOG.md
