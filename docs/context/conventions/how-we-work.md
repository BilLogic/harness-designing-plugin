# How we work — `design-harnessing-plugin`

Tier 2 context. Repo-level conventions for authoring + shipping this plug-in.

## Commits

Format: `<type>(<scope>): description`

**Types:**
- `feat` — new skill, new reference, new workflow
- `fix` — fixing a skill compliance violation, broken link, bad frontmatter
- `refactor` — structure change without behavior change (for example, flattening)
- `docs` — meta-harness updates, README, PRD
- `chore` — dependency bumps, CHANGELOG-only changes

**Scope:** the skill name (`hd-learn`, `hd-setup`) or a plug-in-level concern (`manifests`, `agents`, `docs`).

**Examples from this repo's history:**
- `refactor: flatten repo to single-plug-in structure (Phase 1)`
- `feat(hd-learn): implement v0.MVP learn skill (Phase 2a)`
- `feat(hd-setup): implement v0.MVP setup skill (Phase 2b)`

End commits with:
```
Co-Authored-By: Claude <claude-version> <noreply@anthropic.com>
```

## Branch discipline

- **Never push to `main`.** Feature branches only.
- **Work on `claude/<slug>`** or `feat/<slug>` / `fix/<slug>` / `refactor/<slug>`
- **PR template:** summary + test plan (empty if docs-only) + dogfood-links (which lessons this generated, if any)
- **No force-push to shared branches**

## Phase commits

Large changes follow the three-phase pattern (see implementation plans in `docs/plans/`):

1. Phase 1 — structural refactor (moves, deletions; no content changes)
2. Phase 2 — content build (new files, skill implementations)
3. Phase 3 — meta-harness + verification + finalize

One commit per phase. Never interleave a Phase 1 move with a Phase 2 content write — makes rollback harder.

## Review

Self-review checklist before PR:

1. `AGENTS.md` Skill compliance checklist passes for every touched skill
2. Tier 1 budget: `wc -l AGENTS.md docs/context/product/one-pager.md` → total ≤200
3. All three manifests (`.claude-plugin/`, `.codex-plugin/`, `.cursor-plugin/`) aligned on name + version + description
4. No writes to `docs/solutions/` (compound's namespace)
5. New lessons dated; frontmatter valid YAML
6. CHANGELOG updated under `[Unreleased]` (move to versioned section only at release)

If `/ce:review` or `/hd:review` is available in the session, run them before human review.

## Dogfood

Every significant learning during plug-in development → new lesson in `docs/knowledge/lessons/`. When 3+ lessons converge on same pattern → promote to `AGENTS.md` rule (see [../../knowledge/changelog.md](../../knowledge/changelog.md) for the adoption log).

This is the plug-in's self-referential proof point: if the plug-in authors won't dogfood it, nobody else will either.

## Release discipline

- **No manual version bumps** in `.claude-plugin/plugin.json` (automated release process; user initiates with explicit command)
- **No manual release entries** in `CHANGELOG.md` (auto-generated on release)
- `[Unreleased]` section is OK to edit — accumulates changes between releases

## See also

- [../design-system/cheat-sheet.md](../design-system/cheat-sheet.md) — file conventions
- [../../../AGENTS.md](../../../AGENTS.md) — root conventions
- [../../plans/](../../plans/) — active implementation plans
