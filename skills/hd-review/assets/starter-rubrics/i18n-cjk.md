---
rubric: i18n-cjk
name: "Internationalization — CJK + bilingual"
applies_to:
  - design-file
  - figma-frame
  - tsx
  - jsx
  - html
  - css
severity_defaults:
  default: p2
source:
  - caricature pilot (zh-CN primary) + lightning pilot (zh-EN bilingual) — docs/knowledge/lessons/2026-04-18-parallel-pilots-3-6-consolidated.md
  - Material Design 3 — internationalization guidance
  - W3C — CSS Writing Modes + Chinese layout requirements
---

# Internationalization — CJK + bilingual

Addendum rubric for bilingual or CJK-primary products (Chinese / Japanese / Korean). Standard typography and UX-writing rubrics are English-centric and miss CJK-specific failures: wrong line-height, halfwidth commas in hanzi runs, IME composition breaking Enter-to-submit, and missing CJK font stacks. Apply this **alongside** `typography.md` and `ux-writing.md`, not instead.

## Criteria

### dual-script-line-height

**Check:** CJK text blocks use line-height ~1.75; Latin-only text uses ~1.5; mixed-script paragraphs use the CJK value (taller) to avoid cramped hanzi rendering.
**Default severity:** p2

**Example pass:** body CSS sets `line-height: 1.75` when `lang="zh"` or when paragraph contains any CJK characters; pure-English marketing page keeps 1.5.
**Example fail:** single global `line-height: 1.4` applied to all languages; Chinese paragraphs look crushed, diacritic-stacking on kanji radicals overlaps.

### mixed-script-punctuation

**Check:** Chinese / Japanese text uses fullwidth punctuation (`，。；：「」（）`) appropriate for the script; Latin runs inside CJK paragraphs keep halfwidth punctuation. No halfwidth `,` `.` `;` inside pure-Chinese sentences.
**Default severity:** p2

**Example pass:** zh-CN label reads `设备已连接，当前温度 22°C。` — fullwidth comma + period.
**Example fail:** zh-CN label reads `设备已连接, 当前温度 22°C.` — halfwidth punctuation copied from English locale file.

### cjk-ime-input-states

**Check:** input fields visually indicate IME composition (dotted / dashed underline during pending composition); candidate popup does not occlude the primary submit button; pressing Enter while composition is pending commits the character instead of submitting the form.
**Default severity:** p1

**Example pass:** textarea shows dashed underline under pending hanzi; Submit button remains visible below candidate list; Enter commits composition, second Enter submits form.
**Example fail:** Enter during composition submits a half-typed message; IME candidate list covers the [Send] button so users can't see where they're aiming.

### date-number-locale-formats

**Check:** dates, numbers, and currency render in locale-appropriate formats (zh-CN uses `YYYY年MM月DD日` or `YYYY-MM-DD`; en-US uses `MMM D, YYYY`); never bare ISO `2026-04-18T14:32:00Z` in zh-CN-primary UI.
**Default severity:** p3

**Example pass:** zh-CN timestamp reads `2026年4月18日 14:32`; en rendering of same moment reads `Apr 18, 2026, 2:32 PM`.
**Example fail:** zh-CN dashboard shows `2026-04-18T14:32:00.000Z` copied verbatim from the API.

### bilingual-register-parity

**Check:** when the same product ships in two languages, the register is consistent across locales. A UI that is formal in Chinese (您 / 请) but breezy / slangy in English ("Hey! Let's go!") confuses bilingual users and signals translation-not-localization.
**Default severity:** p2

**Example pass:** both locales adopt a calm professional register — zh uses 您, en uses "Please confirm your selection."
**Example fail:** zh copy: `请您确认所选项。` / en copy: `Yo, you sure about that?` — same button, wildly different voice.

### cjk-line-break-behavior

**Check:** hanzi runs do not break mid-word incorrectly; CSS uses `word-break: keep-all` (or equivalent) for Chinese to prevent breaking inside compound words; trailing-space handling in Chinese is intentional (no visual gap before fullwidth punctuation).
**Default severity:** p3

**Example pass:** long zh paragraph wraps at natural word boundaries; `word-break: keep-all` applied to `:lang(zh)`.
**Example fail:** browser default `word-break: break-all` splits `数据库` across lines as `数据` / `库`, destroying the compound.

### cjk-font-stack-explicit

**Check:** `font-family` declares a CJK-capable font explicitly (PingFang SC, Noto Sans CJK, Source Han Sans, Hiragino Sans) before the generic `sans-serif` fallback. Never rely on system default for CJK rendering — different OSes fall back to wildly different glyph families.
**Default severity:** p1

**Example pass:** `font-family: "Inter", "PingFang SC", "Noto Sans CJK SC", "Source Han Sans SC", sans-serif;` — explicit CJK font ordered by platform preference.
**Example fail:** `font-family: Inter, sans-serif;` — macOS renders zh as PingFang, Windows as SimSun (serif), Linux as whatever generic happens to be installed; your design looks like three different products.

## Extending this rubric

Copy to `docs/rubrics/i18n-cjk-<team>.md` and:

1. Add language-pair-specific criteria (zh-ja product needs different punctuation rules than zh-en)
2. Document your approved CJK font stack with rationale
3. Specify register + honorific policy per locale
4. Reference in `hd-config.md` under `critique_rubrics`

## What this rubric does NOT check

- General typography — see `typography.md` (apply both)
- General UX writing voice — see `ux-writing.md` (apply both)
- RTL languages (Arabic, Hebrew) — out of scope; would need a separate `i18n-rtl.md`
- Translation quality / accuracy — requires a human native-speaker review

## See also

- [typography.md](typography.md) — baseline type system (line-height rules here override the Latin defaults for CJK)
- [ux-writing.md](ux-writing.md) — voice + tone (this rubric's register-parity check complements)
- W3C — [CSS Writing Modes](https://www.w3.org/TR/css-writing-modes-3/) + [Chinese layout requirements](https://www.w3.org/TR/clreq/)
- Material 3 — [m3.material.io/foundations/design-tokens/overview](https://m3.material.io/foundations/design-tokens/overview) (i18n token patterns)
