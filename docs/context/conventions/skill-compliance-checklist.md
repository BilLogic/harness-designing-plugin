# Skill compliance checklist

**Loaded when:** authoring or auditing any skill in this plug-in. Tier 2 reference (not loaded every task; read during contribution).


Verify before committing any skill:

### YAML frontmatter (required)

- [ ] `name:` matches directory name; `hd:verb` form for slash-command skills
- [ ] `description:` present; **what + when** format; third person; ≤ 180 chars preferred (≤ 1024 hard)
- [ ] `argument-hint:` (if present) quotes YAML special chars (compound 2.36.0 fix)
- [ ] `disable-model-invocation: true` ONLY if genuinely manual-only (default: omit)

### Reference links (required if `references/` exists)

- [ ] Linked as `[filename.md](references/filename.md)` — never bare backticks
- [ ] One level deep only (no `references/foo/bar.md`)
- [ ] Linked contextually where topics arise (not in a closing dump)

### Structure budget

- [ ] SKILL.md body ≤ 200 lines for routers (≤ 500 hard Anthropic limit)
- [ ] Overflow content → `references/`
- [ ] Scripts invoked by path, not markdown-linked

### Writing style (Anthropic best practices)

- [ ] Imperative/infinitive form (verb-first): "Scan the repo" not "You should scan"
- [ ] Third-person descriptions
- [ ] Concise — assume Claude already knows common concepts
- [ ] No time-sensitive statements ("as of 2026…"); use "old patterns" section instead
- [ ] Consistent terminology throughout (one term per concept)

### Markdown lint

- [ ] No unclosed code fences
- [ ] No unbalanced quotes
- [ ] Forward slashes only (no Windows paths)

### Coexistence

- [ ] Skill does NOT write to `docs/solutions/` (compound's namespace)
- [ ] Skill does NOT read `compound-engineering.local.md` as its config
- [ ] No "rivalry" language in output (no vs./conflict/incompatible with compound)
- [ ] Cross-plug-in Task calls use fully-qualified names

