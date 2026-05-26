---
version: alpha
name: Bandit Workflow Cockpit
description: >-
  Attention-first workflow cockpit for agentic software delivery. The visual
  register is cinematic-technical: deep near-blacks with soft pools of light,
  a single saturated coral as Beacon accent, and a verdict triplet
  (green/coral/red) that names every gate's state.
colors:
  # Canvas — deep near-blacks, never pure #000
  canvas:                 "#050506"
  surface-1:              "#0a0a0c"
  surface-2:              "#101015"
  surface-3:              "#16161c"
  surface-popover:        "#1d1d24"
  surface-selected:       "#25252e"

  # Foreground — warm-tinted whites stepping down
  text-primary:           "#f5f5f7"
  text-secondary:         "#a8a8b3"
  text-tertiary:          "#5d5d68"
  text-disabled:          "#36363e"

  # Beacon coral — the only warm hue, brand signature
  primary:                "#ff7a59"
  primary-hover:          "#ffa389"
  primary-pressed:        "#e85a37"
  primary-100:            "#ffe7df"
  primary-200:            "#ffc5b3"
  primary-300:            "#ffa389"
  primary-400:            "#ff7a59"
  primary-500:            "#e85a37"
  primary-600:            "#b3401f"
  primary-700:            "#7a2a13"
  primary-on:             "#1a0a05"

  # Verdict triplet — semantic states
  state-pass:             "#7fe5b1"
  state-pass-strong:      "#3dba7d"
  state-fail:             "#ff4d4d"
  state-fail-strong:      "#c83030"
  state-progress:         "#ff7a59"

  # Beam blue — informational/link only, used sparingly
  secondary:              "#6ea8ff"
  secondary-hover:        "#9cc0ff"
  link:                   "#6ea8ff"

  # Borders — white at controlled alpha (rendered as hex on #050506 ground)
  border-subtle:          "#1a1a1c"
  border-default:         "#26262a"
  border-emphasis:        "#3a3a40"

tertiary:                 "#7fe5b1"
neutral:                  "#a8a8b3"
error:                    "#ff4d4d"

typography:
  display-hero:
    fontFamily: Instrument Sans
    fontSize: 72px
    fontWeight: 600
    lineHeight: 1.10
    letterSpacing: -0.025em
  display:
    fontFamily: Instrument Sans
    fontSize: 56px
    fontWeight: 600
    lineHeight: 1.10
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Instrument Sans
    fontSize: 40px
    fontWeight: 600
    lineHeight: 1.10
    letterSpacing: -0.025em
  headline-md:
    fontFamily: Instrument Sans
    fontSize: 30px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.012em
  headline-sm:
    fontFamily: Instrument Sans
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.012em
  title:
    fontFamily: Instrument Sans
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.012em
  subtitle:
    fontFamily: Instrument Sans
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.25
  body-lg:
    fontFamily: Instrument Sans
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.65
  body-md:
    fontFamily: Instrument Sans
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.45
  body-sm:
    fontFamily: Instrument Sans
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.45
  meta:
    fontFamily: Instrument Sans
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.45
    fontFeature: "'tnum'"
  label-caps:
    fontFamily: IBM Plex Mono
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0.08em
  mono-md:
    fontFamily: IBM Plex Mono
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.25
    fontFeature: "'tnum'"
  mono-sm:
    fontFamily: IBM Plex Mono
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.3
    fontFeature: "'tnum'"

spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  4xl: 96px
  gutter: 24px
  margin: 32px
  sidebar: 240px
  sidebar-collapsed: 56px
  toolbar-h: 52px
  row-h: 44px
  content-max: 1200px

rounded:
  none: 0
  sm: 4px
  md: 8px
  lg: 12px
  xl: 16px
  full: 9999px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-on}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: 8px 16px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-primary-pressed:
    backgroundColor: "{colors.primary-pressed}"
  button-secondary:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: 8px 16px
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.md}"
    padding: 8px 16px
  card:
    backgroundColor: "{colors.surface-1}"
    rounded: "{rounded.lg}"
    padding: 24px
  card-elevated:
    backgroundColor: "{colors.surface-2}"
    rounded: "{rounded.lg}"
    padding: 24px
  input:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: 8px 12px
    height: 36px
  chip-state-pass:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.state-pass}"
    rounded: "{rounded.sm}"
    padding: 3px 8px
    typography: "{typography.label-caps}"
  chip-state-progress:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.state-progress}"
    rounded: "{rounded.sm}"
    padding: 3px 8px
    typography: "{typography.label-caps}"
  chip-state-fail:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.state-fail}"
    rounded: "{rounded.sm}"
    padding: 3px 8px
    typography: "{typography.label-caps}"
  code-inline:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.sm}"
    padding: 2px 6px
    typography: "{typography.mono-md}"
  toolbar:
    backgroundColor: "{colors.surface-1}"
    height: 52px
  sidebar:
    backgroundColor: "{colors.surface-3}"
    width: 240px
---

# Bandit Workflow Cockpit Design System

## Overview

Bandit is the workflow improvement engine for agentic software delivery. The Workflow Cockpit surface must convey **calm, technical accountability**, never marketing exuberance. The PRD's stated mood is "attention-first cockpit with mission-control depth": deep near-blacks punctuated by soft pools of light, source-linked evidence, and guarded CLI-backed actions.

The aesthetic is **sophisticated but never cold**, drawing warmth exclusively from a single coral accent (Beacon) used as a beacon — a flare that says *something has been gated and verified*. Density skews tight (44px row heights, 240px sidebar). Surfaces are solid and matte; backdrop blur is reserved for command palettes and modal scrims. The brand voice in copy mirrors the visual one: short verbs, no clichés, evidence over assertion.

The signature surface element is the **Gate Strip** — a horizontal strip of Bandit stages and gate states that makes brief, RED evidence, implementation, review, landing, UAT, and retrospective readiness visible without making the cockpit the source of truth.

## Colors

The palette is rooted in **deep near-black neutrals**, a **single saturated coral accent (Beacon)**, and a **verdict triplet** that names states.

- **Canvas (#050506):** The canonical near-black; never pure #000. Used as the foundation for every surface; layers step up from here in ~5px luminance increments to `surface-1` through `surface-selected`.
- **Primary — Beacon coral (#FF7A59):** The single warm hue in the system. Used for the brand mark, primary CTAs, the in-progress state of any gate, focus rings, and field labels in the brief editor. Capped at ≤5% of any view's pixel budget — its scarcity is what makes it read as a beacon.
- **State pass — Verdict green (#7FE5B1):** Mint-leaning green for completed gates, passed checks, healthy canaries.
- **State fail — Halt red (#FF4D4D):** Saturated red for halts, rolled-back releases, signature verification failures.
- **State progress — Beacon coral:** The same primary; in-progress is the only state that reuses the brand color.
- **Secondary — Beam blue (#6EA8FF):** Reserved for inline links and informational chips. Never used for primary action.
- **Foreground (#F5F5F7 → #36363E):** Four-step warm-tinted greyscale for text. Primary text is near-white; metadata steps down two levels.

WCAG AA contrast is maintained on all text/background pairs. Coral on canvas reads at 4.7:1; primary text on canvas at 18.6:1.

## Typography

Type pairs **Instrument Sans** (Instrument agency, OFL) for prose and UI with **IBM Plex Mono** (IBM, OFL) for technical data. The pairing is deliberately *not* Geist/Inter/JetBrains Mono — Instrument Sans has visible humanist character (double-storey g, distinctive a, slightly condensed proportions) that reads as authored, while Plex Mono is slab-humanist with real ink traps and a different rhythm than the SF/JetBrains family that dominates dev tools.

- **Display & headlines:** Instrument Sans Semi-Bold (600), tight letter-spacing (−0.025em on display, −0.012em from `headline-md` down). Headlines never exceed 40px in the product UI.
- **Body:** Instrument Sans Regular (400) at 14px in product UI (dense, dashboard-tight). Line-height 1.45 in UI.
- **Mono:** IBM Plex Mono is **mandatory** for SHAs, issue IDs (`SMA-247`), gate names (`brief`, `tests`, `invariants`), branch names, file paths, timestamps, and numeric units (`±12 rows`, `94% kill`, `14m p50`). All numeric mono uses `tabular-nums`.
- **Label caps:** Plex Mono 11px, uppercase, letter-spacing 0.08em — used for section eyebrows, field labels in the brief editor, and the "primary · dark canvas" style annotations on preview cards.

No serif appears anywhere; a serif would soften the technical register. No third family.

## Layout

The layout follows two distinct grids:

- **Cockpit (operator UI):** A 240px persistent left sidebar (collapsible to 56px), a 52px top toolbar, fluid main content, and a 320px right rail when context is needed (operator input, gate evidence, review history, source traceability). Content is dense — 44px row heights, 16px card padding, 24px page gutter.

Spacing follows a **4px base grid** with the canonical scale: 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64 / 80 / 96. Components compose on this grid without exception. The 4px step exists for tight inline rhythm (chip padding, dot offsets); larger blocks should prefer 16/24/32.

## Elevation & Depth

Depth is achieved through a **3-layer shadow system** plus a deliberate **inner top highlight** that sells the "lit from above" feel on dark surfaces. Solid layered surfaces are the rule; backdrop blur is reserved for command palette and modal scrim.

- **`shadow-1` (resting card):** ambient + key + contact, ~12px total spread, plus `inset 0 1px 0 rgba(255,255,255,0.04)`.
- **`shadow-2` (hovered card / dropdown):** ~24px spread.
- **`shadow-3` (modal / palette):** ~48px spread plus a stronger inset highlight.
- **Glow shadows:** `shadow-glow-coral`, `shadow-glow-green`, `shadow-glow-red` — colored, soft, low-opacity rings used on state badges and active gates.

No flat-design borders-only treatment; no glass-morphism in product UI. Ambient radial-gradient glow pools (coral + cool-blue) may appear only behind large unframed cockpit surfaces at 6-14% alpha.

## Shapes

The shape language is **softly architectural** — corners are rounded just enough to feel modern without becoming consumer-friendly. The radius scale is 4 / 8 / 12 / 16 / `full`:

- **`sm` (4px):** chips, mono tokens, tight controls, status dots' container chips.
- **`md` (8px):** buttons, inputs, badges.
- **`lg` (12px):** cards, panels, the Gate Strip.
- **`xl` (16px):** modals, command palette, large hero surfaces.
- **`full`:** avatar dots, status dots, the 6px filled state indicator.

Status indicators are always **6px filled dots with a colored glow** (`box-shadow: 0 0 8px <state-50>`), never checkmarks-in-circles or icon-style affordances.

## Components

- **Buttons:**
  - *Primary* — Beacon coral fill, weight 600 text in `primary-on` (#1A0A05), soft outer glow, no scale transform on press (surface darkens by one layer step instead).
  - *Secondary* — `surface-2` fill, 1px `border-default` border.
  - *Ghost* — transparent, used only inside dense toolbars.
  - Never use ghost as primary CTA.
- **Cards:** `surface-1` background, 1px `border-default`, `rounded.lg`, `shadow-1` resting. Hover lifts to `border-emphasis` and `surface-2`; no shadow color shift.
- **Inputs:** 36px height, `surface-2` background, 1px `border-default`. Focus ring is 2px coral at 50% alpha with 2px offset; never the browser default.
- **State chips:** mono 11px uppercase, 6px filled dot + label, `rounded.sm`, color drives both the dot and the text.
- **Tables (queue, ledger):** mono content, sans headers, 44px row, 1px hover indent (1px coral left-border accent on hover).
- **Code:** inline code in `surface-2` with 1px `border-subtle`, `rounded.sm`, `2px 6px` padding. Block code in toolbar/log contexts uses `canvas` background to maximize contrast.
- **Status indicator dot:** 6px filled circle + glow shadow. The animated "in-progress" variant pulses opacity 0.55 → 1.0 over 2s with `ease-default`.
- **Gate Strip:** compact Bandit stage cells or bars in a repeat grid, each labeled with a mono caption below. Gates fill or shift state with a 320ms `ease-default` transition when evidence changes; an in-progress gate uses a 60% solid + 40% dimmed gradient with a coral glow shadow.

## Do's and Don'ts

- **Do** use Beacon coral for the single most important action per view. Never for >5% of pixels.
- **Do** render every SHA, ID, branch, gate name, file path, and number in IBM Plex Mono with `tabular-nums`.
- **Do** prefer **loud failure** copy: name the exact gate, the exact line, the exact next move. "Row count drifted by 12 on the down migration" beats "Something went wrong."
- **Do** use solid surfaces with the 3-layer shadow + inner highlight. Skip the highlight and dark cards read as flat-darker, not elevated.
- **Don't** use Inter, Geist, or JetBrains Mono — they betray the brand's deliberate distance from the dev-tool default.
- **Don't** use emoji in the product surface. Status uses dots-with-glow, not ✅.
- **Don't** introduce a second accent hue. Beam blue is for links only; warmth is coral or nothing.
- **Don't** use gradient backgrounds on cards. Gradients are reserved for ambient background light pools behind hero areas.
- **Don't** use bounce, overshoot, or spring physics in motion. The product is precise, not playful — `cubic-bezier(0.16, 1, 0.3, 1)` and ≤480ms.
- **Don't** mix stroke and filled icon styles. All icons are stroke at 1.5px, sized 16/20/24px.
- **Don't** write marketing verbs: *seamless, robust, leverage, empower, journey, magic, intelligent, smart* are forbidden in copy.
- **Don't** use rounded radii above 16px in product UI — soft pillowy shapes belong to consumer apps; Bandit is a tool.
