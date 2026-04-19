# Codex CLI plugin directory — submission packet (HOLDING)

**Status:** OpenAI's official Codex plugin directory is **"coming soon"** per [developers.openai.com/codex/plugins/build](https://developers.openai.com/codex/plugins/build). Self-serve publishing not yet open.

## Interim distribution

Self-hosted via `marketplace.json` + user-level install. Users can add:

```bash
# In ~/.agents/plugins/marketplace.json OR $REPO_ROOT/.agents/plugins/marketplace.json
{
  "plugins": [
    {
      "name": "design-harness",
      "source": "git+https://github.com/BilLogic/harness-designing-plugin"
    }
  ]
}
```

Or directly via `codex plugins add` once the CLI supports git-URL installs.

## Packet (ready to submit when directory opens)

### Plugin name
```
design-harness
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
1.0.0
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
design, design-harness, design-systems, context-engineering, knowledge-management, ai-workflows, rubrics
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
  "capabilities": ["scaffold", "explain", "audit"]
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
