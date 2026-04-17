# Coexistence checklist

**Purpose:** enforce compound-engineering collision-avoidance rules during `hd:setup` scaffolding. Shared across all scaffolding decisions that write to paths potentially shared with another plug-in.

## When this applies

Run the coexistence overlay when `~/.claude/plugins/cache/compound-engineering-plugin/` is detected (meaning user has compound-engineering installed alongside). `detect-mode.sh` sets `coexistence.compound_engineering: true` in its JSON output; `hd:setup` SKILL.md dispatches this checklist when that flag is set.

## Hard rules

| Compound's | Ours | Check |
|---|---|---|
| `/ce:*` commands | `/hd:*` commands | All our skill `name:` frontmatter fields start with `hd:`; never bare |
| `docs/solutions/` | `docs/design-solutions/` | We NEVER write to `docs/solutions/`; `hd:compound` (v0.5) writes to `docs/design-solutions/` |
| `compound-engineering.local.md` | `design-harnessing.local.md` | We create/read ONLY `design-harnessing.local.md`; leave theirs alone |
| `ce-*` skill prefix | `hd-*` skill prefix | All our skill dirs are `hd-*` |

## Pre-scaffold check

Before writing any files during `hd:setup`, confirm:

```bash
# Check: no write targets overlap compound's namespace
for target in docs/solutions compound-engineering.local.md; do
  [ -e "$target" ] && echo "DETECTED (ours is different): $target is compound's; we use a different path"
done
```

## Post-scaffold verification

After `hd:setup` writes files, verify coexistence held:

```bash
# No writes to compound namespace
find docs/solutions -newer AGENTS.md 2>/dev/null && echo "FAIL: wrote to compound's namespace"

# We own our namespace
[ -f design-harnessing.local.md ] && echo "PASS: design-harnessing.local.md exists"
[ ! -f compound-engineering.local.md ] || echo "OK: compound's config untouched"
```

## Cross-plug-in invocation rules

When OUR skills invoke compound's agents (starts at v1 `hd:review`), always use fully-qualified Task names:

- **Correct:** `Task compound-engineering:research:learnings-researcher(...)`
- **Wrong:** `Task learnings-researcher(...)` — gets re-prefixed with our namespace, fails silently

Reference: compound CHANGELOG 2.35.0.

## Output language discipline

No "rivalry" wording in skill output:

- **Bad:** "This conflicts with compound." / "Don't use ce:review alongside."
- **Good:** "Works alongside compound-engineering. See `coexistence-with-compound.md` for isolation rules."

`hd:onboard` reinforces the message; `hd:setup` shouldn't repeat it adversarially.

## User-facing confirmation message

During setup, when compound is detected, surface this once:

> Detected `compound-engineering` plug-in installed. This plug-in runs alongside compound without namespace fights — `/hd:*` vs `/ce:*`, `docs/design-solutions/` vs `docs/solutions/`, `design-harnessing.local.md` vs `compound-engineering.local.md`. No conflict expected.

Keep the message neutral. User picks whether to run both long-term; our job is just to not break their setup.

## Protected-artifacts declaration (v1 hd:review)

When `hd:review` ships at v1, its SKILL.md declares a `<protected_artifacts>` block listing our output paths so compound's `/ce:review` doesn't modify them:

```yaml
<protected_artifacts>
- docs/design-solutions/**
- docs/knowledge/**
- docs/context/**
- AGENTS.md
- design-harnessing.local.md
- skills/**
</protected_artifacts>
```

This is NOT declared at v0.MVP (we don't have `hd:review` yet) — but v0.MVP AGENTS.md notes the future commitment.

## See also

- [local-md-schema.md](local-md-schema.md) — `design-harnessing.local.md` format
- [good-agents-md-patterns.md](good-agents-md-patterns.md) — coexistence section in healthy AGENTS.md
- [../../hd-onboard/references/coexistence-with-compound.md](../../hd-onboard/references/coexistence-with-compound.md) — user-facing Q&A version
