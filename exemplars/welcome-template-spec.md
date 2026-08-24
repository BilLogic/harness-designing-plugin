# `0-welcome/README.mdx` — template spec (v2)

> A factual, data-driven directory page documenting the team's design system. Sections mirror the Storybook IA (`1-foundations` / `2-styles` / `3-assets` / `4-components` / etc.) so the welcome page is the rendered map of the same tree shown in the sidebar — but with rich previews the sidebar can't surface.
>
> The MDX file ships at ~12 lines. All rendering logic lives in a `<Welcome>` React component reading from `index-manifest.json` + per-MDX frontmatter. Per-team customization happens by editing JSON and frontmatter, never by editing MDX.

---

## What changed from v1

- **No more "Directory" mega-block.** Each top-level IA folder becomes its own section on the welcome page.
- **Per-section visual representation tailored to content type.** Foundations = compact icon cards. Styles = mini live previews of actual tokens. Components = live component renders grouped by category. Patterns / Data viz / Specs = thumbnail tiles.
- **Per-section data contract.** Each block declares what manifest fields it consumes (open-design `requires:` pattern). Missing data → graceful "not yet documented" placeholder, never a render error.
- **Stable `data-hd-id`** on every block so future surgical-edit / regenerate-section tools can target sub-pieces.
- **Component category frontmatter** drives sub-grouping inside the Components block (open-design `> Category:` pattern).
- **Cross-cutting blocks (Tracker/Audit, Rules, Source of truth) stay separate** — they're not IA sections, they're meta surfaces.

---

## Page outline (top-to-bottom)

```
┌───────────────────────────────────────────────────────────────────────────┐
│ 0 · System card                       (hero, plain facts)                 │
├───────────────────────────────────────────────────────────────────────────┤
│ Status (optional)                     Tracker + Audit cards               │
│                                       (rendered only if generators ran)   │
├───────────────────────────────────────────────────────────────────────────┤
│ 1 · Foundations                       icon cards, status pills            │
├───────────────────────────────────────────────────────────────────────────┤
│ 2 · Styles                            2-column grid · mini live preview   │
│                                       per page (color · type · spacing · │
│                                       elevation · iconography)            │
├───────────────────────────────────────────────────────────────────────────┤
│ 3 · Assets                  (opt.)    thumbnail grid                      │
├───────────────────────────────────────────────────────────────────────────┤
│ 4 · Components                        live component render grid +        │
│                                       category sub-groups                 │
├───────────────────────────────────────────────────────────────────────────┤
│ 5 · Patterns                (opt.)    pattern thumbnails                  │
├───────────────────────────────────────────────────────────────────────────┤
│ 6 · Data viz                (opt.)    chart thumbnails                    │
├───────────────────────────────────────────────────────────────────────────┤
│ 7 · Specs                   (opt.)    page-spec list                      │
├───────────────────────────────────────────────────────────────────────────┤
│ Source of truth (decision)            table view · row per canonical file │
├───────────────────────────────────────────────────────────────────────────┤
│ Non-negotiable rules                  (bottom · team-authored)            │
└───────────────────────────────────────────────────────────────────────────┘
```

Optional sections (`3 · Assets`, `5 · Patterns`, `6 · Data viz`, `7 · Specs`) render only when `manifest.folders_enabled[name] === true`.

---

## Block specs (one per row)

### 0 · System card

```
┌─ data-hd-id="welcome-system-card" ──────────────────────────────────────┐
│ [PKG_NAME] · Design System Reference          Last refreshed [DATE]     │  eyebrow row · mono UPPERCASE 12px
│                                                                         │
│ [DISPLAY_TITLE]                                                         │  display H1 · 3.5rem · plain noun
│                                                                         │
│ [LEDE]                                                                  │  one factual sentence
│                                                                         │
│ ┌──────────┬───────────┬────────────┬──────────┐                        │
│ │ Stack    │ Tokens    │ Components │ Themes   │                        │  meta strip · 4 columns
│ │ [STACK]  │ [TOKENS]  │ [COUNTS]   │ [THEMES] │                        │
│ └──────────┴───────────┴────────────┴──────────┘                        │
└─────────────────────────────────────────────────────────────────────────┘
```

**Reads:** `pkg.name`, `pkg.dependencies`, `manifest.display_name?`, `manifest.lede`, `manifest.last_filled_at`, `manifest.tokens.modes`, `manifest.counts`.

**No CTA. No version pinning.**

---

### Status (optional)

```
┌─ data-hd-id="welcome-status" ───────────────────────────────────────────┐
│                                                                         │
│ ┌─ Tracker ─────────────────────────┐  ┌─ Audit ───────────────────────┐│
│ │ [FILL_RATIO]  ████████░░  60%     │  │ [TOTAL_FINDINGS] findings     ││
│ │                                   │  │   • [N] redundancies          ││
│ │ Filled       [N]                  │  │   • [N] inline values         ││
│ │ In progress  [N]                  │  │   • [N] doc fragments         ││
│ │ Empty        [N]                  │  │ Last regenerated [DATE]       ││
│ │ Last filled  [DATE]               │  │                               ││
│ │ [open Tracker.mdx →]              │  │ [open Audit.mdx →]            ││
│ └───────────────────────────────────┘  └───────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────┘
```

**Reads:** `manifest.tracker_stats?`, `audit-findings.json?`. Both optional → block hidden if neither exists. Forward-compatible: `establish` on day 1 emits welcome without this block; first `tracker` run materializes it.

---

### 1 · Foundations  *(icon cards, status pills)*

Foundation pages are conceptual — there's no live preview to surface. So the section is a clean grid of compact icon cards.

```
## 1 · Foundations                                        4/5 filled · 1 empty
┌─ data-hd-id="welcome-foundations" ──────────────────────────────────────┐
│                                                                         │
│ ┌─[icon] Principles ✅─────┐ ┌─[icon] Accessibility ✅────┐              │
│ │ [PURPOSE]                │ │ [PURPOSE]                  │              │
│ │ Last filled [DATE]       │ │ Last filled [DATE]         │              │
│ └──────────────────────────┘ └────────────────────────────┘              │
│                                                                         │
│ ┌─[icon] Voice ✅──────────┐ ┌─[icon] Layout 🟡──────────┐ ┌─[icon] T─┐  │
│ │ [PURPOSE]                │ │ [PURPOSE]                  │ │ Tokens ✅│  │
│ │ Last filled [DATE]       │ │ N todos remaining          │ │ [PURPOSE]│  │
│ └──────────────────────────┘ └────────────────────────────┘ └──────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

**Visual:** 3-column responsive grid. Each card: icon (📖 / ♿ / ✍ / 📐 / 🎨) + page title + status pill + 1-sentence purpose + last-filled date OR todo count.

**Reads:** `pages['1-foundations/*.mdx']` frontmatter (`status`, `description`, `last_filled`, `todos`).

**Click target:** `?path=/docs/1-foundations-{slug}--docs`.

---

### 2 · Styles  *(2-column grid · mini live previews per page)*

Style pages have visual content. Each card on the welcome page surfaces a **miniature live preview** of what's on the full page — so the welcome IS a preview window, not just a sitemap. **2-column grid** packs all 5 IA pages into a scannable surface.

```
## 2 · Styles                                              5/5 filled
┌─ data-hd-id="welcome-styles" ───────────────────────────────────────────┐
│                                                                         │
│ ┌─ Color ✅ ───────────────────┐  ┌─ Typography ✅ ────────────────────┐│
│ │ ┌─┬─┬─┬─┬─┬─┬─┬─┬─┬─┐        │  │ Display large                      ││
│ │ │ │ │ │ │ │ │ │ │ │ │  ← live│  │ Body                               ││
│ │ └─┴─┴─┴─┴─┴─┴─┴─┴─┴─┘  swatch│  │ Caption                            ││
│ │ [PURPOSE]                    │  │ [PURPOSE]                          ││
│ └──────────────────────────────┘  └────────────────────────────────────┘│
│                                                                         │
│ ┌─ Spacing ✅ ─────────────────┐  ┌─ Elevation ✅ ─────────────────────┐│
│ │ ▍ ▍▍ ▍▍▍ ▍▍▍▍▍ ▍▍▍▍▍▍▍▍       │  │ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐    ││
│ │ ← live bars at actual widths │  │ │ 0│ │ 1│ │ 2│ │ 3│ │ 4│ │ 5│    ││
│ │ [PURPOSE — 8-step scale]     │  │ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘    ││
│ │                              │  │ [PURPOSE — 6-level shadow scale]   ││
│ └──────────────────────────────┘  └────────────────────────────────────┘│
│                                                                         │
│ ┌─ Iconography ✅ ─────────────┐                                        │
│ │ 🏠 🔍 ☰ ⚙ ✕ ← live icons    │                                        │
│ │ [PURPOSE — 200 glyphs]       │                                        │
│ └──────────────────────────────┘                                        │
└─────────────────────────────────────────────────────────────────────────┘
```

**Visual:** 2-column responsive grid. Each card: page title + status + **inline live preview** rendering with `var(--*)` from already-loaded `tokens.css` + 1-sentence purpose. Cards stretch full-width when only one is in the row (e.g., trailing iconography card spans both columns or stays in column 1 — pick one and stick with it).

**Per-page preview component (matched by filename, can override via frontmatter):**
- `2-styles/color.mdx` → `<MiniSwatchRow tokens={['primary', 'secondary', 'destructive', ...]} />`
- `2-styles/typography.mdx` → `<MiniTypeStack tokens={['display-large', 'body', 'caption']} />`
- `2-styles/spacing.mdx` → `<MiniSpacingBars tokens={[1, 2, 3, 4, 6, 8]} />`
- `2-styles/elevation.mdx` → `<MiniElevationRow levels={[0, 1, 2, 3, 4, 5]} />`
- `2-styles/iconography.mdx` → `<MiniIconRow icons={['home', 'search', 'menu', 'settings', 'close']} />`
- override: page frontmatter `preview: SomeOtherComponent` + `preview_args: {...}`

**Reads:** `pages['2-styles/*.mdx']` frontmatter, plus the actual CSS tokens loaded by the page.

---

### 3 · Assets *(optional · thumbnail grid)*

```
## 3 · Assets                                    2/2 filled · 312 files total
┌─ data-hd-id="welcome-assets" ───────────────────────────────────────────┐
│                                                                         │
│ ┌─ Logos ✅ (4) ──────────┐ ┌─ Illustrations ✅ (47) ────────────────┐  │
│ │ [4 thumb previews]      │ │ [grid of first 8 illustrations]        │  │
│ └─────────────────────────┘ └────────────────────────────────────────┘  │
│                                                                         │
│ ┌─ Icons ✅ (243) ────────┐ ┌─ Placeholders ✅ (18) ─────────────────┐  │
│ │ [grid of first 24 icons]│ │ [grid of first 8 placeholders]         │  │
│ └─────────────────────────┘ └────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

**Visual:** 2-column grid of category cards. Each card shows a sample of actual assets (first N thumbnails) + count.

**Reads:** `manifest.folders_enabled.assets`, `pages['3-assets/*.mdx']`, asset file globs declared per page.

---

### 4 · Components  *(live grid · category sub-groups)*

The largest section. Components grouped by category (read from each component's frontmatter `category` field). Each component card shows a live render at default state.

```
## 4 · Components                              9/9 filled · 0 in progress
┌─ data-hd-id="welcome-components" ───────────────────────────────────────┐
│                                                                         │
│ ┌─ Inventory ✅ ──────────┐ ┌─ Cheat sheet ✅ ─────────┐                 │
│ │ 9 documented            │ │ Use case → component    │                 │
│ │ 6 internal-only         │ │ lookup table            │                 │
│ └─────────────────────────┘ └─────────────────────────┘                 │
│                                                                         │
│ ────────  Foundational  ────────                                        │
│ ┌─ Button ✅ ──────┐ ┌─ Link ✅ ────┐ ┌─ Icon ✅ ────┐                  │
│ │ [Default]        │ │ [Link text]  │ │ [icon glyph] │                  │
│ │ 6 variants × 4   │ │ 1 variant    │ │ 200 glyphs   │                  │
│ └──────────────────┘ └──────────────┘ └──────────────┘                  │
│                                                                         │
│ ────────  Form  ────────                                                │
│ ┌─ Input ✅ ───────┐ ┌─ Checkbox ✅ ┐ ┌─ Select 🟡 ─┐                  │
│ │ [input field]    │ │ [☑]          │ │ [dropdown]   │                  │
│ │ 1 variant        │ │ 3 sizes      │ │ 3 todos      │                  │
│ └──────────────────┘ └──────────────┘ └──────────────┘                  │
│                                                                         │
│ ────────  Display  ────────                                             │
│ ┌─ Card ✅ ────────┐ ┌─ Badge ✅ ───┐ ┌─ Avatar ✅ ──┐                  │
│ │ [card preview]   │ │ [badge]      │ │ [avatar]     │                  │
│ └──────────────────┘ └──────────────┘ └──────────────┘                  │
└─────────────────────────────────────────────────────────────────────────┘
```

**Visual:** numbered section header → 2 special cards (Inventory + Cheat sheet) → category sub-headers (`──── Form ────`) → 3-column grid of compact component preview cards.

**Per-component card:** title + status + live default-state render (200×80 fixed-height preview) + 1-line meta (e.g., "6 variants × 4 sizes" or "3 todos remaining").

**Categorization:** each `4-components/*.mdx` declares `category: Foundational | Form | Display | Navigation | Feedback | Overlay | Layout` in frontmatter. Cards subgroup under those headers in declared order. Categories not in the canonical list go under "Other".

**Live render strategy:** the welcome can't import every component directly without bloat. Three options for rendering the preview:

1. **`import.meta.glob` + dynamic component** — eager-load default-state JSX from each `*.stories.tsx`. Costly for 50-component repos.
2. **Pre-rendered sprite/screenshot** — `code-introspector` or a build hook captures a screenshot of `Default` story per component, manifest stores path. Welcome `<img>` tag.
3. **Frontmatter-declared preview** — each component MDX declares `preview: ComponentName` + `preview_args: { variant: 'default' }`; welcome lazy-imports just the component file.

Option 3 is the lightest and matches the open-design typed-inputs pattern. Default to this.

**Reads:** `components-index.json` array, plus each `4-components/*.mdx` frontmatter (`status`, `category`, `preview`, `preview_args`, variant/state counts).

---

### 5 · Patterns *(optional · pattern thumbnails)*

```
## 5 · Patterns                                            3/4 filled
┌─ data-hd-id="welcome-patterns" ─────────────────────────────────────────┐
│                                                                         │
│ ┌─ Form layout ✅ ─────┐ ┌─ Empty state ✅ ─────┐ ┌─ Modal ✅ ────────┐  │
│ │ [thumb illustration] │ │ [thumb illustration] │ │ [thumb]            │  │
│ │ [PURPOSE]            │ │ [PURPOSE]            │ │ [PURPOSE]          │  │
│ └──────────────────────┘ └──────────────────────┘ └────────────────────┘  │
│                                                                         │
│ ┌─ Onboarding 📋 ──────┐                                                │
│ │ [empty thumb]        │                                                │
│ │ Placeholder          │                                                │
│ └──────────────────────┘                                                │
└─────────────────────────────────────────────────────────────────────────┘
```

**Visual:** 3-column grid of pattern cards. Each card: thumbnail (live mini-render OR hand-illustrated SVG OR placeholder if status=`placeholder`) + title + status + 1-sentence purpose.

**Reads:** `pages['5-patterns/*.mdx']` frontmatter.

---

### 6 · Data viz *(optional · chart thumbnails)*

Same shape as Patterns but for chart components. Each card shows a miniature chart at default data.

---

### 7 · Specs *(optional · page-spec list)*

Page-level briefs (e.g., `dashboard.mdx`, `signup.mdx`) — list view, not grid. Each row: page name + last-updated + 1-line purpose + status. Higher information density than the visual sections because page specs are text-heavy.

```
## 7 · Specs                                              4/8 filled
┌─ data-hd-id="welcome-specs" ────────────────────────────────────────────┐
│                                                                         │
│ Dashboard           ✅ filled       Last [DATE]   [PURPOSE]             │
│ Signup              ✅ filled       Last [DATE]   [PURPOSE]             │
│ Settings            🟡 in-progress  3 todos       [PURPOSE]             │
│ Onboarding          📋 placeholder  —             —                     │
│ ...                                                                     │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### Source of truth  *(decision pending — keep as table or drop?)*

```
## Source of truth
┌─ data-hd-id="welcome-source-of-truth" ──────────────────────────────────┐
│                                                                         │
│ Tier  Label        Path                                Purpose           │
│ ───── ─────────── ─────────────────────────────────── ─────────────────  │
│ T1    Tokens      src/styles/tokens.css                11 paired roles. │
│ T1    Component   src/components/Button.tsx            6 variants × 4.  │
│ T1    Component   src/components/Input.tsx             Native pass-thru.│
│ T1    Component   src/components/Card.tsx              6-part comp.     │
│ T2    Stories     src/components/*.stories.tsx         8 named exports. │
│ T2    Manifest    docs/.../index-manifest.json         DS state, counts.│
│ T3    Skill       skills/hd-design-system/SKILL.md     establish, ...   │
└─────────────────────────────────────────────────────────────────────────┘
```

**Visual:** dense markdown table. Columns: Tier · Label · Path (mono-typed, click-to-open) · Purpose (1-sentence). Renders all canonical files in one scannable surface — denser than 3-column cards, easier to index.

**Reads:** `manifest.source_of_truth_paths: { tier, label, path, purpose }[]`.

**Decision pending — is this section helpful?** Arguments either way:

- **Keep:** consolidates every canonical file in one place; useful for onboarding ("where does X live?"). Per-component pages already point at their own source, but this is the single across-the-system view.
- **Drop:** redundant with the directory sections above. Per-component pages have their own SoT pointer. The system card lede already names the top 1–2 SoT paths.

My recommendation: **keep as table** for the consolidated index value. The cards-form was unnecessary; table form takes 1/3 the vertical space and indexes 2× more files.

---

### Non-negotiable rules  *(bottom of page)*

```
## Non-negotiable rules
┌─ data-hd-id="welcome-rules" ────────────────────────────────────────────┐
│                                                                         │
│  Sourced from AGENTS.md.       ① [RULE_1]                               │
│  Apply to every output.        ② [RULE_2]                               │
│                                ③ [RULE_3]                               │
│                                ④ [RULE_4]                               │
│                                ⑤ [RULE_5]                               │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Visual:** single bordered card. 2-column layout (240px intro / 1fr ordered list with colored counter circles). Sits at the bottom of the page as a quiet reminder, not as a call-to-action banner.

**Reads:** `manifest.rules: string[]`. Initial extraction from `AGENTS.md` "Forbidden moves" / "Rules" section at establish time; team edits manifest after.

---

## Granular section specs

Implementation-level detail per block. Each section: **anatomy** of repeating units · **states** the section can render · **edge cases** the composer handles · **React shape** · **visual treatment**.

---

### § System card

#### Anatomy

```
┌─ data-hd-id="welcome-system-card" ─────────────────────────────────────┐
│                                                                        │
│  EYEBROW_LEFT                                          EYEBROW_RIGHT   │  ← row 1: mono UPPERCASE 12px
│                                                                        │
│  DISPLAY_TITLE                                                         │  ← row 2: 3.5rem · 700 weight
│                                                                        │
│  LEDE                                                                  │  ← row 3: body large · max 720px
│                                                                        │
│  ┌──────────┬──────────┬──────────┬──────────┐                         │  ← row 4: meta strip
│  │ LABEL_1  │ LABEL_2  │ LABEL_3  │ LABEL_4  │                         │
│  │ VALUE_1  │ VALUE_2  │ VALUE_3  │ VALUE_4  │                         │
│  └──────────┴──────────┴──────────┴──────────┘                         │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

| Slot | Source | Format |
|---|---|---|
| `EYEBROW_LEFT` | `${pkg.name} · Design System Reference` | string · UPPERCASE letter-spaced |
| `EYEBROW_RIGHT` | `Last refreshed ${formatDate(manifest.last_filled_at)}` | string |
| `DISPLAY_TITLE` | `manifest.display_name ?? pkg.name` | string · plain noun phrase |
| `LEDE` | `manifest.lede` | 1 sentence MDX (allows inline `<code>`) |
| `LABEL_1`/`VALUE_1` | `Stack` / derived from deps (`React 18 · Vite · Tailwind v4 · OKLCH`) | string |
| `LABEL_2`/`VALUE_2` | `Tokens` / `${counts.tokens.color} role pairs · ${counts.tokens.space} spacing · ${counts.tokens.type} type` | string |
| `LABEL_3`/`VALUE_3` | `Components` / `${counts.components} documented · ${counts.internal_components} internal` | string |
| `LABEL_4`/`VALUE_4` | `Themes` / `${manifest.tokens.modes.join(' · ')}` | string |

#### Stack derivation

Deterministic mapping from `pkg.dependencies` + `devDependencies` into a short slash-separated string, in order: framework → bundler → CSS framework → token format.

| Detector signal | Output |
|---|---|
| `react@18+` present | `React 18` |
| `react@19+` present | `React 19` |
| `svelte@5+` present | `Svelte 5` |
| `vue@3+` present | `Vue 3` |
| `@angular/core` present | `Angular` |
| `lit` present | `Lit` |
| `vite` present | `· Vite` |
| `next` present | `· Next.js` |
| `webpack` present (no Vite/Next) | `· Webpack` |
| `tailwindcss@^4` present | `· Tailwind v4` |
| `tailwindcss@^3` present | `· Tailwind v3` |
| OKLCH detected in `tokens.css` | `· OKLCH` |
| HSL-only detected in `tokens.css` | `· HSL` |

Emit at most 4 segments. If no signal matched, emit raw `pkg.name`.

#### Edge cases

- `manifest.lede` missing → render `Documents the design system in this codebase.` as factual default
- `pkg.name` missing or empty → display title falls back to repo dirname
- `last_filled_at` missing → omit the right-side eyebrow entirely
- All meta strip values empty → omit the meta strip entirely (the page still works without it)
- `manifest.tokens.modes` empty array → render `Themes` value as `—` (em dash)

#### React shape

```tsx
<SystemCard
  pkgName={pkg.name}
  displayTitle={manifest.display_name ?? pkg.name}
  lastFilledAt={manifest.last_filled_at}
  lede={manifest.lede}
  stack={deriveStack(pkg)}
  tokenCounts={manifest.counts.tokens}
  componentCounts={{ documented: manifest.counts.components, internal: manifest.counts.internal_components }}
  modes={manifest.tokens.modes}
/>
```

Internally one `<header>` element with 4 child rows (eyebrow / title / lede / meta strip).

#### Visual treatment

- Container: rounded card, `var(--card)` background, optional radial-gradient overlay via `::before` (subtle)
- Padding: `4rem 3rem`
- Eyebrow: `font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted-foreground)`
- Title: `font-size: 3.5rem; font-weight: 700; letter-spacing: -0.02em; line-height: 1.1`
- Lede: `font-size: 1.125rem; max-width: 720px; color: var(--foreground)`
- Meta strip: 4-column CSS grid; each cell has bold label (uppercase 0.75rem) above value (0.875rem)

---

### § Status (Tracker + Audit)

#### Anatomy of one of two cards (Tracker)

```
┌─ Tracker ────────────────────────────────────────┐
│  📊                                              │
│                                                  │
│  FILL_RATIO_BAR  PERCENTAGE                      │
│                                                  │
│  ┌──────────────┬───────┐                        │
│  │ Filled       │ N     │                        │
│  │ In progress  │ N     │                        │
│  │ Empty        │ N     │                        │
│  └──────────────┴───────┘                        │
│                                                  │
│  Last filled DATE                                │
│                                                  │
│  Open Tracker.mdx →                              │
└──────────────────────────────────────────────────┘
```

| Slot | Source | Format |
|---|---|---|
| `FILL_RATIO_BAR` | computed `filled / total` | progress bar fill width |
| `PERCENTAGE` | `${filled}%` | string |
| Filled / In progress / Empty rows | `manifest.tracker_stats.{filled, in_progress, empty}` | numbers (counts, not percentages) |
| Last filled DATE | `manifest.tracker_stats.last` | formatted date |
| Open Tracker link | `?path=/docs/0-welcome-tracker--docs` | href |

#### Anatomy of Audit card

```
┌─ Audit ──────────────────────────────────────────┐
│  🔍                                              │
│                                                  │
│  TOTAL_FINDINGS findings                         │
│                                                  │
│  • COUNT discrepancies                           │  ← one row per finding type with non-zero count
│  • COUNT redundancies                            │
│  • COUNT inline values                           │
│  • COUNT doc fragments                           │
│  • COUNT naming inconsistencies                  │
│  • COUNT orphan tokens                           │
│                                                  │
│  Last regenerated DATE                           │
│                                                  │
│  Open Audit.mdx →                                │
└──────────────────────────────────────────────────┘
```

| Slot | Source | Format |
|---|---|---|
| `TOTAL_FINDINGS` | `audit.findings.length` | number |
| Per-type rows | `groupBy(audit.findings, 'type')` then count, sorted high-to-low | one bullet per non-zero type |
| Last regenerated | `audit.last_run` | formatted date |
| Open Audit link | `?path=/docs/0-welcome-audit--docs` | href |

#### States

| Available data | Render |
|---|---|
| Both `tracker_stats` and `audit` present | Both cards side-by-side |
| Only `tracker_stats` present | Single full-width Tracker card |
| Only `audit` present | Single full-width Audit card |
| Neither present (first establish before tracker run) | **Section omitted entirely** — no header, no empty state |

#### Edge cases

- `tracker_stats.filled + in_progress + empty === 0` (no pages tracked yet) — show "No pages tracked yet · run `/hd:design-system tracker`"
- `audit.findings.length === 0` — show "No findings · regenerate audit via `/hd:design-system establish` or `evolve`"
- Audit type with `severity: 'high'` → render that bullet bold + warning-color
- Tracker `last_filled` older than 14 days → render with `--muted-foreground` color and the word `(stale)` after the date

#### React shape

```tsx
<Status
  tracker={manifest.tracker_stats}     // optional
  audit={audit}                        // optional
/>
```

Internally `<section data-hd-id="welcome-status">` containing a 2-column grid of `<TrackerCard>` and `<AuditCard>`. Either card can be hidden via prop.

#### Visual treatment

- Each card: 1px outline-variant border, `var(--card)` background, `var(--radius)` corners, 1.5rem padding
- Emoji icon: 1.5rem, top-left
- Fill ratio bar: 0.5rem tall, `var(--primary)` fill on `var(--secondary)` track
- Tabular rows: 2-column grid, label left-aligned, count right-aligned mono

---

### § 1 · Foundations  *(icon cards)*

#### Anatomy of one card

```
┌─[ICON] [TITLE]                          [STATUS_PILL] ┐
│                                                       │
│ [PURPOSE]                                             │
│                                                       │
│ [META_LINE]                                           │
└───────────────────────────────────────────────────────┘
```

| Slot | Source | Format |
|---|---|---|
| `ICON` | filename → emoji map | char |
| `TITLE` | filename slug → Title Case | string |
| `STATUS_PILL` | frontmatter `status` field | enum |
| `PURPOSE` | frontmatter `description` field, fallback first paragraph (≤120 chars) | string |
| `META_LINE` | varies by status — see States | string |

#### Filename → icon map

| File | Icon | Title fallback |
|---|---|---|
| `principles.mdx` | 📖 | Principles |
| `accessibility.mdx` | ♿ | Accessibility |
| `voice.mdx` / `content-voice.mdx` | ✍ | Voice |
| `layout.mdx` | 📐 | Layout |
| `tokens.mdx` | 🎨 | Tokens |
| (any other) | 📄 | filename → Title Case |

Map can be overridden per-page via frontmatter `icon: 🛡` (single emoji string).

#### States

| Status | Pill | Card opacity | META_LINE |
|---|---|---|---|
| `filled` | ✅ green | 1.0 | `Last filled YYYY-MM-DD` |
| `in-progress` | 🟡 amber | 1.0 | `${todos} todos remaining` |
| `placeholder` | 📋 neutral | 0.7 | `Placeholder — run /hd:design-system establish` |
| `empty` | ⬜ neutral | 0.5 | `Empty` |
| (status missing) | ⬜ neutral | 0.5 | `Status not declared` |

#### Edge cases

- Card title overflow → truncate at 24 chars with ellipsis; full title in tooltip
- `description` missing AND first paragraph empty → show "No description authored"
- Page in `1-foundations/` directory but in `manifest.folders_enabled.foundations === false` — should never happen; if it does, page is hidden from welcome but Storybook sidebar still shows it

#### React shape

```tsx
<FoundationsSection pages={pagesInFoundations}>
  {pages.map(p => <FoundationCard key={p.path} page={p} />)}
</FoundationsSection>
```

`<FoundationCard>` props: `{ page: { path, frontmatter, content } }`. Click target: `?path=/docs/1-foundations-${slug(filename)}--docs`.

#### Visual treatment

- Container: `display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 0.75rem`
- Card: 1px outline-variant border, 0.75rem padding, `--radius` corners
- Icon: 1.5rem, fixed-width
- Title: 1rem · 600 weight
- Pill: 0.6875rem · color-coded
- Hover: `transform: translateY(-2px); box-shadow: var(--shadow-sm)`

---

### § 2 · Styles  *(2-col grid · live previews)*

#### Anatomy of one card

```
┌─ [TITLE]                                [STATUS_PILL] ┐
│                                                       │
│ ┌─────────────────────────────────────────────┐       │
│ │                                             │       │  ← preview pane (140px tall)
│ │ <PreviewComponent /> rendered here          │       │
│ │                                             │       │
│ └─────────────────────────────────────────────┘       │
│                                                       │
│ [PURPOSE]                                             │
│                                                       │
│ [META_LINE]                                           │
└───────────────────────────────────────────────────────┘
```

| Slot | Source | Format |
|---|---|---|
| `TITLE` | filename → Title Case | string |
| `STATUS_PILL` | frontmatter `status` | enum |
| `<PreviewComponent />` | filename match by default, frontmatter `preview` override | React |
| `PURPOSE` | frontmatter `description` | string |
| `META_LINE` | varies by page — see Per-page meta | string |

#### Filename → preview component (default)

| File | Preview component | Default args |
|---|---|---|
| `color.mdx` | `<MiniSwatchRow>` | `tokens: ['primary', 'secondary', 'destructive', 'muted', 'accent', 'border']` (auto-detected from `:root`, capped at 10) |
| `typography.mdx` | `<MiniTypeStack>` | `tokens: ['display-large', 'body', 'caption']` (or first 3 size tokens detected) |
| `spacing.mdx` | `<MiniSpacingBars>` | `tokens: [1, 2, 3, 4, 6, 8]` (or first 6 numeric tokens) |
| `elevation.mdx` | `<MiniElevationRow>` | `levels: [0, 1, 2, 3, 4, 5]` (or all detected) |
| `iconography.mdx` | `<MiniIconRow>` | `icons: ['home', 'search', 'menu', 'settings', 'close']` |
| (any other) | `<MiniGenericPreview>` | falls back to first paragraph rendered as styled prose |

Override: page frontmatter `preview: ComponentName` + `preview_args: {...}`.

#### Per-page META_LINE

| Page | META_LINE |
|---|---|
| `color.mdx` | `${count} role pairs · ${modes.join(' · ')}` |
| `typography.mdx` | `${size_count} sizes · ${weight_count} weights` |
| `spacing.mdx` | `${steps_count}-step scale · ${base_unit}px base` |
| `elevation.mdx` | `${level_count} levels` |
| `iconography.mdx` | `${glyph_count} glyphs` |

All counts derived from `manifest.counts` (written by establish/evolve).

#### States

Same as Foundations (filled / in-progress / placeholder / empty), with one addition: when `status === 'empty'`, the preview pane renders a placeholder skeleton rather than actual tokens.

#### Edge cases

- Preview component throws (missing tokens in CSS) → catch, render "Preview unavailable — token category not detected" placeholder
- `<MiniSwatchRow>` with 0 detected tokens → render dashed-border empty box with "No `--color-*` tokens detected"
- `iconography.mdx` enabled but no icon library installed → render text "Icons not yet wired"
- Single-card row (e.g., only iconography enabled) — card spans col 1, col 2 empty
- Style folder enabled but 0 pages exist — section omitted entirely

#### React shape

```tsx
<StylesSection pages={pagesInStyles}>
  {pages.map(p => <StyleCard key={p.path} page={p} preview={resolvePreview(p)} />)}
</StylesSection>
```

`resolvePreview(page)` → returns `{ Component, args }` from filename match or frontmatter override.

#### Visual treatment

- Container: `display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem`
- Card: 1px outline-variant border, 1rem padding, `--radius` corners, full height
- Preview pane: 140px tall, `var(--muted)/0.3` background, 0.5rem padding, inset border
- Title row: title left, pill right, baseline-aligned
- Hover: same lift as Foundations

---

### § 3 · Assets *(optional · thumbnail grid)*

#### Anatomy of one card

```
┌─ [TYPE_TITLE]                            [STATUS_PILL] ┐
│ ([COUNT])                                              │
│                                                        │
│ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐                │  ← thumbnail grid
│ │  │ │  │ │  │ │  │ │  │ │  │ │  │ │  │                │
│ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘                │
│                                                        │
│ [PURPOSE]                                              │
└────────────────────────────────────────────────────────┘
```

| Slot | Source | Format |
|---|---|---|
| `TYPE_TITLE` | filename → Title Case (`logos.mdx` → `Logos`) | string |
| `COUNT` | filesystem scan of `3-assets/<type>/` | number |
| Thumbnails | first N (default 8) files in dir, fetched via Vite asset import | `<img>` |
| `PURPOSE` | frontmatter `description` | string |

#### States

Same status enum. When `empty`, render a single dashed-border tile with "Drop assets in `3-assets/<type>/` to populate".

#### Edge cases

- Asset folder enabled but no asset types declared (no MDX in `3-assets/`) — section omitted
- Asset type with 0 files — placeholder tile only
- Asset count > 100 — show first 8 thumbnails + `+ ${count - 8} more` link
- File format not renderable (`.fig`, `.sketch`, `.psd`) — show file-type icon instead of preview, with extension label
- Vite asset import fails (file not found, permission) — show broken-thumb icon, log warning

#### React shape

```tsx
<AssetsSection pages={pagesInAssets}>
  {pages.map(p => <AssetCard key={p.path} page={p} thumbnails={loadAssets(p.frontmatter.dir)} />)}
</AssetsSection>
```

`loadAssets(dir)` uses `import.meta.glob('/3-assets/**/*', { eager: false })` and returns first 8 file URLs.

#### Visual treatment

- Container: `grid-template-columns: repeat(2, 1fr); gap: 1rem`
- Thumbnail grid inside card: `display: grid; grid-template-columns: repeat(8, 1fr); gap: 0.25rem`
- Each thumbnail: 1:1 aspect ratio, `object-fit: contain`, 1px border

---

### § 4 · Components  *(category-grouped grid)*

#### Anatomy of one component card

```
┌─ [NAME]                                  [STATUS_PILL] ┐
│                                                        │
│ ┌────────────────────────────────────────────┐         │
│ │                                            │         │  ← live preview
│ │  <Component {...preview_args} />           │         │     (default state)
│ │                                            │         │     (200×80 fixed)
│ └────────────────────────────────────────────┘         │
│                                                        │
│ [META_LINE]                                            │
└────────────────────────────────────────────────────────┘
```

| Slot | Source | Format |
|---|---|---|
| `NAME` | `components-index.json[i].name` | string |
| `STATUS_PILL` | `components-index.json[i].status` | enum |
| Live preview | frontmatter `preview: ComponentName` + `preview_args: {...}`, lazy-imported | React render |
| `META_LINE` | `${variants} variants · ${states} states` from frontmatter, or fallback `${todos} todos remaining` for in-progress | string |

#### Anatomy of category sub-header

```
──────────  [CATEGORY_NAME]  ──────────
```

Plain horizontal-rule-with-label. No card chrome.

#### Anatomy of inventory + cheat-sheet special cards (top of section)

```
┌─ Inventory ✅ ────────────┐ ┌─ Cheat sheet ✅ ──────────┐
│                           │ │                           │
│ ${total} documented       │ │ Use case → component      │
│ ${internal} internal-only │ │ lookup table              │
│                           │ │                           │
│ Open inventory →          │ │ Open cheat sheet →        │
└───────────────────────────┘ └───────────────────────────┘
```

These are pinned at the top of the Components section, before any category. Always render if `4-components/inventory.mdx` and `4-components/cheat-sheet.mdx` exist.

#### Categorization rules

Component cards group under `category` frontmatter values, in this canonical order:

1. Foundational
2. Form
3. Display
4. Navigation
5. Feedback
6. Overlay
7. Layout
8. Other (catch-all for unknown / missing categories)

Within each category, components sort alphabetically by name.

If a category has 0 components, its sub-header is omitted.

#### States

| Component status | Card render | Preview render |
|---|---|---|
| `filled` | full card, ✅ pill | live default-state component |
| `in-progress` | full card, 🟡 pill | live default-state component (if it renders) OR placeholder |
| `placeholder` | dimmed card, 📋 pill | dashed-border "Not yet authored" box |
| `empty` | dimmed card, ⬜ pill | empty preview pane |

#### Edge cases

- Component with no `preview` frontmatter — show name + status only, no live preview
- Component preview throws — catch error, show "Preview unavailable" + open-page link
- Component imports another component lazily that's not yet authored — same handling
- Component category missing or unknown → bucketed into "Other"
- Component count = 0 (manifest enables but no components-index entries) — section shows only the Inventory + Cheat sheet special cards, with placeholder "No components documented yet"
- Section reaches >50 components — performance: lazy-import previews on viewport intersection

#### React shape

```tsx
<ComponentsSection components={componentsIndex} pages={pagesInComponents}>
  <SpecialCards inventory={...} cheatSheet={...} />
  {orderedCategories.map(cat => (
    <CategoryGroup key={cat} name={cat}>
      {componentsByCategory[cat].map(c => <ComponentCard key={c.name} component={c} page={pageFor(c)} />)}
    </CategoryGroup>
  ))}
</ComponentsSection>
```

`<ComponentCard>` does the lazy import: `const Component = lazy(() => import(component.path));`.

#### Visual treatment

- Special cards row: 2-column grid, larger card chrome than component cards
- Category sub-header: `text-transform: uppercase; letter-spacing: 0.08em; font-size: 0.75rem` + horizontal rule on each side via `::before` / `::after` pseudo-elements
- Component grid: `grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 0.75rem`
- Component card: smaller padding (0.75rem), 200×80 preview pane, single-line meta

---

### § 5 · Patterns *(optional · pattern thumbnails)*

#### Anatomy of one card

```
┌─ [NAME]                                  [STATUS_PILL] ┐
│                                                        │
│ ┌────────────────────────────────────────────┐         │
│ │                                            │         │  ← thumbnail
│ │  Mini mockup OR illustration OR placeholder│         │     (16:9 aspect)
│ └────────────────────────────────────────────┘         │
│                                                        │
│ [PURPOSE]                                              │
└────────────────────────────────────────────────────────┘
```

| Slot | Source | Format |
|---|---|---|
| `NAME` | filename → Title Case | string |
| `STATUS_PILL` | frontmatter `status` | enum |
| Thumbnail | frontmatter `thumbnail: '../thumbs/form-layout.svg'` (relative path) OR auto-generated screenshot OR placeholder | `<img>` or `<svg>` |
| `PURPOSE` | frontmatter `description` | string |

Patterns are usually composite UIs (form layout, empty state, modal). Live miniature renders are expensive; prefer hand-drawn SVGs or pre-captured screenshots referenced by frontmatter.

#### States

Same status enum. Placeholder pattern shows greyed wireframe.

#### Edge cases

- No `thumbnail` frontmatter → fall back to placeholder wireframe SVG bundled with the welcome
- Pattern marked `status: filled` but no thumbnail provided → render a "thumbnail missing — see /hd:design-system audit" warning border

#### React shape

```tsx
<PatternsSection pages={pagesInPatterns}>
  {pages.map(p => <PatternCard key={p.path} page={p} />)}
</PatternsSection>
```

#### Visual treatment

- Container: `grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1rem`
- Thumbnail: 16:9 aspect ratio, `object-fit: cover`, `var(--muted)/0.3` background

---

### § 6 · Data viz *(optional · chart thumbnails)*

Same shape as Patterns. Each card shows a miniature chart at sample data.

#### Per-chart thumbnail strategy

| Page | Default thumbnail |
|---|---|
| `bar-chart.mdx` | live mini bar chart with random data |
| `line-chart.mdx` | live mini line chart |
| `pie-chart.mdx` | live mini pie chart |
| (any) | falls back to wireframe placeholder |

Each chart frontmatter declares `chart: BarChart` + `chart_args: { data: [...] }` for the welcome's mini render.

---

### § 7 · Specs *(optional · list view)*

#### Anatomy of one row

```
[NAME]              [STATUS_PILL]   Last [DATE]   [PURPOSE_TRUNC]
```

Specs are page-level briefs (e.g., `dashboard.mdx`, `signup.mdx`). They're text-heavy and don't benefit from visual previews. List rows are denser than grid cards.

| Slot | Source | Format |
|---|---|---|
| `NAME` | filename → Title Case | string |
| `STATUS_PILL` | frontmatter `status` | enum |
| `DATE` | frontmatter `last_filled` | formatted |
| `PURPOSE_TRUNC` | frontmatter `description` truncated to 80 chars | string |

#### Edge cases

- 0 specs → section omitted
- 50+ specs → render only first 20, link to `?path=/docs/7-specs-inventory--docs` for full list

#### React shape

```tsx
<SpecsSection pages={pagesInSpecs}>
  {pages.slice(0, 20).map(p => <SpecRow key={p.path} page={p} />)}
  {pages.length > 20 && <SpecRow summary={`+ ${pages.length - 20} more`} href="?path=/docs/7-specs-inventory--docs" />}
</SpecsSection>
```

#### Visual treatment

- Container: `<dl>` or table with row borders
- Row: 4-column grid (name auto · pill 80px · date 120px · purpose 1fr)

---

### § Source of truth  *(table view)*

#### Anatomy of one row

```
[TIER]   [LABEL]      [PATH]                              [PURPOSE]
```

| Slot | Source | Format |
|---|---|---|
| `TIER` | `paths[i].tier` | `T1` / `T2` / `T3` styled tier badge |
| `LABEL` | `paths[i].label` | string |
| `PATH` | `paths[i].path` | mono · click-to-open (`vscode://file/${PATH}` or GitHub URL) |
| `PURPOSE` | `paths[i].purpose` | 1-sentence string |

#### Tier conventions

| Tier | Meaning | Examples |
|---|---|---|
| T1 | Canonical source — modify with intent | `tokens.css`, `Button.tsx`, `Card.tsx` |
| T2 | Generated / aggregated — refresh via tooling | `index-manifest.json`, `components-index.json`, `*.stories.tsx` |
| T3 | Harness — the system that maintains the docs | `skills/hd-design-system/SKILL.md`, hooks |

#### Sort order

Rows sorted by tier (T1 → T2 → T3), then by `label` alphabetically within tier.

#### Edge cases

- 0 paths declared → section shows "No source-of-truth paths declared yet" with a link to `/hd:design-system establish` to populate
- Single-tier list (only T1) → tier column rendered as label, no badge styling
- Long path overflow → truncate at 60 chars with ellipsis; full path in tooltip
- Path doesn't exist on disk → render row with strikethrough + `(missing)` indicator (validated at build time via `import.meta.glob`)

#### React shape

```tsx
<SourceOfTruth paths={manifest.source_of_truth_paths}>
  <thead><tr><th>Tier</th><th>Label</th><th>Path</th><th>Purpose</th></tr></thead>
  <tbody>
    {sortedPaths.map(p => <SoTRow key={p.path} {...p} />)}
  </tbody>
</SourceOfTruth>
```

`<SoTRow>` renders as `<tr>` with click handler opening path.

#### Visual treatment

- Container: full-width table, no outer card chrome (rows ARE the chrome)
- Header row: `var(--muted-foreground)` text, `text-transform: uppercase`, `font-size: 0.75rem`, `letter-spacing: 0.08em`, bottom 1px outline-variant
- Tier badge: 32px × 22px rounded rect, `T1`/`T2`/`T3` text, color-coded (T1 primary, T2 muted, T3 accent)
- Path cell: `font-family: var(--font-mono)`, `color: var(--primary)`, hover underline
- Purpose cell: `color: var(--muted-foreground)`

---

### § Non-negotiable rules  *(bottom)*

#### Anatomy

```
┌─ data-hd-id="welcome-rules" ─────────────────────────────────────────┐
│                                                                      │
│  Sourced from AGENTS.md.    ① RULE_1                                 │
│  Apply to every output.     ② RULE_2                                 │
│                             ③ RULE_3                                 │
│                             ④ RULE_4                                 │
│                             ⑤ RULE_5                                 │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

| Slot | Source | Format |
|---|---|---|
| Intro line | hardcoded in `<RulesPanel>` | "Sourced from AGENTS.md. Apply to every output." |
| Rule list | `manifest.rules: string[]` | each rule = MDX (allows inline `<code>`) |
| Counter | CSS `counter-increment` | colored circle with number |

#### Rule string format

Each rule is a complete sentence with a **bold lead** + clause:

> `**Tokens always.** Never hardcode hex, px, or shadow values.`

The bold lead is the "shorthand" — a 1-3 word imperative. The clause expands. Rules render as MDX so they can include inline `<code>` for token names or paths.

#### States

| Rules count | Render |
|---|---|
| 5 (recommended) | full panel, 5 numbered rules |
| 1-4 | full panel, fewer numbered rules |
| 0 | placeholder card "No rules declared yet — extract from AGENTS.md or author in `index-manifest.json:rules`" |
| >8 | warn at build time; only first 8 render |

#### Edge cases

- Rule string very long (>200 chars) → render at half size, `font-size: 0.875rem`, with break-word
- Rule with no bold lead — render as plain prose without the visual emphasis

#### React shape

```tsx
<RulesPanel rules={manifest.rules}>
  <Intro>Sourced from AGENTS.md. Apply to every output.</Intro>
  <ol>
    {rules.map((r, i) => <Rule key={i} index={i + 1} markdown={r} />)}
  </ol>
</RulesPanel>
```

#### Visual treatment

- Container: 1px outline-variant border, `var(--card)` background, `--radius` corners, 2rem padding
- Layout: `display: grid; grid-template-columns: 240px 1fr; gap: 2rem`
- Counter circles: `::before` + `counter-increment`, 1.5rem diameter, `var(--primary)` fill, white number
- Rule text: 1rem · 1.6 line-height
- Bold lead: `font-weight: 600`

---

## Per-section data contract (open-design `requires:` pattern)

Each block declares its data needs. Composer renders graceful "not yet documented" placeholder when required data is missing.

```yaml
# In each section's React component:
SystemCard.requires:
  - pkg.name
  - manifest.display_name?
  - manifest.lede
  - manifest.last_filled_at
  - manifest.tokens.modes
  - manifest.counts

Status.requires:
  - manifest.tracker_stats?     # block hidden if all undefined
  - audit-findings.json?

RulesPanel.requires:
  - manifest.rules               # 1+ entries; "no rules yet" placeholder if empty

FoundationsSection.requires:
  - manifest.folders_enabled.foundations === true
  - pages['1-foundations/*.mdx'] glob

StylesSection.requires:
  - manifest.folders_enabled.styles === true
  - pages['2-styles/*.mdx'] glob
  - tokens.css loaded in document (transitive — preview.ts imports it)

AssetsSection.requires:
  - manifest.folders_enabled.assets === true   # else section omitted entirely
  - pages['3-assets/*.mdx'] glob

ComponentsSection.requires:
  - manifest.folders_enabled.components === true
  - components-index.json
  - pages['4-components/*.mdx'] glob with frontmatter.category

PatternsSection.requires:
  - manifest.folders_enabled.patterns === true
  - pages['5-patterns/*.mdx'] glob

DataVizSection.requires:
  - manifest.folders_enabled.data_viz === true
  - pages['6-data-viz/*.mdx'] glob

SpecsSection.requires:
  - manifest.folders_enabled.specs === true
  - pages['7-specs/*.mdx'] glob

SourceOfTruth.requires:
  - manifest.source_of_truth_paths

RulesPanel.requires:
  - manifest.rules               # 1+ entries; "no rules yet" placeholder if empty
```

---

## Data flow — what's adaptive vs authored

| Element | Source | Type |
|---|---|---|
| `[PKG_NAME]` | `package.json:name` | Adaptive |
| `[DATE]` (last refreshed) | `index-manifest.json:last_filled_at` | Adaptive (auto-set by establish/evolve) |
| `[DISPLAY_TITLE]` | `manifest.display_name` (defaults to `pkg.name`) | Authored once, override via manifest |
| `[LEDE]` | `manifest.lede` | **Authored once** (1 sentence, factual) |
| `[STACK]` | derived from `pkg.dependencies` + `pkg.devDependencies` | Adaptive |
| `[TOKENS]` count | `manifest.counts.tokens` | Adaptive |
| `[COMP_COUNT]` | `components-index.json:length` + status breakdown | Adaptive |
| `[THEMES]` | `manifest.tokens.modes` (auto-detected from CSS) | Adaptive |
| Section list rendered | `manifest.folders_enabled` | Adaptive |
| Section fill ratio | aggregated from per-page `status` frontmatter | Adaptive |
| Per-card title | filename → human (`button.mdx` → `Button`) | Adaptive |
| Per-card status pill | each MDX's frontmatter `status` | Adaptive |
| Per-card purpose | each MDX's frontmatter `description` | Adaptive |
| Per-style preview | filename → matched preview component, frontmatter override | Adaptive (with override) |
| Per-component preview | frontmatter `preview: ComponentName` + `preview_args` | Adaptive |
| Per-component category | frontmatter `category` (Foundational/Form/Display/...) | Adaptive |
| Asset thumbnails | filesystem scan of `3-assets/<type>/` | Adaptive |
| Pattern thumbnails | per-page hand-mapped to `<MiniMockup variant=...>` or asset path | Adaptive (with mapping override) |
| `[RULE_N]` | `manifest.rules` array (extracted from AGENTS.md at establish time) | Adaptive (initial) + Authored (override) |
| Source-of-truth cards | `manifest.source_of_truth_paths` | Adaptive |
| Tracker stats | `manifest.tracker_stats` (written by `generate-tracker.mjs`) | Adaptive |
| Audit counts | `audit-findings.json` aggregated | Adaptive |

**Authored ONCE per repo (at establish time, edit in manifest later):**
- `display_name` (optional override of `pkg.name`)
- `lede` — 1 factual sentence
- `rules` array (extracted from AGENTS.md, edit-friendly)
- `source_of_truth_paths` array (key files to surface)

**Authored at page level (per MDX frontmatter):**
- `status` — empty / placeholder / in-progress / filled
- `description` — 1-sentence purpose
- `category` (components only) — Foundational / Form / Display / Navigation / Feedback / Overlay / Layout
- `preview` (style and component pages, optional) — preview component override
- `preview_args` (optional)

**Everything else: derived from data sources.** No hardcoded counts, theme names, framework labels, or component lists.

---

## Required inputs (data contract)

### `package.json`

Standard. Read for: `name`, `version`, `dependencies`, `devDependencies`.

### `docs/context/design-system/index-manifest.json`

```json
{
  "spec_version": "1",
  "scenario": "code-only",
  "display_name": "Keystone Design System",
  "lede": "Documents the design system in this codebase. Source of truth: src/styles/tokens.css and src/lib/components/.",
  "last_filled_at": "2026-05-07T14:00:00Z",

  "tokens": {
    "tiers": ["primitive", "semantic"],
    "modes": ["light", "dark"],
    "brands": ["default"],
    "source_of_truth": "src/styles/tokens.css"
  },

  "folders_enabled": {
    "foundations": true,
    "styles": true,
    "assets": false,
    "components": true,
    "patterns": false,
    "data_viz": false,
    "specs": false
  },

  "counts": {
    "tokens": { "color": 11, "space": 8, "type": 8, "elevation": 0 },
    "foundation_pages": 5,
    "style_pages": 3,
    "components": 9,
    "internal_components": 6
  },

  "rules": [
    "Tokens always. Never hardcode hex, px, or shadow values.",
    "Pair, don't pick. Every fill has a `-foreground` sibling.",
    "One primary per region. Two `default` buttons in the same view is a smell.",
    "WCAG 2.1 AA. Semantic HTML, keyboard access, visible focus rings.",
    "Owned source. Components live in this repo, not node_modules."
  ],

  "source_of_truth_paths": [
    { "tier": "1", "label": "Tokens", "path": "src/styles/tokens.css", "purpose": "11 paired roles, light + dark." },
    { "tier": "1", "label": "Component", "path": "src/components/Button.tsx", "purpose": "6 variants × 4 sizes." }
  ],

  "tracker_stats": { "filled": 60, "in_progress": 22, "empty": 18, "last": "2026-05-07T14:00:00Z" }
}
```

### `docs/context/design-system/4-components/components-index.json`

```json
[
  { "name": "Button", "doc": "4-components/button.mdx", "path": "src/components/Button.tsx", "status": "filled", "category": "Foundational" },
  { "name": "Input", "doc": "4-components/input.mdx", "path": "src/components/Input.tsx", "status": "filled", "category": "Form" },
  { "name": "Card", "doc": "4-components/card.mdx", "path": "src/components/Card.tsx", "status": "filled", "category": "Display" }
]
```

### Per-MDX frontmatter

```yaml
---
status: filled                # empty | placeholder | in-progress | filled
last_filled: 2026-05-07
description: A click target with 6 variants and 4 sizes.
category: Foundational        # components only
preview: ComponentSelf        # optional override (component pages); style pages match by filename
preview_args: { variant: 'default', children: 'Button' }
todos: 0
---
```

### `audit-findings.json` (cached output of `code-introspector`)

```json
{
  "last_run": "2026-05-07T14:00:00Z",
  "findings": [
    { "type": "redundancy", "severity": "medium", "subject": "...", "evidence": {...} },
    { "type": "inline-value", "severity": "low", ... }
  ]
}
```

---

## The MDX file (final shape)

`exemplars/<system>/docs/0-welcome/README.mdx` — **12 lines**, all logic in the component.

```mdx
import { Meta } from '@storybook/blocks';
import pkg from '../../package.json';
import manifest from '../index-manifest.json';
import componentsIndex from '../4-components/components-index.json';
import { Welcome } from '../_components/welcome';

<Meta title="0-welcome/Introduction" />

<Welcome
  pkg={pkg}
  manifest={manifest}
  components={componentsIndex}
  pages={import.meta.glob('../**/*.mdx', { eager: true })}
  audit={import.meta.glob('../audit-findings.json', { eager: true, query: '?json', import: 'default' })?.['../audit-findings.json']}
/>
```

---

## The `<Welcome>` component contract

`exemplars/<system>/_components/welcome.tsx`:

```tsx
type WelcomeProps = {
  pkg: PackageJson;
  manifest: ManifestSchema;
  components: ComponentEntry[];
  pages: Record<string, { default: any; frontmatter?: PageFrontmatter }>;
  audit?: AuditFindings;
};

export function Welcome(props: WelcomeProps) {
  const f = props.manifest.folders_enabled;
  return (
    <div className="hd-welcome">
      <SystemCard {...props} />
      <Status manifest={props.manifest} audit={props.audit} />

      {f.foundations && <FoundationsSection pages={filterByPath(props.pages, '1-foundations/')} />}
      {f.styles      && <StylesSection      pages={filterByPath(props.pages, '2-styles/')} />}
      {f.assets      && <AssetsSection      pages={filterByPath(props.pages, '3-assets/')} />}
      {f.components  && <ComponentsSection  components={props.components} pages={filterByPath(props.pages, '4-components/')} />}
      {f.patterns    && <PatternsSection    pages={filterByPath(props.pages, '5-patterns/')} />}
      {f.data_viz    && <DataVizSection     pages={filterByPath(props.pages, '6-data-viz/')} />}
      {f.specs       && <SpecsSection       pages={filterByPath(props.pages, '7-specs/')} />}

      <SourceOfTruth paths={props.manifest.source_of_truth_paths} />
      <RulesPanel rules={props.manifest.rules} />
    </div>
  );
}
```

Each sub-component renders its block from typed inputs. No per-team customization required beyond manifest + frontmatter.

---

## What ships when establish runs

In a team's repo, `/hd:design-system establish` writes:

1. `docs/context/design-system/_components/welcome.tsx` — the 10-sub-component bundle
2. `docs/context/design-system/_components/previews/` — `MiniSwatchRow.tsx`, `MiniTypeStack.tsx`, `MiniSpacingBars.tsx`, `MiniElevationRow.tsx`, `MiniIconRow.tsx` (style-page previews)
3. `docs/context/design-system/0-welcome/README.mdx` — the 12-line MDX
4. `docs/context/design-system/index-manifest.json` — populated from detection + 1 lede sentence + extracted rules
5. `docs/context/design-system/4-components/components-index.json` — populated from `code-introspector`

Subsequent `evolve` updates the manifest counts, components-index, and status frontmatter without touching MDX or component code.

---

## Open template decisions

1. **Component preview render strategy** — option 3 (frontmatter-declared `preview: ComponentName` + lazy import) is the lightest. Confirm.

2. **Component category default list** — `Foundational | Form | Display | Navigation | Feedback | Overlay | Layout`. Add/remove? Components without a category go under "Other".

3. **Per-style page preview mapping** — by filename match (`color.mdx` → `MiniSwatchRow`) by default, override via frontmatter. Or always require frontmatter `preview:`? Filename match is more zero-config; frontmatter-required is more explicit.

4. **Status pills — emoji or styled badges?** Emoji (✅ 🟡 📋 ⬜) is universal and renders without CSS. Styled badges are more polished but need CSS classes.

5. **Asset section thumbnail strategy** — actual file thumbnails read from disk via Vite asset import? Or screenshots captured at establish time? Asset import is live; screenshots are stable.

6. **Patterns thumbnail strategy** — same options as components: live mini-render OR pre-captured screenshot OR placeholder until filled.

7. **Section anchors** — `data-hd-id="welcome-foundations"` style. Used for future surgical-edit / regenerate-section tools (e.g., "regenerate the Components section after adding a new component"). Keep as the convention.

8. **Cross-page links via `?path=/docs/<id>--docs`** — derived from the target MDX's `<Meta title>` string by Storybook's slugifier. Hand-author hrefs in v1; validate IDs once via `npm run storybook` then commit.

---

## Adoptions from `nexu-io/open-design`

- **Layered prompt injection** — each section block declares `requires` (data needs). Composer prunes accordingly. (See "Per-section data contract" above.)
- **Typed-inputs + composer split** — agent fills manifest + frontmatter; `<Welcome>` component is the composer. (See "MDX file" above.)
- **Self-check checklist for the establish skill** — does the welcome page link every component? Every section's status fill ratio matches its frontmatter? Every source-of-truth path exists? Add to `establish` skill's "Self-check before delivering" gate.
- **`data-hd-id`** stable section anchors for surgical edits. (See block specs above.)
- **`> Category:` lightweight grouping** — applied to components via frontmatter `category` field.
- **Forward-compatible silent fallback** — sections with missing data render "not yet documented" placeholder, never crash.
- **9-section `DESIGN.md`** as a complementary repo-root document — could be added later as a flat factual mirror of the manifest. Out of scope for v1.
- **P0/P1/P2 enforcement model** — applies to `hd-review` rubrics, not the welcome template. Out of scope here.

---

## Questions for review

1. **Section-by-IA structure overall** — feel right? Any IA folder you'd merge or drop?
2. **Per-section visual representation** (Foundations = icon cards, Styles = mini live previews, Components = live grid by category, Patterns/Data viz/Specs = thumbnail tiles) — agree per type?
3. **Open decision #1** (component preview = frontmatter `preview:` field with lazy import) — agree?
4. **Open decision #3** (style-page preview = filename match by default) — agree, or always require frontmatter override?
5. **Status pills** — emoji or styled badges?
6. **Anything missing** that should be on the welcome page that I haven't included?
