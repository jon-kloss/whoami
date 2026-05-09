# Design

## Theme

Editorial confidence with forest green identity. Magazine-quality typography drives the visual hierarchy. The signature green is deep and grounded — not bright emerald, but the dark, earthy green of old-growth trees. It appears in headings, links, interactive elements, and key moments, while tinted neutrals handle everything else. Dark and light themes share the same personality; neither is default.

Scene sentence: A developer reviewing portfolio sites at their desk, bright external monitor, switching between dark mode at night and light mode during the day. The site should feel equally intentional in both.

## Colors

Color strategy: **Committed** — forest green carries 30-60% of visual identity.

All values in OKLCH. Neutrals are tinted toward the brand hue (160°).

### Light theme

| Role | Token | Value | Usage |
|------|-------|-------|-------|
| Background | `--bg` | `oklch(0.97 0.005 148)` | Page background |
| Surface | `--surface` | `oklch(0.94 0.008 148)` | Cards, code blocks, raised areas |
| Border | `--border` | `oklch(0.88 0.01 148)` | Dividers, borders |
| Text primary | `--text` | `oklch(0.18 0.015 148)` | Body text, headings |
| Text secondary | `--text-muted` | `oklch(0.40 0.01 148)` | Captions, metadata, dates |
| Accent | `--accent` | `oklch(0.38 0.12 148)` | Links, interactive elements, brand moments |
| Accent hover | `--accent-hover` | `oklch(0.32 0.10 148)` | Hover states on accent |
| Accent surface | `--accent-surface` | `oklch(0.93 0.03 148)` | Light accent backgrounds |

### Dark theme

| Role | Token | Value | Usage |
|------|-------|-------|-------|
| Background | `--bg` | `oklch(0.13 0.01 148)` | Page background |
| Surface | `--surface` | `oklch(0.18 0.015 148)` | Cards, code blocks, raised areas |
| Border | `--border` | `oklch(0.25 0.02 148)` | Dividers, borders |
| Text primary | `--text` | `oklch(0.92 0.01 148)` | Body text, headings |
| Text secondary | `--text-muted` | `oklch(0.65 0.01 148)` | Captions, metadata, dates |
| Accent | `--accent` | `oklch(0.55 0.13 148)` | Links, interactive elements, brand moments |
| Accent hover | `--accent-hover` | `oklch(0.62 0.11 148)` | Hover states on accent |
| Accent surface | `--accent-surface` | `oklch(0.22 0.04 148)` | Muted accent backgrounds |

## Typography

Editorial hierarchy with strong contrast between scale steps. Ratio ≥1.25 between steps.

| Role | Size | Weight | Font | Line height |
|------|------|--------|------|-------------|
| Display | `clamp(3rem, 5vw + 1rem, 5rem)` | 700 | Heading font | 1.05 |
| H1 | `clamp(2.25rem, 3vw + 0.5rem, 3.5rem)` | 700 | Heading font | 1.1 |
| H2 | `clamp(1.5rem, 2vw + 0.5rem, 2.25rem)` | 600 | Heading font | 1.2 |
| H3 | `1.25rem` | 600 | Heading font | 1.3 |
| Body | `1.125rem` | 400 | Body font | 1.65 |
| Small / meta | `0.875rem` | 400 | Body font | 1.5 |
| Code | `0.9375rem` | 400 | Mono font | 1.6 |

### Font direction

Choose characterful fonts — not Inter, Roboto, or system-ui defaults.

- **Headings**: A bold serif or strong geometric sans. Should feel editorial, not corporate. Consider: Instrument Serif, Fraunces, Newsreader, or a geometric sans like Clash Display or Satoshi.
- **Body**: A readable humanist sans or transitional serif for long-form blog content. Consider: Source Serif 4, Literata, or General Sans.
- **Code**: JetBrains Mono or Fira Code — ligatures optional.

Body line length capped at 68ch.

## Spacing

Vary spacing for editorial rhythm. Not a rigid 8px grid everywhere.

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `0.25rem` | Tight inline gaps |
| `--space-sm` | `0.5rem` | Between related elements |
| `--space-md` | `1rem` | Default component padding |
| `--space-lg` | `2rem` | Between sections |
| `--space-xl` | `4rem` | Major section breaks |
| `--space-2xl` | `8rem` | Page-level breathing room |

Page margins: `clamp(1.5rem, 5vw, 6rem)` — generous on wide screens, tight on mobile.

## Elevation

Minimal elevation. Editorial layouts are flat. Depth comes from spacing and typography, not shadows.

| Level | Value | Usage |
|-------|-------|-------|
| None | `none` | Default for most elements |
| Subtle | `0 1px 3px oklch(0 0 0 / 0.06)` | Cards, code blocks (light theme only) |
| Interactive | `0 2px 8px oklch(0 0 0 / 0.08)` | Hover states on interactive surfaces |

Dark theme: no shadows. Use border or surface color shifts for distinction.

## Motion

Smooth and deliberate. Motion supports content hierarchy, not decoration.

| Property | Duration | Easing | Notes |
|----------|----------|--------|-------|
| Color / opacity | `150ms` | `ease-out` | Hover states, theme transitions |
| Transform (small) | `300ms` | `cubic-bezier(0.16, 1, 0.3, 1)` | Subtle reveals, link underlines |
| Transform (large) | `500ms` | `cubic-bezier(0.16, 1, 0.3, 1)` | Page transitions, section reveals |
| Stagger delay | `75ms` | — | Between items in a list or grid |

Scroll-triggered reveals: elements fade in + translate up 16px on intersect. Once only.

Respect `prefers-reduced-motion`: disable transforms, keep opacity fades at 0ms.

## Components

### Navigation

Top navigation bar, not sidebar. Transparent over hero, solid on scroll. Logo/name left, nav links right, theme toggle at far right.

Links use accent color on hover with a smooth underline animation (not text-decoration — use a pseudo-element or border-bottom transition).

### Blog post cards

NOT identical card grids. Blog listing uses a stacked editorial layout: large featured post at top (full-width, large heading), remaining posts in a clean list with title + date + excerpt. No card borders, no icons.

### Project cards

Curated projects get more visual treatment than blog posts: title, one-line description, tech tags, and a link. Use accent-surface background on hover. GitHub-pulled repos get a simpler compact list treatment.

### Code blocks

Use `--surface` background with `--border` outline. Syntax highlighting respects the theme. No rounded corners beyond 4px.

### Contact form

Clean, minimal form with visible labels (not just placeholders). Two fields visible at a time max. Submit button uses accent color, solid fill.

## Do's

- Use the accent forest green for interactive elements, headings, and key brand moments
- Let typography do the heavy lifting — scale contrast is the primary hierarchy tool
- Use generous negative space between sections (space-xl to space-2xl)
- Vary rhythm — alternate between dense content areas and open breathing room
- Treat blog post content like a magazine article: readable, well-spaced, typographically rich

## Don'ts

- Don't use card grids with identical sizing — vary the visual weight
- Don't add shadows in dark theme — use border or surface shifts
- Don't use more than two typefaces (heading + body) plus monospace for code
- Don't animate layout properties (width, height, top, left) — use transform and opacity
- Don't add decorative elements that don't serve content (no floating shapes, no gradient blobs)
- Don't use the accent forest green as a large background fill — it's for punctuation, not wallpaper
