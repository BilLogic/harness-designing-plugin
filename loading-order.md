# Always-loaded contract (Tier 1)

Files listed under "Always loaded" are counted against the Tier 1 budget by `skills/hd-review/scripts/budget-check.sh`. Tier 1 is the content loaded on every AI task.

**Budget:** 200 lines.

## Always loaded

- `AGENTS.md`
- `docs/context/product/one-pager.md`

## Rationale

The default Tier 1 set assumes a user-repo shape with a visual components cheat-sheet. This plug-in repo has no such file. Our cheat-sheet under design-system covers file-naming + SKILL.md structure + markdown-lint conventions (loaded on demand during authoring work, not always-loaded). This contract overrides the default so budget-check reports the real always-loaded total.

Everything else under docs/context/ loads on demand when the relevant skill or agent fires.
