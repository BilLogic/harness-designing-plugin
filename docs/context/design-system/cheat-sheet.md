# design-harness — file & content conventions

This plug-in has no UI — our "design system" is file and content conventions. Tier 2 context — loaded when authoring or editing plug-in files.

## File naming

- **Skills:** `skills/hd-<verb>/SKILL.md` — `hd-` prefix, verb name, kebab-case
- **References:** `skills/<skill>/references/<topic>.md` — one topic per file, one level deep only
- **Workflows:** `skills/<skill>/workflows/<procedure>.md` — verb-first name
- **Templates:** `skills/<skill>/templates/<name>.template` or `.md.template` — `.template` suffix is grep-able
- **Scripts:** `skills/<skill>/scripts/<verb>.sh` — executable (`chmod +x`); bash 3.2+ compatible
- **Plan files:** `docs/plans/YYYY-MM-DD-NNN-<type>-<slug>-plan.md` — 3-digit daily sequence (compound 2.37.1 convention)
- **Lesson files:** `docs/knowledge/lessons/YYYY-MM-DD-<slug>.md` — no sequence suffix (one per day typical)

## SKILL.md structure

Every SKILL.md follows this outline:

1. YAML frontmatter: `name`, `description` (≤180 chars, third-person, what + when), optional `argument-hint`, optional `disable-model-invocation` (only if genuinely manual)
2. Top-level `# Title — short description`
3. `## Interaction method` — 5-line AskUserQuestion fallback preamble
4. `## What this skill does` — single job, 1-3 sentences
5. `## Workflow` or `## Workflow checklist` — copy-into-response format for multi-step work
6. `## What this skill does NOT do` — explicit non-scope + handoffs to other skills
7. `## Reference files` — closing index (may also appear inline in the body; both are acceptable)

Target: ≤200 lines for routers. Overflow → `references/`.

## Reference link syntax

**Correct:** `[filename.md](references/filename.md)` — one level deep only.

**Wrong:** bare backticks `` `references/filename.md` `` (Claude won't auto-load these per compound convention).

**Exception:** scripts are called by path, not markdown-linked. Example: `` `scripts/detect-mode.sh` `` as inline code is fine (scripts execute, aren't read as references).

## Frontmatter discipline

- `name:` — matches directory name; use `hd:verb` form for commands
- `description:` — third person ("Scaffolds..."), what + when, ≤180 chars preferred (≤1024 hard limit per Anthropic)
- `argument-hint:` — quote YAML-special characters (compound 2.36.0 fix)
- `disable-model-invocation: true` — only for genuinely manual-only skills (adopted rule: no stubs with this flag)

## Content style

- **Imperative / infinitive:** "Scan the repo," not "You should scan the repo."
- **Third person:** in descriptions and user-facing copy; avoid "I" / "you"
- **Concise:** assume Claude already knows common concepts; don't explain what a PDF is
- **No time-sensitive statements:** "as of 2026..." — use "old patterns" collapsed section instead
- **Consistent terminology:** one term per concept (always "reference," not "ref" / "doc" / "guide" interchangeably)

## Markdown lint

- No unclosed code fences (breaks whole sections silently per compound 2.33.0)
- No unbalanced quotes in YAML frontmatter
- Forward slashes only in paths
- Headings in proper hierarchy (no H1 → H3 skips)

## See also

- [../conventions/how-we-work.md](../conventions/how-we-work.md) — commit/branch/PR conventions
- [../../../AGENTS.md § Skill compliance checklist](../../../AGENTS.md) — enforcement
