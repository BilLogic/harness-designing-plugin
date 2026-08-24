# voice-authoring — AGENTS.md Voice / Use case / Forbidden moves authoring

**Loaded by:** [`hd-setup/SKILL.md`](../SKILL.md) Step 4 (Layer 1) when no `voice_docs_found` from detect.py — OR when user explicitly asks to add/extend voice content.

**Why in hd-setup, not hd-design-system:** voice/tone applies to the harness agent across all work, not just design-system. It's a Tier-1 harness-wide concern.

## Pre-conditions

- Detect.py has run; `signals.voice_docs_found` is known (may be empty).
- User confirmed in Step 4 that they want to author voice content (or detect.py reported empty).

## When to skip

If `signals.voice_docs_found` is non-empty:
- Tell the user: *"Voice content already detected at: `<paths>`. Want to extend it, replace it, or skip?"*
- If user picks **skip** — do nothing, return.
- If user picks **extend** — open the first found path; offer to append the 3 sections (without overwriting existing content).
- If user picks **replace** — proceed with full authoring per below, write to the first found path.

When `voice_docs_found` is empty: ask user where to land voice content. Default to `AGENTS.md` (recommended); allow `docs/context/soul.md` or `docs/context/voice.md` as alternatives.

## The 3 batched questions

Ask all 3 in one prompt block (use `AskUserQuestion` if available, else numbered list):

### Q1 — Voice
> *"Voice — pick 3-5 adjectives that describe how this harness agent should sound. Examples:*
> *- Concise, specific, low-ceremony*
> *- Warm, encouraging, supportive*
> *- Expert, decisive, no-hedging*
> *- (Or write your own list.)"*

### Q2 — Use case
> *"Use case — what is this harness agent IS for, and what it ISN'T for? Two short bullets each."*
>
> *Example:*
> *- IS for: harness audits, scaffolding new harness layers, capturing lessons.*
> *- ISN'T for: shipping design artifacts, writing application code, modifying CI configs.*

### Q3 — Forbidden moves
> *"Forbidden moves — top 3-5 things this team's agent should never do. Imperative voice."*
>
> *Examples:*
> *- Never install packages on the user's behalf*
> *- Never silently overwrite existing harness artifacts*
> *- Never call into another plug-in's namespace*

## Insertion procedure

After collecting answers:

1. **Determine target file** (per "When to skip" above).
2. **Check for existing voice sections** in the target file — grep for `## Voice`, `## Use case`, `## Forbidden moves`. If any exist:
   - Show user the existing content
   - Ask: keep / replace / merge
3. **Determine insertion point**:
   - Anchor: existing `## Rules` section heading. Insert ABOVE it (so Voice comes before mechanical rules).
   - If no `## Rules` section, insert at end of file.
4. **Render** the 3 sections into a single block:

   ```markdown
   ## Voice

   - {{ADJECTIVE_1}}
   - {{ADJECTIVE_2}}
   - {{ADJECTIVE_3}}
   ...

   ## Use case

   - **IS for:** {{IS_FOR_BULLETS}}
   - **ISN'T for:** {{ISNT_FOR_BULLETS}}

   ## Forbidden moves

   - {{FORBIDDEN_1}}
   - {{FORBIDDEN_2}}
   ...
   ```
5. **Diff preview** before write. User confirms.
6. **Write** with regular Edit tool.
7. **Tier-1 budget check** — `wc -l <target> <product/app.md if exists>`. If combined >200, alert and offer to promote non-essential sections to Tier 2.
8. **Update detect.py output cache** so subsequent skills see the new voice doc:
   - The next detect.py run will pick up the new content via the `_VOICE_FILENAME_RE` + `_VOICE_SECTION_RE` patterns; no manual cache update needed.

## Skip detection across re-runs

If a user runs `/hd:setup` a second time:
- detect.py picks up the existing voice sections via the heading regex
- `voice_docs_found` is non-empty
- This procedure prompts "extend / replace / skip" instead of starting fresh

## Failure modes

- **Target file is read-only** — fail gracefully; tell user to set permissions and re-run
- **User cancels mid-Q1/Q2/Q3** — preserve any answered fields; ask again next time

## Source references

- Status frontmatter (related concept): [`status-frontmatter.md`](status-frontmatter.md)
- AGENTS.md.template: [`../assets/context-skeleton/AGENTS.md.template`](../assets/context-skeleton/AGENTS.md.template)
- Pattern justification: Anthropic plug-ins ship voice/tone via output styles or AGENTS.md sections; no per-repo persona files in the 13 official seeds.
