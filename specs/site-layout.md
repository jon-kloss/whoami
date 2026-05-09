@status(verified)
@depends-on(system)
@blocks(blog)
@blocks(projects-showcase)
@blocks(about-resume)
@blocks(contact-form)
@respec(2026-05-09): Removed dark theme/ThemeToggle/ThemeProvider. Changed layout from 68ch-constrained to full-width sections. Light-only. Inspired by visualpoet.in structure.

# Feature: Site Layout

As a visitor
I want a consistent, well-crafted layout with spacious full-width sections
So that I can navigate the site comfortably and the design feels cohesive

## Technical Context

- **Root layout**: `src/app/layout.tsx` with `<Nav>` and `<Footer>`
- **Design tokens**: CSS custom properties defined in `src/app/globals.css`, light theme only
- **Fonts**: Loaded via `next/font` (Google Fonts for Instrument Serif + JetBrains Mono) and external CSS (Fontshare for General Sans)
- **Layout**: Full-width sections with content constrained inside via page margins `clamp(1.5rem, 5vw, 6rem)` and max-width `1200px`. Prose content (blog posts, about text) capped at `68ch`.
- **Nav behavior**: Fixed position, hides on scroll down, shows on scroll up, transparent over hero, solid with backdrop blur elsewhere

## UI Design

- **Register**: brand
- **Design direction**: Full-width sections, generous whitespace, editorial typography
- **Mockup**: `specs/mockups/site-overview.html`
- **Typography**: Instrument Serif headings (weight 400, italic for accent words), General Sans body, JetBrains Mono for code/metadata
- **Color**: Forest green OKLCH committed strategy, tokens from DESIGN.md. Light theme only.
- **Layout**: Sections span full viewport width. Alternating `--bg` and `--surface` backgrounds for visual rhythm. Inner content respects page margins and max-width.
- **Motion**: Scroll reveals (fade + translate 12px), nav slide transition, hover underline animations

## Background

- Given the Next.js project is initialized with static export
- And design tokens from DESIGN.md are implemented as CSS custom properties

## Rule: Navigation is always accessible

### Scenario: Navigation renders on all pages

- Given a visitor is on any page
- When the page loads
- Then the navigation shows links to Projects, Blog, About, Resume, Contact
- And the site name "Jon Kloss" links to the home page

### Scenario: Navigation hides on scroll down

- Given a visitor is scrolling down the page
- When they scroll past 120px
- Then the navigation slides up out of view

### Scenario: Navigation shows on scroll up

- Given the navigation is hidden
- When the visitor scrolls up
- Then the navigation slides back into view
- And it has a solid background with backdrop blur

## Rule: Footer appears on all pages

### Scenario: Footer renders consistently

- Given a visitor is on any page
- When they scroll to the bottom
- Then the footer shows copyright and links to GitHub, LinkedIn, RSS

## Rule: Layout uses full-width sections

### Scenario: Sections span the full viewport

- Given a visitor is on any page with multiple sections
- When the page renders
- Then each section spans the full viewport width
- And section content is constrained by page margins and max-width
- And adjacent sections alternate between default and surface backgrounds

## Rule: Layout is responsive

### Scenario: Mobile layout adjustments

- Given a visitor is on a screen narrower than 640px
- When the page renders
- Then the navigation links have reduced spacing
- And the hero heading scales down proportionally
- And the footer stacks vertically
