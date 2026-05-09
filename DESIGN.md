# Design

## Theme

Editorial confidence with forest green identity. Clean, spacious layout with full-width sections and generous whitespace. The signature green is deep and grounded — not bright emerald, but the dark, earthy green of old-growth trees. It appears in headings, links, interactive elements, and key moments, while tinted neutrals handle everything else. Light theme only — optimized for one context.

Scene sentence: A hiring manager opens the site on their laptop during a coffee break. The layout breathes, the typography is confident, and the green accents catch their eye without shouting. They scroll through the whole page in one sitting.

## Colors

Color strategy: **Committed** — forest green carries 30-60% of visual identity.

All values in OKLCH. Neutrals are tinted toward the brand hue (160°). Light theme only.

| Role | Token | Value | Usage |
|------|-------|-------|-------|
| Background | `--bg` | `oklch(0.97 0.005 148)` | Page background |
| Surface | `--surface` | `oklch(0.94 0.008 148)` | Alternate section backgrounds, code blocks |
| Border | `--border` | `oklch(0.88 0.01 148)` | Dividers, borders |
| Text primary | `--text` | `oklch(0.18 0.015 148)` | Body text, headings |
| Text secondary | `--text-muted` | `oklch(0.40 0.01 148)` | Captions, metadata, dates |
| Accent | `--accent` | `oklch(0.38 0.12 148)` | Links, interactive elements, brand moments |
| Accent hover | `--accent-hover` | `oklch(0.32 0.10 148)` | Hover states on accent |
| Accent surface | `--accent-surface` | `oklch(0.93 0.03 148)` | Light accent backgrounds |

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

Body line length capped at 68ch for prose content (blog posts, about text). Sections themselves go full-width.

## Layout

Full-width sections with content constrained inside. Sections alternate between `--bg` and `--surface` backgrounds for visual rhythm. Each section spans the full viewport width; inner content respects page margins.

| Token | Value | Usage |
|-------|-------|-------|
| Page margins | `clamp(1.5rem, 5vw, 6rem)` | Generous on wide, tight on mobile |
| Content max-width | `1200px` | Section content constraint |
| Prose max-width | `68ch` | Blog body, about text — reading comfort |

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

## Elevation

Minimal elevation. Editorial layouts are flat. Depth comes from spacing and typography, not shadows.

| Level | Value | Usage |
|-------|-------|-------|
| None | `none` | Default for most elements |
| Subtle | `0 1px 3px oklch(0 0 0 / 0.06)` | Cards, code blocks |
| Interactive | `0 2px 8px oklch(0 0 0 / 0.08)` | Hover states on interactive surfaces |

## Motion

Smooth and deliberate. Motion supports content hierarchy, not decoration.

| Property | Duration | Easing | Notes |
|----------|----------|--------|-------|
| Color / opacity | `150ms` | `ease-out` | Hover states |
| Transform (small) | `300ms` | `cubic-bezier(0.16, 1, 0.3, 1)` | Subtle reveals, link underlines |
| Transform (large) | `500ms` | `cubic-bezier(0.16, 1, 0.3, 1)` | Section reveals |
| Stagger delay | `75ms` | — | Between items in a list or grid |

Scroll-triggered reveals: elements fade in + translate up 16px on intersect. Once only.

Respect `prefers-reduced-motion`: disable transforms, keep opacity fades at 0ms.

## Components

### Navigation

Top navigation bar, not sidebar. Transparent over hero, solid on scroll with backdrop blur. Logo/name left, nav links right. No theme toggle.

Links use accent color on hover with a smooth underline animation (not text-decoration — use a pseudo-element or border-bottom transition).

Hide on scroll down, show on scroll up.

### Blog post cards

NOT identical card grids. Blog listing uses a stacked editorial layout: large featured post at top (full-width, large heading), remaining posts in a clean list with title + date + excerpt. No card borders, no icons.

### Project cards

Curated projects get more visual treatment than blog posts: title, one-line description, tech tags, and a link. Use accent-surface background on hover. GitHub-pulled repos get a simpler compact list treatment.

### Code blocks

Use `--surface` background with `--border` outline. No rounded corners beyond 4px.

### Contact form

Clean, minimal form with visible labels (not just placeholders). Submit button uses accent color, solid fill.

## Do's

- Use the accent forest green for interactive elements, headings, and key brand moments
- Let typography do the heavy lifting — scale contrast is the primary hierarchy tool
- Use generous negative space between sections (space-xl to space-2xl)
- Vary rhythm — alternate between dense content areas and open breathing room
- Treat blog post content like a magazine article: readable, well-spaced, typographically rich
- Use full-width sections with alternating backgrounds for visual variety

## Don'ts

- Don't use card grids with identical sizing — vary the visual weight
- Don't use more than two typefaces (heading + body) plus monospace for code
- Don't animate layout properties (width, height, top, left) — use transform and opacity
- Don't add decorative elements that don't serve content (no floating shapes, no gradient blobs)
- Don't use the accent forest green as a large background fill — it's for punctuation, not wallpaper
- Don't constrain everything to 68ch — sections go full-width, only prose needs the narrow column
