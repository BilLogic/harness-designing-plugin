# Graduations log — `design-harnessing-plugin`

Meta-log of Layer 5 lessons that graduated to [AGENTS.md](../../AGENTS.md) rules.

## Format

Each entry: date title + rule verbatim + source lesson + occurrences + proposer + approver.

## Entries

<!-- Add new graduations above this line, most recent first. -->

## 2026-04-16 — No future-version stubs with disable-model-invocation

**Rule (now in AGENTS.md):** *"Don't ship future-version skill stubs with `disable-model-invocation: true` at current version. Wait to author the skill when it's being built."*

**Source lesson:** [lessons/2026-04-16-no-future-version-stubs.md](lessons/2026-04-16-no-future-version-stubs.md)

**Occurrences before graduation:**
- `/ce:review` pattern-recognition-specialist flagged dangling links to v0.5 stub files
- `/ce:review` code-simplicity-reviewer flagged stubs as "worse than absent" — fake trigger text + `disable-model-invocation: true` forecloses design space
- `/ce:review` agent-native-reviewer flagged `disable-model-invocation: true` on stubs as pre-foreclosing programmatic use

Three independent reviewer agents converged on the same diagnosis in one review pass → clean imperative emerged: **no stubs with that flag at current version**.

**Proposer:** Claude (via `/ce:review` synthesis 2026-04-16)

**Approved by:** Bill, session 2026-04-16 — explicit approval to cut `hd-compound/SKILL.md` and `hd-review/SKILL.md` stubs from v0.MVP; author real versions at v0.5 and v1 respectively.

---

**Note:** The source lesson file remains in `lessons/` after graduation — history is sacred. Don't edit or delete it. If the rule needs revision later, *counter-graduation* adds a new lesson + new rule; the original stays.
