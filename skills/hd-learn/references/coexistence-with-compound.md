# Coexistence with compound-engineering

This plug-in runs alongside [EveryInc/compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin) without namespace collisions. Both can be installed simultaneously, and neither touches the other's state.

## Positioning

Every built the engineering version. We're building the design version. **Same move** (codify practice so it compounds). **Different domain** (design, not engineering). **Different organizing frame** (five-layer noun stack vs. compound loop).

- Compound's Plan → Work → Review → Compound loop is *verbs operating on code*.
- Our five layers (Context, Skills, Orchestration, Rubrics, Knowledge) are *nouns* that verbs operate on.

Both are valid organizing moves. Teams running both get the union of benefits.

## Namespace isolation (hard rules)

| Compound's | Ours | Why |
|---|---|---|
| `/ce:*` commands | `/hd:*` commands | Two-letter namespaces; unclaimed in 2026 registry |
| `docs/solutions/` | `docs/design-solutions/` (v0.5+) | Prevents `ce-compound-refresh` from rewriting our entries |
| `compound-engineering.local.md` | `hd-config.md` | Separate config files; no shared state |
| `ce-*` skill prefix | `hd-*` skill prefix | Distinct, no collisions |

## One-way relationship — we stay in our own namespace

We do **not** invoke any `compound-engineering:*` Task from our skills or agents. Our Task calls are always fully-qualified within our own namespace:

```
Task design-harnessing:<category>:<agent-name>(...)
```

Never bare names — compound's 2.35.0 changelog documents the re-prefixing collision that causes. Bill's plug-in borrows compound's structural patterns; it does not reach into compound's Task namespace at runtime.

## Protected artifacts

At v1, `hd:review`'s SKILL.md will declare a `<protected_artifacts>` block listing all our output paths:

```yaml
<protected_artifacts>
- docs/design-solutions/**
- docs/knowledge/**
- docs/context/**
- AGENTS.md
- hd-config.md
- skills/**
</protected_artifacts>
```

This prevents `/ce:review` from flagging or modifying our outputs when both are run on the same repo.

## What we borrowed

This plug-in's *structure* mirrors compound's verbatim where it makes sense:

- `.claude-plugin/plugin.json` manifest format
- SKILL.md router pattern with `name: hd:verb` exposing as `/hd:verb`
- `references/` / `templates/` / `scripts/` skill subdir convention
- Keep-a-changelog CHANGELOG format
- `AGENTS.md` as canonical contributor doc

## What we diverged on

- **Domain vocabulary** — no PRs, tests, worktrees. Design lexicon only: mockup, rubric, review, critique, variant, accessibility, rules.
- **Command-first onboarding** — compound's entry is `/ce:brainstorm`. Ours is *structural*: `/hd:learn` shows the layered `docs/` FIRST, then invites a command. Layout is the thesis.
- **Multi-provider support** — compound ships a TypeScript converter for 11+ providers. We ship sibling manifests (`.claude-plugin/`, `.codex-plugin/`, `.cursor-plugin/`) — same SKILL.md tree serves all three.

## See also

- [concept-overview.md](concept-overview.md) — our five-layer frame
- [AGENTS.md § Coexistence](../../../AGENTS.md#coexistence-with-compound-engineering) — contributor-facing rules
- Compound installed locally at `/Users/billguo/.claude/plugins/cache/compound-engineering-plugin/` (read their AGENTS.md for their side of the contract)
