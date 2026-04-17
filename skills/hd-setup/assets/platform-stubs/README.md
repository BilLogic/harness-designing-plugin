# Platform stubs (scattered → SSoT consolidation)

Thin redirect templates written to a user's repo when `/hd:setup` detects scattered AI-tool configurations (`.cursor/rules/`, `.windsurf/rules/`, `.github/copilot-instructions.md`, etc.). The goal: consolidate to `AGENTS.md` at repo root as single source of truth, with platform-specific stubs just pointing back.

## Templates shipped

| Template | Written to | Consumed by |
|---|---|---|
| `CLAUDE.md.template` | `./CLAUDE.md` | Claude Code (native `@AGENTS.md` redirect) |
| `cursor-rules-AGENTS.mdc.template` | `.cursor/rules/AGENTS.mdc` | Cursor IDE |
| `windsurf-rules-agent.md.template` | `.windsurf/rules/agent.md` | Windsurf |
| `copilot-instructions.md.template` | `.github/copilot-instructions.md` | GitHub Copilot |

## When `/hd:setup` writes these

**Scattered mode** (signal: `has_ai_docs: true` + multiple platform files detected). The skill:
1. Surfaces the detected scatter to user
2. Proposes consolidating via `AGENTS.md` + per-platform thin redirects
3. On confirmation, writes consolidated `AGENTS.md` and replaces per-platform files with these stubs
4. Shows diff preview before any write (F4 safety)

## When the skill does NOT write these

- **Greenfield mode** — no existing platform files to redirect from; `AGENTS.md` is the only file scaffolded
- **Advanced mode** — user already has a harness; skill walks layer-by-layer with link/critique options; never re-scaffolds stubs
- **User declined** at the "consolidate?" prompt

## See also

- [../../references/good-agents-md-patterns.md](../../references/good-agents-md-patterns.md) — healthy AGENTS.md shape
- [../../references/coexistence-checklist.md](../../references/coexistence-checklist.md) — cross-tool coexistence rules
