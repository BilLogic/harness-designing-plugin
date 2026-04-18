---
rubric: ux-writing
name: "UX writing"
applies_to:
  - design-file
  - figma-frame
  - tsx
  - jsx
  - html
severity_defaults:
  default: p2
source:
  - pbakaus/impeccable — source/skills/impeccable/reference/ux-writing.md (button labels, error messages, empty states)
  - Fluent 2 — content guidance
---

# UX writing

Copy quality across the product. Every word earns its place; no filler, no jargon, no apology-for-its-own-sake. Voice + tone calibrated by context per [`../../hd-setup/assets/context-skeleton/design-system/foundations/content-voice.md`](../../../hd-setup/assets/context-skeleton/design-system/foundations/content-voice.md) when scaffolded.

## Criteria

### button-labels-verb-object

**Check:** button labels are verb-first, ideally verb-object. "Save draft", "Publish post", "Delete account". Generic "OK" / "Submit" / "Continue" only when the verb is clear from context.
**Default severity:** p2

**Example pass:** `Save draft` · `Publish post` · `Cancel` (universal cancel is fine).
**Example fail:** `OK` on a destructive action confirmation (user expects `Yes, delete` or similar); `Submit` on a settings-save page.

### error-messages-diagnostic

**Check:** error messages say WHAT failed + WHAT the user can do. Banned: "Something went wrong", "Oops", "Please try again" (without more info).
**Default severity:** p1

**Example pass:** "Couldn't save — your internet dropped. [Try again]" OR "This email is already registered. [Sign in instead]"
**Example fail:** "Something went wrong." OR "Error." OR "Oops! Please try again later."

### empty-states-directive

**Check:** empty states have (a) visual anchor (illustration/icon), (b) one-sentence explanation, (c) primary CTA (what to do next).
**Default severity:** p2

**Example pass:** empty-cart illustration + "Your cart is empty." + [Browse items]
**Example fail:** empty cart shows blank whitespace OR just text "No items" with no action.

### success-confirmation-specific

**Check:** success messages name what succeeded. "Draft saved" not "Saved." "Post published" not "Success."
**Default severity:** p3

**Example pass:** toast: "Settings saved." · "Order placed — confirmation sent to you@example.com."
**Example fail:** toast: "✓" alone OR "Success!" with no context.

### microcopy-uses-user-language

**Check:** field labels, helper text, tooltips use the user's vocabulary — not the implementation's. Avoid leaking technical terms when non-technical ones exist.
**Default severity:** p2

**Example pass:** "Email address" (not "User identifier"); "When should we remind you?" (not "Cron expression").
**Example fail:** "UUID" in a user-facing field label; "Invalid JSON syntax" as a form validation error.

### tone-matches-context

**Check:** error messages empathetic; success acknowledging; empty states coaching; admin terse. Tone adjusts by UI pattern per `content-voice.md`.
**Default severity:** p3

**Example pass:** celebratory success ("🎉 First post published! Share on social?"); dry admin ("3 keys rotated; next rotation: 2026-05-01").
**Example fail:** overly cheerful error ("Yay! Something broke!"); icy success ("Operation complete. Return code 0.").

### length-matches-weight

**Check:** most-important labels/messages shorter; less-important can be slightly longer. Short beats wordy almost always.
**Default severity:** p3

**Example pass:** primary CTA "Save"; secondary "Save and continue editing"; nowhere: "Click here to save your draft now."
**Example fail:** long primary CTA ("Press this button to submit your changes to the backend server"); short tertiary ("Go").

### no-anxiety-inducing-modals

**Check:** confirmation modals use calm, specific language — not "Are you sure?" existential dread. Destructive actions name the consequence.
**Default severity:** p2

**Example pass:** "Delete this project? All its data and settings will be removed." [Keep] [Delete]
**Example fail:** "Are you sure?" with OK/Cancel only — user doesn't know what "sure" means.

### no-banned-phrases

**Check:** banned copy specific to the team/product (maintained in `content-voice.md`). Common bans: "Oops!", "Something went wrong", "We're sorry for the inconvenience", "Please note that...".
**Default severity:** p2

**Example pass:** error messages specific; no "oops" anywhere; no formal apologies.
**Example fail:** "Oops! Something went wrong. We're sorry. Please try again later."

### actions-lead-with-verbs

**Check:** menu items, nav labels, and CTAs lead with verbs when describing an action. Use nouns only for destinations/categories.
**Default severity:** p3

**Example pass:** `Create project` (action); `Projects` (destination). Consistency: all actions start with verbs.
**Example fail:** mixed — "Project creation" (noun for action) next to `Create team` (verb for action). Inconsistent.

## Extending this rubric

Copy to `docs/rubrics/ux-writing-<team>.md` and:

1. Populate product-specific banned phrases
2. Add voice-attribute criteria tied to `content-voice.md`
3. Add i18n rules if localizing (message-length variance, formality levels)

## What this rubric does NOT check

- Visual treatment of copy (font, color, contrast) — see `typography.md`, `color-and-contrast.md`
- A11y semantics of copy-bearing components — see `accessibility-wcag-aa.md`
- Brand voice compliance with a brand-voice plug-in (separate scope)

## See also

- [interaction-states.md](interaction-states.md) — empty-state copy overlaps with this rubric
- [accessibility-wcag-aa.md](accessibility-wcag-aa.md) — error-message announcements for screen readers
- Impeccable — [ux-writing.md](https://github.com/pbakaus/impeccable/blob/main/source/skills/impeccable/reference/ux-writing.md)
- Fluent 2 — [fluent2.microsoft.design/content](https://fluent2.microsoft.design/content/)
