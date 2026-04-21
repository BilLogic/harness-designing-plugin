---
schema_version: "5"
setup_mode: advanced
setup_date: 2026-04-21
team_size: solo
skipped_layers: []
article_read: true

# External tools detected at setup (v5 schema).
# team_tooling.analytics.metabase is a false positive from README prose mentioning
# metabase as an example analytics tool — not actually in use here. Recording as
# empty to reflect ground truth.
team_tooling:
  docs: []
  design: []
  diagramming: []
  analytics: []
  pm: []
  comms: []
  cli: []
  data_api: []
mcp_servers_at_setup: []

# Per-layer decisions — each row reflects the current state of this plug-in's
# own meta-harness. For L1/L4/L5 the state is "populated"; for L2/L3 the state
# is that the plug-in IS the L2/L3 payload (our own skills + agents are the
# content, not user-scaffolded files under docs/).
layer_decisions:
  - layer: L1
    decision: review
    why: "AGENTS.md + docs/context/ populated; audited 2026-04-21 review (6.2/10 — see review)"
    files_written: []
  - layer: L2
    decision: review
    why: "skills/hd-{learn,setup,maintain,review}/ ARE the Layer 2 payload for this plug-in. No user-facing skills in docs/ — we ship skills rather than consume them"
    files_written: []
  - layer: L3
    decision: review
    why: "agents/{analysis,research,review}/ ARE the Layer 3 payload. 10 sub-agents invoked via Task from our own SKILL.md files. No docs/orchestration/ because orchestration IS the skill-agent dispatch graph we ship"
    files_written: []
  - layer: L4
    decision: review
    why: "3-of-14 starter rubrics adopted per 2026-04-21 policy (skill-quality, ux-writing, heuristic-evaluation). 10 visual rubrics waived, component-budget waived as duplicative with budget-check.sh, i18n-cjk deferred. See AGENTS.md § Rules 2026-04-21"
    files_written: []
  - layer: L5
    decision: review
    why: "docs/knowledge/ populated: 15 lessons, 2 reviews, changelog.md backfilled with 6 rule-adoption events, decisions.md + ideations.md active"
    files_written: []

# Coexistence with other plug-ins / tools detected in this repo.
# compound-engineering is detected via our docs/plans/ prose referencing its patterns —
# we do NOT invoke its Task namespace; we borrow its plug-in structure convention only.
other_tool_harnesses_detected:
  - name: compound-engineering
    type: plugin
    paths_found: ["docs/plans/"]
    owner: external
    policy: respect
    note: "detected via docs/plans/ prose referencing compound's plug-in pattern; no runtime coupling"

files_written: []
---

# design-harness — local config (meta-harness, special case)

Local config for the plug-in's **own meta-harness**. This is the plug-in repo, not a user repo — `/hd:setup` was not run here; the config is authored by hand to reflect ground truth.

The YAML frontmatter above is the machine-parseable part that `hd-*` skills read. The prose below is for humans.

## Setup notes

This file was authored 2026-04-21 after the second self-dogfood review ([`docs/knowledge/reviews/2026-04-21-harness-review.md`](docs/knowledge/reviews/2026-04-21-harness-review.md)) flagged its absence as carry-over drift from the 2026-04-20 review.

**Why not run `/hd:setup` on ourselves?** Running `/hd:setup` assumes the caller is a user-repo that wants a scaffolded harness. This repo IS the plug-in — our `skills/` and `agents/` are the shipped payload, not a scaffolded harness under `docs/`. The L2/L3 decisions would need special-case handling (`review` the shipped content, not scaffold new files), which is awkward to squeeze through the interactive walk. Authoring by hand captures intent cleanly.

## Meta-harness distinction

- `docs/context/`, `docs/knowledge/`, `docs/rubrics/` at repo root = the plug-in's **own** five-layer harness (dogfood).
- `skills/hd-setup/assets/context-skeleton/` etc. = what `/hd:setup` scaffolds into a **user's** repo.

Two different harnesses; this config tracks the meta one.

## Review cadence

- 2026-04-20: first dogfood review (overall 7.1/10).
- 2026-04-21: second review post-3n (overall 7.2/10). Staleness vs prior: ~15% overlap, fresh drift.
- Next review: ~2 weeks or after next material change (whichever first).

## Customizations

- `team_tooling` is empty despite `detect.py` flagging `analytics: [metabase]` — that's a false positive from README prose mentioning metabase as an example. Overriding here.
- `layer_decisions` reflect `review` for all 5 layers because every layer is populated by the plug-in's own payload; scaffold/create paths don't apply to a plug-in repo.

## Schema

See [skills/hd-setup/references/hd-config-schema.md](skills/hd-setup/references/hd-config-schema.md) for the full v5 schema spec.

**Don't edit `schema_version`.** Migration happens via future plug-in updates when schema bumps.
