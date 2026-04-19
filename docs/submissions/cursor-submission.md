# Cursor marketplace — submission packet

**Form:** https://cursor.com/marketplace/publish

## Pre-filled content

### Plugin name (lowercase kebab-case, per Cursor schema)
```
design-harness
```

### Display name
```
Harness Designing Plugin
```

### Short description (1 line, ~160 chars)
```
A design-focused AI harness. Four skills for assembling the scattered AI setup your design team already has into a five-layer harness.
```

### Long description (paragraph — for marketplace listing)
```
Harness Designing Plugin helps design teams turn their scattered AI setup into a five-layer design harness that compounds across sessions and team rotations.

Four skills:
• /hd:learn — Q&A about the five-layer concept
• /hd:setup — detects existing harness, pre-analyzes all five layers in parallel, walks through link / critique / scaffold / skip
• /hd:maintain — captures lessons and promotes them to team rules with SHA-256 plan-hash proof-of-consent
• /hd:review — audits harness health in parallel; critiques harness artifacts against quality rubrics

Ships 9 sub-agents and 14 starter rubrics (pbakaus/impeccable, Nielsen's 10 heuristics, Material 3, Fluent 2). Each rubric carries a Scope & Grounding section (personas, user stories, scenarios, anti-scenarios).

Validated across a six-repo pilot matrix. Companion toolkit to Bill Guo's Substack series on design harnessing.
```

### Version
```
1.0.0
```

### Repository URL
```
https://github.com/BilLogic/harness-designing-plugin
```

### Homepage URL
```
https://github.com/BilLogic/harness-designing-plugin
```

### Keywords
```
design, design-harness, design-systems, context-engineering, knowledge-management, ai-workflows, rubrics
```

### Logo
File: `assets/logo.svg` (relative repo path)

### Author
```
Bill Guo
```

### License
```
MIT
```

### Plugin components (Cursor schema)

Detected from plug-in structure:
- `skills/` — 4 SKILL.md files (hd-learn, hd-setup, hd-maintain, hd-review)
- `agents/` — 9 sub-agent files across 3 categories (analysis/, research/, review/)
- No `rules/` directory (we use AGENTS.md at repo root for conventions)
- No `mcp.json` (no bundled MCP servers)
- No `hooks/` (no automation scripts required for the plug-in itself)
- No `commands/` (commands are skills via `name: hd:*` frontmatter)

### Category
```
Design
```

### Supported platforms
- Cursor (primary via `.cursor-plugin/plugin.json`)
- Claude Code (via `.claude-plugin/plugin.json`)
- Codex CLI (via `.codex-plugin/plugin.json`)

Three sibling manifests ship from the same repo.

## Cursor-specific checklist (per cursor.com/docs/plugins/building)

- [x] Valid `.cursor-plugin/plugin.json` manifest
- [x] Unique kebab-case name (`design-harness`)
- [x] Clear description
- [x] Complete frontmatter metadata on all SKILL.md files (verified by budget-check.sh)
- [x] Relative paths (no absolute)
- [x] Local testing: skills reload cleanly in Cursor 2.5+

## Additional links

- README: https://github.com/BilLogic/harness-designing-plugin/blob/main/README.md
- Cursor manifest: https://github.com/BilLogic/harness-designing-plugin/blob/main/.cursor-plugin/plugin.json
- AGENTS.md: https://github.com/BilLogic/harness-designing-plugin/blob/main/AGENTS.md
- CHANGELOG: https://github.com/BilLogic/harness-designing-plugin/blob/main/CHANGELOG.md
