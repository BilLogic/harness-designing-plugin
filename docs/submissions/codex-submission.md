# Codex CLI plugin directory — submission packet (HOLDING)

**Status:** OpenAI's official Codex plugin directory is **"coming soon"** per [developers.openai.com/codex/plugins/build](https://developers.openai.com/codex/plugins/build). Self-serve publishing not yet open. Verified 2026-04-25 — directory text reads: *"Adding plugins to the official Plugin Directory is coming soon"* + *"Self-serve plugin publishing and management are coming soon."*

**Action:** packet kept current with each release (slug + version + capability list mirror v3.0.0). Submit immediately when self-serve publishing lands.

**Monitoring:** check developers.openai.com/codex/plugins/build monthly; the `Publish your plugin` section appearing is the trigger.

## Interim distribution

Self-hosted via `marketplace.json` + user-level install. Users can add:

```bash
# In ~/.agents/plugins/marketplace.json OR $REPO_ROOT/.agents/plugins/marketplace.json
{
  "plugins": [
    {
      "name": "harness-designing",
      "source": "git+https://github.com/BilLogic/harness-designing-plugin"
    }
  ]
}
```

Or directly via `codex plugins add` once the CLI supports git-URL installs.

## Packet (ready to submit when directory opens)

### Plugin name
```
harness-designing
```

### Display name
```
Harness Designing Plugin
```

### Short description
```
A design-focused AI harness. Four skills for assembling the scattered AI setup your design team already has into a five-layer harness.
```

### Long description
Same as Cursor/Anthropic packet — copy from either when submitting.

### Version
```
1.1.0
```

### Repository
```
https://github.com/BilLogic/harness-designing-plugin
```

### Homepage
```
https://github.com/BilLogic/harness-designing-plugin
```

### Keywords
```
design, harness-designing, design-systems, context-engineering, knowledge-management, ai-workflows, rubrics
```

### Logo
`./assets/logo.svg`

### Author
```
Bill Guo
```

### License
```
MIT
```

### Codex-specific manifest fields (already in `.codex-plugin/plugin.json`)

```json
{
  "skills": "./skills",
  "category": "design",
  "capabilities": ["scaffold", "explain", "review"]
}
```

### Category
```
design
```

## Monitoring for directory open

Watch:
- https://developers.openai.com/codex/changelog
- https://github.com/openai/codex/releases
- https://github.com/openai/codex/blob/main/docs/plugins/publishing.md (when it exists)

## Additional links

- README: https://github.com/BilLogic/harness-designing-plugin/blob/main/README.md
- Codex manifest: https://github.com/BilLogic/harness-designing-plugin/blob/main/.codex-plugin/plugin.json
- AGENTS.md: https://github.com/BilLogic/harness-designing-plugin/blob/main/AGENTS.md
