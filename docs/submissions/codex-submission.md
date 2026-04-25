# Codex Plugin Directory — submission packet (HOLDING)

**Status:** OpenAI's official Codex Plugin Directory is **"coming soon"** per [developers.openai.com/codex/plugins/build](https://developers.openai.com/codex/plugins/build). Self-serve publishing is not open yet. Verified 2026-04-25 — the docs say: *"Adding plugins to the official Plugin Directory is coming soon"* and *"Self-serve plugin publishing and management are coming soon."*

**Action:** packet kept current with each release (slug + version + capability list mirror v3.0.0). Submit immediately when self-serve publishing lands.

**Monitoring:** check developers.openai.com/codex/plugins/build monthly; the `Publish your plugin` section appearing is the trigger.

## Interim distribution (clone-install)

The plug-in package ships [`.codex-plugin/plugin.json`](../../.codex-plugin/plugin.json) — the canonical manifest. While the official Codex Plugin Directory is closed, users self-host via a user-level marketplace catalog pointing at a clone of this repo.

**Step 1.** Clone the repo to a stable location:

```bash
git clone https://github.com/BilLogic/harness-designing-plugin ~/plugins/harness-designing
```

**Step 2.** Add an entry to `~/.agents/plugins/marketplace.json` (or a repo-level catalog at `$REPO_ROOT/.agents/plugins/marketplace.json`):

```json
{
  "plugins": [
    {
      "name": "harness-designing",
      "source": {
        "source": "local",
        "path": "~/plugins/harness-designing"
      }
    }
  ]
}
```

The `path` resolves from the marketplace catalog's location, so use an absolute path (or a path relative to wherever the catalog file lives) — never `./`. If you keep multiple plug-ins under `~/plugins/`, your catalog can list them as siblings.

**Step 3.** Install via Codex's TUI (`/plugins`) or the CLI once `codex plugins add` supports git-URL installs.

**Updates:** `cd ~/plugins/harness-designing && git pull` — the marketplace entry follows the clone.

## Packet (ready to submit when directory opens)

### Plugin name
```
harness-designing
```

### Display name
```
Design Harness
```

### Short description
```
A design-focused AI harness. Four skills for assembling the scattered AI setup your design team already has into a five-layer harness.
```

### Long description
Same as Cursor/Anthropic packet — copy from either when submitting.

### Version
```
3.0.0
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
`./assets/logo.png`

### Author
```
Bill Guo
```

### License
```
MIT
```

### Codex-specific manifest

[`.codex-plugin/plugin.json`](../../.codex-plugin/plugin.json) is the single source of truth for Codex-specific fields (skills path, MCP servers ref, interface metadata, capabilities). Don't duplicate those fields here — submission-time, point the reviewer at the manifest file directly to avoid drift between this packet and what actually ships.

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
