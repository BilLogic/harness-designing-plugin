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
- /hd:setup — detects existing harness artifacts, pre-analyzes all five layers in parallel, and walks you through link / critique / scaffold / skip per layer
- /hd:maintain — captures lessons and promotes them to team rules with SHA-256 plan-hash proof-of-consent
- /hd:review — audits harness health in a 2-batch parallel dispatch (5 layer-specialist agents + 2-3 context agents); critiques harness artifacts against quality rubrics

Ships 9 sub-agents and 14 starter rubrics (distilled from pbakaus/impeccable, Nielsen's 10 heuristics, Material 3, Fluent 2). Each rubric carries a Scope & Grounding section with personas, user stories, realistic scenarios, and anti-scenarios. Validated across a six-repo pilot matrix.

This plug-in is the companion toolkit to Bill Guo's Substack series on design harnessing. Structural inspiration: EveryInc/compound-engineering-plugin.
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
1.0.0
```

## Plugin self-host URL (for users to add before official review lands)

```
/plugin marketplace add BilLogic/harness-designing-plugin
/plugin install design-harness
```

## Additional notes (if the form has an open text field)

- Validated across six-repo pilot matrix: figma/sds, plus-marketing-website, caricature, oracle-chat, lightning, plus-uno.
- All four SKILL.md files ≤200 lines (compound-engineering v2.39.0 style invariant).
- `<protected_artifacts>` block declared in `hd-review` so `/ce:review` never flags our outputs.
- No cross-plugin Task invocations — we stay entirely within `design-harnessing:<category>:<agent>` namespace and respect compound-engineering's `/ce:*` / `docs/solutions/` / `compound-engineering.local.md` namespace.
- Phases 3e–3j shipped 2026-04-18.

## Links to pass the reviewer

- README: https://github.com/BilLogic/harness-designing-plugin/blob/main/README.md
- AGENTS.md: https://github.com/BilLogic/harness-designing-plugin/blob/main/AGENTS.md
- Marketplace manifest: https://github.com/BilLogic/harness-designing-plugin/blob/main/marketplace.json
- Claude Code plugin manifest: https://github.com/BilLogic/harness-designing-plugin/blob/main/.claude-plugin/plugin.json
- Example skill: https://github.com/BilLogic/harness-designing-plugin/blob/main/skills/hd-setup/SKILL.md
- Example agent: https://github.com/BilLogic/harness-designing-plugin/blob/main/agents/analysis/harness-auditor.md
- CHANGELOG: https://github.com/BilLogic/harness-designing-plugin/blob/main/CHANGELOG.md
