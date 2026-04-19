# Drift detection

**Purpose:** stale-file heuristics + rule-adoption-drought signals + coexistence-drift detection. Loaded by audit workflows.

## Stale-file heuristics

A file is "stale" when:

- Not edited in the last 6 months AND not explicitly marked stable (e.g., comment `<!-- stable: yes -->` at top)
- Still referenced from live skills / AGENTS.md (not just archived)
- Contains references to versions / features / tools that have since changed

**Detection:**

```bash
# Files not touched in 180 days
find docs/context -type f -name "*.md" -mtime +180 2>/dev/null
```

**Severity:**

- Layer 1 file stale + still Tier 1 → P2 (loaded every task; high impact if outdated)
- Layer 1 file stale + Tier 3 archive → P3 (low impact; review when convenient)
- Layer 5 lesson stale → **not drift.** Lessons are append-only; they age by design. Don't flag.

**What to suggest:** "Review and either update, mark stable, or archive to Tier 3."

## Rule-adoption drought

**Signal:** ≥10 lessons sharing a canonical tag set, with 0 rule adoptions on that topic in `docs/knowledge/changelog.md`, over ≥3 months elapsed since the first matching lesson.

**Interpretation:** the team captures but doesn't compound. Lessons accumulate as a read-only archive instead of a running curriculum. Layer 5 isn't functioning.

**Detection:**

```bash
# For each unique tag across lessons:
# 1. Count lessons with that tag
# 2. Count changelog.md entries mentioning that tag or related topic
# 3. If lessons >= 10 and rule adoptions == 0 and oldest-lesson-date < 3-months-ago → drought
```

**Severity:** P2. Not structural (nothing broken), but the compounding machinery isn't running.

**What to suggest:** "Consider `/hd:maintain rule-propose <tag>` for this topic."

## Front-loaded capture

**Signal:** all or most lessons dated within a single week (or single build session).

**Interpretation:** capture happened in a burst — probably during initial harness setup — then discipline lapsed. Layer 5 needs ongoing work, not one-time setup.

**Detection:**

```bash
# Group lesson dates by week; if >80% fall in single week → front-loaded
```

**Severity:** P3. Normal at v0.MVP (initial capture); becomes P2 drift if 6+ months pass without new lessons.

## Coexistence drift

**Signal:** writes detected in paths that should be coexistence-isolated.

**Checks:**

1. `find docs/solutions -type f 2>/dev/null` returns any file → structural violation (we never write there)
2. Any external plug-in's config file at repo root was modified since last audit and last modifier was our skill → we wrote to a foreign config file (severe)
3. `hd-config.md` schema invalid per `hd-setup/references/hd-config-schema.md`
4. Bare Task calls in our skill files (grep for `Task [a-z-]+-[a-z]+\(` without a fully-qualified `<plugin>:<category>:` prefix)

**Severity:** P1 structural for all four. These are hard coexistence rules; violations break the "we can both be installed" promise.

## Rules integrity

**Checks:**

1. Every entry in `docs/knowledge/changelog.md` corresponds to a rule in `AGENTS.md` § Rules → otherwise orphan entry
2. Every rule in `AGENTS.md` § Rules links to a lesson that exists → otherwise orphan rule
3. Plan-hash field in changelog.md is filled (not `{{PLACEHOLDER}}`)
4. Source lesson files referenced in changelog.md all exist and are byte-identical to pre-adoption state (if we have a hash record)

**Severity:** P2 drift for orphans; P1 if source lesson missing (history was destroyed — sacred rule violated).

## Skill-count drift

**Signals:**

- 0 user-authored skills after 6 months of harness use → harness might be underused (P3)
- >10 user-authored skills in a plug-in that only shipped 4 starter skills → skill proliferation; question cohesion (P3)
- A user skill with SKILL.md ≤50 lines → probably undercooked (P3)

These are all low-severity — teams have valid reasons for any of these states — but audit surfaces them for review.

## Tag consistency

**Signal:** `docs/knowledge/lessons/*.md` uses close-but-not-identical tag variations.

**Example:** `button-variant` vs `button-variants` vs `btn-variant` across different lesson files.

**Detection:**

```bash
# Extract all tags; group by Levenshtein distance ≤2
```

**Severity:** P3 polish. Causes rule-detection to miss matches across variant-tagged lessons.

## Documentation-vs-reality drift

**Signal:** `AGENTS.md` references a skill/file that doesn't exist, or a rule cites a source lesson path that doesn't resolve.

**Severity:** P1 structural if skill-referenced (breaks skill discovery); P2 if rule-referenced (audit trail broken).

## See also

- [audit-criteria.md](audit-criteria.md) — priority framework + cross-cutting checks
- [bloat-detection.md](bloat-detection.md) — complementary (bloat is volume-based; drift is time- and relation-based)
- `../../hd-maintain/references/rule-adoption-criteria.md` — when drought can be addressed via rule adoption
