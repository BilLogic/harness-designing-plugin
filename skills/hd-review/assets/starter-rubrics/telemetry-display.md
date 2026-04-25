---
rubric: telemetry-display
name: "Telemetry + real-time device display"
applies_to:
  - design-file
  - figma-frame
  - tsx
  - jsx
  - html
  - component
severity_defaults:
  default: p2
source:
  - Lightning pilot (docs/knowledge/lessons/2026-04-18-parallel-pilots-3-6-consolidated.md) — 53 binary message types, device gateway, zero starter coverage gap
  - Material Design 3 — state indicators + connectivity patterns
  - Fluent 2 — offline + reconnection design patterns
---

# Telemetry + real-time device display

Rubric for IoT, hardware dashboards, and real-time-data products. Telemetry UI carries risks that standard CRUD rubrics miss: stale data masquerading as live, silent disconnects, binary payloads shown as raw integers, and alert fatigue from undifferentiated severity. Surfaced by the lightning pilot — smart-lighting platform with 53 binary message types and a device gateway, where zero existing starter rubrics applied.

## Scope & Grounding

Grounded in the lightning pilot's 53-binary-message-type system (device gateway, zero starter coverage gap) plus Material 3 state-indicator patterns and Fluent 2 offline/reconnection guidance.

### Personas
- **Facility operator** — monitoring 400+ devices across a campus from a live dashboard. Pain: stale data rendered as live leads to acting on 10-minute-old readings.
- **On-call engineer** — gets paged by alarms; needs to distinguish critical from noise at a glance. Pain: all alerts share one red toast; critical overheating alarm vanishes in 3s during a phone call.
- **Protocol engineer** — debugging a binary message stream. Pain: raw `[3, 22, 225, 0, ...]` in the log; must decode bytes by hand against the spec.
- **Field installer** — walking the site on a laptop with flaky connectivity. Pain: websocket drops silently; numbers keep rendering; no way to know the data is cached.

### User stories
- As an **operator**, I need **every live value to show "as of <timestamp>"** so that **I can tell live from stale**.
- As an **operator**, I need **explicit offline banner + cached-data labeling** so that **dropped transports don't masquerade as live**.
- As an **on-call engineer**, I need **severity tiers (critical / warning / info) with separate acknowledge + dismiss** so that **critical alarms don't auto-dismiss**.
- As a **protocol engineer**, I need **decoded enum names + field labels with a hex toggle** so that **I'm not translating bytes by hand**.
- As a **field installer**, I need **device states (online / offline / error / unknown) distinguishable by icon + text, not color** so that **I can read status in sunlight or colorblind**.

### Realistic scenarios
- **Live device card** — "Updated 4s ago" in live state; flips to amber "Stale — 2m ago" after threshold. Why it matters: the lightning-pilot pattern surfaced this as the top coverage gap.
- **Transport drop** — "You are offline — showing data cached at 14:28. [Retry]" banner; cards render with cached ribbon. Why it matters: never silent.
- **Message log** — "Mode: HEATING (0x03) · Setpoint: 22.5°C [View hex]". Why it matters: decoded-by-default with hex opt-in.
- **Critical alarm** — red banner, persistent until acknowledged, separate [Acknowledge] and [Dismiss]. Why it matters: never auto-dismiss on timer.
- **Device map** — 400 devices cluster into ~12 numbered circles at city zoom; pin click opens side drawer keeping map visible. Why it matters: map-as-canvas pattern.

### Anti-scenarios (common failure modes)
- **Number with no timestamp** — live-looking value with no freshness marker. Symptom: user acts on yesterday's data.
- **Silent disconnect** — websocket drops; numbers keep rendering unchanged. Symptom: cached data masquerades as live.
- **Color-only device state** — red / green / gray dots with no icon or text. Symptom: colorblind users see a uniform gray blob.
- **Bare integers for enum** — `state: 3` shown raw. Symptom: operators translate bytes against a spec sheet.
- **Undifferentiated alerts** — all alarms one red toast with 3s auto-dismiss. Symptom: critical overheating alarm vanishes during a phone call.

## Criteria

### realtime-freshness-indicators

**Check:** every live-data surface shows a last-updated timestamp ("as of 14:32") AND visually degrades (stale-data badge, muted opacity, dashed border) when the last update exceeds a threshold appropriate to the signal (e.g., > 30s for occupancy sensors, > 5min for energy readings).
**Default severity:** p2

**Example pass:** device card shows "Updated 4s ago" in live state; turns amber with "Stale — last update 2m ago" badge after threshold crossed.
**Example fail:** dashboard shows a number with no timestamp; user can't tell if it's live, cached, or from yesterday.

### offline-disconnected-affordances

**Check:** when the transport (websocket, MQTT, SSE) drops, an explicit offline banner appears; cached data remains readable but is labeled "cached"; retry / reconnect affordance is visible and not buried in a settings menu.
**Default severity:** p1

**Example pass:** "You are offline — showing data cached at 14:28. [Retry]" banner across the top; device cards continue to render with "cached" ribbon.
**Example fail:** connection drops silently; stale numbers keep rendering with no visual change; user acts on 10-minute-old data.

### device-state-visualization

**Check:** four canonical device states — **online**, **offline**, **error**, **unknown** — each has a distinct visual AND an accessible label. Never rely on color alone; pair with icon + text.
**Default severity:** p1

**Example pass:** online = green dot + "Online"; offline = gray dot with slash + "Offline"; error = red triangle + "Error"; unknown = dashed circle + "Unknown". All four readable with screen reader and colorblind-safe.
**Example fail:** states differentiated only by red / green / gray dot with no icon or label; colorblind users see a uniform gray blob.

### binary-protocol-message-display

**Check:** raw binary / hex payloads have a toggle between "decoded" (human-readable enum names + field labels) and "hex" (raw bytes). Never show bare integers for enum fields (`state: 3` → show `state: HEATING (3)`).
**Default severity:** p3

**Example pass:** message log row shows "Mode: HEATING (0x03) • Setpoint: 22.5°C" with a [View hex] toggle revealing `03 16 E1 00 ...`.
**Example fail:** log row shows `[3, 22, 225, 0, ...]` — operator must translate bytes by hand.

### map-as-canvas-patterns

**Check:** when devices are placed on a map or floorplan, marker clustering activates above a threshold (typically ~50 markers in viewport); click-to-expand reveals device detail as an overlay / drawer rather than a full page navigation that loses map context.
**Default severity:** p2

**Example pass:** 400 devices cluster into ~12 numbered circles at city zoom; clicking a device pin opens a side drawer keeping the map visible.
**Example fail:** 400 individual pins overlap into an unreadable blob; clicking any pin navigates to `/devices/:id` losing the map view entirely.

### telemetry-update-choreography

**Check:** value changes animate smoothly (short tween, ≤ 200ms) rather than hard-cutting; the poll / push cycle does not cause visible flicker, layout shift, or scrollbar jitter.
**Default severity:** p3

**Example pass:** temperature reading tweens from 22.4 → 22.6 over 150ms; no other elements reflow.
**Example fail:** every 1s poll causes the entire card to re-render, flashing and briefly losing focus.

### alarm-alert-prioritization

**Check:** alerts have visible severity tiering (critical / warning / info), sound is toggleable per-user, and there is a clear distinction between **acknowledge** (I see this, keep it active) and **dismiss** (remove from view). Critical alerts never auto-dismiss on timer.
**Default severity:** p1

**Example pass:** critical alert has red banner + persistent until acknowledged; warning has amber toast with 10s timer; info has gray ticker. [Acknowledge] and [Dismiss] are separate buttons with distinct icons.
**Example fail:** all alerts share the same red toast that auto-dismisses after 3s; operator misses a critical overheating alarm because it vanished during a phone call.

## Extending this rubric

Copy to `docs/rubrics/telemetry-display-<team>.md` and:

1. Add device-class-specific criteria (e.g., "energy meters show kWh with rolling 24h sparkline")
2. Tune freshness thresholds per signal type (motion = seconds, temperature = minutes, firmware version = days)
3. Document your product's canonical alarm severity scale
4. Reference in `hd-config.md` under `critique_rubrics`

## What this rubric does NOT check

- Accessibility of state announcements to screen readers — see `accessibility-wcag-aa.md`
- Color semantics of status colors — see `color-and-contrast.md`
- General loading / empty / error / success states for non-realtime views — see `interaction-states.md`
- Backend protocol correctness, QoS guarantees, or message ordering — out of scope

## See also

- [interaction-states.md](interaction-states.md) — baseline four-state coverage (loading/empty/error/success)
- [accessibility-wcag-aa.md](accessibility-wcag-aa.md) — screen reader announcement of state changes + live regions
- [color-and-contrast.md](color-and-contrast.md) — status color semantics + colorblind safety
- Material 3 — [m3.material.io/foundations/interaction/states](https://m3.material.io/foundations/interaction/states)
- Fluent 2 — [fluent2.microsoft.design](https://fluent2.microsoft.design) offline + reconnection patterns
