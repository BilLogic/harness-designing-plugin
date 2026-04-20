# Anthropic Claude Code plugin directory — submission packet

**Form:** https://clau.de/plugin-directory-submission

## Pre-filled content (copy-paste into form fields)

### Plugin name
```
Harness Designing Plugin
```

### Plugin slug / package name
```
design-harness
```

### Short description (1 line, ~160 chars)
```
A design-focused AI harness. Four skills for assembling the scattered AI setup your design team already has into a five-layer harness.
```

### Long description (paragraph)
```
Harness Designing Plugin helps design teams turn their scattered AI setup — Notion prompts, Figma comments, AGENTS.md rules, chat histories — into a five-layer design harness that compounds across sessions and rotations. Four skills walk you through the assembly:

- /hd:learn — Q&A about the five-layer concept (Context, Skills, Orchestration, Rubrics, Knowledge)
- /hd:setup — detects existing harness artifacts, pre-analyzes all five layers in parallel, and walks you through link / review / scaffold / skip per layer with a preview-before-write gate
- /hd:maintain — captures lessons and promotes them to team rules with SHA-256 plan-hash proof-of-consent
- /hd:review — full review across all 5 layers OR targeted review of one layer / file / rubric. Writes a dated report to docs/knowledge/reviews/ and emits a rich chat summary with ASCII health bars, priorities table, Proposed revision file-tree diff, and Staleness check (flags when the same findings recur across reviews). Pairs with /hd:setup --from-review <path> to apply findings as concrete writes.

Host-agnostic by construction: inline serial execution is the baseline; parallel sub-agent dispatch is an optional speed-up for hosts that support it (Claude Task, Codex /agent, Cursor subagents API). Same output on every host.

Ships 9 sub-agents and 14 starter rubrics (distilled from pbakaus/impeccable, Nielsen's 10 heuristics, Material 3, Fluent 2). Each rubric carries a Scope & Grounding section with personas, user stories, realistic scenarios, and anti-scenarios. Validated across 10 repos (6-repo pilot matrix + 4 Phase 3k-3m test repos).

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
design, design-harness, design-systems, context-engineering, knowledge-management, ai-workflows, rubrics, design-review, harness-engineering, agentic-design
```

### Logo
File: `assets/logo.svg` in the repository root. Already referenced from `.claude-plugin/plugin.json` indirectly via the sibling manifests.

### Category
```
Design / Productivity
```

### Version
```
1.1.0
```

## Plugin self-host URL (for users to add before official review lands)

```
/plugin marketplace add BilLogic/harness-designing-plugin
/plugin install design-harness
```

## Additional notes (if the form has an open text field)

- Validated across 10 repos total: 6-repo pilot matrix (figma/sds, plus-marketing-website, caricature, oracle-chat, lightning, plus-uno) + 4 Phase 3k–3m test repos (cornerstone, Dawnova, compound-designing, plus-vibe-coding-starting-kit).
- All four SKILL.md files ≤200 lines.
- `<protected_artifacts>` block declared in `hd-review` so external review/cleanup tools leave our outputs alone.
- No cross-plugin Task invocations — we stay entirely within the `design-harnessing:<category>:<agent>` namespace and respect other tools' namespaces (`docs/solutions/`, foreign config files, foreign command prefixes).
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
